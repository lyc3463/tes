import {useEffect, useState} from "react";
import {Button, Form, Input, message, Select, Space} from "antd";
import {history,connect,useNavigate} from "umi";
import * as UsersServer from '@/services/users';
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const MessageReceive=(props:any)=>{
    const navigate=useNavigate();
    const [user,setUser]=useState([]);
    const [spinning,setSpinning]=useState(false);
    // 分配接收人
    const changeSelect=(e)=>{
        setUser(e);
    };
    const getPermissionList=()=>{
        UsersServer.permissionList().then((res:any)=>{
            if(res.ErrorCode==0){
                setUser(res.Data);
                console.log('res.Data',res.Data)
            }else {
                message.error(res.ErrorCode + res.Data);
            }
        })
    };
    const getUserList=()=>{
        props.dispatch({
            type:"Users/fetch",
        })
    };
    useEffect(() => {
        getUserList();
        getPermissionList();
    }, []);
    const onFinish=()=>{
        setSpinning(true);
        let newuser=user.join('|');
        UsersServer.addPermissionUser(newuser).then((res:any)=>{
            if(res.ErrorCode==0){
                message.success('分配成功');
                setSpinning(false);
                getPermissionList();
            }else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
                getPermissionList();
            }
        })
    };
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop:'1rem'}}
            >
                <Form.Item label="接收消息用户">
                    <Select
                        style={{width:'100%'}}
                        onChange={changeSelect}
                        showSearch
                        value={user}
                        mode={'multiple'}
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item =props.UsersList.find(hetongID => hetongID.id == option?.value); // 您可能需要优化这个查找过程
                            return item?.user_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                    >
                        {props.UsersList&&props.UsersList.length>0?props.UsersList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.user_name}
                                </Select.Option>
                            )
                        }):''}
                    </Select>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary"  htmlType="submit">
                            保存
                        </Button>
                        <Button type="primary" onClick={()=>navigate(-1)}>
                            返回
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        UsersList: state.Users.list,
    }
};
export default connect(mapStateToProps) (MessageReceive)