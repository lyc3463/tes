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
import * as AppUserService from '@/services/appUser';

const CheckShuidian=(props)=>{
    const [isLoading,setIsLoading]=useState(false);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [openId,setOpenId]=useState(0);
    const [stutes,setStutes]=useState(Number(sessionStorage.getItem('checkFpCheckShuidianStutes'))||0);
    const [uid,setUid]=useState(0);
    const [checkOpen,setCheckOpen]=useState(false);
    // 开始时间
    const [startDate,setStartDate]=useState(sessionStorage.getItem('checkFpCheckShuidianStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(sessionStorage.getItem('checkFpCheckShuidianEndDate')||'2099-01-01');
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
    const [zuhuList,setZuhuList]=useState([]);
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
            title: '账单类型',
            dataIndex: 'consumptionType',
            key: 'consumptionType',
            render:(_:any,item:any)=>{
                let consumptionTypeText;
                switch (item.consumptionType) {
                    case 1:
                        consumptionTypeText = <Tag style={{ color: '#4CAF50' }}>电费</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag style={{ color: '#F44336' }}>水费</Tag>;
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
            title: '开票金额',
            dataIndex: 'consumptionMoney',
            key: 'consumptionMoney',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        <span style={{fontSize:'14px',color:'red'}}>{record.consumptionMoney}<span style={{fontSize:'12px',color:'#555'}}>元</span></span>
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
        history.push(`/check/editCheckFpSD?id=${e.id}`);
    };
    // 监听页码
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 分页
    const getfenyeInfo=()=>{
        props.dispatch({
            type:'CheckFpSD/fenye',
            payload:{startDate,endDate,openId,stutes,pageSize}
        });
    };
    // 列表
    const logFenye=()=>{
        props.dispatch({
            type:"CheckFpSD/fetch",
            payload:{page,startDate,endDate,openId,stutes,pageSize}
        })
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    useEffect(() => {
        getfenyeInfo();
        // getKuHuList();
    }, []);
    // 审核通过弹窗
    const onTongguo=(e:TypeCheckFp)=>{
        setUid(e.id);
        setCheckOpen(true);
    };
    // 审核通过弹窗按钮
    const onOk=()=>{
        setIsLoading(true);
        props.dispatch({
            type:"CheckFpSD/check",
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
            sessionStorage.setItem('checkFpCheckShuidianStartDate','2000-01-01');
            sessionStorage.setItem('checkFpCheckShuidianEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            sessionStorage.setItem('checkFpCheckShuidianStartDate',data[0]);
            sessionStorage.setItem('checkFpCheckShuidianEndDate',data[1]);
        }
    };
    // 状态
    const changeStutes=(e)=>{
        setStutes(e);
        sessionStorage.setItem('checkFpCheckShuidianStutes',e);
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
    const getKuHuList=()=>{
        // props.dispatch({
        //     type:"BYZhuhu/fetch",
        //     payload:{page:1,name:'',phone:'',pagecount:10000}
        // }).then((res:TypeErrorCode)=>{
        //     if (res.ErrorCode==0){
        //         const filteredArray = res.Data.filter(item => item.userId >0);
        //         console.log('res',res);
        //         setZuhuList(filteredArray);
        //         console.log(filteredArray);
        //
        //     }else {
        //         message.error(res.Data);
        //     }
        // })
        AppUserService.fetch({page:1,name:'',phone:'',pageSize:10000,balance:0}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setZuhuList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    const changZuHu=(e)=>{
        setOpenId(e);

    };
    return(
        <Spin spinning={isLoading} style={{zIndex:'1000'}}>
            <List>
                <List.Item>
                    <Space>
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
                            <Select
                                onChange={changeStutes}
                                defaultValue={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value: 0, label: '全部' },
                                    { value: 1, label: '未审核' },
                                    { value: 2, label: '已审核' },
                                ]}
                            />
                        </Space.Compact>
                        {/*<Space.Compact>*/}
                        {/*    <div*/}
                        {/*        style={{*/}
                        {/*            borderRadius: '6px',*/}
                        {/*            borderStartEndRadius: 0,*/}
                        {/*            borderEndEndRadius: 0,*/}
                        {/*            padding: '0 11px',*/}
                        {/*            border: '1px solid #d9d9d9',*/}
                        {/*            display: 'flex',*/}
                        {/*            alignItems: 'center',*/}
                        {/*            borderInlineEnd: 0,*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        租户:*/}
                        {/*    </div>*/}
                        {/*    <Select*/}
                        {/*        onChange={changZuHu}*/}
                        {/*        defaultValue={openId}*/}
                        {/*        style={{ width: 120 }}*/}
                        {/*        notFoundContent={false}*/}
                        {/*        showSearch*/}
                        {/*        optionFilterProp="children"*/}
                        {/*        filterOption={(input, option) => {*/}
                        {/*            // 假设每个 option 都有一个与数据项对应的 value 属性*/}
                        {/*            const item = zuhuList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程*/}
                        {/*            return item?.tenant_name?.toLowerCase().includes(input.toLowerCase());*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        <Select.Option value={0} key={0}>*/}
                        {/*            全部*/}
                        {/*        </Select.Option>*/}
                        {/*        {zuhuList.map((item:any,index:any)=>{*/}
                        {/*            return(*/}
                        {/*                <Select.Option value={item.id} key={item.id}>*/}
                        {/*                    {item.tenant_name}*/}
                        {/*                </Select.Option>*/}
                        {/*            )*/}
                        {/*        })}*/}
                        {/*    </Select>*/}
                        {/*</Space.Compact>*/}
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
                scroll={{y:'70vh'}}
                rowKey={(columns) => columns.id}
                dataSource={props.CheckFpList}
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
        CheckFpList: state.CheckFpSD.list,
        count:state.CheckFpSD.count
    }
};
export default connect(mapStateToProps) (CheckShuidian)