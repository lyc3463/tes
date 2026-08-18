import {Button, Input, List, message, Modal, Pagination, Space, Spin, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {checkSessionStorage, getRandomNumber, updateSessionStorage} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as ElePostpaidService from '@/services/elePostpaid';

const PostpaidList=()=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [address,setAddress]=useState(checkSessionStorage('/billLog/monthlyBill','postPaidAddress')||'');
    const [isSpinning,setIsSpinning]=useState(false);
    const [tenantName,setTenantName] =useState(checkSessionStorage('/billLog/monthlyBill','postPaidTenantName')||'');
    const [remark,setRemark]=useState(checkSessionStorage('/billLog/monthlyBill','postPaidRemark')||'');
    const [dataSource,setDataSource]=useState([]);
    const [total,setTotal]=useState(0);
    const [payAmount,setPayAmount]=useState(0);
    const [submittedSum,setSubmittedSum]=useState(0);
    const columns =[
        {
            title: '采集器',
            dataIndex: 'collectorid',
            key: 'collectorid',
        },
        {
            title: '通讯地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '租户',
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
            title: '价钱名称',
            dataIndex: 'price_name',
            key: 'price_name',
        },
        {
            title: '描述',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '当前电量',
            dataIndex: 'c0',
            key: 'c0',
            render:(_:any,record:any)=>{
                return(
                    <>
                        <span>{record.c0}kwh</span>
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
                        <span>{record.submitted}kwh</span>
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
                        <span>{(record.c0-record.submitted).toFixed(2)}kwh</span>
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
                        <span>{((record.c0-record.submitted)*(record.base_price1+record.additional_price1)).toFixed(3)}元</span>
                    </>
                )
            }
        },
    ];
    useEffect(() => {
        getElePostpaidList();
    }, [page,pageSize]);

    // 列表
    const getElePostpaidList=()=>{
        ElePostpaidService.fetch({page,pageSize,address,remark,tenantName,tenantId:0}).then((res:TypeErrorCode)=>{
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
    // 监听页数
    const onChange=(page,pageSizz)=>{
        setPage(page);
        setPageSize(pageSizz);
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getFenyeInfo();
        getElePostpaidList();
    };
    const getFenyeInfo=()=>{
        ElePostpaidService.fenye({pageSize,address,remark,tenantName,tenantId:0}).then((res:TypeErrorCode)=>{
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
    // 监听地址输入框
    const changeAddress=(e)=>{
        setAddress(e.target.value);
        updateSessionStorage('/billLog/monthlyBill','postPaidAddress',e.target.value);
    };


    useEffect(() => {
        getFenyeInfo();
    }, []);
    const changeRemark=(e)=>{
        setRemark(e.target.value);
        updateSessionStorage('/billLog/monthlyBill','postPaidRemark',e.target.value);
    };
    const changeTenantName=(e)=>{
        setTenantName(e.target.value);
        updateSessionStorage('/billLog/monthlyBill','postPaidTenantName',e.target.value);
    };
    return(
        <Spin spinning={isSpinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={changeAddress}
                            addonBefore="电表地址:"
                            value={address}

                        />
                        <Input
                            onChange={changeRemark}
                            addonBefore="电表描述:"
                            value={remark}
                        />
                        <Input
                            onChange={changeTenantName}
                            addonBefore="租户姓名:"
                            value={tenantName}
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
                scroll={{x:1500}}
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
                                {submittedSum}kwh
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
export default PostpaidList
