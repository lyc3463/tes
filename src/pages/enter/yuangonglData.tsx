import {
    Button,
    DatePicker,
    Descriptions,
    Image,
    Input,
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
import {history,connect} from "umi";
import {useCallback, useEffect, useRef, useState, type ChangeEvent} from "react";
import dayjs from "dayjs";
import {checkSessionStorage, compressBase64, updateSessionStorage} from "@/utils/OpenTool";
import {StaticInfo} from "@/StaticInfo";
import type { EmployeeRecord, EmployeeResponse } from '@/ModelTypes/TypeEmp';

interface YuangonglProps {
    EmpList: EmployeeRecord[];
    count?: EmployeeResponse;
    dispatch: (action: { type: string; payload?: any }) => any;
}

const YuangonglData=(props: YuangonglProps)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 审核状态 0全部  1未审核 2已审核
    const [stutes,setStutes]=useState(1);
    // 姓名
    const [cname,setCname]=useState(checkSessionStorage('/enter/yuangonglData/','cname')||'');
    // 昵称
    const [nickname,setNickname]=useState(checkSessionStorage('/enter/yuangonglData/','nickname')||'');
    // 手机号
    const [phone,setPhone]=useState(checkSessionStorage('/enter/yuangonglData/','phone')||'');
    const [companyName,setcompanyName]=useState(checkSessionStorage('/enter/yuangonglData/','companyName')||'');
    const [tenantId,setTenantId]=useState(0);
    // 唯一ID
    const [uid,setUid]=useState(0);
    // 删除的名称
    const [uname,setUname]=useState('');
    const [spinning,setspinning]=useState(false);
    const [isOpen,setIsOpen]=useState(false);
    const [delRecord,setDelRecord]=useState<EmployeeRecord | null>(null);
    // 用户权限
    const [uqx,setUqx]=useState<string[]>([]);
    const [loadedImageIds, setLoadedImageIds] = useState<Set<string>>(new Set());
    // 行ref数组
    const rowRefs = useRef<HTMLDivElement[]>([]);
    // 交叉观察器实例
    const observerRef = useRef<IntersectionObserver | null>(null);
    const columns =[
        {
            title: '登记日期',
            dataIndex: 'begintime',
            key: 'begintime',
            render:(text:any,record:EmployeeRecord,)=>{
                return(
                    <div>
                        {dayjs(record.begintime).format('YYYY-MM-DD')}
                    </div>
                )
            }
        },
        {
            title: '到期时间',
            dataIndex: 'eendtime',
            key: 'eendtime',
            render:(text:any,record:EmployeeRecord,)=>{
                return(
                    <div>
                        {dayjs(record.eendtime).format('YYYY-MM-DD')}
                    </div>
                )
            }
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname',
        },
        {
            title: '头像',
            dataIndex: 'avatarBase64',
            key: 'avatarBase64',
            ellipsis: true,
            render: (text: string, record: EmployeeRecord) => {
                const isImageLoaded = loadedImageIds.has(record.id.toString());
                let imageUrl = '';
                let bigImgUrl = '';
                if (isImageLoaded && text) {
                    const textStr = String(text || '');
                    imageUrl = textStr && textStr.endsWith('.png')
                        ? `${window.ServerConfig.imgServer}${textStr}`
                        : `${window.ServerConfig.imgServer}${textStr}_min.png`;
                    bigImgUrl = textStr && textStr.endsWith('.png')
                        ? `${window.ServerConfig.imgServer}${textStr}`
                        : `${window.ServerConfig.imgServer}${textStr}.png`;
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
                            onError={(e: any) => {
                                try {
                                    (e.target as HTMLImageElement).src = 'https://placeholder.pics/svg/50x50/EEEEEE/999999/暂无图片';
                                } catch (err) {
                                    // ignore
                                }
                            }}
                            preview={{
                                src: bigImgUrl, // 弹窗预览图单独指定
                            }}
                        />
                    </div>
                );
            }
        },
        // {
        //     title: '头像',
        //     dataIndex: 'images',
        //     key: 'images',
        //     render:(text:any,record:any,)=>{
        //         return(
        //             <div>
        //                 <Image src={record.avatarBase64} style={{width:"50px",height:'50px'}}/>
        //             </div>
        //         )
        //     }
        // },
        {
            title: '员工联系方式',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '公司名称/单元号',
            dataIndex: 'companyName',
            key: 'companyName',
        },
        {
            title: '状态',
            dataIndex: 'emp_status',
            key: 'emp_status',
            render:(text:any,record:EmployeeRecord,)=>{
                return(
                    <div>
                        {record.emp_status==1?<Tag color='red'>未审核</Tag>:<Tag color='green'>已审核</Tag>}
                    </div>
                )
            }
        },
        // {
        //     title: '录入人',
        //     dataIndex: 'userName',
        //     key: 'userName',
        // },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render: (text:any, record:EmployeeRecord) => {
                return(
                    <div>
                        {
                            record.emp_status==1?
                                <Space>
                                    {/*<Button type='link' onClick={()=>toInfo(record.id)}>详情</Button>*/}
                                    {uqx[188]=='1'?<Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button> :''}
                                    {uqx[189]=='1'?<Button type='primary' danger onClick={()=>isDelete(record)}>删除</Button>:''}
                                </Space>:
                                <>
                                    {/*<Button type='link' onClick={()=>toInfo(record.id)}>详情</Button>*/}
                                </>
                        }
                    </div>
                )
            }
        },
    ];
    // 监听数据变化，重置图片加载状态
    useEffect(() => {
        setLoadedImageIds(new Set());
        // 初始化交叉观察器
        initObserver();
    }, []);
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
                            const target = entry.target as HTMLElement;
                            const rowId = target.dataset ? target.dataset.rowId : undefined;
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
    const toadd=()=>{
        history.push('/enter/addYuangonglData')
    };
    const toInfo=(e:number)=>{
        history.push(`/enter/yuangongInfo?id=${e}`)
    };
    const toedit=(e:number)=>{
        history.push(`/enter/editYuangong?id=${e}`);
    };
    // 删除弹窗：接收 record，保存到 delRecord
    const isDelete=(record: EmployeeRecord)=>{
        setUid(record.id);
        setUname(record.name);
        setDelRecord(record);
        setIsOpen(true);
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        logFenye();
    };
    // 列表
    const logFenye=()=>{
        props.dispatch({
            type:"Emp/fetch",
            payload:{page,cname,nickname,phone,stutes,companyName,pageSize,tenantId}
        })
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    // 监听员工姓名
    const changeName=(e: ChangeEvent<HTMLInputElement>)=>{
        setCname(e.target.value);
        updateSessionStorage('/enter/yuangonglData/','cname',e.target.value);
    };
    // 监听员工昵称
    const changeNickname=(e: ChangeEvent<HTMLInputElement>)=>{
        setNickname(e.target.value);
        updateSessionStorage('/enter/yuangonglData/','nickname',e.target.value);
    };
    // 监听手机号
    const changePhone=(e: ChangeEvent<HTMLInputElement>)=>{
        setPhone(e.target.value);
        updateSessionStorage('/enter/yuangonglData/','phone',e.target.value);
    };
    const changeCompanyName=(e: ChangeEvent<HTMLInputElement>)=>{
        setcompanyName(e.target.value);
        updateSessionStorage('/enter/yuangonglData/','companyName',e.target.value);
    };
    // 删除的确定按钮
    const onOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'Emp/delete',
            payload:uid
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setIsOpen(false);
                setDelRecord(null);
                setspinning(false);
                logFenye();
            }else {
                message.error(res.Data);
                setspinning(false);
                setIsOpen(false);
            }
        })
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <div>
                        {uqx[186]=='1'?<Button type="primary" onClick={toadd}>员工登记</Button> :''}
                    </div>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="员工姓名:"
                            value={cname}
                        />
                        <Input
                            onChange={changeNickname}
                            addonBefore="员工昵称:"
                            value={nickname}
                        />
                        <Input
                            onChange={changePhone}
                            addonBefore="手机号:"
                            value={phone}
                        />
                        <Input
                            onChange={changeCompanyName}
                            addonBefore="公司/单元:"
                            value={companyName}
                        />
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
                <Table
                    columns={columns}
                    style={{border:'1px solid #ddd',borderRadius:'4px'}}
                    pagination={false}
                    dataSource={props.EmpList}
                    scroll={{y:'70vh'}}
                    rowKey={(columns) => columns.id}
                    size='small'
                    onRow={(record, index) => ({
                        // 使用 any 绕过 AntD 的严格 onRow 返回类型限制，以便我们能设置行 ref
                        ...( ((): any => ({
                            ref: (el: any) => {
                                if (el) {
                                    el.dataset.rowId = String(record.id); // 存储行ID
                                    if (typeof index === 'number') {
                                        rowRefs.current[index] = el;
                                    }
                                    // 观察该行元素
                                    observerRef.current?.observe(el);
                                }
                            }
                        }))()),
                    } as any)}
                />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal onOk={onOk} open={isOpen} title={'删除人脸'} onCancel={()=>{setIsOpen(false); setDelRecord(null);}} loading={spinning} width={600}>
                <div style={{marginBottom:12}}>确认删除以下记录？</div>
                {delRecord ? (
                    <Descriptions bordered size='small' column={2}>
                        <Descriptions.Item label='登记日期'>
                            {delRecord.begintime ? dayjs(delRecord.begintime).format('YYYY-MM-DD') : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label='姓名'>
                            {delRecord.name || ''}
                        </Descriptions.Item>
                        <Descriptions.Item label='公司'>
                            {delRecord.companyName || ''}
                        </Descriptions.Item>
                        <Descriptions.Item label='手机号'>
                            {delRecord.phone || ''}
                        </Descriptions.Item>
                    </Descriptions>
                ) : null}
            </Modal>
        </Spin>
    )
}

const mapStateToProps = (state: any) => {
    return {
        EmpList: state.Emp.list,
        count: state.Emp.count,
    }
};
export default  connect(mapStateToProps)(YuangonglData)