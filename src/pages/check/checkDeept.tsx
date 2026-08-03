import {Button, DatePicker, Form, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from 'antd';
import dayjs from "dayjs";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import {useEffect, useState} from "react";
import {connect} from "umi";
import * as CheckDeeptService from '@/services/checkDeept';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const CheckDeept = (props) => {
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState(checkSessionStorage('/check/checkAfterSales/','CheckDeeptName')||'');
    const [phone,setPhone]=useState(checkSessionStorage('/check/checkAfterSales/','CheckDeeptPhone')||'');
    // 开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/check/checkAfterSales/','CheckDeeptStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/check/checkAfterSales/','CheckDeeptEndDate')||'2099-01-01');
    const [stutes,setStutes]=useState(checkSessionStorage('/check/checkAfterSales/','CheckDeeptStutes')||0);
    const [tenantId,setTenantId]=useState(0);
    const [uid,setUid]=useState(0);
    const [delOpen,setDelOpen]=useState(false);
    const [checkOpen,setCheckOpen]=useState(false);
    const [revokeOpen,setRevokeOpen]=useState(false);
    const [spinning,setspinning]=useState(false);
    const [drId,setDrID]=useState(0);

    const columns =[
        {
            title: '申请日期',
            dataIndex: 'created',
            key: 'created',
            render:(_:any,record:any)=>(
                <div>
                    {dayjs(record.created).format("YYYY-MM-DD")}
                </div>
            )
        },
        {
            title: '押金名称',
            dataIndex: 'depositName',
            key: 'depositName',
        },
        {
            title: '押金类型',
            dataIndex: 'depositType',
            key: 'depositType',
            render:(text:any,record:any)=>{
                let depositType;
                if (text==1){
                    return(
                        depositType=<Tag color='green'>公共押金</Tag>
                    )
                }
                if (text==2){
                    return(
                        depositType = <Tag color='orange'>装修押金</Tag>
                    )
                }
                if (text==3){
                    return(
                        depositType = <Tag color='red'>合同押金</Tag>
                    )
                }
                return(
                    <div>
                        {depositType}
                    </div>
                )
            }
        },

        {
            title: '姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '手机号',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '金额(元)',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '状态',
            dataIndex: 'depositStatus',
            key: 'depositStatus',
            render:(text:any,record:any,)=>{
                let depositType;
                if (text==1){
                    return(
                        depositType=<Tag color='warning'>未审核</Tag>
                    )
                }
                if (text==2){
                    return(
                        depositType = <Tag color='green'>已审核</Tag>
                    )
                }
                if (text==3){
                    return(
                        depositType = <Tag color='red'>已驳回</Tag>
                    )
                }
                return(
                    <div>
                        {depositType}
                    </div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render:(text:any,record:any,)=>{
                return(
                    <Space>
                        {
                            record.depositStatus==1?<>
                                <Button onClick={()=>{isDel(record)}} danger type='primary'>删除</Button>
                                <Button onClick={()=>{isCheck(record)}} type='primary'>审核</Button>
                                <Button type='primary' onClick={()=>{isRevoke(record)}}>驳回</Button>
                            </>:''
                        }
                        {
                            record.depositStatus==3?<Button type='primary' onClick={()=>{isDel(record)}} danger>删除</Button>:''
                        }
                    </Space>
                )
            }
        }
    ];
    // 驳回
    const isRevoke=(e)=>{
        setUid(e.id);
        setDrID(e.drId);
        setRevokeOpen(true);
    };
    // 驳回确定
    const revokeOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'CheckDeept/check',
            payload:{
                uid:uid,
                status:3,
            },
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setRevokeOpen(false);
                setspinning(false);
                message.success('驳回成功');
                changeStatus(3)
            }else {
                message.error(res.ErrorCode + res.Data);
                setspinning(false);
                setRevokeOpen(false);
            }
        })
    };
    // 审核
    const isCheck=(e)=>{
        setUid(e.id);
        setDrID(e.drId);
        setCheckOpen(true);
    };
    // 审核确定
    const checkOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'CheckDeept/check',
            payload:{
                uid:uid,
                status:2,
            },
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setCheckOpen(false);
                setspinning(false);
                message.success('审核成功');
                changeStatus(4)
            }else {
                message.error(res.ErrorCode + res.Data);
                setspinning(false);
                setCheckOpen(false);
            }
        })
    };
    // 修改账单状态
    const changeStatus=(e)=>{
        CheckDeeptService.reject(drId,e)
    };
    // 删除弹窗
    const isDel=(e)=>{
        setUid(e.id);
        setDelOpen(true);
    };
    // 删除确定
    const delOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'CheckDeept/remove',
            payload:uid,
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setDelOpen(false);
                setspinning(false);
            }else {
                message.error(res.ErrorCode + res.Data);
                setDelOpen(false);
                setspinning(false);
            }
        })
    };
    // 监听姓名
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/check/checkAfterSales/','CheckDeeptName',e.target.value);
    };
    // 监听手机号
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/check/checkAfterSales/','CheckDeeptPhone',e.target.value);
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/check/checkAfterSales/','CheckDeeptStartDate','2000-01-01');
            updateSessionStorage('/check/checkAfterSales/','CheckDeeptEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/check/checkAfterSales/','CheckDeeptStartDate',data[0]);
            updateSessionStorage('/check/checkAfterSales/','CheckDeeptEndDate',data[1]);
        }
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
        updateSessionStorage('/check/checkAfterSales/','CheckDeeptStutes',e);
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const getList=()=>{
        props.dispatch({
            type:'CheckDeept/fetch',
            payload:{page,pageSize,name,phone,startDate,endDate,tenantId,stutes}
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    const sousuo=()=>{
        setPage(1);
        getList();
    };
    return (
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="姓名:"
                            onChange={changeName}
                            value={name}
                        />
                        <Input
                            addonBefore="手机号:"
                            onChange={changePhone}
                            value={phone}
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
                                日期:
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
                                状态:
                            </div>
                            <Select
                                onChange={changeStutes}
                                defaultValue={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:1, label: '未审核' },
                                    { value:2, label: '已审核' },
                                ]}
                            />
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                dataSource={props.CheckDeeptList}
                size='small'
                scroll={{y:'60vh',x:1500}}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            {/*删除弹窗*/}
            <Modal open={delOpen} onCancel={()=>setDelOpen(false)} onOk={delOk} loading={spinning}>
                <div>
                    <p>确定删除吗？</p>
                </div>
            </Modal>
            {/*审核弹窗*/}
            <Modal open={checkOpen} onCancel={()=>setCheckOpen(false)} onOk={checkOk} loading={spinning}>
                <div>
                    <p>确定审核吗？</p>
                </div>
            </Modal>
            {/*驳回弹窗*/}
            <Modal open={revokeOpen} onCancel={()=>setRevokeOpen(false)} onOk={revokeOk} loading={spinning}>
                <div>
                    <p>确定驳回吗？</p>
                </div>
            </Modal>
        </Spin>
    )
};
const mapStateToProps = (state: any) => {
    return {
        CheckDeeptList: state.CheckDeept.list,
        count: state.CheckDeept.count
    }
};

export default  connect(mapStateToProps)(CheckDeept)
