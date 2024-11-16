import {connect} from "umi";
import {Button, DatePicker, Image, Input, List, Pagination, Space, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {findChangedPermissions} from "@/utils/OpenTool";
const LogQuery=(props)=>{
    const [page,setPage]=useState(1);
    const [name,setName]=useState('');
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const columns =[
        {
            title: '员工昵称',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: '更改日期',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render:(_:any,item:any)=>{
                return(
                    <div>
                        {dayjs(item.updateTime).format("YYYY-MM-DD HH:mm:ss")}
                    </div>
                )
            }
        },
        {
            title: '移除的权限',
            dataIndex: 'key',
            key: 'key',
            render:(_:any,item:any)=>{
                const removedPermissions:{removedPermissions:any,addedPermissions:any}=findChangedPermissions(item.oldAuthority,item.newAuthority);
                return(
                    <div>
                       <Input.TextArea value={removedPermissions.removedPermissions.map(val=>{return val.name})}/>
                    </div>
                )
            }
        },
        {
            title: '新增的权限',
            dataIndex: 'key',
            key: 'key',
            render:(_:any,item:any)=>{
                const removedPermissions:{removedPermissions:any,addedPermissions:any}=findChangedPermissions(item.oldAuthority,item.newAuthority);
                return(
                    <div>
                        <Input.TextArea value={removedPermissions.addedPermissions.map(val=>{return val.name})}/>
                    </div>
                )
            }
        },
    ];
    const onChange=(e)=>{
        setPage(e);
    };
    useEffect(() => {
        logFenye();
    }, [page]);
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"LogQuery/fetch",
            payload:{page,name,startDate,endDate}
        })
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };
    return(
        <div>
            <List style={{backgroundColor:'#f5f5f5',padding:'10px',marginBottom:"20px",border:'1px solid #e3e3e3',borderRadius:'4px'}}>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="姓名:"
                            onChange={(e)=>setName(e.target.value)}
                        />
                        <Space.Compact>
                            <div
                                style={{
                                    borderRadius: '6px',
                                    borderStartEndRadius: 0,
                                    borderEndEndRadius: 0,
                                    padding: '0 11px',
                                    border: '1px solid #d9d9d9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                }}
                            >
                                日期:
                            </div>
                            <DatePicker.RangePicker onChange={changeDate}/>
                        </Space.Compact>
                        <Button type="primary" >
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                dataSource={props.QualityLogList}
                size='small'
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        QualityLogList: state.LogQuery.list,
        count: state.LogQuery.count
    }
};
export default connect(mapStateToProps) (LogQuery)