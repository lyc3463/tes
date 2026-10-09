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
import {StaticInfo} from "@/StaticInfo";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as InventoryRequestServices from "@/services/inventoryRequest";
import {PlusOutlined} from "@ant-design/icons";
import * as ThingListService from "@/services/thingList";

const EditInventoryRequest=(props)=>{
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
    // 添加的物品
    const [displayData, setDisplayData] = useState([]);
    // 库存的物品
    const [thingStockInfoList,setThingStockInfoList]=useState([]);
    const [catalogProducts,setCatalogProducts]=useState<any[]>([]);
    const [uid,setUid]=useState(0);
    // 修复：创建行ref数组，直接引用每一行的DOM，避免操作表格实例
    const rowRefs = useRef<HTMLDivElement[]>([]);
    // 新增：存储已加载图片的行ID（避免重复加载）
    const [loadedImageIds, setLoadedImageIds] = useState<Set<string>>(new Set());
    // 交叉观察器实例
    const observerRef = useRef<IntersectionObserver | null>(null);
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
    const getOne=async (id:string)=>{
        setSpinning(true);
        let res:any=await  InventoryRequestServices.one(id);
        if (res.ErrorCode==0){
            console.log('盘点申请',res);
            let data=res.Data;
            setSpinning(false);
            setOrderCode(data.stockCode);
            setWarehouseId(data.warehouseId);
            setOrderTime(data.stockTime);
            setRemark(data.remark);
            getList(data.warehouseId);
            if (data.spList.length>0&&data.spList){
                let newArr=data.spList.map((item:any,index)=>{
                    return {...item,poId:data.id}
                })
                setDisplayData(newArr);
            }
        }else {
            message.error(res.Data);
            setSpinning(false);
        }
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id*1);
        getOne(id);
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
                        ? `${window.ServerConfig.imgServer}${textStr}`
                        : `${window.ServerConfig.imgServer}${textStr}_X.png`;
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
            render: (text, record) => (
                <Select
                    showSearch // 启用搜索
                    optionFilterProp="children" // 搜索选项的哪个属性
                    placeholder="搜索物品名称"
                    style={{ width: 120 }}
                    value={record.productsId || undefined}
                    // 选择变更时更新状态
                    onChange={(value) => handleProductSelect(record.id, value)}
                    filterOption={(input, option) => {
                        // 1. 边界处理：如果thingList不是数组或为空，直接返回false
                        if (!Array.isArray(catalogProducts) || catalogProducts.length === 0) {
                            return false;
                        }
                        const item = catalogProducts.find(unit => unit.id == option.value);
                        if (!item) return false; // 未找到对应物品，不匹配
                        // 3. 同时搜索productsName和abbreviation（不区分大小写）
                        const searchInput = input.toLowerCase();
                        const nameMatch = item.productsName?.toLowerCase().includes(searchInput);
                        // 任一字段匹配即返回true
                        return nameMatch ;
                    }}
                    // 下拉选项来自thingList
                    options={Array.isArray(catalogProducts)
                        ? catalogProducts.map(item => ({
                            label: `${item.productsName}(${item.unitsName})`, // 显示名称
                            value: item.id // 选项值（物品ID）
                        }))
                        : []}
                />
            )
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
            title: '操作',
            dataIndex: 'delete',
            key:'delete',
            render:(text,record)=>{
                return <Button type='primary' danger onClick={()=>isDel(record.id)}>删除</Button>
            }
        },
    ];
    // 删除物品
    const isDel=(id:number)=>{
        setDisplayData(displayData.filter((item)=>item.id!==id));
    };
    const changeDate=(date:dayjs.Dayjs,item:string)=>{
        setOrderTime(item);
    };
    // 获取库存
    const getList=(e:number)=>{
        setSpinning(true);
        props.dispatch({
            type:'ThingStockInfo/fetch',
            payload:{page:1, pageSize:10000, warehouseId:e, productsName:'', startDate:'2000-01-01', endDate:'2099-01-01',unitId:0}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setThingStockInfoList(res.Data.data);
                setSpinning(false);
            }else {
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    // 仓库列表
    const getWarehouseList=()=>{
        props.dispatch({
            type:"WarehouseList/fetch",
        })
    };
    // 仓库id
    const changeWarehouse=(e)=>{
        setWarehouseId(e);
        getList(e);
    };
    useEffect(() => {
        getWarehouseList();
        getCatalogProducts();
    }, []);

    const getCatalogProducts=async ()=>{
        const res:TypeErrorCode=await ThingListService.fetch({page:1,name:'',code:'',pageSize:10000,goodsTypeId:0});
        if (res.ErrorCode===0) setCatalogProducts(res.Data.data || []);
        else message.error(res.Data);
    };
    const onOK=()=>{
        if (stockTime==='') return message.warning('请选择申请时间');
        // 可选：添加未选择项的提示
        if (displayData.length === 0) return message.warning('请先选择需要申请的物品');
        let jsonData = JSON.stringify(displayData);
        console.log('jsonData',jsonData);
        setSpinning(true);
        props.dispatch({
            type:'InventoryRequest/edit',
            payload:{uid,warehouseId, stockCode, stockTime, jsonData, remark, stockStatus:1}
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
    // 备注
    const changeRemark=(e)=>{
        setRemark(e.target.value);
    };
    // 处理物品选择变更 - 更新物品名称及相关信息
    const handleProductSelect = (recordId, productId) => {
        // 查找选中的物品信息
        const selectedProduct = catalogProducts.find(item => Number(item.id) === Number(productId));
        if (!selectedProduct) return;
        const stockRow = thingStockInfoList.find(item =>
            Number(item.productsId) === Number(selectedProduct.id) && Number(item.unitsId) === Number(selectedProduct.unitsId),
        );
        // 更新goods状态中对应记录的信息
        setDisplayData(displayData.map(item => {
            if (item.id === recordId) {
                return {
                    ...item,
                    productsImageBase64: selectedProduct.productsImageBase64 || '', // 同步物品图片
                    brandId: selectedProduct.brandId || 0, // 同步物品品牌
                    abbreviation: selectedProduct.abbreviation || '', // 同步物品助查码
                    barcode: selectedProduct.barcode || '', // 同步物品条码
                    costPrice: selectedProduct.costPrice || 0, // 同步物品成本价
                    groupId: selectedProduct.groupId || 0, // 物品分组
                    inventoryId: stockRow?.id || 0,
                    productsId: selectedProduct.id,
                    number: selectedProduct.number || 0, // 警告数量
                    presalePrice: selectedProduct.presalePrice || 0, // 警告数量
                    price: selectedProduct.price || 0, // 零售价(元)
                    priceKc: stockRow?.price || 0,
                    productsCode: selectedProduct.productsCode || '', // 物品编号
                    productsImage: selectedProduct.productsImage || '', // 物品图片名称
                    productsName: selectedProduct.productsName || '', // 物品名称
                    quantity: 0, // 出库数量
                    quantityKc: stockRow?.quantity || 0,
                    retailPricce: selectedProduct.retailPricce || 0,
                    specifications: selectedProduct.specifications || '',
                    totalPrice: selectedProduct.totalPrice || 0,
                    unitsId: selectedProduct.unitsId || 0,
                    unitsName: selectedProduct.unitsName || 0,
                    warehouseName: selectedProduct.warehouseName || 0,
                    isZk: selectedProduct.isZk || 1,
                    discountRateDp: selectedProduct.discountRateDp || 100,
                    discountPriceDp: selectedProduct.discountPriceDp || 0,
                    poId:uid,
                };
            }
            return item;
        }));
    };
    // 添加10条空记录的处理函数
    const addTenEmptyRecords = () => {
        // 获取当前最大ID，不存在则从1开始
        const maxId = displayData.length > 0
            ? Math.max(...displayData.map(item => item.id))
            : 0;

        // 生成10条空记录，ID递增
        const newRecords = Array.from({length: 1}, (_, i) => ({
            id: maxId + i + 1,
            productsImageBase64: '', // 同步物品图片
            brandId:0,
            abbreviation:'',
            barcode:'',
            costPrice:0,
            groupId:0,
            inventoryId:0,
            number:0,
            presalePrice:0,
            price:0,
            priceKc:0,
            productsCode:0,
            productsImage:0,
            productsName:'',
            quantity:0,
            quantityKc:0,
            retailPricce:0,
            specifications:'',
            totalPrice:0,
            unitsId:0,
            unitsName:0,
            warehouseName:0,
            isZk: 1,
            discountRateDp: 100,
            discountPriceDp: 0,
            poId:uid,
        }));
        // 添加到现有记录中
        setDisplayData([...displayData, ...newRecords]);
    };
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
                <Button type="primary" onClick={onOK}>
                    编辑
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
                    <DatePicker value={dayjs(stockTime)} onChange={changeDate}/>
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
                        placeholder='请选择仓库'
                        value={warehouseId}
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
            <Button
                type="primary"
                onClick={addTenEmptyRecords}
                style={{ marginTop: '10px' }}
            >
                <PlusOutlined />
            </Button>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    ThingStockInfoList: state.ThingStockInfo.list,
    WarehouseList: state.WarehouseList.list,

});
export default connect(mapStateToProps)(EditInventoryRequest);
