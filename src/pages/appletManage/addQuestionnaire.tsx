import {Button, Form, Input, InputNumber, Radio} from "antd";
import {useEffect, useState} from "react";
import {connect,history} from "umi";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddQuestionnaire=(props:any)=>{
    const [form] = Form.useForm();
    // 切换问题类型的弹窗
    const [value,setValue]=useState(0);
    // 初始化状态，包含一个初始条目
    const [formData, setFormData] = useState([{ id: 1, name: '选项',item:''}]);
    const onFinish=async (values)=>{
        let str=JSON.stringify(formData);
        props.dispatch({
            type:'Questionnaire/add',
            payload:{...values,str}
        }).then((res)=>{
            console.log(res)
        });
    };
    const handleAdd = () => {
        // 生成新的唯一ID（这里简化为使用数组长度加1，实际应用中可能需要更复杂的策略）
        const newId = formData.length + 1;
        // 生成新的条目并添加到数组中
        setFormData([...formData, { id: newId, name: `选项`,item:''}]);
    };
    // 处理删除数据的函数
    const handleRemove = (id:any) => {
        if (id==1) return false
        setFormData(formData.filter(item => item.id !== id));
    };
    const handleInputChange = (id, e) => {
        setFormData(prev =>
            prev.map(item =>
                item.id === id ? { ...item, item: e.target.value } : item
            )
        );
    };
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
                <Form.Item label='问题名称' name='problem_name'>
                    <Input/>
                </Form.Item>
                <Form.Item label='问题类型' name='problem_type'>
                    <Radio.Group onChange={(e)=>{setValue(e.target.value)}} defaultValue={value}>
                        <Radio value={0}>选项题</Radio>
                        <Radio value={1}>简答题</Radio>
                    </Radio.Group>
                </Form.Item>
                <div>
                    {
                        value==0?(formData.map(item => (
                            <Form.Item label={item.name} key={item.id}>
                                <Input style={{width:'200px',marginRight:'5px'}} onChange={(e) => handleInputChange(item.id, e)}
                                />
                                <Button onClick={handleAdd} style={{ marginLeft: '8px' }}>+</Button>

                                {formData.length > 1 ? (
                                    <Button onClick={() => handleRemove(item.id)}>-</Button>
                                ):''}
                            </Form.Item>
                        ))):''
                    }
                </div>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default connect() (AddQuestionnaire)