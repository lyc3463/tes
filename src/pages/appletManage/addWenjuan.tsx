import {Button, Form, Image, Input, InputNumber, message, Radio, Select, Space, Spin} from "antd";
import {useEffect, useState} from "react";
import {connect,history} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddWenjuan=(props)=>{
    const [isLoading,setisLoading]=useState(false);
    const [form] = Form.useForm();
    const [seleID,setSeleID]=useState([]);
    const [is_enable,setis_enable]=useState(0);
    const onFinish=(val:any)=>{
        let joinData=seleID.join('|');
        setisLoading(true);
        props.dispatch({
            type:'Wenjuan/add',
            payload:{...val,joinData,is_enable}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/appletManage/wenjuanList');
                setisLoading(false);
            }else {
                message.error(res.Data);
                setisLoading(false);
            }
        })
    };
    const logFenye=()=>{
        props.dispatch({
            type:"Questionnaire/fetch",
        })
    };
    useEffect(() => {
        logFenye();
    }, []);
    const changeUint=(e)=>{
        setSeleID(e);
    };
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
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        QuestionnaireList: state.Questionnaire.list,
        count:state.Questionnaire.count
    }
};
export default connect(mapStateToProps) (AddWenjuan)