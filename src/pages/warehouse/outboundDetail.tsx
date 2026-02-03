import {
    Button,
    DatePicker,
    Image,
    Input,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tabs,
    Tag
} from "antd";
import {connect, history} from "umi";
import {useCallback, useEffect, useRef, useState} from "react";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
const OutboundDetail=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);  // 当前页数
    const [orderCode,setOrderCode]=useState(checkSessionStorage('/warehouse/outbound','outboundDetailOrderCode') ||'');// 采购单号
    const [productsName,setProductsName]=useState(checkSessionStorage('/warehouse/outbound','outboundDetailProductsName') ||'');// 物品名称
    const [startDate,setStartDate]=useState(checkSessionStorage('/warehouse/outbound','outboundDetailStartDate') ||'2000-01-01');// 开始时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/warehouse/outbound','outboundDetailEndDate') ||'2099-01-01');// 结束日期
    const [orderType,setOrderType]=useState(checkSessionStorage('/warehouse/outbound','outboundDetailOrderType') ||0);// 订单类型
    const [warehouseId,setWarehouseId]=useState(checkSessionStorage('/warehouse/outbound','outboundDetailWarehouseId')||0);// 仓库id
    const [unitId,setUnitId]=useState(checkSessionStorage('/warehouse/outbound','unitId')||0);// 单位id
    // 新增：存储已加载图片的行ID（避免重复加载）
    const [loadedImageIds, setLoadedImageIds] = useState<Set<string>>(new Set());
    // 行ref数组
    const rowRefs = useRef<HTMLDivElement[]>([]);
    // 交叉观察器实例
    const observerRef = useRef<IntersectionObserver | null>(null);
    const [pageSize,setPageSize]=useState(10); // 每页数量
    const columns=[
        {
            title:'出库时间',
            dataIndex:'created',
            key:'created',
            align:'center',
            render:(text)=>{
                return <div>{dayjs(text).format('YYYY-MM-DD')}</div>
            }
        },
        {
            title:'所属单号',
            dataIndex:'orderCode',
            key:'orderCode',
            align:'center',
            ellipsis:true,
        },
        {
            title:'出库仓库',
            dataIndex:'warehouseName',
            key:'warehouseName',
            align:'center',
        },
        {
            title:'物品名称',
            dataIndex:'productsName',
            key:'productsName',
            align:'center',
            ellipsis:true,
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
                        ? `http://img.qhwy6.com/${textStr}`
                        : `http://img.qhwy6.com/${textStr}_X.png`;
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
            title:'物品编号',
            dataIndex:'productsCode',
            key:'productsCode',
            align:'center',
            ellipsis:true,
        },
        {
            title:'出库类型',
            dataIndex:'orderType',
            key:'orderType',
            align:'center',
            ellipsis:true,
            render:(text)=>{
                // 定义类型配置：key=orderType值，value={文本, 颜色}
                const typeConfig = {
                    1: { text: '领用', color: 'blue' },
                    2: { text: '退货', color: 'green' },
                    3: { text: '报损', color: 'red' },
                    4: { text: '调拨', color: 'orange' },
                    5: { text: '销售', color: 'purple' },
                    6: { text: '跨店调拨', color: 'orange' },
                };
                // 获取当前类型配置，默认未知类型
                const config = typeConfig[text] || { text: '未知类型', color: 'default' };
                return <Tag color={config.color}>{config.text}</Tag>;
            }
        },
        {
            title:'出库数量',
            dataIndex:'quantity',
            key:'quantity',
            align:'center',
        },
        {
            title:'单位',
            dataIndex:'unitsName',
            key:'unitsName',
            align:'center',
        },
    ];
    // 列表信息
    const getList=()=>{
        props.dispatch({
            type:'OutboundDetail/fetch',
            payload:{page, pageSize, orderCode,productsName, startDate, endDate,orderType,warehouseId,unitId}
        })
    };
    // 分页信息
    const getFenye=()=>{
        props.dispatch({
            type:'OutboundDetail/fenye',
            payload:{pageSize, orderCode,productsName, startDate, endDate,orderType,warehouseId,unitId}
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
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getFenye();
        getUnitSettingList();
        getWarehouseList();
    }, []);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getFenye();
        getList();
    };
    // 物品名称改变
    const changeProductsName=(e)=>{
        setProductsName(e.target.value);
        updateSessionStorage('/warehouse/outbound','outboundDetailProductsName',e.target.value);
    };
    // 单号改变
    const changeOrderCode=(e)=>{
        setOrderCode(e.target.value);
        updateSessionStorage('/warehouse/outbound','outboundDetailOrderCode',e.target.value);
    };
    // 单号改变
    const changeOrderType=(e)=>{
        setOrderType(e);
        updateSessionStorage('/warehouse/outbound','outboundDetailOrderType',e);
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/outbound','outboundDetailStartDate','2000-01-01');
            updateSessionStorage('/warehouse/outbound','outboundDetailEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/outbound','outboundDetailStartDate',data[0]);
            updateSessionStorage('/warehouse/outbound','outboundDetailEndDate',data[1]);
        }
    };

    // 单位id
    const changeUnitId=(e)=>{
        updateSessionStorage('/warehouse/outbound','unitId',e);
        setUnitId(e);
    };
    // 仓库名称
    const changeWarehouse=(e)=>{
        updateSessionStorage('/warehouse/outbound','outboundDetailWarehouseId',e);
        setWarehouseId(e);
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
                            placeholder='请选择仓库'
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
                    <Input
                        addonBefore="物品名称:"
                        value={productsName}
                        onChange={changeProductsName}
                    />
                    <Input
                        addonBefore="单号:"
                        value={orderCode}
                        onChange={changeOrderCode}
                    />
                </Space>
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
                                单位:
                            </div>
                            <Select
                                style={{width:120}}
                                placeholder='请选择单位'
                                value={unitId}
                                onChange={changeUnitId}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    // 假设每个 option 都有一个与数据项对应的 value 属性
                                    const item = props.UnitSettingList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                                    return item?.unitsName?.toLowerCase().includes(input.toLowerCase());
                                }}
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
                                日期:
                            </div>
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
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
                                value={orderType}
                                onChange={changeOrderType}
                            >
                                <Select.Option value={0}>全部</Select.Option>
                                <Select.Option value={1}>领用</Select.Option>
                                <Select.Option value={2}>退货</Select.Option>
                                <Select.Option value={3}>报损</Select.Option>
                                <Select.Option value={5}>销售</Select.Option>
                                <Select.Option value={4}>调拨</Select.Option>
                                <Select.Option value={6}>跨店调拨</Select.Option>
                            </Select>
                        </Space.Compact>
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
                scroll={{y:'60vh',x:1500}}
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
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                            <Table.Summary.Cell index={4}></Table.Summary.Cell>
                            <Table.Summary.Cell index={5}></Table.Summary.Cell>
                            <Table.Summary.Cell index={6}></Table.Summary.Cell>
                            <Table.Summary.Cell index={7}></Table.Summary.Cell>
                            <Table.Summary.Cell index={8}><div style={{width:"100%",textAlign:'center'}}>{props.count?props.count.quantitySum:0}</div></Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.OutboundDetail.list,
    count: state.OutboundDetail.count,
    UnitSettingList: state.UnitSetting.list,
    WarehouseList: state.WarehouseList.list,

});
export default connect(mapStateToProps)(OutboundDetail);
