import { connect } from 'umi';
import { Button, DatePicker, Input, List, message, Pagination, Space, Spin, Table } from 'antd';
import dayjs from 'dayjs';
import { checkSessionStorage, exportDataToExcel, updateSessionStorage } from '@/utils/OpenTool';
import * as PrepaymentReportFormsService from '@/services/prepaymentReportForms';
import TypeErrorCode from '@/ModelTypes/TypeErrorCode';
import TypeTenantBill from '@/ModelTypes/TypeTenantBill';
import { useEffect, useState } from 'react';

const PrepaymentReportForms = (props:any) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [spinning, setSpinning] = useState(false);
    const [phone, setPhone] = useState(checkSessionStorage('/reportFormsManage/payReportForms/', 'prepaymentPhone') || '');
    const [name, setName] = useState(checkSessionStorage('/reportFormsManage/payReportForms/', 'prepaymentName') || '');
    const [startDate, setStartDate] = useState(checkSessionStorage('/reportFormsManage/payReportForms/', 'prepaymentStartDate') || '2000-01-01');
    const [endDate, setEndDate] = useState(checkSessionStorage('/reportFormsManage/payReportForms/', 'prepaymentEndDate') || '2099-01-01');

    const getParams = (targetPage = page, targetPageSize = pageSize) => ({
        page: targetPage,
        pageSize: targetPageSize,
        name,
        phone,
        startDate,
        endDate: dayjs(endDate).add(1, 'day').format('YYYY-MM-DD'),
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

    const changeDate = (_: any, dates: string[]) => {
        const [nextStartDate, nextEndDate] = dates;
        if (!nextStartDate && !nextEndDate) {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/reportFormsManage/payReportForms/', 'prepaymentStartDate', '2000-01-01');
            updateSessionStorage('/reportFormsManage/payReportForms/', 'prepaymentEndDate', '2099-01-01');
            return;
        }
        setStartDate(nextStartDate);
        setEndDate(nextEndDate);
        updateSessionStorage('/reportFormsManage/payReportForms/', 'prepaymentStartDate', nextStartDate);
        updateSessionStorage('/reportFormsManage/payReportForms/', 'prepaymentEndDate', nextEndDate);
    };

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
            const headers = ['单元', '租户', '手机号', '账单开始时间', '账单结束时间', '租金(元)', '预付费(元)'];
            const data: (string | number)[][] = res.Data.data.map((item: TypeTenantBill) => [
                item.unitList?.map(unit => unit.unit_name).join(', ') || '',
                item.tenant_name,
                item.tenant_phone,
                dayjs(item.monthBeginDate).format('YYYY-MM-DD'),
                dayjs(item.monthEndDate).format('YYYY-MM-DD'),
                item.rent,
                item.prepayment,
            ]);
            exportDataToExcel([
                headers.map(header => ({ v: header, t: 's' })),
                ...data.map((row: (string | number)[]) => row.map((value: string | number) => ({ v: value, t: typeof value === 'number' ? 'n' : 's' }))),
            ]);
        });
    };

    const columns = [
        {
            title: '单元',
            dataIndex: 'unitList',
            key: 'unitList',
            render: (unitList: TypeTenantBill['unitList']) => unitList?.map(item => item.unit_name).join(', ') || '',
        },
        { title: '租户', dataIndex: 'tenant_name', key: 'tenant_name' },
        { title: '手机号', dataIndex: 'tenant_phone', key: 'tenant_phone' },
        {
            title: '账单开始时间',
            dataIndex: 'monthBeginDate',
            key: 'monthBeginDate',
            render: (value: string) => dayjs(value).format('YYYY-MM-DD'),
        },
        {
            title: '账单结束时间',
            dataIndex: 'monthEndDate',
            key: 'monthEndDate',
            render: (value: string) => dayjs(value).format('YYYY-MM-DD'),
        },
        {
            title: '租金(元)',
            dataIndex: 'rent',
            key: 'rent',
            render: (value: number) => Number(value || 0).toFixed(2),
        },
        {
            title: '预付费(元)',
            dataIndex: 'prepayment',
            key: 'prepayment',
            render: (value: number) => Number(value || 0).toFixed(2),
        },
    ];

    const currentList: TypeTenantBill[] = props.PrepaymentReportFormsList || [];
    const visibleList = currentList.slice((page - 1) * pageSize, page * pageSize);
    const rentSum = visibleList.reduce((sum, item) => sum + Number(item.rent || 0), 0);
    const prepaymentSum = visibleList.reduce((sum, item) => sum + Number(item.prepayment || 0), 0);

    return (
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input addonBefore="租户姓名:" onChange={changeName} value={name} />
                        <Input addonBefore="联系方式:" onChange={changePhone} value={phone} />
                        <Space.Compact>
                            <div style={{ borderRadius: '6px', borderStartEndRadius: 0, borderEndEndRadius: 0, padding: '0 11px', border: '1px solid #d9d9d9', display: 'flex', flexWrap: 'wrap', alignItems: 'center', borderInlineEnd: 0 }}>
                                日期:
                            </div>
                            <DatePicker.RangePicker onChange={changeDate} defaultValue={startDate == '2000-01-01' && endDate == '2099-01-01' ? undefined : [dayjs(startDate), dayjs(endDate)]} />
                        </Space.Compact>
                        <Button type="primary" onClick={search}>搜索</Button>
                        <Button type="primary" onClick={exportToExcel}>导出</Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={record => record.id}
                pagination={false}
                size="small"
                scroll={{ y: '55vh' }}
                dataSource={visibleList}
                rowClassName={(_, index) => index % 2 === 1 ? 'tbodd' : 'tbeven'}
                summary={() => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}>统计</Table.Summary.Cell>
                            <Table.Summary.Cell index={1} />
                            <Table.Summary.Cell index={2} />
                            <Table.Summary.Cell index={3} />
                            <Table.Summary.Cell index={4} />
                            <Table.Summary.Cell index={5}>{rentSum.toFixed(2)}元</Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>{prepaymentSum.toFixed(2)}元</Table.Summary.Cell>
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