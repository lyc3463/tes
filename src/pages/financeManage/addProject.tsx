import {connect,history} from 'umi'
import {Button, Form, Input, message, Select} from "antd";
import {useEffect, useState} from "react";
import {filterAndUpdateList} from "@/utils/OpenTool";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddProject=(props:any)=>{
    const [isLoading,setIsLoading]=useState(false)
    const [form] = Form.useForm();
    const [companyList,setCompanyList]=useState([])
    const onFinish=async (values)=>{
        let res=await props.dispatch({
            type:'Project/add',
            payload:values
        })
        if (res.ErrorCode==0){
            message.success('添加成功')
            history.push('/financeManage/list')
        }else {
            message.error(res.Data)
        }
    }
    useEffect(() => {
        filterAndUpdateList(props.CompanList, 'company_name', 'id', setCompanyList);
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
                    <Button type="primary"  htmlType="submit">
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CompanList: state.Compan.list
    }
};
export default connect (mapStateToProps)(AddProject)