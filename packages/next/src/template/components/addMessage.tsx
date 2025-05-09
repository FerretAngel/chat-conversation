"use client"
import { useCallback, useState } from "react";
import { cn } from "chat-conversation-react";
import { useConversation } from "../context";
import { chat } from "../api";
import { faker } from "@faker-js/faker";
export interface AddMessageProps {
  className?: string;
}

export const AddMessage = ({ className }: AddMessageProps) => {
  const { chatMessage } = useConversation();
  const [loading, setLoading] = useState(false);

  const chatAction = useCallback(async () => {
    setLoading(true);
    const query = faker.lorem.paragraph();
    const { updateBotContent } = chatMessage({
      userMessageId: faker.string.uuid(),
      botMessageId: faker.string.uuid(),
      userContent: {
        role: "user",
        content: query,
        time: new Date().toISOString(),
        model: "gpt-3.5-turbo",
        status: "success",
      },
      botContent: {
        role: "assistant",
        content: "",
        time: new Date().toISOString(),
        model: "gpt-3.5-turbo",
        status: "pending",
      },
    });
    let botMessage = "";
    try {
      await chat({
        message: query,
        onMessage: (message) => {
          botMessage += message;
          updateBotContent({
            content: botMessage,
          });
        },
      });
      updateBotContent({
        status: "success",
      });
    } catch (error) {
      updateBotContent({
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [chatMessage]);

  return (
    <button
      onClick={chatAction}
      className={cn(className)}>
      {loading ? "Loading..." : "Add Message"}
    </button>
  );
};
AddMessage.displayName = "AddMessage";
