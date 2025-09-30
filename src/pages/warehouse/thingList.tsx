import { Table, Tag, Space, Button } from 'antd';
import { useState } from 'react';

const ThingList = () => {

    // 表格列配置
    const columns = [
        {
            title: '所属仓库',
            dataIndex: 'location',
            ellipsis: true,
        },
        {
            title: '物件名称',
            dataIndex: 'name',
            ellipsis: true,
        },
        {
            title: '类别',
            dataIndex: 'category',
        },
        {
            title: '当前库存',
            dataIndex: 'stock',
            sorter: (a, b) => a.stock - b.stock,
            render: (stock) => (
                <span style={{ color: stock <= 0 ? 'red' : 'inherit' }}>
          {stock} {stock > 0 ? '件' : '（缺货）'}
        </span>
            ),
        },
        {
            title: '数量',
            dataIndex: 'unit',
        },
        {
            title: '单位',
            dataIndex: 'unit',
        },
        {
            title: '单价',
            dataIndex: 'price',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <Space size="small">

                </Space>
            ),
        },
    ];
    return (
        <div>
            <Table
                columns={columns}
                rowKey="id"
                size="small"
            />
        </div>
    );
};

export default ThingList;