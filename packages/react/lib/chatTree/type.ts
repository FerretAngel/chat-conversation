
export interface Conversation<T extends object> {
  id: string
  parentId: string | undefined
  content: T
  active: boolean
  children: Conversation<T>[]
}

export interface MessageMeta {
  index: number; // 索引
  current: number; // 当前序号
  total: number; // 总数
  hasPrev: boolean; // 是否有前一个
  hasNext: boolean; // 是否有后一个
}

export interface BaseMessageItem<T extends object> extends Omit<Conversation<T>, "children" | 'active'> {
}

export interface MessageItemWithMeta<T extends object> extends BaseMessageItem<T> {
  meta: MessageMeta
}

export interface MessageItem<T extends object> extends MessageItemWithMeta<T> {
  setActive: (direction: 'prev' | 'next') => boolean;
}

export interface BaseConversationRenderProps<T extends object> {
  messageList: MessageItem<T>[];
}

export interface ConversationState<T extends object> {
  // 状态
  conversations: Conversation<T>[];
  messageList: MessageItemWithMeta<T>[];
  // 操作方法
  setConversation: (conversations: Conversation<T>[]) => void;
  getConversation: () => Conversation<T>[] | null;
  setActive: (id: string, direction: 'prev' | 'next') => boolean;
  addMessage: (message: Conversation<T>) => boolean;
  deleteMessage: (id: string) => boolean;
  updateMessageData: (id: string, message: Partial<T>) => boolean;
  /**
   * 新增聊天消息
   * @param parentId 父消息id, 如果为undefined,则添加到消息列表的最后一个。如果为'root',则添加到根元素
   * @param userMessageId 用户消息id
   * @param botMessageId 机器人消息id
   * @param userContent 用户消息内容
   * @param botContent 机器人消息内容
   * @returns 返回一个对象，包含两个方法，分别用于更新用户消息和机器人消息
   */
  chatMessage: (props: ChatMessageProps<T>) => ChatMessageResult<T>;
  /**
   * 重试聊天消息
   * @param props 重试聊天消息的props
   * @returns 返回一个对象，包含一个方法，用于更新机器人消息
   */
  chatRetry: (props: ChatRetryProps<T>) => ChatRetryResult<T>;
}


export interface ChatMessageProps<T extends object> {
  parentId?: 'root' | (string & {})
  userMessageId: string
  botMessageId: string
  userContent: T
  botContent: T
}
export interface ChatMessageResult<T extends object> {
  updateUserContent: (content: Partial<T>) => void;
  updateBotContent: (content: Partial<T>) => void;
}

export interface ChatRetryProps<T extends object> {
  parentId: string
  botMessageId: string
  botContent: T
}

export interface ChatRetryResult<T extends object> {
  updateBotContent: (content: Partial<T>) => void;
}

