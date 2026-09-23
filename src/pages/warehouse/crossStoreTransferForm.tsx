import {
    Button,
    DatePicker,
    Image,
    Input,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Tooltip
} from "antd";
import {useEffect, useState} from "react";
import {connect, history} from "umi";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage, userQx} from "@/utils/OpenTool";
import * as RequisitionForm from '@/services/requisitionForm';
import {QuestionCircleOutlined} from '@ant-design/icons';

const CrossStoreTransferForm=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);// 当前页数
    const [orderCode,setOrderCode]=useState(checkSessionStorage('/warehouse/thingStock','crossStoreTransferFormOrderCode')||'');// 单号
    const [warehouseName,setWarehouseName]=useState(checkSessionStorage('/warehouse/thingStock','crossStoreTransferFormWarehouseName')||'');// 仓库名称
    const [startDate,setStartDate]=useState(checkSessionStorage('/warehouse/thingStock','crossStoreTransferFormStartDate')||'2000-01-01');// 开始日期
    const [endDate,setEndDate]=useState(checkSessionStorage('/warehouse/thingStock','crossStoreTransferFormEndDate')||'2099-01-01');// 结束日期
    const [orderStatus,setOrderStatus]=useState(0);// 订单状态
    const [billStatus,setBillStatus]=useState(0);// 账单状态
    const [pageSize,setPageSize]=useState(10);// 每页数量
    const [orderType,setOrderType]=useState(6);// 订单类型
    const [dOpen,setDOpen]=useState(false);// 删除弹窗是否打开
    const [dId,setDId]=useState(0);// 删除的id
    const [count,setCount]=useState(0);// 总条数
    const [crossStoreList,setCrossStoreList]=useState([]);// 列表
    const [uName,setUName]=useState(checkSessionStorage('/warehouse/thingStock','crossStoreTransferFormUserName')||'');// 申请人
    const columns = [
        {
            title: '申请时间',
            dataIndex: 'orderTime',
            ellipsis: true,
            align:'center',
            render: (text: any) => {
                // return <Image src={`${window.ServerConfig.imgServer}11be3d76106d651787b8e35df2074fdc元旦-钱汇官网.png`}/>
                // let imga :s=  loadHSLAsImage();
                // return <Image style={{width:'50px',height:'50px'}} src={testImg}/>
                return dayjs(text).format('YYYY-MM-DD');
            },
        },
        {
            title: '调拨单',
            dataIndex: 'orderCode',
            ellipsis: true,
            align:'center',
            render:(text,record)=>{
                return <Button type='link' onClick={()=>history.push(`/warehouse/infoTransferForm?id=${record.id}`)}> {text}</Button>
            }
        },
        {
            title: '调离仓库',
            dataIndex: 'warehouseName',
            ellipsis: true,
            align:'center',
        },
        {
            title: '入库园区',
            dataIndex: 'park_name',
            ellipsis: true,
            align:'center',
        },
        {
            title: '入库仓库',
            dataIndex: 'warehouseName2',
            ellipsis: true,
            align:'center',
        },
        {
            title: '申请人',
            dataIndex: 'user_name',
            ellipsis: true,
            align:'center',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            ellipsis: true,
            align:'center',
        },
        {
            title: '状态',
            dataIndex: 'orderStatus',
            ellipsis: true,
            align:'center',
            render: (text: any, record: any) => {
                const statusMap: Record<number, {color: string; text: string}> = {1: {color: 'blue', text: '待送审'}, 2: {color: 'green', text: '已审核'}, 5: {color: 'orange', text: '已送审'}, 6: {color: 'red', text: '已驳回'}};
                const status = statusMap[Number(text)] || {color: 'default', text: '未知状态'};
                const reason = record.rejectReason || record.reject_reason || record.rejectedReason || record.reason || record.Reason;
                return <Space><Tag color={status.color}>{status.text}</Tag>{Number(text)===6 && reason?<Tooltip title={reason}><QuestionCircleOutlined /></Tooltip>:null}</Space>
            },
        },
        {
            title: '操作',
            align:'center',
            dataIndex: 'operation',
            width: '200px',
            render: (_: any, record: any) => (
                <Space size="small">
                    {[1,6].includes(record.orderStatus)?
                        <>
                            <Button type="primary" size='small' onClick={()=>{isDleOpen(record.id)}} danger>删除</Button>
                            <Button type="primary" size='small' onClick={()=>{history.push(`/warehouse/editCrossStoreTransferForm?id=${record.id}`)}}>编辑</Button>
                            {userQx()[604] == '1' && <Button type="primary" size='small' onClick={()=>sendCheck(record.id)}>直接送审</Button>}
                        </>
                        :
                        null
                    }
                </Space>
            ),
        },
    ];
    // 删除的弹窗
    const isDleOpen=(e:number)=>{
        setDId(e);
        setDOpen(true);
    };
    const toadd=()=>{
        history.push('/warehouse/addCrossStoreTransferForm');
    };
    const getList=()=>{
        RequisitionForm.fetch({page, orderCode, warehouseName, startDate, endDate, orderStatus, billStatus, pageSize, orderType,uName}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('列表',res)
                setCrossStoreList(res.Data.data);
                setCount(res.Data.count);
            }else {
                message.error(res.ErrorCode + res.Data);
            }
        })
    };
    const getFenye=()=>{
        props.dispatch({
            type:'CrossStoreTransferForm/fenye',
            payload:{orderCode, warehouseName, startDate, endDate, orderStatus, billStatus, pageSize, orderType,uName}
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);

    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const onOK=()=>{
        setSpinning(true);
        RequisitionForm.remove(dId).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setSpinning(false);
                setDOpen(false);
                getList();
            }else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
                setDOpen(false);
            }
        })
    };
    const sendCheck=(id:number)=>{
        setSpinning(true);
        RequisitionForm.sendCheck({uid:id, orderStatus:5}).then((res:TypeErrorCode)=>{
            setSpinning(false);
            if(res.ErrorCode===0){ message.success('送审成功'); getList(); }
            else message.error(res.Data);
        });
    };
    const changeWarehouseName=(e)=>{
        updateSessionStorage('/warehouse/thingStock','crossStoreTransferFormWarehouseName',e.target.value);
        setWarehouseName(e.target.value);
    };
    const changeOrderCode=(e)=>{
        setOrderCode(e.target.value);
        updateSessionStorage('/warehouse/thingStock','crossStoreTransferFormOrderCode',e.target.value);
    }
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/thingStock','crossStoreTransferFormStartDate','2000-01-01');
            updateSessionStorage('/warehouse/thingStock','crossStoreTransferFormEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/thingStock','crossStoreTransferFormStartDate',data[0]);
            updateSessionStorage('/warehouse/thingStock','crossStoreTransferFormEndDate',data[1]);
        }
    };
    const sousuo=()=>{
        setPage(1);
        getList();
        getFenye();
    };
    const changeOrderStatus=(e)=>{
        setOrderStatus(e);
        updateSessionStorage('/warehouse/thingStock','crossStoreTransferFormOrderStatus',e);
    };
    const changeUName=(e)=>{
        setUName(e.target.value);
        updateSessionStorage('/warehouse/thingStock','crossStoreTransferFormUserName',e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <div>
                        {userQx()[126]=='1'?<Button type="primary" onClick={toadd}>申请调拨</Button>:''}
                    </div>
                    <Space>
                        <Input
                            addonBefore="调离仓库:"
                            value={warehouseName}
                            onChange={changeWarehouseName}
                        />
                        <Input
                            addonBefore="申请人:"
                            value={uName}
                            onChange={changeUName}
                        />
                        <Input
                            addonBefore="单号:"
                            value={orderCode}
                            onChange={changeOrderCode}
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
                                showSearch
                                value={orderStatus}
                                optionFilterProp="children"
                                placeholder="选择状态"
                                style={{ width: 120 }}
                                options={[
                                    {label:'全部',value:0},
                                    {label:'待送审',value:1},
                                    {label:'已审核',value:2},
                                    {label:'已送审',value:5},
                                    {label:'已驳回',value:6},
                                ]}
                                onChange={changeOrderStatus}
                            />
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                scroll={{y:'60vh'}}
                dataSource={crossStoreList}
                rowKey={(columns) => columns.id}
                size='small'
            />
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
            <Modal title='删除' onOk={onOK} loading={spinning} open={dOpen} onCancel={()=>{setDOpen(false)}}>
                <p>确定删除吗？</p>
            </Modal>
        </Spin>
    )
}
export default connect()(CrossStoreTransferForm);
