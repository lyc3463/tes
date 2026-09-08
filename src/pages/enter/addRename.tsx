import { connect, history, useNavigate } from "umi";
import {
    Button,
    DatePicker,
    Form,
    Image,
    Input,
    message,
    Select,
    Space,
    Spin,
    Steps,
    Card,
    Modal
} from "antd";
import * as StaffService from "@/services/staff";
import { useCallback, useEffect, useState, useRef } from "react";
import { phonePattern } from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import html2pdf from "html2pdf.js";
import ImageUploadPng from "@/components/ImageUploadPng";

const tailLayout = {
    wrapperCol: { offset: 4 },
};

// 缓存key
const CACHE_KEY = "AddRename_form_cache";

const AddRename = (props: any) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    // 流程步骤 0=初始引导页 1=流程1 2=流程2 3=流程3 4=展示表单
    const [step, setStep] = useState<number>(0);
    // 标记是否已完成PDF下载，只有true才能进入表单
    const [downloadComplete, setDownloadComplete] = useState<boolean>(false);
    // 控制协议弹窗显示
    const [modalVisible, setModalVisible] = useState(false);
    // PDF打印模板DOM容器ref（放在弹窗内部）
    const pdfTemplateDom = useRef<HTMLDivElement>(null);

    // 原名字
    const [oldName, setOldName] = useState("");
    // 原身份证
    const [oldcustomCard, setoldcustomCard] = useState("");
    // 原手机号
    const [oldPhone, setOldPhone] = useState("");
    // 审核后的合同列表
    const [hetongList, setHetongList] = useState([]);
    // 租户ID
    const [tenantId, setTenantID] = useState(0);
    const [spinning, setspinning] = useState(false);
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
            oldcustomCard,
            oldPhone,
            tenantId,
            imgB64,
            imgName,
            formValues: form.getFieldsValue()
        };
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('草稿保存失败：', e);
        }
    }, [step, downloadComplete, oldName, oldcustomCard, oldPhone, tenantId, imgB64, imgName, form]);

    // 清空缓存
    const clearCache = () => sessionStorage.removeItem(CACHE_KEY);

    // 清空草稿
    const resetAllFormData = () => {
        clearCache();
        setStep(0);
        setDownloadComplete(false);
        setOldName('');
        setoldcustomCard('');
        setOldPhone('');
        setTenantID(0);
        setImgB64([]);
        setImgName([]);
        form.resetFields();
    };

    const onFinish = (vals: any) => {
        setspinning(true);
        const imgList = imgName.join("|");
        props
            .dispatch({
                type: "Rename/add",
                payload: { ...vals, tenantId, imgList },
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

    const change = (e: number) => {
        setspinning(true);
        StaffService.one(e).then((res: any) => {
            if (res.ErrorCode == 0) {
                setspinning(false);
                setOldName(res.Data.tenant_name);
                setOldPhone(res.Data.tenant_phone);
                setoldcustomCard(res.Data.customCard);
                setTenantID(res.Data.tenantId);
            } else {
                setspinning(false);
                message.error(res.Data);
            }
        });
    };

    // 合同列表
    const getContntList = () => {
        setspinning(true);
        props.dispatch(
            {type: "SeleHetong/fetch"}
        ).then((res: TypeErrorCode) => {
            if (res.ErrorCode == 0) {
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
            setoldcustomCard(cache.oldcustomCard ?? '');
            setOldPhone(cache.oldPhone ?? '');
            setTenantID(cache.tenantId ?? 0);
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

    // 下一步
    const handleNextStep = () => {
        setStep((prev) => prev + 1);
        // 切换回流程时重置下载标记
        setDownloadComplete(false);
    };
    // 上一步
    const handlePrevStep = () => {
        setStep((prev) => prev - 1);
        setDownloadComplete(false);
    };

    // 导出PDF函数
    const exportPdf = () => {
        if (!pdfTemplateDom.current) {
            message.warning("协议内容加载失败");
            return;
        }
        const element = pdfTemplateDom.current;
        const options = {
            margin: 15,
            filename: "租户更名权利义务转让协议书.pdf",
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
                message.success("PDF下载完成，现在可进入信息填写页面");
                setModalVisible(false);
            });
    };

    // 渲染引导流程页面
    const renderGuideFlow = () => {
        const stepContent = [
            {
                title: "更名流程",
                desc: "1. 租户口头或群里说更名，管家给租户更名申表；\n2. 管家提交申请表报公司审批；\n3.申请通过后，管家给权利义务转让协议书给租户签名盖章，及指导租户到系统申请；\n4. 若租户签好管家提交权利义务转让协议书报公司审批流程并抄送给财务或管家帮租户系统申请。\n5.权利义务转让协议书公司审批完成后，财务根据结果审核系统",
            },
            {
                title: "填写新租户信息并上传证件",
                desc: "1. 完整填写更名后新租户姓名、联系电话、身份证号码，手机号格式需符合规范；\n2. 上传新租户身份证正反面清晰照片，支持多张证件材料；\n3. 检查图片是否模糊、遮挡，图片缺失会导致审批驳回；\n4. 确认所有填写内容无误，避免信息录入错误。",
            },
            {
                title: "：导出更名须知PDF并确认",
                desc: "1. 请点击下方【查看并下载协议】按钮，弹窗内导出PDF文件，打印后线下签字留存；\n2. 必须完成PDF下载后，才可进入信息填写页面；\n3. 须知内包含更名权责、欠费约束、审批规则，签字后代表已知悉全部条款；\n4. 如未下载PDF，填写按钮将保持置灰无法点击。",
            },
        ];
        return (
            <Card style={{ maxWidth: 800, margin: "50px auto" }}>
                <Steps current={step - 1} items={stepContent} />
                <div style={{ margin: "30px 0", whiteSpace: "pre-line", lineHeight: 2 }}>
                    {stepContent[step - 1].desc}
                </div>

                {/* 流程3专属：打开弹窗按钮 */}
                {step === 3 && (
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <Button type="primary" onClick={() => setModalVisible(true)}>
                            查看并下载协议
                        </Button>
                        {downloadComplete && (
                            <span style={{ color: "#00b42a", marginLeft: 10 }}>✓ 已完成下载</span>
                        )}
                    </div>
                )}

                <Space style={{ justifyContent: "center", width: "100%" }}>
                    {/* 第一步不显示上一步 */}
                    {step > 1 && <Button onClick={handlePrevStep}>上一步</Button>}

                    {step < 3 ? (
                        <Button type="primary" onClick={handleNextStep}>
                            下一步
                        </Button>
                    ) : (
                        // 第三步按钮：未下载则禁用
                        <Button
                            type="primary"
                            onClick={handleNextStep}
                            disabled={!downloadComplete}
                        >
                            开始填写更名信息
                        </Button>
                    )}

                    <Button onClick={() => navigate(-1)}>返回</Button>
                </Space>
            </Card>
        );
    };
    return (
        <Spin spinning={spinning}>
            {/* 弹窗：协议预览+导出PDF，DOM正常在可视流，不会空白 */}
            <Modal
                title="权利义务转让协议书"
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
                    <div style={{ textAlign: "center" ,fontSize:'2rem',fontWeight:600}}>权利义务转让协议书</div>
                    <div >甲方（出租方）：</div>
                    <div>地址：</div>
                    <div>法定代表人：</div>
                    <div style={{ marginTop: 12 }}>乙方（原承租方）：</div>
                    <div>地址：</div>
                    <div>联系电话：</div>
                    <div style={{ marginTop: 12 }}>丙方（新承租方）：</div>
                    <div>身份证/统一社会信用代码：</div>
                    <div>联系地址：</div>
                    <div>联系电话：</div>
                    <div style={{ marginTop: 12 , textIndent: '2em'}}>甲、乙双方曾于   年   月   日就出租______________铺 签订了《房屋租赁合同书》（以下简称“原租赁合同”），现甲、乙、丙三方经协商一致，达成如下协议：</div>
                    <div style={{ marginTop: 8 , textIndent: '2em'}}>一、本协议各方同意：自本协议签订之日起，丙方取代乙方成为原租赁合同的对应主体。原租赁合同协议中乙方的所有权利义务整体转让给丙方，丙方同意接受。</div>
                    <div style={{ marginTop: 8, textIndent: '2em' }}>二、丙方确认：其在签订本协议书前，已详细了解《房屋租赁合同书》条款及履行情况，对租赁物现状和使用性质等也已做充分了解；丙方对按原租赁合同约定承接乙方权利义务无异议。</div>
                    <div style={{ marginTop: 8, textIndent: '2em' }}>三、丙方保证遵守原租赁合同及本协议的约定，按约支付租金及各项费用，合法合规经营。</div>
                    <div style={{ marginTop: 8 , textIndent: '2em'}}>四、乙方自愿就丙方在本协议及原租赁合同项下全部义务的履行，向甲方提供连带责任保证担保。担保范围包括但不限于租金、押金、违约金、损害赔偿金及甲方为实现债权所支出的全部费用（包括但不限于律师费、诉讼费、保全费、担保费等）。</div>
                    <div style={{ marginTop: 8 , textIndent: '2em'}}>五、因履行本协议所产生的争议，三方应友好协商解决；协商不成的，任何一方均有权向甲方所在地人民法院提起诉讼。</div>
                    <div style={{ marginTop: 8 , textIndent: '2em'}}>六、本转让协议一式三份，甲乙丙三方各执一份，自三方签署之日起生效。</div>
                    <div style={{ marginTop: 20 }}>（以下无正文）</div>
                    <div style={{ marginTop: 16 }}>甲方：</div>
                    <div>日期：</div>
                    <div style={{ marginTop: 12 }}>乙方：</div>
                    <div>日期：</div>
                    <div style={{ marginTop: 12 }}>丙方：</div>
                    <div>日期：</div>
                </div>
            </Modal>

            {/* step=0 初始欢迎页 */}
            {step === 0 && (
                <div style={{ textAlign: "center", marginTop: 80 }}>
                    <Card style={{ maxWidth: 600, margin: "0 auto" }}>
                        <h3>租户更名操作须知引导</h3>
                        <p style={{ color: "#666" }}>
                            在提交租户更名单据前，请先阅读完整操作流程，确认满足更名条件后再填写信息。
                        </p>
                        <Space style={{ marginTop: 20 }}>
                            <Button type="primary" onClick={handleNextStep}>
                                开始查看流程
                            </Button>
                            <Button onClick={() => navigate(-1)}>取消返回</Button>
                        </Space>
                    </Card>
                </div>
            )}

            {/* 流程1/2/3引导页 */}
            {step >= 1 && step <= 3 && renderGuideFlow()}

            {/* step=4 流程全部走完，展示原有表单 */}
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
                    <Form.Item label="原名字">
                        <Input placeholder="原名字" value={oldName} disabled />
                    </Form.Item>
                    <Form.Item label="原手机号">
                        <Input placeholder="原手机号" value={oldPhone} disabled />
                    </Form.Item>
                    <Form.Item label="原身份证">
                        <Input placeholder="原身份证" value={oldcustomCard} disabled />
                    </Form.Item>
                    <Form.Item
                        label="更改后的名字"
                        name="name"
                        rules={[{ required: true, message: "请填写更改后的名字" }]}
                    >
                        <Input placeholder="更改后的名字" />
                    </Form.Item>
                    <Form.Item
                        label="更改后的手机号"
                        name="phone"
                        rules={[
                            { required: true, message: "请填写更改后的手机号" },
                            { pattern: phonePattern, message: "请输入有效的手机号" },
                        ]}
                    >
                        <Input placeholder="更改后的手机号" />
                    </Form.Item>
                    <Form.Item
                        label="更改后的身份证"
                        name="customCard"
                        rules={[{ required: true, message: "请填写更改后的身份证" }]}
                    >
                        <Input placeholder="更改后的身份证" />
                    </Form.Item>
                    <Form.Item label="图片">
                        <ImageUploadPng onImageUpload={onImageUpload} oldBase64={oldBase64} />
                        <Space>
                            {imgB64.map((item: any, index: number) => (
                                <Space key={index}>
                                    <Image src={item} style={{ width: "80px", height: "80px", borderRadius: "5px" }} />
                                    <Button danger size="small" onClick={() => handleDeletezuhu(index)}>
                                        删
                                    </Button>
                                </Space>
                            ))}
                        </Space>
                    </Form.Item>
                    <Form.Item label="注意">
                        <span style={{ color: "red", fontSize: "12px" }}>
                            该租户如有账单未结清，不能更名
                        </span>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                添加
                            </Button>
                            <Button type="primary" onClick={() => navigate(-1)}>
                                返回
                            </Button>
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
export default connect(mapStateToProps)(AddRename);