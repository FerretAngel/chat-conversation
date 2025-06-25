"use client";
import { useRef, type MutableRefObject, type ReactNode } from "react";
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

export interface Context extends Object {
  index: number; // 当前消息的索引
  cacheMap: MutableRefObject<Map<string, any>>; // 缓存map
}

export interface ConversationRenderProps<T extends object, C extends Context>
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

export const ConversationRender = <T extends object, C extends Context>({
  messageList,
  renderItem,
  className,
  stickyBottomProps,
  virtuosoProps,
  scrollToBottomButton,
}: ConversationRenderProps<T, C>) => {
  // 子组件做缓存使用
  const cacheMap = useRef<Map<string, any>>(new Map());
  const { containerRef, scrollToBottom, isStickyBottom } = useStickyBottom({
    ...stickyBottomProps,
    cacheMap,
  });

  return (
    <>
      <section
        ref={containerRef}
        className={cn("h-full overflow-x-hidden overflow-y-auto", className)}>
        <Virtuoso
          initialTopMostItemIndex={messageList.length - 1}
          customScrollParent={containerRef.current ?? undefined}
          data={messageList}
          itemContent={(index, item, context) =>
            renderItem(item, {
              ...context,
              index,
              cacheMap,
            })
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
