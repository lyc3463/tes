import {useLocation,connect} from "umi";
import {useEffect, useRef, useState} from "react";
import * as WenjuanServer from "@/services/wenjuan";
import {Button, Form, Input, Radio, Select, Spin} from "antd";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditWenjuan=(props)=>{
    const location=useLocation();
    const formRef=useRef();
    const [form] = Form.useForm();
    const [isLoading,setisLoading]=useState(false);
    const [uid,setUid]=useState('');
    const [seleID,setSeleID]=useState([]);
    const [is_enable,setis_enable]=useState(0);
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        logFenye();
        getOneBanner(id);
    }, []);
    // 获取单个轮播图详情
    const getOneBanner=async (id:string)=>{
        let res:any=await  WenjuanServer.one(id);
        if (res.ErrorCode==0){
            console.log(res);
            setis_enable(res.Data.is_enable);
            formRef.current.setFieldsValue(res.Data);
        }
    };
    const onFinish=(vals:any)=>{

    };
    // 获取列表列表
    const logFenye=()=>{
        props.dispatch({
            type:"Questionnaire/fetch",
        })
    };
    const changeUint=(e)=>{
        setSeleID(e);
    };
    return(
        <Spin spinning={isLoading}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                ref={formRef}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label="问卷名称" name='questName'>
                    <Input/>
                </Form.Item>
                <Form.Item label="选择题目">
                    <Select  mode="multiple" onChange={changeUint}>
                        {props.QuestionnaireList?props.QuestionnaireList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.problem_name}
                                </Select.Option>
                            )
                        }):''}
                    </Select>
                </Form.Item>
                {/*<Form.Item label="启动问卷" name='is_enable'>*/}
                {/*    <Radio.Group>*/}
                {/*        <Radio value={0}>否</Radio>*/}
                {/*        <Radio value={1}>是</Radio>*/}
                {/*    </Radio.Group>*/}
                {/*</Form.Item>*/}
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect()(EditWenjuan)