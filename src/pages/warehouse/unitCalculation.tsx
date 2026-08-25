import {Button, Form, Input, InputNumber, List, message, Modal, Pagination, Select, Space, Spin, Table} from "antd";
import {useEffect, useState} from "react";
import {history,connect} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import * as UnitCalculationServer from '@/services/unitCalculation';
import {DeleteOutlined} from "@ant-design/icons";
const UnitCalculation=(props:any)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState(checkSessionStorage('/warehouse/warehouseAndType','WarehouseUnitCalculationListName')||'');// 换算名称
    const [uid,setUid]=useState(0);
    const [dopen,setDopen]=useState(false);
    const [from_unit_id,setFrom_unit_id]=useState(0);
    const [to_unit_id,setTo_unit_id]=useState(0);
    const [conversion_rate,setConversion_rate]=useState(0);
    const [editOpen,setEditOpen]=useState(false);
    const [unitList,setUnitList]=useState<any[]>([]);
    const [editGroupName,setEditGroupName]=useState('');
    const [editUnitList,setEditUnitList]=useState<any[]>([]);

    const toadd=()=>{
        history.push('/warehouse/addUnitCalculation');
    };
    // 获取单位换算列表
    const getList=()=>{
        props.dispatch({
            type:'UnitCalculation/fetch',
            payload:{page,pageSize,name}
        })
    };
    const getUnitList=()=>{
        props.dispatch({
            type:'UnitSetting/fetch',
        })
    };
    useEffect(() => {
        getList();
        getUnitList();
    }, []);
    const columns = [
        {
            title: '换算名称',
            dataIndex: 'groupName',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (text:any, record:any) => (
                <Space>
                    <Button type="primary" onClick={()=>onEditOpen(record)}>编辑</Button>
                    <Button type="primary" danger onClick={()=>isDelOpen(record.id)}>删除</Button>
                </Space>
            ),
        },
    ];
    const onEditOpen=(e:any)=>{
        setUid(e.id);
        setEditGroupName(e.groupName || '');
        setEditUnits(Array.isArray(e.unitsList) ? e.unitsList : []);
        setEditOpen(true);
    };
    const isDelOpen=(e:any)=>{
        setUid(e);
        setDopen(true);
    };
    const onChange=(page:any,pageSize:any)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const changeName=(e:any)=>{
        setName(e.target.value);
        updateSessionStorage('/warehouse/warehouseAndType','WarehouseUnitCalculationListName',e.target.value);
    }
    const sousuo=()=>{
        setPage(1);
        getList();
    };
    const onOk=()=>{
      setSpinning(true);
      props.dispatch({
          type:'UnitCalculation/remove',
          payload:uid
      }).then((res:TypeErrorCode)=>{
          if (res.ErrorCode==0){
              message.success('删除成功');
              setDopen(false);
              setSpinning(false);
              getList();
          }else {
              message.error(res.ErrorCode + res.Data);
              setSpinning(false);
              setDopen(false);
          }
      })
    };
    const editOpenOk=(e:any)=>{
        if (editUnitList.length === 0) {
            message.warning('请至少添加一条单位关系');
            return;
        }
        for (const item of editUnitList) {
            if (!item.from_unit_id || !item.to_unit_id) {
                message.warning('请选择完整的单位换算关系');
                return;
            }
            if (!item.conversion_rate || Number(item.conversion_rate) <= 0) {
                message.warning('换算倍率必须大于 0');
                return;
            }
        }
        const filteredUnitList = editUnitList.map(({ id, ...rest }) => rest);
        const jsonGoods = JSON.stringify(filteredUnitList);
        setSpinning(true);
        props.dispatch({
            type:'UnitCalculation/edit',
            payload:{uid, groupName: editGroupName, jsonGoods},
        }).then((res:TypeErrorCode)=>{
            if(res.ErrorCode===0){
                message.success('修改成功');
                setSpinning(false);
                getList();
                setEditOpen(false);
            }else{
                message.error(res.Data);
                setSpinning(false);
                setEditOpen(false);
            }
        });
    };
    // 添加单位关系值变更处理函数
    const handleConversionRateChange = (index:any, value:any) => {
        const updatedUnitList = [...unitList];
        updatedUnitList[index].conversion_rate = value; // 更新对应项的换算率
        setUnitList(updatedUnitList);
    };
    // 根据单位ID获取单位名称
    const getUnitName = (unitId:any) => {
        if (!Array.isArray(props.list) || props.list.length === 0) return '';
        const unit = props.list.find((item:any) => item.id === unitId);
        return unit ? unit.unitsName : '';
    };
    const createEditRow = (lastFromUnitId = 0) => ({
        id: Date.now() + Math.random(),
        from_unit_id: 0,
        to_unit_id: lastFromUnitId,
        conversion_rate: 1,
    });

    const setEditUnits = (list:any[] = []) => {
        setEditUnitList(list.length ? list.map((item:any) => ({
            ...item,
            id: item.id || Date.now() + Math.random(),
        })) : [createEditRow()]);
    };

    const handleEditFromChange = (index:number, fromUnitId:number) => {
        const updated = [...editUnitList];
        updated[index].from_unit_id = fromUnitId;
        if (index < updated.length - 1) {
            updated[index + 1].to_unit_id = fromUnitId;
        }
        setEditUnitList(updated);
    };

    const handleEditToChange = (index:number, toUnitId:number) => {
        const updated = [...editUnitList];
        updated[index].to_unit_id = toUnitId;
        if (index > 0) {
            updated[index - 1].from_unit_id = toUnitId;
        }
        setEditUnitList(updated);
    };

    const handleEditConversionRateChange = (index:number, value:any) => {
        const updated = [...editUnitList];
        updated[index].conversion_rate = value || 1;
        setEditUnitList(updated);
    };

    const addEditRow = () => {
        const lastItem = editUnitList[editUnitList.length - 1];
        setEditUnitList([
            ...editUnitList,
            createEditRow(lastItem ? lastItem.from_unit_id : 0),
        ]);
    };

    const removeEditRow = (id:number) => {
        if (editUnitList.length <= 1) {
            message.warning('至少保留一行单位关系');
            return;
        }
        const newList = editUnitList.filter(item => item.id !== id);
        setEditUnitList(newList);
    };

    const getEditUnitName = (unitId:any) => {
        if (!Array.isArray(props.UnitList) || props.UnitList.length === 0) return '';
        const unit = props.UnitList.find((item:any) => item.id === unitId);
        return unit ? unit.unitsName : '';
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>新增计算</Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="计算名称:"
                            value={name}
                            onChange={changeName}
                        />
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                dataSource={props.list}
                size='small'
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            <Modal open={dopen} onCancel={()=>setDopen(false)} onOk={onOk} loading={spinning}>
                <div>确定要删除吗?</div>
            </Modal>
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal
                open={editOpen}
                onCancel={()=>setEditOpen(false)}
                onOk={editOpenOk}
                title='编辑单位换算'
                width={900}
                confirmLoading={spinning}
            >
                <div style={{ marginBottom: 16 }}>
                    <Input
                        addonBefore='计算名称:'
                        value={editGroupName}
                        onChange={(e:any) => setEditGroupName(e.target.value)}
                    />
                </div>
                <div style={{ color: '#999', marginBottom: 12 }}>
                    先从大单位开始填，例如：千克 = 1000 克；下一行再填 吨 = 1000 千克。按“大单位 → 倍率 → 小单位”顺序填写。
                </div>
                {editUnitList.map((item:any, index:number)=>{
                    const currentUnitName = getEditUnitName(item.from_unit_id);
                    const nextUnitName = getEditUnitName(item.to_unit_id);
                    return (
                        <Space key={item.id} style={{ display:'flex', marginBottom:'12px', alignItems:'center', flexWrap:'wrap' }}>
                            <Select
                                placeholder='大单位'
                                style={{ width:'180px' }}
                                options={Array.isArray(props.UnitList) && props.UnitList.length > 0
                                    ? props.UnitList.map((unit:any)=>({
                                        label: unit.unitsName,
                                        value: unit.id,
                                    }))
                                    : []}
                                value={item.from_unit_id || undefined}
                                onChange={(value) => handleEditFromChange(index, value)}
                            />
                            <InputNumber
                                addonBefore='倍率'
                                value={item.conversion_rate || 1}
                                style={{ width:'180px' }}
                                min={1}
                                precision={0}
                                onChange={(value) => handleEditConversionRateChange(index, value)}
                            />
                            <Select
                                placeholder='小单位'
                                style={{ width:'180px' }}
                                options={Array.isArray(props.UnitList) && props.UnitList.length > 0
                                    ? props.UnitList.map((unit:any)=>({
                                        label: unit.unitsName,
                                        value: unit.id,
                                    }))
                                    : []}
                                value={item.to_unit_id || undefined}
                                onChange={(value) => handleEditToChange(index, value)}
                            />
                            <span style={{ minWidth:'220px', color:'#666' }}>
                                {currentUnitName || '未选择'} = {item.conversion_rate || 1} {nextUnitName || '小单位'}
                            </span>
                            <Button
                                type='text'
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => removeEditRow(item.id)}
                                disabled={editUnitList.length === 1}
                            >
                                删除
                            </Button>
                        </Space>
                    )
                })}
                <div style={{ marginTop:'10px' }}>
                    <Button type='primary' onClick={addEditRow}>增加</Button>
                </div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.UnitCalculation.list,
    count: state.UnitCalculation.count,
    UnitList: state.UnitSetting.list,


});
export default connect(mapStateToProps) (UnitCalculation);
