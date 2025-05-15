import {Button, Form, Image, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {connect} from 'umi';
import * as AppUserService from '@/services/appUser';
import {useEffect, useState} from "react";
import {qxTree} from '@/constants/qxMenu/wxMenu'
import {buildTree, ensureArrayLength} from "@/utils/OpenTool";

const Wcxuserlist=(props:any)=>{
    const treeData = buildTree(qxTree);
    const [isSpinning,setIsSpinning]=useState(false);
    const [page,setPage]=useState(1);
    const [pageSize,setpageSize]=useState(50);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    // 弹窗
    const [isOpen,setIsOpen]=useState(false);
    const [selected, setSelected] = useState<string[]>(Array(372).fill('0'));
    const [appid,setAppid]=useState(0);
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
            title: '用户手机号',
            dataIndex: 'appUser_phone',
            key: 'appUser_phone',
        },
        {
            title: '余额(元)',
            dataIndex: 'balance',
            key: 'balance',
        },
        {
            title: '账单(元)',
            dataIndex: 'billMoney',
            key: 'billMoney',
        },
        {
            title: '积分',
            dataIndex: 'integral',
            key: 'integral',
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
        setPage(1);
        getList();
        logFenye()
    };
    const getList=()=>{
        props.dispatch({
            type:'AppUser/fetch',
            payload:{page,name,phone,pageSize}
        });
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"AppUser/fenye",
            payload:{name,phone,pageSize}
        })
    };
    // 监听页数
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setpageSize(pageSize);
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    // 弹窗信息
    const editInfo=(vla:any)=>{
        setAppid(vla.id);
        setIsOpen(true);
        getOne(vla.id);
    };
    // 获取小程序信息详情
    const getOne=(id:number)=>{
        AppUserService.one(id).then((res:any)=>{
            if (res.ErrorCode==0){
                const authorityString = res.Data.authority;
                const splitArray = authorityString.split('');
                const adjustedArray = ensureArrayLength(splitArray, selected.length, '0');
                setSelected(adjustedArray);
            }else{
                message.error(res.Data);
            }
        })
    };
    // 确定编辑权限
    const onOk=()=>{
        let joinqx=selected.join('');
        setIsSpinning(true);
        props.dispatch({
            type:'AppUser/edit',
            payload:{appid,joinqx}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                setIsSpinning(false);
                setIsOpen(false);
            }else {
                message.error(res.Data);
                setIsOpen(false);
                setIsSpinning(false);
            }
        })
    };
    const TreeMenu=({ tree, selected,disabled, setSelected }: { tree: qxTree[]; selected: string[]; setSelected: (newSelected: string[]) => void })=> {
        return (
            <ul>
                {tree.map(node => (
                    <li key={node.id}>
                        <input
                            type="checkbox"
                            checked={selected[node.id] === '1'}
                            onChange={e => handleCheckboxChange(node.id, e.target.checked)}
                        />
                        {node.name}
                        {node.children && node.children.length > 0 && (
                            <TreeMenu tree={node.children} selected={selected} setSelected={setSelected} />
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
        <Spin spinning={isSpinning}>
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
                scroll={{y:'60vh'}}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
                summary={(columns) => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell
                                index={1}
                            >
                                统计
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                                总人数:{props.count?props.count.count:''}人
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>
                                {props.count?props.count.balanceSum:''}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={7}>
                                {props.count?props.count.billMoneySum:''}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>
                                {props.count?props.count.integralSum:''}分
                            </Table.Summary.Cell>

                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            {/*编辑权限弹窗*/}
            <Modal open={isOpen} title={'编辑权限'} onCancel={()=>setIsOpen(false)} onOk={onOk} loading={isSpinning}>
                <Space>
                    <Button type='primary' onClick={()=>setSelected(Array(372).fill('1'))}>全选</Button>
                    <Button type='primary' onClick={()=>setSelected(Array(372).fill('0'))}>反选</Button>
                </Space>
                <TreeMenu tree={treeData} selected={selected} setSelected={setSelected} />
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        AppUserList: state.AppUser.list,
        count: state.AppUser.count
    }
};

export default connect(mapStateToProps) (Wcxuserlist)