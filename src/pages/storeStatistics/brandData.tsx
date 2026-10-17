import React, { useState } from 'react';
import {
    Layout,
    Select,
    DatePicker,
    Tabs,
    Card,
    Statistic,
    Divider,
    Button,
    Radio, Row, Col,
} from 'antd';
import {Line, Pie} from '@ant-design/plots';
import 'antd/dist/reset.css';
import moment from "moment";

const { Header, Content } = Layout;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Group: RadioGroup } = Radio;

// 模拟当前时间
const getCurrentTime = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const BrandData = () => {
    // 状态管理
    const [activeTab, setActiveTab] = useState('brand'); // 品牌/门店收入切换
    const [timeRange, setTimeRange] = useState([moment('2026-01-05'), moment('2026-01-05')]); // 日期范围
    const [currentTime, setCurrentTime] = useState(getCurrentTime()); // 数据截止时间
    const [incomeType, setIncomeType] = useState('order'); // 实收金额构成切换
    const LineData = [
        { year: '1991', value: 3 },
        { year: '1992', value: 4 },
        { year: '1993', value: 3.5 },
        { year: '1994', value: 5 },
        { year: '1995', value: 4.9 },
        { year: '1996', value: 6 },
        { year: '1997', value: 7 },
        { year: '1998', value: 9 },
        { year: '1999', value: 13 },
    ];
    const LineData1 = [
        { time: '20260101', firstPay: 1500, repeatPay: 800 },
        { time: '20260102', firstPay: 2300, repeatPay: 1200 },
        { time: '20260103', firstPay: 1800, repeatPay: 950 },
        { time: '20260104', firstPay: 3200, repeatPay: 1500 },
    ];
    // 折线图配置
    const LineConfig1 = {
        data:LineData1,
        xField: 'year',
        yField: 'value',
        point: {
            shapeField: 'square',
            sizeField: 4,
        },
        interaction: {
            tooltip: {
                marker: false,
            },
        },
        style: {
            lineWidth: 2,
        },
    };
    // 数据卡片配置（统一格式）
    const cardList = [
        { title: '用户总数', value: '76', change: '0.00%', trend: 'none' },
        { title: '新增用户数', value: '0', change: '--', trend: 'up' },
        { title: '访问用户数', value: '0', change: '--', trend: 'up' },
        { title: '下单人数', value: '0', change: '--', trend: 'up' },
        { title: '首单用户数', value: '0', change: '--', trend: 'up' },
        { title: '首单订单数', value: '0', change: '--', trend: 'up' },
        { title: '首单实收金额', value: '0', change: '--', trend: 'up' },
        { title: '首单客单价', value: '0', change: '--', trend: 'up' },
        { title: '首单平均预约时长', value: '0', change: '--', trend: 'up' },
        { title: '复购用户数', value: '0', change: '--', trend: 'up' },
        { title: '复购订单数', value: '0', change: '--', trend: 'up' },
        { title: '复购实收金额', value: '0', change: '--', trend: 'up' },
        { title: '复购客单价', value: '0', change: '--', trend: 'up' },
        { title: '复购平均预约时长', value: '0', change: '--', trend: 'up' },
    ];
    // 刷新数据（模拟）
    const handleRefresh = () => {
        setCurrentTime(getCurrentTime());
    };
    const LineConfig = {
        data:LineData,
        xField: 'year',
        yField: 'value',
        point: {
            shapeField: 'square',
            sizeField: 4,
        },
        interaction: {
            tooltip: {
                marker: false,
            },
        },
        style: {
            lineWidth: 2,
        },
    };
    // 实收金额构成数据（按订单类型）
    const pieData = [
        { type: '预约订单', value: 0, percent: '0.0%' },
        { type: '卡券', value: 0, percent: '0.0%' },
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
        statistic: {
            title: {
                content: '实际收入',
                style: {
                    fontSize: '16px',
                    color: '#333',
                },
            },
            content: {
                content: '¥0',
                style: {
                    fontSize: '32px',
                    fontWeight: 'bold',
                },
            },
        },
        legend: {
            position: 'right',
            itemName: {
                style: {
                    fontSize: '14px',
                },
            },
            itemValue: {
                content: (item) => `${item.percent} ¥${item.value}`,
                style: {
                    fontSize: '14px',
                },
            },
        },
    };
    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
            <Content style={{ padding: '20px' }}>
                {/*/!* 顶部信息栏 *!/*/}
                {/*<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>*/}
                {/*    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>*/}
                {/*        <div style={{ display: 'flex', alignItems: 'center' }}>*/}
                {/*            <span>短信剩余</span>*/}
                {/*            <span style={{ margin: '0 10px', fontSize: '16px', fontWeight: 'bold' }}>242条</span>*/}
                {/*            <Button type="link" style={{ color: '#1890ff' }}>充值</Button>*/}
                {/*        </div>*/}
                {/*        <div style={{ display: 'flex', alignItems: 'center' }}>*/}
                {/*            <span>购买商品充值</span>*/}
                {/*            <span style={{ margin: '0 10px', fontSize: '16px', fontWeight: 'bold' }}>0元</span>*/}
                {/*            <Button type="link" style={{ color: '#1890ff' }}>充值</Button>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/* 筛选栏 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>门店</span>
                        <Select
                            defaultValue="初心阁自助茶室"
                            style={{ width: 200, marginLeft: '10px' }}
                            options={[{ value: '初心阁自助茶室', label: '初心阁自助茶室' }]}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button type="link" style={{ color: '#1890ff', fontWeight: 'bold' }}>实时</Button>
                        <Button type="link">昨日</Button>
                        <Button type="link">近7天</Button>
                        <Button type="link">本月</Button>
                        <Button type="link">上月</Button>
                    </div>
                    <RangePicker  onChange={setTimeRange} style={{ width: 220 }} />
                </div>

                {/* 实时数据区域 */}
                <Card style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <span style={{ marginRight: '10px' }}>实时数据</span>
                            <span style={{ color: '#1890ff' }}>今日</span>
                            <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ display: 'inline-block', marginLeft: '10px' }}>
                                <TabPane tab="品牌收入" key="brand" />
                                <TabPane tab="门店收入" key="store" />
                            </Tabs>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span>数据截止：{currentTime}</span>
                            <Button type="link" onClick={handleRefresh} style={{ marginLeft: '10px' }}>刷新</Button>
                        </div>
                    </div>

                    {/* 收入数据卡片 */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                        <Card style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ marginBottom: '10px', textAlign: 'left' }}>实际收入 &gt;</div>
                            <Statistic title="" value={0} />
                            <div style={{ color: '#888', fontSize: '12px' }}>较上周期 <span style={{ color: '#f5222d' }}>↑ --</span></div>
                        </Card>
                        <Card style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ marginBottom: '10px', textAlign: 'left' }}>微信收入 &gt;</div>
                            <Statistic title="" value={0} />
                            <div style={{ color: '#888', fontSize: '12px' }}>较上周期 <span style={{ color: '#f5222d' }}>↑ --</span></div>
                        </Card>
                        <Card style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ marginBottom: '10px', textAlign: 'left' }}>线下收款 &gt;</div>
                            <Statistic title="" value={0} />
                            <div style={{ color: '#888', fontSize: '12px' }}>较上周期 <span style={{ color: '#f5222d' }}>↑ --</span></div>
                        </Card>
                    </div>

                    {/* 实收金额构成 */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                            <span>实收金额构成</span>
                            <RadioGroup defaultValue="order" onChange={(e) => setIncomeType(e.target.value)} style={{ marginLeft: '10px' }}>
                                <Radio value="order">按订单类型</Radio>
                                <Radio value="pay">按支付方式</Radio>
                                <Radio value="channel">按渠道</Radio>
                            </RadioGroup>
                        </div>
                        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                            {/* 环形图 */}
                            <div style={{ width: '300px', height: '300px' }}>
                                <Pie {...pieConfig} />
                            </div>
                            {/* 总收入折线图（大屏风格，基于 Ant Design Charts Line 组件） */}
                            <div style={{ flex: 1, height: '300px', borderLeft: '1px solid #f0f0f0', paddingLeft: '40px' }}>
                                <div style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '500' }}>总收入(元)</div>
                                {/* 真正的大屏折线图组件 */}
                                <div style={{ height: '240px' }}>
                                    <Line {...LineConfig}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ padding: '20px', backgroundColor: '#fff' }}>
                        {/* 数据卡片区域（2行，每行6列，最后一行2列） */}
                        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                            {cardList.map((item, index) => (
                                <Col
                                    key={index}
                                    span={index < 12 ? 4 : 12} // 前12个占4列，后2个占12列
                                    style={{ display: 'flex' }}
                                >
                                    <Card style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{item.title}</div>
                                        <Statistic
                                            value={item.value}
                                            valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
                                        />
                                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>
                                            较上周期
                                            {item.trend === 'up' ? (
                                                <span style={{ color: '#f5222d', marginLeft: '4px' }}>↑ {item.change}</span>
                                            ) : (
                                                <span style={{ marginLeft: '4px' }}>{item.change}</span>
                                            )}
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* 双折线图区域 */}
                        <Card>
                            <div style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '500' }}>总收入(元)</div>
                            <Line {...LineConfig1}/>
                        </Card>
                    </div>
                </Card>
            </Content>
        </Layout>
    );
};

export default BrandData;