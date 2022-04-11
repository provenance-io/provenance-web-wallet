import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import ChartJS, { ChartType } from 'chart.js/auto';

const ChartContainer = styled.div`
  width: 100%;
`;
const ChartCanvas = styled.canvas``;

interface Props {
  data: number[],
  labels: string[],
  options?: {},
}

export const Chart:React.FC<Props> = ({
  data: chartData,
  labels,
  options,
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
          pointHoverBackgroundColor: '#A5F2FE',
          pointHitRadius: 2,
          radius: 6,
        }]
      };
      const customPlugins = [{
        id: 'customPlugins',
        afterDraw: (chart: ChartJS) => {
          const activeElements = chart.tooltip?.getActiveElements();
          if (activeElements && activeElements.length) {
            const target = activeElements[0];
            let x = target.element.x;
            let yAxis = chart.scales.y;
            let ctx = chart.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, yAxis.top);
            ctx.lineTo(x, yAxis.bottom);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#27497D';
            ctx.stroke();
            ctx.restore();
          }
        }
      }];
      // Options to use if none are passed in
      const defaultOptions = {
        interaction: {
          mode: 'index',
          intersect: false,
        },
        responsive: true,
        plugins:{
          legend: { display: false },
          tooltip: { displayColors: false, padding: 10 },
        },
      };
      // Use passed or default options
      const finalOptions = options || defaultOptions;
      // Full config object to use (TODO: Move more of these options to args)
      const config = { type: 'line' as ChartType, data, options: finalOptions, plugins: customPlugins };
      // Build the chart
      new ChartJS(chartElement.current!, config);
    }
  }, [chartData, labels, options]);

  return (
    <ChartContainer>
      <ChartCanvas ref={chartElement} width="400" height="400" />
    </ChartContainer>
  );
};
