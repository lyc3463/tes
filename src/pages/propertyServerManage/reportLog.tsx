import {
    Button,
    DatePicker, Dropdown,
    Input, InputNumber,
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
import {connect} from "umi";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
const ReportLog=(props:any)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setname]=useState(checkSessionStorage('/propertyServerManage/reportLog/','name')||'');
    const [state,setstate]=useState(checkSessionStorage('/propertyServerManage/reportLog/','state')||0);
    const [phone,setPhone]=useState(checkSessionStorage('/propertyServerManage/reportLog/','phone')||'');
    const [openID,setopenID]=useState(0); // 租户id
    const [startDate,setstartDate]=useState(checkSessionStorage('/propertyServerManage/reportLog/','startDate')||'2000-01-01');
    const [endDate,setendDate]=useState(checkSessionStorage('/propertyServerManage/reportLog/','endDate')||'2099-01-01');
    const [loading, setLoading] = useState(false);
    const [isOpen,setIsOpen]=useState(false); // 分配弹窗
    const [acceptOrdersOpen,setAcceptOrdersOpen]=useState(false); // 自行接单弹窗
    const [uid,setUid]=useState(0); // 列表id
    const [step,setStep]=useState(0); // 步骤列表
    const [userID,setUserID]=useState(0); // 跟进人ID
    const [OnId,setOnId]=useState(0);// 修理成功的id
    const [onOpen,setOnOpen]=useState(false);// 修理成功的弹窗
    const [amount,setamount]=useState(0);// 修改金额
    const [repairType,setrepairType]=useState(0);// 账单类型
    const [dOpen,setDopen]=useState(false); // 删除报修
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns=[
        {
            title: '开始日期',
            dataIndex: 'created',
            align:'center',
            width:100,
            render: (_: any, record: any) => (
                <div>
                    {dayjs(_).format('YYYY-MM-DD')}
                </div>
            ),
        },
        {
            title: '完成日期',
            dataIndex: 'endTime',
            align:'endTime',
            width:100,
            render: (_: any, record: any) => (
                <div>
                    {record.repair_status==5?dayjs(_).format('YYYY-MM-DD'):<Tag color='warning'>待完成中</Tag>}
                </div>
            ),
        },
        {
            title: '用时',
            dataIndex: 'created',
            align:'center',
            width:200,
            render: (_: any, record: any) => {
                // 仅当状态为5（完成）且存在endTime时计算用时
                if (record.repair_status === 5 && record.endTime) {
                    const createdDate = dayjs(record.created);
                    const endDate = dayjs(record.endTime);
                    const diffMs = endDate.diff(createdDate); // 毫秒差
                    // 少于一小时（3600000毫秒）的情况
                    if (diffMs < 3600000) {
                        return <div>少于一小时</div>;
                    }

                    // 转换为天、时、分（仅用于超过一小时的情况）
                    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

                    // 使用剩余毫秒数计算小时数（排除已计算天数部分）
                    const remainingMsAfterDays = diffMs % (1000 * 60 * 60 * 24);
                    const hours = Math.floor(remainingMsAfterDays / (1000 * 60 * 60));

                    // 使用剩余毫秒数计算分钟数 (排除已计算天/小时部分)
                    const remainingMsAfterHours = remainingMsAfterDays % (1000 * 60 * 60);
                    const minutes = Math.floor(remainingMsAfterHours / (1000 * 60));

                    // 格式化显示文本
                    let timeStr = '';

                    // 根据实际值拼接时间单位（避免显示0天/0小时）
                    if (days > 0) timeStr += `${days}天`;

                    // 如果有天数或者小时数大于0，才显示小时
                    if (days > 0 || hours > 0) timeStr += `${hours}小时`;

                    // 始终显示分钟（即使0分钟也需体现，如"1小时0分钟"表示整小时）
                    timeStr += `${minutes}分钟`;

                    return <div>{timeStr}</div>;

                } else { //未完成状态显示提示
                    return <Tag color='warning'>待完成中</Tag>;
                }
            },
        },
        {
            title: '房屋',
            dataIndex: 'house_name',
            width:100,
            align:'center',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:100,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.house_name}>
                            {record.house_name}
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '单元名称',
            dataIndex: 'unitList',
            key: 'unitList',
            align:'center',
            width:100,
            sorter: {
                compare: (a, b) => {
                    // 获取 a 和 b 的 unitList 中第一个 unit_name
                    const aUnitName = a.unitList[0]?.unit_name || '';
                    const bUnitName = b.unitList[0]?.unit_name || '';

                    // 比较 unit_name
                    if (aUnitName < bUnitName) return -1;
                    if (aUnitName > bUnitName) return 1;
                    return 0;
                },
                multiple: 1,
            },
            render: (text:any, record:any) => {
                const limitedUnitList = record.unitList.slice(0, 2);
                return(
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100px' }}>
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
            title: '报修用户',
            dataIndex: 'tenant_name',
            width:100,
            align:'center',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:100,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.tenant_name}>
                            {record.tenant_name}
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '用户联系方式',
            dataIndex: 'tenant_phone',
            width:100,
            align:'center',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:100,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.tenant_phone}>
                            {record.tenant_phone}
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '报修内容',
            dataIndex: 'repair_content',
            width:100,
            align:'center',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:100,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.repair_content}>
                            {record.repair_content}
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '物品名称',
            dataIndex: 'repairGood',
            width:200,
            align:'center',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:200,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.repairGood}>
                            <Input.TextArea value={record.repairGood}/>
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '报修金额(元)',
            dataIndex: 'repairMoney',
            align:'center',
            width:150,
            render:(text:any,record:any,)=>{
                return(
                    <div style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.repairMoney}>
                            {record.repairMoney}
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '分数',
            align:'center',
            dataIndex: 'rating',
            render: (_: any, record: any) => (
                <span>
                    {record.rating === 0 ? '未评分' :
                        record.rating === 1 ? '不满意' :
                            record.rating === 2 ? '一般' : '满意'}
                </span>
            )
        },
        {
            title: '打分内容',
            width:200,
            dataIndex: 'ratingCount',
            render: (_: any, record: any) => (
                <span>
                   <Input.TextArea value={record.ratingCount}/>
                </span>
            )
        },
        {
            title: '跟进人',
            dataIndex: 'userName',
            fixed:'right',
            width:100,
            render:(_:any,record:any)=>(
                <div>
                    {record.userName?<Tag color='green'>{record.userName}</Tag>:<Tag color='red'>未分配跟进人</Tag>}
                </div>
            )
        },
        {
            title: '状态',
            align:'center',
            fixed:'right',
            dataIndex: 'repair_status',
            width:100,
            render: (_: any, record: any) => {
                const statusConfig = {
                    1: {text: '未接单', color: 'red'},
                    2: {text: '上门查看', color: 'blue'},
                    3: {text: '待确定', color: 'orange'},
                    4: {text: '物品采购', color: 'purple'},
                    5: {text: '完成', color: 'green'}
                };
                const config = statusConfig[record.repair_status] || {text: '未知状态', color: 'gray'};
                return (
                    <div>
                        <Tag color={config.color}>{config.text}</Tag>
                    </div>
                )
            }
        },
        {
            title: '操作',
            align:'center',
            dataIndex: 'operation',
            fixed:'right',
            render: (text:any, record:any) => {
                const menuItems = [];
                if (record.repair_status !=5&&record.repair_status !=1) {
                    menuItems.push({
                        key: 'step',
                        label: '步骤',
                        onClick: () => onokOpen(record)
                    });
                }
                if (record.repair_status === 1 && uqx[298] === '1') {
                    menuItems.push({
                        key: 'allocate',
                        label: '分配',
                        onClick: () => genjin(record)
                    });
                    menuItems.push({
                        key: 'accept',
                        label: '接单',
                        onClick: () => jiedan(record)
                    });
                }
                if (record.repair_status !=5) {
                    menuItems.push({
                        key: 'del',
                        label: '删除',
                        onClick: () => del(record)
                    });
                }
                return (
                    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                        <Button type="primary">操作</Button>
                    </Dropdown>
                )
            },
        },
    ];
    const del=(e)=>{
        setUid(e.id);
        setDopen(true);
    };
    // 确定分配跟进人按钮
    const onOk=()=>{
        if (!userID){
            message.error('请选择跟进人');
            return;
        }
        setLoading(true);
        props.dispatch({
            type:'Report/fenpei',
            payload:{OnId,userID}
        }).then((res:any)=>{
            if (res.ErrorCode==0||res.ErrorCode==9038){
                props.dispatch({
                    type:'Report/edit',
                    payload:{OnId,step:2,amount}
                })
                setLoading(false);
                message.success('分配成功');
                setIsOpen(false);
            }else {
                message.error(res.Data);
                setLoading(false);
                setIsOpen(false);
            }
        })
    };
    // 获取报修列表
    const getList=()=>{
      props.dispatch({
          type:'Report/fetch',
          payload:{page,name,phone,state,openID,startDate,endDate,pageSize}
      })
    };
    // 获取报修记录分页
    const getListfenye=()=>{
        props.dispatch({
            type:'Report/fenye',
            payload:{name,phone,state,openID,startDate,endDate,pageSize}
        })
    };
    // 分配跟进人弹窗
    const genjin=(e)=>{
        setIsOpen(true);
        setOnId(e.id);
        setamount(e.repairMoney);
    };
    // 自行接单按钮
    const jiedan=(e)=>{
        setAcceptOrdersOpen(true);
        setOnId(e.id);
        setamount(e.repairMoney);
    };
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 选择跟进人
    const changeSelect=(e)=>{
        setUserID(e);
    };
    // 修理完成弹窗
    const onokOpen=(e:any)=>{
        setOnId(e.id);
        setUserID(e.userId);
        setOnOpen(true);
        setStep(e.repair_status);
        setamount(e.repairMoney);
        setrepairType(e.repairType);
    };
    // 处理完成确定
    const onhandleOk=()=>{
        setLoading(true);
        props.dispatch({
            type:'Report/edit',
            payload:{OnId,step:5,amount}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setLoading(false);
                setOnOpen(false);
                message.success('处理完成');
            }else {
                setOnOpen(false);
                setLoading(false);
                message.error(res.Data);
            }
        })
    };
    const getUserList=()=>{
        props.dispatch({
            type:"Users/fetch",
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    const sousuo=()=>{
        setPage(1);
        getList();
        getListfenye();
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setstartDate('2000-01-01');
            setendDate('2099-01-01');
            updateSessionStorage('/propertyServerManage/reportLog/','startDate','2000-01-01');
            updateSessionStorage('/propertyServerManage/reportLog/','endDate','2099-01-01');
        } else {
            setstartDate(data[0]);
            setendDate(data[1]);
            updateSessionStorage('/propertyServerManage/reportLog/','startDate',data[0]);
            updateSessionStorage('/propertyServerManage/reportLog/','endDate',data[1]);
        }
    };
    // 监听状态
    const changeState=(e)=>{
        setstate(e);
        updateSessionStorage('/propertyServerManage/reportLog/','state',e);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        getListfenye();
        getUserList();
    }, []);
    const changeName=(e)=>{
        setname(e.target.value);
        updateSessionStorage('/propertyServerManage/reportLog/','name',e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/propertyServerManage/reportLog/','phone',e.target.value);
    };
    const handlePrevious = () => {
        // 上一步逻辑：step减1
        setStep(prev => prev - 1);

    };
    const handleNext=()=>{
        props.dispatch({
            type:'Report/edit',
            payload:{OnId,step:step+1,amount}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setStep(prev => prev+1);
                // message.success('修改金额完成');
            }else {
                message.error(res.Data);
            }
        })
    };
    // 自行接单确认按钮
    const ordersOpenOnOk=()=>{
        setLoading(true);
        props.dispatch({
            type:'Report/fenpei',
            payload:{OnId,userID:StaticInfo.userId}
        }).then((res:any)=>{
            if (res.ErrorCode==0||res.ErrorCode==9038){
                setLoading(false);
                message.success('自行接单成功');
                setAcceptOrdersOpen(false);
                props.dispatch({
                    type:'Report/edit',
                    payload:{OnId,step:2,amount}
                })
            }else {
                message.error(res.Data);
                setAcceptOrdersOpen(false);
                setLoading(false);
            }
        })
    };
    // 重新分配跟进人
    const onhandleEditUser=()=>{
        props.dispatch({
            type:'Report/fenpei',
            payload:{OnId,userID}
        }).then((res:any)=>{
            if (res.ErrorCode==0||res.ErrorCode==9038){
                message.success('更换成功');
            }else {
                message.error(res.Data);
            }
        })
    };
    const modifyAmount=()=>{
        return(
            <div style={{ padding: '16px' }}>
                {step==1?<>
                    <h2>分配跟进人</h2>
                    <Select
                        style={{width:'100%'}}
                        onChange={changeSelect}
                        showSearch
                        value={userID}
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item =props.UsersList.find(hetongID => hetongID.id == option?.value); // 您可能需要优化这个查找过程
                            return item?.user_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                    >
                        {props.UsersList&&props.UsersList.length>0?props.UsersList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.user_name}
                                </Select.Option>
                            )
                        }):''}
                    </Select>
                    <Button onClick={onhandleEditUser} style={{width:'100%',marginTop:'16px'}} type='primary'>确定修改</Button>
                </>:null}
                {step==2? <>
                    <h2 style={{textAlign:'center'}}>修改金额</h2>
                    <InputNumber
                        disabled={repairType==1}
                        placeholder="请输入金额"
                        value={amount}
                        onChange={(e) => setamount(e)}
                        style={{ marginBottom: '16px',width:'100%'}}
                        prefix="¥"
                        type="number"
                        step="0.01"
                        precision={2}
                        min={0}
                    />
                    {/*<Button style={{width:'100%'}} type='primary' onClick={onhandleEditAmount}>确定</Button>*/}
                </>:null}
                {step==3? <>
                    <h2 style={{textAlign:'center'}}>物品采购</h2>
                </>:null}
                {step==4? <>
                    <h2 style={{textAlign:'center'}}>修理完成</h2>
                </>:null}
            </div>
        )
    };
    const delOk=()=>{
        setLoading(true);
        props.dispatch({
            type:'Report/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setDopen(false);
                setLoading(false);
            }else {
                message.error(res.Data);
                setDopen(false);
                setLoading(false);
            }
        })
    };
    useEffect(() => {
    }, [step]);
    return(
        <Spin spinning={loading}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="姓名:"
                            value={name}
                        />
                        <Input
                            onChange={changePhone}
                            addonBefore="手机号:"
                            value={phone}
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
                                时间:
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
                            <Select value={state} onChange={changeState}  style={{ width: 120 }}>
                                <Select.Option value={0}>
                                    全部
                                </Select.Option>
                                <Select.Option value={1}>
                                    待接单
                                </Select.Option>
                                <Select.Option value={2}>
                                    上门查看
                                </Select.Option>
                                <Select.Option value={3}>
                                    待确定
                                </Select.Option>
                                <Select.Option value={4}>
                                    物品采购
                                </Select.Option>
                                <Select.Option value={5}>
                                    修理完成
                                </Select.Option>
                            </Select>
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
                scroll={{y:'60vh',x:'1800px'}}
                dataSource={props.ReportList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            {/* 分配跟进人弹窗*/}
            <Modal title='分配跟进人' open={isOpen} onCancel={()=>setIsOpen(false)} onOk={onOk} loading={loading}>
                <Select
                    style={{width:'100%'}}
                    onChange={changeSelect}
                    showSearch
                    value={userID}
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                        // 假设每个 option 都有一个与数据项对应的 value 属性
                        const item =props.UsersList.find(hetongID => hetongID.id == option?.value); // 您可能需要优化这个查找过程
                        return item?.user_name?.toLowerCase().includes(input.toLowerCase());
                    }}
                >
                    {props.UsersList&&props.UsersList.length>0?props.UsersList.map((item:any,index:any)=>{
                        return(
                            <Select.Option value={item.id} key={index}>
                                {item.user_name}
                            </Select.Option>
                        )
                    }):''}
                </Select>
            </Modal>
            {/* 自行接单弹窗*/}
            <Modal title='自行接单' open={acceptOrdersOpen} onCancel={()=>setAcceptOrdersOpen(false)} onOk={ordersOpenOnOk} loading={loading}>
               <div>是否要自行接单?</div>
            </Modal>
            {/* 步骤弹窗*/}
            <Modal open={onOpen} loading={loading} onCancel={()=>setOnOpen(false)} footer={null}>
                {modifyAmount()}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '24px',
                    justifyContent: 'flex-start'
                }}>
                    {/* 上一步按钮：仅当step > 1时显示 */}
                    {step > 1 && (
                        <Button
                            onClick={handlePrevious}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#f5f5f5',
                                color: '#333',
                                border: '1px solid #d9d9d9',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            上一步
                        </Button>
                    )}

                    {/* 下一步按钮：仅当step < 5时显示 */}
                    {step < 4 && (
                        <Button
                            onClick={handleNext}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#1890ff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            下一步
                        </Button>
                    )}
                    {step == 4 && (
                        <Button
                            onClick={onhandleOk}
                            type='primary'
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#1890ff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            确定完成
                        </Button>
                    )}
                </div>
            </Modal>
            <Modal title='删除' open={dOpen} onCancel={()=>setDopen(false)} onOk={delOk} loading={loading}>
                <div>确定要删除吗?</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ReportList: state.Report.list,
        count: state.Report.count,
        UsersList: state.Users.list,
    }
};
export default connect(mapStateToProps) (ReportLog)