import React, { useEffect, useRef } from 'react';

function WeeklySalesChart() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const data = labels.map(() => Math.floor(Math.random() * 100) + 50);
    const chart = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Sales by Week',
            data,
            borderColor: '#a0522d',
            backgroundColor: 'rgba(160,82,45,0.2)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => chart.destroy();
  }, []);

  return (
    <div className="bg-white rounded shadow-md p-6 h-64">
      <h3 className="text-center mb-2">Total Sales by Week</h3>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

export default WeeklySalesChart;
