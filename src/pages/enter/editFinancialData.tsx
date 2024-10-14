import {connect, history} from "umi";
import {useEffect, useRef, useState} from "react";
import {filterAndUpdateList} from "@/utils/OpenTool";
import * as BillService from "@/services/bill";
import {Button, DatePicker, Form, Input, InputNumber, message, Radio, Select} from "antd";
import moment from "moment";
import dayjs from "dayjs";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditFinancialData=(props:any)=>{
    const formRef=useRef();
    // 科目列表
    const [subjectList,setSubjectList]=useState([]);
    // 账户列表
    const [accountList,setAccountList]=useState([]);
    // 公司列表
    const [companList,setCompanList]=useState([]);
    // 项目列表
    const [projectList,setProjectList]=useState([]);
    // 日期
    const [billDate,setBillDate]=useState('');
    const [uid,setUid]=useState('');
    // 公司ID
    const [company_id,setCompany_id]=useState();
    // 项目ID
    const [project_id,setProject_id]=useState();
    // 1公账，0私账
    const [accountType,setAccountType]=useState(0);
    // 账单状态
    const bill_status=0;

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getOneBill(id);
        setUid(id);
        filterAndUpdateList(props.SubjectList, 'subject_name', 'id', setSubjectList);
        filterAndUpdateList(props.AccountList, 'account_name', 'id', setAccountList);
        filterAndUpdateList(props.CompanList, 'company_name', 'id', setCompanList);
        filterAndUpdateList(props.ProjectList, 'project_name', 'id', setProjectList);
    }, []);
    const getOneBill=async (id:string)=>{
        let res:any=await  BillService.one(id);
        if (res.ErrorCode==0){
            console.log(res)
            formRef.current.setFieldsValue(res.Data);
            setBillDate(dayjs(res.Data.billDate).format('YYYY-MM-DD'));
            setCompany_id(res.Data.company_id);
            setProject_id(res.Data.project_id);
        }
    };
    const onFinish=(values:any)=>{
        props.dispatch({
            type:'Bill/edit',
            payload:{...values,uid,billDate,bill_status,company_id,project_id,accountType}
        }).then((res)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                history.push('/enter/financialData')
            }else {
                message.error(res.Data)
            }
        })
    };
    const changeData=(_:any,item:any)=>{
        setBillDate(item)
    };
    // 监听账号
    const changeAccount=(e)=>{
        console.log(e)
    };
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                size={'large'}
                ref={formRef}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='摘要' name='billAbstract'>
                    <Input.TextArea/>
                </Form.Item>
                <Form.Item label='编号' name='number'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='账户类型'>
                    <Radio.Group value={accountType}>
                        <Radio value={0}>公账</Radio>
                        <Radio value={1}>私账</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='账户' name='account_id'>
                    <Select onChange={changeAccount}>
                        {accountList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='账户收入/支出' name='money_type'>
                    <Radio.Group>
                        <Radio value={1}>支出</Radio>
                        <Radio value={0}>收入</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='金额' name='billMoney'>
                    <Input/>
                </Form.Item>
                <Form.Item label='选择公司'>
                    <Select value={company_id}>
                        {companList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='选择项目'>
                    <Select value={project_id}>
                        {projectList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='选择科目' name='subject_id'>
                    <Select>
                        {subjectList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='日期'>
                    {
                        billDate?<DatePicker onChange={changeData} defaultValue={dayjs(billDate)}/>:''
                    }
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        编辑
                    </Button>
                </Form.Item>
            </Form>
        </div>
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