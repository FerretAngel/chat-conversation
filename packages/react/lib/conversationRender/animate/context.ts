import type { AnimatePresenceProps } from "framer-motion";
import { useAnimateList } from "./list";
import { type ItemProps, useAnimateItem } from "./item";
import { useMemo, useRef } from "react";
import type { MessageItem } from "../../chatTree";
import { type VirtuosoProps } from "react-virtuoso";

export interface AnimateContextProps {
  enableAnimateIdSet: Set<string>;
}


export const getAnimateRender = (props?: AnimateRenderProps<any>) => {
  const { list, item } = props || {};
  const listContext = useAnimateList(list);
  const itemContext = useAnimateItem(item);
  return {
    List: listContext,
    Item: itemContext,
  };
};
export interface AnimateRenderProps<T extends object> {
  messageList?: MessageItem<T>[];
  list?: AnimatePresenceProps;
  item?: ItemProps;
}
export const useAnimateRender = <T extends object>({ messageList, ...config }: AnimateRenderProps<T>): Pick<
  VirtuosoProps<MessageItem<T>, AnimateContextProps>,
  "isScrolling" | "context" | "components"
> => {
  const lastMessageIdSet = useRef<Set<string>>(new Set())
  const enableAnimateIdSet = useMemo(() => {
    const lastSet = new Set(lastMessageIdSet.current)
    const newSet = new Set(messageList?.map(item => item.id))
    const removeList = [...lastSet].filter(id => !newSet.has(id))
    const addList = [...newSet].filter(id => !lastSet.has(id))
    lastMessageIdSet.current = newSet
    return new Set([...addList, ...removeList])
  }, [messageList])
  const components = useRef(getAnimateRender(config))
  return {
    context: {
      enableAnimateIdSet,
    },
    components: components.current,
  };
};
