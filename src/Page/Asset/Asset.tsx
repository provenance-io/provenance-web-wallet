import { useParams } from 'react-router-dom';
import { useAssetChart } from 'redux/hooks';
import { FooterNav, Content, ScrollContainer } from 'Components';
import { AssetHeader } from './AssetHeader';
import { AssetChart } from './AssetChart';
import { AssetChartOptions } from './AssetChartOptions';
import { AssetTxs } from './AssetTxs';

export const Asset: React.FC = () => {
  // Pull assetChart data from redux store
  const { setAssetChartData } = useAssetChart();
  // Which asset are we graphing
  const { assetName } = useParams();
  if (assetName) {
    setAssetChartData({ assetName });
  }

  return assetName ? (
    <Content padBottom="80px">
      <ScrollContainer height="470px">
        <AssetHeader />
        <AssetChart />
        <AssetChartOptions />
        <AssetTxs />
      </ScrollContainer>
      <FooterNav />
    </Content>
  ) : null;
};
