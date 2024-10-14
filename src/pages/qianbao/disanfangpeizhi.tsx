import {Button, Form, Input, Radio, Select} from "antd";

const Disanfangpeizhi=()=>{
    return(
        <div>
            <Form style={{padding:'20px'}}>
                <Form.Item label='微信支付'>
                    <Radio.Group>
                        <Radio value={1}>关闭</Radio>
                        <Radio value={2}>开启</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='账户收款方式' >
                    <span>当前收款方式为 钱包收款(绑定对私账户) ,是否切换到商户号收款(绑定对公账户)，切换后钱包功能不可用</span>
                </Form.Item>
                <Form.Item>
                    <Button type='primary'>切换为商户号收款</Button>
                </Form.Item>
                <Form.Item label='公众号/商户号主体' >
                    <Input  style={{width:'10vw'}}/>
                </Form.Item>
                <Form.Item label='公众号名称' >
                    <Input  style={{width:'10vw'}}/>
                </Form.Item>
                <Form.Item label='开发者ID(AppID)' >
                    <Input  style={{width:'10vw'}}/>
                </Form.Item>
                <Form.Item label='开发者密码(AppSecret)' >
                    <Input.Password  style={{width:'10vw'}}/>
                </Form.Item>
                <Form.Item label='商户号' >
                    <Input  style={{width:'10vw'}}/>
                </Form.Item>
                <Form.Item label='API密钥' >
                    <Input.Password  style={{width:'10vw'}}/>
                </Form.Item>
                <Form.Item style={{backgroundColor:'#f5f5f5',height:'80px',display:'flex',alignItems:'center'}}>
                    <Button type='primary' style={{marginLeft:'30px'}}>保存配置</Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default Disanfangpeizhi