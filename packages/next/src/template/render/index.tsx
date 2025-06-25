import { cn, ConversationRender, AnimateItem } from "chat-conversation-react";
import { useConversation } from "../context";
import { RenderItem } from "./renderItem";
import { AddMessage } from "../components/addMessage";
import { IconButton } from "../components/IconButton";
import { useEffect } from "react";
import { getMessage } from "../api";

export interface RenderProps {}

export const Render = ({}: RenderProps) => {
  const { messageList, setConversation } = useConversation();

  // 初始化数据
  useEffect(() => {
    getMessage().then((res) => {
      setConversation(res);
    });
  }, []);
  return (
    <div className="h-[100dvh] w-[100dvw] ">
      <div className="max-w-2xl mx-auto h-full overflow-hidden relative">
        <ConversationRender
          className="w-full h-full pb-24 overflow-y-auto"
          // 计算后的列表数据
          messageList={messageList}
          // 自定义渲染列表元素
          renderItem={(item, context) => (
            <AnimateItem
              item={item}
              context={context}
              renderItem={(item, context) => (
                <RenderItem
                  key={item.id}
                  className="my-2 mx-2"
                  {...item}
                />
              )}
            />
          )}
          // 自定义渲染滚动到底部按钮
          scrollToBottomButton={(isStickyBottom, scrollToBottom) => (
            <IconButton
              onClick={() => scrollToBottom()}
              icon="lucide:arrow-down-to-line"
              className={cn(
                "absolute z-10 bottom-16 float-right right-8 !bg-blue-500 text-white p-2 !rounded-full transition-all duration-300",
                isStickyBottom &&
                  "translate-y-full opacity-0 pointer-events-none"
              )}
            />
          )}
        />
      </div>
      <AddMessage className="!bg-blue-500/50 backdrop-blur-3xl w-full max-w-xl mx-auto text-white p-2 rounded-md absolute left-1/2 -translate-x-1/2 bottom-2" />
    </div>
  );
};
Render.displayName = "ConversationRender";
