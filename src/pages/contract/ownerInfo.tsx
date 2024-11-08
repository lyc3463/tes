import {Button, DatePicker, Input, List, Pagination, Select, Space, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useState} from "react";
import dayjs from "dayjs";

const OwnerInfo=(props)=>{
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const toadd=()=>{
      history.push('/contract/addOwnerlnfo/');
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };
    const sousuo=()=>{

    };
    const columns =[
        {
            title: '合同编号',
            dataIndex: 'identifier',
            key: 'identifier',
            align:'center',
        },
        {
            title: '租户',
            dataIndex: 'customName',
            key: 'customName',
            align:'center',
        },
        {
            title: '起租日',
            dataIndex: 'beginTime',
            key: 'beginTime',
            align:'center',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {dayjs(record.beginTime).format("YYYY-MM-DD")}
                    </div>
                )
            }
        },
        {
            title: '租金',
            dataIndex: 'zuMoney',
            key: 'zuMoney',
            align:'center',
        },
        {
            title: '押金',
            dataIndex: 'deposit',
            key: 'deposit',
            align:'center',
        },

    ];
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            业主信息录入
                        </Button>
                    </div>
                    <Space>
                        <Space.Compact>
                            <div
                                style={{
                                    borderRadius: '6px',
                                    borderStartEndRadius: 0,
                                    borderEndEndRadius: 0,
                                    padding: '0 11px',
                                    border: '1px solid #d9d9d9',
                                    display: 'flex',
                                    flexWrap:'wrap',
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                }}
                            >
                                日期:
                            </div>
                            <DatePicker.RangePicker onChange={changeDate}/>
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
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
                dataSource={props.StaffList}
            />
            {/*{props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}*/}
        </div>
    )
}
export default connect() (OwnerInfo)