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
import {useEffect, useRef, useState} from "react";
import {StaticInfo} from '@/StaticInfo'
import {connect,useNavigate,history} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as Application from "@/services/application";
import dayjs from "dayjs";
import {PlusOutlined} from "@ant-design/icons";
const EditApplication=(props)=>{
    const navigate=useNavigate();
    const formRef=useRef();
    const [uid,setUid]=useState('0');
    const [spinning,setSpinning] = useState(false);
    const [form] = Form.useForm();
    // 随机单号
    const [orderCode,setOrderCode]=useState('');
    // 仓库id
    const [warehouseId,setWarehouseId]=useState(0);
    // 供应商id
    const [supplierId,setSupplierId]=useState(0);
    // 采购日期
    const [orderTime,setOrderTime]=useState('2000-01-01');
    // 已付金额
    const [paidAmount,setPaidAmount]=useState(0);
    // 总金额
    const [totalAmount,setTotalAmount]=useState(0);
    // 备注
    const [remark,setRemark]=useState('');
    // 订单物品列表
    const [goods,setGoods]=useState([]);
    const [pmId ,setPayTypeId]=useState(0);
    const getOne=async (id:string)=>{
        setSpinning(true);
        let res:any=await  Application.one(id);
        if (res.ErrorCode==0){
            let data=res.Data;
            console.log('data',data);
            setSpinning(false);
            setOrderCode(data.orderCode);
            setWarehouseId(data.warehouseId);
            setSupplierId(data.supplierId);
            setOrderTime(data.orderTime);
            setPaidAmount(data.paidAmount);
            setTotalAmount(data.totalAmount);
            setRemark(data.remark);
            setGoods(data.ppList);
            setPayTypeId(data.pmId);
        }else {
            message.error(res.Data);
            setSpinning(false);
        }
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOne(id);
    }, []);
    const isDel=(id:number)=>{
        setGoods(goods.filter((item)=>item.id!==id));
    };
    // 处理物品选择变更 - 更新物品名称及相关信息
    const handleProductSelect = (recordId, productId) => {
        // 查找选中的物品信息
        const selectedProduct = props.thingList.find(item => item.id === productId);
        if (!selectedProduct) return;
        // 更新goods状态中对应记录的信息
        setGoods(goods.map(item => {
            if (item.id === recordId) {
                return {
                    ...item,
                    productsImageBase64: selectedProduct.productsImageBase64 || '', // 同步物品图片
                    productsName: selectedProduct.productsName, // 更新物品名称
                    productsCode: selectedProduct.productsCode || '', // 同步物品编号
                    abbreviation: selectedProduct.abbreviation || '', // 同步物品助查码
                    productsImage: selectedProduct.productsImage || '', // 图片名称
                    brandId: selectedProduct.brandId || 0, // 同步物品品牌
                    groupId: selectedProduct.groupId || 0, // 同步物品分组
                    number: selectedProduct.number || 0, // 同步物品数量
                    presalePrice: selectedProduct.presalePrice || 0, // 同步物品预售价
                    retailPricce: selectedProduct.retailPricce || 0, // 同步物品预售价
                    costPrice: selectedProduct.costPrice || 0, // 同步物品预售价
                    specifications: selectedProduct.specifications || '', // 同步物品规格
                    barcode: selectedProduct.barcode || '', // 同步物品条码
                    remark: selectedProduct.remark || '', // 同步物品备注
                    unitsId: selectedProduct.unitsId || 0, // 同步单位ID
                    quantity: selectedProduct.quantity || 0, // 同步物品数量
                    price: selectedProduct.price || 0, // 同步物品预售价
                    totalPrice: selectedProduct.quantity * selectedProduct.price || 0, // 物品总金额
                    unitsList: selectedProduct.unitsList || [], // 同步单位列表
                    unitsName: selectedProduct.unitsName || '', // 同步单位名称
                };
            }
            return item;
        }));
    };
    // 修改对应id 的数量
    const changproductsNum = (value, recordId) => {
        // 使用函数式更新确保获取最新状态
        setGoods(prevGoods =>
            prevGoods.map(item =>
                // 找到对应ID的记录，更新quantity并计算totalPrice
                item.id === recordId ? {
                    ...item,
                    quantity: value || 0,
                    totalPrice:((value || 0) * item.price).toFixed(2)*1
                } : item
            )
        );
    };
    // 修改对应id 的单价
    const changproductsPrice = (value, recordId) => {
        // 使用函数式更新确保获取最新状态
        setGoods(prevGoods =>
            prevGoods.map(item =>
                // 找到对应ID的记录，更新price并计算totalPrice
                item.id === recordId ? {
                    ...item,
                    price: value || 0,
                    totalPrice: (item.quantity * (value || 0)).toFixed(2)*1
                } : item
            )
        );
    };
    // 修改对应id 的单位id
    const changeUnitsId = (value, recordId) => {
        // 使用函数式更新确保获取最新状态
        setGoods(prevGoods =>
            prevGoods.map(item => {
                if (item.id === recordId) {
                    // 1. 从当前物品的unitsList中找到选中单位（from_unit_id === value）
                    const selectedUnit = Array.isArray(item.unitsList)
                        ? item.unitsList.find(unit => unit.from_unit_id === value)
                        : null;
                    // 2. 提取选中单位的price（默认0）
                    const newPrice = selectedUnit?.price || 0;
                    const presalePrice = selectedUnit?.presalePrice || 0;
                    const retailPricce = selectedUnit?.retailPricce || 0;
                    console.log('选中单位的单价:', newPrice);
                    return {
                        ...item,
                        unitsId: value || 0, // 更新单位ID
                        price: (newPrice.toFixed(2))*1, // 赋值单位对应的单价
                        presalePrice,
                        retailPricce,
                        totalPrice: ((item.quantity * newPrice).toFixed(2))*1 // 联动更新总价（数量 × 新单价）
                    };
                }
                return item;
            })
        );
    };
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
                    showSearch // 启用搜索
                    optionFilterProp="children" // 搜索选项的哪个属性
                    placeholder="搜索物品名称"
                    style={{ width: 120 }}
                    value={text || undefined} // 当前选中值
                    // 选择变更时更新状态
                    onChange={(value) => handleProductSelect(record.id, value)}
                    filterOption={(input, option) => {
                        // 1. 边界处理：如果thingList不是数组或为空，直接返回false
                        if (!Array.isArray(props.thingList) || props.thingList.length === 0) {
                            return false;
                        }
                        // 2. 根据选项value查找对应的物品数据
                        const item = props.thingList.find(unit => unit.id == option.value);
                        if (!item) return false; // 未找到对应物品，不匹配
                        // 3. 同时搜索productsName和abbreviation（不区分大小写）
                        const searchInput = input.toLowerCase();
                        const nameMatch = item.productsName?.toLowerCase().includes(searchInput);
                        const abbrMatch = item.abbreviation?.toLowerCase().includes(searchInput);
                        // 任一字段匹配即返回true
                        return nameMatch || abbrMatch;
                    }}
                    // 下拉选项来自thingList
                    options={Array.isArray(props.thingList)
                        ? props.thingList.map(item => ({
                            label: item.productsName, // 显示名称
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
            dataIndex: 'unitsId',
            key:'unitsId',
            render:(text, record) => (
                <div>
                    {record.groupId==0?record.unitsName:
                        <Select
                            placeholder='选择单位'
                            style={{width:120}}
                            value={text}
                            options={Array.isArray(record.unitsList) && record.unitsList.length > 0
                                ? record.unitsList.map((item:any)=>({
                                    label:item.unitsName,
                                    value:item.from_unit_id,
                                }))
                                : []}
                            onChange={(value) => changeUnitsId(value, record.id)}
                        />
                    }
                </div>

            )
        },
        {
            title: '数量',
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
            render:(text, record) => (
                <InputNumber
                    min={0}
                    value={text}
                    onChange={(value) => changproductsPrice(value, record.id)}
                />
            )
        },
        {
            title: '总价钱(元)',
            dataIndex: 'totalPrice',
            key:'totalPrice',
            render:(text, record) => (
                <InputNumber min={0} disabled value={text}/>
            )
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
    // 监听供应商
    const changeSupplier=(e)=>{
        setSupplierId(e);
    };
    // 供应商列表
    const getSupplierList=()=>{
        props.dispatch({
            type:"Supplier/fetch",
        })
    };
    // 仓库列表
    const getWarehouseList=()=>{
        props.dispatch({
            type:"WarehouseList/fetch",
        })
    };
    // 物品列表
    const getThingList=()=>{
        props.dispatch({
            type:"ThingList/fetch",
            payload:{page:1, code:'', name:'', pageSize:10000}
        })
    };
    useEffect(() => {
        getSupplierList();
        getWarehouseList();
        getThingList();
        getPayList();
    }, []);
    // 仓库id
    const changeWarehouse=(e)=>{
        setWarehouseId(e);
    };
    // 采购日期
    const changeDate=(_:any,item:string)=>{
        setOrderTime(item);
    };
    // 已付金额
    const changePaidAmount=(e)=>{
        setPaidAmount(e);
    };
    // 总金额
    const changeTotalAmount=(e)=>{
        setTotalAmount(e);
    };
    // 备注
    const changeRemark=(e)=>{
        setRemark(e.target.value);
    };
    // 提交
    const onOk= ()=>{
        if (goods.length < 1) {
            message.error('请添加入库物品');
            return; // 阻止提交
        }
        if (warehouseId===0) {
            message.error('请选择入库仓库');
            return;
        }
        if (supplierId===0) {
            message.error('请选择供应商');
            return;
        }
        if (orderTime==='') {
            message.error('请选择采购日期');
            return;
        }
        if (pmId==0){
            message.error('请选择支付方式');
            return;
        }
        const hasInvalidItem = goods.some(item => {
            // 物品未选择（名称为空）、单位ID为0、数量为0、单价为0 均视为不完整
            const productEmpty = !item.productsName; // 未选择物品
            const unitEmpty = item.unitsId === 0; // 单位未选择
            const quantityEmpty = item.quantity === 0; // 数量为0
            const priceEmpty = item.price === 0; // 单价为0
            return productEmpty || unitEmpty || quantityEmpty || priceEmpty;
        });
        if (hasInvalidItem) {
            message.error('请先填写完整所有物品的资料（物品名称、单位、数量、单价）');
            return; // 阻止提交
        }
        let jsonData = JSON.stringify(goods);
        setSpinning(true);
        props.dispatch({
            type:"Application/edit",
            payload:{uid,orderCode,orderTime,warehouseId,supplierId,paidAmount,totalAmount,remark,jsonData,pmId},
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                setSpinning(false);
                history.push('/warehouse/checkPurchaseRequest')
            }else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
            }
        })
    };
    // 添加10条空记录的处理函数
    const addTenEmptyRecords = () => {
        // 获取当前最大ID，不存在则从1开始
        const maxId = goods.length > 0
            ? Math.max(...goods.map(item => item.id))
            : 0;
        // 生成10条空记录，ID递增
        const newRecords = Array.from({length: 1}, (_, i) => ({
            id: maxId + i + 1,
            productsImageBase64: '', // 同步物品图片
            productsName: '', // 更新物品名称
            productsCode: '', // 同步物品编号
            abbreviation: '', // 同步物品助查码
            productsImage: '', // 图片名称
            brandId: 0, // 同步物品品牌
            groupId: 0, // 同步物品分组
            number: 0, // 同步物品数量
            presalePrice: 0, // 同步物品预售价
            retailPricce: 0, // 同步物品预售价
            costPrice: 0, // 同步物品预售价
            specifications: '', // 同步物品规格
            barcode: '', // 同步物品条码
            remark: '', // 同步物品备注
            unitsId: 0, // 同步单位ID
            quantity: 0, // 同步物品数量
            price: 0, // 同步物品预售价
            totalPrice: 0, // 物品总金额
            unitsList: [], // 同步单位列表
            isHs: 0,// 是否换算
            unitsName:''
        }));
        // 添加到现有记录中
        setGoods([...goods, ...newRecords]);
    };
    useEffect(() => {
        // 累加所有物品的totalPrice（处理空值情况）
        const sum = goods.reduce((acc, item) => {
            const price = (item.totalPrice.toFixed(2)*1) || 0; // 确保totalPrice为数字，默认0
            return acc + price;
        }, 0);
        setTotalAmount(sum); // 更新总金额状态
    }, [goods]);
    // 支付方式
    const changePayType=(e)=>{
        setPayTypeId(e);
    };
    const getPayList=()=>{
        props.dispatch({
            type:'PayType/fetch',
        })
    };
    return(
        <Spin spinning={spinning}>
            <Space>
                <Button type="primary" onClick={()=>navigate(-1)}>
                    返回
                </Button>
                <Button type="primary" onClick={onOk}>
                    修改
                </Button>
            </Space>
            <Space style={{display:'flex',justifyContent:'flex-start',alignItems:'center',margin:'10px 0'}}>
                <Input addonBefore="单号:" placeholder='随机生成' value={orderCode} disabled/>
                <DatePicker placeholder={'选择采购日期'} onChange={changeDate} value={dayjs(orderTime)}/>
                <Select
                    placeholder='请选择入库仓库'
                    onChange={changeWarehouse}
                    value={warehouseId}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                        // 假设每个 option 都有一个与数据项对应的 value 属性
                        const item = props.warehouseListList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                        return item?.warehouseName?.toLowerCase().includes(input.toLowerCase());
                    }}
                    options={Array.isArray(props.warehouseListList) && props.warehouseListList.length > 0
                        ? props.warehouseListList.map((item:any)=>({
                            label:item.warehouseName,
                            value:item.id,
                        }))
                        : []}
                />
                <Select
                    placeholder='请选择供应商'
                    value={supplierId}
                    onChange={changeSupplier}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                        // 假设每个 option 都有一个与数据项对应的 value 属性
                        const item = props.supplierList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                        return item?.supplierName?.toLowerCase().includes(input.toLowerCase());
                    }}
                    options={Array.isArray(props.supplierList) && props.supplierList.length > 0
                        ? props.supplierList.map((item:any)=>({
                            label:item.supplierName,
                            value:item.id,
                        }))
                        : []}
                />
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
                        value={pmId}
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
            <Space>
                <InputNumber addonBefore="已付(元):" placeholder='已付金额' min={0} value={paidAmount} onChange={changePaidAmount}/>
                <InputNumber addonBefore="总金额(元):" placeholder='总金额' min={0} disabled value={totalAmount} onChange={changeTotalAmount}/>
                <Input addonBefore="备注:" placeholder='50字以下' style={{width:'300px'}} value={remark} onChange={changeRemark}/>
            </Space>
            <Table
                columns={columnsz}
                rowKey={(columns) => columns.id}
                pagination={false}
                size='small'
                scroll={{y:'55vh'}}
                dataSource={goods}
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
    warehouseListList: state.WarehouseList.list,
    supplierList: state.Supplier.list,
    thingList: state.ThingList.list,
    PayTypeList: state.PayType.list,
});
export default connect(mapStateToProps)(EditApplication);
