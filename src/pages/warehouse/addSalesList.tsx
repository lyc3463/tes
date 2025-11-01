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

const addSalesList=(props)=>{
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
    // 库存的物品
    const [displayData, setDisplayData] = useState([]);
    // 选中行的id
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    // 已付金额
    const [paidAmount,setPaidAmount]=useState(0);
    // 总金额
    const [totalAmount,setTotalAmount]=useState(0);
    // 客户类型
    const [customerType,setCustomerType]=useState(2);
    // 客户id
    const [customerId,setCustomerId]=useState(2);
    useEffect(() => {
        setOrderCode(generate(StaticInfo.park_name));
    }, []);
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
            key:'unitsName',
        },
        {
            title: '折扣%',
            dataIndex: 'discount',
            key:'discount',
            render:(text, record) => (
                <InputNumber
                    min={0}
                    value={text}
                    // 使用onChange事件捕获值变化，传递新值和记录ID
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
                    min={record.totalpresalePrice}
                    value={text}
                />
            )
        },
        // {
        //     title: '控价',
        //     dataIndex: 'presalePrice',
        //     key:'presalePrice',
        // },
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
    ];
    // 已付金额
    const changePaidAmount=(e)=>{
        setPaidAmount(e);
    };
    // 总金额
    const changeTotalAmount=(e)=>{
        setTotalAmount(e);
    };
    // 折扣
    const changeDiscount = (value, recordId) => {
        if (value === null) return; // 处理输入框清空的情况
        // 更新对应商品的出库数量和总价
        const updatedData = displayData.map(item => {
            if (item.id === recordId) {
                const discount = value;
                const totalPrice = item.quantity * item.price*discount/100; // 计算商品总价
                const totalpresalePrice = item.quantity * item.presalePrice; // 折后金额不低于零售控价*数量
                return { ...item, discount,totalpresalePrice, totalPrice };
            }
            return item;
        });
        setDisplayData(updatedData);
    };
    // 修改对应id 的数量
    const changproductsNum = (value, recordId) => {
        if (value === null) return; // 处理输入框清空的情况
        // 更新对应商品的出库数量和总价
        const updatedData = displayData.map(item => {
            if (item.id === recordId) {
                const quantity = value;
                const totalPrice = quantity * item.price*item.discount/100; // 计算商品总价
                const totalpresalePrice = item.quantity * item.presalePrice; // 折后金额不低于零售控价*数量
                return { ...item,totalpresalePrice, quantity, totalPrice };
            }
            return item;
        });
        setDisplayData(updatedData);
    };
    // 修改对应id 的单价
    const changproductsPrice = (value, recordId) => {
        if (value === null) return; // 处理输入框清空的情况
        // 更新对应商品的出库数量和总价
        const updatedData = displayData.map(item => {
            if (item.id === recordId) {
                const price = value;
                const totalPrice = price * item.quantity; // 计算商品总价
                return { ...item, price, totalPrice };
            }
            return item;
        });
        setDisplayData(updatedData);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[], selectedRows: any[]) => {
            setSelectedRowKeys(selectedKeys);
        },
        type: 'checkbox',  // 复选框类型
    };
    const changeDate=(date:dayjs.Dayjs,item:string)=>{
        setOrderTime(item);
    };
    // 获取库存
    const getList=(e:number)=>{
        setSpinning(true);
        props.dispatch({
            type:'ThingStockInfo/fetch',
            payload:{page:1, pageSize:1000, warehouseId:e, productsName:'', startDate:'2000-01-01', endDate:'2099-01-01'}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('库存',res.Data);
                let newArr=res.Data.map((item)=>{
                    return {...item,
                        quantity:0,
                        price:item.retailPricce,
                        inventoryId:item.id,
                        quantityKc:item.quantity,
                        priceKc:item.price,
                        totalPrice:0,
                        discount:100
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
    }, []);
    const onOK=()=>{
        if (orderTime==='') return message.warning('请选择申请时间');
        const selectedItems = displayData.filter(item =>
            selectedRowKeys.includes(item.id)
        );
        // 可选：添加未选择项的提示
        if (selectedItems.length === 0) return message.warning('请先选择需要申请的物品');
        let jsonData = JSON.stringify(selectedItems);
        console.log('jsonData',jsonData);
        setSpinning(true);
        props.dispatch({
            type:'SalesList/add',
            payload:{warehouseId, orderCode, orderTime, jsonData, paidAmount, totalAmount, remark,warehouseId2:0,customerType,customerId}
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
    const changeCustomerType=(e)=>{
        setCustomerType(e);
    };
    // 客户id
    const changeCustomerId=(e)=>{
        setCustomerId(e);
    };
    return(
        <Spin spinning={spinning}>
            <Space>
                <Button type="primary" onClick={()=>navigate(-1)}>
                    返回
                </Button>
                <Button type="primary" onClick={onOK}>
                    添加销售
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
                        placeholder='请选择仓库'
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
                        选择客户类型:
                    </div>
                    <Select
                        placeholder='客户类型'
                        onChange={changeCustomerType}
                        value={customerType}
                        style={{width:120}}
                        options={[
                            {
                                label:'小程序用户',
                                value:1,
                            },
                            {
                                label:'客户',
                                value:2,
                            },
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
                        客户:
                    </div>
                    <Select
                        placeholder='请选择客户'
                        value={customerId}
                        onChange={changeCustomerId}
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
                        placeholder='支付方式'
                        style={{width:120}}
                        options={[]}
                    />
                </Space.Compact>
            </Space>
            <Space style={{marginTop:'10px'}}>
                <InputNumber addonBefore="总金额(元):" placeholder='总金额' min={0} value={totalAmount} onChange={changeTotalAmount}/>
                <InputNumber addonBefore="折扣:" placeholder='折扣' min={0}/>
                <InputNumber addonBefore="折后金额:" placeholder='折后金额' min={0}/>
                <InputNumber addonBefore="实收金额(元):" placeholder='实收金额' min={0} value={paidAmount} onChange={changePaidAmount}/>
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
                rowSelection={rowSelection}  // 添加选择功能配置
            />
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    ThingStockInfoList: state.ThingStockInfo.list,
    WarehouseList: state.WarehouseList.list,

});
export default connect(mapStateToProps)(addSalesList);
