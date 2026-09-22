import { useNavigate } from "umi";
import dayjs from "dayjs";
import { Button, List, Space, Table, Tag, Typography } from "antd";

// 账单表格单项类型（你 Table 里渲染的每一行）
export interface BillItem {
    id: number;
    monthBeginDate: string;
    monthEndDate: string;
    rent: number;
    manageFee: number;
    rentFreeDay: number;
    payRent: number;
    payManageFee: number;
    prepayment: number;
    billMoney: number;
    billStatus: 1 | 2 | 3; // 1未交 2已交 3已退租
}

// 你传入的 **整个合同对象类型**（完全对应你给的结构）
export interface ContractInfo {
    beginTime: string;
    contractId: number;
    coutractList: null; // 你这里是 null
    data: BillItem[];  // 这个数组就是表格数据！
    endTime: string;
    identifier: string;
    manageFee: number;
    manageFeeRent: number;
    payBillMoneySum: number;
    rent: number;
    tenantBill: null;
    tenantId: number;
    tenant_name: string;
    tenant_phone: string | null;
    unitList: null;
}

const TenantBill = ({ contractInfo }: { contractInfo: ContractInfo }) => {
    const navigate = useNavigate();

    // 没传对象 → 不渲染
    if (!contractInfo) return null;

    // 表格列
    const columns = [
        {
            title: "账单日期",
            dataIndex: "allDate",
            key: "allDate",
            render: (text: any, record: BillItem) => (
                <div>
                    {dayjs(record.monthBeginDate).format("YYYY-MM-DD")} 至 {dayjs(record.monthEndDate).format("YYYY-MM-DD")}
                </div>
            ),
        },
        {
            title: "租金",
            dataIndex: "rent",
            key: "rent",
            render: (t: any, record: BillItem) => <div>{record.rent} 元</div>,
        },
        {
            title: "管理费",
            dataIndex: "manageFee",
            key: "manageFee",
            render: (t: any, record: BillItem) => <div>{record.manageFee} 元</div>,
        },
        {
            title: "免租天数",
            dataIndex: "rentFreeDay",
            key: "rentFreeDay",
            render: (t: any, record: BillItem) =>
                record.rentFreeDay === 0 ? (
                    <Tag color="#999">{record.rentFreeDay} 天</Tag>
                ) : (
                    <Tag color="magenta">{record.rentFreeDay} 日</Tag>
                ),
        },
        {
            title: "应交租金",
            dataIndex: "payRent",
            key: "payRent",
            render: (t: any, record: BillItem) =>
                record.payRent === 0 ? (
                    <Tag color="warning">{record.payRent} 元</Tag>
                ) : (
                    <Tag color="magenta">{record.payRent} 元</Tag>
                ),
        },
        // {
        //     title: "应缴费用",
        //     dataIndex: "payManageFee",
        //     key: "payManageFee",
        //     render: (t: any, record: BillItem) =>
        //         record.payManageFee === 0 ? (
        //             <Tag color="warning">{record.payManageFee} 元</Tag>
        //         ) : (
        //             <Tag color="magenta">{record.payManageFee} 元</Tag>
        //         ),
        // },
        {
            title: "预付费",
            dataIndex: "prepayment",
            key: "prepayment",
            render: (t: any, record: BillItem) =>
                record.prepayment === 0 ? (
                    <Tag color="#999">{record.prepayment} 元</Tag>
                ) : (
                    <Tag color="magenta">{record.prepayment} 元</Tag>
                ),
        },
        {
            title: "当月账单",
            dataIndex: "billMoney",
            key: "billMoney",
            // render: (t: any, record: BillItem) =>
            //     record.billMoney === 0 ? (
            //         <Tag color="magenta">{record.billMoney} 元</Tag>
            //     ) : (
            //         <Tag color="blue">{record.billMoney} 元</Tag>
            //     ),
            // 当月账单 = 应收租金 + 管理费 - 预付费
            // 保留2位小数
            render: (t: any, record: BillItem) => {
                const billMoney = parseFloat((record.payRent + record.manageFee - record.prepayment).toFixed(2));
                return billMoney === 0 ? (
                    <Tag color="magenta">{billMoney} 元</Tag>
                ) : (
                    <Tag color="blue">{billMoney} 元</Tag>
                );
            },
        },
        {
            title: "缴费状态",
            dataIndex: "billStatus",
            key: "billStatus",
            render: (t: any, record: BillItem) => {
                switch (record.billStatus) {
                    case 1: return <Tag color="blue">未交</Tag>;
                    case 2: return <Tag color="green">已交</Tag>;
                    case 3: return <Tag color="orange">已退租</Tag>;
                    default: return <Tag color="red">未知</Tag>;
                }
            },
        },
    ];
    return (
        <div>
            <List>
                <List.Item>
                    <Space size="large" wrap>
                        <span style={{ fontWeight: 600 }}>租户姓名: {contractInfo.tenant_name}</span>
                        <Typography.Link
                            style={{ fontWeight: 600 }}
                            onClick={() => navigate(`/check/contractez?id=${contractInfo.contractId}&templateType=2`)}
                        >
                            合同编号: {contractInfo.identifier}
                        </Typography.Link>
                        <span style={{ fontWeight: 600 }}>初始租金: {contractInfo.rent} 元</span>
                        <span style={{ fontWeight: 600 }}>初始管理费: {contractInfo.manageFee} 元</span>
                        <span style={{ fontWeight: 600 }}>管理费递增: {contractInfo.manageFeeRent || 0} %</span>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(row) => row.id}
                pagination={false}
                dataSource={contractInfo.data || []}
                size="small"
                style={{ marginTop: 16, border: "1px solid #ddd", borderRadius: 4 }}
            />
        </div>
    );
};

export default TenantBill;