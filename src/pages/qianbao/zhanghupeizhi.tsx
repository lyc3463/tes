import {useState} from "react";
import {Button, Form, Modal, Radio, Select, Slider,Input} from "antd";

const Zhanghupeizhi=()=>{
    const [disabled, setDisabled] = useState(false);
    const [isopen,setopen]=useState(false)
    return(
        <div>
            <Form>
                <Form.Item label='账户名称'>
                    <span>前汇物业</span>
                </Form.Item>
                <Form.Item label='结算微信商户名'>
                    <span style={{color:'rgb(0, 128, 0)'}}>前汇物业</span>
                </Form.Item>
                <Form.Item label='当前余额'>
                    <span style={{fontSize:'25px',fontWeight:'500'}}>0.00</span>元<span style={{marginLeft:'15px'}}>可提现金额(0)元</span>
                    <Button type='primary' onClick={()=>setopen(true)}>手动立即提现</Button>
                    <p style={{color:'#888'}}>提现免手续费，单笔最大提现金额5万元，T+1到账</p>
                </Form.Item>
                <Form.Item label='今日提现预计到账日'>
                    <span style={{color:'#555'}}>2024年07月23日 23:59前</span>
                </Form.Item>
                <Form.Item label='结算钱包类型' style={{width:'20vw'}}>
                    <Select/>
                </Form.Item>
                <Form.Item label='结算方式'>
                    <Radio.Group>
                        <Radio value={1}>实时结算</Radio>
                        <Radio value={2}>每天自动结算一次</Radio>
                        <Radio value={3}>指定结算日</Radio>
                        <Radio value={4}>手动结算</Radio>
                    </Radio.Group>
                    <p style={{color:'#888'}}>每日结算：每日6时自动结算前一天收款一次性转入收款账户，(可减少银行卡方式手续费)</p>
                    <p style={{color:'#888'}}>指定结算日：每月固定日期结算 (可减少银行卡方式手续费)</p>
                    <p style={{color:'#888'}}>手动结算：手动通过后台发起转账结算</p>
                    <p style={{color: 'rgb(255, 0, 0)'}}>注意：以上所有结算方式达到最大结算金额时无条件结算一次</p>
                </Form.Item>
                <Form.Item style={{width:'20vw'}} label='最大结算金额'>
                    <Slider defaultValue={1000} disabled={disabled} />
                </Form.Item>
                <Form.Item style={{width:'20vw'}} label='账户保留金额'>
                    <Input/>
                </Form.Item>
                <Form.Item  label='客服/报信电话'>
                    <Input style={{width:'20vw'}}/>
                    <p style={{color:'#888'}}>开通在线支付功能,请完善客服电话，用于故障报修,开票,退款等售后问题</p>
                    <p style={{color:'#888'}}>长时间无法联系商家可能导致线上支付权限被关闭或支付限额</p>
                </Form.Item>
                <Form.Item style={{backgroundColor:'#f5f5f5',borderTop:'1px solid #e5e5e5',padding:'19px 20px 20px',margin:'20px 0'}}>
                    <Button type='primary'>保存设置</Button>
                    <Button style={{marginLeft:'20px'}}>返回</Button>
                </Form.Item>
            </Form>
            <Modal open={isopen} onOk={()=>setopen(false)} onCancel={()=>setopen(false)} title='是否要提现'>
                <div>当前有 9045.4 元可提现,预计到账时间2024年08月05日 23:59前，立即提现？</div>
            </Modal>
        </div>
    )
}
export default Zhanghupeizhi