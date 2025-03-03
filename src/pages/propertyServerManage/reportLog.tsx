import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {connect} from "umi";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const ReportLog=(props:any)=>{
    const [page,setPage]=useState(1);
    const [name,setname]=useState('');
    const [state,setstate]=useState(0);
    const [phone,setPhone]=useState('');
    const [openID,setopenID]=useState(0);
    const [startDate,setstartDate]=useState('2000-01-01');
    const [endDate,setendDate]=useState('2099-01-01');
    const [loading, setLoading] = useState(false);
    const [isOpen,setIsOpen]=useState(false);
    const [uid,setUid]=useState(0);
    // 跟进人ID
    const [userID,setUserID]=useState(0);
    // 修理成功的id
    const [OnId,setOnId]=useState(0);
    // 修理成功的弹窗
    const [onOpen,setOnOpen]=useState(false);
    const [count,setcount]=useState(0);
    const columns=[
        {
            title: '日期',
            dataIndex: 'created',
            render: (_: any, record: any) => (
                <div>
                    {dayjs(_).format('YYYY-MM-DD HH:mm:ss')}
                </div>
            ),
        },
        {
            title: '报修用户',
            dataIndex: 'appUser_name',
        },
        {
            title: '用户联系方式',
            dataIndex: 'appUser_phone',
        },
        {
            title: '跟进人',
            dataIndex: 'userName',
            render:(_:any,record:any)=>(
                <div>
                    {record.userName?<Tag color='green'>{record.userName}</Tag>:<Tag color='red'>未分配跟进人</Tag>}
                </div>
            )
        },
        {
            title: '报修内容',
            dataIndex: 'repair_content',
            render: (_: any, record: any) => (
                <Input.TextArea value={_}/>
            ),
        },
        {
            title: '状态',
            dataIndex: 'repair_status',
            render: (_: any, record: any) => (
                <div>
                    {record.repair_status==2?<Tag color='green'>已完成</Tag>:<Tag color='red'>未处理</Tag>}
                </div>
            ),
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <div>
                    {
                        record.repair_status==1?(
                            <Space>
                                <Button type='primary' onClick={()=>genjin(record)}>分配跟进人</Button>
                                <Button type='primary' onClick={()=>onokOpen(record)}>修理完成</Button>
                            </Space>
                        ):''
                    }

                </div>
            ),
        },
    ];
    // 确定分配跟进人按钮
    const onOk=()=>{
        setLoading(true);
        props.dispatch({
            type:'Report/fenpei',
            payload:{uid,userID}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                setLoading(false);
                message.success('分配成功');
                setIsOpen(false);
            }else {
                message.error(res.Data);
                setLoading(false);
            }
        })
    };
    // 获取报修列表
    const getList=()=>{
      props.dispatch({
          type:'Report/fetch',
          payload:{page,name,phone,state,openID,startDate,endDate}
      })
    };
    // 获取报修记录分页
    const getListfenye=()=>{
        props.dispatch({
            type:'Report/fenye',
            payload:{name,phone,state,openID,startDate,endDate}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
            }
        })
    };
    // 分配跟进人弹窗
    const genjin=(e)=>{
      setIsOpen(true);
      setUid(e.id);
    };
    const onChange=(e:number)=>{
        setPage(e);
    };
    // 选择跟进人
    const changeSelect=(e)=>{
        setUserID(e);
    };
    // 修理完成弹窗
    const onokOpen=(e:any)=>{
        setOnId(e.id);
        setOnOpen(true);
    };
    // 处理完成确定
    const onhandleOk=()=>{
        setLoading(true);
        props.dispatch({
            type:'Report/edit',
            payload:{OnId}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setLoading(false);
                setOnOpen(false);
                message.success('处理完成');
            }else {
                setOnOpen(false);
                setLoading(false);
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        getList();
    }, [page]);
    useEffect(() => {
        getListfenye();
    }, []);
    const sousuo=()=>{
        setPage(1);
        getList();
        getListfenye();
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setstartDate('2000-01-01');
            setendDate('2099-01-01');
        } else {
            setstartDate(data[0]);
            setendDate(data[1]);
        }
    };
    // 监听状态
    const changeState=(e)=>{
      setstate(e);
    };
    return(
        <Spin spinning={loading}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={(e)=>{setPhone(e.target.value)}}
                            addonBefore="手机号:"
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
                                时间:
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
                            <Select value={state} onChange={changeState}  style={{ width: 120 }}>
                                <Select.Option value={0}>
                                    全部
                                </Select.Option>
                                <Select.Option value={1}>
                                    未处理
                                </Select.Option>
                                <Select.Option value={2}>
                                    已完成
                                </Select.Option>
                            </Select>
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
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
                dataSource={props.ReportList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {count?<Pagination total={count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            {/* 分配跟进人弹窗*/}
            <Modal title='分配跟进人' open={isOpen} onCancel={()=>setIsOpen(false)} onOk={onOk} loading={loading}>
                <Select style={{width:'100%'}} onChange={changeSelect}>
                    {props.UsersList&&props.UsersList.length>0?props.UsersList.map((item:any,index:any)=>{
                        return(
                            <Select.Option value={item.id} key={index}>
                                {item.user_name}
                            </Select.Option>
                        )
                    }):''}
                </Select>
            </Modal>
        {/*    修理成功的按钮*/}
            <Modal open={onOpen} loading={loading} onOk={onhandleOk} onCancel={()=>setOnOpen(false)}>
                <div>确定处理完成</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ReportList: state.Report.list,
        count: state.Report.count,
        UsersList: state.Users.list,
    }
};
export default connect(mapStateToProps) (ReportLog)