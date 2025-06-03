import {
    Button,
    DatePicker,
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
    const [openID,setopenID]=useState(0);
    const [startDate,setstartDate]=useState(checkSessionStorage('/propertyServerManage/reportLog/','startDate')||'2000-01-01');
    const [endDate,setendDate]=useState(checkSessionStorage('/propertyServerManage/reportLog/','endDate')||'2099-01-01');
    const [loading, setLoading] = useState(false);
    const [isOpen,setIsOpen]=useState(false);
    const [uid,setUid]=useState(0);
    // 跟进人ID
    const [userID,setUserID]=useState(0);
    // 修理成功的id
    const [OnId,setOnId]=useState(0);
    // 修理成功的弹窗
    const [onOpen,setOnOpen]=useState(false);
    const [count,setcount]=useState(0);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns=[
        {
            title: '日期',
            dataIndex: 'created',
            render: (_: any, record: any) => (
                <div>
                    {dayjs(_).format('YYYY-MM-DD HH:mm:ss')}
                </div>
            ),
        },
        {
            title: '房屋',
            dataIndex: 'house_name',
        },
        {
            title: '单元名称',
            dataIndex: 'unitList',
            key: 'unitList',
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
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
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
        },
        {
            title: '跟进人',
            dataIndex: 'userName',
            render:(_:any,record:any)=>(
                <div>
                    {record.userName?<Tag color='green'>{record.userName}</Tag>:<Tag color='red'>未分配跟进人</Tag>}
                </div>
            )
        },
        {
            title: '报修内容',
            dataIndex: 'repair_content',
            render: (_: any, record: any) => (
                <Input.TextArea value={_}/>
            ),
        },
        {
            title: '状态',
            dataIndex: 'repair_status',
            render: (_: any, record: any) => (
                <div>
                    {record.repair_status==2?<Tag color='green'>已完成</Tag>:<Tag color='red'>未处理</Tag>}
                </div>
            ),
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <div>
                    {
                        record.repair_status==1?(
                            <Space>
                                {uqx[298]=='1'?<Button type='primary' onClick={()=>genjin(record)}>分配跟进人</Button>:''}
                                <Button type='primary' onClick={()=>onokOpen(record)}>修理完成</Button>
                            </Space>
                        ):''
                    }

                </div>
            ),
        },
    ];
    // 确定分配跟进人按钮
    const onOk=()=>{
        setLoading(true);
        props.dispatch({
            type:'Report/fenpei',
            payload:{uid,userID}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                setLoading(false);
                message.success('分配成功');
                setIsOpen(false);
            }else {
                message.error(res.Data);
                setLoading(false);
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
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
            }
        })
    };
    // 分配跟进人弹窗
    const genjin=(e)=>{
      setIsOpen(true);
      setUid(e.id);
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
        setOnOpen(true);
    };
    // 处理完成确定
    const onhandleOk=()=>{
        setLoading(true);
        props.dispatch({
            type:'Report/edit',
            payload:{OnId}
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
    }, []);
    const changeName=(e)=>{
        setname(e.target.value);
        updateSessionStorage('/propertyServerManage/reportLog/','name',e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/propertyServerManage/reportLog/','phone',e.target.value);
    };
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
                                    未处理
                                </Select.Option>
                                <Select.Option value={2}>
                                    已完成
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
        {/*    修理成功的按钮*/}
            <Modal open={onOpen} loading={loading} onOk={onhandleOk} onCancel={()=>setOnOpen(false)}>
                <div>确定处理完成</div>
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