import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadFile } from 'antd/lib/upload';
import Icon from "antd/es/icon";
import * as PostImgServer from "@/services/postImg";
import {compressBase64, getBase64} from '@/utils/OpenTool'
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

interface ImageUploadProps {
    onImageUpload?: (base64: string) => void; // 回调函数，用于上传成功时获取base64
    oldBase64?: (base64: string) => void; // 回调函数，用于上传成功时获取base64
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload,oldBase64 }) => {
    let isYs=1;
    const beforeUpload = async file => {
        const fileType = file.type;
        const isImage = fileType.startsWith('image/');
        if (!isImage) {
            message.error('只能上传图片！');
            return  false;
        }
        // 判断是否压缩  大于100kb 就压缩，反之不压缩
        if (file.size>100000){
            isYs=1;
        }else {
            isYs=0;
        }
        // 转换为 Base64
        try {
            const base64:any = await getBase64(file);
            const newBase64:any=await compressBase64(base64);
            if (typeof oldBase64 === 'function') {
                oldBase64(newBase64); // 调用 oldBase64 回调函数
            }
            // 返回图片地址
            PostImgServer.fetch(newBase64,isYs).then((res:TypeErrorCode)=>{
                if (res.ErrorCode==0){
                    onImageUpload(res?.Data);
                }else {
                    onImageUpload('');
                }
            });
        } catch (error) {
            message.error('Failed to convert file to Base64.');
        }
        // 阻止文件上传
        return false;
    };

    return (
        <Upload
            name="file"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
        >
            {/* 添加一个提示或占位图 */}
            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ccc' }}>
                <Icon type="plus" style={{ fontSize: 24 }} />
                <div style={{ marginTop: 8 }}>点击上传</div>
            </div>
        </Upload>
    );
};

export default ImageUpload;