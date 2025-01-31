import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

import useColors from './useColors';

type Props = {
  isExpanded?: boolean;
  isCollapsed?: boolean;
  isActive?: boolean;
  px?: string | number;
}

export default function useNavLinkProps({ isExpanded, isCollapsed, isActive }: Props) {
  const colors = useColors();

  return {
    itemProps: {
      py: 2.5,
      display: 'flex',
      color: isActive ? colors.text.active : colors.text.default,
      bgColor: isActive ? colors.bg.active : colors.bg.default,
      _hover: { color: isActive ? colors.text.active : colors.text.hover },
      borderRadius: 'base',
      ...getDefaultTransitionProps({ transitionProperty: 'width, padding' }),
    },
    textProps: {
      variant: 'inherit',
      fontSize: 'sm',
      lineHeight: '20px',
      opacity: "1",
      // opacity: { base: '1', lg: isExpanded ? '1' : '0', xl: isCollapsed ? '0' : '1' },
      transitionProperty: 'opacity',
      transitionDuration: 'normal',
      transitionTimingFunction: 'ease',
    },
  };
}
