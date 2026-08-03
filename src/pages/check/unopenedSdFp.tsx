import {connect, history} from 'umi'
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {
    Button,
    DatePicker,
    Form,
    Image,
    Input,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag
} from "antd";
import TypeCheckFp from "@/ModelTypes/TypeCheckFp";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
const UnopenedSdFp=(props:any)=>{
    const [isLoading,setIsLoading]=useState(false);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [type,settype]=useState(checkSessionStorage('/check/checkFp/','unopenedSdFptype')||0);
    const [tenantr,settenantr]=useState(checkSessionStorage('/check/checkFp/','unopenedSdFpTenantr')||0);
    const [stutes,setstutes]=useState(checkSessionStorage('/check/checkFp/','unopenedSdFpStutes')||0);
    const [startDate,setStartDate]=useState(checkSessionStorage('/check/checkFp/','unopenedSdFptypeStartDate')||'2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStorage('/check/checkFp/','unopenedSdFptypeEndDate')||'2099-01-01');
    const [zuhuList,setZuhuList]=useState([]);
    const [sumMoney,setSumMoney]=useState(0);
    const columns =[
        {
            title: '周期',
            dataIndex: 'created',
            key: 'created',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.monthBeginDate).format('YYYY-MM-DD')}至{dayjs(record.monthEndDate).format('YYYY-MM-DD')}
                    </div>
                )
            }
        },
        {
            title: '租户姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '账单类型',
            dataIndex: 'consumptionType',
            key: 'consumptionType',
            render:(_:any,item:any)=>{
                let consumptionTypeText;
                switch (item.billType) {
                    case 1:
                        consumptionTypeText = <Tag style={{ color: '#4CAF50' }}>电费</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag style={{ color: '#F44336' }}>水费</Tag>;
                        break;
                    default:
                        consumptionTypeText = <Tag style={{ color: '#777777' }}>未知类型</Tag>;
                }
                return (
                    consumptionTypeText
                );
            }
        },
        {
            title: '金额(元)',
            dataIndex: 'eleMoney',
            key: 'eleMoney',
            render:(_:any,item:any)=>{
                return(
                    <div>
                        {item.eleMoney.toFixed(2)}
                    </div>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'billStatus',
            key: 'billStatus',
            render:(_:any,item:any)=>{
                let consumptionTypeText;
                switch (item.billStatus) {
                    case 1:
                        consumptionTypeText = <Tag style={{ color: '#4CAF50' }}>未开票</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag style={{ color: '#F44336' }}>已开票</Tag>;
                        break;
                    default:
                        consumptionTypeText = <Tag style={{ color: '#777777' }}>待审核</Tag>;
                }
                return (
                    consumptionTypeText
                );
            }
        }
    ];

    const getList=()=>{
        props.dispatch({
            type:'UnopenedSdFp/fetch',
            payload:{tenantr,type,stutes,startDate,endDate}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                // 计算eleMoney总和
                const total = res.Data.reduce((sum, item) => sum + (item.eleMoney || 0), 0);
                setSumMoney(total);
            }else {
                message.error(res.ErrorCode+res.Data);
            }
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    const changeStutes=(e)=>{
        setstutes(e);
        updateSessionStorage('/check/checkFp/','unopenedSdFpStutes',e);
    };
    useEffect(() => {
        logFenye();
    }, []);
    const logFenye=()=>{
        props.dispatch({
            type:"BYZhuhu/fetch",
            payload:{page:1,name:'',phone:'',pagecount:100000}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setZuhuList(res.Data.data);
            }
        })
    };
    const changeHouse=(e)=>{
        settenantr(e);
        updateSessionStorage('/check/checkFp/','unopenedSdFpTenantr',e);
    };
    const sousuo=()=>{
        getList();
    };
    const changeType=(e)=>{
        settype(e);
        updateSessionStorage('/check/checkFp/','unopenedSdFptype',e);
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/check/checkFp/','unopenedSdFptypeStartDate','2000-01-01');
            updateSessionStorage('/check/checkFp/','unopenedSdFptypeEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/check/checkFp/','unopenedSdFptypeStartDate',data[0]);
            updateSessionStorage('/check/checkFp/','unopenedSdFptypeEndDate',data[1]);
        }
    };
    return(
        <Spin spinning={isLoading}>
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
                                类型:
                            </div>
                            <Select
                                onChange={changeType}
                                value={type}
                                style={{ width: 120 }}
                                options={[
                                    { value: 0, label: '全部' },
                                    { value: 1, label: '电费' },
                                    { value: 2, label: '水费' },
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
                                状态:
                            </div>
                            <Select
                                onChange={changeStutes}
                                value={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value: 0, label: '全部' },
                                    { value: 1, label: '未开票' },
                                    { value: 2, label: '已开票' },
                                    { value: 3, label: '待审核' },
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
                                租户:
                            </div>
                            <Select
                                value={tenantr}
                                onChange={changeHouse}
                                showSearch
                                style={{ width: 300 }}
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    // 假设每个 option 都有一个与数据项对应的 value 属性
                                    const item = zuhuList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                                    return item?.tenant_name?.toLowerCase().includes(input.toLowerCase());
                                }}
                            >
                                <Select.Option value={0} key={0}>
                                    全部
                                </Select.Option>
                                {zuhuList.map((item:any,index:any)=>{
                                    return(
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.tenant_name}-{item.tenant_phone}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
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
                size='small'
                scroll={{y:'60vh'}}
                rowKey={(columns) => columns.id}
                dataSource={props.CheckFpList}
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
                            <Table.Summary.Cell
                                index={7}
                            >
                                {sumMoney.toFixed(2)}元
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckFpList: state.UnopenedSdFp.list,
        count:state.UnopenedSdFp.count
    }
};
export default connect(mapStateToProps) (UnopenedSdFp)