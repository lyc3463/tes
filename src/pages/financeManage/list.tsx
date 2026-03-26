import {Button, Space,Tabs} from "antd";
import CompanyList from "@/pages/financeManage/companyList";
import ProjectList from "@/pages/financeManage/projectList";
import AccountList from "@/pages/financeManage/accountList";
import SubjectList from "@/pages/financeManage/subjectList";
import {useEffect, useState} from "react";
import {StaticInfo} from "@/StaticInfo";
import Supplier from "@/pages/warehouse/supplier";
import ProcessConfiguration from "@/pages/financeManage/processConfiguration";
const List=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('financeManageList') || '1');
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('financeManageList', key);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    return(
        <div>
          <Tabs activeKey={activeKey} onChange={onChange}>
              {uqx[145]=='1'?
                  <Tabs.TabPane tab="公司列表" key="1">
                      <CompanyList/>
                  </Tabs.TabPane>
                  :''}
              {uqx[149]=='1'?
                  <Tabs.TabPane tab="项目列表" key="2">
                      <ProjectList/>
                  </Tabs.TabPane>
                  :''}
              {uqx[157]=='1'?
                  <Tabs.TabPane tab="账户列表" key="3">
                      <AccountList/>
                  </Tabs.TabPane>
                  :''}
              {uqx[161]=='1'?
                  <Tabs.TabPane tab="科目列表" key="4">
                      <SubjectList/>
                  </Tabs.TabPane>
                  :''}
              <Tabs.TabPane tab="供应商列表" key="5">
                  <Supplier/>
              </Tabs.TabPane>
              <Tabs.TabPane tab="流程配置" key="6">
                  <ProcessConfiguration/>
              </Tabs.TabPane>
          </Tabs>
        </div>
    )
}
export default List