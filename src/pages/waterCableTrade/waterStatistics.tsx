import {Button, DatePicker, Input, List, Select, Space, Table, Tabs} from "antd";
import DayWater from "@/pages/waterCableTrade/dayWater";
import MonWater from "@/pages/waterCableTrade/monWater";
import YaerWater from "@/pages/waterCableTrade/yaerWater";


const WaterStatistics=()=>{

    return(
        <div>
          <Tabs>
              <Tabs.TabPane tab='天用水统计' key='1'>
                  <DayWater/>
              </Tabs.TabPane>
              <Tabs.TabPane tab='月用水统计' key='2'>
                  <MonWater/>
              </Tabs.TabPane>
              <Tabs.TabPane tab='年用水统计' key='3'>
                  <YaerWater/>
              </Tabs.TabPane>
          </Tabs>
        </div>
    )
}
export default WaterStatistics