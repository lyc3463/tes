import * as UnopenedFpListService from '@/services/unopenedFpList';
import {useEffect, useState} from "react";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import dayjs from "dayjs";
import {Button, DatePicker, Input, List, message, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const RentalInvoiceNotIssued = () => {
    const [isLoading,setIsLoading]=useState(false);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [type,settype]=useState(2);
    const [name,setName]=useState(checkSessionStorage('/check/checkFp/','unopenedzuFpTenantr')||'');
    const [stutes,setstutes]=useState(checkSessionStorage('/check/checkFp/','unopenedzuFpStutes')||0);
    const [phone,setPhone]=useState(checkSessionStorage('/check/checkFp/','unopenedzuFpPhone')||'');
    const [zuhuList,setZuhuList]=useState([]);
    const [userId,setUserId]=useState(0);
    const [sumMoney,setSumMoney]=useState(0);
    const [count,setcount]=useState(0);
    const [startDate,setStartDate]=useState(checkSessionStorage('/check/checkFp/','unopenedzuFpStartDate')||'2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStorage('/check/checkFp/','unopenedzuFpEndDate')||'2099-01-01');

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
        UnopenedFpListService.fetch(page,name,phone,userId,type,stutes,pageSize,startDate,endDate).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setZuhuList(res.Data);
                console.log('res',res);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 获取租金未开记录
    const getfenye=()=>{
        UnopenedFpListService.fenye(name,phone,userId,type,stutes,pageSize,startDate,endDate).then((res:TypeErrorCode)=>{
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
       updateSessionStorage('/check/checkFp/','unopenedzuFpTenantr',e.target.value);
   };
    const sousuo=()=>{
        setPage(1);
        getList();
        getfenye();
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/check/checkFp/','unopenedzuFpPhone',e.target.value);
    };
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const changeStutes=(e)=>{
        setstutes(e);
        updateSessionStorage('/check/checkFp/','unopenedzuFpStutes',e);
    };
     // 监听日期
     const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/check/checkFp/','unopenedzuFpStartDate','2000-01-01');
            updateSessionStorage('/check/checkFp/','unopenedzuFpEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/check/checkFp/','unopenedzuFpStartDate',data[0]);
            updateSessionStorage('/check/checkFp/','unopenedzuFpEndDate',data[1]);
        }
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
                                时间:
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
export default RentalInvoiceNotIssued