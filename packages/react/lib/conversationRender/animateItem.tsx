"use client";
import {
  motion,
  type AnimationProps,
  type HTMLMotionProps,
} from "framer-motion";
import type { ConversationRenderProps, Context } from "./conversationRender";
import type { MessageItem } from "../chatTree";
import {
  ScrollDirectionKey,
  type ScrollDirection,
} from "../hooks/useStickyBottom";

export interface CustomInitValue {
  left?: AnimationProps["initial"];
  right?: AnimationProps["initial"];
  bottom?: AnimationProps["initial"];
  top?: AnimationProps["initial"];
}

const defaultCustomInitValue: CustomInitValue = {
  left: { x: -100, opacity: 0 },
  right: { x: 100, opacity: 0 },
  bottom: { y: 100, opacity: 0 },
  top: { y: -100, opacity: 0 },
};

export interface AnimateItemProps<T extends object, C extends Context>
  extends HTMLMotionProps<"section"> {
  item: MessageItem<T>;
  context: C;
  renderItem: ConversationRenderProps<T, C>["renderItem"];
  customInitValue?: CustomInitValue;
}

export const AnimateItem = <T extends object, C extends Context>({
  item,
  context,
  renderItem,
  customInitValue = defaultCustomInitValue,
  ...props
}: AnimateItemProps<T, C>) => {
  const animateItemId = `animate-item-${context.index}`;
  const cacheMap = context.cacheMap.current; // 全局缓存
  const getInitValues = () => {
    const direction: ScrollDirection =
      cacheMap.get(animateItemId) || cacheMap.get(ScrollDirectionKey);
    const { left, right, bottom, top } = customInitValue;
    switch (direction) {
      case "left":
        return left;
      case "right":
        return right;
      case "bottom":
        return bottom;
      case "top":
        return top;
      default:
        return {
          opacity: 0,
        };
    }
  };
  // 包装 setActive 函数来设置导航动画
  const wrappedSetActive = (direction: "prev" | "next") => {
    cacheMap.set(animateItemId, direction === "prev" ? "left" : "right");
    return item.setActive(direction);
  };

  return (
    <motion.section
      key={item.id}
      initial={getInitValues()}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      {...props}
      onViewportLeave={(entry) => {
        cacheMap.set(animateItemId, entry?.rootBounds ? "bottom" : "top");
        props.onViewportLeave?.(entry);
      }}
      onViewportEnter={(entry) => {
        cacheMap.delete(animateItemId);
        props.onViewportEnter?.(entry);
      }}>
      {renderItem(
        {
          ...item,
          setActive: wrappedSetActive,
        },
        context
      )}
    </motion.section>
  );
};
