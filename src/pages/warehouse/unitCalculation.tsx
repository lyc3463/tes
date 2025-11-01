import {Button, Input, List, message, Pagination, Space, Spin, Table} from "antd";
import {useEffect, useState} from "react";
import {history,connect} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const UnitCalculation=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState('');// 换算名称
    const [uid,setUid]=useState(0);
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

    };
    const onChange=(page,pageSize)=>{
        setPage(page);
        setPageSize(pageSize);
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
                        />
                        <Button type="primary">
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
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.UnitCalculation.list,
    count: state.UnitCalculation.count,

});
export default connect(mapStateToProps) (UnitCalculation);
