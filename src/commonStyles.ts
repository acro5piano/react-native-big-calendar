import { Platform, StyleSheet } from 'react-native'

export const MIN_HEIGHT = 1200
export const HOUR_GUIDE_WIDTH = 50
export const OVERLAP_OFFSET = Platform.OS === 'web' ? 20 : 8
export const OVERLAP_PADDING = Platform.OS === 'web' ? 3 : 0

export const eventCellCss = StyleSheet.create({
  style: {
    zIndex: 100,
    borderRadius: 3,
    padding: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    minWidth: '33%',
  },
})

/*
 * Utility-first CSS.
 */
export const u = StyleSheet.create({
  /*
   * Flex
   */
  flex: {
    flexDirection: 'row',
  },
  'flex-row': {
    flexDirection: 'row',
  },
  'flex-row-reverse': {
    flexDirection: 'row-reverse',
  },
  'flex-column': {
    flexDirection: 'column',
  },
  'flex-1': {
    flex: 1,
  },
  'justify-between': {
    justifyContent: 'space-between',
  },
  'justify-center': {
    justifyContent: 'center',
  },
  'items-center': {
    alignItems: 'center',
  },
  'self-center': {
    alignSelf: 'center',
  },

  /*
   * Border
   */
  'border-l': {
    borderLeftWidth: 1,
  },
  'border-t': {
    borderTopWidth: 1,
  },
  'border-b': {
    borderBottomWidth: 1,
  },
  'border-b-2': {
    borderBottomWidth: 2,
  },
  'border-r': {
    borderRightWidth: 1,
  },

  /*
   * Spacing
   */
  'mt-2': {
    marginTop: 2,
  },
  'mt-4': {
    marginTop: 4,
  },
  'mt-6': {
    marginTop: 6,
  },
  'mb-6': {
    marginBottom: 6,
  },
  'mx-3': {
    marginLeft: 3,
    marginRight: 3,
  },
  'p-2': {
    padding: 2,
  },
  'p-8': {
    padding: 8,
  },
  'pt-2': {
    paddingTop: 2,
  },
  'py-2': {
    paddingVertical: 2,
  },
  'px-6': {
    paddingHorizontal: 6,
  },
  'pb-6': {
    paddingBottom: 6,
  },

  /*
   * Text
   */
  'text-center': {
    textAlign: 'center',
  },

  /*
   * Radius
   */
  rounded: {
    borderRadius: 3,
  },
  'rounded-full': {
    borderRadius: 9999,
  },

  /*
   * Z Index
   */
  'z-0': {
    zIndex: 0,
  },
  'z-10': {
    zIndex: 10,
  },
  'z-20': {
    zIndex: 20,
  },

  /*
   * Width
   */
  'w-36': {
    width: 36,
  },
  'w-50': {
    width: 50,
  },
  'h-36': {
    height: 36,
  },

  /*
   * Misc
   */
  'overflow-hidden': {
    overflow: 'hidden',
  },
  absolute: {
    position: 'absolute',
  },
  truncate:
    Platform.OS === 'web'
      ? {
          overflow: 'hidden',
          // textOverflow: 'ellipsis',
          // whiteSpace: 'nowrap',
        }
      : {},
})
