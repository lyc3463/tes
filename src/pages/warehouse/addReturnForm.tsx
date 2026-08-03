import {
    Button,
    DatePicker,
    Image,
    Input,
    InputNumber,
    message,
    Select,
    Space,
    Spin,
    Table
} from "antd";
import { useNavigate, history, connect } from "umi";
import { useEffect, useState, useCallback } from "react";
import { generate, getCurrentDate } from "@/utils/OpenTool";
import { StaticInfo } from "@/StaticInfo";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import { PlusOutlined } from "@ant-design/icons";
import * as ThingStockInfoServer from "@/services/thingStockInfo";

// 缓存唯一key
const CACHE_KEY = "addReturnForm_draft_cache";
// 空草稿默认值
const getEmptyDraft = () => ({
    orderCode: "",
    orderTime: getCurrentDate(),
    warehouseId: 0,
    pmId: 0,
    remark: "",
    paidAmount: 0,
    totalAmount: 0,
    displayData: []
});

const addReturnForm = (props) => {
    const navigate = useNavigate();
    const [spinning, setSpinning] = useState(false);
    // 随机单号
    const [orderCode, setOrderCode] = useState('');
    // 备注
    const [remark, setRemark] = useState('');
    // 获取当前时间
    const [orderTime, setOrderTime] = useState(getCurrentDate());
    // 仓库id
    const [warehouseId, setWarehouseId] = useState(0);
    // 添加退货的物品
    const [displayData, setDisplayData] = useState([]);
    // 库存的物品
    const [thingStockInfoList, setThingStockInfoList] = useState([]);
    // 已付金额
    const [paidAmount, setPaidAmount] = useState(0);
    // 总金额
    const [totalAmount, setTotalAmount] = useState(0);
    // 支付方式ID
    const [pmId, setPayTypeId] = useState(0);

    // ====================== 缓存工具 ======================
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

    // 保存完整草稿
    const saveCache = useCallback(() => {
        const draft = {
            orderCode,
            orderTime,
            warehouseId,
            pmId,
            remark,
            paidAmount,
            totalAmount,
            displayData
        };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(draft));
    }, [orderCode, orderTime, warehouseId, pmId, remark, paidAmount, totalAmount, displayData]);

    // 清空缓存+重置全部表单
    const clearAllDraft = useCallback(() => {
        sessionStorage.removeItem(CACHE_KEY);
        const empty = getEmptyDraft();
        const newCode = generate(StaticInfo.park_name);
        setOrderCode(newCode);
        setOrderTime(empty.orderTime);
        setWarehouseId(empty.warehouseId);
        setPayTypeId(empty.pmId);
        setRemark(empty.remark);
        setPaidAmount(empty.paidAmount);
        setTotalAmount(empty.totalAmount);
        setDisplayData([]);
        addEmptyRecords(5);
        message.info("已清空草稿");
    }, []);

    // ====================== 初始化加载缓存 ======================
    useEffect(() => {
        const cache = loadCache();
        if (cache) {
            // 回填缓存所有状态
            setOrderCode(cache.orderCode);
            setOrderTime(cache.orderTime);
            setWarehouseId(cache.warehouseId);
            setPayTypeId(cache.pmId);
            setRemark(cache.remark);
            setPaidAmount(cache.paidAmount);
            setTotalAmount(cache.totalAmount);
            setDisplayData(cache.displayData);
            // 缓存存在仓库则加载对应库存物品
            if (cache.warehouseId > 0) {
                getList(cache.warehouseId);
            }
        } else {
            // 无缓存：生成单号 + 5条空明细
            const newCode = generate(StaticInfo.park_name);
            setOrderCode(newCode);
            addEmptyRecords(5);
        }
        // 加载基础下拉
        getWarehouseList();
        getPayList();
    }, [loadCache]);

    // 任意表单状态变更自动保存缓存
    useEffect(() => {
        saveCache();
    }, [saveCache]);

    // 表格自动合计总金额
    useEffect(() => {
        const totalSum = displayData.reduce((acc, item) => {
            const itemTotal = (item.quantity || 0) * (item.price || 0);
            return acc + itemTotal;
        }, 0);
        setTotalAmount(totalSum);
    }, [displayData]);

    const columnsz = [
        {
            title: '物品图片',
            dataIndex: 'productsImage',
            ellipsis: true,
            render: (text: string, record: any) => {
                const textStr = String(text || '');
                const imageUrl = textStr && textStr.endsWith('.png')
                    ? `${window.ServerConfig.imgServer}${textStr}`
                    : `${window.ServerConfig.imgServer}${textStr}_X.png`;
                return textStr ? (
                    <Image
                        src={imageUrl}
                        style={{ width: '50px', height: '50px' }}
                        fallback="https://placeholder.pics/svg/50x50/EEEEEE/999999/暂无图片"
                    />
                ) : '';
            }
        },
        {
            title: '选择物品',
            dataIndex: 'productsName',
            key: 'selectProducts',
            render: (text, record) => (
                <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder="搜索物品名称"
                    style={{ width: 120 }}
                    value={text || undefined}
                    onChange={(value, label) => handleProductSelect(record.id, label)}
                    filterOption={(input, option) => {
                        if (!Array.isArray(thingStockInfoList) || thingStockInfoList.length === 0) return false;
                        const item = thingStockInfoList.find(unit => `${unit.productsCode}${unit.productsName}` === option.value);
                        if (!item) return false;
                        const searchInput = input.toLowerCase();
                        return item.productsName?.toLowerCase().includes(searchInput);
                    }}
                    options={Array.isArray(thingStockInfoList)
                        ? thingStockInfoList.map(item => ({
                            label: `${item.productsName}`,
                            value: `${item.productsCode + item.productsName}`
                        }))
                        : []}
                />
            )
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
            dataIndex: 'unitsId',
            key: 'unitsId',
            render: (text, record) => (
                <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder="选择单位"
                    style={{ width: 120 }}
                    value={text || undefined}
                    onChange={(value) => handleUnitSelect(record.id, value)}
                    options={Array.isArray(record.iList)
                        ? record.iList.map(item => ({
                            label: item.unitsName || '',
                            value: item.unitsId || 0
                        }))
                        : []}
                />
            )
        },
        {
            title: '退货数量',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, record) => (
                <InputNumber
                    min={0}
                    value={text}
                    onChange={(value) => changproductsNum(value, record.id)}
                />
            )
        },
        {
            title: '单价(元)',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '总价钱(元)',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
        },
        {
            title: '库存数量',
            dataIndex: 'quantityKc',
            key: 'quantityKc',
        },
        {
            title: '操作',
            dataIndex: 'delete',
            key: 'delete',
            render: (text, record) => {
                return <Button type='primary' danger onClick={() => isDel(record.id)}>删除</Button>
            }
        },
    ];

    // 已付金额
    const changePaidAmount = (e) => {
        setPaidAmount(e);
    };
    // 总金额手动修改
    const changeTotalAmount = (e) => {
        setTotalAmount(e);
    };

    // 修改退货数量
    const changproductsNum = (value, recordId) => {
        if (value === null) return;
        const updatedData = displayData.map(item => {
            if (item.id === recordId) {
                const quantity = value;
                const discountedPrice = quantity * item.priceKc;
                const minPrice = quantity * (item.price || 0);
                const totalPrice = Math.max(discountedPrice, minPrice);
                return {
                    ...item,
                    quantity: quantity,
                    totalPrice: totalPrice
                };
            }
            return item;
        });
        setDisplayData(updatedData);
    };

    // 切换单位
    const handleUnitSelect = (recordId, unitId) => {
        const currentRecord = displayData.find(item => item.id === recordId);
        if (!currentRecord || !Array.isArray(currentRecord.iList)) return;
        const selectedUnit = currentRecord.iList.find(unit => unit.unitsId === unitId);
        if (!selectedUnit) return;
        setDisplayData(displayData.map(item => {
            if (item.id === recordId) {
                return {
                    ...item,
                    brandId: selectedUnit.brandId || 0,
                    abbreviation: selectedUnit.abbreviation || '',
                    barcode: selectedUnit.barcode || '',
                    costPrice: selectedUnit.costPrice || 0,
                    groupId: selectedUnit.groupId || 0,
                    inventoryId: selectedUnit.id || 0,
                    number: selectedUnit.number || 0,
                    presalePrice: selectedUnit.presalePrice || 0,
                    price: selectedUnit.price || 0,
                    priceKc: selectedUnit.priceKc || 0,
                    productsCode: selectedUnit.productsCode || '',
                    quantity: 0,
                    quantityKc: selectedUnit.quantity || 0,
                    retailPricce: selectedUnit.retailPricce || 0,
                    specifications: selectedUnit.specifications || '',
                    totalPrice: selectedUnit.totalPrice || 0,
                    unitsId: selectedUnit.unitsId || 0,
                    unitsName: selectedUnit.unitsName || 0,
                    isZk: selectedUnit.isZk || 1,
                    discountRateDp: selectedUnit.discountRateDp || 100,
                    discountPriceDp: selectedUnit.discountPriceDp || 0,
                };
            }
            return item;
        }));
    };

    // 选择物品回填明细
    const handleProductSelect = (recordId, label) => {
        const selectedProduct = thingStockInfoList.find(item => item.productsName === label.label);
        ThingStockInfoServer.productsNameQuery(warehouseId, selectedProduct.productsCode).then((res: TypeErrorCode) => {
            if (res.ErrorCode == 0) {
                setDisplayData(displayData.map(item => {
                    if (item.id === recordId) {
                        return {
                            ...item,
                            productsImageBase64: res.Data.productsImageBase64 || '',
                            productsImage: res.Data.productsImage || '',
                            productsName: selectedProduct.productsName || '',
                            iList: res.Data.iList || [],
                            brandId: 0,
                            abbreviation: '',
                            barcode: '',
                            costPrice: 0,
                            groupId: 0,
                            inventoryId: 0,
                            number: 0,
                            presalePrice: 0,
                            price: 0,
                            priceKc: 0,
                            productsCode: 0,
                            quantity: 0,
                            quantityKc: 0,
                            retailPricce: 0,
                            specifications: '',
                            totalPrice: 0,
                            unitsId: 0,
                            unitsName: 0,
                            isZk: 1,
                            discountRateDp: 100,
                            discountPriceDp: 0,
                        };
                    }
                    return item;
                }));
            } else {
                message.error(res.Data);
            }
        })
    };

    // 日期切换
    const changeDate = (date: dayjs.Dayjs, item: string) => {
        setOrderTime(item);
    };

    // 获取库存物品
    const getList = (e) => {
        setSpinning(true);
        ThingStockInfoServer.selectFetch(e).then((res: TypeErrorCode) => {
            if (res.ErrorCode == 0) {
                setThingStockInfoList(res.Data);
            }
            setSpinning(false);
        })
    };

    // 仓库下拉
    const getWarehouseList = () => {
        props.dispatch({ type: "WarehouseList/fetch" })
    };
    // 支付方式下拉
    const getPayList = () => {
        props.dispatch({ type: 'PayType/fetch' })
    };

    // 切换仓库
    const changeWarehouse = (e) => {
        setWarehouseId(e);
        setDisplayData(prevDisplayData => prevDisplayData.filter(item => item.productsName === ''));
        getList(e);
    };

    // 提交表单
    const onOK = () => {
        if (orderTime === '') return message.warning('请选择申请时间');
        if (pmId === 0) return message.warning('请选择支付方式');
        const filteredData = displayData.filter(item => item.productsCode !== '' && item.unitsId > 0);
        if (filteredData.length === 0) return message.warning('请选择有效的物品信息');
        const hasInvalidQuantity = filteredData.some(item => item.quantity <= 0);
        if (hasInvalidQuantity) {
            return message.warning('请输入退货数量');
        }
        let jsonData = JSON.stringify(filteredData);
        setSpinning(true);
        props.dispatch({
            type: 'ReturnForm/add',
            payload: { warehouseId, orderCode, orderTime, jsonData, paidAmount, totalAmount, remark, pmId }
        }).then((res: TypeErrorCode) => {
            setSpinning(false);
            if (res.ErrorCode == 0) {
                message.success('添加成功');
                clearAllDraft(); // 提交成功清空草稿缓存
                history.push('/warehouse/outbound');
            } else {
                message.error(res.Data);
            }
        })
    };

    // 修改备注
    const changeRemark = (e) => {
        setRemark(e.target.value);
    };
    // 切换支付方式
    const changePayType = (e) => {
        setPayTypeId(e);
    };
    // 删除单行物品
    const isDel = (id: number) => {
        setDisplayData(displayData.filter((item) => item.id !== id));
    };

    // 新增一行
    const addTenEmptyRecords = () => {
        const maxId = displayData.length > 0
            ? Math.max(...displayData.map(item => item.id))
            : 0;
        const newRecords = Array.from({ length: 1 }, (_, i) => ({
            id: maxId + i + 1,
            productsImageBase64: '',
            brandId: 0,
            abbreviation: '',
            barcode: '',
            costPrice: 0,
            groupId: 0,
            inventoryId: 0,
            number: 0,
            presalePrice: 0,
            price: 0,
            priceKc: 0,
            productsCode: '',
            productsImage: '',
            productsName: '',
            quantity: 0,
            quantityKc: 0,
            retailPricce: 0,
            specifications: '',
            totalPrice: 0,
            unitsId: 0,
            unitsName: '',
            isZk: 1,
            discountRateDp: 100,
            discountPriceDp: 0,
            iList: [],
        }));
        setDisplayData([...displayData, ...newRecords]);
    };

    // 批量新增空行
    const addEmptyRecords = (count: number) => {
        const maxId = displayData.length > 0
            ? Math.max(...displayData.map(item => item.id))
            : 0;
        const newRecords = Array.from({ length: count }, (_, i) => ({
            id: maxId + i + 1,
            productsImageBase64: '',
            brandId: 0,
            abbreviation: '',
            barcode: '',
            costPrice: 0,
            groupId: 0,
            inventoryId: 0,
            number: 0,
            presalePrice: 0,
            price: 0,
            priceKc: 0,
            productsCode: 0,
            productsImage: 0,
            productsName: '',
            quantity: 0,
            quantityKc: 0,
            retailPricce: 0,
            specifications: '',
            totalPrice: 0,
            unitsId: 0,
            unitsName: 0,
            isZk: 1,
            discountRateDp: 100,
            discountPriceDp: 0,
            iList: [],
        }));
        setDisplayData([...displayData, ...newRecords]);
    };

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
                <Input addonBefore="单号:" placeholder='随机生成' value={orderCode} disabled />
                <Space.Compact>
                    <div style={{ borderRadius: '6px 0 0 6px', padding: '0 11px', border: '1px solid #d9d9d9', borderRight: 0, display: 'flex', alignItems: 'center' }}>
                        时间:
                    </div>
                    <DatePicker value={dayjs(orderTime)} onChange={changeDate} />
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
                <Space.Compact>
                    <div style={{ borderRadius: '6px 0 0 6px', padding: '0 11px', border: '1px solid #d9d9d9', borderRight: 0, display: 'flex', alignItems: 'center' }}>
                        支付方式:
                    </div>
                    <Select
                        showSearch
                        placeholder='支付方式'
                        value={pmId || undefined}
                        onChange={changePayType}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={Array.isArray(props.PayTypeList) && props.PayTypeList.length > 0
                            ? props.PayTypeList.map((item: any) => ({
                                label: item.pmName,
                                value: item.id,
                            }))
                            : []}
                    />
                </Space.Compact>
            </Space>
            <Space style={{ marginTop: '10px' }}>
                <InputNumber addonBefore="已付(元):" placeholder='已付金额' min={0} value={paidAmount} onChange={changePaidAmount} />
                <InputNumber addonBefore="总金额(元):" placeholder='总金额' min={0} value={totalAmount} disabled />
                <Input placeholder='备注' value={remark} onChange={changeRemark} maxLength={50} showCount />
            </Space>
            <Table
                columns={columnsz}
                rowKey="id"
                pagination={false}
                size='small'
                scroll={{ y: '55vh' }}
                dataSource={displayData}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            <Button
                type="primary"
                onClick={addTenEmptyRecords}
                style={{ marginTop: '10px' }}
            >
                <PlusOutlined /> 新增一行
            </Button>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    WarehouseList: state.WarehouseList.list,
    PayTypeList: state.PayType.list,
});
export default connect(mapStateToProps)(addReturnForm);