import {useEffect, useRef, useState} from "react";
import {
    calculateTotalRentalDays,
    contractsDz,
    filterAndUpdateList, glmanageDz,
    replaceEnglishCommasWithChinese
} from "@/utils/OpenTool";
import * as StaffServer from "@/services/staff";
import {connect,history} from "umi";
import {Button, DatePicker, Form, Image, Input, InputNumber, message, Select, Space, Spin, Tag} from "antd";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as contractTypeListServer from "@/services/contractTypeList";
import * as UnitService from "@/services/unit";
import * as CheckCompanyService from "@/services/checkCompany";
import NoyasuoImgCmp from "@/components/NoyasuoImgCmp";
import '../enter/staff.less';

const contracteInfo=(props:any)=>{
    const formRef=useRef();
    const [formItems, setFormItems] = useState([]);
    const [spinning, setspinning] = useState(false);
    // 客户列表
    const [kehuList,setKehuList]=useState([]);
    // 单元列表
    const [unitList,setUnitList]=useState([]);
    // 补充协议
    const [remark,setremark]=useState('');
    // 开始时间
    const [startDate,setStartDate]=useState('');
    // 结束时间
    const [endDate,setEndDate]=useState('');
    // 路由参数
    const [uid,setUid]=useState('');
    // 交付日
    const [deliveryDate,setDeliveryDate]=useState('2000-01-01');
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
    const [unitB64,setuintB64]=useState([]);
    // 合同类型ID
    const [contractType,setcontractType]=useState(2);
    // 合同类型列表
    const [ctyList,setCtyList]=useState([]);
    // 合同类型列表ID
    const [contractTypeid,setcontractTypeid]=useState(0);
    // 房屋列表
    const [houseList,sethouseList]=useState([]);
    // 免租期天数
    const [mzq,setMzq]=useState(0);
    // 物品清单
    const [wupinList, setwupinList] = useState([
        { key: 1,wupinName:null,wupininfo:null,wupinNuber:0},
    ]);
    // 勾选的单元id数组
    const [unitarrList,setUnitarrList]=useState([]);
    // 免租期
    const [mzformItems,setmzFormItems]=useState([]);
    // 最小租金
    const [minzujin,setminzujin]=useState(0);
    // 房屋id
    const [house_id,sethouse_id]=useState(0);
    // 面积
    const [mianji,setmianji]=useState(0);
    // 租金
    const [zuMoney,setzuMoney]=useState(0);
    // 管理费列表
    const [manageFeeList,setManageFeeList]=useState([]);
    const [deposit,setdeposit]=useState(0);
    // 管理费
    const [manageFee,setManageFee]=useState(0);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getCtyList();
        getCheckCompanyList();
        getOneStaff(id);
        getHouseList();
    }, []);
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
    const getOneStaff= (id:string)=>{
        setspinning(true);
        StaffServer.one(id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setdeposit(res.Data.deposit);
                formRef.current.setFieldsValue(res.Data);
                setEndDate(dayjs(res.Data.endTime).format('YYYY-MM-DD'));
                setStartDate(dayjs(res.Data.beginTime).format('YYYY-MM-DD'));
                let mzFrom=forEachArr(res.Data.contractDzList);
                setFormItems(contractsDz(res.Data.zuMoney,mzFrom));
                setmzFormItems(forEachArr(res.Data.contractRentList));
                setUnitarrList(res.Data.unitList.map(item=>item.id));
                setzuMoney(res.Data.zuMoney);
                sethouse_id(res.Data.houseId);
                getUnitList(res.Data.houseId);
                let documentBase64Split=res.Data.documentBase64.split('|')
                setB64(documentBase64Split);
                let unitBase64Split=res.Data.unitBase64.split('|');
                setuintB64(unitBase64Split);
                let documentImagesplit=res.Data.documentImage.split('|');
                setImgName(documentImagesplit);
                setremark(res.Data.remark);
                setManageFee(res.Data.manageFee);
                setManageFeeList(glmanageDz(res.Data.manageFee,res.Data.manageFeeList));
                let unitImageSplit=res.Data.unitImage.split('|')
                setunitImgName(unitImageSplit);
                setDeliveryDate(res.Data.deliveryDate);
                let jsonList=JSON.parse(res.Data.goodsJson);
                setwupinList(jsonList);
                let joinImageB64=res.Data.addBase64.split('|');
                setxyimgb64(joinImageB64);
                let joinImageName=res.Data.addImage.split('|');
                setxyimgnames(joinImageName);
                setcontractTypeid(res.Data.contractType);
                let mzqSum=calculateTotalRentalDays(res.Data.contractRentList);
                setMzq(mzqSum);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        });
    };
    // 遍历数组，转成为时间等于等于初始时间就为null
    const forEachArr=(arr:any)=>{
        let returearr=arr.map(item => ({
            ...item,  // 保留原数据
            rentBeginTime: item.rentBeginTime === "0001-01-01T00:00:00" ? null : item.rentBeginTime,
            rentEndTime: item.rentEndTime === "0001-01-01T00:00:00" ? null : item.rentEndTime
        }))
        return returearr
    };
    // 筛选过滤掉的租金跟面积
    const filterzuArea=(item:any)=>{
        const filteredHouses = unitList.filter(house => item.includes(house.id));
        const totalPrice = filteredHouses.reduce((accumulator, currentHouse) => accumulator + currentHouse.price, 0);
        const totalrentable_area = filteredHouses.reduce((accumulator, currentHouse) => accumulator + currentHouse.rentable_area, 0);
        setminzujin(totalPrice);
        setmianji(totalrentable_area);
    };
    // 获取单元列表
    const getUnitList=(e)=>{
        UnitService.stutesUnit({house_id:e}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setUnitList(res.Data);
            }else {
                message.error(res.Data)
            }
        })
    };
    // 获取客户列表

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

    // 获取当前时间
    const getCurrentDate=()=>{
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`
    };

    // 更新免租期
    const updatemz = (key, updates) => {
        setFormItems(prevItems => prevItems.map(item => item.id === key ? { ...item, ...updates } : item));
    };
    // 更新递增
    const updatedz = (key, updates) => {
        setFormItems(prevItems => prevItems.map(item => item.id === key ? { ...item, ...updates } : item));
    };
    // 添加新表单项
    const addFormItem = () => {
        const newKey = formItems.length ? Math.max(...formItems.map(item => item.id)) + 1 : 1;
        setFormItems([...formItems, { id: newKey, beginTime: getCurrentDate(), endTime: getCurrentDate(), rentBeginTime: getCurrentDate(),rentEndTime:getCurrentDate(), incremental:0}]);
    };
    // 删除表单项
    const removeFormItemByKey = key => {
        setFormItems(prevItems => prevItems.filter(item => item.id !== key));
    };
    // 删除物品表单项
    const removeqingdan = key => {
        setwupinList(prevItems => prevItems.filter(item => item.key !== key));
    };
    // 租户证件图片名字
    const oldImgName=(e:string)=>{
        // setImgName(e);
        setImgName((prevItems=>[...prevItems,e]))
    };
    // 租户证件图片B64
    const onB64=(e:string)=>{
        // setB64(e);
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
        // setunitImgName(e);
        setunitImgName((prevItems=>[...prevItems,e]))
    };
    // 单元图片B64
    const getunitB64=(e:string)=>{
        // setuintB64(e);
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
    // 交付日
    const changedeliveryDate=(_:any,item:any)=>{
        setDeliveryDate(item);
    };
    // 修改物品清单的数量
    const updateMiber=(key, updates)=>{
        setwupinList(prevItems => prevItems.map(item => item.key === key ? { ...item, ...updates } : item));
    };
    // 修改物品清单的标准
    const updatebiaozhun=(key, updates)=>{
        setwupinList(prevItems => prevItems.map(item => item.key === key ? { ...item, ...updates } : item));
    };
    // 修改物品清单的名称
    const updateName=(key, updates)=>{
        setwupinList(prevItems => prevItems.map(item => item.key === key ? { ...item, ...updates } : item));
    };
    // 添加物品表单项
    const addwuping = () => {
        const newKey = wupinList.length ? Math.max(...wupinList.map(item => item.key)) + 1 : 1;
        setwupinList([...wupinList, { key: newKey,wupinName: null,wupininfo: null,wupinNuber: 0}]);
    };
    // 补充协议图片名字
    const imgNames=(e:string)=>{
        setxyimgnames((prevItems=>[...prevItems,e]))
    };
    // 补充协议图片
    const xyB64=(e:string)=>{
        setxyimgb64((prevItems=>[...prevItems,e]))
    };
    // 删除补充协议
    const handleDelete=(index:number)=>{
        const newImages = [...xyimgnames];
        newImages.splice(index, 1);
        setxyimgnames(newImages);
        const newB64 = [...xyimgb64];
        newB64.splice(index, 1);
        setxyimgb64(newB64);
    };
    const changeremark=(e)=>{
        let a=replaceEnglishCommasWithChinese(e.target.value);
        setremark(a);
    };
    // 离开当前页面
    const onLikai=()=>{
        // history.push('/enter/staff/');
        window.history.back();
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
    useEffect(() => {
        filterzuArea(unitarrList);
    }, [unitList]);
    return(
        <Spin spinning={spinning}>
            <div className="edit-staff-form-container">
                <Form
                    ref={formRef}
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
                                    <Select disabled style={{ width: 180 }}>
                                        {ctyList.map((item: any, index: number) => (
                                            <Select.Option value={item.id} key={index}>
                                                {item.templateType == 1 ? '定金合同' : '正式合同'}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>

                            <div className="form-item-group">
                                <Form.Item label="合同编号" name="identifier" rules={[{ required: true, message: '请输入合同编号' }]}>
                                    <Input style={{ width: 180 }} />
                                </Form.Item>
                            </div>

                            <div className="form-item-group">
                                <Form.Item label="房屋">
                                    <Select
                                        placeholder="选择房屋"
                                        value={house_id}
                                        style={{ width: 220 }}
                                    >
                                        <Select.Option value={0}>请选择</Select.Option>
                                        {houseList.map((item, index) => (
                                            <Select.Option value={item.id} key={index}>{item.house_name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>

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
                                        style={{ width: 240 }}
                                        filterOption={(input, option) => {
                                            const item = kehuList.find(unit => unit.id == option?.value);
                                            return item?.custom_name?.toLowerCase().includes(input.toLowerCase());
                                        }}
                                    >
                                        {kehuList.map((item, index) => (
                                            <Select.Option value={item.id} key={index}>
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
                                        value={unitarrList}
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
                                        <InputNumber value={zuMoney} disabled style={{ width: '100%' }} />
                                        <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>最低 {minzujin} 元</div>
                                    </div>
                                </Form.Item>
                            </div>

                            <div className="form-item-group">
                                <Form.Item label="押金(元)">
                                    <InputNumber value={deposit}  disabled style={{ width: 180 }} />
                                </Form.Item>
                            </div>

                            {contractType == 2 && (
                                <>
                                    <div className="form-item-group">
                                        <Form.Item label="管理费(元)">
                                            <InputNumber style={{ width: 180 }} value={manageFee}  min={0}/>
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
                                            <DatePicker.RangePicker value={[dayjs(startDate), dayjs(endDate)]} />
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
                                            </div>
                                        }>
                                            {
                                                mzq==0?'免租期0天':<InputNumber min={0}  value={mzq} style={{ width: 140 }} />
                                            }
                                        </Form.Item>
                                    </div>
                                </div>
                                {/*免租期日期*/}
                                {mzformItems.map((item: any, index: any) => (
                                    <div key={index} className="form-row" style={{ marginBottom: 8 }}>
                                        <div className="form-item-group">
                                            <Form.Item label="免租期">
                                                <DatePicker.RangePicker
                                                    value={item.rentBeginTime && item.rentEndTime ? [dayjs(item.rentBeginTime), dayjs(item.rentEndTime)] : undefined}
                                                    onChange={(_, dates) => updatemz(item.id, { rentBeginTime: dates[0], rentEndTime: dates[1] })}
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                ))}
                                {/*管理费*/}
                                <div className="form-row" style={{ justifyContent: 'flex-start', marginBottom: 12 }}>
                                    <div className="form-item-group">
                                        <Form.Item label={
                                            <>
                                                <div>管理费</div>
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
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="form-item-group">
                                            <Form.Item label="递增%">
                                                <InputNumber min={0} value={item.incremental}  style={{ width: 120 }} />
                                            </Form.Item>
                                            <span style={{ fontSize: 12, color: '#666', lineHeight: '32px' }}>递增后管理费：{item.manageFee}元</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* 图片上传 */}
                            <div className="form-section">
                                <div className="section-title">合同附件上传</div>
                                <div className="image-row">
                                    <div className="image-upload-group">
                                        <div className="group-title">单元平面图</div>
                                        <div className="image-preview-list">
                                            {unitB64.map((item: any, index: number) => (
                                                <div className="image-item" key={index}>
                                                    <Image src={item} className="preview-img" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="image-upload-group">
                                        <div className="group-title">租户证件图片</div>
                                        <div className="image-preview-list">
                                            {b64.map((item: any, index: number) => (
                                                <div className="image-item" key={index}>
                                                    <Image src={item} className="preview-img" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="image-upload-group">
                                        <div className="group-title">补充协议图片</div>
                                        <div className="image-preview-list">
                                            {xyimgb64.map((item: any, index: number) => (
                                                <div className="image-item" key={index}>
                                                    <Image src={item} className="preview-img" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 物品清单 */}
                            <div className="form-section">
                                <div className="section-title">物品清单</div>
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
                                    </div>
                                ))}
                            </div>

                            {/* 补充协议 */}
                            <div className="form-section">
                                <div className="section-title">补充协议</div>
                                <div className="form-item-group">
                                    <Form.Item label="补充协议" name="remark">
                                        <Input.TextArea value={remark} onChange={changeremark} rows={4} style={{ width: 500, maxWidth: '100%' }} />
                                    </Form.Item>
                                </div>
                            </div>
                        </>
                    )}
                    {/* 按钮 */}
                    <Form.Item style={{ textAlign: 'center', marginTop: 32 }}>
                        <Space size="large">
                            <Button onClick={onLikai} size="large">返回列表</Button>
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
export default  connect(mapStateToProps) (contracteInfo)