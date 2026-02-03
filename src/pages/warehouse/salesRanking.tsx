import {connect} from "@@/exports";
import {useEffect, useState} from "react";
import {Button, DatePicker, Image, Input, List, Space, Spin, Table} from "antd";
import dayjs from "dayjs";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const SalesRanking = (props) => {
    const [warehouseName, setWarehouseName] = useState(checkSessionStorage('/warehouse/thingTurnoverRate','salesRankingWarehouseName') ||'');
    const [productsName, setProductsName] = useState(checkSessionStorage('/warehouse/thingTurnoverRate','salesRankingProductsName') ||'');
    const [startDate, setStartDate] = useState(checkSessionStorage('/warehouse/thingTurnoverRate','salesRankingStartDate') ||'2000-01-01');
    const [endDate, setEndDate] = useState(checkSessionStorage('/warehouse/thingTurnoverRate','salesRankingEndDate') ||'2099-01-01');
    const [spinning, setSpinning] = useState(false);
    const getList=()=>{
        setSpinning(true);
        props.dispatch({
            type:'SalesRanking/fetch',
            payload:{warehouseName, productsName, startDate, endDate}
        })
        setSpinning(false);
    };
    useEffect(() => {
        getList();
    }, []);
    // 仓库名称改变
    const changeWarehouseName=(e)=>{
        setProductsName(e.target.value);
        updateSessionStorage('/warehouse/thingTurnoverRate','salesRankingWarehouseName',e.target.value);
    };
    // 物品名称
    const changeProductsName=(e)=>{
        setProductsName(e.target.value);
        updateSessionStorage('/warehouse/thingTurnoverRate','salesRankingProductsName',e.target.value);
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/thingTurnoverRate','salesRankingStartDate','2000-01-01');
            updateSessionStorage('/warehouse/thingTurnoverRate','salesRankingEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/thingTurnoverRate','salesRankingStartDate',data[0]);
            updateSessionStorage('/warehouse/thingTurnoverRate','salesRankingEndDate',data[1]);
        }
    };
    const sousuo=()=>{
        getList();
    };
    // 表格列配置
    const columns = [
        {
            title: '日期',
            dataIndex: 'rkTime',
            ellipsis: true,
            render: (text: string) => (
                dayjs(text).format('YYYY-MM-DD')
            ),
        },
        {
            title: '物品图片',
            dataIndex: 'productsImageBase64',
            ellipsis: true,
            render: (text: string) => (
                <Image src={text} style={{width:'50px',height:'50px'}}/>
            ),
        },
        {
            title: '物品名称',
            dataIndex: 'productsName',
            ellipsis: true,
        },
        {
            title: '物品编码',
            dataIndex: 'productsCode',
            ellipsis: true,
        },
        {
            title: '销售数量',
            dataIndex: 'quantitySum',
            ellipsis: true,
            render: (text: number, record: any) => {
                const quantity = Math.round(text); // 取整最小单位数量
                const unitsList = record.unitsList;

                // 边界处理：无单位列表或数量为0时直接返回原始值
                if (!Array.isArray(unitsList) || unitsList.length === 0 || quantity <= 0) {
                    return `${quantity}${unitsList?.[0]?.unitsName || record.unitsName}`;
                }

                // 1. 构建单位映射表（按from_unit_id索引）
                const unitsMap = unitsList.reduce((map: Record<number, any>, unit: any) => {
                    map[unit.from_unit_id] = unit;
                    return map;
                }, {});

                // 2. 找到最小单位（to_unit_id为0的单位）
                const baseUnit = unitsList.find((unit: any) => unit.to_unit_id === 0);
                if (!baseUnit) return `${quantity}单位未知`;

                // 3. 构建单位层级链（从最小到最大）
                const unitChain: any[] = [];
                let currentUnit: any = baseUnit;
                while (currentUnit) {
                    unitChain.push(currentUnit);
                    // 查找父单位（to_unit_id指向当前单位的from_unit_id）
                    currentUnit = unitsList.find((unit: any) => unit.to_unit_id === currentUnit.from_unit_id);
                }
                // 反转层级，从最大单位到最小单位
                const sortedUnits = unitChain.reverse();

                let remaining = quantity;
                const result: string[] = [];

                // 4. 按单位层级从大到小换算
                sortedUnits.forEach((unit) => {
                    // 计算当前单位到最小单位的换算系数（如：吨→千克→克的总换算率）
                    let conversionFactor = unit.conversion_rate;
                    let nextUnit = unitsMap[unit.to_unit_id];

                    // 累乘下级单位的换算率，直到最小单位
                    while (nextUnit && nextUnit.to_unit_id !== 0 && nextUnit.conversion_rate > 0) {
                        conversionFactor *= nextUnit.conversion_rate;
                        nextUnit = unitsMap[nextUnit.to_unit_id];
                    }

                    // 避免除以0错误
                    if (conversionFactor <= 0) return;

                    // 计算当前单位数量及剩余数量
                    const unitQuantity = Math.floor(remaining / conversionFactor);
                    if (unitQuantity > 0 || (result.length === 0 && unit === sortedUnits[sortedUnits.length - 1])) {
                        result.push(`${unitQuantity}${unit.unitsName}`);
                    }
                    remaining = remaining % conversionFactor;
                });

                return result.join('');
            },
        },
    ];
    return (
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="物品名称:"
                            value={productsName}
                            onChange={changeProductsName}
                        />
                        <Input
                            addonBefore="仓库名称:"
                            value={warehouseName}
                            onChange={changeWarehouseName}
                        />
                        <Space.Compact>
                            <div
                                style={{
                                    borderRadius: '6px',
                                    borderStartEndRadius: 0,
                                    borderEndEndRadius: 0,
                                    padding: '0 11px',
                                    border: '1px solid #d9d9d9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                }}
                            >
                                日期:
                            </div>
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(record:any, index:number) => index}  // 仅在无其他唯一标识时使用索引
                pagination={false}
                dataSource={props.list}
                size='small'
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.SalesRanking.list,

});
export default connect(mapStateToProps)(SalesRanking);