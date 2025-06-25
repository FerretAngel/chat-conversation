"use client";
import { cn } from "chat-conversation-react";
import { Icon } from "@iconify/react";

export interface IconButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  icon: string;
}

export const IconButton = ({ icon, className, ...props }: IconButtonProps) => {
  return (
    <button
      className={cn("flex items-center justify-center", className)}
      {...props}>
      <Icon icon={icon} />
    </button>
  );
};
IconButton.displayName = "IconButton";
