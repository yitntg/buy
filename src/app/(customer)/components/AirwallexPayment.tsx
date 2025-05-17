import React, { useState } from 'react';

interface PaymentProps {
  amount: number;
  currency?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

const AirwallexPayment: React.FC<PaymentProps> = ({
  amount,
  currency = 'CNY',
  onSuccess,
  onError
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 模拟支付处理
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 模拟成功响应
      const mockResponse = {
        id: 'pay_' + Math.random().toString(36).substring(2, 12),
        amount,
        currency,
        status: 'succeeded',
        created: new Date().toISOString()
      };

      if (onSuccess) {
        onSuccess(mockResponse);
      }
    } catch (error) {
      if (onError) {
        onError(error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">支付详情</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            金额
          </label>
          <div className="px-3 py-2 bg-gray-100 rounded-md">
            {currency} {amount.toFixed(2)}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            持卡人姓名
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="姓名"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            卡号
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>

        <div className="flex mb-4 space-x-4">
          <div className="w-1/2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              到期日期
            </label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="MM/YY"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              安全码
            </label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="CVC"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isProcessing ? '处理中...' : `支付 ${currency} ${amount.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

export default AirwallexPayment; 