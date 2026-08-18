import {Button, Input, List, message, Pagination, Space, Spin, Table} from "antd";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import {useEffect, useState} from "react";
import * as WaterPostpaidService from '@/services/waterPostpaid';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const WaterPostpaid=()=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [address,setAddress]=useState(checkSessionStorage('/billLog/monthlyBill','address')||'');
    const [tenantName,setTenantName]=useState(checkSessionStorage('/billLog/monthlyBill','tenantName')||'');
    const [remark,setRemark]=useState(checkSessionStorage('/billLog/monthlyBill','remark')||'');
    const [isSpinning,setIsSpinning]=useState(false);
    const [total,setTotal]=useState(0);
    const [payAmount,setPayAmount]=useState(0);
    const [submittedSum,setSubmittedSum]=useState(0);
    const [dataSource,setDataSource]=useState([]);
    const columns =[
        {
            title: '采集器',
            dataIndex: 'collectorid',
            key: 'collectorid',
        },
        {
            title: '水表地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '价钱名称',
            dataIndex: 'price_name',
            key: 'price_name',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '租户姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            render:(_:any,record:any)=>{
                return(
                    <div>
                        {record.tenant_name==null?"未关联租户":record.tenant_name}
                    </div>
                )
            }
        },
        {
            title: '当前水量',
            dataIndex: 'total_used_amount',
            key: 'total_used_amount',
            render:(_:any,record:any)=>{
                return(
                    <>
                        {record.total_used_amount}m³
                    </>
                )
            }
        },
        {
            title: '结算度数',
            dataIndex: 'submitted',
            key: 'submitted',
            render:(_:any,record:any)=>{
                return(
                    <>
                        {record.submitted}m³
                    </>
                )
            }
        },
        {
            title: '消耗度数',
            dataIndex: 'c0',
            key: 'c0',
            render:(_:any,record:any)=>{
                return(
                    <>
                        <span>{(record.total_used_amount-record.submitted).toFixed(2)}m³</span>
                    </>
                )
            }
        },
        {
            title: '扣费价钱',
            dataIndex: 'base_price1',
            key: 'base_price1',
            render:(_:any,record:any)=>{
                return(
                    <>
                        <span>{(record.base_price1+record.additional_price1).toFixed(3)}元</span>
                    </>
                )
            }
        },
        {
            title: '未扣费用',
            dataIndex: 'c0',
            key: 'c0',
            render:(_:any,record:any)=>{
                return(
                    <>
                        <span>{((record.total_used_amount-record.submitted)*(record.base_price1+record.additional_price1)).toFixed(3)}元</span>
                    </>
                )
            }
        },
    ];
    const onChange=(e,pageSizz)=>{
        setPage(e);
        setPageSize(pageSizz);
    };
    const sousuo=()=>{
        setPage(1);
        getFenyeInfo();
        getWaterPostpaidList();
    };
    const getFenyeInfo=()=>{
        WaterPostpaidService.fenye({pageSize,address,remark,tenantName,tenantId:0}).then((res:TypeErrorCode)=>{
            try {
                if (res.ErrorCode==0){
                    console.log(res)
                    setTotal(res.Data.total);
                    setPayAmount(res.Data.payAmount);
                    setSubmittedSum(res.Data.submittedSum);
                }
            }catch (err){
                message.error(err.message);
            }
        });
    };
    // 列表
    const getWaterPostpaidList=()=>{
        WaterPostpaidService.fetch({page,pageSize,address,remark,tenantName,tenantId:0}).then((res:TypeErrorCode)=>{
            try {
                if (res.ErrorCode==0){
                    console.log('res',res)
                    setIsSpinning(false);
                    setDataSource(res.Data);
                }
            }catch (err){
                message.error(err.message);
            }
        });
    };
    const changeAddress=(e)=>{
        setAddress(e.target.value);
        updateSessionStorage('/billLog/monthlyBill','address',e.target.value);
    };
    const changeTenantName=(e)=>{
        setTenantName(e.target.value);
        updateSessionStorage('/billLog/monthlyBill','tenantName',e.target.value);
    };
    const changeRemark=(e)=>{
        setRemark(e.target.value);
        updateSessionStorage('/billLog/monthlyBill','remark',e.target.value);
    };
    useEffect(() => {
        getWaterPostpaidList();
    }, [page,pageSize]);
    useEffect(() => {
        getFenyeInfo();
    }, []);
    return(
        <Spin spinning={isSpinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={changeAddress}
                            addonBefore="水表地址:"
                            value={address}
                        />
                        <Input
                            onChange={changeTenantName}
                            addonBefore="租户姓名:"
                            value={tenantName}
                        />
                        <Input
                            onChange={changeRemark}
                            addonBefore="水表备注:"
                            value={remark}
                        />
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
                rowKey={(columns) => columns.id}
                dataSource={dataSource}
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
                            <Table.Summary.Cell index={2}>

                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={3}>

                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={4}>

                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>
                                {submittedSum}m³
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={7}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                                {payAmount}元
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            <Pagination total={total} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
        </Spin>
    )
}
export default  WaterPostpaid
