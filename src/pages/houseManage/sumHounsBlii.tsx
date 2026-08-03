import {Button, DatePicker, List, message, Modal, Pagination, Space, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {connect} from 'umi'
import {cropDateStringToYearMonth, getCurrentDate} from "@/utils/OpenTool";
import dayjs from "dayjs";
import * as SumHounsBliiService from '@/services/sumHounsBlii';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

interface DateList{
    rent:number,
    manageFee:number,
    rentFreeDay:number,
    payRent:number,
    payManageFee:number,
    prepayment:number,
    billMoney:number,
    billStatus:number
}
const SumHounsBlii=(props:any)=>{
    // 选择时间
    const [startDate,setstartDate]=useState(getCurrentDate());
    // 页码
    const [page,setpage]=useState(1);
    // 应收金额
    const [billMoneySum,setbillMoneySum]=useState(0);
    // 实收金额
    const [payBillMoneySum,setpayBillMoneySum]=useState(0);
    // 租户列表
    const [tenntrList,settenntrList]=useState([]);
    // uid
    const [uid,setUid]=useState(0);
    // 详情弹窗
    const [open,setOpen]=useState(false);
    // 租户姓名
    const [username,setusername]=useState('');
    // 账单周期
    const [zhangdanzhouqi,setzhangdanzhouqi]=useState('');
    const [tenantName,settenantName]=useState('');
    // 总租户数量
    const [total,settotal]=useState(0);
    // 账单对象
    const [dateList,setDateList]=useState<DateList>({});
    // 获取列表
    const getBillList=()=>{
        SumHounsBliiService.fenye(tenantName).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                settenntrList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };

    const columns =[
        {
            title: '单元名称',
            dataIndex: 'unitList',
            key: 'unitList',
            width:300,
            render: (text:any, record:any) => {
                const limitedUnitList = record.unitList.slice(0, 2);
                return(
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                        {limitedUnitList.map((item, index) => (
                            <span key={index}>{item.unit_name}{index < limitedUnitList.length - 1 ? ',' : ''}</span>
                        ))}
                        {/* 如果 unitList 数组长度大于 2，则显示省略号或其他提示 */}
                        {record.unitList.length > 2 && <span>...</span>}
                    </div>
                )
            }
        },
        {
            title: '租户名称',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            width:300,
            render: (text:any, record:any) => {
                return(
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '300px' }}>
                        {record.tenant_name}
                    </div>
                )
            }
        },
        {
            title: '租户手机号',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
            width:300,
        },
        {
            title: '合同列表',
            dataIndex: 'coutractList',
            key: 'coutractList',
            render: (text,record) => {
                // 空/空数组 → 不渲染
                if (!text || !Array.isArray(text) || text.length === 0) {
                    return '';
                }
                // 有值 → 渲染可点击的合同编号（每个独立点击）
                return text.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleContractClick(item,record)} // 点击事件
                        style={{
                            color: '#1890ff',
                            cursor: 'pointer',
                            margin: '3px 0',
                        }}
                    >
                        {item.identifier || '-'}
                    </div>
                ));
            },
        },
    ];
    useEffect(() => {
        setstartDate(getCurrentDate());
        setzhangdanzhouqi(getCurrentDate());
        getBillList();
        // getfyBillsum();

    }, []);
    const changeDate=(_:any,item:any)=>{
        setstartDate(item);
    };
    // 详情
    const  handleContractClick=(e:any,record:any)=>{
        console.log('e',e);
        console.log('record',record);
        setOpen(true);
        getCouTractBill(startDate,record.tenantId,e.contractId);
    };
    const getCouTractBill=(startDate:string,tenantId:number,coutRactId:number)=>{
        SumHounsBliiService.one(startDate,tenantId,coutRactId).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setDateList(res.Data);
            }
        })
    };
    const sousuo=()=>{
        getBillList();
    };
    const onChange=(e)=>{
      setpage(e);
    };
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
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
                                选择账单日期:
                            </div>
                           <DatePicker
                               picker="month"
                               defaultValue={dayjs(startDate)}
                               onChange={changeDate}
                           />
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                        <Space.Compact>
                            <div
                                style={{color:'#999'}} >
                                账单周期:{cropDateStringToYearMonth(zhangdanzhouqi)}
                            </div>
                        </Space.Compact>
                        <Space.Compact>
                            <div
                                style={{color:'#999'}} >
                                总共租户数量:{total}
                            </div>
                        </Space.Compact>
                        <Space.Compact>
                            <div
                                style={{color:'#999'}} >
                                应收金额(租金+管理费):{billMoneySum}元
                            </div>
                        </Space.Compact>
                        <Space.Compact>
                            <div
                                style={{color:'#999'}} >
                                实收金额(租金+管理费):{payBillMoneySum}元
                            </div>
                        </Space.Compact>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.tenantId}
                pagination={false}
                size='small'
                scroll={{y:'60vh'}}
                dataSource={tenntrList}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                // summary={(columns) => (
                //     <Table.Summary fixed>
                //         <Table.Summary.Row>
                //             <Table.Summary.Cell
                //                 index={1}
                //             >
                //                 统计
                //             </Table.Summary.Cell>
                //             <Table.Summary.Cell index={0}>
                //             </Table.Summary.Cell>
                //             <Table.Summary.Cell index={0}>
                //             </Table.Summary.Cell>
                //         </Table.Summary.Row>
                //     </Table.Summary>
                // )}
            />
            <Pagination total={total} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>

            <Modal open={open} onCancel={()=>setOpen(false)} title={`账单日期:${cropDateStringToYearMonth(startDate)}，租户姓名:${username}`} >
                <div style={{display:'flex',flexDirection:'column',justifyContent:'space-around',height:'400px'}}>
                    <div>租金:
                        {dateList.rent==0?<Tag  color='warning'>{`${dateList.rent}元`}</Tag>:<Tag color='magenta'>{`${dateList.rent}元`}</Tag>}
                    </div>
                    <div>管理费:
                        {/*<Tag color='blue'>{`${rent}元`}</Tag>*/}
                        {dateList.manageFee==0?<Tag  color='warning'>{`${dateList.manageFee}元`}</Tag>:<Tag color='magenta'>{`${dateList.manageFee}元`}</Tag>}
                    </div>
                    <div>免租天数:
                        {/*<Tag color='magenta'>{`${rent}元`}</Tag>*/}
                        {dateList.rentFreeDay==0?<Tag  color='warning'>{`${dateList.rentFreeDay}元`}</Tag>:<Tag color='magenta'>{`${dateList.rentFreeDay}元`}</Tag>}
                    </div>
                    <div>应交租金:
                        {dateList.payRent==0?<Tag  color='warning'>{`${dateList.payRent}元`}</Tag>:<Tag color='magenta'>{`${dateList.payRent}元`}</Tag>}
                    </div>
                    <div>应交费用:
                        {dateList.payManageFee==0?<Tag  color='warning'>{`${dateList.payManageFee}元`}</Tag>:<Tag color='magenta'>{`${dateList.payManageFee}元`}</Tag>}
                    </div>
                    <div>预付费:
                        {dateList.prepayment==0?<Tag  color='warning'>{`${dateList.prepayment}元`}</Tag>:<Tag color='magenta'>{`${dateList.prepayment}元`}</Tag>}
                    </div>
                    <div>当月账单:
                        {dateList.billMoney==0?<Tag  color='warning'>{`${dateList.billMoney}元`}</Tag>:<Tag color='blue'>{`${dateList.billMoney}元`}</Tag>}
                    </div>
                    <div>缴费状态:
                        {dateList.billStatus==1?<Tag  color='red'>未交</Tag>:<Tag color='green'>已交</Tag>}
                    </div>
                </div>
            </Modal>
        </div>
    )
}
export default connect() (SumHounsBlii)