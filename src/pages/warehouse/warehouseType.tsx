import {Button, Input, List, message, Modal, Pagination, Space, Spin, Table} from "antd";
import {connect, history} from 'umi';
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const WarehouseType=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [name,setName]=useState('');// 类型名称
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [uid,setUid]=useState(0);
    const [open,setOpen]=useState(false);
    const toadd=()=>{
        history.push('/warehouse/addWarehouseType');
    };

    const columns = [
        {
            title: '类型名称',
            dataIndex: 'typeName',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => (
                <Space size="small">
                    <Button type="primary" onClick={()=>{history.push(`/warehouse/editWarehouseType?id=${record.id}`)}}>编辑</Button>
                    <Button type="primary" danger onClick={()=>onDelOpen(record.id)}>删除</Button>
                </Space>
            ),
        },
    ];
    const getList=()=>{
        props.dispatch({
            type:"WarehouseType/fetch",
            payload:{name, page, pageSize}
        })
    };
    const getFenye=()=>{
        props.dispatch({
            type:"WarehouseType/fenye",
            payload:{name, pageSize}
        })
    };
    useEffect(() => {
        getList();
    }, [page, pageSize]);
    useEffect(() => {
        getFenye();
    }, []);
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const onDelOpen=(e)=>{
        setUid(e);
        setOpen(true);
    };
    const onOk=()=>{
        props.dispatch({
            type:"WarehouseType/remove",
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setSpinning(false);
                setOpen(false);
            }else {
                message.error('删除失败'+res.ErrorCode+res.Data);
                setSpinning(false);
            }
        })
    };
    const changeName=(e)=>{
        setName(e.target.value);
    };
    const sousuo=()=>{
        setPage(1);
        getList();
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>新增仓库类型</Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="类型名称:"
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
                size='small'
                dataSource={props.list}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal title="确认删除吗？" open={open} onOk={onOk} onCancel={()=>setOpen(false)} loading={spinning}>
                <div>确定要删除吗?</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.WarehouseType.list,
    count: state.WarehouseType.count,
});
export default connect(mapStateToProps)(WarehouseType);
