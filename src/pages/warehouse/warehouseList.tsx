import {connect, history} from 'umi'
import {useEffect, useState} from "react";
import {Button, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
const WarehouseList=(props:any)=>{
    const [loading, setLoading] = useState(false);
    // 删除的弹窗
    const [isOpen,setIsOpen]=useState(false);
    const [uid,setUid]=useState(0);
    const [warehouseName,setWarehouseName]=useState(checkSessionStorage('/warehouse/warehouseAndType','WarehouseListName')||''); // 仓库名称
    const [personName,setPersonName]=useState(checkSessionStorage('/warehouse/warehouseAndType','WarehouseListPersonName')||''); // 负责人姓名
    const [personPhone,setPersonPhone]=useState(checkSessionStorage('/warehouse/warehouseAndType','WarehouseListPersonPhone')||''); // 负责人联系电话
    const [page,setPage]=useState(1);
    const [isXs,setIsXs]=useState(2);
    const [pageSize,setPageSize]=useState(50);
    const columns = [
        {
            title: '仓库名称',
            dataIndex: 'warehouseName',
            ellipsis: true,
        },
        {
            title: '仓库类型',
            dataIndex: 'typeName',
            ellipsis: true,
        },
        {
            title: '所在位置',
            dataIndex: 'warehouseAddress',
            ellipsis: true,
        },
        {
            title: '负责人',
            dataIndex: 'personName',
            ellipsis: true,
        },
        {
            title: '联系电话',
            dataIndex: 'personPhone',
            ellipsis: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => (
                <Space size="small">
                    <Button type="primary" onClick={()=>{history.push(`/warehouse/editWarehouseList?id=${record.id}`)}}>编辑</Button>
                    <Button type="primary" danger onClick={()=>isDelOpen(record.id)}>删除</Button>
                </Space>
            ),
        },
    ];
    const isDelOpen=(e)=>{
        setIsOpen(true);
        setUid(e);
    };
    const toadd=()=>{
        history.push('/warehouse/addWarehouse');
    };
    // 仓库名称
    const changeWarehouseName=(e)=>{
        updateSessionStorage('/warehouse/warehouseAndType','WarehouseListName',e.target.value);
        setWarehouseName(e.target.value);
    };
    // 负责人姓名
    const changePersonName=(e)=>{
        updateSessionStorage('/warehouse/warehouseAndType','WarehouseListPersonName',e.target.value);
        setPersonName(e.target.value);
    };
    // 负责人联系电话
    const changePersonPhone=(e)=>{
        updateSessionStorage('/warehouse/warehouseAndType','WarehouseListPersonPhone',e.target.value);
        setPersonPhone(e.target.value);
    };
    const getList=()=>{
        props.dispatch({
            type:'WarehouseList/fetch',
            payload:{page,warehouseName, personName, personPhone,pageSize,isXs}
        })
    };
    const getFenye=()=>{
        props.dispatch({
            type:'WarehouseList/fenye',
            payload:{warehouseName, personName, personPhone,pageSize,isXs}
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getFenye();
    }, []);
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const onOk=()=>{
        setLoading(true);
        props.dispatch({
            type:'WarehouseList/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setIsOpen(false);
                setLoading(false);
            }else {
                message.error('删除失败'+res.ErrorCode+res.Data);
                setIsOpen(false);
                setLoading(false);
            }
        })
    };
    const sousuo=()=>{
        setPage(1);
        getList();
    };
    const changeXs=(e)=>{
        setIsXs(e);
    };
    return(
        <Spin spinning={loading}>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>新增仓库</Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="仓库名称:"
                            value={warehouseName}
                            onChange={changeWarehouseName}
                        />
                        <Input
                            addonBefore="姓名:"
                            value={personName}
                            onChange={changePersonName}
                        />
                        <Input
                            addonBefore="联系电话:"
                            value={personPhone}
                            onChange={changePersonPhone}
                        />
                        <Space.Compact>
                            <div
                                style={{
                                    borderRadius: '6px',
                                    borderStartEndRadius: 0,
                                    borderEndEndRadius: 0,
                                    padding: '0 11px',
                                    border: '1px solid #d9d9d9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                }}
                            >
                                类型:
                            </div>
                            <Select
                                style={{ width: 120 }}
                                value={isXs}
                                onChange={changeXs}
                                options={[
                                    {label:'全部',value:2},
                                    {label:'禁销售',value:0},
                                    {label:'正常',value:1},
                                ]}
                            />
                        </Space.Compact>
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
            <Modal open={isOpen} onCancel={()=>setIsOpen(false)} loading={loading} onOk={onOk}>
                <div>确定要删除吗?</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.WarehouseList.list,
    count: state.WarehouseList.count,
});

export default connect(mapStateToProps) (WarehouseList)