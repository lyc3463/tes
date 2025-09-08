import {useState} from "react";
import {Button, Form, Input, List, message, Modal, Popover, Radio, Space, Spin, Tag} from "antd";
import * as CarManageService from '@/services/carManage';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {connect} from "umi";
import {CloseOutlined} from "@ant-design/icons";
import * as MonthlyCardService from '@/services/monthlyCard';

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const MonthlyCard=(props)=>{
    const [type,setType]=useState(1);
    const [teShuCarNo,setTeShuCarNo]=useState('');
    const [provinceVisible, setProvinceVisible] = useState(false); // 省份选择面板显示状态
    const [selectedProvince, setSelectedProvince] = useState(''); // 选中的省份
    const [charVisible, setCharVisible] = useState<number | null>(null); // 当前激活的字符选择框索引
    const [selectedCharIndex, setSelectedCharIndex] = useState<number | null>(null); // 选中的字符索引
    const [monthluList,setmonthluList]=useState([]);// 月保列表
    const [spinning,setspinning]=useState(false);
    const [open,setOpen]=useState(false);
    const [looffCarNo,setlooffCarNo]=useState('');// 需要注销的车牌
    const [looffCarColor,setlooffCarColor]=useState('');
    const [parkServiceId,setparkServiceId]=useState('');
    const [inp1,setInp1]=useState('');
    const [inp2,setInp2]=useState('');
    const [inp3,setInp3]=useState('');
    const [inp4,setInp4]=useState('');
    const [inp5,setInp5]=useState('');
    const [inp6,setInp6]=useState('');
    const [inp7,setInp7]=useState('');
    const [inp8,setInp8]=useState('');
    const provinceList = [
        '京', '津', '冀', '晋', '蒙', '辽', '吉', '黑',
        '沪', '苏', '浙', '皖', '闽', '赣', '鲁', '豫',
        '鄂', '湘', '粤', '桂', '琼', '渝', '川', '黔',
        '云', '藏', '陕', '甘', '青', '宁', '新', '港', '澳', '台'
    ];
    const charSet = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M',
        'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z','I','O'
    ];
    // 根据车牌查询车辆月保信息
    const reactViewCarNo=()=>{
        let carNo=`${inp1}-${inp2}${inp3}${inp4}${inp5}${inp6}${inp7}${inp8}`;
        if (type==1&&!carNo)return message.warning("请输入正确车牌号");
        if (type==2&&!teShuCarNo)return message.warning("请输入正确车牌号");
        getCarInfo(type==1?carNo:teShuCarNo);
    };
    const getCarInfo=(e)=>{
        CarManageService.reactCarNo(e).then((res:TypeErrorCode)=>{
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
        setparkServiceId(e.parkServiceList[0].parkServiceId);
    };
    const onOk=()=>{
        setspinning(true);
        MonthlyCardService.loogoo({looffCarNo,looffCarColor,parkServiceId}).then((res:TypeErrorCode)=>{
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
    // 处理字符选择
    const handleCharSelect = (char: string, index: number) => {
        // 根据索引更新对应输入框的值
        switch(index) {
            case 2: setInp2(char); break;
            case 3: setInp3(char); break;
            case 4: setInp4(char); break;
            case 5: setInp5(char); break;
            case 6: setInp6(char); break;
            case 7: setInp7(char); break;
            case 8: setInp8(char); break;
            default: break;
        }
        if (index < 8) { // 8是最后一个字符输入框的索引
            setTimeout(() => {
                setCharVisible(index + 1); // 打开下一个字符选择面板
            }, 100); // 延迟确保当前面板关闭后再打开新面板
        } else {
            setCharVisible(null); // 最后一个输入框选择后关闭面板
        }
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <Space>
                    <Radio.Group value={type} onChange={(e)=>setType(e.target.value)}>
                        <Radio value={1}>非特殊车牌</Radio>
                        <Radio value={2}>特殊车牌</Radio>
                    </Radio.Group>
                    {type==2?<Input style={{width:'200px'}} placeholder="请输入车牌号" value={teShuCarNo} onChange={(e)=>setTeShuCarNo(e.target.value)}/>:<>
                        <Popover
                            visible={provinceVisible}
                            onVisibleChange={setProvinceVisible}
                            trigger="click"
                            placement="bottom"
                            content={
                                <div style={{ padding: '10px', width: '320px' }}>
                                    {/* 省份选择网格布局 */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(8, 1fr)',
                                        gap: '8px'
                                    }}>
                                        {provinceList.map(province => (
                                            <Button
                                                key={province}
                                                onClick={() => {
                                                    setSelectedProvince(province); // 更新选中省份
                                                    setInp1(province); // 同步到车牌号拼接变量
                                                    setProvinceVisible(false); // 关闭省份面板

                                                    // 新增：自动打开第一个字符输入框的选择面板（索引2）
                                                    setTimeout(() => {
                                                        setCharVisible(2);
                                                    }, 100); // 延迟确保面板关闭后再打开新面板，避免动画冲突
                                                }}
                                                style={{
                                                    padding: '6px 0',
                                                    fontSize: '14px',
                                                    height: '36px'
                                                }}
                                            >
                                                {province}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            }
                        >
                            {/* 省份输入框（只读，点击触发Popover） */}
                            <Input
                                value={selectedProvince}
                                readOnly
                                onClick={() => setProvinceVisible(true)}
                                style={{
                                    width: '50px',
                                    cursor: 'pointer',
                                    backgroundColor: '#f5f5f5'
                                }}
                            />
                        </Popover>
                        一

                        {/* 字符选择输入框组 - 从inp2到inp8 */}
                        {[2, 3, 4, 5, 6, 7, 8].map((index) => (
                            <Popover
                                key={index}
                                visible={charVisible === index}
                                onVisibleChange={(visible) => {
                                    if (visible) {
                                        setCharVisible(index);
                                        setSelectedCharIndex(index);
                                    } else {
                                        setCharVisible(null);
                                    }
                                }}
                                trigger="click"
                                placement="bottom"
                                content={
                                    <div style={{ padding: '10px', width: '320px' }}>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(8, 1fr)',
                                            gap: '8px'
                                        }}>
                                            {charSet.map(char => (
                                                <Button
                                                    key={char}
                                                    onClick={() => handleCharSelect(char, index)}
                                                    style={{
                                                        padding: '6px 0',
                                                        fontSize: '14px',
                                                        height: '36px'
                                                    }}
                                                >
                                                    {char}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                }
                            >
                                <Input
                                    value={
                                        index === 2 ? inp2 :
                                            index === 3 ? inp3 :
                                                index === 4 ? inp4 :
                                                    index === 5 ? inp5 :
                                                        index === 6 ? inp6 :
                                                            index === 7 ? inp7 : inp8
                                    }
                                    readOnly
                                    onClick={() => setCharVisible(index)}
                                    placeholder={index === 8 ? "新能源" : ""}
                                    style={{
                                        width: index === 8 ? '70px' : '60px',
                                        cursor: 'pointer',
                                        backgroundColor: '#f5f5f5',
                                        borderColor: charVisible === index ? '#1890ff' : '#d9d9d9',
                                        borderWidth: charVisible === index ? '2px' : '1px',
                                        transition: 'border-color 0.2s'
                                    }}
                                    suffix={
                                        // 根据当前索引判断对应输入框是否有值，有值则显示清空按钮
                                        (index === 2 && inp2) ||
                                        (index === 3 && inp3) ||
                                        (index === 4 && inp4) ||
                                        (index === 5 && inp5) ||
                                        (index === 6 && inp6) ||
                                        (index === 7 && inp7) ||
                                        (index === 8 && inp8) ? (
                                            <CloseOutlined
                                                onClick={(e) => {
                                                    e.stopPropagation(); // 阻止事件冒泡
                                                    // 根据索引清空对应输入框的值
                                                    switch(index) {
                                                        case 2: setInp2(''); break;
                                                        case 3: setInp3(''); break;
                                                        case 4: setInp4(''); break;
                                                        case 5: setInp5(''); break;
                                                        case 6: setInp6(''); break;
                                                        case 7: setInp7(''); break;
                                                        case 8: setInp8(''); break;
                                                        default: break;
                                                    }
                                                }}
                                                style={{ cursor: 'pointer', color: '#ccc' }}
                                            />
                                        ) : null
                                    }
                                />
                            </Popover>
                        ))}
                    </>}

                    <Button type="primary" onClick={reactViewCarNo}>查询</Button>
                </Space>

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
export default connect() (MonthlyCard)