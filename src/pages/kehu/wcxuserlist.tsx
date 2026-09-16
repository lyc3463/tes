import {Button, Image, Input, InputNumber, List, message, Modal, Pagination, Space, Spin, Table} from "antd";
import {connect,history} from 'umi';
import * as AppUserService from '@/services/appUser';
import {useCallback, useEffect, useRef, useState} from "react";
import {qxTree} from '@/constants/qxMenu/wxMenu';
import {buildTree, checkSessionStorage, ensureArrayLength, exportDataToExcel, updateSessionStorage} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
const checkboxRelationMap = {
    190: [209, 263],
    275: [272],
    271: [268, 404, 269],
    392: [176],
    369: [366, 368, 367, 365],
    186: [307],
    363: [366, 364],
    225: [285],
    230: [285],
    233: [285],
    236: [285],
    239: [239],
    60: [61, 355, 347, 336, 413, 400, 435],
    399: [421, 422, 423, 424, 404],
    110: [111],
    426: [427, 428, 429, 430],
};
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
    const [loadedImageIds, setLoadedImageIds] = useState<Set<string>>(new Set());
    // 行ref数组
    const rowRefs = useRef<HTMLDivElement[]>([]);
    // 交叉观察器实例
    const observerRef = useRef<IntersectionObserver | null>(null);
    const columns =[
        {
            title: '微信头像',
            dataIndex: 'userImage',
            key: 'userImage',
            ellipsis: true,
            render: (text: string, record: any) => {
                const isImageLoaded = loadedImageIds.has(record.userId.toString());
                let imageUrl = '';
                if (isImageLoaded && text) {
                    const textStr = String(text || '');
                    imageUrl = textStr && textStr.endsWith('.png')
                        ? `${window.ServerConfig.imgServer}${textStr}`
                        : `${window.ServerConfig.imgServer}${textStr}_min.png`;
                }
                // 改用原生 img 标签（保留 AntD 的样式和 fallback 逻辑）
                return (
                    <div style={{width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Image
                            src={imageUrl || 'https://placeholder.pics/svg/50x50/EEEEEE/999999/加载中...'}
                            style={{width: '100%', height: '100%', objectFit: 'cover'}}
                            alt="物品图片"
                            // 原生懒加载属性（正确用法：字符串值 'lazy'）
                            loading="lazy"
                            // fallback 逻辑：图片加载失败时显示占位图
                            onError={(e) => {
                                e.target.src = 'https://placeholder.pics/svg/50x50/EEEEEE/999999/暂无图片';
                            }}
                        />
                    </div>
                );
            }
        },
        {
            title: '微信呢称',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: '用户手机号',
            dataIndex: 'phone',
            key: 'phone',
        },
        // {
        //     title: '余额(元)',
        //     dataIndex: 'balance',
        //     key: 'balance',
        //     render:(text:any,record:any,)=>{
        //         return(
        //             <div>
        //                 {record.balance.toFixed(2)}元
        //             </div>
        //         )
        //     }
        // },
        // {
        //     title: '账单(元)',
        //     dataIndex: 'billMoney',
        //     key: 'billMoney',
        //     render:(text:any,record:any,)=>{
        //         return(
        //             <div>
        //                 {record.billMoney.toFixed(2)}元
        //             </div>
        //         )
        //     }
        // },
        // {
        //     title: '积分',
        //     dataIndex: 'integral',
        //     key: 'integral',
        //     render:(text:any,record:any,)=>{
        //         return(
        //             <div>
        //                 {record.integral.toFixed(2)}元
        //             </div>
        //         )
        //     }
        // },
        // {
        //     title: '权限',
        //     dataIndex: 'qx',
        //     key: 'qx',
        //     render:(text:any,record:any,)=>{
        //         return(
        //             <Space>
        //                 <Button type='primary' onClick={()=>editInfo(record)}>详情</Button>
        //                 {/*<Button type='primary' onClick={()=>toChangePark(record)}>更改园区</Button>*/}
        //             </Space>

        //         )
        //     }
        // },
    ];
    // 监听数据变化，重置图片加载状态
    useEffect(() => {
        setLoadedImageIds(new Set());
        // 初始化交叉观察器
        initObserver();
    }, []);
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
    // 搜索按钮
    const shousuo=()=>{
        setPage(1);
        getList();
        console.log('props',props);
        
    };
    const getList=()=>{
        props.dispatch({
            type:'AppUser/fetch',
            payload:{page,name,phone,pageSize,balance}
        });
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
        setAppid(vla.userId);
        setIsOpen(true);
        const authorityString = vla.authority;
        const splitArray = authorityString.split('');
        const adjustedArray = ensureArrayLength(splitArray, selected.length, '0');
        setSelected(adjustedArray);
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
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
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
    const handleCheckboxChange = (id: number, isChecked: boolean) => {
        const newSelected = [...selected];
        // 设置当前项
        newSelected[id] = isChecked ? '1' : '0';
        // 如果当前是勾选，才自动关联其他选项
        if (isChecked && checkboxRelationMap[id]) {
            checkboxRelationMap[id].forEach(relatedId => {
                newSelected[relatedId] = '1';
            });
        }
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
                let headers=['微信昵称','用户手机号'];
                const ws_data = [
                    headers.map(header => ({ v: header, t: 's' })), // 表头
                    ...res.Data.map(item => [
                        item.appUser_name,
                        item.appUser_phone,
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
    // 初始化交叉观察器：检测行是否进入可视区域
    const initObserver = useCallback(() => {
        // 销毁旧的观察器
        if (observerRef.current) {
            observerRef.current.disconnect();
        }
        // 创建新的观察器：元素进入可视区域时加载图片
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const rowId = entry.target.dataset.rowId;
                        if (rowId && !loadedImageIds.has(rowId)) {
                            // 标记为已加载，触发重新渲染
                            setLoadedImageIds(prev => new Set(prev).add(rowId));
                        }
                    }
                });
            },
            {
                root: document.querySelector('.ant-table-body'), // 表格滚动容器
                rootMargin: '20px', // 提前20px加载（预加载）
                threshold: 0.1 // 元素10%进入可视区域时触发
            }
        );
        // 观察所有行元素
        rowRefs.current.forEach((rowEl) => {
            if (rowEl) {
                observerRef.current?.observe(rowEl);
            }
        });
    }, [loadedImageIds]);
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
                rowKey={(columns) => columns.userId}
                pagination={false}
                dataSource={props.AppUserList}
                size='small'
                scroll={{y:'60vh'}}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
                onRow={(record, index) => ({
                    ref: (el) => {
                        if (el) {
                            el.dataset.rowId = record.userId; // 存储行ID
                            rowRefs.current[index] = el;
                            // 观察该行元素
                            observerRef.current?.observe(el);
                        }
                    },
                })}
                // summary={(columns) => (
                //     <Table.Summary fixed>
                //         <Table.Summary.Row>
                //             <Table.Summary.Cell
                //                 index={1}
                //             >
                //                 统计
                //             </Table.Summary.Cell>
                //             <Table.Summary.Cell index={0}>
                //                 总人数:{props.count?props.count.count:''}人
                //             </Table.Summary.Cell>
                //             <Table.Summary.Cell index={0}>
                //             </Table.Summary.Cell>
                //             <Table.Summary.Cell index={5}>
                //                 {props.count?props.count.balanceSum.toFixed(2):''}元
                //             </Table.Summary.Cell>
                //             <Table.Summary.Cell index={7}>
                //                 {props.count?props.count.billMoneySum.toFixed(2):''}元
                //             </Table.Summary.Cell>
                //             <Table.Summary.Cell index={6}>
                //                 {props.count?props.count.integralSum.toFixed(2):''}分
                //             </Table.Summary.Cell>
                //         </Table.Summary.Row>
                //     </Table.Summary>
                // )}
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