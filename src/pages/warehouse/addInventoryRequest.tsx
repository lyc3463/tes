import {Button, DatePicker, Form, Input, message, Modal, Select, Space, Spin, Table} from "antd";
import { useNavigate, history, connect } from "umi";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { generate, getCurrentDate } from "@/utils/OpenTool";
import { StaticInfo } from "@/StaticInfo";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as InventoryRequestServices from "@/services/inventoryRequest";
import * as ThingListService from "@/services/thingList";
import { createInventoryRequestProduct } from "@/utils/inventoryWorkflow";

// 缓存唯一key，区分页面，不和销售单冲突
const CACHE_KEY = "AddInventoryRequest_draft_cache";
// 草稿默认空值
const getEmptyDraft = () => ({
    stockCode: "",
    remark: "",
    stockTime: getCurrentDate(),
    warehouseId: 0,
    displayData: [],
    selectedRowKeys: []
});

const AddInventoryRequest = (props) => {
    const navigate = useNavigate();
    const [spinning, setSpinning] = useState(false);
    const [form] = Form.useForm();
    // 单号
    const [stockCode, setOrderCode] = useState('');
    // 备注
    const [remark, setRemark] = useState('');
    // 入库时间
    const [stockTime, setOrderTime] = useState(getCurrentDate());
    // 仓库ID
    const [warehouseId, setWarehouseId] = useState(0);
    // 物品表格数据源
    const [displayData, setDisplayData] = useState([]);
    const [catalogProducts, setCatalogProducts] = useState<any[]>([]);
    const [addProductOpen, setAddProductOpen] = useState(false);
    const [selectedCatalogProductId, setSelectedCatalogProductId] = useState<number>();
    // 表格勾选key
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    // 图片懒加载标记
    const [loadedImageIds, setLoadedImageIds] = useState<Set<string>>(new Set());
    // 行DOM ref
    const rowRefs = useRef<HTMLDivElement[]>([]);
    // 交叉观察器
    const observerRef = useRef<IntersectionObserver | null>(null);

    // ===================== 缓存工具方法 =====================
    // 读取缓存
    const loadCache = useCallback(() => {
        const str = sessionStorage.getItem(CACHE_KEY);
        if (!str) return null;
        try {
            return JSON.parse(str);
        } catch (err) {
            sessionStorage.removeItem(CACHE_KEY);
            return null;
        }
    }, []);

    // 保存全部草稿至缓存
    const saveCache = useCallback(() => {
        const draft = {
            stockCode,
            remark,
            stockTime,
            warehouseId,
            displayData,
            selectedRowKeys,
        };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(draft));
    }, [stockCode, remark, stockTime, warehouseId, displayData, selectedRowKeys]);

    // 清空草稿 + 重置所有状态 + 删除缓存
    const clearAllDraft = useCallback(() => {
        sessionStorage.removeItem(CACHE_KEY);
        const empty = getEmptyDraft();
        setOrderCode(generate(StaticInfo.park_name));
        setRemark(empty.remark);
        setOrderTime(empty.stockTime);
        setWarehouseId(empty.warehouseId);
        setDisplayData([]);
        setSelectedRowKeys(empty.selectedRowKeys);
        setLoadedImageIds(new Set());
        message.info("已清空入库草稿");
    }, []);

    // ===================== 页面初始化加载缓存 =====================
    useEffect(() => {
        const cache = loadCache();
        // 存在缓存，回填所有状态
        if (cache) {
            setOrderCode(cache.stockCode);
            setRemark(cache.remark);
            setOrderTime(cache.stockTime);
            setWarehouseId(cache.warehouseId);
            const cachedData = (cache.displayData || []).map((item: any) => ({
                ...item,
                requestRowKey: item.requestRowKey || `inventory-${item.id}`,
            }));
            setDisplayData(cachedData);
            setSelectedRowKeys((cache.selectedRowKeys || []).map((key: React.Key) =>
                cachedData.find((item: any) => item.id === key)?.requestRowKey || key,
            ));
            // 如果缓存有仓库ID，自动拉取该仓库物品列表
            if (cache.warehouseId > 0) {
                getList(cache.warehouseId);
            }
        } else {
            // 无缓存，生成全新单号
            setOrderCode(generate(StaticInfo.park_name));
        }
        // 基础仓库下拉接口
        getWarehouseList();
        getCatalogProducts();
    }, [loadCache]);

    // 任意状态变化自动持久化缓存
    useEffect(() => {
        saveCache();
    }, [saveCache]);

    // ===================== 图片懒加载交叉观察器 =====================
    useEffect(() => {
        rowRefs.current = displayData.map((_, index) => rowRefs.current[index] || null);
        setLoadedImageIds(new Set());
        initObserver();
    }, [displayData]);

    const initObserver = useCallback(() => {
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const rowId = entry.target.dataset.rowId;
                        if (rowId && !loadedImageIds.has(rowId)) {
                            setLoadedImageIds(prev => new Set(prev).add(rowId));
                        }
                    }
                });
            },
            {
                root: document.querySelector('.ant-table-body'),
                rootMargin: '20px',
                threshold: 0.1
            }
        );
        rowRefs.current.forEach(el => el && observerRef.current?.observe(el));
    }, [loadedImageIds]);

    // 组件销毁销毁观察器
    useEffect(() => {
        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, []);

    // ===================== 表格列配置 =====================
    const columnsz = [
        {
            title: '物品图片',
            dataIndex: 'productsImage',
            ellipsis: true,
            render: (text: string, record: any) => {
                const isImageLoaded = loadedImageIds.has(record.requestRowKey);
                let imageUrl = '';
                if (isImageLoaded && text) {
                    const textStr = String(text || '');
                    imageUrl = textStr && textStr.endsWith('.png')
                        ? `${window.ServerConfig.imgServer}${textStr}`
                        : `${window.ServerConfig.imgServer}${textStr}_X.png`;
                }
                return (
                    <div style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                            src={imageUrl || 'https://placeholder.pics/svg/50x50/EEEEEE/999999/加载中...'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            alt="物品图片"
                            loading="lazy"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placeholder.pics/svg/50x50/EEEEEE/999999/暂无图片';
                            }}
                        />
                    </div>
                );
            }
        },
        {
            title: '物品名称',
            dataIndex: 'productsName',
            key: 'productsName',
        },
        {
            title: '物品编号',
            dataIndex: 'productsCode',
            key: 'productsCode',
        },
        {
            title: '单位',
            dataIndex: 'unitsName',
            key: 'unitsName',
        },
    ];

    // 时间选择
    const changeDate = (date: dayjs.Dayjs, item: string) => {
        setOrderTime(item);
    };

    // 获取仓库物品列表
    const getList = (e: number) => {
        setSpinning(true);
        props.dispatch({
            type: 'ThingStockInfo/fetch',
            payload: { page: 1, pageSize: 10000, warehouseId: e, productsName: '', startDate: '2000-01-01', endDate: '2099-01-01', unitId: 0 }
        }).then((res: TypeErrorCode) => {
            setSpinning(false);
            if (res.ErrorCode == 0) {
                const newArr = res.Data.data.map((item: any) => ({
                    ...item,
                    requestRowKey: `inventory-${item.id}`,
                    isZk: 1,
                    inventoryId: item.id,
                    discountRateDp: 100,
                    quantityKc: item.quantity,
                    discountPriceDp: 0,
                    quantity: 0
                }));
                setDisplayData(newArr);
            } else {
                message.error(res.Data);
            }
        })
    };

    const getCatalogProducts = async () => {
        const res: TypeErrorCode = await ThingListService.fetch({
            page: 1,
            pageSize: 10000,
            name: '',
            code: '',
            goodsTypeId: 0,
        });
        if (res.ErrorCode === 0) {
            setCatalogProducts(res.Data.data || []);
        } else {
            message.error(res.Data);
        }
    };

    const addCatalogProduct = (productId = selectedCatalogProductId) => {
        if (!productId) return;
        const product = catalogProducts.find(item => Number(item.id) === Number(productId));
        if (!product) return;
        const alreadyAdded = displayData.some(item =>
            Number(item.productsId) === Number(product.id) && Number(item.unitsId) === Number(product.unitsId),
        );
        if (alreadyAdded) {
            message.warning('该物品已在申请列表中');
            return;
        }
        const requestProduct = createInventoryRequestProduct(product, displayData);
        setDisplayData(current => [...current, {
            ...requestProduct,
            requestRowKey: `catalog-${product.id}-${product.unitsId}`,
            isZk: 1,
            discountRateDp: 100,
            discountPriceDp: 0,
        }]);
        setSelectedCatalogProductId(undefined);
        setAddProductOpen(false);
    };

    // 获取仓库下拉列表
    const getWarehouseList = () => {
        props.dispatch({ type: "WarehouseList/fetch" });
    };

    // 切换仓库
    const changeWarehouse = (e) => {
        setWarehouseId(e);
        getList(e);
    };

    // 提交保存入库单
    const onOK = () => {
        if (stockTime === '') return message.warning('请选择申请时间');
        if (warehouseId === 0) return message.warning('请先选择仓库');
        // 过滤未勾选的物品
        const newArr = selectedRowKeys.length === 0 ? displayData : displayData.filter((item) => !selectedRowKeys.includes(item.id));
        if (newArr.length === 0) return message.warning('请先选择需要申请的物品');
        const jsonData = JSON.stringify(newArr);
        setSpinning(true);
        props.dispatch({
            type: 'InventoryRequest/add',
            payload: { warehouseId, stockCode, stockTime, jsonData, remark }
        }).then((res: TypeErrorCode) => {
            setSpinning(false);
            if (res.ErrorCode == 0) {
                message.success('添加成功');
                clearAllDraft(); // 提交成功清空草稿缓存
                history.push('/warehouse/inventory');
            } else {
                message.error(res.Data);
            }
        })
    };

    // 备注输入
    const changeRemark = (e) => {
        setRemark(e.target.value);
    };
    // 表格勾选配置
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[]) => {
            setSelectedRowKeys(selectedKeys);
        },
        type: 'checkbox',
    };

    // 快速搜索物品滚动定位
    const changeProductID = useCallback((selectedId) => {
        const targetIndex = displayData.findIndex(item => item.requestRowKey === selectedId);
        if (targetIndex === -1) {
            message.warning('未找到匹配的物品');
            return;
        }
        const targetRow = rowRefs.current[targetIndex];
        if (targetRow) {
            targetRow.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            setLoadedImageIds(prev => new Set(prev).add(targetRow.dataset.rowId || ''));
            targetRow.style.backgroundColor = '#e6f7ff';
            setTimeout(() => {
                targetRow.style.backgroundColor = '';
            }, 3000);
        } else {
            message.warning('目标行未加载完成，请稍等');
        }
    }, [displayData]);

    return (
        <Spin spinning={spinning}>
            <Space>
                <Button type="primary" onClick={() => navigate(-1)}>
                    返回
                </Button>
                <Button type="primary" onClick={onOK}>
                    确定
                </Button>
                <Button danger onClick={clearAllDraft}>清空草稿</Button>
            </Space>
            <Space style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '10px' }}>
                <Input addonBefore="单号:" placeholder='随机生成' value={stockCode} disabled />
                <Space.Compact>
                    <div style={{ borderRadius: '6px 0 0 6px', padding: '0 11px', border: '1px solid #d9d9d9', borderRight: 0, display: 'flex', alignItems: 'center' }}>
                        时间:
                    </div>
                    <DatePicker value={dayjs(stockTime)} onChange={changeDate} />
                </Space.Compact>
                <Space.Compact>
                    <div style={{ borderRadius: '6px 0 0 6px', padding: '0 11px', border: '1px solid #d9d9d9', borderRight: 0, display: 'flex', alignItems: 'center' }}>
                        仓库:
                    </div>
                    <Select
                        placeholder='请选择入库仓库'
                        value={warehouseId || undefined}
                        onChange={changeWarehouse}
                        options={Array.isArray(props.WarehouseList) && props.WarehouseList.length > 0
                            ? props.WarehouseList.map((item: any) => ({
                                label: item.warehouseName,
                                value: item.id,
                            }))
                            : []}
                    />
                </Space.Compact>
                <Input placeholder='备注' value={remark} onChange={changeRemark} maxLength={50} showCount />
                <Space.Compact>
                    <div style={{ borderRadius: '6px 0 0 6px', padding: '0 11px', border: '1px solid #d9d9d9', borderRight: 0, display: 'flex', alignItems: 'center' }}>
                        新增物品:
                    </div>
                    <Select
                        placeholder='从商品档案选择'
                        onChange={addCatalogProduct}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => String(option?.label || '').toLowerCase().includes(input.toLowerCase())}
                        disabled={warehouseId === 0}
                        options={catalogProducts
                            .filter(product => !displayData.some(item =>
                                Number(item.productsId) === Number(product.id) && Number(item.unitsId) === Number(product.unitsId),
                            ))
                            .map((item: any) => ({
                                label: `${item.productsName}(${item.unitsName})`,
                                value: item.id,
                            }))}
                    />
                </Space.Compact>
            </Space>
            <Table
                columns={columnsz}
                rowKey="requestRowKey"
                pagination={false}
                size='small'
                scroll={{ y: '55vh' }}
                dataSource={displayData}
                rowClassName={(record, index) => index % 2 === 1 ? 'tbodd' : 'tbeven'}
                rowSelection={rowSelection}
                onRow={(record, index) => ({
                    ref: (el) => {
                        if (el) {
                            el.dataset.rowId = record.requestRowKey;
                            rowRefs.current[index] = el;
                            observerRef.current?.observe(el);
                        }
                    },
                })}
            />
        </Spin>
    )
}

const mapStateToProps = (state: any) => ({
    ThingStockInfoList: state.ThingStockInfo.list,
    WarehouseList: state.WarehouseList.list,
});

export default connect(mapStateToProps)(AddInventoryRequest);