import {Button, Form, Input, message, Select, DatePicker, Upload, Radio, Image, Space, Spin} from "antd";
import {useEffect, useState} from "react";
import {connect,history} from "umi";
import {filterAndUpdateList, getBase64} from "@/utils/OpenTool";
import CmpImageUploader from "@/components/ImageUploader";
import * as GroupingServer from "@/services/grouping";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

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
    // 闸机列表
    const [gateList,setGateList]=useState([]);
    // 选择闸机列表
    const [obtain,setobtain]=useState([]);
    // 转圈
    const [spinning,setspinning]=useState(false);
    const onFinish= (values)=>{
        let jsonObtain=obtain.join("|");
        setspinning(true);
        props.dispatch({
            type:'Emp/add',
            payload:{...values,estarttime,eendtime,oldImgName,jsonObtain}
        }).then((res)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                setspinning(false);
                history.push('/enter/yuangonglData');
            }else {
                setspinning(false);
                message.error(res.Data);
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
    // 获取闸机列表
    const getGeteList=()=>{
        props.dispatch({
            type:'Gate/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setGateList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 分组列表
    const getGroupingList=()=>{
        props.dispatch({
            type:'Grouping/fetch',
        })
    };
    useEffect(() => {
        getGeteList();
        getGroupingList();

    }, []);

    const changeGate=(e)=>{
        setobtain(e);
    };
    // 选择闸机
    const changeGrouping=(e:number)=>{
        GroupingServer.one(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let newArr :any[]=mapArrList(res.Data[1]);
                setobtain(newArr);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 遍历数组
    const mapArrList=(item:any[])=>{
        let arr=item.map((item:any)=>{
            return item.id
        })
        return arr
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                initialValues={{custom:''}}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='授权开始/结束时间' >
                    <DatePicker.RangePicker   onChange={changeData}/>
                </Form.Item>
                <Form.Item label='员工姓名' name='name' rules={[{required: true, message: '请填写员工姓名'}]}>
                    <Input placeholder='员工姓名'/>
                </Form.Item>
                <Form.Item label='员工昵称' name='nickname' rules={[{required: true, message: '请填写员工昵称'}]}>
                    <Input placeholder='员工昵称'/>
                </Form.Item>
                <Form.Item label='员工联系方式' name='phone' rules={[{required: true, message: '请填写员工联系方式'}]}>
                    <Input placeholder='员工联系方式'/>
                </Form.Item>
                <Form.Item label='所在公司/单元号' name='companyName' rules={[{required: true, message: '请填写员工所在公司或单元号'}]}>
                    <Input placeholder='员工所在公司'/>
                </Form.Item>
                <Form.Item label='闸机分组'>
                    <Select onChange={changeGrouping}>
                        {props.GroupingList&&props.GroupingList.length>0?props.GroupingList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.groupName}
                                </Select.Option>
                            )
                        }):''}
                    </Select>
                </Form.Item>
                <Form.Item label='闸机列表'>
                    <Select onChange={changeGate} value={obtain} mode="multiple">
                        {gateList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.position}
                                </Select.Option>
                            )
                        })}
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
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        GroupingList:state.Grouping.list,
        GateList: state.Gate.list,
    }
};
export default connect(mapStateToProps) (AddYuangonglData)