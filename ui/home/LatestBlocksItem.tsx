import {
  Box,
  Flex,
  Grid,
  HStack,
  Skeleton,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { route } from 'nextjs-routes';
import React from 'react';

import type { Block } from 'types/api/block';

import appConfig from 'configs/app/config';
import blockIcon from 'icons/block.svg';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import BlockTimestamp from 'ui/blocks/BlockTimestamp';
import AddressLink from 'ui/shared/address/AddressLink';
import Icon from 'ui/shared/chakra/Icon';
import LinkInternal from 'ui/shared/LinkInternal';

type Props = {
  block: Block;
  h: number;
  isLoading?: boolean;
  reward: any
}
const calculateValue = (height: number): number => {
  // Calculate the initial value
  const initialValue = height / 34560;

  // Round up to the nearest whole number if the value is not an integer
  const roundedValue = Math.ceil(initialValue);

  // Multiply the result by 34560
  const finalValue = roundedValue * 34560;

  return finalValue;
};

const LatestBlocksItem = ({ block, h, isLoading, reward }: Props) => {
  const totalReward = getBlockTotalReward(block);
  // const result = calculateValue(blockHeight);
  return (
    <Box
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transitionDuration="normal"
      transitionTimingFunction="linear"
      borderRadius="12px"
      border="1px solid"
      borderColor="divider"
      p={6}
      h={`${h + 30}px`}
      minWidth={{ base: '100%', lg: '280px' }}
    >
      <Flex justifyContent="space-between" alignItems="center" mb={3}>
        <HStack spacing={2}>
          <Icon as={blockIcon} boxSize="30px" color="link" isLoading={isLoading} borderRadius="base" />
          <LinkInternal
            href={route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(block.height) } })}
            fontSize="xl"
            fontWeight="500"
            isLoading={isLoading}
          >
            <Skeleton isLoaded={!isLoading}>
              {block.height}
            </Skeleton>
          </LinkInternal>
        </HStack>
        <BlockTimestamp ts={block.timestamp} isEnabled={!isLoading} isLoading={isLoading} fontSize="sm" />
      </Flex>
      <Grid gridGap={1} templateColumns="auto minmax(0, 1fr)" fontSize="sm">
        <Skeleton isLoaded={!isLoading}>Txn</Skeleton>
        <Skeleton isLoaded={!isLoading} color="text_secondary"><span>{block.tx_count}</span></Skeleton>
        {!appConfig.L2.isL2Network && (
          <>
            <Skeleton isLoaded={!isLoading}>Reward</Skeleton>
            <Skeleton isLoaded={!isLoading} color="text_secondary"><span style={{ whiteSpace: "pre" }}>{Number(reward).toFixed(8)} Taral</span></Skeleton>
            <Skeleton isLoaded={!isLoading}>Validator</Skeleton>
            <AddressLink type="address" alias={block.miner.name} hash={block.miner.hash} truncation="constant" maxW="100%" isLoading={isLoading} />
            <Skeleton isLoaded={!isLoading}>Next H.B</Skeleton>
            <Skeleton isLoaded={!isLoading} color="text_secondary"><span>{calculateValue(block.height)} </span></Skeleton>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default LatestBlocksItem;
