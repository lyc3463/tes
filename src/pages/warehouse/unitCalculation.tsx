import {Button, Input, List, message, Modal, Pagination, Space, Spin, Table} from "antd";
import {useEffect, useState} from "react";
import {history,connect} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const UnitCalculation=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState(checkSessionStorage('/warehouse/warehouseAndType','WarehouseUnitCalculationListName')||'');// 换算名称
    const [uid,setUid]=useState(0);
    const [dopen,setDopen]=useState(false);
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
    // 获取分页信息
    const getFenye=()=>{
        props.dispatch({
            type:'UnitCalculation/fenye',
            payload:{pageSize,name}
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getFenye();
    }, []);
    const columns = [
        {
            title: '计算名称',
            dataIndex: 'groupName',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => (
                <Space>
                    <Button type="primary" onClick={() => history.push(`/warehouse/editUnitCalculation?id=${record.id}`)}>编辑</Button>
                    <Button type="primary" danger onClick={()=>isDelOpen(record.id)}>删除</Button>
                </Space>
            ),
        },
    ];
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
        getFenye();
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
          }else {
              message.error(res.ErrorCode + res.Data);
              setSpinning(false);
              setDopen(false);
          }
      })
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

});
export default connect(mapStateToProps) (UnitCalculation);
