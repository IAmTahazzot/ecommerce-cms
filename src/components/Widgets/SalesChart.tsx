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
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
  scales: {
    x: {
      grid: {
        display: false, // this will hide vertical grid lines
      },
    },
    y: {
      grid: {
        display: false, // this will hide horizontal grid lines
      },
    },
  }
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      fill: false,
      label: '', 
      data: labels.map(() => Math.floor(Math.random() * 100)),
      borderColor: "#000",
      // backgroundColor: "#ddd",
      tension: 0.4,
    },
  ],
};

export const SalesChart = () => {
  return (
    <div>
      <Line options={options} data={data} />
    </div>
  );
};
