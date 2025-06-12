
import { useEffect, useRef } from 'react';

export const ProgressChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current && window.echarts) {
      const chart = window.echarts.init(chartRef.current);
      
      const option = {
        animation: false,
        series: [{
          type: 'pie',
          radius: ['70%', '90%'],
          avoidLabelOverlap: false,
          label: {
            show: false
          },
          emphasis: {
            scale: false
          },
          data: [
            { value: 68, name: 'Progresso', itemStyle: { color: '#57B5E7' } },
            { value: 32, name: 'Restante', itemStyle: { color: '#F0F0F0' } }
          ]
        }]
      };
      
      chart.setOption(option);
      
      const handleResize = () => chart.resize();
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };
    }
  }, []);

  useEffect(() => {
    // Load ECharts script if not already loaded
    if (!window.echarts) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/echarts/5.5.0/echarts.min.js';
      script.onload = () => {
        if (chartRef.current) {
          const chart = window.echarts.init(chartRef.current);
          
          const option = {
            animation: false,
            series: [{
              type: 'pie',
              radius: ['70%', '90%'],
              avoidLabelOverlap: false,
              label: {
                show: false
              },
              emphasis: {
                scale: false
              },
              data: [
                { value: 68, name: 'Progresso', itemStyle: { color: '#57B5E7' } },
                { value: 32, name: 'Restante', itemStyle: { color: '#F0F0F0' } }
              ]
            }]
          };
          
          chart.setOption(option);
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  return <div ref={chartRef} className="w-32 h-32" />;
};
