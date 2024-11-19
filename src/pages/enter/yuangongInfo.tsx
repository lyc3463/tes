import {useEffect, useRef, useState} from "react";
import {connect,history,useLocation} from "umi";
import * as EmpServer from "@/services/emp";
import {Button, DatePicker, Form, Image, Input, message, Radio, Select, Space, Upload} from "antd";
import moment from "moment";
import dayjs from "dayjs";

const YuangongInfo=(props)=>{
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
        if (res.ErrorCode==0){
            formRef.current.setFieldsValue(res.Data);
            setFileBase64(res.Data.avatarBase64);
            seteendtime(dayjs(res.Data.eendtime).format('YYYY-MM-DD HH:mm:ss'));
            setEstarttime(dayjs(res.Data.estarttime).format('YYYY-MM-DD HH:mm:ss'));
        }else {
            message.error(res.Data);
        }
    };
      // 获取分组
    const getGroupingList=()=>{
        props.dispatch({
            type:'Grouping/fetch'
        })
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneEmp(id);
        getGroupingList();
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
                        eendtime&&estarttime?<DatePicker.RangePicker showTime  defaultValue={[dayjs(estarttime), dayjs(eendtime)]}/>:''
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
                        {fileBase64?<Image src={fileBase64} style={{width:'80px',height:'80px'}}/>:''}
                    </Space>
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
export default connect(mapStateToProps) (YuangongInfo)