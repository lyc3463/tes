import {Button, DatePicker, Image, Input, List, message, Modal, Pagination, Select, Space, Table, Tag} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import * as EmpService from "@/services/emp";
import {history,connect} from "umi";

const CheckStaff=(props:any)=>{
    const [uid,setUid]=useState<number>(0);
    const [isopen,setOpen]=useState(false);
    // 当前页数
    const [page,setPage]=useState(1);
    // 审核状态 0全部  1未审核 2已审核
    const [stutes,setStutes]=useState(2);
    // 姓名
    const [cname,setCname]=useState('');
    // 昵称
    const [nickname,setNickname]=useState('');
    // 手机号
    const [phone,setPhone]=useState('');
    const columns =[
        {
            title: '到期时间',
            dataIndex: 'eendtime',
            key: 'eendtime',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.estarttime).format('YYYY-MM-DD')}
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
                            record.emp_status==2?<Button type='link' onClick={()=>toInfo(record.id)}>详情</Button>
                                :
                                <Space>
                                    <Button type='link' onClick={()=>toInfo(record.id)}>详情</Button>
                                    <Button type='link' onClick={()=>check(record)}>审核通过</Button>
                                    <Button type='link' color='red'>删除</Button>
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
        props.dispatch({
            type:'Emp/checkOK',
            payload:{uid}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('已通过,等待闸机服务器响应(可能稍微有点久~~~~)');
                setOpen(false);
            }else {
                message.error(res.Data);
            }
        });
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        props.dispatch({
            type:'Emp/fenye',
            payload:{cname,nickname,phone,stutes}
        });
        logFenye();
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Emp/fetch",
            payload:{page,cname,nickname,phone,stutes}
        })
    };
    // 监听页数
    const onChange=(e:number)=>{
        setPage(e);
    };

    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
    };
    useEffect(() => {
        logFenye();
    }, [page]);
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

    return(
        <div>
            <List>
                <List.Item>
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
                                    { value:2, label: '全部' },
                                    { value:0, label: '未审核' },
                                    { value:1, label: '已审核' },
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
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            {/*    审核弹窗*/}
            <Modal onOk={OK} onCancel={()=>setOpen(false)} open={isopen} title='是否通过'>
                <div>确定要通过吗？</div>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        EmpList: state.Emp.list,
        count: state.Emp.count,
    }
};
export default  connect(mapStateToProps) (CheckStaff)