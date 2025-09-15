import {
    Button, DatePicker,
    Form,
    Image,
    Input,
    InputNumber,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Table,
    Spin,
    Tag
} from "antd";
import  {history,connect} from "umi";
import {useEffect, useState} from "react";
import * as TestService from '@/services/test';
import MyQRCodeComponent from '@/components/Myqrcode';
import {StaticInfo} from "@/StaticInfo";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const Device=(props)=>{
    // 页码
    const [page,setPage]=useState(1);
    const [pageSize,setpageSize]=useState(50);
    // 闸机编号
    const [deviceSn,setDeviceSn]=useState(sessionStorage.getItem('gateManageDeviceDeviceSn')||'');
    // 二维码弹窗
    const [open,setOpen]=useState(false);
    const [code,setCode]=useState('');
    const [timestamp,setTimestamp]=useState(0);
    const [title,setTitle]=useState('');
    // 同步数据弹窗
    const [synchronousOpen,setsynchronousOpen]=useState(false);
    //转圈
    const [spinning,setspinning]=useState(false);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns = [
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
                <Space>
                    {uqx[209]=='1'?<Button type='primary' onClick={()=>kaimen(record)}>开门</Button> :''}
                    {uqx[192]=='1'?<Button type='primary' onClick={()=>toedit(record)}>修改</Button>:''}
                </Space>
            ),
        },
    ];
    // 添加闸机
    const toadd=()=>{
        history.push('/gateManage/addDevice');
    };
    // 修改闸机
    const toedit=(record)=>{
        history.push(`/gateManage/editdevice?id=${record.id}`);
    };
    // 同步数据弹窗
    const synchronousData=()=>{
        TestService.text().then((res:TypeErrorCode)=>{

        })
    };
    // 生成二维码
    const onOK=()=>{
        let obj={id:StaticInfo.park_id,ts:timestamp}
        TestService.testQrCode(JSON.stringify(obj)).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setCode(res.Data);
                setTitle('请截图或者拍照保留通行二维码');
            }else {
                message.error(res.Data);
            }
        });
    };
    // 开门
    const kaimen=(item:any)=>{
        TestService.test(item.deviceSn).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('开门成功');
            }else {
                message.error(res.Data);
            }
        });
    };
    // 获取闸机列表
    const getGeteList=()=>{
      props.dispatch({
          type:'Gate/fetch',
          payload:{page,deviceSn,pageSize}
      })
    };
    useEffect(() => {
        getGeteList();
    }, [page,pageSize]);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getFenYeInfo();
        getGeteList();
    };
    const getFenYeInfo=()=>{
        props.dispatch({
            type:'Gate/fenye',
            payload:{deviceSn,pageSize}
        });
    };
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setpageSize(pageSize);
    };
    const changeDate=(_:any,item:any)=>{
        // 精确到秒的时间戳
        setTimestamp(Date.parse(item)/1000);
        console.log('时间戳',Date.parse(item)/1000);
    };
    const synchronousOK=()=>{
      setspinning(true);
      props.dispatch({
          type:'Gate/synchronous',
      }).then((res:TypeErrorCode)=>{
          if (res.ErrorCode==0){
              setspinning(false);
              setsynchronousOpen(false);
          }else {
              message.error(res.Data);
              setsynchronousOpen(false);
              setspinning(false);
          }
      })
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        getFenYeInfo();
    }, []);
    const changeDeviceSn=(e)=>{
      setDeviceSn(e.target.value);
      sessionStorage.setItem('gateManageDeviceDeviceSn',e.target.value);
    };
    return(
        <Spin spinning={spinning} style={{zIndex:'10000'}}>
            <List>
                <List.Item>
                    <Space>
                        {uqx[191]=='1'?<Button type="primary" onClick={toadd}>新增闸机</Button>:''}
                        {uqx[263]=='1'?<Button type="primary" onClick={()=>setOpen(true)}>生成访客二维码</Button>:''}
                        {/*<Button type='primary' onClick={()=>synchronousData()} danger>测试</Button>*/}
                    </Space>
                    <Space>
                        <Input
                            addonBefore="闸机编号:"
                            onChange={changeDeviceSn}
                            value={deviceSn}
                        />
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                dataSource={props.GateList}
                size='small'
                scroll={{y:'70vh'}}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            {/*访客二维码*/}
            <Modal title='访客二维码' onOk={onOK} open={open} onCancel={()=>setOpen(false)} loading={spinning}>
                <Form>
                    <Form.Item label='选择到期时间' >
                        <DatePicker showTime onChange={changeDate}/>
                    </Form.Item>
                </Form>
                <div style={{textAlign:'center'}}>
                    {code?
                        <div>
                            <MyQRCodeComponent value={code}/>
                            <span style={{fontSize:'12px' ,color:'#555'}}>{title}</span>
                        </div>
                        :''}
                </div>
            </Modal>
            {/*  同步闸机数据弹窗  */}
            <Modal title='同步数据' onOk={synchronousOK} open={synchronousOpen} onCancel={()=>setsynchronousOpen(false)}>
                <div>
                    确定要同步数据吗？
                </div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        GateList: state.Gate.list,
        count: state.Gate.count,
        GroupingList: state.Grouping.list
    }
};
export default connect(mapStateToProps) (Device)