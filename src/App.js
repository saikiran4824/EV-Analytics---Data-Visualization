import React from 'react';
import BarChartFromCSV from './components/BarChartFromCSV';
import BarChartFromCSVCity from './components/BarChartFromCSVCity';
import DoughnutChartFromCSV from './components/DoughnutChartFromCSV';
import { TeslaDistributionByCity } from './components/TeslaDistributionByCity';

const App = () => {
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header with gradient text */}
      <h2 className="text-4xl font-bold text-center text-blue-800 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent py-8 px-6 shadow-lg rounded-lg border-4 border-blue-700 mb-10">
        Electric Vehicle Revolution: The Future of Transportation
      </h2>

      {/* Container for all the charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 mx-20">
        
        {/* Chart 1: Bar Chart from CSV */}
        <div className="flex justify-center items-center bg-white shadow-md rounded-lg p-4">
          <BarChartFromCSV className="w-full " />
        </div>

        {/* Chart 2: Bar Chart by City */}
        <div className="flex justify-center items-center bg-white shadow-md rounded-lg ">
          <BarChartFromCSVCity className="w-full" />
        </div>

        {/* Chart 3: Doughnut Chart from CSV */}
        <div className="flex justify-center items-center bg-white shadow-md rounded-lg p-4">
          <DoughnutChartFromCSV className="w-full " />
        </div>

        {/* Chart 4: Tesla Distribution by City */}
        <div className="flex justify-center items-center bg-white shadow-md rounded-lg p-4">
          <TeslaDistributionByCity className="w-full" />
        </div>

      </div>
    </div>
  );
};

export default App;
