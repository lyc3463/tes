import {
    Button, Image, message, Select, Space, Spin, Table, Tag, Tooltip, Card, Row, Col, Input, InputNumber, Modal, Steps
} from "antd";
import ImageUpload from "@/components/ImageUploader";
import {useEffect, useRef, useState} from "react";
import * as ArrearsBillService from "@/services/ArrearsBill";
import * as ZuhuService from '@/services/zuhu';
import * as DamagesService from '@/services/damages';
import { useNavigate } from "umi";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import html2pdf from "html2pdf.js";


const AddDamages = () => {
    const navigate = useNavigate();

    // 流程步骤：0=欢迎首页 1=流程1 2=流程2 3=流程3 4=优惠表单页面
    const [step, setStep] = useState<number>(0);
    // PDF下载完成标记，未下载按钮禁用
    const [downloadComplete, setDownloadComplete] = useState<boolean>(false);
    // 协议弹窗控制
    const [modalVisible, setModalVisible] = useState(false);
    // PDF打印DOM Ref（弹窗内部，不会脱离页面空白）
    const pdfTemplateDom = useRef<HTMLDivElement>(null);
    const [spinning, setSpinning] = useState(false);
    // 租户下拉列表
    const [tenantList, setTenantList] = useState([]);
    // 选中租户ID
    const [selectTenantId, setSelectTenantId] = useState<number | null>(null);
    // 上传图片存储
    const [imgB64, setImgB64] = useState<string[]>([]);
    const [imgName, setImgName] = useState<string[]>([]);
    // 租户违约账单表格数据
    const [dataSource, setDataSource] = useState([]);
    const [remark, setRemark] = useState('');
    // 选中行id数组
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
    // 全选控制
    const [selectAll, setSelectAll] = useState(false);
    // 表格列配置
    const columns = [
        {
            title: '日期',
            dataIndex: 'created',
            key: 'created',
            width: 110,
            render: (_, record) => dayjs(record.created).format("YYYY-MM-DD")
        },
        {
            title: '租户姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            width: 130,
            render: (_, record) => (
                <Tooltip title={record.tenant_name || "无"}>
                    <div style={{
                        width: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }}>
                        {record.tenant_name == null
                            ? <span style={{ color: "red" }}>未绑定租户</span>
                            : record.tenant_name
                        }
                    </div>
                </Tooltip>
            ),
        },
        {
            title: '违约天数',
            dataIndex: 'defaultNum',
            key: 'defaultNum',
            width: 90,
            render: (_, record) => `${record.defaultNum}天`
        },
        {
            title: '违约金额(元)',
            dataIndex: 'defaultAmount',
            key: 'defaultAmount',
            width: 120,
            render: (_, record) => `${record.defaultAmount}元`
        },
        {
            title: '已交金额(元)',
            dataIndex: 'stopAmount',
            key: 'stopAmount',
            width: 120,
            render: (_, record) => `${record.stopAmount}元`
        },
        {
            title: '未缴余额(元)',
            dataIndex: 'xx',
            key: 'xx',
            width: 120,
            render: (_, record) => {
                const rest = (Number(record.defaultAmount) - Number(record.stopAmount)).toFixed(2);
                return <span style={{ color: "#f5222d" }}>{rest}元</span>;
            }
        },
        {
            title: '免除违约金',
            key: 'amount',
            width: 140,
            render: (_, record, index) => {
                return (
                    <InputNumber
                        min={0}
                        max={record.defaultAmount}
                        value={record.amount}
                        size="small"
                        style={{ width: "100%" }}
                        onChange={(num) => {
                            // 直接更新数据源里对应行的amount
                            const newData = [...dataSource];
                            newData[index].amount = num ?? 0;
                            setDataSource(newData);
                        }}
                        placeholder="填写免除金额"
                    />
                )
            }
        }
    ];

    // 切换租户，加载该租户违约账单
    const changeTenantId = (tenantId: number) => {
        setSelectTenantId(tenantId);
        getzujinList(tenantId);
    };

    // 获取租户违约账单列表
    const getzujinList = async (e: number) => {
        setSpinning(true);
        try {
            const res: any = await ArrearsBillService.weiyueList({
                page: 1,
                name: '',
                startDate: '2000-01-01',
                endDate: '2099-01-01',
                tenandId:e,
                stutes: 1,
                pageSize: 10000
            });
            if (res.ErrorCode === 0) {
                // 遍历数组，每条新增 amount 默认0
                const listWithAmount = res.Data.map(item => ({
                    ...item,
                    amount: 0
                }));
                setDataSource(listWithAmount);
                // 切换租户清空勾选
                setSelectedRowKeys([]);
                setSelectAll(false);
            } else {
                message.error(res.Data);
                setDataSource([]);
            }
        } catch (err) {
            message.error("账单加载失败");
        } finally {
            setSpinning(false);
        }
    };

    // 获取全部租户下拉列表
    const getTenantList = async () => {
        setSpinning(true);
        try {
            const res:any = await ZuhuService.byfetch({
                page: 1,
                name: '',
                phone: '',
                pagecount: 1000
            });
            if (res.ErrorCode === 0) {
                setTenantList(res.Data.data || []);
            } else {
                message.error(res.Data);
            }
        } catch (err) {
            message.error("租户列表加载失败");
        } finally {
            setSpinning(false);
        }
    };

    // 提交校验与提交
    const handleSubmit = () => {
        // 1. 基础校验：租户、图片
        if (!selectTenantId) {
            message.warning("请先选择租户");
            return;
        }
        if (imgName.length === 0) {
            message.warning("请上传凭证图片");
            return;
        }

        // 2. 判断是否勾选账单
        if (selectedRowKeys.length === 0) {
            message.warning("请勾选需要处理的违约账单");
            return;
        }

        // 3. 根据勾选id筛选出对应账单（只保留勾选的数据）
        const checkedBillList = dataSource.filter(item => selectedRowKeys.includes(item.id));

        // 4. 校验：任意一条免除金额小于0则拦截提交
        const hasNegativeAmount = checkedBillList.some(bill => bill.amount <= 0);
        if (hasNegativeAmount) {
            message.warning("免除违约金不能小于0，请核对填写金额");
            return;
        }
        let jsonData =checkedBillList.map((item)=>{
           return{
               wyjId:item.id,
               amount:item.amount,
           }
        });
        // 全部校验通过，组装参数提交
        const imgList = imgName.join("|");
        DamagesService.add({selectTenantId,remark,imgList,jsonData:JSON.stringify(jsonData)})
            .then((res:TypeErrorCode) => {
                if (res.ErrorCode === 0) {
                    message.success("提交成功");
                    navigate(-1);
                } else {
                    message.error(res.Data || "提交失败");
                }
            })
            .catch(() => {
                message.error("接口请求异常");
            });
    };

    // 图片上传回调
    const onImageUpload = (base64: string) => {
        setImgName([...imgName, base64]);
    };
    const oldBase64 = (base64: string) => {
        setImgB64([...imgB64, base64]);
    };

    // 删除图片
    const handleDeletezuhu = (index: number) => {
        const newImages = [...imgB64];
        newImages.splice(index, 1);
        setImgB64(newImages);
        const newB64 = [...imgName];
        newB64.splice(index, 1);
        setImgName(newB64);
    };

    // 页面初始化加载租户列表
    useEffect(() => {
        getTenantList();
    }, []);
    // 上一步
    const handlePrevStep = () => {
        setStep(prev => prev - 1);
        setDownloadComplete(false);
    };
    // 下一步
    const handleNextStep = () => {
        setStep(prev => prev + 1);
        setDownloadComplete(false);
    };

    // PDF导出函数
    const exportPdf = () => {
        if (!pdfTemplateDom.current) {
            message.warning("违约金减免协议模板加载失败，请刷新页面重试");
            return;
        }
        const element = pdfTemplateDom.current;
        const options = {
            margin: 15,
            filename: "违约金减免协议书.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };
        html2pdf()
            .set(options)
            .from(element)
            .save()
            .then(() => {
                setDownloadComplete(true);
                message.success("违约金减免协议PDF下载完成，可进入信息填写页面");
                setModalVisible(false);
            });
    };

    // 三步流程文案
    const flowStepList = [
        {
            title: "流程一：选择租赁合同并核对租户基础信息",
            desc: "1. 下拉筛选已生效合同，系统自动回填租户姓名、手机号、合同原始月租金；\n2. 核对线下纸质合同信息与系统回显信息保持一致；\n3. 存在未结清账单、欠费租户申请优惠会被后台驳回；\n4. 确认商铺正常经营、无违规处罚记录再发起优惠申请。"
        },
        {
            title: "流程二：填写优惠金额、周期与优惠类型",
            desc: "1. 每月优惠金额不能大于合同原始租金，最小值为0；\n2. 选择优惠起止月份区间，系统按月生效优惠抵扣租金；\n3. 区分优惠类型：满合同优惠 / 未满合同优惠；\n4. 上传优惠佐证材料照片，缺失附件直接审核不通过。"
        },
        {
            title: "流程三：下载违约金减免协议并确认权责条款",
            desc: "1. 点击【查看并下载违约金减免协议】导出PDF，打印线下签字留存；\n2. 必须完成PDF下载后，才可进入优惠信息填写页面；\n3. 协议明确中途退租规则：满合同优惠中途退场，往期优惠金额计入账单追缴；\n4. 提交单据后等待管理员审核，审核通过次月生效租金减免。"
        }
    ];

    // 渲染流程引导面板
    const renderFlowGuide = () => {
        return (
            <Card style={{ maxWidth: 800, margin: "60px auto" }}>
                <Steps current={step - 1} items={flowStepList} />
                <div style={{ margin: "30px 0", whiteSpace: "pre-line", lineHeight: 2 }}>
                    {flowStepList[step - 1].desc}
                </div>

                {/* 仅第三步展示打开协议弹窗按钮 */}
                {step === 3 && (
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <Button type="primary" onClick={() => setModalVisible(true)}>
                            查看并下载违约金减免协议
                        </Button>
                        {downloadComplete && (
                            <span style={{ color: "#00b42a", marginLeft: 10 }}>✓ 已完成PDF下载</span>
                        )}
                    </div>
                )}

                <Space style={{ justifyContent: "center", width: "100%" }}>
                    {/* 第一步不显示上一步 */}
                    {step > 1 && <Button onClick={handlePrevStep}>上一步</Button>}

                    {step < 3 ? (
                        <Button type="primary" onClick={handleNextStep}>下一步</Button>
                    ) : (
                        <Button
                            type="primary"
                            onClick={handleNextStep}
                            disabled={!downloadComplete}
                        >
                            进入违约金减免协议信息填写
                        </Button>
                    )}

                    <Button onClick={() => navigate(-1)}>返回</Button>
                </Space>
            </Card>
        )
    };
    return (
        <Spin spinning={spinning}>
            {/* PDF协议弹窗，DOM正常渲染，不会空白 */}
            <Modal
                title="违约金减免申请书"
                open={modalVisible}
                width={800}
                footer={[
                    <Button key="close" onClick={() => setModalVisible(false)}>关闭</Button>,
                    <Button key="download" type="primary" onClick={exportPdf}>下载PDF文件</Button>
                ]}
            >
                <div
                    ref={pdfTemplateDom}
                    style={{
                        padding: "40px 30px",
                        fontSize: "14px",
                        background: "#fff",
                        lineHeight: "1.8"
                    }}
                >
                    <h2 style={{ textAlign: "center", marginTop: 0, marginBottom: "24px" }}>违约金减免申请书</h2>

                    <div>1. 姓名： ____________________</div>
                    <div>2. 证件号码： _______________________________</div>
                    <div>3. 联系电话： ____________________</div>

                    <div style={{ marginTop: "12px", fontWeight: "bold" }}>一、房屋租赁信息</div>
                    <div>1. 租赁房屋地址： ____________________</div>
                    <div>2. 租赁房屋期限：自 ___年__月__日 至 ____年___月____日</div>
                    <div>3. 申请减免金额：（大写）_____________元整（¥________）</div>
                    <div>4. 剩余违约金：（大写）_____________元整（¥________）</div>

                    <div style={{ marginTop: "8px" }}>申请减免理由（请详细说明）</div>
                    <div style={{ minHeight: "60px", borderBottom: "1px solid #000" }}></div>

                    <div style={{ marginTop: "16px", fontWeight: "bold" }}>二、申请人承诺</div>
                    <div style={{ textIndent: "2em" }}>
                        申请人承诺：若贵方同意申请人本次违约金减免申请，剩余租赁期间，申请人不得再以任何理由要求减免违约金；且若申请人再次违约，贵方可取消本次减免的违约金并要求申请人按原合同约定补缴本次减免的违约金。
                    </div>

                    {/* 签名区域靠右，和前面文档风格统一 */}
                    <div style={{ marginTop: "40px", textAlign: "right" }}>
                        <div>申请人签名：________________</div>
                        <div style={{ marginTop: "12px" }}>申请日期：____年____月____日</div>
                    </div>
                </div>
            </Modal>

            {/* 初始欢迎引导页 step=0 */}
            {step === 0 && (
                <div style={{ textAlign: "center", marginTop: 80 }}>
                    <Card style={{ maxWidth: 600, margin: "0 auto" }}>
                        <h3>违约金减免申请操作须知引导</h3>
                        <p style={{ color: "#666" }}>
                            发起违约金减免申请前，请完整阅读操作流程，下载优惠协议确认权责后才可填写单据。
                        </p>
                        <Space style={{ marginTop: 20 }}>
                            <Button type="primary" onClick={handleNextStep}>开始查看流程</Button>
                            <Button onClick={() => navigate(-1)}>取消返回</Button>
                        </Space>
                    </Card>
                </div>
            )}

            {/* 流程1、2、3引导页面 */}
            {step >= 1 && step <= 3 && renderFlowGuide()}
            {step === 4 && (
                <>
                    <Card>
                        <Row gutter={[12, 18]} style={{ marginTop: 10 }}>
                            <Col/>
                            <Col>
                                <Space size={16}>
                                    <Button type="primary" size="large" onClick={handleSubmit}>
                                        提交
                                    </Button>
                                    <Button size="large" onClick={() => navigate(-1)}>
                                        返回
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                    {/* 顶部新增赔偿卡片 */}
                    <Card style={{ marginBottom: 20 }}>
                        <Row gutter={[24, 18]} align="top">
                            {/* 1、选择租户 */}
                            <Col span={8}>
                                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>选择租户</div>
                                <Select
                                    onChange={changeTenantId}
                                    showSearch
                                    placeholder="请选择租户"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => {
                                        const item = tenantList.find(tenant => tenant.id === option?.value);
                                        return item?.tenant_name?.toLowerCase().includes(input.toLowerCase());
                                    }}
                                    style={{ width: "100%" }}
                                >
                                    {tenantList.map((item, index) => (
                                        <Select.Option value={item.id} key={index}>
                                            {item.tenant_name} - {item.tenant_phone}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Col>

                            {/* 2、图片上传预览 */}
                            <Col span={8}>
                                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>凭证图片</div>
                                <ImageUpload onImageUpload={onImageUpload} oldBase64={oldBase64} />
                                <Space wrap size={10} style={{ marginTop: 10 }}>
                                    {imgB64.map((item, index) => (
                                        <div key={index} style={{ position: "relative" }}>
                                            <Image
                                                src={item}
                                                width={70}
                                                height={70}
                                                style={{ borderRadius: 6, objectFit: "cover" }}
                                                preview
                                            />
                                            <Button
                                                danger
                                                size="small"
                                                style={{ position: "absolute", top: 2, right: 2, width: 22, height: 22, padding: 0 }}
                                                onClick={() => handleDeletezuhu(index)}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    ))}
                                </Space>
                            </Col>

                            {/* 3、备注文本框 */}
                            <Col span={8}>
                                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>备注说明</div>
                                <Input.TextArea
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                    rows={4}
                                    placeholder="备注"
                                    style={{ width: "100%" }}
                                />
                            </Col>
                        </Row>
                    </Card>

                    {/* 下方租户违约账单表格卡片 */}
                    <Card title="所选租户违约欠费明细">
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            rowKey="id"
                            size="small"
                            pagination={false}
                            scroll={{ y: "55vh", x: "max-content" }}
                            bordered
                            locale={{ emptyText: "请先选择租户加载账单数据" }}
                            // 勾选配置
                            rowSelection={{
                                selectedRowKeys,
                                onChange: (keys) => {
                                    setSelectedRowKeys(keys);
                                    console.log('keys',keys)
                                    // 判断是否全部选中
                                    setSelectAll(keys.length === dataSource.length && dataSource.length > 0);
                                },
                                // 全选复选框
                                selections: [
                                    {
                                        key: 'all',
                                        text: '全选',
                                        onSelect: () => {
                                            if (!selectAll) {
                                                // 全选
                                                const allIds = dataSource.map(item => item.id);
                                                setSelectedRowKeys(allIds);
                                                setSelectAll(true);
                                            } else {
                                                // 取消全选
                                                setSelectedRowKeys([]);
                                                setSelectAll(false);
                                            }
                                        }
                                    }
                                ]
                            }}
                        />
                    </Card>
                </>
            )}

        </Spin>
    );
};
export default AddDamages;