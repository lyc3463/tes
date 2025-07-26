import {Button, Form, Input, message, Radio, Spin} from "antd";
import {useEffect, useState} from "react";
import * as AppPzService from '@/services/appPz';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const ConfigurationWxId=()=>{
    const [spinning,setspinning]=useState(false);
    const [authCorpId,setauthCorpId]=useState('');
    const onFinish=()=>{
        setspinning(true);
        AppPzService.enidWxID(authCorpId).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('设置成功');
                setspinning(false);
                getInfo();
            }else {
                message.error(res.Data);
                getInfo();
                setspinning(false);
            }
        })
    };
    const getInfo=()=>{
        setspinning(true);
        AppPzService.wxInfo().then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setauthCorpId(res.Data.authCorpId);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const changeAuthCorpId=(e)=>{
      setauthCorpId(e.target.value);
    };
    useEffect(() => {
        getInfo();
    }, []);
    return(
        <Spin spinning={spinning}>
            <Form
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                size={'large'}
                style={{ marginTop:'1rem'}}
            >
                <Form.Item label='企业ID'>
                    <Input value={authCorpId} onChange={changeAuthCorpId}/>
                </Form.Item>
                <Form.Item>
                    <a href='https://work.weixin.qq.com/' target="_blank">查看企业微信ID</a>
                </Form.Item>
                <Form.Item>
                    <Button type='primary' onClick={onFinish}>保存</Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default ConfigurationWxId