import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import ChartJS, { ChartType, ChartOptions } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { COLORS } from 'theme';
import { useAssetChart } from 'redux/hooks';

const ChartContainer = styled.div`
  width: 100%;
  cursor: grabbing;
`;
const ChartCanvas = styled.canvas``;

interface Props {
  options?: ChartOptions;
  type?: ChartType;
}

export const Chart: React.FC<Props> = ({
  options: chartOptions = {},
  type: chartType = 'line',
}) => {
  const { values, labels, valueDiffs, valueDiffPercents, setAssetChartData } =
    useAssetChart();

  const chartElement = useRef(null);
  useEffect(() => {
    // Initial load, if our element exists and we have data
    if (chartElement.current !== null && values.length) {
      // Put together chart data
      const data = {
        labels: labels,
        datasets: [
          {
            data: values,
            borderColor: COLORS.SECONDARY_300,
            pointHitRadius: 2,
            radius: 0,
          },
        ],
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
              ctx.strokeStyle = COLORS.WHITE;
              ctx.stroke();
              // Create shadow to darken rest of chart
              ctx.globalCompositeOperation = 'source-atop';
              ctx.fillStyle = COLORS.BLACK_70;
              ctx.fillRect(x, yAxis.top, 900, yAxis.bottom + 100);
              ctx.restore();
            }
          },
        },
        {
          id: 'mouseOutResetValue',
          beforeEvent(chart: any, args: any) {
            const event = args.event;
            if (event.type === 'mouseout') {
              // Pull all the end values from the chart arrays to set as current value
              const lastDataValue = values[values.length - 1];
              const latestDate = labels[labels.length - 1];
              const latestDiff = valueDiffs[valueDiffs.length - 1];
              const latestDiffPercent =
                valueDiffPercents[valueDiffPercents.length - 1];
              // Update assetChart store values
              setAssetChartData({
                currentAssetValue: lastDataValue,
                currentDate: latestDate,
                currentPriceChange: latestDiff,
                currentPriceChangePercent: latestDiffPercent,
              });
            }
          },
        },
      ];
      const options = {
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          y: { ticks: { display: false }, grid: { display: false } },
          x: {
            type: 'time',
            time: { unit: 'hour' },
            ticks: { display: false },
            grid: { display: false },
          },
        },
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: false,
            external: function () {},
            callbacks: {
              label: (data: { raw: number; dataIndex: number }) => {
                setAssetChartData({
                  currentAssetValue: data.raw,
                  currentPriceChange: valueDiffs[data.dataIndex],
                  currentPriceChangePercent: valueDiffPercents[data.dataIndex],
                  currentDate: labels[data.dataIndex],
                });
              },
            },
          },
        },
        ...chartOptions,
      };
      // Full config object to use
      const config = {
        type: chartType as ChartType,
        data,
        options: options as ChartOptions,
        plugins: customPlugins,
      };
      // Build the chart
      new ChartJS(chartElement.current!, config);
    }
  }, [values]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ChartContainer>
      <ChartCanvas ref={chartElement} />
    </ChartContainer>
  );
};
