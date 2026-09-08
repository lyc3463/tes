import {
    Button,
    DatePicker,
    Image,
    Input,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table, Tabs,
    Tag
} from "antd";
import dayjs from "dayjs";
import {useCallback, useEffect, useRef, useState, type ChangeEvent} from "react";
import {history,connect} from "umi";
import {StaticInfo} from "@/StaticInfo";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import type { EmployeeRecord, EmployeeResponse } from '@/ModelTypes/TypeEmp';
import { Descriptions } from 'antd';

interface CheckStaffProps {
    EmpList: EmployeeRecord[];
    count?: EmployeeResponse;
    dispatch: (action: { type: string; payload?: any }) => any;
}

const CheckStaff=(props: CheckStaffProps)=>{
    const [uid,setUid]=useState<number>(0);
    const [isopen,setOpen]=useState(false);
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 审核状态 0全部  1未审核 2已审核
    const [stutes,setStutes]=useState(checkSessionStorage('/check/checkStaff/','stutes')||0);
    // 姓名
    const [cname,setCname]=useState(checkSessionStorage('/check/checkStaff/','name')||'');
    // 昵称
    const [nickname,setNickname]=useState(checkSessionStorage('/check/checkStaff/','nickname')||'');
    // 手机号
    const [phone,setPhone]=useState(checkSessionStorage('/check/checkStaff/','phone')||'');
    const [companyName,setcompanyName]=useState(checkSessionStorage('/check/checkStaff/','companyName')||'');
    const [spinning,setspinning]=useState(false);
    const [loadedImageIds, setLoadedImageIds] = useState<Set<string>>(new Set());
    // 行ref数组
    const rowRefs = useRef<HTMLDivElement[]>([]);
    // 交叉观察器实例
    const observerRef = useRef<IntersectionObserver | null>(null);
    // 用户权限
    const [uqx,setUqx]=useState<string[]>([]);
    const [checkRecord, setCheckRecord] = useState<EmployeeRecord | null>(null);
    const columns =[
        {
            title: '登记日期',
            dataIndex: 'begintime',
            key: 'begintime',
            render:(text:any,record:any,)=>{
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
            render:(text:any,record:any,)=>{
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
            render: (text: string, record: any) => {
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
        {
            title: '员工联系方式',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '公司名称',
            dataIndex: 'companyName',
            key: 'companyName',
        },
        {
            title: '状态',
            dataIndex: 'emp_status',
            key: 'emp_status',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.emp_status==2?<Tag color='green'>已审核</Tag>:<Tag color='red'>未审核</Tag>}
                    </div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {
                            record.emp_status==2?''
                                // <Button type='link' onClick={()=>toInfo(record.id)}>详情</Button>
                                :
                                <Space>
                                    {/*<Button type='link' onClick={()=>toInfo(record.id)}>详情</Button>*/}
                                    {uqx[187]=='1'? <Button type='primary' onClick={()=>check(record)}>审核通过</Button> :''}
                                    {/*<Button type='link' color='red'>删除</Button>*/}
                                </Space>
                        }
                    </div>
                )
            }
        },
    ];
    // 详情页面
    const toInfo=(e:number)=>{
        history.push(`/enter/yuangongInfo?id=${e}`);
    };
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
    // 审核弹窗：接收 record 并保存以供 Modal 展示
    const check=(record: EmployeeRecord)=>{
        setUid(record.id);
        setCheckRecord(record);
        setOpen(true)
    };
    // 弹窗确定
    const OK=()=>{
        setspinning(true);
        props.dispatch({
            type:'CheckEmp/checkOK',
            payload:{uid}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('已通过,等待闸机服务器响应');
                setOpen(false);
                setspinning(false);
                logFenye();
            }else {
                message.error(res.Data);
                setOpen(false);
                setspinning(false);
            }
        });
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        logFenye();
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"CheckEmp/fetch",
            payload:{page,cname,nickname,phone,stutes,companyName,pageSize}
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
        updateSessionStorage('/check/checkStaff/','stutes',e);
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    // 监听员工姓名
    const changeName=(e: ChangeEvent<HTMLInputElement>)=>{
        setCname(e.target.value);
        updateSessionStorage('/check/checkStaff/','name',e.target.value);
    };
    // 监听员工昵称
    const changeNickname=(e: ChangeEvent<HTMLInputElement>)=>{
        setNickname(e.target.value);
        updateSessionStorage('/check/checkStaff/','nickname',e.target.value);
    };
    // 监听手机号
    const changePhone=(e: ChangeEvent<HTMLInputElement>)=>{
        setPhone(e.target.value);
        updateSessionStorage('/check/checkStaff/','phone',e.target.value);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const changeCompanyName=(e: ChangeEvent<HTMLInputElement>)=>{
        setcompanyName(e.target.value);
        updateSessionStorage('/check/checkStaff/','companyName',e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
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
                                状态:
                            </div>
                            <Select
                                onChange={changeStutes}
                                defaultValue={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:1, label: '未审核' },
                                    { value:2, label: '已审核' },
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
                columns={columns}
                size='small'
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                scroll={{y:'70vh'}}
                dataSource={props.EmpList}
                rowKey={(columns) => columns.id}
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
            {/*审核弹窗*/}
            <Modal onOk={OK} onCancel={()=>{setOpen(false); setCheckRecord(null);}} open={isopen} title='是否通过' loading={spinning} width={600}>
                <div style={{marginBottom:12}}>是否通过以下员工？</div>
                {checkRecord ? (
                    <Descriptions bordered size='small' column={2}>
                        <Descriptions.Item label='登记日期'>
                            {checkRecord.begintime ? dayjs(checkRecord.begintime).format('YYYY-MM-DD') : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label='姓名'>
                            {checkRecord.name || ''}
                        </Descriptions.Item>
                        <Descriptions.Item label='公司'>
                            {checkRecord.companyName || ''}
                        </Descriptions.Item>
                        <Descriptions.Item label='手机号'>
                            {checkRecord.phone || ''}
                        </Descriptions.Item>
                    </Descriptions>
                ) : null}
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        EmpList: state.CheckEmp.list,
        count: state.CheckEmp.count,
    }
};
export default  connect(mapStateToProps) (CheckStaff)