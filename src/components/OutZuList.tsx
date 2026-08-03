import {connect} from "umi";
import {Button, DatePicker, Image, Input, List, message, Pagination, Select, Space, Table, Tag, Tooltip} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import * as ArrearsBillService from '@/services/ArrearsBill';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";


const OutZuList=(props:any)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState(checkSessionStorage('/billLog/outMonthlyBill/','outZuListName')||'');
    const [phone,setPhone]=useState(checkSessionStorage('/billLog/outMonthlyBill/','outZuListPhone')||'');
    const [tenandId,settenandId]=useState(0);
    const [startDate,setStartDate]=useState(checkSessionStorage('/billLog/outMonthlyBill/','outZuListStartDate')||'2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStorage('/billLog/outMonthlyBill/','outZuListEndDate')||'2099-01-01');
    // 总页码
    const [count,setcount]=useState(0);
    const [stutes,setstutes]=useState(3);
    // 列表
    const [dataSource,setdataSource]=useState([]);
    // 租金管理费统计
    const [moneySum,setmoneySum]=useState(0);
    // 租金已交费用统计
    const [NotBillSum,setNotBillSum]=useState(0);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getzujinList();
        // logFenye();
    };
    // 查看租金缴费列表
    const getzujinList=()=>{
        ArrearsBillService.zujinList({page,name,phone,startDate,endDate,tenandId,stutes,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('res',res);
                setdataSource(res.Data.data);
                setcount(res.Data.count);
                setmoneySum(res.Data.billSum);
                setNotBillSum(res.Data.NotBillSum);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 分页
    const logFenye=()=>{
        ArrearsBillService.zujinListFenye({name,phone,startDate,endDate,tenandId,stutes,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setmoneySum(res.Data.moneySum);
                setNotBillSum(res.Data.NotBillSum);
            }else {
                message.error(res.Data);
            }
        })
    };
    const columns =[
        {
            title: '账单周期',
            dataIndex: 'payrentDate',
            key: 'payrentDate',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.billBeginDate).format("YYYY-MM-DD")}至{dayjs(record.billEndDate).format("YYYY-MM-DD")}
                    </div>
                )
            }
        },
        {
            title: '租户姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            render: (text:any, record:any) => {
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.tenant_name}>
                            <span >{record.tenant_name}</span>
                        </Tooltip>
                    </div>
                )
            },
        },
        {
            title: '租户手机号',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '账单类型',
            dataIndex: 'billType',
            key: 'billType',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        租金/管理费
                    </div>
                )
            }
        },
        {
            title: '缴费金额(元)',
            dataIndex: 'payAmount',
            key: 'payAmount',
            render:(text:any,record:any)=>{
                return(
                    <div style={{color:'red'}}>
                        {record.payAmount}元
                    </div>
                )
            }
        },
        {
            title: '已交金额(元)',
            dataIndex: 'stopAmount',
            key: 'stopAmount',
            render:(text:any,record:any)=>{
                return(
                    <div style={{color:'red'}}>
                        {record.stopAmount}元
                    </div>
                )
            }
        },
        {
            title: '违约金天数',
            dataIndex: 'defaultNum',
            key: 'defaultNum',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.defaultNum}天
                    </div>
                )
            }
        },
        {
            title: '违约金(元)',
            dataIndex: 'defaultAmount',
            key: 'defaultAmount',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.defaultAmount}元
                    </div>
                )
            }
        },
        {
            title: '优惠金额',
            dataIndex: 'preRen',
            key: 'preRen',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.preRen}元
                    </div>
                )
            }
        },
        {
            title: '优惠前租金',
            dataIndex: 'xx',
            key: 'xx',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.preRen+record.payAmount}元
                    </div>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'billStatus',
            key: 'billStatus',
            render:(text:any,record:any)=>{
                let consumptionTypeText;
                switch (record.billStatus) {
                    case 1:
                        consumptionTypeText = <Tag style={{ color: '#2196F3' }}>未交</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag style={{ color: '#4CAF50' }}>已交</Tag>;
                        break;
                    case 3:
                        consumptionTypeText = <Tag style={{ color: '#F44336' }}>退租</Tag>;
                        break;
                    default:
                        consumptionTypeText = <Tag style={{ color: '#777777' }}>未知类型</Tag>;
                }
                return(
                    <div>
                        {consumptionTypeText}
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
            updateSessionStorage('/billLog/outMonthlyBill/','outZuListStartDate','2000-01-01');
            updateSessionStorage('/billLog/outMonthlyBill/','outZuListEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/billLog/outMonthlyBill/','outZuListStartDate',data[0]);
            updateSessionStorage('/billLog/outMonthlyBill/','outZuListEndDate',data[1]);
        }
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // useEffect(() => {
    //     logFenye();
    // }, []);
    useEffect(() => {
        getzujinList();
    }, [page,pageSize]);
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/billLog/outMonthlyBill/','outZuListName',e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/billLog/outMonthlyBill/','outZuListPhone',e.target.value);
    };
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="姓名:"
                            value={name}
                        />
                        <Input
                            onChange={changePhone}
                            addonBefore="手机号:"
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
                dataSource={dataSource}
                scroll={{y:'70vh',x:1500}}
                rowKey={(columns) => columns.id}
                size='small'
                summary={(columns) => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={1}> 统计 </Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                            <Table.Summary.Cell index={4}></Table.Summary.Cell>
                            <Table.Summary.Cell index={5}><span style={{color:"red"}}>{moneySum}元</span></Table.Summary.Cell>

                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
        </div>
    )
}
export default connect() (OutZuList)