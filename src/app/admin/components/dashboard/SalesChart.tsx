'use client'

import { Card } from '../ui/card'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface SalesChartProps {
  data?: {
    date: string;
    sales: number;
    orders: number;
  }[];
  isLoading?: boolean;
}

export default function SalesChart({ data = [], isLoading = false }: SalesChartProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Card>
    )
  }

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: '销售额',
        data: data.map(item => item.sales),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      },
      {
        label: '订单数',
        data: data.map(item => item.orders),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.4
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: '销售趋势'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  return (
    <Card className="p-6">
      <Line data={chartData} options={options} />
    </Card>
  )
} 