"use client"
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce, useThrottle } from "../utils";
const userBreakEventList = ['wheel', 'touchstart', 'touchmove'] as const;
export interface StickyBottomProps {
  throttle?: number;
  stickyBottomThreshold?: number;
}

export interface StickyBottomReturn<T extends HTMLElement = HTMLElement> {
  containerRef: React.RefObject<T>;
  observe: () => void;
  unobserve: () => void;
  scrollToBottom: (behavior?: "smooth" | "auto") => void;
  isStickyBottom: boolean;
}

export const useStickyBottom = <T extends HTMLElement = HTMLElement>({ throttle = 300, stickyBottomThreshold = 100 }: StickyBottomProps = {}): StickyBottomReturn<T> => {
  const containerRef = useRef<T | null>(null);
  const [isStickyBottom, setIsStickyBottom] = useState(false);
  const observer = useRef<MutationObserver | null>(null);

  const scrollToBottom = useCallback(useThrottle((behavior: "smooth" | "auto" = "smooth") => {
    if (!containerRef.current) return
    const container = containerRef.current;
    container.scrollTo({
      top: 2 * container.scrollHeight,
      behavior
    })
  }, throttle), [containerRef])

  const unobserve = useCallback(() => {
    if (!containerRef.current || !observer.current) return;
    const container = containerRef.current;
    observer.current.disconnect();
    setIsStickyBottom(false)
    // 监听滚动事件,当滚动到底部的时候，继续接管
    const controller = new AbortController()
    container.addEventListener('scroll', useDebounce(() => {
      const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight
      if (distanceToBottom <= stickyBottomThreshold) {
        controller.abort()
        observe()
      }
    }, 100), { signal: controller.signal })
  }, [containerRef])

  const observe = useCallback(() => {
    if (!containerRef.current || !observer.current) return;
    const container = containerRef.current;
    setIsStickyBottom(true)
    observer.current.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });

    const onUserBreakEvent = () => {
      // 移除监听事件
      userBreakEventList.forEach(event => {
        container.removeEventListener(event, onUserBreakEvent)
      })
      // 停止接管
      unobserve()
    }

    // 延迟300ms后开始监听用户操作事件
    setTimeout(() => {
      // 监听用户操作事件
      userBreakEventList.forEach(event => {
        container.addEventListener(event, onUserBreakEvent, { once: true })
      })
    }, 300)
  }, [containerRef, unobserve])

  useEffect(() => {
    observer.current = new MutationObserver(() => {
      scrollToBottom("smooth")
    })
    observe() // 初始化接管
    return () => {
      unobserve()
    }
  }, [observe, unobserve])

  return {
    containerRef,
    observe,
    unobserve,
    scrollToBottom,
    isStickyBottom
  }
}
