import {Button,DatePicker,Form,Image,Input,message,Select,Space,Spin,Steps,Card,Modal} from "antd";
import { history, connect, useNavigate } from "umi";
import { useCallback, useEffect, useState, useRef } from "react";
import * as StaffService from "@/services/staff";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import ImageUpload from "@/components/ImageUploader";
import html2pdf from "html2pdf.js";
import ImageUploadPng from "@/components/ImageUploadPng";

const tailLayout = {
    wrapperCol: { offset: 4 },
};

// 缓存key
const CACHE_KEY = "AddRenew_form_cache";

const AddRenew = (props:any) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // 流程步骤：0=初始欢迎页 1=流程1 2=流程2 3=流程3 4=展示续租表单
    const [step, setStep] = useState<number>(0);
    // PDF下载完成标记，未下载则按钮置灰
    const [downloadComplete, setDownloadComplete] = useState<boolean>(false);
    // 协议弹窗显示控制
    const [modalVisible, setModalVisible] = useState(false);
    // PDF模板DOM Ref（弹窗内部，不会脱离页面空白）
    const pdfTemplateDom = useRef<HTMLDivElement>(null);

    // 原名字
    const [oldName, setOldName] = useState("");
    // 原手机号
    const [oldPhone, setOldPhone] = useState("");
    // 审核后的合同列表
    const [hetongList, setHetongList] = useState([]);
    // 租户ID
    const [tenantId, setTenantID] = useState(0);
    // 原合同开始时间
    const [oldStartDate, setoldStartDate] = useState("");
    // 原合同结束时间
    const [oldEndDate, setoldEndDate] = useState("");
    // 续租开始时间
    const [startDate, setStartDate] = useState("");
    // 到期时间
    const [endDate, setEndDate] = useState("");
    const [spinning, setspinning] = useState(false);
    const [isDate, setisDate] = useState(true);
    const [imgB64, setImgB64] = useState<string[]>([]);
    const [imgName, setImgName] = useState<string[]>([]);

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

    // 保存state+表单字段到缓存
    const saveCache = useCallback(() => {
        const data = {
            step,
            downloadComplete,
            oldName,
            oldPhone,
            tenantId,
            oldStartDate,
            oldEndDate,
            startDate,
            endDate,
            isDate,
            imgB64,
            imgName,
            formValues: form.getFieldsValue()
        };
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('草稿保存失败：', e);
        }
    }, [step, downloadComplete, oldName, oldPhone, tenantId, oldStartDate, oldEndDate, startDate, endDate, isDate, imgB64, imgName, form]);

    // 清空缓存
    const clearCache = () => sessionStorage.removeItem(CACHE_KEY);

    // 清空草稿
    const resetAllFormData = () => {
        clearCache();
        setStep(0);
        setDownloadComplete(false);
        setOldName('');
        setOldPhone('');
        setTenantID(0);
        setoldStartDate('');
        setoldEndDate('');
        setStartDate('');
        setEndDate('');
        setisDate(true);
        setImgB64([]);
        setImgName([]);
        form.resetFields();
    };

    // 切换上一步
    const handlePrevStep = () => {
        setStep((prev) => prev - 1);
        setDownloadComplete(false); // 返回流程重置下载标记
    };
    // 切换下一步
    const handleNextStep = () => {
        setStep((prev) => prev + 1);
        setDownloadComplete(false); // 切换流程重置下载标记
    };

    // 导出PDF方法
    const exportPdf = () => {
        if (!pdfTemplateDom.current) {
            message.warning("续租协议模板加载失败，请刷新页面重试");
            return;
        }
        const element = pdfTemplateDom.current;
        const options = {
            margin: 15,
            filename: "房屋续租协议书.pdf",
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
                message.success("续租协议PDF下载完成，现已可进入信息填写页面");
                setModalVisible(false);
            });
    };

    // 三步流程文案配置
    const flowStepList = [
        {
            title: "流程一：选择待续签合同并核对原始信息",
            desc: "1. 下拉筛选已生效合同，系统自动回填原租户姓名、手机号、原合同起止日期；\n2. 系统自动将续租起始日设为原合同到期次日，不可手动修改；\n3. 仅原合同到期前三个月内允许发起续签，超出时间无法操作；\n4. 核对线下纸质合同信息与系统回显内容保持一致。",
        },
        {
            title: "流程二：填写续租到期时间并上传材料",
            desc: "1. 续租结束日期选择器最小日期为续租起始日，不能早于起始时间；\n2. 上传续租相关证件、合同附件照片，支持多图上传；\n3. 可预览图片，不需要的附件可点击删除按钮移除；\n4. 图片模糊、缺失附件会导致后台审核驳回，请保证材料清晰完整。",
        },
        {
            title: "流程三：下载续租协议并确认提交规则",
            desc: "1. 请点击【查看并下载续租协议】按钮，弹窗内导出PDF文件，打印线下签字留存；\n2. 必须完成PDF下载后，才可进入续租信息填写页面；\n3. 协议包含续租租金、履约权责、欠费约束、审批规则，下载即代表全部知悉；\n4. 未结清账单、欠费的租户无法通过续租审批。",
        },
    ];

    // 渲染流程引导页面
    const renderFlowGuide = () => {
        return (
            <Card style={{ maxWidth: 800, margin: "60px auto" }}>
                <Steps current={step - 1} items={flowStepList} />
                <div style={{ margin: "30px 0", whiteSpace: "pre-line", lineHeight: 2 }}>
                    {flowStepList[step - 1].desc}
                </div>

                {/* 仅第三步显示打开协议弹窗按钮 */}
                {step === 3 && (
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <Button type="primary" onClick={() => setModalVisible(true)}>
                            查看并下载续租协议
                        </Button>
                        {downloadComplete && (
                            <span style={{ color: "#00b42a", marginLeft: 10 }}>✓ 已完成PDF下载</span>
                        )}
                    </div>
                )}

                <Space style={{ justifyContent: "center", width: "100%" }}>
                    {/* 第一步隐藏上一步按钮 */}
                    {step > 1 && <Button onClick={handlePrevStep}>上一步</Button>}

                    {step < 3 ? (
                        <Button type="primary" onClick={handleNextStep}>下一步</Button>
                    ) : (
                        // 第三步按钮：未下载PDF则永久置灰
                        <Button
                            type="primary"
                            onClick={handleNextStep}
                            disabled={!downloadComplete}
                        >
                            进入续签信息填写
                        </Button>
                    )}

                    <Button onClick={() => navigate(-1)}>返回</Button>
                    
                </Space>
            </Card>
        );
    };

    const addOneDayFromString = (dateString:string) => {
        const date = dayjs(dateString);
        if (!date.isValid()) {
            throw new Error("Invalid date string");
        }
        let newDate = date.add(1, "day");
        return dayjs(newDate).format("YYYY-MM-DD");
    };

    const onFinish = (vals: any) => {
        setspinning(true);
        const imgList = imgName.join("|");
        props
            .dispatch({
                type: "Renew/add",
                payload: { ...vals, tenantId, startDate, endDate, imgList },
            })
            .then((res: TypeErrorCode) => {
                if (res.ErrorCode == 0 || res.ErrorCode == 9038) {
                    message.success("提交成功");
                    // 添加成功后清空草稿缓存
                    clearCache();
                    history.push("/enter/afterSales");
                    setspinning(false);
                } else {
                    setspinning(false);
                    message.error(res.Data);
                }
            });
    };

    const change = (e:number) => {
        setspinning(true);
        StaffService.one(e).then((res: any) => {
            if (res.ErrorCode == 0) {
                setspinning(false);
                setOldName(res.Data.tenant_name);
                setOldPhone(res.Data.tenant_phone);
                setTenantID(res.Data.tenantId);
                setoldStartDate(res.Data.beginTime);
                setoldEndDate(res.Data.endTime);
                setStartDate(addOneDayFromString(res.Data.endTime));
                setisDate(false);
            } else {
                setspinning(false);
                message.error(res.Data);
            }
        });
    };

    const changeDate = (_: any, date: any) => {
        setEndDate(date);
    };

    // 合同列表
    const getContntList = () => {
        setspinning(true);
        props
            .dispatch({
                type: "SeleHetong/fetch",
            })
            .then((res: TypeErrorCode) => {
                if (res.ErrorCode == 0) {
                    console.log("res", res);
                    setHetongList(res.Data);
                    setspinning(false);
                } else {
                    message.error(res.Data);
                    setspinning(false);
                }
            });
    };

    useEffect(() => {
        // 加载缓存：回填state与表单字段
        const cache = loadCache();
        if (cache) {
            setStep(cache.step ?? 0);
            setDownloadComplete(cache.downloadComplete ?? false);
            setOldName(cache.oldName ?? '');
            setOldPhone(cache.oldPhone ?? '');
            setTenantID(cache.tenantId ?? 0);
            setoldStartDate(cache.oldStartDate ?? '');
            setoldEndDate(cache.oldEndDate ?? '');
            setStartDate(cache.startDate ?? '');
            setEndDate(cache.endDate ?? '');
            setisDate(cache.isDate ?? true);
            setImgB64(cache.imgB64 ?? []);
            setImgName(cache.imgName ?? []);
            if (cache.formValues) {
                form.setFieldsValue(cache.formValues);
            }
        }
        getContntList();
    }, []);
    // 任意state变动自动存缓存
    useEffect(() => {
        saveCache();
    }, [saveCache]);
    // 表单字段变动也立即存
    const handleFormChange = () => {
        saveCache();
    };

    // 图片base64
    const onImageUpload = (base64: any) => {
        setImgName([...imgName, base64]);
    };
    const oldBase64 = (base64: any) => {
        setImgB64([...imgB64, base64]);
    };

    // 删除租户证件图片
    const handleDeletezuhu = (index: number) => {
        const newImages = [...imgB64];
        newImages.splice(index, 1);
        setImgB64(newImages);
        const newB64 = [...imgName];
        newB64.splice(index, 1);
        setImgName(newB64);
    };

    return (
        <Spin spinning={spinning}>
            {/* PDF协议弹窗，DOM正常渲染不会空白 */}
            <Modal
                title="房屋续租协议书"
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
                        background: "#fff"
                    }}
                >
                    <h2 style={{ textAlign: "center" }}>房屋续租协议书</h2>
                    <div>甲方（出租方）：</div>
                    <div>地址：</div>
                    <div>法定代表人：</div>
                    <div>乙方（承租方）：</div>
                    <div>身份证/统一社会信用代码：</div>
                    <div>联系地址：</div>
                    <div>联系电话：</div>
                    <div style={{ marginTop: 12, textIndent: "2em" }}>
                        甲乙双方此前就商铺租赁签订《房屋租赁合同》，现原租赁期限即将届满，甲乙双方友好协商，就商铺续租事宜达成如下协议：
                    </div>
                    <div style={{ marginTop: 8, textIndent: "2em" }}>
                        一、甲乙双方一致同意，乙方继续承租甲方名下该商铺，续租期限自原合同到期次日起计算，具体截止日期以系统填写为准。
                    </div>
                    <div style={{ marginTop: 8, textIndent: "2em" }}>
                        二、续租期间租金标准、缴费周期、押金条款均沿用原租赁合同约定，乙方须按时足额缴纳租金，不得拖欠。
                    </div>
                    <div style={{ marginTop: 8, textIndent: "2em" }}>
                        三、乙方承诺续租期间合法合规经营，遵守园区管理规定，不得从事违法违规活动，妥善保管租赁物业及配套设施。
                    </div>
                    <div style={{ marginTop: 8, textIndent: "2em" }}>
                        四、若乙方存在历史欠费、未结清账单，甲方有权不予通过续租申请，直至全部费用结清后方可办理续签手续。
                    </div>
                    <div style={{ marginTop: 8, textIndent: "2em" }}>
                        五、本协议为续租申请配套文件，提交系统即代表乙方认可全部条款，最终续租生效以管理员后台审核通过为准。
                    </div>
                    <div style={{ marginTop: 8, textIndent: "2em" }}>
                        六、因本协议产生的纠纷，双方协商不成的，可向甲方所在地人民法院提起诉讼。
                    </div>
                    <div style={{ marginTop: 20 }}>（以下无正文）</div>
                    <div style={{ marginTop: 16 }}>甲方签字/盖章：</div>
                    <div>签订日期：</div>
                    <div style={{ marginTop: 12 }}>乙方签字：</div>
                    <div>签订日期：</div>
                </div>
            </Modal>

            {/* 初始欢迎页 step=0 */}
            {step === 0 && (
                <div style={{ textAlign: "center", marginTop: 80 }}>
                    <Card style={{ maxWidth: 600, margin: "0 auto" }}>
                        <h3>租户续签操作须知引导</h3>
                        <p style={{ color: "#666" }}>
                            发起续签申请前，请完整阅读操作流程，下载续租协议确认条款后才可填写单据。
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

            {/* step=4 流程全部看完且下载完PDF，展示原有续租表单 */}
            {step === 4 && (
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    layout="horizontal"
                    size={"large"}
                    onFinish={onFinish}
                    onValuesChange={handleFormChange}
                    style={{ marginTop: "1rem" }}
                >
                    <Form.Item label="选择合同" name="contractId">
                        <Select
                            onChange={change}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                                const item = hetongList.find((hetongID:any) => hetongID.id == option?.value);
                                return item?.tenant_name?.toLowerCase().includes(input.toLowerCase());
                            }}
                        >
                            {hetongList.map((item: any, index: any) => {
                                return (
                                    <Select.Option value={item.id} key={index}>
                                        {item.identifier}-{item.tenant_name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item label="租户姓名">
                        <Input placeholder="租户姓名" value={oldName} disabled />
                    </Form.Item>
                    <Form.Item label="租户手机号">
                        <Input placeholder="租户手机号" value={oldPhone} disabled />
                    </Form.Item>
                    <Form.Item label="原合同开始时间">
                        <Input
                            placeholder="原合同开始时间"
                            value={oldStartDate ? dayjs(oldStartDate).format("YYYY-MM-DD") : ""}
                            disabled
                            style={{ width: "200px" }}
                        />
                    </Form.Item>
                    <Form.Item label="原合同结束时间">
                        <Input
                            placeholder="原合同结束时间"
                            value={oldEndDate ? dayjs(oldEndDate).format("YYYY-MM-DD") : ""}
                            disabled
                            style={{ width: "200px" }}
                        />
                    </Form.Item>
                    <Form.Item label="续租合同开始时间">
                        <Input
                            placeholder="续租合同开始时间"
                            value={startDate ? dayjs(startDate).format("YYYY-MM-DD") : ""}
                            disabled
                            style={{ width: "200px" }}
                        />
                    </Form.Item>
                    <Form.Item label="续租结束时间">
                        <DatePicker
                            onChange={changeDate}
                            minDate={startDate ? dayjs(startDate, "YYYY-MM-DD") : "2099-01-01"}
                            disabled={isDate}
                        />
                    </Form.Item>
                    <Form.Item label="图片">
                        <ImageUploadPng onImageUpload={onImageUpload} oldBase64={oldBase64} />
                        <Space>
                            {imgB64.map((item: any, index: number) => (
                                <Space key={index}>
                                    <Image
                                        src={item}
                                        style={{ width: "80px", height: "80px", borderRadius: "5px" }}
                                    />
                                    <Button danger size="small" onClick={() => handleDeletezuhu(index)}>
                                        删
                                    </Button>
                                </Space>
                            ))}
                        </Space>
                    </Form.Item>
                    <Form.Item label="注意">
                        <span style={{ color: "red", fontSize: "12px" }}>
                            合同结束日期三个月内才允许续签
                        </span>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Space>
                            <Button type="primary" htmlType="submit">添加</Button>
                            <Button type="primary" onClick={() => navigate(-1)}>返回</Button>
                            <Button danger onClick={resetAllFormData}>清空草稿</Button>
                        </Space>
                    </Form.Item>
                </Form>
            )}
        </Spin>
    );
};
const mapStateToProps = (state: any) => {
    return {
        CheckHetongList: state.SeleHetong.list,
    };
};

export default connect(mapStateToProps)(AddRenew);