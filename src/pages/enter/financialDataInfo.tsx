import {Button, DatePicker, Form, Input, Radio, Select} from "antd";
import {connect} from "umi";
import {useEffect, useRef, useState} from "react";
import {filterAndUpdateList} from "@/utils/OpenTool";
import * as BillService from '@/services/bill';
import dayjs from "dayjs";


const FinancialDataInfo=(props:any)=>{
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
    const [billDate,setBillDate]=useState('')
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getOneBill(id);
        filterAndUpdateList(props.SubjectList, 'subject_name', 'id', setSubjectList);
        filterAndUpdateList(props.AccountList, 'account_name', 'id', setAccountList);
        filterAndUpdateList(props.CompanList, 'company_name', 'id', setCompanList);
        filterAndUpdateList(props.ProjectList, 'project_name', 'id', setProjectList);
    }, []);
    const getOneBill=async (id:string)=>{
        let res=await  BillService.one(id);
        if (res?.ErrorCode==0){
            formRef.current.setFieldsValue(res.Data);
            setBillDate(res.Data.billDate)
        }
    };
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                size={'large'}
                ref={formRef}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='摘要' name='billAbstract'>
                    <Input.TextArea/>
                </Form.Item>
                <Form.Item label='编号' name='number'>
                    <Input/>
                </Form.Item>
                {/*<Form.Item label='账户类型'>*/}
                {/*    <Radio.Group defaultValue={1}>*/}
                {/*        <Radio value={1}>公账</Radio>*/}
                {/*        <Radio value={2}>私账</Radio>*/}
                {/*    </Radio.Group>*/}
                {/*</Form.Item>*/}
                <Form.Item label='账户' name='account_id'>
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
                <Form.Item label='账户收入/支出' name='money_type'>
                    <Radio.Group>
                        <Radio value={1}>支出</Radio>
                        <Radio value={0}>收入</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='金额' name='billMoney'>
                    <Input/>
                </Form.Item>
                <Form.Item label='选择公司' name='company_id'>
                    <Select>
                        {companList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='选择项目' name='project_id'>
                    <Select>
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
                        billDate?<DatePicker  defaultValue={dayjs(billDate)}/>:''
                    }
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
export default connect(mapStateToProps) (FinancialDataInfo)