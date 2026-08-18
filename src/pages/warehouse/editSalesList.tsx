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
import {useEffect, useState} from "react";
import {generate, getCurrentDate} from "@/utils/OpenTool";
import {StaticInfo} from "@/StaticInfo";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as RequisitionForm from "@/services/requisitionForm";
import {PlusOutlined} from "@ant-design/icons";
import * as ThingStockInfoServer from "@/services/thingStockInfo";
import * as ThingListvice from "@/services/unitCalculation";
import * as AppPzService from "@/services/appPz";

const editSalesList=(props)=>{
    const navigate=useNavigate();
    const [spinning, setSpinning] = useState(false);
    const [form] = Form.useForm();
    // 随机单号
    const [orderCode,setOrderCode]=useState('');
    // 备注
    const [remark,setRemark]=useState('');
    // 获取当前时间
    const [orderTime, setOrderTime] = useState(getCurrentDate());
    // 仓库id
    const [warehouseId,setWarehouseId]=useState(0);
    // 添加退货的物品
    const [displayData, setDisplayData] = useState([]);
    // 库存的物品
    const [thingStockInfoList,setThingStockInfoList]=useState([]);
    // 选中行的id
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    // 已付金额
    const [paidAmount,setPaidAmount]=useState(0);
    // 折后金额
    const [totalAmount,setTotalAmount]=useState(0);
    // 总金额
    const [discountPrice,setDiscountPrice]=useState(0);
    // 折扣率
    const [discountRate,setDiscountRate]=useState(100);
    // 客户id
    const [customerId,setCustomerId]=useState(0);
    const [pmId ,setPayTypeId]=useState(0);
    const [uid,setUid]=useState(0);
    // 销售人
    const [salesperson,setSalesPerson]=useState('');
    const [parkIdDB,setParkIdDB]=useState(0);
    const [mixDiscountRate ,setMixDiscountRate]=useState(0);

    const getOne=async (id:string)=>{
        setSpinning(true);
        let res:any=await  RequisitionForm.one(id);
        if (res.ErrorCode==0){
            console.log('销售',res);
            let data=res.Data;
            setSpinning(false);
            setOrderCode(data.orderCode);
            setWarehouseId(data.warehouseId);
            setOrderTime(data.orderTime);
            setPaidAmount(data.paidAmount);
            setTotalAmount(data.totalAmount);
            setRemark(data.remark);
            setPayTypeId(data.pmId);
            setDiscountRate(data.discountRate);
            setDiscountPrice(data.discountPrice);
            setCustomerId(data.customerId);
            getList(data.warehouseId);
            setParkIdDB(data.parkIdDB);
            setSalesPerson(data.salesperson);
            if (data.customerType==1){
                getwxUserList();
            }else {
                getKeList();
            }
            if (data.ppList.length>0&&data.ppList){
                let newArr=data.ppList.map((item:any,index)=>{
                    return {...item,poId:data.id,productsId:item.id}
                })
                setDisplayData(newArr);
            }
        }else {
            message.error(res.Data);
            setSpinning(false);
        }
    };
    const getThenBuckleSttings=()=>{
        AppPzService.thenBuckleOne().then((res:TypeErrorCode)=>{
            if (res.ErrorCode === 0 && res.Data !== null){
                setMixDiscountRate(res.Data.discount);
            }else {
                setMixDiscountRate(0);
            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id*1);
        getOne(id);
        getThenBuckleSttings();
    }, []);
    const columnsz = [
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
                    : `${window.ServerConfig.imgServer}${textStr}_min.png`;
                // 步骤3：仅当字符串非空时渲染图片，否则返回空
                return textStr ? (
                    <Image
                        src={imageUrl}
                        style={{width:'50px',height:'50px'}}
                        fallback="https://placeholder.pics/svg/50x50/EEEEEE/999999/暂无图片"
                        preview={{
                            src: `${window.ServerConfig.imgServer}${record.productsImage}.png`, // 弹窗预览图单独指定
                        }}
                    />
                ) : (
                    ''
                );
            }
        },
        {
            title: '物品选择',
            dataIndex: 'inventoryId',
            key: 'inventoryId',
            width: 300,
            render: (text, record) => (
                <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder="搜索物品名称"
                    style={{ width: '100%' }}
                    value={text || undefined}
                    onChange={(value) => handleProductSelect(value, record)}
                    filterOption={(input, option) => {
                        if (!Array.isArray(thingStockInfoList) || thingStockInfoList.length === 0) return false;
                        const item = thingStockInfoList.find(unit => `${unit.unitsName}${unit.productsName}` === option.value);
                        if (!item) return false;
                        const searchInput = input.toLowerCase();
                        return item.productsName?.toLowerCase().includes(searchInput);
                    }}
                    options={Array.isArray(thingStockInfoList)
                        ? thingStockInfoList.map(item => ({
                            label: `${item.unitsName}-${item.productsName}`,
                            value: item.id
                        }))
                        : []}
                />
            )
        },
        {
            title: '物品编号',
            dataIndex: 'productsCode',
            key:'productsCode',
        },
        {
            title: '出库数量',
            dataIndex: 'quantity',
            key:'quantity',
            render:(text, record) => (
                <InputNumber
                    min={0}
                    value={text}
                    // 使用onChange事件捕获值变化，传递新值和记录ID
                    onChange={(value) => changproductsNum(value, record.id)}
                />
            )
        },
        {
            title: '单位',
            dataIndex: 'unitsName',
            key: 'unitsName',
            render: (text, record) => (
                <Input
                    min={0}
                    value={text}
                />
            )
        },
        {
            title: '折扣%',
            dataIndex: 'discountRateDp',
            key:'discountRateDp',
            render:(text, record) => (
                <InputNumber
                    min={mixDiscountRate}
                    value={text}
                    max={100}
                    // 当"是否打折"为"否"(0)时禁用输入框，仅"是"(1)时可编辑
                    disabled={record.isZk === 0}
                    onChange={(value) => changeDiscount(value, record.id)}
                />
            )
        },
        {
            title: '折后金额(元)',
            dataIndex: 'totalPrice',
            key:'totalPrice',
            render:(text, record) => (
                <InputNumber
                    min={0}
                    value={text}
                    disabled
                />
            )
        },
        {
            title: '控价',
            dataIndex: 'presalePrice',
            key:'presalePrice',
        },
        {
            title: '零售价(元)',
            dataIndex: 'price',
            key:'price',
        },
        {
            title: '库存数量',
            dataIndex: 'quantityKc',
            key:'quantityKc',
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
    // 选择单位
    const handleUnitSelect = (recordId, unitId) => {
        const currentRecord = displayData.find(item => item.id === recordId);
        if (!currentRecord || !Array.isArray(currentRecord.iList)) return;
        const selectedUnit = currentRecord.iList.find(unit => unit.unitsId === unitId);
        console.log('选择的单位',selectedUnit);
        if (!selectedUnit) return;
        setDisplayData(displayData.map(item => {
            if (item.id === recordId) {
                return {
                    ...item,
                    brandId: selectedUnit.brandId || 0, // 同步物品品牌
                    abbreviation: selectedUnit.abbreviation || '', // 同步物品助查码
                    barcode: selectedUnit.barcode || '', // 同步物品条码
                    costPrice: selectedUnit.costPrice || 0, // 同步物品成本价
                    groupId: selectedUnit.groupId || 0, // 物品分组
                    inventoryId: selectedUnit.id || 0, // 物品id
                    number: selectedUnit.number || 0, // 警告数量
                    presalePrice: selectedUnit.presalePrice || 0, // 警告数量
                    price: selectedUnit.retailPricce || 0, // 零售价(元)
                    priceKc: selectedUnit.priceKc || 0, // 零售价(元)
                    productsCode: selectedUnit.productsCode || '', // 物品编号
                    quantity: 0, // 出库数量
                    quantityKc: selectedUnit.quantity || 0, // 库存数量
                    retailPricce: selectedUnit.retailPricce || 0,
                    specifications: selectedUnit.specifications || '',
                    totalPrice: selectedUnit.totalPrice || 0,
                    unitsId: selectedUnit.unitsId || 0,
                    unitsName: selectedUnit.unitsName || '',
                    isZk: selectedUnit.isZk || 1,
                    discountRateDp: selectedUnit.discountRateDp || 100,
                    discountPriceDp: selectedUnit.discountPriceDp || 0,
                };
            }
            return item;
        }));
    };
    // 删除物品
    const isDel=(id:number)=>{
        setDisplayData(displayData.filter((item)=>item.id!==id));
    };
    const  setPresalePrice=(data, conversions) =>{
        const presaleMap = {};
        const retailMap = {};

        const baseUnitId = data.unitsId;

        function fix(num) {
            return Number(num.toFixed(2));
        }

        // 当前单位价格固定
        presaleMap[baseUnitId] = fix(data.presalePrice);
        retailMap[baseUnitId] = fix(data.retailPricce);

        function calculate(unitId) {
            const currentPresale = presaleMap[unitId];
            const currentRetail = retailMap[unitId];

            // 向上找
            conversions
                .filter(item => item.to_unit_id === unitId)
                .forEach(item => {
                    if (presaleMap[item.from_unit_id] == null) {
                        presaleMap[item.from_unit_id] = fix(
                            currentPresale * item.conversion_rate
                        );
                        retailMap[item.from_unit_id] = fix(
                            currentRetail * item.conversion_rate
                        );

                        calculate(item.from_unit_id);
                    }
                });

            // 向下找
            conversions
                .filter(item => item.from_unit_id === unitId)
                .forEach(item => {
                    if (item.to_unit_id !== 0 && presaleMap[item.to_unit_id] == null) {
                        presaleMap[item.to_unit_id] = fix(
                            currentPresale / item.conversion_rate
                        );
                        retailMap[item.to_unit_id] = fix(
                            currentRetail / item.conversion_rate
                        );

                        calculate(item.to_unit_id);
                    }
                });
        }
        calculate(baseUnitId);
        data.iList.forEach(item => {
            item.presalePrice = presaleMap[item.unitsId] ?? 0;
            item.retailPricce = retailMap[item.unitsId] ?? 0;
        });

        return data.iList;
    }
    // 处理物品选择变更 - 更新物品名称及相关信息
    const handleProductSelect = (value, record) => {
        const selectedProduct = thingStockInfoList.find(item => item.id == value);
        console.log('选择的物品', selectedProduct);
        setDisplayData(displayData.map(item => {
            if (item.id === record.id) {
                return {
                    ...item,
                    productsImage: selectedProduct.productsImage || '',
                    productsName: selectedProduct.productsName || '',
                    iList: selectedProduct.unitsList || [],
                    brandId: 0,
                    costPrice: 0,
                    inventoryId: selectedProduct.id,
                    presalePrice: selectedProduct.presalePrice,
                    price: selectedProduct.price,
                    priceKc: 0,
                    productsCode: selectedProduct.productsCode,
                    quantity: 0,
                    productsId: selectedProduct.productsId,
                    quantityKc: selectedProduct.quantity || 0,
                    retailPricce: selectedProduct.presalePrice,
                    totalPrice: 0,
                    unitsId: selectedProduct.unitsId || 0,
                    unitsName: selectedProduct.unitsName || '',
                    isZk: 1,
                    discountRateDp: 100,
                    discountPriceDp: 0,
                };
            }
            return item;
        }));
    };
    // 已付金额
    const changePaidAmount=(e)=>{
        setPaidAmount(e);
    };
    const changproductsNum = (value, recordId) => {
        if (value === null) return; // 处理输入框清空的情况
        // 更新对应商品的出库数量和总价
        const updatedData = displayData.map(item => {
            if (item.id === recordId) {
                const quantity = value; // 新数量
                // 1. 计算折扣后金额（数量 × 单价 × 折扣率 ÷ 100）
                const discountedPrice = quantity * (item.price || 0) * (item.discountRateDp || 0) / 100;
                // 2. 计算控价金额（数量 × 控价，控价默认为0）
                const minPrice = quantity * (item.presalePrice || 0);
                // 3. 取两者最大值作为最终折后金额（兜底控价）
                const totalPrice = Math.max(discountedPrice, minPrice);
                return {
                    ...item,
                    quantity: quantity, // 更新数量
                    totalPrice: totalPrice // 使用兜底后的折后金额
                };
            }
            return item;
        });
        setDisplayData(updatedData);
    };
    // ... 现有代码 ...
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[], selectedRows: any[]) => {
            setSelectedRowKeys(selectedKeys);
            // 勾选/取消勾选时同步更新折扣率和折后金额
            setDisplayData(prevData =>
                prevData.map(item => {
                    const isSelected = selectedKeys.includes(item.id);
                    // 勾选：折扣率=全局discountRate；取消勾选：折扣率=100
                    const newDiscount = isSelected ? discountRate : 100;
                    // 重新计算折后金额（确保不低于控价）
                    const newTotalPrice = Math.max(
                        (item.quantity || 0) * (item.price || 0) * newDiscount / 100, // 折扣后金额
                        (item.quantity || 0) * (item.presalePrice || 0) // 控价金额
                    );
                    return {
                        ...item,
                        isZk: isSelected ? 1 : 0, // 是否打折状态
                        discountRateDp: newDiscount, // 同步折扣率
                        totalPrice: newTotalPrice // 重新计算折后金额
                    };
                })
            );
        },
        type: 'checkbox',  // 复选框类型
    };
    const changeDate=(date:dayjs.Dayjs,item:string)=>{
        setOrderTime(item);
    };
    // 获取库存
    const getList=(e)=>{
        setSpinning(true);
        ThingStockInfoServer.selectFetch(e).then((res:TypeErrorCode)=>{
            console.log('库存明细',res)
            if (res.ErrorCode==0){
                // displayData
                setThingStockInfoList(res.Data);
            }
            setSpinning(false);
        })
    };
    // 仓库列表
    const getWarehouseList=()=>{
        props.dispatch({
            type:"WarehouseList/fetch",
            payload:{page:1,warehouseName:'', personName:'', personPhone:'',pageSize:50,isXs:1}

        })
    };
    // 仓库id
    const changeWarehouse=(e)=>{
        setWarehouseId(e);
        getList(e);
    };
    const getConpentList=()=>{
        props.dispatch({
            type:'ConpentList/fetch',
            payload:{page:1,pageSize:300,uName:'',uPhone:'',balance:0}
        })
    };
    useEffect(() => {
        getWarehouseList();
        getPayList();
        getUserList();
        getAppUserList();
    }, []);
    const onOK=()=>{
        if (orderTime==='') return message.warning('请选择申请时间');
        if (customerId===0) return message.warning('请选择客户');
        if (pmId===0) return message.warning('请选择支付类型');
        if (salesperson==='') return message.warning('请选择销售人');
        const filteredData = displayData.filter(item => item.inventoryId !== 0 && item.unitsId > 0);
        if (filteredData.length === 0) return message.warning('请选择有效的物品信息');
        const hasInvalidQuantity = filteredData.some(item => item.quantity <= 0);
        if (hasInvalidQuantity) {
            return message.warning('请输入销售数量');
        }

        let newFilteredData = filteredData.map((item:any)=>({
            inventoryId: item.inventoryId,
            quantity: item.quantity,
            unitsId: item.unitsId,
            productsName: item.productsName,
            productsCode: item.productsCode,
            productsImage: item.productsImage,
            price: item.price,
            totalPrice: item.totalPrice,
            discountRateDp: item.discountRateDp,
            discountPriceDp: item.discountPriceDp,
            isZk: item.isZk,
            id: item.productsId,
            poId:uid
        }));
        let jsonData = JSON.stringify(newFilteredData);
        setSpinning(true);
        props.dispatch({
            type:'SalesList/edit',
            payload:{uid,warehouseId, orderCode, orderTime, jsonData, paidAmount, totalAmount,discountPrice, remark,pmId,customerId,discountRate,warehouseId2:0,parkIdDB,salesperson}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('编辑成功');
                setSpinning(false);
                history.push('/warehouse/sales');
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
    // 客户id
    const changeCustomerId=(e)=>{
        setCustomerId(e);
    };
    const getwxUserList=()=>{
        props.dispatch({
            type:'AppUser/fetch',
            payload:{page:1,name:'',phone:'',pageSize:500,balance:0}
        });
    };
    const getKeList=()=>{
        props.dispatch({
            type:"CheckCompany/fetch",
            payload:{page:1,name:'',startDate:'2000-01-01',endDate:'2099-01-01',userId:0,pageSize:500}
        })
    };
    // 折扣率变更处理（同步更新所有勾选"是"的物品）
    const changeDiscountRate = (e: number) => {
        if (e === null) return;
        setDiscountRate(e); // 更新全局折扣率状态

        // 同步更新所有"是否打折"为"是"的物品折扣率及折后金额
        setDisplayData(prevData =>
            prevData.map(item => {
                if (item.isZk === 1) { // 仅处理勾选"是"的物品
                    // 计算基础折后金额（数量 × 单价 × 全局折扣率 ÷ 100）
                    const baseTotalPrice = (item.quantity || 0) * (item.price || 0) * e / 100;
                    // 计算控价金额（数量 × 控价）
                    const presaleTotal = (item.quantity || 0) * (item.presalePrice || 0);
                    // 取两者中的最大值作为最终折后金额
                    const totalPrice = Math.max(baseTotalPrice, presaleTotal);

                    return {
                        ...item,
                        discountRateDp: e, // 同步新折扣率
                        totalPrice: totalPrice
                    };
                }
                return item;
            })
        );
    };
    useEffect(() => {
        // 1. 直接累加所有物品（不再过滤勾选状态）
        const totalSum = displayData.reduce((acc, item) => {
            const itemTotal = (item.quantity || 0) * (item.price || 0); // 单个物品原始金额（数量 × 单价）
            return acc + itemTotal;
        }, 0);

        // 2. 计算折后金额（总金额 × 折扣率 ÷ 100）
        const discountedSum = totalSum * (discountRate / 100);

        // 3. 更新金额状态（所有物品累加结果）
        setDiscountPrice(totalSum);       // 原始总金额（无需勾选直接累加）
        setTotalAmount(discountedSum);    // 折后总金额（无需勾选直接累加）
    }, [displayData, discountRate]);
    useEffect(() => {
        // 1. 计算原始总金额（所有物品的「数量 × 单价」之和）
        const totalSum = displayData.reduce((acc, item) => {
            const itemOriginalTotal = (item.quantity || 0) * (item.price || 0); // 单个物品原始金额
            return acc + itemOriginalTotal;
        }, 0);

        // 2. 计算折后总金额（直接累加所有物品的 `totalPrice` 字段）
        const totalDiscountedSum = displayData.reduce((acc, item) => {
            return acc + (item.totalPrice || 0); // 单个物品折后金额累加
        }, 0);

        // 3. 更新状态
        setDiscountPrice(totalSum);       // 原始总金额（不变）
        setTotalAmount(totalDiscountedSum); // 折后总金额（改为累加 item.totalPrice）
    }, [displayData]);
    const changeDiscount = (value, recordId) => {
        if (value === null) return; // 处理输入框清空的情况
        // 使用函数式更新确保获取最新状态
        setDisplayData(prevData =>
            prevData.map(item => {
                // 找到对应ID的记录，更新discount并重新计算totalPrice
                if (item.id === recordId) {
                    const newDiscount = value || 0; // 折扣率默认0
                    // 1. 计算基础折后金额（数量 × 单价 × 折扣率 ÷ 100）
                    const baseTotalPrice = (item.quantity || 0) * (item.price || 0) * newDiscount / 100;
                    // 2. 计算控价金额（数量 × 控价）
                    const presaleTotal = (item.quantity || 0) * (item.presalePrice || 0);
                    // 3. 取两者最大值作为最终折后金额
                    const totalPrice = Math.max(baseTotalPrice, presaleTotal);

                    return {
                        ...item,
                        discountRateDp: newDiscount,
                        totalPrice: totalPrice // 使用兜底后的折后金额
                    };
                }
                return item;
            })
        );
    };
    // 获取用户列表
    const getUserList=()=>{
        props.dispatch({
            type:"Users/fetch",
        })
    };
    // 用户列表接口
    const getAppUserList = () => {
        props.dispatch({
            type:'AppUser/fetch',
        })
    };
    const getPayList=()=>{
        props.dispatch({
            type:'PayType/fetch',
        })
    };

    // 支付方式
    const changePayType=(e)=>{
        setPayTypeId(e);
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
            productsCode:'',
            productsImage:'',
            productsName:'',
            quantity:0,
            quantityKc:0,
            retailPricce:0,
            specifications:'',
            totalPrice:0,
            unitsId:0,
            unitsName:'',
            warehouseName:0,
            isZk: 1,
            discountRateDp: 100,
            discountPriceDp: 0,
            poId:uid
        }));
        // 添加到现有记录中
        setDisplayData([...displayData, ...newRecords]);
    };
    // 销售人
    const changeSalesPerson=(e)=>{
        setSalesPerson(e);
    };
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
                <Input addonBefore="单号:" placeholder='随机生成' value={orderCode} disabled/>
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
                    <DatePicker defaultValue={dayjs(orderTime)} onChange={changeDate}/>
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
                        showSearch
                        placeholder='请选择仓库'
                        onChange={changeWarehouse}
                        value={warehouseId}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={Array.isArray(props.WarehouseList) && props.WarehouseList.length > 0
                            ? props.WarehouseList.map((item:any)=>({
                                label:item.warehouseName,
                                value:item.id,
                            }))
                            : []}
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
                        支付方式:
                    </div>
                    <Select
                        showSearch
                        placeholder='支付方式'
                        value={pmId}
                        onChange={changePayType}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={Array.isArray(props.PayTypeList) && props.PayTypeList.length > 0
                            ? props.PayTypeList.map((item:any)=>({
                                label:item.pmName,
                                value:item.id,
                            }))
                            : []}
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
                        客户:
                    </div>
                    <Select
                        style={{width:150}}
                        showSearch
                        placeholder='客户'
                        onChange={changeCustomerId}
                        value={customerId}
                        filterOption={(input, option) => {
                            const item = props.AppUserList.find(unit => unit.userId == option.value);
                            return item?.userName?.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={Array.isArray(props.AppUserList) && props.AppUserList.length > 0
                            ? props.AppUserList.map((item: any) => ({
                                label: item.userName,
                                value: item.userId,
                            }))
                            : []}
                    />
                </Space.Compact>
                <Input placeholder='备注' value={remark} onChange={changeRemark}  maxLength={50} showCount/>
            </Space>
            <Space style={{marginTop:'10px'}}>
                <InputNumber addonBefore="总金额(元):" placeholder='总金额' min={0} disabled value={discountPrice}/>
                <InputNumber addonBefore="折扣%:" placeholder='折扣%' min={mixDiscountRate} max={100} value={discountRate} onChange={changeDiscountRate}/>
                <InputNumber addonBefore="折后金额:" placeholder='折后金额' min={0}  value={totalAmount} disabled/>
                <InputNumber addonBefore="实收金额(元):" placeholder='实收金额' min={0} value={paidAmount} onChange={changePaidAmount}/>
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
                        销售人:
                    </div>
                    <Select
                        showSearch
                        placeholder='销售人'
                        onChange={changeSalesPerson}
                        value={salesperson}
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item = props.UsersList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                            return item?.user_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={Array.isArray(props.UsersList) && props.UsersList.length > 0
                            ? props.UsersList.map((item:any)=>({
                                label:item.user_name,
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
                rowSelection={rowSelection}  // 添加选择功能配置
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
    PayTypeList: state.PayType.list,
    AppUserList: state.AppUser.list
});
export default connect(mapStateToProps)(editSalesList);
