import {Button, DatePicker, Input, List, message, Pagination, Space, Table, Tag} from "antd";
import {connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import * as CableService from '@/services/cable';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const WaterJournaling=(props)=>{
    const [page,setpage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [collectorId,setcollectorId]=useState('');
    // 列表
    const [dataSource,setdataSource]=useState([]);
    // 租户名称
    const [name,setName]=useState('');
    // 电表描述
    const [remark,setremark]=useState('');
    // 页码
    const [count,setcount]=useState(0);
    // 当前电量统计
    const [c0Sum,setc0Sum]=useState(0);
    //  积累用电量统计
    const [eleNumSum,seteleNumSum]=useState(0);
    // 总累计消耗金额统计
    const [lossTotal,setlossTotal]=useState(0);
    // 租户累计损耗统计
    const [lossSum,setlossSum]=useState(0);
    // 租户当前损耗金额统计
    const [lossCycleOut,setlossCycleOut]=useState(0);
    const columns =[
        {
            title: '电表地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '描述',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '租户',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.tenant_name==null?<span style={{color:'red'}} >未绑定租户</span>:<span>{record.tenant_name}</span>}
                    </div>
                )
            },
        },
        {
            title: '积累用电量',
            dataIndex: 'eleNumSum',
            key: 'eleNumSum',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.eleNumSum}kWh
                    </div>
                )
            },
        },
        {
            title: '当前用电量',
            dataIndex: 'c0',
            key: 'c0',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.c0}kWh
                    </div>
                )
            },
        },
        {
            title: '总累计消耗金额',
            dataIndex: 'lossTotal',
            key: 'lossTotal',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.lossTotal}元
                    </div>
                )
            },
        },
        {
            title: '租户累计损耗',
            dataIndex: 'lossSum',
            key: 'lossSum',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.lossSum}元
                    </div>
                )
            },
        },
        {
            title: '损耗',
            dataIndex: 'loss',
            key: 'loss',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.loss}元每度
                    </div>
                )
            },
        },
        {
            title: '未交损耗度数',
            dataIndex: 'lossCycleOut',
            key: 'lossCycleOut',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.lossCycleOut}kwh
                    </div>
                )
            },
        },
        {
            title: '租户当前损耗金额',
            dataIndex: 'lossCycleOut',
            key: 'lossCycleOut',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {(record.lossCycleOut*record.loss).toFixed(3)}元
                    </div>
                )
            },
        },
    ];
    // 获取电表报表列表
    const getCableList=()=>{
        CableService.fetch({page,collectorId,name,remark,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setdataSource(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 获取分页信息
    const getCableListFenye=()=>{
        CableService.fenye({collectorId,name,remark,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setc0Sum(res.Data.c0Sum);
                setcount(res.Data.count);
                seteleNumSum(res.Data.eleNumSum);
                setlossTotal(res.Data.lossTotal);
                setlossSum(res.Data.lossSum);
                setlossCycleOut(res.Data.lossCycleOut);
            }else {
                message.error(res.Data);
            }
        })
    };
    const sousuo=()=>{
        setpage(1);
        getCableListFenye();
        getCableList();
    };
    const onChange=(e,pageSizz)=>{
        setpage(e);
        setPageSize(pageSizz);
    };
    useEffect(() => {
        getCableListFenye();
    }, []);
    useEffect(() => {
        getCableList();
    }, [page,pageSize]);
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="电表地址:"
                            onChange={(e)=>setcollectorId(e.target.value)}
                        />
                        <Input
                            addonBefore="电表描述:"
                            onChange={(e)=>setremark(e.target.value)}
                        />
                        <Input
                            addonBefore="租户名称:"
                            onChange={(e)=>setName(e.target.value)}
                        />
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                dataSource={dataSource}
                pagination={false}
                size='small'
                scroll={{y:'60vh'}}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
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
                                {eleNumSum}kwh
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={3}>
                                {c0Sum}kwh
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={4}>
                                {lossTotal}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>
                                {lossSum}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>
                                {lossCycleOut}元
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
        </div>
    )
}

export default connect() (WaterJournaling)