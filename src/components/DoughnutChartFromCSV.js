import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import Papa from 'papaparse';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the required components with ChartJS
ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);

const DoughnutChartFromCSV = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Electric Vehicle Distribution',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
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
    const cityData = {};

    data.forEach((row) => {
      if (row.City && row.Make) {
        const city = row.City.trim();
        const make = row.Make.trim();

        if (!cityData[city]) {
          cityData[city] = {};
        }

        if (!cityData[city][make]) {
          cityData[city][make] = 0;
        }

        cityData[city][make]++;
      }
    });

    const chartLabels = [];
    const chartDataValues = [];
    const tableRows = [];

    Object.keys(cityData).forEach((city) => {
      Object.keys(cityData[city]).forEach((make) => {
        chartLabels.push(`${city} - ${make}`);
        chartDataValues.push(cityData[city][make]);
        tableRows.push({ city: city, make: make, count: cityData[city][make] });
      });
    });

    const top10Data = chartLabels.slice(0, 10);
    const top10Values = chartDataValues.slice(0, 10);
    const top10Rows = tableRows.slice(0, 10);

    if (top10Data.length > 0 && top10Values.length > 0) {
      setChartData({
        labels: top10Data,
        datasets: [
          {
            label: 'Electric Vehicle Distribution',
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
      setTableData(top10Rows); // Set the table data for the top 10 rows
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Top 10 Electric Vehicle Distribution by City and Make
      </h2>

      {chartData.labels.length > 0 ? (
        <>
          <div className="mb-6">
            <Doughnut
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>

          {/* Table displaying city, make, and number of cars */}
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full table-auto text-sm text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-800">City</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-800">Make</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-800">Number of Cars</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((data, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-6 py-3">{data.city}</td>
                    <td className="px-6 py-3">{data.make}</td>
                    <td className="px-6 py-3">{data.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="text-center">Loading chart and table data...</p>
      )}
    </div>
  );
};

export default DoughnutChartFromCSV;
