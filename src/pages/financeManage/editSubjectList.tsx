import {connect, history, useLocation,useNavigate} from 'umi'
import {useEffect, useRef, useState} from "react";
import {Button, Form, Input, message, Select, Space, Spin} from "antd";
import * as SubjecttService from "@/services/subject";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditSubjectList=(props:any)=>{
    const [isLoading,setIsLoading]=useState(false);
    const navigate=useNavigate();
    const location=useLocation();
    const formRef =useRef();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getSubjectOne(id)

    }, []);

    const getSubjectOne=async (e:any)=>{
        let res=await SubjecttService.one(e)
        if (res?.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data)
        }
    }
    const onFinish=async (values:any)=>{
        setIsLoading(true);
        let res=await props.dispatch({
            type:'Subject/edit',
            payload:{...values,uid}
        })
        if (res.ErrorCode==0){
            message.success('修改成功');
            history.push('/financeManage/list');
            setIsLoading(false);
        }else {
            message.error(res.Data);
            setIsLoading(false);
        }
    }
    return(
        <Spin spinning={isLoading}>
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
                <Form.Item {...tailLayout}>
                   <Space>
                       <Button type="primary"  htmlType="submit">
                           修改
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
        CompanList: state.Compan.list,
        ProjectList: state.Project.list
    }
};
export default connect(mapStateToProps) (EditSubjectList)