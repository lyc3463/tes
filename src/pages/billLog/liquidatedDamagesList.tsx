import {useEffect, useState} from "react";
import * as ArrearsBillService from "@/services/ArrearsBill";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {Button, DatePicker, Input, List, message, Modal, Pagination, Space, Spin, Table, Tag, Tooltip} from "antd";
import dayjs from "dayjs";
import {QuestionCircleOutlined} from "@ant-design/icons";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const LiquidatedDamagesList=()=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [spinning,setspinning]=useState(false);
    const [pageSize,setPageSize]=useState(50);
    // 租户姓名
    const [name,setName]=useState(checkSessionStorage('/billLog/monthlyBill/','liquidatedDamagesListName')||'');
    // 租户id
    const [tenandId,settenandId]=useState(0);
    // 账单开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/billLog/monthlyBill/','liquidatedDamagesListStartDate')||'2000-01-01');
    // 账单结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/billLog/monthlyBill/','liquidatedDamagesListEndDate')||'2099-01-01');
    // 总页码
    const [count,setcount]=useState(0);
    // 列表
    const [dataSource,setdataSource]=useState([]);
    // 租金管理费统计
    const [moneySum,setmoneySum]=useState(0);
    // 租金已交费用统计
    const [NotBillSum,setNotBillSum]=useState(0);
    const [stutes,setstutes]=useState(1);
    const [weiyueListInfo,setweiyueListInfo]=useState([]);
    const [open,setOpen]=useState(false);
    const [sumweiyue,setsumweiyue]=useState(0);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getzujinList();
        logFenye();
    };
    // 查看违约金列表
    const getzujinList=()=>{
        ArrearsBillService.weiyueList({page,name,startDate,endDate,tenandId,stutes,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('res',res)
                setdataSource(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 分页
    const logFenye=()=>{
        ArrearsBillService.weiyueListFenye({name,startDate,endDate,tenandId,stutes,pageSize}).then((res:TypeErrorCode)=>{
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
            title: '日期',
            dataIndex: 'created',
            key: 'created',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.created).format("YYYY-MM-DD")}
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
                            {record.tenant_name==null?<span style={{color:'red'}} >未绑定租户</span>:<span >{record.tenant_name}</span>}
                        </Tooltip>
                    </div>
                )
            },
        },
        {
            title: '账单类型',
            dataIndex: 'billType',
            key: 'billType',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        违约金
                    </div>
                )
            }
        },
        {
            title: '违约天数',
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
            title: '违约金额(元)',
            dataIndex: 'defaultAmount',
            key: 'defaultAmount',
            render:(text:any,record:any)=>{
                return(
                    <Space>
                        {record.defaultAmount}元
                        <Button onClick={()=>toList(record.rentId)}><QuestionCircleOutlined/></Button>
                    </Space>
                )
            }
        },
        {
            title: '已交金额',
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
        {
            title: '未交',
            dataIndex: 'xx',
            key: 'xx',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {(record.defaultAmount-record.stopAmount).toFixed(3)}元
                    </div>
                )
            }
        },
        {
            title: '免除金额',
            dataIndex: 'exemptAmount',
            key: 'exemptAmount',
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
            updateSessionStorage('/billLog/monthlyBill/','liquidatedDamagesListStartDate','2000-01-01');
            updateSessionStorage('/billLog/monthlyBill/','liquidatedDamagesListEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/billLog/monthlyBill/','liquidatedDamagesListStartDate',data[0]);
            updateSessionStorage('/billLog/monthlyBill/','liquidatedDamagesListEndDate',data[1]);
        }
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        logFenye();
    }, []);
    useEffect(() => {
        getzujinList();
    }, [page,pageSize]);
    const toList=(e)=>{
        setOpen(true);
        getweiyuejinInfo(e);
    };
    const getweiyuejinInfo=(e:number)=>{
        ArrearsBillService.weiyuejinInfoList(e).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                setweiyueListInfo(res.Data);
                setspinning(false);
                setsumweiyue(getTotalDefaultAmount(res.Data));

            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    const columnsz=[
        {
            title: '日期',
            dataIndex: 'created',
            key: 'created',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.created).format("YYYY-MM-DD")}
                    </div>
                )
            }
        },
        {
            title: '租金(元)',
            dataIndex: 'rentAmount',
            key: 'rentAmount',
        },
        {
            title: '天数(天)',
            dataIndex: 'defaultNum',
            key: 'defaultNum',

        },
        {
            title: '金额(元)',
            dataIndex: 'defaultAmount',
            key: 'defaultAmount',
        },
    ];
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/billLog/monthlyBill/','liquidatedDamagesListName',e.target.value);
    };
    const getTotalDefaultAmount = (arr) => {
        if (!Array.isArray(arr)) return 0;
        return arr.reduce((total, item) => {
            const amount = item && typeof item.defaultAmount === 'number'
                ? item.defaultAmount
                : 0;
            return total + amount;
        }, 0);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="租户姓名:"
                            value={name}
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
                scroll={{y:'60vh',x:1500}}
                rowKey={(columns) => columns.id}
                size='small'
                summary={(columns) => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={1}> 统计 </Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                            <Table.Summary.Cell index={4}></Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>{moneySum}元</Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
            <Modal open={open} loading={spinning} onCancel={()=>setOpen(false)} onOk={()=>setOpen(false)} title='违约金详情' width={1000}>
                <Table
                    columns={columnsz}
                    pagination={false}
                    dataSource={weiyueListInfo}
                    scroll={{y:'60vh'}}
                    rowKey={(columns) => columns.id}
                    size='small'
                    summary={(columns) => (
                        <Table.Summary fixed>
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0}> 统计 </Table.Summary.Cell>
                                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                                <Table.Summary.Cell index={2}></Table.Summary.Cell>
                                <Table.Summary.Cell index={3}>{sumweiyue}元</Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            </Modal>
        </Spin>
    )
}
export default LiquidatedDamagesList