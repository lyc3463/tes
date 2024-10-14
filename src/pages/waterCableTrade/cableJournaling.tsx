import {Table} from "antd";

const CableJournaling=()=>{
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
            title: '水表编号',
            dataIndex: 'bianhao',
            key: 'bianhao',
        },
        {
            title: '用水量',
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
export default CableJournaling