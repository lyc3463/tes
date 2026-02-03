import dayjs from "dayjs";
import {Button, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {connect} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const findHouseByName = (dataList: any[], houseName: string, isFuzzy: boolean = false) => {
    // 前置校验：数组为空/非数组 直接返回空数组
    if (!Array.isArray(dataList) || dataList.length === 0) {
        return dataList;
    }

    // 核心逻辑：如果 houseName 是空字符串（去除首尾空格后），直接返回全部数据
    const trimmedHouseName = houseName.trim();
    if (trimmedHouseName === '') {
        // 返回数组的浅拷贝，避免直接修改原数组
        return [...dataList];
    }

    // 统一转小写（避免大小写敏感问题）
    const targetName = trimmedHouseName.toLowerCase();

    // 执行查询
    const result = dataList.filter(item => {
        // 容错：如果元素没有 house_name 字段，跳过
        if (!item || !item.house_name) return false;
        
        const itemHouseName = item.house_name.trim().toLowerCase();
        
        // 精确匹配 / 模糊匹配 
        if (isFuzzy) {
            return itemHouseName.includes(targetName);
        } else {
            return itemHouseName === targetName;
        }
    });
    
    return result;
};

const TenantRenew=(props:any)=>{
    const [spinning,setspinning]=useState(false); // 加载
    const [name,setName]=useState('');// 搜索姓名
    const [type,settype]=useState(12); // 12一年 3三个月 6半年 1一个月
    const [page,setPage]=useState(1); // 页数
    const [uid,setuid]=useState(0); // 跟进id
    const [houseId,setHouseid]=useState(0); // 房屋id
    const [pageSize,setPageSize]=useState(50); // 每页条数
    const [remark,setRemark]=useState(''); // 跟进备注
    const [open,setOpen]=useState(false); // 跟进弹窗
    const [houseName,setHouseName]=useState(''); // 房屋名称
    const [list,setList]=useState([]); // 列表
    const columns =[
        {
            title: '所属房屋',
            dataIndex: 'house_name',
            key: 'house_name',
            ellipsis: true,
        },
        {
            title: '单元名称',
            dataIndex: 'unitList',
            key: 'unitList',
            sorter: {
                compare: (a:any, b:any) => {
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
                        {limitedUnitList.map((item:any, index:number) => (
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
    const changeName=(e:any)=>{
        setName(e.target.value);
    };
    const suosou=()=>{
        setPage(1);
        getList();
        getFenye();
    };
    const changeType=(e:number)=>{
        settype(e);
    };
    const getList=()=>{
      props.dispatch({
          type:'TenantRenew/fetch',
          payload:{page,type,name,pageSize}
      }).then((res:TypeErrorCode)=>{
          if (res.ErrorCode==0){
            let findHouseByNameList=findHouseByName(res.Data,houseName);
            setList(findHouseByNameList);
          }else{
              message.error(res.ErrorCode+res.Data);
          }
      })
    };
    const getFenye=()=>{
        props.dispatch({
            type:'TenantRenew/fenye',
            payload:{type,name,pageSize}
        })
    };
    const getHouseList=()=>{
        props.dispatch({
            type:'House/fetch',
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getFenye();
        getHouseList();
    }, []);
    // 监听页数
    const onChange=(page:number,pageSize:number)=>{
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
    const changeHouse=(e:any)=>{
        setHouseid(e);
        let houseName='';
        if (e === 0 || !Array.isArray(props.HouseList) || props.HouseList.length === 0) {
            return setHouseName('');
        }
        const targetHouse = props.HouseList.find(item => item.id === e);
        if (targetHouse) {
            houseName=targetHouse.house_name;
        } else {
            houseName = '';
        }
        setHouseName(houseName);
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
                                房屋:
                            </div>
                            <Select
                                value={houseId}
                                onChange={changeHouse}
                                showSearch
                                style={{ width: 150 }}
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    // 假设每个 option 都有一个与数据项对应的 value 属性
                                    const item = props.HouseList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                                    return item?.house_name?.toLowerCase().includes(input.toLowerCase());
                                }}
                            >
                                <Select.Option value={0} key={0}>
                                    全部
                                </Select.Option>
                                {Array.isArray(props.HouseList) && props.HouseList.map((item:any,index:any)=>{
                                    return(
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.house_name}
                                        </Select.Option>
                                    )
                                })}
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
                                期限:
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
                dataSource={list}
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
        count: state.TenantRenew.count,
        HouseList: state.House.list
    }
};
export default  connect(mapStateToProps)(TenantRenew);
