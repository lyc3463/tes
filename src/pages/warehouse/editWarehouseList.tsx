import {Form, Input, Select, Button, Switch, InputNumber, message, Spin, Radio} from 'antd';
import {useEffect, useRef, useState} from 'react';
import {connect,history} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as WarehouseList from "@/services/warehouseList";
import {phonePattern} from "@/utils/OpenTool";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditWarehouseList = (props: any) => {
    const [form] = Form.useForm();
    const [spinning,setSpinning] = useState(false);
    const [uid,setUid]=useState('0');
    const formRef=useRef();

    const onFinish=(valus:any)=>{
        setSpinning(true);
        props.dispatch({
            type:'WarehouseList/edit',
            payload:{...valus,uid}
        }).then((res:TypeErrorCode)=>{
            if(res.ErrorCode==0){
                setSpinning(false);
                message.success('编辑成功');
                history.push('/warehouse/warehouseAndType');
            }else{
                setSpinning(false);
                message.error(res.ErrorCode + res.Data);
            }
        })
    };
    const getOne=async (id:string)=>{
        setSpinning(true);
        let res:any=await  WarehouseList.one(id);
        if (res.ErrorCode==0){
            let data=res.Data;
            formRef.current.setFieldsValue(data);
            setSpinning(false);
        }else {
            message.error(res.Data);
            setSpinning(false);
        }
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOne(id);
    }, []);
    // const getList=()=>{
    //     props.dispatch({
    //         type:"WarehouseType/fetch",
    //     })
    // };
    // useEffect(() => {
    //     getList();
    // }, []);
    return (
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                ref={formRef}
                onFinish={onFinish}
                layout="horizontal"
                size={'large'}
                initialValues={{isXs:1,warehouseAddress:'',personName:'',personPhone:''}}
                style={{ marginTop: '1rem' }}
            >
                {/* 2. 仓库名称 */}
                <Form.Item
                    name="warehouseName"
                    label="仓库名称"
                    rules={[
                        { required: true, message: '请输入仓库名称' },
                        { max: 50, message: '名称长度不超过50字符' }
                    ]}
                >
                    <Input placeholder="请输入仓库名称" />
                </Form.Item>

                {/* 3. 仓库类型（与列表页类型对应） */}
                {/*<Form.Item label='仓库类型' name='typeId' rules={[{required: true, message: '请选择仓库类型' }]}>*/}
                {/*    <Select*/}
                {/*        placeholder='请选择仓库类型'*/}
                {/*        options={Array.isArray(props.list) && props.list.length > 0*/}
                {/*            ? props.list.map((item:any)=>({*/}
                {/*                label:item.typeName,*/}
                {/*                value:item.id,*/}
                {/*            }))*/}
                {/*            : []}*/}
                {/*    />*/}
                {/*</Form.Item>*/}

                {/* 4. 所在地址 */}
                <Form.Item
                    name="warehouseAddress"
                    label="所在地址"
                >
                    <Input placeholder="请输入详细地址（如：XX市XX区XX路）" />
                </Form.Item>

                {/* 5. 负责人信息 */}
                <Form.Item
                    name="personName"
                    label="负责人姓名"
                >
                    <Input placeholder="请输入负责人姓名" />
                </Form.Item>

                {/* 6. 联系电话 */}
                <Form.Item
                    name="personPhone"
                    label="联系电话"
                >
                    <Input placeholder="请输入负责人联系电话" />
                </Form.Item>
                <Form.Item
                    label="是否销售"
                    name="isXs"
                    rules={[{required: true, message: '请选择是否销售'}]}
                >
                    <Radio.Group>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary"  htmlType="submit">
                        编辑
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    );
};
const mapStateToProps = (state: any) => ({
    // list: state.WarehouseType.list,
    // count: state.WarehouseType.count,
});
export default connect(mapStateToProps)(EditWarehouseList);
