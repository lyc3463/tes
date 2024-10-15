import {Button, DatePicker, Form, Input, List, message, Modal, Pagination, Select, Space, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";

const CheckContracte=(props:any)=>{
    const [uid,setUid]=useState(0);
    const [isOpen,setIsOpen]=useState(false);
    // 当前页数
    const [page,setPage]=useState(1);
    // 审核状态 0全部  1未审核 2已审核
    const [contractStatus,setContractStatus]=useState(0);
    // 合同编号
    const [identifier,setIdentifier]=useState('');
    // 合同类型
    const [contractType,setContractType]=useState(0);
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
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
                        {record.contractStatus==1?<Tag color='red'>未审核</Tag>:<Tag color='green'>已审核</Tag>}
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
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            align:'center',
            render: (text:any, record:any) => {
                return(
                    <Space>
                        {record.contractStatus==1?
                            <>
                                <Button type='link'>编辑</Button>
                                <Button type='link' onClick={()=>isCheck(record.id)}>审核</Button>
                            </>:''}
                        <Button type='link' onClick={()=>toInfo(record.id)}>详情</Button>
                    </Space>
                )
            }
        },
    ];
    // 审核弹窗
    const isCheck=(id:number)=>{
        setUid(id);
        setIsOpen(true);
    };
    // 确定审核通过
    const checkOk=()=>{
      props.dispatch({
          type:'Staff/check',
          payload:uid
      }).then((res)=>{
          if (res.ErrorCode==0){
              message.success('审核通过');
              setIsOpen(false);
          }else {
              message.error(res.Data);
          }
      })
    };
    // 去详情页面
    const toInfo=(e:number)=>{
        history.push(`/check/contracteInfo?id=${e}`)
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        props.dispatch({
            type:'Staff/fenye',
            payload:{identifier,contractType,contractStatus,startDate,endDate}
        });
        logFenye();
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Staff/fetch",
            payload:{page,identifier,contractType,contractStatus,startDate,endDate}
        })
    };
    // 监听页数
    const onChange=(e:number)=>{
        setPage(e);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setContractStatus(e);
    };
    useEffect(() => {
        logFenye();
    }, [page]);
    // 监听合同编号
    const changeIdentifier=(e)=>{
        setIdentifier(e.target.value);
    };
    // 合同类型
    const changeType=(e:number)=>{
        setContractType(e);
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={changeIdentifier}
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
                                    flexWrap:'wrap',
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                }}
                            >
                                日期:
                            </div>
                            <DatePicker.RangePicker onChange={changeDate}/>
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
                            <Select
                                onChange={changeType}
                                defaultValue={contractType}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:1, label: '未审核' },
                                    { value:2, label: '已审核' },
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
                                defaultValue={contractStatus}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:1, label: '未审核' },
                                    { value:2, label: '已审核' },
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
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                columns={columns}
                size='small'
                pagination={false}
                rowKey={(columns) => columns.id}
                dataSource={props.StaffList}
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            {/*    审核通过的弹窗*/}
            <Modal title='审核合同' open={isOpen} onCancel={()=>setIsOpen(false)} onOk={checkOk}>
                <div>是否要审核通过？</div>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        StaffList: state.Staff.list,
        count: state.Staff.count,
    }
};
export default connect(mapStateToProps) (CheckContracte)