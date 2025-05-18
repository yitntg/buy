// 引入共享上传API处理函数
import { handleUploadRequest } from '../../../src/shared/api/upload';

export default function handler(req, res) {
  return handleUploadRequest(req, res);
} 