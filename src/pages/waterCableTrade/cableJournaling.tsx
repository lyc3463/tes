import {Button, DatePicker, Input, List, message, Pagination, Space, Table, Tag} from "antd";
import {connect} from "umi";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as WatertService from '@/services/watert';

import {useEffect, useState} from "react";
import {fenye} from "@/services/watert";

const CableJournaling=(props)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [count,setcount]=useState(0);
    const [waterList,setwaterList]=useState([]);
    // 水表地址
    const [waterAddress,setwaterAddress]=useState('');
    // 租户名称
    const [name,setName]=useState('');
    // 水表备注
    const [remark,setremark]=useState('');
    // 当前水量统计
    const [total_used_amount,settotal_used_amount]=useState(0);
    // 积累用水
    const [waterNumSum,setwaterNumSum]=useState(0);
    const columns =[
        {
            title: '水表地址',
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
                    <div style={{width:'200px'}}>
                        {record.tenant_name==null?<span style={{color:'red'}} >未绑定租户</span>:<span>{record.tenant_name}</span>}
                    </div>
                )
            },
        },
        {
            title: '积累用水量',
            dataIndex: 'waterNumSum',
            key: 'waterNumSum',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {text}m³
                    </div>
                )
            },
        },
        {
            title: '当前用水量',
            dataIndex: 'total_used_amount',
            key: 'total_used_amount',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {text}m³
                    </div>
                )
            },
        }
    ];
    // 获取水表报表
    const getWaterList=()=>{
        WatertService.fetch({page,name,waterAddress,remark,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setwaterList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 获取水表分页
    const getWaterListfenye=()=>{
        WatertService.fenye({name,waterAddress,remark,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                settotal_used_amount(res.Data.total_used_amount);
                setwaterNumSum(res.Data.waterNumSum);
                setcount(res.Data.count)
            }else {
                message.error(res.Data)
            }
        })
    };
    const sousuo=()=>{
        setPage(1);
        getWaterListfenye();
        getWaterList();
    };
    useEffect(() => {
        getWaterList()
    }, [page,pageSize]);
    useEffect(() => {
        getWaterListfenye();
    }, []);
    const onChange=(e,pageSize)=>{
      setPage(e);
      setPageSize(pageSize);
    };
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="水表编号:"
                            onChange={(e)=>setwaterAddress(e.target.value)}
                        />
                        <Input
                            addonBefore="租户名称:"
                            onChange={(e)=>setName(e.target.value)}
                        />
                        <Input
                            addonBefore="水表备注:"
                            onChange={(e)=>setremark(e.target.value)}
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
                dataSource={waterList}
                pagination={false}
                size='small'
                scroll={{y:'60vh'}}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
                summary={(columns) => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}>统计</Table.Summary.Cell>
                            <Table.Summary.Cell index={1}></Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={3}>{waterNumSum}m³</Table.Summary.Cell>
                            <Table.Summary.Cell index={4}>{total_used_amount}m³</Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
        </div>
    )
}

export default connect() (CableJournaling)