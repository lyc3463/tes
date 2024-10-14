import {Button, DatePicker, Input, List, Pagination, Select, Space, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";

const Custom=(props:any)=>{
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
                            {record.custom_sattus==0?<Button type='link' onClick={()=>toEdit(record.id)}>编辑</Button>:''}
                            <Button type='link' onClick={()=>toinfo(record.id)}>详情</Button>
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
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            客户录入
                        </Button>
                    </div>
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
                scroll={{x:2000}} pagination={false}
                rowKey={(columns) => columns.id}
                dataSource={props.CustomList}
                size='small'
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CustomList: state.Custom.list,
        count: state.Custom.count

    }
};
export default connect(mapStateToProps) (Custom)