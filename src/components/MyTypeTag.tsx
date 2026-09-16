import { Tag } from 'antd';
import React from 'react';

// 类型配置映射表
const typeConfig = {
    1: { text: '微信充值', color: '#4CAF50' },
    2: { text: '租金', color: '#F44336' },
    3: { text: '电费', color: '#2196F3' },
    4: { text: '水费', color: '#FFC107' },
    5: { text: '公共缴费', color: '#9C27B0' },
    6: { text: '手动充值', color: '#E91E63' },
    7: { text: '损耗', color: '#795548' },
    8: { text: '违约金', color: '#795548' },
    9: { text: '月保', color: '#795588' },
    10: { text: '大额转账', color: '#795548' },
    11: { text: '报修', color: '#795548' },
    12: { text: '装修押金', color: '#795548' },
    13: { text: '管理费', color: '#795548' },
    14: { text: '退款', color: '#795548' },
    // 14: { text: '管理费违约金', color: '#795548' },
    default: { text: '未知类型', color: '#777777' }
};

// 封装组件
interface ConsumptionTypeTagProps {
    type: number;
}

const ConsumptionTypeTag: React.FC<ConsumptionTypeTagProps> = ({ type }) => {
    const config = typeConfig[type] || typeConfig.default;
    return <Tag style={{ color: config.color }}>{config.text}</Tag>;
};

export default ConsumptionTypeTag;