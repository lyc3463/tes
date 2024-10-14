import {Button, Form, Input, InputNumber, message, Radio, Select} from "antd";
import {connect,useLocation,history} from 'umi';
import * as UnitServer from "@/services/unit";
import {useEffect, useRef, useState} from "react";
import {filterAndUpdateList} from "@/utils/OpenTool";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditUnit=(props:any)=>{
    const [houseList,setHouseList]=useState([])
    const [form] = Form.useForm();
    const formRef=useRef()
    // 路由参数
    const [uid,setUid]=useState<string|undefined>()
    const onFinish=async (values:any)=>{
        let res=await props.dispatch({
            type:'Unit/edit',
            payload:{...values,uid}
        })
        if (res.ErrorCode==0){
            message.success('修改成功')
            history.push('/houseManage/houseList')
        }
    }
    const getUnitOne=async (e:string)=>{
        let res=await UnitServer.one(e)
        if (res?.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data)
        }
    }
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getUnitOne(id)
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
                ref={formRef}
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
                <Form.Item label='所属楼层(层)' name='floor'>
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
                <Form.Item label='租赁状态' name='status'>
                    <Radio.Group >
                        <Radio value={1}>已租</Radio>
                        <Radio value={2}>未租</Radio>
                        <Radio value={3}>退租</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        修改
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
export default connect(mapStateToProps) (EditUnit)