import {Form, Input, Select, Button, Table, DatePicker, List, Space, Tag, message, Pagination, Tooltip} from "antd";
import {connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {history} from "@@/core/history";

const Kehulist=(props:any)=>{
    const [name,setName]=useState(localStorage.getItem('kehuKehulistName')||'');
    const [page,setPage]=useState(1);
    const [pageSize,setpageSize]=useState(50);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const [userId,setuserId]=useState(0);
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
                            <Button type='link' onClick={()=>toinfo(record.id)}>详情</Button>
                        </Space>
                    </div>
                )
            }
        },
    ];
    // 前往详情页面
    const toinfo=(e:number)=>{
        history.push(`/enter/customInfo?id=${e}`)
    };
    // 搜索
    const suosou=()=>{
        setPage(1);
        logFenye();
        getFYInfo();
    };
    const getFYInfo=()=>{
        props.dispatch({
            type:'CheckCompany/fenye',
            payload:{name,startDate,endDate,userId,pageSize}
        })
    };
    // 监听名字
    const changeName=(e)=>{
        setName(e.target.value);
        localStorage.setItem('kehuKehulistName',e.target.value);
    };
    // 监听页数
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setpageSize(pageSize);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"CheckCompany/fetch",
            payload:{page,name,startDate,endDate,userId,pageSize}
        })
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            localStorage.setItem('kehuKehulistStartDate','2000-01-01');
            localStorage.setItem('kehuKehulistEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            localStorage.setItem('kehuKehulistStartDate',data[0]);
            localStorage.setItem('kehuKehulistEndDate',data[1]);
        }
    };
    useEffect(() => {
        logFenye();
    }, [page]);
    useEffect(() => {
        getFYInfo();
    }, []);
    return (
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="客户姓名:"
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
                                时间:
                            </div>
                            <DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>
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
                scroll={{x:2000,y:'65vh'}} pagination={false}
                rowKey={(columns) => columns.id}
                dataSource={props.CheckCompanyList}
                size='small'
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </div>
    );
}
const mapStateToProps = (state: any) => {
    return {
        CheckCompanyList: state.CheckCompany.list,
        count: state.CheckCompany.count
    }
};
export default connect(mapStateToProps) (Kehulist)