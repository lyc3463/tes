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
    Tag
} from "antd";
import  {history,connect} from "umi";
import {useEffect, useState} from "react";
import * as TestService from '@/services/test';
import MyQRCodeComponent from '@/components/Myqrcode'
const Device=(props)=>{
    // 页码
    const [page,setPage]=useState(1);
    // 闸机编号
    const [deviceSn,setDeviceSn]=useState('');
    // 二维码图片
    const [img,setImg]=useState('');
    // 二维码使用次数
    const [times,setTimes]=useState(0);
    // 二维码到期时间
    const [endDate,setEndDate]=useState('');
    // 房屋ID
    const [house_id,setHouse_id]=useState(0);
    // 弹窗
    const [open,setOpen]=useState(false);
    // 生成成功后的弹窗
    const [qrOpen,setQrOpen]=useState(false);
    // 生成二维码的闸机编号
    const  [deviceSns,setDeviceSns]=useState('');
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
                    <Button type='primary' onClick={()=>kaimen(record)}>开门</Button>
                    <Button type='primary' onClick={()=>qrCodeOpen(record.house_id)}>生成二维码</Button>
                </Space>
            ),
        },
    ];
    const toadd=()=>{
        history.push('/gateManage/addDevice');
    };
    // 生成二维码
    const getQrCode=()=>{
        TestService.testQrCode(endDate,deviceSns).then((res:any)=>{
            if (res.ErrorCode==0){
                setImg(res.Data.data);
                setQrOpen(true);
                setOpen(false);
                message.success('已生成二维码，请拍照或者截图保存')
            }else {
                message.error(res.Data)
            }
        });
    };
    // 生成二维码弹窗
    const qrCodeOpen=(e:any)=>{
        setOpen(true);
        setDeviceSns(e.deviceSn);
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
    // 选择有效时间
    const changeDate=(_:any,item:any)=>{
      setEndDate(item)
    };
    // 获取闸机列表
    const getGeteList=()=>{
      props.dispatch({
          type:'Gate/fetch',
          payload:{page,deviceSn}
      })
    };
    useEffect(() => {
        getGeteList()
    }, [page]);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        props.dispatch({
            type:'Gate/fenye',
            payload:{deviceSn}
        });
        getGeteList();
    };
    const onChange=(e:number)=>{
        setPage(e);
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
                            onChange={(e)=>setDeviceSn(e.target.value)}
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
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            <Modal title='二维码有效范围' open={open} onCancel={()=>setOpen(false)} onOk={getQrCode}>
                <Form>
                    {/*<Form.Item label='次数'>*/}
                    {/*    <InputNumber*/}
                    {/*        min={1}*/}
                    {/*        max={5}*/}
                    {/*        parser={(value:number) => {*/}
                    {/*            const parsedValue = Number(value);*/}
                    {/*            return isNaN(parsedValue) || !Number.isInteger(parsedValue) ? undefined : parsedValue;*/}
                    {/*        }}*/}
                    {/*        formatter={(value) => {*/}
                    {/*            // 自定义格式化函数，确保显示的是整数（这一步其实对输入控制没影响，但保证显示一致性）*/}
                    {/*            return value === undefined ? '' : value.toString();*/}
                    {/*        }}*/}
                    {/*        onChange={(e:number)=>setTimes(e)}*/}
                    {/*    />*/}
                    {/*    /!*<span style={{color:'#555',fontSize:"12px"}}>注:(最大次数5次)</span>*!/*/}
                    {/*</Form.Item>*/}
                    <Form.Item label='有效时间'>
                       <DatePicker  showTime onChange={changeDate}></DatePicker>
                    </Form.Item>
                </Form>
            </Modal>
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            <Modal title='请截图或拍照' open={qrOpen} onOk={()=>setQrOpen(false)}>
                <Image src={img} style={{width:'200px',height:'200px'}}></Image>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        GateList: state.Gate.list,
        count: state.Gate.count,
    }
};
export default connect(mapStateToProps) (Device)