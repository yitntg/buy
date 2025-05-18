// 简单的认证API处理函数
export default function handler(req, res) {
  try {
    // 根据请求方法处理不同的认证操作
    switch(req.method) {
      case 'POST':
        // 处理登录请求
        return handleLogin(req, res);
      case 'GET':
        // 获取当前用户信息
        return handleGetUser(req, res);
      default:
        return res.status(405).json({ error: '方法不允许' });
    }
  } catch (error) {
    console.error('认证处理错误:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
}

// 登录处理
function handleLogin(req, res) {
  // 这里是模拟的登录实现
  const { email, password } = req.body;
  
  if (email === 'user@example.com' && password === 'password') {
    return res.status(200).json({
      user: { id: 1, email, name: 'Test User' },
      token: 'mock-jwt-token'
    });
  }
  
  return res.status(401).json({ error: '邮箱或密码不正确' });
}

// 获取用户信息
function handleGetUser(req, res) {
  // 从认证头提取token
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未授权访问' });
  }
  
  // 模拟验证token并返回用户
  return res.status(200).json({
    user: { id: 1, email: 'user@example.com', name: 'Test User' }
  });
} 