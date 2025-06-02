import {Button, DatePicker, Form, Input, List, Pagination, Select, Space, Table, Tag} from "antd";
import {connect} from "umi";
import {useEffect, useState} from "react";
import {Simulate} from "react-dom/test-utils";
import change = Simulate.change;
import dayjs from "dayjs";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const Tixian=(props:any)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [stutes,setStutes]=useState(0);
    const [startDate,setStartDate]=useState(checkSessionStorage('/qianbao/tixian/','startDate')||'2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStorage('/qianbao/tixian/','endDate')||'2099-01-01');
    const columns =[
        {
            title: '日期',
            dataIndex: 'created',
            key: 'created',
            render:(text,record)=>{
                return(
                    <div>{dayjs(record.created).format("YYYY-MM-DD HH:mm:ss")}</div>
                )
            }
        },
        {
            title: '银行卡号',
            dataIndex: 'cardId',
            key: 'cardId',
        },
        {
            title: '户名',
            dataIndex: 'accountName',
            key: 'accountName',
        },
        {
            title: '开户行',
            dataIndex: 'bankName',
            key: 'bankName',
        },
        {
            title: '提现申请人',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: '提现金额(元)',
            dataIndex: 'withdAmount',
            key: 'withdAmount',
        },
        {
            title: '手续费比例',
            dataIndex: 'commission',
            key: 'commission',
            render:(text,record)=>{
                return(
                    <div>{record.commission/1000}</div>
                )
            }
        },
        {
            title: '到账金额(元)',
            dataIndex: 'withdAmount',
            key: 'withdAmount',
            render:(text,record)=>{
                return(
                    <div>{(record.withdAmount-(record.withdAmount*0.006)).toFixed(2)}元</div>
                )
            }
        },
        {
            title: '交易说明',
            dataIndex: 'remark',
            key: 'remark',
            render:(text,record)=>{
                return(
                    <Input.TextArea value={text}/>
                )
            }
        },
        {
            title: '交易状态',
            dataIndex: 'withdStatus',
            key: 'withdStatus',
            render:(text:any,record:any)=>{
                return(
                    <Space>
                        {record.withdStatus === 1 ? (
                            <Tag color='red'>未审核</Tag>
                        ) : record.withdStatus === 2 ? (
                            <Tag color='blue'>已审核</Tag>
                        ) : record.withdStatus === 3 ? (
                            <Tag color='orange'>未通过</Tag>
                        ) : (
                            <Tag color='grey'>未知状态</Tag> // 例如，当 withdStatus 不是 1、2 或 3 时
                        )}
                    </Space>
                )
            }
        }
    ];
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Tixian/fetch",
            payload:{page,stutes,startDate,endDate,pageSize}
        })
    };
    const sousuo=()=>{
        setPage(1);
        getFenye();
        logFenye();
    };
    const getFenye=()=>{
        props.dispatch({
            type:"Tixian/fenye",
            payload:{stutes,startDate,endDate,pageSize}
        });
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/qianbao/tixian/','startDate','2000-01-01');
            updateSessionStorage('/qianbao/tixian/','endDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/qianbao/tixian/','startDate',data[0]);
            updateSessionStorage('/qianbao/tixian/','endDate',data[1]);
        }
    };
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    useEffect(() => {
        getFenye();
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
                                状态:
                            </div>
                            <Select
                                onChange={(e:number)=>setStutes(e)}
                                defaultValue={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value: 0, label: '全部' },
                                    { value: 1, label: '未审核' },
                                    { value: 2, label: '已审核' },
                                    { value: 3, label: '未通过' },
                                ]}
                            />
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
                                时间:
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
                rowKey={(columns) => columns.id}
                dataSource={props.TixianList}
                pagination={false}
                size='small'
                scroll={{y:'60vh'}}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
                summary={(columns) => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell
                                index={1}
                            >
                                统计
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell
                                index={7}
                            >
                                {props.count?props.count.withdAmountSum:''}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={8}>
                                {props.count?props.count.actualAmountSum:''}元
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        TixianList: state.Tixian.list,
        count: state.Tixian.count
    }
};
export default connect(mapStateToProps)(Tixian)