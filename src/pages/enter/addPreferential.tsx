import {
    Button, DatePicker, Form, Input, InputNumber, message, Radio, Select, Space, Spin,
    Steps, Card, Modal, Image
} from "antd";
import { useEffect, useState, useRef } from "react";
import { connect, history, useNavigate } from "umi";
import * as StaffService from "@/services/staff";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import ImageUploadPng from "@/components/ImageUploadPng";
import html2pdf from "html2pdf.js";
import ImageUpload from "@/components/ImageUploader";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddPreferential = (props) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // 流程步骤：0=欢迎首页 1=流程1 2=流程2 3=流程3 4=优惠表单页面
    const [step, setStep] = useState<number>(0);
    // PDF下载完成标记，未下载按钮禁用
    const [downloadComplete, setDownloadComplete] = useState<boolean>(false);
    // 协议弹窗控制
    const [modalVisible, setModalVisible] = useState(false);
    // PDF打印DOM Ref（弹窗内部，不会脱离页面空白）
    const pdfTemplateDom = useRef<HTMLDivElement>(null);

    // 租户名字
    const [oldName, setOldName] = useState('');
    // 租户手机号
    const [oldPhone, setOldPhone] = useState('');
    // 审核后的合同列表
    const [hetongList, setHetongList] = useState([]);
    // 租户ID
    const [tenantId, setTenantID] = useState(0);
    const [spinning, setspinning] = useState(false);
    const [zuMoney, setmoney] = useState(0);
    // 优惠类型
    const [youhuiType, setyouhuiType] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [discountMoney, setdiscountMoney] = useState(0);
    const [imgB64, setImgB64] = useState<string[]>([]);
    const [imgName, setImgName] = useState<string[]>([]);
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
            message.warning("租金优惠协议模板加载失败，请刷新页面重试");
            return;
        }
        const element = pdfTemplateDom.current;
        const options = {
            margin: 15,
            filename: "租金优惠协议书.pdf",
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
                message.success("租金优惠协议PDF下载完成，可进入信息填写页面");
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
            title: "流程三：下载租金优惠协议并确认权责条款",
            desc: "1. 点击【查看并下载租金优惠协议】导出PDF，打印线下签字留存；\n2. 必须完成PDF下载后，才可进入优惠信息填写页面；\n3. 协议明确中途退租规则：满合同优惠中途退场，往期优惠金额计入账单追缴；\n4. 提交单据后等待管理员审核，审核通过次月生效租金减免。"
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
                            查看并下载租金优惠协议
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
                            进入优惠信息填写
                        </Button>
                    )}

                    <Button onClick={() => navigate(-1)}>返回</Button>
                </Space>
            </Card>
        )
    };
    // 图片base64
    const onImageUpload = (base64: any) => {
        setImgName([...imgName, base64]);
    };
    const oldBase64 = (base64: any) => {
        setImgB64([...imgB64, base64]);
    };

    const onFinish = (vals: any) => {
        setspinning(true);
        const imgList = imgName.join('|');
        props.dispatch({
            type: 'Preferential/add',
            payload: { ...vals, tenantId, startDate, endDate, youhuiType, discountMoney,imgList }
        }).then((res: TypeErrorCode) => {
            if (res.ErrorCode == 0 || res.ErrorCode == 9038) {
                setspinning(false);
                message.success('提交成功');
                history.push("/enter/afterSales")
            } else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };

    const change = (e) => {
        setspinning(true);
        StaffService.one(e).then((res: any) => {
            if (res.ErrorCode == 0) {
                console.log('res', res);
                setspinning(false);
                setOldName(res.Data.tenant_name);
                setOldPhone(res.Data.tenant_phone);
                setTenantID(res.Data.tenantId);
                setmoney(res.Data.zuMoney);
            } else {
                setspinning(false);
                message.error(res.Data);
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

    const onRadioChange = (e) => {
        setyouhuiType(e.target.value);
    };
    const changeDate = (_: any, date: any) => {
        setStartDate(date[0] + '-01');
        setEndDate(date[1] + '-01');
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
                title="租金优惠协议书"
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
                    <h2 style={{ textAlign: "center", marginTop: 0, marginBottom: "24px" }}>租赁租金优惠申请书</h2>
                    <div>尊敬的________________：</div>

                    <div style={{ textIndent: "2em" }}>本人__________，身份证号：________________________，现承租您位于____________________________________的房屋，租赁合同期限自_____年____月____日至_____年____月____日。</div>
                    <div style={{ textIndent: "2em" }}>本人自入住以来，一直按时足额缴纳租金、爱护房屋及设施、遵守合同约定、无任何违约记录，并保持房屋整洁、正常使用。</div>

                    <div>现因：</div>
                    <div style={{ textIndent: "2em" }}>特向您诚恳申请租金优惠：</div>
                    <div style={{ textIndent: "2em" }}>1.申请优惠时段：____年____月____日 — ____年____月____日</div>
                    <div style={{ textIndent: "2em" }}>原合同租金及优惠后租金具体如下表所列：</div>


                    {/* 表格区域，打印PDF兼容 */}
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            marginTop: "12px",
                            marginBottom: "12px"
                        }}
                    >
                        <thead>
                        <tr>
                            <th style={{ border: "1px solid #333", padding: "8px", textAlign: "center" }}>日期</th>
                            <th style={{ border: "1px solid #333", padding: "8px", textAlign: "center" }}>原合同租金标准</th>
                            <th style={{ border: "1px solid #333", padding: "8px", textAlign: "center" }}>优惠金额</th>
                            <th style={{ border: "1px solid #333", padding: "8px", textAlign: "center" }}>优惠后租金标准</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td style={{ border: "1px solid #333", padding: "8px", textAlign: "center" }}>___年___月___日至___年___月___日</td>
                            <td style={{ border: "1px solid #333", padding: "8px", textAlign: "center" }}>______元/月</td>
                            <td style={{ border: "1px solid #333", padding: "8px", textAlign: "center" }}>______元/月</td>
                            <td style={{ border: "1px solid #333", padding: "8px", textAlign: "center" }}>______元/月</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #333", padding: "8px", textAlign: "center" }}>___年___月___日至___年___月___日</td>
                            <td style={{ border: "1px solid #333", padding: "8px", textAlign: "center" }}>______元/月</td>
                            <td style={{ border: "1px solid #333", padding: "8px", textAlign: "center" }}>______元/月</td>
                            <td style={{ border: "1px solid #333", padding: "8px", textAlign: "center" }}>______元/月</td>
                        </tr>
                        </tbody>
                    </table>


                    <div style={{ textIndent: "2em" }}>
                        本人承诺：在租赁期间提前终止或解除租赁，有权取消我方所有租金减免优惠，按原合同租金标准计收房屋租金/占用费，同时有权要求我方按原合同租金标准补交租赁期间租金差额。继续按时缴纳租金及水、电、燃气、物业等全部费用，严格遵守租赁合同各项约定，做诚信、守约的承租人。恳请您酌情考虑本人实际情况，给予租金优惠支持。
                    </div>

                    <div style={{ textIndent: "2em", marginTop: "8px" }}>
                        非常感谢您的理解与帮助！
                    </div>

                    {/* 签名整体靠右 */}
                    <div style={{ marginTop: "40px", textAlign: "right" }}>
                        <div>申请人（签字）：______________ </div>
                        <div style={{ marginTop: "12px" }}>联系电话：__________________</div>
                        <div style={{ marginTop: "12px" }}>申请日期：______年____月____日</div>
                    </div>
                </div>
            </Modal>

            {/* 初始欢迎引导页 step=0 */}
            {step === 0 && (
                <div style={{ textAlign: "center", marginTop: 80 }}>
                    <Card style={{ maxWidth: 600, margin: "0 auto" }}>
                        <h3>租金优惠申请操作须知引导</h3>
                        <p style={{ color: "#666" }}>
                            发起租金优惠申请前，请完整阅读操作流程，下载优惠协议确认权责后才可填写单据。
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

            {/* step=4 流程走完+PDF已下载，展示优惠表单 */}
            {step === 4 && (
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    initialValues={{ discountMoney: 0 }}
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
                    <Form.Item label='合同租金'>
                        <InputNumber value={zuMoney} disabled />元
                    </Form.Item>
                    <Form.Item label='每月优惠金额'>
                        <InputNumber min={0} max={zuMoney} value={discountMoney} onChange={(e) => setdiscountMoney(e)} />元
                    </Form.Item>
                    <Form.Item label='优惠开始/结束月份'>
                        <DatePicker.RangePicker picker="month" onChange={changeDate} />
                    </Form.Item>
                    <Form.Item label='优惠类型'>
                        <Radio.Group value={youhuiType} onChange={onRadioChange}>
                            <Radio value={1}>满合同优惠</Radio>
                            <Radio value={2}>未满合同优惠</Radio>
                        </Radio.Group>
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
                    <Form.Item label='注意'>
                        <span style={{ color: 'red', fontSize: '12px' }}>
                            满合同优惠，中途退租，合同未到期，历史优惠金额算到账单一起出
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
export default connect(mapStateToProps)(AddPreferential);