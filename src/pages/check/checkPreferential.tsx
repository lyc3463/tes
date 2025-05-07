import dayjs from "dayjs";
import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {connect,history} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const CheckPreferential=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 手机号
    const [phone,setPhone]=useState('');
    // 状态 0全部，1未审核，2审核通过
    const [stutes,setStutes]=useState(0);
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    // 审核弹窗
    const [isOpen,setIsOpen]=useState(false);
    const [uid,setUid]=useState(0);
    // 加载
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
            title: '优惠周期',
            dataIndex: 'preBeginTime',
            key: 'preBeginTime',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.preBeginTime).format("YYYY-MM")}至{dayjs(record.preEndTime).format("YYYY-MM")}
                    </div>
                )
            }
        },
        {
            title: '申请优惠租金',
            dataIndex: 'preRen',
            key: 'preRen',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        <span style={{color:'red',fontSize:'18px'}}>{record.preRen}</span>
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
                    <div>{record.renameStatus==2?<Tag color='green'>已通过</Tag>:<Tag color='red'>未审核</Tag>}</div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render:(text:any,record:any,)=>{
                return(
                    <Space>
                        {record.renameStatus==2?'':<>
                            {/*<Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button>*/}
                            <Button type='primary' onClick={()=>checkOp(record.id)}>审核</Button>
                        </>}
                        <Button type='primary' onClick={()=>toInfo(record.id)}>详情</Button>
                    </Space>
                )
            }
        }
    ];
    const toInfo=(e:number)=>{
        history.push(`/check/preFerentialInfo?id=${e}`);

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
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };
    // 监听姓名
    const changePhone=(e)=>{
        setPhone(e.target.value);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Preferential/fetch",
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
            type:'Preferential/fenye',
            payload:{phone,stutes,startDate,endDate,pageSize}
        })
    };
    // 审核弹窗
    const checkOp=(e)=>{
        setIsOpen(true);
        setUid(e);
    };
    useEffect(() => {
        fenyeinfo();
    }, []);
    const onOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'Preferential/check',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('审核通过');
                setspinning(false);
                setIsOpen(false);
            }else {
                message.error(res.Data);
                setspinning(false);
                setIsOpen(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="手机号:"
                            onChange={changePhone}
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
                scroll={{y:'70vh'}}
                dataSource={props.PreferentialList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal title={'审核'} onCancel={()=>setIsOpen(false)} loading={spinning} open={isOpen} onOk={onOk}>
                <div>是否要审核?</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        PreferentialList: state.Preferential.list,
        count: state.Preferential.count,
    }
};
export default connect(mapStateToProps) (CheckPreferential)