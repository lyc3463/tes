import {Button, Form, Input, List, message, Modal, Select, Space, Table} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import * as CompanService from "@/services/compan";
import {StaticInfo} from "@/StaticInfo";

const AccountList=(props:any)=>{
    const [uid,setUid]=useState(0);
    const [isDeleteOpen,setIsDeleteOpen]=useState(false);
    const [name,setName]=useState(sessionStorage.getItem('financeManageAccountListName')||'');
    const [account_type,setAccount_type]=useState(2);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns =[
        {
            title: '账户名称',
            dataIndex: 'account_name',
            key: 'account_name',
        },
        {
            title: '公司',
            dataIndex: 'company_name',
            key: 'company_name',
        },
        {
            title: '项目',
            dataIndex: 'project_name',
            key: 'project_name',
        },
        {
            title: '余额(元)',
            dataIndex: 'balance',
            key: 'balance',
        },
        {
            title: '账户类型',
            dataIndex: 'account_type',
            key: 'account_type',
            render:(text:any,record:any)=>{
                return(
                    <div>{record.account_type==1? <div>公账</div>: <div>私账</div>}</div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render:(text:any,record:any)=>{
                return(
                    <Space>
                        {uqx[159]=='1'?<Button type='primary' onClick={()=>{toedit(record.id)}}>编辑</Button>:''}
                        {uqx[160]=='1'?<Button type='primary' danger onClick={()=>isDelete(record.id)}>删除</Button>:''}
                    </Space>
                )
            }
        }
    ]
    const toadd=()=>{
        history.push('/financeManage/addAccountList')
    };
    const toedit=(e:number)=>{
        history.push(`/financeManage/editAccountList?id=${e}`)
    };
    // 删除的弹窗
    const isDelete=async (e:number)=>{
        setUid(e);
        setIsDeleteOpen(true);
    };
    const determineDelete=()=>{
        props.dispatch({
            type:'Account/remove',
            payload:uid
        }).then((res)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setIsDeleteOpen(false);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 列表
    const getList=()=>{
        props.dispatch({
            type:'Account/fetch',
            payload:{name,account_type}
        })
    };
    useEffect(() => {
        getList();
    }, []);

    // 搜索按钮
    const sousuo=()=>{
        getList()
    };
    // 监听类型变换
    const changeType=(e)=>{
      setAccount_type(e);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const changeName=(e)=>{
        setName(e.target.value);
        sessionStorage.setItem('financeManageAccountListName',e.target.value);
    };
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        {uqx[158]=='1'?
                            <Button type="primary"  onClick={toadd}>
                                添加账户
                            </Button>
                            :''}
                    </div>
                    <Space>
                        <Input
                            addonBefore="账户名称:"
                            onChange={changeName}
                            value={name}
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
                                onChange={changeType}
                                defaultValue={account_type}
                                style={{ width: 120 }}
                                options={[
                                    { value:2, label: '全部' },
                                    { value:1, label: '公账' },
                                    { value:0, label: '私账' },
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
                rowKey={(columns) => columns.id}
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                size='small'
                dataSource={props.AccountList}
            />
            {/*删除的弹窗*/}
            <Modal open={isDeleteOpen} onOk={determineDelete} onCancel={()=>setIsDeleteOpen(false)}>
                <div>确定要删除吗？</div>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        AccountList: state.Account.list
    }
};
export default connect(mapStateToProps) (AccountList)