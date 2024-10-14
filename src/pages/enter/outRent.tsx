import {Button, DatePicker, Input, List, Pagination, Select, Space, Table} from "antd";
import dayjs from "dayjs";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
const OutRent=(props:any)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    // 手机号
    const [phone,setPhone]=useState('');
    // 状态 0全部，1未审核，2审核通过
    const [stutes,setStutes]=useState(0);
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    const columns =[
        {
            title: '日期',
            dataIndex: 'created',
            key: 'created',
            render:(_:any,record:any)=>(
                <div>
                    {dayjs(record.created).format("YYYY-MM-DD")}
                </div>
            )
        },
        {
            title: '合同编号',
            dataIndex: 'identifier',
            key: 'identifier',
        },
        {
            title: '租户名字',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '联系方式',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '申请退租日期',
            dataIndex: 'refundData',
            key: 'refundData',
            render:(_:any,record:any)=>(
                <div>
                    {dayjs(record.refundData).format("YYYY-MM-DD")}
                </div>
            )
        },
        {
            title: '退租原因',
            dataIndex: 'refundReason',
            key: 'refundReason',
            render:(_:any,record:any)=>(
                <div>
                    <Input.TextArea value={record.refundReason}/>
                </div>
            )
        },
        {
            title: '状态',
            dataIndex: 'sturs',
            key: 'sturs',
            render:(text:any,record:any,)=>{
                return(
                    <div>{record.sturs==1?"已通过":"未审核"}</div>
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
                        <Button type='link'>详情</Button>
                        {record.sturs==2?'':<Button type='link'>编辑</Button>}
                    </Space>
                )
            }
        }
    ];
    const toadd=()=>{
        history.push('/enter/addOutRent')
    };
    // 监听页数
    const onChange=(page)=>{
        setPage(page);
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
    // 监听姓名
    const changePhone=(e)=>{
        setPhone(e.target.value);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"OutRent/fetch",
            payload:{page,phone,stutes,startDate,endDate}
        })
    };
    useEffect(() => {
        logFenye();
    }, [page]);
    // 搜索
    const suosou=()=>{
        setPage(1);
        props.dispatch({
            type:'OutRent/fenye',
            payload:{phone,stutes,startDate,endDate}
        })
        logFenye();
    };
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            退租录入
                        </Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="原手机号:"
                            onChange={changePhone}
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
                                defaultValue={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:1, label: '未审核' },
                                    { value:2, label: '已审核' },
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
                rowKey={(columns) => columns.id}
                pagination={false}
                size='small'
                dataSource={props.OutRentList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} pageSize={1} current={page}  onChange={onChange} pageSizeOptions={[1]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        OutRentList: state.OutRent.list,
        count: state.OutRent.count,
    }
};
export default  connect(mapStateToProps)(OutRent)