import {useEffect, useRef, useState} from "react";
import {connect,history,useLocation} from "umi";
import * as EmpServer from "@/services/emp";
import {Button, DatePicker, Form, Image, Input, message, Radio, Select, Space, Upload} from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CmpImageUploader from "@/components/ImageUploader";
import {filterAndUpdateList} from "@/utils/OpenTool";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditYuangong=(props:any)=>{
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    const formRef=useRef();
    // base64
    const [fileBase64,setFileBase64]=useState('');
    // 开始时间
    const [estarttime,setEstarttime]=useState('');
    // 结束时间
    const [eendtime,seteendtime]=useState('');
    // 图片原本的名字
    const [oldImgName,setOldImgName]=useState('');
    const location=useLocation();
    const getOneEmp=async (id:string)=>{
        let res:any=await  EmpServer.one(id);
        if (res.ErrorCode==0){
            formRef.current.setFieldsValue(res.Data);
            setFileBase64(res.Data.avatarBase64);
            setOldImgName(res.Data.empFileName);
            seteendtime(dayjs(res.Data.eendtime).format('YYYY-MM-DD HH:MM:ss'));
            setEstarttime(dayjs(res.Data.estarttime).format('YYYY-MM-DD HH:MM:ss'));

        }
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getOneEmp(id)
    },[]);
    // 修改上传
    const onFinisn=(values:any)=>{
        props.dispatch({
            type:'Emp/edit',
            payload:{...values,uid,estarttime,eendtime,oldImgName}
        }).then((res)=>{
            if (res.ErrorCode==0){
                message.success('修改成功')
                history.push('/enter/yuangonglData')
            }else {
                message.error(res.Data)

            }
        })
    };
    // 获取图片名字
    const handleImageUpload=(item:string)=>{
        setOldImgName(item);
    };
    // 获取图片base64
    const getImgBase64=(item:any)=>{
        setFileBase64(item);
    };
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                onFinish={onFinisn}
                layout="horizontal"
                size={'large'}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='授权开始/结束时间'>
                    {
                        eendtime&&estarttime?<DatePicker showTime  defaultValue={dayjs(estarttime)}/>:''
                    }
                </Form.Item>
                <Form.Item label='员工姓名' name='name'>
                    <Input placeholder='员工姓名'/>
                </Form.Item>
                <Form.Item label='员工昵称' name='nickname'>
                    <Input placeholder='员工昵称'/>
                </Form.Item>
                <Form.Item label='员工联系方式' name='phone'>
                    <Input placeholder='员工联系方式'/>
                </Form.Item>
                <Form.Item label='所在公司' name='companyName'>
                    <Input placeholder='员工所在公司'/>
                </Form.Item>
                <Form.Item label='闸机分组' name='groupId'>
                    <Select>
                        {props.GroupingList&&props.GroupingList.length>0?props.GroupingList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.groupName}
                                </Select.Option>
                            )
                        }):''}
                    </Select>
                </Form.Item>
                <Form.Item label='员工人脸'>
                    <Space style={{display:'flex'}}>
                        <CmpImageUploader onImageUpload={handleImageUpload} oldBase64={getImgBase64}/>
                        {fileBase64?<Image src={fileBase64} style={{width:'80px',height:'80px'}}/>:''}
                    </Space>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        编辑
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        GroupingList:state.Grouping.list,
    }
};
export default  connect(mapStateToProps)(EditYuangong)