import {Button, Form, Input, message, Select, DatePicker, Upload, Radio, Image, Space, Spin} from "antd";
import {useCallback, useEffect, useState} from "react";
import {connect,history,useNavigate} from "umi";
import CmpImageUploader from "@/components/ImageUploader";
import * as GroupingServer from "@/services/grouping";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import ImageUploadPng from "@/components/ImageUploadPng";

const tailLayout = {
    wrapperCol: { offset: 4 },
};

// 缓存key
const CACHE_KEY = "AddYuangonglData_form_cache";

const AddYuangonglData=(props:any)=>{
    const navigate=useNavigate();
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
    const [obtain,setobtain]=useState<any[]>([]);
    // 转圈
    const [spinning,setspinning]=useState(false);

    // 读取缓存
    const loadCache = useCallback(() => {
        const str = sessionStorage.getItem(CACHE_KEY);
        if (!str) return null;
        try {
            return JSON.parse(str);
        } catch (e) {
            sessionStorage.removeItem(CACHE_KEY);
            return null;
        }
    }, []);

    // 保存state+表单字段到缓存
    const saveCache = useCallback(() => {
        const data = {
            estarttime,
            eendtime,
            fileBase64,
            oldImgName,
            obtain,
            formValues: form.getFieldsValue()
        };
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('草稿保存失败：', e);
        }
    }, [estarttime, eendtime, fileBase64, oldImgName, obtain, form]);

    // 清空缓存
    const clearCache = () => sessionStorage.removeItem(CACHE_KEY);

    // 清空草稿
    const resetAllFormData = () => {
        clearCache();
        setEstarttime('');
        seteendtime('');
        setFileBase64('');
        setOldImgName('');
        setobtain([]);
        form.resetFields();
    };

    const onFinish= (values:any)=>{
        let jsonObtain=obtain.join("|");
        setspinning(true);
        props.dispatch({
            type:'Emp/add',
            payload:{...values,estarttime,eendtime,oldImgName,jsonObtain}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0||res.ErrorCode==9038){
                message.success('添加成功');
                // 添加成功后清空草稿缓存
                clearCache();
                setspinning(false);
                history.push('/enter/yuangonglData');
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        });
    };
    const changeData=(_:any,item:any)=>{
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
        // 加载缓存：回填state与表单字段
        const cache = loadCache();
        if (cache) {
            setEstarttime(cache.estarttime ?? '');
            seteendtime(cache.eendtime ?? '');
            setFileBase64(cache.fileBase64 ?? '');
            setOldImgName(cache.oldImgName ?? '');
            setobtain(cache.obtain ?? []);
            if (cache.formValues) {
                form.setFieldsValue(cache.formValues);
            }
        }
        getGeteList();
        getGroupingList();
    }, []);
    // 任意state变动自动存缓存
    useEffect(() => {
        saveCache();
    }, [saveCache]);
    // 表单字段变动也立即存
    const handleFormChange = () => {
        saveCache();
    };

    const changeGate=(e:any)=>{
        setobtain(e);
    };
    // 选择闸机
    const changeGrouping=(e:number)=>{
        GroupingServer.one(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let newArr :any[]=mapArrList(res.Data[1]);
                setobtain(newArr);
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
                onValuesChange={handleFormChange}
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
                           <ImageUploadPng onImageUpload={handleImageUpload} oldBase64={getImgBase64}/>
                           {fileBase64?<Image src={fileBase64} style={{width:'80px',height:'80px'}}/>:''}
                       </Space>
                   </Space>
                </Form.Item>
                <Form.Item label='备注' name='custom'>
                    <Input placeholder='备注'/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                   <Space>
                       <Button type="primary" htmlType="submit">
                           添加
                       </Button>
                       <Button type="primary" onClick={()=>navigate(-1)}>
                           返回
                       </Button>
                       <Button danger onClick={resetAllFormData}>
                           清空草稿
                       </Button>
                   </Space>
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