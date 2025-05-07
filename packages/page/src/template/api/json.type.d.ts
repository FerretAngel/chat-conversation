declare namespace ConvTree {
  type Tree = UserConversation[];
  type metaType = {
    cid1: string;
    cid2: string;
    regen: boolean;
    tid: string;
  };

  type argsType = {
    name: string;
    key: string;
    content: string;
  };

  type metaRes = {
    event: "meta";
    data: metaType;
  };

  type updateRes = {
    event: "update";
    data: BotContent;
  };
  type funcRes = {
    event: "func_call";
    data: BotContent;
  };
  type endRes = {
    event: "end";
    data: any;
  };
  type errorRes = {
    event: "err";
    data: {
      errcode: number;
      detail: string;
    };
  };
  type resType = metaRes | updateRes | endRes | funcRes | errorRes;

  interface BotContent {
    id: string;
    type: 1 | 2 | 3; // 1: markdown,2:int,3:other
    args: argsType;
  }
  interface BaseConversation {
    id: string;
    time: string;
    selected: boolean; // 是否选中当前对话
    mod_result: 0;
  }
  interface UserConversation extends BaseConversation {
    role: 1;
    content: string;
    attachments: string[];
    model: null;
    end_at: null;
    children: BotConversation[];
  }

  interface BotConversation extends BaseConversation {
    role: 2;
    content: BotContent[];
    attachments: null;
    model: string;
    end_at: string;
    children: UserConversation[];
    loading?: boolean;
  }
  type TreeItem = UserConversation | BotConversation;
  type Conv = TreeItem[];
  type TreeMap = Map<string, TreeItem>;
}
