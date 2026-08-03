import {useEffect, useState} from "react";
import {history,connect} from "umi";
import {Button, Input, List, message, Modal, Pagination, Space, Spin, Table} from "antd";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const UnitSetting=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);
    const [name,setName]=useState(checkSessionStorage('/warehouse/warehouseAndType','WarehouseUnitSettingListName') || '');
    const [pageSize,setPageSize]=useState(50);
    const [visible,setVisible]=useState(false);
    const [uid,setUid]=useState('');
    const toadd=()=>{
        history.push('/warehouse/addUnitSetting');
    };
    const columns = [
        {
            title: '单位名称',
            dataIndex: 'unitsName',
        },
        {
            title: '单位代码',
            dataIndex: 'unitsCode',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => (
                <Space>
                    <Button type="primary" onClick={()=>{
                        history.push(`/warehouse/editUnitSetting?id=${record.id}`);
                    }}>编辑</Button>
                    <Button type="primary" danger onClick={()=>onDelOpen(record)}>删除</Button>
                </Space>
            ),
        },
    ];
    const getList=()=>{
        props.dispatch({
            type:"UnitSetting/fetch",
            payload:{page,name,pageSize}
        })
    };

    useEffect(()=>{
        getList();
    },[page,pageSize]);
    const onDelOpen=(record)=>{
        setUid(record.id);
        setVisible(true);
    };
    const onOk=()=>{
        setSpinning(true);
        props.dispatch({
            type:"UnitSetting/remove",
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setSpinning(false);
                setVisible(false);
                getList();
            }else {
                message.error('删除失败'+res.ErrorCode+res.Data);
                setSpinning(false);
                setVisible(false);
            }
        })
    };
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const changeName=(e:any)=>{
        setName(e.target.value);
        updateSessionStorage('/warehouse/warehouseAndType','WarehouseUnitSettingListName',e.target.value);
    };
    return(
      <Spin spinning={spinning}>
          <List>
              <List.Item>
                  <div>
                      <Button type="primary" onClick={toadd}>新增单位</Button>
                  </div>
                  <Space>
                      <Input
                          addonBefore="单位名称:"
                          value={name}
                          onChange={changeName}
                      />
                      <Button type="primary" onClick={getList}>
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
          <Modal title="确认删除吗？" open={visible} onOk={()=>onOk()} onCancel={()=>setVisible(false)} loading={spinning}>
              <div>确定要删除嘛?</div>
          </Modal>
          {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}

      </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.UnitSetting.list,
    count: state.UnitSetting.count,
});
export default connect(mapStateToProps)(UnitSetting);
