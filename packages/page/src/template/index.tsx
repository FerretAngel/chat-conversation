import { ChatCoversationProvider } from "./context";
import { Render } from "./render/index";
export const ChatApp = () => {
  return (
    <ChatCoversationProvider>
      <Render />
    </ChatCoversationProvider>
  );
};
ChatApp.displayName = "ChatApp";
