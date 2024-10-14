import {Table} from "antd";

const HouseBill=()=>{
    const columns =[
        {
            title: '序号',
            dataIndex: 'xuhao',
            key: 'xuhao',
        },
        {
            title: '标签',
            dataIndex: 'biaoqian',
            key: 'biaoqian',
        },
        {
            title: '租户名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '状态',
            dataIndex: 'stutes',
            key: 'stutes',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.stutes?<span style={{color:'green'}}>已交</span>:<span style={{color:'red'}}>未交</span>}
                    </div>
                )
            }
        },
        {
            title: '合同总租金(元)',
            dataIndex: 'zujin',
            key: 'zujin',
        },
        {
            title: '合同已交租金(元)',
            dataIndex: 'yijiao',
            key: 'yijiao',
        },
        {
            title: '优惠金额(元)',
            dataIndex: 'youhui',
            key: 'youhui',
        },
        {
            title: '分期',
            dataIndex: 'fenqi',
            key: 'fenqi',
        },
        {
            title: '管理费',
            dataIndex: 'mianji',
            key: 'mianji',
        },
        {
            title: '当前缴费金额',
            dataIndex: 'mianji',
            key: 'mianji',
        },
        {
            title: '下个月缴费金额',
            dataIndex: 'fangwu',
            key: 'fangwu',
        },
        {
            title: '详情',
            dataIndex: 'cao',
            key: 'cao',
            render:()=>{
                return(
                    <div>

                    </div>
                )
            }
        },
    ]

    return(
        <div>
            <Table columns={columns} style={{border:'1px solid #ddd',borderRadius:'4px'}}pagination={false} scroll={{x:1500}}/>
        </div>
    )
}
export default HouseBill