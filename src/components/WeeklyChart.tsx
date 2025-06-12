
import { useEffect, useRef } from 'react';

export const WeeklyChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current && window.echarts) {
      const chart = window.echarts.init(chartRef.current);
      
      const option = {
        animation: false,
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderColor: '#eee',
          borderWidth: 1,
          textStyle: {
            color: '#1f2937'
          }
        },
        legend: {
          data: ['Treinos', 'Calorias', 'Peso'],
          bottom: 0,
          textStyle: {
            color: '#1f2937'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
          axisLine: {
            lineStyle: {
              color: '#eee'
            }
          },
          axisLabel: {
            color: '#1f2937'
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#1f2937'
          },
          splitLine: {
            lineStyle: {
              color: '#eee'
            }
          }
        },
        series: [
          {
            name: 'Treinos',
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 3,
              color: '#57B5E7'
            },
            symbol: 'none',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(87, 181, 231, 0.2)'
                }, {
                  offset: 1, color: 'rgba(87, 181, 231, 0)'
                }]
              }
            },
            data: [1, 1, 0, 1, 1, 0, 0]
          },
          {
            name: 'Calorias',
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 3,
              color: '#8DD3C7'
            },
            symbol: 'none',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(141, 211, 199, 0.2)'
                }, {
                  offset: 1, color: 'rgba(141, 211, 199, 0)'
                }]
              }
            },
            data: [2800, 2750, 2900, 2850, 2800, 3000, 2900]
          },
          {
            name: 'Peso',
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 3,
              color: '#FBBF72'
            },
            symbol: 'none',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(251, 191, 114, 0.2)'
                }, {
                  offset: 1, color: 'rgba(251, 191, 114, 0)'
                }]
              }
            },
            data: [78.2, 78.3, 78.4, 78.5, 78.5, 78.6, 78.5]
          }
        ]
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
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderColor: '#eee',
              borderWidth: 1,
              textStyle: {
                color: '#1f2937'
              }
            },
            legend: {
              data: ['Treinos', 'Calorias', 'Peso'],
              bottom: 0,
              textStyle: {
                color: '#1f2937'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '15%',
              top: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
              axisLine: {
                lineStyle: {
                  color: '#eee'
                }
              },
              axisLabel: {
                color: '#1f2937'
              }
            },
            yAxis: {
              type: 'value',
              axisLine: {
                show: false
              },
              axisLabel: {
                color: '#1f2937'
              },
              splitLine: {
                lineStyle: {
                  color: '#eee'
                }
              }
            },
            series: [
              {
                name: 'Treinos',
                type: 'line',
                smooth: true,
                lineStyle: {
                  width: 3,
                  color: '#57B5E7'
                },
                symbol: 'none',
                areaStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0, color: 'rgba(87, 181, 231, 0.2)'
                    }, {
                      offset: 1, color: 'rgba(87, 181, 231, 0)'
                    }]
                  }
                },
                data: [1, 1, 0, 1, 1, 0, 0]
              },
              {
                name: 'Calorias',
                type: 'line',
                smooth: true,
                lineStyle: {
                  width: 3,
                  color: '#8DD3C7'
                },
                symbol: 'none',
                areaStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0, color: 'rgba(141, 211, 199, 0.2)'
                    }, {
                      offset: 1, color: 'rgba(141, 211, 199, 0)'
                    }]
                  }
                },
                data: [2800, 2750, 2900, 2850, 2800, 3000, 2900]
              },
              {
                name: 'Peso',
                type: 'line',
                smooth: true,
                lineStyle: {
                  width: 3,
                  color: '#FBBF72'
                },
                symbol: 'none',
                areaStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0, color: 'rgba(251, 191, 114, 0.2)'
                    }, {
                      offset: 1, color: 'rgba(251, 191, 114, 0)'
                    }]
                  }
                },
                data: [78.2, 78.3, 78.4, 78.5, 78.5, 78.6, 78.5]
              }
            ]
          };
          
          chart.setOption(option);
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  return <div ref={chartRef} className="h-72" />;
};
