import { createConversationContext } from "chat-conversation-react";
// 自定义的数据类型
export interface IMessageInterface {
  time: string;
  content: string;
  model: string;
  role: "user" | "assistant";
  status: "pending" | "success" | "error";
}
export const { ChatCoversationProvider, useConversation } = createConversationContext<IMessageInterface>();

