import {Button, DatePicker, Input, List, Pagination, Select, Space, Spin, Table} from "antd";
import dayjs from "dayjs";
import {connect, history} from "umi";
import {useEffect, useState} from "react";

const Supplier=(props)=>{
    const [spinning, setSpinning] = useState(false);
    const [page,setPage]=useState(1);
    const [supplierName,setSupplierName]=useState('');
    const [personName,setPersonName]=useState('');
    const [personPhone,setPersonPhone]=useState('');
    const [pageSize,setPageSize]=useState(50);
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
            title: '联系人',
            dataIndex: 'personName',
            ellipsis: true,
        },
        {
            title: '联系电话',
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
                    <Button type="primary" danger>删除</Button>
                </Space>
            ),
        },
    ];
    const toadd=()=>{
        history.push('/warehouse/addSupplier');
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
                        />
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
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.Supplier.list,
    count: state.Supplier.count,
});

export default connect(mapStateToProps)(Supplier);
