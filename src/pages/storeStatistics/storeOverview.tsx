import React, { useState } from 'react';
import { Card, Row, Col, Button, DatePicker } from 'antd';
import { Line, Pie } from '@ant-design/plots';
import 'antd/dist/reset.css';
import {InfoCircleOutlined} from "@ant-design/icons";
const StoreOverview = () => {
    // 时间筛选状态
    const [activeTime, setActiveTime] = useState('today');
    // 多折线图数据
    const lineData = [
        { time: '2026/01/05', total: 0, recharge: 0, order: 0, coupon: 0 },
        // 可补充更多日期数据
    ];
    // 折线图配置
    const lineConfig = {
        data: lineData,
        xField: 'time',
        yField: ['total', 'recharge', 'order', 'coupon'],
        seriesField: 'type',
        responsive: true,
        theme: {
            colors: ['#1890ff', '#52c41a', '#faad14', '#f5222d'], // 对应总收入/充值/订单/卡券
        },
        smooth: true,
        line: { size: 2 },
        point: { size: 5 },
        xAxis: {
            label: { style: { fontSize: '12px' } },
        },
        yAxis: {
            label: { style: { fontSize: '12px' } },
            grid: { line: { style: { stroke: '#f0f0f0', lineDash: [4, 4] } } },
            min: 0,
            max: 1,
        },
        legend: {
            position: 'top',
            itemName: {
                formatter: (name) => {
                    const nameMap = {
                        total: '总收入',
                        recharge: '现金充值',
                        order: '现金预约下单',
                        coupon: '现金购买卡券',
                    };
                    return nameMap[name as keyof typeof nameMap] || name;
                },
            },
        },
        tooltip: { showMarkers: true },
        width: '100%',
        height: '300px',
    };
    const pieData = [
        { type: '现金预约下单', value: 0, percent: '0%' },
        { type: '现金购买卡券', value: 0, percent: '0%' },
        { type: '现金充值', value: 0, percent: '0%' },
        { type: '现金购买储值卡', value: 0, percent: '0%' },
        { type: '现金购买商品', value: 0, percent: '0%' },
        { type: '现金储物柜下单', value: 0, percent: '0%' },
    ];

    // 环形图配置
    const pieConfig = {
        data: pieData,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        innerRadius: 0.5,
        label: {
            type: 'inner',
            offset: '-50%',
            content: '{value}',
            style: {
                fontSize: '24px',
                fontWeight: 'bold',
            },
        },
    }
    return (
        <div style={{ padding: '20px', backgroundColor: '#fff' }}>
            {/* 财务统计区域 */}
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>财务统计</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* 时间快捷按钮 */}
                        {[
                            { key: 'today', label: '今天' },
                            { key: 'yesterday', label: '昨天' },
                            { key: '7days', label: '近7天' },
                            { key: 'month', label: '本月' },
                            { key: 'lastMonth', label: '上月' },
                            { key: 'all', label: '全部' },
                        ].map(item => (
                            <Button
                                key={item.key}
                                type={activeTime === item.key ? 'primary' : 'default'}
                                size="small"
                                onClick={() => setActiveTime(item.key)}
                            >
                                {item.label}
                            </Button>
                        ))}
                        {/* 自定义时间选择 */}
                        <DatePicker.RangePicker/>
                    </div>
                </div>

                {/* 财务数据卡片 */}
                <Row gutter={[0, 0]}>
                    {[
                        { title: '总收入>', value: '0.00' },
                        { title: '微信收入>', value: '0.00' },
                        { title: '线下收入>', value: '0.00' },
                        { title: '团购收入>', value: '0.00' },
                        { title: '美团预订>', value: '0.00' },
                    ].map((item, index) => (
                        <Col key={index} span={index === 0 ? 6 : 4.8} style={{ borderRight: '1px solid #f0f0f0' }}>
                            <Card bordered={false} style={{ height: '100%', textAlign: 'center' }}>
                                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{item.title}</div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{item.value}</div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
            {/* 用户统计区域 */}
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>用户统计</h3>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>702人</span>
                        <InfoCircleOutlined style={{ marginLeft: '4px', color: '#999' }} />
                    </div>
                </div>

                {/* 用户数据表格 */}
                <Row gutter={[0, 0]}>
                    {[
                        { row1: '今日新增', row1Val: '0人', row2: '今日活跃', row2Val: '0人' },
                        { row1: '近7日新增', row1Val: '0人', row2: '近7日活跃', row2Val: '0人' },
                        { row1: '近30日新增', row1Val: '0人', row2: '近30日活跃', row2Val: '0人' },
                    ].map((item, index) => (
                        <Col key={index} span={8} style={{ borderRight: '1px solid #f0f0f0' }}>
                            <Card bordered={false} style={{ height: '100%' }}>
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ fontSize: '14px', color: '#666' }}>{item.row1}</div>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px' }}>{item.row1Val}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', color: '#666' }}>{item.row2}</div>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px' }}>{item.row2Val}</div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>
            <div style={{ padding: '20px', backgroundColor: '#fff' }}>
                <h3 style={{ margin: 0, fontSize: '18px', marginBottom: '16px' }}>收入趋势图</h3>

                {/* 筛选栏 + 收入数据 */}
                <Card style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '16px' }}>收入</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* 时间快捷按钮 */}
                            {[
                                { key: 'all', label: '全部' },
                                { key: '7days', label: '最近7天' },
                                { key: '30days', label: '最近30天' },
                            ].map(item => (
                                <Button
                                    key={item.key}
                                    type={activeTime === item.key ? 'primary' : 'default'}
                                    size="small"
                                    onClick={() => setActiveTime(item.key)}
                                >
                                    {item.label}
                                </Button>
                            ))}
                            {/* 自定义时间选择 */}
                            <DatePicker.RangePicker/>
                        </div>
                    </div>

                    {/* 收入数据行 */}
                    <Row gutter={[16, 8]}>
                        {[
                            { label: '总收入:', value: '¥0' },
                            { label: '现金充值:', value: '¥0' },
                            { label: '现金预约下单:', value: '¥0' },
                            { label: '现金购买卡券:', value: '¥0' },
                            { label: '现金购买储值卡:', value: '¥0' },
                            { label: '现金购买商品:', value: '¥0' },
                            { label: '现金储物柜下单:', value: '¥0' },
                        ].map((item, index) => (
                            <Col key={index} span={4}>
                                <div style={{ fontSize: '14px', color: '#666' }}>
                                    {item.label} <span style={{ fontWeight: 'bold' }}>{item.value}</span>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Card>

                {/* 图表区域 */}
                <Row gutter={[24, 0]} style={{ height: 320 }}> {/* 给行加高度，确保子元素占满 */}
                    {/* 多折线图 */}
                    <Col span={14} style={{ height: '100%' }}>
                        <Card style={{ height: '100%' }}>
                            <div style={{ width: '100%', height: '100%' }}> {/* 内层容器确保图表占满 */}
                                <Line {...lineConfig} />
                            </div>
                        </Card>
                    </Col>
                    {/* 环形收入占比图 */}
                    <Col span={10} style={{ height: '100%' }}>
                        <Card style={{ height: '100%' }}>
                            <div style={{ width: '100%', height: '100%' }}>
                                <Pie {...pieConfig} />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default StoreOverview;