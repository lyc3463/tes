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
import {checkSessionStorage, filterAndUpdateList, updateSessionStorage} from "@/utils/OpenTool";

const Yinghangka=(props:any)=>{
    const [form] = Form.useForm();
    const [isOpen,setOpen]=useState(false);
    const [accountList,setAccountList]=useState([]);
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/billLog/yinghangka/','startDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/billLog/yinghangka/','endDate')||'2099-01-01');
    // 对账人
    const [name,setName]=useState(checkSessionStorage('/billLog/yinghangka/','name')||'');
    const columns =[
        {
            title: '日期',
            dataIndex: 'created',
            key: 'created',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.created).format('YYYY-MM-DD HH:mm:ss')}
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
                        <span style={{color:'red'}}>{(record.accountBalance-record.reconBalance).toFixed(3)}</span><span>元</span>
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
    const getAccountList=()=>{
        props.dispatch({
            type:'Account/fetch',
        }).then((res)=>{
            if (res.ErrorCode==0){
                console.log('获取的参数',res)
                setAccountList(res.Data);
            }else {
                message.error(res.Data)
            }
        })
    }
    useEffect(() => {
        getAccountList();
    }, []);

    // 监听页数
    const onChange=(page,pageSize)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/billLog/yinghangka/','startDate','2000-01-01');
            updateSessionStorage('/billLog/yinghangka/','endDate','2099-01-01');

        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/billLog/yinghangka/','startDate',data[0]);
            updateSessionStorage('/billLog/yinghangka/','endDate',data[1]);
        }
    };
    const suosou=()=>{
        setPage(1);
        fenyeInfo();
        logFenye();
    };
    const fenyeInfo=()=>{
        props.dispatch({
            type:'Duizhang/fenye',
            payload:{name,startDate,endDate,pageSize}
        })
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Duizhang/fetch",
            payload:{page,name,startDate,endDate,pageSize}
        })
    };
    const AccountList=()=>{
        props.dispatch({
            type:"Account/fetch",
        })
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/billLog/yinghangka/','name',e.target.value);
    };
    useEffect(() => {
        fenyeInfo();
        AccountList();
    }, []);
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type='primary' onClick={()=>setOpen(true)}>对账</Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="账户名称:"
                            onChange={changeName}
                            value={name}
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
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
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
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            {/*添加对账弹窗*/}
            <Modal onCancel={()=>setOpen(false)} open={isOpen}  title={'对账金额'} footer={null}>
                <Form
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    onFinish={onFinisn}
                >
                    <Form.Item label='选择账户' name='accountId'>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                                // 假设每个 option 都有一个与数据项对应的 value 属性
                                const item = accountList.find(unit => unit.id == option.value);
                                return item?.account_name?.toLowerCase().includes(input.toLowerCase());
                            }}
                        >
                            {accountList.map((item:any,index:any)=>{
                                return(
                                    <Select.Option value={item.id} key={index}>
                                        {item.account_name}
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