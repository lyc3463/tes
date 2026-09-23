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
import * as ThingListvice from "@/services/unitCalculation";
import * as AppPzService from "@/services/appPz";

// 缓存唯一标识
const CACHE_KEY = "addSalesList_draft_cache";
// 空白草稿默认值
const getEmptyDraft = () => ({
    orderCode: "",
    remark: "",
    orderTime: getCurrentDate(),
    warehouseId: 0,
    displayData: [],
    paidAmount: 0,
    totalAmount: 0,
    discountPrice: 0,
    discountRate: 100,
    customerId: 0,
    pmId: 0,
    mixDiscountRate: 0,
    salesperson: StaticInfo.userId,
    selectedRowKeys: []
});

const addSalesList = (props) => {
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
    // 添加销售的物品
    const [displayData, setDisplayData] = useState([]);
    // 库存的物品
    const [thingStockInfoList, setThingStockInfoList] = useState([]);
    // 选中行的id
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    // 已付金额
    const [paidAmount, setPaidAmount] = useState(0);
    // 折后金额
    const [totalAmount, setTotalAmount] = useState(0);
    // 总金额
    const [discountPrice, setDiscountPrice] = useState(0);
    // 折扣率
    const [discountRate, setDiscountRate] = useState(100);
    // 客户id
    const [customerId, setCustomerId] = useState(0);
    const [pmId, setPayTypeId] = useState(0);
    const [mixDiscountRate, setMixDiscountRate] = useState(0);
    // 销售人
    const [salesperson, setSalesPerson] = useState(StaticInfo.userId);

    // ====================== 缓存工具函数 ======================
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

    // 保存完整草稿到缓存
    const saveCache = useCallback(() => {
        const draft = {
            orderCode,
            remark,
            orderTime,
            warehouseId,
            displayData,
            paidAmount,
            totalAmount,
            discountPrice,
            discountRate,
            customerId,
            pmId,
            mixDiscountRate,
            salesperson,
            selectedRowKeys
        };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(draft));
    }, [
        orderCode, remark, orderTime, warehouseId, displayData,
        paidAmount, totalAmount, discountPrice, discountRate,
        customerId, pmId, mixDiscountRate, salesperson, selectedRowKeys
    ]);

    // 清空缓存+重置所有表单
    const clearAllDraft = useCallback(() => {
        sessionStorage.removeItem(CACHE_KEY);
        const empty = getEmptyDraft();
        const newCode = generate(StaticInfo.park_name);
        setOrderCode(newCode);
        setRemark(empty.remark);
        setOrderTime(empty.orderTime);
        setWarehouseId(empty.warehouseId);
        setDisplayData([]);
        setPaidAmount(empty.paidAmount);
        setTotalAmount(empty.totalAmount);
        setDiscountPrice(empty.discountPrice);
        setDiscountRate(empty.discountRate);
        setCustomerId(empty.customerId);
        setPayTypeId(empty.pmId);
        setMixDiscountRate(empty.mixDiscountRate);
        setSalesPerson(empty.salesperson);
        setSelectedRowKeys(empty.selectedRowKeys);
        addEmptyRecords(5);
        message.info("已清空草稿");
    }, []);

    // ====================== 页面初始化加载缓存 ======================
    useEffect(() => {
        const cache = loadCache();
        if (cache) {
            // 回填缓存全部状态
            setOrderCode(cache.orderCode);
            setRemark(cache.remark);
            setOrderTime(cache.orderTime);
            setWarehouseId(cache.warehouseId);
            setDisplayData(cache.displayData);
            setPaidAmount(cache.paidAmount);
            setTotalAmount(cache.totalAmount);
            setDiscountPrice(cache.discountPrice);
            setDiscountRate(cache.discountRate);
            setCustomerId(cache.customerId);
            setPayTypeId(cache.pmId);
            setMixDiscountRate(cache.mixDiscountRate);
            setSalesPerson(cache.salesperson);
            setSelectedRowKeys(cache.selectedRowKeys);
        } else {
            // 无缓存：生成单号 + 5条空明细
            const newCode = generate(StaticInfo.park_name);
            setOrderCode(newCode);
            addEmptyRecords(5);
        }
        // 基础接口
        getWarehouseList();
        getPayList();
        getUserList();
        getThenBuckleSttings();
    }, [loadCache]);

    // 任意状态变更自动保存缓存
    useEffect(() => {
        saveCache();
    }, [saveCache]);

    const getThenBuckleSttings = () => {
        AppPzService.thenBuckleOne().then((res: TypeErrorCode) => {
            if (res.ErrorCode === 0 && res.Data !== null) {
                setMixDiscountRate(res.Data.discount);
            } else {
                setMixDiscountRate(0);
            }
        })
    };

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
                ) : (
                    ''
                );
            }
        },
        {
            title: '物品选择',
            dataIndex: 'inventoryId',
            key: 'inventoryId',
            width: 300,
            render: (text, record) => (
                <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder="搜索物品名称"
                    style={{ width: '100%' }}
                    value={text || undefined}
                    onChange={(value) => handleProductSelect(value, record)}
                    filterOption={(input, option) => {
                        if (!Array.isArray(thingStockInfoList) || thingStockInfoList.length === 0) return false;
                        const item = thingStockInfoList.find(unit => `${unit.unitsName}${unit.productsName}` === option.value);
                        if (!item) return false;
                        const searchInput = input.toLowerCase();
                        return item.productsName?.toLowerCase().includes(searchInput);
                    }}
                    options={Array.isArray(thingStockInfoList)
                        ? thingStockInfoList.map(item => ({
                            label: `${item.unitsName}-${item.productsName}`,
                            value: item.id
                        }))
                        : []}
                />
            )
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
            render: (text, record) => (
                <Input
                    min={0}
                    value={text}
                />
            )
        },
        {
            title: '出库数量',
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
            title: '折扣%',
            dataIndex: 'discountRateDp',
            key: 'discountRateDp',
            render: (text, record) => (
                <InputNumber
                    min={mixDiscountRate}
                    max={100}
                    value={text}
                    disabled={record.isZk === 0}
                    onChange={(value) => changeDiscount(value, record.id)}
                />
            )
        },
        {
            title: '折后金额(元)',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (text, record) => (
                <InputNumber
                    min={0}
                    disabled
                    value={text}
                />
            )
        },
        {
            title: '零售价(元)',
            dataIndex: 'price',
            key: 'price',
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

    // 选择单位
    // 替换你现有的 handleUnitSelect
    const handleUnitSelect = (recordId, unitId) => {
        const currentRecord = displayData.find(item => item.id === recordId);
        if (!currentRecord || !Array.isArray(currentRecord.iList)) return;
        const selectedUnit = currentRecord.iList.find(unit => unit.unitsId === unitId);
        console.log('selectedUnit',selectedUnit)
        if (!selectedUnit) return;
        setDisplayData(displayData.map((item: any) => {
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
                    price: selectedUnit.retailPricce || 0, // 零售价(元)
                    priceKc: selectedUnit.priceKc || 0,
                    productsCode: selectedUnit.productsCode || '',
                    quantity: 0,
                    quantityKc: selectedUnit.quantity || 0,
                    retailPricce: selectedUnit.retailPricce || 0,
                    specifications: selectedUnit.specifications || '',
                    totalPrice: 0,
                    unitsId: selectedUnit.unitsId || 0,
                    unitsName: selectedUnit.unitsName || '',
                    isZk: selectedUnit.isZk || 1,
                    discountRateDp: selectedUnit.discountRateDp || 100,
                    discountPriceDp: selectedUnit.discountPriceDp || 0,
                };
            }
            return item;
        }));
    };
    // 删除物品
    const isDel = (id: number) => {
        setDisplayData(displayData.filter((item) => item.id !== id));
    };

    // 处理物品选择变更
    const handleProductSelect = (value, record) => {
        const selectedProduct = thingStockInfoList.find(item => item.id == value);
        console.log('选择的物品', selectedProduct);
        setDisplayData(displayData.map(item => {
            if (item.id === record.id) {
                return {
                    ...item,
                    productsImage: selectedProduct.productsImage || '',
                    productsName: selectedProduct.productsName || '',
                    iList: selectedProduct.unitsList || [],
                    brandId: 0,
                    costPrice: 0,
                    inventoryId: selectedProduct.id,
                    presalePrice: selectedProduct.presalePrice,
                    price: selectedProduct.price,
                    priceKc: 0,
                    productsCode: selectedProduct.productsCode,
                    quantity: 0,
                    productsId:selectedProduct.productsId,
                    quantityKc: selectedProduct.quantity || 0,
                    retailPricce: selectedProduct.presalePrice,
                    totalPrice: 0,
                    unitsId: selectedProduct.unitsId || 0,
                    unitsName: selectedProduct.unitsName || '',
                    isZk: 1,
                    discountRateDp: 100,
                    discountPriceDp: 0,
                };
            }
            return item;
        }));


        // const selectedProduct = thingStockInfoList.find(item => item.productsName === label.label);
        // ThingStockInfoServer.productsNameQuery(warehouseId, selectedProduct.productsCode).then((res: TypeErrorCode) => {
        //     console.log('选择的物品', res);
        //     if (res.ErrorCode == 0) {
        //         setDisplayData(displayData.map(item => {
        //             if (item.id === recordId) {
        //                 return {
        //                     ...item,
        //                     productsImageBase64: res.Data.productsImageBase64 || '',
        //                     productsImage: res.Data.productsImage || '',
        //                     productsName: selectedProduct.productsName || '',
        //                     iList: res.Data.iList || [],
        //                     brandId: 0,
        //                     abbreviation: '',
        //                     barcode: '',
        //                     costPrice: 0,
        //                     groupId: 0,
        //                     inventoryId: 0,
        //                     number: 0,
        //                     presalePrice: 0,
        //                     price: 0,
        //                     priceKc: 0,
        //                     productsCode: 0,
        //                     quantity: 0,
        //                     quantityKc: 0,
        //                     retailPricce: 0,
        //                     specifications: '',
        //                     totalPrice: 0,
        //                     unitsId: 0,
        //                     unitsName: 0,
        //                     isZk: 1,
        //                     discountRateDp: 100,
        //                     discountPriceDp: 0,
        //                 };
        //             }
        //             return item;
        //         }));
        //     } else {
        //         message.error(res.Data);
        //     }
        // })
    };
    // 修改出库数量
    const changproductsNum = (value, recordId) => {
        if (value === null) return;
        const updatedData = displayData.map(item => {
            if (item.id === recordId) {
                const quantity = value;
                const discountedPrice = quantity * (item.price || 0) * (item.discountRateDp || 0) / 100;
                const minPrice = quantity * (item.presalePrice || 0);
                const totalPrice = Math.max(discountedPrice, minPrice);
                return {
                    ...item,
                    quantity: quantity,
                    totalPrice: Number(totalPrice.toFixed(2))
                };
            }
            return item;
        });
        setDisplayData(updatedData);
    };

    // 批量勾选行同步折扣
    const handleDefaultSelect = (selectedKeys: React.Key[]) => {
        setDisplayData(prevData =>
            prevData.map(item => {
                const isSelected = selectedKeys.includes(item.id);
                const newDiscount = isSelected ? discountRate : 100;
                const newTotalPrice = Math.max(
                    (item.quantity || 0) * (item.price || 0) * newDiscount / 100,
                    (item.quantity || 0) * (item.presalePrice || 0)
                );
                return {
                    ...item,
                    isZk: isSelected ? 1 : 0,
                    discountRateDp: newDiscount,
                    totalPrice: newTotalPrice,
                };
            })
        );
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[]) => {
            setSelectedRowKeys(selectedKeys);
            setDisplayData(prevData =>
                prevData.map(item => {
                    const isSelected = selectedKeys.includes(item.id);
                    const newDiscount = isSelected ? discountRate : 100;
                    const newTotalPrice = Math.max(
                        (item.quantity || 0) * (item.price || 0) * newDiscount / 100,
                        (item.quantity || 0) * (item.presalePrice || 0)
                    );
                    return {
                        ...item,
                        isZk: isSelected ? 1 : 0,
                        discountRateDp: newDiscount,
                        totalPrice: newTotalPrice
                    };
                })
            );
        },
        type: 'checkbox',
    };

    // 日期切换
    const changeDate = (date: dayjs.Dayjs, item: string) => {
        setOrderTime(item);
    };

    // 获取库存列表
    const getList = (e) => {
        setSpinning(true);
        ThingStockInfoServer.selectFetch(e).then((res: TypeErrorCode) => {
            if (res.ErrorCode == 0) {
                console.log('物品列表',res)
                setThingStockInfoList(res.Data);
            }
            setSpinning(false);
        })
    };

    // 仓库下拉接口
    const getWarehouseList = () => {
        props.dispatch({
            type: "WarehouseList/fetch",
            payload: { page: 1, warehouseName: '', personName: '', personPhone: '', pageSize: 50, isXs: 1 }
        })
    };

    // 切换仓库
    const changeWarehouse = (e) => {
        setWarehouseId(e);
        setDisplayData(prevDisplayData => prevDisplayData.filter(item => item.productsName === ''));
        getList(e);
    };

    // 提交保存
    const onOK = (orderStatus = 1) => {
        if (orderTime === '') return message.warning('请选择申请时间');
        if (customerId === 0) return message.warning('请选择客户');
        if (pmId === 0) return message.warning('请选择支付类型');
        if (salesperson === '') return message.warning('请填写销售人');
        if (discountRate < mixDiscountRate) return message.warning(`折扣率不能低于扣率${mixDiscountRate}%`);
        const filteredData = displayData.filter(item => item.productsCode !== '' && item.unitsId > 0);
        if (filteredData.length === 0) return message.warning('请选择有效的物品信息');
        const hasInvalidQuantity = filteredData.some(item => item.quantity <= 0);
        if (hasInvalidQuantity) {
            return message.warning('请输入销售数量');
        }
        let newFilteredData = filteredData.map((item:any)=>({
            inventoryId: item.inventoryId,
            quantity: item.quantity,
            unitsId: item.unitsId,
            productsName: item.productsName,
            productsCode: item.productsCode,
            productsImage: item.productsImage,
            price: item.price,
            totalPrice: item.totalPrice,
            discountRateDp: item.discountRateDp,
            discountPriceDp: item.discountPriceDp,
            isZk: item.isZk,
            id: item.productsId,
        }));
        let jsonData = JSON.stringify(newFilteredData);
        setSpinning(true);
        props.dispatch({
            type: 'SalesList/add',
            payload: { warehouseId, orderCode, orderTime, jsonData, paidAmount, totalAmount, discountPrice, remark, pmId, customerId, discountRate, salesperson, orderStatus }
        }).then((res: TypeErrorCode) => {
            setSpinning(false);
            if (res.ErrorCode == 0) {
                message.success('添加成功');
                clearAllDraft();
                history.push('/warehouse/sales');
            } else {
                message.error(res.Data);
            }
        })
    };

    // 备注输入
    const changeRemark = (e) => {
        setRemark(e.target.value);
    };

    // 客户切换
    const changeCustomerId = (e) => {
        setCustomerId(e);
    };

    // 全局折扣率变更
    const changeDiscountRate = (e: number) => {
        if (e === null) return;
        setDiscountRate(e);
        setDisplayData(prevData =>
            prevData.map(item => {
                if (item.isZk === 1) {
                    const baseTotalPrice = (item.quantity || 0) * (item.price || 0) * e / 100;
                    const presaleTotal = (item.quantity || 0) * (item.presalePrice || 0);
                    const totalPrice = Math.max(baseTotalPrice, presaleTotal);
                    return {
                        ...item,
                        discountRateDp: e,
                        totalPrice: totalPrice
                    };
                }
                return item;
            })
        );
    };

    // 单行物品折扣修改
    const changeDiscount = (value, recordId) => {
        if (value === null) return;
        setDisplayData(prevData =>
            prevData.map(item => {
                if (item.id === recordId) {
                    const newDiscount = value || 0;
                    const baseTotalPrice = (item.quantity || 0) * (item.price || 0) * newDiscount / 100;
                    const presaleTotal = (item.quantity || 0) * (item.presalePrice || 0);
                    const totalPrice = Math.max(baseTotalPrice, presaleTotal);
                    return {
                        ...item,
                        discountRateDp: newDiscount,
                        totalPrice: totalPrice
                    };
                }
                return item;
            })
        );
    };

    // 支付方式下拉
    const getPayList = () => {
        props.dispatch({
            type: 'PayType/fetch',
        })
    };
    const changePayType = (e) => {
        setPayTypeId(e);
    };

    // 用户列表接口
    const getUserList = () => {
        props.dispatch({
            type:'AppUser/fetch',
        })
    };
    const changeSalesPerson = (e) => {
        setSalesPerson(e);
    };



    // 实收金额修改
    const changePaidAmount = (e) => {
        setPaidAmount(e);
    };

    // 新增单行空记录
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

    // 自动计算总金额
    useEffect(() => {
        const totalSum = displayData.reduce((acc, item) => {
            const itemTotal = (item.quantity || 0) * (item.price || 0);
            return acc + itemTotal;
        }, 0);
        const discountedSum = totalSum * (discountRate / 100);
        setDiscountPrice(totalSum);
        setTotalAmount(discountedSum);
    }, [displayData, discountRate]);

    useEffect(() => {
        const totalSum = displayData.reduce((acc, item) => {
            const itemOriginalTotal = (item.quantity || 0) * (item.price || 0);
            return acc + itemOriginalTotal;
        }, 0);
        const totalDiscountedSum = displayData.reduce((acc, item) => {
            return acc + (item.totalPrice || 0);
        }, 0);
        setDiscountPrice(totalSum);
        setTotalAmount(totalDiscountedSum);
    }, [displayData]);

    return (
        <Spin spinning={spinning}>
            <Space>
                <Button type="primary" onClick={() => navigate(-1)}>
                    返回
                </Button>
                <Button type="primary" onClick={() => onOK(1)}>
                    保存草稿
                </Button>
                <Button type="primary" danger onClick={() => onOK(5)}>
                    直接送审
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
                        showSearch
                        placeholder='请选择仓库'
                        value={warehouseId || undefined}
                        onChange={changeWarehouse}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
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
                        客户:
                    </div>
                    <Select
                        style={{ width: 150 }}
                        showSearch
                        placeholder='客户'
                        value={customerId || undefined}
                        onChange={changeCustomerId}
                        filterOption={(input, option) => {
                            const item = props.AppUserList.find(unit => unit.userId == option.value);
                            return item?.userName?.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={Array.isArray(props.AppUserList) && props.AppUserList.length > 0
                            ? props.AppUserList.map((item: any) => ({
                                label: item.userName,
                                value: item.userId,
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
                <Input placeholder='备注' value={remark} onChange={changeRemark} maxLength={50} showCount />
            </Space>
            <Space style={{ marginTop: '10px' }}>
                <InputNumber addonBefore="总金额(元):" placeholder='总金额' min={0} disabled value={discountPrice} />
                <InputNumber addonBefore="折扣%:" placeholder='折扣%' min={mixDiscountRate} max={100} value={discountRate} onChange={changeDiscountRate} />
                <InputNumber addonBefore="折后金额:" placeholder='折后金额' min={0} value={totalAmount} disabled />
                <InputNumber addonBefore="实收金额(元):" placeholder='实收金额' min={0} value={paidAmount} onChange={changePaidAmount} />
                <Space.Compact>
                    <div style={{ borderRadius: '6px 0 0 6px', padding: '0 11px', border: '1px solid #d9d9d9', borderRight: 0, display: 'flex', alignItems: 'center' }}>
                        销售人:
                    </div>
                    <Select
                        style={{ width: 200 }}
                        showSearch
                        placeholder='销售人'
                        value={salesperson || undefined}
                        onChange={changeSalesPerson}
                        filterOption={(input, option) => {
                            const item = props.UsersList.find(unit => unit.id == option.value);
                            return item?.user_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={Array.isArray(props.UsersList) && props.UsersList.length > 0
                            ? props.UsersList.map((item: any) => ({
                                label: item.user_name,
                                value: item.id,
                            }))
                            : []}
                    />
                </Space.Compact>
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
                rowSelection={rowSelection}
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
    AppUserList: state.AppUser.list,
    PayTypeList: state.PayType.list,
    UsersList: state.Users.list,
});
export default connect(mapStateToProps)(addSalesList);