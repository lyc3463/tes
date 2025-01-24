import {Button, Form, Input, InputNumber, message, Radio, Select, Spin} from "antd";
import {connect,useLocation,history} from 'umi';
import * as UnitServer from "@/services/unit";
import {useEffect, useRef, useState} from "react";
import {filterAndUpdateList} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as HouseListServer from "@/services/house";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditUnit=(props:any)=>{
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
    const [form] = Form.useForm();
    const formRef=useRef();
    const [spinning,setspinning]=useState(false);
    // 路由参数
    const [uid,setUid]=useState<string|undefined>()
    const onFinish=async (values:any)=>{
        setspinning(false);
        let res=await props.dispatch({
            type:'Unit/edit',
            payload:{...values,uid,add_area}
        })
        if (res.ErrorCode==0){
            setspinning(false);
            message.success('修改成功');
            history.push('/houseManage/houseList');
        }else {
            message.error(res.Data);
            setspinning(false);
        }
    }
    const getUnitOne=async (e:string)=>{
        let res:any=await UnitServer.one(e)
        if (res?.ErrorCode==0){
            console.log('res',res);
            formRef.current.setFieldsValue(res?.Data);
            changehouse(res.Data.house_id);
            setrentable_area(res.Data.rentable_area);
            setrent(res.Data.rent);

        }else {
            message.error(res.Data)
        }
    }
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getUnitOne(id);
        getHouseList();
    }, []);
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
                ref={formRef}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='房屋名称' name='house_id'>
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
                <Form.Item label='单元名称' name='unit_name'>
                    <Input/>
                </Form.Item>
                <Form.Item label='建筑面积㎡' name='floor_area'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='可租面积㎡' name='rentable_area'>
                    <InputNumber min={0} onChange={changerentable_area}/>
                </Form.Item>
                <Form.Item label='所属楼层(层)' name='floor'>
                    <InputNumber max={floors}/>
                </Form.Item>
                <Form.Item label='每平单价' name='rent'>
                    <InputNumber min={0} onChange={changerent}/>
                </Form.Item>
                <Form.Item label='租金(元)' name='price'>
                    <InputNumber min={zj}/>
                </Form.Item>
                <Form.Item label='注意'>
                    <span style={{fontSize:'12px',color:'#555'}}>租金不能低于{zj}元=每平单价*可租面积</span>
                </Form.Item>
                <Form.Item label='单元类型' name='unit_type'>
                    <Radio.Group >
                        <Radio value={1}>商业</Radio>
                        <Radio value={2}>办公</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='可增面积㎡' >
                    <InputNumber value={add_area} disabled/>
                </Form.Item>
                {/*<Form.Item label='租赁状态' name='status'>*/}
                {/*    <Radio.Group >*/}
                {/*        <Radio value={1}>已租</Radio>*/}
                {/*        <Radio value={2}>未租</Radio>*/}
                {/*        /!*<Radio value={3}>退租</Radio>*!/*/}
                {/*    </Radio.Group>*/}
                {/*</Form.Item>*/}
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        修改
                    </Button>
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
export default connect(mapStateToProps) (EditUnit)