import {Button, Form, Input, List, message, Modal, Select, Space, Spin, Table} from "antd";
import {history,connect} from 'umi'
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
const UserManage=(props:any)=>{
    const [did,setDid]=useState(0);
    const [isspinning,setisspinning]=useState(false);
    const [isopen,setisopen]=useState(false);
    const [page,setPage]=useState(1);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns =[
        {
            title: '用户姓名',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: '联系方式',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render:(text:any,record:any)=>{
                return(
                    <Space>
                        {uqx[217]=='1'?<Button type='primary' danger onClick={()=>isDelete(record.id)} >删除</Button>:''}
                        {uqx[216]=='1'?<Button type='primary' onClick={()=>toEdit(record.id)}>编辑</Button>:''}
                    </Space>
                )
            }
        }
    ];
    const toadd=()=>{
        history.push('/systemManage/addUser/')
    };
    const toEdit=(e:number)=>{
        history.push(`/systemManage/editUser?id=${e}`)
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const isDelete=(e:number)=>{
        setisopen(true);
        setDid(e);
    };
    // 获取用户列表
    const getUserList=()=>{
      props.dispatch({
          type:"Users/fetch",
          payload:{phone}
      })
    };
    const onOk=()=>{
        setisspinning(true);
        props.dispatch({
            type:'Users/remove',
            payload:did
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setisopen(false);
                setisspinning(false);
            }else {
                message.error(res.Data);
                setisopen(false);
                setisspinning(false);
            }
        })
    };
    const sousuo=()=>{
      props.dispatch({
          type:"Users/fetch",
          payload:{phone}
      })
    };
    useEffect(() => {
        getUserList();
    }, []);
    return(
        <Spin spinning={isspinning}>
            <List>
                <List.Item>
                    <div>
                        {uqx[215]=='1'?<Button type="primary" onClick={toadd}>添加管理员</Button>:''}
                    </div>
                    <Space>
                        <Input
                            addonBefore="手机号码:"
                            onChange={(e)=>setPhone(e.target.value)}
                        />
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                rowKey={(columns) => columns.id}
                columns={columns}
                size='small'
                scroll={{y:'60vh'}}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                dataSource={props.UsersList}
            />
            <Modal open={isopen} onOk={onOk} onCancel={()=>setisopen(false)}>
                <div>是否要删除?</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        UsersList: state.Users.list,
    }
};
export default connect(mapStateToProps) (UserManage)