import React from 'react';
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from './Graph.css'
import { fetchIt } from '../auth/fetchIt';
import { getAPIroot } from '../utilities/getAPIroot';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const APIROOT = getAPIroot();



export const Graph = ({id, name}) => {
    const [labels, setLabels] = useState([])
    const [weights, setWeights] = useState([])

    useEffect(()=>{
        fetchIt(`${APIROOT}weights/rd_summary?resident=${id}`)
        .then((data)=>{
            setLabels(data.weight_history.dates)
            setWeights(data.weight_history.weights)
        })

    },[id])
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: `6 month weight summary for ${name}`,
        },
      },
      scales: {
        x: {
          labels: labels,
          title: {
            display: true,
            text: "Date",
            color: "rgb(82, 124, 148)",
          },
        },
        y: {
          labels: weights,
          title: {
            display: true,
            text: "Weight",
            color: "rgb(82, 124, 148)",
          },
        },
      },
    };

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Weight (lbs)",
          data: weights,
          borderColor: "rgb(82, 124, 148)",
          backgroundColor: "rgb(2, 132, 199, .5)",
        },
      ],
    };
  return (
    <div className="relative mx-auto h-[300px] w-full lg:w-2/3 mt-20 border p-4 border-stone-600/30 sm:shadow-md sm:rounded-lg">
      <Line options={options} data={data} />
    </div>
  );
}
