import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table} from "antd";
import dayjs from "dayjs";
import {connect, history} from "umi";
import {useEffect, useState} from "react";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const Supplier=(props)=>{
    const [spinning, setSpinning] = useState(false);
    const [page,setPage]=useState(1);
    const [supplierName,setSupplierName]=useState(checkSessionStorage('/warehouse/supplier','supplierName') || '');
    const [personName,setPersonName]=useState(checkSessionStorage('/warehouse/supplier','personName') || '');
    const [personPhone,setPersonPhone]=useState(checkSessionStorage('/warehouse/supplier','personPhone') || '');
    const [pageSize,setPageSize]=useState(50);
    const [uid,setUid]=useState(0);
    const [dopen,setDopen]=useState(false);
    const columns = [
        {
            title: '供应商名称',
            dataIndex: 'supplierName',
            ellipsis: true,
        },
        {
            title: '地址',
            dataIndex: 'supplierAddress',
            ellipsis: true,
        },
        {
            title: '账户',
            dataIndex: 'personName',
            ellipsis: true,
        },
        {
            title: '账户名',
            dataIndex: 'personPhone',
            ellipsis: true,
        },
        {
            title: '备注',
            dataIndex: 'remark',
            ellipsis: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <Space size="small">
                    <Button type="primary" onClick={()=>{history.push(`/warehouse/editSupplier?id=${record.id}`)}}>编辑</Button>
                    <Button type="primary" danger onClick={()=>isDel(record)}>删除</Button>
                </Space>
            ),
        },
    ];
    const toadd=()=>{
        history.push('/warehouse/addSupplier');
    };
    const isDel=(record:any)=>{
        setUid(record.id);
        setDopen(true);
    };
    // 获取列表
    const getList=()=>{
        props.dispatch({
            type:"Supplier/fetch",
            payload:{page, supplierName, personName, personPhone, pageSize}
        })
    };
    // 分页信息
    const getFenye=()=>{
        props.dispatch({
            type:"Supplier/fenye",
            payload:{supplierName, personName, personPhone, pageSize}
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
    const sousuo=()=>{
        setPage(1);
        getList();
    };
    const changeSupplierName=(e)=>{
        setSupplierName(e.target.value);
        updateSessionStorage('/warehouse/supplier','supplierName',e.target.value);
    };
    const changePersonName=(e)=>{
        setPersonName(e.target.value);
        updateSessionStorage('/warehouse/supplier','personName',e.target.value);
    };
    const changePersonPhone=(e)=>{
        setPersonPhone(e.target.value);
        updateSessionStorage('/warehouse/supplier','personPhone',e.target.value);
    };
    const onOK=()=>{
      setSpinning(true);
      props.dispatch({
          type:"Supplier/remove",
          payload:uid
      }).then((res:TypeErrorCode)=>{
          if (res.ErrorCode == 0) {
            message.success('删除成功');
            setDopen(false);
            setSpinning(false);
          } else {
            message.error(res.ErrorCode + res.Data);
            setSpinning(false);
          }
      })
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Button type="primary" onClick={toadd}>
                            新增供应商
                        </Button>
                    </Space>
                    <Space>
                        <Input
                            addonBefore="供应商名称:"
                            value={supplierName}
                            onChange={changeSupplierName}
                        />
                        <Input
                            addonBefore="账户名:"
                            value={personPhone}
                            onChange={changePersonPhone}
                        />
                        <Input
                            addonBefore="账户:"
                            value={personName}
                            onChange={changePersonName}
                        />
                        <Button type="primary" onClick={sousuo}>搜索</Button>
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
            <Modal open={dopen} loading={spinning} title='确认删除吗？' onOk={onOK} onCancel={()=>setDopen(false)}>

            </Modal>
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.Supplier.list,
    count: state.Supplier.count,
});

export default connect(mapStateToProps)(Supplier);
