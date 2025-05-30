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
    Tag
} from "antd";
import {useEffect, useState} from "react";
import {connect} from "umi";
import dayjs from "dayjs";
import ImageUploader from "@/components/ImageUploader";

const Complaint=(props:any)=>{
    const [loading, setLoading] = useState(false);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState(sessionStorage.getItem('propertyServerManageComplaintName')||'');
    const [phone,setPhone]=useState(sessionStorage.getItem('propertyServerManageComplaintPhone')||'');
    const [state,setState]=useState(0);
    const [startDate,setstartDate]=useState('2000-01-01');
    const [endDate,setendDate]=useState('2099-01-01');
    const [openID,setopenID]=useState(0);
    const [open,setOpen]=useState(false);
    const [tenantId,settenantId]=useState(0);
    const [conten,setconten]=useState('');
    const [upimg,setUpImg]=useState('');
    const [imgB64,setImgB64]=useState('');
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
            title: '姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '用户联系方式',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
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
            title: '操作',
            dataIndex: 'xx',
            key: 'xx',
            render: (_: any, record: any) => (
               <Button type='primary' onClick={()=>tohuifu(record)}>回复</Button>
            ),
        },
    ];
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
        } else {
            setstartDate(data[0]);
            setendDate(data[1]);
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
            payload:{tenantId,conten,upimg}
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
        sessionStorage.setItem('propertyServerManageComplaintName',e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
        sessionStorage.setItem('propertyServerManageComplaintPhone',e.target.value);
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
                                <DatePicker.RangePicker onChange={changeDate}/>
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
            <Modal open={open} onCancel={()=>setOpen(false)} title='回复消息' onOk={onOk} loading={loading}>
                <Form>
                    <Form.Item label='消息内容'>
                        <Input.TextArea value={conten} onChange={(e)=>setconten(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label='图片'>
                        <ImageUploader onImageUpload={onimgname} oldBase64={onb64}/>
                        {imgB64?<Image src={imgB64} style={{width:'100px',height:'100px'}}/>:''}
                    </Form.Item>
                </Form>
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
