import {useEffect, useState} from "react";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import dayjs from "dayjs";
import {
    Button,
    DatePicker,
    Input,
    InputNumber,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Tooltip,
    Form
} from "antd";
import * as RefundService from "@/services/refund";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {history} from "umi";

const CheckRefund=()=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 手机号
    const [phone,setPhone]=useState(checkSessionStorage('/check/checkAfterSales/','checkRefundPhone')||'');
    // 状态 0全部，1未审核，2审核通过,
    const [stutes,setStutes]=useState(checkSessionStorage('/check/checkAfterSales/','checkRefundStutes')||0);
    // 开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/check/checkAfterSales/','checkRefundStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/check/checkAfterSales/','checkRefundEndDate')||'2099-01-01');
    const [uid,setUid]=useState(0);
    const [open,setOpen]=useState(false);
    const [spinning,setspinning]=useState(false);
    const [list,setList]=useState([]);
    const [count,setCount]=useState(0);
    const [applyAmount,setApplyAmount]=useState(0);// 申请退款金额
    const [auditRefundAmount,setAuditRefundAmount]=useState(0);// 审核退款金额
    const [serviceCharge,setServiceCharge]=useState(0);// 服务费

    const columns =[
        {
            title: '单元名称',
            dataIndex: 'unitList',
            key: 'unitList',
            sorter: {
                compare: (a, b) => {
                    // 获取 a 和 b 的 unitList 中第一个 unit_name
                    const aUnitName = a.unitList[0]?.unit_name || '';
                    const bUnitName = b.unitList[0]?.unit_name || '';

                    // 比较 unit_name
                    if (aUnitName < bUnitName) return -1;
                    if (aUnitName > bUnitName) return 1;
                    return 0;
                },
                multiple: 1,
            },
            width:200,
            render: (text:any, record:any) => {
                const limitedUnitList = record.unitList.slice(0, 2);
                return(
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                        {limitedUnitList.map((item, index) => (
                            <span key={index}>{item.unit_name}{index < limitedUnitList.length - 1 ? ',' : ''}</span>
                        ))}
                        {/* 如果 unitList 数组长度大于 2，则显示省略号或其他提示 */}
                        {record.unitList.length > 2 && <span>...</span>}
                    </div>
                )
            }
        },
        {
            title: '申请日期',
            dataIndex: 'created',
            key: 'created',
            render:(_:any,record:any)=>(
                <div>
                    {dayjs(record.created).format("YYYY-MM-DD")}
                </div>
            )
        },
        {
            title: '申请人',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '联系方式',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '退款金额',
            dataIndex: 'applyAmount',
            key: 'applyAmount',
        },
        {
            title: '退款原因',
            dataIndex: 'applyReason',
            key: 'applyReason',
        },
        {
            title: '状态',
            dataIndex: 'renameStatus',
            key: 'renameStatus',
            render: (text, record) => {
                // 定义状态颜色和文字
                let statusInfo = {};
                switch (text) {
                    case 1:
                        statusInfo = { color: 'blue', text: '待送审' };
                        break;
                    case 4:
                        statusInfo = { color: 'orange', text: '已送审' };
                        break;
                    case 3:
                        statusInfo = { color: 'red', text: '已驳回' };
                        break;
                    case 2:
                        statusInfo = { color: 'green', text: '已审核' };
                        break;
                    default:
                        statusInfo = { color: 'default', text: '未知状态' };
                }
                return (
                    <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                );
            }
        },
        {
            title: '操作',
            dataIndex: 'cx',
            key: 'cx',
            render:(text:any,record:any,)=>{
                return (
                    <Space>
                        {record.renameStatus == 4 && <>
                            <Button type='primary' onClick={()=>IsDelOpen(record)}>审核</Button>
                        </>}
                    </Space>
                )
            }
        }
    ];
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/check/checkAfterSales/','checkRefundStartDate','2000-01-01');
            updateSessionStorage('/check/checkAfterSales/','checkRefundEndDate','2099-01-01');

        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/check/checkAfterSales/','checkRefundStartDate',data[0]);
            updateSessionStorage('/check/checkAfterSales/','checkRefundEndDate',data[1]);

        }
    };
    // 监听姓名
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/check/checkAfterSales/','checkRefundPhone',e.target.value);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
        updateSessionStorage('/check/checkAfterSales/','checkRefundStutes',e);
    };
    // 分页
    const logFenye=()=>{
        RefundService.fetch({page,pageSize,stutes,phone,startDate,endDate}).then((res:TypeErrorCode)=>{
            if(res.ErrorCode==0){
                setList(res.Data.data);
                setCount(res.Data.count);
            }else{
                message.error(res.Data || "查询失败");
            }
        })
    };
    useEffect(() => {
        logFenye();
    }, [page]);

    // 搜索
    const suosou=()=>{
        setPage(1);
        logFenye();
    };
    const toedit=(e:number)=>{
        history.push(`/enter/editChangeWeChat?id=${e}`);
    };
    const IsDelOpen=(e)=>{
        setUid(e.id);
        setApplyAmount(e.applyAmount);
        setOpen(true);
        setOrderNum(e.orderNum);
    };
    const [orderNum,setOrderNum] = useState('');
    const onOk=()=>{
        setspinning(true);
        RefundService.check({uid,auditRefundAmount,serviceCharge,orderNum,reason,renameStatus:2}).then((res:TypeErrorCode)=>{
            if(res.ErrorCode==0){
                message.success("审核成功");
                setReason('');
                setOpen(false);
                logFenye();
                setspinning(false);
            }else{
                message.error(res.Data || "审核失败");
            }
        })
        setspinning(false);
    };
    const checkReturn = () => {
        setspinning(true);
        RefundService.refundReturn({ id: uid, reason: reason}).then((res: TypeErrorCode) => {
            if (res.ErrorCode === 0) {
                message.success('驳回成功');
                setReason('');
                setOpen(false);
                logFenye();
                setspinning(false);
            } else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const changeServiceCharge=(e:number)=>{
        setServiceCharge(e);
    };
    useEffect(() => {
        setAuditRefundAmount(Number((applyAmount-(applyAmount*serviceCharge/100)).toFixed(3)));
    }, [serviceCharge,applyAmount]);
    const TextArea = Input.TextArea;
    const [reason,setReason] = useState('');
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="手机号:"
                            onChange={changePhone}
                            value={phone}
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
                                value={stutes}
                                onChange={changeStutes}
                            >
                                <Select.Option value={0}>全部</Select.Option>
                                <Select.Option value={1}>未审核</Select.Option>
                                <Select.Option value={4}>已送审</Select.Option>
                                <Select.Option value={3}>已驳回</Select.Option>
                                <Select.Option value={2}>已审核</Select.Option>
                            </Select>
                        </Space.Compact>
                        <Button type="primary" onClick={suosou}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                size='small'
                scroll={{y:'70vh'}}
                dataSource={list}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50]}/>
            <Modal
                width={1000}
                open={open}
                title="审核"
                onCancel={() => setOpen(false)}
                loading={spinning}
                footer={[
                    <Button key="submit" type="primary" onClick={() => onOk()}>
                        通过
                    </Button>,
                    <Button key="return" type="primary" danger onClick={() => checkReturn()}>
                        驳回
                    </Button>,
                    <Button key="cancel" onClick={() => setOpen(false)}>
                        关闭
                    </Button>
                ]}
            >
                <Form layout="vertical">
                    <Form.Item
                        label="申请退款金额"
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="请输入数字"
                            disabled
                            value={applyAmount}
                        />
                    </Form.Item>
                    <Form.Item
                        label="实际退款金额"
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="请输入数字"
                            value={auditRefundAmount}
                            min={0}
                            disabled
                        />
                    </Form.Item>
                    <Form.Item
                        label="服务费"
                    >
                        <InputNumber
                            style={{ width: '200px' }}
                            placeholder="请输入数字"
                            min={0}
                            value={serviceCharge}
                            onChange={changeServiceCharge}
                        />%
                    </Form.Item>
                </Form>
                <br />
                <br />
                审核意见
                <TextArea rows={4} placeholder="请输入审核意见" value={reason} onChange={(e) => setReason(e.target.value)} />
            </Modal>
            {/* <Modal onOk={onOk} onCancel={()=>setOpen(false)} loading={spinning} open={open} title='是否要审核?'>
                <Form layout="vertical">
                    <Form.Item
                        label="申请退款金额"
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="请输入数字"
                            disabled
                            value={applyAmount}
                        />
                    </Form.Item>
                    <Form.Item
                        label="实际退款金额"
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="请输入数字"
                            value={auditRefundAmount}
                            min={0}
                            disabled
                        />
                    </Form.Item>
                    <Form.Item
                        label="服务费"
                    >
                        <InputNumber
                            style={{ width: '200px' }}
                            placeholder="请输入数字"
                            min={0}
                            value={serviceCharge}
                            onChange={changeServiceCharge}
                        />%
                    </Form.Item>
                </Form>
            </Modal> */}
        </Spin>
    )
}
export default CheckRefund
