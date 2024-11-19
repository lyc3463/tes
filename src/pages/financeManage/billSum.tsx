import {connect} from 'umi'
import {Button, DatePicker, List, Pagination, Space, Table, Tag} from "antd";
import dayjs from "dayjs";
import {history} from "@@/core/history";
import {useEffect} from "react";
import {exportDataToExcel} from "@/utils/OpenTool";
const BillSum=(props:any)=>{
    const columns =[
        {
            title: '日期',
            dataIndex: 'billDate',
            key: 'billDate',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.billDate).format('YYYY-MM-DD')}
                    </div>
                )
            }
        },
        {
            title: '编号',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: '摘要',
            dataIndex: 'billAbstract',
            key: 'billAbstract',
        },
        {
            title: '公司',
            dataIndex: 'company_name',
            key: 'company_name',
        },
        {
            title: '项目',
            dataIndex: 'project_name',
            key: 'project_name',
        },
        {
            title: '科目',
            dataIndex: 'subject_name',
            key: 'subject_name',
        },
        {
            title: '收入/支出',
            dataIndex: 'money_type',
            key: 'money_type',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.money_type==1?<Tag color="red">支出</Tag>:<Tag color="green">收入</Tag>}
                    </div>
                )
            }
        },
        {
            title: '收入/支出金额',
            dataIndex: 'billMoney',
            key: 'billMoney',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        <span style={{fontSize:'14px',color:'red'}}>{record.billMoney}<span style={{fontSize:'12px',color:'#555'}}>元</span></span>
                    </div>
                )
            }
        },
        {
            title: '余额',
            dataIndex: 'balance',
            key: 'balance',
            render:(text:any,record:any,)=>{
                return(
                    <Space>
                        <span style={{fontWeight:700}}>{record.balance}</span><span>(元)</span>
                    </Space>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'bill_status',
            key: 'bill_status',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.bill_status==0?<Tag color="red">未审核</Tag>:<Tag color="green">已审核</Tag>}
                    </div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render: (text:any, record:any) => {
                return(
                    <div>
                        <Button type='link' onClick={()=>toInfo(record.id)}>详情</Button>
                    </div>
                )
            }
        },
    ];
    const toInfo=(id:number)=>{
        history.push(`/enter/financialDataInfo?id=${id}`);
    };
    // 导出数据
    const exportToExcel=()=>{
        let headers=['日期','编号','摘要','公司','项目','科目','收入/支出','收入/支出金额(元)','账户余额(元)'];
        const ws_data = [
            headers.map(header => ({ v: header, t: 's' })), // 表头
            ...props.BillSumList.map(item => [
                item.billDate.split('T')[0], // 提取日期部分
                item.number,
                item.billAbstract,
                item.company_name,
                item.project_name,
                item.subject_name,
                item.money_type === 1 ? '支出' : '收入',
                item.billMoney,
                item.balance
            ].map(value => ({ v: value, t: typeof value === 'number' ? 'n' : 's' }))) // 数据行，根据值类型设置单元格类型
        ];
        exportDataToExcel(ws_data);
    };
    useEffect(() => {
        console.log(props)
    }, []);
    return(
        <div>
            <List>
                <List.Item>
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
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                }}
                            >
                                时间:
                            </div>
                            <DatePicker.RangePicker/>
                        </Space.Compact>
                        <Button type="primary">
                            搜索
                        </Button>
                        <Button type="primary" onClick={exportToExcel}>
                            导出
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                size='small'
                rowKey={(columns) => columns.id}
                dataSource={props.BillSumList}
            />
            <Pagination/>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        BillSumList: state.BillSum.list
    }
};
export default connect(mapStateToProps) (BillSum)