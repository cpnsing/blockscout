import {
  Tr,
  Td,
  Flex,
  Box,
  Tooltip,
  Skeleton,
  useColorModeValue,
} from "@chakra-ui/react";
import BigNumber from "bignumber.js";
import { motion } from "framer-motion";
import { route } from "nextjs-routes";
import React, { useEffect, useMemo, useState } from "react";
import type { Block } from "types/api/block";
import AddressLink from "ui/shared/address/AddressLink";
import useApiQuery from "lib/api/useApiQuery";
import { ADDRESS_COUNTERS, ADDRESS_INFO } from "stubs/address";
import { ethers } from "ethers";
import { formatEther } from "viem";

interface Props {
  data: any;
  isLoading?: boolean;
}

const ValidatorTableItem = ({ data, isLoading }: Props) => {
  const [balance, setBalance] = useState("");

  const addressQuery = useApiQuery("address", {
    pathParams: { hash: data?.address },
    queryOptions: {
      enabled: Boolean(data?.address),
      placeholderData: ADDRESS_INFO,
    },
  });

  const countersQuery = useApiQuery("address_counters", {
    pathParams: { hash: data?.address },
    queryOptions: {
      enabled: Boolean(data?.address) && Boolean(addressQuery.data),
      placeholderData: ADDRESS_COUNTERS,
    },
  });

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://devnet-taral-rpc1.tarality.com"
    );
    const fetchBalance = async () => {
      try {
        const newBalance = await provider.getBalance(data?.address);
        setBalance(formatEther(BigInt(newBalance?.toString())));
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, []);

  return (
    <Tr
      as={motion.tr}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transitionDuration="normal"
      transitionTimingFunction="linear"
      key={data?.address}
    >
      <Td fontSize="sm">
        <Skeleton isLoaded={!isLoading}>
          <AddressLink
            type="address"
            hash={data?.address}
            truncation="constant"
            maxW="100%"
            isLoading={isLoading}
          />
        </Skeleton>
      </Td>
      <Td fontSize="sm">
        <Skeleton isLoaded={!isLoading} display="inline-block">
          {data?.amount} Taral
        </Skeleton>
      </Td>
      <Td fontSize="sm">
        <Skeleton isLoaded={!isLoading} display="inline-block">
          {Number(balance).toFixed(8) || 0} Taral
        </Skeleton>
      </Td>
      <Td fontSize="sm">
        <Skeleton isLoaded={!isLoading} display="inline-block">
          {countersQuery && countersQuery?.data?.validations_count}
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(ValidatorTableItem);
