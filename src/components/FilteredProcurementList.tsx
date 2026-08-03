import * as ApplicationServer from "@/services/application";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {Button, DatePicker, Input, List, Select, Space, Table} from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {updateSessionStorage} from "@/utils/OpenTool";
import {connect} from "umi";

// 定义接收的参数类型
interface ProcurementTableProps {
    // 默认勾选的数据 格式：[{id:1}, {id:2}]
    defaultCheckedItems?: { id: number | string }[];
    // 勾选变化回调：返回 完整选中数据
    onSelectionChange: (selectedRows: any[]) => void;
    // connect 注入全局供应商列表
    SupplierList?: any[];
}

const ProcurementTable = ({
                              defaultCheckedItems = [],
                              onSelectionChange,
                              SupplierList = [],
                          }: ProcurementTableProps) => {
    const [page, setPage] = useState(1);
    const [orderCode, setOrderCode] = useState("");
    const [supplierName, setSupplierName] = useState(0);
    const [startDate, setStartDate] = useState("2000-01-01");
    const [endDate, setEndDate] = useState("2099-01-01");
    const [orderStatus, setOrderStatus] = useState(2);
    const [billStatus, setBillStatus] = useState(0);
    const [orderType, setOrderType] = useState(0);
    const [warehouseName, setWarehouseName] = useState('');
    const [uName, setUName] = useState('');
    const [procurementList, setProcurementList] = useState([]);

    // 选中项 KEY 数组
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    // 选中完整数据
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    // ===================== 处理外部传入的默认勾选 =====================
    useEffect(() => {
        if (defaultCheckedItems && defaultCheckedItems.length > 0) {
            // 把 [{id:1},{id:2}] 转成 [1,2]
            const keys = defaultCheckedItems.map((item) => item.id);
            setSelectedRowKeys(keys);
        }
    }, [defaultCheckedItems]);

    // ===================== 表格列 =====================
    const columns = [
        {
            title: "申请日期",
            dataIndex: "orderTime",
            key: "orderTime",
            align: "center",
            render: (text) => dayjs(text).format("YYYY-MM-DD"),
        },
        {
            title: "采购单号",
            dataIndex: "orderCode",
            key: "orderCode",
            align: "center",
        },
        {
            title: "供应商",
            dataIndex: "supplierName",
            key: "supplierName",
            align: "center",
            ellipsis: true,
        },
        {
            title: "物品总价",
            dataIndex: "totalAmount",
            key: "totalAmount",
            align: "center",
        },
        {
            title: "申请人",
            dataIndex: "user_name",
            key: "user_name",
            align: "center",
            ellipsis: true,
        },
    ];
    // ===================== 获取数据 =====================
    const getApplication = () => {
        ApplicationServer.fetch({
            page,
            orderCode,
            warehouseName,
            supplierName,
            startDate,
            endDate,
            orderStatus,
            billStatus,
            pageSize: 10000,
            orderType,
            uName,
        }).then((res: TypeErrorCode) => {
            if (res.ErrorCode == 0) {
                setProcurementList(res.Data.data || []);
            }
        });
    };

    // 搜索
    const search = () => {
        setSelectedRowKeys([]);
        setSelectedRows([]);
        onSelectionChange([]);
        getApplication();
    };

    // ===================== 勾选变化（核心） =====================
    const handleSelectionChange = (
        selectedKeys: React.Key[],
        selectedRowsData: any[]
    ) => {
        setSelectedRowKeys(selectedKeys);
        setSelectedRows(selectedRowsData);
        const result = selectedRowsData.map(item => ({
            id: item.id,
            orderCode: item.orderCode,
            supplierName:item.supplierName
        }));
        onSelectionChange(result);
    };

    // 表格勾选配置
    const rowSelection = {
        selectedRowKeys,
        onChange: handleSelectionChange,
        type: "checkbox",
    };
    const changeSupplierId=(e)=>{
        setSupplierName(e);
    };
    return (
        <div>
            <Space>
                <Input
                    addonBefore="单号:"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value)}
                />
                <Space.Compact>
                    <div
                        style={{
                            borderRadius: '6px',
                            borderStartEndRadius: 0,
                            borderEndEndRadius: 0,
                            padding: '0 11px',
                            border: '1px solid #d9d9d9',
                            display: 'flex',
                            alignItems: 'center',
                            borderInlineEnd: 0,
                        }}
                    >
                        供应商:
                    </div>
                    <Select
                        style={{width:'250px'}}
                        showSearch
                        onChange={changeSupplierId}
                        placeholder='供应商'
                        value={supplierName}
                        filterOption={(input, option) => {
                            const item = SupplierList.find(unit => unit.id == option.value);
                            return item?.supplierName?.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={
                            [
                                { label: '全部', value: 0 },
                                ...(Array.isArray(SupplierList) && SupplierList.length > 0
                                        ? SupplierList.map((item:any)=>({
                                            label: item.supplierName,
                                            value: item.id,
                                        }))
                                        : []
                                )
                            ]
                        }
                    />
                </Space.Compact>
                <Input
                    addonBefore="申请人:"
                    value={uName}
                    onChange={(e) => setUName(e.target.value)}
                />

            </Space>
            <List>
                <List.Item>
                    <Space>
                        <Space.Compact>
                            <div
                                style={{
                                    borderRadius: "6px",
                                    borderStartEndRadius: 0,
                                    borderEndEndRadius: 0,
                                    padding: "0 11px",
                                    border: "1px solid #d9d9d9",
                                    display: "flex",
                                    alignItems: "center",
                                    borderInlineEnd: 0,
                                }}
                            >
                                日期:
                            </div>
                            {startDate == "2000-01-01" && endDate == "2099-01-01" ? (
                                <DatePicker.RangePicker
                                    onChange={(_, data) => {
                                        setStartDate(data[0]);
                                        setEndDate(data[1]);
                                    }}
                                />
                            ) : (
                                <DatePicker.RangePicker
                                    defaultValue={[dayjs(startDate), dayjs(endDate)]}
                                    onChange={(_, data) => {
                                        setStartDate(data[0]);
                                        setEndDate(data[1]);
                                    }}
                                />
                            )}
                        </Space.Compact>
                        <Button type="primary" onClick={search}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <div style={{ margin: "8px 0" }}>已选中：{selectedRows.length} 条</div>
            <Table
                columns={columns}
                style={{ border: "1px solid #ddd", borderRadius: "4px" }}
                pagination={false}
                scroll={{ y: "60vh" }}
                dataSource={procurementList}
                rowKey={(record) => record.id}
                size="small"
                rowSelection={rowSelection}
            />
        </div>
    );
};

// 按你写的映射全局state
const mapStateToProps = (state: any) => ({
    SupplierList: state.Supplier.list,
});

// connect 导出
export default connect(mapStateToProps)(ProcurementTable);