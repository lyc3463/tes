import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Table,
    Tag
} from "antd";
import dayjs from "dayjs";
import {connect} from "umi";
import {useEffect, useState} from "react";
import {filterAndUpdateList} from "@/utils/OpenTool";

const Yinghangka=(props:any)=>{
    const [form] = Form.useForm();
    const [isOpen,setOpen]=useState(false);
    const [accountList,setAccountList]=useState([]);
    // 当前页数
    const [page,setPage]=useState(1);
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    // 对账人
    const [name,setName]=useState('');
    const columns =[
        {
            title: '日期',
            dataIndex: 'billDate',
            key: 'billDate',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.billDate).format('YYYY-MM-DD')}
                    </div>
                )
            }
        },
        {
            title: '账户',
            dataIndex: 'account_name',
            key: 'account_name',
        },
        {
            title: '账户类型',
            dataIndex: 'account_type',
            key: 'account_type',
            render:(text:any,record:any)=>{
                return(
                    <div>{record.account_type==1? <div>公账</div>: <div>私账</div>}</div>
                )
            }
        },
        {
            title: '对账金额',
            dataIndex: 'accountBalance',
            key: 'accountBalance',
        },
        {
            title: '账单余额',
            dataIndex: 'reconBalance',
            key: 'reconBalance',
        },
        {
            title: '差异',
            dataIndex: 'reconBalance',
            key: 'reconBalance',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        <span style={{color:'red'}}>{record.accountBalance-record.reconBalance}</span><span>元</span>
                    </div>
                )
            }
        },
        {
            title: '对账人',
            dataIndex: 'userName',
            key: 'userName',
        },
    ];
    // 添加对账确定按钮
    const onFinisn=(values)=>{
        props.dispatch({
            type:'Duizhang/add',
            payload:values
        }).then((res)=>{
            if (res.ErrorCode==0){
                setOpen(false);
                message.success('添加成功')
            }else {
                message.error(res.Data)
            }
        });

    };
    useEffect(() => {
        filterAndUpdateList(props.AccountList, 'account_name', 'id', setAccountList);
    }, []);

    // 监听页数
    const onChange=(page)=>{
        setPage(page);
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };
    const suosou=()=>{
        setPage(1);
        props.dispatch({
            type:'Duizhang/fenye',
            payload:{name,startDate,endDate}
        })
        logFenye();
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Duizhang/fetch",
            payload:{page,name,startDate,endDate}
        })
    };
    useEffect(() => {
        console.log(props);
        logFenye();
    }, [page]);
    const changeName=(e)=>{
      setName(e.target.value);
    };
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type='primary' onClick={()=>setOpen(true)}>对账</Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="账户:"
                            onChange={changeName}
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
                                时间:
                            </div>
                            <DatePicker.RangePicker onChange={changeDate}/>
                        </Space.Compact>
                        <Button type="primary" onClick={suosou}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                dataSource={props.DuizhangList}
                rowKey={(columns) => columns.id}
            />
            {props.count?<Pagination total={props.count.count} pageSize={1} current={page}  onChange={onChange} pageSizeOptions={[1]}/>:''}
            {/*添加对账弹窗*/}
            <Modal onCancel={()=>setOpen(false)} open={isOpen}  title={'对账金额'} footer={null}>
                <Form
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    onFinish={onFinisn}
                >
                    <Form.Item label='选择账户' name='accountId'>
                        <Select>
                            {accountList.map((item:any,index:any)=>{
                                return(
                                    <Select.Option value={item.value} key={index}>
                                        {item.label}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item label='对账金额(元)' name='reconBalance'>
                        <InputNumber/>
                    </Form.Item>
                    <Button type="primary"  htmlType="submit">
                        添加
                    </Button>
                </Form>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        AccountList: state.Account.list,
        DuizhangList: state.Duizhang.list,
        count: state.Duizhang.count,
    }
};
export default connect(mapStateToProps) (Yinghangka)