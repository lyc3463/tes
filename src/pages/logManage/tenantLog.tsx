import {connect} from "umi";
import * as EditMagnificationService from '@/services/tenantLog';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {Button, DatePicker, Input, List, message, Pagination, Space, Spin, Table} from "antd";
import {useEffect, useState} from "react";
import {updateSessionStorage,checkSessionStoragevalue} from "@/utils/OpenTool";
import dayjs from "dayjs";
import {fenye, fetch} from "@/services/tenantLog";

const TenantLog=()=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState(checkSessionStoragevalue('/logManage/logQuery/','TenantLogName')||'');
    const [startDate,setStartDate]=useState(checkSessionStoragevalue('/logManage/logQuery/','TenantLogStartDate')||'2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStoragevalue('/logManage/logQuery/','TenantLogEndDate')||'2099-01-01');
    const [spinning,setSpinning]=useState(false);
    const [count,setcount]=useState(0);
    const [dataSource,setdataSource]=useState([]);
    const getList=()=>{
        setSpinning(true);
        EditMagnificationService.fetch({page,pageSize,name,startDate,endDate}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('fetch',res.Data);
                setdataSource(res.Data);
                setSpinning(false);
            }else {
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    const getListfy=()=>{
        setSpinning(true);
        EditMagnificationService.fenye({pageSize,name,startDate,endDate}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setSpinning(false);
            }else {
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getListfy();
    }, []);
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/logManage/logQuery/','TenantLogName',e.target.value);
    };
    const changeDate=(_:any,data:string[])=> {
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/logManage/logQuery/', 'TenantLogStartDate', '2000-01-01');
            updateSessionStorage('/logManage/logQuery/', 'TenantLogEndDate', '2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/logManage/logQuery/', 'TenantLogStartDate', data[0]);
            updateSessionStorage('/logManage/logQuery/', 'TenantLogEndDate', data[1]);
        }
    };
    const sousuo=()=>{
        setPage(1);
        getList();
        getListfy();
    };
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const columns=[
        {
            title: '日期',
            dataIndex: 'created',
            key: 'created',
            render:(_:any,item:any)=>{
                return(
                    <div>
                        {dayjs(item.created).format("YYYY-MM-DD HH:mm:ss")}
                    </div>
                )
            }
        },
        {
            title: '修改内容',
            dataIndex: 'bindContent',
            key: 'bindContent',
        },
        {
            title: '租户姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '修改人',
            dataIndex: 'user_name',
            key: 'user_name',
        }
    ];
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="修改人:"
                            onChange={changeName}
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
                rowKey={(columns) => columns.id}
                pagination={false}
                dataSource={dataSource}
                size='small'
                scroll={{y:'60vh'}}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
        </Spin>
    )
}
export default connect() (TenantLog)
