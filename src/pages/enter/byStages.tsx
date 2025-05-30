import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {history,connect} from "umi";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const ByStages=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 手机号
    const [phone,setPhone]=useState(sessionStorage.getItem('enterByStagesPhone')||'');
    // 状态 0全部，1未审核，2审核通过
    const [stutes,setStutes]=useState(1);
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    const [did,setDid]=useState(0);
    const [open,setOpen]=useState(false);
    const [spinning,setspinning]=useState(false);
    const toadd=()=>{
        history.push('/enter/addByStages')
    };
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
            dataIndex: 'cx',
            key: 'cx',
            render:(text:any,record:any,)=>{
                return(
                    <Space>
                        {
                            record.renameStatus==2?'':<> <Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button>
                                <Button type='primary' danger onClick={()=>IsDelOpen(record.id)}>删除</Button></>
                        }
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
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };
    // 监听姓名
    const changePhone=(e)=>{
        setPhone(e.target.value);
        sessionStorage.setItem('enterByStagesPhone',e.target.value);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
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
    }, [page]);
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
    const toedit=(e:number)=>{
        history.push(`/enter/editByStages?id=${e}`);
    };
    const IsDelOpen=(e)=>{
        setDid(e);
        setOpen(true);
    };
    const onOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'ByStages/remove',
            payload:did
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
                    <Button type='primary' onClick={toadd}>分期录入</Button>

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
                            <DatePicker.RangePicker onChange={changeDate}/>
                        </Space.Compact>
                        {/*<Space.Compact>*/}
                        {/*    <div*/}
                        {/*        style={{*/}
                        {/*            borderRadius: '6px',*/}
                        {/*            borderStartEndRadius: 0,*/}
                        {/*            borderEndEndRadius: 0,*/}
                        {/*            padding: '0 11px',*/}
                        {/*            border: '1px solid #d9d9d9',*/}
                        {/*            display: 'flex',*/}
                        {/*            alignItems: 'center',*/}
                        {/*            borderInlineEnd: 0,*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        状态:*/}
                        {/*    </div>*/}
                        {/*    <Select*/}
                        {/*        onChange={changeStutes}*/}
                        {/*        defaultValue={stutes}*/}
                        {/*        style={{ width: 120 }}*/}
                        {/*        options={[*/}
                        {/*            { value:0, label: '全部' },*/}
                        {/*            { value:1, label: '未审核' },*/}
                        {/*            { value:2, label: '已审核' },*/}
                        {/*        ]}*/}
                        {/*    />*/}
                        {/*</Space.Compact>*/}
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
                dataSource={props.ByStagesList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            <Modal onOk={onOk} onCancel={()=>setOpen(false)} loading={spinning} open={open} title='是否要删除?'>
                <div>
                    是否要删除?
                </div>
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
export default connect(mapStateToProps) (ByStages)