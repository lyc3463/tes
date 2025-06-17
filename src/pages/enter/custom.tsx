import {
    Button,
    DatePicker,
    Input,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Tooltip
} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import { StaticInfo } from '@/StaticInfo';
import CustomType from "@/ModelTypes/TypeCustom";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const Custom=(props:any)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setpageSize]=useState(50);
    // 客户名称
    const [customName,setCustomName]=useState(checkSessionStorage('/enter/custom/','name')||'');
    // 开始时间
    const [customBeginTime,setCustomBeginTime]=useState(checkSessionStorage('/enter/custom/','startDate')||'2000-01-01');
    // 结束时间
    const [customEndTime,setCustomEndTime]=useState(checkSessionStorage('/enter/custom/','endDate')||'2099-01-01');
    // 审核状态  2全部，0未审核，1已审核
    const [customStatus,setCustomStatus]=useState(0);
    // 增加次数的id
    const [aid,setAid]=useState(0);
    // 增加到访次的弹窗
    const [aOpen,setAOpen]=useState(false);
    // 备注
    const [remark,setRemark]=useState('');
    // 删除的id
    const [did,setDid]=useState(0);
    // 删除的弹窗
    const [dopen,setDopen]=useState(false);
    const [spinning,setspinning]=useState(false);
    // 用户权限
    const [uqx,setUqx]=useState([]);
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
                getFenyeInfo();
                logFenye();
            }else {
                message.error(res.Data);
                setAOpen(false);
            }
        })
    };
    const onlikai=()=>{
        setRemark('');
        setAOpen(false);
    };
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
                        <Tooltip title={record.remark}>
                            {record.remark}
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '姓名',
            dataIndex: 'custom_name',
            key: 'custom_name',
            align:'center',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.custom_name}>
                            {record.custom_name}
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '联系方式',
            dataIndex: 'custom_phone',
            key: 'custom_phone',
            align:'center',
        },
        {
            title: '类别',
            dataIndex: 'visitor_type',
            key: 'visitor_type',
            align:'center',
            render:(text:any,record:any,)=>{
                let consumptionTypeText;
                switch (record.visitor_type) {
                    case 1:
                        consumptionTypeText = <Tag color='cyan'>办公</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag color='green'>商业</Tag>;
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
            title: '公司名称',
            dataIndex: 'company_name',
            key: 'company_name',
            align:'center',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.company_name}>
                            {record.company_name}
                        </Tooltip>
                    </div>
                )
            }
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
            title: '录入人',
            dataIndex: 'user_name',
            key: 'user_name',
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
            dataIndex: 'cao',
            key: 'cao',
            fixed: 'right',
            align:'center',
            width: 200,
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        <Space>
                            {record.custom_sattus==0?<>
                                    {uqx[155]=='1'?<Button type='primary' onClick={()=>toEdit(record.id)}>编辑</Button>:''}
                                    {uqx[156]=='1'?<Button type='primary' danger onClick={()=>isdel(record.id)}>删除</Button>:''}
                                    {uqx[342]=='1'?<Button type='primary' onClick={()=>onaddNum(record)}>增加到访次数</Button>:''}
                                </>
                                :''}
                            <Button type='primary' onClick={()=>toinfo(record.id)}>详情</Button>
                        </Space>
                    </div>
                )
            }
        },
    ];
    const toadd=()=>{
        history.push('/enter/addCustom')
    };
    const toEdit=(e:number)=>{
        history.push(`/enter/editCustom?id=${e}`)
    };
    const toinfo=(e:number)=>{
        history.push(`/enter/customInfo?id=${e}`)
    };
    // 删除的弹窗
    const isdel=(e)=>{
        setDid(e);
        setDopen(true);
    };
    // 确定删除按钮
    const dopenOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'Custom/remove',
            payload:did
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setDopen(false);
                getFenyeInfo();
                logFenye();
                message.success('删除成功');
            }else{
                setspinning(false);
                setDopen(false);
                message.success(res.Data);
            }
        })
    };
    // 搜索
    const suosou=()=>{
        setPage(1);
        getFenyeInfo();
        logFenye();
    };
    const getFenyeInfo=()=>{
        props.dispatch({
            type:'Custom/fenye',
            payload:{customName,customBeginTime,customEndTime,customStatus,userId:StaticInfo.userId,pageSize}
        })
    };
    // 监听名字
    const changeName=(e)=>{
        setCustomName(e.target.value);
        updateSessionStorage('/enter/custom/','name',e.target.value);
    };
    // 监听页数
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setpageSize(pageSize);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Custom/fetch",
            payload:{page,customName,customBeginTime,customEndTime,customStatus,userId:StaticInfo.userId,pageSize}
        })
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setCustomBeginTime('2000-01-01');
            setCustomEndTime('2099-01-01');
            updateSessionStorage('/enter/custom/','startDate','2000-01-01');
            updateSessionStorage('/enter/custom/','endDate','2099-01-01');
        } else {
            setCustomBeginTime(data[0]);
            setCustomEndTime(data[1]);
            updateSessionStorage('/enter/custom/','startDate',data[0]);
            updateSessionStorage('/enter/custom/','endDate',data[1]);
        }
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setCustomStatus(e);
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        getFenyeInfo();
    }, []);
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <div>
                        {uqx[154]=='1'?<Button type="primary" onClick={toadd}>客户录入</Button>:''}
                    </div>
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
                        <Button type="primary" onClick={suosou}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                scroll={{x:2000,y:'60vh'}} pagination={false}
                rowKey={(columns) => columns.id}
                dataSource={props.CustomList}
                size='small'
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            {/*    到访次数弹窗*/}
            <Modal open={aOpen} onOk={aopenOK} onCancel={onlikai}>
                <Input.TextArea value={remark} onChange={(e)=>setRemark(e.target.value)}/>
            </Modal>
        {/*    删除的弹窗*/}
            <Modal open={dopen} onOk={dopenOk} onCancel={()=>setDopen(false)} loading={spinning}>
                是否要删除?
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CustomList: state.Custom.list,
        count: state.Custom.count
    }
};
export default connect(mapStateToProps) (Custom)