import {Button, Form, Input, message, Radio, Select, Space, Spin} from "antd";
import {useEffect, useState} from "react";
import {connect,history,useNavigate} from "umi";
import {filterAndUpdateList} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddDevice=(props)=>{
    const [isLoading,setIsLoading]=useState(false);
    const [form] = Form.useForm();
    const navigate=useNavigate();
    const [houseList,setHouseList]=useState([]);
    const onFinish=async (values)=>{
        setIsLoading(true);
        props.dispatch({
            type:'Gate/add',
            payload:values
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/gateManage/device');
                setIsLoading(false);
            }else{
                message.error(res.Data);
                setIsLoading(false);
            }
        })
    };
    useEffect(() => {
        getHouseList();
        filterAndUpdateList(props.HouseList, 'house_name', 'id', setHouseList);
    }, []);
    // 获取房屋列表
    const getHouseList=()=>{
        props.dispatch({
            type:'House/fetch',
        })
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
                    <Form.Item label='房屋' name='house_id'>
                        <Select>
                            {houseList.map((item:any,index:any)=>{
                                return(
                                    <Select.Option value={item.value} key={index}>
                                        {item.label}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item label='闸机编号' name='deviceSn' rules={[{required: true, message: '请填写闸机编号'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label='闸机地点' name='position' rules={[{required: true, message: '请填写闸机地点'}]}>
                        <Input/>
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
        HouseList: state.House.list
    }
};
export default connect(mapStateToProps) (AddDevice)