import {useEffect, useState} from "react";
import {Button, Form, Input, message, Select} from "antd";
import {history} from "@@/core/history";
import {connect} from "@@/exports";
import {filterAndUpdateList} from "@/utils/OpenTool";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddSubjectList=(props:any)=>{
    const [form] = Form.useForm();
    // 公司列表
    const [companyList,setCompanyList]=useState([])
    // 项目列表
    const [projectList,setProjectList]=useState([])
    useEffect(() => {
        filterAndUpdateList(props.CompanList, 'company_name', 'id', setCompanyList);
        filterAndUpdateList(props.ProjectList, 'project_name', 'id', setProjectList);
    }, []);

    const onFinish=async (values)=>{
        let res=await props.dispatch({
            type:'Subject/add',
            payload:values
        })
        if (res.ErrorCode==0){
            message.success('添加成功')
            history.push('/financeManage/list')
        }
    }

    return(
        <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            form={form}
            layout="horizontal"
            size={'large'}
            onFinish={onFinish}
            style={{ marginTop: '1rem' }}
        >
            <Form.Item label="科目名称" name="name" rules={[{required: true, message: '请输入科目名称'}]}>
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
            <Form.Item label="选择项目" name="project_id" rules={[{required: true, message: '请选择科目'}]}>
                <Select>
                    {projectList.map((item:any,index:any)=>{
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
    )
}
const mapStateToProps = (state: any) => {
    return {
        CompanList: state.Compan.list,
        ProjectList: state.Project.list,
    }
};
export default  connect(mapStateToProps)(AddSubjectList)