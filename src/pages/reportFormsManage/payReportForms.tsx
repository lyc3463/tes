import {connect} from "umi";
import {Tabs} from "antd";
import UserPayReportForms from "@/pages/reportFormsManage/userPayReportForms";
import AppUserPayReportForms from "@/pages/reportFormsManage/appUserPayReportForms";


const PayReportForms=(props)=>{
    return(
        <Tabs>
            <Tabs.TabPane tab='租户报表'  key='1'>
                <UserPayReportForms/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='用户报表'  key='2'>
                <AppUserPayReportForms/>
            </Tabs.TabPane>
        </Tabs>
    )
}

export default connect() (PayReportForms)