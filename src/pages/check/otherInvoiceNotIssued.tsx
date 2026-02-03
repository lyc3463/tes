import * as UnopenedFpListService from '@/services/unopenedFpList';
import {useEffect, useState} from "react";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import dayjs from "dayjs";
import {Button, DatePicker, Input, List, message, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {otherfetch} from "@/services/unopenedFpList";

const OtherInvoiceNotIssued = () => {
    const [isLoading,setIsLoading]=useState(false);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [type,settype]=useState(checkSessionStorage('/check/checkFp/','unopeneadllFpType')||0);
    const [name,setName]=useState(checkSessionStorage('/check/checkFp/','unopeneadllFpTenantr')||'');
    const [stutes,setstutes]=useState(checkSessionStorage('/check/checkFp/','unopeneadllFpStutes')||0);
    const [phone,setPhone]=useState(checkSessionStorage('/check/checkFp/','unopeneadllFpPhone')||'');
    const [zuhuList,setZuhuList]=useState([]);
    const [userId,setUserId]=useState(0);
    const [sumMoney,setSumMoney]=useState(0);
    const [count,setcount]=useState(0);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const columns =[
        {
            title: '日期',
            dataIndex: 'payrentDate',
            key: 'payrentDate',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(text).format('YYYY-MM-DD')}
                    </div>
                )
            }
        },
        {
            title: '姓名',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '账单类型',
            dataIndex: 'consumptionType',
            key: 'consumptionType',
            render:(_:any,item:any)=>{
                let consumptionTypeText;
                switch (item.billType) {
                    case 1:
                        consumptionTypeText = <Tag style={{ color: '#4CAF50' }}>微信充值</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag style={{ color: '#F44336' }}>租金/管理费</Tag>;
                        break;
                    case 3:
                        consumptionTypeText = <Tag style={{ color: '#2196F3' }}>电费</Tag>;
                        break;
                    case 4:
                        consumptionTypeText = <Tag style={{ color: '#FFC107' }}>水费</Tag>;
                        break;
                    case 5:
                        consumptionTypeText = <Tag style={{ color: '#9C27B0' }}>公共缴费</Tag>;
                        break;
                    case 6:
                        consumptionTypeText = <Tag style={{ color: '#E91E63' }}>手动充值</Tag>;
                        break;
                    case 7:
                        consumptionTypeText = <Tag style={{ color: '#795548' }}>服务费</Tag>;
                        break;
                    case 8:
                        consumptionTypeText = <Tag style={{ color: '#795548' }}>违约金</Tag>;
                        break;
                    case 9:
                        consumptionTypeText = <Tag style={{ color: '#795558' }}>月保</Tag>;
                        break;
                    case 11:
                        consumptionTypeText = <Tag style={{ color: '#795558' }}>报修</Tag>;
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
                        {item.payAmount.toFixed(2)}
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
    // 获取租金未开记录
    const getList=()=>{
        UnopenedFpListService.otherfetch(page,name,phone,userId,type,stutes,pageSize,startDate,endDate).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setZuhuList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 获取租金未开记录
    const getfenye=()=>{
        UnopenedFpListService.otherfenye(name,phone,userId,type,stutes,pageSize,startDate,endDate).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setSumMoney(res.Data.moneySum);
            }else {
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getfenye();
    }, []);
    const  changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/check/checkFp/','unopeneadllFpTenantr',e.target.value);
    };
    const sousuo=()=>{
        setPage(1);
        getList();
        getfenye();
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/check/checkFp/','unopeneadllFpPhone',e.target.value);
    };
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const changeStutes=(e)=>{
        setstutes(e);
        updateSessionStorage('/check/checkFp/','unopeneadllFpStutes',e);
    };
    const changeType=(e)=>{
        settype(e);
        updateSessionStorage('/check/checkFp/','unopeneadllFpType',e);
    };
    return (
        <Spin spinning={isLoading}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="名称:"
                            value={name}
                            onChange={changeName}
                        />
                        <Input
                            addonBefore="手机号:"
                            value={phone}
                            onChange={changePhone}
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
                                状态:
                            </div>
                            <Select
                                onChange={changeStutes}
                                value={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value: 0, label: '全部' },
                                    { value: 1, label: '未审核' },
                                    { value: 2, label: '已审核' },
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
                                类型:
                            </div>
                            <Select
                                onChange={changeType}
                                value={type}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    // { value:2, label: '租金' },
                                    { value:5, label: '公共缴费' },
                                    // { value:7, label: '服务费' },
                                    { value:8, label: '违约金' },
                                    { value:9, label: '月保' },
                                    { value:11, label: '报修' },
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
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                size='small'
                scroll={{y:'70vh'}}
                rowKey={(columns) => columns.id}
                dataSource={zuhuList}
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
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>

        </Spin>
    )
}
export default OtherInvoiceNotIssued