import {connect} from "umi";
import {useState} from "react";
import {Tabs} from "antd";
import ZsContract from "@/pages/enter/zsContract";
import DjContract from "@/pages/enter/DjContract";
import PermissionLog from "@/pages/logManage/permissionLog";
import EditMagnification from "@/pages/logManage/editMagnification";
const LogQuery=(props)=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('log1') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('log1', key);
    };
    return(
        <>
            <Tabs activeKey={activeKey} onChange={onChange}>
                <Tabs.TabPane tab='修改权限'  key='1'>
                    <PermissionLog/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='修改电表倍率'  key='2'>
                    <EditMagnification/>
                </Tabs.TabPane>
            </Tabs>
        </>
    )
}

export default connect() (LogQuery)