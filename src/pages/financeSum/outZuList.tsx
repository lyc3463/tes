import {useEffect, useState} from "react";
import {Button, DatePicker, Form, Input, InputNumber, List, Modal, Pagination, Space, Spin, Table, Tag} from "antd";
import dayjs from "dayjs";
import {connect} from "umi";

const OutZuList=(props)=>{
    // 转圈
    const [spinning,setspinning]=useState(false);
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 租户名字
    const [name,setName]=useState(sessionStorage.getItem('financeSumOutZuListName')||'');
    // 手机号
    const [phone,setPhone]=useState(sessionStorage.getItem('financeSumOutZuListPhone')||'');
    // 开始时间
    const [startDate,setStartDate]=useState(sessionStorage.getItem('financeSumOutZuListStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(sessionStorage.getItem('financeSumOutZuListEndDate')||'2099-01-01');
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            sessionStorage.setItem('financeSumOutZuListStartDate','2000-01-01');
            sessionStorage.setItem('financeSumOutZuListEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            sessionStorage.setItem('financeSumOutZuListStartDate',data[0]);
            sessionStorage.setItem('financeSumOutZuListEndDate',data[1]);
        }
    };
    const columns =[
        {
            title: '日期',
            dataIndex: 'created',
            key: 'created',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.created).format("YYYY-MM-DD HH:mm:ss")}
                    </div>
                )
            }
        },
        {
            title: '租户姓名',
            dataIndex: 'tenantName',
            key: 'tenantName',
        },
        {
            title: '租户手机号',
            dataIndex: 'tenantPhone',
            key: 'tenantPhone',
        },
        {
            title: '已交金额',
            dataIndex: 'payAmount',
            key: 'payAmount',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.payAmount}元
                    </div>
                )
            }
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        <Input.TextArea value={record.remark}></Input.TextArea>
                    </div>
                )
            }
        },
    ];
    const sousuo=()=>{
        setPage(1);
        logFney();
        getList();
    };
    const logFney=()=>{
        props.dispatch({
            type:'OutZuList/fenye',
            payload:{name,phone,startDate,endDate,pageSize}
        })
    };
    // 获取账单列表
    const getList=()=>{
        props.dispatch({
            type:'OutZuList/fetch',
            payload:{page,name,phone,startDate,endDate,pageSize}
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    // 监听页数
    const onChange=(page,pageSize)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    useEffect(() => {
        logFney();
    }, []);
    const changeName=(e)=>{
        setName(e.target.value);
        sessionStorage.setItem('financeSumOutZuListName',e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
        sessionStorage.setItem('financeSumOutZuListPhone',e.target.value);
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
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                scroll={{y:'60vh'}}
                rowKey={(columns) => columns.id}
                size='small'
                dataSource={props.OutZuList}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        OutZuList: state.OutZuList.list,
        count: state.OutZuList.count,
    }
};
export default connect(mapStateToProps)(OutZuList)