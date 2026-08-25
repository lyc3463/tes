import {Button,DatePicker,Form,Image,Input,InputNumber,message,Modal,Select,Space,Spin,Table,Tag, Tooltip} from "antd";
import {useEffect, useRef, useState} from "react";
import {connect,useNavigate,history} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as Application from "@/services/application";
import dayjs from "dayjs";
import { StaticInfo } from '@/StaticInfo';
import { QuestionCircleOutlined } from "@ant-design/icons";

function mergeByWoCode(data) {
    const map = new Map();
    data.forEach(item => {
        const { woCode, id, productsName, productsCode, unitsName, price, quantity, ...rest } = item;
        if (map.has(woCode)) {
            // 已存在，追加到 productsList
            map.get(woCode).productsList.push({
                id,
                productsName,
                productsCode,
                unitsName,
                price,
                quantity
            });
        } else {
            // 不存在，创建新条目
            map.set(woCode, {
                ...rest,
                woCode,
                productsList: [{
                    id,
                    productsName,
                    productsCode,
                    unitsName,
                    price,
                    quantity
                }]
            });
        }
    });

    return Array.from(map.values());
}
const AddPurchase=(props)=>{
    const navigate=useNavigate();
    const formRef=useRef();
    const [uid,setUid]=useState(0);
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
    // 提交的备注
    const [remarkInput,setRemarkInput]=useState('');
    const [list,setList]=useState([]);// 列表
    const [addOpen,setAddOpen]=useState(false);// 添加入库单弹窗

    const getOne=async (id:string)=>{
        setSpinning(true);
        let res:any=await  Application.one(id);
        if (res.ErrorCode==0){
            console.log('入库详情',res);
            let data=res.Data;
            setSpinning(false);
            setUid(data.id);
            getList(data.orderCode);
            setOrderCode(data.orderCode);
            setWarehouseId(data.warehouseId);
            setSupplierId(data.supplierId);
            setOrderTime(data.orderTime);
            setPaidAmount(data.paidAmount);
            setTotalAmount(data.totalAmount);
            setRemark(data.remark);
            let ppList=data.ppList.map((item:any)=>{
                item.quantity=item.quantityTotal-item.quantitySum;
                return item;
            });
            setGoods(ppList);
        }else {
            message.error(res.Data);
            setSpinning(false);
        }
    };
     // 列表信息
    const getList=(e:string)=>{
        Application.orderList({page:1, pageSize:1000, orderCode:e, unitsId:0,warehouseId:0, supplierName:'', startDate:'2000-01-01', endDate:'2099-01-01', orderStatus:0,woCode:'',productsName:'',userId:StaticInfo.userId}).then((res:TypeErrorCode)=>{
            console.log(res.Data);
            if(res.ErrorCode===0){
                console.log('入库列表',res.Data);
                // setList(res.Data.data);
                setList(mergeByWoCode(res.Data.data));
                console.log('整理好的单号',list);
                
            }else{
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getOne(id);
    }, []);
    const updateQuantity = (id, value) => {
        setGoods(prev =>
            prev.map(item =>
                item.ppId === id ? { ...item, quantity: value } : item
            )
        );
    };
    const updatePrice = (id, value) => {
        setGoods(prev =>
            prev.map(item =>
                item.ppId === id ? { ...item, price: value } : item
            )
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
                    ? `${window.ServerConfig.imgServer}${textStr}`
                    : `${window.ServerConfig.imgServer}${textStr}_min.png`;
                // 步骤3：仅当字符串非空时渲染图片，否则返回空
                return textStr ? (
                    <Image
                        src={imageUrl}
                        style={{width:'50px',height:'50px'}}
                        fallback="https://placeholder.pics/svg/50x50/EEEEEE/999999/暂无图片"
                        preview={{
                            src: `${window.ServerConfig.imgServer}${record.productsImage}.png`, // 弹窗预览图单独指定
                        }}
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
            title: '单位',
            dataIndex: 'unitsName',
            key:'unitsName',
        },
        {
            title: '单价(元)',
            dataIndex: 'price',
            key:'price',
            render:(text, record) => (
                <InputNumber
                    min={0}
                    value={record.price}
                    onChange={(value) => {
                        updatePrice(record.ppId, value);
                    }}
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
            title: '采购数量',
            dataIndex: 'quantityTotal',
            key:'quantityTotal',
            render:(text, record) => (
                <InputNumber
                    min={0}
                    value={text}
                    disabled
                />
            )
        },
        {
            title: '已入库数量',
            dataIndex: 'quantitySum',
            key:'quantitySum',
            render:(text, record) => (
                <InputNumber
                    min={0}
                    value={text}
                    disabled
                />
            )
        },
        {
            title: '入库数量',
            dataIndex: 'quantity',
            key:'quantity',
            render:(text, record) => (
                <InputNumber
                    min={0}
                    max={record.quantityTotal-record.quantitySum}
                    value={record.quantity}
                    onChange={(value) => {
                        updateQuantity(record.ppId, value);
                    }}
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
    useEffect(() => {
        getSupplierList();
        getWarehouseList();
        // getThingList();
    }, []);
    // 添加按钮弹窗
    const addOrderOpen=()=>{
        setAddOpen(true);
    };
    // 确定入库
    const onOK=()=>{
        let newArr= goods.map((item:any) => ({
            ppId: item.ppId,
            quantity: item.quantity,
            price: item.price,
            warehouseId,
            poId:uid,
            productsId:item.id,
            unitsId:item.unitsId,
            remark:remarkInput
        }));
        const hasZeroQuantity = newArr.some((item: any) => item.quantity === 0);
        if (hasZeroQuantity) {
            message.warning('请输入入库数量');
            return;
        }
        setSpinning(true);
        Application.addWarehousing({jsonData: JSON.stringify(newArr)}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('入库订单已生成');
                setAddOpen(false);
                setSpinning(false);
                getOne(uid);
            } else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
            }
        })
    };
    const [orderModalOpen,setOrderModalOpen]=useState(false);
    const [modalTitle,setModalTitle]=useState('提交弹窗');
    const [modalStatus,setModalStatus]=useState(2);
    const [modalList,setModalList]=useState<any[]>([]);
    const [editModalOpen,setEditModalOpen]=useState(false);
    const [editList,setEditList]=useState<any[]>([]);
    const [editRemark,setEditRemark]=useState('');
    const [delModalOpen,setDelModalOpen]=useState(false);
    const [delList,setDelList]=useState<any[]>([]);
    const [delRecord,setDelRecord]=useState<any>(null);
    const [checkWoCode,setCheckWoCode]=useState('');

    const openOrderConfirm = (record:any, status:number=2) => {
        setModalStatus(status);
        setModalTitle(status === 2 ? '提交弹窗' : '驳回弹窗');
        setModalList(Array.isArray(record.productsList) ? record.productsList : []);
        setCheckWoCode(record.woCode || '');
        setOrderModalOpen(true);
    };

    const openEditModal = (record:any) => {
        setEditList(Array.isArray(record.productsList) ? record.productsList.map((item:any) => ({ ...item })) : []);
        setEditRemark(record.remark || '');
        setEditModalOpen(true);
    };

    const openDelModal = (record:any) => {
        setDelRecord(record);
        setDelList(Array.isArray(record.productsList) ? record.productsList.map((item:any) => ({ ...item })) : []);
        setDelModalOpen(true);
    };

    const bottomColumns = [
        {
            title:'生成日期',
            dataIndex:'created',
            key:'created',
            align:'center',
            width:120,
            render:(text:string) => <span>{text ? dayjs(text).format('YYYY-MM-DD') : '-'}</span>
        },
        {
            title:'采购单号',
            dataIndex:'orderCode',
            key:'orderCode',
            align:'center',
            width:170,
        },
        {
            title:'入库单号',
            dataIndex:'woCode',
            key:'woCode',
            align:'center',
            width:170,
        },
        {
            title:'入库仓库',
            dataIndex:'warehouseName',
            key:'warehouseName',
            align:'center',
            width:150,
        },
        {
            title:'备注',
            dataIndex:'remark',
            key:'remark',
            align:'center',
            render:(text:string) => <span>{text || '-'}</span>
        },
        {
            title:'物品信息',
            dataIndex:'productsList',
            key:'productsList',
            align:'left',
            width:520,
            render:(productsList:any[] = []) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 360 }}>
                    {productsList.map((item:any, index:number) => (
                        <div
                            key={`${item.id || item.productsCode || index}-${index}`}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'minmax(120px, 2.2fr) minmax(100px, 1.6fr) 60px 80px 80px',
                                gap: 8,
                                padding: '8px 10px',
                                background: index % 2 === 0 ? '#f7f9fc' : '#ffffff',
                                border: '1px solid #eef2f7',
                                borderRadius: 8,
                                alignItems: 'center',
                            }}
                        >
                            <div>
                                <div style={{ fontSize: 12, color: '#8c8c8c', lineHeight: '18px' }}>名称</div>
                                <div style={{ fontWeight: 600, wordBreak: 'break-word' }}>{item.productsName || '-'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 12, color: '#8c8c8c', lineHeight: '18px' }}>编号</div>
                                <div>{item.productsCode || '-'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 12, color: '#8c8c8c', lineHeight: '18px' }}>单位</div>
                                <div>{item.unitsName || '-'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 12, color: '#8c8c8c', lineHeight: '18px' }}>单价</div>
                                <div>{item.price != null ? Number(item.price).toFixed(2) : '-'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 12, color: '#8c8c8c', lineHeight: '18px' }}>数量</div>
                                <div>{item.quantity ?? '-'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )
        },
        {
            title:'提交人',
            dataIndex:'user_name',
            key:'user_name',
            align:'center',
            width:120,
        },
       {
            title: '状态',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            align: 'center',
            width:120,
            render: (text, record) => {
                    // 定义状态颜色和文字
                    let statusInfo = {} as any;
                    switch (text) {
                        case 1:
                            statusInfo = { color: 'blue', text: '未入库' };
                            break;
                        case 2:
                            statusInfo = { color: 'green', text: '已提交' };
                            break;
                        case 3:
                            statusInfo = { color: 'orange', text: '已入库' };
                            break;
                        case 4:
                            statusInfo = { color: 'purple', text: '驳回' };
                            break;
                        default:
                            statusInfo = { color: 'default', text: '未知状态' };
                    }
                    const reason = record && (record.rejectReason || record.reject_reason || record.reject || record.rejectedReason || '');
                    return (
                        <Space>
                            <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                            {text === 4 && reason ? (
                                <Tooltip title={reason} placement="topLeft">
                                    <QuestionCircleOutlined style={{ color: '#999', marginLeft: 4 }} />
                                </Tooltip>
                            ) : null}
                        </Space>
                    )
                }
        },
        {
            title:'操作',
            dataIndex:'status',
            key:'status',
            align:'center',
            fixed:'right',
            width:220,
            render:(text:any, record:any) => (
                <Space>
                    {record.orderStatus === 1 && (
                        <Button type='primary' onClick={() => openOrderConfirm(record, 2)}>提交上送</Button>
                    )}
                    {(record.orderStatus === 1 || record.orderStatus === 4) && (
                        <>
                            <Button type='primary' onClick={() => openEditModal(record)}>修改</Button>
                            <Button type='primary' onClick={() => openDelModal(record)}>删除</Button>
                        </>
                    )}
                    {(record.orderStatus === 4) && (
                        <>
                            <Button type='primary' onClick={() => openOrderConfirm(record, 2)}>重新上送</Button>
                        </>
                    )}
                </Space>
            )
        },
    ];

    const handleCommit = () => {
        setSpinning(true);
        Application.warehousingInspection({
            checkWoCode,
            checkStutes: modalStatus,
            rejectReason: modalStatus === 4 ? '驳回原因' : ''
        }).then((res:TypeErrorCode) => {
            if (res.ErrorCode === 0) {
                message.success(modalStatus === 2 ? '提交成功，待审核' : '驳回成功');
                setOrderModalOpen(false);
                setSpinning(false);
                getList(orderCode);
            } else {
                message.error(res.Data);
                setSpinning(false);
            }
        });
    };

    const handleEditSave = () => {
        setSpinning(true);
        const newArr = editList.map((item:any) => ({
            id: item.id,
            price: item.price,
            quantity: item.quantity,
            remark: editRemark || ''
        }));
        Application.editOrder(JSON.stringify(newArr)).then((res:TypeErrorCode) => {
            if (res.ErrorCode === 0) {
                message.success('修改成功');
                setEditModalOpen(false);
                setSpinning(false);
                getList(orderCode);
            } else {
                message.error(res.Data);
                setSpinning(false);
            }
        });
    };

    const handleDelSave = () => {
        setSpinning(true);
        Application.deleteOrder({ woCode: delRecord?.woCode }).then((res:TypeErrorCode) => {
            if (res.ErrorCode === 0) {
                message.success('删除成功');
                setDelModalOpen(false);
                setSpinning(false);
                getList(orderCode);
            } else {
                message.error(res.Data);
                setSpinning(false);
            }
        });
    };
    return(
        <Spin spinning={spinning}>
            <Space>
                <Button type="primary" onClick={()=>navigate(-1)}>
                    返回
                </Button>
                <Button type="primary" onClick={addOrderOpen}>
                    添加入库单
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
                rowKey={(columns) => columns.ppId}
                pagination={false}
                size='small'
                scroll={{y:'55vh'}}
                dataSource={goods}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
                // rowSelection={rowSelection}  // 添加选择功能配置
            />
            <div style={{ marginTop: 32 }}>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>入库单列表</div>
                <Table
                    columns={bottomColumns}
                    dataSource={list}
                    rowKey={(record:any, index?: number) => `${record.woCode || record.id || 'row'}-${index ?? 0}`}
                    pagination={false}
                    size='small'
                    scroll={{ y: '45vh', x: 1700 }}
                />
            </div>
            <Modal
                title={modalTitle}
                open={orderModalOpen}
                onOk={handleCommit}
                onCancel={() => setOrderModalOpen(false)}
                width={760}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>待处理入库商品</div>
                    <Table
                        columns={[
                            { title: '物品名称', dataIndex: 'productsName', key: 'productsName' },
                            { title: '物品编号', dataIndex: 'productsCode', key: 'productsCode' },
                            { title: '单位', dataIndex: 'unitsName', key: 'unitsName' },
                            { title: '入库单价', dataIndex: 'price', key: 'price', render: (text:any) => <span>{text != null ? Number(text).toFixed(2) : '-'}</span> },
                            { title: '入库数量', dataIndex: 'quantity', key: 'quantity' },
                        ]}
                        dataSource={modalList}
                        pagination={false}
                        size='small'
                        rowKey={(record:any, index?: number) => `${record.id || record.productsCode || 'modal'}-${index ?? 0}`}
                    />
                </div>
            </Modal>
            <Modal
                title="修改入库商品"
                open={editModalOpen}
                onOk={handleEditSave}
                onCancel={() => setEditModalOpen(false)}
                width={860}
            >
                <Table
                    columns={[
                        { title: '物品名称', dataIndex: 'productsName', key: 'productsName' },
                        { title: '物品编号', dataIndex: 'productsCode', key: 'productsCode' },
                        { title: '单位', dataIndex: 'unitsName', key: 'unitsName' },
                        {
                            title: '入库单价',
                            dataIndex: 'price',
                            key: 'price',
                            render: (text:any, record:any, index:number) => (
                                <InputNumber
                                    value={record.price ?? 0}
                                    min={0}
                                    precision={2}
                                    onChange={(value) => {
                                        setEditList(prev => prev.map((item, i) => i === index ? { ...item, price: value ?? 0 } : item));
                                    }}
                                />
                            )
                        },
                        {
                            title: '入库数量',
                            dataIndex: 'quantity',
                            key: 'quantity',
                            render: (text:any, record:any, index:number) => (
                                <InputNumber
                                    value={record.quantity ?? 0}
                                    min={0}
                                    precision={0}
                                    onChange={(value) => {
                                        setEditList(prev => prev.map((item, i) => i === index ? { ...item, quantity: value ?? 0 } : item));
                                    }}
                                />
                            )
                        },
                    ]}
                    dataSource={editList}
                    pagination={false}
                    size='small'
                    rowKey={(record:any, index?: number) => `${record.id || record.productsCode || 'edit'}-${index ?? 0}`}
                />
                <div style={{ marginTop: 16 }}>
                    <div style={{ marginBottom: 8, fontWeight: 600 }}>备注:</div>
                    <Input.TextArea
                        value={editRemark}
                        onChange={(e) => setEditRemark(e.target.value)}
                        placeholder="请输入备注"
                        rows={4}
                    />
                </div>
            </Modal>
            <Modal
                title="删除入库商品"
                open={delModalOpen}
                onOk={handleDelSave}
                onCancel={() => setDelModalOpen(false)}
                width={760}
            >
                <Table
                    columns={[
                        { title: '物品名称', dataIndex: 'productsName', key: 'productsName' },
                        { title: '物品编号', dataIndex: 'productsCode', key: 'productsCode' },
                        { title: '单位', dataIndex: 'unitsName', key: 'unitsName' },
                        { title: '入库单价', dataIndex: 'price', key: 'price', render: (text:any) => <span>{text != null ? Number(text).toFixed(2) : '-'}</span> },
                        { title: '入库数量', dataIndex: 'quantity', key: 'quantity' },
                    ]}
                    dataSource={delList}
                    pagination={false}
                    size='small'
                    rowKey={(record:any, index?: number) => `${record.id || record.productsCode || 'del'}-${index ?? 0}`}
                />
            </Modal>
            <Modal title="添加入库单" open={addOpen} onOk={()=>{onOK()}} onCancel={()=>{setAddOpen(false)}} width={760}>
                <Input.TextArea value={remarkInput} onChange={(e) => setRemarkInput(e.target.value)} placeholder="请输入备注" maxLength={50}/>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    warehouseListList: state.WarehouseList.list,
    supplierList: state.Supplier.list,
    thingList: state.ThingList.list,
});
export default connect(mapStateToProps)(AddPurchase);
