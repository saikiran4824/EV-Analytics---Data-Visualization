import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Papa from 'papaparse';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register the required components with ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartFromCSV = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Top Electric Range by Make',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1.5,
            },
        ],
    });

    useEffect(() => {
        fetchCSV();
    }, []);

    const fetchCSV = async () => {
        try {
            const response = await fetch('/Electric_Vehicle_Population_Data.csv');
            if (!response.ok) {
                throw new Error(`Failed to fetch CSV file: ${response.statusText}`);
            }

            const reader = response.body.getReader();
            const result = await reader.read();
            const decoder = new TextDecoder('utf-8');
            const csvData = decoder.decode(result.value);

            Papa.parse(csvData, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    processCSVData(result.data);
                },
            });
        } catch (error) {
            console.error("Error fetching or parsing the CSV file:", error);
        }
    };

    const processCSVData = (data) => {
        const makes = {};

        data.forEach(row => {
            if (row.Make && row['Electric Range']) {
                const make = row.Make.trim();
                const range = parseFloat(row['Electric Range']);

                if (makes[make]) {
                    makes[make] = Math.max(makes[make], range);
                } else {
                    makes[make] = range;
                }
            }
        });

        const sortedMakes = Object.entries(makes).sort((a, b) => b[1] - a[1]).slice(0, 10);

        const chartLabels = sortedMakes.map(make => make[0]);
        const chartValues = sortedMakes.map(make => make[1]);

        if (chartLabels.length > 0 && chartValues.length > 0) {
            setChartData({
                labels: chartLabels,
                datasets: [
                    {
                        label: 'Top Electric Range by Make',
                        data: chartValues,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        }
    };

    return (
<div className="container mx-auto p-8 bg-gray-50 rounded-lg shadow-lg">
<div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg my-4 shadow-md">
  <div className="flex flex-col space-y-3">
    <h2 className="text-2xl font-semibold text-gray-800">
      Data Analysis for Electric Vehicles
    </h2>
    <p className="text-gray-600 text-lg">
      The data for this analysis has been extracted from the Electric Vehicle Population Database.
      You can explore the dataset to better understand the distribution of electric vehicles across cities.
    </p>
  </div>

  <a href="/Electric_Vehicle_Population_Data.csv" download="data.csv" className="inline-block px-8 py-4 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400">
    Download the Dataset
  </a>
</div>
 <div className="flex flex-wrap justify-center gap-7">
      {/* Insight 1 */}
      <div className="bg-white shadow-md rounded-lg p-4 w-64">
        <h3 className="text-lg font-bold">Total Electric Vehicles (BEV) & (PHEV)</h3>
        <p className="text-3xl pt-6 font-extrabold text-green-500">50000</p>
      </div>

      {/* Insight 2 */}
      <div className="bg-white shadow-md rounded-lg p-4 w-64">
        <h3 className="text-lg font-bold">Battery Electric Vehicles (BEV)</h3>
        <p className="text-3xl pt-6 font-extrabold text-blue-500"> 39,461</p>
      </div>

      {/* Insight 3 */}
      <div className="bg-white shadow-md rounded-lg p-4 w-64">
        <h3 className="text-lg font-bold">Plug-in Hybrid Electric Vehicles (PHEV)</h3>
        <p className="text-3xl pt-6 font-extrabold text-orange-500">10,539</p>
      </div>
      

      
      {/* Insight 5 */}
      <div className="bg-white shadow-md rounded-lg p-4 w-64">
        <h3 className="text-lg font-bold">Top City By Number of EV</h3>
        <p className="text-3xl font-extrabold pt-2 text-red-500">Seatle</p>
        <p className="text-3xl font-extrabold pt-2  text-blue-500">1663</p>
      </div>

     
      {/* Insight 4 */}
      <div className="bg-white shadow-md rounded-lg p-4 w-64">
        <h3 className="text-lg font-bold">Top Electric Range EV</h3>
        <p className="text-3xl pt-4 font-extrabold text-purple-500">337 miles</p>
        <p className="text-3xl pt-2 font-extrabold text-red-500">Tesla</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 w-64">
        <h3 className="text-lg font-bold">Top Make of Battery Electric Vehicles (BEV)</h3>
        <p className="text-3xl font-extrabold pt-2 text-red-500">Tesla</p>
      
      </div>
      
 

     
    </div>
            <h2 className="text-3xl font-bold text-center text-blue-600 my-6">Top 10 Electric Vehicle Electric Range by Make</h2>
            
            {chartData.labels.length > 0 ? (
                <>
                    <div className="flex justify-center mb-8">
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                scales: {
                                    x: { 
                                        type: 'category',
                                        title: {
                                            display: true,
                                            text: 'Make',
                                            color: 'gray',
                                        },
                                    },
                                    y: { 
                                        type: 'linear',
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Electric Range (miles)',
                                            color: 'gray',
                                        },
                                    },
                                },
                            }}
                        />
                    </div>

                    {/* Table below the chart */}
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-left">Make</th>
                                    <th className="px-4 py-2 text-left">Electric Range (miles)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chartData.labels.map((label, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="px-4 py-2">{label}</td>
                                        <td className="px-4 py-2">{chartData.datasets[0].data[index]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                   
                </>
            ) : (
                <p className="text-center text-gray-500">Loading chart data...</p>
            )}
        </div>
    );
};

export default BarChartFromCSV;
