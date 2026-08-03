import {connect} from "umi";
import {useCallback, useEffect, useRef, useState} from "react";
import dayjs from "dayjs";
import {
    Button,
    DatePicker, Image,
    Input,
    InputNumber,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag
} from "antd";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const InventoryReport=(props:any)=>{
    const [spinning,setSpinning]=useState(false);
    // 仓库名称
    const [warehouseName,setWarehouseName]=useState(checkSessionStorage('/warehouse/paymentManagement','inventoryReportWarehouseName')||'');
    // 物品名称
    const [itemName,setItemName]=useState(checkSessionStorage('/warehouse/paymentManagement','inventoryReportItemName')||'');
    // 开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/warehouse/paymentManagement','inventoryReportStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/warehouse/paymentManagement','inventoryReportEndDate')||'2099-01-01');
    // 新增：存储已加载图片的行ID（避免重复加载）
    const [loadedImageIds, setLoadedImageIds] = useState<Set<string>>(new Set());
    const observerRef = useRef<IntersectionObserver | null>(null);
    const rowRefs = useRef<HTMLDivElement[]>([]);


    const columns=[
        {
            title:'所属仓库',
            dataIndex:'warehouseName',
            key:'warehouseName',
            align:'center',
            ellipsis: true,
        },
        {
            title: '物品图片',
            dataIndex: 'productsImage',
            ellipsis: true,
            render: (text: string, record: any) => {
                // 核心修复：先将text转为字符串，再做空值+后缀判断
                // 步骤1：处理非字符串类型（如null/undefined/数字），转为空字符串
                const textStr = String(text || '');

                // 步骤2：判断是否以.png结尾（仅当字符串非空时判断）
                const imageUrl = textStr && textStr.endsWith('.png')
                    ? `${window.ServerConfig.imgServer}${textStr}`
                    : `${window.ServerConfig.imgServer}${textStr}_X.png`;
                // 步骤3：仅当字符串非空时渲染图片，否则返回空
                return textStr ? (
                    <Image
                        src={imageUrl}
                        style={{width:'50px',height:'50px'}}
                        fallback="https://placeholder.pics/svg/50x50/EEEEEE/999999/暂无图片"
                    />
                ) : (
                    ''
                );
            }
        },
        {
            title:'物品编码',
            dataIndex:'productsCode',
            key:'productsCode',
            align:'center',
            ellipsis: true,
        },
        {
            title:'物品名称',
            dataIndex:'productsName',
            key:'productsName',
            align:'center',
            ellipsis: true,
        },
        {
            title:'数量总和',
            dataIndex:'quantitySum',
            key:'quantitySum',
            align:'center',
            ellipsis: true,
        },
        {
            title:'单位',
            dataIndex:'unitsName',
            key:'unitsName',
            align:'center',
            ellipsis: true,
        },
        {
            title:'单价总和',
            dataIndex:'priceSum',
            key:'priceSum',
            align:'center',
            ellipsis: true,
        },
        {
            title:'总价钱',
            dataIndex:'totalPrice',
            key:'totalPrice',
            align:'center',
            ellipsis: true,
            render:(text,record)=>{
                return <span>{(record.priceSum*record.quantitySum).toFixed(2)}</span>
            }
        },
    ];
    // 列表信息
    const getList=()=>{
        props.dispatch({
            type:'InventoryReport/fetch',
            payload:{ warehouseName, itemName, startDate, endDate}
        })
    };
    useEffect(() => {
        getList();
    }, []);
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/paymentManagement','inventoryReportStartDate','2000-01-01');
            updateSessionStorage('/warehouse/paymentManagement','inventoryReportEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/paymentManagement','inventoryReportStartDate',data[0]);
            updateSessionStorage('/warehouse/paymentManagement','inventoryReportEndDate',data[1]);
        }
    };
    const changeWarehouseName=(e)=>{
        setWarehouseName(e.target.value);
        updateSessionStorage('/warehouse/paymentManagement','inventoryReportWarehouseName',e.target.value);
    };
    const changeItemName=(e)=>{
        setItemName(e.target.value);
        updateSessionStorage('/warehouse/paymentManagement','inventoryReportItemName',e.target.value);
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
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="仓库名称:"
                            value={warehouseName}
                            onChange={changeWarehouseName}
                        />
                        <Input
                            addonBefore="物品名称:"
                            value={itemName}
                            onChange={changeItemName}
                        />
                        {/*<Space.Compact>*/}
                        {/*    <div*/}
                        {/*        style={{*/}
                        {/*            borderRadius: '6px',*/}
                        {/*            borderStartEndRadius: 0,*/}
                        {/*            borderEndEndRadius: 0,*/}
                        {/*            padding: '0 11px',*/}
                        {/*            border: '1px solid #d9d9d9',*/}
                        {/*            display: 'flex',*/}
                        {/*            alignItems: 'center',*/}
                        {/*            borderInlineEnd: 0,*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        日期:*/}
                        {/*    </div>*/}
                        {/*    {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}*/}
                        {/*</Space.Compact>*/}
                        <Button type="primary" onClick={()=>getList()}>
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
                rowKey={(record:any, index:number) => index}  // 仅在无其他唯一标识时使用索引
                size='small'
                onRow={(record, index) => ({
                    ref: (el) => {
                        if (el) {
                            el.dataset.rowId = index; // 存储行ID
                            rowRefs.current[index] = el;
                            // 观察该行元素
                            observerRef.current?.observe(el);
                        }
                    },
                })}
            />
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.InventoryReport.list,
});
export default connect(mapStateToProps)(InventoryReport);
