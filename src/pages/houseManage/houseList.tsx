import {Tabs} from "antd";
import House from "@/pages/houseManage/house";
import Unit from "@/pages/houseManage/unit";

const HouseList=()=>{
    return(
        <div>
            <Tabs>
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