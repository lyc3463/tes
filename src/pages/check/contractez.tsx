import {useEffect, useRef, useState} from "react";
import * as StaffServer from "@/services/staff";
import dayjs from "dayjs";
import {connect} from "umi";
import {Form, Input, InputNumber, message, Select, DatePicker, Button} from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const tailLayout = {
    wrapperCol: { offset: 3 },
};
const Contractez=()=>{
     const formRef=useRef();
    // 客户列表
    const [kehuList,setKehuList]=useState([]);
    // 单元列表
    const [unitList,setUnitList]=useState([]);
    // 开始时间
    const [startDate,setStartDate]=useState('');
    // 结束时间
    const [endDate,setEndDate]=useState('');
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getOneStaff(id);
    }, []);
    const getOneStaff= (id:string)=>{

        StaffServer.one(id).then((res:any)=>{
            if (res.ErrorCode==0){
                setEndDate(dayjs(res.Data.eendtime).format('YYYY-MM-DD'));
                setStartDate(dayjs(res.Data.estarttime).format('YYYY-MM-DD'));
                formRef.current.setFieldsValue(res.Data);
            }else {
                message.error(res.Data)
            }
        });
    };
    // 下载pdf
    const onXiazai=async ()=>{
      // 获取需要导出的 HTML 元素
      const element = document.getElementById("pdf-content");

      // 使用 html2canvas 将 HTML 转为图片
      const canvas = await html2canvas(element, { scale: 2,useCORS: true });

      const imgData = canvas.toDataURL("image/png");

      // 创建 jsPDF 实例
      const pdf = new jsPDF("p", "mm", "a4");

      // 计算内容宽高比例，确保适配 A4 页面
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // 添加图片到 PDF
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // 下载 PDF
      pdf.save("合同.pdf");
    };
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                layout="horizontal"
                size={'large'}
                id='pdf-content'
                style={{ marginTop:'1rem'}}
            >
                <Form.Item label='合同编号' name='identifier'>
                    <Input/>
                </Form.Item>
                <Form.Item label='客户' name='clientId'>
                    <Select>
                        {kehuList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='身份证' name='customCard'>
                    <Input/>
                </Form.Item>
                <Form.Item label='单元' name='unit_id'>
                    <Select placeholder='单元'>
                        {unitList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='租金' name='zuMoney'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='管理费(元)' name='manageFee'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='押金' name='deposit' >
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='日期'>
                    {startDate&&endDate? <DatePicker.RangePicker defaultValue={[dayjs(startDate), dayjs(endDate)]}/>:''}
                </Form.Item>
                 <Form.Item {...tailLayout}>
                    <Button type="primary" onClick={onXiazai}>
                        下载
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default connect() (Contractez)




// <script>
//     import jsPDF from "jspdf";
//     import html2canvas from "html2canvas";
//
//     const exportToPDF = async () => {
//       // 获取需要导出的 HTML 元素
//       const element = document.getElementById("pdf-content");
//
//       // 使用 html2canvas 将 HTML 转为图片
//       const canvas = await html2canvas(element, { scale: 2,useCORS: true });
//
//       const imgData = canvas.toDataURL("image/png");
//
//       // 创建 jsPDF 实例
//       const pdf = new jsPDF("p", "mm", "a4");
//
//       // 计算内容宽高比例，确保适配 A4 页面
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//
//       // 添加图片到 PDF
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//
//       // 下载 PDF
//       pdf.save("document.pdf");
//     };
//   </script>
//
//   <style>
//     /* 预览的样式示例 */
//     #pdf-content {
//       width: 210mm; /* A4 纸宽度 */
//       padding: 20px;
//       background: white;
//       border: 1px solid #ddd;
//     }
//   </style>
//
//   <!-- HTML 结构 -->
//   <div style="color:black;">
//     <div id="pdf-content">
//       <h1>Svelte HTML 转 PDF 示例</h1>
//       <p>这是一个简单的 HTML 示例内容，点击按钮后将导出为 PDF。</p>
//       <img src="https://picsum.photos/800/400" alt="示例图片" crossorigin="anonymous" />
//     </div>
//     <button on:click={exportToPDF}>下载 PDF</button>
//   </div>
