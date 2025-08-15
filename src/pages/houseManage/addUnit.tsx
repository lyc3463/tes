import {Button, Form, Modal, Pagination, Radio, Select, Table, Input, InputNumber, message, Spin, Space} from "antd";
import {connect, history,useNavigate} from "umi";
import {useEffect, useState} from "react";
import * as HouseListServer from "@/services/house";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddUnit=(props:any)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    const [houseList,setHouseList]=useState([]);
    // 房屋可增加面积
    const [add_area,setadd_area]=useState(0);
    // 房屋总楼层
    const [floors,setfloors]=useState(0);
    // 可租面积
    const [rentable_area,setrentable_area]=useState(0);
    // 每平单价
    const [rent,setrent]=useState(0);
    // 租金
    const [zj,setzj]=useState(0);
    const [spinning,setspinning]=useState(false);

    const onFinish=async (values:any)=>{
        setspinning(true);
        let res=await props.dispatch({
            type:'Unit/add',
            payload:{...values,add_area}
        });
        if (res.ErrorCode==0){
            message.success('添加成功');
            history.push('/houseManage/houseList');
            setspinning(false);
        }else {
            message.error(res.Data);
            setspinning(false);
        }
    };
    const getHouseList=()=>{
        props.dispatch({
            type:'House/fetch'
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setHouseList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        getHouseList();
    }, []);
    // 选择楼层详情
    const changehouse=(e)=>{
        HouseListServer.one(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setadd_area(res.Data.residue_add_area);
                setfloors(res.Data.floors)
            }else {
                message.error(res.Data)
            }
        })
    };
    // 可租面积
    const changerentable_area=(e)=>{
        console.log(e);
        setrentable_area(e);
    };
    // 每平方米单价
    const changerent=(e)=>{
        setrent(e);
    };
    useEffect(() => {
        setzj(roundToTwoDecimalPlaces(rent*rentable_area));
        // console.log()
    }, [rent,rentable_area]);
    // 保留两位小数整数
    const roundToTwoDecimalPlaces=(number)=> {
        return Math.round(number * 100) / 100;
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                initialValues={{unit_type:1}}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='房屋名称' name='house_id' rules={[{ required: true, message: '请选择房屋' }]}>
                    <Select onChange={changehouse}>
                        {houseList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.house_name}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='单元名称' name='unit_name' rules={[{ required: true, message: '请填写单元' }]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='建筑面积㎡' name='floor_area' rules={[{ required: true, message: '建筑面积' }]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='可租面积㎡' name='rentable_area' rules={[{ required: true, message: '可租面积' }]}>
                    <InputNumber min={0} onChange={changerentable_area}/>
                </Form.Item>
                <Form.Item label='所属楼层(层)' name='floorz' rules={[{ required: true, message: '所属楼层' }]}>
                    <InputNumber max={floors}/>
                </Form.Item>
                <Form.Item label='每平单价' name='rent' rules={[{ required: true, message: '每平单价' }]}>
                    <InputNumber min={0} onChange={changerent}/>
                </Form.Item>
                <Form.Item label='租金(元)' name='price' rules={[
                    { required: true, message: '租金' },
                    {
                        validator: (_, value) => {
                            if (value && value < zj) {
                                return Promise.reject(new Error(`租金不能少于${zj}元`));
                            }
                            return Promise.resolve();
                        },
                    },
                ]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='注意'>
                    <span style={{fontSize:'12px',color:'#555'}}>租金不能低于{zj}元=每平单价*可租面积</span>
                </Form.Item>
                <Form.Item label='单元类型' name='unit_type' rules={[{ required: true, message: '单元类型' }]}>
                    <Radio.Group >
                        <Radio value={1}>商业</Radio>
                        <Radio value={2}>办公</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='可增面积㎡'>
                    <InputNumber value={add_area} disabled/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                   <Space>
                       <Button type="primary" htmlType="submit">
                           添加
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
        HouseList: state.House.list
    }
};
export default  connect(mapStateToProps)(AddUnit)