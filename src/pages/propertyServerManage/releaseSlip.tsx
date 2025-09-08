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
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {history,connect} from "umi";
import {updateSessionStorage,checkSessionStorage} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import CmpImageUploader from "@/components/ImageUploader";
import * as ReleaseSlipServer from "@/services/releaseSlip";

const ReleaseSlip=(props)=>{
    const [startDate,setStartDate]=useState(checkSessionStorage('/propertyServerManage/releaseSlip/','startDate')|| '2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStorage('/propertyServerManage/releaseSlip/','endDate') || '2099-01-01');
    const [name,setName]=useState(checkSessionStorage('/propertyServerManage/releaseSlip/','name') || '');
    const [phone,setPhone]=useState(checkSessionStorage('/propertyServerManage/releaseSlip/','phone') || '');
    const [status,setStatus]=useState(Number(checkSessionStorage('/propertyServerManage/releaseSlip/','status')) || 0);
    const [userID,setUserID]=useState(Number(checkSessionStorage('/propertyServerManage/releaseSlip/','userID')) || 0);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [uid,setUid]=useState(0);
    const [dopen,setDopen]=useState(false);
    const [spinning,setspinning]=useState(false);
    const [infoOpen,setInfoOpen]=useState(false);
    const [checkOpen,setcheckOpen]=useState(false);
    const [releaseOpen,setReleaseOpen]=useState(false);
    const [imgsName,setImgsName]=useState([]);// 图片名字
    const [goodJson,setGoodJson]=useState([]);
    const [b64,setB64]=useState([]);// 显示的多图
    const [displayB64,setDisplayB64]=useState([]);// 详情弹窗显示的图片
    const columns=[
        {
            title:'提交日期',
            dataIndex:'created',
            key:'created',
            width:150,
            render:(text)=>{
                return dayjs(text).format('YYYY-MM-DD');
            }
        },
        {
            title:'姓名',
            dataIndex:'tenant_name',
            key:'tenant_name',
            width:100,
            render:(text)=>{
                return text||'';
            }
        },
        {
            title:'手机号',
            dataIndex:'tenant_phone',
            key:'tenant_phone',
            width:100,
            render:(text)=>{
                return text||'';
            }
        },
        {
            title:'申请出行时间',
            dataIndex:'releaseDate',
            key:'releaseDate',
            width:150,
            render:(text)=>{
                return dayjs(text).format('YYYY-MM-DD');
            }
        },
        {
            title:'放行时间',
            dataIndex:'releaseTime',
            key:'releaseTime',
            width:150,
            render:(text,record)=>{
                if (record.relStatus===3){
                    return dayjs(text).format('YYYY-MM-DD');
                }else {
                    return '待放行';
                }
            }
        },
        {
            title:'放行人',
            dataIndex:'user_name',
            key:'user_name',
            width:150,
            render:(text,record)=>{
                if (record.relStatus===3){
                    return text;
                }else {
                    return '待放行';
                }
            }
        },
        {
            title:'状态',
            dataIndex:'relStatus',
            key:'relStatus',
            width:100,
            render:(text)=>{
                if (text===1){
                    return <Tag color="warning">待审核</Tag>;
                }
                if (text===2){
                    return <Tag color="processing">已审核</Tag>;
                }
                if (text===3){
                    return <Tag color="success">已放行</Tag>;
                }
                return null;
            }
        },
        {
            title:'操作',
            dataIndex:'operation',
            key:'operation',
            width:200,
            render:(text,record)=>{
                return(
                    <Space>
                        <Button type="primary" onClick={()=>openInfo(record)}>
                            详情
                        </Button>
                        {
                            record.relStatus==1?<>
                                <Button type="primary" danger onClick={()=>del(record)}>删除</Button>
                                <Button type="primary" onClick={()=>isCheck(record)}>审核</Button>
                                <Button type='primary' onClick={()=>toinfo(record)}>编辑</Button>
                            </>:''
                        }
                        {
                            record.relStatus==2?<Button type='primary' onClick={()=>isRelease(record)}>放行</Button>:''
                        }
                    </Space>
                )
            }
        },
    ];
    const suosou=()=>{
        setPage(1);
        getListfenYen();
        getList();
    };
    // 去详情页面
    const toinfo=(e)=>{
        history.push(`/propertyServerManage/releaseSlipInfo?id=${e.id}`);
    };
    // 去详情页面
    const toadd=()=>{
        history.push('/propertyServerManage/addReleaseSlipInfo');
    };
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/propertyServerManage/releaseSlip/','startDate','2000-01-01');
            updateSessionStorage('/propertyServerManage/releaseSlip/','endDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/propertyServerManage/releaseSlip/','startDate',data[0]);
            updateSessionStorage('/propertyServerManage/releaseSlip/','endDate',data[1]);
        }
    };
    // 获取列表
    const getList=()=>{
        props.dispatch({
            type:'ReleaseSlip/fetch',
            payload:{page, pageSize, name, phone, startDate, endDate, status, userID}
        })
    };
    const getListfenYen=()=>{
        props.dispatch({
            type:'ReleaseSlip/fenye',
            payload:{ name, phone, startDate, endDate, status, pageSize,userID}
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getListfenYen();
    }, []);
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 监听状态
    const changeState=(e)=>{
        setStatus(e);
        updateSessionStorage('/propertyServerManage/releaseSlip/','status',e);
    };
    const del=(e)=>{
      setUid(e.id);
      setDopen(true);
    };
    const delFn=()=>{
        setspinning(true);
        props.dispatch({
            type:'ReleaseSlip/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setspinning(false);
                setDopen(false);
            }else {
                message.error(res.Data);
                setspinning(false);
                setDopen(false);
            }
        })
    };
    // 详情弹窗
    const openInfo=(e)=>{
        setInfoOpen(true);
        console.log('e',e);
        getOne(e.id);
    };
    // 获取放行条详情
    const getOne=(e)=>{
        setspinning(true);
        ReleaseSlipServer.one(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setGoodJson(JSON.parse(res.Data.goodJson));
                let imageBase64=res.Data.imageBase64;
                if (imageBase64){
                    setDisplayB64(imageBase64);
                }else {
                    setDisplayB64([]);
                }
            }
            setspinning(false);
        })
    };
    // 审核弹窗
    const isCheck=(e)=>{
        setUid(e.id);
        setcheckOpen(true);
    };
    // 审核确定按钮
    const checkFn=()=>{
        setspinning(true);
        props.dispatch({
            type:'ReleaseSlip/check',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('审核成功');
                setspinning(false);
                setcheckOpen(false);
            }else {
                message.error(res.Data);
                setspinning(false);
                setcheckOpen(false);
            }
        })
    };
    // 放行弹窗
    const isRelease=(e)=>{
        setUid(e.id);
        setReleaseOpen(true);
    };
    // 放行确定按钮
    const releaseFn=()=>{
        setspinning(true);
        let imgs=imgsName.join('|');
        props.dispatch({
            type:'ReleaseSlip/release',
            payload:{uid,imgs}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('放行成功');
                setspinning(false);
                setReleaseOpen(false);
            }else {
                message.error(res.Data);
                setspinning(false);
                setReleaseOpen(false);
            }
        })
    };
    // 多图base64
    const handBase64s=(vals:string)=>{
        setB64([...b64,vals]);
    };
    const handleDelete=(index:number)=>{
        const newImages = [...imgsName];
        newImages.splice(index, 1);
        setImgsName(newImages);
        const newB64 = [...b64];
        newB64.splice(index, 1);
        setB64(newB64);
    };
    // 多图名字
    const handleImageUploads=(val:string)=>{
        setImgsName([...imgsName,val]);
    };
    // 监听手机号
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/propertyServerManage/releaseSlip/','phone',e.target.value);
    };
    // 监听名字
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/propertyServerManage/releaseSlip/','name',e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <div>
                    <Button type="primary" onClick={toadd}>添加放行条</Button>
                </div>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="手机号:"
                            onChange={changePhone}
                            value={phone}
                        />
                        <Input
                            addonBefore="姓名:"
                            onChange={changeName}
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
                            <Select value={status} onChange={changeState}  style={{ width: 120 }}>
                                <Select.Option value={0}>
                                    全部
                                </Select.Option>
                                <Select.Option value={1}>
                                    待审核
                                </Select.Option>
                                <Select.Option value={2}>
                                    已审核
                                </Select.Option>
                                <Select.Option value={3}>
                                    已放行
                                </Select.Option>
                            </Select>
                        </Space.Compact>
                        <Button type="primary" onClick={suosou}>
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
                scroll={{y:'60vh'}}
                dataSource={props.ReportList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            {/* 删除的弹窗*/}
            <Modal title="删除" open={dopen} onCancel={() => setDopen(false)} onOk={delFn} loading={spinning}>
                <p>确定删除吗？</p>
            </Modal>
            {/* 详情的弹窗*/}
            <Modal title="详情" open={infoOpen} onCancel={() => setInfoOpen(false)} onOk={() => setInfoOpen(false)} loading={spinning}>
                <div>
                    <Space style={{display:"flex",flexWrap:'wrap'}}>
                        {displayB64.map((item:any)=>{
                            return(
                                <div key={item}>
                                    <Image src={item} style={{ width: '80px', height: '80px' }} />
                                </div>
                            )
                        })}
                    </Space>
                    {goodJson.map((item:any)=>{
                        return(
                            <div key={item.id}>
                                <Space>
                                    <span>商品名称：{item.title}</span>
                                    <span>商品数量：{item.quantity}</span>
                                </Space>
                            </div>
                        )
                    })}
                </div>
            </Modal>
            {/* 审核的弹窗*/}
            <Modal title="审核" open={checkOpen} onCancel={() => setcheckOpen(false)} onOk={checkFn} loading={spinning}>
                <p>确定删除吗？</p>
            </Modal>
            {/* 放行的弹窗*/}
            <Modal title="放行" open={releaseOpen} onCancel={() => setReleaseOpen(false)} onOk={releaseFn} loading={spinning}>
               <Form>
                   <Form.Item label="多图">
                       <CmpImageUploader onImageUpload={handleImageUploads} oldBase64={handBase64s}/>
                       <Space style={{display:'flex',flexWrap:'wrap'}}>
                           <Space style={{display:'flex',flexWrap:'wrap',marginTop:'25px'}}>
                               {b64.length>0?b64.map((item:any,index:number)=>{
                                   return(
                                       <div key={index} style={{ display: 'flex', alignItems: 'center', position: 'relative',marginLeft:'20px'}}>
                                           <Image src={item} style={{ width: '80px', height: '80px' }} />
                                           <Button
                                               type="primary"
                                               danger
                                               onClick={() => handleDelete(index)}
                                               style={{
                                                   position: 'absolute',
                                                   top: '0',
                                                   left: '0',
                                                   zIndex: 1,
                                                   padding: '2px 4px',
                                                   transform: 'translate(-50%, -50%)', // 使按钮居中于图片的左上角
                                               }}
                                           >
                                               删除
                                           </Button>
                                       </div>
                                   )
                               }):''}
                           </Space>
                       </Space>
                   </Form.Item>
               </Form>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ReportList: state.ReleaseSlip.list,
        count: state.ReleaseSlip.count,
    }
};
export default connect(mapStateToProps)(ReleaseSlip);
