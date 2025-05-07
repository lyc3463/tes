import {useState} from "react";
import {Button, Form, Input, List, message, Modal, Space, Spin, Tag} from "antd";
import * as CarManageService from '@/services/carManage';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {connect} from "umi";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const MonthlyInsuranceInfo=(props)=>{
    const [monthluList,setmonthluList]=useState([]);// 月保列表
    const [spinning,setspinning]=useState(false);
    const [open,setOpen]=useState(false);
    const [looffCarNo,setlooffCarNo]=useState('');// 需要注销的车牌
    const [looffCarColor,setlooffCarColor]=useState('');
    const [inp1,setInp1]=useState('');
    const [inp2,setInp2]=useState('');
    const [inp3,setInp3]=useState('');
    const [inp4,setInp4]=useState('');
    const [inp5,setInp5]=useState('');
    const [inp6,setInp6]=useState('');
    const [inp7,setInp7]=useState('');
    const [inp8,setInp8]=useState('');

    // 根据车牌查询车辆月保信息
    const reactViewCarNo=()=>{
        let carNo=`${inp1}-${inp2}${inp3}${inp4}${inp5}${inp6}${inp7}${inp8}`;
        if (!carNo) return message.warning("请输入正确车牌号");
        CarManageService.reactCarNo(carNo).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                if (res.Data.length<=0){
                    message.warning('未能查询到该车辆');
                    setspinning(false);
                    setmonthluList([]);
                }else {
                    res.Data.forEach(user => {
                        user.parkServiceList.forEach(service => {
                            service.carList.forEach(car => {
                                car.carNo = decodeURIComponent(car.carNo);
                            });
                        });
                    });
                    setspinning(false);
                    setmonthluList(res.Data);
                }

            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    // 渲染车辆类型
    const  renderCarType=(text:any) => {
        let carType;
        switch (text) {
            case 'CAR':
                carType=<Tag color='blue'>小车</Tag>
                break;
            case 'LARGE':
                carType=<Tag color='green'>大车</Tag>
                break;
            case 'EXTRA_LARGE':
                carType=<Tag color='red'>超大车</Tag>
                break;
            default:
                carType=<Tag color='red'>其他类型</Tag>
        }
        return(
            <Space>
                {carType}
            </Space>
        )
    };
    // 渲染车辆颜色
    const  renderCarColor=(text:any) => {
        let carColor;
        switch (text) {
            case 'BLUE':
                carColor=<Tag style={{color:"blue"}}>蓝色</Tag>
                break;
            case 'GREEN':
                carColor=<Tag style={{color:"green"}}>绿色</Tag>
                break;
            case 'WHITE':
                carColor=<Tag>白色</Tag>
                break;
            case 'YELLOW':
                carColor=<Tag style={{color:"yellow"}}>黄色</Tag>
                break;
            case 'BLACK':
                carColor=<Tag>黑色</Tag>
                break;
            default:
                carColor=<Tag>其余颜色</Tag>
        }
        return(
            <Space>
                {carColor}
            </Space>
        )
    };
    const iszuxiao=(e:any)=>{
        setOpen(true);
        setlooffCarNo(e.parkServiceList[0].carList[0].carNo);
        setlooffCarColor(e.parkServiceList[0].carList[0].carNoColor);
    };
    const onOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'MonthlyCard/loogoo',
            payload:{looffCarNo,looffCarColor}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success("注销成功");
                setspinning(false);
                setOpen(false);
            }else {
                message.error(res.Data);
                setspinning(false);
                setOpen(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={(e)=>setInp1(e.target.value)}
                            style={{width:'50px'}}
                        />
                        一
                        <Input
                            onChange={(e)=>setInp2(e.target.value)}
                            style={{width:'50px'}}
                        />
                        <Input
                            onChange={(e)=>setInp3(e.target.value)}
                            style={{width:'50px'}}
                        />
                        <Input
                            onChange={(e)=>setInp4(e.target.value)}
                            style={{width:'50px'}}
                        />
                        <Input
                            onChange={(e)=>setInp5(e.target.value)}
                            style={{width:'50px'}}
                        />
                        <Input
                            onChange={(e)=>setInp6(e.target.value)}
                            style={{width:'50px'}}
                        />
                        <Input
                            onChange={(e)=>setInp7(e.target.value)}
                            style={{width:'50px'}}
                        />
                        <Input
                            onChange={(e)=>setInp8(e.target.value)}
                            style={{width:'70px'}}
                            placeholder="新能源"
                        />
                        <Button type="primary" onClick={reactViewCarNo}>查询</Button>
                    </Space>
                </List.Item>
            </List>
            <div style={{height:'70vh',overflow:'scroll'}}>
                {
                    monthluList.map((res:any,index:number)=>{
                        return (
                            <Form
                                key={index}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 14 }}
                                layout="horizontal"
                                size={'large'}
                                style={{ marginTop: '1rem' }}
                            >
                                <Form.Item label='姓名'>
                                    <Input value={res.userName}/>
                                </Form.Item>
                                <Form.Item label='手机号'>
                                    <Input value={res.mobile}/>
                                </Form.Item>
                                {
                                    res.parkServiceList.map((item:any,itemIndex:number)=>(
                                            <div key={itemIndex}>
                                                <Form.Item label='园区名称'>
                                                    <Input value={item.parkName}/>
                                                </Form.Item>
                                                <Form.Item label='套餐类型'>
                                                    <Input value={item.tcName}/>
                                                </Form.Item>
                                                <Form.Item label='开始时间'>
                                                    <Input value={item.beginTime}/>
                                                </Form.Item>
                                                <Form.Item label='结束时间'>
                                                    <Input value={item.endTime}/>
                                                </Form.Item>
                                                {
                                                    item.carList.map((carItem:any,carIndex:number)=>(
                                                        <div key={carIndex}>
                                                            <Form.Item label='车牌号'>
                                                                <Input value={carItem.carNo}/>
                                                            </Form.Item>
                                                            <Form.Item label='车辆颜色'>
                                                                {renderCarColor(carItem.carNoColor)}
                                                            </Form.Item>
                                                            <Form.Item label='车辆类型'>
                                                                {renderCarType(carItem.carType)}
                                                            </Form.Item>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        ))
                                    }
                                    <Form.Item {...tailLayout}>
                                        <Button type='primary' danger onClick={()=>iszuxiao(res)}>注销</Button>
                                    </Form.Item>
                            </Form>
                        )
                    })
                }
            </div>
            <Modal open={open} loading={spinning} onCancel={()=>setOpen(false)} title={'是否要注销'} onOk={onOk}>
                <div>是否要注销{looffCarNo}?</div>
            </Modal>
        </Spin>
    )
}
export default connect() (MonthlyInsuranceInfo)