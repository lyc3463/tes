import { useEffect, useState, useCallback } from "react";
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
import { connect, useNavigate, history } from "umi";
import { generate, getCurrentDate } from "@/utils/OpenTool";
import { StaticInfo } from '@/StaticInfo';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

// 缓存唯一标识
const CACHE_KEY = "AddDirectPurchase_draft_cache";
// 空白草稿默认值
const getEmptyDraft = () => ({
    orderCode: "",
    warehouseId: 0,
    supplierId: 0,
    orderTime: getCurrentDate(),
    paidAmount: 0,
    totalAmount: 0,
    remark: "",
    goods: [],
    pmId: 0
});

const AddDirectPurchase = (props) => {
    const navigate = useNavigate();
    const [spinning, setSpinning] = useState(false);
    // 随机单号
    const [orderCode, setOrderCode] = useState('');
    // 仓库id
    const [warehouseId, setWarehouseId] = useState(0);
    // 供应商id
    const [supplierId, setSupplierId] = useState(0);
    // 采购日期
    const [orderTime, setOrderTime] = useState(getCurrentDate());
    // 已付金额
    const [paidAmount, setPaidAmount] = useState(0);
    // 总金额
    const [totalAmount, setTotalAmount] = useState(0);
    // 备注
    const [remark, setRemark] = useState('');
    // 订单物品列表
    const [goods, setGoods] = useState([]);
    const [pmId, setPayTypeId] = useState(0);

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
            warehouseId,
            supplierId,
            orderTime,
            paidAmount,
            totalAmount,
            remark,
            goods,
            pmId
        };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(draft));
    }, [orderCode, warehouseId, supplierId, orderTime, paidAmount, totalAmount, remark, goods, pmId]);

    // 清空缓存+重置所有表单
    const clearAllDraft = useCallback(() => {
        sessionStorage.removeItem(CACHE_KEY);
        const empty = getEmptyDraft();
        const newCode = generate(StaticInfo.park_name);
        setOrderCode(newCode);
        setWarehouseId(empty.warehouseId);
        setSupplierId(empty.supplierId);
        setOrderTime(empty.orderTime);
        setPaidAmount(empty.paidAmount);
        setTotalAmount(empty.totalAmount);
        setRemark(empty.remark);
        setGoods([]);
        setPayTypeId(empty.pmId);
        addTenEmptyRecords1();
        message.info("已清空草稿");
    }, []);

    // ====================== 页面初始化加载缓存 ======================
    useEffect(() => {
        const cache = loadCache();
        if (cache) {
            // 回填缓存全部状态
            setOrderCode(cache.orderCode);
            setWarehouseId(cache.warehouseId);
            setSupplierId(cache.supplierId);
            setOrderTime(cache.orderTime);
            setPaidAmount(cache.paidAmount);
            setTotalAmount(cache.totalAmount);
            setRemark(cache.remark);
            setGoods(cache.goods);
            setPayTypeId(cache.pmId);
        } else {
            // 无缓存：生成单号 + 5条空明细
            const newCode = generate(StaticInfo.park_name);
            setOrderCode(newCode);
            addTenEmptyRecords1();
        }
        // 加载基础下拉接口
        getSupplierList();
        getWarehouseList();
        getThingList();
        getPayList();
    }, [loadCache]);

    // 任意表单状态变更自动保存缓存
    useEffect(() => {
        saveCache();
    }, [saveCache]);

    // 表格自动合计总金额
    useEffect(() => {
        const sum = goods.reduce((acc, item) => {
            const price = (item.totalPrice.toFixed(2) * 1) || 0;
            return acc + price;
        }, 0);
        setTotalAmount(sum);
    }, [goods]);

    const isDel = (id: number) => {
        setGoods(goods.filter((item) => item.id !== id));
    };

    // 处理物品选择变更
    const handleProductSelect = (recordId, productId) => {
        const selectedProduct = props.thingList.find(item => item.id === productId);
        if (!selectedProduct) return;
        let processedUnitsList = selectedProduct.unitsList || [];
        if (selectedProduct.isHs === 1 && processedUnitsList.length > 0) {
            processedUnitsList = [...selectedProduct.unitsList];
            const unitMap = processedUnitsList.reduce((map, unit) => {
                map[unit.from_unit_id] = unit;
                return map;
            }, {});
            const targetUnitId = selectedProduct.unitsId;
            const targetUnit = unitMap[targetUnitId];
            if (!targetUnit) return;
            targetUnit.price = selectedProduct.costPrice || 0;
            targetUnit.presalePrice = selectedProduct.presalePrice || 0;
            targetUnit.retailPricce = selectedProduct.retailPricce || 0;
            let currentUnit = targetUnit;
            while (currentUnit.to_unit_id !== 0) {
                const childUnit = unitMap[currentUnit.to_unit_id];
                if (!childUnit) break;
                childUnit.price = currentUnit.price / currentUnit.conversion_rate;
                childUnit.presalePrice = currentUnit.presalePrice / currentUnit.conversion_rate;
                childUnit.retailPricce = currentUnit.retailPricce / currentUnit.conversion_rate;
                currentUnit = childUnit;
            }
            const parentMap = processedUnitsList.reduce((map, unit) => {
                map[unit.to_unit_id] = unit;
                return map;
            }, {});
            currentUnit = targetUnit;
            while (parentMap[currentUnit.from_unit_id]) {
                const parentUnit = parentMap[currentUnit.from_unit_id];
                if (!parentUnit) break;
                parentUnit.price = currentUnit.price * parentUnit.conversion_rate;
                parentUnit.presalePrice = currentUnit.presalePrice * parentUnit.conversion_rate;
                parentUnit.retailPricce = currentUnit.retailPricce * parentUnit.conversion_rate;
                currentUnit = parentUnit;
            }
        }
        setGoods(goods.map(item => {
            if (item.id === recordId) {
                return {
                    ...item,
                    productsImageBase64: selectedProduct.productsImageBase64 || '',
                    productsName: selectedProduct.productsName,
                    productsCode: selectedProduct.productsCode || '',
                    abbreviation: selectedProduct.abbreviation || '',
                    productsImage: selectedProduct.productsImage || '',
                    brandId: selectedProduct.brandId || 0,
                    groupId: selectedProduct.groupId || 0,
                    number: selectedProduct.number || 0,
                    presalePrice: selectedProduct.presalePrice || 0,
                    retailPricce: selectedProduct.retailPricce || 0,
                    costPrice: selectedProduct.retailPricce || 0,
                    specifications: selectedProduct.specifications || '',
                    barcode: selectedProduct.barcode || '',
                    remark: selectedProduct.remark || '',
                    unitsId: selectedProduct.unitsId || 0,
                    quantity: selectedProduct.quantity || 0,
                    price: selectedProduct.isHs === 0
                        ? (selectedProduct.costPrice || 0)
                        : (selectedProduct.price || 0),
                    totalPrice: selectedProduct.quantity * (selectedProduct.isHs === 0
                        ? (selectedProduct.costPrice || 0)
                        : (selectedProduct.price || 0)) || 0,
                    unitsList: processedUnitsList,
                    isHs: selectedProduct.isHs || 0,
                    unitsName: selectedProduct.unitsName || '',
                };
            }
            return item;
        }));
    };

    // 修改采购数量
    const changproductsNum = (value, recordId) => {
        setGoods(prevGoods =>
            prevGoods.map(item =>
                item.id === recordId ? {
                    ...item,
                    quantity: value || 0,
                    totalPrice: ((value || 0) * item.price).toFixed(2) * 1
                } : item
            )
        );
    };

    // 修改单价
    const changproductsPrice = (value, recordId) => {
        setGoods(prevGoods =>
            prevGoods.map(item =>
                item.id === recordId ? {
                    ...item,
                    price: value || 0,
                    totalPrice: (item.quantity * (value || 0)).toFixed(2) * 1
                } : item
            )
        );
    };

    // 切换单位
    const changeUnitsId = (value, recordId) => {
        setGoods(prevGoods =>
            prevGoods.map(item => {
                if (item.id === recordId) {
                    const selectedUnit = Array.isArray(item.unitsList)
                        ? item.unitsList.find(unit => unit.from_unit_id === value)
                        : null;
                    const newPrice = selectedUnit?.price || 0;
                    const presalePrice = selectedUnit?.presalePrice || 0;
                    const retailPricce = selectedUnit?.retailPricce || 0;
                    return {
                        ...item,
                        unitsId: value || 0,
                        price: (newPrice.toFixed(2)) * 1,
                        presalePrice,
                        retailPricce,
                        totalPrice: ((item.quantity * newPrice).toFixed(2)) * 1
                    };
                }
                return item;
            })
        );
    };

    // 支付方式切换
    const changePayType = (e) => {
        setPayTypeId(e);
    };
    const getPayList = () => {
        props.dispatch({ type: 'PayType/fetch' })
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
                    : `${window.ServerConfig.imgServer}${textStr}.png`;
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
            key: 'productsName',
            render: (text, record) => (
                <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder="搜索物品名称"
                    style={{ width: 120 }}
                    value={text || undefined}
                    onChange={(value) => handleProductSelect(record.id, value)}
                    filterOption={(input, option) => {
                        if (!Array.isArray(props.thingList) || props.thingList.length === 0) return false;
                        const item = props.thingList.find(unit => unit.id == option.value);
                        if (!item) return false;
                        const searchInput = input.toLowerCase();
                        const nameMatch = item.productsName?.toLowerCase().includes(searchInput);
                        const abbrMatch = item.abbreviation?.toLowerCase().includes(searchInput);
                        return nameMatch || abbrMatch;
                    }}
                    options={Array.isArray(props.thingList)
                        ? props.thingList.map(item => ({
                            label: item.productsName,
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
            dataIndex: 'unitsId',
            key: 'unitsId',
            render: (text, record) => (
                <div>
                    <Select
                        placeholder='单位'
                        onChange={(value) => changeUnitsId(value, record.id)}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item = props.UnitSetting.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                            return item?.unitsName?.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={Array.isArray(props.UnitSetting) && props.UnitSetting.length > 0
                            ? props.UnitSetting.map((item:any)=>({
                                label:item.unitsName,
                                value:item.id,
                            }))
                            : []}
                    />
                </div>
            )
        },
        {
            title: '数量',
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
            render: (text, record) => (
                <InputNumber
                    min={0}
                    value={text}
                    onChange={(value) => changproductsPrice(value, record.id)}
                />
            )
        },
        {
            title: '总价钱(元)',
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
            title: '操作',
            dataIndex: 'delete',
            key: 'delete',
            render: (text, record) => {
                return <Button type='primary' danger onClick={() => isDel(record.id)}>删除</Button>
            }
        },
    ];

    // 供应商切换
    const changeSupplier = (e) => {
        setSupplierId(e);
    };
    const getSupplierList = () => {
        props.dispatch({ type: "Supplier/fetch" })
    };
    const getWarehouseList = () => {
        props.dispatch({ type: "WarehouseList/fetch" })
    };
    const getThingList = () => {
        props.dispatch({
            type: "ThingList/fetch",
            payload: { page: 1, code: '', name: '', pageSize: 10000 },
        })
    };

    // 仓库切换
    const changeWarehouse = (e) => {
        setWarehouseId(e);
    };
    // 采购日期
    const changeDate = (_: any, item: string) => {
        setOrderTime(item);
    };
    // 已付金额
    const changePaidAmount = (e) => {
        setPaidAmount(e);
    };
    // 总金额手动修改
    const changeTotalAmount = (e) => {
        setTotalAmount(e);
    };
    // 备注
    const changeRemark = (e) => {
        setRemark(e.target.value);
    };

    // 提交表单
    const onOk = () => {
        const filteredGoods = goods.filter(item => item.productsName?.trim() !== '');
        if (filteredGoods.length === 0) {
            message.error('请至少添加一个物品');
            return;
        }
        const hasInvalidItem = filteredGoods.some(item => {
            const unitEmpty = item.unitsId <= 0;
            const quantityEmpty = item.quantity <= 0;
            return unitEmpty || quantityEmpty;
        });
        if (hasInvalidItem) {
            message.error('请确保所有采购的入库数量大于0且已选择单位');
            return;
        }
        if (warehouseId === 0) {
            message.error('请选择入库仓库');
            return;
        }
        if (supplierId === 0) {
            message.error('请选择供应商');
            return;
        }
        if (orderTime === '') {
            message.error('请选择采购日期');
            return;
        }
        if (pmId === 0) {
            message.error('请选择支付方式');
            return;
        }
        let jsonData = JSON.stringify(filteredGoods);
        console.log(filteredGoods);
        props.dispatch({
            type: "DirectPurchase/add",
            payload: { orderCode, orderTime, warehouseId, supplierId, paidAmount, totalAmount, remark, jsonData, pmId },
        }).then((res: TypeErrorCode) => {
            if (res.ErrorCode == 0) {
                message.success('添加成功');
                clearAllDraft(); // 提交成功清空缓存草稿
                history.push('/warehouse/checkPurchaseRequest')
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        })
    };

    // 新增一行
    const addTenEmptyRecords = () => {
        const maxId = goods.length > 0
            ? Math.max(...goods.map(item => item.id))
            : 0;
        const newRecords = Array.from({ length: 1 }, (_, i) => ({
            id: maxId + i + 1,
            productsImageBase64: '',
            productsName: '',
            productsCode: '',
            abbreviation: '',
            productsImage: '',
            brandId: 0,
            groupId: 0,
            number: 0,
            presalePrice: 0,
            retailPricce: 0,
            costPrice: 0,
            specifications: '',
            barcode: '',
            remark: '',
            unitsId: 0,
            quantity: 0,
            price: 0,
            totalPrice: 0,
            unitsList: [],
            isHs: 0,
            unitsName: ''
        }));
        setGoods([...goods, ...newRecords]);
    };
    // 初始化5条空行
    const addTenEmptyRecords1 = () => {
        const maxId = goods.length > 0
            ? Math.max(...goods.map(item => item.id))
            : 0;
        const newRecords = Array.from({ length: 5 }, (_, i) => ({
            id: maxId + i + 1,
            productsImageBase64: '',
            productsName: '',
            productsCode: '',
            abbreviation: '',
            productsImage: '',
            brandId: 0,
            groupId: 0,
            number: 0,
            presalePrice: 0,
            retailPricce: 0,
            costPrice: 0,
            specifications: '',
            barcode: '',
            remark: '',
            unitsId: 0,
            quantity: 0,
            price: 0,
            totalPrice: 0,
            unitsList: [],
            isHs: 0,
            unitsName: ''
        }));
        setGoods([...goods, ...newRecords]);
    };

    return (
        <Spin spinning={spinning}>
            <Space>
                <Button type="primary" onClick={() => navigate(-1)}>
                    返回
                </Button>
                <Button type="primary" onClick={onOk}>
                    确定
                </Button>
                <Button danger onClick={clearAllDraft}>清空草稿</Button>
            </Space>
            <Space style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', margin: '10px 0' }}>
                <Input addonBefore="单号:" placeholder='随机生成' value={orderCode} disabled />
                <DatePicker placeholder={'选择采购日期'} onChange={changeDate} value={dayjs(orderTime)} />
                <Select
                    placeholder='请选择入库仓库'
                    value={warehouseId || undefined}
                    onChange={changeWarehouse}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                        const item = props.warehouseListList.find(unit => unit.id == option.value);
                        return item?.warehouseName?.toLowerCase().includes(input.toLowerCase());
                    }}
                    options={Array.isArray(props.warehouseListList) && props.warehouseListList.length > 0
                        ? props.warehouseListList.map((item: any) => ({
                            label: item.warehouseName,
                            value: item.id,
                        }))
                        : []}
                />
                <Select
                    placeholder='请选择供应商'
                    value={supplierId || undefined}
                    onChange={changeSupplier}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                        const item = props.supplierList.find(unit => unit.id == option.value);
                        return item?.supplierName?.toLowerCase().includes(input.toLowerCase());
                    }}
                    options={Array.isArray(props.supplierList) && props.supplierList.length > 0
                        ? props.supplierList.map((item: any) => ({
                            label: item.supplierName,
                            value: item.id,
                        }))
                        : []}
                />
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
            <Space>
                <InputNumber addonBefore="已付(元):" placeholder='已付金额' min={0} value={paidAmount} onChange={changePaidAmount} />
                <InputNumber addonBefore="总金额(元):" placeholder='总金额' disabled min={0} value={totalAmount} onChange={changeTotalAmount} />
                <Input addonBefore="备注:" placeholder='50字以下' style={{ width: '300px' }} value={remark} onChange={changeRemark} />
            </Space>
            <Table
                columns={columnsz}
                rowKey={(columns) => columns.id}
                pagination={false}
                size='small'
                scroll={{ y: '55vh' }}
                dataSource={goods}
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
    warehouseListList: state.WarehouseList.list,
    supplierList: state.Supplier.list,
    thingList: state.ThingList.list,
    PayTypeList: state.PayType.list,
});
export default connect(mapStateToProps)(AddDirectPurchase);