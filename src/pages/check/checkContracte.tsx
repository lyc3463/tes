import {
    Tabs,
} from "antd";
import {connect} from "umi";
import {useEffect, useState} from "react";

import {StaticInfo} from "@/StaticInfo";
import CheckZsContracte from "@/pages/check/checkZsContracte";
import CheckDjContracte from "@/pages/check/CheckDjContracte";

const CheckContracte=(props:any)=> {
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('activeCheckcontract') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('activeCheckcontract', key);
    };
    const [uqx, setUqx] = useState([]);
    useEffect(() => {
        let uq = StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    return (
        <Tabs activeKey={activeKey} onChange={onChange}>
            <Tabs.TabPane tab='正式合同' key='1'>
                <CheckZsContracte/>
            </Tabs.TabPane>
            {uqx[387] == '1' ? <Tabs.TabPane tab='定金合同' key='2'>
                <CheckDjContracte/>
            </Tabs.TabPane> : ''
            }
        </Tabs>
    )
}
export default connect() (CheckContracte)