import {connect,useLocation,history,useNavigate} from 'umi';
import * as GroupingServer from "@/services/grouping";
import {useEffect, useRef, useState} from "react";
import {Button, Form, Input, InputNumber, message, Select, Space} from "antd";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditGrouping=(props)=>{
    const location=useLocation();
    const navigate=useNavigate();
    const [isLoading,setIsLoading]=useState(false);
    const [form] = Form.useForm();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    const [defaultName,setDefatName]=useState('');
    const [defaultGate,setDefaultGate]=useState([]);
    const [isXianshi,setIsXianshi]=useState(false);
    // 获取单个房屋详情
    const getOneBanner=async (id:string)=>{
        GroupingServer.one(id).then((res:any)=>{
            if (res.ErrorCode==0){
                setDefatName(res.Data[0]);
                let arr=res.Data[1].map((itme:any)=>{
                    return itme.device_sn
                })
                setDefaultGate(arr);
                setIsXianshi(true);
            }else {
                message.error(res.Data)
            }
        })

    };
    // 编辑提交
    const onFinish=async ()=>{
        let joinGateList=defaultGate.join(",");
        let res=await props.dispatch({
            type:'Grouping/edit',
            payload:{uid,defaultName,joinGateList}
        })
        if (res.ErrorCode==0){
            message.success('修改成功')
            history.push('/gateManage/grouping')
        }else {
            message.error(res.Data)
        }
    }
    // 获取闸机列表
    const getGate=()=>{
        props.dispatch({
            type:'Gate/fetch'
        })
    };
    useEffect(() => {
        getGate();
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneBanner(id);
    }, []);

    // 监听闸机列表  把["xx","xx"]转换成xx,xx
    const changeSelectg=(e)=>{
        setDefaultGate(e);
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
                <Form.Item label='分组名称'>
                    {isXianshi? <Input defaultValue={defaultName} onChange={(e)=>setDefatName(e.target.value)}/>:''}
                </Form.Item>
                <Form.Item label='选择闸机' >
                    {
                        isXianshi? <Select  mode="multiple" onChange={changeSelectg} defaultValue={defaultGate}>
                            {
                                props.GateList&&props.GateList.length>0?props.GateList.map((item:any,index:any)=>{
                                    return(
                                        <Select.Option value={item.deviceSn} key={index}>
                                            {item.position}
                                        </Select.Option>
                                    )
                                }):''
                            }
                        </Select>:''
                    }
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary"  htmlType="submit" >
                            修改
                        </Button>
                        <Button type="primary" onClick={()=>navigate(-1)}>
                            返回
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        GateList: state.Gate.list
    }
};
export default connect(mapStateToProps) (EditGrouping)