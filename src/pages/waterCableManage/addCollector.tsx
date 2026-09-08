import {Button, Form, Input, message, Space, Spin} from "antd";
import {connect,history,useNavigate} from 'umi'
import {useCallback, useEffect, useState} from "react";

// 缓存key
const CACHE_KEY = "AddCollector_form_cache";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddCollector=(props:any)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    const [spinning,setspinning]=useState(false);

    // 读取缓存
    const loadCache = useCallback(() => {
        const str = sessionStorage.getItem(CACHE_KEY);
        if (!str) return null;
        try {
            return JSON.parse(str);
        } catch (e) {
            sessionStorage.removeItem(CACHE_KEY);
            return null;
        }
    }, []);

    // 保存表单字段到缓存
    const saveCache = useCallback(() => {
        const data = form.getFieldsValue();
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
    }, [form]);

    // 清空缓存
    const clearCache = () => sessionStorage.removeItem(CACHE_KEY);

    // 页面初始化：加载缓存回填表单
    useEffect(() => {
        const cache = loadCache();
        if (cache) {
            form.setFieldsValue(cache);
        }
    }, []);

    // 表单字段变动自动存入缓存
    const handleFormChange = () => {
        saveCache();
    };

    // 清空草稿
    const resetAllFormData = () => {
        clearCache();
        form.resetFields();
    };

    const onFinish=async (values:any)=>{
        setspinning(true);
        let res=await props.dispatch({
            type:'Collector/add',
            payload:values
        })
        if (res.ErrorCode==0){
            message.success('添加成功');
            // 添加成功后清空草稿缓存
            clearCache();
            history.push('/waterCableManage/collector');
            setspinning(false);
        }else {
            message.error(res.Data);
            setspinning(false);
        }
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                onValuesChange={handleFormChange}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='采集器ID' name='collector_number'  rules={[{required: true, message: '请填写采集器ID'}]}>
                    <Input placeholder='请输入采集器ID'/>
                </Form.Item>
                <Form.Item label='备注' name='remark'  rules={[{required: true, message: '请填写备注'}]}>
                    <Input.TextArea placeholder='备注'/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary"  htmlType="submit">
                            添加
                        </Button>
                        <Button type="primary" onClick={()=>navigate(-1)}>
                            返回
                        </Button>
                        <Button danger onClick={resetAllFormData}>
                            清空草稿
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect() (AddCollector)