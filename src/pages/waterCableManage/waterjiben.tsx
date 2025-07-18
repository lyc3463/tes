import {connect,history} from 'umi'
import {useLocation} from "@@/exports";
import {useEffect, useRef, useState} from "react";
import {Button, Form, Input, InputNumber, message, Modal, Select, Space, Spin, Tag} from "antd";
import * as WatertService from '@/services/watert';
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const Waterjiben=(props)=>{
    const location=useLocation();
    const [isSpinning,setIsSpinning]=useState(false);
    const formRef =useRef();
    // 路由参数
    const [uid,setUid]=useState('0');
    // 关阀弹窗
    const [lazha,setlazha]=useState(false);
    // 开阀弹窗
    const [hezha,sethezha]=useState(false);
    // 充值弹窗
    const [cz,setCz]=useState(false);
    // 充值金额
    const [q,changeQ]=useState(0);
    const [kh,setkh]=useState(false);
    // 远程清零弹窗
    const [qlOpen,setQlOpen]=useState(false);
    // 水表状态 1 表示合闸/开阀， 0 表示拉闸/关阀
    const [relay_state,setrelay_state]=useState(0);
    const offlazha=()=>{
        setIsSpinning(true);
        WatertService.off({uid,stutes:0}).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('关阀成功');
                setlazha(false);
                setIsSpinning(false);
            }else {
                message.error(res.Data);
                setlazha(false);
                setIsSpinning(false);
            }
        })
    };
    const offhezha=()=>{
        setIsSpinning(true);
        WatertService.off({uid,stutes:1}).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('开阀成功');
                sethezha(false);
                setIsSpinning(false);
            }else {
                message.error(res.Data);
                sethezha(false);
                setIsSpinning(false);
            }
        })
    };
    // 获取单个水表详情
    const getOneWater=async (id:string)=>{
        let res:any=await  WatertService.one(id);
        if (res?.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data);
            setrelay_state(res.Data.relay_state);
        }else {
            message.error(res.Data)
        }
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getOneWater(id)
    }, []);
    const chongzhi=()=>{
        WatertService.addcz({uid,q}).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('充值成功');
            }else {
                message.error(res.Data)
            }
        })
    };
    const iskh=()=>{
        WatertService.addkh({uid}).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('开户成功');
            }else {
                message.error(res.Data);
            }
        })
    };
    const qlOk=()=>{
        setIsSpinning(true);
        WatertService.ql(uid).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('清零成功');
                setIsSpinning(false);
                setQlOpen(false);
                getOneWater(uid);
            }else {
                message.error(res.Data);
                setIsSpinning(false);
                setQlOpen(false);
            }
        })
    };
    const onLikai=()=>{
      history.push('/waterCableManage/water')
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
                <Form.Item label='水表类型' name='water_type'>
                    <Select options={[
                        {label:'无线无预付',value:'13301'}
                    ]}/>
                </Form.Item>
                {/*<Form.Item label='表参数设置'>*/}
                {/*    <Select/>*/}
                {/*</Form.Item>*/}
                <Form.Item label='描述' name='remark'>
                    <Input.TextArea/>
                </Form.Item>

                <Form.Item label='其他操作'>
                    <Space>
                        {/*<Button type='primary' onClick={()=>setQlOpen(true)}>远程清零</Button>*/}
                        {/*<Button type='primary'>远程销户</Button>*/}
                        <Button type='primary' onClick={()=>setlazha(true)}>关阀</Button>
                        <Button type='primary' onClick={()=>sethezha(true)}>开阀</Button>
                        {/*<Button type='primary' onClick={()=>setCz(true)}>充值</Button>*/}
                        {/*<Button type='primary' onClick={()=>setkh(true)}>开户</Button>*/}
                    </Space>
                    <Form.Item>
                        <div>
                           状态：{relay_state==1?<Tag color='green'>开阀</Tag>:<Tag color='red'>关阀</Tag>}
                        </div>
                    </Form.Item>
                </Form.Item>
                <Form.Item label='当前总用量(m³)' name='total_used_amount'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button onClick={onLikai} type="primary">
                        返回
                    </Button>
                </Form.Item>
            </Form>
            {/*拉闸的弹窗*/}
            <Modal open={lazha} onCancel={()=>setlazha(false)} onOk={offlazha}>
                <div>
                    确定要关阀吗？
                </div>
            </Modal>
            {/*合闸的弹窗*/}
            <Modal open={hezha} onCancel={()=>sethezha(false)} onOk={offhezha}>
                <div>
                    确定要开阀吗？
                </div>
            </Modal>
            {/*充值弹窗*/}
            <Modal open={cz} onCancel={()=>setCz(false)} onOk={chongzhi}>
                <div>
                    <Form>
                        <Form.Item label='充值金额'>
                            <InputNumber min={0} onChange={(e:number)=>changeQ(e)}/>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
            {/*开户弹窗*/}
            <Modal open={kh} onCancel={()=>setkh(false)} onOk={iskh} title='是否开户'>
                <div>

                </div>
            </Modal>
            {/*远程清零弹窗*/}
            <Modal open={qlOpen} onCancel={()=>setQlOpen(false)} onOk={qlOk} title='远程清零'>
                <div>
                    是否远程清零?
                </div>
            </Modal>
        </Spin>
    )
}
export default connect() (Waterjiben)