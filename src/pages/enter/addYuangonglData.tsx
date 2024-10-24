import {Button, Form, Input, message, Select, DatePicker, Upload, Radio, Image, Space} from "antd";
import {useEffect, useState} from "react";
import {connect,history} from "umi";
import {filterAndUpdateList, getBase64} from "@/utils/OpenTool";
import CmpImageUploader from "@/components/ImageUploader";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddYuangonglData=(props:any)=>{
    const [form] = Form.useForm();
    // 开始时间
    const [estarttime,setEstarttime]=useState('');
    // 结束时间
    const [eendtime,seteendtime]=useState('');
    // base64 用来显示图片
    const [fileBase64,setFileBase64]=useState('');
    // 图片原本的名字
    const [oldImgName,setOldImgName]=useState('');
    const onFinish= (values)=>{
        props.dispatch({
            type:'Emp/add',
            payload:{...values,estarttime,eendtime,oldImgName}
        }).then((res)=>{
            if (res.ErrorCode==0){
                message.success('添加成功')
                history.push('/enter/yuangonglData')
            }else {
                message.error(res.Data)
            }
        });
    };
    const changeData=(_,item)=>{
        setEstarttime(item[0]);
        seteendtime(item[1]);
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
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='授权开始/结束时间' >
                    <DatePicker.RangePicker showTime  onChange={changeData}/>
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
                       <Space style={{display:'flex'}}>
                           <CmpImageUploader onImageUpload={handleImageUpload} oldBase64={getImgBase64}/>
                           {fileBase64?<Image src={fileBase64} style={{width:'80px',height:'80px'}}/>:''}
                       </Space>
                   </Space>
                </Form.Item>
                <Form.Item label='备注' name='custom'>
                    <Input placeholder='备注'/>
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
const mapStateToProps = (state: any) => {
    return {
        GroupingList:state.Grouping.list,
    }
};
export default connect(mapStateToProps) (AddYuangonglData)