import {Button, Form, Image, Input, List, message, Modal, Pagination, Select, Space, Table, Tag} from "antd";
import {connect} from 'umi'
import {useEffect, useState} from "react";
import {wxTree} from '@/constants/qxMenu/wxMenu'
import {buildTree} from "@/utils/OpenTool";
import {StaticInfo} from "@/StaticInfo";
import {val} from "@umijs/utils/compiled/cheerio/lib/api/attributes";

let qxList=StaticInfo.uqx;
let authArr =qxList.split('').map(Number);
const Wcxuserlist=(props:any)=>{
    const treeData = buildTree(wxTree);
    const [page,setPage]=useState(1);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    // 弹窗
    const [isOpen,setIsOpen]=useState(false);
    const [selected, setSelected] = useState<string[]>(Array(299).fill('0'));
    const [openID,setOpenID]=useState('');
    const columns =[
        {
            title: '用户头像',
            dataIndex: 'appUser_image',
            key: 'appUser_image',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        <Image src={text} style={{width:"50px",height:'50px'}}/>
                    </div>
                )
            }
        },
        {
            title: '微信呢称',
            dataIndex: 'appUser_name',
            key: 'appUser_name',
        },
        {
            title: '微信号',
            dataIndex: 'appUser_account',
            key: 'appUser_account',
        },
        {
            title: '用户手机号',
            dataIndex: 'appUser_phone',
            key: 'appUser_phone',
        },
        {
            title: '余额',
            dataIndex: 'appUser_balance',
            key: 'appUser_balance',
        },
        {
            title: '账单',
            dataIndex: 'appUser_bill',
            key: 'appUser_bill',
        },
        {
            title: '积分',
            dataIndex: 'appUser_integral',
            key: 'appUser_integral',
        },
        {
            title: '状态',
            dataIndex: 'appUserStatus',
            key: 'appUserStatus',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.appUserStatus==1?<Tag color='green'>已绑定</Tag>:<Tag color='red'>未绑定</Tag>}
                    </div>
                )
            }

        },
        {
            title: '是否实名',
            dataIndex: 'is_name',
            key: 'is_name',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.is_name==1?<Tag color='green'>已实名</Tag>:<Tag color='red'>未实名</Tag>}
                    </div>
                )
            }
        },
        {
            title: '权限',
            dataIndex: 'qx',
            key: 'qx',
            render:(text:any,record:any,)=>{
                return(
                    <Button type='link' onClick={()=>editInfo(record)}>详情</Button>
                )
            }
        },
    ];

    // 监听手机号
    const changePhone=(e)=>{
        setPhone(e.target.value)
    };
    // 监听名字
    const changeName=(e)=>{
        setName(e.target.value)
    };
    // 搜索按钮
    const shousuo=()=>{
        props.dispatch({
            type:'AppUser/fetch',
            payload:{page,name,phone}
        })
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"AppUser/fetch",
            payload:{page,name,phone}
        })
    };
    // 监听页数
    const onChange=(page)=>{
        setPage(page);
        logFenye();
    };
    useEffect(() => {
    }, [page]);
    // 弹窗信息
    const editInfo=(vla:any)=>{
        setOpenID(vla.openId);
        setIsOpen(true);
    };
    // 确定编辑权限
    const onOk=()=>{
        let joinqx=selected.join('');
        props.dispatch({
            type:'AppUser/edit',
            payload:{openID,joinqx}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                setIsOpen(false);
            }else {
                message.error(res.Data);
            }
        })
    };
    const TreeMenu=({ tree, selected,disabled, setSelected }: { tree: wxTree[]; selected: string[];disabled:number[], setSelected: (newSelected: string[]) => void })=> {
        return (
            <ul>
                {tree.map(node => (
                    <li key={node.id}>
                        <input
                            type="checkbox"
                            disabled={disabled[node.id]==0}
                            checked={selected[node.id] === '1'}
                            onChange={e => handleCheckboxChange(node.id, e.target.checked)}
                        />
                        {node.name}
                        {node.children && node.children.length > 0 && (
                            <TreeMenu tree={node.children} selected={selected} disabled={disabled} setSelected={setSelected} />
                        )}
                    </li>
                ))}
            </ul>
        );
    };
    const handleCheckboxChange=(id: number, isChecked: boolean) =>{
        // 创建一个新的数组来存储新的选中状态
        let newSelected = [...selected];
        // 更新指定 ID 的节点的选中状态
        newSelected[id] = isChecked ? '1' : '0';
        // 设置新的选中状态
        setSelected(newSelected);
    };
    return(
        <div>
            <List style={{backgroundColor:'#f5f5f5',padding:'10px',marginBottom:"20px",border:'1px solid #e3e3e3',borderRadius:'4px'}}>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="手机号:"
                            onChange={changePhone}
                        />
                        <Input
                            addonBefore="姓名:"
                            onChange={changeName}
                        />
                        <Button type="primary" onClick={shousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                dataSource={props.AppUserList}
                size='small'
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            {/*编辑权限弹窗*/}
            <Modal open={isOpen} title={'编辑权限'} onCancel={()=>setIsOpen(false)} onOk={onOk}>
                <TreeMenu tree={treeData} selected={selected} disabled={authArr}  setSelected={setSelected} />
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        AppUserList: state.AppUser.list,
        count: state.AppUser.count
    }
};

export default connect(mapStateToProps) (Wcxuserlist)