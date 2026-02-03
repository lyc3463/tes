import {
    Button,
    DatePicker,
    Form,
    Input,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Tooltip
} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import * as StaffService from '@/services/staff';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const ZsContract=(props:any)=>{
    const [isDeltOpen,setIsDeleteOpen]=useState(false);
    const [uid,setUid]=useState(0);
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 审核状态 0全部  1未审核 2已审核
    const [contractStatus,setContractStatus]=useState(0);
    // 合同编号
    const [identifier,setIdentifier]=useState(checkSessionStorage('/enter/staff/','identifier')||'');
    // 合同类型
    const [contractType,setContractType]=useState(0);
    // 开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/enter/staff/','startDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/enter/staff/','endDate')||'2099-01-01');
    // 租户姓名
    const [name,setName]=useState(checkSessionStorage('/enter/staff/','name')||'');
    // 列表
    const [staffList,setStaffList]=useState([]);
    // 转圈
    const [spinning,setspinning]=useState(false);
    // 总页码
    const [count,setcount]=useState(0);
    // 租金总数
    const [zuMoney,setzuMoney]=useState(0);
    // 合同押金
    const [deposit,setdeposit]=useState(0);
    // 预付费
    const [prepayment,setprepayment]=useState(0);
    // 管理费押金
    const [depositFee,setdepositFee]=useState(0);
    // 管理费
    const [manageFee,setmanageFee]=useState(0);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns =[
        {
            title: '合同编号',
            dataIndex: 'identifier',
            key: 'identifier',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.identifier}>
                            {record.identifier}
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '租户',
            dataIndex: 'customName',
            key: 'customName',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.customName}>
                            {record.customName}
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '起租日',
            dataIndex: 'beginTime',
            key: 'beginTime',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {dayjs(record.beginTime).format("YYYY-MM-DD")}
                    </div>
                )
            }
        },
        {
            title: '到期日',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {dayjs(record.endTime).format("YYYY-MM-DD")}
                    </div>
                )
            }
        },
        {
            title: '租金(元)',
            dataIndex: 'zuMoney',
            key: 'zuMoney',
        },
        {
            title: '合同押金(元)',
            dataIndex: 'deposit',
            key: 'deposit',
        },
        {
            title: '管理费(元)',
            dataIndex: 'manageFee',
            key: 'manageFee',
        },
        {
            title: '预付费(元)',
            dataIndex: 'prepayment',
            key: 'prepayment',
        },
        {
            title: '管理费押金(元)',
            dataIndex: 'depositFee',
            key: 'depositFee',
        },
        {
            title: '合同类型',
            dataIndex: 'contractType',
            key: 'contractType',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.templateType==1?<Tag color='cyan'>定金合同</Tag>:<Tag color='purple'>正式合同</Tag>}
                    </div>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'contractStatus',
            key: 'contractStatus',
            render: (text:any, record:any) => {
                let consumptionTypeText;
                switch (record.contractStatus) {
                    case 1:
                        consumptionTypeText = <Tag color='blue'>未审核</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag color='green'>已审核</Tag>;
                        break;
                    case 3:
                        consumptionTypeText = <Tag color='red'>退租</Tag>;
                        break;
                    case 4:
                        consumptionTypeText = <Tag color='orange'>续租</Tag>;
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
            title: '下载',
            dataIndex: 'zuMoney',
            key: 'zuMoney',
            render: (text:any, record:any) => {
                return(
                    <Space>
                        <Button type='primary' onClick={()=>{toxiazai(record)}}>下载</Button>
                    </Space>
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
                        {record.contractStatus==1||record.contractStatus==4?
                            <>
                                {uqx[205]=='1'?<Button type='primary' onClick={()=>toedit(record)}>编辑</Button> :''}
                                {uqx[207]=='1'?<Button type='primary' danger onClick={()=>isdelete(record.id)}>删除</Button>:''}

                                <Button type='primary' onClick={()=>toInfo(record)}>详情</Button>
                            </>:
                            <Button type='primary' onClick={()=>{toxiazai(record)}}>详情</Button>
                        }
                    </Space>
                )
            }
        },
    ];
    const toadd=()=>{
        history.push('/enter/addStaff/');
    };
    // 去详情页面
    const toInfo=(e:any)=>{
        if (e.templateType==1){
            history.push(`/check/dingjinInfo?id=${e.id}`);
        }else if (e.templateType==2){
            history.push(`/check/contracteInfo?id=${e.id}`);
        }
    };
    // 编辑
    const toedit=(e:any)=>{
        if (e.templateType==1){
            history.push(`/enter/editDjContract?id=${e.id}`);
        }else if (e.templateType==2){
            history.push(`/enter/editStaff?id=${e.id}`);
        }
    };
    // 删除弹窗
    const isdelete=(e:number)=>{
        setUid(e);
        setIsDeleteOpen(true);
    };
    // 确定删除按钮
    const onOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'Staff/remove',
            payload:uid
        }).then((res)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setIsDeleteOpen(false);
                setspinning(false);
                logFenye();
                getListFenye();
            }else {
                message.error(res.Data);
                setIsDeleteOpen(false);
                setspinning(false);
            }
        })
    };
    // 分页信息
    const getListFenye=()=>{
        setspinning(true);
        StaffService.getHTfFy({identifier,contractType,contractStatus,startDate,endDate,name,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setzuMoney(res.Data.zuMoney);
                setdeposit(res.Data.deposit);
                setprepayment(res.Data.prepayment);
                setdepositFee(res.Data.depositFee);
                setmanageFee(res.Data.manageFee);
                setspinning(false);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getListFenye();
        logFenye();
    };
    // 分页
    const logFenye=()=>{
        setspinning(true);
        StaffService.getHT({page,identifier,contractType,contractStatus,startDate,endDate,name,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setStaffList(res.Data);
                setspinning(false);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        getListFenye();
    }, []);
    useEffect(() => {
        logFenye();
    }, [page]);
    // 监听合同编号
    const changeIdentifier=(e)=>{
        setIdentifier(e.target.value);
        updateSessionStorage('/enter/staff/','identifier',e.target.value);
    };
    // 合同类型
    const changeType=(e:any)=>{
        setContractType(e);
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/enter/staff/','startDate','2000-01-01');
            updateSessionStorage('/enter/staff/','endDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/enter/staff/','startDate',data[0]);
            updateSessionStorage('/enter/staff/','endDate',data[1]);
        }
    };
    // 下载页面
    const toxiazai=(e)=>{
        if (e.contractStatus==1&&e.templateType==1){
            history.push(`/check/nocheckDJcontractez?id=${e.id}`);
        }else if (e.contractStatus==1&&e.templateType==2){
            history.push(`/check/nocheckZScontractez?id=${e.id}`);
        } else if (e.templateType==2){
            history.push(`/check/contractez?id=${e.id}`);
        }else {
            history.push(`/check/checkdingjin?id=${e.id}`);
        }
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/enter/staff/','name',e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <div>
                        {uqx[204]=='1'?<Button type="primary" onClick={toadd}>合同录入</Button>:''}
                    </div>
                    <Space>
                        <Input
                            onChange={changeIdentifier}
                            addonBefore="合同编号:"
                            value={identifier}
                        />
                        <Input
                            onChange={changeName}
                            addonBefore="租户姓名:"
                            value={name}
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
                                    flexWrap:'wrap',
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                }}
                            >
                                到期日:
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
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                columns={columns}
                size='small'
                scroll={{y:'60vh'}}
                pagination={false}
                rowKey={(columns) => columns.id}
                dataSource={staffList}
                summary={(columns) => (
                    <Table.Summary >
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={1}>统计</Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                            <Table.Summary.Cell index={4}>{zuMoney.toFixed(2)}元</Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>{deposit.toFixed(2)}元</Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>{manageFee.toFixed(2)}元</Table.Summary.Cell>
                            <Table.Summary.Cell index={7}>{prepayment.toFixed(2)}元</Table.Summary.Cell>
                            <Table.Summary.Cell index={8}>{depositFee.toFixed(2)}元</Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            <Pagination total={count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>
            <Modal open={isDeltOpen} onCancel={()=>setIsDeleteOpen(false)} title='删除合同' onOk={onOk}>
                <div>确定要删除吗？</div>
            </Modal>
        </Spin>
    )
}
// const mapStateToProps = (state: any) => {
//     return {
//         StaffList: state.Staff.list,
//         // count: state.Staff.count,
//     }
// };
export default connect() (ZsContract)