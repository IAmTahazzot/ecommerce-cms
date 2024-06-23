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
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

export const options = {
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
      max: 100, // this will change the scale
      ticks: {
        stepSize: 25,
      },
      grid: {
        display: true, // this will hide horizontal grid lines
        // drawTicks: true,
        drawBorder: false,
        drawOnChartArea: true,
        lineWidth: 1,
        color: function (context: any) {
          return [0, 25, 50, 75, 100].includes(context.tick.value) ? '#d9d9d9' : '#00000000'
        },
      },
    },
  },
}

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const data = {
  labels,
  datasets: [
    {
      fill: true,
      label: '',
      data: [],
      borderColor: '#d9d9d9',
      tension: 0.1,
    },
  ],
}

export const SalesChart = () => {
  return (
    <div>
      <Line options={options} data={data} />
    </div>
  )
}
