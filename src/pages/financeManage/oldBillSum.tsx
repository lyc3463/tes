import {connect} from 'umi'
import {Button, DatePicker, Input, List, message, Pagination, Select, Space, Spin, Table, Tag, Tooltip} from "antd";
import dayjs from "dayjs";
import {history} from "@@/core/history";
import {useEffect, useState} from "react";
import {checkSessionStorage, exportDataToExcel, updateSessionStorage} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as BillService from "@/services/billSum";
import {StaticInfo} from "@/StaticInfo";
const OldBillSum=(props:any)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 账单编号
    const [billAbstract,setBillAbstract]=useState(checkSessionStorage('/financeManage/billSum/','billAbstract')||'');
    // 开始时间
    const [billBgeinTime,setBillBgeinTime]=useState(checkSessionStorage('/financeManage/billSum/','startDate')||'2000-01-01');
    // 结束时间
    const [billEndTime,setBillEndTime]=useState(checkSessionStorage('/financeManage/billSum/','endDate')||'2099-01-01');
    // 账单状态 0 未审核 1已审核 2全查
    const [billStatus,setBillStatus]=useState(1);
    // 账单类型   1支出 0收入 2全部
    const [billMoneyType,setBillMoneyType]=useState(checkSessionStorage('/financeManage/billSum/','billMoneyType')||2);
    // 公司id
    const [companyId,setCompanyId]=useState(checkSessionStorage('/financeManage/billSum/','companyId')||0);
    // 项目id
    const [projectId,setProjectId]=useState(checkSessionStorage('/financeManage/billSum/','projectId')||0);
    // 科目id
    const [subjectId,setSubjectId]=useState(checkSessionStorage('/financeManage/billSum/','subjectId')||0);
    // 公司列表
    const [companyList,setCompanyList]=useState([]);
    // 科目项目
    const [subjList,setSubjList]=useState([]);
    // 项目列表
    const [projectlist,setProjectlist]=useState([]);
    // 账户卡号
    const [account_card,setaccount_card]=useState(checkSessionStorage('/financeManage/billSum/','account_card')||'');
    const [spinning,setspinning]=useState(false);
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
                        <Tooltip title={record.billAbstract}>
                            {record.billAbstract}
                        </Tooltip>
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
                        <Tooltip title={record.company_name}>
                            {record.company_name}
                        </Tooltip>
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
                        <Tooltip title={record.project_name}>
                            {record.project_name}
                        </Tooltip>
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
                        <Tooltip title={record.subject_name}>
                            {record.subject_name}
                        </Tooltip>
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
                        <Tooltip title={record.account_name}>
                            {record.account_name}
                        </Tooltip>
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
                        <Tooltip title={record.account_card}>
                            {record.account_card}
                        </Tooltip>
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
                        <span style={{fontWeight:700}}>{(record.balance).toFixed(2)}</span><span>(元)</span>
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
                        <Button type='link' onClick={()=>toInfo(record.id)}>详情</Button>
                    </div>
                )
            }
        },
    ];
    const toInfo=(id:number)=>{
        history.push(`/enter/financialDataInfo?id=${id}`);
    };
    // 导出数据
    const getDcList=()=>{
        setspinning(true);
        BillService.fetch({page,billAbstract,billBgeinTime,billEndTime,billStatus,billMoneyType,companyId,projectId,subjectId,account_card,pageSize:100000}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let headers=['日期','编号','摘要','公司','项目','科目','收入/支出','收入/支出金额(元)','账户余额(元)'];
                const ws_data = [
                    headers.map(header => ({ v: header, t: 's' })), // 表头
                    ...res.Data.map(item => [
                        item.billDate.split('T')[0], // 提取日期部分
                        item.number,
                        item.billAbstract,
                        item.company_name,
                        item.project_name,
                        item.subject_name,
                        item.money_type === 1 ? '支出' : '收入',
                        item.billMoney,
                        item.balance
                    ].map(value => ({ v: value, t: typeof value === 'number' ? 'n' : 's' }))) // 数据行，根据值类型设置单元格类型
                ];
                exportDataToExcel(ws_data);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };

    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        getProjectList();
        getSubjectList();
        getCompanList();
        getFenyeInfo();
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setBillBgeinTime('2000-01-01');
            setBillEndTime('2099-01-01');
            updateSessionStorage('/financeManage/billSum/','startDate','2000-01-01');
            updateSessionStorage('/financeManage/billSum/','endDate','2099-01-01');
        } else {
            setBillBgeinTime(data[0]);
            setBillEndTime(data[1]);
            updateSessionStorage('/financeManage/billSum/','startDate',data[0]);
            updateSessionStorage('/financeManage/billSum/','endDate',data[1]);
        }
    };
    // 监听类型
    const changeType=(e:number)=>{
        setBillMoneyType(e);
        updateSessionStorage('/financeManage/billSum/','billMoneyType',e);
    };
    // 监听摘要名称
    const changeName=(e)=>{
        setBillAbstract(e.target.value);
        updateSessionStorage('/financeManage/billSum/','billAbstract',e.target.value);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"BillSum/fetch",
            payload:{page,billAbstract,billBgeinTime,billEndTime,billStatus,billMoneyType,companyId,projectId,subjectId,account_card,pageSize}
        })
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getFenyeInfo();
        logFenye();
    };
    const getFenyeInfo=()=>{
        props.dispatch({
            type:'BillSum/fenye',
            payload:{billAbstract,billBgeinTime,billEndTime,billStatus,billMoneyType,companyId,projectId,subjectId,account_card,pageSize}
        });
    };
    // 获取公司列表
    const getCompanList=()=>{
        props.dispatch({
            type:'Compan/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                conterCompay(res.Data);
            }else {
                conterCompay([])
            }
        })
    };
    // 获取项目列表
    const getProjectList=()=>{
        props.dispatch({
            type:'Project/fetch',
            payload:{name:'',companyId}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                conterproject(res.Data);
            }else {
                conterproject([]);
            }
        });
    };
    const ChangeProjectList=(e:number)=>{
        props.dispatch({
            type:'Project/fetch',
            payload:{name:'',companyId:e}
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
        updateSessionStorage('/financeManage/billSum/','companyId',e);
    };
    // 监听项目id
    const changeProject=(e:number)=>{
        setProjectId(e);
        updateSessionStorage('/financeManage/billSum/','projectId',e);
    };
    // 监听项目id
    const changeSubject=(e:number)=>{
        setSubjectId(e);
        updateSessionStorage('/financeManage/billSum/','subjectId',e);
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
    const changeAccountCard=(e)=>{
        setaccount_card(e.target.value);
        updateSessionStorage('/financeManage/billSum/','account_card',e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
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
                                value={companyId}
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
                                value={projectId}
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
                                value={subjectId}
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
                                value={billMoneyType}
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
                        {uqx[376]=='1'? <Button type="primary" onClick={getDcList}>
                            导出
                        </Button>:''}
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                size='small'
                scroll={{y:'65vh'}}
                rowKey={(columns) => columns.id}
                dataSource={props.BillSumList}
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
                                index={7}
                            >
                                {props.count?props.count.moneySum.toFixed(2):''}元
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        BillSumList: state.BillSum.list,
        count: state.BillSum.count,
        CompanList: state.Compan.list,
        SubjectList: state.Subject.list,
        ProjectList: state.Project.list,
    }
};
export default connect(mapStateToProps) (OldBillSum)