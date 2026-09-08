import {connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {Button, DatePicker, Input, List, message, Pagination, Select, Space, Spin, Table, Tag, Tooltip} from "antd";
import {checkSessionStorage, exportDataToExcel, updateSessionStorage} from "@/utils/OpenTool";
import * as NewBillSumService from '@/services/newBillSum';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const NewBillSum=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);
    const [numBerOrder,setNumBerOrder]=useState(checkSessionStorage('/financeManage/billSum/','newBillNumBerOrder')||'');
    const [company_name,setCompany_name]=useState(checkSessionStorage('/financeManage/billSum/','newBillCompany_name')||'');
    const [account_card,setAccount_card]=useState(checkSessionStorage('/financeManage/billSum/','newBillAccount_card')||'');
    const [project_name,setProject_name]=useState(checkSessionStorage('/financeManage/billSum/','newBillProject_name')||'');
    const [startDate,setStartDate]=useState(checkSessionStorage('/financeManage/billSum/','newBillStartDate')||'2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStorage('/financeManage/billSum/','newBillEndDate')||'2099-01-01');
    const [moneyType,setMoneyType]=useState(Number(checkSessionStorage('/financeManage/billSum/','newBillMoneyType'))||0);
    const [pageSize,setPageSize]=useState(50);
    const [foType,setFoType]=useState(Number(checkSessionStorage('/financeManage/billSum/','newBillFoType'))||0);
    const [subjectName,setSubjectName]=useState(checkSessionStorage('/financeManage/billSum/','newBillSubjectName')||'');
    // 获取列表
    const getList=()=>{
        props.dispatch({
            type:'NewBillSum/fetch',
            payload:{page, numBerOrder, company_name, account_card, project_name, startDate, endDate, moneyType, pageSize,foType,subjectName}
        })
    };

    useEffect(() => {
        getList();
    }, [page,pageSize]);
    const columns =[
        {
            title: '日期',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.orderDate).format('YYYY-MM-DD')}
                    </div>
                )
            }
        },
        {
            title: '账单类型',
            dataIndex: 'foType',
            key: 'foType',
            render: (text: any) => {
                const map: any = {
                    1: { color: 'blue', label: '报销' },
                    2: { color: 'green', label: '财务单' },
                };
                const current = map[text] || { color: 'default', label: '未知' };
                return (
                    <Tag color={current.color}>
                        {current.label}
                    </Tag>
                );
            }
        },
        {
            title: '所属单号',
            dataIndex: 'number',
            key: 'number',
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
            title: '科目',
            dataIndex: 'subjectName',
            key: 'subjectName',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.subjectName}>
                            {record.subjectName}
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '摘要',
            dataIndex: 'summary',
            key: 'summary',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.summary}>
                            {record.summary}
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '支付类型',
            dataIndex: 'moneyType',
            key: 'moneyType',
            render: (text: any) => {
                const map: any = {
                    1: { color: 'green', label: '收入' },
                    2: { color: 'red', label: '支出' },
                    3: { color: 'blue', label: '报销' },
                };
                const current = map[text] || { color: 'default', label: '未知' };
                return (
                    <Tag color={current.color}>
                        {current.label}
                    </Tag>
                );
            }
        },
        {
            title: '收入/支出金额',
            dataIndex: 'amount',
            key: 'amount',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        <span style={{fontSize:'14px',color:'red'}}>{record.amount}<span style={{fontSize:'12px',color:'#555'}}>元</span></span>
                    </div>
                )
            }
        },
    ];
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const changeNumberOrder=(e:any)=>{
        setNumBerOrder(e.target.value);
        updateSessionStorage('/financeManage/billSum/','newBillNumBerOrder',e.target.value);
    };
    const changeCompany_name=(e:any)=>{
        setCompany_name(e.target.value);
        updateSessionStorage('/financeManage/billSum/','newBillCompany_name',e.target.value);
    };
    const changeProject_name=(e:any)=>{
        setProject_name(e.target.value);
        updateSessionStorage('/financeManage/billSum/','newBillProject_name',e.target.value);
    };
    const changeAccount_card=(e:any)=>{
        setAccount_card(e.target.value);
        updateSessionStorage('/financeManage/billSum/','newBillAccount_card',e.target.value);
    };
    const changeSubjectName=(e:any)=>{
        setSubjectName(e.target.value);
        updateSessionStorage('/financeManage/billSum/','newBillSubjectName',e.target.value);
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/financeManage/billSum/','newBillStartDate','2000-01-01');
            updateSessionStorage('/financeManage/billSum/','newBillEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/financeManage/billSum/','newBillStartDate',data[0]);
            updateSessionStorage('/financeManage/billSum/','newBillEndDate',data[1]);
        }
    };
    // 监听类型
    const changeMoneyType=(e:number)=>{
        setMoneyType(e);
        updateSessionStorage('/financeManage/billSum/','newBillMoneyType',e);
    };
    // 监听财务单类型
    const changeFoType=(e:number)=>{
        setFoType(e);
        updateSessionStorage('/financeManage/billSum/','newBillFoType',e);
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getList();
    };
    const getDcList=async ()=>{
        setSpinning(true);
        try {
            const res:TypeErrorCode = await NewBillSumService.fetch({page, numBerOrder, company_name, account_card, project_name, startDate, endDate, moneyType, pageSize:1000,foType,subjectName});
            if (res.ErrorCode==0){
                console.log(res.Data);
                let headers=['日期','单号','公司','项目','账户','账户卡号','科目','摘要','收入/支持','金额'];
                const ws_data = [
                    headers.map(header => ({ v: header, t: 's' })), // 表头
                    ...res.Data.data.map(item => [
                        (dayjs(item.orderDate).format('YYYY-MM-DD')), // 提取日期部分
                        item.number,
                        item.company_name,
                        item.project_name,
                        item.account_name,
                        item.account_card,
                        item.subjectName,
                        item.summary,
                        item.moneyType === 1 ? '支出' : '收入',
                        item.amount,
                    ].map(value => ({ v: value, t: typeof value === 'number' ? 'n' : 's' }))),
                    [
                        { v: '总计', t: 's' },
                        { v: '', t: 's' },
                        { v: '', t: 's' },
                        { v: '', t: 's' },
                        { v: '', t: 's' },
                        { v: '', t: 's' },
                        { v: '', t: 's' },
                        { v: '', t: 's' },
                        { v: '', t: 's' },
                        { v: res.Data.amountSum!=null?Number(res.Data.amountSum).toFixed(2):'', t: 'n' },
                        { v: '', t: 's' },
                    ]
                ];
                exportDataToExcel(ws_data);
            }else {
                message.error(res.Data);
            }
        } catch (error) {
            console.error('导出失败:', error);
            message.error('导出失败，请重试');
        } finally {
            setSpinning(false);
        }
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={changeNumberOrder}
                            addonBefore="单号:"
                            value={numBerOrder}
                        />
                        <Input
                            onChange={changeCompany_name}
                            addonBefore="公司:"
                            value={company_name}
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
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
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
                                账单类型:
                            </div>
                            <Select
                                options={[
                                    {
                                        value: 0,
                                        label: '全部',
                                    },
                                    {
                                        value: 1,
                                        label: '报销',
                                    },
                                    {
                                        value: 2,
                                        label: '财务单',
                                    },
                                ]}
                                value={foType}
                                onChange={changeFoType}
                            />
                        </Space.Compact>
                    </Space>
                </List.Item>
                <List.Item>
                    <Space>
                        <Input
                            onChange={changeProject_name}
                            addonBefore="项目:"
                            value={project_name}
                        />
                        <Input
                            onChange={changeAccount_card}
                            addonBefore="账户卡号:"
                            value={account_card}
                        />
                        <Input
                            onChange={changeSubjectName}
                            addonBefore="科目:"
                            value={subjectName}
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
                                支付类型:
                            </div>
                            <Select
                                options={[
                                    {
                                        value: 0,
                                        label: '全部',
                                    },
                                    {
                                        value: 1,
                                        label: '收入',
                                    },
                                    {
                                        value: 2,
                                        label: '支出',
                                    },
                                    {
                                        value: 3,
                                        label: '报销',
                                    },
                                ]}
                                value={moneyType}
                                onChange={changeMoneyType}
                            />
                        </Space.Compact>

                        <Button type="primary" onClick={getDcList}>
                            导出
                        </Button>
                        <Button onClick={sousuo} type='primary'>搜索</Button>
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
                dataSource={props.list}
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
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell
                                index={7}
                            >
                                {props.count?props.count.amountSum.toFixed(2):''}元
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
        list: state.NewBillSum.list,
        count: state.NewBillSum.count,

    }
};
export default connect(mapStateToProps)(NewBillSum)
