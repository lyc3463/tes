import {Button, DatePicker, Form, Input, InputNumber, Select, Radio, message, Spin, Space, Modal, Tabs} from "antd";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as ByStagesService from '@/services/byStages';
import * as ZuhuServer from "@/services/zuhu";
import {connect} from "@@/exports";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const filteredWaterArray =(e,watertList)=>{
    return  e.length === 0 ? [] : watertList.filter(item => e.includes(item.id));
};
const Bywater=(props)=>{
    const [uid,setUid]=useState('0');
    // 原始水表id
    const [water_idz,setWater_id]=useState([]);
    // 初始水表id,不会被修改
    const [yuanshiWtertctricity_idz,setyuanshiWtertctricity_idz]=useState([]);
    // 临时存放取消已关联水表的id
    const [temporaryWater,settemporaryWater]=useState([]);
    // 水表列表
    const [watertList,setWatertList]=useState([]);
    // 临时存放水表的id与度数
    const [shuidushuandID,setshuidushuandID]=useState([]);
    // 水弹窗标题
    const [watermodalTitle, setwatermodalTitle] = useState('');
    // 水表弹窗可见性
    const [waterisModalVisible, setwaterisModalVisible] = useState(false);
    // 水表填写度数
    const [elewaterList,setelewaterList]=useState([]);
    // 删除的水表添加到水表新数组上面
    const [delewaterArr,setdelewaterArr]=useState([]);
    const getOneCustom=async (id:string)=>{
        let res:any=await  ZuhuServer.one(id);
        if (res.ErrorCode==0){
            let data=res.Data;
            let mapWater_id=data[3].map((item:any)=>{
                return item.id
            });
            setelewaterList(data[3]);
            setWater_id(mapWater_id);
            setyuanshiWtertctricity_idz(mapWater_id);

        }else {
            message.error(res.Data);
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
    // 监听水表弹窗的输入的电表度数参数
    const changewater_idz=(newValue, id)=>{
        setelewaterList(prevItems => prevItems.map(item =>
            item.id === id ? { ...item, total_used_amount: newValue } : item
        ));
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
    useEffect(() => {
        getWatertList();
    }, []);
    useEffect(() => {
        setUid(props.id)
        getOneCustom(props.id);
    }, [props.id]);
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
    // 水表弹窗的取消按钮点击事件
    const handleWatertCancel = () => {
        setwaterisModalVisible(false);
        settemporaryWater([]);
        setshuidushuandID([]);
    };
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                size={'large'}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='水表'>
                    <Select
                        mode="multiple"
                        value={water_idz}
                        onChange={changeWater}
                        placeholder='选填'
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item = watertList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                            return item?.remark?.toLowerCase().includes(input.toLowerCase());
                        }}
                    >
                        {watertList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={item.id}>
                                    {item.remark}-{item.tenant_name}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space style={{display:'flex',flexWrap:'wrap'}}>
                        {
                            elewaterList.map((item:any,index:number)=>{
                                return(
                                    <div  key={index}>
                                        <span>{item.remark}</span>--
                                        <span>
                                            当前用水量:
                                            <InputNumber value={item.total_used_amount} style={{width:'100px'}} onChange={(e)=>changewater_idz(e,item.id)}/>
                                        </span>
                                    </div>
                                )
                            })
                        }
                    </Space>
                    <Button type='primary' onClick={onguandianshui}>确定关联水表</Button>
                </Form.Item>
            </Form>
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
        </div>
    )
}
export default connect() (Bywater)