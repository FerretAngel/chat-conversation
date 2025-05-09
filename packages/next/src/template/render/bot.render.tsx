import { faker } from "@faker-js/faker";
import { cn } from "chat-conversation-react";
import { IconButton } from "../components/IconButton";
import { useConversation } from "../context";
import { ChatTraversa } from "./ChatTraversa";
import { type RenderItemProps } from "./renderItem";
import { chat } from "../api";

export interface BotRenderProps extends RenderItemProps {}

export const BotRender = ({
  content,
  meta,
  className,
  setActive,
  parentId,
}: BotRenderProps) => {
  const { chatRetry } = useConversation();

  const handleRetry = async () => {
    try {
      if (!parentId) throw new Error("parentId is required");
      const botMessageId = faker.string.uuid();
      const { updateBotContent } = chatRetry({
        parentId: parentId,
        botMessageId: botMessageId,
        botContent: {
          role: "assistant",
          content: "",
          time: new Date().toISOString(),
          model: "gpt-3.5-turbo",
          status: "pending",
        },
      });
      let botMessage = "";
      await chat({
        message: "你好",
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
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <section
      className={cn("bg-neutral-100", "rounded-2xl p-4 space-y-2", className)}>
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
      <p className="whitespace-pre-wrap relative group">
        {content.content}
        <IconButton
          className="absolute right-2 -top-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
          icon="lucide:refresh-cw"
          onClick={handleRetry}
          title="retry"
        />
      </p>
    </section>
  );
};
BotRender.displayName = "BotRender";
