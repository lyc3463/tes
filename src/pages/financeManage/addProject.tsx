import {connect,history,useNavigate} from 'umi'
import {Button, Form, Input, message, Select, Space, Spin} from "antd";
import {useEffect, useState} from "react";
import {filterAndUpdateList} from "@/utils/OpenTool";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddProject=(props:any)=>{
    const navigate=useNavigate();
    const [isLoading,setIsLoading]=useState(false);
    const [form] = Form.useForm();
    const [companyList,setCompanyList]=useState([]);
    const onFinish=async (values)=>{
        setIsLoading(true);
        let res=await props.dispatch({
            type:'Project/add',
            payload:values
        })
        if (res.ErrorCode==0){
            message.success('添加成功');
            history.push('/financeManage/list');
            setIsLoading(false);
        }else {
            message.error(res.Data);
            setIsLoading(false);
        }
    }
    useEffect(() => {
        filterAndUpdateList(props.CompanList, 'company_name', 'id', setCompanyList);
    }, []);

    return(
        <Spin spinning={isLoading}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label="项目名称" name="name" rules={[{required: true, message: '请输入项目名称'}]}>
                    <Input placeholder="例:xx项目"/>
                </Form.Item>
                <Form.Item label="选择公司" name="company_id" rules={[{required: true, message: '请选择公司'}]}>
                    <Select>
                        {companyList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item {...tailLayout}>
                   <Space>
                       <Button type="primary"  htmlType="submit">
                           添加
                       </Button>
                       <Button type="primary" onClick={()=>navigate(-1)}>
                           返回
                       </Button>
                   </Space>
                </Form.Item>
            </Form>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CompanList: state.Compan.list
    }
};
export default connect (mapStateToProps)(AddProject)