type TypeMenu  = {
    id: number; //聊天室Id
    name: string; //用户id
    route?: string; //类型 0 系统消息 1 文字 2 图片 3 声音 4图标
    parentId?: number; //消息
    authId: number; //时间,
};

export default TypeMenu;