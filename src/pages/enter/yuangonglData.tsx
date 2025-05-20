import {
    Button,
    DatePicker,
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
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {compressBase64} from "@/utils/OpenTool";
import {StaticInfo} from "@/StaticInfo";
const YuangonglData=(props:any)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 审核状态 0全部  1未审核 2已审核
    const [stutes,setStutes]=useState(1);
    // 姓名
    const [cname,setCname]=useState('');
    // 昵称
    const [nickname,setNickname]=useState('');
    // 手机号
    const [phone,setPhone]=useState('');
    const [companyName,setcompanyName]=useState('');
    // 唯一ID
    const [uid,setUid]=useState(0);
    // 删除的名称
    const [uname,setUname]=useState('');
    const [spinning,setspinning]=useState(false);
    const [isOpen,setIsOpen]=useState(false);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns =[
        {
            title: '登记日期',
            dataIndex: 'begintime',
            key: 'begintime',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.begintime).format('YYYY-MM-DD')}
                    </div>
                )
            }
        },
        {
            title: '到期时间',
            dataIndex: 'eendtime',
            key: 'eendtime',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.eendtime).format('YYYY-MM-DD')}
                    </div>
                )
            }
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '头像',
            dataIndex: 'images',
            key: 'images',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        <Image src={record.avatarBase64} style={{width:"50px",height:'50px'}}/>
                    </div>
                )
            }
        },
        {
            title: '员工联系方式',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '公司名称/单元号',
            dataIndex: 'companyName',
            key: 'companyName',
        },

        {
            title: '状态',
            dataIndex: 'emp_status',
            key: 'emp_status',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.emp_status==1?<Tag color='red'>未审核</Tag>:<Tag color='green'>已审核</Tag>}
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
                    <div>
                        {
                            record.emp_status==1?
                                <Space>
                                    {/*<Button type='link' onClick={()=>toInfo(record.id)}>详情</Button>*/}
                                    {uqx[188]=='1'?<Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button> :''}
                                    {uqx[189]=='1'?<Button type='primary' danger onClick={()=>isDelete(record)}>删除</Button>:''}
                                </Space>:
                                <>
                                    {/*<Button type='link' onClick={()=>toInfo(record.id)}>详情</Button>*/}
                                </>
                        }
                    </div>
                )
            }
        },
    ];
    const toadd=()=>{
        history.push('/enter/addYuangonglData')
    };
    const toInfo=(e:number)=>{
        history.push(`/enter/yuangongInfo?id=${e}`)
    };
    const toedit=(e:number)=>{
        history.push(`/enter/editYuangong?id=${e}`)
    };
    // 删除弹窗
    const isDelete=(e:any)=>{
        setUid(e.id);
        setUname(e.name);
        setIsOpen(true);
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getFenyeInfo();
        logFenye();
    };
    // 分页
    const getFenyeInfo=()=>{
        props.dispatch({
            type:'Emp/fenye',
            payload:{cname,nickname,phone,stutes,companyName,pageSize}
        });
    };
    // 列表
    const logFenye=()=>{
        props.dispatch({
            type:"Emp/fetch",
            payload:{page,cname,nickname,phone,stutes,companyName,pageSize}
        })
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };

    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    // 监听员工姓名
    const changeName=(e)=>{
      setCname(e.target.value);
    };
    // 监听员工昵称
    const changeNickname=(e)=>{
        setNickname(e.target.value);
    };
    // 监听手机号
    const changePhone=(e)=>{
        setPhone(e.target.value);
    };
    // 删除的确定按钮
    const onOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'Emp/delete',
            payload:uid
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setIsOpen(false);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
                setIsOpen(false);
            }
        })
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        getFenyeInfo();
    }, []);
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <div>
                        {uqx[186]=='1'?<Button type="primary" onClick={toadd}>员工登记</Button> :''}
                    </div>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="员工姓名:"
                        />
                        <Input
                            onChange={changeNickname}
                            addonBefore="员工昵称:"
                        />
                        <Input
                            onChange={changePhone}
                            addonBefore="手机号:"
                        />
                        <Input
                            onChange={(e)=>setcompanyName(e.target.value)}
                            addonBefore="公司/单元:"
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
                                defaultValue={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:1, label: '未审核' },
                                    { value:2, label: '已审核' },
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
                    dataSource={props.EmpList}
                    scroll={{y:'70vh'}}
                    rowKey={(columns) => columns.id}
                    size='small'
                />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal onOk={onOk} open={isOpen} title={'删除人脸'} onCancel={()=>setIsOpen(false)} loading={spinning}>
                <div>
                    <span>是否要删除：<span style={{color:"red"}}>{uname}</span></span>
                </div>
            </Modal>
        </Spin>
    )
}

const mapStateToProps = (state: any) => {
    return {
        EmpList: state.Emp.list,
        count: state.Emp.count,
    }
};
export default  connect(mapStateToProps)(YuangonglData)