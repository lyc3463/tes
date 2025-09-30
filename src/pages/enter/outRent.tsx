import {
    Button,
    DatePicker,
    Input,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Tooltip
} from "antd";
import dayjs from "dayjs";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
const OutRent=(props:any)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [uid,setUid]=useState(0);
    const [open,setOpen]=useState(false);
    // 手机号
    const [phone,setPhone]=useState(checkSessionStorage('/enter/afterSales/','outRentPhone')||'');
    const [spinning,setspinning]=useState(false);
    // 状态 0全部，1未审核，2审核通过
    const [stutes,setStutes]=useState(1);
    // 开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/enter/afterSales/','outRentStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/enter/afterSales/','outRentEndDate')||'2099-01-01');
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
            title: '日期',
            dataIndex: 'created',
            key: 'created',
            render:(_:any,record:any)=>(
                <div>
                    {dayjs(record.created).format("YYYY-MM-DD")}
                </div>
            )
        },
        {
            title: '合同编号',
            dataIndex: 'identifier',
            key: 'identifier',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.identifier}>
                            {record.identifier}
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '租户名字',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.tenant_name}>
                            {record.tenant_name}
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '联系方式',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '申请退租日期',
            dataIndex: 'refundData',
            key: 'refundData',
            render:(_:any,record:any)=>(
                <div>
                    {dayjs(record.refundData).format("YYYY-MM-DD")}
                </div>
            )
        },
        {
            title: '类型',
            dataIndex: 'refundType',
            key: 'refundType',
            render:(text:any,record:any,)=>{
                return(
                    <div>{record.refundType==1?<Tag color='blue'>正常退租</Tag>:<Tag color='red'>强制退租</Tag>}</div>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'renameStatus',
            key: 'renameStatus',
            render:(text:any,record:any,)=>{
                return(
                    <div>{record.renameStatus==2?<Tag color='green'>已审核</Tag>:<Tag color='red'>未审核</Tag>}</div>
                )
            }
        },
        {
            title: '退租原因',
            dataIndex: 'refundReason',
            key: 'refundReason',
            render:(_:any,record:any)=>(
                <div style={{width:'200px'}}>
                    <Input.TextArea value={record.refundReason}/>
                </div>
            )
        },
        {
            title: '操作',
            dataIndex: 'xx',
            key: 'xx',
            render:(text:any,record:any,)=>{
                return(
                    <Space>
                        {record.renameStatus==2?'':<>
                            <Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button>
                            <Button type='primary' danger onClick={()=>isdelete(record.id)}>删除</Button>
                        </>}
                    </Space>
                )
            }
        },
    ];
    const toadd=()=>{
        history.push('/enter/addOutRent')
    };
    // 监听页数
    const onChange=(page,pageSize)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/enter/afterSales/','outRentStartDate','2000-01-01');
            updateSessionStorage('/enter/afterSales/','outRentEndDate','2099-01-01');

        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/enter/afterSales/','outRentStartDate',data[0]);
            updateSessionStorage('/enter/afterSales/','outRentEndDate',data[1]);
        }
    };
    // 监听姓名
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/enter/afterSales/','outRentPhone',e.target.value);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"OutRent/fetch",
            payload:{page,phone,stutes,startDate,endDate,pageSize}
        })
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    useEffect(() => {
        fenyeinfo();
    }, []);
    // 搜索
    const suosou=()=>{
        setPage(1);
        fenyeinfo();
        logFenye();
    };
    const fenyeinfo=()=>{
        props.dispatch({
            type:'OutRent/fenye',
            payload:{phone,stutes,startDate,endDate,pageSize}
        })
    };
    const toedit=(e:number)=>{
        history.push(`/enter/editOutRent?id=${e}`);
    };
    const isdelete=(e)=>{
      setUid(e);
      setOpen(true);
    };
    const onOk=()=>{
      setspinning(true);
        props.dispatch({
            type:'OutRent/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setspinning(false);
                setOpen(false);
            }else {
                message.error(res.Data);
                setspinning(false);
                setOpen(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Button type="primary" onClick={toadd}>
                          录入强制退租
                        </Button>

                    </Space>
                    <Space>
                        <Input
                            addonBefore="原手机号:"
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
                dataSource={props.OutRentList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            <Modal open={open} loading={spinning} onCancel={()=>setOpen(false)} title={'删除'} onOk={onOk}>
                是否要删除?
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        OutRentList: state.OutRent.list,
        count: state.OutRent.count,
    }
};
export default  connect(mapStateToProps)(OutRent)