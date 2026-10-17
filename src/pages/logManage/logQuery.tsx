import {connect} from "umi";
import {useEffect, useState} from "react";
import {Tabs} from "antd";
import ZsContract from "@/pages/enter/zsContract";
import DjContract from "@/pages/enter/DjContract";
import PermissionLog from "@/pages/logManage/permissionLog";
import EditMagnification from "@/pages/logManage/editMagnification";
import {StaticInfo} from "@/StaticInfo";
import CheckLog from "@/pages/logManage/checkLog";
import TenantLog from "@/pages/logManage/tenantLog";
import FinanceLog from "@/pages/logManage/financeLog";
const LogQuery=(props)=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('log1') || '1');
    const [uqx,setUqx]=useState([]);
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('log1', key);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    return(
        <>
            <Tabs activeKey={activeKey} onChange={onChange}>
                <Tabs.TabPane tab='修改权限'  key='1'>
                    <PermissionLog/>
                </Tabs.TabPane>
                {/* {uqx[391]=='1'?
                <Tabs.TabPane tab='修改电表倍率'  key='2'>
                    <EditMagnification/>
                </Tabs.TabPane>:""} */}
                {uqx[432]=='1'?
                    <Tabs.TabPane tab='审核日志'  key='3'>
                        <CheckLog/>
                    </Tabs.TabPane>:""}
                {/* <Tabs.TabPane tab='租户绑定日志'  key='4'>
                    <TenantLog/>
                </Tabs.TabPane> */}
                <Tabs.TabPane tab='财务日志'  key='5'>
                    <FinanceLog/>
                </Tabs.TabPane>
            </Tabs>
        </>
    )
}

export default connect() (LogQuery)