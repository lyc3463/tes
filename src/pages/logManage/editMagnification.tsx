import * as EditMagnificationService from '@/services/editMagnification';
import {useEffect, useState} from "react";
import {Button, DatePicker, Input, List, message, Pagination, Space, Spin, Table} from "antd";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";

const EditMagnification=()=>{
    const [pageSize,setPageSize]=useState(50);
    const [page,setPage]=useState(1);
    const [remark,setremark]=useState('');
    const [address,setAddress]=useState('');
    const [count,setcount]=useState(0);
    const [dataSource,setdataSource]=useState([]);
    const [spinning,setspinning]=useState(false);
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
            title: '操作人',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: '电表地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '电表描述',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '修改前倍率',
            dataIndex: 'rateOld',
            key: 'rateOld',
        },
        {
            title: '修改后倍率',
            dataIndex: 'rateNew',
            key: 'rateNew',
        },
    ];
    const sousuo=()=>{
        setPage(1);
        setPageSize(50);
        getListfy();
        getList();
    };
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };

    const getList=()=>{
        setspinning(true);
        EditMagnificationService.fetch({page,pageSize,remark,address}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('列表记录',res);
                setdataSource(res.Data);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const getListfy=()=>{
        setspinning(true);
        EditMagnificationService.fenye({pageSize,remark,address}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    useEffect(() => {
        getListfy();
    }, []);
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="电表地址:"
                            onChange={(e)=>setAddress(e.target.value)}
                        />
                        <Input
                            addonBefore="电表描述:"
                            onChange={(e)=>setremark(e.target.value)}
                        />
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
export default EditMagnification