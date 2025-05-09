import { type ReactNode } from "react";
import { Virtuoso, type VirtuosoProps } from "react-virtuoso";
import { cn } from "../utils";
import type {
  BaseConversationRenderProps as BaseProps,
  MessageItem,
} from "../chatTree/type";
import {
  type StickyBottomProps,
  useStickyBottom,
} from "../hooks/useStickyBottom";
export interface ConversationRenderProps<T extends object, C>
  extends BaseProps<T> {
  className?: string;
  virtuosoProps?: Omit<
    VirtuosoProps<MessageItem<T>, C>,
    | "data"
    | "itemContent"
    | "customScrollParent"
    | "scrollerRef"
    | "followOutput"
    | "children"
  >;
  renderItem: (item: MessageItem<T>, context: C) => React.ReactNode;
  VirtuosoClassName?: string;
  stickyBottomProps?: StickyBottomProps;
  scrollToBottomButton?: (
    isStickyBottom: boolean,
    scrollToBottom: (behavior?: "smooth" | "auto") => void
  ) => ReactNode;
}

export const ConversationRender = <T extends object, C>({
  messageList,
  renderItem,
  className,
  stickyBottomProps,
  virtuosoProps,
  scrollToBottomButton,
}: ConversationRenderProps<T, C>) => {
  const { containerRef, scrollToBottom, isStickyBottom } =
    useStickyBottom(stickyBottomProps);

  return (
    <>
      <section
        ref={containerRef}
        className={cn("h-full overflow-x-hidden overflow-y-auto", className)}>
        <Virtuoso
          initialTopMostItemIndex={messageList.length - 1}
          customScrollParent={containerRef.current ?? undefined}
          data={messageList}
          itemContent={(_, item, context) =>
            renderItem(item, context)
          }
          {...virtuosoProps}
        />
      </section>
      {scrollToBottomButton &&
        scrollToBottomButton(isStickyBottom, scrollToBottom)}
    </>
  );
};
ConversationRender.displayName = "ConversationRender";
