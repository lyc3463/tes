import {Button, DatePicker, Form, Input, message} from "antd";
import {useEffect, useRef, useState} from "react";
import {history,useLocation,connect} from "umi";
import * as CheckFpService from '@/services/checkFp';

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditCheckFp=(props:any)=>{
    const location=useLocation();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    const formRef=useRef();
    const onFinish=async (values)=>{

    };
    // 获取发票详情
    const getOneCustom=async (id:string)=>{
        let res:any=await  CheckFpService.one(id);
        console.log(res);
        if (res.ErrorCode==0){
            let data=res.Data;
            formRef.current.setFieldsValue(data);
            // setCustom_date(dayjs(data.custom_date).format('YYYY-MM-DD'));
        }else {
            message.error(res.Data);
        }
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneCustom(id);
    },[]);
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='抬头类型' name='rise_type'>
                    <Input placeholder='客户姓名'/>
                </Form.Item>
                <Form.Item label='税号' name='duty_paragraph'>
                    <Input placeholder='税号'/>
                </Form.Item>
                <Form.Item label='手机/邮箱' name='emailOrPhone'>
                    <Input placeholder='手机/邮箱'/>
                </Form.Item>
                <Form.Item label='(选填信息)'>

                </Form.Item>
                <Form.Item label='开户银行' name='bankDeposit'>
                    <Input placeholder='开户银行'/>
                </Form.Item>
                <Form.Item label='银行卡号' name='bankCard'>
                    <Input placeholder='银行卡号'/>
                </Form.Item>
                <Form.Item label='单位号码' name='work_phone'>
                    <Input placeholder='单位号码'/>
                </Form.Item>
                <Form.Item label='单位地址' name='work_address'>
                    <Input placeholder='单位地址'/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        确定修改
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
// const mapStateToProps = (state: any) => {
//     return {
//         CustomList: state.checkOutRent.list,
//         count: state.checkOutRent.count
//     }
// };
export default connect() (EditCheckFp)