import React from 'react';
import { Select } from 'antd';

// 统一类型选项配置（和业务类型保持一致，只改这里即可）
export const consumptionTypeOptions = [
    { value: 0, label: '全部' },
    { value: 1, label: '微信充值' },
    { value: 2, label: '租金' },
    { value: 13, label: '管理费' },
    { value: 3, label: '电费' },
    { value: 4, label: '水费' },
    { value: 5, label: '公共缴费' },
    { value: 6, label: '手动充值' },
    { value: 7, label: '服务费' },
    { value: 8, label: '租金违约金' },
    { value: 14, label: '管理费违约金' },
    { value: 9, label: '月保' },
    { value: 10, label: '大额转账' },
    { value: 11, label: '报修' },
    { value: 12, label: '装修押金' },
];

// 组件入参类型
interface ConsumptionTypeSelectProps {
    // 默认选中值
    value?: number;
    // 选中变化回调
    onChange?: (val: number) => void;
    // 自定义宽度（可选）
    width?: number;
}

const ConsumptionTypeSelect: React.FC<ConsumptionTypeSelectProps> = (props) => {
    const { value, onChange, width = 140 } = props;

    return (
        <Select
            value={value}
            onChange={onChange}
            style={{ width }}
            options={consumptionTypeOptions}
        />
    );
};

export default ConsumptionTypeSelect;