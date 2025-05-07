import { type IMessageInterface } from "../context";
import { type Conversation } from "chat-conversation-react";
import conv from "./conv.json";
import { faker } from "@faker-js/faker";

export const getMessage = async (): Promise<Conversation<IMessageInterface>[]> => {
  // 将ConvTree.Conv转换为ConversationStore的格式
  const conversations: Array<
    Conversation<IMessageInterface>
  > = [];

  // 递归函数，用于将每个TreeItem转换为Conversation格式
  const convertTreeItem = (
    item: ConvTree.TreeItem,
    parentId?: string
  ): Conversation<IMessageInterface> => {
    // 基本结构转换
    const conversation: Conversation<IMessageInterface> = {
      id: item.id,
      parentId: parentId,
      active: item.selected,
      children: [],
      content: {
        role: item.role === 1 ? "user" : "assistant",
        content:
          item.role === 1
            ? item.content
            : // 处理Bot回复内容，合并markdown内容
            item.content.map((c) => c.args.content).join("\n"),
        time: item.time,
        model: item.model ?? "",
        status: 'success'
      },
    };

    // 递归处理子节点
    if (item.children && item.children.length > 0) {
      conversation.children = item.children.map((child) =>
        convertTreeItem(child, item.id)
      );
    }

    return conversation;
  };
  // 处理根节点
  if (conv && conv.length > 0) {
    for (const item of conv) {
      conversations.push(convertTreeItem(item as unknown as ConvTree.TreeItem));
    }
  }
  return conversations;
}

interface ChatProps {
  message: string;
  step?: number;
  onMessage: (message: string) => void;
}
export const chat = async (props: ChatProps) => {
  const { step = 1 } = props;
  // props.onMessage(faker.lorem.paragraphs())
  for await (const chunk of faker.lorem.paragraphs(step)) {
    props.onMessage(chunk);
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
};
