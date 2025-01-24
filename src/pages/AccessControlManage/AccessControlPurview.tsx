import {
    Button,
    Form,
    Input,
    Select,
    Upload,
    DatePicker,
    List,
    Space,
    Table,
    Image,
    Tag,
    Pagination,
    Modal,
    message, Spin
} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {connect} from "umi";

const AccessControlPurview=(props:any)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [stutes,setStutes]=useState(2);
    // 姓名
    const [cname,setCname]=useState('');
    // 昵称
    const [nickname,setNickname]=useState('');
    // 手机号
    const [phone,setPhone]=useState('');
    // 弹窗状态
    const [isOpen,setOpen]=useState(false);
    // 删除的名字
    const [uname,setUname]=useState('');
    // 删除的ID
    const [uid,setUid]=useState(0);
    // 加载转圈
    const [spinning,setspinning]=useState(false);
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
            title: '公司名称',
            dataIndex: 'companyName',
            key: 'companyName',
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render: (text:any, record:any) => {
                return(
                    <div>
                        <Button type='primary' onClick={()=>isDelete(record)}>删除</Button>
                    </div>
                )
            }
        },
    ];
    // 搜索
    const sousuo=()=>{
        setPage(1);
        props.dispatch({
            type:'CheckEmp/fenye',
            payload:{cname,nickname,phone,stutes}
        });
        logFenye();
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"CheckEmp/fetch",
            payload:{page,cname,nickname,phone,stutes}
        })
    };
    // 监听页数
    const onChange=(e:number)=>{
        setPage(e);
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
    // 删除弹窗
    const isDelete=(e:any)=>{
        setOpen(true);
        setUid(e.id);
        setUname(e.name);
    };
    // 确定删除
    const onOk=()=>{
      setspinning(true);
      props.dispatch({
          type:'CheckEmp/checkRemove',
          payload:uid
      }).then((res:any)=>{
          if (res.ErrorCode==0){
              message.success('删除成功');
              setOpen(false);
              setspinning(false);
              logFenye()
          }else {
              message.error(res.Data);
              setOpen(false);
              setspinning(false);
          }
      })
    };
    return(
        <Spin spinning={spinning}>
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
                rowKey={(columns) => columns.id}
                size='small'
                scroll={{y:'70vh'}}
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            <Modal onOk={onOk} title='删除员工' open={isOpen} onCancel={()=>setOpen(false)}>
                <div>{`是否要删除${uname}`}</div>
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
export default connect(mapStateToProps) (AccessControlPurview)