import {Button, Form, Input, Select, Upload, DatePicker, List, Space, Table} from "antd";
import {UploadOutlined} from "@ant-design/icons";

const AccessControlPurview=()=>{
    const columns=[
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '创建时间',
            dataIndex: 'id',
        },
        {
            title: '到期时间',
            dataIndex: 'id',
        },
        {
            title: '姓名',
            dataIndex: 'id',
        },
        {
            title: '呢称',
            dataIndex: 'id',
        },
        {
            title: '人脸',
            dataIndex: 'id',
        },
        {
            title: '操作',
            dataIndex: 'id',
        },
    ]
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="员工名称:"
                        />
                        <Button type="primary" >
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}

                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {/*<Form>*/}
            {/*    <Form.Item label='登记日期'>*/}
            {/*        <DatePicker.RangePicker/>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item label='员工名称'>*/}
            {/*        <Input placeholder='访客职位'/>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item label='头像'>*/}
            {/*        <Upload*/}
            {/*            name="file"*/}
            {/*            listType="picture-card"*/}
            {/*            className="avatar-uploader"*/}
            {/*            showUploadList={false}*/}
            {/*            beforeUpload={beforeUpload}*/}
            {/*        >*/}
            {/*            <Button>上传头像</Button>*/}
            {/*        </Upload>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item label='选择单元'>*/}
            {/*        <Select/>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item label='选择房屋'>*/}
            {/*        <Select/>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item label='员工联系方式'>*/}
            {/*        <Input placeholder='员工联系方式'/>*/}
            {/*    </Form.Item>*/}
            {/*</Form>*/}

        </div>
    )
}
export default AccessControlPurview