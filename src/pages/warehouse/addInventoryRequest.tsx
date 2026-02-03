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
import {useNavigate, history, connect} from "umi";
import {useEffect, useState, useRef, useCallback, useMemo} from "react";
import {generate, getCurrentDate} from "@/utils/OpenTool";
import {StaticInfo} from "@/StaticInfo";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const AddInventoryRequest=(props)=>{
    const navigate=useNavigate();
    const [spinning, setSpinning] = useState(false);
    const [form] = Form.useForm();
    const [stockCode,setOrderCode]=useState('');
    const [remark,setRemark]=useState('');
    const [stockTime, setOrderTime] = useState(getCurrentDate());
    const [warehouseId,setWarehouseId]=useState(0);
    const [displayData, setDisplayData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    // 新增：存储已加载图片的行ID（避免重复加载）
    const [loadedImageIds, setLoadedImageIds] = useState<Set<string>>(new Set());
    // 行ref数组
    const rowRefs = useRef<HTMLDivElement[]>([]);
    // 交叉观察器实例
    const observerRef = useRef<IntersectionObserver | null>(null);
    useEffect(() => {
        setOrderCode(generate(StaticInfo.park_name));
    }, []);

    // 监听数据变化，重置图片加载状态
    useEffect(() => {
        rowRefs.current = displayData.map((_, index) => rowRefs.current[index] || null);
        setLoadedImageIds(new Set());
        // 初始化交叉观察器
        initObserver();
    }, [displayData]);

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
    ];

    const changeDate=(date:dayjs.Dayjs,item:string)=>{
        setOrderTime(item);
    };

    const getList=(e:number)=>{
        setSpinning(true);
        props.dispatch({
            type:'ThingStockInfo/fetch',
            payload:{page:1, pageSize:10000, warehouseId:e, productsName:'', startDate:'2000-01-01', endDate:'2099-01-01',unitId:0}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('res.Data',res.Data);
                let newArr=res.Data.map((item:any)=>{
                    return {
                        ...item,
                        isZk: 1,
                        inventoryId: item.id,
                        discountRateDp:100,
                        discountPriceDp: 0,
                        quantity:0
                    }
                })
                setDisplayData(newArr);
                setSpinning(false);
            }else {
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };

    const getWarehouseList=()=>{
        props.dispatch({
            type:"WarehouseList/fetch",
        })
    };

    const changeWarehouse=(e)=>{
        setWarehouseId(e);
        getList(e);
    };

    useEffect(() => {
        getWarehouseList();
    }, []);

    const onOK=()=>{
        if (stockTime==='') return message.warning('请选择申请时间');
        if (warehouseId===0) return message.warning('请先选择仓库');
        let newArr = selectedRowKeys.length === 0 ? displayData : displayData.filter((item)=>!selectedRowKeys.includes(item.id));
        if (newArr.length === 0) return message.warning('请先选择需要申请的物品');
        let jsonData = JSON.stringify(newArr);
        console.log('jsonData',newArr);
        setSpinning(true);
        props.dispatch({
            type:'InventoryRequest/add',
            payload:{warehouseId, stockCode, stockTime, jsonData, remark}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                setSpinning(false);
                history.push('/warehouse/inventory');
            }else {
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };

    const changeRemark=(e)=>{
        setRemark(e.target.value);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[], selectedRows: any[]) => {
            setSelectedRowKeys(selectedKeys);
        },
        type: 'checkbox',
    };

    // 滚动定位逻辑
    const changeProductID = useCallback((selectedId) => {
        console.log('选择的id', selectedId);

        const targetIndex = displayData.findIndex(item => item.inventoryId == selectedId);

        if (targetIndex === -1) {
            message.warning('未找到匹配的物品');
            return;
        }

        const targetRow = rowRefs.current[targetIndex];
        if (targetRow) {
            try {
                targetRow.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });

                // 强制加载定位行的图片
                setLoadedImageIds(prev => new Set(prev).add(selectedId.toString()));

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
                <Button type="primary" onClick={onOK}>
                    确定
                </Button>
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
                    <DatePicker defaultValue={dayjs(stockTime)} onChange={changeDate}/>
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
                        onChange={changeWarehouse}
                        options={Array.isArray(props.WarehouseList) && props.WarehouseList.length > 0
                            ? props.WarehouseList.map((item:any)=>({
                                label:item.warehouseName,
                                value:item.id,
                            }))
                            : []}
                    />
                </Space.Compact>
                <Input placeholder='备注' value={remark} onChange={changeRemark}  maxLength={50} showCount/>
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
                rowKey="id"
                pagination={false}
                size='small'
                scroll={{y:'55vh'}}
                dataSource={displayData}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
                rowSelection={rowSelection}
                // 绑定行ref并设置行ID标识
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
        </Spin>
    )
}

const mapStateToProps = (state: any) => ({
    ThingStockInfoList: state.ThingStockInfo.list,
    WarehouseList: state.WarehouseList.list,
});

export default connect(mapStateToProps)(AddInventoryRequest);