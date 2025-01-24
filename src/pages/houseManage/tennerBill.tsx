import {history,connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {Button, Input, List, message, Space, Table, Tag} from "antd";

const TennerBill=(props:any)=>{
    // 账单列表
    const [billList,setbillList]=useState([]);
    // 合同编号
    const [identifier,setidentifier]=useState('');
    // 初始租金
    const [rent,setrent]=useState(0);
    // 初始管理费
    const [manageFee,setmanageFee]=useState(0);
    // 管理费递增
    const [manageFeeRent,setmanageFeeRent]=useState(0);
    // 租户姓名
    const [tenant_name,settenant_name]=useState('');
    // 获取账单列表
    const getbillList=(tenantId)=>{
        props.dispatch({
            type:'HouseBill/fetch',
            payload:{tenantId}
        }).then((res:TypeErrorCode)=>{
            console.log(res);
            if (res.ErrorCode==0){
                setbillList(res.Data.data);
                setidentifier(res.Data.identifier);
                setrent(res.Data.rent);
                setmanageFee(res.Data.manageFee);
                setmanageFeeRent(res.Data.manageFeeRent);
                settenant_name(res.Data.tenant_name);
            }else {
                message.warning(res.Data);
            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getbillList(id);
    }, []);
    const columns =[
        {
            title: '账单日期',
            dataIndex: 'allDate',
            key: 'allDate',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {`${dayjs(record.monthBeginDate).format("YYYY-MM-DD")}至${dayjs(record.monthEndDate).format("YYYY-MM-DD")}`}
                    </div>
                )
            }
        },
        {
            title: '租金',
            dataIndex: 'rent',
            key: 'rent',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.rent}元
                    </div>
                )
            }
        },
        {
            title: '管理费',
            dataIndex: 'manageFee',
            key: 'manageFee',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.manageFee}元
                    </div>
                )
            }
        },
        // {
        //     title: '管理费递增',
        //     dataIndex: 'manageFeeDz',
        //     key: 'manageFeeDz',
        //     render:(text:any,record:any,)=>{
        //         return(
        //             <div>
        //                 {record.manageFeeDz}%
        //             </div>
        //         )
        //     }
        // },
        {
            title: '免租天数',
            dataIndex: 'rentFreeDay',
            key: 'rentFreeDay',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.rentFreeDay==0?<Tag color='#999'>{record.rentFreeDay}天</Tag>:<Tag color='magenta'>{record.rentFreeDay}日</Tag>}
                    </div>
                )
            }
        },
        {
            title: '应交租金',
            dataIndex: 'payRent',
            key: 'payRent',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.payRent==0?<Tag color='warning'>{record.payRent}元</Tag>:<Tag color='magenta'>{record.payRent}元</Tag>}
                    </div>
                )
            }
        },
        {
            title: '应缴费用',
            dataIndex: 'payManageFee',
            key: 'payManageFee',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.payManageFee==0?<Tag color='warning'>{record.payManageFee}元</Tag>:<Tag color='magenta'>{record.payManageFee}元</Tag>}
                    </div>
                )
            }
        },
        {
            title: '预付费',
            dataIndex: 'prepayment',
            key: 'prepayment',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.prepayment==0?<Tag color='#999'>{record.prepayment}元</Tag>:<Tag color='magenta'>{record.prepayment}元</Tag>}
                    </div>
                )
            }
        },
        {
            title: '当月账单',
            dataIndex: 'billMoney',
            key: 'billMoney',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.billMoney==0?<Tag color='magenta'>{record.billMoney}元</Tag>:<Tag color='blue'>{record.billMoney}元</Tag>}
                    </div>
                )
            }
        },
        {
            title: '缴费状态',
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
    ];
    return(
        <div>
            <List>
                <List.Item>
                    <Space size='large'>
                        <span style={{fontWeight:'600'}}>租户姓名:<span>{tenant_name}</span></span>
                        <span style={{fontWeight:'600'}}>合同编号:{identifier}</span>
                        <span style={{fontWeight:'600'}}>初始租金:{`${rent}元`}</span>
                        <span style={{fontWeight:'600'}}>初始管理费:{`${manageFee}元`}</span>
                        <span style={{fontWeight:'600'}}>管理费递增:{`${manageFeeRent}%`}</span>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                dataSource={billList}
                size='small'
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
            />
        </div>
    )
}

export default connect() (TennerBill)