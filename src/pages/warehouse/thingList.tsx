import {Table, Space, Button, List, Input, Image, Pagination, Modal, message, Spin, Form, DatePicker, Select} from 'antd';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {history,connect} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import {StaticInfo} from "@/StaticInfo";
import * as ThingListService from "@/services/thingList";
import CryptoUtils from "@/utils/Crypto";
import dayjs from "dayjs";
import {CopyOutlined} from "@ant-design/icons";


const ThingList = (props) => {
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 物品编码
    const [code,setCode]=useState(checkSessionStorage('/warehouse/warehouseAndType','ThingListCode') || '');
    // 物品名称
    const [name,setName]=useState(checkSessionStorage('/warehouse/warehouseAndType','ThingListName') || '');
    const [uid,setUid]=useState(0);
    const [visible,setVisible]=useState(false);
    const [spinning,setSpinning]=useState(false);
    // 新增：存储已加载图片的行ID（避免重复加载）
    const [loadedImageIds, setLoadedImageIds] = useState<Set<string>>(new Set());
    // 行ref数组
    const rowRefs = useRef<HTMLDivElement[]>([]);
    // 交叉观察器实例
    const observerRef = useRef<IntersectionObserver | null>(null);
    // 导入
    const [importVisible,setImportVisible]=useState(false);
    // 导出
    const [exportVisible,setExportVisible]=useState(false);
    // 导出有效时间
    const [validTime,setValidTime]=useState(5);
    // 导出有效密码
    const [validPassword,setValidPassword]=useState('');
    // 导出园区
    const [validArea,setValidArea]=useState(0);
    // 导出成功提示框
    const [exportSuccessVisible,setExportSuccessVisible]=useState(false);
    // 导出成功的字符串
    const [exportSuccessStr,setExportSuccessStr]=useState('');
    // 导入密钥
    const [importKey,setImportKey]=useState('');
    // 导入密码
    const [importPassword,setImportPassword]=useState('');


    const columns = [
        {
            title: '物品图片',
            dataIndex: 'productsImage',
            ellipsis: true,
            render: (text: string, record: any) => {
                const isImageLoaded = loadedImageIds.has(record.id.toString());
                let imageUrl = '';
                if (isImageLoaded && text) {
                    const textStr = String(text || '');
                    imageUrl = textStr && textStr.endsWith('.png')
                        ? `${window.ServerConfig.imgServer}${textStr}`
                        : `${window.ServerConfig.imgServer}${textStr}_X.png`;
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
            title: '物品名称',
            dataIndex: 'productsName',
            ellipsis: true,
        },
        {
            title: '物品编码',
            dataIndex: 'productsCode',
            ellipsis: true,
        },
        {
            title: '助查码',
            dataIndex: 'abbreviation',
            ellipsis: true,
        },
        {
            title: '品牌方',
            dataIndex: 'brandName',
            ellipsis: true,
        },
        {
            title: '成本价',
            dataIndex: 'costPrice',
            ellipsis: true,
        },
        {
            title: '零售控价',
            dataIndex: 'presalePrice',
            ellipsis: true,
        },
        {
            title: '零售价',
            dataIndex: 'retailPricce',
            ellipsis: true,
        },
        {
            title: '预警库存数',
            dataIndex: 'number',
            ellipsis: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <Space size="small">
                    <Button type="primary" onClick={()=>{history.push(`/warehouse/editThingList?id=${record.id}`)}}>编辑</Button>
                    <Button type="primary" danger onClick={()=>onDelOpen(record)}>删除</Button>
                </Space>
            ),
        },
    ];
    const toAdd=()=>{
        history.push('/warehouse/addThingList');
    };
    const getList=()=>{
        props.dispatch({
            type:'ThingList/fetch',
            payload:{page, pageSize, code, name},
        })
    };

    useEffect(() => {
        getList();
    }, [page,pageSize]);
    // 监听页数
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const onDelOpen=(e)=>{
        setUid(e.id);
        setVisible(true);
    };
    const onOK=()=>{
        setSpinning(true);
        props.dispatch({
            type:'ThingList/remove',
            payload:uid,
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setSpinning(false);
                setVisible(false);
            }else {
                message.error('删除失败'+res.ErrorCode+res.Data);
                setSpinning(false);
                setVisible(false);
            }
        })
    };
    // 物品名称改变
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/warehouse/warehouseAndType','ThingListName',e.target.value);
    };
    // 物品编码改变
    const changeCode=(e)=>{
        setCode(e.target.value);
        updateSessionStorage('/warehouse/warehouseAndType','ThingListCode',e.target.value);
    };
    const sousuo=()=>{
        setPage(1);
        getList();
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

    // 清理观察器
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);
    const exportOpen=()=>{
        setExportVisible(true);
    };
    const importOpen=()=>{
        setImportVisible(true);
    };
    const onExportOpen=()=>{
        if (validTime==0){
            message.error('请选择有效时间');
            return;
        }
        if (validArea==0){
            message.error('请选择园区');
            return;
        }
        if (validPassword==''){
            message.error('请输入密码');
            return;
        }
        setSpinning(true);
        let mm =CryptoUtils.md5(validPassword);
        ThingListService.exportOk(validArea,mm,getNextTime(validTime)).then((res:TypeErrorCode)=>{
            console.log('res',res)
            if (res.ErrorCode==0){
                message.success('导出成功');
                setSpinning(false);
                setExportVisible(false);
                setExportSuccessStr(res.Data);
                setExportSuccessVisible(true);
            }else {
                message.error('导出失败'+res.ErrorCode+res.Data);
                setSpinning(false);
                setExportVisible(false);
            }
        })
    };
    const  getNextTime=(minuteNum:number)=>{
        return dayjs().add(minuteNum, 'minute').format('YYYY-MM-DD HH:mm:ss')
    }
    // 导入
    const onImportOpen=()=>{
        if (importKey==''){
            message.error('请输入导入密钥');
            return;
        }
        if (importPassword==''){
            message.error('请输入导入密码');
            return;
        }
        setSpinning(true);
        let mm =CryptoUtils.md5(importPassword);
        ThingListService.importOk(
            importKey,
            mm,
        ).then((res:TypeErrorCode)=>{
            console.log('res',res)
            if (res.ErrorCode==0){
                message.success('导入成功');
                setSpinning(false);
                setImportVisible(false);
                getList();
            }else {
                message.error('导入失败'+res.ErrorCode+res.Data);
                setSpinning(false);
                setImportVisible(false);
            }
        })
    }
    return (
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Button type="primary" onClick={toAdd}>
                            新增物品
                        </Button>
                        <Button type="primary" onClick={exportOpen}>
                            导出
                        </Button>
                        <Button type="primary" onClick={importOpen}>
                            导入
                        </Button>
                    </Space>
                    <Space>
                        <Input
                            addonBefore="物品名称:"
                            value={name}
                            onChange={changeName}
                        />
                        <Input
                            addonBefore="物品编码:"
                            value={code}
                            onChange={changeCode}
                        />
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                dataSource={props.list}
                size='small'
                scroll={{y:'55vh'}}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
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
            <Modal open={visible} onCancel={()=>setVisible(false)} onOk={onOK} title={'删除物品'} loading={spinning}>
                <p>确定删除物品吗？</p>
            </Modal>
            {/*导出弹窗*/}
            <Modal open={exportVisible} title={'导出物品'} onOk={onExportOpen} onCancel={()=>setExportVisible(false)} loading={spinning}>
                <Form>
                    <Form.Item label={'选择有效时间'}>
                        <Select value={validTime} onChange={(e)=>setValidTime(e)}>
                            <Select.Option value={5}>5分钟</Select.Option>
                            <Select.Option value={15}>15分钟</Select.Option>
                            <Select.Option value={30}>30分钟</Select.Option>
                            <Select.Option value={60}>60分钟</Select.Option>
                        </Select>
                        <span>{getNextTime(validTime)}后过期</span>
                    </Form.Item>
                    <Form.Item label={'密码'}>
                        <Input value={validPassword} onChange={(e)=>setValidPassword(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label={'导入园区'}>
                        <Select
                            value={validArea}
                            onChange={setValidArea}
                        >
                            {/*<Select.Option value={0}>任意园区</Select.Option>*/}
                            {Array.isArray(StaticInfo.parkList) && StaticInfo.parkList.map(park => (
                                <Select.Option
                                    key={park.parkId}
                                >
                                    {park.park_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            {/*导出成功提示框*/}
            <Modal
                open={exportSuccessVisible}
                onOk={() => setExportSuccessVisible(false)}
                title={'请保存好密钥,导入时需要回填'}
            >
                <Input
                    value={exportSuccessStr}
                    suffix={
                        <Button
                            type="text"
                            icon={<CopyOutlined />}
                            onClick={async () => {
                                try {
                                    // 原生复制，无需依赖包
                                    await navigator.clipboard.writeText(exportSuccessStr);
                                    message.success('复制成功');
                                } catch (err) {
                                    message.error('复制失败，请手动选中文字复制');
                                }
                            }}
                        >
                            复制
                        </Button>
                    }
                />
            </Modal>
            {/*导入弹窗*/}
            <Modal open={importVisible} title={'导入物品'} onOk={onImportOpen} onCancel={()=>setImportVisible(false)} loading={spinning}>
                <Form>
                    <Form.Item label={'导入密钥'}>
                        <Input value={importKey} onChange={(e)=>setImportKey(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label={'密码'}>
                        <Input value={importPassword} onChange={(e)=>setImportPassword(e.target.value)}/>
                    </Form.Item>
                </Form>
            </Modal>
        </Spin>
    );
};
const mapStateToProps = (state: any) => ({
    list: state.ThingList.list,
    count: state.ThingList.count,
});
export default connect(mapStateToProps)(ThingList);
