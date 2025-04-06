import {useEffect, useRef, useState} from "react";
import {useLocation,connect} from 'umi'
import {Button, Form, Input, InputNumber, message, Modal, Select, Space, Spin, Tag} from "antd";
import * as CableServer from "@/services/cable";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const ElectricityBasicBusiness=(props:any)=>{
    const location=useLocation();
    const [isSpinning,setIsSpinning]=useState(false);
    const formRef =useRef();
    // 路由参数
    const [uid,setUid]=useState('0');
    // 拉闸弹窗
    const [lazha,setlazha]=useState(false);
    // 合闸弹窗
    const [hezha,sethezha]=useState(false);
    // 清零弹窗
    const [qlOpen,setQlOpen]=useState(false);
    // 充值弹窗
    const [cz,setcz]=useState(false);
    // 充值金额
    const [money,setMoney]=useState(0);
    // 电表状态 1合闸,2拉闸
    const [relay_state,setrelay_state]=useState(0);
    // 获取单个电表详情
    const getOneCable=async (id:string)=>{
        let res:any=await  CableServer.one(id);
        if (res.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data);
            setrelay_state(res.Data.relay_state);
        }else {
            message.error(res.Data)
        }
    };
    // 拉闸弹窗确定
    const offlazha= ()=>{
         CableServer.off({uid,stutes:2}).then((res:any)=>{
             if (res.ErrorCode==0){
                 message.success('拉闸成功');
                 getOneCable(uid);
                 setlazha(false);
             }else {
                 message.error(res.Data);
                 setlazha(false);
             }
         })
    };
    // 合闸弹窗确定
    const offhezha=()=>{
            setIsSpinning(true);
            CableServer.off({uid,stutes:1}).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('合闸成功');
                sethezha(false);
                setIsSpinning(false);
                getOneCable(uid);
            }else{
                message.error(res.Data)
                setIsSpinning(false);
            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getOneCable(id)
    }, []);
    const chongzhi=()=>{
        CableServer.addcz({uid,money}).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('充值成功');
            }else {
                message.error(res.Data)
            }
        })
    };
    const qlOk=()=>{
        setIsSpinning(true);
        CableServer.ql(uid).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('清零成功');
                setQlOpen(false);
                setIsSpinning(false);
            }else {
                message.error(res.Data);
                setQlOpen(false);
                setIsSpinning(false);
            }
        })
    };
    return(
        <Spin spinning={isSpinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                size={'large'}
                ref={formRef}
                // onFinish={onFinish}
                style={{ marginTop:'1rem'}}
            >
                <Form.Item label='采集器编号' name='collectorid'>
                    <Input/>
                </Form.Item>
                <Form.Item label='表编号/地址' name='address'>
                    <Input/>
                </Form.Item>
                <Form.Item label='电能表类型' name='electricity_type'>
                    <Select options={[
                        {label:'单相单费率07抄表',value:'65361'},
                        {label:'三相单费率07抄表',value:'65362'}
                    ]}>
                    </Select>
                </Form.Item>
                {/*<Form.Item label='表参数设置'>*/}
                {/*    <Select/>*/}
                {/*</Form.Item>*/}
                <Form.Item label='描述' name='remark'>
                    <Input.TextArea/>
                </Form.Item>
                {/*<Form.Item label='互感器变化'>*/}
                {/*    <InputNumber/>*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label='负荷控制(kw)'>*/}
                {/*    <InputNumber/>*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label='互感器变化'>*/}
                {/*    <Input/>*/}
                {/*</Form.Item>*/}
                <Form.Item label='其他操作'>
                    <Space>
                        <Button type='primary' onClick={()=>{setQlOpen(true)}}>远程清零</Button>
                        {/*<Button type='primary'>远程销户</Button>*/}
                        <Button type='primary' onClick={()=>setlazha(true)}>拉闸</Button>
                        <Button type='primary' onClick={()=>sethezha(true)}>合闸</Button>
                        {/*<Button type='primary'>保电</Button>*/}
                        {/*<Button type='primary'>解除保电</Button>*/}
                        {/*<Button type='primary' onClick={()=>setcz(true)}>充值</Button>*/}
                    </Space>
                    <Form.Item>
                        <div>
                            状态：{relay_state==1?<Tag color='green'>合闸</Tag>:<Tag color='red'>拉闸</Tag>}
                        </div>
                    </Form.Item>
                </Form.Item>
                <Form.Item label='当前总用量(kwh)' name='c0'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary"  htmlType="submit">
                        保存
                    </Button>
                </Form.Item>
            </Form>
            {/*拉闸的弹窗*/}
            <Modal open={lazha} onCancel={()=>setlazha(false)} onOk={offlazha}>
                <div>
                    确定要拉闸吗？
                </div>
            </Modal>
            {/*合闸的弹窗*/}
            <Modal open={hezha} onCancel={()=>sethezha(false)} onOk={offhezha}>
                <div>
                    确定要合闸吗？
                </div>
            </Modal>
            {/*充值弹窗*/}
            {/*<Modal open={cz} onCancel={()=>setcz(false)} onOk={chongzhi}>*/}
            {/*    <Form>*/}
            {/*        <Form.Item label='充值金额'>*/}
            {/*            <InputNumber min={0} onChange={(e:number)=>setMoney(e)}/>*/}
            {/*        </Form.Item>*/}
            {/*    </Form>*/}
            {/*</Modal>*/}
            {/*远程清零弹窗*/}
            <Modal open={qlOpen} onCancel={()=>setQlOpen(false)} onOk={qlOk}>
                <div>
                    确定要清零吗？
                </div>
            </Modal>
        </Spin>
    )
}
export default connect() (ElectricityBasicBusiness)