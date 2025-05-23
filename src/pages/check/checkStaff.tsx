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
    Table, Tabs,
    Tag
} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import * as EmpService from "@/services/emp";
import {history,connect} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import CompanyList from "@/pages/financeManage/companyList";

const CheckStaff=(props:any)=>{
    const [uid,setUid]=useState<number>(0);
    const [isopen,setOpen]=useState(false);
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 审核状态 0全部  1未审核 2已审核
    const [stutes,setStutes]=useState(0);
    // 姓名
    const [cname,setCname]=useState(localStorage.getItem('checkCheckStaffName')||'');
    // 昵称
    const [nickname,setNickname]=useState(localStorage.getItem('checkCheckStaffNickname')||'');
    // 手机号
    const [phone,setPhone]=useState(localStorage.getItem('checkCheckStaffPhone')||'');
    const [companyName,setcompanyName]=useState(localStorage.getItem('checkCheckStaffCompanyName')||'');
    const [spinning,setspinning]=useState(false);
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
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname',
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
            title: '公司名称',
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
                        {record.emp_status==2?<Tag color='green'>已审核</Tag>:<Tag color='red'>未审核</Tag>}
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
                            record.emp_status==2?''
                                // <Button type='link' onClick={()=>toInfo(record.id)}>详情</Button>
                                :
                                <Space>
                                    {/*<Button type='link' onClick={()=>toInfo(record.id)}>详情</Button>*/}
                                    {uqx[187]=='1'? <Button type='primary' onClick={()=>check(record)}>审核通过</Button> :''}
                                    {/*<Button type='link' color='red'>删除</Button>*/}
                                </Space>
                        }
                    </div>
                )
            }
        },
    ];
    // 详情页面
    const toInfo=(e:number)=>{
        history.push(`/enter/yuangongInfo?id=${e}`);
    };
    // 审核弹窗
    const check=(e)=>{
        setUid(e.id);
        setOpen(true)
    };
    // 弹窗确定
    const OK=()=>{
        setspinning(true);
        props.dispatch({
            type:'CheckEmp/checkOK',
            payload:{uid}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('已通过,等待闸机服务器响应');
                setOpen(false);
                setspinning(false);
            }else {
                message.error(res.Data);
                setOpen(false);
                setspinning(false);
            }
        });
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getFenye();
        logFenye();
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"CheckEmp/fetch",
            payload:{page,cname,nickname,phone,stutes,companyName,pageSize}
        })
    };
    const getFenye=()=>{
        props.dispatch({
            type:'CheckEmp/fenye',
            payload:{cname,nickname,phone,stutes,companyName,pageSize}
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
        localStorage.setItem('checkCheckStaffName',e.target.value);
    };
    // 监听员工昵称
    const changeNickname=(e)=>{
        setNickname(e.target.value);
        localStorage.setItem('checkCheckStaffNickname',e.target.value);
    };
    // 监听手机号
    const changePhone=(e)=>{
        setPhone(e.target.value);
        localStorage.setItem('checkCheckStaffPhone',e.target.value);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        getFenye();
    }, []);
    const changeCompanyName=(e)=>{
      setcompanyName(e.target.value);
      localStorage.setItem('checkCheckStaffCompanyName',e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="员工姓名:"
                            value={cname}
                        />
                        <Input
                            onChange={changeNickname}
                            addonBefore="员工昵称:"
                            value={nickname}
                        />
                        <Input
                            onChange={changePhone}
                            addonBefore="手机号:"
                            value={phone}
                        />
                        <Input
                            onChange={changeCompanyName}
                            addonBefore="公司/单元:"
                            value={companyName}
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
                size='small'
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                scroll={{y:'70vh'}}
                dataSource={props.EmpList}
                rowKey={(columns) => columns.id}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            {/*审核弹窗*/}
            <Modal onOk={OK} onCancel={()=>setOpen(false)} open={isopen} title='是否通过' loading={spinning}>
                <div>确定要通过吗？</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        EmpList: state.CheckEmp.list,
        count: state.CheckEmp.count,
    }
};
export default  connect(mapStateToProps) (CheckStaff)