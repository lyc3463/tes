import {Button, Form, Input, List, message, Pagination, Space, Spin, Table, Tag} from "antd";
import {connect,history} from "umi";
import {useEffect, useState} from "react";
import * as ZuhuService from '@/services/zuhu';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const Yajinlist=()=>{
    // 收费项目名称
    const [itemName,setitemName]=useState('');
    // 押金收费ID
    const [itemType,setitemType]=useState(3);
    // 页码
    const [page,setpage]=useState(1);
    // 租户id
    const [uid,setuid]=useState('0');
    // 押金列表
    const [dataSource,setdataSource]=useState([]);
    // 转圈
    const [spinning,setspinning]=useState(false);
    // 分页信息
    const [count,setcount]=useState(0);
    // 押金总合
    const [moneySum,setmoneySum]=useState(0);
    // 获取押金列表
    const getYJJlist=(e)=>{
        ZuhuService.depoList(itemName,e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setdataSource(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 获取押金列表
    const getYJJlistid=()=>{
        ZuhuService.depoList(itemName,uid).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setdataSource(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 分页信息
    const yajinfenyeid=(e)=>{
        ZuhuService.depoListFenye(itemName,e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setmoneySum(res.Data.moneySum);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 分页信息
    const yajinfenye=()=>{
        ZuhuService.depoListFenye(itemName,uid).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setmoneySum(res.Data.moneySum);
            }else {
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getYJJlist(id);
        yajinfenyeid(id);
    }, []);
    const sousuo=()=>{
        setpage(1);
        yajinfenye();
        getYJJlistid();
    };
    const onChange=(e)=>{
      setpage(e);
    };
    const columns =[
        {
            title: '租户姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '收费项目名称',
            dataIndex: 'depositName',
            key: 'depositName',
        },
        {
            title: '收费项目备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '收费金额(元)',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '状态',
            dataIndex: 'depositStatus',
            key: 'depositStatus',
            render: (text:any, record:any) => {
                let textStutes;
                if (record.depositStatus==1){
                    textStutes=<Tag color='red'>未交</Tag>
                }else if (record.depositStatus==2){
                    textStutes=<Tag color='green'>已交</Tag>
                }else if (record.depositStatus==3){
                    textStutes=<Tag color='red'>已退押金</Tag>
                }else {
                    textStutes=<Tag color='red'>未知</Tag>
                }
                return(
                    <div>
                        {textStutes}
                    </div>
                )
            }
        }
    ];
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="收费项目名称:"
                            onChange={(e)=>setitemName(e.target.value)}
                        />
                        <Button type="primary"
                                onClick={sousuo}
                        >
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                columns={columns}
                size='small'
                rowKey={(columns) => columns.id}
                dataSource={dataSource}
                scroll={{x:1500,y:'60vh'}}
                pagination={false}
                summary={(columns) => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}>统计</Table.Summary.Cell>
                            <Table.Summary.Cell index={1}></Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={4}>{moneySum}元</Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {/*<Pagination total={count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>*/}
        </Spin>
    )
}
export default Yajinlist