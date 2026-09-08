import {connect, history} from 'umi';
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {
    Button,
    DatePicker,
    Dropdown,
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
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import * as UserCarServer from "@/services/userCar";

const WxUserCar=(props:any)=>{
    const [page,setPage]=useState(1);// 页码
    const [pageSize,setPageSize]=useState(20);// 页数
    const [carNo,setCarNo]=useState(checkSessionStorage('/wisdomStop/carManage/','carNo')||'');//车牌号
    const [uName,setUName]=useState(checkSessionStorage('/wisdomStop/carManage/','uName')||'');//姓名
    const [uPhone,setUPhone]=useState(checkSessionStorage('/wisdomStop/carManage/','uPhone')||'');//手机号
    const [stutes,setStutes]=useState(checkSessionStorage('/wisdomStop/carManage/','stutes')||0);
    const [uid,setUid]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [isCheckOpen,setIsChengckOpen]=useState(false);
    const [deeleId,setDeleId]=useState(0);
    const [isDeleOpen,setIsDeleOpen]=useState(false);
    const [isDeactivateOpen,setIsDeactivateOpen]=useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [mountCarList, setMountCarList] = useState([]); // 存储详情数据
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
            title: '房号',
            dataIndex: 'unitList',
            key: 'unitList',
            align:'center',
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
            width:200,
            render: (text:any, record:any) => {
                const limitedUnitList = record.unitList.slice(0, 2);
                return(
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                        {limitedUnitList.map((item, index) => (
                            <span key={index}>{item.unit_name}{index < limitedUnitList.length - 1 ? ',' : ''}</span>
                        ))}
                        {record.unitList.length > 2 && <span>...</span>}
                    </div>
                )
            }
        },
        {
            title: '用户名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            align:'center',
        },
        {
            title: '手机号',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
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
                    },{
                        key: 'expire',
                        label: '月保信息',
                        onClick: () => isInfo(record,4)
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
    // 获取列表
    const getCarList=()=>{
        props.dispatch({
            type:'CarManage/fetch',
            payload:{page,carNo,userId:0,stutes,pageSize,userType:1,uName,uPhone}
        })
    };

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
            type:'CarManage/check',
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
    const changeUName=(e)=>{
        setUName(e.target.value);
        updateSessionStorage('/wisdomStop/carManage/','uName',e.target.value);
    };
    const changeUPhone=(e)=>{
        setUPhone(e.target.value);
        updateSessionStorage('/wisdomStop/carManage/','uPhone',e.target.value);
    };
    const changeStutes=(e)=>{
        setStutes(e);
        updateSessionStorage('/wisdomStop/carManage/','stutes',e);
    };
    const isDele=(e)=>{
        setDeleId(e);
        setIsDeleOpen(true);
    };
    const onDeleOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'CarManage/remove',
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
    const onDeactivateOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'CarManage/check',
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
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
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
            {/*开通月保后的车辆详情*/}
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
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        list: state.CarManage.list,
        count: state.CarManage.count,
    }
};
export default connect(mapStateToProps) (WxUserCar)