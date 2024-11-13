import {Tabs} from "antd";
import House from "@/pages/houseManage/house";
import Unit from "@/pages/houseManage/unit";
import {useState} from "react";

const HouseList=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('activeTabKey4') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('activeTabKey4', key);
    };
    return(
        <div>
            <Tabs  activeKey={activeKey} onChange={onChange}>
                <Tabs.TabPane key={"1"}  tab='房屋列表'>
                    <House/>
                </Tabs.TabPane>
                <Tabs.TabPane key={"2"}  tab='单元列表'>
                    <Unit/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
export default HouseList