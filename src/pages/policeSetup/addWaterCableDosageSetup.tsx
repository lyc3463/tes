import {Button, Form, Input, InputNumber, Radio, Select} from "antd";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddWaterCableDosageSetup=()=>{

    const [form] = Form.useForm();
    const onFinish = (values: any) => {

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
                <Form.Item label='名称' >
                    <Input placeholder="请输入名称"/>
                </Form.Item>
                <Form.Item label='选择设备类型' >
                    <Select />
                </Form.Item>
                {/*<div>*/}
                {/*    <Form.Item label='报警周期'>*/}
                {/*        <Select/>*/}
                {/*    </Form.Item>*/}
                {/*    <Form.Item>*/}
                {/*        <Select/>*/}
                {/*    </Form.Item>*/}
                {/*</div>*/}
                {/*<div style={{display:'flex'}}>*/}
                {/*    <Form.Item label='区间用量' >*/}
                {/*        <Select/>*/}
                {/*    </Form.Item>*/}
                {/*    <Form.Item >*/}
                {/*        <Input/>kwh*/}
                {/*    </Form.Item>*/}
                {/*</div>*/}
                <Form.Item label='报警静默期（天）'>
                    <InputNumber/><span style={{fontSize:'12px',color:'rgb(136, 136, 136)'}}>触发报警后一定时间内不再重复触发报警</span>
                </Form.Item>
                <Form.Item label='应用到所有设备'>
                    <Radio.Group>
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default AddWaterCableDosageSetup