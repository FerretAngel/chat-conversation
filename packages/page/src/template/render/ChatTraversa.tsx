import { type MessageMeta, cn } from "chat-conversation-react";
import { IconButton } from "../components/IconButton";
import { memo } from "react";
export interface ChatTraversaProps {
  className?: string;
  meta: MessageMeta | null;
  setActive: (direction: "prev" | "next") => void;
}

export const ChatTraversa = memo(
  ({ meta, setActive, className }: ChatTraversaProps) => {
    if (!meta || meta.total <= 1) return null;
    return (
      <section className={cn("flex items-center gap-2", className)}>
        <IconButton
          icon="mdi:arrow-left"
          onClick={() => setActive("prev")}
        />
        <span>
          {meta.current} / {meta.total}
        </span>
        <IconButton
          icon="mdi:arrow-right"
          onClick={() => setActive("next")}
        />
      </section>
    );
  }
);
ChatTraversa.displayName = "ChatTraversa";
