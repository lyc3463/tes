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
import {AlignCenterOutlined} from "@ant-design/icons";
import SalesPrint from "@/components/SalesPrint";
import * as ThingStockInfoServer from "@/services/thingStockInfo";

const InfoSalesList=(props)=>{
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
    // 客户类型
    const [customerType,setCustomerType]=useState(0);
    // 客户id
    const [customerId,setCustomerId]=useState(0);
    const [pmId ,setPayTypeId]=useState(0);
    const [uid,setUid]=useState(0);
    const [warehouseName,setWarehouseName]=useState('');
    const [user_name,setUserName]=useState('');
    const [customerName,setCustomerName]=useState('');
    const [pmName,setPmName]=useState('');
    const [printVisible,setPrintVisible]=useState(false);
    const [salesperson,setSalesPerson]=useState(0);

    const printProps = {
        orderCode,
        warehouseName,
        orderTime,
        user_name,
        displayData,
        pmName,
        customerName,
        paidAmount,
        totalAmount,
        discountPrice,
        discountRate,
        title:'销售单'
    };
    const getOne=async (id:string)=>{
        setSpinning(true);
        let res:any=await  RequisitionForm.one(id);
        if (res.ErrorCode==0){
            let data=res.Data;
            console.log('详情',res);
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
            setCustomerType(data.customerType);
            setCustomerId(data.customerId);
            getList(data.warehouseId);
            setUserName(data.user_name);
            setSalesPerson(data.salesperson);
            if (data.customerType==1){
                getwxUserList();
            }else {
                getKeList();
            }
            if (data.ppList.length>0&&data.ppList){
                let newArr=data.ppList.map((item:any,index)=>{
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
                    disabled
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
            dataIndex: 'discountRateDp',
            key:'discountRateDp',
            render:(text, record) => (
                <InputNumber
                    min={0}
                    value={text}
                    // 当"是否打折"为"否"(0)时禁用输入框，仅"是"(1)时可编辑
                    disabled={record.isZk === 0}
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
    ];
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
    useEffect(() => {
        getWarehouseList();
        getPayList();
        getUserList();
    }, []);
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
    const getPayList=()=>{
        props.dispatch({
            type:'PayType/fetch',
        })
    };
    // 获取用户列表
    const getUserList=()=>{
        props.dispatch({
            type:"Users/fetch",
        })
    };
    const isOpen=()=>{
        setPrintVisible(true);
        const warehouse = props.WarehouseList.find(w => w.id === warehouseId);
        setWarehouseName(warehouse?.warehouseName || '未知仓库');
        if (customerType==1){
            const user = props.AppUserList.find(w => w.id === customerId);
            setCustomerName(user?.appUser_phone || '未知用户');
        }
        if (customerType==2){
            const user = props.CheckCompanyList.find(w => w.id === customerId);
            setCustomerName(user?.custom_name || '未知用户');
        }
        const pmName = props.PayTypeList.find(w => w.id === pmId);
        setPmName(pmName?.pmName || '未知负责人');
    };
    // 自定义打印方法（处理内容隔离和样式）
    const handlePrint = () => {
        setTimeout(() => {
            // 3. 触发打印（此时已应用最新仓库名称）
            window.print();
        }, 0);
    };
    return(
        <Spin spinning={spinning}>
            <style global>
                {`
                    /* 隐藏浏览器默认页眉页脚（包含路由路径） */
                    @media print {
                      @page {
                        size: A4; /* 指定A4纸张 */
                        margin: 0; /* 边距设为0，消除默认页眉页脚区域 */
                      }
            
                      /* 确保打印内容有内边距（替代浏览器默认边距） */
                      .print-only-content {
                        padding: 20mm; /* 模拟A4标准边距（上右下左） */
                        margin: 0 auto;
                        width: 210mm; /* A4宽度 */
                        min-height: 297mm; /* A4高度 */
                        box-sizing: border-box;
                      }
            
                      /* 隐藏所有非打印内容 */
                      body *:not(.print-only-content):not(.print-only-content *) {
                        visibility: hidden;
                      }
            
                      /* 确保打印容器可见且定位正确 */
                      .print-only-content {
                        visibility: visible !important;
                        position: fixed;
                        left: 0;
                        top: 0;
                        background: white;
                      }
                    }
                  `}
            </style>
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
                    <DatePicker defaultValue={dayjs(orderTime)} disabled/>
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
                        value={warehouseId}
                        disabled
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
                        选择客户类型:
                    </div>
                    <Select
                        placeholder='客户类型'
                        style={{width:120}}
                        disabled
                        value={customerType}
                        options={[
                            {
                                label:'小程序',
                                value:1,
                            },
                            {
                                label:'客户',
                                value:2,
                            },
                        ]}
                    />
                </Space.Compact>
                {(customerType === 1 || customerType === 2) && (
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
                            showSearch  // 启用搜索
                            optionFilterProp="label"  // 搜索匹配label字段
                            placeholder="请选择客户"
                            style={{ width: 120 }}
                            value={customerId}
                            disabled
                            // 搜索过滤逻辑（不区分大小写）
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            // 动态生成选项（根据客户类型切换数据源）
                            options={
                                customerType === 1
                                    ? (Array.isArray(props.AppUserList)
                                        ? props.AppUserList.map(item => ({
                                            label: item.appUser_phone,  // 小程序用户显示手机号
                                            value: item.id
                                        }))
                                        : [])
                                    : (Array.isArray(props.CheckCompanyList)
                                        ? props.CheckCompanyList.map(item => ({
                                            label: item.custom_name,  // 客户显示名称
                                            value: item.id
                                        }))
                                        : [])
                            }
                        />
                    </Space.Compact>
                )}
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
                        disabled
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
                <Input placeholder='备注' value={remark} disabled  maxLength={50} showCount/>
            </Space>
            <Space style={{marginTop:'10px'}}>
                <InputNumber addonBefore="总金额(元):" placeholder='总金额' min={0} disabled value={discountPrice}/>
                <InputNumber addonBefore="折扣%:" placeholder='折扣%' min={0} max={100} value={discountRate} disabled/>
                <InputNumber addonBefore="折后金额:" placeholder='折后金额' min={0}  value={totalAmount} disabled/>
                <InputNumber addonBefore="实收金额(元):" placeholder='实收金额' min={0} value={paidAmount} disabled/>
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
                        disabled
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
                    <SalesPrint {...printProps} />
                </div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    ThingStockInfoList: state.ThingStockInfo.list,
    WarehouseList: state.WarehouseList.list,
    AppUserList: state.AppUser.list,
    CheckCompanyList: state.CheckCompany.list,
    PayTypeList: state.PayType.list,
    UsersList: state.Users.list,

});
export default connect(mapStateToProps)(InfoSalesList);
