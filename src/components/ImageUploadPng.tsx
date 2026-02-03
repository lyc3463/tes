import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadFile } from 'antd/lib/upload';
import Icon from "antd/es/icon";
import * as PostImgServer from "@/services/postImg";
import {compressBase64, getBase64} from '@/utils/OpenTool'
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import Compressor from "compressorjs";

interface ImageUploadProps {
    onImageUpload?: (base64: string) => void; // 回调函数，用于上传成功时获取base64
    oldBase64?: (base64: string) => void; // 回调函数，用于上传成功时获取base64
}

const ImageUploadPng: React.FC<ImageUploadProps> = ({ onImageUpload,oldBase64 }) => {
    async function compressBase641(base64: any) {
        if (!base64) return  ''
        const options = {
            quality: 0.6, // 压缩质量
            maxWidth: 700, // 最大宽度
            maxHeight: 350, // 最大高度
        };
        // 将 base64 转换为 Blob 对象
        const byteString = atob(base64.split(',')[1]);
        const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });

        // 使用 Compressorjs 库进行压缩处理
        return new Promise((resolve, reject) => {
            new Compressor(blob, {
                ...options,
                success(result) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const compressedDataUrl = e.target.result;
                        resolve(compressedDataUrl); // 返回压缩后的 base64 字符串
                    };
                    reader.readAsDataURL(result);
                },
                error(err) {
                    console.error('压缩失败:', err.message);
                    reject(err);
                },
            });
        });
    }
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
            const newBase64:any=await compressBase641(base64);
            console.log('压缩后的 Base64:', newBase64);
            if (typeof oldBase64 === 'function') {
                oldBase64(newBase64); // 调用 oldBase64 回调函数
            }
            // 返回图片地址
            PostImgServer.fetch1078(newBase64,isYs).then((res:TypeErrorCode)=>{
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

export default ImageUploadPng;