import { motion, type HTMLMotionProps, type MotionProps } from "framer-motion";
import { forwardRef, useMemo, useRef } from "react";
import type { Components } from "react-virtuoso";
import { type AnimateContextProps } from "./context";
import type { MessageItem } from "../../chatTree";
const DefaultAnimate: MotionProps = {
  initial: {
    opacity: 0,
    x: 100,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: -100,
  },
};
export interface ItemProps extends HTMLMotionProps<"div"> {}
export const useAnimateItem = (
  animateProps?: MotionProps
): Components<MessageItem<any>, AnimateContextProps>["Item"] => {
  return forwardRef(({ context, ...props }, ref) => {
    const play = useRef(false);
    const enableAnimate = context?.enableAnimateIdSet.has(props.item.id);
    const animate: MotionProps = useMemo(() => {
      console.log(`${props.item.id}`, enableAnimate, play.current);
      if (enableAnimate || play.current) {
        return {
          ...DefaultAnimate,
          ...animateProps,
        };
      }
      return {
        initial: undefined,
        animate: undefined,
        exit: undefined,
      };
    }, [enableAnimate]);
    return (
      <motion.div
        {...props}
        {...animate}
        onAnimationEnd={() => {
          play.current = false;
        }}
        onAnimationStart={() => {
          play.current = true;
        }}
        ref={ref as any}></motion.div>
    );
  });
};
