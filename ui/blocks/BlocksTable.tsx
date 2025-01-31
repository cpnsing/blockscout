import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import capitalize from 'lodash/capitalize';
import React, { useEffect, useState } from 'react';

import type { Block } from 'types/api/block';

import appConfig from 'configs/app/config';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import BlocksTableItem from 'ui/blocks/BlocksTableItem';
import { default as Thead } from 'ui/shared/TheadSticky';
import { weiToEth } from 'ui/home/indicators/eth_conversion';
import axios from 'axios';

const ETH_RPC_URL = 'https://devnet-taral-rpc1.tarality.com';

interface EthRpcResponse {
  id: number;
  jsonrpc: string;
  result: any;
}
interface Props {
  data: Array<Block>;
  isLoading?: boolean;
  top: number;
  page: number;
}

const BlocksTable = ({ data, isLoading, top, page }: Props) => {
  const [reward, setReward] = useState(0)

  const getLatestBlock = async (): Promise<EthRpcResponse> => {
    try {
      const response = await axios.post<EthRpcResponse>(ETH_RPC_URL, {
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_getBlockByNumber',
        params: ['latest'], // Include full transaction objects (second param is 'true')
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setReward(weiToEth(response?.data?.result?.BlockReward))
      return response.data;
    } catch (error) {

      console.error('Error fetching the latest block:', error);
      throw new Error('Failed to fetch the latest block');
    }
  };

  useEffect(() => {
    getLatestBlock()
  }, [])
  return (
    <Table variant="simple" minWidth="1040px" size="md" fontWeight={500}>
      <Thead top={top}>
        <Tr>
          <Th width="125px">Block</Th>
          <Th width="120px">Size, bytes</Th>
          <Th width={appConfig.L2.isL2Network ? '37%' : '21%'} minW="144px">{capitalize(getNetworkValidatorTitle())}</Th>
          <Th width="64px" isNumeric>Txn</Th>
          <Th width={appConfig.L2.isL2Network ? '63%' : '35%'}>Gas used</Th>
          {!appConfig.L2.isL2Network && <Th width="22%">Block Reward {appConfig.network.currency.symbol}</Th>}
          {!appConfig.L2.isL2Network && <Th width="22%">Burnt fees {appConfig.network.currency.symbol}</Th>}
        </Tr>
      </Thead>
      <Tbody>
        <AnimatePresence initial={false}>
          {data.map((item, index) => (
            <BlocksTableItem
              key={item.height + (isLoading ? `${index}_${page}` : '')}
              data={item}
              enableTimeIncrement={page === 1 && !isLoading}
              isLoading={isLoading}
              reward={reward}
            />
          ))}
        </AnimatePresence>
      </Tbody>
    </Table>
  );
};

export default BlocksTable;
