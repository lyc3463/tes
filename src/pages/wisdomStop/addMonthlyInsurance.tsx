import {useEffect, useState} from "react";
import {Button, DatePicker, Form, Input, message, Select, Spin} from "antd";
import {getTimeRangeByMonthsz} from "@/utils/OpenTool";
import * as UserCarServer from "@/services/userCar";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";

const AddMonthlyInsurance=(props)=>{
    const [item,setItem]=useState([]);
    const [form] = Form.useForm();
    const [tcid,setTcid]=useState(''); // 套餐id
    const [parkServiceId,setParkServiceId]=useState(''); // 月卡园区id
    const [oldStartDate,setOldStartDate]=useState('2000-01-01');// 原开始时间
    const [oldEndDate,setOldEndDate]=useState('2000-01-01'); // 原结束时间
    const [month,setMonth]=useState(0); // 月份
    const [money,setMoney]=useState(0);// 金额
    const [carNo,setCarNo]=useState('');// 车牌
    const [carType,setCarType]=useState('');// 车辆类型
    const [carColor,setCarColor]=useState('');// 车辆颜色
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [monthOptions, setMonthOptions] = useState([]);
    const [startDate,setStartDate]=useState('');// 开始时间
    const [endDate,setEndDate]=useState('');// 结束时间
    const [loading,setLoading]=useState(false);
    const [appId,setAppId]=useState(0);
    useEffect(() => {
        // 数据加载完成后初始化表单
        if (props) {
            setParkServiceId(props.data[0].parkServiceList[0].parkServiceId);
            setOldStartDate(props.data[0].parkServiceList[0].beginTime);
            setOldEndDate(props.data[0].parkServiceList[0].endTime);
            setCarNo(props.data[0].parkServiceList[0].carList[0].carNo);
            setCarColor(props.data[0].parkServiceList[0].carList[0].carNoColor);
            setCarType(props.data[0].parkServiceList[0].carList[0].carType);
            setMonth(0);
            setAppId(props.appId);
            form.resetFields(['packageId', 'month']);
            console.log('props',props);
        }
    }, [props]);
    // 获取套餐列表
    const getPackageList=()=>{
        UserCarServer.getItemList().then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setItem(res.Data);
            }
        })
    };
    useEffect(() => {
        getPackageList();
    }, []);
    // 监听时间
    const onFinish=()=>{
        if (month==0) return message.error('请选择月份');
        if (startDate==='') return message.error('请选择时间');
        if (endDate==='') return message.error('请选择时间');
        if (tcid==='') return message.error('请选择套餐');
        UserCarServer.edityuebaoInfo(tcid,parkServiceId,month,startDate,endDate,money,appId,oldStartDate).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('延期成功');
                props.onSuccess?.()
            }else {
                message.error(res.ErrorCode);
            }
        })
    };
    return(
        <Spin spinning={loading}>
            <Form
                form={form}
                onFinish={onFinish}
                onValuesChange={(changedValues, allValues) => {
                    // 当套餐变化时，更新月份选项
                    if (changedValues.packageId) {
                        const packageItem = item.find(item => item.itemId === changedValues.packageId);
                        setSelectedPackage(packageItem);
                        // 生成月份选项
                        if (packageItem && packageItem.chargeStand) {
                            const options = packageItem.chargeStand.map(stand => ({
                                value: stand.months,
                                label: `${stand.months}个月 (${stand.totalFee}元)`,
                                fee: stand.totalFee
                            }));
                            setMonthOptions(options);
                            setTcid(packageItem.itemId);
                        } else {
                            setMonthOptions([]);
                            setTcid('');
                        }
                        form.setFieldsValue({ month: undefined, fee: undefined });
                    }
                    // 当月份变化时，更新费用显示及状态变量
                    if (changedValues.month && selectedPackage) {
                        const selectedMonth = monthOptions.find(option => option.value === changedValues.month);
                        if (selectedMonth) {
                            form.setFieldsValue({ fee: selectedMonth.fee });
                            // 存储月份和金额到状态变量，供后续使用
                            setMonth(changedValues.month); // 更新月份状态
                            setMoney(selectedMonth.fee);     // 更新金额状态
                            setTcid(allValues.packageId);  // 存储选中的套餐ID
                            let dataTime=getTimeRangeByMonthsz(oldEndDate,changedValues.month);
                            console.log('dataTime',dataTime);
                            setStartDate(dataTime.startTime);
                            setEndDate(dataTime.endTime);
                        }else {
                            setMonth(0);
                            setMoney(selectedMonth.fee);     // 更新金额状态
                            setTcid('');
                        }
                    }
                }}
            >
                <Form.Item label='车牌号'>
                    <Input value={carNo}/>
                </Form.Item>
                <Form.Item label='车辆颜色'>
                    {carColor === 'BLUE' && '蓝色'}
                    {carColor === 'GREEN' && '绿色'}
                    {carColor === 'WHITE' && '白色'}
                    {carColor === 'YELLOW' && '黄色'}
                    {carColor === 'BLACK' && '黑色'}
                </Form.Item>
                <Form.Item label='车辆类型'>
                    {carType === 'CAR' && '小车'}
                    {carType === 'LARGE' && '大车'}
                    {carType === 'EXTRA_LARGE' && '超大车'}
                </Form.Item>
                <Form.Item label="选择套餐" name="packageId">
                    <Select
                        placeholder="请选择套餐类型"
                        style={{ width: 300 }}
                        onChange={(value) => {
                            form.setFieldsValue({ month: undefined });
                        }}
                    >
                        {item.map(packageItem => (
                            <Select.Option key={packageItem.itemId} value={packageItem.itemId}>
                                {packageItem.tcName}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="选择月份" name="month">
                    <Select placeholder="请先选择套餐" style={{ width: 300 }}>
                        {monthOptions.map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                {month==0?'':
                    <>
                        <Form.Item label="开始时间">
                            <DatePicker value={dayjs(startDate)} disabled/>
                        </Form.Item>
                        <Form.Item label="结束时间">
                            <DatePicker value={dayjs(endDate)} disabled/>
                        </Form.Item>
                    </>
                }
                <>
                    <Form.Item label="原开始时间">
                        <DatePicker  value={dayjs(oldStartDate)} disabled/>
                    </Form.Item>
                    <Form.Item label="原结束时间">
                        <DatePicker value={dayjs(oldEndDate)} disabled/>
                    </Form.Item>
                </>
                {
                    month==0?'':<Form.Item label="费用" name="fee">
                        <Input disabled placeholder="选择月份后显示" />
                    </Form.Item>
                }
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default AddMonthlyInsurance