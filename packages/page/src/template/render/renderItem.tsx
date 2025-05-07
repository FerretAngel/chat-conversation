import { type MessageItemWithMeta } from "chat-conversation-react";
import { type IMessageInterface } from "../context";
import { BotRender } from "./bot.render";
import { UserRender } from "./user.render";

export interface RenderItemProps
  extends MessageItemWithMeta<IMessageInterface> {
  className?: string;
  setActive: (direction: "prev" | "next") => void;
}

export const RenderItem = (props: RenderItemProps) => {
  if (props.content.role === "assistant") {
    return <BotRender {...props} />;
  }
  return <UserRender {...props} />;
};
RenderItem.displayName = "RenderItem";
