import {Button, DatePicker, Form, Input, List, message, Modal, Pagination, Select, Space, Table, Tag} from "antd";
import {connect, history} from "umi";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import CustomType from '@/ModelTypes/TypeCustom';

const CheckCustom=(props)=>{
    const [uid,setUid]=useState(0);
    const [isOpen,setIsOpen]=useState(false);
    // 当前页数
    const [page,setPage]=useState(1);
    // 客户名称
    const [customName,setCustomName]=useState('');
    // 开始时间
    const [customBeginTime,setCustomBeginTime]=useState('2000-01-01');
    // 结束时间
    const [customEndTime,setCustomEndTime]=useState('2099-01-01');
    // 审核状态  2全部，0未审核，1已审核
    const [customStatus,setCustomStatus]=useState(2);
    // 增加次数的id
    const [aid,setAid]=useState(0);
    // 增加到访次的弹窗
    const [aOpen,setAOpen]=useState(false);
    // 备注
    const [remark,setRemark]=useState('');
    const columns =[
        {
            title: '日期',
            dataIndex: 'custom_date',
            key: 'custom_date',
            align:'center',
            render: (text:any, record:any) => {
                return(
                    <span>{dayjs(text).format('YYYY-MM-DD')}</span>
                )
            }
        },
        {
            title: '姓名',
            dataIndex: 'custom_name',
            key: 'custom_name',
            align:'center',
        },
        {
            title: '联系方式',
            dataIndex: 'phone',
            key: 'phone',
            align:'center',
        },
        {
            title: '访客职位',
            dataIndex: 'visitor_position',
            key: 'visitor_position',
            align:'center',
        },
        {
            title: '公司名称',
            dataIndex: 'company_name',
            key: 'company_name',
            align:'center',
        },
        {
            title: '行业',
            dataIndex: 'industry',
            key: 'industry',
            align:'center',
        },
        {
            title: '来访渠道',
            dataIndex: 'visitor_channels',
            key: 'visitor_channels',
            align:'center',
        },
        {
            title: '中介名称',
            dataIndex: 'intermediary_name',
            key: 'intermediary_name',
            align:'center',
        },
        {
            title: '目前办公区域',
            dataIndex: 'office_area',
            key: 'office_area',
            align:'center',
        },
        {
            title: '租赁原因',
            dataIndex: 'reason_lease',
            key: 'reason_lease',
            align:'center',
        },
        {
            title: '产品需求',
            dataIndex: 'demands',
            key: 'demands',
            align:'center',
        },
        {
            title: '需求面积',
            dataIndex: 'required_area',
            key: 'required_area',
            align:'center',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            fixed: 'right',
            align:'center',
        },
        {
            title: '来访次数',
            dataIndex: 'visitor_number',
            key: 'visitor_number',
            fixed: 'right',
            align:'center',
            width: 100,
            render:(text:any,record:any,)=>{
                return(
                    <Space>
                        <span style={{fontSize:'12px'}}>{text}次</span>
                        <Button type='primary' onClick={()=>onaddNum(record)}>+</Button>
                    </Space>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'custom_sattus',
            key: 'custom_sattus',
            fixed: 'right',
            align:'center',
            width: 70,
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.custom_sattus==0?<Tag color="red">未审核</Tag>:<Tag color="green">已审核</Tag>}
                    </div>
                )
            }
        },
        {
            title: '操作',
            fixed: 'right',
            align:'center',
            width: 150,
            render: (text:any, record:any) => {
                return(
                    <div>
                        {
                            record.custom_sattus==0?
                                <Space>
                                    <Button type='link' onClick={()=>checkOpen(record.id)}>审核通过</Button>
                                    <Button type='link' onClick={()=>toinfo(record.id)}>详情</Button>
                                    <Button type='link' onClick={()=>toEdit(record.id)}>编辑</Button>
                                </Space>:
                                <>
                                    <Button type='link' onClick={()=>toinfo(record.id)}>详情</Button>
                                </>
                        }
                    </div>
                )
            }
        },
    ];
    // 审核通过
    const openOk=()=>{
        props.dispatch({
            type:'Custom/check',
            payload:uid,
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('审核通过');
                setIsOpen(false);
            }else {
                message.error(res.Data);
                setIsOpen(false);
            }
        })
    };
    // 审核弹窗
    const checkOpen=(id:number)=>{
        setUid(id);
        setIsOpen(true);
    };
    const toEdit=(e:number)=>{
        history.push(`/enter/editCustom?id=${e}`)
    }
    const toinfo=(e:number)=>{
        history.push(`/enter/customInfo?id=${e}`)
    };
    // 搜索
    const suosou=()=>{
        setPage(1);
        props.dispatch({
            type:'Custom/fenye',
            payload:{customName,customBeginTime,customEndTime,customStatus}
        })
        logFenye();
    };
    // 监听名字
    const changeName=(e)=>{
        setCustomName(e.target.value)
    };
    // 监听页数
    const onChange=(page)=>{
        setPage(page);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Custom/fetch",
            payload:{page,customName,customBeginTime,customEndTime,customStatus}
        })
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setCustomBeginTime('2000-01-01');
            setCustomEndTime('2099-01-01');
        } else {
            setCustomBeginTime(data[0]);
            setCustomEndTime(data[1]);
        }
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setCustomStatus(e);
    };
    useEffect(() => {
        logFenye();
    }, [page]);

    // 到访次数弹窗
    const onaddNum=(e:CustomType)=>{
        setAid(e.id);
        setRemark(e.remark);
        setAOpen(true);
    };
    // 到访次数确定按钮
    const aopenOK=()=>{
        props.dispatch({
            type:"Custom/editNum",
            payload:{aid,remark}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                setRemark('');
                setAOpen(false);
            }else {
                message.error(res.Data)
            }
        })
    };
    const onlikai=()=>{
      setRemark('');
      setAOpen(false)
    };
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="客户姓名:"
                            onChange={changeName}
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
                                时间:
                            </div>
                            <DatePicker.RangePicker onChange={changeDate}/>
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
                                defaultValue={customStatus}
                                style={{ width: 120 }}
                                options={[
                                    { value:2, label: '全部' },
                                    { value:0, label: '未审核' },
                                    { value:1, label: '已审核' },
                                ]}
                            />
                        </Space.Compact>
                        <Button type="primary" onClick={suosou}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                scroll={{x:2500,y:'70vh'}}
                size='small'
                pagination={false}
                rowKey={(columns) => columns.id}
                dataSource={props.CustomList}
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            {/*    审核通过弹窗*/}
            <Modal open={isOpen} onOk={openOk} onCancel={()=>setIsOpen(false)}>
                <div>
                    确定要审核通过吗？
                </div>
            </Modal>
            {/*    到访次数弹窗*/}
            <Modal open={aOpen} onOk={aopenOK} onCancel={onlikai}>
               <Input.TextArea value={remark} onChange={(e)=>setRemark(e.target.value)}/>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CustomList: state.Custom.list,
        count: state.Custom.count
    }
};

export default connect(mapStateToProps) (CheckCustom)
