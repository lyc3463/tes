// 状态枚举，避免魔法数字
export enum PurStatus {
    DRAFT = 1,      // 待送审
    AUDITING = 8,     // 采购审核
    APPROVED = 2,            // 已审核
    PENDING_REIMBURSEMENT = 3,           // 已提交报销
    REIMBURSED = 4,          // 已报销
    PENDING_INBOUND = 5, // 采购入库审核
    INBOUNDED = 6,      // 入库审核
    REJECTED = 7,            // 已驳回
    DEFAULT = 99,            // 默认状态
}

export enum InStatus {
    PENDING_IN = 1,      // 未入库
    AUDITING = 2,            // 已提交
    APPROVED = 3,           // 已入库
    REJECTED = 4,            // 已驳回
    DEFAULT = 99,            // 默认状态
}

export interface StatusConfig {
    text: string;
    color: string;
    next?: number;
    btnText?: string;
}

export const PUR_STATUS: Record<PurStatus, StatusConfig> = {
    [PurStatus.DRAFT]: {
        text: '待送审',
        color: 'blue',
    },
    [PurStatus.APPROVED]: {
        text: '已审核',
        color: 'green',
    },
    [PurStatus.PENDING_REIMBURSEMENT]: {
        text: '已提交报销',
        color: 'orange',
    },
    [PurStatus.REIMBURSED]: {
        text: '已报销',
        color: 'purple',
    },
    [PurStatus.PENDING_INBOUND]: {
        text: '采购入库审核',
        color: 'orange',
    },
    [PurStatus.INBOUNDED]: {
        text: '入库审核',
        color: 'orange',
    },
    [PurStatus.REJECTED]: {
        text: '已驳回',
        color: 'red',
    },
    [PurStatus.AUDITING]: {
        text: '采购审核',
        color: 'orange',
    },
    [PurStatus.DEFAULT]: {
        text: '未知状态',
        color: 'default',
    },
};

export const IN_STATUS: Record<InStatus, StatusConfig> = {
    [InStatus.PENDING_IN]: {
        text: '未入库',
        color: 'blue',
    },
    [InStatus.AUDITING]: {
        text: '已提交',
        color: 'green',
    },
    [InStatus.APPROVED]: {
        text: '已入库',
        color: 'orange',
    },
    [InStatus.REJECTED]: {
        text: '已驳回',
        color: 'purple',
    },
    [InStatus.DEFAULT]: {
        text: '未知状态',
        color: 'default',
    },
};