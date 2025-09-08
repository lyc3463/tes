import { Upload, message } from "antd";
import Icon from "antd/es/icon";
import React from "react";
import { compressBase64, getBase64 } from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as PostImgServer from "@/services/postImg";

// 组件 props 定义：接收上传成功的回调函数（返回单个 Base64 字符串）
interface MultiImageUploaderProps {
    onImageUpload: (data: { base64: string; imgName: string }) => void;
    multiple?: boolean; // 是否支持多图上传，默认 true
}

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
                                                                   onImageUpload,
                                                                   multiple = true
                                                               }) => {
    // 图片上传前处理逻辑
    const beforeUpload = async (file: File) => {
        // 1. 验证文件类型
        const fileType = file.type;
        const isImage = fileType.startsWith('image/');
        if (!isImage) {
            message.error('只能上传图片！');
            return false;
        }
        // 2. 转换为 Base64 并压缩
        try {
            const base64: any = await getBase64(file); // 转换为 Base64
            const compressedBase64: any = await compressBase64(base64); // 压缩 Base64
            PostImgServer.fetch(compressedBase64, 0).then((res: TypeErrorCode) => {
                if (res.ErrorCode === 0) {
                    // 调用回调，传递包含 base64 和图片名称的对象
                    onImageUpload({
                        base64: compressedBase64, // 压缩后的 base64 字符串
                        imgName: res.Data // 接口返回的图片名称
                    });
                } else {
                    message.error('图片上传失败：' + res.Data);
                }
            });
        } catch (error) {
            message.error('图片处理失败，请重试');
        }
        // 阻止默认上传行为（手动处理上传逻辑）
        return false;
    };

    return (
        <Upload
            name="file"
            multiple={multiple} // 启用多图上传
            listType="picture-card" // 卡片式展示
            className="avatar-uploader"
            showUploadList={false} // 隐藏默认上传列表（由父组件自定义展示）
            beforeUpload={beforeUpload} // 绑定上传前处理函数
        >
            {/* 上传按钮占位UI */}
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#ccc'
            }}>
                <Icon type="plus" style={{ fontSize: 24 }} />
                <div style={{ marginTop: 8 }}>点击上传</div>
            </div>
        </Upload>
    );
};

export default MultiImageUploader;