import {
    Badge,
    Button, Card,
    DatePicker,
    Image,
    Input,
    InputNumber,
    message,
    Modal, Popconfirm,
    Radio,
    Select,
    Space,
    Spin,
    Table
} from "antd";
import { useEffect, useState, useCallback } from "react";
import { connect, useNavigate } from "umi";
import dayjs from "dayjs";
import {generate, getCurrentDate, getImgSrc} from "@/utils/OpenTool";
import { StaticInfo } from "@/StaticInfo";
import {ClearOutlined, DeleteOutlined, FilePdfOutlined} from "@ant-design/icons";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as ProjectService from "@/services/project";
import ImageUploadPng from "@/components/ImageUploadPng";
import FilteredProcurementList from "@/components/FilteredProcurementList";
import CaigouTagList from "@/components/CaigouTagListProps";
import PdfUpload from "@/components/PdfUpload";

// 缓存key
const CACHE_KEY = "AddInvoiceFinancialDala_form_cache";

// 默认初始值
const getDefaultState = () => ({
    orderDate: getCurrentDate(),
    orderCode: "",
    goodsList: [],
    accountType: 0,
    totalAmount: 0,
    paidAmount: 0,
    companyId: 0,
    accountId: 0,
    projectId: 0,
    moneyType: 3,
    supplierId: 0,
    remark: "",
    imgList: [],
    caigou: [],
    pdfFileName: [],
});

const AddInvoiceFinancialDala = (props: any) => {
    const [spinning, setSpinning] = useState(false);
    const navigate = useNavigate();
    // 恢复分散独立state，和你原始结构一致，监听不会失效
    const [orderDate, setOrderDate] = useState(getCurrentDate());
    const [orderCode, setOrderCode] = useState('');
    const [goodsList, setGoodsList] = useState<any[]>([]);
    const [accountType, setAccountType] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);
    const [companyId, setCompanyId] = useState(0);
    const [accountId, setAccountId] = useState(0);
    const [projectId, setProjectId] = useState(0);
    const [moneyType, setMoneyType] = useState(3);
    const [supplierId, setSupplierId] = useState(0);
    const [remark, setRemark] = useState('');
    const [imgList, setImgList] = useState<string[]>([]);
    const [caigou, setCaigou] = useState<any[]>([]);
    const [isOpenprocurement, setIsOpenprocurement] = useState(false);
    const [isOpenInfo, setIsOpenInfo] = useState(false);
    const [pdfFileName, setPdfFileName] = useState([]);


    // 读取缓存
    const loadCache = useCallback(() => {
        const str = sessionStorage.getItem(CACHE_KEY);
        if (!str) return null;
        try {
            return JSON.parse(str);
        } catch (e) {
            sessionStorage.removeItem(CACHE_KEY);
            return null;
        }
    }, []);

    // 保存全部表单到缓存
    const saveCache = useCallback(() => {
        const data = {
            orderDate,
            orderCode,
            goodsList,
            accountType,
            totalAmount,
            paidAmount,
            companyId,
            accountId,
            projectId,
            moneyType,
            supplierId,
            remark,
            imgList,
            caigou,
            pdfFileName
        };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
    }, [
        orderDate, orderCode, goodsList, accountType, totalAmount, paidAmount,
        companyId, accountId, projectId, moneyType, supplierId, remark, imgList, caigou,pdfFileName
    ]);

    // 清空缓存
    const clearCache = () => sessionStorage.removeItem(CACHE_KEY);

    // 页面初始化：加载缓存回填所有state
    useEffect(() => {
        const cache = loadCache();
        if (cache) {
            setOrderDate(cache.orderDate);
            setOrderCode(cache.orderCode);
            setGoodsList(cache.goodsList);
            setAccountType(cache.accountType);
            setTotalAmount(cache.totalAmount);
            setPaidAmount(cache.paidAmount);
            setCompanyId(cache.companyId);
            setAccountId(cache.accountId);
            setProjectId(cache.projectId);
            setMoneyType(cache.moneyType);
            setSupplierId(cache.supplierId);
            setRemark(cache.remark);
            setImgList(cache.imgList);
            setCaigou(cache.caigou);
            setPdfFileName(cache.pdfFileName);
            // 有缓存，判断明细行数，不足7行补齐
            const needNum = 7 - cache.goodsList.length;
            if (needNum > 0) {
                generateMultipleRecords(needNum);
            }
        } else {
            // 无缓存，初始化单号+7条空明细
            const code = generate(StaticInfo.park_name);
            setOrderCode(code);
            generateMultipleRecords(7);
        }
        // 加载基础下拉数据
        getCompanList();
        getProjectList(0);
        getSupplierList();
        getSubjectList();
    }, []);

    // 【核心】任意表单字段变动，自动存入缓存
    useEffect(() => {
        saveCache();
    }, [saveCache]);

    // 【原样保留你原来的明细汇总逻辑，goodsList监听完全不受影响】
    useEffect(() => {
        const sum = goodsList.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
        setTotalAmount(Number(sum.toFixed(2)));
    }, [goodsList]);

    // 生成空明细行
    const generateMultipleRecords = (count: number) => {
        const maxId = goodsList.length > 0 ? Math.max(...goodsList.map(i => i.id)) : 0;
        const newRows = Array.from({ length: count }, (_, i) => ({
            id: maxId + i + 1,
            subjectName: '',
            summary: '',
            amount: 0,
            quantity: 0,
            unit: '',
            unitPrice: 0,
        }));
        setGoodsList(prev => [...prev, ...newRows]);
    };

    // 表格列
    const columnsz = [
        {
            title: '科目',
            dataIndex: 'subject',
            key: 'subject',
            width: 140,
            render: (text: string, record: any) => (
                <Select
                    style={{ width: '100%' }}
                    onChange={(value, option) => handleSubjectChange(record.id, value, option.label)}
                    showSearch
                    filterOption={(input, option) => {
                        const item = props.SubjectList.find(unit => unit.id == option.value);
                        return item?.subject_name?.toLowerCase().includes(input.toLowerCase());
                    }}
                    options={Array.isArray(props.SubjectList)
                        ? props.SubjectList.map((item: any) => ({ label: item.subject_name, value: item.id }))
                        : []}
                />
            )
        },
        { title: '科目名称', dataIndex: 'subjectName', key: 'subjectName', width: 150, ellipsis: true },
        {
            title: '用途',
            dataIndex: 'summary',
            key: 'summary',
            width: 300,
            align: 'center',
            render: (text: string, record: any) => (
                <Input
                    style={{ width: '100%' }}
                    value={text}
                    onChange={(e) => handleSummaryChange(record.id, e.target.value)}
                />
            )
        },
        {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 110,
            render: (text: number, record: any) => (
                <InputNumber
                    style={{ width: '100%' }}
                    value={text}
                    min={0}
                    onChange={(value) => {
                        setGoodsList(prev => prev.map(item =>
                            item.id === record.id
                                ? { ...item, quantity: value, amount: Number((value * record.unitPrice).toFixed(2)) }
                                : item
                        ));
                    }}
                />
            )
        },
        {
            title: '单位',
            dataIndex: 'unit',
            key: 'unit',
            width: 100,
            render: (text: string, record: any) => (
                <Input
                    style={{ width: '100%' }}
                    value={text}
                    onChange={(e) => handleUnitChange(record.id, e.target.value)}
                />
            )
        },
        {
            title: '单价',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            width: 120,
            render: (text: number, record: any) => (
                <InputNumber
                    style={{ width: '100%' }}
                    value={text}
                    min={0}
                    onChange={(value) => {
                        setGoodsList(prev => prev.map(item =>
                            item.id === record.id
                                ? { ...item, unitPrice: value, amount: Number((value * record.quantity).toFixed(2)) }
                                : item
                        ));
                    }}
                />
            )
        },
        {
            title: '金额(元)',
            dataIndex: 'amount',
            key: 'amount',
            width: 120,
            render: (text: number, record: any) => (
                <InputNumber
                    style={{ width: '100%' }}
                    value={text}
                    min={0}
                    onChange={(value) => handleAmountChange(record.id, value as number)}
                />
            )
        },
        {
            title: '操作',
            key: 'action',
            width: 80,
            render: (_: any, record: any) => (
                <Button
                    type="text"
                    icon={<ClearOutlined />}
                    onClick={() => handleClearRow(record.id)}
                />
            )
        }
    ];

    // 明细操作函数（全部恢复原生setGoodsList，无闭包延迟）
    const handleUnitChange = (id: number, value: string) => {
        setGoodsList(prev => prev.map(item => item.id === id ? { ...item, unit: value } : item));
    };
    const handleSubjectChange = (id: number, value: string, label: string) => {
        setGoodsList(prev => prev.map(item => item.id === id ? { ...item, subjectName: label } : item));
    };
    const handleSummaryChange = (id: number, value: string) => {
        setGoodsList(prev => prev.map(item => item.id === id ? { ...item, summary: value } : item));
    };
    const handleAmountChange = (id: number, value: number) => {
        setGoodsList(prev => prev.map(item => item.id === id ? { ...item, amount: value } : item));
    };
    const handleClearRow = (id: number) => {
        setGoodsList(prev => prev.map(item => item.id === id ? {
            ...item, subjectName: '', summary: '', amount: 0, quantity: 0, unit: '', unitPrice: 0
        } : item));
    };

    // 基础表单变更
    const changePaidAmount = (val: number) => setPaidAmount(val);
    const changeMoneyType = (e: any) => setMoneyType(e.target.value);
    const changeCompanyId = (val: number) => {
        setCompanyId(val);
        setProjectId(0);
        setAccountId(0);
        getProjectList(val);
    };
    const changeData = (_: any, dateStr: string) => setOrderDate(dateStr);
    const getOrderCode = () => setOrderCode(generate(StaticInfo.park_name));
    const changeSupplierId = (val: number) => setSupplierId(val);
    const changeProjectId = (val: number) => {
        setProjectId(val);
        ProjectService.one(val).then((res: any) => setCompanyId(res.Data.company_id));
    };
    const changeRemark = (e: any) => setRemark(e.target.value);

    // 图片
    const onImageUpload = (imgName: string) => setImgList(prev => [...prev, imgName]);
    const handleDeleteunitImg = (index: number) => setImgList(prev => prev.filter((_, i) => i !== index));
    // 只接收fileName，不需要base64
    const handleUploadSuccess = (fileName: string) => {
        console.log('上传的文件',fileName);
        setPdfFileName(prev => [fileName, ...pdfFileName]);
    };
    // 删除文件
    const handleDeleteFile = (index: number) => {
        const newList = pdfFileName.filter((_, i) => i !== index);
        setPdfFileName(newList);
    };
    const handleUploadError = (err: any) => {
        console.error('上传失败', err);
    };
    // 采购勾选
    const onSelectionChange = (newSelectedRows: any[]) => {
        if (newSelectedRows.length === 0) {
            setCaigou([]);
            return;
        }
        setCaigou(prev => {
            const existIds = new Set(prev.map(i => i.id));
            const newRows = newSelectedRows.filter(i => !existIds.has(i.id));
            return [...prev, ...newRows];
        });
    };
    const handleRemoveCaigou = (delId: number) => setCaigou(prev => prev.filter(i => i.id !== delId));

    // 接口请求
    const getCompanList = () => props.dispatch({ type: 'Compan/fetch' });
    const getProjectList = (e: number) => props.dispatch({ type: 'Project/fetch', payload: { name: '', companyId: e, pageSize: 1000 } });
    const getSubjectList = () => props.dispatch({ type: 'Subject/fetch' });
    const getSupplierList = () => props.dispatch({ type: "Supplier/fetch" });

    // 提交
    const onOK = (status: number) => {
        if (!orderDate) return message.error('请选择日期');
        if (!companyId) return message.error('请选择公司');
        if (!projectId) return message.error('请选择项目');
        if (!supplierId) return message.error('请选择供应商');

        const processedList = goodsList.map(item => ({
            ...item,
            unitPrice: !isNaN(Number(item.unitPrice)) ? Number(item.unitPrice) : 0,
            quantity: !isNaN(Number(item.quantity)) ? Number(item.quantity) : 0,
        }));
        const filteredGoodsList = processedList.filter(item =>
            item.summary?.trim() && item.amount > 0
        );
        if (filteredGoodsList.length === 0) return message.error('请完善明细用途、金额字段');

        const jsonfd = JSON.stringify(filteredGoodsList);
        const mapCaigou = caigou.map(item => ({ ...item, poId: item.id || 0, number: item.orderCode || '' }));
        const jsonCaigou = JSON.stringify(mapCaigou);
        const jsonData = JSON.stringify({ fd: jsonfd, caigou: jsonCaigou });
        const allFileList = [...imgList, ...pdfFileName];
        const imgUrl = allFileList.join("|");
        setSpinning(true);
        props.dispatch({
            type: 'Bill/add',
            payload: { orderCode, orderDate, accountId, projectId, companyId, paidAmount, totalAmount, moneyType, jsonData,foType:1, remark, supplierId, imgUrl, bxId: 0, status }
        }).then((res: TypeErrorCode) => {
            setSpinning(false);
            if (res.ErrorCode === 0 || res.ErrorCode === 9038) {
                message.success('添加成功');
                clearCache();
                // 重置所有状态
                const init = getDefaultState();
                const newCode = generate(StaticInfo.park_name);
                setOrderDate(init.orderDate);
                setOrderCode(newCode);
                setGoodsList([]);
                setAccountType(init.accountType);
                setTotalAmount(init.totalAmount);
                setPaidAmount(init.paidAmount);
                setCompanyId(init.companyId);
                setAccountId(init.accountId);
                setProjectId(init.projectId);
                setMoneyType(init.moneyType);
                setSupplierId(init.supplierId);
                setRemark(init.remark);
                setImgList([]);
                setCaigou([]);
                setPdfFileName([]);
            } else {
                message.error(`${res.ErrorCode} ${res.Data}`);
                getOrderCode();
            }
        })
    };

    const openProcurementClick = () => setIsOpenprocurement(true);
    const openInfoClick = () => setIsOpenInfo(true);
    // 新增重置表单+清空缓存统一方法
    const resetAllFormData = () => {
        // 1. 删除本地缓存
        sessionStorage.removeItem(CACHE_KEY);
        // 2. 重置所有表单state到初始值
        setOrderDate(getCurrentDate());
        setOrderCode(generate(StaticInfo.park_name));
        setCompanyId(0);
        setProjectId(0);
        setSupplierId(0);
        setRemark('');
        setImgList([]);
        setPdfFileName([]);
        setPaidAmount(0);
        setMoneyType(3);
        setAccountId(0);
        setAccountType(0);
        setCaigou([]);
        setPdfFileName([]);
        // 3. 表格恢复7条空行
        const newRecords = Array.from({ length: 7 }, (_, i) => ({
            id: i + 1,
            subjectName: '',
            summary: '',
            amount: 0,
            quantity: 0,
            unit: '',
            unitPrice: 0,
        }));
        setGoodsList(newRecords);
    };
    return (
        <Spin spinning={spinning}>
            <Space>
                <Button type="primary" onClick={() => navigate(-1)}>返回</Button>
                <Button type="primary" onClick={() => onOK(100)}>保存</Button>
                <Button type="primary" danger onClick={() => onOK(1)}>直接送审</Button>
                <Button danger onClick={() => {
                    resetAllFormData();
                }}>清空草稿</Button>
            </Space>
            <Space style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap', rowGap: '10px' }}>
                <Input addonBefore="单号:" placeholder='随机生成' style={{ width: '300px' }} value={orderCode} disabled />
                <Space.Compact>
                    <div style={{ borderRadius: '6px 0 0 6px', padding: '0 11px', border: '1px solid #d9d9d9', borderRight: 0, display: 'flex', alignItems: 'center' }}>日期:</div>
                    <DatePicker value={dayjs(orderDate)} onChange={changeData} />
                </Space.Compact>
                <InputNumber addonBefore="总金额:" disabled value={totalAmount} />
                <Input addonBefore="备注:" value={remark} onChange={changeRemark} />
                <Radio.Group value={moneyType} onChange={changeMoneyType}>
                    <Radio value={3}>报销</Radio>
                </Radio.Group>
                <Button onClick={openProcurementClick}>采购单</Button>
                <Badge count={caigou.length}>
                    <Button onClick={openInfoClick}>详情</Button>
                </Badge>
            </Space>
            <Space style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap', rowGap: '10px' }}>
                <Space.Compact>
                    <div style={{ borderRadius: '6px 0 0 6px', padding: '0 11px', border: '1px solid #d9d9d9', borderRight: 0, display: 'flex', alignItems: 'center' }}>公司:</div>
                    <Select
                        style={{ width: 250 }}
                        showSearch
                        value={companyId}
                        onChange={changeCompanyId}
                        filterOption={(input, option) => {
                            const item = props.CompanList.find(u => u.id === option.value);
                            return item?.company_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={Array.isArray(props.CompanList) ? props.CompanList.map(i => ({ label: i.company_name, value: i.id })) : []}
                    />
                </Space.Compact>
                <Space.Compact>
                    <div style={{ borderRadius: '6px 0 0 6px', padding: '0 11px', border: '1px solid #d9d9d9', borderRight: 0, display: 'flex', alignItems: 'center' }}>项目:</div>
                    <Select
                        style={{ width: 250 }}
                        showSearch
                        value={projectId}
                        onChange={changeProjectId}
                        filterOption={(input, option) => {
                            const item = props.ProjectList.find(u => u.id === option.value);
                            return item?.project_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={Array.isArray(props.ProjectList) ? props.ProjectList.map(i => ({ label: i.project_name, value: i.id })) : []}
                    />
                </Space.Compact>
                <Space.Compact>
                    <div style={{ borderRadius: '6px 0 0 6px', padding: '0 11px', border: '1px solid #d9d9d9', borderRight: 0, display: 'flex', alignItems: 'center' }}>供应商:</div>
                    <Select
                        style={{ width: 250 }}
                        showSearch
                        value={supplierId}
                        onChange={changeSupplierId}
                        filterOption={(input, option) => {
                            const item = props.SupplierList.find(u => u.id === option.value);
                            return item?.supplierName?.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={Array.isArray(props.SupplierList) ? props.SupplierList.map(i => ({ label: i.supplierName, value: i.id })) : []}
                    />
                </Space.Compact>
                <div  style={{ display: 'flex'}}>
                    <ImageUploadPng onImageUpload={(base64)=>onImageUpload(base64)}/>
                    <Image.PreviewGroup>
                        {imgList.map((item: any, index: number) => {
                            // 内部调用拼接方法
                            const imgUrl = getImgSrc(item);
                            return (
                                <div
                                    key={index}
                                    style={{
                                        display: 'inline-block',
                                        position: 'relative',
                                        margin: '5px',
                                    }}
                                >
                                    {/* 小图（点击放大预览） */}
                                    <Image
                                        width={50}
                                        height={50}
                                        style={{ objectFit: 'cover' }}
                                        src={imgUrl}
                                    />

                                    {/* 小图右上角删除按钮 */}
                                    <Button
                                        danger
                                        type="primary"
                                        size="small"
                                        onClick={() => handleDeleteunitImg(index)}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            zIndex: 1,
                                            padding: '0 4px',
                                            fontSize: '10px',
                                        }}
                                    >
                                        ×
                                    </Button>
                                </div>
                            );
                        })}
                    </Image.PreviewGroup>
                </div>
            </Space>
            <Card title="PDF上传">
                <Space>
                    <PdfUpload
                        apiUrl="/api/upload/pdf"
                        maxCount={5}
                        maxSize={10 * 1024 * 1024}
                        onSuccess={handleUploadSuccess}
                        onError={handleUploadError}
                    />

                    {pdfFileName.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                            {pdfFileName.map((name, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        marginBottom:6,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <FilePdfOutlined style={{ color: '#f5222d' }} />
                                    <a
                                        href={`${window.ServerConfig.imgServer}/${name}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {name}
                                    </a>
                                    {/* Popconfirm 二次确认删除 */}
                                    <Popconfirm
                                        title="确定删除该文件？"
                                        onConfirm={() => handleDeleteFile(idx)}
                                        okText="确认"
                                        cancelText="取消"
                                    >
                                        <Button
                                            danger
                                            size="small"
                                            icon={<DeleteOutlined />}
                                        >
                                            删除
                                        </Button>
                                    </Popconfirm>
                                </div>
                            ))}
                        </div>
                    )}
                </Space>
            </Card>
            <Table
                columns={columnsz}
                dataSource={goodsList}
                rowKey="id"
                pagination={false}
                scroll={{ x: 'max-content', y: '55vh' }}
            />
            <Modal open={isOpenprocurement} title="采购单" width={1200} footer={null} onCancel={() => setIsOpenprocurement(false)}>
                <FilteredProcurementList onSelectionChange={onSelectionChange} />
            </Modal>
            <Modal open={isOpenInfo} title="勾选详情" width={1200} onCancel={() => setIsOpenInfo(false)}>
                <CaigouTagList list={caigou} onRemove={handleRemoveCaigou} />
            </Modal>
        </Spin>
    )
};

const mapStateToProps = (state: any) => ({
    SubjectList: state.Subject.list,
    AccountList: state.Account.list,
    CompanList: state.Compan.list,
    ProjectList: state.Project.list,
    SupplierList: state.Supplier.list,
});
export default connect(mapStateToProps)(AddInvoiceFinancialDala);