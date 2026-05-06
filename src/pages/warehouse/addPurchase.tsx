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
    Table, Tag
} from "antd";
import {useEffect, useRef, useState} from "react";
import {generate} from "@/utils/OpenTool";
import {StaticInfo} from '@/StaticInfo'
import {connect,useNavigate,history} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as Application from "@/services/application";
import dayjs from "dayjs";
const AddPurchase=(props)=>{
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
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const getOne=async (id:string)=>{
        setSpinning(true);
        let res:any=await  Application.one(id);
        if (res.ErrorCode==0){
            let data=res.Data;
            console.log('详情',data);
            setSpinning(false);
            setOrderCode(data.orderCode);
            setWarehouseId(data.warehouseId);
            setSupplierId(data.supplierId);
            setOrderTime(data.orderTime);
            setPaidAmount(data.paidAmount);
            setTotalAmount(data.totalAmount);
            setRemark(data.remark);
            setGoods(data.ppList);
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
                    value={record.unitsId}
                    options={Array.isArray(record.unitsList) && record.unitsList.length > 0
                        ? record.unitsList.map((item:any)=>({
                            label:item.unitsName,
                            value:item.from_unit_id,
                        }))
                        : []}
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
            title: '入库状态',
            dataIndex: 'iskc',
            key:'iskc',
            render:(text, record) => (
                <>
                    <Tag color={text==0?'blue':'green'}>{text==0?'未入库':'已入库'}</Tag>
                </>
            )
        },
    ];
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
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[], selectedRows: any[]) => {
            setSelectedRowKeys(selectedKeys);
        },
        type: 'checkbox',  // 复选框类型
        // 根据iskc值控制复选框是否可用
        getCheckboxProps: (record) => ({
            disabled: record.iskc !== 0, // iskc不等于0时禁用复选框（已入库）
        }),
    };
    // 确定入库
    const onOK=()=>{
        if (selectedRowKeys.length < 1) {
            message.error('请选择要入库的物品');
            return; // 阻止提交
        }
        setSpinning(true);
        props.dispatch({
            type:'Purchase/addWarehousing',
            payload:{
                warehouseId,
                jsonId:selectedRowKeys.join('|'),
            },
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('入库成功');
                setSpinning(false);
                getOne(uid);
                setSelectedRowKeys([]);
            } else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <Space>
                <Button type="primary" onClick={()=>navigate(-1)}>
                    返回
                </Button>
                <Button type="primary" onClick={onOK}>
                    确定入库
                </Button>
            </Space>
            <Space style={{display:'flex',justifyContent:'flex-start',alignItems:'center',margin:'10px 0'}}>
                <Input addonBefore="单号:" placeholder='随机生成' value={orderCode} disabled/>
                <DatePicker placeholder={'选择采购日期'} value={dayjs(orderTime)}/>
                <Select
                    placeholder='请选择入库仓库'
                    value={warehouseId}
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
                    value={supplierId}
                    optionFilterProp="children"
                    options={Array.isArray(props.supplierList) && props.supplierList.length > 0
                        ? props.supplierList.map((item:any)=>({
                            label:item.supplierName,
                            value:item.id,
                        }))
                        : []}
                />
                <Input addonBefore="备注:" placeholder='50字以下' style={{width:'300px'}} value={remark}/>
            </Space>
            <Space>
                <InputNumber addonBefore="已付(元):" placeholder='已付金额' min={0} value={paidAmount}/>
                <InputNumber addonBefore="总金额(元):" placeholder='总金额' min={0} value={totalAmount}/>
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
                rowSelection={rowSelection}  // 添加选择功能配置
            />
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    warehouseListList: state.WarehouseList.list,
    supplierList: state.Supplier.list,
    thingList: state.ThingList.list,
});
export default connect(mapStateToProps)(AddPurchase);
