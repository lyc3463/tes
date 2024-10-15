import {Button, DatePicker, Image, Input, List, Space, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect} from "react";

const Role=(props)=>{
    const columns =[
        {
            title: '角色名称',
            dataIndex: 'role_name',
            key: 'role_name',
        },
        {
            title: '操作',
            dataIndex: 'caozuo',
            key: 'caozuo',
            render:(text:any,record:any,)=>{
                return(
                   <Space>
                       <Button type='link' onClick={()=>toedit(record.id)}>编辑</Button>
                       <Button type='link'>删除</Button>
                   </Space>
                )
            }
        },
    ];
    const toadd=()=>{
        history.push('/systemManage/addRole')
    };
    const toedit=(e)=>{
        history.push(`/systemManage/editRole?id=${e}`)
    };

    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            添加角色
                        </Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="角色名称:"
                        />
                        <Button type="primary">
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                rowKey={(columns) => columns.id}
                columns={columns}
                size='small'
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                dataSource={props.RoleList}
            />
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        RoleList: state.Role.list,
    }
};
export default connect(mapStateToProps) (Role)