import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {history,connect} from "umi";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const CheckByStages=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);

    // 手机号
    const [phone,setPhone]=useState(checkSessionStorage('/check/checkAfterSales/','CheckByStagesPhone')||'');
    // 状态 0全部，1未审核，2审核通过
    const [stutes,setStutes]=useState(checkSessionStorage('/check/checkAfterSales/','CheckByStagesStutes')||0);
    // 开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/check/checkAfterSales/','CheckByStagesStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/check/checkAfterSales/','CheckByStagesEndDate')||'2099-01-01');
    // 审核弹窗open
    const [open,setOpen]=useState(false);
    // 审核的id
    const [uid,setUid]=useState(0);
    const [spinning,setspinning]=useState(false);
    const columns =[
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
        },
        {
            title: '租户名字',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '联系方式',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '分期周期',
            dataIndex: 'qq',
            key: 'qq',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.staBeginTime).format("YYYY-MM")}至{dayjs(record.staEndTime).format("YYYY-MM")}
                    </div>
                )
            }
        },
        {
            title: '还款周期',
            dataIndex: 'aa',
            key: 'aa',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.staBeginTime2).format("YYYY-MM")}至{dayjs(record.staEndTime2).format("YYYY-MM")}
                    </div>
                )
            }
        },
        {
            title: '租金分期金额',
            dataIndex: 'staRent',
            key: 'staRent',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        <span style={{color:'red',fontSize:'18px'}}>{record.staRent}</span>
                        <span style={{fontSize:'12px',cursor:'#999'}}>元</span>
                    </div>
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
            title: '操作',
            dataIndex: 'c',
            key: 'c',
            render:(text:any,record:any,)=>{
                return(
                    <Space>
                        {/*<Button type='link'>详情</Button>*/}
                        {record.renameStatus==2?'':<>
                            {/*<Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button>*/}
                            <Button type='primary' onClick={()=>checkOpen(record.id)}>审核</Button>
                        </>}
                    </Space>
                )
            }
        }
    ];
    // 审核弹窗
    const checkOpen=(e)=>{
        setUid(e);
        setOpen(true);
    }
    const toedit=(e)=>{
        history.push(`/check/editByStages?id=${e}`);
    };
    // 审核确定按钮
    const onOK=()=>{
        setspinning(true);
        props.dispatch({
            type:"ByStages/check",
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('审核成功');
                setspinning(false);
                setOpen(false);
            }else {
                message.error(res.Data);
                setspinning(false);
                setOpen(false);
            }
        })
    };
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
            updateSessionStorage('/check/checkAfterSales/','CheckByStagesStartDate','2000-01-01');
            updateSessionStorage('/check/checkAfterSales/','CheckByStagesEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/check/checkAfterSales/','CheckByStagesStartDate',data[0]);
            updateSessionStorage('/check/checkAfterSales/','CheckByStagesEndDate',data[1]);
        }
    };
    // 监听姓名
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/check/checkAfterSales/','CheckByStagesPhone',e.target.value);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
        updateSessionStorage('/check/checkAfterSales/','CheckByStagesStutes',e);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"ByStages/fetch",
            payload:{page,phone,stutes,startDate,endDate,pageSize}
        })
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    // 搜索
    const suosou=()=>{
        setPage(1);
        fenyeinfo();
        logFenye();
    };
    const fenyeinfo=()=>{
        props.dispatch({
            type:'ByStages/fenye',
            payload:{phone,stutes,startDate,endDate,pageSize}
        })
    };
    useEffect(() => {
        fenyeinfo();
    }, []);
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
                                onChange={changeStutes}
                                defaultValue={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:1, label: '未审核' },
                                    { value:2, label: '已审核' },
                                ]}
                            />
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
                scroll={{y:'70vh',x:1500}}
                dataSource={props.ByStagesList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        {/*    审核弹窗*/}
            <Modal title={'审核'} loading={spinning} onOk={onOK} onCancel={()=>setOpen(false)} open={open}>
                <div>确定要审核吗?</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ByStagesList: state.ByStages.list,
        count: state.ByStages.count,
    }
};
export default connect(mapStateToProps) (CheckByStages)