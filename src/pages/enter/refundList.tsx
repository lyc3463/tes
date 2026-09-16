import {Button, DatePicker, Descriptions, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {connect, history} from "umi";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as RefundService from "@/services/refund";
import { QuestionCircleOutlined, PrinterTwoTone } from '@ant-design/icons';

const RefundList = (props: any) => {
    const [spinning, setSpinning] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [phone, setPhone] = useState('');
    const [stutes, setStutes] = useState(0);
    const [startDate, setStartDate] = useState('2000-01-01');
    const [endDate, setEndDate] = useState('2099-01-01');
    // 删除弹窗
    const [dUid, setDUid] = useState(0);
    const [dOpen, setDOpen] = useState(false);
    const [deleteRecord, setDeleteRecord] = useState<any>({});

    const columns = [
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
            title: '申请日期',
            dataIndex: 'created',
            key: 'created',
            align: 'center',
            render: (text: any) => <div>{text ? dayjs(text).format('YYYY-MM-DD') : ''}</div>,
        },
        {
            title: '退款金额(元)',
            dataIndex: 'applyAmount',
            key: 'applyAmount',
            align: 'center',
            render: (text: any) => <div>{Number(text || 0).toFixed(2)}</div>,
        },
        {
            title: '退款原因',
            dataIndex: 'applyReason',
            key: 'applyReason',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '原订单编号',
            dataIndex: 'orderNum',
            key: 'orderNum',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '审核状态',
            dataIndex: 'renameStatus',
            key: 'renameStatus',
            align: 'center',
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
                const reason = record && (record.rejectReason || record.reject_reason || record.reject || record.rejectedReason || '');
                return (
                    <Space>
                        <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                        {text === 3 && reason ? (
                            <Tooltip title={reason} placement="topLeft">
                                <QuestionCircleOutlined style={{ color: '#999', marginLeft: 4 }} />
                            </Tooltip>
                        ) : null}
                    </Space>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: 200,
            render: (text: any, record: any) => (
                <Space>
                    {(record.renameStatus == 1 || record.renameStatus == 3) && <>
                        <Button type="primary" size="small"
                                onClick={() => history.push(`/enter/editRefund?id=${record.id}`)}>
                            编辑
                        </Button>
                        <Button type="primary" danger size="small" onClick={() => isDelOpen(record)}>
                            删除
                        </Button>
                    </>}
                </Space>
            ),
        },
    ];

    // 列表
    const getList = () => {
        props.dispatch({
            type: 'Refund/fetch',
            payload: {page, phone, stutes, startDate, endDate, pageSize},
        });
    };

    useEffect(() => {
        getList();
    }, [page, pageSize]);

    const onChange = (page: number, pageSize: number) => {
        setPage(page);
        setPageSize(pageSize);
    };

    const sousuo = () => {
        setPage(1);
        getList();
    };

    const changePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };

    const changeStutes = (e: number) => {
        setStutes(e);
    };

    const changeDate = (_: any, data: string[]) => {
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };

    const toAdd = () => {
        history.push('/enter/addRefund');
    };

    const isDelOpen = (record: any) => {
        setDUid(record.id);
        setDeleteRecord(record);
        setDOpen(true);
    };

    const delOk = () => {
        setSpinning(true);
        RefundService.refundDelete({id: dUid, jsonData: ''}).then((res: TypeErrorCode) => {
            setSpinning(false);
            if (res.ErrorCode === 0) {
                message.success('删除成功');
                setDOpen(false);
                getList();
            } else {
                message.error(res.Data);
            }
        });
    };

    return (
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Button type="primary" onClick={toAdd}>
                            新增退款申请
                        </Button>
                    </Space>
                    <Space>
                        <Input addonBefore="手机号:" value={phone} onChange={changePhone}/>
                        <Space.Compact>
                            <div style={{
                                borderRadius: '6px',
                                borderStartEndRadius: 0,
                                borderEndEndRadius: 0,
                                padding: '0 11px',
                                border: '1px solid #d9d9d9',
                                display: 'flex',
                                alignItems: 'center',
                                borderInlineEnd: 0,
                            }}>
                                状态:
                            </div>
                            <Select
                                style={{width: 120}}
                                value={stutes}
                                onChange={changeStutes}
                                options={[
                                    {value: 0, label: '全部'},
                                    {value: 1, label: '未审核'},
                                    {value: 4, label: '已送审'},
                                    {value: 3, label: '驳回'},
                                    {value: 2, label: '已审核'},
                                ]}
                            />
                        </Space.Compact>
                        <Space.Compact>
                            <div style={{
                                borderRadius: '6px',
                                borderStartEndRadius: 0,
                                borderEndEndRadius: 0,
                                padding: '0 11px',
                                border: '1px solid #d9d9d9',
                                display: 'flex',
                                alignItems: 'center',
                                borderInlineEnd: 0,
                            }}>
                                日期:
                            </div>
                            {startDate === '2000-01-01' && endDate === '2099-01-01' ?
                                <DatePicker.RangePicker onChange={changeDate}/> :
                                <DatePicker.RangePicker onChange={changeDate}
                                                        defaultValue={[dayjs(startDate), dayjs(endDate)]}/>}
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border: '1px solid #ddd', borderRadius: '4px'}}
                pagination={false}
                scroll={{y: '60vh'}}
                dataSource={props.list}
                rowKey={(record: any) => record.id}
                size='small'
                rowClassName={(_, index) => index % 2 === 1 ? 'tbodd' : 'tbeven'}
            />
            {props.count ?
                <Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}
                            onChange={onChange} pageSizeOptions={[50, 100, 500, 1000, 10000]}/> : ''}
            <Modal
                title="删除确认"
                open={dOpen}
                onOk={delOk}
                onCancel={() => setDOpen(false)}
                loading={spinning}
                width={1000}
            >
                <Descriptions
                    column={2}
                    size="small"
                    bordered
                    labelStyle={{width: 110, backgroundColor: '#fafafa'}}
                >
                    <Descriptions.Item label="申请日期">
                        {deleteRecord.created ? dayjs(deleteRecord.created).format('YYYY-MM-DD') : ''}
                    </Descriptions.Item>
                    <Descriptions.Item label="租户名称">{deleteRecord.tenantName}</Descriptions.Item>
                    <Descriptions.Item label="退款金额">
                        {Number(deleteRecord.applyAmount || 0).toFixed(2)}元
                    </Descriptions.Item>
                    <Descriptions.Item label="订单编号">{deleteRecord.orderNum}</Descriptions.Item>
                    <Descriptions.Item label="退款原因" span={2}>{deleteRecord.applyReason}</Descriptions.Item>
                </Descriptions>
            </Modal>
        </Spin>
    );
};

const mapStateToProps = (state: any) => ({
    list: state.Refund.list,
    count: state.Refund.count,
});

export default connect(mapStateToProps)(RefundList);
