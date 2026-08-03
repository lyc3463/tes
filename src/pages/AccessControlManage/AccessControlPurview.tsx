import {
    Button,
    Form,
    Input,
    Select,
    Upload,
    DatePicker,
    List,
    Space,
    Table,
    Image,
    Tag,
    Pagination,
    Modal,
    message,
    Spin
} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {useCallback, useEffect, useRef, useState} from "react";
import dayjs from "dayjs";
import {connect} from "umi";
import {StaticInfo} from "@/StaticInfo";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const AccessControlPurview=(props:any)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setpageSize]=useState(50);
    const [stutes,setStutes]=useState(2);
    // 姓名
    const [cname,setCname]=useState(checkSessionStorage('/AccessControlManage/AccessControlPurview/','name')||'');
    // 昵称
    const [nickname,setNickname]=useState(checkSessionStorage('/AccessControlManage/AccessControlPurview/','nickname')||'');
    // 手机号
    const [phone,setPhone]=useState(checkSessionStorage('/AccessControlManage/AccessControlPurview/','phone')||'');
    const [companyName,setcompanyName]=useState(checkSessionStorage('/AccessControlManage/AccessControlPurview/','companyName')||'');
    // 弹窗状态
    const [isOpen,setOpen]=useState(false);
    // 删除的名字
    const [uname,setUname]=useState('');
    // 删除的ID
    const [uid,setUid]=useState(0);
    // 加载转圈
    const [spinning,setspinning]=useState(false);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    // 用户权限
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
                            onError={(e) => {
                                e.target.src = 'https://placeholder.pics/svg/50x50/EEEEEE/999999/暂无图片';
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
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {uqx[264]=='1'?<Button type='primary' onClick={()=>isDelete(record)}>删除</Button>:''}
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
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getFenyeInfo();
        logFenye();
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"CheckEmp/fetch",
            payload:{page,cname,nickname,phone,stutes,companyName,pageSize}
        })
    };
    const getFenyeInfo=()=>{
        props.dispatch({
            type:'CheckEmp/fenye',
            payload:{cname,nickname,phone,stutes,companyName,pageSize}
        });
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setpageSize(pageSize);
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    // 监听员工姓名
    const changeName=(e)=>{
        setCname(e.target.value);
        updateSessionStorage('/AccessControlManage/AccessControlPurview/','name',e.target.value);
    };
    // 监听员工昵称
    const changeNickname=(e)=>{
        setNickname(e.target.value);
        updateSessionStorage('/AccessControlManage/AccessControlPurview/','nickname',e.target.value);
    };
    // 监听手机号
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/AccessControlManage/AccessControlPurview/','phone',e.target.value);
    };
    // 删除弹窗
    const isDelete=(e:any)=>{
        setOpen(true);
        setUid(e.id);
        setUname(e.name);
    };
    // 确定删除
    const onOk=()=>{
      setspinning(true);
      props.dispatch({
          type:'CheckEmp/checkRemove',
          payload:uid
      }).then((res:any)=>{
          if (res.ErrorCode==0){
              message.success('删除成功');
              setOpen(false);
              setspinning(false);
              logFenye()
          }else {
              message.error(res.Data);
              setOpen(false);
              setspinning(false);
          }
      })
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        getFenyeInfo();
    }, []);
    const changeCompanyName=(e)=>{
        setcompanyName(e.target.value);
        updateSessionStorage('/AccessControlManage/AccessControlPurview/','companyName',e.target.value);
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
                rowKey={(columns) => columns.id}
                size='small'
                scroll={{y:'60vh'}}
                onRow={(record, index) => ({
                    ref: (el) => {
                        if (el) {
                            el.dataset.rowId = record.id; // 存储行ID
                            rowRefs.current[index] = el;
                            // 观察该行元素
                            observerRef.current?.observe(el);
                        }
                    },
                })}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal onOk={onOk} title='删除员工' open={isOpen} onCancel={()=>setOpen(false)}>
                <div>{`是否要删除${uname}`}</div>
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
export default connect(mapStateToProps) (AccessControlPurview)