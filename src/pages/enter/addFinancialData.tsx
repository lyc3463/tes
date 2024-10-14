import {Button, DatePicker, Form, Input, InputNumber, message, Radio, Select} from "antd";
import {useEffect, useState} from "react";
import {connect,history} from "umi";
import {filterAndUpdateList} from "@/utils/OpenTool";
import * as AccountService from '@/services/account';
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddFinancialData=(props:any)=>{
    const [form] = Form.useForm();
    // 科目列表
    const [subjectList,setSubjectList]=useState([]);
    // 账户列表
    const [accountList,setAccountList]=useState([]);
    // 公司列表
    const [companList,setCompanList]=useState([]);
    // 项目列表
    const [projectList,setProjectList]=useState([]);
    // 日期选择
    const [billDate,setBillDate]=useState('');
    // 公司ID
    const [company_id,setCompany_id]=useState();
    // 项目ID
    const [project_id,setProject_id]=useState();
    // 1公账，0私账
    const [accountType,setAccountType]=useState(0);
    const onFinish=async (values)=>{
        let res=await props.dispatch({
            type:'Bill/add',
            payload:{...values,billDate,company_id,project_id,accountType}
        });
        if (res.ErrorCode==0){
            history.push('/enter/financialData');
            message.success('添加成功');
        }else {
            message.error(res.Data);
        }
    };
    useEffect(() => {
        filterAndUpdateList(props.SubjectList, 'subject_name', 'id', setSubjectList);
        filterAndUpdateList(props.AccountList, 'account_name', 'id', setAccountList);
        filterAndUpdateList(props.CompanList, 'company_name', 'id', setCompanList);
        filterAndUpdateList(props.ProjectList, 'project_name', 'id', setProjectList);
    }, []);

    // 日期选择
    const changeData=(_,item)=>{
        setBillDate(item)
    };
    // 监听下拉账号
    const changeAccount=(e)=>{
        AccountService.one(e).then((res:any)=>{
            console.log(res)
            setCompany_id(res.Data.company_id);
            setProject_id(res.Data.project_id);
            setAccountType(res.Data.account_type);
        })
    };
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='摘要' name='billAbstract'>
                    <Input.TextArea/>
                </Form.Item>
                <Form.Item label='编号' name='number'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='账户' name='account_id'>
                    <Select onChange={changeAccount} >
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
                    <Radio.Group value={accountType}>
                        <Radio value={0}>公账</Radio>
                        <Radio value={1}>私账</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='账户收入/支出' name='money_type'>
                    <Radio.Group>
                        <Radio value={1}>支出</Radio>
                        <Radio value={0}>收入</Radio>
                    </Radio.Group>
                </Form.Item>
                  <Form.Item label='金额(元)' name='billMoney'>
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
                <Form.Item label='选择日期'>
                    <DatePicker onChange={changeData}/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        添加
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
export default connect(mapStateToProps) (AddFinancialData)