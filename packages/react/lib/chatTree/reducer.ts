import { ACTION_TYPES } from './actionTypes';
import { addConversation, conversationListToMessageList, deleteConversationById, setAdjacentNodeActive, updateConversationById } from '../utils/tree';
import type { Conversation, ConversationState } from './type';

type Action<T extends object> =
  | { type: "SET_CONVERSATION"; payload: Conversation<T>[] }
  | {
    type: "ADD_MESSAGE";
    payload: Conversation<T>;
  }
  | { type: "DELETE_MESSAGE"; payload: string }
  | { type: "UPDATE_MESSAGE"; payload: { id: string; message: Partial<T> } }
  | { type: "SET_ACTIVE"; payload: { id: string; direction: "prev" | "next" } };


export function reducer<T extends object>(
  state: ConversationState<T>,
  action: Action<T>
): ConversationState<T> {
  const convList = structuredClone(state.conversations);

  /**
   * 更新状态
   * @param oldConversations 旧的对话列表
   * @param newConversations 新的对话列表
   * @returns 
   */
  const updateStateOnSuccess = (newConversations: Conversation<T>[]) => {
    const messageList = conversationListToMessageList(newConversations);
    return {
      ...state,
      conversations: newConversations,
      messageList: messageList,
    };
  }

  switch (action.type) {
    case ACTION_TYPES.SET_CONVERSATION: {
      return updateStateOnSuccess(action.payload);
    }

    case ACTION_TYPES.ADD_MESSAGE: {
      const success = addConversation(convList, action.payload);
      if (!success) return state;
      return updateStateOnSuccess(convList);
    }

    case ACTION_TYPES.DELETE_MESSAGE: {
      const success = deleteConversationById(convList, action.payload);
      if (!success) return state;
      return updateStateOnSuccess(convList);
    }

    case ACTION_TYPES.UPDATE_MESSAGE: {
      const { id, message } = action.payload;
      const success = updateConversationById(convList, id, message);
      if (!success) return state;
      return updateStateOnSuccess(convList);
    }

    case ACTION_TYPES.SET_ACTIVE: {
      const { id, direction } = action.payload;
      const success = setAdjacentNodeActive(convList, id, direction);
      if (!success) return state;
      return updateStateOnSuccess(convList);
    }

    default:
      return state;
  }
} 