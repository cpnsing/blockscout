"use client"
import { Box, Heading, Flex, Text, VStack, Skeleton } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { route } from 'nextjs-routes';
import React, { useEffect, useState } from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Block } from 'types/api/block';

import appConfig from 'configs/app/config';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import { nbsp } from 'lib/html-entities';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { BLOCK } from 'stubs/block';
import { HOMEPAGE_STATS } from 'stubs/stats';
import LinkInternal from 'ui/shared/LinkInternal';

import LatestBlocksItem from './LatestBlocksItem';
import { weiToEth } from './indicators/eth_conversion';
import axios from 'axios';

const BLOCK_HEIGHT_L1 = 166;
const BLOCK_HEIGHT_L2 = 112;
const BLOCK_MARGIN = 12;
const ETH_RPC_URL = 'https://devnet-taral-rpc1.tarality.com';

interface EthRpcResponse {
  id: number;
  jsonrpc: string;
  result: any;
}

const LatestBlocks = () => {
  const [reward, setReward] = useState(0)

  const blockHeight = appConfig.L2.isL2Network ? BLOCK_HEIGHT_L2 : BLOCK_HEIGHT_L1;
  const isMobile = useIsMobile();
  // const blocksMaxCount = isMobile ? 2 : 3;

  // function to get reward

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



  let blocksMaxCount: number;
  if (appConfig.L2.isL2Network) {
    blocksMaxCount = isMobile ? 4 : 5;
  } else {
    blocksMaxCount = isMobile ? 2 : 3;
  }
  const { data, isPlaceholderData, isError } = useApiQuery('homepage_blocks', {
    queryOptions: {
      placeholderData: Array(4).fill(BLOCK),
    },
  });

  const queryClient = useQueryClient();
  const statsQueryResult = useApiQuery('homepage_stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const handleNewBlockMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData(getResourceKey('homepage_blocks'), (prevData: Array<Block> | undefined) => {

      const newData = prevData ? [...prevData] : [];

      if (newData.some((block => block.height === payload.block.height))) {
        return newData;
      }

      return [payload.block, ...newData].sort((b1, b2) => b2.height - b1.height).slice(0, blocksMaxCount);
    });
  }, [queryClient, blocksMaxCount]);

  const channel = useSocketChannel({
    topic: 'blocks:new_block',
    isDisabled: isPlaceholderData || isError,
  });
  useSocketMessage({
    channel,
    event: 'new_block',
    handler: handleNewBlockMessage,
  });

  let content;

  if (isError) {
    content = <Text>No data. Please reload page.</Text>;
  }

  if (data) {
    const dataToShow = data.slice(0, blocksMaxCount);
    const blocksCount = dataToShow.length;

    content = (
      <>
        {statsQueryResult.data?.network_utilization_percentage !== undefined && (
          <Skeleton isLoaded={!statsQueryResult.isPlaceholderData} mb={{ base: 6, lg: 3 }} display="inline-block">
            <Text as="span" fontSize="sm">
              Network utilization:{nbsp}
            </Text>
            <Text as="span" fontSize="sm" color="blue.400" fontWeight={700}>
              {statsQueryResult.data?.network_utilization_percentage.toFixed(2)}%
            </Text>
          </Skeleton>
        )}
        <VStack spacing={`${BLOCK_MARGIN}px`} mb={4} height={`${blockHeight * blocksCount + BLOCK_MARGIN * (blocksCount - 1)}px`} overflow="hidden">
          <AnimatePresence initial={false} >
            {dataToShow.map(((block, index) => (
              <LatestBlocksItem
                key={block.height + (isPlaceholderData ? String(index) : '')}
                block={block}
                h={blockHeight}
                isLoading={isPlaceholderData}
                reward={reward}
              />
            )))}
          </AnimatePresence>
        </VStack>
        <Flex justifyContent="center">
          <LinkInternal fontSize="sm" href={route({ pathname: '/blocks' })}>View all blocks</LinkInternal>
        </Flex>
      </>
    );
  }

  return (
    <Box width={{ base: '100%', lg: '280px' }}>
      <Heading as="h4" size="sm" mb={4}>Latest blocks</Heading>
      {content}
    </Box>
  );
};

export default LatestBlocks;
