'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'
import { useTheme } from 'next-themes'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

type SalesChartType = {
  sales: number[]
}

export const SalesChart = ({ sales }: SalesChartType) => {
  const { theme }  = useTheme()
  const highestSale = Math.max(...sales)
  const max = Math.ceil(highestSale / 100) * 100
  const step = max / 4

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // this will hide vertical grid lines
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        max, // this will change the scale
        ticks: {
          stepSize: step,
        },
        grid: {
          display: true, // this will hide horizontal grid lines
          // drawTicks: true,
          drawBorder: false,
          drawOnChartArea: true,
          lineWidth: 1,
          color: function (context: any) {
            return Array.from({ length: 4 })
              .map((_, i) => i * step)
              .includes(context.tick.value)
              ? '#e1e1e1'
              : '#00000000'
          },
        },
      },
    },
  }

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const data = {
    labels,
    datasets: [
      {
        fill: false,
        label: '',
        data: sales,
        borderColor: theme === 'dark' ? '#e1e1e1' : '#000',
        tension: 0.1,
      },
    ],
  }

  return (
    <div>
      <Line options={options} data={data} />
    </div>
  )
}
