import './index.scss';
import React from "react";
import { Pie } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import { useState } from 'react';
import { Data } from '../../utils/Data';

Chart.register(CategoryScale);

const GraphsScroll = () => {

    const [chartData, setChartData] = useState({
        labels: Data.map((data) => data.shape),
        datasets: [
            {
                label: "Percentages ",
                data: Data.map((data) => data.percentage),
                backgroundColor: [
                    '#FF7F50',
                    '#F88379',
                    '#1B5366',
                    '#ABE2CF',
                    '#FFB347'
                ],
                bordorColor: "black",
                borderWidth: 2
            }
        ]
    });

    return (
        <div className='chart-container'>
            <Pie
                data={chartData}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: "Different Face Shapes Percentages"
                        }
                    }
                }}
            />
        </div>
    )
}

export default GraphsScroll;
