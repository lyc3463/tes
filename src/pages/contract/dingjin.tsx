import {Button, Input, InputNumber, message} from "antd";
import * as ContractTypeService from '@/services/contractType';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {useEffect, useState} from "react";

const Dingjin=()=>{
    const templateType=1;
    const [uid,setUid]=useState(0);
    // 公司名称
    const [companyName,setCompanyName]=useState('');
    // 公司地址
    const [companyAddress,setCompanyAddress]=useState('');
    // 出租地址
    const [rentAddress,setrentAddress]=useState('')
    // 开户名称
    const [openName,setopenName]=useState('');
    // 开户银行
    const [openBank,setopenBank]=useState('');
    // 银行账号
    const [bankCard,setbankCard]=useState('');
    // 法定人
    const [legalPerson,setlegalPerson]=useState('');
    // 联系电话
    const [phone,setphone]=useState('');
    // 证件图片
    const [documentImage,setdocumentImage]=useState('');
    // 招商电话
    const [attractPhone,setattractPhone]=useState('');
    // 招商人
    const [attract,setattract]=useState('');
    // 招商微信号
    const [attractWXNumber,setattractWXNumber]=useState('');
    // 举报电话
    const [reportPhone,setreportPhone]=useState('');
    // 举报邮箱
    const [reportEmail,setreportEmail]=useState('');
    // 联系人
    const [contacts,setcontacts]=useState('');
    const getOne=()=>{
        ContractTypeService.one(templateType).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setUid(res.Data.id);
                setCompanyName(res.Data.companyName);
                setCompanyAddress(res.Data.companyAddress);
                setopenName(res.Data.openName);
                setopenBank(res.Data.openBank);
                setbankCard(res.Data.bankCard);
                setlegalPerson(res.Data.legalPerson);
                setphone(res.Data.phone);
                setdocumentImage(res.Data.documentImage);
                setattractPhone(res.Data.attractPhone);
                setattractWXNumber(res.Data.attractWXNumber);
                setrentAddress(res.Data.rentAddress);
                setreportPhone(res.Data.attractWXNumber);
            }else {
                setUid(0);
            }
        })
    };
    useEffect(() => {
        getOne();
    }, []);
    // 乙方名称
    const changecompanyName=(e)=>{
        setCompanyName(e.target.value)
    };
    // 租赁地址
    const changecompanyAddress=(e)=>{
        setrentAddress(e.target.value);
    };
    // 开户名称
    const changeOpenName=(e)=>{
          setopenName(e.target.value);
    };
    // 开户银行
    const changeOpenBank=(e)=>{
      setopenBank(e.target.value);
    };
    // 银行账号
    const changeBankCard=(e)=>{
      setbankCard(e.target.value)
    };
    const onOk=()=>{
      if (uid>0){
          editCpntranType();
      }  else {
          addCpntranType();
      }
    };
    const addCpntranType=()=>{
        ContractTypeService.add(companyName,companyAddress,rentAddress,openName,openBank,bankCard,templateType,legalPerson,phone,contacts,documentImage,attractPhone,attractWXNumber,reportPhone,reportEmail,attract,0,0,0).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('保存成功');
                getOne()
            }else {
                message.error(res.Data)
            }
        })
    };
    const editCpntranType=()=>{
        ContractTypeService.edit(uid,companyName,companyAddress,rentAddress,openName,openBank,bankCard,templateType,legalPerson,phone,contacts,documentImage,attractPhone,attractWXNumber,reportPhone,reportEmail,attract,0,0,0).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('保存成功');
                getOne()
            }else {
                message.error(res.Data)
            }
        })
    };
    return(
        <div>
            <div className="receipt-container">
                <h1>定金合同</h1>
                <div className="receipt-info">
                    <p>甲方（付款方）：<Input style={{width:'200px'}} placeholder='模板不用填写' disabled /></p>
                    <p>乙方（收款方）：<Input style={{width:'200px'}} placeholder='必填' value={companyName}  onChange={changecompanyName}/></p>
                    <p style={{marginLeft:'30px'}}>甲、乙双方因甲方拟租赁乙方商铺事宜，双方经协商一致，就定金担保事宜达成如下协议:</p>
                    <p style={{marginLeft:'30px'}}>第一条：<Input disabled style={{width:'120px'}} placeholder='模板不用填写'/>已详细了解要签署的主合同并已知首年租金（大写）
                        <span style={{color:'red'}}><Input disabled style={{width:'120px'}} placeholder='模板不用填写'/></span>，
                        租赁地址位于<Input value={rentAddress} onChange={changecompanyAddress} style={{width:'300px'}} placeholder='必填' />
                        <Input placeholder='模板不用填' style={{width:'100px'}} disabled/>
                        号的物业。
                    </p>
                    <p style={{marginLeft:'30px'}}>第二条:甲方应在本合同签订之日向乙方一次性支付交付定金<span style={{color:'red'}}><Input  disabled placeholder='模板不用填写' style={{width:'120px'}}/></span>元整，乙方收款账户如下：</p>
                    <p style={{marginLeft:'50px'}}>开户名称:<Input style={{width:'200px'}} placeholder='必填' value={openName} onChange={changeOpenName}/></p>
                    <p style={{marginLeft:'50px'}}>开户银行:<Input style={{width:'200px'}} placeholder='必填' value={openBank} onChange={changeOpenBank}/></p>
                    <p style={{marginLeft:'50px'}}>银行账号:<Input style={{width:'200px'}} placeholder='必填' value={bankCard} onChange={changeBankCard}/></p>
                    <p style={{marginLeft:'30px'}}>第三条:本合同生效后，甲、乙任何一方不得擅自变更或解除，除非使双方协商一致并达成书面协议。</p>
                    <p style={{marginLeft:'30px'}}>第四条:甲方履行主合同义务（主合同即甲乙双方签订的《租赁合同》，该租赁合同自收到<span style={{color:'red'}}>甲方</span>定金后<InputNumber disabled placeholder='模板不用填写'/>日内签订，租赁合同的全文及其租赁物业的状况、位置、押金数额、租金数额及其支付方式<span style={{color:'red'}}>甲乙</span>均已详细知晓）后，乙方应返还定金或以该定金冲抵甲方应付乙方款项(押金或租金)。</p>
                    <p style={{marginLeft:'30px'}}>第五条:因甲方原因逾期不签订主合同或不履行主合同，无权要求返还定金；乙方不履行主合同，应当双倍返还定金。定金罚则的执行，不影响任何一方要求赔偿的权利。</p>
                    <p style={{marginLeft:'30px'}}>第六条:本合同经双方签章自定金交付之日起生效，一式两份；双方各执一份，具有同等法律效力。</p>
                    <p style={{marginLeft:'30px'}}>签订地点：<Input style={{width:'200px'}} value={companyAddress} placeholder='不需要填写' disabled/></p>
                    <p style={{marginLeft:'30px'}}><span style={{marginRight:'100px'}}>甲方 :<Input style={{width:'200px'}} placeholder='不需要填写' disabled/></span><span>乙方:<Input value={companyName} style={{width:'200px'}} placeholder='必填'/></span></p>
                    <p style={{marginLeft:'30px'}}><span style={{marginRight:'100px'}}>签订日期 :<span style={{color:"red"}}>{'签订日期'}</span></span><span>签订日期:<span style={{color:'red'}}>{'签订日期'}</span></span></p>
                </div>
                <div><Button type='primary' onClick={onOk}>保存设置</Button></div>
            </div>
        </div>
    )
}
export default  Dingjin