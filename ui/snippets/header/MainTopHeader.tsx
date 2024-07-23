import {
    Flex,
    Box,
    VStack,
    Icon,
    useColorModeValue,
    Text,
    HStack,
} from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import chevronIcon from 'icons/arrows/east-mini.svg';
import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';
import useHasAccount from 'lib/hooks/useHasAccount';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import NetworkMenu from 'ui/snippets/networkMenu/NetworkMenu';
import NavLink from '../navigation/NavLink';
import NavLinkGroupDesktop from '../navigation/NavLinkGroupDesktop';

//   import NavLink from './NavLink';
//   import NavLinkGroupDesktop from './NavLinkGroupDesktop';

const MainTopHeader = () => {
    const appProps = useAppContext();
    const cookiesString = appProps.cookies;

    const isNavBarCollapsedCookie = cookies.get(
        cookies.NAMES.NAV_BAR_COLLAPSED,
        cookiesString
    );
    let isNavBarCollapsed;
    if (isNavBarCollapsedCookie === 'true') {
        isNavBarCollapsed = true;
    }
    if (isNavBarCollapsedCookie === 'false') {
        isNavBarCollapsed = false;
    }

    const { mainNavItems, accountNavItems } = useNavItems();

    const hasAccount = useHasAccount();

    const [isCollapsed, setCollapsedState] = React.useState<boolean | undefined>(
        isNavBarCollapsed
    );

    const handleTogglerClick = React.useCallback(() => {
        setCollapsedState((flag) => !flag);
        cookies.set(cookies.NAMES.NAV_BAR_COLLAPSED, isCollapsed ? 'false' : 'true');
    }, [isCollapsed]);

    const chevronIconStyles = {
        bgColor: useColorModeValue('white', 'black'),
        color: useColorModeValue('blackAlpha.400', 'whiteAlpha.400'),
        borderColor: 'divider',
    };

    const isExpanded = isCollapsed === false;

    return (
        <Flex
            display={{ base: 'none', lg: 'flex' }}
            position="relative"
            flexDirection="row"
            alignItems="center"
            borderBottom="1px solid"
            borderColor="divider"
            px={6}
            py={4}
            width="100%"
            {...getDefaultTransitionProps({ transitionProperty: 'height, padding' })}
        >

            <Box
                as="header"
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                flexDirection="row"
                width="150px"
                pl={3}
                pr={3}
                h={10}
                transitionProperty="padding"
                transitionDuration="normal"
                transitionTimingFunction="ease"
            >
                <NetworkLogo isCollapsed={isCollapsed} />
                {/* { Boolean(appConfig.featuredNetworks) && <NetworkMenu isCollapsed={ isCollapsed }/> } */}
            </Box>
            <Box as="nav" w="100%" style={{ display: "flex", justifyContent: "end" }}>
                <HStack as="ul" spacing="0" alignItems="center">
                    {mainNavItems.map((item) => {
                        if (isGroupItem(item)) {
                            return (
                                <NavLinkGroupDesktop key={item.text} item={item} isCollapsed={isCollapsed} />
                            );
                        } else {
                            return <NavLink key={item.text} item={item} isCollapsed={isCollapsed} />;
                        }
                    })}
                    <Text
                        style={{
                            color: '#38A169',
                            border: '1px solid #38A169',
                            padding: '2px',
                            width: 'fit-content',
                            borderRadius: '5px',
                            fontSize: '12px',
                            // marginBottom: '5px',
                        }}
                    >
                        Devnet
                    </Text>
                </HStack>

            </Box>
            {hasAccount && (
                <Box as="nav" borderTopWidth="1px" borderColor="divider" w="100%" mt={6} pt={6}>
                    <HStack as="ul" spacing="0" alignItems="center">
                        {accountNavItems.map((item) => (
                            <NavLink key={item.text} item={item} isCollapsed={isCollapsed} />
                        ))}
                    </HStack>
                </Box>
            )}

        </Flex>
    );
};

export default MainTopHeader;
