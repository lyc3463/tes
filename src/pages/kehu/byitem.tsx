import {Button, Form, message, Select, Space, Spin} from "antd";
import {connect,history,useNavigate} from "umi";
import {useEffect, useState} from "react";
import * as ByStagesService from "@/services/byStages";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as ZuhuServer from "@/services/zuhu";
import dayjs from "dayjs";
const tailLayout = {
    wrapperCol: { offset: 4 },
};

const Byitem=(props)=>{
    const navigate=useNavigate();
    // 收费项目id
    const [item_idz,setItem_idz]=useState([]);
    const [IsSpinning,setIsSpinning]=useState(false);
    const [uid,setUid]=useState('0');
    const  [conterText,setconterText]=useState('');
    // 监听收费项目
    const changeitem=(e)=>{
        setItem_idz(e);
    };
    // 绑定收费项目
    const okItemID=()=>{
        setIsSpinning(true);
        let item_id=item_idz.join('|');
        ByStagesService.byItem({uid,item_id}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('绑定收费项目成功,请勿重复绑定!');
                // history.push('/kehu/zuhuguanlian');
                setconterText(`已绑定成功,请勿重复绑定,操作时间${dayjs().format("YYYY-MM-DD HH:mm:ss")}`);
                getOneCustom(uid);
                setIsSpinning(false);
            }else {
                message.error(res.Data);
                getOneCustom(uid);
                setIsSpinning(false);
            }
        })
    };
    const getOneCustom=async (id:string)=>{
        let res:any=await  ZuhuServer.one(id);
        if (res.ErrorCode==0){
            let data=res.Data;
            let mapItem_idz=data[4].map((item:any)=>{
                return item.id
            });
            setItem_idz(mapItem_idz);
            let newArr=data[4].map((item:any)=>{
                return item.id
            });
            setItem_idz(newArr)
        }else {
            message.error(res.Data);
        }
    };
    // 获取收费项目列表
    const getGongsiList=()=>{
        props.dispatch({
            type:'Gongsi/fetch'
        })
    };
    useEffect(() => {
        getGongsiList();
    }, []);
    useEffect(() => {
        setUid(props.id)
        getOneCustom(props.id);
    }, [props.id]);
    return(
        <Spin spinning={IsSpinning}>
          <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              size={'large'}
              style={{ marginTop: '1rem' }}
          >
              <Form.Item label='收费项目'>
                  <Select
                      mode="multiple"
                      value={item_idz}
                      onChange={changeitem}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) => {
                          // 假设每个 option 都有一个与数据项对应的 value 属性
                          const item = props.GongsiList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                          return item?.item_name?.toLowerCase().includes(input.toLowerCase());
                      }}
                  >
                      <Select.Option
                          value={0}
                          key="no-unit-associated"
                          placeholder='选填'>
                          暂不关联
                      </Select.Option>
                      {props.GongsiList?props.GongsiList.map((item:any,index:any)=>{
                          return(
                              <Select.Option value={item.id} key={index}>
                                  {item.item_name}
                              </Select.Option>
                          )
                      }):''}
                  </Select>
              </Form.Item>
              <Form.Item {...tailLayout}>
                  <Space>
                      <Button type='primary' onClick={okItemID}>确定关联收费项目</Button>
                      <Button type="primary" onClick={()=>navigate(-1)}>
                          返回
                      </Button>
                  </Space>
              </Form.Item>
          </Form>
            <Form.Item {...tailLayout}>
                <div>
                    <span style={{color:'red'}}>{conterText}</span>
                </div>
            </Form.Item>

        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        GongsiList: state.Gongsi.list

    }
};
export default connect(mapStateToProps)(Byitem)