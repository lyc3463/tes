import * as CableService from "@/services/cable";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {Button, Form, InputNumber, message, Modal, Select, Space} from "antd";
import {useEffect, useState} from "react";
import * as ZuhuServer from "@/services/zuhu";
import * as ByStagesService from "@/services/byStages";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const filteredArray =(e,cableList)=>{
    return  e.length === 0 ? [] : cableList.filter(item => e.includes(item.id));
};
const Byele=(props)=>{
    // 路由参数
    const [uid,setUid]=useState('0');
    // 电表列表
    const [cableList,setCableList]=useState([]);
    // 电表填写度数
    const [eleList,setEleList]=useState([]);
    // 原始电表id
    const [electricity_idz,setElectricity_id]=useState([]);
    // 初始电表id,不会被修改
    const [yuanshielectricity_idz,setyuanshielectricity_idz]=useState([]);
    // 临时存放取消已关联电表的id
    const [temporaryEle,settemporaryEle]=useState([]);
    // 删除的电表添加到电表新数组上面
    const [deleArr,setdeleArr]=useState([]);
    // 临时存放电表的id与度数
    const [diandushuandID,setdiandushuandID]=useState([]);
    // 电表弹窗可见性
    const [isModalVisible, setIsModalVisible] = useState(false);
    // 电弹窗标题
    const [modalTitle, setModalTitle] = useState('');
    const getOneCustom=async (id:string)=>{
        let res:any=await  ZuhuServer.one(id);
        if (res.ErrorCode==0){
            console.log('查看参数',res);
            let data=res.Data;
            let mapElectricity_id=data[2].map((item:any)=>{
                return item.id
            })
            setEleList(data[2]);
            setElectricity_id(mapElectricity_id);
            setyuanshielectricity_idz(mapElectricity_id);
        }else {
            message.error(res.Data);
        }
    };
    // 获取电表列表
    const getCableList=()=>{
        CableService.cableList({remark:''}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setCableList(res.Data);
            }else {
                message.error(res.Data)
            }
        })
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
    // 监听电表弹窗的输入的电表度数参数
    const changeelectricity = (newValue, id) => {
        setEleList(prevItems => prevItems.map(item =>
            item.id === id ? { ...item, c0: newValue } : item
        ));
    };
    // 电表弹窗的取消按钮点击事件
    const handleCancel = () => {
        setIsModalVisible(false);
        settemporaryEle([]);
        setdiandushuandID([]);
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
    useEffect(() => {
        getCableList();
        setUid(props.id)
        getOneCustom(props.id);
    }, [props.id]);
    return(
        <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            size={'large'}
            style={{ marginTop: '1rem' }}
        >
            <Form.Item label='电表'>
                <Select
                    mode="multiple"
                    value={electricity_idz}
                    onChange={changeEle}
                    placeholder='选填'
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                        // 假设每个 option 都有一个与数据项对应的 value 属性
                        const item = cableList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                        return item?.remark?.toLowerCase().includes(input.toLowerCase());
                    }}
                >
                    {cableList.map((item:any,index:any)=>{
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
                        eleList.map((item:any,index:number)=>{
                            return(
                                <div  key={index}>
                                    <span>{item.remark}</span>--
                                    <span>
                                            当前用电量:<InputNumber value={item.c0} style={{width:'100px'}} onChange={(e)=>changeelectricity(e,item.id)}/>
                                        </span>
                                </div>
                            )
                        })
                    }
                </Space>
                <Button type='primary' onClick={onguandiandian}>确定关联电表</Button>
            </Form.Item>
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
        </Form>
    )
}
export default Byele