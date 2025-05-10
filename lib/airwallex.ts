/**
 * Airwallex API 客户端配置
 * 该文件提供与Airwallex支付网关交互的所有必要函数
 */

const AIRWALLEX_API_KEY = process.env.AIRWALLEX_API_KEY;
const AIRWALLEX_CLIENT_ID = process.env.AIRWALLEX_CLIENT_ID;
const AIRWALLEX_ENDPOINT = process.env.NODE_ENV === 'production'
  ? 'https://api.airwallex.com'
  : 'https://api-demo.airwallex.com';

interface AirwallexAuthResponse {
  token: string;
  expires_at: number;
}

/**
 * 获取Airwallex API访问令牌
 */
async function getAccessToken(): Promise<string> {
  try {
    const response = await fetch(`${AIRWALLEX_ENDPOINT}/api/v1/authentication/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': AIRWALLEX_API_KEY || '',
        'x-client-id': AIRWALLEX_CLIENT_ID || '',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`认证失败: ${errorData.message || response.statusText}`);
    }

    const data = await response.json() as AirwallexAuthResponse;
    return data.token;
  } catch (error) {
    console.error('获取Airwallex访问令牌失败:', error);
    throw error;
  }
}

/**
 * 创建支付意向
 */
export async function createPaymentIntent(params: {
  amount: number;
  currency: string;
  orderId: string;
  customerInfo: {
    email: string;
    name: string;
    phone?: string;
  };
  returnUrl: string;
}) {
  try {
    const token = await getAccessToken();
    
    const response = await fetch(`${AIRWALLEX_ENDPOINT}/api/v1/pa/payment_intents/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        request_id: `req_${Date.now()}`,
        amount: params.amount,
        currency: params.currency,
        order_id: params.orderId,
        merchant_order_id: params.orderId,
        customer: {
          email: params.customerInfo.email,
          name: params.customerInfo.name,
          phone: params.customerInfo.phone,
        },
        return_url: params.returnUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`创建支付意向失败: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('创建Airwallex支付意向失败:', error);
    throw error;
  }
}

/**
 * 确认支付意向
 */
export async function confirmPaymentIntent(paymentIntentId: string, payload: any) {
  try {
    const token = await getAccessToken();
    
    const response = await fetch(`${AIRWALLEX_ENDPOINT}/api/v1/pa/payment_intents/${paymentIntentId}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`确认支付意向失败: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('确认Airwallex支付意向失败:', error);
    throw error;
  }
}

/**
 * 查询支付意向状态
 */
export async function getPaymentIntentStatus(paymentIntentId: string) {
  try {
    const token = await getAccessToken();
    
    const response = await fetch(`${AIRWALLEX_ENDPOINT}/api/v1/pa/payment_intents/${paymentIntentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`获取支付意向状态失败: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('获取Airwallex支付意向状态失败:', error);
    throw error;
  }
}

/**
 * 获取可用支付方式
 */
export async function getAvailablePaymentMethods(currency: string, country: string) {
  try {
    const token = await getAccessToken();
    
    const response = await fetch(`${AIRWALLEX_ENDPOINT}/api/v1/pa/payment_methods/list?country_code=${country}&currency=${currency}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`获取可用支付方式失败: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('获取Airwallex可用支付方式失败:', error);
    throw error;
  }
} 