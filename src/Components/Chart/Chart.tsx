import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import ChartJS, { ChartType } from 'chart.js/auto';

const ChartContainer = styled.div`
  width: 100%;
  cursor: grabbing;
`;
const ChartCanvas = styled.canvas``;

interface Props {
  data: number[],
  labels: string[],
  options?: {},
  changePrice?: (e: any) => void,
}

export const Chart:React.FC<Props> = ({
  data: chartData,
  labels,
  options,
  changePrice,
}) => {
  const chartElement = useRef(null);

  useEffect(() => {
    // Initial load, if our element exists and we have data
    if (chartElement.current !== null && chartData.length) {
      // Put together chart data
      const data = {
        labels,
        datasets: [{
          data: chartData,
          borderColor: '#04F1ED',
          pointHitRadius: 2,
          radius: 0,
        }]
      };
      const customPlugins = [
        {
          id: 'drawLineAndDarken',
          afterDraw: (chart: ChartJS) => {
            const activeElements = chart.tooltip?.getActiveElements() || [];
            if (activeElements && activeElements.length) {
              const target = activeElements[0];
              let x = target.element.x;
              let yAxis = chart.scales.y;
              let ctx = chart.ctx;
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(x, yAxis.top);
              ctx.lineTo(x, yAxis.bottom);
              ctx.lineWidth = 1;
              ctx.strokeStyle = '#FFFFFF';
              ctx.stroke();
              // Create shadow to darken rest of chart
              ctx.globalCompositeOperation='source-atop';
              ctx.fillStyle = 'rgba(0, 0, 0, 0.70)';
              ctx.fillRect(x, yAxis.top - 10, 900, yAxis.bottom);
              ctx.restore();
            }
          },
        },
        {
          id: 'mouseOutResetValue',
          beforeEvent(chart: any, args: any, pluginOptions: any) {
            const event = args.event;
            if (event.type === 'mouseout') {
              const lastDataValue = chartData[chartData.length - 1];
              if (changePrice) changePrice(lastDataValue);
            }
          }
        },
      ];
      // Options to use if none are passed in
      const defaultOptions = {
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          y: { ticks: { display: false } },
          x: { ticks: { display: false } },
        },
        responsive: true,
        plugins:{
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: 'transparent',
            callbacks: {
              label: (data: {formattedValue: number}) => {
                if (changePrice) changePrice(data.formattedValue);
              }
            },
          },
        },
      };
      // Use passed or default options
      const finalOptions = options || defaultOptions;
      // Full config object to use (TODO: Move more of these options to args)
      const config = { type: 'line' as ChartType, data, options: finalOptions, plugins: customPlugins };
      // Build the chart
      new ChartJS(chartElement.current!, config);
    }
  }, [chartData, labels, options]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ChartContainer>
      <ChartCanvas ref={chartElement} width="311" height="311" />
    </ChartContainer>
  );
};
