import {Table} from "antd";

const WaterJournaling=()=>{
    const columns =[
        {
            title: '日期',
            dataIndex: 'data',
            key: 'data',
        },
        {
            title: '标签',
            dataIndex: 'biaoqian',
            key: 'biaoqian',
        },
        {
            title: '电表编号',
            dataIndex: 'bianhao',
            key: 'bianhao',
        },
        {
            title: '用电量',
            dataIndex: 'dianliang',
            key: 'dianliang',
        },
    ]
    return(
        <div>
            <Table columns={columns} style={{border:'1px solid #ddd',borderRadius:'4px'}} pagination={false}/>
        </div>
    )
}
export default WaterJournaling