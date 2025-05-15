/**
 * 超时工具函数 - 提供API请求超时控制
 */

// 带超时控制的Fetch请求
export async function fetchWithTimeout(
  resource: RequestInfo, 
  options: RequestInit = {}, 
  timeoutMs: number = 5000
): Promise<Response> {
  // 创建超时Promise
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`请求超时：${timeoutMs}ms`));
    }, timeoutMs);
  });

  // 竞态处理：谁先完成谁先返回
  try {
    const response = await Promise.race([
      fetch(resource, options),
      timeout
    ]) as Response;
    return response;
  } catch (error) {
    console.error('API请求失败:', error);
    throw error;
  }
}

// 带有重试和超时机制的Fetch请求
export async function fetchWithRetry(
  resource: RequestInfo, 
  options: RequestInit = {}, 
  retries: number = 3,
  timeoutMs: number = 5000
): Promise<Response> {
  let lastError: Error | null = null;
  
  // 尝试多次请求
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`尝试API请求 (${i + 1}/${retries})`);
      const response = await fetchWithTimeout(resource, options, timeoutMs);
      
      // 如果请求成功但响应不是200，抛出错误
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP错误 ${response.status}: ${errorBody}`);
      }
      
      return response;
    } catch (error: any) {
      console.error(`请求失败 (尝试 ${i + 1}/${retries}):`, error.message);
      lastError = error;
      
      // 如果不是最后一次重试，则等待一段时间再重试
      if (i < retries - 1) {
        // 指数退避策略，每次重试间隔时间增加
        const delay = Math.min(1000 * Math.pow(2, i), 10000);
        console.log(`等待 ${delay}ms 后重试...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // 所有重试都失败，抛出最后一个错误
  throw lastError || new Error('请求失败，未知错误');
}

// 并行发起多个请求，返回第一个成功的结果
export async function raceRequests<T>(
  requests: (() => Promise<T>)[],
  timeoutMs: number = 10000
): Promise<T> {
  // 超时处理
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`所有并行请求超时: ${timeoutMs}ms`));
    }, timeoutMs);
  });
  
  // 执行所有请求
  const results = requests.map(requestFn => 
    requestFn().catch(error => {
      console.error('请求失败:', error);
      return null; // 将失败的结果转换为null
    })
  );
  
  // 竞态返回第一个成功的结果
  const result = await Promise.race([Promise.all(results), timeout])
    .then((allResults: any[]) => allResults.find(result => result !== null));
  
  if (result === null || result === undefined) {
    throw new Error('所有请求均失败');
  }
  
  return result;
} 