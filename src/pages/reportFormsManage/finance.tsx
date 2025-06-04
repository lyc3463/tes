import {connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {Button, DatePicker, Input, List, message, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import * as FinanceService from '@/services/finance';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {exportDataToExcel} from "@/utils/OpenTool";
import {StaticInfo} from "@/StaticInfo";

const Finance=(props)=>{
    const [page,setPage]=useState(1);
    const [spinning,setspinning]=useState(false);
    const [pageSize,setPageSize]=useState(10000);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const [dataSource,setdataSource]=useState([]);
    const [uqx,setUqx]=useState([]);
    const columns =[
        {
            title: '日期',
            dataIndex: 'countDate',
            key: 'countDate',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.countDate).format('YYYY-MM-DD')}
                    </div>
                )
            }
        },
        {
            title: '租户总余额(元)',
            dataIndex: 'balance',
            key: 'balance',
        },
        {
            title: '充值总金额(元)',
            dataIndex: 'rechargeAmount',
            key: 'rechargeAmount',
        },
        {
            title: '扣费总金额(元)',
            dataIndex: 'amount',
            key: 'amount',

        },
        {
            title: '差异(元)',
            dataIndex: 'difference1',
            key: 'difference1',

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
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getFenyeInfo();
        logFenye();
    };
    const getFenyeInfo=()=>{
        props.dispatch({
            type:'Finance/fenye',
            payload:{startDate,endDate,pageSize}
        });
    };
    // 分页
    const logFenye=()=>{
        setspinning(true);
        props.dispatch({
            type:"Finance/fetch",
            payload:{page,startDate,endDate,pageSize}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let a=addDifferenceField(res.Data);
                setdataSource(a);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    useEffect(() => {
        getFenyeInfo();
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const exportToExcel=()=>{
        setspinning(true);
        FinanceService.fetch({page:1,startDate,endDate,pageSize:100000}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let headers=['日期','租户总余额(元)','充值总金额(元)','扣费总金额(元)'];
                const ws_data = [
                    headers.map(header => ({ v: header, t: 's' })), // 表头
                    ...res.Data.map(item => [
                        (dayjs(item.countDate).format("YYYY-MM-DD")), // 提取日期部分
                        item.balance,
                        item.rechargeAmount,
                        item.amount
                    ].map(value => ({ v: value, t: typeof value === 'number' ? 'n' : 's' }))) // 数据行，根据值类型设置单元格类型
                ];
                exportDataToExcel(ws_data);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const  addDifferenceField=(data)=> {
        // 创建一个Map以便快速查找某一天的记录
        const dateMap = new Map();
        data.forEach(item => {
            const date = dayjs(item.countDate).format('YYYY-MM-DD'); // 使用dayjs格式化日期，忽略时间
            dateMap.set(date, item);
        });
        // 处理每条记录
        return data.map(item => {
            const currentDate = dayjs(item.countDate);
            const prevDate = currentDate.subtract(1, 'day').format('YYYY-MM-DD');
            const prevItem = dateMap.get(prevDate);
            let difference = 0;
            if (prevItem) {
                const currentCalc = item.balance - item.rechargeAmount + item.amount;
                difference = currentCalc - prevItem.balance;
            }

            return {
                ...item,
                difference1: parseFloat(difference.toFixed(4)) // 保留4位小数
            };
        });
    }
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        {uqx[384]=='1'?
                            <Button type="primary" onClick={exportToExcel}>
                                导出
                            </Button>:''}
                        {/*<Space.Compact>*/}
                        {/*    <div*/}
                        {/*        style={{*/}
                        {/*            borderRadius: '6px',*/}
                        {/*            borderStartEndRadius: 0,*/}
                        {/*            borderEndEndRadius: 0,*/}
                        {/*            padding: '0 11px',*/}
                        {/*            border: '1px solid #d9d9d9',*/}
                        {/*            display: 'flex',*/}
                        {/*            alignItems: 'center',*/}
                        {/*            borderInlineEnd: 0,*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        时间:*/}
                        {/*    </div>*/}
                        {/*    {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}*/}
                        {/*</Space.Compact>*/}
                        {/*<Button type="primary" onClick={sousuo}>*/}
                        {/*    搜索*/}
                        {/*</Button>*/}
                    </Space>

                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                scroll={{y:'70vh'}}
                rowKey={(columns) => columns.id}
                dataSource={dataSource}
                size='small'
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        FinanceList: state.Finance.list,
        count: state.Finance.count
    }
};
export default connect(mapStateToProps) (Finance)