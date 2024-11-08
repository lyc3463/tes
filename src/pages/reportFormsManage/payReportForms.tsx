import {connect} from "umi";
import {useState,useEffect} from "react";
import {Button, DatePicker, Form, Input, InputNumber, List, Modal, Pagination, Select, Space, Table} from "antd";
import dayjs from "dayjs";

const PayReportForms=(props)=>{
    const [page,setPage]=useState(1);
    const [phone,setPhone]=useState('');
    const [name,setName]=useState('');
    const [type,setType]=useState(0);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const columns =[
        {
            title: '日期',
            dataIndex: 'consumptionDate',
            key: 'consumptionDate',
            render: (text:any, record:any) => {
                return(
                    <div>{dayjs(record.consumptionDate).format('YYYY-MM-DD')}</div>
                )
            }
        },
        {
            title: '姓名',
            dataIndex: 'appUser_name',
            key: 'appUser_name',
        },
        {
            title: '联系方式',
            dataIndex: 'appUser_phone',
            key: 'appUser_phone',
        },
        {
            title: '类型',
            dataIndex: 'consumptionType',
            key: 'consumptionType',
            render:(_:any,item:any)=>{
                let consumptionTypeText;
                switch (item.consumptionType) {
                    case 1:
                        consumptionTypeText = '充值';
                        break;
                    case 2:
                        consumptionTypeText = '租金';
                        break;
                    case 3:
                        consumptionTypeText = '电费';
                        break;
                    case 4:
                        consumptionTypeText = '水费';
                        break;
                    case 5:
                        consumptionTypeText = '公共缴费';
                        break;
                    case 6:
                        consumptionTypeText = '违约金';
                        break;
                    case 7:
                        consumptionTypeText = '物业管理费';
                        break;
                    case 8:
                        consumptionTypeText = '物业管理费';
                        break;
                    default:
                        consumptionTypeText = '未知类型';
                }
                return (
                    <div>
                        {consumptionTypeText}
                    </div>
                );
            }
        },
        {
            title: '金额(元)/积分(分)',
            dataIndex: 'consumptionMoney',
            key: 'consumptionMoney',
        },
        {
            title: '小程序用户金钱余额(元)',
            dataIndex: 'appUser_balance',
            key: 'appUser_balance',
        },
        {
            title: '小程序用户积分余额(分)',
            dataIndex: 'appUser_integral',
            key: 'appUser_integral',
        },
    ];
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"PayReportForms/fetch",
            payload:{page,name,phone,type,startDate,endDate}
        })
    };
    const sousuo=()=>{
        setPage(1);
        props.dispatch({
            type:'PayReportForms/fenye',
            dispatch:{name,phone,type,startDate,endDate}
        });
        logFenye();
    };
    const onChange=(e)=>{
        setPage(e)
    };
    useEffect(() => {
        logFenye();
        console.log(props)
    }, [page]);
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
                            addonBefore="租户姓名:"
                            onChange={(e)=>setName(e.target.value)}
                        />
                        <Input
                            addonBefore="联系方式:"
                            onChange={(e)=>setPhone(e.target.value)}
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
                                    flexWrap:'wrap',
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
                                    flexWrap:'wrap',
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                }}
                            >
                                缴费类型:
                            </div>
                            <Select
                                defaultValue={type}
                                onChange={(e)=>setType(e)}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:1, label: '充值' },
                                    { value:2, label: '租金' },
                                    { value:3, label: '电费' },
                                    { value:4, label: '水费' },
                                    { value:5, label: '公共缴费' },
                                    { value:6, label: '违约金' },
                                    { value:7, label: '物业管理费' },
                                    { value:8, label: '积分' },
                                ]}
                            />
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
                pagination={false}
                size='small'
                dataSource={props.PayReportFormsList}
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
        PayReportFormsList: state.PayReportForms.list,
        count: state.PayReportForms.count,
    }
};
export default connect(mapStateToProps) (PayReportForms)