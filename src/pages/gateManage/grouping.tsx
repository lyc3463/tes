import {connect,history} from "umi";
import {Button, Input, List, Space, Table} from "antd";
import {useEffect, useState} from "react";
import {StaticInfo} from "@/StaticInfo";

const Grouping=(props)=>{
    const [name,setName]=useState('');
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns = [
        {
            title: '分组名称',
            dataIndex: 'groupName',
        },
        {
            title: '操作',//简单常用操作放这里，复杂放详情
            dataIndex: 'operation',
            render: (text: any, record: any) => (
                <Space>
                    {uqx[305]=='1'?<Button type="primary" onClick={()=>toEdit(record.id)}>编辑</Button> :''}
                    {uqx[306]=='1'?<Button type="primary" danger>删除</Button> :''}
                </Space>
            ),
        },
    ];
    const toadd=()=>{
        history.push('/gateManage/addGrouping')
    };
    const toEdit=(e:any)=>{
        history.push(`/gateManage/editGrouping?id=${e}`)
    };
    const sousuo=()=>{
        props.dispatch({
            type:'Grouping/fetch',
            payload:{name}
        })
    };
    useEffect(() => {
        sousuo();
    }, []);
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        {uqx[304]=='1'?<Button type="primary" onClick={toadd}>新增下发分组</Button> :''}
                    </div>
                    <Space>
                        <Input
                            addonBefore="分组名称:"
                            onChange={(e)=>setName(e.target.value)}
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
                dataSource={props.GroupingList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        GroupingList: state.Grouping.list
    }
};
export default connect(mapStateToProps) (Grouping)