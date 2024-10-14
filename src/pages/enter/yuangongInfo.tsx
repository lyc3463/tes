import {useEffect, useRef, useState} from "react";
import {connect,history,useLocation} from "umi";
import * as EmpServer from "@/services/emp";
import {Button, DatePicker, Form, Image, Input, Radio, Space, Upload} from "antd";
import moment from "moment";

const YuangongInfo=()=>{
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    const formRef=useRef();
    // base64
    const [fileBase64,setFileBase64]=useState('');
    // 开始时间
    const [estarttime,setEstarttime]=useState('');
    // 结束时间
    const [eendtime,seteendtime]=useState('');

    const location=useLocation();
    const getOneEmp=async (id:string)=>{
        let res:any=await  EmpServer.one(id);
        if (res?.ErrorCode==0){
            console.log(res)
            formRef.current.setFieldsValue(res.Data);
            setFileBase64(res.Data.avatarBase64);
            seteendtime(res.Data.eendtime);
            setEstarttime(res.Data.estarttime);
        }
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getOneEmp(id)
    },[]);
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                layout="horizontal"
                size={'large'}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='授权开始/结束时间'>
                    {
                        eendtime&&estarttime?<DatePicker.RangePicker showTime  defaultValue={[moment(estarttime), moment(eendtime)]}/>:''
                    }
                </Form.Item>
                <Form.Item label='员工姓名' name='name'>
                    <Input placeholder='员工姓名'/>
                </Form.Item>
                <Form.Item label='员工昵称' name='nickname'>
                    <Input placeholder='员工昵称'/>
                </Form.Item>
                <Form.Item label='性别' name='sex'>
                    <Radio.Group>
                        <Radio value={'1'}>男</Radio>
                        <Radio value={'0'}>女</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='员工联系方式' name='phone'>
                    <Input placeholder='员工联系方式'/>
                </Form.Item>
                <Form.Item label='员工身份证' name='idCard'>
                    <Input placeholder='身份证'/>
                </Form.Item>
                <Form.Item label='门禁卡号' name='wiegandno'>
                    <Input placeholder='门禁卡号'/>
                </Form.Item>
                <Form.Item label='所在公司' name='companyName'>
                    <Input placeholder='员工所在公司'/>
                </Form.Item>
                <Form.Item label='员工人脸'>
                    <Space style={{display:'flex'}}>
                        <Upload
                            name="file"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                        >
                            +
                        </Upload>
                        {fileBase64?<Image src={fileBase64} style={{width:'80px',height:'80px'}}/>:''}
                    </Space>
                </Form.Item>
                <Form.Item label='备注' name='custom'>
                    <Input placeholder='备注'/>
                </Form.Item>
            </Form>
        </div>
    )
}
export default YuangongInfo