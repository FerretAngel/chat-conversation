import { cn } from "chat-conversation-react";
import { useConversation } from "../context";
import { ChatTraversa } from "./ChatTraversa";
import { type RenderItemProps } from "./renderItem";
import { IconButton } from "../components/IconButton";
import { useState } from "react";
import { chat } from "../api";
import { faker } from "@faker-js/faker";
export interface UserRenderProps extends RenderItemProps {}

export const UserRender = ({
  content,
  meta,
  className,
  setActive,
  parentId,
}: UserRenderProps) => {
  const { chatMessage } = useConversation();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get("message") as string;
    if (message.trim() === "" || message.trim() === content.content)
      return alert("Please enter a message");
    const userMessageId = faker.string.uuid();
    const botMessageId = faker.string.uuid();
    const { updateBotContent } = chatMessage({
      userContent: {
        role: "user",
        content: message,
        time: new Date().toISOString(),
        model: "gpt-3.5-turbo",
        status: "success",
      },
      userMessageId,
      botContent: {
        role: "assistant",
        content: "",
        time: new Date().toISOString(),
        model: "gpt-3.5-turbo",
        status: "pending",
      },
      botMessageId,
      parentId: parentId || "root",
    });
    try {
      let botMessage = "";
      setLoading(true);
      await chat({
        message,
        onMessage: (message) => {
          botMessage += message;
          updateBotContent({
            content: botMessage,
          });
        },
      });
      updateBotContent({
        content: botMessage,
        status: "success",
      });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      updateBotContent({
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className={cn("rounded-2xl p-4 space-y-2", className)}>
      <header className={cn("flex items-center justify-between")}>
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 rounded-full aspect-square w-10"></div>
          <h4 className="text-sm font-bold">{content.role.toUpperCase()}</h4>
        </div>
        <ChatTraversa
          meta={meta}
          setActive={setActive}
        />
      </header>
      {!isEditing ? (
        <p className="whitespace-pre-wrap relative group">
          {content.content}
          <IconButton
            className="absolute right-2 -top-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
            icon="lucide:edit"
            onClick={() => setIsEditing(true)}
            title="edit"
          />
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2">
          <input
            type="text"
            name="message"
            className="w-full bg-neutral-50 min-h-10 rounded-md p-2"
            defaultValue={content.content}
          />
          <button
            type="submit"
            disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
      )}
    </section>
  );
};
UserRender.displayName = "UserRender";
