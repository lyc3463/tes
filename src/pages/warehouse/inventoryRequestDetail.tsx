import {
    Button,
    DatePicker,
    Form,
    Image,
    Input,
    InputNumber,
    List,
    message,
    Modal,
    Select,
    Space,
    Spin,
    Table
} from "antd";
import {useNavigate,history,connect} from "umi";
import {useCallback, useEffect, useRef, useState} from "react";
import {generate, getCurrentDate} from "@/utils/OpenTool";
import dayjs from "dayjs";
import * as InventoryRequest from '@/services/inventoryRequest';
import {AlignCenterOutlined} from "@ant-design/icons";
import NoInventoryRequestDetailPrint from "@/components/NoInventoryRequestDetailPrint";
import {useReactToPrint} from "react-to-print";

const InventoryRequestDetail=(props)=>{
    const navigate=useNavigate();
    const [spinning, setSpinning] = useState(false);
    const [form] = Form.useForm();
    // 随机单号
    const [stockCode,setOrderCode]=useState('');
    // 备注
    const [remark,setRemark]=useState('');
    // 获取当前时间
    const [stockTime, setOrderTime] = useState(getCurrentDate());
    // 仓库id
    const [warehouseId,setWarehouseId]=useState(0);
    // 库存的物品
    const [displayData, setDisplayData] = useState([]);
    // 采购人
    const [user_name,setUserName]=useState('');
    const [printVisible,setPrintVisible]=useState(false);
    const [warehouseName,setWarehouseName]=useState('');
    const [stockStatus,setStockStatus]=useState(0);
    const printRef = useRef();
    // 修复：创建行ref数组，直接引用每一行的DOM，避免操作表格实例
    const rowRefs = useRef<HTMLDivElement[]>([]);
    // 新增：存储已加载图片的行ID（避免重复加载）
    const [loadedImageIds, setLoadedImageIds] = useState<Set<string>>(new Set());
    // 交叉观察器实例
    const observerRef = useRef<IntersectionObserver | null>(null);
    const printProps = {
        orderCode:stockCode,
        warehouseName,
        orderTime:stockTime,
        user_name,
        displayData,
        stockStatus,
        type:1,
        title: '盘点单'
    };
    // 监听数据变化，重置图片加载状态
    useEffect(() => {
        rowRefs.current = displayData.map((_, index) => rowRefs.current[index] || null);
        setLoadedImageIds(new Set()); // 数据更新时清空已加载图片
        // 初始化交叉观察器
        initObserver();
    }, [displayData]);
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
    const columnsz = [
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
                        ? `http://ckimg.dyc10.com/${textStr}`
                        : `http://ckimg.dyc10.com/${textStr}_X.png`;
                }

                // 改用原生 img 标签（保留 AntD 的样式和 fallback 逻辑）
                return (
                    <div style={{width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <img
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
            title: '物品名称',
            dataIndex: 'productsName',
            key:'productsName',
        },
        {
            title: '物品编号',
            dataIndex: 'productsCode',
            key:'productsCode',
        },
        {
            title: '单位',
            dataIndex: 'unitsName',
            key:'unitsName',
        },
        {
            title:'盘点数量',
            dataIndex:'quantity',
            key:'quantity',
            ellipsis:true,
        },
        {
            title:'库存数量',
            dataIndex:'qq',
            key:'qq',
            ellipsis:true,
            render:(text,record)=>(
                <div>
                    {stockStatus==1?record.quantityKc2:record.quantityKc}
                </div>
            )
        },
        {
            title:'差异',
            dataIndex:'diffQuantity',
            key:'diffQuantity',
            ellipsis:true,
            render:(text,record)=>{
                return stockStatus==1?record.quantity-record.quantityKc2:record.quantity-record.quantityKc
            }
        },
    ];

    // 仓库列表
    const getWarehouseList=()=>{
        props.dispatch({
            type:"WarehouseList/fetch",
        })
    };
    const getOne=async (id:string)=>{
        setSpinning(true);
        let res:any=await  InventoryRequest.one(id);
        if (res.ErrorCode==0){
            let data=res.Data;
            console.log('详情',data);
            setSpinning(false);
            setDisplayData(data.spList)
            setOrderCode(data.stockCode);
            setStockStatus(data.stockStatus);
            setWarehouseId(data.warehouseId);
            setOrderTime(data.stockTime);
            setRemark(data.remark);
            setUserName(data.user_name);
        }else {
            message.error(res.Data);
            setSpinning(false);
        }
    };
    useEffect(() => {
        getWarehouseList();
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getOne(id);
    }, []);
    const isOpen=()=>{
        setPrintVisible(true);
        // 1. 动态获取仓库名称（修复硬编码）
        const warehouse = props.WarehouseList.find(w => w.id === warehouseId);
        setWarehouseName(warehouse?.warehouseName || '未知仓库');
    };
    // 自定义打印方法（处理内容隔离和样式）
    const handlePrint = useReactToPrint({
        contentRef: printRef,  // 使用 content 而不是 contentRef
        pageStyle: `
        @page {
            size: A4;
            margin: 2mm 20mm;
        }
        @media print {
            /* 分页样式 */
            .page-break {
                page-break-after: always;
            }
            /* 防止内容被分页截断 */
            .no-break {
                page-break-inside: avoid;
            }
            /* 隐藏 Modal 相关元素 */
            .ant-modal-wrap,
            .ant-modal-mask {
                display: none !important;
            }
            .ant-modal {
                position: static !important;
                width: 100% !important;
                margin: 0 !important;
            }
            .ant-modal-content {
                box-shadow: none !important;
                background: transparent !important;
            }
            .ant-modal-header,
            .ant-modal-footer {
                display: none !important;
            }
            .ant-modal-body {
                padding: 0 !important;
            }
            body *:not(.print-only-content):not(.print-only-content *) {
                        visibility: hidden;
                      }
        }
    `,
    });
    const changeProductID = useCallback((selectedId) => {
        console.log('选择的id', selectedId);

        // 1. 查找匹配项的索引
        const targetIndex = displayData.findIndex(item => item.id == selectedId);

        if (targetIndex === -1) {
            message.warning('未找到匹配的物品');
            return;
        }

        // 2. 使用行ref获取原生DOM元素，避免操作表格实例
        const targetRow = rowRefs.current[targetIndex];
        if (targetRow) {
            try {
                // 平滑滚动到目标行，避免非法调用
                targetRow.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });

                // 高亮效果
                targetRow.style.backgroundColor = '#e6f7ff';
                setTimeout(() => {
                    targetRow.style.backgroundColor = '';
                }, 3000);
            } catch (error) {
                console.error('滚动定位失败:', error);
                message.warning('定位失败，请手动查找');
            }
        } else {
            message.warning('目标行未加载完成，请稍等');
        }
    }, [displayData]);

    return(
        <Spin spinning={spinning}>
            <Space>
                <Button type="primary" onClick={()=>navigate(-1)}>
                    返回
                </Button>
                <Button
                    onClick={isOpen}
                    icon={<AlignCenterOutlined />} // 使用打印图标
                />
            </Space>
            <Space style={{display:'flex',justifyContent:'flex-start',alignItems:'center',marginTop:'10px'}}>
                <Input addonBefore="单号:" placeholder='随机生成' value={stockCode} disabled/>
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
                        时间:
                    </div>
                    <DatePicker defaultValue={dayjs(stockTime)} />
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
                        仓库:
                    </div>
                    <Select
                        placeholder='请选择入库仓库'
                        value={warehouseId}
                        options={Array.isArray(props.WarehouseList) && props.WarehouseList.length > 0
                            ? props.WarehouseList.map((item:any)=>({
                                label:item.warehouseName,
                                value:item.id,
                            }))
                            : []}
                    />
                </Space.Compact>
                <Input placeholder='备注' value={remark} maxLength={50} showCount/>
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
                        快速查询物品:
                    </div>
                    <Select
                        placeholder='请选择物品'
                        onChange={changeProductID}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            const item = displayData.find(unit => unit.id == option.value);
                            return item?.productsName?.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={Array.isArray(displayData) && displayData.length > 0
                            ? displayData.map((item:any)=>({
                                label:`${item.productsName}(${item.unitsName})`,
                                value:item.id,
                            }))
                            : []}
                    />
                </Space.Compact>
            </Space>
            <Table
                columns={columnsz}
                rowKey="id"  // 简化rowKey写法
                pagination={false}
                size='small'
                scroll={{y:'55vh'}}
                dataSource={displayData}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
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
            />
            <Modal
                open={printVisible}
                onCancel={()=>setPrintVisible(false)}
                width={1200}
                footer={[
                    <Button key="print" type="primary" onClick={handlePrint}>打印</Button>,
                    <Button key="cancel" onClick={()=>setPrintVisible(false)}>关闭</Button>
                ]}
            >
                <div className="print-only-content">
                    <NoInventoryRequestDetailPrint {...printProps} ref={printRef} className="print-only-content"/>
                </div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    ThingStockInfoList: state.ThingStockInfo.list,
    WarehouseList: state.WarehouseList.list,

});
export default connect(mapStateToProps)(InventoryRequestDetail);
