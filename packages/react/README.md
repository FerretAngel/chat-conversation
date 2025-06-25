# README 📖
[English](./README.en.md)

# 介绍 🚀
这是一个ai聊天列表组件。
- 🌳 树形数据管理仓库：支持泛型扩展、上下文切换等，极大降低了维护chatConversationTree的难度。
- 📜 虚拟列表渲染：使用了[react-virtuoso](virtuoso.dev)组件作为虚拟列表渲染。并封装了自动滚动到底部等功能，开箱即用！
- 🎬 动画组件：基于framer-motion的高扩展性动画组件，支持滚动方向感知的动画效果。
- 🔗 [在线体验地址](https://ferretangel.github.io/chat-conversation/)

# 未来的计划
- [x] 与frame-motion结合为虚拟列表添加基本动画效果
- [ ] 列表元素退出动画

# 安装 📦
```cmd
npm install chat-conversation-react react-virtuoso framer-motion
```
```cmd
pnpm add chat-conversation-react react-virtuoso framer-motion
```
```cmd
yarn add chat-conversation-react react-virtuoso framer-motion
```
如果你不需要虚拟列表渲染，可以不安装react-virtuoso
如果你不需要动画效果，可以不安装framer-motion

# 使用方法 📖
### 1.首先使用createConversationContext扩展数据类型（必要）
context.ts
```ts 
import { createConversationContext } from "chat-conversation-react";
// 自定义的数据类型
export interface IMessageInterface {
  time: string;
  content: string;
  model: string;
  role: "user" | "assistant";
  status: "pending" | "success" | "error";
}
export const { ChatCoversationProvider, useConversation } = createConversationContext<IMessageInterface>();
```
### 2.然后将Provider组件放在最外层（必要）
index.ts
```ts
import { ChatCoversationProvider } from "./context";
import { Render } from "./render/index"; // ui渲染组件
export const ChatApp = () => {
  return (
    // 提供上下文
    <ChatCoversationProvider> 
      <Render />
    </ChatCoversationProvider>
  );
};
ChatApp.displayName = "ChatApp";
```
### 3.渲染组件（可选，你也可以自己渲染list）
/render/index.tsx
```tsx
import { cn, ConversationRender, AnimateItem } from "chat-conversation-react";
import { useConversation } from "../context";
import { RenderItem } from "./renderItem";
import { InputMessage } from "../components/input";
import { IconButton } from "../components/IconButton";

export interface RenderProps {}

export const Render = ({}: RenderProps) => {
  const { messageList } = useConversation();

  return <ConversationRender
    className="w-full h-full"
    // 计算后的列表数据
    messageList={messageList}
    // 自定义渲染列表元素
    renderItem={(item, context) => (
      <AnimateItem
        item={item}
        context={context}
        renderItem={(item) => (
          <RenderItem
            key={item.id}
            className="my-2 mx-2"
            {...item}
          />
        )}
        // 可选：自定义动画初始值
        customInitValue={{
          left: { x: -100, opacity: 0 },
          right: { x: 100, opacity: 0 },
          bottom: { y: 100, opacity: 0 },
          top: { y: -100, opacity: 0 },
        }}
        // 可选：其他 framer-motion 动画属性
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
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
};
Render.displayName = "ConversationRender";
```

#### 🎬 添加动画效果
`ConversationRender` 支持通过 `AnimateItem` 组件为列表项添加丰富的动画效果：

**特性：**
- 🎯 **滚动方向感知**：根据滚动方向（上/下/左/右）自动选择动画效果
- 🔧 **高度可配置**：支持自定义每个方向的动画初始值
- 🚀 **性能优化**：智能缓存动画状态，避免重复计算
- 📱 **响应式**：支持 viewport 检测和视口动画

**使用方式：**
```tsx
// 基础动画用法
<ConversationRender
  messageList={messageList}
  renderItem={(item, context) => (
    <AnimateItem
      item={item}
      context={context}
      renderItem={(item) => <YourMessageComponent {...item} />}
    />
  )}
/>

// 自定义动画效果
<ConversationRender
  messageList={messageList}
  renderItem={(item, context) => (
    <AnimateItem
      item={item}
      context={context}
      renderItem={(item) => <YourMessageComponent {...item} />}
      customInitValue={{
        left: { x: -200, opacity: 0, scale: 0.8 },    // 向左切换动画
        right: { x: 200, opacity: 0, scale: 0.8 },    // 向右切换动画
        bottom: { y: 100, opacity: 0, rotateX: -10 }, // 向下滚动动画
        top: { y: -100, opacity: 0, rotateX: 10 },    // 向上滚动动画
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
    />
  )}
/>

// 不使用动画，直接渲染
<ConversationRender
  messageList={messageList}
  renderItem={(item, context) => (
    <YourMessageComponent key={item.id} {...item} />
  )}
/>
```

**AnimateItem 配置项：**
```tsx
interface AnimateItemProps {
  item: MessageItem<T>;              // 必需：消息项数据（由 ConversationRender 自动传入）
  context: Context;                  // 必需：渲染上下文（由 ConversationRender 自动传入）
  renderItem: (item) => ReactNode;   // 必需：你的实际渲染函数
  customInitValue?: {                // 可选：自定义动画初始值
    left?: AnimationProps["initial"];
    right?: AnimationProps["initial"];
    bottom?: AnimationProps["initial"];
    top?: AnimationProps["initial"];
  };
  // 支持所有 framer-motion MotionProps
  transition?: any;
  viewport?: any;
  onViewportEnter?: (entry) => void;
  onViewportLeave?: (entry) => void;
}
```

### 4.发送消息参考 💬
```tsx
import { useCallback, useState } from "react";
import { useConversation } from "../context";
import { chat } from "../api";

export const Input = () => {
  // 导入context中的chatMessage方法
  const { chatMessage } = useConversation();

  const sendMessage = (query:string)=>{
    const { updateBotContent } = chatMessage({
      userMessageId: "uuid-uuid-uuid-uuid",
      botMessageId: "uuid-uuid-uuid-uuid",
      userContent:{ 自定义的数据 } ,
      botContent: { 自定义的数据 },
    });
    let botMessage = "";
    try {
      // api请求
      await chat({
        message: query,
        onMessage: (message) => {
          // 收到返回值后更新数据
          botMessage += message;
          //content是我示例的数据。在您的项目里应该使用您的数据结构
          updateBotContent({
            content: botMessage,
          });
        },
      });
      // 更新状态
      // status也是我的示例数据，在您的项目里应该使用您的数据结构
      updateBotContent({
        status: "success",
      });
    } catch (error) {
       // 更新状态
       // status也是我的示例数据，在您的项目里应该使用您的数据结构
      updateBotContent({
        status: "error",
      });
    } finally {
      // 请求结束后设置状态
      setLoading(false);
    }
  }
  ...
};
```
### 5.用户编辑后发送参考 ✏️
将接口换成chatRetry，其余和发送消息一致
```tsx
 const { chatMessage } = useConversation();
 ...
  const { updateBotContent } = chatMessage({
    userMessageId: "uuid-uuid-uuid-uuid",
    botMessageId: "uuid-uuid-uuid-uuid",
    userContent:{ 自定义的数据 } ,
    botContent: { 自定义的数据 },
    parentId: parentId || "root", // 传入parentId。如果是"root"则代表在根元素开一个新的分支（一般用不到，毕竟相当于开一个新的话题）
  });
 ...
 ```
### 6.模型输出重试参考 🔄
将接口换成chatRetry，其余和发送消息一致
```tsx
 const { chatRetry } = useConversation();

 ...
 const { updateBotContent } = chatRetry({
    parentId: parentId,
    botMessageId: botMessageId,
    botContent: { 自定义的数据 },
 });
 ...
 ```

### 7.更新整个对话树 🌲
```ts
// 基本数据结构
export declare interface Conversation<T extends object> {
    id: string;
    parentId: string | undefined;
    content: T;
    active: boolean;
    children: Conversation<T>[];
}
// api
setConversation: (conversations: Conversation<T>[]) => void;
```
```tsx
const { setConversation } = useConversation();
```

## 目录结构说明
```js
root
  docs // 在线体验页面
  packages
    page // 在线体验项目代码
    react // react版本的源码项目
      lib
        chatTree // 数据结构上下文
          actionType.ts // 一些action常量
          provider.tsx // 用于创建上下文的工厂函数
          reducer.ts // 更新仓库
          type.ts // 类型定义
        conversationRender // 虚拟列表组件
          conversationRender.tsx // 虚拟列表渲染组件
          animateItem.tsx // 动画包装组件
        hooks 
          useStickyBottom.ts // 自动滚动到底部的hook
        utils
          index.ts // 一些工具函数
          tree.ts // 树形数据的一些工具函数
```

## 许可证 📄
MIT