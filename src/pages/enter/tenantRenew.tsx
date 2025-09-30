import dayjs from "dayjs";
import {Button, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {connect} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const TenantRenew=(props)=>{
    const [spinning,setspinning]=useState(false);
    const [name,setName]=useState('');
    const [type,settype]=useState(12);
    const [page,setPage]=useState(1);
    const [uid,setuid]=useState(0);
    const [pageSize,setPageSize]=useState(50);
    const [remark,setRemark]=useState('');
    const [oldRemark,setoldRemark]=useState('');
    const [open,setOpen]=useState(false);
    const columns =[
        {
            title: '单元名称',
            dataIndex: 'unitList',
            key: 'unitList',
            sorter: {
                compare: (a, b) => {
                    // 获取 a 和 b 的 unitList 中第一个 unit_name
                    const aUnitName = a.unitList[0]?.unit_name || '';
                    const bUnitName = b.unitList[0]?.unit_name || '';

                    // 比较 unit_name
                    if (aUnitName < bUnitName) return -1;
                    if (aUnitName > bUnitName) return 1;
                    return 0;
                },
                multiple: 1,
            },
            width:200,
            render: (text:any, record:any) => {
                const limitedUnitList = record.unitList.slice(0, 2);
                return(
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                        {limitedUnitList.map((item, index) => (
                            <span key={index}>{item.unit_name}{index < limitedUnitList.length - 1 ? ',' : ''}</span>
                        ))}
                        {/* 如果 unitList 数组长度大于 2，则显示省略号或其他提示 */}
                        {record.unitList.length > 2 && <span>...</span>}
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
            title: '管理费(元)',
            dataIndex: 'manageFee',
            key: 'manageFee',
        },
        {
            title: '备注',
            dataIndex: 'renewalRemark',
            key: 'renewalRemark',
            render: (text:any, record:any) => {
                return(
                   <Input.TextArea value={text}/>
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
                        <Button type='primary' onClick={()=>{followUp(record)}}>跟进</Button>
                    </Space>
                )
            }
        },
    ];
    // 跟进
    const followUp=(record:any)=>{
        setuid(record.id);
        setOpen(true);
    };
    const changeName=(e)=>{
        setName(e.target.value);
    };
    const suosou=()=>{
        setPage(1);
        getList();
        getFenye();
        console.log('props',props)
    };
    const changeType=(e)=>{
        settype(e);
    };
    const getList=()=>{
      props.dispatch({
          type:'TenantRenew/fetch',
          payload:{page,type,name,pageSize}
      })
    };
    const getFenye=()=>{
        props.dispatch({
            type:'TenantRenew/fenye',
            payload:{type,name,pageSize}
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getFenye();
    }, []);
    // 监听页数
    const onChange=(page,pageSize)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const onOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'TenantRenew/edit',
            payload:{uid,renewalRemark:remark},
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('跟进成功');
                setOpen(false);
                setspinning(false);
            }else{
                message.error(res.ErrorCode+res.Data);
                setspinning(false);
                setOpen(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="姓名:"
                            onChange={changeName}
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
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                }}
                            >
                                到期:
                            </div>
                            <Select value={type} onChange={changeType}  style={{ width: 120 }}>
                                <Select.Option value={1}>
                                    一个月内
                                </Select.Option>
                                <Select.Option value={3}>
                                    三个月内
                                </Select.Option>
                                <Select.Option value={6}>
                                    半年内
                                </Select.Option>
                                <Select.Option value={12}>
                                    一年内
                                </Select.Option>
                            </Select>
                        </Space.Compact>
                        <Button type="primary" onClick={suosou}>
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
                dataSource={props.TenantRenewList}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            <Modal loading={spinning} open={open} onOk={onOK} onCancel={()=>setOpen(false)} title='跟进'>
                <div>
                    <Input.TextArea value={remark} onChange={(e)=>setRemark(e.target.value)}/>
                </div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        TenantRenewList: state.TenantRenew.list,
        count: state.TenantRenew.count
    }
};
export default  connect(mapStateToProps)(TenantRenew);
