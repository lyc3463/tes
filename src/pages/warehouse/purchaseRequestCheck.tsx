import { Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag, InputNumber, Image } from "antd";
import React, { useEffect, useState } from "react";
import { connect, history } from "umi";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import { checkSessionStorage, updateSessionStorage } from "@/utils/OpenTool";
import * as Application from '@/services/application';
import { PurStatus, PUR_STATUS } from "@/utils/commonEnum";

const PurchaseRequestCheck = (props) => {
    const [spinning, setSpinning] = useState(false);
    const [page, setPage] = useState(1);  // 当前页数
    const [orderCode, setOrderCode] = useState(checkSessionStorage('/warehouse/checkPurchaseRequest', 'PurchaseRequestCheckOrderCode') || '');// 采购单号
    const [warehouseName, setWarehouseName] = useState(checkSessionStorage('/warehouse/checkPurchaseRequest', 'PurchaseRequestCheckWarehouseName') || '');// 仓库名称
    const [supplierName, setSupplierName] = useState(checkSessionStorage('/warehouse/checkPurchaseRequest', 'PurchaseRequestCheckSupplierName') || 0);// 供应商
    const [startDate, setStartDate] = useState(checkSessionStorage('/warehouse/checkPurchaseRequest', 'PurchaseRequestCheckStartDate') || '2000-01-01');// 开始时间
    const [endDate, setEndDate] = useState(checkSessionStorage('/warehouse/checkPurchaseRequest', 'PurchaseRequestCheckEndDate') || '2099-01-01');// 结束日期
    const [orderStatus, setOrderStatus] = useState(Number(checkSessionStorage('/warehouse/checkPurchaseRequest', 'PurchaseRequestCheckOrderStatus') || 0));// 订单状态
    const [billStatus, setBillStatus] = useState(0);// 是否交完钱状态
    const [pageSize, setPageSize] = useState(50); // 每页数量
    const [orderType, setOrderType] = useState(1);// 订单类型
    const [dUid, setDUid] = useState(0);// 审核的ID
    const [paidAmountSum, setPaidAmountSum] = useState(0);// 已交金额
    const [totalAmountSum, setTotalAmountSum] = useState(0);// 物品总价
    const [count, setCount] = useState(0);// 总条数
    const [list, setList] = useState([]);// 列表
    const [dOpne, setDOpen] = useState(false);// 审核确认弹窗
    const [uName, setUName] = useState(checkSessionStorage('/warehouse/checkPurchaseRequest', 'PurchaseRequestCheckUName') || '');// 提交人
    const columns = [
        {
            title: '申请日期',
            dataIndex: 'orderTime',
            key: 'orderTime',
            align: 'center',
            render: (text) => {
                return <div>{dayjs(text).format('YYYY-MM-DD')}</div>
            }
        },
        {
            title: '采购单号',
            dataIndex: 'orderCode',
            key: 'orderCode',
            align: 'center',
            render: (text, record) => {
                return (
                    <Button type='link' onClick={() => { history.push(`/warehouse/infpApplication?id=${record.id}`); }}>{text}</Button>
                )
            }
        },
        {
            title: '入库仓库',
            dataIndex: 'warehouseName',
            key: 'warehouseName',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '供应商',
            dataIndex: 'supplierName',
            key: 'supplierName',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '已交金额',
            dataIndex: 'paidAmount',
            key: 'paidAmount',
            align: 'center',
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
            title: '采购人',
            dataIndex: 'user_name',
            key: 'user_name',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '状态',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            align: 'center',
            render: (text) => {
                // 定义状态颜色和文字
                let statusInfo = {};
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
                    // case PurStatus.PENDING_INBOUND:
                    //     statusInfo = { color: PUR_STATUS[PurStatus.PENDING_INBOUND].color, text: PUR_STATUS[PurStatus.PENDING_INBOUND].text };
                    //     break;
                    // case PurStatus.INBOUNDED:
                    //     statusInfo = { color: PUR_STATUS[PurStatus.INBOUNDED].color, text: PUR_STATUS[PurStatus.INBOUNDED].text };
                    //     break;
                    case PurStatus.REJECTED:
                        statusInfo = { color: PUR_STATUS[PurStatus.REJECTED].color, text: PUR_STATUS[PurStatus.REJECTED].text };
                        break;
                    case PurStatus.AUDITING:
                        statusInfo = { color: PUR_STATUS[PurStatus.AUDITING].color, text: PUR_STATUS[PurStatus.AUDITING].text };
                        break;
                    default:
                        statusInfo = { color: PUR_STATUS[PurStatus.DEFAULT].color, text: PUR_STATUS[PurStatus.DEFAULT].text };
                }
                return (
                    <Space>
                        <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                    </Space>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            fixed: 'right',
            render: (text, record) => {
                return (
                    <Space>
                        {record.orderStatus == PurStatus.AUDITING && <>
                            <Button type="primary" onClick={() => isCheckOpen(record.id)}>审核</Button>
                        </>}
                    </Space>
                )
            }
        },
    ];
    const isCheckOpen = (id) => {
        setDUid(id);
        setDOpen(true);
        getOne(id);
    };
    // 列表信息
    const getList = () => {
        Application.fetch({ page, pageSize, orderCode, warehouseName, supplierName, startDate, endDate, orderStatus, billStatus, orderType, uName }).then((res: TypeErrorCode) => {
            console.log(res.Data);
            if (res.ErrorCode === 0) {
                setList(res.Data.data);
                setCount(res.Data.count);
                setPaidAmountSum(res.Data.paidAmountSum);
                setTotalAmountSum(res.Data.totalAmountSum);
            } else {
                message.error(res.Data);
            }
        })
    };
    const onChange = (page: number, pageSize: number) => {
        setPage(page);
        setPageSize(pageSize);
    };
    const getSupplierList = () => {
        props.dispatch({
            type: "Supplier/fetch",
        })
    };
    useEffect(() => {
        getSupplierList();
    }, []);
    useEffect(() => {
        getList();
    }, [page, pageSize]);
    const sousuo = () => {
        setPage(1);
        getList();
    };
    const changeWarehouseName = (e) => {
        updateSessionStorage('/warehouse/checkPurchaseRequest', 'PurchaseRequestCheckWarehouseName', e.target.value);
        setWarehouseName(e.target.value);
    };
    const changeOrderCode = (e) => {
        setOrderCode(e.target.value);
        updateSessionStorage('/warehouse/checkPurchaseRequest', 'PurchaseRequestCheckOrderCode', e.target.value);
    };
    const changeSupplierId = (e) => {
        setSupplierName(e);
        updateSessionStorage('/warehouse/checkPurchaseRequest', 'PurchaseRequestCheckSupplierName', e);
    };
    // 监听日期
    const changeDate = (_: any, data: string[]) => {
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/checkPurchaseRequest', 'PurchaseRequestCheckStartDate', '2000-01-01');
            updateSessionStorage('/warehouse/checkPurchaseRequest', 'PurchaseRequestCheckEndDate', '2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/checkPurchaseRequest', 'PurchaseRequestCheckStartDate', data[0]);
            updateSessionStorage('/warehouse/checkPurchaseRequest', 'PurchaseRequestCheckEndDate', data[1]);
        };
    };
    const changeOrderStatus = (e) => {
        setOrderStatus(e);
        updateSessionStorage('/warehouse/checkPurchaseRequest', 'PurchaseRequestCheckOrderStatus', e);
    };
    const changeUName = (e) => {
        setUName(e.target.value);
        updateSessionStorage('/warehouse/checkPurchaseRequest', 'PurchaseRequestCheckUName', e.target.value);
    };
    const columnsz = [
        {
            title: '物品图片',
            dataIndex: 'productsImage',
            key: 'productsImage',
            render: (text: string) => {
                return (
                    <Image
                        src={`${window.ServerConfig.imgServer}${text}_min.png`}
                        style={{ width: '40px', height: '40px' }}
                        preview={{
                            src: `${window.ServerConfig.imgServer}${text}.png`, // 弹窗预览图单独指定
                        }}
                    />
                )
            }
        },
        {
            title: '物品名称',
            dataIndex: 'productsName',
            key: 'productsName',
        },
        {
            title: '物品编号',
            dataIndex: 'productsCode',
            key: 'productsCode',
        },
        {
            title: '单位',
            dataIndex: 'unitsName',
            key: 'unitsName',
        },
        {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: '单价(元)',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '总价钱(元)',
            dataIndex: 'totalPrice',
            key: 'totalPrice'

        },
    ];
    const [totalAmount, setTotalAmount] = useState(0);
    const [goods, setGoods] = useState([]);
    const { TextArea } = Input;
    const [reason, setReason] = useState('');
    const getOne = async (id: string) => {
        let res: any = await Application.one(id);
        if (res.ErrorCode == 0) {
            let data = res.Data;
            console.log('详情', data);
            setTotalAmount(data.totalAmount);
            let newArr = data.ppList.map((item: any) => {
                return {
                    ...item,
                    quantity: item.quantityTotal
                }
            })
            setGoods(newArr);
        } else {
            message.error(res.Data);
        }
    };
    const checkOk = () => {
        setSpinning(true);
        let orderStatus = PurStatus.APPROVED; // 默认状态为通过
        Application.check({ uid: dUid, orderStatus, Reason: reason }).then((res: TypeErrorCode) => {
            if (res.ErrorCode === 0) {
                message.success('审核成功');
                setReason('');
                setDOpen(false);
                setSpinning(false);
                getList();
            } else {
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    const checkReturn = () => {
        setSpinning(true);
        let orderStatus = PurStatus.REJECTED; // 设置状态为驳回
        Application.check({ uid: dUid, orderStatus, Reason: reason }).then((res: TypeErrorCode) => {
            if (res.ErrorCode === 0) {
                message.success('驳回成功');
                setReason('');
                setDOpen(false);
                setSpinning(false);
                getList();
            } else {
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    return (
        <Spin spinning={spinning}>
            <List>
                <List.Item>
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
                                style={{ width: '250px' }}
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
                                            ? props.SupplierList.map((item: any) => ({
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
                            addonBefore="仓库名称:"
                            value={warehouseName}
                            onChange={changeWarehouseName}
                        />
                        <Input
                            addonBefore="单号:"
                            value={orderCode}
                            onChange={changeOrderCode}
                        />
                    </Space>
                </List.Item>
                <List.Item>
                    <Space>
                        <Input
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
                                状态:
                            </div>
                            <Select
                                style={{ width: 120 }}
                                value={orderStatus}
                                onChange={changeOrderStatus}
                                options={[
                                    { label: '全部', value: 0 },
                                    { label: PUR_STATUS[PurStatus.DRAFT].text, value: PurStatus.DRAFT },
                                    { label: PUR_STATUS[PurStatus.AUDITING].text, value: PurStatus.AUDITING },
                                    { label: PUR_STATUS[PurStatus.APPROVED].text, value: PurStatus.APPROVED },
                                    { label: PUR_STATUS[PurStatus.REJECTED].text, value: PurStatus.REJECTED },
                                    // {label:PUR_STATUS[PurStatus.PENDING_INBOUND].text, value:PurStatus.PENDING_INBOUND},
                                    // {label:PUR_STATUS[PurStatus.INBOUNDED].text, value:PurStatus.INBOUNDED},
                                    { label: PUR_STATUS[PurStatus.PENDING_REIMBURSEMENT].text, value: PurStatus.PENDING_REIMBURSEMENT },
                                    { label: PUR_STATUS[PurStatus.REIMBURSED].text, value: PurStatus.REIMBURSED },

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
                                日期:
                            </div>
                            {startDate == '2000-01-01' && endDate == '2099-01-01' ? <DatePicker.RangePicker onChange={changeDate} /> : <DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate), dayjs(endDate)]} />}
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{ border: '1px solid #ddd', borderRadius: '4px' }}
                pagination={false}
                scroll={{ y: '60vh', x: 1500 }}
                dataSource={list}
                rowKey={(columns) => columns.id}
                size='small'
                summary={(columns) => (
                    <Table.Summary>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={1}>统计</Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                            <Table.Summary.Cell index={4}></Table.Summary.Cell>
                            <Table.Summary.Cell index={6}><div style={{ width: "100%", textAlign: 'center' }}>{paidAmountSum}</div></Table.Summary.Cell>
                            <Table.Summary.Cell index={7}><div style={{ width: "100%", textAlign: 'center' }}>{totalAmountSum}</div></Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page} onChange={onChange} pageSizeOptions={[50, 100, 500, 1000, 10000]} />
            {/* <Modal title="审核弹窗" open={dOpne} onOk={()=>checkOk()} onCancel={()=>setDOpen(false)} loading={spinning}>
                是否要审核?
            </Modal> */}
            <Modal
                width={1000}
                open={dOpne}
                title="审核"
                onCancel={() => setDOpen(false)}
                loading={spinning}
                footer={[
                    <Button key="submit" type="primary" onClick={() => checkOk()}>
                        通过
                    </Button>,
                    <Button key="return" type="primary" danger onClick={() => checkReturn()}>
                        驳回
                    </Button>,
                    <Button key="cancel" onClick={() => setDOpen(false)}>
                        关闭
                    </Button>
                ]}
            >
                <Table
                    columns={columnsz}
                    rowKey={(columns) => columns.id}
                    pagination={false}
                    size='small'
                    scroll={{ y: '55vh' }}
                    dataSource={goods}
                    rowClassName={(record, index) =>
                        index % 2 === 1 ? 'tbodd' : 'tbeven'
                    }
                    summary={() => (
                        <Table.Summary fixed>
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
                                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                <Table.Summary.Cell index={6}>{totalAmount}</Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
                <br />
                <br />
                审核意见
                <TextArea rows={4} placeholder="请输入审核意见" value={reason} onChange={(e) => setReason(e.target.value)} />
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    SupplierList: state.Supplier.list,
});
export default connect(mapStateToProps)(PurchaseRequestCheck)
