import {Button, DatePicker, Image, Input, List, Pagination, Select, Space, Table, Tag} from "antd";
import {connect} from 'umi'
import {useEffect} from "react";
import dayjs from "dayjs";
import {history} from "@@/core/history";
const ContractList=(props:any)=>{
    useEffect(() => {
        console.log(props)
    }, []);
    const columns =[
        {
            title: '合同编号',
            dataIndex: 'identifier',
            key: 'identifier',
            align:'center',
        },
        {
            title: '租户',
            dataIndex: 'customName',
            key: 'customName',
            align:'center',
        },
        {
            title: '单元',
            dataIndex: 'unitName',
            key: 'unitName',
            align:'center',
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
                        合同类型1
                    </div>
                )
            }
        },
        // {
        //     title: '免租期',
        //     dataIndex: 'mianzu',
        //     key: 'mianzu',
        // },
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

        },
        // {
        //     title: '线上签合同',
        //     dataIndex: 'xianshang',
        //     key: 'xianshang',
        //
        // },
        // {
        //     title: '线下签合同',
        //     dataIndex: 'xianxia',
        //     key: 'xianxia',
        //
        // },
        // {
        //     title: '操作',
        //     dataIndex: 'cao',
        //     key: 'cao',
        //     align:'center',
        //     render: (text:any, record:any) => {
        //         return(
        //             <Space>
        //                 <Button type='link' onClick={()=>toInfo(record.id)}>详情</Button>
        //             </Space>
        //         )
        //     }
        // },
    ];
    const toInfo=(e:number)=>{
        history.push(`/check/contracteInfo?id=${e}`)
    }
    return(
        <div>
            <List>

                <List.Item>
                    <Space>
                        <Input
                            addonBefore="合同编号:"
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
                            <DatePicker.RangePicker/>
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
                                合同类型:
                            </div>
                            <Select style={{width:150}}/>
                        </Space.Compact>
                        <Button type="primary">
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
            <Pagination/>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckHetongList: state.CheckHetong.list
    }
};
export default connect(mapStateToProps) (ContractList)