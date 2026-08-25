import * as ThingStockInfoServer from '@/services/thingStockInfo';
import { checkSessionStorage, updateSessionStorage } from '@/utils/OpenTool';
import dayjs from 'dayjs';
import {connect} from 'umi';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Image,Table,Spin, List, Space, Select, Input, DatePicker, Button, Pagination} from 'antd';


const InAndOutDetails=(props)=>{
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);
    const [quantitySum, setQuantitySum] = useState(0);
    const [warehouseId, setWarehouseId] = useState(checkSessionStorage('/warehouse/thingStock','inAndOutDetailsWarehouseId')||0);// 仓库id
    const [productsName, setProductsName] = useState(checkSessionStorage('/warehouse/thingStock','inAndOutDetailsProductsName')||'');// 物品名称
    const [startDate, setStartDate] = useState(checkSessionStorage('/warehouse/thingStock','inAndOutDetailsStartDate')||'2000-01-01');// 开始时间
    const [endDate, setEndDate] = useState(checkSessionStorage('/warehouse/thingStock','inAndOutDetailsEndDate')||'2099-01-01');// 结束时间
    const [typeId, setTypeId] = useState(checkSessionStorage('/warehouse/thingStock','inAndOutDetailsTypeId')||0);//出入类型
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
                        : `${window.ServerConfig.imgServer}${textStr}_min.png`;
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
                            preview={{
                                src: `${window.ServerConfig.imgServer}${record.productsImage}.png`, // 弹窗预览图单独指定
                            }}
                        />
                    </div>
                );
            }
        },
        {
            title: '日期',
            dataIndex: 'created',
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
            title: '单位',
            dataIndex: 'unitsName',
        },
        {
            title: '类型',
            dataIndex: 'operateType',
            ellipsis: true,
            render:(text)=>{
                switch(text){
                    case 1:
                        return '采购入库';
                    case 2:
                        return '直接入库';  
                    case 3:
                        return '领用';
                    case 4:
                        return '退货';
                    case 5:
                        return '报损';
                    case 6:
                        return '销售';  
                    case 7:
                        return '调拨入库';
                    case 8:
                        return '调拨出库';
                    case 9:
                        return '跨门店调拨入库';  
                    case 10:
                        return '跨门店调拨出库';
                    case 11:
                        return '拆分入';
                    case 12:
                        return '拆分出';
                    case 13:
                        return '合并入';
                    case 14:
                        return '合并出';
                    default:
                        return '未知类型';
                }
            }
        },
        {
            title: '数量',
            dataIndex: 'quantity',
        },
        
        {
            title: '变化前库存',
            dataIndex: 'beforeQuantity',
        },
        {
            title: '变化后库存',
            dataIndex: 'afterQuantity',
        },
        {
            title: '操作人',
            dataIndex: 'user_name',
        },
    ];
    // 监听数据变化，重置图片加载状态
    useEffect(() => {
        setLoadedImageIds(new Set());
        // 初始化交叉观察器
        initObserver();
        getWarehouseList();
    }, []);
        // 仓库列表
    const getWarehouseList=()=>{
        props.dispatch({
            type:'WarehouseList/fetch',
        })
    };
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
    // 获取进出明细数据
    const fetchInAndOutDetails = async () => {
        setLoading(true);
        try {
            const res = await ThingStockInfoServer.InAndOutDetailsServer({page,warehouseId, productsName,startDate,endDate,pageSize,typeId});
             if (res.ErrorCode==0) {
                console.log('详情',res.Data);
                setDataSource(res.Data.data);
                setCount(res.Data.count);
                setQuantitySum(res.Data.totalPriceSum);
             }
        } catch (error) {
            console.error('Error fetching in and out details:', error);
        } finally {
            setLoading(false);
        }
    };
    const changeWarehouse=(e)=>{
        updateSessionStorage('/warehouse/thingStock','inAndOutDetailsWarehouseId',e);
        setWarehouseId(e);
    };
    const changeType=(e)=>{
        updateSessionStorage('/warehouse/thingStock','inAndOutDetailsTypeId',e);
        setTypeId(e);
    };
     // 监听分页
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/thingStock','inAndOutDetailsStartDate','2000-01-01');
            updateSessionStorage('/warehouse/thingStock','inAndOutDetailsEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/inAndOutDetailsStartDate','startDate',data[0]);
            updateSessionStorage('/warehouse/inAndOutDetailsEndDate','endDate',data[1]);
        }
    };
    const changeProductsName=(e)=>{
        updateSessionStorage('/warehouse/thingStock','inAndOutDetailsProductsName',e.target.value);
        setProductsName(e.target.value);
    };
    const sousuo=()=>{
        setPage(1);
        fetchInAndOutDetails();
    };
    useEffect(() => {
        fetchInAndOutDetails();
    }, [page, pageSize, warehouseId, productsName, startDate, endDate, typeId]);
    return(
       <Spin spinning={loading}>
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
                                类型:
                            </div>
                            <Select
                                style={{width:120}}
                                placeholder='请选择类型'
                                value={ typeId }
                                onChange={changeType}
                                optionFilterProp="children"
                                options={[
                                    { label: '全部', value: 0 }, 
                                    { label: '采购入库', value: 1 }, 
                                    { label: '直接入库', value: 2 }, 
                                    { label: '领用', value: 3 }, 
                                    { label: '退货', value: 4 }, 
                                    { label: '报损', value: 5 }, 
                                    { label: '销售', value: 6 }, 
                                    { label: '调拨入库', value: 7 }, 
                                    { label: '调拨出库', value: 8 }, 
                                    { label: '跨店调拨入库', value: 9 }, 
                                    { label: '跨店调拨出库', value: 10 }, 
                                    { label: '拆分入', value: 11 }, 
                                    { label: '拆分出', value: 12 },
                                    { label: '合并入', value: 13 },
                                    { label: '合并出', value: 14 },
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
                                日期:
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
                dataSource={dataSource}
                rowKey={(record:any, index:number) => index}
                size='small'
                onRow={(record:any, index:number) => ({
                    ref: (el:any) => {
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
                            <Table.Summary.Cell index={6}>{quantitySum}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
       
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    WarehouseList: state.WarehouseList.list,

});
export default connect(mapStateToProps)(InAndOutDetails); ;