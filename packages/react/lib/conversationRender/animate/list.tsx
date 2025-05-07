import React from "react";
import { AnimatePresence, type AnimatePresenceProps } from "framer-motion";
import { forwardRef } from "react";
import { type AnimateContextProps } from "./context";
export interface ListProps extends React.HTMLAttributes<HTMLDivElement> {
  context: AnimateContextProps;
  animatePresenceProps?: AnimatePresenceProps;
}
export const useAnimateList = (animatePresenceProps?: AnimatePresenceProps) => {
  return forwardRef<HTMLDivElement, ListProps>((props, ref) => {
    return (
      <div
        {...props}
        ref={ref}>
        <AnimatePresence
          initial={false}
          {...animatePresenceProps}>
          {props.children}
        </AnimatePresence>
      </div>
    );
  });
};
