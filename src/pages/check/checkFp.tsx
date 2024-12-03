import {connect, history} from 'umi'
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import TypeCheckFp from "@/ModelTypes/TypeCheckFp";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const CheckFp=(props:any)=>{
    const [isLoading,setIsLoading]=useState(false);
    const [page,setPage]=useState(1);
    const [openId,setOpenId]=useState('');
    const [stutes,setStutes]=useState(0);
    const [uid,setUid]=useState(0);
    const [checkOpen,setCheckOpen]=useState(false);
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    const columns =[
        {
            title: '申请日期',
            dataIndex: 'billDate',
            key: 'billDate',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.billDate).format('YYYY-MM-DD')}
                    </div>
                )
            }
        },
        {
            title: '发票抬头',
            dataIndex: 'rise_name',
            key: 'rise_name',
        },
        {
            title: '账单类型',
            dataIndex: 'money_type',
            key: 'money_type',
            render:(_:any,item:any)=>{
                let consumptionTypeText;
                switch (item.consumptionType) {
                    case 1:
                        consumptionTypeText = <Tag style={{ color: '#4CAF50' }}>充值</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag style={{ color: '#F44336' }}>租金</Tag>;
                        break;
                    case 3:
                        consumptionTypeText = <Tag style={{ color: '#2196F3' }}>电费</Tag>;
                        break;
                    case 4:
                        consumptionTypeText = <Tag style={{ color: '#FFC107' }}>水费</Tag>;
                        break;
                    case 5:
                        consumptionTypeText = <Tag style={{ color: '#9C27B0' }}>公共缴费</Tag>;
                        break;
                    case 6:
                        consumptionTypeText = <Tag style={{ color: '#E91E63' }}>违约金</Tag>;
                        break;
                    case 7:
                        consumptionTypeText = <Tag style={{ color: '#795548' }}>物业管理费</Tag>;
                        break;
                    default:
                        consumptionTypeText = <Tag style={{ color: '#777777' }}>未知类型</Tag>;
                }
                return (
                    consumptionTypeText
                );
            }
        },
        {
            title: '开票金额',
            dataIndex: 'consumptionMoney',
            key: 'consumptionMoney',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        <span style={{fontSize:'14px',color:'red'}}>{record.consumptionMoney}<span style={{fontSize:'12px',color:'#555'}}>元</span></span>
                    </div>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'invoiceStatus',
            key: 'invoiceStatus',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.invoiceStatus==1?<Tag color="red">未审核</Tag>:<Tag color="green">已审核</Tag>}
                    </div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render: (text:any, record:any) => {
                return(
                    <Space>
                         {record.invoiceStatus==1?(<>
                             <Button type='primary' onClick={()=>onTongguo(record)} danger>拒绝</Button>
                             <Button type='primary' onClick={()=>toedit(record)}>详情</Button>
                         </>):''}
                    </Space>
                )
            }
        },
    ];
    // 去编辑页面
    const toedit=(e:TypeCheckFp)=>{
      history.push(`/check/editCheckFp?id=${e.id}`);
    };
    // 监听页码
    const onChange=(e)=>{
      setPage(e);
    };
     // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"CheckFp/fetch",
            payload:{page,startDate,endDate,openId,stutes}
        })
    };
    useEffect(() => {
        logFenye();
        console.log(props)
    }, [page]);
    // 审核通过弹窗
    const onTongguo=(e:TypeCheckFp)=>{
        setUid(e.id);
        setCheckOpen(true);
    };
    // 审核通过弹窗按钮
    const onOk=()=>{
      setIsLoading(true);
      props.dispatch({
          type:"CheckFp/check",
          payload:{uid}
      }).then((res:TypeErrorCode)=>{
          if (res.ErrorCode==0){
              message.success('审核通过');
              setCheckOpen(false);
              setIsLoading(false);
          }else {
              message.error(res.Data);
              setIsLoading(false);
          }
      })
    };
        // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };
    // 状态
    const changeStutes=(e)=>{
      setStutes(e)
    };
    const sousuo=()=>{
      setPage(1);
        props.dispatch({
            type:'CheckFp/fenye',
            payload:{page,startDate,endDate,openId,stutes}
        });
        logFenye();
    };
    return(
        <Spin spinning={isLoading}>
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
                            <Select
                                onChange={changeStutes}
                                defaultValue={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value: 0, label: '全部' },
                                    { value: 1, label: '未审核' },
                                    { value: 2, label: '已审核' },
                                ]}
                            />
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
                size='small'
                scroll={{y:'70vh'}}
                rowKey={(columns) => columns.id}
                dataSource={props.CheckFpList}
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            {/*审核的弹窗*/}
            <Modal open={checkOpen} onOk={onOk} onCancel={()=>setCheckOpen(false)} title='审核发票'>
                <div>确定审核通过吗?</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckFpList: state.CheckFp.list,
        count:state.CheckFp.count
    }
};
export default connect(mapStateToProps) (CheckFp)