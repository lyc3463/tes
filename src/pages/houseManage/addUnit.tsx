import {Button, Form, Modal, Pagination, Radio, Select, Table, Input, InputNumber, message} from "antd";
import {connect, history} from "umi";
import {useEffect, useState} from "react";
import {filterAndUpdateList} from "@/utils/OpenTool";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddUnit=(props:any)=>{
    const [form] = Form.useForm();
    const [houseList,setHouseList]=useState([])
    const onFinish=async (values:any)=>{
        let res=await props.dispatch({
            type:'Unit/add',
            payload:values
        })
        if (res.ErrorCode==0){
            message.success('添加成功')
            history.push('/houseManage/houseList')
        }
    }
    useEffect(() => {
        filterAndUpdateList(props.HouseList, 'house_name', 'id', setHouseList);
    }, []);
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
                <Form.Item label='房屋名称' name='house_id'>
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
                <Form.Item label='单元名称' name='unit_name'>
                    <Input/>
                </Form.Item>
                <Form.Item label='建筑面积㎡' name='floor_area'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='可租面积㎡' name='rentable_area'>
                    <Input/>
                </Form.Item>
                <Form.Item label='所属楼层(层)' name='floorz'>
                    <Input/>
                </Form.Item>
                <Form.Item label='价格(元)' name='rent'>
                    <Input/>
                </Form.Item>
                <Form.Item label='租金(元)' name='price'>
                    <Input/>
                </Form.Item>
                <Form.Item label='单元类型' name='unit_type'>
                    <Radio.Group >
                        <Radio value={1}>商业</Radio>
                        <Radio value={2}>办公</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='可增面积㎡' name='add_area'>
                    <Input/>
                </Form.Item>
                <Form.Item label='租赁状态' name='statuz'>
                    <Radio.Group >
                        <Radio value={1}>已租</Radio>
                        <Radio value={2}>未租</Radio>
                        {/*<Radio value={3}>退租</Radio>*/}
                    </Radio.Group>
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
        HouseList: state.House.list
    }
};
export default  connect(mapStateToProps)(AddUnit)