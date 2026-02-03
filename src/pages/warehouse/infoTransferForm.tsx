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
import DrawPrint from "@/components/DrawPrint";
import TransferFormPrint from "@/components/TransferFormPrint";
import {AlignCenterOutlined} from "@ant-design/icons";

const InfoTransferForm=(props)=>{
    const navigate=useNavigate();
    const [spinning, setSpinning] = useState(false);
    // 随机单号
    const [orderCode,setOrderCode]=useState('');
    // 备注
    const [remark,setRemark]=useState('');
    // 获取当前时间
    const [orderTime, setOrderTime] = useState(getCurrentDate());
    // 出库仓库
    const [warehouseId,setWarehouseId]=useState(0);
    const [warehouseName,setWarehouseName]=useState('');
    // 入库仓库
    const [warehouseId2,setWarehouseId2]=useState(0);
    const [warehouseName2,setWarehouseName2]=useState('');
    // 添加调拨的物品
    const [displayData, setDisplayData] = useState([]);
    // 库存的物品
    const [thingStockInfoList,setThingStockInfoList]=useState([]);
    const [uid,setUid]=useState(0);
    // 采购人
    const [user_name,setUserName]=useState('');
    const [printVisible,setPrintVisible]=useState(false);
    const printProps = {
        orderCode,
        warehouseName,
        orderTime,
        user_name,
        displayData,
        warehouseName2,
        title: '调拨单'
    };
    const getOne=async (id:string)=>{
        setSpinning(true);
        let res:any=await  RequisitionForm.one(id);
        if (res.ErrorCode==0){
            console.log('调拨',res);
            let data=res.Data;
            setSpinning(false);
            setOrderCode(data.orderCode);
            setWarehouseId(data.warehouseId);
            setWarehouseId2(data.warehouseId2);
            setOrderTime(data.orderTime);
            setRemark(data.remark);
            // getList(data.warehouseId);
            setUserName(data.user_name);
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
            title: '调拨数量',
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
    ];

    // 获取库存
    const getList=(e:number)=>{
        setSpinning(true);
        props.dispatch({
            type:'ThingStockInfo/fetch',
            payload:{page:1, pageSize:1000, warehouseId:e, productsName:'', startDate:'2000-01-01', endDate:'2099-01-01'}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setThingStockInfoList(res.Data);
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

    useEffect(() => {
        getWarehouseList();
    }, []);
    const isOpen=()=>{
        setPrintVisible(true);
        // 1. 动态获取仓库名称（修复硬编码）
        const warehouse = props.WarehouseList.find(w => w.id === warehouseId);
        setWarehouseName(warehouse?.warehouseName || '未知仓库');
        // 2. 动态获取入库仓库名称（修复硬编码）
        const warehouse2 = props.WarehouseList.find(w => w.id === warehouseId2);
        setWarehouseName2(warehouse2?.warehouseName || '未知仓库');
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
                    icon={<AlignCenterOutlined />}
                />
            </Space>
            <Space style={{display:'flex',justifyContent:'flex-start',alignItems:'center',marginTop:'10px'}}>
                <Input addonBefore="单号:" placeholder='随机生成' value={orderCode}/>
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
                        出库仓库:
                    </div>
                    <Select
                        placeholder='出库仓库'
                        disabled
                        value={warehouseId}
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
                        入库仓库:
                    </div>
                    <Select
                        placeholder='入库仓库'
                        value={warehouseId2}
                        disabled
                        options={Array.isArray(props.WarehouseList) && props.WarehouseList.length > 0
                            ? props.WarehouseList.map((item:any)=>({
                                label:item.warehouseName,
                                value:item.id,
                            }))
                            : []}
                    />
                </Space.Compact>
                <Input placeholder='备注' value={remark} disabled  maxLength={50} showCount/>
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
                    <TransferFormPrint {...printProps} />
                </div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    ThingStockInfoList: state.ThingStockInfo.list,
    WarehouseList: state.WarehouseList.list,

});
export default connect(mapStateToProps)(InfoTransferForm);
