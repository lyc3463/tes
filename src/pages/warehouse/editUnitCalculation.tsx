import {Button, Form, Input, InputNumber, message, Select, Space, Spin} from "antd";
import {useEffect, useRef, useState} from "react";
import {connect,history} from "umi";
import {DeleteOutlined} from "@ant-design/icons";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as ThingListvice from "@/services/unitCalculation";
import * as UnitCalculation from "@/services/unitCalculation";

const EditUnitCalculation=(props)=>{
    const formRef=useRef();
    const [spinning,setSpinning]=useState(false);
    const [form] = Form.useForm();
    const [unitList,setUnitList]=useState([]);
    const [uid,setUid]=useState('0');
    const onFinish = (values: any) => {
        // 1. 验证数组是否为空
        if (unitList.length === 0) {
            message.warning('请至少添加一条单位关系');
            return;
        }
        // 2. 验证所有项是否已选择单位
        for (const item of unitList) {
            if (item.from_unit_id === 0) {
                message.warning('请选择单位');
                return;
            }
        }
        const filteredUnitList = unitList.map(({ id, ...rest }) => rest);
        let jsonGoods=JSON.stringify(filteredUnitList);
        console.log('jsonGoods',unitList);
        setSpinning(true);
        props.dispatch({
            type:'UnitCalculation/edit',
            payload:{...values,jsonGoods,uid},
        }).then((res:TypeErrorCode)=>{
            if(res.ErrorCode===0){
                message.success('修改成功');
                setSpinning(false);
                history.push('/warehouse/warehouseAndType');
            }else{
                message.error(res.Data);
                setSpinning(false);
            }
        });
    };
    // 处理单位选择变更 - 更新当前项from_unit_id并设置下一项to_unit_id
    const handleFromUnitChange = (index, fromUnitId) => {
        const updatedUnitList = [...unitList];
        // 更新当前项的from_unit_id
        updatedUnitList[index].from_unit_id = fromUnitId;
        // 如果存在下一项，将其to_unit_id设置为当前项的from_unit_id
        if (index < updatedUnitList.length - 1) {
            updatedUnitList[index + 1].to_unit_id = fromUnitId;
        }
        setUnitList(updatedUnitList);
    };
    // 添加新的单位关系行 - 新行to_unit_id关联上一行from_unit_id
    const addUnitRow = () => {
        const lastItem = unitList[unitList.length - 1];
        const newItem = {
            id: Date.now(), // 使用时间戳作为唯一ID
            from_unit_id: 0, // 来源单位ID(默认值，待用户选择)
            to_unit_id: lastItem ? lastItem.from_unit_id : 0, // 目标单位ID关联上一行from_unit_id
            conversion_rate: 1 ,// 换算率
        };
        setUnitList([...unitList, newItem]);
    };
    // 删除单位关系行 - 添加删除后链式关联修复
    const removeUnitRow = (id) => {
        // 确保至少保留一行
        if (unitList.length <= 1) {
            message.warning('至少保留一行单位关系');
            return;
        }

        // 1. 找到要删除项的索引
        const deletedIndex = unitList.findIndex(item => item.id === id);
        if (deletedIndex === -1) return; // 未找到该项，直接返回

        // 2. 删除指定项
        const newUnitList = unitList.filter(item => item.id !== id);

        // 3. 修复删除后剩余项的to_unit_id链式关联
        // 从删除项的下一项开始，重新关联上一项的from_unit_id
        const adjustedList = newUnitList.map((item, index) => {
            // 只处理删除项后面的项（原索引 > deletedIndex）
            if (index >= deletedIndex && index > 0) {
                return {
                    ...item,
                    to_unit_id: newUnitList[index - 1].from_unit_id // 关联上一项的from_unit_id
                };
            }
            return item;
        });

        setUnitList(adjustedList);
    };
    // 添加单位关系值变更处理函数
    const handleConversionRateChange = (index, value) => {
        const updatedUnitList = [...unitList];
        updatedUnitList[index].conversion_rate = value; // 更新对应项的换算率
        setUnitList(updatedUnitList);
    };
    // 根据单位ID获取单位名称
    const getUnitName = (unitId) => {
        if (!Array.isArray(props.list) || props.list.length === 0) return '';
        const unit = props.list.find(item => item.id === unitId);
        return unit ? unit.unitsName : '';
    };
    // 获取单位列表
    const getList=()=>{
        props.dispatch({
            type:"UnitSetting/fetch",
        })
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOne(id);
        getList();
    },[])
    const getOne=async (id:string)=>{
        setSpinning(true);
        let res:any=await  ThingListvice.one(id);
        if (res.ErrorCode==0){
            console.log('jsonGoods',res);
            let data=res.Data;
            formRef.current.setFieldsValue(data);
            getOneGroupID(data.id);
            setSpinning(false);
        }else {
            message.error(res.Data);
            setSpinning(false);
        }
    };
    const getOneGroupID=(e)=>{
        UnitCalculation.oneGoodsList(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setUnitList(res.Data);
            }
        })
    };
    return (
        <div>
            <Spin spinning={spinning}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    ref={formRef}
                    layout="horizontal"
                    size={'large'}
                    onFinish={onFinish}
                    style={{ marginTop: '1rem' }}
                >
                    <Form.Item label='计算名称' name='groupName' rules={[{required: true, message: '计算名称' }]}>
                        <Input placeholder='计算名称'/>
                    </Form.Item>
                    <Form.Item label='单位换算'>
                        {unitList.map((item:any, index:number)=>{
                            // 获取当前单位名称
                            const currentUnitName = getUnitName(item.from_unit_id);
                            // 获取上一单位名称（当前项的to_unit_id对应的单位名称）
                            const prevUnitName = getUnitName(item.to_unit_id);
                            return(
                                <Space key={item.id} style={{display:'flex',marginBottom:'10px',alignItems:'center'}}>
                                    <Select
                                        placeholder='选择单位'
                                        style={{width:'200px'}}
                                        options={Array.isArray(props.list) && props.list.length > 0
                                            ? props.list.map((item:any)=>({
                                                label:item.unitsName,
                                                value:item.id,
                                            }))
                                            : []}
                                        value={item.from_unit_id}
                                        onChange={(value) => handleFromUnitChange(index, value)}
                                    />
                                    <InputNumber
                                        addonBefore="单位关系:"
                                        value={index === 0 ? 1 : item.conversion_rate}
                                        disabled={index === 0}
                                        style={{width:'200px'}}
                                        name={`relation_${item.id}`}
                                        min={1}
                                        onChange={index === 0 ? undefined : (value) => handleConversionRateChange(index, value)}
                                    />
                                    <span style={{margin: '0 10px'}}>
                                       {index === 0 ? `(${currentUnitName || '未选择单位'})` : `= ${item.conversion_rate || 1} ${prevUnitName || '上一单位'}`}
                                    </span>
                                    {/* 删除按钮 - 第一条数据禁用 */}
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeUnitRow(item.id)}
                                        disabled={index === 0} // 第一条数据禁用删除按钮
                                        style={{
                                            opacity: index === 0 ? 0.5 : 1,
                                            cursor: index === 0 ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        删除
                                    </Button>
                                    {index === 0 && (<span style={{marginLeft: '10px', color: '#999', fontSize: '12px'}}>请选择最小单位</span>)}
                                </Space>
                            )
                        })}
                        {/* 添加按钮 */}
                        <Button
                            type="primary"
                            onClick={addUnitRow}
                            style={{marginTop: '10px'}}
                        >
                            增加
                        </Button>
                    </Form.Item>
                    <Form.Item  style={{textAlign:'center'}}>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                修改
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.UnitSetting.list,
});
export default connect(mapStateToProps)(EditUnitCalculation);
