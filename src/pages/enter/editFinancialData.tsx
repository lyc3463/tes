import {connect, history,useNavigate} from "umi";
import {useEffect, useRef, useState} from "react";
import * as BillService from "@/services/bill";
import {Button, DatePicker, Form, Input, InputNumber, message, Radio, Select, Space, Spin} from "antd";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as AccountService from "@/services/account";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditFinancialData=(props:any)=>{
    const navigate=useNavigate();
    const formRef=useRef();
    // 账户列表
    const [accountList,setAccountList]=useState([]);
    const [companyList,setCompanyList]=useState([]);
    const [subjList,setSubjList]=useState([]);
    const [projectlist,setProjectlist]=useState([]);
    // 日期
    const [billDate,setBillDate]=useState('');
    const [uid,setUid]=useState('');
    // 公司ID
    const [company_id,setCompany_id]=useState();
    // 项目ID
    const [project_id,setProject_id]=useState();
    // 1公账，0私账
    const [accountType,setAccountType]=useState(0);
    // 账号银行号
    const [ccount_card,setAccount_card]=useState(0);
    const [spinning,setspinning]=useState(false);
    // 账单状态
    const bill_status=0;
    // 科目名字
    const [subjectName,setsubjectName]=useState('');
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getOneBill(id);
        setUid(id);
        getCompanList();
        getProjectList();
        getSubjectList();
        getAccountList();
    }, []);
    const getOneBill=async (id:string)=>{
        let res:any=await  BillService.one(id);
        if (res.ErrorCode==0){
            formRef.current.setFieldsValue(res.Data);
            setBillDate(dayjs(res.Data.billDate).format('YYYY-MM-DD'));
            setCompany_id(res.Data.company_id);
            setProject_id(res.Data.project_id);
            changeAccount(res.Data.account_id);
        }else {
            message.error(res.Data);
        }
    };
    const onFinish=(values:any)=>{
        setspinning(true);
        props.dispatch({
            type:'Bill/edit',
            payload:{...values,uid,billDate,bill_status,company_id,project_id,accountType}
        }).then((res)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                message.success('修改成功');
                history.push('/enter/financialData')
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    const changeData=(_:any,item:any)=>{
        setBillDate(item)
    };
    // 监听下拉账号
    const changeAccount=(e)=>{
        AccountService.one(e).then((res:any)=>{
            setCompany_id(res.Data.company_id);
            setProject_id(res.Data.project_id);
            setAccountType(res.Data.account_type);
            setAccount_card(res.Data.account_card);
        })
    };
    const onSearchSbjValue=(value:string)=>{
        setsubjectName(value);
    };
    // 获取公司列表
    const getCompanList=()=>{
        props.dispatch({
            type:'Compan/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                conterCompay(res.Data)
            }else {
                conterCompay([])
            }
        })
    };
    // 获取项目列表
    const getProjectList=()=>{
        props.dispatch({
            type:'Project/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('账户列表',res)
                conterproject(res.Data);
            }else {
                conterproject([]);
            }
        });
    };
    // 获取账户列表
    const getAccountList=()=>{
        props.dispatch({
            type:'Account/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                conterAccount(res.Data);
            }else {
                conterAccount([]);
            }
        });
    };
    // 获取科目列表
    const getSubjectList=()=>{
        props.dispatch({
            type:'Subject/fetch',
            payload:{name:subjectName}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                contersubj(res.Data);
            }else {
                contersubj([]);
            }
        });
    };
    // 公司拼接
    const conterCompay=(item)=>{
        let newarr=item.map((item:any)=>{
            return {
                label:item.company_name,
                value:item.id
            }
        });
        setCompanyList(newarr);
    };
    // 账户拼接
    const conterAccount=(item)=>{
        let newarr=item.map((item:any)=>{
            return {
                label:item.account_name,
                value:item.id
            }
        });
        setAccountList(newarr);
    };
    // 项目拼接
    const conterproject=(item)=>{
        let newarr=item.map((item:any)=>{
            return {
                label:item.project_name,
                value:item.id
            }
        });
        setProjectlist(newarr);
    };
    // 科目拼接
    const contersubj=(item)=>{
        let newarr=item.map((item:any)=>{
            return {
                label:item.subject_name,
                value:item.id
            }
        });
        setSubjList(newarr);
    };
    return(
        <Spin spinning={spinning}>
            <div style={{display:'flex',justifyContent:'space-around'}}>
                <Form
                    // labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    size={'large'}
                    ref={formRef}
                    initialValues={{number:''}}
                    onFinish={onFinish}
                    style={{ marginTop: '1rem' }}
                >
                    <Space style={{display:'flex',margin:'20px'}}>
                        <Form.Item label='账户' name='account_id'>
                            <Select
                                onChange={changeAccount}
                                style={{width:'250px'}}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    // 假设每个 option 都有一个与数据项对应的 value 属性
                                    const item = accountList.find(unit => unit.value == option.value); // 您可能需要优化这个查找过程
                                    return item?.label?.toLowerCase().includes(input.toLowerCase());
                                }}
                            >
                                {accountList.map((item:any,index:any)=>{
                                    return(
                                        <Select.Option value={item.value} key={index}>
                                            {item.label}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label='账户类型'>
                            <Radio.Group value={accountType} style={{display:'flex'}}>
                                <Radio value={1} style={{width:'80px'}}>公账</Radio>
                                <Radio value={0} style={{width:'80px'}}>私账</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label='金额(元)' name='billMoney'>
                            <Input/>
                        </Form.Item>
                        <Form.Item label='账户收入/支出' name='money_type'>
                            <Radio.Group>
                                <Radio value={1}>支出</Radio>
                                <Radio value={0}>收入</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Space>
                    <Space style={{display:'flex',margin:'20px'}}>
                        <Form.Item label='账户名'>
                            <Input style={{width:'200px'}} value={ccount_card} disabled/>
                        </Form.Item>
                        <Form.Item label='选择项目' name='project_id'>
                            <Select value={project_id} disabled style={{width:'10vw'}}>
                                {projectlist.map((item:any,index:any)=>{
                                    return(
                                        <Select.Option value={item.value} key={index}>
                                            {item.label}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label='选择公司' name='company_id'>
                            <Select value={company_id} disabled style={{width:'23vw'}}>
                                {companyList.map((item:any,index:any)=>{
                                    return(
                                        <Select.Option value={item.value} key={index}>
                                            {item.label}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    </Space>
                    <Space style={{display:'flex',margin:'20px'}}>
                        <Form.Item label='选择科目' name='subject_id'>
                            <Select showSearch
                                    style={{width:'23vw'}}
                                    optionFilterProp="children"
                                    onSearch={(value) => {
                                        onSearchSbjValue(value)
                                    }}
                                    filterOption={(input, option) =>
                                        (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                            >
                                {subjList.map((item:any,index:any)=>{
                                    return(
                                        <Select.Option value={item.value} key={index}>
                                            {item.label}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label='编号' name='number'>
                            <Input style={{width:'10vw'}}/>
                        </Form.Item>
                        <Form.Item label='选择日期'>
                            <DatePicker onChange={changeData} style={{width:'10vw'}} value={dayjs(billDate)}/>
                        </Form.Item>
                    </Space>
                    <Form.Item label='摘要' name='billAbstract' >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                修改
                            </Button>
                            <Button type="primary" onClick={()=>navigate(-1)}>
                                返回
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        SubjectList: state.Subject.list,
        AccountList: state.Account.list,
        CompanList: state.Compan.list,
        ProjectList: state.Project.list,
    }
};
export default connect(mapStateToProps) (EditFinancialData)