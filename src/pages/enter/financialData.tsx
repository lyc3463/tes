import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import {processBills} from '@/utils/OpenTool';
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
const FinancialData=(props:any)=>{
    // 展示total
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 账单列表
    const [billList,setBillList]=useState([]);
    // 摘要
    const [billAbstract,setBillAbstract]=useState(sessionStorage.getItem('enterFinancialDataBillAbstract')||'');
    // 开始时间
    const [billBgeinTime,setBillBgeinTime]=useState(sessionStorage.getItem('enterFinancialDataBillBgeinTime')||'2000-01-01');
    // 结束时间
    const [billEndTime,setBillEndTime]=useState(sessionStorage.getItem('enterFinancialDataBillBillEndTime')||'2099-01-01');
    // 账单状态
    const [billStatus,setBillStatus]=useState(2);
    // 财务类型
    const [billMoneyType,setBillMoneyType]=useState(2);
    // 所属公司
    const [companyId,setCompanyId]=useState(0);
    // 所属项目
    const [projectId,setProjectId]=useState(0);
    // 所属科目
    const [subjectId,setSubjectId]=useState(0);
    // 下拉公司列表
    const [companyList,setCompanyList]=useState([]);
    // 下拉科目列表
    const [subjList,setSubjList]=useState([]);
    // 下拉项目列表
    const [projectlist,setProjectlist]=useState([]);
    const [uid,setUid]=useState(0);
    // 账户卡号
    const [account_card,setaccount_card]=useState(sessionStorage.getItem('enterFinancialDataAccountCard')||'');
    const [isOpen,setIsOpen]=useState(false);
    const [spinning,setspinning]=useState(false);
    // 用户权限
    const [uqx,setUqx]=useState([]);
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
            title: '摘要',
            dataIndex: 'billAbstract',
            key: 'billAbstract',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        {record.billAbstract}
                    </div>
                )
            }
        },
        {
            title: '公司',
            dataIndex: 'company_name',
            key: 'company_name',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        {record.company_name}
                    </div>
                )
            }
        },
        {
            title: '项目',
            dataIndex: 'project_name',
            key: 'project_name',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        {record.project_name}
                    </div>
                )
            }
        },
        {
            title: '账户',
            dataIndex: 'account_name',
            key: 'account_name',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        {record.account_name}
                    </div>
                )
            }
        },
        {
            title: '账户卡号',
            dataIndex: 'account_card',
            key: 'account_card',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        {record.account_card}
                    </div>
                )
            }
        },
        {
            title: '科目',
            dataIndex: 'subject_name',
            key: 'subject_name',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        {record.subject_name}
                    </div>
                )
            }
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
                        {/*{getRdc(record.balance)}*/}
                        {
                            record.bill_status==0?<>
                                <span style={{fontWeight:700}}>{(record.accountBalance).toFixed(2)}</span><span>(元)</span>
                            </>:<>
                                <span style={{fontWeight:700}}>{(record.balance).toFixed(2)}</span><span>(元)</span>
                            </>
                        }

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
                                    <Button type='primary' onClick={()=>toInfo(record.id)}>详情</Button>
                                    {uqx[200]=='1'?<Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button>:''}
                                    {uqx[201]=='1'?<Button type='primary' danger onClick={()=>isdelete(record.id)}>删除</Button>:''}
                                </Space>:
                                <>
                                    <Button type='primary' onClick={()=>toInfo(record.id)}>详情</Button>
                                </>
                        }
                    </div>
                )
            }
        },
    ];
    const toadd=()=>{
        history.push('/enter/addFinancialData');
    };
    const toInfo=(id:number)=>{
        history.push(`/enter/financialDataInfo?id=${id}`);
    };
    const toedit=(id:number)=>{
        history.push(`/enter/editFinancialData?id=${id}`);
    };
    // 监听摘要名称
    const changeName=(e)=>{
        setBillAbstract(e.target.value);
        sessionStorage.setItem('enterFinancialDataBillAbstract',e.target.value);
    };
    // 获取分页信息
    const getBillFenye=()=>{
        props.dispatch({
            type:'Bill/fenye',
            payload:{billAbstract,billBgeinTime,billEndTime,billStatus,billMoneyType,companyId,projectId,subjectId,account_card,pageSize}
        });
    }
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getBillFenye();
        logFenye();
    };
    // 分页
    const logFenye=()=>{
        setspinning(true);
        props.dispatch({
            type:"Bill/fetch",
            payload:{page,billAbstract,billBgeinTime,billEndTime,billStatus,billMoneyType,companyId,projectId,subjectId,account_card,pageSize}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let newdata=processBills(res.Data);
                setBillList(res.Data);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    // 录入数据不分页
    const isduizhang=()=>{
        setspinning(true);
        props.dispatch({
            type:"Bill/fetchNo",
            payload:{page,billAbstract,billBgeinTime,billEndTime,billMoneyType,companyId,projectId,subjectId,account_card}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let newdata=processBills(res.Data);
                setBillList(res.Data);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
        getBillFenye();
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setBillBgeinTime('2000-01-01');
            setBillEndTime('2099-01-01');
            sessionStorage.setItem('enterFinancialDataBillBgeinTime','2000-01-01');
            sessionStorage.setItem('enterFinancialDataBillBillEndTime','2099-01-01');
        } else {
            setBillBgeinTime(data[0]);
            setBillEndTime(data[1]);
            sessionStorage.setItem('enterFinancialDataBillBgeinTime',data[0]);
            sessionStorage.setItem('enterFinancialDataBillBillEndTime',data[1]);
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
        logFenye();
    }, [page,pageSize]);
    useEffect(() => {
        getBillFenye();
    }, []);

// 获取公司列表
    const getCompanList=()=>{
        props.dispatch({
            type:'Compan/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                conterCompay(res.Data)
            }else {
                conterCompay([])
            }
        })
    };
    // 获取项目列表
    const getProjectList=()=>{
        props.dispatch({
            type:'Project/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                conterproject(res.Data);
            }else {
                conterproject([]);
            }
        });
    };
    // 获取科目列表
    const getSubjectList=()=>{
        props.dispatch({
            type:'Subject/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                contersubj(res.Data);
            }else {
                contersubj([]);
            }
        });
    };
    // 监听公司id
    const changeCompany=(e:number)=>{
        setCompanyId(e);
        ChangeProjectList(e);
    };
    // 监听项目id
    const changeProject=(e:number)=>{
        setProjectId(e);
    };
    // 监听项目id
    const changeSubject=(e:number)=>{
        setSubjectId(e);
    };
    // 公司拼接
    const conterCompay=(item)=>{
        let oldarr=[ {label:'全部',value:0}];
        let newarr=item.map((item:any)=>{
            return {
                label:item.company_name,
                value:item.id
            }
        });
        setCompanyList(oldarr.concat(newarr));
    };
    // 项目拼接
    const conterproject=(item)=>{
        let oldarr=[ {label:'全部',value:0}];
        let newarr=item.map((item:any)=>{
            return {
                label:item.project_name,
                value:item.id
            }
        });
        setProjectlist(oldarr.concat(newarr));
    };
    // 科目拼接
    const contersubj=(item)=>{
        let oldarr=[ {label:'全部',value:0}];
        let newarr=item.map((item:any)=>{
            return {
                label:item.subject_name,
                value:item.id
            }
        });
        setSubjList(oldarr.concat(newarr));
    };
    // 删除
    const isdelete=(e)=>{
      setUid(e);
      setIsOpen(true)
    };
    // 弹窗OK
    const onOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'Bill/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
              setspinning(false);
              message.success('删除成功');
              setIsOpen(false);
              logFenye();
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        });
    };
    const ChangeProjectList=(e:number)=>{
        props.dispatch({
            type:'Project/fetch',
            payload:{name:'',companyId:e,pageSize:1000}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                conterproject(res.Data);
            }else {
                conterproject([]);
            }
        });
    };
    useEffect(() => {
        getProjectList();
        getCompanList();
        getSubjectList();
    }, []);
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const changeAccount_card=(e)=>{
        setaccount_card(e.target.value);
        sessionStorage.setItem('enterFinancialDataAccountCard',e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        {uqx[199]=='1'?<Button type="primary" onClick={toadd}>财务数据录入</Button>:''}
                    </Space>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="摘要:"
                            value={billAbstract}
                        />
                        <Input
                            onChange={changeAccount_card}
                            addonBefore="账户卡号:"
                            value={account_card}
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
                            {billBgeinTime=='2000-01-01'&&billEndTime=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(billBgeinTime),dayjs(billEndTime)]}/>}
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
                        <Button type="primary" onClick={isduizhang}>
                            对账
                        </Button>
                    </Space>
                </List.Item>
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
                                公司:
                            </div>
                            <Select
                                onChange={changeCompany}
                                defaultValue={companyId}
                                style={{ width: 240 }}
                                options={companyList}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    // 假设每个 option 都有一个与数据项对应的 value 属性
                                    const item = companyList.find(unit => unit.value == option.value);
                                    return item?.label?.toLowerCase().includes(input.toLowerCase());
                                }}
                            >
                            </Select>
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
                                项目:
                            </div>
                            <Select
                                onChange={changeProject}
                                defaultValue={projectId}
                                style={{ width: 250 }}
                                options={projectlist}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    // 假设每个 option 都有一个与数据项对应的 value 属性
                                    const item = projectlist.find(unit => unit.value == option.value); // 您可能需要优化这个查找过程
                                    return item?.label?.toLowerCase().includes(input.toLowerCase());
                                }}
                            >
                            </Select>
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
                                科目:
                            </div>
                            <Select
                                onChange={changeSubject}
                                defaultValue={subjectId}
                                style={{ width: 250 }}
                                options={subjList}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    // 假设每个 option 都有一个与数据项对应的 value 属性
                                    const item = subjList.find(unit => unit.value == option.value);
                                    return item?.label?.toLowerCase().includes(input.toLowerCase());
                                }}
                            >
                            </Select>
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
                <Table
                    columns={columns}
                    style={{border:'1px solid #ddd',borderRadius:'4px'}}
                    pagination={false}
                    scroll={{y:'60vh'}}
                    rowKey={(columns) => columns.id}
                    dataSource={billList}
                    size='small'
                    summary={(columns) => (
                      <Table.Summary fixed>
                        <Table.Summary.Row>
                          <Table.Summary.Cell
                            index={1}
                          >
                              统计
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={0}>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={0}>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={0}>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={0}>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={0}>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={0}>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={0}>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell
                            index={8}
                          >
                              {props.count?props.count.moneySum:''}元
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )}
                />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal open={isOpen} onCancel={()=>setIsOpen(false)} onOk={onOK}>
                <div>是否要删除？</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        BillList: state.Bill.list,
        count: state.Bill.count,
    }
};
export default connect(mapStateToProps) (FinancialData)