import {Button, Form, Select, DatePicker, Input, InputNumber, message, Image, Space, Tag, Spin} from "antd";
import {useCallback, useEffect, useState} from "react";
import {connect,history} from "umi";
import {addNewData, checkEndTime, splitDataByEndTimeAndRentPeriod, calculateTotalRentalDays, replaceEnglishCommasWithChinese, calculateTimePeriods, contractsDz, getHouseNameById, getNamesByIds, glmanageDz, getCurrentDate} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import NoyasuoImgCmp from "@/components/NoyasuoImgCmp";
import * as CheckCompanyService from '@/services/checkCompany';
import * as contractTypeListServer from "@/services/contractTypeList";
import * as UnitService from '@/services/unit';
import {PlusOutlined} from "@ant-design/icons";
import './staff.less';
import dayjs from "dayjs";
import * as StaffService from '@/services/staff';

// 缓存key
const CACHE_KEY = "AddStaff_form_cache";

const AddStaff=(props:any)=>{
    const [form] = Form.useForm();
    const [disb,setdisb]=useState(true);
    const [deposit,setdeposit]=useState(0);
    const [unitstutes,setunitstutes]=useState(1);
    const [selectedPhone,setSelectedPhone]=useState('');
    // 合同编号房屋名称
    const [houseName,sethouseName]=useState('');
    // 管理费
    const [manageFee,setManageFee]=useState(0);
    //合同编号单元名称
    const [unitNamess,setunitNamess]=useState('');
    // 递增
    const [formItems, setFormItems] = useState([]);
    // 免租期
    const [mzformItems,setmzFormItems]=useState([]);
    // 勾选的单元id数组
    const [unitarrList,setUnitarrList]=useState([]);
    // 补充协议内容
    const [remark,setremark]=useState('');
    // 物品清单
    const [wupinList, setwupinList] = useState([
        { key: 1,wupinName:null,wupininfo:null,wupinNuber:''},
    ]);
    // 客户列表
    const [kehuList,setKehuList]=useState([]);
    // 单元列表
    const [unitList,setUnitList]=useState([]);
    // 房屋列表
    const [houseList,sethouseList]=useState([]);
    // 开始时间
    const [startDate,setStartDate]=useState('');
    // 结束时间
    const [endDate,setEndDate]=useState('');
    // 交付日
    const [deliveryDate,setDeliveryDate]=useState(getCurrentDate());
    // 租户证件图片
    const [documentImages,setImgName]=useState([]);
    // 证件图片B64
    const [b64,setB64]=useState([]);
    // 单元图片
    const [unitImages,setunitImgName]=useState([]);
    // 补充协议图片名字
    const [xyimgnames,setxyimgnames]=useState([]);
    // 补充协议图片b64
    const [xyimgb64,setxyimgb64]=useState([]);
    // 单元平面图
    const [unitB64,setuintB64]=useState([]);
    // 合同类型ID  1定金合同，2正式合同
    const [contractType,setcontractType]=useState(0);
    // 合同类型列表
    const [ctyList,setCtyList]=useState([]);
    // 合同类型列表ID
    const [contractTypeid,setcontractTypeid]=useState(0);
    // 手动输入免租期天数
    const [mzq,setMzq]=useState(0);
    // 计算出来的免租期天数
    const [summzqDay,setsummzqDay]=useState(0);
    // 最小租金
    const [minzujin,setminzujin]=useState(0);
    // 面积
    const [mianji,setmianji]=useState(0);
    // 签订日期
    const [dayDate,setDayDate]=useState(getCurrentDate());
    const [spinning,setspinning]=useState(false);
    // 房屋id
    const [house_id,sethouse_id]=useState(0);
    // 单元禁选状态
    const [unitStutes,setunitStutes]=useState(true);
    // 租金
    const [zuMoney,setzuMoney]=useState(0);
    // 管理费列表
    const [manageFeeList,setManageFeeList]=useState([]);

    // 读取缓存
    const loadCache = useCallback(() => {
        const str = sessionStorage.getItem(CACHE_KEY);
        if (!str) return null;
        try {
            return JSON.parse(str);
        } catch (e) {
            sessionStorage.removeItem(CACHE_KEY);
            return null;
        }
    }, []);

    // 保存state+表单字段到缓存
    const saveCache = useCallback(() => {
        const data = {
            disb, deposit, unitstutes, selectedPhone, houseName, manageFee, unitNamess,
            formItems, mzformItems, unitarrList, remark, wupinList,
            startDate, endDate, deliveryDate,
            documentImages, b64, unitImages, xyimgnames, xyimgb64, unitB64,
            contractType, contractTypeid, mzq, summzqDay, minzujin, mianji, dayDate,
            house_id, unitStutes, zuMoney, manageFeeList,
            formValues: form.getFieldsValue()
        };
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch (e) {
            // sessionStorage 容量超限时静默失败（图片base64可能过大）
            console.warn('草稿保存失败：', e);
        }
    }, [
        disb, deposit, unitstutes, selectedPhone, houseName, manageFee, unitNamess,
        formItems, mzformItems, unitarrList, remark, wupinList,
        startDate, endDate, deliveryDate,
        documentImages, b64, unitImages, xyimgnames, xyimgb64, unitB64,
        contractType, contractTypeid, mzq, summzqDay, minzujin, mianji, dayDate,
        house_id, unitStutes, zuMoney, manageFeeList, form
    ]);

    // 清空缓存
    const clearCache = () => sessionStorage.removeItem(CACHE_KEY);

    // 清空草稿
    const resetAllFormData = () => {
        clearCache();
        setdisb(true);
        setdeposit(0);
        setunitstutes(1);
        setSelectedPhone('');
        sethouseName('');
        setManageFee(0);
        setunitNamess('');
        setFormItems([]);
        setmzFormItems([]);
        setUnitarrList([]);
        setremark('');
        setwupinList([{ key: 1,wupinName:null,wupininfo:null,wupinNuber:''}]);
        setStartDate('');
        setEndDate('');
        setDeliveryDate(getCurrentDate());
        setImgName([]);
        setB64([]);
        setunitImgName([]);
        setxyimgnames([]);
        setxyimgb64([]);
        setuintB64([]);
        setcontractType(0);
        setcontractTypeid(0);
        setMzq(0);
        setsummzqDay(0);
        setminzujin(0);
        setmianji(0);
        setDayDate(getCurrentDate());
        sethouse_id(0);
        setunitStutes(true);
        setzuMoney(0);
        setManageFeeList([]);
        form.resetFields();
    };

    // 删除免租期
    const removedzFormItemByKey = (key:number) => {
        setmzFormItems(prevItems => prevItems.filter((item:any) => item.id !== key));
    };
    // 删除物品表单项
    const removeqingdan = (key:number) => {
        setwupinList(prevItems => prevItems.filter((item:any) => item.key !== key));
    };
    const onFinish = async (values:any, contractStatus = 1) => {
        // 1. 通用参数
        const identifier = `${houseName}-${Date.now()}-${unitNamess}`;
        // 组装数据
        const unit_id = unitarrList.map((item:any)=>{
            return {id:item};
        });
        setspinning(true);
        try {
            // 正式合同
            if (contractType === 2) {
                // 校验：免租期天数是否一致
                const actualFreeDays = calculateTotalRentalDays(mzformItems);
                if (actualFreeDays !== mzq) {
                    message.warning('免租期天数与填写天数不相等');
                    setspinning(false);
                    return;
                }
                // 校验：租金不低于最低租金
                if (zuMoney < minzujin) {
                    message.warning(`租金不能低于 ${minzujin} 元`);
                    setspinning(false);
                    return;
                }
                // 过滤后的新数组 → 只保留你要的字段
                const filteredManageFeeList = manageFeeList.map(item => ({
                    id: item.id,
                    contractId: item.contractId,
                    beginTime: item.beginTime,
                    endTime: item.endTime,
                    incremental: item.incremental
                }));
                // 组装数据
                const datearr = splitDataByEndTimeAndRentPeriod(formItems, endDate);
                const imgs = xyimgnames.join('|');
                const unitImage = unitImages.join('|');
                const documentImage = documentImages.join('|');
                const dzJson = JSON.stringify(datearr);
                const goodsJson = JSON.stringify(wupinList);
                const rentJson = JSON.stringify(mzformItems);
                const unitJson = JSON.stringify(unit_id);
                const glfJson = JSON.stringify(filteredManageFeeList);
                const jsonDate=JSON.stringify({dzJson,rentJson,goodsJson,unitJson,glfJson});
                // 提交
                const res = await props.dispatch({
                    type: 'Staff/addzs',
                    payload: {...values, deposit, manageFee, identifier, endDate, startDate, deliveryDate, documentImage, unitImage, imgs, contractTypeid, unit_id:'', remark, house_id, zuMoney, jsonDate, contractStatus},
                });
                // 结果判断
                if (res.ErrorCode === 0) {
                    message.success('添加成功');
                    // 添加成功后清空草稿缓存
                    clearCache();
                    history.push('/enter/staff');
                } else {
                    message.error(res.Data);
                }
            }
            // 定金合同
            // fenye的后端方法修改，model的adddj执行后立刻执行fenye方法
            // 因此不再执行model的adddj方法，改成直接执行adddj
            else if (contractType === 1) {
                // const res = await props.dispatch({
                //     type: 'Staff/adddj',
                //     payload: {
                //         ...values,
                //         identifier,
                //         deposit,
                //         dayDate,
                //         contractTypeid,
                //         unit_id,
                //         house_id,
                //         zuMoney,
                //         contractStatus,
                //     },
                // });
                // if (res.ErrorCode === 0) {
                //     message.success('添加成功');
                //     // 添加成功后清空草稿缓存
                //     clearCache();
                //     history.push('/enter/staff');
                // } else {
                //     message.error(res.Data);
                // }
                StaffService.adddj({
                    ...values,
                    identifier,
                    deposit,
                    dayDate,
                    contractTypeid,
                    unit_id,
                    house_id,
                    zuMoney,
                    contractStatus,
                }).then((res:TypeErrorCode)=>{
                    if (res.ErrorCode === 0) {
                        message.success('添加成功');
                        // 添加成功后清空草稿缓存
                        clearCache();
                        history.push('/enter/staff');
                    } else {
                        message.error(res.Data);
                    }
                });
            }
            else {
                message.warning('请选择合同类型进行填写数据');
            }
        } catch (err) {
            message.error('操作异常，请重试');
            console.error(err);
        } finally {
            setspinning(false);
        }
    };
    useEffect(() => {
        // 加载缓存：回填所有state与表单字段
        const cache = loadCache();
        if (cache) {
            setdisb(cache.disb ?? true);
            setdeposit(cache.deposit ?? 0);
            setunitstutes(cache.unitstutes ?? 1);
            setSelectedPhone(cache.selectedPhone ?? '');
            sethouseName(cache.houseName ?? '');
            setManageFee(cache.manageFee ?? 0);
            setunitNamess(cache.unitNamess ?? '');
            setFormItems(cache.formItems ?? []);
            setmzFormItems(cache.mzformItems ?? []);
            setUnitarrList(cache.unitarrList ?? []);
            setremark(cache.remark ?? '');
            if (cache.wupinList) setwupinList(cache.wupinList);
            setStartDate(cache.startDate ?? '');
            setEndDate(cache.endDate ?? '');
            setDeliveryDate(cache.deliveryDate ?? getCurrentDate());
            setImgName(cache.documentImages ?? []);
            setB64(cache.b64 ?? []);
            setunitImgName(cache.unitImages ?? []);
            setxyimgnames(cache.xyimgnames ?? []);
            setxyimgb64(cache.xyimgb64 ?? []);
            setuintB64(cache.unitB64 ?? []);
            setcontractType(cache.contractType ?? 0);
            setcontractTypeid(cache.contractTypeid ?? 0);
            setMzq(cache.mzq ?? 0);
            setsummzqDay(cache.summzqDay ?? 0);
            setminzujin(cache.minzujin ?? 0);
            setmianji(cache.mianji ?? 0);
            setDayDate(cache.dayDate ?? getCurrentDate());
            sethouse_id(cache.house_id ?? 0);
            setunitStutes(cache.unitStutes ?? true);
            setzuMoney(cache.zuMoney ?? 0);
            setManageFeeList(cache.manageFeeList ?? []);
            if (cache.formValues) {
                form.setFieldsValue(cache.formValues);
            }
        }
        getCheckCompanyList();
        getCtyList();
        getHouseList();
    }, []);
    // 任意state变动自动存缓存
    useEffect(() => {
        saveCache();
    }, [saveCache]);
    // 表单字段变动也立即存
    const handleFormChange = () => {
        saveCache();
    };
    const changeData=(_:any,item:any)=>{
        setStartDate(item[0]);
        setEndDate(item[1]);
        let dataArr=calculateTimePeriods(item[0],item[1],zuMoney);
        setFormItems(dataArr);
    };
    // 新增管理费
    const addManageFeeFromItem=()=>{
        const newKey = manageFeeList.length ? Math.max(...manageFeeList.map((item:any) => item.id)) + 1 : 1;
        setManageFeeList([...manageFeeList, { id: newKey, contractId:0,beginTime: null,endTime:null,incremental:0}]);
    };
    // 更新免租期
    const updatemz = (key:number, updates:any) => {
        setmzFormItems(prevItems => prevItems.map((item:any) => item.id === key ? { ...item, ...updates } : item));
    };
     // 更新递增
    const updatedz = (key:number, updates:any) => {
        setFormItems(prevItems => {
            // 1. 更新对应的 item
            const updatedItems = prevItems.map((item:any) =>
                item.id === key ? { ...item, ...updates } : item
            );
            // 2. 计算 contractsDz
            const newItems = contractsDz(zuMoney, updatedItems);
            // 3. 返回最终结果
            return newItems;
        });
    };
    // 监听免租期天数
    useEffect(() => {
        setsummzqDay(calculateTotalRentalDays(mzformItems));
        console.log('mzformItems',mzformItems);
    }, [mzformItems]);
    // 添加递增表单项
    const addFormItem = () => {
        if (startDate&&endDate){
            let isAdd=checkEndTime(formItems,endDate);
            if (isAdd){
                const newKey = formItems.length ? Math.max(...formItems.map((item:any) => item.key)) + 1 : 1;
                let FormItems=[...formItems, { key: newKey, beginTime: null, endTime: null, incremental:0}]
                newArr(FormItems);
            }else {
                message.warning('您已不能在继续添加');
            }
        }else {
            message.warning('请选择起租日开始时间跟结束时间')
        }
    };
    // 新增免租期
    const addDzFromItem=()=>{
        const newKey = mzformItems.length ? Math.max(...mzformItems.map((item:any) => item.id)) + 1 : 1;
        setmzFormItems([...mzformItems, { id: newKey,  rentBeginTime: null,rentEndTime:null}]);
    };
    const newArr=(FormItems:any[])=>{
        let arr=addNewData(FormItems,endDate);
        if (arr.bllo){
            setFormItems(arr.updatedData);
        }else {
            message.warning('不能再添加');
        }
    };
    // 添加物品表单项
    const addwuping = () => {
        const newKey = wupinList.length ? Math.max(...wupinList.map((item:any) => item.key)) + 1 : 1;
        setwupinList([...wupinList, { key: newKey,wupinName: null,wupininfo: null,wupinNuber: ''}]);
    };
    // 获取单元列表
    const getUnitList=()=>{
        UnitService.stutesUnit({house_id:house_id}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setUnitList(res.Data);
            }else {
                message.error(res.Data)
            }
        })
    };
    // 获取房屋列表
    const getHouseList=()=>{
        props.dispatch({
            type:'House/fetch'
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                sethouseList(res.Data);
            }else {
                message.error(res.Data)
            }
        })
    };
    // 监听勾选的单元
    const changeunit=(e:any)=>{
        CheckCompanyService.companyorUnitList(e.join("|")).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setUnitarrList(e);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 筛选过滤掉的租金跟面积
    const filterzuArea=(item:any)=>{
        const filteredHouses = unitList.filter((house:any) => item.includes(house.id));
        const totalPrice = filteredHouses.reduce((accumulator:number, currentHouse:any) => accumulator + currentHouse.price, 0);
        const totalrentable_area = filteredHouses.reduce((accumulator:number, currentHouse:any) => accumulator + currentHouse.rentable_area, 0);
        setminzujin(totalPrice);
        setmianji(totalrentable_area);
    };
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
    // 租户证件图片名字
    const oldImgName=(e:string)=>{
        setImgName((prevItems=>[...prevItems,e]))
    };
    // 租户证件图片B64
    const onB64=(e:string)=>{
        // setB64(e);
        console.log('图片',e)
        setB64((prevItems=>[...prevItems,e]))
    };
    // 删除租户证件图片
    const handleDeletezuhu=(index:number)=>{
        const newImages = [...b64];
        newImages.splice(index, 1);
        setB64(newImages);
        const newB64 = [...documentImages];
        newB64.splice(index, 1);
        setImgName(newB64);
    };
    // 单元图片名字
    const getunitImgName=(e:string)=>{
        setunitImgName((prevItems=>[...prevItems,e]))
    };
    // 单元图片B64
    const getunitB64=(e:string)=>{
        setuintB64((prevItems=>[...prevItems,e]))
    };
    // 删除单元图片
    const handleDeleteunitImg=(index:number)=>{
        const newImages = [...unitImages];
        newImages.splice(index, 1);
        setunitImgName(newImages);
        const newB64 = [...unitB64];
        newB64.splice(index, 1);
        setuintB64(newB64);
    };
    // 更新管理费
    const upManageFee = (key:number, updates:any) => {
        setManageFeeList(prevItems => prevItems.map((item:any) => item.id === key ? { ...item, ...updates } : item));
    };
    const changedeliveryDate=(_:any,item:any)=>{
      setDeliveryDate(item);
    };
    // 修改物品清单的数量
    const updateMiber=(key:number, updates:any)=>{
        setwupinList(prevItems => prevItems.map((item:any) => item.key === key ? { ...item, ...updates } : item));
    };
    // 修改物品清单的标准
    const updatebiaozhun=(key:number, updates:any)=>{
        setwupinList(prevItems => prevItems.map((item:any) => item.key === key ? { ...item, ...updates } : item));
    };
    // 修改物品清单的名称
    const updateName=(key:number, updates:any)=>{
        setwupinList(prevItems => prevItems.map((item:any) => item.key === key ? { ...item, ...updates } : item));
    };
    // 补充协议图片名字
    const imgNames=(e:string)=>{
        setxyimgnames((prevItems=>[...prevItems,e]))
    };
    // 补充协议图片
    const xyB64=(e:string)=>{
        setxyimgb64((prevItems=>[...prevItems,e]))
    };
    // 删除补充协议图片
    const handleDelete=(index:number)=>{
        const newImages = [...xyimgnames];
        newImages.splice(index, 1);
        setxyimgnames(newImages);
        const newB64 = [...xyimgb64];
        newB64.splice(index, 1);
        setxyimgb64(newB64);
    };
    function findById(array:any[], id:number) {
        return array.find((item:any) => item.id === id);
    };
    const changecontractType=(e:number)=>{
        let result=findById(ctyList,e);
        setcontractType(result.templateType);
        setcontractTypeid(result.id);
    };
    const changeDayDate=(_:any,item:any)=>{
        setDayDate(item);
    };
    // 获取合同类型列表
    const getCtyList=()=>{
        contractTypeListServer.contractTypeList().then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setCtyList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 限制开始时间
    const disabledDate = (current:any) => {
        return (
            current && (current.isBefore(startDate, "day") || current.isAfter(endDate, "day"))
        );
    };
    // 禁用日期函数
    const disabledDate1 = (current:any) => {
        // 禁用在起始日期之前或在结束日期之后的日期
        return current && (current < dayjs(startDate) || current > dayjs(endDate));
    };
    // 离开当前页面
    const onLikai=()=>{
        history.push('/enter/staff/');
    };
    const changeremark=(e:any)=>{
        let a=replaceEnglishCommasWithChinese(e.target.value);
        setremark(a);
    };
    // 监听房屋
    const changeHouse=(e:number)=>{
        let retunName=getHouseNameById(houseList,e);
        sethouseName(retunName);
        sethouse_id(e);
        setunitStutes(false);
        getUnitList();
    };
    // 监听单元输入的名字
    useEffect(() => {
        getUnitList();
    }, [house_id]);
    const changeMoney=(e:number)=>{
      setzuMoney(e);
      setFormItems(contractsDz(e,formItems));
    };
    const changeKehu=(e:number)=>{
        getcokuInfo(e);
        const selectedCustomer = kehuList.find((item:any) => item.id === e);
        setSelectedPhone(selectedCustomer.custom_phone);
    };
    const getcokuInfo=(e:number)=>{
        CheckCompanyService.companyorDj(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                if (res.Data.houseId>0){
                    setdeposit(res.Data.deposit);
                    setdisb(true);
                    setzuMoney(res.Data.zuMoney)
                    sethouse_id(res.Data.houseId);
                    setunitStutes(true);
                    setUnitarrList(res.Data.unitIds.split("|").map(item => parseInt(item, 10)));
                    let retunName=getHouseNameById(houseList,res.Data.houseId);
                    sethouseName(retunName);
                }else {
                    setdisb(false);
                    setzuMoney(0);
                    sethouse_id(0);
                    setUnitarrList([]);
                    setunitStutes(true);
                    sethouseName('');
                    setunitNamess('');
                    setdeposit(0);
                }
            }
        })
    };
    // 更新管理费递增
    const managedz = (key:number, updates:any) => {
        setManageFeeList(prevItems => {
            // 1. 更新对应的 item
            const updatedItems = prevItems.map((item:any) =>
                item.id === key ? { ...item, ...updates } : item
            );
            // 2. 计算 manageDz
            const newItems = glmanageDz(manageFee, updatedItems);
            // 3. 返回最终结果
            return newItems;
        });
    };
    // 删除管理费
    const removedManageFeeFormItemByKey = (key:number) => {
        setManageFeeList(prevItems => prevItems.filter((item:any) => item.id !== key));
    };
    useEffect(() => {
        filterzuArea(unitarrList);
        setunitNamess(getNamesByIds(unitList,unitarrList))
    }, [unitList,unitarrList]);
    return(
        <Spin spinning={spinning}>
            <div className="edit-staff-form-container">
                <Form
                    form={form}
                    initialValues={{
                        remark: '', prepayment: 0, decorationCost: 0, customCard: '',
                        depositFee: 0, dispatchName: '', dispatchCard: '', businessEntity: '',
                        businessScope: '', legalPerson: '',manageFeeRent:0
                    }}
                    onFinish={onFinish}
                    onValuesChange={handleFormChange}
                    layout="horizontal"
                    size="large"
                    className="edit-staff-form"
                >
                    {/* 基本信息 */}
                    <div className="form-section">
                        <div className="section-title">基本信息</div>
                        <div className="form-row">
                            <div className="form-item-group">
                                <Form.Item label="合同类型" name="contractType">
                                    <Select style={{ width: 180 }} onChange={changecontractType}>
                                        {ctyList.map((item: any, index: number) => (
                                            <Select.Option value={item.id} key={index}>
                                                {item.templateType == 1 ? '定金合同' : '正式合同'}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                            <div className="form-item-group">
                                <Form.Item label="合同编号">
                                    <Input placeholder={'随机生成'}  disabled/>
                                </Form.Item>
                            </div>
                            <div className="form-item-group">
                                <Form.Item label="房屋">
                                    <Select
                                        placeholder="选择房屋"
                                        value={house_id}
                                        disabled={disb}
                                        onChange={changeHouse}
                                        style={{ width: 220 }}
                                    >
                                        <Select.Option value={0}>请选择</Select.Option>
                                        {houseList.map((item, index) => (
                                            <Select.Option value={item.id} key={item.id}>{item.house_name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                            {contractType == 1 && (
                                <div className="form-item-group">
                                    <Form.Item label="签订日期">
                                        <DatePicker onChange={changeDayDate} value={dayjs(dayDate)} style={{ width: 180 }} />
                                    </Form.Item>
                                </div>
                            )}
                            {contractType == 2 && (
                                <div className="form-item-group">
                                    <Form.Item label="租户身份证" name="customCard" rules={[{ required: true }]}>
                                        <Input style={{ width: 220 }} />
                                    </Form.Item>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* 客户 & 单元 */}
                    <div className="form-section">
                        <div className="section-title">客户 & 单元</div>
                        <div className="form-row">
                            <div className="form-item-group">
                                <Form.Item label="客户" name="clientId" rules={[{ required: true }]}>
                                    <Select
                                        showSearch
                                        onChange={changeKehu}
                                        style={{ width: 240 }}
                                        filterOption={(input, option) => {
                                            const item = kehuList.find(unit => unit.id == option?.value);
                                            return item?.custom_name?.toLowerCase().includes(input.toLowerCase());
                                        }}
                                    >
                                        {kehuList.map((item, index) => (
                                            <Select.Option value={item.id} key={item.id}>
                                                {item.custom_name} - {item.custom_phone}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                            <div className="form-item-group">
                                <Form.Item label="单元">
                                    <Select
                                        mode="multiple"
                                        placeholder="选择单元"
                                        disabled={unitStutes}
                                        value={unitarrList}
                                        onChange={changeunit}
                                        showSearch
                                        style={{ width: 500 }}
                                        filterOption={(input, option) => {
                                            const item = unitList.find(unit => unit.id == option?.value);
                                            return item?.unit_name?.toLowerCase().includes(input.toLowerCase());
                                        }}
                                    >
                                        {unitList.map((item: any) => {
                                            const color = item.status === 1 ? 'green' : item.status === 2 ? 'blue' : 'red';
                                            const text = item.status === 1 ? '未租' : item.status === 2 ? '已租' : '退租';
                                            return (
                                                <Select.Option value={item.id} key={item.id}>
                                                    {item.unit_name} <Tag color={color}>{text}</Tag>
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </div>
                            <div className="form-item-group">
                                <Form.Item label="面积">
                                    <InputNumber value={mianji} disabled style={{ width: 140 }} />
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    {/* 费用信息 */}
                    <div className="form-section">
                        <div className="section-title">费用信息</div>
                        <div className="form-row">
                            <div className="form-item-group">
                                <Form.Item label="租金/月(元)">
                                    <div style={{ width: 180 }}>
                                        <InputNumber value={zuMoney} onChange={changeMoney} disabled={disb}/>
                                        {disb?'':<div style={{fontSize:"12px",color:'#555'}}>租金不能低于{minzujin}元</div>}
                                    </div>
                                </Form.Item>
                            </div>

                            <div className="form-item-group">
                                <Form.Item label="押金(元)">
                                    <InputNumber value={deposit} onChange={(e) => setdeposit(e)} style={{ width: 180 }} />
                                </Form.Item>
                            </div>

                            {contractType == 2 && (
                                <>
                                    <div className="form-item-group">
                                        <Form.Item label="管理费(元)">
                                            <InputNumber style={{ width: 180 }} value={manageFee} onChange={(e) => setManageFee(e)} min={0}/>
                                        </Form.Item>
                                    </div>
                                    <div className="form-item-group">
                                        <Form.Item label="管理费押金" name="depositFee">
                                            <InputNumber style={{ width: 180 }} />
                                        </Form.Item>
                                    </div>
                                    <div className="form-item-group">
                                        <Form.Item label="管理费递增%" name="manageFeeRent">
                                            <InputNumber min={0} style={{ width: 180 }} />
                                        </Form.Item>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {contractType == 2 && (
                        <>
                            {/* 经营信息 */}
                            <div className="form-section">
                                <div className="section-title">经营信息</div>
                                <div className="form-row">
                                    <div className="form-item-group">
                                        <Form.Item label="经营主体" name="businessEntity">
                                            <Input style={{ width: 180 }} />
                                        </Form.Item>
                                    </div>
                                    <div className="form-item-group">
                                        <Form.Item label="经营范围" name="businessScope">
                                            <Input style={{ width: 180 }} />
                                        </Form.Item>
                                    </div>
                                    <div className="form-item-group">
                                        <Form.Item label="法定代表人" name="legalPerson">
                                            <Input style={{ width: 160 }} />
                                        </Form.Item>
                                    </div>
                                    <div className="form-item-group">
                                        <Form.Item label="预付费" name="prepayment" rules={[{ required: true }]}>
                                            <InputNumber min={0} style={{ width: 160 }} />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>

                            {/* 交付与派遣 */}
                            <div className="form-section">
                                <div className="section-title">交付与派遣</div>
                                <div className="form-row">
                                    <div className="form-item-group">
                                        <Form.Item label="派遣人" name="dispatchName">
                                            <Input style={{ width: 160 }} />
                                        </Form.Item>
                                    </div>
                                    <div className="form-item-group">
                                        <Form.Item label="派遣人身份证" name="dispatchCard">
                                            <Input style={{ width: 220 }} />
                                        </Form.Item>
                                    </div>
                                    <div className="form-item-group">
                                        <Form.Item label="交付日">
                                            <DatePicker onChange={changedeliveryDate} value={dayjs(deliveryDate)} style={{ width: 180 }} />
                                        </Form.Item>
                                    </div>
                                    <div className="form-item-group">
                                        <Form.Item label="装修费用" name="decorationCost">
                                            <InputNumber style={{ width: 180 }} />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                            {/* 租赁时间 */}
                            <div className="form-section">
                                <div className="section-title">租赁时间</div>
                                {/* ========== 起租日期 靠左 ========== */}
                                <div className="form-row" style={{ justifyContent: 'flex-start' }}>
                                    <div className="form-item-group">
                                        <Form.Item label="起租日期">
                                            <DatePicker.RangePicker onChange={changeData} />
                                        </Form.Item>
                                    </div>
                                </div>
                                {/*租赁时段*/}
                                {formItems.map((item: any, index: any) => (
                                    <div key={item.id} className="form-row">
                                        <div className="form-item-group">
                                            <Form.Item label="租赁时段">
                                                <DatePicker.RangePicker
                                                    disabled
                                                    value={item.beginTime && item.endTime ? [dayjs(item.beginTime), dayjs(item.endTime)] : undefined}
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="form-item-group">
                                            <Form.Item label="递增%">
                                                <InputNumber min={0}  value={item.incremental} onChange={(value) => updatedz(item.id,{incremental:value})} style={{ width: 120 }} />
                                            </Form.Item>
                                        </div>
                                        <span style={{ fontSize: 12, color: '#666', lineHeight: '32px' }}>递增后租金：{item.zuMoney} 元</span>
                                    </div>
                                ))}
                                {/*免租期天数*/}
                                <div className="form-row" style={{ justifyContent: 'flex-start', marginBottom: 12 }}>
                                    <div className="form-item-group">
                                        <Form.Item label={
                                            <div>
                                                <div>免租期天数</div>
                                                <div style={{ fontSize: 12, color: '#888' }}>已选 {summzqDay} 天</div>
                                            </div>
                                        }>
                                            <InputNumber min={0} onChange={(e) => setMzq(e)} value={mzq} style={{ width: 140 }} />
                                        </Form.Item>
                                    </div>
                                    <Button type="primary" onClick={addDzFromItem} icon={<PlusOutlined />} style={{ marginTop: 4 }} />
                                </div>
                                {/*免租期日期*/}
                                {mzformItems.map((item: any, index: any) => (
                                    <div key={item.id} className="form-row" style={{ marginBottom: 8 }}>
                                        <div className="form-item-group">
                                            <Form.Item label="免租期">
                                                <DatePicker.RangePicker
                                                    disabledDate={disabledDate1}
                                                    value={item.rentBeginTime && item.rentEndTime ? [dayjs(item.rentBeginTime), dayjs(item.rentEndTime)] : undefined}
                                                    onChange={(_, dates) => updatemz(item.id, { rentBeginTime: dates[0], rentEndTime: dates[1] })}
                                                />
                                            </Form.Item>
                                        </div>
                                        <Button type="link" danger onClick={() => removedzFormItemByKey(item.id)}>删除</Button>
                                    </div>
                                ))}
                                {/*管理费*/}
                                <div className="form-row" style={{ justifyContent: 'flex-start', marginBottom: 12 }}>
                                    <div className="form-item-group">
                                        <Form.Item label={
                                            <>
                                                <div>管理费</div>
                                                <Button type="primary" onClick={addManageFeeFromItem} icon={<PlusOutlined />} style={{ marginTop: 4 }} />
                                            </>
                                        }>
                                        </Form.Item>
                                    </div>
                                </div>
                                {/*管理费列表*/}
                                {manageFeeList.map((item: any, index: any) => (
                                    <div key={index} className="form-row" style={{ marginBottom: 8 }}>
                                        <div className="form-item-group">
                                            <Form.Item label="递增时段">
                                                <DatePicker.RangePicker
                                                    value={item.beginTime && item.endTime ? [dayjs(item.beginTime), dayjs(item.endTime)] : undefined}
                                                    onChange={(_, dates) => upManageFee(item.id, { beginTime: dates[0], endTime: dates[1] })}
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="form-item-group">
                                            <Form.Item label="递增%">
                                                <InputNumber min={0} value={item.incremental} onChange={(value) => managedz(item.id,{incremental:value})} style={{ width: 120 }} />
                                            </Form.Item>
                                            <span style={{ fontSize: 12, color: '#666', lineHeight: '32px' }}>递增后管理费：{item.manageFee}元</span>
                                        </div>
                                        <Button type="link" danger onClick={() => removedManageFeeFormItemByKey(item.id)}>删除</Button>
                                    </div>
                                ))}
                            </div>
                            {/* 图片上传 */}
                            <div className="form-section">
                                <div className="section-title">合同附件上传</div>
                                <div className="image-row">
                                    <div className="image-upload-group">
                                        <div className="group-title">单元平面图</div>
                                        <NoyasuoImgCmp onImageUpload={getunitImgName} oldBase64={getunitB64} />
                                        <div className="image-preview-list">
                                            {unitB64.map((item: any, index: number) => (
                                                <div className="image-item" key={index}>
                                                    <Image src={item} className="preview-img" />
                                                    <Button danger size="small" className="delete-btn" onClick={() => handleDeleteunitImg(index)}>删</Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="image-upload-group">
                                        <div className="group-title">租户证件图片</div>
                                        <NoyasuoImgCmp onImageUpload={oldImgName} oldBase64={onB64} />
                                        <div className="image-preview-list">
                                            {b64.map((item: any, index: number) => (
                                                <div className="image-item" key={index}>
                                                    <Image src={item} className="preview-img" />
                                                    <Button danger size="small" className="delete-btn" onClick={() => handleDeletezuhu(index)}>删</Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="image-upload-group">
                                        <div className="group-title">补充协议图片</div>
                                        <NoyasuoImgCmp onImageUpload={imgNames} oldBase64={xyB64} />
                                        <div className="image-preview-list">
                                            {xyimgb64.map((item: any, index: number) => (
                                                <div className="image-item" key={index}>
                                                    <Image src={item} className="preview-img" />
                                                    <Button danger size="small" className="delete-btn" onClick={() => handleDelete(index)}>删</Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 物品清单 */}
                            <div className="form-section">
                                <div className="section-title">物品清单</div>
                                <Button type="primary" onClick={addwuping} style={{ marginBottom: 12 }}>新增物品</Button>
                                {wupinList.map((item: any, index: any) => (
                                    <div key={index} className="form-row">
                                        <div className="form-item-group">
                                            <Form.Item label="物品名称">
                                                <Input value={item.wupinName} onChange={(e) => updateName(item.key, { wupinName: e.target.value })} style={{ width: 160 }} />
                                            </Form.Item>
                                        </div>
                                        <div className="form-item-group">
                                            <Form.Item label="交付标准">
                                                <Input value={item.wupininfo} onChange={(e) => updatebiaozhun(item.key, { wupininfo: e.target.value })} style={{ width: 160 }} />
                                            </Form.Item>
                                        </div>
                                        <div className="form-item-group">
                                            <Form.Item label="数量">
                                                <Input value={item.wupinNuber} onChange={(e) => updateMiber(item.key, { wupinNuber: e.target.value })} style={{ width: 100 }} />
                                            </Form.Item>
                                        </div>
                                        <Button type="link" danger onClick={() => removeqingdan(item.key)}>删除</Button>
                                    </div>
                                ))}
                            </div>

                            {/* 补充协议 */}
                            <div className="form-section">
                                <div className="section-title">补充协议</div>
                                <div className="form-item-group">
                                    <Form.Item label="补充协议">
                                        <Input.TextArea value={remark} onChange={changeremark} rows={4} style={{ width: 500, maxWidth: '100%' }} />
                                    </Form.Item>
                                </div>
                            </div>
                        </>
                    )}
                    {/* 按钮 */}
                    <Form.Item style={{ textAlign: 'center', marginTop: 32 }}>
                        <Space size="large">
                            <Button type="primary" htmlType="submit" size="large">保存草稿</Button>
                            <Button type="primary" size="large" danger onClick={() => form.validateFields().then((values) => onFinish(values, 5))}>直接送审</Button>
                            <Button onClick={onLikai} size="large">返回列表</Button>
                            <Button danger onClick={resetAllFormData} size="large">清空草稿</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckCompanyList: state.CheckCompany.list,
        UnitList: state.Unit.list,
    }
};
export default connect(mapStateToProps) (AddStaff)