import {useEffect,useState} from 'react';
import {connect} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {Button, Input, List, message, Space, Table, Tag} from "antd";
import {StaticInfo} from "@/StaticInfo";
import {getWarningDescById, getWarningNameById} from "@/utils/consumption";

const WaterCableDosageSetup=(props:any)=>{
    const [btnDisabled, setBtnDisabled] = useState(false);

    const getWaterCablePoliceSetupList = () => {
        // 1. 读取本地存储的上次点击时间戳
        const lastClickTimeStr = localStorage.getItem('waterCableDosage_lastSearchTime');
        const now = Date.now();
        const coolDownMs = 5 * 60 * 1000; // 5分钟 = 300000毫秒

        if (lastClickTimeStr) {
            const lastClickTime = Number(lastClickTimeStr);
            // 冷却时间未到，直接拦截
            if (now - lastClickTime < coolDownMs) {
                const remainSec = Math.ceil((coolDownMs - (now - lastClickTime)) / 1000);
                message.warning(`冷却中，还需等待 ${remainSec} 秒才能再次搜索`);
                return;
            }
        }

        // 2. 冷却完成，执行查询
        setBtnDisabled(true);
        props.dispatch({
            type: 'CollectorStutes/fetch'
        }).finally(() => {
            // 3. 记录本次点击时间到本地存储（刷新页面永久生效）
            localStorage.setItem('waterCableDosage_lastSearchTime', now.toString());
            // 5分钟后解锁按钮
            setTimeout(() => {
                setBtnDisabled(false);
                // 冷却结束清除存储，下次可直接点击
                localStorage.removeItem('waterCableDosage_lastSearchTime');
            }, coolDownMs);
        });
    };
    // 页面初始化时校验冷却，页面刷新自动锁定按钮
    useEffect(() => {
        const lastClickTimeStr = localStorage.getItem('waterCableDosage_lastSearchTime');
        if (!lastClickTimeStr) return;
        const now = Date.now();
        const lastClickTime = Number(lastClickTimeStr);
        const coolDownMs = 5 * 60 * 1000;
        const diff = now - lastClickTime;

        if (diff < coolDownMs) {
            // 还在冷却内，禁用按钮
            setBtnDisabled(true);
            // 剩余时间到自动解锁
            setTimeout(() => {
                setBtnDisabled(false);
                localStorage.removeItem('waterCableDosage_lastSearchTime');
            }, coolDownMs - diff);
        }
    }, []);
    const columns =[
        {
            title: '上次在线日期',
            dataIndex: 'connect_time',
            key: 'connect_time',
            render: (text, record) => {
                // online 为 false / 'false' 都判定离线
                if (record.online === false || record.online === 'false') {
                    return <span style={{ color: 'red' }}>离线</span>;
                }
                if (!text) return '-';
                return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {
            title: '采集器编号',
            dataIndex: 'collectorid',
            key: 'collectorid',
        },
        {
            title: '在线状态',
            dataIndex: 'online',
            key: 'online',
            render: (val: boolean) => (
                val ? <Tag color="success">在线</Tag> : <Tag color="error">离线</Tag>
            )
        },
        {
            title: '采集器信号',
            dataIndex: 'csq',
            render: (val: number | string) => {
                const num = Number(val);
                if (isNaN(num)) return <Tag>未知</Tag>;
                if (num >= 20) {
                    return <Tag color="success">{num}，信号稳定</Tag>;
                } else {
                    return <Tag color="error">{num}，信号不稳定</Tag>;
                }
            }
        }
    ];
    return(
        <>
            <List>
                <List.Item>
                    <Space>
                        <Button
                            type="primary"
                            onClick={getWaterCablePoliceSetupList}
                            disabled={btnDisabled}
                        >
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                columns={columns}
                size='small'
                rowKey={(_record:any, index:number) => index}
                dataSource={props.CollectorStutesList}
                pagination={false}
            />
        </>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CollectorStutesList: state.CollectorStutes.list
    }
};
export default connect(mapStateToProps) (WaterCableDosageSetup)
