import Region from "@/pages/appletManage/region";
import Renovation from "@/pages/appletManage/renovation";
import Characteristic from "@/pages/appletManage/characteristic";
import {Tabs} from "antd";
const PropertyDescription = () => {
    return(
        <div>
            <Tabs>
                <Tabs.TabPane tab="区域管理" key="1">
                    <Region/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="装修" key="2">
                    <Renovation/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="特色" key="3">
                    <Characteristic/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
export default PropertyDescription