import React, { useState, useEffect } from 'react';
import { PolarArea } from 'react-chartjs-2';
import Papa from 'papaparse';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PolarAreaController,
    RadialLinearScale,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register the required components with ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    PolarAreaController,
    RadialLinearScale,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export const TeslaDistributionByCity = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Tesla Vehicle Distribution by City',
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(100, 149, 237, 0.6)',
                    'rgba(57, 194, 99, 0.6)',
                    'rgba(153, 50, 204, 0.6)',
                    'rgba(244, 208, 63, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(100, 149, 237, 1)',
                    'rgba(57, 194, 99, 1)',
                    'rgba(153, 50, 204, 1)',
                    'rgba(244, 208, 63, 1)',
                ],
                borderWidth: 1,
            },
        ],
    });

    const [tableData, setTableData] = useState([]);

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
        const teslaData = {};

        data.forEach((row) => {
            if (row.Make === 'TESLA' && row.City) {
                const city = row.City.trim();

                if (!teslaData[city]) {
                    teslaData[city] = 0;
                }

                teslaData[city]++;
            }
        });

        const chartLabels = Object.keys(teslaData);
        const chartDataValues = Object.values(teslaData);

        const sortedData = chartLabels.sort((a, b) => teslaData[b] - teslaData[a]);
        const top10Labels = sortedData.slice(0, 10);
        const top10Values = top10Labels.map((label) => teslaData[label]);

        // Prepare table data
        const tableData = top10Labels.map((label, index) => ({
            city: label,
            count: teslaData[label],
        }));

        if (top10Labels.length > 0 && top10Values.length > 0) {
            setChartData({
                labels: top10Labels,
                datasets: [
                    {
                        label: 'Electric Vehicle Distribution by Make',
                        data: top10Values,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                            'rgba(100, 149, 237, 0.6)',
                            'rgba(57, 194, 99, 0.6)',
                            'rgba(153, 50, 204, 0.6)',
                            'rgba(244, 208, 63, 0.6)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(100, 149, 237, 1)',
                            'rgba(57, 194, 99, 1)',
                            'rgba(153, 50, 204, 1)',
                            'rgba(244, 208, 63, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            });
            setTableData(tableData);  // Set table data
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '40px auto', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center', color: '#333' }}>
                Tesla Electric Vehicle Distribution among Cities
            </h2>
            
            {chartData.labels.length > 0 ? (
                <PolarArea
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Tesla Vehicle Distribution by City',
                                font: {
                                    size: 18,
                                    weight: 'bold',
                                    family: 'Arial, sans-serif',
                                },
                                padding: {
                                    bottom: 20,
                                },
                            },
                        },
                        scales: {
                            r: {
                                grid: {
                                    display: true,
                                },
                                angleLines: {
                                    display: true,
                                },
                                beginAtZero: true,
                            },
                        },
                    }}
                />
            ) : (
                <p style={{ textAlign: 'center', fontSize: '16px', color: '#888' }}>Loading chart data...</p>
            )}

            {/* Table to show Tesla distribution */}
            {tableData.length > 0 && (
                <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h3 style={{ fontSize: '20px', marginBottom: '15px', color: '#333' }}>Top 10 Tesla Vehicle Distribution by City</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>City</th>
                                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Vehicle Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, index) => (
                                <tr
                                    key={index}
                                    style={{
                                        backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9',
                                        cursor: 'pointer',
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e9ecef')}
                                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#fff' : '#f9f9f9')}
                                >
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.city}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
