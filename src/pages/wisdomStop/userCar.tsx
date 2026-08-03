import {connect, history} from 'umi';
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {
    Button, DatePicker,
    Dropdown, Form,
    Input,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag
} from "antd";
import {checkSessionStorage, updateSessionStorage, addMonthsToDate, getTimeRangeByMonths} from "@/utils/OpenTool";
import * as UserCarServer from "@/services/userCar";
import CryptoUtils from "@/utils/Crypto";
import AddMonthlyInsurance from "@/pages/wisdomStop/addMonthlyInsurance";
import EditMonthlyInsurance from "@/pages/wisdomStop/editMonthlyInsurance";
const UserCar=(props)=>{
    const [startDate,setStartDate]=useState('2025-01-01');
    const [endDate,setEndDate]=useState('2025-01-01');
    const [form] = Form.useForm();
    const [appId,setAppId]=useState(0);
    const [tenant_phone,settenant_phone]=useState('');
    const [tenant_name,settenant_name]=useState('');
    const [page,setPage]=useState(1);// 页码
    const [pageSize,setPageSize]=useState(50);// 页数
    const [carNo,setCarNo]=useState(checkSessionStorage('/wisdomStop/carManage/','userCarNo')||'');//车牌号
    const [name,setName]=useState(checkSessionStorage('/wisdomStop/carManage/','name')||'');//姓名
    const [stutes,setStutes]=useState(checkSessionStorage('/wisdomStop/carManage/','userStutes')||0);
    const [uName,setUName]=useState(checkSessionStorage('/wisdomStop/carManage/','userName')||'');// 用户名
    const [uPhone,setUPhone]=useState(checkSessionStorage('/wisdomStop/carManage/','userPhone')||'');// 手机号
    const [uid,setUid]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [isCheckOpen,setIsChengckOpen]=useState(false);
    const [deeleId,setDeleId]=useState(0);
    const [isDeleOpen,setIsDeleOpen]=useState(false);
    const [isDeactivateOpen,setIsDeactivateOpen]=useState(false);
    const [activateOpen,setActivateOpen]=useState(false);
    const [carInfo,setCarInfo]=useState('');
    const [tId,setTid]=useState(0);
    const [item,setItem]=useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [monthOptions, setMonthOptions] = useState([]);
    const [month, setMonth] = useState(0);// 月份
    const [fee, setFee] = useState(0);// 费用
    const [tcID,setTcid]=useState('');// 套餐id
    const [detailOpen, setDetailOpen] = useState(false);
    const [mountCarList, setMountCarList] = useState([]); // 存储详情数据
    const [postponementData,setPostponementData]=useState([]);
    const [postponementOpen, setPostponementOpen] = useState(false);// 月卡延期
    const [changeOpen, setChangeOpen] = useState(false);// 月卡变更
    // 获取列表
    const getCarList=()=>{
        props.dispatch({
            type:'UserCar/fetch',
            payload:{page,carNo,userId:0,stutes,pageSize,userType:2,uName,uPhone}
        })
    };
    const columns =[
        {
            title: '序号',
            key: 'index',
            align: 'center',
            render: (text, record, index) => {
                return <div>{index + 1}</div>
            },
        },
        {
            title: '用户姓名',
            dataIndex: 'user_name',
            key: 'user_name',
            align:'center',
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            align:'center',
        },
        {
            title: '车牌',
            dataIndex: 'carNo',
            key: 'carNo',
            align:'center',
        },
        {
            title: '车辆类型',
            dataIndex: 'carType',
            key: 'carType',
            align:'center',
            render: (text:any, record:any) => {
                let carType;
                switch (record.carType) {
                    case 'CAR':
                        carType=<Tag color='blue'>小车</Tag>
                        break;
                    case 'LARGE':
                        carType=<Tag color='green'>大车</Tag>
                        break;
                    case 'EXTRA_LARGE':
                        carType=<Tag color='red'>超大车</Tag>
                        break;
                    default:
                        carType=<Tag color='red'>其他类型</Tag>
                }
                return(
                    <Space>
                        {carType}
                    </Space>
                )
            },
        },
        {
            title: '车辆颜色',
            dataIndex: 'carNoColor',
            key: 'carNoColor',
            align:'center',
            render: (text:any, record:any) => {
                let carColor;
                switch (record.carNoColor) {
                    case 'BLUE':
                        carColor=<Tag style={{color:"blue"}}>蓝色</Tag>
                        break;
                    case 'GREEN':
                        carColor=<Tag style={{color:"green"}}>绿色</Tag>
                        break;
                    case 'WHITE':
                        carColor=<Tag>白色</Tag>
                        break;
                    case 'YELLOW':
                        carColor=<Tag style={{color:"yellow"}}>黄色</Tag>
                        break;
                    case 'BLACK':
                        carColor=<Tag>黑色</Tag>
                        break;
                    default:
                        carColor=<Tag>其余颜色</Tag>
                }
                return(
                    <Space>
                        {carColor}
                    </Space>
                )
            },
        },
        {
            title: '开始时间',
            dataIndex: 'beginTime',
            key: 'beginTime',
            align:'center',
            render:(text:any, record:any)=>{
                const defaultTime = dayjs(text).format('YYYY-MM-DD HH:mm:ss');
                if (defaultTime === '1901-01-01 00:00:00') {
                    return <div>等待用户开通</div>;
                }
                return(
                    <div>
                        {dayjs(text).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                )
            }
        },
        {
            title: '结束时间',
            dataIndex: 'endTime',
            key: 'endTime',
            align:'center',
            render:(text:any, record:any)=>{
                const defaultTime = dayjs(text).format('YYYY-MM-DD HH:mm:ss');
                if (defaultTime === '1901-01-01 00:00:00') {
                    return <div>等待用户开通</div>;
                }
                return(
                    <div>
                        {dayjs(text).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                )
            }
        },
        {
            title: '剩余天数',
            dataIndex: 'remainDays',
            key: 'remainDays',
            align: 'center',
            // 👇 核心：开启 AntD 自带点击排序
            sorter: (a, b) => {
                // 封装一个方法：把每条数据转成 剩余天数字（数字越小，过期越早）
                const getRemainDayNumber = (record) => {
                    const defaultTime = "0001-01-01T00:00:00";

                    // 等待开通 → 数字极大，排最后
                    if (record.endTime && record.beginTime === defaultTime) {
                        return 99999;
                    }

                    const now = dayjs();
                    const endTime = dayjs(record.endTime);

                    // 已过期 → 数字极大，排最后
                    if (endTime.isBefore(now)) {
                        return 99999;
                    }

                    // 返回剩余天数（数字）
                    return endTime.diff(now, 'day', true);
                };

                // 数字比较：AntD 会自动识别升序、降序
                return getRemainDayNumber(a) - getRemainDayNumber(b);
            },
            render: (text: any, record: any) => {
                const defaultTime = "0001-01-01T00:00:00";
                if (record.endTime && record.beginTime === defaultTime) {
                    return <div>等待用户开通</div>;
                }
                const now = dayjs();
                const endTime = dayjs(record.endTime);

                if (endTime.isBefore(now)) {
                    return <div>已过期</div>;
                }

                const diffDays = endTime.diff(now, 'day', true);
                return <div>{diffDays < 1 ? '不足一天' : `${Math.floor(diffDays)}天`}</div>;
            },
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            align:'center',
        },
        {
            title: '状态',
            dataIndex: 'carStatus',
            key: 'carStatus',
            align:'center',
            render: (text:any, record:any) => {
                let carStatus;
                switch (record.carStatus) {
                    case 1:
                        carStatus=<Tag color='blue'>未审核</Tag>
                        break;
                    case 2:
                        carStatus=<Tag color='green'>已审核</Tag>
                        break;
                    case 3:
                        carStatus=<Tag color='red'>已停用</Tag>
                        break;
                    default:
                        carStatus=<Tag color='red'>未知类型</Tag>
                }
                return(
                    <Space>
                        {carStatus}
                    </Space>
                )
            },
        },
        {
            title: '服务',
            dataIndex: 'fw',
            key: 'fw',
            align:'center',
            render: (text:any, record:any) => {
                // 创建下拉菜单项
                const menuItems = [];
                // 根据车辆状态添加审核/停用按钮
                menuItems.push({
                    key: 'kt',
                    label: '开通',
                    onClick: () => isActivate(record,1)
                });
                menuItems.push({
                    key: 'yq',
                    label: '延期',
                    onClick: () => isPostponement(record,2)
                });
                menuItems.push(
                    {
                        key: 'bg',
                        label: '变更',
                        onClick: () => isChange(record,3)
                    },
                    {
                        key: 'info',
                        label: '详情',
                        onClick: () => isInfo(record,4)
                    }
                );
                return (
                    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                        {record.carStatus === 2 ?  <Button type="primary">服务</Button> :<span>等待审核</span>}
                    </Dropdown>
                )
            },
        },
        {
            title: '操作',
            dataIndex: 'czz',
            key: 'czz',
            align:'center',
            render: (text:any, record:any) => {
                // 创建下拉菜单项
                const menuItems = [];
                // 根据车辆状态添加审核/停用按钮
                if (record.carStatus === 2) {
                    menuItems.push({
                        key: 'stop',
                        label: '停用',
                        onClick: () => isDeactivate(record.id)
                    });
                } else {
                    menuItems.push({
                        key: 'check',
                        label: '审核',
                        onClick: () => isCheck(record.id)
                    });
                }
                // 添加删除和详情按钮
                menuItems.push(
                    {
                        key: 'delete',
                        label: '删除',
                        onClick: () => isDele(record.id)
                    },
                    {
                        key: 'detail',
                        label: '详情',
                        onClick: () => toInfo(record.id)
                    }
                );
                return (
                    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                        <Button type="primary">操作</Button>
                    </Dropdown>
                )
            },
        }
    ];
    // 根据车牌获取车辆信息
    const getCarInfo=(e:string,type)=>{
        UserCarServer.reactCarNo(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                if (res.Data.length>0){
                    res.Data.forEach(user => {
                        user.parkServiceList.forEach(service => {
                            // 新增：计算剩余天数
                            const now = dayjs();
                            const endTime = dayjs(service.endTime);

                            // 如果结束时间已过期，剩余天数为0
                            if (endTime.isBefore(now)) {
                                service.remainingDays = 0;
                            } else {
                                // 计算整天差值，不足1天按0处理
                                const diffDays = endTime.diff(now, 'day', true); // true表示返回浮点数
                                service.remainingDays = diffDays < 1 ? 0 : Math.floor(diffDays);
                            }
                            service.carList.forEach(car => {
                                car.carNo = decodeURIComponent(car.carNo);
                            });
                        });
                    });
                    setMountCarList(res.Data);
                    if (type==4){
                        setDetailOpen(true);
                    }
                }else {
                    message.error('该车辆不存在');
                    setMountCarList([]);
                }
            }else {
                message.error(res.Data);
                setMountCarList([])
            }
        })
    };
    // 开通
    const isActivate=(e,type)=>{
        setCarInfo(e.carNo);
        setTid(e.id);
        setAppId(e.appId);
        settenant_phone(e.tenant_phone);
        settenant_name(e.tenant_name);
        setActivateOpen(true);
    };
    //延期
    const isPostponement=(e,type)=>{
        setAppId(e.appId);
        const newUserId=CryptoUtils.md5(e.appId.toString());
        UserCarServer.getInfoAndAdd(e.carNo,e.appId,e.tenant_name,newUserId).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                if (res.Data.length==0){
                    message.warning('该车未开通月保');
                }else {
                    setPostponementData(res.Data);
                    setPostponementOpen(true);
                }
            }else {
                message.error(res.Data)
            }
        })
    };
    // 变更
    const isChange=(e,type)=>{
        UserCarServer.reactCarNo(e.carNo).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                if (res.Data.length==0){
                    message.warning('该车未开通月保');
                }else {
                    setPostponementData(res.Data);
                    setChangeOpen(true);
                }
            }else {
                message.error(res.Data)
            }
        })    };
    // 月卡详情
    const isInfo=(e,type)=>{
        getCarInfo(e.carNo,type);
    };
    const isDeactivate=(e)=>{
        setUid(e);
        setIsDeactivateOpen(true);
    };
    useEffect(() => {
        getCarList();
    }, [page,pageSize]);
    useEffect(() => {
        getPackageList();
    }, []);
    const sousuo=()=>{
        setPage(1);
        getCarList();
    };
    const onChange=(e,pageSize)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const isCheck=(e)=>{
        setUid(e);
        setIsChengckOpen(true);
    };
    const onOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'UserCar/check',
            payload:{uid,status:2}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('审核成功');
                setspinning(false);
                setIsChengckOpen(false);
            }else {
                message.error(res.Data);
                setIsChengckOpen(false);
                setspinning(false);
            }
        })
    };
    const toInfo=(e:number)=>{
        history.push(`/wisdomStop/carInfo?id=${e}`)
    };
    const changeCarNo=(e)=>{
        setCarNo(e.target.value);
        updateSessionStorage('/wisdomStop/carManage/','carNo',e.target.value);
    };
    const changeStutes=(e)=>{
        setStutes(e);
        updateSessionStorage('/wisdomStop/carManage/','stutes',e);
    };
    const isDele=(e)=>{
        setDeleId(e);
        setIsDeleOpen(true);
    };
    // 删除成功
    const onDeleOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'UserCar/remove',
            payload:deeleId
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setIsDeleOpen(false);
                setspinning(false);
            }else {
                message.error(res.Data);
                setIsDeleOpen(false);
                setspinning(false);
            }
        })
    };
    // 停用成功
    const onDeactivateOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'UserCar/check',
            payload:{uid,status:3}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('停用成功');
                setspinning(false);
                setIsDeactivateOpen(false);
            }else {
                message.error(res.Data);
                setIsDeactivateOpen(false);
                setspinning(false);
            }
        })
    };
    const toAdd=()=>{
        history.push('/wisdomStop/addCar');
    };
    // 获取套餐列表
    const getPackageList=()=>{
        UserCarServer.getItemList().then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setItem(res.Data);
            }
        })
    };
    // 监听时间
    const changeDate=(_:any,item:any)=>{
        if (item){
            setStartDate(item+' 00:00:00');
            let date=addMonthsToDate(item,month);
            setEndDate(date+' 23:59:59');
        }
    };
    // 开通成功确定
    const onActivateOk=()=>{
        let userId=CryptoUtils.md5(appId.toString());
        UserCarServer.adyuebao(appId,tcID,tenant_name,userId,1,tenant_phone,fee,month,startDate,endDate,tId).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('开通成功');
                setActivateOpen(false);
                setspinning(false);
            }else {
                message.error(res.Data);
                setActivateOpen(false);
                setspinning(false);
            }
        })
    };
    const changeUName=(e)=>{
        setUName(e.target.value);
        updateSessionStorage('/wisdomStop/carManage/','userName',e.target.value);
    };
    const changeUPhone=(e)=>{
        setUPhone(e.target.value);
        updateSessionStorage('/wisdomStop/carManage/','userPhone',e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <div>
                        <Button type='primary' onClick={toAdd}>添加车辆</Button>
                    </div>
                    <Space>
                        <Input
                            onChange={changeCarNo}
                            addonBefore="车牌号:"
                            value={carNo}
                        />
                        <Input
                            onChange={changeUName}
                            addonBefore="用户名:"
                            value={uName}
                        />
                        <Input
                            onChange={changeUPhone}
                            addonBefore="手机号:"
                            value={uPhone}
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
                                状态:
                            </div>
                            <Select
                                onChange={changeStutes}
                                value={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value: 0, label: '全部' },
                                    { value: 1, label: '未审核' },
                                    { value: 2, label: '已审核' },
                                    { value: 3, label: '已停用' },
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
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                dataSource={props.list}
                scroll={{y:'70vh'}}
                rowKey={(columns) => columns.id}
                size='small'
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal open={isCheckOpen} onCancel={()=>setIsChengckOpen(false)} onOk={onOk} loading={spinning}>
                <div>是否要审核车辆</div>
            </Modal>
            <Modal open={isDeleOpen} onCancel={()=>setIsDeleOpen(false)} onOk={onDeleOk} loading={spinning}>
                <div>是否删除?</div>
            </Modal>
            <Modal open={isDeactivateOpen} onCancel={()=>setIsDeactivateOpen(false)} onOk={onDeactivateOk} loading={spinning}>
                <div>是否停用?</div>
            </Modal>
            {/*开通月保*/}
            <Modal title='开通月保'  open={activateOpen} loading={spinning} onOk={onActivateOk} onCancel={()=>setActivateOpen(false)}>
                <Form
                    form={form}
                    onValuesChange={(changedValues, allValues) => {
                        // 当套餐变化时，更新月份选项
                        if (changedValues.packageId) {
                            const packageItem = item.find(item => item.itemId === changedValues.packageId);
                            setSelectedPackage(packageItem);
                            // 生成月份选项
                            if (packageItem && packageItem.chargeStand) {
                                const options = packageItem.chargeStand.map(stand => ({
                                    value: stand.months,
                                    label: `${stand.months}个月 (${stand.totalFee}元)`,
                                    fee: stand.totalFee
                                }));
                                setMonthOptions(options);
                                setTcid(packageItem.itemId);
                            } else {
                                setMonthOptions([]);
                                setTcid('');
                            }
                            form.setFieldsValue({ month: undefined, fee: undefined });
                        }
                        // 当月份变化时，更新费用显示及状态变量
                        if (changedValues.month && selectedPackage) {
                            const selectedMonth = monthOptions.find(option => option.value === changedValues.month);
                            if (selectedMonth) {
                                form.setFieldsValue({ fee: selectedMonth.fee });
                                // 存储月份和金额到状态变量，供后续使用
                                setMonth(changedValues.month); // 更新月份状态
                                setFee(selectedMonth.fee);     // 更新金额状态
                                setTcid(allValues.packageId);  // 存储选中的套餐ID
                                let dataTime=getTimeRangeByMonths(changedValues.month);
                                setStartDate(dataTime.startTime+' 00:00:00');
                                setEndDate(dataTime.endTime+' 23:59:59');
                            }else {
                                setMonth(0);
                                setFee(0);
                                setTcid('');
                            }
                        }
                    }}
                >
                    <Form.Item label="车牌号" >
                        <Input value={carInfo}/>
                    </Form.Item>
                    <Form.Item label="选择套餐" name="packageId">
                        <Select
                            placeholder="请选择套餐类型"
                            style={{ width: 300 }}
                            onChange={(value) => {
                                form.setFieldsValue({ month: undefined });
                            }}
                        >
                            {item.map(packageItem => (
                                <Select.Option key={packageItem.itemId} value={packageItem.itemId}>
                                    {packageItem.tcName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="选择月份" name="month">
                        <Select placeholder="请先选择套餐" style={{ width: 300 }}>
                            {monthOptions.map(option => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    {month==0?'':
                        <>
                            <Form.Item label="开始时间">
                                <DatePicker onChange={changeDate} value={dayjs(startDate)}/>
                            </Form.Item>
                            <Form.Item label="结束时间">
                                <DatePicker value={dayjs(endDate)} disabled/>
                            </Form.Item>
                        </>
                    }
                    <Form.Item label="费用" name="fee">
                        <Input disabled placeholder="选择月份后显示" />
                    </Form.Item>
                </Form>
            </Modal>
            {/*详情弹窗*/}
            <Modal
                title="车辆详情"
                open={detailOpen}
                onCancel={() => setDetailOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailOpen(false)}>关闭</Button>
                ]}
            >
                <div style={{ maxHeight: '55vh', overflowY: 'auto', padding: '0 16px' }}>
                    {mountCarList.map((item, index) => (
                        <div key={index} style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                            {/* 用户基本信息 */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                <div>
                                    <div style={{ color: '#999', fontSize: 14 }}>姓名</div>
                                    <div>{item.userName}</div>
                                </div>
                                <div>
                                    <div style={{ color: '#999', fontSize: 14 }}>手机号</div>
                                    <div>{item.mobile}</div>
                                </div>
                            </div>

                            {/* 套餐信息列表 */}
                            {item.parkServiceList.map((val, serviceIndex) => (
                                <div key={serviceIndex} style={{ marginTop: 16, paddingTop: 16, borderTop: '1px dashed #eee' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <div>
                                            <div style={{ color: '#999', fontSize: 14 }}>园区名字</div>
                                            <div>{val.parkName}</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#999', fontSize: 14 }}>套餐类型</div>
                                            <div>{val.tcName}</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <div>
                                            <div style={{ color: '#999', fontSize: 14 }}>开始时间</div>
                                            <div>{val.beginTime}</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#999', fontSize: 14 }}>到期时间</div>
                                            <div>{val.endTime}</div>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: 12 }}>
                                        <div style={{ color: '#999', fontSize: 14 }}>剩余日期</div>
                                        <div>{val.remainingDays < 1 ? '不足一天' : `${val.remainingDays}天`}</div>
                                    </div>

                                    {/* 车辆信息列表 */}
                                    {val.carList.map((car, carIndex) => (
                                        <div key={carIndex} style={{ marginTop: 16, padding: 12, backgroundColor: '#fafafa', borderRadius: 4 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                <div>
                                                    <div style={{ color: '#999', fontSize: 14 }}>车牌</div>
                                                    <div>{car.carNo}</div>
                                                </div>
                                                <div>
                                                    <div style={{ color: '#999', fontSize: 14 }}>颜色</div>
                                                    <div>
                                                        {car.carNoColor === 'BLUE' && '蓝色'}
                                                        {car.carNoColor === 'GREEN' && '绿色'}
                                                        {car.carNoColor === 'WHITE' && '白色'}
                                                        {car.carNoColor === 'YELLOW' && '黄色'}
                                                        {car.carNoColor === 'BLACK' && '黑色'}
                                                        {!['BLUE', 'GREEN', 'WHITE', 'YELLOW', 'BLACK'].includes(car.carNoColor) && '其余颜色'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#999', fontSize: 14 }}>车辆类型</div>
                                                <div>
                                                    {car.carType === 'CAR' && '小车'}
                                                    {car.carType === 'LARGE' && '大车'}
                                                    {car.carType === 'EXTRA_LARGE' && '超大车'}
                                                    {!['CAR', 'LARGE', 'EXTRA_LARGE'].includes(car.carType) && '其他类型'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </Modal>
            {/*月卡延期*/}
            <Modal title={'月卡延期'} open={postponementOpen} onCancel={() => setPostponementOpen(false)} footer={null} onOk={() => setPostponementOpen(false)}>
                <AddMonthlyInsurance data={postponementData} appId={appId}  onSuccess={() => setPostponementOpen(false)}/>
            </Modal>
            {/*月卡变更*/}
            <Modal title={'月卡变更'} open={changeOpen} onCancel={() => setChangeOpen(false)} footer={null} onOk={() => setChangeOpen(false)}>
                <EditMonthlyInsurance data={postponementData} onSuccess={() => setChangeOpen(false)}/>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        list: state.UserCar.list,
        count: state.UserCar.count,
    }
};
export default connect(mapStateToProps) (UserCar)