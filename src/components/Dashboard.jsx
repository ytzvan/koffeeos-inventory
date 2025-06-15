import React, { useEffect, useRef } from 'react';

function Dashboard() {
  const lineRef = useRef(null);
  const pieRef = useRef(null);

  useEffect(() => {
    const lineCtx = lineRef.current.getContext('2d');
    const lineLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const lineData = lineLabels.map(() => Math.floor(Math.random() * 100) + 50);

    const lineChart = new window.Chart(lineCtx, {
      type: 'line',
      data: {
        labels: lineLabels,
        datasets: [
          {
            label: 'Total Sales by Week',
            data: lineData,
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

    const pieCtx = pieRef.current.getContext('2d');
    const pieChart = new window.Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: ['Roasted Coffee 200g', 'Milk Drinks', 'Pour Over'],
        datasets: [
          {
            data: [45, 25, 30],
            backgroundColor: ['#a0522d', '#c0a16b', '#deb887'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    });

    return () => {
      lineChart.destroy();
      pieChart.destroy();
    };
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow-md w-full max-w-md space-y-6">
      <h2 className="text-xl font-semibold mb-3">Dashboard</h2>
      <div className="h-64 w-full">
        <h3 className="text-center mb-2">Total Sales by Week</h3>
        <canvas ref={lineRef} className="w-full h-full" />
      </div>
      <div className="h-64 w-full">
        <h3 className="text-center mb-2">Sales by Product Type</h3>
        <canvas ref={pieRef} className="w-full h-full" />
      </div>
    </div>
  );
}

export default Dashboard;
