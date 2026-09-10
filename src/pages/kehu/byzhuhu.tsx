import {useEffect, useRef, useState} from "react";
import {connect,history} from "umi";
import {Button, Form, Spin, Space, Modal, Tabs, message} from "antd";
import Byele from "@/pages/kehu/byele";
import Bymoney from "@/pages/kehu/bymoney";
import Byappuser from "@/pages/kehu/byappuser";
import Bywater from "@/pages/kehu/bywater";
import Byitem from "@/pages/kehu/byitem";
import * as ZuhuService from '@/services/zuhu';
import {StaticInfo} from '@/StaticInfo';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const Byzhuhu=(props:any)=>{
    // 路由参数
    const [uid,setUid]=useState('0');
    const formRef=useRef();
    const [isSpinning,setIsSpinning]=useState(false);
    const [uqx,setUqx]=useState([]);
    const [visible,setVisible]=useState(false);
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
    },[]);
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    // const onOK=()=>{
    //     ZuhuService.unbind(uid).then((res:TypeErrorCode)=>{
    //         if (res.ErrorCode==0){
    //             message.success('解绑成功');
    //             history.push('/kehu/byzhuhu');
    //         }else {
    //             message.error(res.Data);
    //         }
    //     })
    // };
    return(
        <Spin spinning={isSpinning}>
            <Tabs>
                {uqx[254]=='1'?<Tabs.TabPane tab='修改最低充值' key='1'>
                    <Bymoney id={uid}/>
                </Tabs.TabPane>:''
                }
                {uqx[351]=='1'?<Tabs.TabPane tab='绑定小程序' key='2'>
                    <Byappuser id={uid}/>
                </Tabs.TabPane>:''
                }
                {uqx[352]=='1'? <Tabs.TabPane tab='绑定电表' key='3'>
                    <Byele id={uid}/>
                </Tabs.TabPane>:''
                }
                {uqx[353]=='1'?   <Tabs.TabPane tab='绑定水表' key='4'>
                    <Bywater id={uid}/>
                </Tabs.TabPane>:''
                }
                {uqx[354]=='1'?  <Tabs.TabPane tab='绑定公共缴费' key='5'>
                    <Byitem id={uid}/>
                </Tabs.TabPane>:''
                }
                {/* {uqx[354]=='1'?  <Tabs.TabPane tab='解除关联' key='6'>
                    <Form
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                        size={'large'}
                        style={{ marginTop: '1rem' }}
                    >
                        <Form.Item label='注意:'>
                            <span style={{fontSize:"14px",color:'red'}}>解除关联后，该租户无法使用部分小程序功能。如还关联有水电表,那么一个小时后用电超1度会欠费拉闸!</span>
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Space>
                                <Button type='primary' onClick={()=>setVisible(true)}>解除关联</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Tabs.TabPane>:''
                } */}
            </Tabs>
            {/* <Modal open={visible} onCancel={()=>setVisible(false)} onOk={onOK}>
                <div>是否要解除关联!</div>
            </Modal> */}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        AppUserList: state.AppUser.list,
        UnitList: state.Unit.list,
        GongsiList: state.Gongsi.list,
        WatertList: state.Watert.list,
        CableList: state.Cable.list
    }
};
export default connect(mapStateToProps) (Byzhuhu)