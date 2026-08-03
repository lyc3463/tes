import {
    Button,
    DatePicker, Dropdown,
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
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {history,connect} from "umi";
import {updateSessionStorage,checkSessionStorage} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import CmpImageUploader from "@/components/ImageUploader";
import * as ReleaseSlipServer from "@/services/releaseSlip";
import ImageUploadPng from "@/components/ImageUploadPng";

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
    const [remark,setRemark]=useState('');// 驳回、终止描述
    const [rejectStatus,setRejectStatus]=useState(0);// 驳回状态 终止状态
    const [rejectOpen,setRejectOpen]=useState(false);// 驳回弹窗
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
            render:(text,record)=>{
                const statusConfig = {
                    1: { text: '待审核', color: 'warning' },
                    2: { text: '已审核', color: 'processing' },
                    3: { text: '已放行', color: 'success' },
                    4: { text: '已驳回', color: 'error' },
                    5: { text: '已终止', color: 'default' },
                };
                const config = statusConfig[record.relStatus] || { text: '未知状态', color: 'gray' };
                // 判断是否需要展示原因提示
                const needTip = [5, 4].includes(record.relStatus) && record.rejectReason;

                if (needTip) {
                    return (
                        <Tooltip title={record.rejectReason}>
                            <Tag color={config.color}>{config.text}</Tag>
                        </Tooltip>
                    );
                }
                return <Tag color={config.color}>{config.text}</Tag>;
            }
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: 200,
            render: (_, record) => {
                const { relStatus } = record;
                const menuItems = [
                    {
                        key: 'info',
                        label: '详情',
                        onClick: () => openInfo(record)
                    }
                ];
                // 状态2/3：终止、驳回
                if ([2, 1,4].includes(relStatus)) {
                    menuItems.push(
                        { key: 'terminate', label: '终止', onClick: () => isTerminate(record) },
                        { key: 'reject', label: '驳回', onClick: () => isReject(record) }
                    );
                }

                // 状态1：删除、审核
                if (relStatus === 1) {
                    menuItems.push(
                        { key: 'delete', label: '删除', onClick: () => del(record) },
                        { key: 'check', label: '审核', onClick: () => isCheck(record) }
                    );
                }

                // 状态1/4：编辑
                if ([1, 4].includes(relStatus)) {
                    menuItems.push({ key: 'edit', label: '编辑', onClick: () => toinfo(record) });
                }

                // 状态2：放行
                if (relStatus === 2) {
                    menuItems.push({ key: 'release', label: '放行', onClick: () => isRelease(record) });
                }

                return (
                    <Space>
                        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                            <Button type="primary">操作</Button>
                        </Dropdown>
                    </Space>
                );
            }
        }
    ];
    // 驳回弹窗
    const isReject=(e:any)=>{
        setUid(e.id);
        setRejectStatus(4);
        setRejectOpen(true);
    };
    // 终止
    const isTerminate=(e:any)=>{
        setUid(e.id);
        setRejectStatus(5);
        setRejectOpen(true);
    };
    const suosou=()=>{
        setPage(1);
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
    const rejectOk=()=>{
        setspinning(true);
        try {
            props.dispatch({
                type:'ReleaseSlip/reject',
                payload:{uid,rejectStatus,remark}
            }).then((res:TypeErrorCode)=>{
                if (res.ErrorCode==0){
                    message.success('操作成功！');
                    getList();
                }
            })
        }catch (err){
            message.error(err);
        }finally {
          // 关闭弹窗
            setspinning(false);
            setRejectOpen(false);
        }
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
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
        getOne(e.id);
    };
    // 获取放行条详情
    const getOne=(e)=>{
        setspinning(true);
        ReleaseSlipServer.one(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('放行条详情',res.Data);
                setGoodJson(JSON.parse(res.Data.goodJson));
                let imageBase64=res.Data.imageName;
                if (imageBase64){
                    setDisplayB64(imageBase64.split('|'));
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
    const onImageUpload = (imgName: string) => {
        setImgsName(prev => [...prev, imgName]);
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
    const editStutesOk=()=>{
        rejectOk();
    };
    // 删除图片
    const handleDeleteunitImg = (index: number) => setImgsName(prev => prev.filter((_, i) => i !== index));
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
                                <Select.Option value={4}>
                                    驳回
                                </Select.Option>
                                <Select.Option value={5}>
                                    终止
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
                        {displayB64.map((item: string) => {
                            // 判断是否已带 .png 后缀
                            const fullSrc = item.endsWith('.png')
                                ? `${window.ServerConfig.imgServer}${item}`
                                : `${window.ServerConfig.imgServer}${item}.png`;
                            return (
                                <div key={item}>
                                    <Image src={fullSrc} width={50} height={50} />
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
                <p>确定审核吗？</p>
            </Modal>
            {/* 放行的弹窗*/}
            <Modal title="放行" open={releaseOpen} onCancel={() => setReleaseOpen(false)} onOk={releaseFn} loading={spinning}>
               <Form>
                   <Form.Item label="多图">
                       <ImageUploadPng onImageUpload={(base64) => onImageUpload(base64)} />
                       <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginLeft: '20px' }}>
                       {imgsName.map((item, index) => (
                           <div key={index} style={{ display: 'flex', alignItems: 'center', position: 'relative', marginLeft: '20px' }}>
                               <Image src={`${window.ServerConfig.imgServer}${item}.png`} width={50} height={50} />
                               <Button danger size="small" style={{ position: 'absolute', top: -8, left: -8, zIndex: 2 }} onClick={() => handleDeleteunitImg(index)}>×</Button>
                           </div>
                       ))}
                       </div>
                   </Form.Item>
               </Form>
            </Modal>
            {/*驳回弹窗*/}
            <Modal title={rejectStatus==4?'驳回':'终止'} open={rejectOpen} onCancel={() => setRejectOpen(false)} onOk={editStutesOk} loading={spinning}>
                <Form>
                    <Form.Item label="原因">
                        <Input.TextArea value={remark} onChange={(e) => setRemark(e.target.value)} />
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
