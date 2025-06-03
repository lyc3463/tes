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

const Renew=(props:any)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setpageSize]=useState(50);
    // 手机号
    const [phone,setPhone]=useState(checkSessionStorage('/enter/afterSales/','renewPhone')||'');
    // 状态 0全部，1未审核，2审核通过
    const [stutes,setStutes]=useState(1);
    // 开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/enter/afterSales/','renewStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/enter/afterSales/','renewEndDate')||'2099-01-01');
    const [uid,setUid]=useState(0);
    const [open,setOpen]=useState(false);
    const [spinning,setspinning]=useState(false);
    const columns =[
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
            title: '续租开始时间',
            dataIndex: 'beginData',
            key: 'beginData',
            render:(_:any,record:any)=>(
                <div>
                    {dayjs(record.beginData).format("YYYY-MM-DD")}
                </div>
            )
        },
        {
            title: '续租到期时间',
            dataIndex: 'endDate',
            key: 'endDate',
            render:(_:any,record:any)=>(
                <div>
                    {dayjs(record.endDate).format("YYYY-MM-DD")}
                </div>
            )
        },
        {
            title: '状态',
            dataIndex: 'renameStatus',
            key: 'renameStatus',
            render:(text:any,record:any,)=>{
                return(
                    <Space>
                        {record.renameStatus==2?<Tag color='green'>已审核</Tag>:<Tag color='red'>未审核</Tag>}
                    </Space>
                )
            }
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
                            <Button type='primary' danger onClick={()=>isDelete(record.id)}>删除</Button>
                        </>}
                    </Space>
                )
            }
        },
    ];
    const toadd=()=>{
        history.push("/enter/addRenew");
    };
    // 监听页数
    const onChange=(page,pageSize)=>{
        setPage(page);
        setpageSize(pageSize);
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };
    // 监听姓名
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/enter/afterSales/','renewPhone',e.target.value);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Renew/fetch",
            payload:{page,phone,stutes,startDate,endDate,pageSize}
        })
    };
    useEffect(() => {
        logFenye();
    }, [page]);
    const fenyeinfo=()=>{
        props.dispatch({
            type:'Renew/fenye',
            payload:{phone,stutes,startDate,endDate,pageSize}
        })
    };
    // 搜索
    const suosou=()=>{
        setPage(1);
        fenyeinfo();
        logFenye();
    };
    useEffect(() => {
        fenyeinfo();
    }, []);
    const isDelete=(e:number)=>{
      setUid(e);
      setOpen(true);
    };
    const onOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'Renew/remove',
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
    const toedit=(e:number)=>{
        history.push(`/enter/editRenew?id=${e}`);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Button type='primary' onClick={toadd}>续租录入</Button>
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
                dataSource={props.RenewList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            <Modal loading={spinning} open={open} onOk={onOK} onCancel={()=>setOpen(false)} title='删除'>
                <div>是否要删除?</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        RenewList: state.Renew.list,
        count: state.Renew.count,
    }
};
export default connect(mapStateToProps) (Renew)