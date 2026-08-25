import {Button, Form, Input, InputNumber, message, Select, Space, Spin} from "antd";
import {useEffect, useState} from "react";
import {connect,history} from "umi";
import {DeleteOutlined} from "@ant-design/icons";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const createUnitRow = (lastToUnitId = 0) => ({
    id: Date.now() + Math.random(),
    from_unit_id: 0,
    to_unit_id: lastToUnitId,
    conversion_rate: 1,
});

const AddUnitCalculation=(props:any)=>{
    const [spinning,setSpinning]=useState(false);
    const [form] = Form.useForm();
    const [unitList,setUnitList]=useState<any[]>([createUnitRow()]);
    const onFinish = (values: any) => {
        if (unitList.length === 0) {
            message.warning('请至少添加一条单位关系');
            return;
        }
        for (const [index, item] of unitList.entries()) {
            if (index === 0) {
                if (!item.from_unit_id) {
                    message.warning('请先选择最小单位');
                    return;
                }
                if (item.to_unit_id !== item.from_unit_id || Number(item.conversion_rate) !== 1) {
                    message.warning('最小单位的换算倍率必须为 1，并且转换单位必须等于当前单位');
                    return;
                }
                continue;
            }
            if (!item.from_unit_id || !item.to_unit_id) {
                message.warning('请选择完整的单位换算关系');
                return;
            }
            if (!item.conversion_rate || Number(item.conversion_rate) <= 0) {
                message.warning('换算倍率必须大于 0');
                return;
            }
        }

        const filteredUnitList = unitList.map(({ id, ...rest }) => rest);
        const jsonGoods=JSON.stringify(filteredUnitList);
        setSpinning(true);
        props.dispatch({
            type:'UnitCalculation/add',
            payload:{...values,jsonGoods},
        }).then((res:TypeErrorCode)=>{
            if(res.ErrorCode===0){
                message.success('添加成功');
                setSpinning(false);
                history.push('/warehouse/warehouseAndType');
            }else{
                message.error(res.Data);
                setSpinning(false);
            }
        });
    };

    const syncChain = (updatedList:any[]) => {
        for (let index = 0; index < updatedList.length; index++) {
            const current = updatedList[index];
            if (index > 0 && current.from_unit_id === 0) {
                current.from_unit_id = updatedList[index - 1].to_unit_id || 0;
            }
            if (index < updatedList.length - 1) {
                current.to_unit_id = updatedList[index + 1].from_unit_id || current.to_unit_id || 0;
            }
        }
        return updatedList;
    };

    const handleFromUnitChange = (index:number, fromUnitId:number) => {
        const updatedUnitList = [...unitList];
        if (index === 0) {
            updatedUnitList[0].from_unit_id = fromUnitId;
            updatedUnitList[0].to_unit_id = fromUnitId;
            updatedUnitList[0].conversion_rate = 1;
            if (updatedUnitList.length > 1) {
                updatedUnitList[1].to_unit_id = fromUnitId;
            }
            setUnitList(updatedUnitList);
            return;
        }
        updatedUnitList[index].from_unit_id = fromUnitId;
        if (index < updatedUnitList.length - 1) {
            updatedUnitList[index + 1].to_unit_id = fromUnitId;
        }
        setUnitList(updatedUnitList);
    };

    const handleToUnitChange = (index:number, toUnitId:number) => {
        if (index === 0) return;
        const updatedUnitList = [...unitList];
        updatedUnitList[index].to_unit_id = toUnitId;
        if (index > 0) {
            updatedUnitList[index - 1].from_unit_id = toUnitId;
        }
        setUnitList(updatedUnitList);
    };

    const addUnitRow = () => {
        if (!unitList[0]?.from_unit_id) {
            message.warning('请先选择最小单位');
            return;
        }
        const lastItem = unitList[unitList.length - 1];
        const newItem = {
            id: Date.now() + Math.random(),
            from_unit_id: 0,
            to_unit_id: unitList[0].from_unit_id,
            conversion_rate: 1,
        };
        setUnitList([...unitList, newItem]);
    };

    const removeUnitRow = (id:number) => {
        if (unitList.length <= 1) {
            message.warning('至少保留一行单位关系');
            return;
        }
        const deletedIndex = unitList.findIndex(item => item.id === id);
        if (deletedIndex === -1) return;
        if (deletedIndex === 0) {
            message.warning('最小单位不能删除');
            return;
        }

        const newUnitList = unitList.filter(item => item.id !== id);
        const adjustedList = newUnitList.map((item, index) => {
            if (index > 0 && item.from_unit_id === 0) {
                item.from_unit_id = newUnitList[index - 1].to_unit_id || 0;
            }
            if (index < newUnitList.length - 1) {
                item.to_unit_id = newUnitList[index + 1].from_unit_id || item.to_unit_id || 0;
            }
            return item;
        });
        setUnitList(adjustedList);
    };

    const handleConversionRateChange = (index:number, value:any) => {
        if (index === 0) return;
        const updatedUnitList = [...unitList];
        updatedUnitList[index].conversion_rate = value || 1;
        setUnitList(updatedUnitList);
    };

    const getUnitName = (unitId:any) => {
        if (!Array.isArray(props.list) || props.list.length === 0) return '';
        const unit = props.list.find((item:any) => item.id === unitId);
        return unit ? unit.unitsName : '';
    };

    const getList=()=>{
        props.dispatch({
            type:"UnitSetting/fetch",
        })
    };
    useEffect(()=>{
        getList();
    },[])
    return (
        <div>
            <Spin spinning={spinning}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 18 }}
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    onFinish={onFinish}
                    style={{ marginTop: '1rem' }}
                >
                    <Form.Item label='计算名称' name='groupName' rules={[{required: true, message: '计算名称' }]}>
                        <Input placeholder='计算名称'/>
                    </Form.Item>
                    <Form.Item label='单位换算'>
                        <div style={{ color: '#999', marginBottom: 12 }}>
                            第1行必须先选择最小单位，例如：克；系统会自动按 1 倍和同一单位绑定。之后再按“大单位 → 倍率 → 小单位”往上添加。
                        </div>
                        {unitList.map((item:any, index:number)=>{
                            const currentUnitName = getUnitName(item.from_unit_id);
                            const nextUnitName = getUnitName(item.to_unit_id);
                            const isBaseRow = index === 0;
                            return(
                                <Space key={item.id} style={{ display:'flex', marginBottom:'12px', alignItems:'center', flexWrap:'wrap' }}>
                                    <Select
                                        placeholder={isBaseRow ? '最小单位' : '大单位'}
                                        style={{width:'180px'}}
                                        options={Array.isArray(props.list) && props.list.length > 0
                                            ? props.list.map((unit:any)=>({
                                                label:unit.unitsName,
                                                value:unit.id,
                                            }))
                                            : []}
                                        value={item.from_unit_id || undefined}
                                        onChange={(value) => handleFromUnitChange(index, value)}
                                    />
                                    <InputNumber
                                        addonBefore='倍率'
                                        value={isBaseRow ? 1 : (item.conversion_rate || 1)}
                                        style={{width:'180px'}}
                                        min={1}
                                        precision={0}
                                        onChange={(value) => handleConversionRateChange(index, value)}
                                        disabled={isBaseRow}
                                    />
                                    <Select
                                        placeholder={isBaseRow ? '最小单位' : '小单位'}
                                        style={{width:'180px'}}
                                        options={Array.isArray(props.list) && props.list.length > 0
                                            ? props.list.map((unit:any)=>({
                                                label:unit.unitsName,
                                                value:unit.id,
                                            }))
                                            : []}
                                        value={item.to_unit_id || undefined}
                                        onChange={(value) => handleToUnitChange(index, value)}
                                        disabled={isBaseRow}
                                    />
                                    <span style={{ minWidth:'220px', color:'#666' }}>
                                        {isBaseRow
                                            ? `${currentUnitName || '未选择'} = 1 ${nextUnitName || currentUnitName || '最小单位'}`
                                            : `${currentUnitName || '未选择'} = ${item.conversion_rate || 1} ${nextUnitName || '小单位'}`}
                                    </span>
                                    {!isBaseRow && (
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeUnitRow(item.id)}
                                            disabled={unitList.length === 1}
                                            style={{
                                                opacity: unitList.length === 1 ? 0.5 : 1,
                                                cursor: unitList.length === 1 ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            删除
                                        </Button>
                                    )}
                                </Space>
                            )
                        })}
                        <div style={{ marginTop:'10px' }}>
                            <Button
                                type="primary"
                                onClick={addUnitRow}
                            >
                                增加
                            </Button>
                        </div>
                    </Form.Item>
                    <Form.Item  style={{textAlign:'center'}}>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                添加
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
export default connect(mapStateToProps)(AddUnitCalculation);
