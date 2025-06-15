import React, { useEffect, useRef } from 'react';

function Dashboard() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const labels = [];
    const data = [];
    for (let i = 30; i >= 0; i -= 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(d.toISOString().split('T')[0]);
      data.push(Math.floor(Math.random() * 20) + 5);
    }
    const chart = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Packaged Roasted Coffee Sales',
            data,
            borderColor: '#a0522d',
            backgroundColor: 'rgba(160,82,45,0.2)',
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
    return () => chart.destroy();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-3">Dashboard</h2>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default Dashboard;
