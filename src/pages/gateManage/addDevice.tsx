import {Button, Form, Input, message, Radio, Select, Spin} from "antd";
import {useEffect, useState} from "react";
import {connect,history} from "umi";
import {filterAndUpdateList} from "@/utils/OpenTool";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddDevice=(props)=>{
    const [isLoading,setIsLoading]=useState(false);
    const [form] = Form.useForm();
    const [houseList,setHouseList]=useState([]);
    const onFinish=async (values)=>{
        props.dispatch({
            type:'Gate/add',
            payload:values
        }).then((res)=>{
            if (res.ErrorCode==0){
                message.success('添加成功')
                history.push('/gateManage/device')
            }
        })
    };
    useEffect(() => {
        filterAndUpdateList(props.HouseList, 'house_name', 'id', setHouseList);
    }, []);
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
                    <Form.Item label='闸机编号' name='deviceSn'>
                        <Input/>
                    </Form.Item>
                    <Form.Item label='闸机地点' name='position'>
                        <Input/>
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
        HouseList: state.House.list    }
};
export default connect(mapStateToProps) (AddDevice)