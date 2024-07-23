import { Box, Grid, Flex, Text, Link, VStack, Skeleton, Button, Icon } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { WALLETS_INFO } from 'lib/web3/wallets';
import type { CustomLinksGroup } from 'types/footerLinks';

import appConfig from 'configs/app/config';
import discussionsIcon from 'icons/discussions.svg';
import editIcon from 'icons/edit.svg';
import discordIcon from 'icons/social/discord.svg';
import gitIcon from 'icons/social/git.svg';
import facebook_filled from 'icons/social/facebook_filled.svg';
import linkedin_filled from 'icons/social/linkedin_filled.svg';
import redit_filled from 'icons/social/reddit_filled.svg';
import twitterIcon from 'icons/social/tweet.svg';
import type { ResourceError } from 'lib/api/resources';
import useFetch from 'lib/hooks/useFetch';
import useIssueUrl from 'lib/hooks/useIssueUrl';
import NetworkAddToWallet from 'ui/shared/NetworkAddToWallet';
import useToast from 'lib/hooks/useToast';
import useProvider from 'lib/web3/useProvider';
import ColorModeToggler from '../header/ColorModeToggler';
import FooterLinkItem from './FooterLinkItem';
import { addRpcChain } from './metamask';

const MAX_LINKS_COLUMNS = 3;

const API_VERSION_URL = `https://github.com/blockscout/blockscout/tree/${appConfig.blockScoutVersion}`;
// const FRONT_VERSION_URL = `https://github.com/blockscout/frontend/tree/${ appConfig.frontendVersion }`;

const Footer = () => {

  const issueUrl = useIssueUrl();
  const BLOCSKOUT_LINKS = [


    {
      icon: twitterIcon,
      iconSize: '18px',
      text: 'Twitter',
      url: 'https://twitter.com/taralitycoin?lang=en',
    },

    {
      icon: facebook_filled,
      iconSize: '20px',
      text: 'Facebbok',
      url: 'https://www.facebook.com/TaralityCoin/',
    },
    {
      icon: linkedin_filled,
      iconSize: '20px',
      text: 'Linkedin',
      url: 'https://in.linkedin.com/company/tarality',
    },
    {
      icon: redit_filled,
      iconSize: '20px',
      text: 'Reddit',
      url: 'https://www.reddit.com/user/taralityecosystem/?rdt=47750',
    },
  ];

  const fetch = useFetch();

  const { isLoading, data: linksData } = useQuery<unknown, ResourceError<unknown>, Array<CustomLinksGroup>>(
    ['footer-links'],
    async () => fetch(appConfig.footerLinks || ''),
    {
      enabled: Boolean(appConfig.footerLinks),
      staleTime: Infinity,
    });
  const toast = useToast();
  const provider = useProvider();
  const hexadecimalChainId = '0x' + Number(appConfig.network.id).toString(16);
  const chainParams = {
    chainId: hexadecimalChainId,
    chainName: appConfig.network.name,
    nativeCurrency: {
      name: appConfig.network.currency.name,
      symbol: appConfig.network.currency.symbol,
      decimals: appConfig.network.currency.decimals,
    },
    rpcUrls: [appConfig.network.rpcUrl],
    blockExplorerUrls: [appConfig.baseUrl],
  };
  const handleAddChain = async () => {
    try {
      const result = await addRpcChain(chainParams);
      console.log(">>>>>>result", result);
      let check = result === "Chain is already added" ? false : true
      toast({
        position: 'top-right',
        title: !check ? 'Error' : 'Success',
        description: result,
        status: !check ? 'error' : 'success',
        variant: 'subtle',
        isClosable: true,
      });
      // setStatus(result);
    } catch (error) {
      console.log(">>>>>>result", error);
      toast({
        position: 'top-right',
        title: 'Error',
        description: (error as Error)?.message || 'Something went wrong',
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
      // setStatus('Error adding chain');
    }
  };

  const handleClick = React.useCallback(async () => {
    try {
      const hexadecimalChainId = '0x' + Number(appConfig.network.id).toString(16);
      console.log(">>>>>>>>>>>hexadecimalChainId", appConfig);

      const config = {
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: hexadecimalChainId,
          chainName: appConfig.network.name,
          nativeCurrency: {
            name: appConfig.network.currency.name,
            symbol: appConfig.network.currency.symbol,
            decimals: appConfig.network.currency.decimals,
          },
          rpcUrls: [appConfig.network.rpcUrl],
          blockExplorerUrls: [appConfig.baseUrl],
        }],
        // in wagmi types for wallet_addEthereumChain method is not provided
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;
      await provider?.request?.(config);
      toast({
        position: 'top-right',
        title: 'Success',
        description: 'Successfully added network to your wallet',
        status: 'success',
        variant: 'subtle',
        isClosable: true,
      });
    } catch (error) {
      toast({
        position: 'top-right',
        title: 'Error',
        description: (error as Error)?.message || 'Something went wrong',
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
    }
  }, [provider, toast]);
  const defaultWallet = appConfig.web3.defaultWallet;



  return (
    <Flex direction={{ base: 'column', lg: 'row' }} p={{ base: 4, lg: 9 }} borderTop="1px solid" borderColor="divider">
      <Box flexGrow="1" mb={{ base: 8, lg: 0 }}>
        <Flex>
          <ColorModeToggler />
          {/* <NetworkAddToWallet ml={8} /> */}
        </Flex>
        <Box mt={{ base: 5, lg: '44px' }}>

        </Box>
        <Text mt={3} mr={{ base: 0, lg: '114px' }} maxW={{ base: 'unset', lg: '470px' }} fontSize="xs">
          Tarality innovative halving-based POS ensures token scarcity and value preservation. With regular halving every four years, our network maintains economic stability while incentivizing long-term investment.
        </Text>

        <VStack spacing={1} mt={6} alignItems="start">
          {/* <NetworkAddToWallet ml={8} /> */}
          <Button variant="outline" size="sm" onClick={handleAddChain}>
            <Icon as={WALLETS_INFO[defaultWallet].icon} boxSize={5} mr={2} />
            Add {appConfig.network.name}</Button>
        </VStack>
      </Box>
      <Grid
        gap={{ base: 6, lg: 12 }}
        gridTemplateColumns={appConfig.footerLinks ?
          { base: 'repeat(auto-fill, 160px)', lg: `repeat(${(linksData?.length || MAX_LINKS_COLUMNS) + 1}, 160px)` } :
          'auto'
        }
      >
        <Box minW="160px" w={appConfig.footerLinks ? '160px' : '100%'}>
          {appConfig.footerLinks && <Text fontWeight={500} mb={3}>Blockscout</Text>}
          <Grid
            gap={1}
            gridTemplateColumns={appConfig.footerLinks ? '160px' : { base: 'repeat(auto-fill, 160px)', lg: 'repeat(3, 160px)' }}
            gridTemplateRows={{ base: 'auto', lg: appConfig.footerLinks ? 'auto' : 'repeat(2, auto)' }}
            gridAutoFlow={{ base: 'row', lg: appConfig.footerLinks ? 'row' : 'column' }}
            mt={{ base: 0, lg: appConfig.footerLinks ? 0 : '100px' }}
          >
            {BLOCSKOUT_LINKS.map(link => <FooterLinkItem {...link} key={link.text} />)}
          </Grid>
        </Box>
        {appConfig.footerLinks && isLoading && (
          Array.from(Array(3)).map((i, index) => (
            <Box minW="160px" key={index}>
              <Skeleton w="120px" h="20px" mb={6} />
              <VStack spacing={5} alignItems="start" mb={2}>
                {Array.from(Array(5)).map((i, index) => <Skeleton w="160px" h="14px" key={index} />)}
              </VStack>
            </Box>
          ))
        )}
        {appConfig.footerLinks && linksData && (
          linksData.slice(0, MAX_LINKS_COLUMNS).map(linkGroup => (
            <Box minW="160px" key={linkGroup.title}>
              <Text fontWeight={500} mb={3}>{linkGroup.title}</Text>
              <VStack spacing={1} alignItems="start">
                {linkGroup.links.map(link => <FooterLinkItem {...link} key={link.text} />)}
              </VStack>
            </Box>
          ))
        )}
      </Grid>
    </Flex>
  );
};

export default Footer;
