/**
 * 将图片上传到本地服务器
 * @param file 要上传的文件
 * @returns 上传成功后的图片 URL
 */
export async function uploadImageToLocalServer(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('上传图片到本地服务器失败:', errorData);
      throw new Error(`上传失败: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success || !data.url) {
      console.error('上传响应缺少必要字段:', data);
      throw new Error('上传成功但返回数据无效');
    }
    
    console.log('成功上传图片到本地服务器:', data.url);
    return data.url;
  } catch (error) {
    console.error('上传图片到本地服务器时出错:', error);
    throw error;
  }
} 