import BigNumber from 'bignumber.js';
import React from 'react';

import appConfig from 'configs/app/config';
import useApiQuery from 'lib/api/useApiQuery';
import ChartWidget from 'ui/shared/chart/ChartWidget';

interface DataItem {
  date: string;
  value: string;
}

interface ApiResponse {
  items?: DataItem[];
}

interface Props {
  addressHash: string;
}

const AddressCoinBalanceChart = ({ addressHash }: Props) => {
  const { data, isLoading, isError } = useApiQuery<ApiResponse>('address_coin_balance_chart', {
    pathParams: { hash: addressHash },
  });

  const items = React.useMemo(() => {
    return data?.items?.map(({ date, value }) => ({
      date: new Date(date),
      value: new BigNumber(value).div(10 ** appConfig.network.currency.decimals).toNumber(),
    }));
  }, [data?.items]);
  console.log(">>>>>>>>items", items);

  return (
    <ChartWidget
      isError={isError}
      title="Balances"
      items={items}
      isLoading={isLoading}
      h="300px"
      units={appConfig.network.currency.symbol}
    />
  );
};

export default React.memo(AddressCoinBalanceChart);
