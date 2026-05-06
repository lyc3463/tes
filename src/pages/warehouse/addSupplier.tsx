import {Button, Form, Input, message, Select, Spin} from "antd";
import {useState} from "react";
import {connect,history,useNavigate} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddSupplier=(props:any)=>{
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [spinning,setSpinning] = useState(false);
    const onFinish=(value:any)=>{
        setSpinning(true);
        props.dispatch({
            type:'Supplier/add',
            payload:{...value},
        }).then((res:TypeErrorCode)=>{
            setSpinning(false);
            if(res.ErrorCode===0){
                message.success('添加成功');
                setSpinning(false);
                navigate(-1)
            }else{
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                onFinish={onFinish}
                initialValues={{remark:'',supplierAddress:'',personName:'',personPhone:''}}
                layout="horizontal"
                size={'large'}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item
                    name="supplierName"
                    label="供应商名称"
                    rules={[{ required: true, message: '请输入供应商名称' }, { max: 50, message: '名称长度不超过50字符' }]}
                >
                    <Input placeholder="请输入供应商名称" />
                </Form.Item>
                <Form.Item
                    name="supplierAddress"
                    label="开户行"
                >
                    <Input  />
                </Form.Item>
                <Form.Item
                    name="personName"
                    label="账号"
                >
                    <Input placeholder="请输入账号" />
                </Form.Item>
                <Form.Item
                    name="personPhone"
                    label="账户名"
                >
                    <Input placeholder="请输入账户名"/>
                </Form.Item>
                <Form.Item label="备注(选填)" name='remark'>
                    <Input placeholder="请输入备注" />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary"  htmlType="submit">
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect()(AddSupplier);
