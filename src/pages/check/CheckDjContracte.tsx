import {useEffect, useState} from "react";
import * as StaffService from '@/services/staff';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {history} from "umi";
import {checkDjContract} from "@/services/staff";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import {numberToRMB, getUnitNamesByIds, getUserNamesById} from "@/utils/OpenTool";
import * as StaffServer from "@/services/staff";
import * as ContractTypeService from "@/services/contractType";
import * as CheckCompanyService from "@/services/checkCompany";
import * as UnitService from "@/services/unit";

const CheckDjContracte=(props)=>{
    const [isCheckOpen,setIsCheckOpen]=useState(false);
    const [isCancelOpen,setIsCancelOpen]=useState(false);
    const [isDeleteOpen,setIsDeleteOpen]=useState(false);
    const [uid,setUid]=useState(0);
    const [reason,setReason]=useState('');
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 审核状态 0全部  1未送审 2已审核 3已取消 5已送审 6已驳回
    const [contractStatus,setContractStatus]=useState(checkSessionStorage('/check/checkContracte/','checkDjContracteStatus')||0);
    // 开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/check/checkContracte/','checkDjContracteStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/check/checkContracte/','checkDjContracteEndDate')||'2099-01-01');
    // 租户姓名
    const [name,setName]=useState(checkSessionStorage('/check/checkContracte/','checkDjContracteName')||'');
    // 列表
    const [staffList,setStaffList]=useState([]);
    // 转圈
    const [spinning,setspinning]=useState(false);
    // 总页码
    const [count,setcount]=useState(0);
    // 租金总数
    const [zuMoney,setzuMoney]=useState(0);
    // 合同押金
    const [deposit,setdeposit]=useState(0);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns =[
        {
            title: '合同编号',
            dataIndex: 'identifier',
            key: 'identifier',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'80px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        {record.identifier}
                    </div>
                )
            }
        },
        {
            title: '租户',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '签订日期',
            dataIndex: 'beginTime',
            key: 'beginTime',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.beginTime).format('YYYY-MM-DD')}
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
            title: '租金押金(元)',
            dataIndex: 'deposit',
            key: 'deposit',
        },
        {
            title: '状态',
            dataIndex: 'contractStatus',
            key: 'contractStatus',
            render: (text:any, record:any) => {
                let consumptionTypeText;
                switch (record.contractStatus) {
                    case 1:
                        consumptionTypeText = <Tag color='blue'>未审核</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag color='green'>已审核</Tag>;
                        break;
                    case 3:
                        consumptionTypeText = <Tag color='red'>已取消</Tag>;
                        break;
                    case 5:
                        consumptionTypeText = <Tag color='orange'>已送审</Tag>;
                        break;
                    case 6:
                        consumptionTypeText = <Tag color='red'>已驳回</Tag>;
                        break;
                    default:
                        consumptionTypeText = <Tag style={{ color: '#777777' }}>未知类型</Tag>;
                }
                return (
                    consumptionTypeText
                );

            }
        },
        {
            title: '下载',
            dataIndex: 'xx',
            key: 'xx',
            render: (text:any, record:any) => {
                return(
                    <Space>
                        {(record.contractStatus==1 || record.contractStatus==5 || record.contractStatus==6) && record.contractStatus!=3? <Button type='primary' onClick={()=>{toxiazai(record)}}>下载</Button>:''}
                        {record.contractStatus==2? <Button type='primary' onClick={()=>{checkdj(record)}}>下载</Button>:''}
                    </Space>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render: (text:any, record:any) => {
                return(
                    <Space>
                        {
                            <>
                                <Button type='primary' onClick={()=>toInfo(record)}>详情</Button>
                            </>
                        }
                        {record.contractStatus==5?
                            <>
                                <Button type='primary' onClick={()=>isCheck(record.id)}>审核</Button>
                            </>:''
                        }
                        {
                            record.contractStatus==2?  <Button type='primary' danger onClick={()=>iscancel(record.id)}>取消</Button>:''
                        }
                        {
                            record.contractStatus==3?<Button type='primary' danger onClick={()=>isdelete(record.id)}>删除</Button>:''
                        }
                    </Space>
                )
            }
        },
    ];
    // 详情
    const toInfo=(e)=>{
        history.push(`/check/dingjinInfo?id=${e.id}`);
    };
    // 打印合同
    const toxiazai=(e)=>{
        history.push(`/check/nocheckDJcontractez?id=${e.id}`);
    };
    const checkdj=(e)=>{
        history.push(`/check/checkdingjin?id=${e.id}`);
    };
    const isCheck=(e)=>{
        setUid(e);
        setReason('');
        setIsCheckOpen(true);
        getOneStaff(e);
        getUnitList();
        getCheckCompanyList();
        getDjOne();
    };
    const iscancel=(e)=>{
        setUid(e);
        setIsCancelOpen(true);
    };
    // 获取列表
    const getList=()=>{
        StaffService.getdJContractList({page,pageSize,contractStatus,name,startDate,endDate}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setStaffList(res.Data.data);
                setcount(res.Data.count);
                setzuMoney(res.Data.zuMoney);
                setdeposit(res.Data.deposit);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 获取分页信息
    // const getListfenye=()=>{
    //     StaffService.getdJContractListfy({pageSize,contractStatus,name,startDate,endDate}).then((res:TypeErrorCode)=>{
    //         if (res.ErrorCode==0){
    //             setcount(res.Data.count);
    //             setzuMoney(res.Data.zuMoney);
    //             setdeposit(res.Data.deposit);
    //         }else {
    //             message.error(res.Data);
    //         }
    //     })
    // };
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/check/checkContracte/','checkDjContracteStartDate','2000-01-01');
            updateSessionStorage('/check/checkContracte/','checkDjContracteEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/check/checkContracte/','checkDjContracteStartDate',data[0]);
            updateSessionStorage('/check/checkContracte/','checkDjContracteEndDate',data[1]);
        }
    };
    const sousuo=()=>{
        setPage(1);
        getList();
        // getListfenye();
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    // useEffect(() => {
    //     getListfenye();
    // }, []);
    const onOK=()=>{
        setspinning(true);
        StaffService.checkDjContract(uid,2).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('审核成功');
                getList();
                setspinning(false);
                setIsCheckOpen(false);
            }else {
                message.error(res.Data);
                getList();
                setspinning(false);
                setIsCheckOpen(false);
            }
        })
    };
    const onReject=()=>{
        if (!reason.trim()) return message.warning('请输入驳回原因');
        setspinning(true);
        StaffService.returnDjContract(uid,6,reason.trim()).then((res:TypeErrorCode)=>{
            setspinning(false);
            if (res.ErrorCode === 0){
                message.success('已驳回');
                getList();
                // getListfenye();
                setIsCheckOpen(false);
            }else {
                message.error(res.Data);
            }
        });
    };
    const onCancel=()=>{
        StaffService.checkDjContract(uid,3).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                message.success('取消成功');
                getList();
                setspinning(false);
                setIsCancelOpen(false);
            }else {
                message.error(res.Data);
                getList();
                setspinning(false);
                setIsCancelOpen(false);
            }
        })
    };
    const isdelete=(e)=>{
        setUid(e);
        setIsDeleteOpen(true);
    };
    const onDelete=()=>{
        StaffService.removedj(uid).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                message.success('删除成功');
                getList();
                setspinning(false);
                setIsCancelOpen(false);
            }else {
                message.error(res.Data);
                getList();
                setspinning(false);
                setIsCancelOpen(false);
            }
        })
    };
    const changeStutes=(e)=>{
        setContractStatus(e);
        updateSessionStorage('/check/checkContracte/','checkDjContracteStatus',e);
    };
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/check/checkContracte/','checkDjContracteName',e.target.value);
    };

    // 审核弹窗pdf页面
    const templateType=1;
    // 房屋ID
    const [house_id,setsethouse_id]=useState(0);
    // 签订日
    const [dayDate,setDayDate]=useState('');
    // 合同类型
    const [contractTypeid,setcontractTypeid]=useState(0);
    // 单元列表id
    const [unitarrList,setUnitarrList]=useState([]);
    // 单元列表
    const [unitList,setUnitList]=useState([]);
    // 预览弹窗
    const [isonpen,setisopen]=useState(false);
    // 合同模板公司名称
    const [companyName,setCompanyName]=useState('');
    // 合同模板公司地址
    const [companyAddress,setCompanyAddress]=useState('');
    // 合同模板出租地址
    const [rentAddress,setrentAddress]=useState('')
    // 合同模板开户名称
    const [openName,setopenName]=useState('');
    // 合同模板开户银行
    const [openBank,setopenBank]=useState('');
    // 合同模板银行账号
    const [bankCard,setbankCard]=useState('');
    // 合同模板法定人
    const [legalPerson,setlegalPerson]=useState('');
    // 合同模板联系电话
    const [phone,setphone]=useState('');
    // 租金
    const [zuMoneyForPdf,setzuMoneyForPdf]=useState(0);
    // 客户id
    const [clientId,setclientId]=useState(0);
    // 客户列表
    const [clientList,setclientList]=useState([]);
    // 押金
    const [depositForPdf,setdepositForPdf]=useState(0);
    const getOneStaff= (id:string)=>{
        StaffServer.onedj(id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('定金合同详情',res);
                setsethouse_id(res.Data.houseId);
                setzuMoneyForPdf(res.Data.zuMoney);
                setdepositForPdf(res.Data.deposit);
                setclientId(res.Data.clientId);
                setDayDate(dayjs(res.Data.beginTime).format("YYYY-MM-DD"));
                setcontractTypeid(res.Data.contractType);
                setUnitarrList(res.Data.unitIds.split('|').map(item => parseInt(item, 10)));
            }else {
                message.error(res.Data);
            }
        })
    };
    // 定金合同模板详情
    const getDjOne=()=>{
        ContractTypeService.one(templateType).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('定金合同模板',res);
                setCompanyName(res.Data.companyName);
                setCompanyAddress(res.Data.companyAddress);
                setopenName(res.Data.openName);
                setopenBank(res.Data.openBank);
                setbankCard(res.Data.bankCard);
                setlegalPerson(res.Data.legalPerson);
                setphone(res.Data.phone);
                setrentAddress(res.Data.rentAddress);
            }
        })
    };
    // 获取单元列表
    const getUnitList=()=>{
        UnitService.fetch({page:1, name: '', beginRents:0, endRents:9999999999, status:0, house_id:0, pageSize:1000}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setUnitList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 获取客户列表
    const getCheckCompanyList=()=>{
        CheckCompanyService.companyList({name:''}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setclientList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
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
                                    flexWrap:'wrap',
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                }}
                            >
                                签订日期:
                            </div>
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
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
                                value={contractStatus}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:1, label: '未送审' },
                                    { value:5, label: '已送审' },
                                    { value:6, label: '已驳回' },
                                    { value:2, label: '已审核' },
                                    { value:3, label: '已取消' },
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
                scroll={{y:'60vh'}}
                pagination={false}
                rowKey={(columns) => columns.id}
                dataSource={staffList}
                summary={(columns) => (
                    <Table.Summary >
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={1}>统计</Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={3}>{zuMoney}元</Table.Summary.Cell>
                            <Table.Summary.Cell index={4}>{deposit}元</Table.Summary.Cell>

                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            <Pagination total={count} pageSize={50} current={page} onChange={onChange}  pageSizeOptions={[50]}/>
            <Modal open={isCheckOpen} onCancel={()=>setIsCheckOpen(false)} loading={spinning} title={'审核'} width={1200} footer={[
                <Button key="approve" type="primary" onClick={onOK}>通过</Button>,
                <Button key="reject" type="primary" danger onClick={onReject}>驳回</Button>,
                <Button key="cancel" onClick={()=>setIsCheckOpen(false)}>取消</Button>,
            ]}>
                <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                    <div className="receipt-container" id='pdf-content'>
                        <h1 style={{textAlign:'center'}}>定金合同(浏览版)</h1>
                        <div className="receipt-info">
                            <p>甲方（付款方）：{getUserNamesById(clientList,clientId)}</p>
                            {/*<p>甲方（付款方）：{}</p>*/}
                            <p>乙方（收款方）：{companyName}</p>
                            <p style={{marginLeft:'30px'}}>甲、乙双方因甲方拟租赁乙方商铺事宜，双方经协商一致，就定金担保事宜达成如下协议:</p>
                            <p style={{marginLeft:'30px'}}>第一条：{getUserNamesById(clientList,clientId)}已详细了解要签署的主合同并已知首年租金（大写）<span >{numberToRMB(zuMoneyForPdf)}</span>，租赁地址位于{rentAddress}
                                {getUnitNamesByIds(unitList,unitarrList)}
                                号的物业。
                            </p>
                            <p style={{marginLeft:'30px'}}>第二条:甲方应在本合同签订之日向乙方一次性支付交付定金{depositForPdf}元整，乙方收款账户如下：</p>
                            <p style={{marginLeft:'50px'}}>开户名称:{openName}</p>
                            <p style={{marginLeft:'50px'}}>开户银行:{openBank}</p>
                            <p style={{marginLeft:'50px'}}>银行账号:{bankCard}</p>
                            <p style={{marginLeft:'30px'}}>第三条:本合同生效后，甲、乙任何一方不得擅自变更或解除，除非使双方协商一致并达成书面协议。</p>
                            <p style={{marginLeft:'30px'}}>第四条:甲方履行主合同义务（主合同即甲乙双方签订的《租赁合同》，该租赁合同自收到甲方定金后3日内签订，租赁合同的全文及其租赁物业的状况、位置、押金数额、租金数额及其支付方式甲乙均已详细知晓）后，乙方应返还定金或以该定金冲抵甲方应付乙方款项(押金或租金)。</p>
                            <p style={{marginLeft:'30px'}}>第五条:因甲方原因逾期不签订主合同或不履行主合同，无权要求返还定金；乙方不履行主合同，应当双倍返还定金。定金罚则的执行，不影响任何一方要求赔偿的权利。</p>
                            <p style={{marginLeft:'30px'}}>第六条:本合同经双方签章自定金交付之日起生效，一式两份；双方各执一份，具有同等法律效力。</p>
                            <p style={{marginLeft:'30px'}}>签订地点：{rentAddress}</p>
                            <p style={{marginLeft:'30px'}}><span style={{marginRight:'100px'}}>甲方 :{getUserNamesById(clientList,clientId)}</span><span>乙方:{companyName}</span></p>
                            <p style={{marginLeft:'30px'}}><span style={{marginRight:'100px'}}>签订日期 :<span style={{color:"red"}}></span></span><span>签订日期:<span style={{color:'red'}}></span></span></p>
                        </div>
                    </div>
                </div>
                <br />
                <br />
                审核意见
                <Input.TextArea rows={4} placeholder="请输入审核意见或驳回原因" value={reason} onChange={(e)=>setReason(e.target.value)} style={{ marginTop: 16 }} />
            </Modal>
            <Modal open={isCancelOpen} onOk={onCancel} onCancel={()=>setIsCancelOpen(false)} loading={spinning} title={'取消'}>
                <div>是否取消?</div>
            </Modal>
            <Modal open={isDeleteOpen} onOk={onDelete} onCancel={()=>setIsDeleteOpen(false)} loading={spinning} title={'删除'}>
                <div>是否删除?</div>
            </Modal>
        </Spin>
    )
}
export default CheckDjContracte