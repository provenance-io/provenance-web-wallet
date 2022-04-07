import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ChartType } from 'chart.js';
import ChartJS from 'chart.js/auto';

const ChartContainer = styled.div``;
const ChartCanvas = styled.canvas``;

interface Props {
  data: string[],
  labels: string[],
  options?: {},
}

export const Chart:React.FC<Props> = ({
  data: chartData,
  labels,
  options,
}) => {
  const chartElement = useRef(null);
  // const [existingChartJS, setExistingChartJS] = useState<ChartJS>();
  
  useEffect(() => {
    // Initial load, if our element exists and chart hasn't loaded yet
    if (chartElement.current !== null && chartData.length) {
      // Destroy previous chart
      // if (existingChartJS) existingChartJS.destroy();
      // const hourLabels = [
      //   '12AM','1AM','2AM','3AM','4AM','5AM','6AM','7AM','8AM','9AM','10AM','11AM',
      //   '12PM','1PM','2PM','3PM','4PM','5PM','6PM','7PM','8PM','9PM','10PM','11PM',
      // ];
      // const dayLabels = [];
      // const weekLabels = [];
      // const yearLabels = [];
      const data = {
        labels,
        datasets: [{
          data: chartData,
          borderColor: '#243250',
        }]
      };
      const defaultOptions = {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      };

      const config = { type: 'line' as ChartType, data, options: options || defaultOptions };
      // Build the chart
      // const chartJS = new ChartJS(chartElement.current!, config);
      new ChartJS(chartElement.current!, config);
      // setExistingChartJS(chartJS);
    }
  // }, [chartData, labels, options, existingChartJS]);
  }, [chartData, labels, options]);

  return (
    <ChartContainer>
      <ChartCanvas ref={chartElement} width="400" height="400" />
    </ChartContainer>
  );
};
