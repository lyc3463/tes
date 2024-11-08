import {connect} from "umi";
import {Button, DatePicker, Image, Input, List, Pagination, Select, Space, Table, Tag} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";

const CableRate=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [type,setType]=useState(3);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    // 搜索
    const sousuo=()=>{
        setPage(1);
        props.dispatch({
            type:'RechargeRate/fenye',
            payload:{name,phone,type,startDate,endDate}
        });
        logFenye();
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"RechargeRate/fetch",
            payload:{page,name,phone,type,startDate,endDate}
        })
    };
    // 监听页数
    const onChange=(e:number)=>{
        setPage(e);
    };
    useEffect(() => {
        logFenye();
        console.log(props)
    }, [page]);
    const columns =[
        {
            title: '日期',
            dataIndex: 'estarttime',
            key: 'estarttime',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.estarttime).format('YYYY-MM-DD')}
                    </div>
                )
            }
        },
        {
            title: '姓名',
            dataIndex: 'appUser_name',
            key: 'appUser_name',
        },
        {
            title: '手机号',
            dataIndex: 'appUser_phone',
            key: 'appUser_phone',
        },
        {
            title: '类型',
            dataIndex: 'consumptionType',
            key: 'consumptionType',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.consumptionType==1?<Tag color='green'>充值</Tag>:<Tag color='red'>未知</Tag>}
                    </div>
                )
            }
        },
        {
            title: '充值金额(元)',
            dataIndex: 'consumptionMoney',
            key: 'consumptionMoney',
        },
        {
            title: '用户余额(元)',
            dataIndex: 'appUser_balance',
            key: 'appUser_balance',
        },
        {
            title: '用户积分余额(分)',
            dataIndex: 'appUser_integral',
            key: 'appUser_integral',
        },
    ];
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
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={(e)=>setName(e.target.value)}
                            addonBefore="姓名:"
                        />
                        <Input
                            onChange={(e)=>setPhone(e.target.value)}
                            addonBefore="手机号:"
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
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                dataSource={props.RechargeRateList}
                scroll={{y:'70vh'}}
                rowKey={(columns) => columns.id}
                size='small'
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        RechargeRateList: state.RechargeRate.list,
        count: state.RechargeRate.count,
    }
};
export default connect(mapStateToProps) (CableRate)