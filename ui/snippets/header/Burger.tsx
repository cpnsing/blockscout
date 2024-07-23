import { Icon, Box, Flex, Drawer, DrawerOverlay, DrawerContent, DrawerBody, useColorModeValue, useDisclosure, Text } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import burgerIcon from 'icons/burger.svg';
import testnetIcon from 'icons/testnet.svg';
import mainnetIcon from 'icons/files/placeholder.svg';
import NavigationMobile from 'ui/snippets/navigation/NavigationMobile';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import NetworkMenuButton from 'ui/snippets/networkMenu/NetworkMenuButton';
import NetworkMenuContentMobile from 'ui/snippets/networkMenu/NetworkMenuContentMobile';
import useNetworkMenu from 'ui/snippets/networkMenu/useNetworkMenu';

const Burger = () => {
  const iconColor = useColorModeValue('gray.600', 'white');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const networkMenu = useNetworkMenu();

  const handleNetworkMenuButtonClick = React.useCallback(() => {
    networkMenu.onToggle();
  }, [networkMenu]);

  const handleNetworkLogoClick = React.useCallback((event: React.SyntheticEvent) => {
    networkMenu.isOpen && event.preventDefault();
    networkMenu.onClose();
  }, [networkMenu]);

  return (
    <>
      <Box padding={2} onClick={onOpen}>
        <Icon
          as={burgerIcon}
          boxSize={6}
          display="block"
          color={iconColor}
          aria-label="Menu button"
        />
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        autoFocus={false}
      >
        <DrawerOverlay />
        <DrawerContent maxWidth="260px">
          <DrawerBody p={6} display="flex" flexDirection="column">
            <Text style={{
              color: "#38A169", border: "1px solid #38A169", padding: "2px", width: "fit-content",
              borderRadius: "5px",
              fontSize: "12px",
              marginBottom: "5px"
            }}>Devnet</Text>
            {/* {appConfig.network.isTestnet && <Icon as={mainnetIcon} h="14px" w="auto" color="red.400" alignSelf="flex-start" />} */}
            <Flex alignItems="center" justifyContent="space-between">
              <NetworkLogo onClick={handleNetworkLogoClick} />
              {/* { appConfig.featuredNetworks ? (
                <NetworkMenuButton
                  isMobile
                  isActive={ networkMenu.isOpen }
                  onClick={ handleNetworkMenuButtonClick }
                />
              ) : <Box boxSize={ 9 }/> } */}
            </Flex>
            {networkMenu.isOpen ? <NetworkMenuContentMobile tabs={networkMenu.availableTabs} items={networkMenu.data} /> : <NavigationMobile />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Burger;
