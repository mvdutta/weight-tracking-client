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


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



export const Graph = ({id, name}) => {
    const [labels, setLabels] = useState([])
    const [weights, setWeights] = useState([])

    useEffect(()=>{
        fetchIt(`http://localhost:8000/weights/rd_summary?resident=${id}`)
        .then((data)=>{
            console.log(data.weight_history.dates)
            console.log(data.weight_history.weights);
            setLabels(data.weight_history.dates)
            setWeights(data.weight_history.weights)
            // const lastSix = data.slice(-6);
            // setLabels(lastSix.map(el=>el.date))
            // setWeights(lastSix.map(el=>parseFloat(el.weight)))
        })

    },[])
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: `Weight data for ${name}`,
        },
      },
    };

    const data = {
      labels:labels,
      datasets: [
        {
          label: "Dataset 1",
          data: weights,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
  return (
  <div className='relative w-[600px] mx-auto'>
      <Line options={options} data={data} />
  </div>
  )
}
