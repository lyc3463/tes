import {Button, Form, Input, List, Select, Space, Table} from "antd";
import {history,connect} from 'umi'
import {useEffect} from "react";
const UserManage=(props:any)=>{
    const columns =[
        {
            title: '用户姓名',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: '联系方式',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render:(text:any,record:any)=>{
                return(
                    <div>
                       {/*<Button type='link'>删除</Button>*/}
                       <Button type='link' onClick={()=>toEdit(record.id)}>编辑</Button>
                    </div>
                )
            }
        }
    ];
    const toadd=()=>{
        history.push('/systemManage/addUser/')
    };
    const toEdit=(e:number)=>{
        history.push(`/systemManage/editUser?id=${e}`)
    };
    useEffect(() => {
        console.log(props)
    }, []);
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            添加管理员
                        </Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="手机号码:"
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
                dataSource={props.UsersList}
            />
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        UsersList: state.Users.list,
    }
};
export default connect(mapStateToProps) (UserManage)