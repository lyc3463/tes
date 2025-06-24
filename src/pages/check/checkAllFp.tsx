import {connect, history} from 'umi'
import {useEffect, useState} from "react";
import dayjs from "dayjs";
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
import TypeCheckFp from "@/ModelTypes/TypeCheckFp";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import ImageUploader from "@/components/ImageUploader";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
const CheckAllFp=(props)=>{
    const [isLoading,setIsLoading]=useState(false);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [openId,setOpenId]=useState(0);
    const [stutes,setStutes]=useState(checkSessionStorage('/check/checkFp/','checkAllFpStutes')||0);
    const [uid,setUid]=useState(0);
    const [checkOpen,setCheckOpen]=useState(false);
    // 开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/check/checkFp/','checkAllFpStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/check/checkFp/','checkAllFpEndDate')||'2099-01-01');
    // 发送消息给小程序用户
    const [appId,setFSAppUser]=useState(0);
    // 发送的弹窗
    const [FSopen,setFSopen]=useState(false);
    // 图片名字
    const [upimg,setImgName]=useState('');
    // 图片B64
    const [imgB64,setImgB64]=useState('');
    // 发送给小程序内容
    const [conten,setconten]=useState('');
    // 抬头名称
    const [titleName,setTitleName]=useState(checkSessionStorage('/check/checkFp/','checkAllFpTitleName')||'');
    // 租户名称
    const [tenannName,setTenannName]=useState(checkSessionStorage('/check/checkFp/','checkAllFpTenannName')||'');
    // 账单类型
    const [type,setType]=useState(checkSessionStorage('/check/checkFp/','checkAllFpType')||0);
    // 单元名称
    const [unitName,setUnitName]=useState('');
    const columns =[
        {
            title: '申请日期',
            dataIndex: 'created',
            key: 'created',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.created).format('YYYY-MM-DD')}
                    </div>
                )
            }
        },
        {
            title: '单元名称',
            dataIndex: 'unitList',
            key: 'unitList',
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
            title: '租户姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '租户手机号',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '发票抬头',
            dataIndex: 'rise_name',
            key: 'rise_name',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{color:'red'}}>
                        {record.rise_name}
                    </div>
                )
            }
        },
        {
            title: '发票类型',
            dataIndex: 'invoiceType',
            key: 'invoiceType',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.invoiceType==1?<Tag color='blue'>专票</Tag>:<Tag color='green'>普票</Tag>}
                    </div>
                )
            }
        },
        {
            title: '账单类型',
            dataIndex: 'consumptionType',
            key: 'consumptionType',
            render:(_:any,item:any)=>{
                let consumptionTypeText;
                switch (item.consumptionType) {
                    case 1:
                        consumptionTypeText = <Tag style={{ color: '#4CAF50' }}>微信充值</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag style={{ color: '#F44336' }}>租金/管理费</Tag>;
                        break;
                    case 3:
                        consumptionTypeText = <Tag style={{ color: '#2196F3' }}>电费</Tag>;
                        break;
                    case 4:
                        consumptionTypeText = <Tag style={{ color: '#FFC107' }}>水费</Tag>;
                        break;
                    case 5:
                        consumptionTypeText = <Tag style={{ color: '#9C27B0' }}>公共缴费</Tag>;
                        break;
                    case 6:
                        consumptionTypeText = <Tag style={{ color: '#E91E63' }}>手动充值</Tag>;
                        break;
                    case 7:
                        consumptionTypeText = <Tag style={{ color: '#795548' }}>服务费</Tag>;
                        break;
                    case 8:
                        consumptionTypeText = <Tag style={{ color: '#795548' }}>违约金</Tag>;
                        break;
                    case 9:
                        consumptionTypeText = <Tag style={{ color: '#795558' }}>月保</Tag>;
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
            title: '开票金额',
            dataIndex: 'consumptionMoney',
            key: 'consumptionMoney',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        <span style={{fontSize:'14px',color:'red'}}>{record.consumptionMoney.toFixed(2)}<span style={{fontSize:'12px',color:'#555'}}>元</span></span>
                    </div>
                )
            }
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{color:'red'}}>
                        {record.email}
                    </div>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'invoiceStatus',
            key: 'invoiceStatus',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.invoiceStatus==1?<Tag color="red">未审核</Tag>:<Tag color="green">已审核</Tag>}
                    </div>
                )
            }
        },
        {
            title: '通知租户',
            dataIndex: 'tz',
            key: 'tz',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.invoiceStatus==2?<Button type='link' onClick={()=>onOpen(record)}>发送</Button>:''}
                    </div>
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
                        {record.invoiceStatus==1?(<>
                            <Button type='primary' onClick={()=>onTongguo(record)}>审核通过</Button>
                        </>):''}
                        <Button type='primary' onClick={()=>toedit(record)}>详情</Button>
                    </Space>
                )
            }
        },
    ];
    // 去编辑页面
    const toedit=(e:TypeCheckFp)=>{
        history.push(`/check/editCheckFp?id=${e.id}`);
    };
    // 监听页码
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 分页
    const getfenyeInfo=()=>{
        props.dispatch({
            type:'CheckFp/fenye',
            payload:{startDate,endDate,openId,stutes,pageSize,titleName,tenannName,type}
        });
    };
    // 列表
    const logFenye=()=>{
        props.dispatch({
            type:"CheckFp/fetch",
            payload:{page,startDate,endDate,openId,stutes,pageSize,titleName,tenannName,type}
        })
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    // 审核通过弹窗
    const onTongguo=(e:TypeCheckFp)=>{
        setUid(e.id);
        setCheckOpen(true);
    };
    // 审核通过弹窗按钮
    const onOk=()=>{
        setIsLoading(true);
        props.dispatch({
            type:"CheckFp/check",
            payload:{uid}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('审核通过');
                setCheckOpen(false);
                setIsLoading(false);
                getfenyeInfo();
                logFenye();
            }else {
                message.error(res.Data);
                setIsLoading(false);
            }
        })
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/check/checkFp/','checkAllFpStartDate','2000-01-01');
            updateSessionStorage('/check/checkFp/','checkAllFpEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/check/checkFp/','checkAllFpStartDate',data[0]);
            updateSessionStorage('/check/checkFp/','checkAllFpEndDate',data[1]);
        }
    };
    // 状态
    const changeStutes=(e)=>{
        setStutes(e);
        updateSessionStorage('/check/checkFp/','checkAllFpStutes',e);
    };
    const sousuo=()=>{
        setPage(1);
        getfenyeInfo();
        logFenye();
    };
    // 发送的弹窗
    const onOpen=(e:any)=>{
        setFSAppUser(e.appId);
        setFSopen(true);
    };
    const fsOk=()=>{
        setIsLoading(true);
        props.dispatch({
            type:'TenantInfo/addFp',
            payload:{appId,upimg,conten}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setIsLoading(false);
                message.success('发送成功');
                setFSopen(false);
            }else {
                setIsLoading(false);
                setFSopen(false);
                message.error(res.Data);
            }
        })
    };
    // 图片名字
    const onimgname=(e)=>{
        setImgName(e);
    };
    // 图片B64
    const onb64=(e)=>{
        setImgB64(e);
    };
    useEffect(() => {
        getfenyeInfo();
    }, []);
    // 抬头名称
    const changTitleName=(e)=>{
        setTitleName(e.target.value);
        updateSessionStorage('/check/checkFp/','checkAllFpTitleName',e.target.value);
    };
    const changeTenannName=(e)=>{
        setTenannName(e.target.value);
        updateSessionStorage('/check/checkFp/','checkAllFpTenannName',e.target.value);
    };
    const changeType=(e)=>{
        setType(e);
        updateSessionStorage('/check/checkFp/','checkAllFpType',e);
    };
    return(
        <Spin spinning={isLoading} style={{zIndex:'1000'}}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            style={{ width: 300 }}
                            addonBefore="抬头名称:"
                            onChange={changTitleName}
                            value={titleName}
                        />
                        <Input
                            style={{ width: 300 }}
                            addonBefore="租户名称:"
                            onChange={changeTenannName}
                            value={tenannName}
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
                                类型:
                            </div>
                            <Select
                                onChange={changeType}
                                value={type}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:2, label: '租金' },
                                    { value:5, label: '公共缴费' },
                                    { value:7, label: '服务费' },
                                    { value:8, label: '违约金' },
                                    { value:9, label: '月保' },
                                ]}
                            />
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
                                value={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value: 0, label: '全部' },
                                    { value: 1, label: '未审核' },
                                    { value: 2, label: '已审核' },
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
                size='small'
                scroll={{y:'60vh'}}
                rowKey={(columns) => columns.id}
                dataSource={props.CheckFpList}
                summary={(columns) => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell
                                index={1}
                            >
                                统计
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell
                                index={7}
                            >
                                {props.count?props.count.moneySum.toFixed(2):''}元
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            {/*审核的弹窗*/}
            <Modal open={checkOpen} onOk={onOk} onCancel={()=>setCheckOpen(false)} title='审核发票'>
                <div>确定审核通过吗?</div>
            </Modal>
            {/*    发送的弹窗*/}
            <Modal open={FSopen} onOk={fsOk} onCancel={()=>setFSopen(false)}>
                <Form>
                    <Form.Item label='内容'>
                        <Input.TextArea onChange={(e)=>setconten(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label='图片'>
                        <ImageUploader onImageUpload={onimgname} oldBase64={onb64}/>
                        {imgB64?<Image src={imgB64} style={{width:'100px',height:'100px'}}/>:''}
                    </Form.Item>
                </Form>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckFpList: state.CheckFp.list,
        count:state.CheckFp.count
    }
};
export default connect(mapStateToProps) (CheckAllFp)