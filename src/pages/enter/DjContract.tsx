import {useEffect, useState} from "react";
import * as StaffService from '@/services/staff';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {history} from "umi";

const DjContract=()=>{
    const [isDeltOpen,setIsDeleteOpen]=useState(false);
    const [uid,setUid]=useState(0);
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 审核状态 0全部  1未审核 2已审核
    const [contractStatus,setContractStatus]=useState(1);
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    // 租户姓名
    const [name,setName]=useState('');
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
                    <div style={{width:'80px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        {record.identifier}
                    </div>
                )
            }
        },
        {
            title: '租户',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '签订日期',
            dataIndex: 'beginTime',
            key: 'beginTime',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.beginTime).format('YYYY-MM-DD')}
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
            title: '租金押金(元)',
            dataIndex: 'deposit',
            key: 'deposit',
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
            dataIndex: 'xx',
            key: 'xx',
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
                       {record.contractStatus==1?
                           <>
                               <Button type='primary' onClick={()=>toedit(record)}>编辑</Button>
                               <Button type='primary' danger onClick={()=>isdelete(record.id)}>删除</Button>
                               <Button type='primary' onClick={()=>toInfo(record)}>详情</Button>
                           </>:
                           ''
                       }
                   </Space>
                )
            }
        },
    ];
    // 修改定金合同
    const toedit=(e)=>{
        history.push(`/enter/editDjContract?id=${e.id}`);
    };
    // 删除定金合同
    const isdelete=(e)=>{
        setUid(e);
        setIsDeleteOpen(true);
    };
    // 详情
    const toInfo=(e)=>{
        history.push(`/check/dingjinInfo?id=${e.id}`);
    };
    // 打印合同
    const toxiazai=(e)=>{
        history.push(`/check/nocheckDJcontractez?id=${e.id}`);
    };
    // 获取列表
    const getList=()=>{
        StaffService.getdJContractList({page,pageSize,contractStatus,name,startDate,endDate}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setStaffList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 获取分页信息
    const getListfenye=()=>{
        StaffService.getdJContractListfy({pageSize,contractStatus,name,startDate,endDate}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setzuMoney(res.Data.zuMoney);
                setdeposit(res.Data.deposit);
            }else {
                message.error(res.Data);
            }
        })
    };
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
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
    const sousuo=()=>{
        setPage(1);
        getList();
        getListfenye();
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getListfenye();
    }, []);
    const onOK=()=>{
        StaffService.removedj(uid).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                message.success('删除成功');
                getList();
                setspinning(false);
                setIsDeleteOpen(false);
            }else {
                message.error(res.Data);
                getList();
                setspinning(false);
                setIsDeleteOpen(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={(e)=>setName(e.target.value)}
                            addonBefore="租户姓名:"
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
                                签订日期:
                            </div>
                            <DatePicker.RangePicker onChange={changeDate}/>
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
                            <Table.Summary.Cell index={3}>{zuMoney}元</Table.Summary.Cell>
                            <Table.Summary.Cell index={4}>{deposit}元</Table.Summary.Cell>

                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            <Pagination total={count} pageSize={50} current={page} onChange={onChange}  pageSizeOptions={[50]}/>
            <Modal open={isDeltOpen} onOk={onOK} onCancel={()=>setIsDeleteOpen(false)} loading={spinning} title={'删除'}>
                <div>是否要删除?</div>
            </Modal>
        </Spin>
    )
}
export default DjContract