import {Button, DatePicker, Image, Input, List, Pagination, Select, Space, Table, Tag, Tooltip} from "antd";
import {connect,history} from 'umi'
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
const ContractList=(props:any)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [identifier,setidentifier]=useState(checkSessionStorage('/contract/contractList/','identifier')||'');
    const [contractType,setcontractType]=useState(0);
    const [startDate,setstartDate]=useState(checkSessionStorage('/contract/contractList/','startDate')||'2000-01-01');
    const [endDate,setendDate]=useState(checkSessionStorage('/contract/contractList/','endDate')||'2099-01-01');
    const [name,setname]=useState(checkSessionStorage('/contract/contractList/','name')||'');

    const columns =[
        {
            title: '合同编号',
            dataIndex: 'identifier',
            key: 'identifier',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.identifier}>
                            {record.identifier}
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '租户',
            dataIndex: 'customName',
            key: 'customName',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.customName}>
                            {record.customName}
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '起租日',
            dataIndex: 'beginTime',
            key: 'beginTime',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {dayjs(record.beginTime).format("YYYY-MM-DD")}
                    </div>
                )
            }
        },
        {
            title: '到期日',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {dayjs(record.endTime).format("YYYY-MM-DD")}
                    </div>
                )
            }
        },
        {
            title: '租金(元)',
            dataIndex: 'zuMoney',
            key: 'zuMoney',
        },
        {
            title: '合同押金(元)',
            dataIndex: 'deposit',
            key: 'deposit',
        },
        {
            title: '管理费(元)',
            dataIndex: 'manageFee',
            key: 'manageFee',
        },
        {
            title: '预付费(元)',
            dataIndex: 'prepayment',
            key: 'prepayment',
        },
        {
            title: '管理费押金(元)',
            dataIndex: 'depositFee',
            key: 'depositFee',
        },
        {
            title: '合同类型',
            dataIndex: 'contractType',
            key: 'contractType',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.templateType==1?<Tag color='cyan'>定金合同</Tag>:<Tag color='purple'>正式合同</Tag>}
                    </div>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'contractStatus',
            key: 'contractStatus',
            align:'center',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.contractStatus==0?<Tag color='red'>未审核</Tag>:<Tag color='green'>已审核</Tag>}
                    </div>
                )
            }
        }
    ];
    const toInfo=(e:number)=>{
        history.push(`/check/contracteInfo?id=${e}`)
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const getList=()=>{
      props.dispatch({
          type:'CheckHetong/fetch',
          payload:{page,pageSize,startDate,endDate,contractType,identifier,name}
      })
    };
    const getListFenyeInfo=()=>{
        props.dispatch({
            type:'CheckHetong/fenye',
            payload:{page,pageSize,startDate,endDate,contractType,identifier,name}
        })
    };
    const sousuo=()=>{
        setPage(1);
        getList();
        getListFenyeInfo();
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getListFenyeInfo();
    }, []);
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setstartDate('2000-01-01');
            setendDate('2099-01-01');
            updateSessionStorage('/contract/contractList/','startDate','2000-01-01');
            updateSessionStorage('/contract/contractList/','endDate','2099-01-01');
        } else {
            setstartDate(data[0]);
            setendDate(data[1]);
            updateSessionStorage('/contract/contractList/','startDate',data[0]);
            updateSessionStorage('/contract/contractList/','endDate',data[1]);
        }
    };
    const changeIdentifier=(e)=>{
        setidentifier(e.target.value);
        updateSessionStorage('/contract/contractList/','identifier',e.target.value);
    };
    const changeName=(e)=>{
        setname(e.target.value);
        updateSessionStorage('/contract/contractList/','name',e.target.value);
    };
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="合同编号:"
                            onChange={changeIdentifier}
                            value={identifier}
                        />
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
                                到期日期:
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
                size='small'
                scroll={{y:'60vh'}}
                dataSource={props.CheckHetongList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
                summary={(columns) => (
                    <Table.Summary >
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={1}>统计</Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                            <Table.Summary.Cell index={4}>{props.count?props.count.zuMoney:'0'}元</Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>{props.count?props.count.deposit:'0'}元</Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>{props.count?props.count.manageFee:'0'}元</Table.Summary.Cell>
                            <Table.Summary.Cell index={7}>{props.count?props.count.prepayment:'0'}元</Table.Summary.Cell>
                            <Table.Summary.Cell index={8}>{props.count?props.count.depositFee:'0'}元</Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckHetongList: state.CheckHetong.list,
        count: state.CheckHetong.count
    }
};
export default connect(mapStateToProps) (ContractList)