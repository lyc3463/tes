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
import {useEffect, useState} from "react";
import {generate} from "@/utils/OpenTool";
import {StaticInfo} from '@/StaticInfo'
import {connect,useNavigate,history} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const AddDirectPurchase=(props)=>{
    const navigate=useNavigate();
    const [spinning, setSpinning] = useState(false);
    const [form] = Form.useForm();
    // 随机单号
    const [orderCode,setOrderCode]=useState('');
    // 仓库id
    const [warehouseId,setWarehouseId]=useState(0);
    // 供应商id
    const [supplierId,setSupplierId]=useState(0);
    // 采购日期
    const [orderTime,setOrderTime]=useState('');
    // 已付金额
    const [paidAmount,setPaidAmount]=useState(0);
    // 总金额
    const [totalAmount,setTotalAmount]=useState(0);
    // 备注
    const [remark,setRemark]=useState('');
    // 订单物品列表
    const [goods,setGoods]=useState([]);
    useEffect(() => {
        setOrderCode(generate(StaticInfo.park_name));
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
                    costPrice: selectedProduct.retailPricce || 0, // 同步物品预售价
                    specifications: selectedProduct.specifications || '', // 同步物品规格
                    barcode: selectedProduct.barcode || '', // 同步物品条码
                    remark: selectedProduct.remark || '', // 同步物品备注
                    unitsId: selectedProduct.unitsId || 0, // 同步单位ID
                    quantity: selectedProduct.quantity || 0, // 同步物品数量
                    price: selectedProduct.price || 0, // 同步物品预售价
                    totalPrice: selectedProduct.quantity * selectedProduct.price || 0, // 物品总金额
                    unitsList: selectedProduct.unitsList || [], // 同步单位列表
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
                    totalPrice: (value || 0) * item.price  // 计算总价
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
                    totalPrice: item.quantity * (value || 0)  // 计算总价
                } : item
            )
        );
    };
    // 修改对应id 的单位id
    const changeUnitsId = (value, recordId) => {
        // 使用函数式更新确保获取最新状态
        setGoods(prevGoods =>
            prevGoods.map(item =>
                // 找到对应ID的记录，更新productsNum字段
                item.id === recordId ? { ...item, unitsId: value || 0 } : item
            )
        );
    };
    const columnsz = [
        {
            title: '物品图片',
            dataIndex: 'productsImageBase64',
            key:'productsImageBase64',
            render:(text)=>{
                return <Image src={text} alt="" style={{width:'50px',height:'50px'}}/>
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
                <Select
                    placeholder='选择单位'
                    style={{width:120}}
                    options={Array.isArray(record.unitsList) && record.unitsList.length > 0
                        ? record.unitsList.map((item:any)=>({
                            label:item.unitsName,
                            value:item.from_unit_id,
                        }))
                        : []}
                    onChange={(value) => changeUnitsId(value, record.id)}
                />
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
                <InputNumber
                    min={0}
                    disabled
                    value={text}
                />
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
        })
    };
    useEffect(() => {
        getSupplierList();
        getWarehouseList();
        getThingList();
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
        console.log(goods);
        let jsonData = JSON.stringify(goods);
        props.dispatch({
            type:"DirectPurchase/add",
            payload:{orderCode,orderTime,warehouseId,supplierId,paidAmount,totalAmount,remark,jsonData},
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/warehouse/checkPurchaseRequest')
            }else {
                message.error(res.ErrorCode + res.Data);
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
        const newRecords = Array.from({length: 2}, (_, i) => ({
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
        }));
        // 添加到现有记录中
        setGoods([...goods, ...newRecords]);
    };
    return(
        <Spin spinning={spinning}>
            <Space>
                <Button type="primary" onClick={()=>navigate(-1)}>
                    返回
                </Button>
                <Button type="primary" onClick={onOk}>
                    确定
                </Button>
            </Space>
            <Space style={{display:'flex',justifyContent:'flex-start',alignItems:'center',margin:'10px 0'}}>
                <Input addonBefore="单号:" placeholder='随机生成' value={orderCode} disabled/>
                <DatePicker placeholder={'选择采购日期'} onChange={changeDate}/>
                <Select
                    placeholder='请选择入库仓库'
                    onChange={changeWarehouse}
                    options={Array.isArray(props.warehouseListList) && props.warehouseListList.length > 0
                        ? props.warehouseListList.map((item:any)=>({
                            label:item.warehouseName,
                            value:item.id,
                        }))
                        : []}
                />
                <Select
                    placeholder='请选择供应商'
                    showSearch
                    onChange={changeSupplier}
                    optionFilterProp="children"
                    options={Array.isArray(props.supplierList) && props.supplierList.length > 0
                        ? props.supplierList.map((item:any)=>({
                            label:item.supplierName,
                            value:item.id,
                        }))
                        : []}
                />
                <Input addonBefore="备注:" placeholder='50字以下' style={{width:'300px'}} value={remark} onChange={changeRemark}/>
            </Space>
            <Space>
                <InputNumber addonBefore="已付(元):" placeholder='已付金额' min={0} value={paidAmount} onChange={changePaidAmount}/>
                <InputNumber addonBefore="总金额(元):" placeholder='总金额' min={0} value={totalAmount} onChange={changeTotalAmount}/>
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
                增加2条记录
            </Button>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    warehouseListList: state.WarehouseList.list,
    supplierList: state.Supplier.list,
    thingList: state.ThingList.list,
});
export default connect(mapStateToProps)(AddDirectPurchase);
