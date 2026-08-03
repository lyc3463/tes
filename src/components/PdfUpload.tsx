import { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd/es/upload';
import * as PostImgServer from "@/services/postImg";

interface PdfUploadProps {
    // 单个文件上传成功回调，返回后端文件名
    onSuccess?: (fileName: string) => void;
    onError?: (err: any, fileName?: string) => void;
    apiUrl: string;
    maxSize?: number;
    maxCount?: number;
}

const PdfUpload = ({
                       onSuccess,
                       onError,
                       apiUrl,
                       maxSize = 10 * 1024 * 1024,
                       maxCount = 5,
                   }: PdfUploadProps) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);

    // 文件转base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
    };

    // 文件校验
    const beforeUpload: UploadProps['beforeUpload'] = (file) => {
        const isPdf = file.type === 'application/pdf';
        if (!isPdf) {
            message.error('仅支持上传 PDF 格式文件');
            return Upload.LIST_IGNORE;
        }
        if (file.size > maxSize) {
            message.error(`文件【${file.name}】不能超过 ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
            return Upload.LIST_IGNORE;
        }
        return false;
    };

    const handleFileChange: UploadProps['onChange'] = async (info) => {
        if (loading) {
            message.warning('正在上传，请等待上传完成');
            return;
        }
        // 限制数量
        const newFileList = info.fileList.slice(-maxCount);
        setFileList(newFileList);

        const fileItems = newFileList.filter(item => item.originFileObj) as Array<UploadFile & { originFileObj: File }>;
        if (fileItems.length === 0) return;

        setLoading(true);
        try {
            for (const item of fileItems) {
                const base64Str = await fileToBase64(item.originFileObj);
                const res = await PostImgServer.pdfPost(base64Str);
                const fileName = res.Data;
                message.success(`【${item.name}】上传成功`);
                // 抛出后端文件名给父组件
                onSuccess?.(fileName);
            }
        } catch (err) {
            message.error('文件上传失败！');
            console.error(err);
            onError?.(err);
        } finally {
            setLoading(false);
            setFileList([]); // 上传完成清空子组件临时列表，不再显示本地名称
        }
    };

    return (
        <div style={{ width: 460 }}>
            <Upload
                fileList={fileList}
                beforeUpload={beforeUpload}
                onChange={handleFileChange}
                accept=".pdf"
                maxCount={maxCount}
                multiple
                disabled={loading}
                showUploadList={false}  // ✅ 隐藏antd自带上传列表
            >
                <Button icon={<UploadOutlined />} loading={loading}>
                    选择PDF文件
                </Button>
            </Upload>
            {/* 【重点】删掉原来展示本地item.name的区域！ */}
        </div>
    );
};

export default PdfUpload;