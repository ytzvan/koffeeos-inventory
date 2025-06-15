import React, { useEffect, useRef } from 'react';

function ProductSalesPie() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const chart = new window.Chart(ctx, {
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

    return () => chart.destroy();
  }, []);

  return (
    <div className="bg-white rounded shadow-md p-4 h-64">
      <h3 className="text-center mb-2">Sales by Product Type</h3>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

export default ProductSalesPie;
