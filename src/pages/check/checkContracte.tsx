import {Button, DatePicker, Form, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
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
    // 合同类型ID
    const [contractType,setContractType]=useState(0);
    // 租户姓名
    const [name,setName]=useState('');
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    // 发送弹窗
    const [fsOpen,setFsOpen]=useState(false);
    const [templateType,settemplateType]=useState(0);
    const [spinning,setspinning]=useState(false);
    // 发送小程序用户
    const [fId,setfId]=useState(0);
    const columns =[
        {
            title: '合同编号',
            dataIndex: 'identifier',
            key: 'identifier',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        {record.identifier}
                    </div>
                )
            }
        },
        {
            title: '租户',
            dataIndex: 'customName',
            key: 'customName',
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
            title: '租金(元)',
            dataIndex: 'zuMoney',
            key: 'zuMoney',
        },
        {
            title: '押金(元)',
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
            dataIndex: 'templateType',
            key: 'templateType',
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
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.contractStatus==1?<Tag color='red'>未审核</Tag>:<Tag color='green'>已审核</Tag>}
                    </div>
                )
            }
        },
        // {
        //     title: '下载',
        //     dataIndex: 'zuMoney',
        //     key: 'zuMoney',
        //     align:'center',
        //     render: (text:any, record:any) => {
        //         return(
        //             <Space>
        //                 {record.contractStatus==2? <Button type='link' onClick={()=>{toxiazai(record)}}>下载</Button> :''}
        //             </Space>
        //         )
        //     }
        // },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render: (text:any, record:any) => {
                return(
                    <Space>
                        {record.contractStatus==1?
                            <>
                                {/*<Button type='link' onClick={()=>toedit(record)}>编辑</Button>*/}
                                <Button type='link' onClick={()=>isCheck(record)}>审核</Button>
                                <Button type='link' onClick={()=>toInfo(record)}>详情</Button>

                            </>:<Button type='link' onClick={()=>{toxiazai(record)}}>详情</Button>
                        }
                    </Space>
                )
            }
        },
    ];
    const onSelectWXusetList=(e:any)=>{
        setFsOpen(true);
        setfId(e.id)
    };
    // 审核弹窗
    const isCheck=(e:any)=>{
        console.log("点击审核通过详情",e);
        settemplateType(e.templateType);
        setUid(e.id);
        setIsOpen(true);
    };
    // 编辑
    const toedit=(e:any)=>{
        if (e.templateType==1){
            history.push(`/enter/editDjContract?id=${e.id}`);
        }else if (e.templateType==2){
            history.push(`/enter/editStaff?id=${e.id}`);
        }
    };
    // 确定审核通过
    const checkOk=()=>{
      setspinning(true);
      props.dispatch({
          type:'CheckStaff/check',
          payload:{uid,templateType}
      }).then((res)=>{
          if (res.ErrorCode==0){
              message.success('审核通过');
              setspinning(false);
              setIsOpen(false);
          }else {
              message.error(res.Data);
              setspinning(false);
              setIsOpen(false);
          }
      })
    };
    // 去详情页面
    const toInfo=(e:any)=>{
        if (e.templateType==2){
            history.push(`/check/contracteInfo?id=${e.id}`);
        }else {
            history.push(`/check/dingjinInfo?id=${e.id}`);
        }
    };
    // 下载页面
    const toxiazai=(e)=>{
        if (e.templateType==2){
            history.push(`/check/contractez?id=${e.id}`);
        }else {
            history.push(`/check/checkdingjin?id=${e.id}`);
        }
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        props.dispatch({
            type:'CheckStaff/fenye',
            payload:{identifier,contractType,contractStatus,startDate,endDate,name}
        });
        logFenye();
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"CheckStaff/fetch",
            payload:{page,identifier,contractType,contractStatus,startDate,endDate,name}
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
    const onFsOk=()=>{
        console.log('发送');
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={changeIdentifier}
                            addonBefore="合同编号:"
                        />
                        <Input
                            onChange={(e)=>setName(e.target.value)}
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
                scroll={{y:'70vh'}}
                pagination={false}
                rowKey={(columns) => columns.id}
                dataSource={props.StaffList}
                summary={(columns) => (
                    <Table.Summary >
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={1}>统计</Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                            <Table.Summary.Cell index={4}>{props.count?props.count.zuMoney:''}元</Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>{props.count?props.count.deposit:''}元</Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>{props.count?props.count.manageFee:''}元</Table.Summary.Cell>
                            <Table.Summary.Cell index={7}>{props.count?props.count.prepayment:''}元</Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            {/*    审核通过的弹窗*/}
            <Modal title='审核合同' open={isOpen} onCancel={()=>setIsOpen(false)} onOk={checkOk} loading={spinning}>
                <div>是否要审核通过？</div>
            </Modal>
        {/*发送弹窗*/}
            <Modal open={fsOpen} title='选择小程序用户' onCancel={()=>setFsOpen(false)} onOk={onFsOk} loading={spinning}>

            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        StaffList: state.CheckStaff.list,
        count: state.CheckStaff.count,
    }
};
export default connect(mapStateToProps) (CheckContracte)