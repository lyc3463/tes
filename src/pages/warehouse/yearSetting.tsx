import {connect} from "umi";
import {useEffect, useState} from "react";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import {history} from "@@/core/history";
import {Button, Form, Input, List, message, Modal, Pagination, Space, Spin, Table} from "antd";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const YearSetting=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [name,setName]=useState(checkSessionStorage('/warehouse/warehouseAndType','YearSettingListName') || '');// 类型名称
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [uid,setUid]=useState(0);
    const [open,setOpen]=useState(false);// 删除的弹窗
    const [openAdd,setOpenAdd]=useState(false);// 添加的弹窗
    const [openEdit,setOpenEdit]=useState(false);// 编辑的弹窗
    const [addTypeName,setAddTypeName]=useState('');// 添加的口感类型
    const [editTypeName,setEditTypeName]=useState('');// 编辑的口感类型
    const columns = [
        {
            title: '年份',
            dataIndex: 'ytName',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => (
                <Space size="small">
                    <Button type="primary" onClick={()=>isEdit(record)}>编辑</Button>
                    <Button type="primary" danger onClick={()=>onDelOpen(record.id)}>删除</Button>
                </Space>
            ),
        },
    ];
    const isEdit=(e:any)=>{
        setUid(e.id);
        setEditTypeName(e.ytName);
        setOpenEdit(true);
    };
    const getList=()=>{
        props.dispatch({
            type:"YearSetting/fetch",
            payload:{name}
        })
    };
    useEffect(() => {
        getList();
    }, []);
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const onDelOpen=(e)=>{
        setUid(e);
        setOpen(true);
    };
    // 删除的id
    const onOk=()=>{
        setSpinning(true);
        props.dispatch({
            type:"YearSetting/remove",
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
        updateSessionStorage('/warehouse/warehouseAndType','YearSettingListName',e.target.value);
        setName(e.target.value);
    };
    const sousuo=()=>{
        setPage(1);
        getList();
    };
    const onAddOk=()=>{
        if (addTypeName==''){
            message.error('请输入年份');
            return;
        }
        setSpinning(true);
        props.dispatch({
            type:"YearSetting/add",
            payload:addTypeName
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                setSpinning(false);
                setOpenAdd(false);
            }else {
                message.error('添加失败'+res.ErrorCode+res.Data);
                setSpinning(false);
            }
        })
    };
    const toadd=()=>{
        setOpenAdd(true);
    };
    const onEditOk=()=>{
        if (editTypeName==''){
            message.error('请输入年份');
            return;
        }
        setSpinning(true);
        props.dispatch({
            type:"YearSetting/edit",
            payload:{uid,editTypeName}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('编辑成功');
                setSpinning(false);
                setOpenEdit(false);
            }else {
                message.error('编辑失败'+res.ErrorCode+res.Data);
                setSpinning(false);
            }
        })
    };
    const changeAddTypeName=(e)=>{
        setAddTypeName(e.target.value);
    };
    const changeEditTypeName=(e)=>{
        setEditTypeName(e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>新增年份</Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="年份:"
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
                size='small'
                dataSource={props.list}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            <Modal title="确认删除吗？" open={open} onOk={onOk} onCancel={()=>setOpen(false)} loading={spinning}>
                <div>确定要删除吗?</div>
            </Modal>
            <Modal title="添加" open={openAdd} onOk={onAddOk} onCancel={()=>setOpenAdd(false)} loading={spinning}>
                <Form>
                    <Form.Item label="年份">
                        <Input value={addTypeName} onChange={changeAddTypeName}/>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal title="编辑" open={openEdit} onOk={onEditOk} onCancel={()=>setOpenEdit(false)} loading={spinning}>
                <Form>
                    <Form.Item label="年份">
                        <Input value={editTypeName} onChange={changeEditTypeName}/>
                    </Form.Item>
                </Form>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.YearSetting.list,
});
export default connect(mapStateToProps)(YearSetting)
