import {Button, DatePicker, Input, List, Select, Space, Table, Tabs} from "antd";
import HourStatistics from "@/pages/waterCableTrade/hourStatistics";
import DayStatistics from "@/pages/waterCableTrade/dayStatistics";
import MoonStatistics from "@/pages/waterCableTrade/moonStatistics";
import YearStatistics from "@/pages/waterCableTrade/yearStatistics";
const CableStatistics=()=>{
    return(
        <Tabs>
            <Tabs.TabPane tab='小时用电统计' key='1'>
                <HourStatistics/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='天用电统计' key='2'>
                <DayStatistics/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='月用电统计' key='3'>
                <MoonStatistics/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='年用电统计' key='4'>
                <YearStatistics/>
            </Tabs.TabPane>
        </Tabs>
    )
}
export default CableStatistics