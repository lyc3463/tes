import {Table, Tag, Space, Button, List, Input, Image, Pagination, Modal, message, Spin} from 'antd';
import {useEffect, useState} from 'react';
import {history,connect} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const ThingList = (props) => {
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [code,setCode]=useState('');
    const [name,setName]=useState('');
    const [uid,setUid]=useState(0);
    const [visible,setVisible]=useState(false);
    const [spinning,setSpinning]=useState(false);
    // 表格列配置
    const columns = [
        {
            title: '物品图片',
            dataIndex: 'productsImageBase64',
            ellipsis: true,
            render: (text: string) => (
                <Image src={text} style={{width:'50px',height:'50px'}}/>
            ),
        },
        {
            title: '物品名称',
            dataIndex: 'productsName',
            ellipsis: true,
        },
        {
            title: '物品编码',
            dataIndex: 'productsCode',
            ellipsis: true,
        },
        {
            title: '助查码',
            dataIndex: 'abbreviation',
            ellipsis: true,
        },
        {
            title: '品牌方',
            dataIndex: 'brandName',
            ellipsis: true,
        },
        {
            title: '成本价',
            dataIndex: 'costPrice',
            ellipsis: true,
        },
        {
            title: '零售控价',
            dataIndex: 'presalePrice',
            ellipsis: true,
        },
        {
            title: '零售价',
            dataIndex: 'retailPricce',
            ellipsis: true,
        },
        {
            title: '预警库存数',
            dataIndex: 'number',
            ellipsis: true,
        },
        {
            title: '条码',
            dataIndex: 'barcode',
            ellipsis: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <Space size="small">
                    <Button type="primary" onClick={()=>{history.push(`/warehouse/editThingList?id=${record.id}`)}}>编辑</Button>
                    <Button type="primary" danger onClick={()=>onDelOpen(record)}>删除</Button>
                </Space>
            ),
        },
    ];
    const toAdd=()=>{
        history.push('/warehouse/addThingList');
    };
    const getList=()=>{
        props.dispatch({
            type:'ThingList/fetch',
            payload:{page, pageSize, code, name},
        })
    };
    const getFenye=()=>{
        props.dispatch({
            type:'ThingList/fenye',
            payload:{pageSize, code, name},
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getFenye();
    }, []);
    // 监听页数
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const onDelOpen=(e)=>{
      setUid(e.id);
      setVisible(true);
    };
    const onOK=()=>{
        setSpinning(true);
        props.dispatch({
            type:'ThingList/remove',
            payload:uid,
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setSpinning(false);
                setVisible(false);
            }else {
                message.error('删除失败'+res.ErrorCode+res.Data);
                setSpinning(false);
                setVisible(false);
            }
        })
    };
    return (
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Button type="primary" onClick={toAdd}>
                            新增物品
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
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal open={visible} onCancel={()=>setVisible(false)} onOk={onOK} title={'删除物品'} loading={spinning}>
                <p>确定删除物品吗？</p>
            </Modal>
        </Spin>
    );
};
const mapStateToProps = (state: any) => ({
    list: state.ThingList.list,
    count: state.ThingList.count,
});
export default connect(mapStateToProps)(ThingList);
