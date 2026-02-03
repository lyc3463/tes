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

const EditTransferForm=(props)=>{
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
    // 入库仓库
    const [warehouseId2,setWarehouseId2]=useState(0);
    // 添加调拨的物品
    const [displayData, setDisplayData] = useState([]);
    // 库存的物品
    const [thingStockInfoList,setThingStockInfoList]=useState([]);
    const [uid,setUid]=useState(0);
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
            getList(data.warehouseId);
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
                    ? `http://ckimg.dyc10.com/${textStr}`
                    : `http://ckimg.dyc10.com/${textStr}_X.png`;
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
            render: (text, record) => {
                // Check if iList is a non-empty array
                const hasValidUnits = Array.isArray(record.iList) && record.iList.length > 0;
                // Render text if no valid units, otherwise render Select
                if (!hasValidUnits) {
                    return <span>{record.unitsName}</span>;
                }
                return (
                    <Select
                        showSearch
                        optionFilterProp="children"
                        placeholder="选择单位"
                        style={{ width: 120 }}
                        value={text || undefined}
                        onChange={(value) => handleUnitSelect(record.id, value)}
                        options={record.iList.map(item => ({
                            label: item.unitsName || '',
                            value: item.unitsId || 0
                        }))}
                    />
                );
            }
        },
        {
            title: '调拨数量',
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
    // 删除物品
    const isDel=(id:number)=>{
        setDisplayData(displayData.filter((item)=>item.id!==id));
    };
    // 修改对应id 的数量
    const changproductsNum = (value, recordId) => {
        if (value === null) return; // 处理输入框清空的情况
        // 更新对应商品的出库数量和总价
        const updatedData = displayData.map(item => {
            if (item.id === recordId) {
                const quantity = value;
                return { ...item, quantity };
            }
            return item;
        });
        setDisplayData(updatedData);
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
        })
    };
    // 仓库id
    const changeWarehouse=(e)=>{
        setWarehouseId(e);
        setDisplayData(prevDisplayData => prevDisplayData.filter(item => item.productsName === ''));
        getList(e);
    };
    // 入库仓库id
    const changeWarehouse2=(e)=>{
        setWarehouseId2(e);
    };
    useEffect(() => {
        getWarehouseList();
    }, []);
    const onOK=()=>{
        if (orderTime==='') return message.warning('请选择申请时间');
        if (warehouseId2===0) return message.warning('请选择入库仓库');
        const filteredData = displayData.filter(item => item.productsCode !== '' && item.unitsId > 0);
        if (filteredData.length === 0) return message.warning('请选择有效的物品信息');
        const hasInvalidQuantity = filteredData.some(item => item.quantity <= 0);
        if (hasInvalidQuantity) {
            return message.warning('请输入调拨数量');
        }
        console.log('selectedItems',filteredData);
        let jsonData = JSON.stringify(filteredData);
        setSpinning(true);
        props.dispatch({
            type:'TransferForm/edit',
            payload:{uid,warehouseId, orderCode, orderTime, jsonData, paidAmount:0, totalAmount:0,discountPrice:0, remark,pmId:0,customerType:0,customerId:0,discountRate:0,warehouseId2:warehouseId2,parkIdDB:0,salesperson:0}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                setSpinning(false);
                history.push('/warehouse/thingStock');
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
                            productsCode:0,
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
                            poId:uid
                        };
                    }
                    return item;
                }));
            }else {
                message.error(res.Data);
            }
        })
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
            poId:uid,
            iList:[]
        }));
        // 添加到现有记录中
        setDisplayData([...displayData, ...newRecords]);
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
                    <DatePicker value={dayjs(orderTime)} onChange={changeDate}/>
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
                        onChange={changeWarehouse}
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
                        onChange={changeWarehouse2}
                        options={Array.isArray(props.WarehouseList) && props.WarehouseList.length > 0
                            ? props.WarehouseList.map((item:any)=>({
                                label:item.warehouseName,
                                value:item.id,
                            }))
                            : []}
                    />
                </Space.Compact>
                <Input placeholder='备注' value={remark} onChange={changeRemark}  maxLength={50} showCount/>
            </Space>
            {/*<Space style={{marginTop:'10px'}}>*/}
            {/*    <InputNumber addonBefore="已付(元):" placeholder='已付金额' min={0} value={paidAmount} onChange={changePaidAmount}/>*/}
            {/*    <InputNumber addonBefore="总金额(元):" placeholder='总金额' min={0} value={totalAmount} onChange={changeTotalAmount}/>*/}
            {/*</Space>*/}
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

});
export default connect(mapStateToProps)(EditTransferForm);
