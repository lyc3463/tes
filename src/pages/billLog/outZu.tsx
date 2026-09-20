import dayjs from "dayjs";
import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    List,
    message,
    Modal,
    Pagination,
    Space,
    Spin,
    Table,
    Tag, Tooltip
} from "antd";
import {connect} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {QuestionCircleOutlined} from "@ant-design/icons";
import MyoutList from "@/components/MyoutList";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const OutZu=(props:any)=>{
    // 页码
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);

    // 转圈
    const [spinning,setspinning]=useState(false);
    // 租户名称
    const [name,setName]=useState(checkSessionStorage('/billLog/monthlyBill/','outZuName')||'');
    // 租户手机号
    const [phone,setPhone]=useState(checkSessionStorage('/billLog/monthlyBill/','outZuPhone')||'');
    // 开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/billLog/monthlyBill/','outZuStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/billLog/monthlyBill/','outZuEndDate')||'2099-01-01');
    // 唯一id
    const [uid,setUid]=useState(0);
    // 缴费弹窗
    const [jfOpen,setJfOpen]=useState(false);
    // 备注弹窗
    const [rkOpen,setRkOpen]=useState(false);
    // 缴费金额
    const [payAmount,setpayAmount]=useState(0);
    // 原本备注内容
    const [oldRk,setOldRk]=useState('');
    // 填写的备注内容
    const [newRk,setNewRk]=useState('');
    const [OldPhone,setOldPhone]=useState('');
    const [outzuList,setoutzuList]=useState(false);

    const columns =[
        {
            title: '日期',
            dataIndex: 'created',
            key: 'created',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.created).format("YYYY-MM-DD")}
                    </div>
                )
            }
        },
        {
            title: '租户姓名',
            dataIndex: 'tenantName',
            key: 'tenantName',
            render: (text:any, record:any) => {
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.tenantName}>
                            {record.tenantName==null?<span style={{color:'red'}} >未绑定租户</span>:<span >{record.tenantName}</span>}
                        </Tooltip>
                    </div>
                )
            },
        },
        {
            title: '租户手机号',
            dataIndex: 'tenantPhone',
            key: 'tenantPhone',
        },
        // {
        //     title: '租金/管理费',
        //     dataIndex: 'rentAmount',
        //     key: 'rentAmount',
        //     render:(text:any,record:any)=>{
        //         return(
        //             <div>
        //                 {record.rentAmount}元
        //             </div>
        //         )
        //     }
        // },
        {
            title: '租金',
            dataIndex: 'rentAmount',
            key: 'rentAmount',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.rentAmount}元
                    </div>
                )
            }
        },
        {
            title: '管理费',
            dataIndex: 'managementAmount',
            key: 'managementAmount',
            render:(text:any,record:any)=>{
                return( 
                    <div>
                        {record.managementAmount}元
                    </div>
                )
            }
        },
        {
            title: '公共缴费',
            dataIndex: 'itemAmount',
            key: 'itemAmount',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.itemAmount}元
                    </div>
                )
            }
        },
        {
            title: '服务费',
            dataIndex: 'lossAmount',
            key: 'lossAmount',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.lossAmount}元
                    </div>
                )
            }
        },
        {
            title: '电费',
            dataIndex: 'eleAmount',
            key: 'eleAmount',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.eleAmount}元
                    </div>
                )
            }
        },
        {
            title: '水费',
            dataIndex: 'waterAmount',
            key: 'waterAmount',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.waterAmount}元
                    </div>
                )
            }
        },
        {
            title: '违约金',
            dataIndex: 'defaultAmount',
            key: 'defaultAmount',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.defaultAmount}元
                    </div>
                )
            }
        },
        {
            title: '已交金额',
            dataIndex: 'stopAmount',
            key: 'stopAmount',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.stopAmount}元
                    </div>
                )
            }
        },
        {
            title: '账单总金额',
            dataIndex: 'payAmount',
            key: 'payAmount',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.payAmount}元
                    </div>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'billStatus',
            key: 'billStatus',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.billStatus==1?<Tag color='red'>未交</Tag>:<Tag color='green'>已交</Tag>}
                    </div>
                )
            }
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            render:(text:any,record:any)=>{
                return(
                    <div>
                       <Input.TextArea value={record.remark}></Input.TextArea>
                    </div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'x',
            key: 'x',
            render:(text:any,record:any)=>{
                return(
                    <Space>
                        {record.billStatus==1?<Button type='primary' onClick={()=>jiaofei(record.id)}>缴费</Button>:<span></span>}
                        <Button type='primary' onClick={()=>editRemark(record)}>备注</Button>
                    </Space>
                )
            }
        },
    ];
    // 获取账单列表
    const getList=()=>{
        props.dispatch({
            type:'OutZu/fetch',
            payload:{page,name,phone,startDate,endDate,pageSize}
        })
    };
    // 缴费弹窗
    const jiaofei=(id:number)=>{
        setUid(id);
        setJfOpen(true);
    };
    // 备注弹窗
    const editRemark=(item:any)=>{
        setUid(item.id);
        setOldRk(`${item.remark};`);
        setRkOpen(true);
    };
    // 缴费确定OK
    const onJfOk=()=>{
      setspinning(true);
      props.dispatch({
          type:'OutZu/add',
          payload:{uid,payAmount}
      }).then((res:TypeErrorCode)=>{
          if (res.ErrorCode==0){
              message.success('缴费成功');
              setNewRk('');
              setspinning(false);
              setJfOpen(false);
          }else {
              message.error(res.Data);
              setspinning(false);
              setJfOpen(false);
          }
      })
    };
    // 备注确定
    const onRkOk=()=>{
        setspinning(true);
        let addremark=oldRk+newRk;
        props.dispatch({
            type:'OutZu/addremark',
            payload:{uid,addremark}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('编辑备注成功');
                setspinning(false);
                setRkOpen(false);
            }else {
                message.error(res.Data);
                setspinning(false);
                setRkOpen(false);
            }
        })
    };
    const sousuo=()=>{
        setPage(1);
        // logFney();
        getList();
    };
    // const logFney=()=>{
    //   props.dispatch({
    //       type:'OutZu/fenye',
    //       payload:{name,phone,startDate,endDate,pageSize}
    //   })
    // };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/billLog/monthlyBill/','outZuStartDate','2000-01-01');
            updateSessionStorage('/billLog/monthlyBill/','outZuEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/billLog/monthlyBill/','outZuStartDate',data[0]);
            updateSessionStorage('/billLog/monthlyBill/','outZuEndDate',data[1]);
        }
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        getList();
    }, [page]);
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/billLog/monthlyBill/','outZuName',e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/billLog/monthlyBill/','outZuPhone',e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="租户姓名:"
                            value={name}
                        />
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
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                scroll={{y:'60vh'}}
                rowKey={(columns) => columns.id}
                size='small'
                dataSource={props.OutZuList}
            />
            {/*缴费金额弹窗*/}
            <Modal onOk={onJfOk} open={jfOpen} onCancel={()=>setJfOpen(false)} loading={spinning} title='是否缴费'>
                <Form>
                    <Form.Item label='缴费金额'>
                        <InputNumber min={0} value={payAmount} onChange={(e)=>setpayAmount(e)}/>
                    </Form.Item>
                </Form>
            </Modal>
            {/*备注弹窗*/}
            <Modal onOk={onRkOk} open={rkOpen} onCancel={()=>setRkOpen(false)} loading={spinning} title='备注内容'>
                <Form>
                    <Form.Item label='备注'>
                        <Input.TextArea  onChange={(e)=>setNewRk(e.target.value)} value={newRk}/>
                    </Form.Item>
                </Form>
            </Modal>
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        OutZuList: state.OutZu.list,
        count: state.OutZu.count,
    }
};
export default connect(mapStateToProps) (OutZu)