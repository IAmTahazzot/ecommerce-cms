'use client'

import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export const data = {
  labels: ['Spain', 'Portugal', 'Other'],
  datasets: [
    {
      data: [60, 30, 10],
      backgroundColor: ['rgba(0, 0, 0, 1)', 'rgba(0, 135, 250, 1)', 'rgba(0, 0, 0, .15)'],
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 1)',
      borderRadius: 5,
    },
  ],
}

const options = {
  plugins: {
    legend: {
      position: 'bottom',
      align: 'center',
      labels: {
        boxWidth: 0,
        padding: 4,
      },
    },
  },
} satisfies ChartOptions

export const TrafficView = () => {
  return <Doughnut data={data} options={options} />
}
