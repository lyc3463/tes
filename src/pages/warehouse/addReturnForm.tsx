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
import {PlusOutlined} from "@ant-design/icons";
import * as ThingStockInfoServer from "@/services/thingStockInfo";

const addReturnForm=(props)=>{
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
    // 已付金额
    const [paidAmount,setPaidAmount]=useState(0);
    // 总金额
    const [totalAmount,setTotalAmount]=useState(0);
    const [pmId ,setPayTypeId]=useState(0);

    useEffect(() => {
        setOrderCode(generate(StaticInfo.park_name));
        addEmptyRecords(5);
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
                    ? `http://img.qhwy6.com/${textStr}`
                    : `http://img.qhwy6.com/${textStr}_X.png`;
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
            title: '物品名称',
            dataIndex: 'productsName',
            key:'productsName',
            render: (text, record) => (
                <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder="搜索物品名称"
                    style={{ width: 120 }}
                    value={text || undefined}
                    onChange={(value) => handleProductSelect(record.id, value)}
                    filterOption={(input, option) => {
                        if (!Array.isArray(thingStockInfoList) || thingStockInfoList.length === 0) {
                            return false;
                        }
                        // 查找匹配productsCode的物品 (使用productsCode代替id)
                        const item = thingStockInfoList.find(unit => unit.productsCode == option.value);
                        if (!item) return false;
                        const searchInput = input.toLowerCase();
                        // 仍按名称搜索，但基于productsCode匹配的物品
                        return item.productsName?.toLowerCase().includes(searchInput);
                    }}
                    // 选项值使用productsCode代替id (唯一非int标识符)
                    options={Array.isArray(thingStockInfoList)
                        ? thingStockInfoList.map(item => ({
                            label: `${item.productsName}`,
                            value: item.productsCode // 改为使用productsCode作为value
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
            dataIndex: 'unitsId',
            key: 'unitsId',
            render: (text, record) => (
                <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder="选择单位"  // Fix placeholder text
                    style={{ width: 120 }}
                    value={text || undefined}
                    onChange={(value) => handleUnitSelect(record.id, value)}
                    options={Array.isArray(record.iList)
                        ? record.iList.map(item => ({
                            label: item.unitsName || '',  // Unit name as label
                            value: item.unitsId || 0      // Unit ID as value (adjust if using unitsCode)
                        }))
                        : []}
                />
            )
        },
        {
            title: '退货数量',
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
            title: '单价(元)',
            dataIndex: 'price',
            key:'price',
        },
        {
            title: '总价钱(元)',
            dataIndex: 'totalPrice',
            key:'totalPrice',
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
    // 已付金额
    const changePaidAmount=(e)=>{
        setPaidAmount(e);
    };
    // 总金额
    const changeTotalAmount=(e)=>{
        setTotalAmount(e);
    };
    // 修改对应id 的数量
    const changproductsNum = (value, recordId) => {
        if (value === null) return; // 处理输入框清空的情况
        // 更新对应商品的出库数量和总价
        const updatedData = displayData.map(item => {
            if (item.id === recordId) {
                const quantity = value; // 新数量
                // 1. 计算折扣后金额（数量 × 单价 × 折扣率 ÷ 100）
                const discountedPrice = quantity * item.priceKc ;
                // 2. 计算控价金额（数量 × 控价，控价默认为0）
                const minPrice = quantity * (item.price || 0);
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
        console.log('')
        setDisplayData(updatedData);
    };
    // 选择单位
    const handleUnitSelect = (recordId, unitId) => {
        const currentRecord = displayData.find(item => item.id === recordId);
        if (!currentRecord || !Array.isArray(currentRecord.iList)) return;
        const selectedUnit = currentRecord.iList.find(unit => unit.unitsId === unitId);
        console.log('选择的单位',selectedUnit)
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
                    price: selectedUnit.price || 0, // 零售价(元)
                    priceKc: selectedUnit.priceKc || 0, // 零售价(元)
                    productsCode: selectedUnit.productsCode || '', // 物品编号
                    quantity: 0, // 出库数量
                    quantityKc: selectedUnit.quantity || 0, // 库存数量
                    retailPricce: selectedUnit.retailPricce || 0,
                    specifications: selectedUnit.specifications || '',
                    totalPrice: selectedUnit.totalPrice || 0,
                    unitsId: selectedUnit.unitsId || 0,
                    unitsName: selectedUnit.unitsName || 0,
                    isZk: selectedUnit.isZk || 1,
                    discountRateDp: selectedUnit.discountRateDp || 100,
                    discountPriceDp: selectedUnit.discountPriceDp || 0,
                };
            }
            return item;
        }));
    };
    // 处理物品选择变更 - 更新物品名称及相关信息
    const handleProductSelect = (recordId, productCode) => {
        // 查找选中的物品信息
        const selectedProduct = thingStockInfoList.find(item => item.productsCode === productCode);
        ThingStockInfoServer.productsNameQuery(warehouseId,selectedProduct.productsName).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('物品名称',res);
                setDisplayData(displayData.map(item => {
                    if (item.id === recordId) {
                        return {
                            ...item,
                            productsImageBase64: res.Data.productsImageBase64 || '', // 同步物品图片
                            productsImage: res.Data.productsImage || '', // 物品图片名称
                            productsName: selectedProduct.productsName || '', // 物品名称
                            iList: res.Data.iList || [],
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
                            quantity:0,
                            quantityKc:0,
                            retailPricce:0,
                            specifications:'',
                            totalPrice:0,
                            unitsId:0,
                            unitsName:'',
                            isZk: 1,
                            discountRateDp: 100,
                            discountPriceDp: 0,
                        };
                    }
                    return item;
                }));
            }else {
                message.error(res.Data);
            }
        })
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
                setThingStockInfoList(res.Data);
            }
            setSpinning(false);
        })
    };
    // 仓库列表
    const getWarehouseList=()=>{
        props.dispatch({
            type:"WarehouseList/fetch",
        })
    };
    // 支付方式列表
    const getPayList=()=>{
        props.dispatch({
            type:'PayType/fetch',
        })
    };
    // 仓库id
    const changeWarehouse=(e)=>{
        setWarehouseId(e);
        setDisplayData(prevDisplayData => prevDisplayData.filter(item => item.productsName === ''));
        getList(e);
    };
    useEffect(() => {
        getWarehouseList();
        getPayList();
    }, []);
    const onOK=()=>{
        if (orderTime==='') return message.warning('请选择申请时间');
        if (pmId===0) return message.warning('请选择支付方式');
        const filteredData = displayData.filter(item => item.productsCode !== '' && item.unitsId > 0);
        if (filteredData.length === 0) return message.warning('请选择有效的物品信息');
        const hasInvalidQuantity = filteredData.some(item => item.quantity <= 0);
        if (hasInvalidQuantity) {
            return message.warning('请输入退货数量');
        }
        let jsonData = JSON.stringify(filteredData);
        setSpinning(true);
        props.dispatch({
            type:'ReturnForm/add',
            payload:{warehouseId, orderCode, orderTime, jsonData, paidAmount, totalAmount, remark,pmId}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                setSpinning(false);
                history.push('/warehouse/outbound');
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
    // 支付方式
    const changePayType=(e)=>{
        setPayTypeId(e);
    };
    // 删除物品
    const isDel=(id:number)=>{
        setDisplayData(displayData.filter((item)=>item.id!==id));
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
            isZk: 1,
            discountRateDp: 100,
            discountPriceDp: 0,
            iList:[],
        }));
        // 添加到现有记录中
        setDisplayData([...displayData, ...newRecords]);
    };
    const addEmptyRecords = (count:number) => {
        // 获取当前最大ID，不存在则从1开始
        const maxId = displayData.length > 0
            ? Math.max(...displayData.map(item => item.id))
            : 0;

        // 生成指定数量的空记录，ID递增
        const newRecords = Array.from({length: count}, (_, i) => ({
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
            isZk: 1,
            discountRateDp: 100,
            discountPriceDp: 0,
            iList:[],
        }));
        // 添加到现有记录中
        setDisplayData([...displayData, ...newRecords]);
    };
    useEffect(() => {
        const totalSum = displayData.reduce((acc, item) => {
            const itemTotal = (item.quantity || 0) * (item.price || 0); // 单个物品原始金额（数量 × 单价）
            return acc + itemTotal;
        }, 0);
        setTotalAmount(totalSum);
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
            </Space>
            <Space style={{marginTop:'10px'}}>
                <InputNumber addonBefore="已付(元):" placeholder='已付金额' min={0} value={paidAmount} onChange={changePaidAmount}/>
                <InputNumber addonBefore="总金额(元):" placeholder='总金额' min={0} value={totalAmount} disabled/>
                <Input placeholder='备注' value={remark} onChange={changeRemark}  maxLength={50} showCount/>
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

});
export default connect(mapStateToProps)(addReturnForm);
