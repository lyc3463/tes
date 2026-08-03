import {
    Button, DatePicker, Form, Input, InputNumber, message, Select, Space, Spin,
    Steps, Card, Modal, Image
} from "antd";
import { useEffect, useState, useRef } from "react";
import { connect, history, useNavigate } from "umi";
import * as StaffService from "@/services/staff";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import html2pdf from "html2pdf.js";
import ImageUploadPng from "@/components/ImageUploadPng";

const tailLayout = {
    wrapperCol: { offset: 4 },
};

const AddByStages = (props) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    // 流程状态：0=欢迎首页 1=流程1 2=流程2 3=流程3 4=分期表单页面
    const [step, setStep] = useState<number>(0);
    // PDF下载完成标记，未下载则进入按钮禁用
    const [downloadComplete, setDownloadComplete] = useState<boolean>(false);
    // 协议弹窗控制
    const [modalVisible, setModalVisible] = useState(false);
    // PDF打印DOM容器ref（弹窗内部，不会脱离页面导出空白）
    const pdfTemplateDom = useRef<HTMLDivElement>(null);
    // 租户名字
    const [oldName, setOldName] = useState('');
    // 租户手机号
    const [oldPhone, setOldPhone] = useState('');
    // 审核后的合同列表
    const [hetongList, setHetongList] = useState([]);
    // 租户ID
    const [tenantId, setTenantID] = useState(0);
    // 原租金
    const [zuMoney, setZuMoney] = useState(0);
    const [spinning, setspinning] = useState(false);
    const [futureRent, setfutureRent] = useState(0);
    // 合同起租日
    const [oldbeginTime, setbeginTime] = useState('2000-01');
    // 合同到期日
    const [oldendTime, setendTime] = useState('2099-01');
    // 分期开始时间
    const [fqStartDate, setFqStartDate] = useState('');
    // 分期结束时间
    const [fqEndDate, setfqEndDate] = useState('');
    // 还款开始时间
    const [hkStartDate, sethkStartDate] = useState('');
    // 还款结束时间
    const [hkEndDate, sethkEndDate] = useState('');
    const [imgB64, setImgB64] = useState<string[]>([]);
    const [imgName, setImgName] = useState<string[]>([]);
    // 上一步切换
    const handlePrevStep = () => {
        setStep(prev => prev - 1);
        setDownloadComplete(false);
    };
    // 下一步切换
    const handleNextStep = () => {
        setStep(prev => prev + 1);
        setDownloadComplete(false);
    };

    // PDF导出方法
    const exportPdf = () => {
        if (!pdfTemplateDom.current) {
            message.warning("租金分期协议模板加载失败，请刷新页面重试");
            return;
        }
        const element = pdfTemplateDom.current;
        const options = {
            margin: 15,
            filename: "租金分期缴款协议书.pdf",
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
                message.success("分期缴款协议PDF下载完成，可进入信息填写页面");
                setModalVisible(false);
            });
    };

    // 三步流程文案配置
    const flowStepList = [
        {
            title: "流程一：选择租赁合同并核对租户基础信息",
            desc: "1. 下拉筛选已生效合同，系统自动回填租户姓名、手机号、原始月租金、合同起止年月；\n2. 核对线下纸质合同信息与系统回显数据保持一致；\n3. 存在历史欠费、逾期账单租户无法发起租金分期申请；\n4. 分期月份区间仅允许在合同有效周期内选择，超出区间不可选。"
        },
        {
            title: "流程二：配置分期周期、还款周期与月度分摊租金",
            desc: "1. 先选择租金分期起止月份，再选择对应还款起止月份；\n2. 填写每月分期分摊租金金额，分摊租金按月分配至还款周期；\n3. 分期周期必须与还款周期匹配，周期错位会导致账单计算异常；\n4. 填写完成后核对备注规则：分期月份租金统一分摊至对应还款月份。"
        },
        {
            title: "流程三：下载租金分期协议并确认缴款权责",
            desc: "1. 点击【查看并下载分期缴款协议】导出PDF，打印线下签字留存；\n2. 必须完成PDF下载后，才可进入分期信息填写页面；\n3. 协议明确分期逾期、违约追缴、提前结清、欠费追责全部条款；\n4. 提交单据后等待管理员审核，审核通过后系统自动生成分期账单。"
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
                            查看并下载分期缴款协议
                        </Button>
                        {downloadComplete && (
                            <span style={{ color: "#00b42a", marginLeft: 10 }}>✓ 已完成PDF下载</span>
                        )}
                    </div>
                )}

                <Space style={{ justifyContent: "center", width: "100%" }}>
                    {/* 第一步不显示上一步按钮 */}
                    {step > 1 && <Button onClick={handlePrevStep}>上一步</Button>}

                    {step < 3 ? (
                        <Button type="primary" onClick={handleNextStep}>下一步</Button>
                    ) : (
                        <Button
                            type="primary"
                            onClick={handleNextStep}
                            disabled={!downloadComplete}
                        >
                            进入分期信息填写
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
            type: 'ByStages/add',
            payload: { ...vals, tenantId, futureRent, fqStartDate, fqEndDate, hkEndDate, hkStartDate,imgList }
        }).then((res: TypeErrorCode) => {
            if (res.ErrorCode == 0 || res.ErrorCode == 9038) {
                message.success('提交成功');
                history.push("/enter/afterSales");
                setspinning(false);
            } else {
                message.error(res.Data);
                setspinning(false);
            }
        })
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
        getContntList();
    }, []);

    const change = (e) => {
        setspinning(true);
        StaffService.one(e).then((res: any) => {
            if (res.ErrorCode == 0) {
                setspinning(false);
                setOldName(res.Data.tenant_name);
                setOldPhone(res.Data.tenant_phone);
                setTenantID(res.Data.tenantId);
                setZuMoney(res.Data.zuMoney);
                setbeginTime(res.Data.beginTime);
                setendTime(res.Data.endTime);
            } else {
                setspinning(false);
                message.error(res.Data)
            }
        })
    };

    const disabledDate = (current) => {
        return current && (current < dayjs(oldbeginTime) || current > dayjs(oldendTime));
    };
    const changeFqdate = (_: any, date: any) => {
        setFqStartDate(date[0] + '-01');
        setfqEndDate(date[1] + '-01');
    };
    const changehkdate = (_: any, date: any) => {
        sethkStartDate(date[0] + '-01');
        sethkEndDate(date[1] + '-01');
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
            {/* PDF分期协议弹窗，DOM正常渲染，不会导出空白 */}
            <Modal
                title="租金分期缴款协议书"
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
                    <h2 style={{ textAlign: "center" }}>租金分期缴款协议书</h2>
                    <div>甲方（出租方）：</div>
                    <div>地址：</div>
                    <div>法定代表人：</div>
                    <div>乙方（承租方）：</div>
                    <div>身份证/统一社会信用代码：</div>
                    <div>联系地址：</div>
                    <div>联系电话：</div>

                    <div style={{ marginTop: 12, textIndent: "2em" }}>
                        甲乙双方已签订商铺租赁合同，乙方因资金周转需求，申请将合同租金按月分期分摊缴纳，经甲方审核同意，双方订立本分期缴款协议。
                    </div>
                    <div style={{ marginTop: 8, textIndent: "2em" }}>
                        一、双方约定分期起止月份、还款起止月份、每月分摊租金金额以系统填报数据为准，分期租金统一分配至对应还款周期账单。
                    </div>
                    <div style={{ marginTop: 8, textIndent: "2em" }}>
                        二、乙方须严格按照还款周期足额缴纳分摊租金，出现逾期、欠费视为违约，甲方有权取消分期方案并一次性追缴全部剩余租金。
                    </div>
                    <div style={{ marginTop: 8, textIndent: "2em" }}>
                        三、分期周期不得超出原租赁合同有效期限，分期区间、还款区间错位产生的账单差额由乙方全额承担。
                    </div>
                    <div style={{ marginTop: 8, textIndent: "2em" }}>
                        四、乙方提前终止租赁、中途退租的，全部未到期分期租金立即到期，甲方可合并计入账单一并追偿，同时扣除全部押金抵扣欠款。
                    </div>
                    <div style={{ marginTop: 8, textIndent: "2em" }}>
                        五、本协议为租金分期申请配套文件，提交系统即代表乙方完全认可全部违约与缴款约束条款，分期生效以后台管理员审核通过为准。
                    </div>
                    <div style={{ marginTop: 8, textIndent: "2em" }}>
                        六、因本协议产生争议，双方协商不成的，任何一方可向甲方所在地人民法院提起诉讼。
                    </div>

                    <div style={{ marginTop: 20 }}>（以下无正文）</div>
                    <div style={{ marginTop: 16 }}>甲方签字/盖章：</div>
                    <div>签订日期：</div>
                    <div style={{ marginTop: 12 }}>乙方签字：</div>
                    <div>签订日期：</div>
                </div>
            </Modal>

            {/* 初始欢迎引导页 step=0 */}
            {step === 0 && (
                <div style={{ textAlign: "center", marginTop: 80 }}>
                    <Card style={{ maxWidth: 600, margin: "0 auto" }}>
                        <h3>租金分期申请操作须知引导</h3>
                        <p style={{ color: "#666" }}>
                            发起租金分期申请前，请完整阅读操作流程，下载分期缴款协议确认权责后才可填写单据。
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

            {/* step=4 流程走完+PDF已下载，展示原有分期表单 */}
            {step === 4 && (
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    onFinish={onFinish}
                    style={{ marginTop: '1rem' }}
                >
                    <Form.Item label='选择合同' name='contractId'>
                        <Select
                            onChange={change}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                                const item = hetongList.find(hetongID => hetongID.id == option?.value);
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
                    <Form.Item label='租户名字'>
                        <Input placeholder='租户名字' value={oldName} disabled />
                    </Form.Item>
                    <Form.Item label='租户手机号'>
                        <Input placeholder='租户手机号' value={oldPhone} disabled />
                    </Form.Item>
                    <Form.Item label='原租金/月'>
                        <InputNumber value={zuMoney} disabled />元
                    </Form.Item>
                    <Form.Item label='分期开始/结束时间'>
                        <DatePicker.RangePicker picker="month" disabledDate={disabledDate} onChange={changeFqdate} />
                    </Form.Item>
                    <Form.Item label='还款开始/结束时间'>
                        <DatePicker.RangePicker picker="month" onChange={changehkdate} />
                    </Form.Item>
                    <Form.Item label='每月分期租金(元)'>
                        <InputNumber value={futureRent} min={0} onChange={(e) => setfutureRent(e)} />
                    </Form.Item>
                    <Form.Item label='图片'>
                        <ImageUpload onImageUpload={onImageUpload} oldBase64={oldBase64} />
                        <Space>
                            {imgB64.map((item: any, index: number) => (
                                <Space key={index}>
                                    <Image src={item} style={{ width: '80px', height: "80px", borderRadius: '5px' }} />
                                    <Button danger size="small" onClick={() => handleDeletezuhu(index)}>删</Button>
                                </Space>
                            ))}
                        </Space>
                    </Form.Item>
                    <Form.Item label='备注'>
                        <span style={{ fontSize: '12px', color: '#555' }}>分期开始/结束月份每月分期租金分配给还款开始/结束日期</span>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                添加
                            </Button>
                            <Button type="primary" onClick={() => navigate(-1)}>
                                返回
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            )}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckHetongList: state.CheckHetong.list,
    }
};
export default connect(mapStateToProps)(AddByStages);