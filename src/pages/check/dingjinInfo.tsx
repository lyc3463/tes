import {connect,history,useNavigate} from "umi";
import {useEffect, useRef, useState} from "react";
import * as StaffServer from "@/services/staff";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {Button, DatePicker, Form, Input, InputNumber, message, Select, Space, Tag} from "antd";
import dayjs from "dayjs";
import * as CheckCompanyService from "@/services/checkCompany";
const tailLayout = {
    wrapperCol: { offset: 3 },
};
const DingjinInfo=(props)=>{
    const navigate=useNavigate();
    const formRef=useRef();
    // 路由参数
    const [uid,setUid]=useState('');
    // 签订日期
    const [dayDate,setDayDate]=useState('');
    const [contractTypeid,setcontractTypeid]=useState(0);
    // 单元列表
    const [unitList,setUnitList]=useState([]);
    // 客户列表
    const [kehuList,setKehuList]=useState([]);
    // 勾选的单元id数组
    const [unitarrList,setUnitarrList]=useState([]);
    // 最小租金
    const [minzujin,setminzujin]=useState(0);
    // 单元禁选状态
    const [unitStutes,setunitStutes]=useState(false);
    // 房屋id
    const [house_id,sethouse_id]=useState(0);
    // 房屋列表
    const [houseList,sethouseList]=useState([]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneStaff(id);
        getHouseList();
        getUnitList();
        getCheckCompanyList();
    }, []);
    // 获取客户列表
    const getCheckCompanyList=()=>{
        CheckCompanyService.companyList({name:''}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setKehuList(res.Data);
            }else {
                message.error(res.Data)
            }
        })
    };
    const getOneStaff= (id:string)=>{
        StaffServer.onedj(id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('res',res);
                sethouse_id(res.Data.houseId);
                formRef.current.setFieldsValue(res.Data);
                setDayDate(dayjs(res.Data.beginTime).format("YYYY-MM-DD"));
                setcontractTypeid(res.Data.contractType);
                setUnitarrList(res.Data.unitIds.split(',').map(item => parseInt(item, 10)));
            }else {
                message.error(res.Data)
            }
        })
    };
    // 获取单元列表
    const getUnitList=()=>{
        props.dispatch({
            type:'Unit/fetch',
            payload:{page:1, name: '', beginRents:0, endRents:9999999999, status:0, house_id:0,pageSize:1000}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setUnitList(res.Data);
            }else {
                message.error(res.Data)
            }
        })
    };
    const changeunit=(e)=>{
        setUnitarrList(e);
    };
    // 获取房屋列表
    const getHouseList=()=>{
        props.dispatch({
            type:'House/fetch'
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('房屋id',res);
                sethouseList(res.Data);
            }else {
                message.error(res.Data)
            }
        })
    };
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                layout="horizontal"
                size={'large'}
                style={{ marginTop:'1rem',paddingLeft:"10rem"}}
            >
                <Form.Item style={{display:'flex'}} >
                    <Space size='large'>
                        <Form.Item label='合同类型' style={{width:'15rem'}}>
                            <Input value='定金合同' disabled/>
                        </Form.Item>
                        <Form.Item label='合同编号' name='identifier' style={{width:'15rem'}}>
                            <Input disabled/>
                        </Form.Item>

                        <Form.Item label='签订日期' style={{width:'15rem'}}>
                            <DatePicker value={dayjs(dayDate)} disabled/>
                        </Form.Item>
                    </Space>
                </Form.Item>
                <Form.Item style={{display:'flex'}}>
                    <Space size='large'>
                        <Form.Item label='客户' name='clientId' style={{width:'15rem'}}>
                            <Select>
                                {kehuList.map((item:any,index:any)=>{
                                    return(
                                        <Select.Option value={item.id} key={index}>
                                            {item.custom_name}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label='房屋'  style={{width:'20rem'}}>
                            <Select placeholder='房屋'
                                    value={house_id}
                                    disabled
                            >
                                {houseList.map((item:any,index:any)=>{

                                    return(
                                        <Select.Option value={item.id} key={index}>
                                            {item.house_name}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label='单元'  style={{width:'30rem'}}>
                            <Select placeholder='单元'
                                    onChange={changeunit}
                                    value={unitarrList}
                                    disabled
                                    mode="multiple"
                            >
                                {unitList.map((item:any,index:any)=>{
                                    let statusText;
                                    if (item.status === 1) {
                                        statusText = <Tag color="green">未租</Tag>; // 假设使用Ant Design的Tag组件来显示状态
                                    } else if (item.status === 2) {
                                        statusText = <Tag color="blue">已租</Tag>;
                                    } else if (item.status === 3) {
                                        statusText = <Tag color="red">退租</Tag>;
                                    } else {
                                        // 处理未知状态，或显示原始文本
                                        statusText = <span>未知状态</span>;
                                    }
                                    return(
                                        <Select.Option value={item.id} key={index}>
                                            {item.unit_name}-{statusText}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    </Space>
                </Form.Item>
                <Form.Item style={{display:'flex'}}>
                    <Space size='large'>
                        <Form.Item label='租金/月(元)' name='zuMoney' style={{width:'15rem'}}>
                            <InputNumber min={minzujin} disabled/>
                        </Form.Item>
                        <Form.Item label='押金(元)' name='deposit' style={{width:'15rem'}}>
                            <InputNumber disabled/>
                        </Form.Item>
                    </Space>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" onClick={()=>navigate(-1)}>
                            返回
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
}
export default connect() (DingjinInfo)