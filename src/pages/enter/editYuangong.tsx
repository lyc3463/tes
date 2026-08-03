import {useEffect, useRef, useState} from "react";
import {connect,history,useLocation,useNavigate} from "umi";
import * as EmpServer from "@/services/emp";
import {Button, DatePicker, Form, Image, Input, message, Radio, Select, Space, Spin, Upload} from "antd";
import dayjs from "dayjs";
import CmpImageUploader from "@/components/ImageUploader";
import {compressBase64, filterAndUpdateList} from "@/utils/OpenTool";
import * as GroupingServer from "@/services/grouping";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import ImageUploadPng from "@/components/ImageUploadPng";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditYuangong=(props:any)=>{
    const navigate=useNavigate();
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
    // 转圈
    const [spinning,setspinning]=useState(false);
    // 闸机原始列表列表
    const [gateList,setGateList]=useState([]);
    // 选择闸机列表
    const [obtain,setobtain]=useState([]);
    const location=useLocation();
    const getOneEmp=async (id:string)=>{
        let res:any=await  EmpServer.one(id);
        if (res.ErrorCode==0){
            console.log('res',res);
            formRef.current.setFieldsValue(res.Data);
            // let aaa=await compressBase64(res.Data.avatarBase64)
            setOldImgName(res.Data.avatarBase64);
            let splicegateIds=res.Data.gateIds.split("|").map(Number);
            setobtain(splicegateIds);
            seteendtime(dayjs(res.Data.eendtime).format('YYYY-MM-DD'));
            setEstarttime(dayjs(res.Data.estarttime).format('YYYY-MM-DD'));
        }else {
            message.error(res.Data)
        }
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneEmp(id);
        getGroupingList();
        getGeteList();
    },[]);
    // 修改上传
    const onFinisn=(values:any)=>{
        setspinning(true);
        let jsonObtain=obtain.join("|");
        props.dispatch({
            type:'Emp/edit',
            payload:{...values,uid,estarttime,eendtime,oldImgName,jsonObtain}
        }).then((res)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                setspinning(false);
                history.push('/enter/yuangonglData');
            }else {
                message.error(res.Data);
                setspinning(false);
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
    // 获取分组
    const getGroupingList=()=>{
        props.dispatch({
            type:'Grouping/fetch'
        })
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
    const changeGate=(e)=>{
        setobtain(e);
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
    const changeData=(_,item)=>{
        setEstarttime(item[0]);
        seteendtime(item[1]);
    };
    return(
        <Spin spinning={spinning}>
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
                        eendtime&&estarttime?<DatePicker.RangePicker  defaultValue={[dayjs(estarttime), dayjs(eendtime)]} onChange={changeData}/>:''
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
                <Form.Item label='闸机分组'>
                    <Select onChange={changeGrouping} mode="multiple">
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
                        <ImageUploadPng onImageUpload={handleImageUpload}/>
                        {oldImgName ? (
                            <Image
                                src={oldImgName.includes('.png')
                                    ? `${window.ServerConfig.imgServer}${oldImgName}`
                                    : `${window.ServerConfig.imgServer}${oldImgName}.png`
                                }
                                style={{width:'80px',height:'80px'}}
                            />
                        ) : ''}
                    </Space>
                </Form.Item>
                <Form.Item {...tailLayout}>
                  <Space>
                      <Button type="primary" htmlType="submit">
                          编辑
                      </Button>
                      <Button type="primary" onClick={()=>navigate(-1)}>
                          返回
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
    }
};
export default  connect(mapStateToProps)(EditYuangong)