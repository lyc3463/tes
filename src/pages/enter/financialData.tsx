import {Button, DatePicker, Input, List, Modal, Pagination, Select, Space, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";

const FinancialData=(props:any)=>{
    const [page,setPage]=useState(1);
    const [billAbstract,setBillAbstract]=useState('');
    const [billBgeinTime,setBillBgeinTime]=useState('2000-01-01');
    const [billEndTime,setBillEndTime]=useState('2099-01-01');
    const [billStatus,setBillStatus]=useState(2);
    const [billMoneyType,setBillMoneyType]=useState(2);
    const columns =[
        {
            title: '日期',
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
            title: '编号',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: '摘要',
            dataIndex: 'billAbstract',
            key: 'billAbstract',
        },
        {
            title: '公司',
            dataIndex: 'company_name',
            key: 'company_name',
        },
        {
            title: '项目',
            dataIndex: 'project_name',
            key: 'project_name',
        },
        {
            title: '科目',
            dataIndex: 'subject_name',
            key: 'subject_name',
        },
        {
            title: '账户',
            dataIndex: 'account_name',
            key: 'account_name',
        },
        {
            title: '收入/支出',
            dataIndex: 'money_type',
            key: 'money_type',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.money_type==1?<Tag color="red">支出</Tag>:<Tag color="green">收入</Tag>}
                    </div>
                )
            }
        },
        {
            title: '收入/支出金额',
            dataIndex: 'billMoney',
            key: 'billMoney',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        <span style={{fontSize:'14px',color:'red'}}>{record.billMoney}<span style={{fontSize:'12px',color:'#555'}}>元</span></span>
                    </div>
                )
            }
        },
        {
            title: '余额',
            dataIndex: 'balance',
            key: 'balance',
            render:(text:any,record:any,)=>{
                return(
                    <Space>
                        <span style={{fontWeight:700}}>{record.balance}</span><span>(元)</span>
                    </Space>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'bill_status',
            key: 'bill_status',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.bill_status==0?<Tag color="red">未审核</Tag>:<Tag color="green">已审核</Tag>}
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
                    <div>
                        {
                            record.bill_status==0?
                                <Space>
                                    <Button type='link' onClick={()=>toInfo(record.id)}>详情</Button>
                                    <Button type='link' onClick={()=>toedit(record.id)}>编辑</Button>
                                </Space>:
                                <>
                                    <Button type='link' onClick={()=>toInfo(record.id)}>详情</Button>
                                </>
                        }
                    </div>
                )
            }
        },

    ];
    const toadd=()=>{
        history.push('/enter/addFinancialData')
    };
    const toInfo=(id:number)=>{
        history.push(`/enter/financialDataInfo?id=${id}`)
    };
    const toedit=(id:number)=>{
        history.push(`/enter/editFinancialData?id=${id}`)
    };
    // 监听摘要名称
    const changeName=(e)=>{
        setBillAbstract(e.target.value);
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        props.dispatch({
            type:'Bill/fenye',
            payload:{billAbstract,billBgeinTime,billEndTime,billStatus,billMoneyType}
        });
        logFenye();
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Bill/fetch",
            payload:{page,billAbstract,billBgeinTime,billEndTime,billStatus,billMoneyType}
        })
    };
    // 监听页数
    const onChange=(e:number)=>{
        setPage(e);
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setBillBgeinTime('2000-01-01');
            setBillEndTime('2099-01-01');
        } else {
            setBillBgeinTime(data[0]);
            setBillEndTime(data[1]);
        }
    };
    // 监听类型
    const changeType=(e:number)=>{
        setBillMoneyType(e);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setBillStatus(e);
    };
    useEffect(() => {
        console.log(props)
        logFenye();
    }, [page]);
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            财务数据录入
                        </Button>
                    </div>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="摘要:"
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
                                类型:
                            </div>
                            <Select
                                onChange={changeType}
                                defaultValue={billMoneyType}
                                style={{ width: 120 }}
                                options={[
                                    { value: 1, label: '支出' },
                                    { value: 0, label: '收入' },
                                    { value: 2, label: '全部' },
                                ]}
                            />
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
                                defaultValue={billStatus}
                                style={{ width: 120 }}
                                options={[
                                    { value: 0, label: '未审核' },
                                    { value: 1, label: '已审核' },
                                    { value: 2, label: '全部' },
                                ]}
                            />
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <div style={{maxHeight:'60vh',overflow:'auto',border:'1px solid #ddd'}}>
                <Table
                    columns={columns}
                    style={{border:'1px solid #ddd',borderRadius:'4px'}}
                    pagination={false}
                    rowKey={(columns) => columns.id}
                    dataSource={props.BillList}
                    size='small'
                />
            </div>
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        BillList: state.Bill.list,
        count: state.Bill.count,
    }
};
export default connect(mapStateToProps) (FinancialData)