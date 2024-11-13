import {Button, Space,Tabs} from "antd";
import CompanyList from "@/pages/financeManage/companyList";
import ProjectList from "@/pages/financeManage/projectList";
import AccountList from "@/pages/financeManage/accountList";
import SubjectList from "@/pages/financeManage/subjectList";
import {useState} from "react";
const List=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('activeTabKey') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('activeTabKey', key); 
    };
    return(
        <div>
          <Tabs  activeKey={activeKey} onChange={onChange}>
              <Tabs.TabPane tab="公司列表" key="1">
                  <CompanyList/>
              </Tabs.TabPane>
              <Tabs.TabPane tab="项目列表" key="2">
                  <ProjectList/>
              </Tabs.TabPane>
              <Tabs.TabPane tab="账户列表" key="3">
                  <AccountList/>
              </Tabs.TabPane>
              <Tabs.TabPane tab="科目列表" key="4">
                  <SubjectList/>
              </Tabs.TabPane>
          </Tabs>
        </div>
    )
}
export default List