import {
    Button,
    Form,
    Image,
    Input,
    InputNumber,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag
} from "antd";
import {connect,history} from 'umi';
import * as AppUserService from '@/services/appUser';
import {useEffect, useState} from "react";
import {qxTree} from '@/constants/qxMenu/wxMenu'
import {
    buildTree,
    checkSessionStorage,
    ensureArrayLength,
    exportDataToExcel,
    updateSessionStorage
} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
const Wcxuserlist=(props:any)=>{
    const treeData = buildTree(qxTree);
    const [isSpinning,setIsSpinning]=useState(false);
    const [page,setPage]=useState(1);
    const [balance,setbalance]=useState(checkSessionStorage('/kehu/wcxuserlist/','balance')||0);
    const [pageSize,setpageSize]=useState(50);
    const [name,setName]=useState(checkSessionStorage('/kehu/wcxuserlist/','name')||'');
    const [phone,setPhone]=useState(checkSessionStorage('/kehu/wcxuserlist/','phone')||'');
    const [uqx,setUqx]=useState([]);
    // 弹窗
    const [isOpen,setIsOpen]=useState(false);
    const [selected, setSelected] = useState<string[]>(Array(562).fill('0'));
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
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.balance.toFixed(2)}元
                    </div>
                )
            }
        },
        {
            title: '账单(元)',
            dataIndex: 'billMoney',
            key: 'billMoney',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.billMoney.toFixed(2)}元
                    </div>
                )
            }
        },
        {
            title: '积分',
            dataIndex: 'integral',
            key: 'integral',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.integral.toFixed(2)}元
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
                    <Space>
                        <Button type='primary' onClick={()=>editInfo(record)}>详情</Button>
                        {/*<Button type='primary' onClick={()=>toChangePark(record)}>更改园区</Button>*/}
                    </Space>

                )
            }
        },
    ];
    // 监听手机号
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/kehu/wcxuserlist/','phone',e.target.value);
    };
    // 监听名字
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/kehu/wcxuserlist/','name',e.target.value);
    };
    const toChangePark=(e)=>{
      history.push(`/kehu/changePark?id=${e.id}`);
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
            payload:{page,name,phone,pageSize,balance}
        });
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"AppUser/fenye",
            payload:{name,phone,pageSize,balance}
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
        console.log('joinqx',joinqx);
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
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        logFenye();
    }, []);
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
    const  handleCheckboxChange=(id: number, isChecked: boolean)=> {
        // 创建一个新的数组来存储新的选中状态
        let newSelected = [...selected];
        // 更新指定 ID 的节点的选中状态
        newSelected[id] = isChecked ? '1' : '0';
        if (id === 190 ) {
            newSelected[209] = '1' ;
            newSelected[263] ='1';
        }
        if (id === 275 ) {
            newSelected[272] ='1';
        }
        if (id === 271 ) {
            newSelected[268] = '1';
            newSelected[404] = '1';
            newSelected[269] = '1';
        }
        if (id === 392 ) {
            newSelected[176] ='1';
        }
        if (id === 369 ) {
            newSelected[366] ='1';
            newSelected[368] ='1';
            newSelected[367] ='1';
            newSelected[365] ='1';
        }
        if (id === 186 ) {
            newSelected[307] ='1';
            newSelected[307] ='1';
        }
        if (id === 363 ) {
            newSelected[366] ='1';
            newSelected[364] ='1';
        }
        if (id === 225 ) {
            newSelected[285] ='1';
        }
        if (id === 230 ) {
            newSelected[285] ='1';
        }
        if (id === 233 ) {
            newSelected[285] ='1';
        }
        if (id === 236 ) {
            newSelected[285] ='1';
        }
        if (id === 239 ) {
            newSelected[239] ='1';
        }
        if (id === 60 ) {
            newSelected[61] ='1';
            newSelected[355] ='1';
            newSelected[347] ='1';
            newSelected[336] ='1';
            newSelected[413] ='1';
            newSelected[400] ='1';
            newSelected[435] ='1';
        }
        if (id === 399 ) {
            newSelected[421] ='1';
            newSelected[422] ='1';
            newSelected[423] ='1';
            newSelected[424] ='1';
            newSelected[404] ='1';
        }
        if (id === 110 ) {
            newSelected[111] ='1';
        }
        if (id === 426 ) {
            newSelected[427] ='1';
            newSelected[428] ='1';
            newSelected[429] ='1';
            newSelected[430] ='1';
        }
        // 设置新的选中状态
        setSelected(newSelected);
    };
    const changeBalance=(value)=>{
        // 确保值不小于 0
        const newValue = value !== undefined ? Math.max(value, 0) : 0;
        setbalance(newValue);
        updateSessionStorage('/kehu/wcxuserlist/','balance',newValue);
    };
    const exportToExcel=()=>{
        setIsSpinning(true);
        AppUserService.fetch({page:1,name,phone,pageSize:100000,balance}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let headers=['微信昵称','用户手机号','余额(元)','账单(元)','积分'];
                const ws_data = [
                    headers.map(header => ({ v: header, t: 's' })), // 表头
                    ...res.Data.map(item => [
                        item.appUser_name,
                        item.appUser_phone,
                        item.balance.toFixed(2),
                        item.billMoney.toFixed(2),
                        item.integral.toFixed(2),
                    ].map(value => ({ v: value, t: typeof value === 'number' ? 'n' : 's' }))) // 数据行，根据值类型设置单元格类型
                ];
                exportDataToExcel(ws_data);
                setIsSpinning(false);
            }else {
                message.error(res.Data);
                setIsSpinning(false);
            }
        })
    };
    return(
        <Spin spinning={isSpinning}>
            <List style={{backgroundColor:'#f5f5f5',padding:'10px',marginBottom:"20px",border:'1px solid #e3e3e3',borderRadius:'4px'}}>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="手机号:"
                            onChange={changePhone}
                            value={phone}
                        />
                        <Input
                            addonBefore="姓名:"
                            onChange={changeName}
                            value={name}
                        />
                        <InputNumber
                            addonBefore="余额:"
                            onChange={changeBalance}
                            min={0}
                            value={balance}
                        />
                        <Button type="primary" onClick={shousuo}>
                            搜索
                        </Button>
                        {uqx[375]=='1'?<Button type="primary" onClick={exportToExcel}>导出</Button> :''}
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
                                {props.count?props.count.balanceSum.toFixed(2):''}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={7}>
                                {props.count?props.count.billMoneySum.toFixed(2):''}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>
                                {props.count?props.count.integralSum.toFixed(2):''}分
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            {/*编辑权限弹窗*/}
            <Modal open={isOpen} title={'编辑权限'} onCancel={()=>setIsOpen(false)} onOk={onOk} loading={isSpinning}>
                <Space>
                    <Button type='primary' onClick={()=>setSelected(Array(562).fill('1'))}>全选</Button>
                    <Button type='primary' onClick={()=>setSelected(Array(562).fill('0'))}>反选</Button>
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