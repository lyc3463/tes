import {connect, history, useLocation} from 'umi'
import {useEffect, useRef, useState} from "react";
import {Button, Form, Input, message, Select} from "antd";
import {filterAndUpdateList} from '@/utils/OpenTool'
import * as SubjecttService from "@/services/subject";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditSubjectList=(props:any)=>{
    const [isLoading,setIsLoading]=useState(false)
    const location=useLocation()
    const formRef =useRef()
    // 公司列表
    const [companyList,setCompaniesList]=useState([])
    // 项目列表
    const [projectList,setProjectsList]=useState([])
    // 路由参数
    const [uid,setUid]=useState<string|undefined>()
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getSubjectOne(id)
        filterAndUpdateList(props.CompanList, 'company_name', 'id', setCompaniesList);
        filterAndUpdateList(props.ProjectList, 'project_name', 'id', setProjectsList);
    }, []);

    const getSubjectOne=async (e:any)=>{
        let res=await SubjecttService.one(e)
        if (res?.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data)
        }
    }
    const onFinish=async (values:any)=>{
        let res=await props.dispatch({
            type:'Subject/edit',
            payload:{...values,uid}
        })
        if (res.ErrorCode==0){
            message.success('修改成功')
            history.push('/financeManage/list')
        }else {
            message.error(res.Data)
        }
    }
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label="科目名称" name="subject_name" rules={[{required: true, message: '请输入科目名称'}]}>
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
                <Form.Item label="选择项目" name="project_id" rules={[{required: true, message: '请选择项目'}]}>
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
                        保存
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CompanList: state.Compan.list,
        ProjectList: state.Project.list
    }
};
export default connect(mapStateToProps) (EditSubjectList)