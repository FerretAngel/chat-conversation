import type { Conversation, BaseMessageItem, MessageItemWithMeta } from '../chatTree/type';
/**
 * 对话树列表转消息列表
 * @param conversations 对话树列表
 */
export const conversationListToMessageList = <T extends object>(conversations: Conversation<T>[]) => {
  const messages: MessageItemWithMeta<T>[] = [];

  // 递归遍历激活的对话路径
  const traverseActiveConversations = (convs: Conversation<T>[]) => {
    const activeIndex = convs.findIndex(conv => conv.active);
    if (activeIndex === -1) return;
    // 找到激活的对话节点
    const activeConv = convs[activeIndex];
    // 如果没有激活的节点，返回
    if (!activeConv) return;

    // 将激活的对话节点转化为消息项
    const message: BaseMessageItem<T> = {
      id: activeConv.id,
      parentId: activeConv.parentId,
      content: activeConv.content,
    };

    // 添加当前消息到列表
    messages.push({
      ...message,
      meta: {
        index: activeIndex,
        current: activeIndex + 1,
        total: convs.length,
        hasPrev: activeIndex > 0,
        hasNext: activeIndex < convs.length - 1,
      },
    });

    // 如果有子节点，继续递归查找激活的子节点
    if (activeConv.children.length > 0) {
      traverseActiveConversations(activeConv.children);
    }
  };

  // 开始递归遍历
  traverseActiveConversations(conversations);

  return messages;
}
/**
 * 寻找节点 - 优先查找激活路径
 * @param conversations 对话树列表
 * @param id 节点id
 */
export const getConversationById = <T extends object>(conversations: Conversation<T>[], id: string): Conversation<T> | null => {
  // 在当前层级查找匹配ID的对话
  const conversation = conversations.find(item => item.id === id);
  if (conversation) return conversation;

  // 优先查找激活路径
  const activeConv = conversations.find(conv => conv.active);
  if (activeConv) {
    // 如果有激活节点，先在其子树中查找
    if (activeConv.children.length > 0) {
      const foundInActive = getConversationById(activeConv.children, id);
      if (foundInActive) return foundInActive;
    }
  }

  // 如果在激活路径中没找到，再查找其他非激活节点
  for (const conv of conversations) {
    // 跳过已经查找过的激活节点
    if (conv.active) continue;

    if (conv.children.length > 0) {
      const foundInChildren = getConversationById(conv.children, id);
      if (foundInChildren) return foundInChildren;
    }
  }

  // 都没找到则返回null
  return null;
}


/**
 * 删除节点
 * @param conversations 对话树列表
 * @param id 节点id
 * @returns 是否成功删除
 */
export const deleteConversationById = <T extends object>(conversations: Conversation<T>[], id: string): boolean => {
  // 检查当前层级是否有匹配的节点
  const index = conversations.findIndex(conv => conv.id === id);

  // 如果找到了匹配的节点
  if (index !== -1) {
    // 如果被删除的节点是激活的且数组中有其他节点，需要转移激活状态
    if (conversations[index].active && conversations.length > 1) {
      // 如果有下一个兄弟节点，转移给下一个；如果没有则转移给前一个
      if (index < conversations.length - 1) {
        conversations[index + 1].active = true;
      } else if (index > 0) {
        conversations[index - 1].active = true;
      }
    }

    // 从数组中删除该节点
    conversations.splice(index, 1);
    return true;
  }

  // 如果当前层级没找到，递归查找并删除子节点
  for (const conv of conversations) {
    if (conv.children.length > 0) {
      const deleted = deleteConversationById(conv.children, id);
      if (deleted) return true;
    }
  }

  // 未找到要删除的节点
  return false;
}
/**
 * 更新节点数据
 * @param conversations 对话树列表
 * @param id 节点id
 * @param data 要更新的数据
 */
export const updateConversationById = <T extends object>(conversations: Conversation<T>[], id: string, data: Partial<Conversation<T>['content']>): boolean => {
  const item = getConversationById(conversations, id);
  if (!item) return false;
  Object.assign(item.content, data);
  return true;
}

/**
 * 向父节点添加子节点
 * @param parent 父节点
 * @param conversation 要添加的节点
 */
const addConversationToParent = <T extends object>(children: Conversation<T>[], conversation: Conversation<T>): void => {
  // 如果添加的是激活节点，需要将父节点的其他子节点设置为非激活
  if (conversation.active) {
    children.forEach(child => {
      child.active = false;
    });
  }
  children.push(conversation);
}
/**
 * 添加节点
 * @param conversations 对话树列表
 * @param conversation 要添加的节点
 * @param parentId 父节点id，可选，不提供时添加为根节点
 * @returns 是否成功添加
 */
export const addConversation = <T extends object>(
  conversations: Conversation<T>[],
  conversation: Conversation<T>,
): boolean => {
  const { parentId } = conversation;
  // 如果parentId不存在或为空字符串，表示添加根节点
  if (!parentId) {
    addConversationToParent(conversations, conversation);
    return true;
  }

  // 使用getConversationById函数查找父节点
  const parent = getConversationById(conversations, parentId);
  if (parent) {
    // 使用封装的函数添加子节点
    addConversationToParent(parent.children, conversation);
    return true;
  }

  // 未找到父节点
  return false;
}


/**
 * 设置相邻节点为激活状态
 * @param conversations 对话树列表
 * @param id 当前节点id
 * @param direction 方向，'prev'为前一个，'next'为后一个
 * @returns 是否成功设置
 */
export const setAdjacentNodeActive = <T extends object>(
  conversations: Conversation<T>[],
  id: string,
  direction: 'prev' | 'next'
): boolean => {
  // 使用已有的高效函数找到当前节点
  const currentNode = getConversationById(conversations, id);
  if (!currentNode) return false;

  // 确定节点所在的数组
  let siblingArray: Conversation<T>[];
  if (currentNode.parentId) {
    // 如果有父节点，获取父节点的children数组
    const parentNode = getConversationById(conversations, currentNode.parentId);
    if (!parentNode) return false;
    siblingArray = parentNode.children;
  } else {
    // 如果没有父节点，则是根节点，使用conversations数组
    siblingArray = conversations;
  }

  // 找到当前节点在数组中的索引
  const currentIndex = siblingArray.findIndex(conv => conv.id === id);
  if (currentIndex === -1) return false;

  const length = siblingArray.length;
  // 如果数组中只有一个节点，无法切换
  if (length <= 1) return false;

  // 计算新的激活索引，支持轮询
  let newActiveIndex: number;
  if (direction === 'next') {
    newActiveIndex = (currentIndex + 1) % length; // 轮询到第一个
  } else {
    newActiveIndex = (currentIndex - 1 + length) % length; // 轮询到最后一个
  }

  // 更新激活状态
  currentNode.active = false;
  siblingArray[newActiveIndex].active = true;

  return true;
}

