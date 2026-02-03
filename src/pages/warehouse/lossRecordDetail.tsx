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
import * as InventoryRequest from '@/services/inventoryRequest';

const LossRecordDetail=(props)=>{
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
    // 库存的物品
    const [displayData, setDisplayData] = useState([]);
    // 选中行的id
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
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
            title: '单位',
            dataIndex: 'unitsName',
            key:'unitsName',
        },
        {
            title:'盘点数量',
            dataIndex:'quantity',
            key:'quantity',
            ellipsis:true,
        },
        {
            title:'库存数量',
            dataIndex:'quantityKc',
            key:'quantityKc',
            ellipsis:true,
        },
        {
            title:'差异数量',
            dataIndex:'quantityDiff',
            key:'quantityDiff',
            ellipsis:true,
            render:(text,record)=>{
                return record.quantity-record.quantityKc;
            }
        },
    ];
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[], selectedRows: any[]) => {
            setSelectedRowKeys(selectedKeys);
        },
        type: 'checkbox',  // 复选框类型
    };
    // 仓库列表
    const getWarehouseList=()=>{
        props.dispatch({
            type:"WarehouseList/fetch",
        })
    };
    const getOne=async (id:string)=>{
        setSpinning(true);
        let res:any=await  InventoryRequest.one(id);
        if (res.ErrorCode==0){
            let data=res.Data;
            console.log('详情',data);
            setSpinning(false);
            setDisplayData(data.spList)
            setOrderCode(data.stockCode);
            setWarehouseId(data.warehouseId);
            setOrderTime(data.stockTime);
            setRemark(data.remark);
        }else {
            message.error(res.Data);
            setSpinning(false);
        }
    };
    useEffect(() => {
        getWarehouseList();
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getOne(id);
    }, []);
    return(
        <Spin spinning={spinning}>
            <Space>
                <Button type="primary" onClick={()=>navigate(-1)}>
                    返回
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
                    <DatePicker defaultValue={dayjs(stockTime)} />
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
                        value={warehouseId}
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
                rowSelection={rowSelection}
            />
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    ThingStockInfoList: state.ThingStockInfo.list,
    WarehouseList: state.WarehouseList.list,

});
export default connect(mapStateToProps)(LossRecordDetail);
