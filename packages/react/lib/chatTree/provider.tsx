import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  useCallback,
  useMemo,
} from "react";
import type {
  ConversationState,
  Conversation,
  ChatMessageProps,
  MessageItem,
  ChatRetryProps,
} from "./type";
import { conversationListToMessageList } from "../utils/tree";
import { reducer } from "./reducer";

export interface ProviderProps<T extends object> {
  children: ReactNode;
  initialConversations?: Conversation<T>[];
}

interface ConversationProviderProps<T extends object>
  extends Omit<ConversationState<T>, "messageList"> {
  messageList: MessageItem<T>[];
}

export function createConversationContext<T extends object>() {
  const Context = createContext<ConversationProviderProps<T> | undefined>(
    undefined
  );

  function ChatCoversationProvider({
    children,
    initialConversations = [],
  }: ProviderProps<T>) {
    const [state, dispatch] = useReducer(reducer<T>, {
      conversations: initialConversations,
      messageList: conversationListToMessageList(initialConversations),
    } as ConversationState<T>);

    const setConversation = useCallback((conversations: Conversation<T>[]) => {
      dispatch({ type: "SET_CONVERSATION", payload: conversations });
    }, []);

    const getConversation = useCallback(() => {
      return structuredClone(state.conversations);
    }, [state.conversations]);

    const addMessage = useCallback((message: Conversation<T>) => {
      dispatch({ type: "ADD_MESSAGE", payload: message });
      return true;
    }, []);

    const setActive = useCallback((id: string, direction: "prev" | "next") => {
      dispatch({ type: "SET_ACTIVE", payload: { id, direction } });
      return true;
    }, []);

    const deleteMessage = useCallback((id: string) => {
      dispatch({ type: "DELETE_MESSAGE", payload: id });
      return true;
    }, []);

    const updateMessageData = useCallback((id: string, message: Partial<T>) => {
      dispatch({ type: "UPDATE_MESSAGE", payload: { id, message } });
      return true;
    }, []);

    const messageList = useMemo(() => {
      return state.messageList.map((item) => ({
        ...item,
        setActive: (direction: "prev" | "next") =>
          setActive(item.id, direction),
      }));
    }, [state.messageList, setActive]);

    const chatMessage = useCallback(
      ({
        userContent,
        userMessageId,
        botContent,
        botMessageId,
        parentId,
      }: ChatMessageProps<T>) => {
        let lastMessageId = parentId;
        if (!lastMessageId && state.messageList.length > 0) {
          lastMessageId = state.messageList[state.messageList.length - 1].id;
        } else if (!lastMessageId) {
          lastMessageId = undefined;
        } else if (parentId === "root") {
          lastMessageId = undefined;
        }
        const botMessage: Conversation<T> = {
          id: botMessageId,
          parentId: userMessageId,
          content: botContent,
          active: true,
          children: [],
        };
        const userMessage: Conversation<T> = {
          id: userMessageId,
          parentId: lastMessageId,
          content: userContent,
          active: true,
          children: [botMessage],
        };
        addMessage(userMessage);
        return {
          updateUserContent: (content: Partial<T>) => {
            updateMessageData(userMessageId, content);
          },
          updateBotContent: (content: Partial<T>) => {
            updateMessageData(botMessageId, content);
          },
        };
      },
      [messageList, addMessage]
    );

    const chatRetry = useCallback(
      ({ parentId, botMessageId, botContent }: ChatRetryProps<T>) => {
        const botMessage: Conversation<T> = {
          id: botMessageId,
          parentId: parentId,
          content: botContent,
          active: true,
          children: [],
        };
        addMessage(botMessage);
        return {
          updateBotContent: (content: Partial<T>) => {
            updateMessageData(botMessageId, content);
          },
        };
      },
      [addMessage, updateMessageData]
    );

    const value = useMemo(
      () => ({
        conversations: state.conversations,
        messageList,
        setConversation,
        getConversation,
        addMessage,
        setActive,
        deleteMessage,
        updateMessageData,
        chatMessage,
        chatRetry,
      }),
      [
        state.conversations,
        messageList,
        setConversation,
        getConversation,
        addMessage,
        setActive,
        deleteMessage,
        updateMessageData,
        chatMessage,
        chatRetry,
      ]
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useConversation() {
    const context = useContext(Context);
    if (!context) {
      throw new Error(
        "useConversation must be used within ConversationProvider"
      );
    }
    return context;
  }

  return { ChatCoversationProvider, useConversation };
}
