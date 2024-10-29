import {Button, Image, Input, List, Pagination, Space, Table, Tag} from "antd";
import {connect} from "umi";
import AppUserType from '@/ModelTypes/TypeAppUser'
import {useEffect, useState} from "react";
const ManualRecharge=(props)=>{
    const [uid,setUid]=useState<number|undefined>();
    const [page,setPage]=useState(1);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const columns =[
        {
            title: '用户头像',
            dataIndex: 'appUser_image',
            key: 'appUser_image',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        <Image src={text} style={{width:"50px",height:'50px'}}/>
                    </div>
                )
            }
        },
        {
            title: '微信呢称',
            dataIndex: 'appUser_name',
            key: 'appUser_name',
        },
        {
            title: '微信号',
            dataIndex: 'appUser_account',
            key: 'appUser_account',
        },
        {
            title: '用户手机号',
            dataIndex: 'appUser_phone',
            key: 'appUser_phone',
        },
        {
            title: '余额',
            dataIndex: 'appUser_balance',
            key: 'appUser_balance',
        },
        {
            title: '积分',
            dataIndex: 'appUser_integral',
            key: 'appUser_integral',
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render:(text:any,record:any,)=>{
                return(
                    <Space>
                        <Button type='primary' onClick={()=>{addjifen(record.id)}}>手动充值积分</Button>
                        <Button type='primary'>手动充值余额</Button>
                    </Space>
                )
            }
        },
    ];
    const addjifen=(e:AppUserType)=>{
        setUid(e.id);
    };
    // 监听手机号
    const changePhone=(e)=>{
        setPhone(e.target.value)
    };
    // 监听名字
    const changeName=(e)=>{
        setName(e.target.value)
    };
    // 搜索按钮
    const shousuo=()=>{
        setPage(1);
        props.dispatch({
            type:'AppUser/fetch',
            payload:{page,name,phone}
        });
        logFenye()
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"AppUser/fetch",
            payload:{page,name,phone}
        })
    };
    // 监听页数
    const onChange=(page)=>{
        setPage(page);
        logFenye();
    };
    useEffect(() => {
    }, [page]);
    return(
        <div>
            <List style={{backgroundColor:'#f5f5f5',padding:'10px',marginBottom:"20px",border:'1px solid #e3e3e3',borderRadius:'4px'}}>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="手机号:"
                            onChange={changePhone}
                        />
                        <Input
                            addonBefore="姓名:"
                            onChange={changeName}
                        />
                        <Button type="primary" onClick={shousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                dataSource={props.AppUserList}
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
        AppUserList: state.AppUser.list,
        count: state.AppUser.count
    }
};
export default connect(mapStateToProps) (ManualRecharge)