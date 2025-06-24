import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import dayjs from "dayjs";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, processBills, updateSessionStorage} from "@/utils/OpenTool";
import {StaticInfo} from "@/StaticInfo";

const CheckFinance=(props:any)=>{
    // 展示total
    const [isfenye,setisfenye]=useState(true);
    // 唯一id
    const [uid,setUid]=useState(0);
    // 审核弹窗
    const [isOpen,setIsOpen]=useState(false);
    // 页码
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 摘要
    const [billAbstract,setBillAbstract]=useState(checkSessionStorage('/check/checkFinance/','billAbstract')||'');
    // 开始时间
    const [billBgeinTime,setBillBgeinTime]=useState(checkSessionStorage('/check/checkFinance/','startDate')||'2000-01-01');
    // 结束时间
    const [billEndTime,setBillEndTime]=useState(checkSessionStorage('/check/checkFinance/','endDate')||'2099-01-01');
    // 状态  0 未审核  1已审核  2全部
    const [billStatus,setBillStatus]=useState(checkSessionStorage('/check/checkFinance/','status')||2);
    // 类型   1 支出  2全部  0收入
    const [billMoneyType,setBillMoneyType]=useState(checkSessionStorage('/check/checkFinance/','billMoneyType')||2);
    // 公司ID
    const [companyId,setCompanyId]=useState(checkSessionStorage('/check/checkFinance/','companyId')||0);
    // 项目ID
    const [projectId,setProjectId]=useState(checkSessionStorage('/check/checkFinance/','projectId')||0);
    // 科目ID
    const [subjectId,setSubjectId]=useState(checkSessionStorage('/check/checkFinance/','subject')||0);
    // 公司列表
    const [companyList,setCompanyList]=useState([]);
    // 科目列表
    const [subjList,setSubjList]=useState([]);
    // 项目列表
    const [projectlist,setProjectlist]=useState([]);
    // 加载转圈
    const [spinning,setspinning]=useState(false);
    // 账户卡号
    const [account_card,setaccount_card]=useState(checkSessionStorage('/check/checkFinance/','account_card')||'');
    // 财务账单列表
    const [billList,setBillList]=useState([]);
    // 一键审核弹窗
    const [allOpen,setAllOpen]=useState(false);
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
            title: '账户名称',
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
                                    {uqx[202]=='1'?<Button type='primary' onClick={()=>checkOpen(record.id)}>审核通过</Button> :''}
                                    {uqx[200]=='1'?<Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button> :''}
                                    <Button type='primary' onClick={()=>toInfo(record.id)}>详情</Button>
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
    // 监听状态
    const changeStutes=(e:number)=>{
        setBillStatus(e);
        updateSessionStorage('/check/checkFinance/','status',e);
    };
    // 详情页面
    const toInfo=(id:number)=>{
        history.push(`/enter/financialDataInfo?id=${id}`)
    };
    // 编辑页面
    const toedit=(id:number)=>{
        history.push(`/enter/editFinancialData?id=${id}`)
    };
    // 审核弹窗
    const checkOpen=(id:number)=>{
        setUid(id);
        setIsOpen(true);
    };
    // 确定审核提交
    const openOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'Bill/check',
            payload:uid,
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                message.success('审核通过');
                setIsOpen(false);
                logFenye();
            }else {
                message.error(res.Data);
                setIsOpen(false);
                setspinning(false);
            }
        })
    };
    // 监听摘要名称
    const changeName=(e)=>{
        setBillAbstract(e.target.value);
        updateSessionStorage('/check/checkFinance/','billAbstract',e.target.value);
    };
    // 搜索
    const sousuo=()=>{
        setisfenye(true);
        setPage(1);
        getBillFenye();
        logFenye();
    };
    // 分页信息
    const getBillFenye=()=>{
        props.dispatch({
            type:'Bill/fenye',
            payload:{billAbstract,billBgeinTime,billEndTime,billStatus,billMoneyType,companyId,projectId,subjectId,account_card,pageSize}
        });
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Bill/fetch",
            payload:{page,billAbstract,billBgeinTime,billEndTime,billStatus,billMoneyType,companyId,projectId,subjectId,account_card,pageSize}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let newdata=processBills(res.Data);
                setBillList(res.Data);
            }
        })
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
            updateSessionStorage('/check/checkFinance/','startDate','2000-01-01');
            updateSessionStorage('/check/checkFinance/','endDate','2099-01-01');
        } else {
            setBillBgeinTime(data[0]);
            setBillEndTime(data[1]);
            updateSessionStorage('/check/checkFinance/','startDate',data[0]);
            updateSessionStorage('/check/checkFinance/','endDate',data[1]);
        }
    };
    // 监听类型
    const changeType=(e:number)=>{
        setBillMoneyType(e);
        updateSessionStorage('/check/checkFinance/','billMoneyType',e);
    };
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
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    useEffect(() => {
        getProjectList();
        getSubjectList();
        getCompanList();
    }, []);
    // 监听公司id
    const changeCompany=(e:number)=>{
        setCompanyId(e);
        updateSessionStorage('/check/checkFinance/','companyId',e);

    };
    // 监听项目id
    const changeProject=(e:number)=>{
        setProjectId(e);
        updateSessionStorage('/check/checkFinance/','projectId',e);

    };
    // 监听项目id
    const changeSubject=(e:number)=>{
        setSubjectId(e);
        updateSessionStorage('/check/checkFinance/','subject',e);
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
    // 一键审核弹窗
    const allCheck=()=>{
        setAllOpen(true);
    };
    // 确定一键审核
    const allOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'Bill/allCheck',
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('一键审核通过');
                setAllOpen(false);
                setspinning(false);
                logFenye();
            }else {
                message.error(res.Data);
                setAllOpen(false);
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
                setisfenye(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
        getBillFenye();
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    useEffect(() => {
        getBillFenye();
    }, []);
    const changeAccountCard=(e)=>{
        setaccount_card(e.target.value);
        updateSessionStorage('/check/checkFinance/','account_card',e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Button type="primary" onClick={isduizhang}>
                            对账
                        </Button>
                        <Input
                            onChange={changeName}
                            style={{ width: 300 }}
                            addonBefore="摘要:"
                            value={billAbstract}

                        />
                        <Input
                            onChange={changeAccountCard}
                            style={{ width: 300 }}
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
                                状态:
                            </div>
                            <Select
                                onChange={changeStutes}
                                value={billStatus}
                                style={{ width: 120 }}
                                options={[
                                    { value: 0, label: '未审核' },
                                    { value: 1, label: '已审核' },
                                    { value: 2, label: '全部' },
                                ]}
                            />
                        </Space.Compact>
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
                                style={{ width: 240 }}
                                options={projectlist}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    // 假设每个 option 都有一个与数据项对应的 value 属性
                                    const item = projectlist.find(unit => unit.value == option.value);
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
                                style={{ width: 240 }}
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
                        <Button type="primary"  onClick={sousuo}>
                            搜索
                        </Button>
                        {uqx[202]=='1'?<Button type="primary" danger  onClick={allCheck}>一键审核</Button> :''}
                    </Space>
                </List.Item>
            </List>
                <Table
                    columns={columns}
                    style={{border:'1px solid #ddd',borderRadius:'4px'}}
                    pagination={false}
                    size='small'
                    scroll={{y:'60vh'}}
                    rowKey={(columns) => columns.id}
                    dataSource={billList}
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
            {/*    审核通过弹窗*/}
            <Modal open={isOpen} onOk={openOk} onCancel={()=>setIsOpen(false)} loading={spinning}>
                <div>
                    确定要审核通过吗？
                </div>
            </Modal>
        {/*    一键审核弹窗*/}
            <Modal open={allOpen} onOk={allOk} onCancel={()=>setAllOpen(false)} loading={spinning}>
                <div>是否一键审核？</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        BillList: state.Bill.list,
        count: state.Bill.count
    }
};
export default connect(mapStateToProps) (CheckFinance)