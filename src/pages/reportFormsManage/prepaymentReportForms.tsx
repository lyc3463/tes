import { connect } from 'umi';
import { Button, Input, List, message, Pagination, Space, Spin, Table } from 'antd';
import dayjs from 'dayjs';
import { checkSessionStorage, exportDataToExcel, updateSessionStorage } from '@/utils/OpenTool';
import * as PrepaymentReportFormsService from '@/services/prepaymentReportForms';
import TypeErrorCode from '@/ModelTypes/TypeErrorCode';
import TypeTenantBill, { TenantBillList } from '@/ModelTypes/TypeTenantBill';
import { useEffect, useState } from 'react';

const PrepaymentReportForms = (props:any) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [spinning, setSpinning] = useState(false);
    const [phone, setPhone] = useState(checkSessionStorage('/reportFormsManage/payReportForms/', 'prepaymentPhone') || '');
    const [name, setName] = useState(checkSessionStorage('/reportFormsManage/payReportForms/', 'prepaymentName') || '');

    const getParams = (targetPage = page, targetPageSize = pageSize) => ({
        page: targetPage,
        pageSize: targetPageSize,
        name,
        phone,
    });

    const loadData = (targetPage = page, targetPageSize = pageSize) => {
        setSpinning(true);
        props.dispatch({
            type: 'PrepaymentReportForms/fetch',
            payload: getParams(1, 100000),
        }).then((res: TypeErrorCode) => {
            setSpinning(false);
            if (res.ErrorCode != 0) {
                message.error(res.Data);
            }
        });
    };

    const onChange = (targetPage: number, targetPageSize: number) => {
        setPage(targetPage);
        setPageSize(targetPageSize);
    };

    const search = () => {
        setPage(1);
        loadData(1, pageSize);
    };

    useEffect(() => {
        loadData();
    }, []);

    const changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
        updateSessionStorage('/reportFormsManage/payReportForms/', 'prepaymentName', event.target.value);
    };

    const changePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(event.target.value);
        updateSessionStorage('/reportFormsManage/payReportForms/', 'prepaymentPhone', event.target.value);
    };

    const exportToExcel = () => {
        setSpinning(true);
        PrepaymentReportFormsService.fetch(getParams(1, 100000)).then((res: TypeErrorCode) => {
            setSpinning(false);
            if (res.ErrorCode != 0) {
                message.error(res.Data);
                return;
            }
            const headers = ['租户', '手机号', '合同编号', '单元', '预付费(元)', '未使用预付费(元)', '账单明细'];
            const data: (string | number)[][] = res.Data.data.map((item: TypeTenantBill) => [
                item.tenant_name,
                item.tenant_phone,
                item.identifier,
                item.unitList?.map(unit => unit.unit_name).join(', ') || '',
                item.prepayment,
                item.unusedPrepayment,
                (item.tenantBillList || []).map(bill => `${dayjs(bill.monthBeginDate).format('YYYY-MM-DD')}~${dayjs(bill.monthEndDate).format('YYYY-MM-DD')} 预付费:${Number(bill.prepayment || 0).toFixed(2)}`).concat(`预付费使用合计: ${Number((item.tenantBillList || []).reduce((sum, bill) => sum + Number(bill.prepayment || 0), 0)).toFixed(2)}`).join('\n'),
            ]);
            exportDataToExcel([
                headers.map(header => ({ v: header, t: 's' })),
                ...data.map((row: (string | number)[]) => row.map((value: string | number) => ({ v: value, t: typeof value === 'number' ? 'n' : 's' }))),
            ]);
        });
    };

    const columns = [
        { title: '租户', dataIndex: 'tenant_name', key: 'tenant_name' },
        { title: '手机号', dataIndex: 'tenant_phone', key: 'tenant_phone' },
        { title: '合同编号', dataIndex: 'identifier', key: 'identifier', width: '300px' },
        {
            title: '单元',
            dataIndex: 'unitList',
            key: 'unitList',
            width: '300px',
            render: (unitList: TypeTenantBill['unitList']) => unitList?.map(item => item.unit_name).join(', ') || '',
        },
        {
            title: '预付费(元)',
            dataIndex: 'prepayment',
            key: 'prepayment',
            render: (value: number) => Number(value || 0).toFixed(2),
        },
        {
            title: '未使用预付费(元)',
            dataIndex: 'unusedPrepayment',
            key: 'unusedPrepayment',
            render: (value: number) => Number(value || 0).toFixed(2),
        },
        {
            title: '账单明细',
            dataIndex: 'tenantBillList',
            key: 'tenantBillList',
            width: '400px',
            render: (billList: TenantBillList[]) => (
                <div style={{ minWidth: '720px', whiteSpace: 'normal' }}>
                    {(billList || []).map((bill, index) => (
                        <div key={bill.id || index} style={{ padding: '4px 0', borderBottom: index < billList.length - 1 ? '1px solid #f0f0f0' : undefined }}>
                            {dayjs(bill.monthBeginDate).format('YYYY-MM-DD')} ~ {dayjs(bill.monthEndDate).format('YYYY-MM-DD')}
                            {/* {' | 租金 '}{Number(bill.rent || 0).toFixed(2)}元
                            {' | 免租天数 '}{Number(bill.rentFreeDay || 0).toFixed(2)}天
                            {' | 管理费 '}{Number(bill.manageFee || 0).toFixed(2)}元
                            {' | 应交租金 '}{Number(bill.payRent || 0).toFixed(2)}元 */}
                            {' | 预付费 '}{Number(bill.prepayment || 0).toFixed(2)}元
                            {/* {' | 当月账单 '}{Number((bill.payRent || 0) + (bill.manageFee || 0) - (bill.prepayment || 0)).toFixed(2)}元 */}
                        </div>
                    ))}
                    <div style={{ padding: '4px 0', fontWeight: 'bold' }}>
                        预付费使用合计: {Number((billList || []).reduce((sum, bill) => sum + Number(bill.prepayment || 0), 0)).toFixed(2)}元
                    </div>
                </div>
            ),
        },
    ];

    const currentList: TypeTenantBill[] = props.PrepaymentReportFormsList || [];
    const visibleList = currentList.slice((page - 1) * pageSize, page * pageSize);
    const prepaymentSum = visibleList.reduce((sum, item) => sum + Number(item.prepayment || 0), 0);
    const unusedPrepaymentSum = visibleList.reduce((sum, item) => sum + Number(item.unusedPrepayment || 0), 0);

    return (
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input addonBefore="租户姓名:" onChange={changeName} value={name} />
                        <Input addonBefore="联系方式:" onChange={changePhone} value={phone} />
                        <Button type="primary" onClick={search}>搜索</Button>
                        <Button type="primary" onClick={exportToExcel}>导出</Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={record => record.id ?? record.contractId}
                pagination={false}
                size="small"
                scroll={{ y: '55vh', x: 1400 }}
                dataSource={visibleList}
                rowClassName={(_, index) => index % 2 === 1 ? 'tbodd' : 'tbeven'}
                summary={() => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}>统计</Table.Summary.Cell>
                            <Table.Summary.Cell index={1} />
                            <Table.Summary.Cell index={2} />
                            <Table.Summary.Cell index={3} />
                            <Table.Summary.Cell index={4}>{prepaymentSum.toFixed(2)}元</Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>{unusedPrepaymentSum.toFixed(2)}元</Table.Summary.Cell>
                            <Table.Summary.Cell index={6} />
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.PrepaymentReportFormsCount ? (
                <Pagination
                    total={currentList.length}
                    showSizeChanger
                    pageSize={pageSize}
                    current={page}
                    onChange={onChange}
                    pageSizeOptions={[50, 100, 500, 1000, 10000]}
                />
            ) : ''}
        </Spin>
    );
};

const mapStateToProps = (state: any) => ({
    PrepaymentReportFormsList: state.PrepaymentReportForms.list,
    PrepaymentReportFormsCount: state.PrepaymentReportForms.count,
});

export default connect(mapStateToProps)(PrepaymentReportForms);