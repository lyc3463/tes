import {connect} from "umi";
import {
    Button,
    DatePicker,
    Image,
    Input,
    List,
    message,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Tooltip
} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import * as dateWaterService from '@/services/dateWater';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";


const WaterPrepaidList=()=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 租户姓名
    const [name,setName]=useState(checkSessionStorage('/billLog/monthlyBill/','waterPrepaidListName')||'');
    // 表地址
    const [cid,setCid]=useState(checkSessionStorage('/billLog/monthlyBill/','waterPrepaidListCid')||'');
    // 开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/billLog/monthlyBill/','waterPrepaidListStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/billLog/monthlyBill/','waterPrepaidListEndDate')||'2099-01-01');
    // 租户ID
    const [tenantId,settenantId]=useState(0);
    // 水费扣费列表
    const [waterRatelist,setwaterRateList]=useState([]);
    // 总条数
    const [count,setcount]=useState(0);
    const [spinning,setspinning]=useState(false);
    // 水费扣费统计
    const [moneySum,setmoneySum]=useState(0);
    // 扣费状态
    const [recordStatus,setrecordStatus]=useState('余额不足');
    // 消耗度数累加
    const [energyUsage,setenergyUsage]=useState(0);
    // 获取水表扣费记录
    const getwaterRateList=()=>{
        setspinning(true);
        dateWaterService.fetch(page,cid,name,startDate,endDate,tenantId,recordStatus,'',pageSize).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setwaterRateList(res.Data);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    // 获取水表扣费记录分页
    const getwaterFenye=()=>{
        dateWaterService.fenye(cid,name,startDate,endDate,tenantId,recordStatus,'',pageSize).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setmoneySum(res.Data.moneySum);
                setenergyUsage(res.Data.energyUsage);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getwaterRateList();
        getwaterFenye();
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        getwaterFenye();
    }, []);
    useEffect(() => {
        getwaterRateList();
    }, [page,pageSize]);
    const columns =[
        {
            title: '日期',
            dataIndex: 'recordTime',
            key: 'recordTime',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.recordTime).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                )
            }
        },
        {
            title: '姓名',
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
            title: '水表地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '类型',
            dataIndex: 'consumptionType',
            key: 'consumptionType',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        <Tag  color='green'>水费</Tag>
                    </div>
                )
            }
        },
        {
            title: '度数',
            dataIndex: 'energyNew',
            key: 'energyNew',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        <Tag  color='warning'>{record.energyNew}m³</Tag>
                    </div>
                )
            }
        },

        {
            title: '消耗度数',
            dataIndex: 'energyUsage1',
            key: 'energyUsage1',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        <Tag  color='warning'>{(record.energyNew-record.energyOld).toFixed(3)}m³</Tag>
                    </div>
                )
            }
        },
        {
            title: '扣费金额',
            dataIndex: 'energyUsage',
            key: 'energyUsage',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        <Tag  color='blue'>{record.energyUsage}元</Tag>
                    </div>
                )
            }
        },
    ];
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/billLog/monthlyBill/','waterKoufeiListStartDate','2000-01-01');
            updateSessionStorage('/billLog/monthlyBill/','waterKoufeiListEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/billLog/monthlyBill/','waterKoufeiListStartDate',data[0]);
            updateSessionStorage('/billLog/monthlyBill/','waterKoufeiListEndDate',data[1]);
        }
    };
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/billLog/monthlyBill/','waterKoufeiListName',e.target.value);
    };
    const changeCid=(e)=>{
        setCid(e.target.value);
        updateSessionStorage('/billLog/monthlyBill/','waterKoufeiListCid',e.target.value);
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
                        <Input
                            onChange={changeCid}
                            addonBefore="水表地址:"
                            value={cid}
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
                dataSource={waterRatelist}
                scroll={{y:'60vh'}}
                rowKey={(columns) => columns.id}
                size='small'
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

                            <Table.Summary.Cell index={5}>
                                {energyUsage}m³
                            </Table.Summary.Cell>
                            <Table.Summary.Cell
                                index={6}
                            >
                                {moneySum}元
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
        </Spin>
    )
}
export default WaterPrepaidList
