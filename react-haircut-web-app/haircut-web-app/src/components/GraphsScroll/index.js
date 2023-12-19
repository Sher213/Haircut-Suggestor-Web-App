import './index.scss';
import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import { useState } from 'react';
import { FaceShapes, HairTypes, FaceHeightWidth, HairCutsFrequencyWithin6MonthsMillions2020, WidthForeheadJaw } from '../../utils/Data/data.js';

Chart.register(CategoryScale);

const GraphsScroll = () => {
    const [currentChartIndex, setCurrentChartIndex] = useState(0);

    const chartData = [
        {
            labels: FaceShapes.map((data) => data.shape),
            datasets: [
                {
                    label: 'percentages ',
                    data: FaceShapes.map((data) => data.percentage),
                    backgroundColor: [
                        '#FF7F50',
                        '#F88379',
                        '#1B5366',
                        '#ABE2CF',
                        '#FFB347',
                    ],
                    borderColor: 'black',
                    borderWidth: 2,
                },
            ]
        },
        {
          labels: HairTypes.map((data) => data.type),
          datasets: [
            {
              label: 'percentages ',
              data: HairTypes.map((data) => data.percentage),
              backgroundColor: ['#FF7F50', '#F88379', '#1B5366'],
              borderColor: 'black',
              borderWidth: 2,
            },
          ]
        },
        {
            labels: FaceHeightWidth.map((data) => data.shape),
            datasets: [
              {
                label: 'ratio ',
                data: FaceHeightWidth.map((data) => data.mean),
                backgroundColor: [
                '#FF7F50',
                '#F88379',
                '#1B5366',
                '#ABE2CF',
                '#FFB347'],
                borderColor: 'black',
                borderWidth: 2,
              },
            ]
        },
        {
            labels: WidthForeheadJaw.map((data) => data.shape),
            datasets: [
                {
                    label: 'ratio ',
                    data: WidthForeheadJaw.map((data) => data.mean),
                    backgroundColor: [
                    '#FF7F50',
                    '#F88379',
                    '#1B5366',
                    '#ABE2CF',
                    '#FFB347'],
                    borderColor: 'black',
                    borderWidth: 2,
                },
            ]
        },
        {
            labels: HairCutsFrequencyWithin6MonthsMillions2020.map((data) => data.times),
            datasets: [
                {
                    label: 'Number of people (millions) ',
                    data: HairCutsFrequencyWithin6MonthsMillions2020.map((data) => data.number),
                    backgroundColor: [
                    '#FF7F50',
                    '#F88379',
                    '#1B5366',
                    '#ABE2CF'],
                    borderColor: 'black',
                    borderWidth: 2,
                },
            ]
        }
    ];

    const handleNextChart = () => {
        setCurrentChartIndex((prevIndex) => (prevIndex + 1) % chartData.length);
    };
    
    const handlePrevChart = () => {
        setCurrentChartIndex((prevIndex) =>
          prevIndex === 0 ? chartData.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className='chart-container'>
            {chartData.map((_, index) => (
                <div key={index} style={{ opacity: index === currentChartIndex ? 1 : 0}}>
                    {index === 0 ? (
                    <Pie
                        className='chart'
                        data={chartData[0]}
                        options={{
                        plugins: {
                            title: {
                            display: true,
                            text: 'Different Face Shapes',
                            },
                        },
                        }}
                    />
                    ) : index === 1 ? (
                    <Bar
                        className='chart'
                        data={chartData[1]}
                        options={{
                        plugins: {
                            title: {
                            display: true,
                            text: 'Different Hair Types',
                            },
                        },
                        }}
                    />
                    ) : index === 2 ? (
                    <Bar
                        className='chart'
                        data={chartData[2]}
                        options={{
                        plugins: {
                            title: {
                            display: true,
                            text: 'Mean Face Height to Width Ratio of Face Shapes',
                            },
                        },
                        }}
                    />
                    ) : index === 3 ? (
                    <Bar
                        className='chart'
                        data={chartData[3]}
                        options={{
                        plugins: {
                            title: {
                            display: true,
                            text: 'Mean Forehead to Jaw Width Ratio of Face Shapes',
                            },
                        },
                        }}
                    />
                    ) : (
                    <Bar
                        className='chart'
                        data={chartData[4]}
                        options={{
                        plugins: {
                            title: {
                            display: true,
                            text: 'Frequency of Haircuts within 6 Months in 2020',
                            },
                        },
                        }}
                    />
                    )}
                </div>
            ))}
            <div className='navigation'>
                <button onClick={handlePrevChart}>&lt;</button>
                <div className='chart-circles'>
                    {chartData.map((_, index) => (
                    <span
                    key={index}
                    className={index === currentChartIndex ? 'active-circle' : 'inactive-circle'}
                    onClick={() => setCurrentChartIndex(index)}
                    >&#8226;</span>
                    ))}
                </div>
                <button onClick={handleNextChart}>&gt;</button>
            </div>
      </div>
    )
}

export default GraphsScroll;
