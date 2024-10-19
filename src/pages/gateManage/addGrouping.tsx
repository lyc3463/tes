import {Button, Form, Input, message, Select, Spin} from "antd";
import {useEffect, useState} from "react";
import {connect,history} from "umi";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddGrouping=(props:any)=>{
    const [isLoading,setIsLoading]=useState(false);
    const [form] = Form.useForm();
    // 房屋列表
    const [gateList,setGateList]=useState([]);
    const [joinGateList,setJoinGateList]=useState('');
    const onFinish=async (values)=>{
        props.dispatch({
            type:'Gate/add',
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
        console.log(props);
        setGateList(props.GateList)
    }, []);
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
                                gateList.length>0? gateList.map((item:any,index:any)=>{
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
                        <Button type="primary"  htmlType="submit" >
                            添加
                        </Button>
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