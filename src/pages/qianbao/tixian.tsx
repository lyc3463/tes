import {Button, DatePicker, Form, Input, List, Pagination, Select, Space, Table, Tag} from "antd";
import {connect} from "umi";
import {useEffect, useState} from "react";
import {Simulate} from "react-dom/test-utils";
import change = Simulate.change;

const Tixian=(props:any)=>{
    const [page,setPage]=useState(1);
    const [stutes,setStutes]=useState(0);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const columns =[
        {
            title: '提现银行卡',
            dataIndex: 'cardId',
            key: 'cardId',
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
            title: '实际扣款',
            dataIndex: 'tuijine',
            key: 'tuijine',
            render:(text,record)=>{
                return(
                    <div>{(record.withdAmount+(record.withdAmount*(record.commission/1000))).toFixed(2)}元</div>
                )
            }
        },
        {
            title: '到账金额(元)',
            dataIndex: 'withdAmount',
            key: 'withdAmount',
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
                        {record.withdStatus==1?<Tag color='red'>未提现</Tag>
                           :<Tag color='green'>已提现</Tag>}
                    </Space>
                )
            }
        }
    ];
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Tixian/fetch",
            payload:{page,stutes,startDate,endDate}
        })
    };
    const sousuo=()=>{
        setPage(1);
        props.dispatch({
            type:"Tixian/fenye",
            payload:{stutes,startDate,endDate}
        });
        logFenye();
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
    const  onChange=(e)=>{
        setPage(e)
    };
    useEffect(() => {
        logFenye();
    }, [page]);
    return(
        <div>
            <span style={{color:'red',fontSize:'12px'}}>实际扣款=提现金额+(提现金额*手续费比例)</span>
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
                                收费类型:
                            </div>
                            <Select
                                onChange={(e:number)=>setStutes(e)}
                                defaultValue={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value: 0, label: '全部' },
                                    { value: 1, label: '未审核' },
                                    { value: 2, label: '已审核' },
                                    // { value: 3, label: '押金类收费' },
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
                dataSource={props.TixianList}
                pagination={false}
                size='small'
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
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