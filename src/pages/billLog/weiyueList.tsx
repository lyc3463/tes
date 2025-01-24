import {connect} from "umi";
import {Button, DatePicker, Input, List, Space, Table} from "antd";
import {useState} from "react";
import dayjs from "dayjs";
import * as AccountService from '@/services/zdListServer';
const WeiyueList=(props:any)=>{
    const [page,setPage]=useState(1);
    // 租户姓名
    const [name,setName]=useState('');
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    const columns =[
        {
            title: '日期',
            dataIndex: 'payrentDate',
            key: 'payrentDate',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.payrentDate).format("YYYY-MM-DD")}
                    </div>
                )
            }
        },
        {
            title: '租户姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '类型',
            dataIndex: 'billType',
            key: 'billType',
        },
        {
            title: '缴费金额(元)',
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
        // {
        //     title: '违约金(元)',
        //     dataIndex: 'defaultAmount',
        //     key: 'defaultAmount',
        //     render:(text:any,record:any)=>{
        //         return(
        //             <div>
        //                 {record.defaultAmount}元
        //             </div>
        //         )
        //     }
        // },
        {
            title: '已交金额(元)',
            dataIndex: 'stopAmount',
            key: 'stopAmount',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.stopAmount}元
                    </div>
                )
            }
        },
    ];
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
    // 搜索按钮
    const sousuo=()=>{
        setPage(1);
        props.dispatch({
            type:'MonthlyBill/fenye',
            // payload:{name,billtype,startDate,endDate,tenantId}
        })
        // logfenye();
    };
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="租户姓名:"
                            onChange={(e)=>setName(e.target.value)}
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
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                size='small'
                pagination={false}
                dataSource={props.MonthlyBillList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
                summary={(columns) => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={1}>统计</Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                            <Table.Summary.Cell index={4}>元</Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>元</Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {/*{props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}*/}
        </div>
    )
}
export default connect() (WeiyueList)