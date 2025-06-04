import {Button, DatePicker, Form, Input, List, message, Modal, Pagination, Select, Space, Table, Tag} from "antd";
import {connect, history} from "umi";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import CustomType from '@/ModelTypes/TypeCustom';
import {StaticInfo} from "@/StaticInfo";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const CheckCustom=(props)=>{
    const [uid,setUid]=useState(0);
    const [isOpen,setIsOpen]=useState(false);
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSzie]=useState(50);

    // 客户名称
    const [customName,setCustomName]=useState(checkSessionStorage('/check/checkCustom/','name')||'');
    // 开始时间
    const [customBeginTime,setCustomBeginTime]=useState(checkSessionStorage('/check/checkCustom/','startDate')||'2000-01-01');
    // 结束时间
    const [customEndTime,setCustomEndTime]=useState(checkSessionStorage('/check/checkCustom/','endDate')||'2099-01-01');
    // 审核状态  2全部，0未审核，1已审核
    const [customStatus,setCustomStatus]=useState(checkSessionStorage('/check/checkCustom/','stutes')||2);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const [userId,setUserId]=useState(0);

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
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            align:'center',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        {record.remark}
                    </div>
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
            dataIndex: 'custom_phone',
            key: 'custom_phone',
            align:'center',
        },
        {
            title: '来访渠道',
            dataIndex: 'visitor_channels',
            key: 'visitor_channels',
            align:'center',
            render:(text:any,record:any,)=>{
                let consumptionTypeText;
                switch (record.visitor_channels) {
                    case 1:
                        consumptionTypeText = <Tag color='cyan'>中介</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag color='green'>自来</Tag>;
                        break;
                    case 3:
                        consumptionTypeText = <Tag color='gold'>全民营销</Tag>;
                        break;
                    case 4:
                        consumptionTypeText = <Tag color='geekblue'>线上</Tag>;
                        break;
                    default:
                        consumptionTypeText = <Tag color='red'>未知类型</Tag>;
                }
                return (
                    consumptionTypeText
                );
            }
        },
        {
            title: '租赁原因',
            dataIndex: 'reason_lease',
            key: 'reason_lease',
            align:'center',
            render:(text:any,record:any,)=>{
                let consumptionTypeText;
                switch (record.reason_lease) {
                    case 1:
                        consumptionTypeText = <Tag color='gold'>首次经营</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag color='lime'>平迁</Tag>;
                        break;
                    case 3:
                        consumptionTypeText = <Tag color='green'>合同到期</Tag>;
                        break;
                    case 4:
                        consumptionTypeText = <Tag color='cyan'>扩大</Tag>;
                        break;
                    case 5:
                        consumptionTypeText = <Tag color='magenta'>缩小</Tag>;
                        break;
                    case 6:
                        consumptionTypeText = <Tag color='gold'>开设分点</Tag>;
                        break;
                    default:
                        consumptionTypeText = <Tag color='red'>未知类型</Tag>;
                }
                return (
                    consumptionTypeText
                );
            }
        },
        {
            title: '产品需求',
            dataIndex: 'demands',
            key: 'demands',
            align:'center',
            render:(text:any,record:any,)=>{
                let consumptionTypeText;
                switch (record.demands) {
                    case 1:
                        consumptionTypeText = <Tag color='gold'>精装修</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag color='lime'>简装</Tag>;
                        break;
                    case 3:
                        consumptionTypeText = <Tag color='green'>毛坯</Tag>;
                        break;
                    default:
                        consumptionTypeText = <Tag color='red'>未知类型</Tag>;
                }
                return (
                    consumptionTypeText
                );
            }
        },
        {
            title: '需求面积',
            dataIndex: 'required_area',
            key: 'required_area',
            align:'center',
            render:(text:any,record:any,)=>{
                let consumptionTypeText;
                switch (record.required_area) {
                    case 1:
                        consumptionTypeText = <Tag color='magenta'>100以下</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag color='volcano'>101-200</Tag>;
                        break;
                    case 3:
                        consumptionTypeText = <Tag color='orange'>201-350</Tag>;
                        break;
                    case 4:
                        consumptionTypeText = <Tag color='gold'>351-500</Tag>;
                        break;
                    case 5:
                        consumptionTypeText = <Tag color='lime'>501-1000</Tag>;
                        break;
                    case 6:
                        consumptionTypeText = <Tag color='green'>1000以上</Tag>;
                        break;
                    default:
                        consumptionTypeText = <Tag color='red'>未知类型</Tag>;
                }
                return (
                    consumptionTypeText
                );
            }
        },
        {
            title: '访客职位',
            dataIndex: 'visitor_position',
            key: 'visitor_position',
            align:'center',
        },
        {
            title: '行业',
            dataIndex: 'industry',
            key: 'industry',
            align:'center',
        },
        {
            title: '目前办公区域',
            dataIndex: 'office_area',
            key: 'office_area',
            align:'center',
        },
        {
            title: '公司名称',
            dataIndex: 'company_name',
            key: 'company_name',
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
                    <div>
                        {text}次
                    </div>
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
                                    {uqx[203]=='1'?<Button type='primary' onClick={()=>checkOpen(record.id)}>审核通过</Button>:''}
                                    <Button type='primary' onClick={()=>toinfo(record.id)}>详情</Button>
                                    <Button type='primary' onClick={()=>toEdit(record.id)}>编辑</Button>
                                </Space>:
                                <>
                                    <Button type='primary' onClick={()=>toinfo(record.id)}>详情</Button>
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
            type:'CheckCustom/check',
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
        getFenye();
        logFenye();
    };
    const getFenye=()=>{
        props.dispatch({
            type:'CheckCustom/fenye',
            payload:{customName,customBeginTime,customEndTime,customStatus,userId,pageSize}
        })
    };
    // 监听名字
    const changeName=(e)=>{
        setCustomName(e.target.value);
        updateSessionStorage('/check/checkCustom/','name',e.target.value);
    };
    // 监听页数
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSzie(pageSize);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"CheckCustom/fetch",
            payload:{page,customName,customBeginTime,customEndTime,customStatus,userId,pageSize}
        })
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setCustomBeginTime('2000-01-01');
            setCustomEndTime('2099-01-01');
            updateSessionStorage('/check/checkCustom/','startDate','2000-01-01');
            updateSessionStorage('/check/checkCustom/','endDate','2099-01-01');
        } else {
            setCustomBeginTime(data[0]);
            setCustomEndTime(data[1]);
            updateSessionStorage('/check/checkCustom/','startDate',data[0]);
            updateSessionStorage('/check/checkCustom/','endDate',data[1]);
        }
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setCustomStatus(e);
        updateSessionStorage('/check/checkCustom/','stutes',e);
    };
    useEffect(() => {
        logFenye();
    }, [page]);
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        getFenye();
    }, []);
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="客户姓名:"
                            onChange={changeName}
                            value={customName}
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
                            {customBeginTime=='2000-01-01'&&customEndTime=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(customBeginTime),dayjs(customEndTime)]}/>}
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
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            {/*    审核通过弹窗*/}
            <Modal open={isOpen} onOk={openOk} onCancel={()=>setIsOpen(false)}>
                <div>
                    确定要审核通过吗？
                </div>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CustomList: state.CheckCustom.list,
        count: state.CheckCustom.count
    }
};

export default connect(mapStateToProps) (CheckCustom)
