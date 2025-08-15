import {useEffect, useRef, useState} from "react";
import * as ZuhuServer from "@/services/zuhu";
import dayjs from "dayjs";
import {connect,history} from "umi";
import {Button, DatePicker, Form, Input, InputNumber, Select, Radio, message, Spin, Space, Modal, Tabs} from "antd";
import {filterAndUpdateList, phonePattern} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as ByStagesService from '@/services/byStages';
import * as CableService from '@/services/cable';
import Byele from "@/pages/kehu/byele";
import Bymoney from "@/pages/kehu/bymoney";
import Byappuser from "@/pages/kehu/byappuser";
import Bywater from "@/pages/kehu/bywater";
import Byitem from "@/pages/kehu/byitem";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
import {StaticInfo} from '@/StaticInfo'
const filteredArray =(e,cableList)=>{
    return  e.length === 0 ? [] : cableList.filter(item => e.includes(item.id));
};
const filteredWaterArray =(e,watertList)=>{
    return  e.length === 0 ? [] : watertList.filter(item => e.includes(item.id));
};
const Byzhuhu=(props:any)=>{
    // 路由参数
    const [uid,setUid]=useState('0');
    // 电表弹窗可见性
    const [isModalVisible, setIsModalVisible] = useState(false);
    // 电弹窗标题
    const [modalTitle, setModalTitle] = useState('');
    // 水表弹窗可见性
    const [waterisModalVisible, setwaterisModalVisible] = useState(false);
    // 水弹窗标题
    const [watermodalTitle, setwatermodalTitle] = useState('');
    const formRef=useRef();
    // 转圈
    const [isSpinning,setIsSpinning]=useState(false);
    // 房屋id
    const [unit_idz,setUnit_id]=useState([]);
    // 初始电表id,不会被修改
    const [yuanshielectricity_idz,setyuanshielectricity_idz]=useState([]);
    // 原始电表id
    const [electricity_idz,setElectricity_id]=useState([]);
    // 预留金额
    const [reserved_amount,setreserved_amount]=useState(0);
    // 警告金额
    const [warn_amount,setwarn_amount]=useState(0);
    // 初始水表id,不会被修改
    const [yuanshiWtertctricity_idz,setyuanshiWtertctricity_idz]=useState([]);
    // 原始水表id
    const [water_idz,setWater_id]=useState([]);
    // 收费项目id
    const [item_idz,setItem_idz]=useState([]);
    // 电表填写度数
    const [eleList,setEleList]=useState([]);
    // 水表填写度数
    const [elewaterList,setelewaterList]=useState([]);
    // 电表列表
    const [cableList,setCableList]=useState([]);
    // 水表列表
    const [watertList,setWatertList]=useState([]);
    // 临时存放取消已关联电表的id
    const [temporaryEle,settemporaryEle]=useState([]);
    // 临时存放电表的id与度数
    const [diandushuandID,setdiandushuandID]=useState([]);
    // 删除的电表添加到电表新数组上面
    const [deleArr,setdeleArr]=useState([]);
    // 临时存放水表的id与度数
    const [shuidushuandID,setshuidushuandID]=useState([]);
    // 临时存放取消已关联水表的id
    const [temporaryWater,settemporaryWater]=useState([]);
    // 删除的水表添加到水表新数组上面
    const [delewaterArr,setdelewaterArr]=useState([]);
    // 租户金额
    const [tenantAmount,settenantAmount]=useState(0);
    // 最低充值金额
    const [minimum_recharge,setminimum_recharge]=useState(100);
    const [uqx,setUqx]=useState([]);
    const getOneCustom=async (id:string)=>{
        let res:any=await  ZuhuServer.one(id);
        if (res.ErrorCode==0){
            let data=res.Data;
            formRef.current.setFieldsValue(data[0]);
            settenantAmount(data[0].tenantAmount);
            setminimum_recharge(data[0].minimum_recharge);
            setreserved_amount(data[0].reserved_amount);
            setwarn_amount(data[0].warn_amount);
            let mapUnitList=data[1].map((item:any)=>{
                return item.id
            })
            setUnit_id(mapUnitList);
            let mapElectricity_id=data[2].map((item:any)=>{
                return item.id
            })
            setEleList(data[2]);
            setElectricity_id(mapElectricity_id);
            setyuanshielectricity_idz(mapElectricity_id);
            let mapWater_id=data[3].map((item:any)=>{
                return item.id
            });
            setelewaterList(data[3]);
            setWater_id(mapWater_id);
            setyuanshiWtertctricity_idz(mapWater_id);
            let mapItem_idz=data[4].map((item:any)=>{
                return item.id
            });
            setItem_idz(mapItem_idz);
            let newArr=data[4].map((item:any)=>{
                return item.id
            });
            setItem_idz(newArr)
            // if (newArr.length<1){
            //     setItem_idz([0]);
            // }else {
            //     setItem_idz(newArr);
            // }
        }else {
            message.error(res.Data);
        }
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneCustom(id);
        // getWatertList();
        // getCableList();
        // getGongsiList();
        // getUnitList();
    },[]);
    // useEffect(() => {
    // }, [temporaryEle,diandushuandID]);
    const onFinish=(valus:any)=>{
        let unit_id=unit_idz.join('|');
        // let item_id=item_idz.join('|');
        setIsSpinning(true);
        props.dispatch({
            type:'Zuhu/byzhuhu',
            // payload:{...valus,uid,unit_id,item_id,reserved_amount,warn_amount,tenantAmount}
            payload:{...valus,uid,unit_id,reserved_amount,warn_amount,tenantAmount}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('绑定成功');
                history.push('/kehu/zuhuguanlian');
                setIsSpinning(false);
            }else {
                setIsSpinning(false);
                message.error(res.Data);
            }
        })
    };
    // 绑定收费项目
    const okItemID=()=>{
        setIsSpinning(true);
        let item_id=item_idz.join('|');
        ByStagesService.byItem({uid,item_id}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('绑定收费项目成功');
                getOneCustom(uid);
                setIsSpinning(false);
            }else {
                message.error(res.Data);
                getOneCustom(uid);
                setIsSpinning(false);
            }
        })
    };
    // 获取水表列表
    const getWatertList=()=>{
        props.dispatch({
            type:'Watert/fetch'
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setWatertList(res.Data);
            }
        })
    };
    // 获取电表列表
    const getCableList=()=>{
        CableService.cableList({remark:''}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log("电表管理",res);
                setCableList(res.Data);
            }else {
                message.error(res.Data)
            }
        })
    };
    // 获取收费项目列表
    const getGongsiList=()=>{
        props.dispatch({
            type:'Gongsi/fetch'
        })
    };
    // 获取单元列表
    const getUnitList=()=>{
        props.dispatch({
            type:'Unit/fetch'
        })
    };
    // 电表弹窗的取消按钮点击事件
    const handleCancel = () => {
        setIsModalVisible(false);
        settemporaryEle([]);
        setdiandushuandID([]);
    };
    // 水表弹窗的取消按钮点击事件
    const handleWatertCancel = () => {
        setwaterisModalVisible(false);
        settemporaryWater([]);
        setshuidushuandID([]);
    };
    // 电表弹窗的确定按钮点击事件
    const handleOk = () => {
        const newElectricity_idz = electricity_idz.filter(id => !temporaryEle.includes(id));
        setElectricity_id(newElectricity_idz);
        let arr=filteredArray(newElectricity_idz,cableList);
        setEleList(arr);
        setdeleArr([...diandushuandID,...deleArr]);
        settemporaryEle([]);
        setdiandushuandID([]);
        setIsModalVisible(false);
    };
    // 监听电表关联
    const changeEle = (newSelectedIds) => {
        const removedValues = electricity_idz.filter(val => !newSelectedIds.includes(val));
        // 检查是否有被取消勾选的ID在默认数组中
        const hasDefaultDeselected = removedValues.some(id => yuanshielectricity_idz.includes(id));
        if (hasDefaultDeselected) {
            // 如果有，显示弹窗
            const deselectedId = removedValues[0];
            settemporaryEle(removedValues);
            const defaultItem = eleList.find(id => id.id === deselectedId);
            setdiandushuandID([defaultItem]);
            setModalTitle('确认删除');
            setIsModalVisible(true);
        } else {
            // 如果没有，直接更新状态
            setElectricity_id(newSelectedIds);
            let arr=filteredArray(newSelectedIds,cableList);
            setEleList(arr);
        }
    };
    // 监听水表
    const changeWater=(newSelectedIds)=>{
        // 选择的时候找出当前下拉选择的数组，是否包含在原数组
        const removedValues = water_idz.filter(val => !newSelectedIds.includes(val));
        // 检查是否有被取消勾选的ID在默认数组中
        const hasDefaultDeselected = removedValues.some(id => yuanshiWtertctricity_idz.includes(id));
        if (hasDefaultDeselected) {
            // 如果有，显示弹窗
            const deselectedId = removedValues[0];
            settemporaryWater(removedValues);
            const defaultItem = watertList.find(id => id.id === deselectedId);
            setshuidushuandID([defaultItem]);
            setwatermodalTitle('确认删除');
            setwaterisModalVisible(true);
        } else {
            // 如果没有，直接更新状态
            setWater_id(newSelectedIds);
            let arr=filteredWaterArray(newSelectedIds,watertList);
            setelewaterList(arr);
        }
    };
    //水表弹窗确定点击事件
    const waterhandleOk=()=>{
        const newElectricity_idz = water_idz.filter(id => !temporaryWater.includes(id));
        setWater_id(newElectricity_idz);
        let arr=filteredWaterArray(newElectricity_idz,watertList);
        setelewaterList(arr);
        setdelewaterArr([...shuidushuandID,...delewaterArr]);
        settemporaryWater([]);
        setshuidushuandID([]);
        setwaterisModalVisible(false);
    };

    // 监听收费项目
    const changeitem=(e)=>{
        setItem_idz(e);
    };
    // 确定关联电表
    const onguandiandian=()=>{
        const idsToRemove = {};
        eleList.forEach(item => {
            idsToRemove[item.id] = true;
        });
        const filteredList2 = deleArr.filter(item => !idsToRemove[item.id]);
        const addEle = eleList.map(item => ({
            id: item.id,
            c0: item.c0
        }));
        let delEle=filteredList2.map(item => ({
            id: item.id,
            c0: item.c0
        }));
        let obj={addEle,delEle}
        let jsondata=JSON.stringify(obj);
        ByStagesService.bydian(uid,jsondata).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
               if (res.Data.length>0){
                   setEleList([]);
                   setdeleArr([]);
                   message.warning(`其余电表关联成功，${res.Data.map(item=>item)}电表有未交费用`);
                   getOneCustom(uid);
               }else {
                   setEleList([]);
                   setdeleArr([]);
                   message.success('绑定成功');
                   getOneCustom(uid);
               }
            }else {
                setEleList([]);
                setdeleArr([]);
                message.error(res.Data);
                getOneCustom(uid);
            }
        })
    };
    // 确定关联水表
    const onguandianshui=()=>{
        const idsToRemove = {};
        elewaterList.forEach(item => {
            idsToRemove[item.id] = true;
        });
        const filteredList2 = delewaterArr.filter(item => !idsToRemove[item.id]);
        const addWater = elewaterList.map(item => ({
            id: item.id,
            total_used_amount: item.total_used_amount
        }));
        let delWater=filteredList2.map(item => ({
            id: item.id,
            total_used_amount: item.total_used_amount
        }));
        let obj={addWater,delWater}
        let jsondata=JSON.stringify(obj);
        console.log('水表数据',jsondata);
        ByStagesService.byshui(uid,jsondata).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setelewaterList([]);
                setdelewaterArr([]);
                message.success('绑定水表成功');
                getOneCustom(uid);
            }else {
                message.error(res.Data);
                setelewaterList([]);
                setdelewaterArr([]);
                getOneCustom(uid);
            }
        })
    };
    // 监听电表弹窗的输入的电表度数参数
    const changeelectricity = (newValue, id) => {
        setEleList(prevItems => prevItems.map(item =>
            item.id === id ? { ...item, c0: newValue } : item
        ));
    };
    // 监听水表弹窗的输入的电表度数参数
    const changewater_idz=(newValue, id)=>{
        setelewaterList(prevItems => prevItems.map(item =>
            item.id === id ? { ...item, total_used_amount: newValue } : item
        ));
    };
    // 弹窗输入电表的度数
    const updateC0 = (id, newValue) => {
        // 创建一个新数组，通过映射旧数组并更新指定对象的 c0 值
        const updatedArray = diandushuandID.map(item =>
            item.id === id ? { ...item, c0: newValue } : item
        );
        // 更新状态
        setdiandushuandID(updatedArray);
    };
    // 弹窗输入水表的度数
    const updatewaterC0 = (id, newValue) => {
        // 创建一个新数组，通过映射旧数组并更新指定对象的 c0 值
        const updatedArray = shuidushuandID.map(item =>
            item.id === id ? { ...item, total_used_amount: newValue } : item
        );
        // 更新状态
        setshuidushuandID(updatedArray);
    };
    // 修改最低充值
    const byRearge=()=>{
        props.dispatch({
            type:'Zuhu/editAbloue',
            payload:{uid,minimum_recharge}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                getOneCustom(uid);
            }else {
                message.error('修改失败');
                getOneCustom(uid);
            }
        })
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    return(
        <Spin spinning={isSpinning}>
            <Tabs>
                {uqx[254]=='1'?<Tabs.TabPane tab='修改最低充值' key='1'>
                    <Bymoney id={uid}/>
                </Tabs.TabPane>:''
                }
                {uqx[351]=='1'?<Tabs.TabPane tab='绑定小程序' key='2'>
                    <Byappuser id={uid}/>
                </Tabs.TabPane>:''
                }
                {uqx[352]=='1'? <Tabs.TabPane tab='绑定电表' key='3'>
                    <Byele id={uid}/>
                </Tabs.TabPane>:''
                }
                {uqx[353]=='1'?   <Tabs.TabPane tab='绑定水表' key='4'>
                    <Bywater id={uid}/>
                </Tabs.TabPane>:''
                }
                {uqx[354]=='1'?  <Tabs.TabPane tab='绑定公共缴费' key='5'>
                    <Byitem id={uid}/>
                </Tabs.TabPane>:''
                }

            </Tabs>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                initialValues={{reamrk:'',minimum_recharge:1}}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
            {/*    /!*<Form.Item label='单元'>*!/*/}
            {/*    /!*    <Select  mode="multiple" disabled value={unit_idz} onChange={changeUint}>*!/*/}
            {/*    /!*        <Select.Option value={0} key="no-unit-associated">*!/*/}
            {/*    /!*            暂不关联*!/*/}
            {/*    /!*        </Select.Option>*!/*/}
            {/*    /!*        {props.UnitList?props.UnitList.map((item:any,index:any)=>{*!/*/}
            {/*    /!*            return(*!/*/}
            {/*    /!*                <Select.Option value={item.id} key={index}>*!/*/}
            {/*    /!*                    {item.unit_name}*!/*/}
            {/*    /!*                </Select.Option>*!/*/}
            {/*    /!*            )*!/*/}
            {/*    /!*        }):''}*!/*/}
            {/*    /!*    </Select>*!/*/}
            {/*    /!*</Form.Item>*!/*/}
            {/*    /!*<Form.Item label='合同'>*!/*/}
            {/*    /!*    <Select>*!/*/}
            {/*    /!*        <Select.Option value={0} key="no-unit-associated">*!/*/}
            {/*    /!*            暂不关联*!/*/}
            {/*    /!*        </Select.Option>*!/*/}
            {/*    /!*    </Select>*!/*/}
            {/*    /!*</Form.Item>*!/*/}
            {/*    <Form.Item label='电表'>*/}
            {/*        <Select*/}
            {/*            mode="multiple"*/}
            {/*            value={electricity_idz}*/}
            {/*            onChange={changeEle}*/}
            {/*            placeholder='选填'*/}
            {/*            showSearch*/}
            {/*            optionFilterProp="children"*/}
            {/*            filterOption={(input, option) => {*/}
            {/*                // 假设每个 option 都有一个与数据项对应的 value 属性*/}
            {/*                const item = cableList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程*/}
            {/*                return item?.remark?.toLowerCase().includes(input.toLowerCase());*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            {cableList.map((item:any,index:any)=>{*/}
            {/*                return(*/}
            {/*                    <Select.Option value={item.id} key={item.id}>*/}
            {/*                        {item.remark}-{item.tenant_name}*/}
            {/*                    </Select.Option>*/}
            {/*                )*/}
            {/*            })}*/}
            {/*        </Select>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item {...tailLayout}>*/}
            {/*        <Space style={{display:'flex',flexWrap:'wrap'}}>*/}
            {/*            {*/}
            {/*                eleList.map((item:any,index:number)=>{*/}
            {/*                    return(*/}
            {/*                        <div  key={index}>*/}
            {/*                            <span>{item.remark}</span>--*/}
            {/*                            <span>*/}
            {/*                                当前用电量:<InputNumber value={item.c0} style={{width:'100px'}} onChange={(e)=>changeelectricity(e,item.id)}/>*/}
            {/*                            </span>*/}
            {/*                        </div>*/}
            {/*                    )*/}
            {/*                })*/}
            {/*            }*/}
            {/*        </Space>*/}
            {/*        <Button type='primary' onClick={onguandiandian}>确定关联电表</Button>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item label='水表'>*/}
            {/*        <Select*/}
            {/*            mode="multiple"*/}
            {/*            value={water_idz}*/}
            {/*            onChange={changeWater}*/}
            {/*            placeholder='选填'*/}
            {/*            showSearch*/}
            {/*            optionFilterProp="children"*/}
            {/*            filterOption={(input, option) => {*/}
            {/*                // 假设每个 option 都有一个与数据项对应的 value 属性*/}
            {/*                const item = watertList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程*/}
            {/*                return item?.remark?.toLowerCase().includes(input.toLowerCase());*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            {watertList.map((item:any,index:any)=>{*/}
            {/*                return(*/}
            {/*                    <Select.Option value={item.id} key={item.id}>*/}
            {/*                        {item.remark}-{item.tenant_name}*/}
            {/*                    </Select.Option>*/}
            {/*                )*/}
            {/*            })}*/}
            {/*        </Select>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item {...tailLayout}>*/}
            {/*        <Space style={{display:'flex',flexWrap:'wrap'}}>*/}
            {/*            {*/}
            {/*                elewaterList.map((item:any,index:number)=>{*/}
            {/*                    return(*/}
            {/*                        <div  key={index}>*/}
            {/*                            <span>{item.remark}</span>--*/}
            {/*                            <span>*/}
            {/*                                当前用水量:*/}
            {/*                                <InputNumber value={item.total_used_amount} style={{width:'100px'}} onChange={(e)=>changewater_idz(e,item.id)}/>*/}
            {/*                            </span>*/}
            {/*                        </div>*/}
            {/*                    )*/}
            {/*                })*/}
            {/*            }*/}
            {/*        </Space>*/}
            {/*        <Button type='primary' onClick={onguandianshui}>确定关联水表</Button>*/}
            {/*    </Form.Item>*/}
            {/*    /!*<Form.Item label='小程序用户' name='open_id'>*!/*/}
            {/*    /!*    <Select>*!/*/}
            {/*    /!*        {props.AppUserList?props.AppUserList.map((item:any,index:any)=>{*!/*/}
            {/*    /!*            return(*!/*/}
            {/*    /!*                <Select.Option value={item.openId} key={item.id}>*!/*/}
            {/*    /!*                    {item.appUser_phone}*!/*/}
            {/*    /!*                </Select.Option>*!/*/}
            {/*    /!*            )*!/*/}
            {/*    /!*        }):''}*!/*/}
            {/*    /!*    </Select>*!/*/}
            {/*    /!*</Form.Item>*!/*/}
            {/*    <Form.Item label='收费项目'>*/}
            {/*        <Select*/}
            {/*            mode="multiple"*/}
            {/*            value={item_idz}*/}
            {/*            onChange={changeitem}*/}
            {/*            showSearch*/}
            {/*            optionFilterProp="children"*/}
            {/*            filterOption={(input, option) => {*/}
            {/*                // 假设每个 option 都有一个与数据项对应的 value 属性*/}
            {/*                const item = props.GongsiList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程*/}
            {/*                return item?.item_name?.toLowerCase().includes(input.toLowerCase());*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            <Select.Option*/}
            {/*                value={0}*/}
            {/*                key="no-unit-associated"*/}
            {/*                placeholder='选填'>*/}
            {/*                暂不关联*/}
            {/*            </Select.Option>*/}
            {/*            {props.GongsiList?props.GongsiList.map((item:any,index:any)=>{*/}
            {/*                return(*/}
            {/*                    <Select.Option value={item.id} key={index}>*/}
            {/*                        {item.item_name}*/}
            {/*                    </Select.Option>*/}
            {/*                )*/}
            {/*            }):''}*/}
            {/*        </Select>*/}
            {/*        <Button type='primary' onClick={okItemID}>确定关联收费项目</Button>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item label='小程序手机号' name='tenant_phone' rules={[{required: true, message: '请输入手机号' },{pattern: phonePattern, message: '请输入有效的手机号'}]}>*/}
            {/*        <Input/>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item label='预留金额(元)'  rules={[{required: true, message: '请填写'}]}>*/}
            {/*        <InputNumber min={0} value={reserved_amount} onChange={(e:number)=>setreserved_amount(e)}/><span style={{color:'#999',fontSize:'12px',marginLeft:'10px'}}>注意:用户余额低于预留金额会发消息到小程序提醒用户</span>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item label='警告金额(元)' rules={[{required: true, message: '请填写'}]}>*/}
            {/*        <InputNumber min={0} value={warn_amount} onChange={(e:number)=>setwarn_amount(e)}/><span style={{color:'#999',fontSize:'12px',marginLeft:'10px'}}>注意:用户余额低于警告金额会发短信到用户手机提醒用户</span>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item label='最低充值(元)' name='minimum_recharge' rules={[{required: true, message: '请填写'},{min:1,transform: (value) => Number(value), message: '最低充值不能低于100'}]}>*/}
            {/*        <Space>*/}
            {/*            <InputNumber min={1} value={minimum_recharge} onChange={(e)=>setminimum_recharge(e)}/>*/}
            {/*            /!*<Button type='primary' onClick={byRearge}>确定修改</Button>*!/*/}
            {/*            /!*<span style={{fontSize:'12px',color:'#999'}}>注:有账单欠费的情况下,只能通过该确定按钮修改最低充值,下面确定关联按钮修改不了最低充值</span>*!/*/}
            {/*            <span style={{fontSize:'12px',color:'#999'}}>租户最低充值金额</span>*/}
            {/*        </Space>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item label='是否自动扣款' name='is_deduction'>*/}
            {/*       <Radio.Group>*/}
            {/*           <Radio value={1}>是</Radio>*/}
            {/*           <Radio value={0}>否</Radio>*/}
            {/*       </Radio.Group>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item label='备注' name='reamrk'>*/}
            {/*        <Input.TextArea/>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item {...tailLayout}>*/}
            {/*        <Button type="primary" htmlType="submit">*/}
            {/*            确定关联*/}
            {/*        </Button>*/}
            {/*    </Form.Item>*/}
            </Form>
            {/*取消电表关联的弹窗*/}
            <Modal
                title={modalTitle}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                {/*<p>{modalContent}</p>*/}
                <div>
                {
                    diandushuandID.map((item:any)=>{
                        return(
                            <div key={item.id}>
                                {`您确定要取消绑定${item.remark}这个电表吗？`}将以<InputNumber value={item.c0} onChange={(value) => updateC0(item.id, value)}></InputNumber>度数去扣
                            </div>
                        )
                    })
                }
                </div>
            </Modal>
            {/*取消水表关联的弹窗*/}
            <Modal
                title={watermodalTitle}
                open={waterisModalVisible}
                onOk={waterhandleOk}
                onCancel={handleWatertCancel}
            >
                {/*<p>{modalContent}</p>*/}
                <div>
                    {
                        shuidushuandID.map((item:any)=>{
                            return(
                                <div key={item.id}>
                                    {`您确定要取消绑定${item.remark}这个水表吗？`}将以<InputNumber value={item.total_used_amount} onChange={(value) => updatewaterC0(item.id, value)}></InputNumber>度数去扣
                                </div>
                            )
                        })
                    }
                </div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        AppUserList: state.AppUser.list,
        UnitList: state.Unit.list,
        GongsiList: state.Gongsi.list,
        WatertList: state.Watert.list,
        CableList: state.Cable.list
    }
};
export default connect(mapStateToProps) (Byzhuhu)