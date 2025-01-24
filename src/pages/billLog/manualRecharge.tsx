import {Button, DatePicker, Image, Input, List, Pagination, Select, Space, Table, Tag} from "antd";
import {connect,history} from "umi";
import AppUserType from '@/ModelTypes/TypeAppUser'
import {useEffect, useState} from "react";
import dayjs from "dayjs";
const ManualRecharge=(props)=>{
    const [page,setPage]=useState(1);
    // 状态 0全部，1未审核，2审核通过
    const [stutes,setStutes]=useState(0);
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');

    const columns =[
        {
            title: '充值时间',
            dataIndex: 'created',
            key: 'created',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.created).format("YYYY-MM-DD")}
                    </div>
                )
            }
        },
        {
            title: '微信头像',
            dataIndex: 'appUser_image',
            key: 'appUser_image',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        <Image src={record.appUser_image} style={{width:'50px',height:'50px'}}/>
                    </div>
                )
            }
        },
        {
            title: '联系方式',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '微信昵称',
            dataIndex: 'appUser_name',
            key: 'appUser_name',
        },
        {
            title: '公司名称',
            dataIndex: 'tenantCompany',
            key: 'tenantCompany',
        },
        {
            title: '充值类型',
            dataIndex: 'handType',
            key: 'handType',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.handType==1?<Tag color="red">金额</Tag>:<Tag color="green">积分</Tag>}
                    </div>
                )
            }
        },
        {
            title: '充值金额/积分',
            dataIndex: 'handAmount',
            key: 'handAmount',
        },
        {
            title: '状态',
            dataIndex: 'handStatus',
            key: 'handStatus',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.handStatus==2?<Tag color="green">已审核</Tag>:<Tag color="red">未审核</Tag>}
                    </div>
                )
            }
        },

    ];
    // 搜索按钮
    const shousuo=()=>{
        setPage(1);
        props.dispatch({
            type:'ManualRecharge/fenye',
            payload:{startDate,endDate,stutes}
        });
        logFenye()
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"ManualRecharge/fetch",
            payload:{page,startDate,endDate,stutes}
        })
    };
    // 监听页数
    const onChange=(page)=>{
        setPage(page);

    };
    useEffect(() => {
        logFenye();
        console.log('手动充值记录',props)
    }, [page]);
    const toadd=()=>{
      history.push('/billLog/addChongzhi')
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
    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
    };
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            去充值
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
                        <Button type="primary" onClick={shousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                dataSource={props.ManualRechargeList}
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
        ManualRechargeList: state.ManualRecharge.list,
        count: state.ManualRecharge.count
    }
};
export default connect(mapStateToProps) (ManualRecharge)