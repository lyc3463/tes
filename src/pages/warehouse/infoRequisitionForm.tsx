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
import {StaticInfo} from "@/StaticInfo";
import * as RequisitionForm from '@/services/requisitionForm';
import dayjs from "dayjs";
import {AlignCenterOutlined} from "@ant-design/icons";
import DrawPrint from "@/components/DrawPrint";

const InfoRequisitionForm=(props)=>{
    const navigate=useNavigate();
    const [spinning, setSpinning] = useState(false);
    const [form] = Form.useForm();
    // 随机单号
    const [orderCode,setOrderCode]=useState('');
    // 备注
    const [remark,setRemark]=useState('');
    // 获取当前时间
    const [orderTime, setOrderTime] = useState('2000-01-01');
    // 仓库id
    const [warehouseId,setWarehouseId]=useState(0);
    const [warehouseName,setWarehouseName]=useState('');
    // 库存的物品
    const [displayData, setDisplayData] = useState([]);
    // 采购人
    const [user_name,setUserName]=useState('');
    const [printVisible,setPrintVisible]=useState(false);
    const [orderType,setOrderType]=useState(0);
    const printProps = {
        orderCode,
        warehouseName,
        orderTime,
        user_name,
        displayData,
        title: orderType === 1 ? '领用单' : orderType === 3 ? '报损单' : '未知单据'
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
    ];
    // 仓库列表
    const getWarehouseList=()=>{
        props.dispatch({
            type:"WarehouseList/fetch",
        })
    };
    useEffect(() => {
        getWarehouseList();
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getOne(id);
    }, []);
    const getOne=async (id:string)=>{
        setSpinning(true);
        let res:any=await  RequisitionForm.one(id);
        if (res.ErrorCode==0){
            let data=res.Data;
            console.log('详情',data);
            setSpinning(false);
            setDisplayData(data.ppList)
            setOrderCode(data.orderCode);
            setWarehouseId(data.warehouseId);
            setOrderTime(data.orderTime);
            setRemark(data.remark);
            setOrderType(data.orderType);
            setUserName(data.user_name);
        }else {
            message.error(res.Data);
            setSpinning(false);
        }
    };
    // 自定义打印方法（处理内容隔离和样式）
    const handlePrint = () => {
        setTimeout(() => {
            // 3. 触发打印（此时已应用最新仓库名称）
            window.print();
        }, 0);
    };
    const isOpen=()=>{
        setPrintVisible(true);
        // 1. 动态获取仓库名称（修复硬编码）
        const warehouse = props.WarehouseList.find(w => w.id === warehouseId);
        setWarehouseName(warehouse?.warehouseName || '未知仓库');
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
                    <DatePicker value={dayjs(orderTime)}/>
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
                        value={warehouseId}
                        placeholder='请选择入库仓库'
                        options={Array.isArray(props.WarehouseList) && props.WarehouseList.length > 0
                            ? props.WarehouseList.map((item:any)=>({
                                label:item.warehouseName,
                                value:item.id,
                            }))
                            : []}
                    />
                </Space.Compact>
                <Input placeholder='备注' value={remark} maxLength={50} showCount/>
            </Space>
            {/*<Space style={{marginTop:'10px'}}>*/}
            {/*    <InputNumber addonBefore="已付(元):" placeholder='已付金额' min={0} value={paidAmount}/>*/}
            {/*    <InputNumber addonBefore="总金额(元):" placeholder='总金额' min={0} value={totalAmount}/>*/}
            {/*</Space>*/}
            <Table
                columns={columnsz}
                rowKey="ppId"  // 简化rowKey写法
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
                    <DrawPrint {...printProps} />
                </div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    WarehouseList: state.WarehouseList.list,
});
export default connect(mapStateToProps)(InfoRequisitionForm);
