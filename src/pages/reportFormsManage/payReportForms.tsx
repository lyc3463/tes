import {connect} from "umi";
import {useState,useEffect} from "react";
import {Button, DatePicker, Form, Input, InputNumber, List, Modal, Pagination, Select, Space, Table} from "antd";

const PayReportForms=(props)=>{
    const [page,setPage]=useState(1);
    const [phone,setPhone]=useState('');
    const [name,setName]=useState('');
    const [type,setType]=useState(0);
    const columns =[
        {
            title: '小程序姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '联系方式',
            dataIndex: 'item_name',
            key: 'item_name',
        },
        {
            title: '缴费类型',
            dataIndex: 'item_name',
            key: 'item_name',
        },
        {
            title: '缴费金额',
            dataIndex: 'item_name',
            key: 'item_name',
        },
        {
            title: '小程序用户金钱余额',
            dataIndex: 'item_name',
            key: 'item_name',
        },
        {
            title: '小程序用户积分余额',
            dataIndex: 'item_name',
            key: 'item_name',
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render: (text:any, record:any) => {

            }
        },
    ];
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"PayReportForms/fetch",
            payload:{page,name,phone,type}
        })
    };
    const sousuo=()=>{
        setPage(1);
        props.dispatch({
            type:'PayReportForms/fenye',
            dispatch:{name,phone,type}
        });
        logFenye();
    };
    const onChange=(e)=>{
        setPage(e)
    };
    useEffect(() => {
        logFenye()
    }, [page]);
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="租户姓名:"
                            onChange={(e)=>setName(e.target.value)}
                        />
                        <Input
                            addonBefore="联系方式:"
                            onChange={(e)=>setPhone(e.target.value)}
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
                                    flexWrap:'wrap',
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                }}
                            >
                                日期:
                            </div>
                            <DatePicker.RangePicker/>
                        </Space.Compact>
                        <Space.Compact>
                            <div
                                style={{
                                    borderRadius: '6px',
                                    borderStartEndRadius: 0,
                                    borderEndEndRadius: 0,
                                    padding: '0 11px',
                                    border: '1px solid #d9d9d9',
                                    display: 'flex',
                                    flexWrap:'wrap',
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                }}
                            >
                                缴费类型:
                            </div>
                            <Select
                                defaultValue={type}
                                onChange={(e)=>setType(e)}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:1, label: '充值' },
                                    { value:2, label: '租金' },
                                    { value:3, label: '电费' },
                                    { value:4, label: '水费' },
                                    { value:5, label: '公共缴费' },
                                    { value:6, label: '违约金' },
                                    { value:7, label: '物业管理费' },
                                    { value:8, label: '积分' },
                                ]}
                            />
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                size='small'
                dataSource={props.PayReportFormsList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        PayReportFormsList: state.PayReportForms.list,
        count: state.PayReportForms.count,
    }
};
export default connect(mapStateToProps) (PayReportForms)