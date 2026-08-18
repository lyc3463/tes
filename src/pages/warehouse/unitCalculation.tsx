import {Button, Form, Input, InputNumber, List, message, Modal, Pagination, Select, Space, Spin, Table} from "antd";
import {useEffect, useState} from "react";
import {history,connect} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import * as UnitCalculationServer from '@/services/unitCalculation';
const UnitCalculation=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState(checkSessionStorage('/warehouse/warehouseAndType','WarehouseUnitCalculationListName')||0);// 换算名称
    const [uid,setUid]=useState(0);
    const [dopen,setDopen]=useState(false);
    const [from_unit_id,setFrom_unit_id]=useState(0);
    const [to_unit_id,setTo_unit_id]=useState(0);
    const [conversion_rate,setConversion_rate]=useState(0);
    const [editOpen,setEditOpen]=useState(false);
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
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    const columns = [
        {
            title: '上级单位',
            dataIndex: 'unitsName',
        },
        {
            title: '转换倍率',
            dataIndex: 'conversion_rate',
        },
        {
            title: '下级单位',
            dataIndex: 'unitsName2',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => (
                <Space>
                    <Button type="primary" onClick={()=>onEditOpen(record)}>编辑</Button>
                    <Button type="primary" danger onClick={()=>isDelOpen(record.id)}>删除</Button>
                </Space>
            ),
        },
    ];
    const onEditOpen=(e)=>{
        console.log('e',e)
        setUid(e.id);
        setEditOpen(true);
        setFrom_unit_id(e.from_unit_id);
        setTo_unit_id(e.to_unit_id);
        setConversion_rate(e.conversion_rate);
    };
    const isDelOpen=(e)=>{
        setUid(e);
        setDopen(true);
    };
    const onChange=(page,pageSize)=>{
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
    const editOpenOk=(e)=>{
        UnitCalculationServer.edit({uid,from_unit_id,to_unit_id,conversion_rate}).then((res:TypeErrorCode)=>{
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
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.UnitCalculation.list,
    count: state.UnitCalculation.count,
    UnitList: state.UnitSetting.list,


});
export default connect(mapStateToProps) (UnitCalculation);
