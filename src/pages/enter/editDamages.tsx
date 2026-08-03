import {Button, Image, message, Select, Space, Spin, Table, Tag, Tooltip, Card, Row, Col, Input, InputNumber} from "antd";
import ImageUpload from "@/components/ImageUploader";
import { useEffect, useState } from "react";
import * as ArrearsBillService from "@/services/ArrearsBill";
import * as ZuhuService from '@/services/zuhu';
import * as DamagesService from '@/services/damages';
import { useNavigate } from "umi";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const EditDamages = () => {
    const navigate = useNavigate();
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
    // id
    const [uid, setUid] = useState<number | 0>(0);

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
                const listWithAmount = res.Data.map(item => ({
                    ...item,
                    amount: 0
                }));
                setDataSource(listWithAmount);
                // 重点：删掉 setSelectedRowKeys([]); 不再覆盖清空勾选
            } else {
                message.error(res.Data);
                setDataSource([]);
                setSelectedRowKeys([]);
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
        DamagesService.edit({uid,selectTenantId,remark,imgList,jsonData:JSON.stringify(jsonData)})
            .then((res:TypeErrorCode) => {
                if (res.ErrorCode === 0) {
                    message.success("编辑成功");
                    navigate(-1);
                } else {
                    message.error(res.Data || "编辑失败");
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
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getTenantList();
        getInfo(id);
    }, []);
    const getInfo = async (e) => {
        const res: any = await DamagesService.one(e);
        console.log('res',res)
        if (res.ErrorCode === 0) {
            setRemark(res.Data.remark);
            setSelectTenantId(res.Data.tenantId);
            setUid(res.Data.Id);
            // 图片分割兜底，避免空字符串生成[""]
            setImgB64(res.Data.pdfImageBase64 ? res.Data.pdfImageBase64.split('|') : []);
            setImgName(res.Data.pdfImage ? res.Data.pdfImage.split('|') : []);

            // 1、缓存详情里的账单数组（wyjId + 已填amount）
            const detailBillArr = res.Data.pbList;
            // 提取需要勾选的id
            const targetIds = detailBillArr.map(item => item.wyjId);

            // 2、等待账单列表加载完成
            await getzujinList(res.Data.tenantId);

            // 3、取出最新完整账单列表，匹配id回填amount
            setDataSource(prevData => {
                const newData = prevData.map(tableRow => {
                    // 查找详情里对应id的记录
                    const matchDetail = detailBillArr.find(d => d.wyjId === tableRow.id);
                    if (matchDetail) {
                        // 覆盖回填详情保存的amount
                        return {
                            ...tableRow,
                            amount: matchDetail.amount ?? 0
                        };
                    }
                    return tableRow;
                });
                return newData;
            });

            // 4、回填完金额后，设置勾选
            setSelectedRowKeys(targetIds);
            // 更新全选状态
            setSelectAll(targetIds.length > 0 && targetIds.length === dataSource.length);
        }
    };
    return (
        <Spin spinning={spinning}>
            <Card>
                <Row gutter={[12, 18]} style={{ marginTop: 10 }}>
                    <Col/>
                    <Col>
                        <Space size={16}>
                            <Button type="primary" size="large" onClick={handleSubmit}>
                                编辑
                            </Button>
                            <Button size="large" onClick={() => navigate(-1)}>
                                返回
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>
            {/* 顶部新增赔偿卡片 */}
            <Card title="新增房屋损坏赔偿记录" style={{ marginBottom: 20 }}>
                <Row gutter={[24, 18]} align="top">
                    {/* 1、选择租户 */}
                    <Col span={8}>
                        <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>选择租户</div>
                        <Select
                            onChange={changeTenantId}
                            showSearch
                            value={selectTenantId}
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

        </Spin>
    );
};
export default EditDamages;
