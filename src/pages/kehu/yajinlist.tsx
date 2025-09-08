import {Button, Form, Input, List, message, Pagination, Space, Spin, Table, Tag} from "antd";
import {connect,history} from "umi";
import {useEffect, useState} from "react";
import * as ZuhuService from '@/services/zuhu';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";

const Yajinlist=()=>{
    // 租户姓名
    const [itemName,setitemName]=useState('');
    // 租户手机号
    const [phone,setPhone]=useState('');
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-12-31');
    // 押金收费ID
    const [type,setType]=useState(0);
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
    // 未交总合
    const [NotBillSum,setNotBillSum]=useState(0);
    // 获取押金列表
    const getYJJlist=(e)=>{
        ZuhuService.depoList(itemName,phone,startDate,endDate,e,type).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setdataSource(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 分页信息
    const yajinfenyeid=(e)=>{
        ZuhuService.depoListFenye(itemName,phone,startDate,endDate,e,type).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setmoneySum(res.Data.moneySum);
                setNotBillSum(res.Data.NotBillSum);
            }else {
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setuid(id);
        getYJJlist(id);
        yajinfenyeid(id);
    }, []);
    const sousuo=()=>{
        setpage(1);
        yajinfenyeid(uid);
        getYJJlist(uid);
    };
    const onChange=(e)=>{
      setpage(e);
    };
    const columns =[
        {
            title: '日期',
            dataIndex: 'created',
            key: 'created',
            render:(text)=>{
                return dayjs(text).format('YYYY-MM-DD');
            }
        },
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
            title: '已交金额(元)',
            dataIndex: 'stopAmount',
            key: 'stopAmount',
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
                            <Table.Summary.Cell index={4}></Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>{moneySum}元</Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>未交押金:{NotBillSum}元</Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {/*<Pagination total={count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>*/}
        </Spin>
    )
}
export default Yajinlist