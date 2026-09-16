import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tabs, Tag, Tooltip} from "antd";
import {connect, history} from "umi";
import React, {useEffect, useState, useRef} from "react";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import * as PuchaseService from "@/services/application";
import { QuestionCircleOutlined, PrinterTwoTone } from '@ant-design/icons';
import {PurStatus, PUR_STATUS} from "@/utils/commonEnum";
import {useReactToPrint} from "react-to-print";
import WarehousingPrint from "@/components/WarehousingPrint";
import './print.less';

const Application=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);  // 当前页数
    const [orderCode,setOrderCode]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','checkPurchaseRequestOrderCode')||'');// 采购单号
    const [warehouseName,setWarehouseName]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','checkPurchaseRequestWarehouseName')||'');// 仓库名称
    const [supplierName,setSupplierName]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','checkPurchaseRequestSupplierName')||0);// 供应商
    const [startDate,setStartDate]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','checkPurchaseRequestStartDate')||'2000-01-01');// 开始时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','checkPurchaseRequestEndDate')||'2099-01-01');// 结束日期
    const [orderStatus,setOrderStatus]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','checkPurchaseRequestOrderStatus')||0);// 订单状态
    const [billStatus,setBillStatus]=useState(0);// 是否交完钱状态
    const [orderType,setOrderType]=useState(1);// 订单类型
    const [pageSize,setPageSize]=useState(50); // 每页数量
    const [dUid,setDUid]=useState(0);// 删除的ID
    const [dOpne,setDOpen]=useState(false);// 删除确认弹窗
    const [uName,setUName]=useState(checkSessionStorage('/warehouse/application','applicationUName')||'');// 申请人

    const columns=[
        {
            title:'',
            dataIndex:'print',
            key:'print',
            align:'center',
            ellipsis:true,
            width:50,
            render:(text,record)=>{
                return(
                    <Button type='link' icon={<PrinterTwoTone />} onClick={()=>{isOpen(record)}}>{text}</Button>
                )
            }
        },
        {
            title:'申请日期',
            dataIndex:'orderTime',
            key:'orderTime',
            align:'center',
            render:(text)=>{
                return <div>{dayjs(text).format('YYYY-MM-DD')}</div>
            }
        },
        {
            title:'采购单号',
            dataIndex:'orderCode',
            key:'orderCode',
            align:'center',
            render:(text,record)=>{
                return(
                    <Button type='link' onClick={()=>{history.push(`/warehouse/infpApplication?id=${record.id}`);}}>{text}</Button>
                )
            }
        },
        {
            title:'入库仓库',
            dataIndex:'warehouseName',
            key:'warehouseName',
            align:'center',
            ellipsis:true,
        },
        {
            title:'采购人',
            dataIndex:'user_name',
            key:'user_name',
            align:'center',
            ellipsis:true,
        },
        {
            title:'供应商',
            dataIndex:'supplierName',
            key:'supplierName',
            align:'center',
            ellipsis:true,
        },
        {
            title:'已交金额',
            dataIndex:'paidAmount',
            key:'paidAmount',
            align:'center',
        },
        {
            title: '物品总价',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            align: 'center',
            // 下面这一行是核心：开启数字排序
            sorter: (a, b) => a.totalAmount - b.totalAmount,
        },
        {
            title:'备注',
            dataIndex:'remark',
            key:'remark',
            align:'center',
            ellipsis:true,
        },
        {
            title: '状态',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            align: 'center',
            render: (text, record) => {
                // 定义状态颜色和文字
                let statusInfo = {} as any;
                switch (text) {
                    case PurStatus.DRAFT:
                        statusInfo = { color: PUR_STATUS[PurStatus.DRAFT].color, text: PUR_STATUS[PurStatus.DRAFT].text };
                        break;
                    case PurStatus.APPROVED:
                        statusInfo = { color: PUR_STATUS[PurStatus.APPROVED].color, text: PUR_STATUS[PurStatus.APPROVED].text };
                        break;
                    case PurStatus.PENDING_REIMBURSEMENT:
                        statusInfo = { color: PUR_STATUS[PurStatus.PENDING_REIMBURSEMENT].color, text: PUR_STATUS[PurStatus.PENDING_REIMBURSEMENT].text };
                        break;
                    case PurStatus.REIMBURSED:
                        statusInfo = { color: PUR_STATUS[PurStatus.REIMBURSED].color, text: PUR_STATUS[PurStatus.REIMBURSED].text };
                        break;
                    case PurStatus.PENDING_INBOUND:
                        statusInfo = { color: PUR_STATUS[PurStatus.PENDING_INBOUND].color, text: PUR_STATUS[PurStatus.PENDING_INBOUND].text };
                        break;
                    case PurStatus.INBOUNDED:
                        statusInfo = { color: PUR_STATUS[PurStatus.INBOUNDED].color, text: PUR_STATUS[PurStatus.INBOUNDED].text };
                        break;
                    case PurStatus.REJECTED:
                        statusInfo = { color: PUR_STATUS[PurStatus.REJECTED].color, text: PUR_STATUS[PurStatus.REJECTED].text };
                        break;
                    case PurStatus.AUDITING:
                        statusInfo = { color: PUR_STATUS[PurStatus.AUDITING].color, text: PUR_STATUS[PurStatus.AUDITING].text };
                        break;
                    default:
                        statusInfo = { color: PUR_STATUS[PurStatus.DEFAULT].color, text: PUR_STATUS[PurStatus.DEFAULT].text };
                }
                const reason = record && (record.rejectReason || record.reject_reason || record.reject || record.rejectedReason || '');
                return (
                    <Space>
                        <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                        {text === PurStatus.REJECTED && reason ? (
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
            width:200,
            render:(text,record)=>{
                return(
                    <Space>
                        {/* {record.orderStatus !== 2 && record.orderStatus !== 3 && record.orderStatus !== 4 && <>
                            <Button type="primary" onClick={()=>{history.push(`/warehouse/editApplication?id=${record.id}`);}}>编辑</Button>
                            <Button type="primary" danger onClick={()=>isDelOpen(record.id)}>删除</Button>
                        </>} */}
                        {(record.orderStatus == PurStatus.DRAFT || record.orderStatus == PurStatus.REJECTED) && <>
                            <Button type="primary" size="small" onClick={()=>{history.push(`/warehouse/editApplication?id=${record.id}`);}}>编辑</Button>
                            <Button type="primary" danger size="small" onClick={()=>isDelOpen(record.id)}>删除</Button>
                            <Button type="primary" size="small" onClick={()=>sendCheck(record.id)}>直接送审</Button>
                        </>}
                    </Space>
                )
            }
        },
    ];

    const isDelOpen=(e)=>{
        setDUid(e);
        setDOpen(true);
    };

    const toAdd=()=>{
        history.push('/warehouse/addApplication');
    };

    // 列表信息
    const getList=()=>{
        props.dispatch({
            type:'PurchaseRequestCheck/fetch',
            payload:{page, pageSize, orderCode, warehouseName, supplierName, startDate, endDate, orderStatus, billStatus,orderType,uName}
        })
    };
    
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };

    useEffect(() => {
        getSupplierList();
    }, []);

    useEffect(() => {
        getList();
    }, [page,pageSize]);

    const delOk=()=>{
        setSpinning(true);
        props.dispatch({
            type:'PurchaseRequestCheck/remove',
            payload:dUid,
        }).then((res:TypeErrorCode)=>{
            setSpinning(false);
            if(res.ErrorCode===0){
                message.success('删除成功');
                setDOpen(false);
                getList();
            }else{
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };

    const sousuo=()=>{
        setPage(1);
        getList();
    };

    const changeWarehouseName=(e)=>{
        updateSessionStorage('/warehouse/checkPurchaseRequest','checkPurchaseRequestWarehouseName',e.target.value);
        setWarehouseName(e.target.value);
    };

    const changeOrderCode=(e)=>{
        setOrderCode(e.target.value);
        updateSessionStorage('/warehouse/checkPurchaseRequest','checkPurchaseRequestOrderCode',e.target.value);
    };

    const changeSupplierId=(e)=>{
        setSupplierName(e);
        updateSessionStorage('/warehouse/checkPurchaseRequest','checkPurchaseRequestSupplierName',e);
    };

    const getSupplierList=()=>{
        props.dispatch({
            type:"Supplier/fetch",
        })
    };

    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/checkPurchaseRequest','checkPurchaseRequestStartDate','2000-01-01');
            updateSessionStorage('/warehouse/checkPurchaseRequest','checkPurchaseRequestEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/checkPurchaseRequest','checkPurchaseRequestStartDate',data[0]);
            updateSessionStorage('/warehouse/checkPurchaseRequest','checkPurchaseRequestEndDate',data[1]);
        }
    };

    const changeOrderStatus=(e)=>{
        setOrderStatus(e);
        updateSessionStorage('/warehouse/checkPurchaseRequest','checkPurchaseRequestStutes',e);
    };

    const changeUName=(e)=>{
        setUName(e.target.value);
        updateSessionStorage('/warehouse/application','applicationUName',e.target.value);
    };
    
    // 直接送审
    const sendCheck=(e)=>{
        setSpinning(true);
        PuchaseService.sendCheck({uid:e}).then((res:TypeErrorCode)=>{
            setSpinning(false);
            if(res.ErrorCode===0){
                message.success('送审成功');
                getList();
            }else{
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    const [printVisible,setPrintVisible]=useState(false);
    const [printLoading,setPrintLoading]=useState(false);
    // 当前打印的单据数据（基础信息取列表行 record，物品明细调详情接口）
    const [printData,setPrintData]=useState<any>(null);
    const printRef = useRef();
    // 点击打印图标：先用行数据填充，再拉详情拿物品明细
    const isOpen=async (record:any)=>{
        setPrintVisible(true);
        setPrintLoading(true);
        setPrintData({
            orderCode: record.orderCode,
            warehouseName: record.warehouseName,
            orderTime: record.orderTime,
            totalAmount: Number(record.totalAmount) || 0,
            paidAmount: Number(record.paidAmount) || 0,
            user_name: record.user_name,
            supplierName: record.supplierName,
            goods: [],
        });
        try {
            const res:any = await PuchaseService.one(record.id);
            if(res.ErrorCode===0){
                const data = res.Data || {};
                // 详情接口返回的物品列表是 ppList，quantity 取 quantityTotal（同 infpApplication）
                const goods = Array.isArray(data.ppList)
                    ? data.ppList.map((item:any)=>({...item, quantity: item.quantityTotal}))
                    : [];
                setPrintData((prev:any)=>({
                    ...prev,
                    orderCode: data.orderCode ?? prev.orderCode,
                    warehouseName: data.warehouseName ?? prev.warehouseName,
                    orderTime: data.orderTime ?? prev.orderTime,
                    totalAmount: Number(data.totalAmount ?? prev.totalAmount) || 0,
                    paidAmount: Number(data.paidAmount ?? prev.paidAmount) || 0,
                    user_name: data.user_name ?? prev.user_name,
                    supplierName: data.supplierName ?? prev.supplierName,
                    goods,
                }));
            }else{
                message.error(res.Data);
            }
        } catch (error) {
            console.error('获取采购单详情失败:', error);
            message.error('获取打印数据失败，请重试');
        } finally {
            setPrintLoading(false);
        }
    };
    const printProps = {
        orderCode: printData?.orderCode || '',
        warehouseName: printData?.warehouseName || '',
        orderTime: printData?.orderTime || '',
        totalAmount: printData?.totalAmount || 0,
        paidAmount: printData?.paidAmount || 0,
        user_name: printData?.user_name || '',
        goods: printData?.goods || [],
        title:'采购申请',
        supplierName: printData?.supplierName || '',
    };
    // 自定义打印方法（处理内容隔离和样式）
    const handlePrint = useReactToPrint({
        contentRef: printRef,  // 使用 content 而不是 contentRef
        pageStyle: `
        @page {
            size: A4;
            margin: 2mm 20mm;
        }
        @media print {
            /* 分页样式 */
            .page-break {
                page-break-after: always;
            }
            /* 防止内容被分页截断 */
            .no-break {
                page-break-inside: avoid;
            }
            /* 隐藏 Modal 相关元素 */
            .ant-modal-wrap,
            .ant-modal-mask {
                display: none !important;
            }
            .ant-modal {
                position: static !important;
                width: 100% !important;
                margin: 0 !important;
            }
            .ant-modal-content {
                box-shadow: none !important;
                background: transparent !important;
            }
            .ant-modal-header,
            .ant-modal-footer {
                display: none !important;
            }
            .ant-modal-body {
                padding: 0 !important;
            }
            body *:not(.print-only-content):not(.print-only-content *) {
                        visibility: hidden;
                        }
        }
    `,
    });
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Button type="primary" onClick={toAdd}>
                            新增采购单
                        </Button>
                    </Space>
                    <Space>
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
                                供应商:
                            </div>
                            <Select
                                style={{width:'250px'}}
                                showSearch
                                onChange={changeSupplierId}
                                placeholder='供应商'
                                value={supplierName}
                                filterOption={(input, option) => {
                                    // 假设每个 option 都有一个与数据项对应的 value 属性
                                    const item = props.SupplierList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                                    return item?.supplierName?.toLowerCase().includes(input.toLowerCase());
                                }}
                                options={
                                    [
                                        { label: '全部', value: 0 },
                                        ...(Array.isArray(props.SupplierList) && props.SupplierList.length > 0
                                                ? props.SupplierList.map((item:any)=>({
                                                    label: item.supplierName,
                                                    value: item.id,
                                                }))
                                                : []
                                        )
                                    ]
                                }
                            />
                        </Space.Compact>
                        <Input
                            style={{ width: 200 }}
                            addonBefore="仓库名称:"
                            value={warehouseName}
                            onChange={changeWarehouseName}
                        />
                        <Input
                            style={{ width: 200 }}
                            addonBefore="单号:"
                            value={orderCode}
                            onChange={changeOrderCode}
                        />
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
                                状态:
                            </div>
                            <Select
                                style={{ width: 120 }}
                                value={orderStatus}
                                onChange={changeOrderStatus}
                                options={[
                                    {label:'全部',value:0},
                                    {label:PUR_STATUS[PurStatus.DRAFT].text, value:PurStatus.DRAFT},
                                    {label:PUR_STATUS[PurStatus.AUDITING].text, value:PurStatus.AUDITING},
                                    {label:PUR_STATUS[PurStatus.APPROVED].text, value:PurStatus.APPROVED},
                                    {label:PUR_STATUS[PurStatus.REJECTED].text, value:PurStatus.REJECTED},
                                    {label:PUR_STATUS[PurStatus.PENDING_INBOUND].text, value:PurStatus.PENDING_INBOUND},
                                    {label:PUR_STATUS[PurStatus.INBOUNDED].text, value:PurStatus.INBOUNDED},
                                    {label:PUR_STATUS[PurStatus.PENDING_REIMBURSEMENT].text, value:PurStatus.PENDING_REIMBURSEMENT},
                                    {label:PUR_STATUS[PurStatus.REIMBURSED].text, value:PurStatus.REIMBURSED},

                                ]}
                            />
                        </Space.Compact>
                    </Space>
                </List.Item>
                <List.Item>
                    <Space>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                    <Space>
                        <Input
                            style={{ width: 200 }}
                            addonBefore="采购人:"
                            value={uName}
                            onChange={changeUName}
                        />
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
                                日期:
                            </div>
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
                        </Space.Compact>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                scroll={{y:'60vh',x:1500}}
                dataSource={props.list}
                rowKey={(columns) => columns.id}
                size='small'
                summary={(columns) => (
                    <Table.Summary >
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={1}>统计</Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                            <Table.Summary.Cell index={4}></Table.Summary.Cell>
                            <Table.Summary.Cell index={5}></Table.Summary.Cell>
                            <Table.Summary.Cell index={6}><div style={{width:"100%",textAlign:'center'}}>{props.count?props.count.paidAmountSum:0}</div></Table.Summary.Cell>
                            <Table.Summary.Cell index={7}><div style={{width:"100%",textAlign:'center'}}>{props.count?props.count.totalAmountSum:0}</div></Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal title="删除确认" open={dOpne} onOk={()=>delOk()} onCancel={()=>setDOpen(false)} loading={spinning}>
                是否要删除?
            </Modal>
            <Modal
                open={printVisible}
                onCancel={()=>setPrintVisible(false)}
                width={1200}
                footer={[
                    <Button key="print" type="primary" loading={printLoading} onClick={handlePrint}>打印</Button>,
                    <Button key="cancel" onClick={()=>setPrintVisible(false)}>关闭</Button>
                ]}
            >
                <Spin spinning={printLoading}>
                    <div className="print-only-content" ref={printRef}>
                        <WarehousingPrint {...printProps} className="print-only-content"/>
                    </div>
                </Spin>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.PurchaseRequestCheck.list,
    count: state.PurchaseRequestCheck.count,
    SupplierList: state.Supplier.list,
});
export default connect(mapStateToProps)(Application);
