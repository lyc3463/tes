import FriendlyLinks from "@/pages/appletManage/friendlyLinks";
import ContactService from "@/pages/appletManage/contactService";
import ParkingPayment from "@/pages/appletManage/parkingPayment";
import {useState} from "react";
import {Tabs} from "antd";
const Links=(props:any)=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('activeTabLink') || '2');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('activeTabLink', key);
    };
    return(
        <div>
            <Tabs  activeKey={activeKey} onChange={onChange}>
                {/*<Tabs.TabPane tab="友情链接" key="1">*/}
                {/*    <FriendlyLinks/>*/}
                {/*</Tabs.TabPane>*/}
                <Tabs.TabPane tab="停车缴费链接" key="2">
                    <ParkingPayment/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="联系客服链接" key="3">
                    <ContactService/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
export default Links