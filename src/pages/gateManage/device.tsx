import {Button, Image, Input, List, message, Pagination, Select, Space, Table, Tag} from "antd";
import  {history,connect} from "umi";
import {useEffect, useState} from "react";
import * as TestService from '@/services/test';

const Device=(props)=>{
    const [img,setImg]=useState('');
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (text: any, record: any) => (
                <Button type="link">{text}</Button>
            ),
        },
        {
            title: '闸机编号',
            dataIndex: 'deviceSn',
        },
        {
            title: '所属房屋',
            dataIndex: 'house_name',
        },
        {
            title: '闸机地点',
            dataIndex: 'position',
        },
        {
            title: '操作',//简单常用操作放这里，复杂放详情
            dataIndex: 'operation',
            render: (text: any, record: any) => (
                <Button type='primary' onClick={()=>kaimen(record)}>开门</Button>
            ),
        },
    ];
    const toadd=()=>{
        history.push('/gateManage/addDevice');
    };
    // 二维码测试
    const test1=(item,id)=>{
        TestService.testQrCode({item,id}).then((res)=>{
            setImg(res.Data.data)
        });
    };
    // 开门
    const kaimen=(item:any)=>{
        TestService.test(item.deviceSn,item.house_id).then((res)=>{
            if (res.ErrorCode==0){
                message.success('开门成功')
            }else {
                message.error(res.Data)
            }
        });
    };
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            新增闸机
                        </Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="闸机编号:"
                        />
                        <Button type="primary" >
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            {/*<Image src={img} style={{width:'200px',height:'200px'}}/>*/}
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                dataSource={props.GateList}
                size='small'
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            <Pagination/>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        GateList: state.Gate.list
    }
};
export default connect(mapStateToProps) (Device)