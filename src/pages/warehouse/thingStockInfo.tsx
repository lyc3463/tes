import {Button, DatePicker, Input, List, Pagination, Select, Space, Spin, Table, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {connect} from "umi";
import dayjs from "dayjs";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import {DownOutlined, MinusOutlined, UpOutlined} from "@ant-design/icons";

const ThingStockInfo=(props)=>{
    const [spinning, setSpinning] = useState(false);
    const [page,setPage]=useState(1);
    const [warehouseId,setWarehouseId]=useState(checkSessionStorage('/warehouse/thingStock','warehouseId')||0);// 仓库id
    const [productsName,setProductsName]=useState(checkSessionStorage('/warehouse/thingStock','productsName')||'');// 物品名称
    const [startDate,setStartDate]=useState(checkSessionStorage('/warehouse/thingStock','startDate')||'2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStorage('/warehouse/thingStock','endDate')||'2099-01-01');// 结束日期
    const [pageSize,setPageSize]=useState(50); // 每页数量
    const columns = [
        {
            title: '所属仓库',
            dataIndex: 'warehouseName',
            ellipsis: true,
        },
        {
            title: '入库时间',
            dataIndex: 'warehousingTime',
            ellipsis: true,
            render:(text)=>{
                return dayjs(text).format('YYYY-MM-DD');
            }
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
            title: '单位',
            dataIndex: 'unitsName',
        },
        {
            title: '库存数量',
            dataIndex: 'quantity',
        },
        {
            title: '当前入库价(元)',
            dataIndex: 'price',
            render: (text: number, record: any) => (
                <Tooltip
                    title={record.lastPrice !== undefined ? `上次价格: ${record.lastPrice}元` : ''}
                    placement="top"
                >
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {text}
                    {record.lastPrice !== undefined && (
                        record.price > record.lastPrice ? (
                            <UpOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
                        ) : record.price < record.lastPrice ? (
                            <DownOutlined style={{ color: '#f5222d', fontSize: '12px' }} />
                        ) : (
                            <MinusOutlined style={{ color: '#bfbfbf', fontSize: '12px' }} />
                        )
                    )}
                </span>
                </Tooltip>
            )
        },
        {
            title: '入库最高价(元)',
            dataIndex: 'maxPrice',
        },
        {
            title: '入库最低价(元)',
            dataIndex: 'minPrice',
        },
        {
            title: '仓库平均价(元)',
            dataIndex: 'avePrice',
        },
    ];
    // 监听分页
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    // 列表信息
    const getList=()=>{
        props.dispatch({
            type:'ThingStockInfo/fetch',
            payload:{page, pageSize, warehouseId, productsName, startDate, endDate}
        })
    };
    // 分页信息
    const getFenye=()=>{
        props.dispatch({
            type:'ThingStockInfo/fenye',
            payload:{pageSize, warehouseId, productsName, startDate, endDate}
        })
    };
    // 仓库列表
    const getWarehouseList=()=>{
        props.dispatch({
            type:'WarehouseList/fetch',
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getFenye();
        getWarehouseList();
    }, []);
    const changeWarehouse=(e)=>{
        updateSessionStorage('/warehouse/thingStock','warehouseId',e);
        setWarehouseId(e);
    };
    const sousuo=()=>{
        setPage(1);
        getList();
        getFenye();
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/thingStock','startDate','2000-01-01');
            updateSessionStorage('/warehouse/thingStock','endDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/thingStock','startDate',data[0]);
            updateSessionStorage('/warehouse/thingStock','endDate',data[1]);
        }
    };
    const changeProductsName=(e)=>{
        updateSessionStorage('/warehouse/thingStock','productsName',e.target.value);
        setProductsName(e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
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
                                所属仓库:
                            </div>
                            <Select
                                style={{width:120}}
                                placeholder='请选择入库仓库'
                                value={warehouseId}
                                onChange={changeWarehouse}
                                // 添加"全部"选项并保留原有仓库列表
                                options={[
                                    { label: '全部', value: 0 }, // 新增"全部"选项
                                    ...(Array.isArray(props.WarehouseList) && props.WarehouseList.length > 0
                                        ? props.WarehouseList.map((item: any) => ({
                                            label: item.warehouseName,
                                            value: item.id,
                                        }))
                                        : [])
                                ]}
                            />
                        </Space.Compact>
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
                                入库时间:
                            </div>
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
                        </Space.Compact>
                        <Input
                            addonBefore="物品名称:"
                            value={productsName}
                            onChange={changeProductsName}
                        />
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                scroll={{y:'60vh'}}
                dataSource={props.list}
                rowKey={(columns) => columns.id}
                size='small'
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.ThingStockInfo.list,
    count: state.ThingStockInfo.count,
    WarehouseList: state.WarehouseList.list,

});
export default connect(mapStateToProps)(ThingStockInfo);
