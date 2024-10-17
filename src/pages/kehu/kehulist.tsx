import {Form, Input, Select, Button, Table, DatePicker, List, Space, Tag, message, Pagination} from "antd";
import {connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {history} from "@@/core/history";
import {Simulate} from "react-dom/test-utils";
import change = Simulate.change;

const Kehulist=(props:any)=>{
    const [name,setName]=useState('');
    const [page,setPage]=useState(1);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
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
            title: '类别',
            dataIndex: 'visitor_type',
            key: 'visitor_type',
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
                    <div>{text}次</div>
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
            width: 100,
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
        props.dispatch({
            type:'CheckCompany/fenye',
            payload:{page,name,startDate,endDate}
        })
        logFenye();
    };
    // 监听名字
    const changeName=(e)=>{
        setName(e.target.value);
    };
    // 监听页数
    const onChange=(page)=>{
        setPage(page);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"CheckCompany/fetch",
            payload:{page,name,startDate,endDate}
        }).then((res:any)=>{
            console.log(res)
        })
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };
    useEffect(() => {
        logFenye();
    }, [page]);

    return (
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
                        <Button type="primary" onClick={suosou}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                scroll={{x:2000}} pagination={false}
                rowKey={(columns) => columns.id}
                dataSource={props.CheckCompanyList}
                size='small'
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
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