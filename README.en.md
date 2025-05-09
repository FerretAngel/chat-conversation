# README 📖
[中文](./README.md)

# Introduction 🚀
This is an AI chat list component.
- 🌳 Tree Data Management: Supports generic extensions, context switching, and significantly reduces the difficulty of maintaining chatConversationTree.
- 📜 Virtual List Rendering: Uses [react-virtuoso](virtuoso.dev) component for virtual list rendering. Includes auto-scroll to bottom and other features, ready to use out of the box!
- 🔗 [Live Demo](https://ferretangel.github.io/chat-conversation/)

# Future Plans
- [ ] High-extensibility animation components based on framer-motion (currently unstable with virtual list, not yet released)

# Installation 📦
```cmd
npm install chat-conversation-react react-virtuoso
```
```cmd
pnpm add chat-conversation-react react-virtuoso
```
```cmd
yarn add chat-conversation-react react-virtuoso
```
If you don't need virtual list rendering, you can skip installing react-virtuoso

# Usage 📖
### 1. First, extend the data type using createConversationContext (Required)
context.ts
```ts 
import { createConversationContext } from "chat-conversation-react";
// Custom data type
export interface IMessageInterface {
  time: string;
  content: string;
  model: string;
  role: "user" | "assistant";
  status: "pending" | "success" | "error";
}
export const { ChatCoversationProvider, useConversation } = createConversationContext<IMessageInterface>();
```
### 2. Then place the Provider component at the outermost layer (Required)
index.ts
```ts
import { ChatCoversationProvider } from "./context";
import { Render } from "./render/index"; // UI rendering component
export const ChatApp = () => {
  return (
    // Provide context
    <ChatCoversationProvider> 
      <Render />
    </ChatCoversationProvider>
  );
};
ChatApp.displayName = "ChatApp";
```
### 3. Rendering Component (Optional, you can also render the list yourself)
/render/index.tsx
```tsx
import { cn, ConversationRender } from "chat-conversation-react";
import { useConversation } from "../context";
import { RenderItem } from "./renderItem";
import { InputMessage } from "../components/input";
import { IconButton } from "../components/IconButton";

export interface RenderProps {}

export const Render = ({}: RenderProps) => {
  const { messageList } = useConversation();

  return <ConversationRender
    className="w-full h-full"
    // Calculated list data
    messageList={messageList}
    // Custom render list item
    renderItem={(item) => (
      <RenderItem
        key={item.id}
        className="my-2 mx-2"
        {...item}
      />
    )}
    // Custom render scroll to bottom button
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

### 4. Sending Messages Reference 💬
```tsx
import { useCallback, useState } from "react";
import { useConversation } from "../context";
import { chat } from "../api";

export const Input = () => {
  // Import chatMessage method from context
  const { chatMessage } = useConversation();

  const sendMessage = (query:string)=>{
    const { updateBotContent } = chatMessage({
      userMessageId: "uuid-uuid-uuid-uuid",
      botMessageId: "uuid-uuid-uuid-uuid",
      userContent:{ custom data } ,
      botContent: { custom data },
    });
    let botMessage = "";
    try {
      // API request
      await chat({
        message: query,
        onMessage: (message) => {
          // Update data after receiving response
          botMessage += message;
          //content is my example data. In your project, you should use your data structure
          updateBotContent({
            content: botMessage,
          });
        },
      });
      // Update status
      // status is also my example data, in your project you should use your data structure
      updateBotContent({
        status: "success",
      });
    } catch (error) {
       // Update status
       // status is also my example data, in your project you should use your data structure
      updateBotContent({
        status: "error",
      });
    } finally {
      // Set status after request ends
      setLoading(false);
    }
  }
  ...
};
```
### 5. User Edit and Send Reference ✏️
Replace the interface with chatRetry, the rest is the same as sending messages
```tsx
 const { chatMessage } = useConversation();
 ...
  const { updateBotContent } = chatMessage({
    userMessageId: "uuid-uuid-uuid-uuid",
    botMessageId: "uuid-uuid-uuid-uuid",
    userContent:{ custom data } ,
    botContent: { custom data },
    parentId: parentId || "root", // Pass parentId. If it's "root", it means starting a new branch at the root element (rarely used, as it's equivalent to starting a new topic)
  });
 ...
 ```
### 6. Model Output Retry Reference 🔄
Replace the interface with chatRetry, the rest is the same as sending messages
```tsx
 const { chatRetry } = useConversation();

 ...
 const { updateBotContent } = chatRetry({
    parentId: parentId,
    botMessageId: botMessageId,
    botContent: { custom data },
 });
 ...
 ```

### 7. Update the Entire Conversation Tree 🌲
```ts
// Basic data structure
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

## Directory Structure
```js
root
  docs // Online demo page
  packages
    page // Online demo project code
    react // React version source code project
      lib
        chatTree // Data structure context
          actionType.ts // Some action constants
          provider.tsx // Factory function for creating context
          reducer.ts // Update store
          type.ts // Type definitions
        conversationRender // Virtual list component
          animate // Animation components (not yet used)
          conversationRender.tsx // Virtual list rendering component
        hooks 
          useStickyBottom.ts // Auto-scroll to bottom hook
        utils
          index.ts // Some utility functions
          tree.ts // Tree data utility functions
```

## License 📄
MIT 