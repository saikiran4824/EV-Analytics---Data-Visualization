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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartFromCSVCity = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Number of Cars by City',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
        complete: (result) => processCSVData(result.data),
      });
    } catch (error) {
      console.error("Error fetching or parsing the CSV file:", error);
    }
  };

  const processCSVData = (data) => {
    const cityData = {};

    data.forEach(row => {
      if (row.City) {
        const city = row.City.trim();
        cityData[city] = (cityData[city] || 0) + 1;
      }
    });

    const sortedData = Object.entries(cityData).sort((a, b) => b[1] - a[1]);
    const top10 = sortedData.slice(0, 10);
    const labels = top10.map(([city]) => city);
    const values = top10.map(([, count]) => count);

    // Set data for the chart
    setChartData({
      labels,
      datasets: [
        {
          label: 'Number of Cars by City',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    });

    // Set data for the table
    setTableData(top10.map(([city, count]) => ({ city, count })));
  };

  return (
    <div className="w-full rounded-md mx-5 border-gray-300 bg-white px-5 pt-7 pb-5 shadow-lg">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <h2 className="font-semibold text-primary text-xl">Top 10 Cities by Number of Cars</h2>
      </div>

      <div className="-ml-5">
        {chartData.labels.length > 0 ? (
          <>
            {/* Chart Container */}
            <div className="w-full mb-6">
              <Bar
                data={chartData}
                options={{
                  indexAxis: 'y',
                  responsive: true,
                  scales: {
                    y: { type: 'category' },
                    x: { type: 'linear', beginAtZero: true },
                  },
                }}
              />
            </div>

            {/* Table Data */}
            <div className="mt-6 mx-5">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Table Data (City and Number of Cars):</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-left text-gray-700">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 font-semibold text-gray-800">City</th>
                      <th className="px-4 py-2 font-semibold text-gray-800">Number of Cars</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((data, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">{data.city}</td>
                        <td className="px-4 py-2">{data.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <p>Loading chart and table data...</p>
        )}
      </div>
    </div>
  );
};

export default BarChartFromCSVCity;
