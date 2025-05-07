import {Button, DatePicker, Image, Input, List, Pagination, Select, Space, Table, Tag} from "antd";
import {connect,history} from 'umi'
import {useEffect, useState} from "react";
import dayjs from "dayjs";
const ContractList=(props:any)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [identifier,setidentifier]=useState('');
    const [contractType,setcontractType]=useState(0);
    const [startDate,setstartDate]=useState('2000-01-01');
    const [endDate,setendDate]=useState('2099-01-01');
    const [name,setname]=useState('');
    const columns =[
        {
            title: '合同编号',
            dataIndex: 'identifier',
            key: 'identifier',
            align:'center',
            width:300,
            render: (text:any, record:any) => {
                return(
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                        {record.identifier}
                    </div>
                )
            }
        },
        {
            title: '租户',
            dataIndex: 'customName',
            key: 'customName',
            align:'center',
            render: (text:any, record:any) => {
                return(
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                        {record.customName}
                    </div>
                )
            }
        },
        {
            title: '起租日',
            dataIndex: 'beginTime',
            key: 'beginTime',
            align:'center',
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
            align:'center',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {dayjs(record.endTime).format("YYYY-MM-DD")}
                    </div>
                )
            }
        },
        {
            title: '租金',
            dataIndex: 'zuMoney',
            key: 'zuMoney',
            align:'center',
        },
        {
            title: '押金',
            dataIndex: 'deposit',
            key: 'deposit',
            align:'center',
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
        } else {
            setstartDate(data[0]);
            setendDate(data[1]);
        }
    };
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="合同编号:"
                            onChange={(e)=>setidentifier(e.target.value)}
                        />
                        <Input
                            onChange={(e)=>setname(e.target.value)}
                            addonBefore="租户姓名:"
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
                            <DatePicker.RangePicker onChange={changeDate}/>
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
                dataSource={props.CheckHetongList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
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