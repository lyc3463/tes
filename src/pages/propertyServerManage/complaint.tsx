import {
    Button,
    DatePicker,
    Form,
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
    Tag, Tooltip
} from "antd";
import {useEffect, useState} from "react";
import {connect} from "umi";
import dayjs from "dayjs";
import ImageUploader from "@/components/ImageUploader";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const Complaint=(props:any)=>{
    const [loading, setLoading] = useState(false);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState(checkSessionStorage('/propertyServerManage/complaint/','name')||'');
    const [phone,setPhone]=useState(checkSessionStorage('/propertyServerManage/complaint/','phone')||'');
    const [state,setState]=useState(0);
    const [startDate,setstartDate]=useState(checkSessionStorage('/propertyServerManage/complaint/','startDate')||'2000-01-01');
    const [endDate,setendDate]=useState(checkSessionStorage('/propertyServerManage/complaint/','endDate')||'2099-01-01');
    const [openID,setopenID]=useState(0);
    const [open,setOpen]=useState(false);
    const [tenantId,settenantId]=useState(0);
    const [type,setType]=useState(0);
    const [conten,setconten]=useState('');
    const [title,setTitle]=useState('投诉建议回复');
    const [upimg,setUpImg]=useState('');
    const [imgB64,setImgB64]=useState('');
    const [complaintTitle,setComplaintTitle]=useState('');
    const [complaintContent,setComplaintContent]=useState('');
    const [enitOpen,setEnitOpen]=useState(false);
    const [okOpen,setOkOpen]=useState(false);
    const [uid,setUid]=useState(0);
    const columns=[
        {
            title: '日期',
            dataIndex: 'created',
            render: (_: any, record: any) => (
                <div>
                    {dayjs(record.created).format("YYYY-MM-DD")}
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
            title: '姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
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
            key: 'tenant_phone',
        },
        {
            title: '投诉类型',
            dataIndex: 'complaintType',
            key: 'complaintType',
            render:(text:any,record:any,)=>{
                const statusConfig = {
                    1: {text: '服务类', color: 'red'},
                    2: {text: '收费类', color: 'blue'},
                    3: {text: '工程类', color: 'orange'},
                    4: {text: '卫生类', color: 'purple'},
                };
                const config = statusConfig[record.complaintType] || {text: '未知状态', color: 'gray'};
                return (
                    <div>
                        <Tag color={config.color}>{config.text}</Tag>
                    </div>
                )
            }
        },
        {
            title: '投诉标题',
            dataIndex: 'complaintTitle',
            key: 'complaintTitle',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.complaintTitle}>
                            {record.complaintTitle}
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '投诉内容',
            dataIndex: 'complaint_content',
            key: 'complaint_content',
            render: (_: any, record: any) => (
                <Input.TextArea value={record.complaint_content}>

                </Input.TextArea>
            ),
        },
        {
            title: '状态',
            dataIndex: 'complaintStatus',
            key: 'complaintStatus',
            render: (_: any, record: any) => (
                <div>
                    {record.complaintStatus==1?'待处理':'已处理'}
                </div>
            ),
        },
        {
            title: '操作',
            dataIndex: 'xx',
            key: 'xx',
            render: (_: any, record: any) => (
               <Space>
                   {record.complaintStatus==1?
                   <>
                   <Button type='primary' onClick={()=>changeType(record)}>变更类型</Button>
                   <Button type='primary' onClick={()=>isOk(record)}>处理完成</Button>
                   </>
                   :''
                   }
                   <Button type='primary' onClick={()=>tohuifu(record)}>回复</Button>
               </Space>
            ),
        },
    ];
    // 处理完成
    const isOk=(e)=>{
      setUid(e.id);
      setOkOpen(true);
    };
    // 获取投诉建议列表
    const getList=()=>{
        props.dispatch({
            type:'Tousu/fetch',
            payload:{page,name,phone,state,startDate,endDate,openID,pageSize}
        })
    };
    const getfenye=()=>{
        props.dispatch({
            type:'Tousu/fenye',
            payload:{name,phone,state,startDate,endDate,openID,pageSize}
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    const onChange=(e,pageSize)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        getfenye();
    }, []);
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setstartDate('2000-01-01');
            setendDate('2099-01-01');
            updateSessionStorage('/propertyServerManage/complaint/','startDate','2000-01-01');
            updateSessionStorage('/propertyServerManage/complaint/','endDate','2099-01-01');
        } else {
            setstartDate(data[0]);
            setendDate(data[1]);
            updateSessionStorage('/propertyServerManage/complaint/','startDate',data[0]);
            updateSessionStorage('/propertyServerManage/complaint/','endDate',data[1]);
        }
    };
    const sousuo=()=>{
        setPage(1);
        getfenye();
        getList();
    };
    // 回复内容
    const tohuifu=(e:any)=>{
        settenantId(e.tenantId);
        setOpen(true);
    };
    const onimgname=(item:string)=>{
        setUpImg(item);
    };
    const onb64=(item:string)=>{
        setImgB64(item);
    };
    const onOk=()=>{
        setLoading(true);
        props.dispatch({
            type:'TenantInfo/add',
            payload:{tenantId,conten,upimg,title}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                setLoading(false);
                message.success('回复成功');
                setOpen(false);
            }else {
                setLoading(false);
                message.error(res.Data);
                setOpen(false);
            }
        })
    };
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/propertyServerManage/complaint/','name',e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/propertyServerManage/complaint/','phone',e.target.value);
    };
    const changeType=(e)=>{
        setEnitOpen(true);
        setType(e.complaintType);
        setUid(e.id);
        setComplaintTitle(e.complaintTitle);
        setComplaintContent(e.complaint_content);
    };
    // 类型变更
    const onTypeOk=()=>{
        setLoading(true);
        props.dispatch({
            type:'Tousu/edit',
            payload:{uid,type,complaintTitle,complaintContent}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('变更成功');
                setEnitOpen(false);
                setLoading(false);
            }else {
                message.error(res.Data);
                setEnitOpen(false);
                setLoading(false);
            }
        })
    };
    const onStutesOk=()=>{
        setLoading(true);
        props.dispatch({
            type:'Tousu/check',
            payload:uid
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('已完成');
                setOkOpen(false);
                setLoading(false);
            }else {
                message.error(res.Data);
                setOkOpen(false);
                setLoading(false);
            }
        })
    };
    const changeEditType=(e)=>{
      setType(e);
    };
    return(
        <div>
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
                    dataSource={props.TousuList}
                    size='small'
                    // rowClassName={(record, index) =>
                    //     index % 2 === 1 ? 'tbodd' : 'tbeven'
                    // }
                />
                {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            </Spin>
            {/*回复消息弹窗*/}
            <Modal open={open} onCancel={()=>setOpen(false)} title='回复消息' onOk={onOk} loading={loading}>
                <Form>
                    <Form.Item label='标题'>
                        <Input value={title} onChange={(e)=>setTitle(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label='消息内容'>
                        <Input.TextArea value={conten} onChange={(e)=>setconten(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label='图片'>
                        <ImageUploader onImageUpload={onimgname} oldBase64={onb64}/>
                        {imgB64?<Image src={imgB64} style={{width:'100px',height:'100px'}}/>:''}
                    </Form.Item>
                </Form>
            </Modal>
            {/*变更类型弹窗*/}
            <Modal open={enitOpen} onCancel={()=>setEnitOpen(false)} title='变更类型' onOk={onTypeOk} loading={loading}>
                <Form>
                    <Form.Item label='类型'>
                        <Select value={type} onChange={changeEditType}>
                            <Select.Option value={1}>服务类</Select.Option>
                            <Select.Option value={2}>收费类</Select.Option>
                            <Select.Option value={3}>工程类</Select.Option>
                            <Select.Option value={4}>卫生类</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            {/*完成弹窗*/}
            <Modal open={okOpen} onCancel={()=>setOkOpen(false)} title='完成' onOk={onStutesOk} loading={loading}>
                <div>是否完成?</div>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        TousuList: state.Tousu.list,
        count: state.Tousu.count,
    }
};
export default connect(mapStateToProps) (Complaint)
