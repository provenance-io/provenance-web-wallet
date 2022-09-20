import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import ChartJS, { ChartType, ChartOptions } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import type {
  ChartValueDiffsType,
  ChartValuesType,
  ChartLabelsType,
  ChangeValueType,
  ChartValueDiffPercentsType,
  TimePeriodType,
} from 'types';
import { COLORS } from 'theme';

const ChartContainer = styled.div`
  width: 100%;
  cursor: grabbing;
`;
const ChartCanvas = styled.canvas``;

interface Props {
  values: ChartValuesType;
  labels: ChartLabelsType;
  diffs: ChartValueDiffsType;
  diffPercents: ChartValueDiffPercentsType;
  options?: ChartOptions;
  type?: string;
  timePeriod: TimePeriodType;
  onValueChange?: ChangeValueType;
}

export const Chart: React.FC<Props> = ({
  values: chartValues,
  labels: chartLabels,
  diffs: chartValueDiffs,
  diffPercents: chartValueDiffPercents,
  options: chartOptions = {},
  type: chartType = 'line',
  timePeriod,
  onValueChange,
}) => {
  const chartElement = useRef(null);
  useEffect(() => {
    // Initial load, if our element exists and we have data
    if (chartElement.current !== null && chartValues.length) {
      // Put together chart data
      const data = {
        labels: chartLabels,
        datasets: [
          {
            data: chartValues,
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
              const lastDataValue = chartValues[chartValues.length - 1];
              const latestDate = chartLabels[chartLabels.length - 1];
              const latestDiff = chartValueDiffs[chartValueDiffs.length - 1];
              const latestDiffPercent =
                chartValueDiffPercents[chartValueDiffPercents.length - 1];
              if (onValueChange)
                onValueChange({
                  value: lastDataValue,
                  date: latestDate,
                  diff: latestDiff,
                  diffPercent: latestDiffPercent,
                  timePeriod,
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
                if (onValueChange)
                  onValueChange({
                    value: data.raw,
                    diff: chartValueDiffs[data.dataIndex],
                    diffPercent: chartValueDiffPercents[data.dataIndex],
                    date: chartLabels[data.dataIndex],
                    timePeriod,
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
  }, [chartValues]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ChartContainer>
      <ChartCanvas ref={chartElement} />
    </ChartContainer>
  );
};
