import {Button, DatePicker, Image, Input, List, Pagination, Select, Space, Spin, Table, Tooltip} from "antd";
import {useCallback, useEffect, useRef, useState} from "react";
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
    const [unitId,setUnitId]=useState(checkSessionStorage('/warehouse/thingStock','unitId')||0);// 单位id
    const [pageSize,setPageSize]=useState(50); // 每页数量
    // 新增：存储已加载图片的行ID（避免重复加载）
    const [loadedImageIds, setLoadedImageIds] = useState<Set<string>>(new Set());
    // 行ref数组
    const rowRefs = useRef<HTMLDivElement[]>([]);
    // 交叉观察器实例
    const observerRef = useRef<IntersectionObserver | null>(null);
    const columns = [
        {
            title: '所属仓库',
            dataIndex: 'warehouseName',
            ellipsis: true,
        },
        {
            title: '物品图片',
            dataIndex: 'productsImage',
            ellipsis: true,
            render: (text: string, record: any) => {
                const isImageLoaded = loadedImageIds.has(record.id.toString());
                let imageUrl = '';
                if (isImageLoaded && text) {
                    const textStr = String(text || '');
                    imageUrl = textStr && textStr.endsWith('.png')
                        ? `${window.ServerConfig.imgServer}${textStr}`
                        : `${window.ServerConfig.imgServer}${textStr}_X.png`;
                }

                // 改用原生 img 标签（保留 AntD 的样式和 fallback 逻辑）
                return (
                    <div style={{width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Image
                            src={imageUrl || 'https://placeholder.pics/svg/50x50/EEEEEE/999999/加载中...'}
                            style={{width: '100%', height: '100%', objectFit: 'cover'}}
                            alt="物品图片"
                            // 原生懒加载属性（正确用法：字符串值 'lazy'）
                            loading="lazy"
                            // fallback 逻辑：图片加载失败时显示占位图
                            onError={(e) => {
                                e.target.src = 'https://placeholder.pics/svg/50x50/EEEEEE/999999/暂无图片';
                            }}
                        />
                    </div>
                );
            }
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
            payload:{page, pageSize, warehouseId, productsName, startDate, endDate,unitId}
        })
    };

    // 单位列表
    const getUnitSettingList=()=>{
        props.dispatch({
            type:'UnitSetting/fetch',
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
        getWarehouseList();
        getUnitSettingList();
    }, []);
    const changeWarehouse=(e)=>{
        updateSessionStorage('/warehouse/thingStock','warehouseId',e);
        setWarehouseId(e);
    };
    // 单位id
    const changeUnitId=(e)=>{
        updateSessionStorage('/warehouse/thingStock','unitId',e);
        setUnitId(e);
    };
    const sousuo=()=>{
        setPage(1);
        getList();
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
    // 监听数据变化，重置图片加载状态
    useEffect(() => {
        setLoadedImageIds(new Set());
        // 初始化交叉观察器
        initObserver();
    }, []);

    // 初始化交叉观察器：检测行是否进入可视区域
    const initObserver = useCallback(() => {
        // 销毁旧的观察器
        if (observerRef.current) {
            observerRef.current.disconnect();
        }
        // 创建新的观察器：元素进入可视区域时加载图片
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const rowId = entry.target.dataset.rowId;
                        if (rowId && !loadedImageIds.has(rowId)) {
                            // 标记为已加载，触发重新渲染
                            setLoadedImageIds(prev => new Set(prev).add(rowId));
                        }
                    }
                });
            },
            {
                root: document.querySelector('.ant-table-body'), // 表格滚动容器
                rootMargin: '20px', // 提前20px加载（预加载）
                threshold: 0.1 // 元素10%进入可视区域时触发
            }
        );
        // 观察所有行元素
        rowRefs.current.forEach((rowEl) => {
            if (rowEl) {
                observerRef.current?.observe(rowEl);
            }
        });
    }, [loadedImageIds]);

    // 清理观察器
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);
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
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    // 假设每个 option 都有一个与数据项对应的 value 属性
                                    const item = props.WarehouseList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                                    return item?.warehouseName?.toLowerCase().includes(input.toLowerCase());
                                }}
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
                                单位:
                            </div>
                            <Select
                                style={{width:120}}
                                placeholder='请选择单位'
                                value={unitId}
                                onChange={changeUnitId}
                                // 添加"全部"选项并保留原有仓库列表
                                options={[
                                    { label: '全部', value: 0 }, // 新增"全部"选项
                                    ...(Array.isArray(props.UnitSettingList) && props.UnitSettingList.length > 0
                                        ? props.UnitSettingList.map((item: any) => ({
                                            label: item.unitsName,
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
                onRow={(record, index) => ({
                    ref: (el) => {
                        if (el) {
                            el.dataset.rowId = record.id; // 存储行ID
                            rowRefs.current[index] = el;
                            // 观察该行元素
                            observerRef.current?.observe(el);
                        }
                    },
                })}
                summary={(columns) => (
                    <Table.Summary >
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={1}>统计</Table.Summary.Cell>
                            <Table.Summary.Cell index={0}></Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                            <Table.Summary.Cell index={4}></Table.Summary.Cell>
                            <Table.Summary.Cell index={5}></Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>{props.count?props.count.quantitySum:0}</Table.Summary.Cell>
                            <Table.Summary.Cell index={7}>{props.count?props.count.priceSum:0}</Table.Summary.Cell>
                            <Table.Summary.Cell index={8}>{props.count?props.count.maxPriceSum:0}</Table.Summary.Cell>
                            <Table.Summary.Cell index={8}>{props.count?props.count.minPriceSum:0}</Table.Summary.Cell>
                            <Table.Summary.Cell index={8}>{props.count?props.count.avePriceSum:0}</Table.Summary.Cell>

                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.ThingStockInfo.list,
    count: state.ThingStockInfo.count,
    WarehouseList: state.WarehouseList.list,
    UnitSettingList: state.UnitSetting.list,

});
export default connect(mapStateToProps)(ThingStockInfo);
