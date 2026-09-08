import {
    Button,
    DatePicker,
    Form,
    Input,
    message,
    Select,
    Spin,
    Radio,
    Space,
    Image,
    Steps,
    Card,
    Modal
} from "antd";
import { filterAndUpdateList, phonePattern } from "@/utils/OpenTool";
import { history, connect, useNavigate } from "umi";
import { useCallback, useEffect, useState, useRef } from "react";
import * as StaffService from "@/services/staff";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import ImageUploadPng from "@/components/ImageUploadPng";
import ImageUpload from "@/components/ImageUploader";
import html2pdf from "html2pdf.js";

const tailLayout = {
    wrapperCol: { offset: 4 },
};

// 缓存key
const CACHE_KEY = "AddOutRent_form_cache";

const AddOutRent = (props:any) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // 流程步骤 0=欢迎首页 1=流程1 2=流程2 3=流程3 4=退租表单页面
    const [step, setStep] = useState<number>(0);
    // PDF下载完成标记
    const [downloadComplete, setDownloadComplete] = useState<boolean>(false);
    // 协议弹窗控制
    const [modalVisible, setModalVisible] = useState(false);
    // PDF打印容器ref
    const pdfTemplateDom = useRef<HTMLDivElement>(null);

    // 租户名字
    const [oldName, setOldName] = useState('');
    // 审核后的合同列表
    const [hetongList, setHetongList] = useState([]);
    // 租户ID
    const [tenantId, setTenantID] = useState(0);
    // 退租时间
    const [startDate, setStartDate] = useState('');
    // 租户手机号
    const [tenant_phone, settenant_phone] = useState('');
    const [spinning, setspinning] = useState(false);
    // 1正常退租,2强制退租
    const [type, settype] = useState(2);
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
            tenantId,
            tenant_phone,
            startDate,
            type,
            imgB64,
            imgName,
            formValues: form.getFieldsValue()
        };
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('草稿保存失败：', e);
        }
    }, [step, downloadComplete, oldName, tenantId, tenant_phone, startDate, type, imgB64, imgName, form]);

    // 清空缓存
    const clearCache = () => sessionStorage.removeItem(CACHE_KEY);

    // 清空草稿
    const resetAllFormData = () => {
        clearCache();
        setStep(0);
        setDownloadComplete(false);
        setOldName('');
        setTenantID(0);
        settenant_phone('');
        setStartDate('');
        settype(2);
        setImgB64([]);
        setImgName([]);
        form.resetFields();
    };

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

    // PDF导出方法
    const exportPdf = () => {
        if (!pdfTemplateDom.current) {
            message.warning("退租协议模板加载失败，请刷新页面重试");
            return;
        }
        const element = pdfTemplateDom.current;
        const options = {
            margin: 15,
            filename: "房屋退租协议书.pdf",
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
                message.success("退租协议PDF下载完成，可进入信息填写页面");
                setModalVisible(false);
            });
    };

    // 三步流程文案
    const flowStepList = [
        {
            title: "流程一：选择对应租赁合同并核对租户信息",
            desc: "1. 在下拉框筛选已生效的租赁合同，系统自动回显租户姓名、联系电话；\n2. 核对线下纸质合同信息与系统回显信息保持一致；\n3. 存在未结清租金、水电、物业欠费时，无法办理退租；\n4. 确认房屋无损坏、物品完好后再发起退租申请。"
        },
        {
            title: "流程二：填写退租基础信息并上传佐证材料",
            desc: "1. 选择实际退租日期，填写详细退租原因，内容不能为空；\n2. 区分退租类型：正常退租/强制退租，根据实际情况选择；\n3. 上传房屋现状、钥匙交接、损坏凭证等照片，支持多图上传；\n4. 缺失图片或信息填写不全，后台审核会直接驳回单据。"
        },
        {
            title: "流程三：下载退租协议并确认提交规则",
            desc: "1. 点击【查看并下载退租协议】导出PDF文件，打印线下签字留存；\n2. 必须完成PDF下载后，才可进入退租信息填写页面；\n3. 协议包含押金退还、房屋修复、欠费追责、权责划分条款；\n4. 提交单据后等待管理员审核，审核通过才算正式完成退租。"
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
                            查看并下载退租协议
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
                            进入退租信息填写
                        </Button>
                    )}

                    <Button onClick={() => navigate(-1)}>返回</Button>
                </Space>
            </Card>
        )
    };

    const onFinish = (vals: any) => {
        setspinning(true);
        const imgList = imgName.join('|');
        props.dispatch({
            type: 'OutRent/add',
            payload: { ...vals, tenantId, startDate, type, imgList }
        }).then((res: TypeErrorCode) => {
            if (res.ErrorCode == 0 || res.ErrorCode == 9038) {
                setspinning(false);
                message.success('提交成功');
                // 添加成功后清空草稿缓存
                clearCache();
                history.push("/enter/afterSales");
            } else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };

    const change = (e:number) => {
        setspinning(true);
        StaffService.one(e).then((res: any) => {
            if (res.ErrorCode == 0) {
                setspinning(false);
                setOldName(res.Data.tenant_name);
                setTenantID(res.Data.tenantId);
                settenant_phone(res.Data.tenant_phone);
            } else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };

    const changeDate = (_: any, data: string) => {
        setStartDate(data);
    };

    // 合同列表
    const getContntList = () => {
        setspinning(true);
        props.dispatch({
            type: 'SeleHetong/fetch'
        }).then((res: TypeErrorCode) => {
            if (res.ErrorCode == 0) {
                setHetongList(res.Data);
                setspinning(false);
            } else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };

    useEffect(() => {
        // 加载缓存：回填state与表单字段
        const cache = loadCache();
        if (cache) {
            setStep(cache.step ?? 0);
            setDownloadComplete(cache.downloadComplete ?? false);
            setOldName(cache.oldName ?? '');
            setTenantID(cache.tenantId ?? 0);
            settenant_phone(cache.tenant_phone ?? '');
            setStartDate(cache.startDate ?? '');
            settype(cache.type ?? 2);
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

    const changeType = (e:any) => {
        settype(e.target.value);
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
            {/* PDF协议弹窗，DOM正常渲染，不会空白 */}
            <Modal
                title="房屋退租协议书"
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
                    <h2 style={{ textAlign: "center", marginTop: 0, marginBottom: "24px" }}>解除合同申请书</h2>
                    <div>致：__________物业服务中心 / 出租方：</div>
                    <div style={{ textIndent: "2em" }}>我方__________（姓名/名称），证件号：________________________，现承租贵方位于____________________________________（房屋详细地址）的房屋，租赁合同期限为______年____月____日至______年____月____日。</div>
                    <div style={{ textIndent: "2em" }}>因我方原因，现正式向贵方提出解除租赁合同申请，申请于______年____月____日解除租赁合同并办理交接手续。</div>
                    <div>我方承诺：</div>
                    <div style={{ textIndent: "2em" }}>租赁合同解除前将结清该房屋租赁期间产生的房租、水费、电费、燃气费、物业费、网络费等全部相关费用；保持房屋及室内家具、家电、附属设施完好无损，按合同约定配合验收；按时腾空房屋，清理我方物品，配合完成退租交接相关手续。</div>
                    <div style={{ textIndent: "2em" }}>恳请贵方予以批准，感谢贵方在租赁期间的理解与配合！</div>

                    {/* 右侧签名区域 */}
                    <div style={{ marginTop: "40px", textAlign: "right" }}>
                        <div>申请人（签字）：______________</div>
                        <div style={{ marginTop: "16px" }}>联系电话：____________________</div>
                        <div style={{ marginTop: "16px" }}>申请日期：______年____月____日</div>
                    </div>
                </div>
            </Modal>

            {/* 初始欢迎引导页 step=0 */}
            {step === 0 && (
                <div style={{ textAlign: "center", marginTop: 80 }}>
                    <Card style={{ maxWidth: 600, margin: "0 auto" }}>
                        <h3>租户退租操作须知引导</h3>
                        <p style={{ color: "#666" }}>
                            发起退租申请前，请完整阅读操作流程，下载退租协议确认条款后才可填写单据。
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

            {/* step=4 流程走完+PDF已下载，展示退租表单 */}
            {step === 4 && (
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    initialValues={{ reason: '' }}
                    onFinish={onFinish}
                    onValuesChange={handleFormChange}
                    style={{ marginTop: '1rem' }}
                >
                    <Form.Item label='选择合同' name='contractId'>
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
                                )
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item label='租户手机号'>
                        <Input value={tenant_phone} disabled />
                    </Form.Item>
                    <Form.Item label='租户名字'>
                        <Input value={oldName} disabled />
                    </Form.Item>
                    <Form.Item label='退租时间'>
                        <DatePicker onChange={changeDate} />
                    </Form.Item>
                    <Form.Item label='退租原因' name='reason' rules={[{ required: true, message: '请输入' }]}>
                        <Input.TextArea placeholder='退租原因' />
                    </Form.Item>
                    <Form.Item label='图片'>
                        <ImageUploadPng onImageUpload={onImageUpload} oldBase64={oldBase64} />
                        <Space>
                            {imgB64.map((item: any, index: number) => (
                                <Space key={index}>
                                    <Image src={item} style={{ width: '80px', height: "80px", borderRadius: '5px' }} />
                                    <Button danger size="small" onClick={() => handleDeletezuhu(index)}>删</Button>
                                </Space>
                            ))}
                        </Space>
                    </Form.Item>
                    <Form.Item label='退租类型'>
                        <Radio.Group value={type} onChange={changeType}>
                            <Radio value={1}>正常退租</Radio>
                            <Radio value={2}>强制退租</Radio>
                        </Radio.Group>
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
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckHetongList: state.SeleHetong.list,
    }
};
export default connect(mapStateToProps)(AddOutRent);