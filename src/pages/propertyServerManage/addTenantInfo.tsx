import {Button, Form, Select, Input, Radio, message} from "antd";
import {connect,history} from "umi";
import {useEffect} from "react";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddTenantInfo=(props)=>{
    const [form] = Form.useForm();

    const onFinish=(values)=>{
        props.dispatch({
            type:'TenantInfo/add',
            payload:values
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/propertyServerManage/tenantInfo')
            }else {
                message.error(res.Data)
            }
        })
    };
    useEffect(() => {
        console.log(props)
    }, []);
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='选择租户' name='openID'>
                    <Select>
                        {
                            props.AppUserList&&props.AppUserList.length>0?props.AppUserList.map((item:any,index:number)=>{
                                return(
                                    <Select.Option value={item.openId} key={index}>
                                        {item.appUser_phone}
                                    </Select.Option>
                                )
                            }):''
                        }
                    </Select>
                </Form.Item>
                <Form.Item label='消息内容' name='conten'>
                    <Input.TextArea/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        确定发送
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        AppUserList: state.AppUser.list
    }
};
export default connect(mapStateToProps) (AddTenantInfo)