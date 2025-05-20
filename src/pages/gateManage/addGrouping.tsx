import {Button, Form, Input, message, Select, Space, Spin} from "antd";
import {useEffect, useState} from "react";
import {connect,history,useNavigate} from "umi";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddGrouping=(props:any)=>{
    const navigate=useNavigate();
    const [isLoading,setIsLoading]=useState(false);
    const [form] = Form.useForm();
    const [joinGateList,setJoinGateList]=useState('');
    // 添加分组按钮
    const onFinish=async (values)=>{
        props.dispatch({
            type:'Grouping/add',
            payload:{...values,joinGateList}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/gateManage/grouping')
            }else {
                message.error(res.Data)
            }
        })
    };
    // 获取闸机列表
    const getGate=()=>{
        props.dispatch({
            type:'Gate/fetch'
        })
    };
    useEffect(() => {
        getGate();
    }, []);
    // 监听闸机列表  把["xx","xx"]转换成xx,xx
    const changeSelectg=(e)=>{
        setJoinGateList(e.join(","))
    };
    return(
        <div>
            <Spin spinning={isLoading}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    onFinish={onFinish}
                    style={{ marginTop: '1rem' }}
                >
                    <Form.Item label='分组名称' name='name'>
                        <Input/>
                    </Form.Item>
                    <Form.Item label='选择闸机'>
                        <Select  mode="multiple" onChange={changeSelectg}>
                            {
                                props.GateList&&props.GateList.length>0?props.GateList.map((item:any,index:any)=>{
                                    return(
                                        <Select.Option value={item.deviceSn} key={index}>
                                            {item.position}
                                        </Select.Option>
                                    )
                                }):''
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                       <Space>
                           <Button type="primary"  htmlType="submit" >
                               添加
                           </Button>
                           <Button type="primary" onClick={()=>navigate(-1)}>
                               返回
                           </Button>
                       </Space>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        GateList: state.Gate.list
    }
};
export default connect(mapStateToProps) (AddGrouping)