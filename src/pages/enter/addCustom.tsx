import {Button, DatePicker, Form, Input, message, Select, Space, Spin, Tooltip} from "antd";
import {useCallback, useEffect, useState} from "react";
import {connect, history,useNavigate} from "umi";
import {getCurrentDate, phonePattern,replaceEnglishCommasWithChinese} from "@/utils/OpenTool";
import * as CustomService from "@/services/custom";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import dayjs from "dayjs";
import React from "react";

// 缓存key
const CACHE_KEY = "AddCustom_form_cache";

const AddCustom=(props:any)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    const [custom_date,setCustom_date]=useState(getCurrentDate());
    // 来访渠道
    const [visitor_channels,setvisitor_channels]=useState(1);
    // 客户类别
    const [visitor_type,setvisitor_type]=useState(1);
    // 租赁原因
    const [reason_lease,setreason_lease]=useState(1);
    // 需求面积
    const [required_area,setrequired_area]=useState(1);
    // 监听产品需求
    const [demands,setdemands]=useState(1);
    const [disp,setDisp]=useState(false);
    const [remark,setremarks]=useState('');
    const [spinning,setspinning]=useState(false);
    // 公司名称
    const [company_name,setcompany_name]=useState('');
    // 手机号查询
    const [queryPhone,setQueryPhone]=useState('');
    // 查询到的所有园区客户
    const [phoneRecords,setPhoneRecords]=useState<any[]>([]);
    // 是否已执行过查询
    const [hasQueried,setHasQueried]=useState(false);
    // 本园区已有客户时的记录id（>0 表示编辑模式）
    const [editId,setEditId]=useState(0);
    // 编辑模式下的原始客户记录，用于判断资料是否修改过
    const [originalRecord,setOriginalRecord]=useState<any>(null);
    const isEdit = editId>0;
    // 其他园区的客户记录
    const otherRecords = phoneRecords.filter((item:any)=>item.park_name!==StaticInfo.park_name);

    // 读取缓存
    const loadCache = useCallback(() => {
        const str = sessionStorage.getItem(CACHE_KEY);
        if (!str) return null;
        try {
            return JSON.parse(str);
        } catch (e) {
            sessionStorage.removeItem(CACHE_KEY);
            return null;
        }
    }, []);

    // 保存state+表单字段到缓存
    const saveCache = useCallback(() => {
        const data = {
            custom_date,
            visitor_channels,
            visitor_type,
            reason_lease,
            required_area,
            demands,
            remark,
            company_name,
            queryPhone,
            phoneRecords,
            hasQueried,
            editId,
            originalRecord,
            formValues: form.getFieldsValue()
        };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
    }, [custom_date, visitor_channels, visitor_type, reason_lease, required_area, demands, remark, company_name, queryPhone, phoneRecords, hasQueried, editId, originalRecord, form]);

    // 清空缓存
    const clearCache = () => sessionStorage.removeItem(CACHE_KEY);

    // 清空草稿
    const resetAllFormData = () => {
        clearCache();
        setCustom_date(getCurrentDate());
        setvisitor_channels(1);
        setvisitor_type(1);
        setreason_lease(1);
        setrequired_area(1);
        setdemands(1);
        setremarks('');
        setcompany_name('');
        setQueryPhone('');
        setPhoneRecords([]);
        setHasQueried(false);
        setEditId(0);
        setOriginalRecord(null);
        form.resetFields();
    };

    useEffect(() => {
        // 加载缓存：回填state与表单字段
        const cache = loadCache();
        if (cache) {
            setCustom_date(cache.custom_date ?? getCurrentDate());
            setvisitor_channels(cache.visitor_channels ?? 1);
            setvisitor_type(cache.visitor_type ?? 1);
            setreason_lease(cache.reason_lease ?? 1);
            setrequired_area(cache.required_area ?? 1);
            setdemands(cache.demands ?? 1);
            setremarks(cache.remark ?? '');
            setcompany_name(cache.company_name ?? '');
            setQueryPhone(cache.queryPhone ?? '');
            setPhoneRecords(cache.phoneRecords ?? []);
            setHasQueried(cache.hasQueried ?? false);
            setEditId(cache.editId ?? 0);
            setOriginalRecord(cache.originalRecord ?? null);
            if (cache.formValues) {
                form.setFieldsValue(cache.formValues);
            }
        } else {
            setCustom_date(getCurrentDate());
        }
    }, []);
    // 任意state变动自动存缓存
    useEffect(() => {
        saveCache();
    }, [saveCache]);
    // 表单字段变动也立即存
    const handleFormChange = () => {
        saveCache();
    };

    // 判断编辑模式下资料是否有修改（对比原始记录与当前表单）
    const isRecordChanged=(values:any)=>{
        if (!originalRecord) return false;
        const norm=(v:any)=>String(v??'').trim();
        return (
            norm(values.custom_name)!==norm(originalRecord.custom_name) ||
            norm(values.industry)!==norm(originalRecord.industry) ||
            norm(values.visitor_position)!==norm(originalRecord.visitor_position) ||
            norm(values.office_area)!==norm(originalRecord.office_area) ||
            norm(values.intermediary_company)!==norm(originalRecord.intermediary_company) ||
            norm(values.intermediary_name)!==norm(originalRecord.intermediary_name) ||
            norm(values.intermediary_phone)!==norm(originalRecord.intermediary_phone) ||
            norm(remark)!==norm(originalRecord.remark) ||
            norm(company_name)!==norm(originalRecord.company_name) ||
            norm(custom_date)!==norm(originalRecord.custom_date?dayjs(originalRecord.custom_date).format('YYYY-MM-DD'):'') ||
            Number(visitor_channels)!==Number(originalRecord.visitor_channels||1) ||
            Number(visitor_type)!==Number(originalRecord.visitor_type||1) ||
            Number(reason_lease)!==Number(originalRecord.reason_lease||1) ||
            Number(required_area)!==Number(originalRecord.required_area||1) ||
            Number(demands)!==Number(originalRecord.demands||1)
        );
    };
    const onFinish=async (values:any)=>{
        setDisp(true);
        setspinning(true);
        const payload={...values,custom_date,visitor_channels,visitor_type,reason_lease,required_area,demands,remark,company_name};
        let res;
        if (isEdit){
            // 本园区已有客户：走编辑；有修改 isExamine1124=0（待审核），无修改=1（已审核）
            res=await props.dispatch({
                type:'Custom/edit',
                payload:{...payload,uid:editId,isExamine1124:isRecordChanged(values)?0:1}
            });
        }else {
            // 新增：1123 服务端固定为待审核状态
            res=await props.dispatch({
                type:'Custom/add',
                payload
            });
        }
        if (res.ErrorCode==0){
            setDisp(false);
            setspinning(false);
            message.success(isEdit?'修改成功':'添加成功');
            // 提交成功后清空草稿缓存
            clearCache();
            history.push('/enter/custom')
        }else {
            setDisp(false);
            setspinning(false);
            message.error(res.Data);
        }
    }
    // 用客户记录覆盖表单（全部覆盖；中介公司与中介电话1128未返回，置空）
    const fillFormByRecord=(record:any)=>{
        // 如果custom_date为空或者为0001-01-01T00:00:00，则使用当前日期填充
        setCustom_date(record.custom_date && record.custom_date!=='0001-01-01T00:00:00'?dayjs(record.custom_date).format('YYYY-MM-DD'):getCurrentDate());
        setvisitor_channels(record.visitor_channels||1);
        setvisitor_type(record.visitor_type||1);
        setreason_lease(record.reason_lease||1);
        setrequired_area(record.required_area||1);
        setdemands(record.demands||1);
        setremarks(record.remark||'');
        setcompany_name(record.company_name||'');
        form.setFieldsValue({
            custom_name:record.custom_name||'',
            industry:record.industry||'',
            visitor_position:record.visitor_position||'',
            office_area:record.office_area||'',
            remark:record.remark||'',
            intermediary_company:record.intermediary_company||'',
            intermediary_name:record.intermediary_name||'',
            intermediary_phone:record.intermediary_phone||''
        });
    };
    // 根据手机号查询所有园区客户
    const searchByPhone=async ()=>{
        if (!phonePattern.test(queryPhone)){
            message.error('请输入有效的手机号');
            return;
        }
        setspinning(true);
        const res:TypeErrorCode = await CustomService.getByPhone(queryPhone);
        setspinning(false);
        if (res.ErrorCode!=0){
            message.error(res.Data);
            return;
        }
        const list=res.Data||[];
        console.log('Search by phone result list:', list);
        setPhoneRecords(list);
        setHasQueried(true);
        const currentParkRecord=list.find((item:any)=>item.park_name===StaticInfo.park_name);
        if (currentParkRecord){
            // 本园区已有：进入编辑模式，保存原始记录用于提交时判断是否修改
            setEditId(currentParkRecord.id);
            setOriginalRecord(currentParkRecord);
            fillFormByRecord(currentParkRecord);
            message.success('本园区已存在该客户，已进入编辑模式');
        }else {
            // 本园区无：保持新增模式
            setEditId(0);
            setOriginalRecord(null);
            if (list.length>0){
                message.success('其他园区存在该客户，可复制资料后新增');
            }else {
                message.success('未查询到该客户，请新增');
            }
        }
        // 查询手机号回填到联系方式
        form.setFieldsValue({phone:queryPhone});
    };
    // 复制其他园区客户资料（全部覆盖表单，手机号保持查询值）
    const copyRecord=(record:any)=>{
        fillFormByRecord(record);
        form.setFieldsValue({phone:queryPhone});
        message.success(`已复制【${record.park_name}】的客户资料`);
    };
    const getDataInfo=(_:any,value:any)=>{
        setCustom_date(value)
    };
    // 监听来访渠道
    const changechannels=(e:number)=>{
        setvisitor_channels(e);
    };
    // 监听客户类别
    const  changevisitor_type=(e:number)=>{
        setvisitor_type(e);
    };
    // 监听租赁原因
    const changereason_lease=(e:number)=>{
        setreason_lease(e);
    };
    // 监听需求面积
    const changerequired_area=(e:number)=>{
        setrequired_area(e);
    };
    // 监听产品需求
    const changedemands=(e:number)=>{
        setdemands(e);
    };

    // 监听输入的文本
    const changeremarks=(e:any)=>{
        let a=replaceEnglishCommasWithChinese(e.target.value);
        setremarks(a);
    };

    // 截图同款块状单选按钮组件
    const BlockRadio = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
        <button
            type="button"
            onClick={onClick}
            style={{
                padding: '5px 16px',
                border: '1px solid #e5e7eb',
                background: active ? '#1677ff' : '#f5f7fa',
                color: active ? '#ffffff' : '#333333',
                borderRadius: 2,
                marginRight: 6,
                cursor: 'pointer',
                fontSize: 14
            }}
        >
            {children}
        </button>
    );
    return (
        <Spin spinning={spinning}>
            <div style={{ padding: '20px' }}>
                {/* 手机号查询区 */}
                <div style={{ border: '2px solid #4096ff', padding: '16px 20px', borderRadius: '6px', marginBottom: '24px' }}>
                    <Space>
                        <Input
                            addonBefore="手机号:"
                            placeholder="输入手机号查询客户"
                            value={queryPhone}
                            onChange={(e)=>setQueryPhone(e.target.value)}
                            disabled={isEdit}
                            style={{ width: '300px' }}
                            maxLength={11}
                        />
                        <Button type="primary" onClick={searchByPhone}>
                            查询
                        </Button>
                        {isEdit && <span style={{ color: '#1677ff' }}>本园区已存在该客户，当前为编辑模式</span>}
                    </Space>
                </div>
                {/* 其他园区客户记录：可复制 */}
                {hasQueried && otherRecords.length>0 && (
                    <div style={{ border: '1px solid #ffa940', padding: '12px 16px', borderRadius: '6px', marginBottom: '24px', background: '#fffbe6' }}>
                        <h4 style={{ margin: '0 0 12px 0', color: '#d46b08' }}>其他园区存在该手机号的客户，可复制资料：</h4>
                        {otherRecords.map((record:any)=>(
                            <div key={record.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px dashed #ffe7ba' }}>
                                <span>{record.park_name} - {record.custom_name||record.phone}{record.company_name?`（${record.company_name}）`:''}</span>
                                <Button size="small" type="primary" onClick={()=>copyRecord(record)}>复制</Button>
                            </div>
                        ))}
                    </div>
                )}
                <Form
                    form={form}
                    initialValues={{intermediary_company: '', required_area: 1, visitor_position: '', industry: '', visitor_channels: 1, intermediary_name: '', office_area: '', reason_lease: 1, demands: 1, remark: '', visitor_type: 1, intermediary_phone: ''}}
                    layout="horizontal"
                    size={'large'}
                    onFinish={onFinish}
                    onValuesChange={handleFormChange}
                >
                    {/* ========== 01 职位基本信息 区块 ========== */}
                    <div style={{ border: '2px solid #4096ff', padding: '20px', borderRadius: '6px', marginBottom: '24px' }}>
                        <h3 style={{ color: '#1677ff', margin: '0 0 24px 0', fontSize: '18px' }}>01 职位基本信息</h3>

                        {/* 第一行：登记日期、客户姓名、联系方式 */}
                        <div style={{ display: 'flex', gap: '24px', marginBottom: '16px', alignItems: 'center' }}>
                            <Form.Item label="登记日期" style={{ marginBottom: 0, width: '260px' }}>
                                <DatePicker style={{ width: '100%' }} onChange={getDataInfo} value={dayjs(custom_date)} />
                            </Form.Item>
                            <Form.Item label="客户姓名" style={{ marginBottom: 0, flex: 1 }} name='custom_name' rules={[{required: true, message: '请输入客户姓名' }]}>
                                <Input placeholder="客户姓名" />
                            </Form.Item>
                            <Form.Item
                                label="联系方式"
                                name="phone"
                                rules={[{ required: true, message: '请输入手机号' }, { pattern: phonePattern, message: '请输入有效的手机号' }]}
                                style={{ marginBottom: 0, flex: 1 }}
                            >
                                <Input placeholder="联系方式" disabled={isEdit} />
                            </Form.Item>
                        </div>

                        {/* 第二行：公司名称、行业、客户类别、访客职位 */}
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                            <Form.Item label="公司名称" style={{ marginBottom: 0, flex: 2 }}>
                                <Tooltip title={company_name}>
                                    <Input placeholder="请填写公司" value={company_name} onChange={(e) => setcompany_name(e.target.value)} />
                                </Tooltip>
                            </Form.Item>
                            <Form.Item label="行 业:" name="industry" style={{ marginBottom: 0, flex: 1 }}>
                                <Input placeholder="行业" />
                            </Form.Item>
                            <Form.Item label="客户类别" style={{ marginBottom: 0, width: '220px' }}>
                                <Space size={0}>
                                    <BlockRadio active={visitor_type === 1} onClick={() => changevisitor_type(1)}>办公</BlockRadio>
                                    <BlockRadio active={visitor_type === 2} onClick={() => changevisitor_type(2)}>商业</BlockRadio>
                                </Space>
                            </Form.Item>
                            <Form.Item label="访客职位" style={{ marginBottom: 0, flex: 1 }} name='visitor_position'>
                                <Input placeholder="访客职位" />
                            </Form.Item>
                        </div>
                    </div>

                    {/* ========== 02 办公租赁需求信息 区块 ========== */}
                    <div style={{ border: '2px solid #4096ff', padding: '20px', borderRadius: '6px', marginBottom: '24px' }}>
                        <h3 style={{ color: '#1677ff', margin: '0 0 24px 0', fontSize: '18px' }}>02 办公租赁需求信息</h3>
                        <Form.Item label="来访渠道" style={{ marginBottom: '16px' }}>
                            <Space size={0}>
                                <BlockRadio active={visitor_channels === 1} onClick={() => changechannels(1)}>中介</BlockRadio>
                                <BlockRadio active={visitor_channels === 2} onClick={() => changechannels(2)}>自来</BlockRadio>
                                <BlockRadio active={visitor_channels === 3} onClick={() => changechannels(3)}>全民营销</BlockRadio>
                                <BlockRadio active={visitor_channels === 4} onClick={() => changechannels(4)}>线上</BlockRadio>
                            </Space>
                        </Form.Item>

                        <Form.Item label="需求面积" style={{ marginBottom: '16px' }}>
                            <Space size={0}>
                                <BlockRadio active={required_area === 1} onClick={() => changerequired_area(1)}>100m²以下</BlockRadio>
                                <BlockRadio active={required_area === 2} onClick={() => changerequired_area(2)}>101-200m²</BlockRadio>
                                <BlockRadio active={required_area === 3} onClick={() => changerequired_area(3)}>201-350m²</BlockRadio>
                                <BlockRadio active={required_area === 4} onClick={() => changerequired_area(4)}>351-500m²</BlockRadio>
                                <BlockRadio active={required_area === 5} onClick={() => changerequired_area(5)}>501-1000m²</BlockRadio>
                                <BlockRadio active={required_area === 6} onClick={() => changerequired_area(6)}>1000m²以上</BlockRadio>
                            </Space>
                        </Form.Item>

                        <Form.Item label="租赁原因" style={{ marginBottom: '16px' }}>
                            <Space size={0}>
                                <BlockRadio active={reason_lease === 1} onClick={() => changereason_lease(1)}>首次经营</BlockRadio>
                                <BlockRadio active={reason_lease === 2} onClick={() => changereason_lease(2)}>平迁</BlockRadio>
                                <BlockRadio active={reason_lease === 3} onClick={() => changereason_lease(3)}>合同到期</BlockRadio>
                                <BlockRadio active={reason_lease === 4} onClick={() => changereason_lease(4)}>扩大</BlockRadio>
                                <BlockRadio active={reason_lease === 5} onClick={() => changereason_lease(5)}>缩小</BlockRadio>
                                <BlockRadio active={reason_lease === 6} onClick={() => changereason_lease(6)}>开设分点</BlockRadio>
                            </Space>
                        </Form.Item>

                        <Form.Item label="产品需求" style={{ marginBottom: '16px' }}>
                            <Space size={0}>
                                <BlockRadio active={demands === 1} onClick={() => changedemands(1)}>精装修</BlockRadio>
                                <BlockRadio active={demands === 2} onClick={() => changedemands(2)}>简装</BlockRadio>
                                <BlockRadio active={demands === 3} onClick={() => changedemands(3)}>毛坯</BlockRadio>
                            </Space>
                        </Form.Item>

                        <Form.Item label="目前办公区域" name="office_area" style={{ marginBottom: '16px' }}>
                            <Input placeholder="目前办公区域" style={{ maxWidth: '320px' }} />
                        </Form.Item>

                        <Form.Item label="备 注:" name="remark" style={{ marginBottom: 0 }}>
                            <Input.TextArea
                                placeholder="备注"
                                value={remark}
                                onChange={changeremarks}
                                rows={1}
                            />
                        </Form.Item>
                    </div>

                    {/* ========== 03 合作中介信息 区块 仅中介渠道显示 ========== */}
                    {visitor_channels === 1 && (
                        <div style={{ border: '2px solid #4096ff', padding: '20px', borderRadius: '6px', marginBottom: '32px' }}>
                            <h3 style={{ color: '#1677ff', margin: '0 0 24px 0', fontSize: '18px' }}>03 合作中介信息</h3>
                            <div style={{ display: 'flex', gap: '24px' }}>
                                <Form.Item label="中介公司名称" name="intermediary_company" style={{ marginBottom: 0, flex: 1 }}>
                                    <Input placeholder="中介公司名称" />
                                </Form.Item>
                                <Form.Item label="中介联系人" name="intermediary_name" style={{ marginBottom: 0, flex: 1 }}>
                                    <Input placeholder="中介联系人" />
                                </Form.Item>
                                <Form.Item label="中介联系电话" name="intermediary_phone" style={{ marginBottom: 0, flex: 1 }}>
                                    <Input placeholder="中介联系电话" />
                                </Form.Item>
                            </div>
                        </div>
                    )}
                    {/* 底部按钮 */}
                    <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
                        <Space>
                            <Button type="primary" htmlType="submit" disabled={disp}>
                                {isEdit?'保存':'添加'}
                            </Button>
                            <Button onClick={() => navigate(-1)}>
                                返回
                            </Button>
                            <Button danger onClick={resetAllFormData}>
                                清空草稿
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    )
}

export default connect() (AddCustom)