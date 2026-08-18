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
import * as RequisitionForm from '@/services/requisitionForm';
import {StaticInfo} from "@/StaticInfo";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {PlusOutlined} from "@ant-design/icons";
import * as ThingStockInfoServer from "@/services/thingStockInfo";
import * as ParkListServer from "@/services/parkList";

const AddCrossStoreTransferForm=(props)=>{
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
    // 已付金额
    const [paidAmount,setPaidAmount]=useState(0);
    // 总金额
    const [totalAmount,setTotalAmount]=useState(0);
    const [parkList,setParkList]=useState(StaticInfo.parkList);
    const [warehouseList,setWarehouseList]=useState([]);
    // 入库园区
    const [parkIdDB,setParkIdDB]=useState(0);
    useEffect(() => {
        setOrderCode(generate(StaticInfo.park_name));
        addEmptyRecords(5);
        getWarehouseList();
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
                    ? `${window.ServerConfig.imgServer}${textStr}`
                    : `${window.ServerConfig.imgServer}${textStr}_X.png`;
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
            title: '物品选择',
            dataIndex: 'inventoryId',
            key: 'inventoryId',
            width: 300,
            render: (text, record) => (
                <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder="搜索物品名称"
                    style={{ width: '100%' }}
                    value={text || undefined}
                    onChange={(value) => handleProductSelect(value, record)}
                    filterOption={(input, option) => {
                        if (!Array.isArray(thingStockInfoList) || thingStockInfoList.length === 0) return false;
                        const item = thingStockInfoList.find(unit => `${unit.unitsName}${unit.productsName}` === option.value);
                        if (!item) return false;
                        const searchInput = input.toLowerCase();
                        return item.productsName?.toLowerCase().includes(searchInput);
                    }}
                    options={Array.isArray(thingStockInfoList)
                        ? thingStockInfoList.map(item => ({
                            label: `${item.unitsName}-${item.productsName}`,
                            value: item.id
                        }))
                        : []}
                />
            )
        },
        {
            title: '物品编号',
            dataIndex: 'productsCode',
            key:'productsCode',
        },
        {
            title: '单位',
            dataIndex: 'unitsName',
            key: 'unitsName',
            render: (text, record) => (
                <Input
                    min={0}
                    value={text}
                />
            )
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
    const onOK=()=>{
        if (orderTime==='') return message.warning('请选择申请时间');
        if (parkIdDB===0) return message.warning('请选择入库园区');
        if (warehouseId2===0) return message.warning('请选择入库仓库');
        const filteredData = displayData.filter(item => item.productsCode !== '' && item.unitsId > 0);
        if (filteredData.length === 0) return message.warning('请选择有效的物品信息');
        const hasInvalidQuantity = filteredData.some(item => item.quantity <= 0);
        if (hasInvalidQuantity) {
            return message.warning('请输入调拨数量');
        }
        let newFilteredData = filteredData.map((item:any)=>({
            inventoryId: item.inventoryId,
            quantity: item.quantity,
            unitsId: item.unitsId,
            productsName: item.productsName,
            productsCode: item.productsCode,
            productsImage: item.productsImage,
            price: item.price,
            totalPrice: item.totalPrice,
            discountRateDp: item.discountRateDp,
            discountPriceDp: item.discountPriceDp,
            isZk: item.isZk,
            id: item.productsId,
        }));
        console.log('selectedItems',filteredData);
        let jsonData = JSON.stringify(newFilteredData);
        setSpinning(true);
        RequisitionForm.addCrossStoreTransfer({warehouseId, orderCode, orderTime, jsonData, remark,warehouseId2,parkIdDB}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
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
    const handleProductSelect = (value, record) => {
        const selectedProduct = thingStockInfoList.find(item => item.id == value);
        console.log('选择的物品', selectedProduct);
        setDisplayData(displayData.map(item => {
            if (item.id === record.id) {
                return {
                    ...item,
                    productsImage: selectedProduct.productsImage || '',
                    productsName: selectedProduct.productsName || '',
                    iList: selectedProduct.unitsList || [],
                    brandId: 0,
                    costPrice: 0,
                    inventoryId: selectedProduct.id,
                    presalePrice: selectedProduct.presalePrice,
                    price: selectedProduct.price,
                    priceKc: 0,
                    productsCode: selectedProduct.productsCode,
                    quantity: 0,
                    productsId:selectedProduct.productsId,
                    quantityKc: selectedProduct.quantity || 0,
                    retailPricce: selectedProduct.presalePrice,
                    totalPrice: 0,
                    unitsId: selectedProduct.unitsId || 0,
                    unitsName: selectedProduct.unitsName || '',
                    isZk: 1,
                    discountRateDp: 100,
                    discountPriceDp: 0,
                };
            }
            return item;
        }));


        // const selectedProduct = thingStockInfoList.find(item => item.productsName === label.label);
        // ThingStockInfoServer.productsNameQuery(warehouseId, selectedProduct.productsCode).then((res: TypeErrorCode) => {
        //     console.log('选择的物品', res);
        //     if (res.ErrorCode == 0) {
        //         setDisplayData(displayData.map(item => {
        //             if (item.id === recordId) {
        //                 return {
        //                     ...item,
        //                     productsImageBase64: res.Data.productsImageBase64 || '',
        //                     productsImage: res.Data.productsImage || '',
        //                     productsName: selectedProduct.productsName || '',
        //                     iList: res.Data.iList || [],
        //                     brandId: 0,
        //                     abbreviation: '',
        //                     barcode: '',
        //                     costPrice: 0,
        //                     groupId: 0,
        //                     inventoryId: 0,
        //                     number: 0,
        //                     presalePrice: 0,
        //                     price: 0,
        //                     priceKc: 0,
        //                     productsCode: 0,
        //                     quantity: 0,
        //                     quantityKc: 0,
        //                     retailPricce: 0,
        //                     specifications: '',
        //                     totalPrice: 0,
        //                     unitsId: 0,
        //                     unitsName: 0,
        //                     isZk: 1,
        //                     discountRateDp: 100,
        //                     discountPriceDp: 0,
        //                 };
        //             }
        //             return item;
        //         }));
        //     } else {
        //         message.error(res.Data);
        //     }
        // })
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

    // 获取园区所属的仓库列表
    const getParkWarehouseList=(e)=>{
        ParkListServer.warehouseList(e,2).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setWarehouseList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 入库园区改变时，获取该园区所属的仓库列表
    const changeParkIdDB=(e)=>{
        setParkIdDB(e);
        setWarehouseId2(0);
        getParkWarehouseList(e);
    };
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
                        出库仓库:
                    </div>
                    <Select
                        placeholder='出库仓库'
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
                        入库园区:
                    </div>
                    <Select
                        placeholder='入库园区'
                        onChange={changeParkIdDB}
                        options={Array.isArray(parkList) && parkList.length > 0
                            ? parkList
                                .filter(item => item.id !== StaticInfo.park_id) // Filter out current park
                                .map((item:any)=>({
                                    label:item.park_name,
                                    value:item.parkId,
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
                        style={{width:'120px'}}
                        placeholder='入库仓库'
                        onChange={changeWarehouse2}
                        value={warehouseId2}
                        options={Array.isArray(warehouseList) && warehouseList.length > 0
                            ? warehouseList.map((item:any)=>({
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
export default connect(mapStateToProps)(AddCrossStoreTransferForm);
