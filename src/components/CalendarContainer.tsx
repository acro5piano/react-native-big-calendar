import dayjs from 'dayjs'
import React from 'react'
import { Animated, TextStyle, ViewStyle } from 'react-native'

import { MIN_HEIGHT } from '../commonStyles'
import {
  DateRangeHandler,
  EventCellStyle,
  EventRenderer,
  HeaderRenderer,
  HorizontalDirection,
  ICalendarEventBase,
  LayoutRectangleExtended,
  Mode,
  MonthHeaderRenderer,
  WeekNum,
} from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import {
  getDatesInMonth,
  getDatesInNextCustomDays,
  getDatesInNextOneDay,
  getDatesInNextThreeDays,
  getDatesInWeek,
  isAllDayEvent,
  modeToNum,
  typedMemo,
} from '../utils'
import { CalendarBody } from './CalendarBody'
import { CalendarBodyForMonthView } from './CalendarBodyForMonthView'
import { CalendarHeader } from './CalendarHeader'
import { CalendarHeaderForMonthView } from './CalendarHeaderForMonthView'

export interface CalendarContainerProps<T extends ICalendarEventBase> {
  /**
   * Events to be rendered. This is a required prop.
   */
  events: T[]

  /**
   * The height of calendar component. This is a required prop.
   */
  height: number

  /**
   * The height of each hour row.
   */
  hourRowHeight?: number

  /**
   * Adjusts the indentation of events that occur during the same time period. Defaults to 20 on web and 8 on mobile.
   */
  overlapOffset?: number

  // Custom style
  eventCellStyle?: EventCellStyle<T>
  calendarContainerStyle?: ViewStyle
  headerContainerStyle?: ViewStyle
  headerContentStyle?: ViewStyle
  dayHeaderStyle?: ViewStyle
  dayHeaderHighlightColor?: string
  weekDayHeaderHighlightColor?: string
  bodyContainerStyle?: ViewStyle

  // Custom renderer
  renderEvent?: EventRenderer<T>
  renderHeader?: HeaderRenderer<T>
  renderHeaderForMonthView?: MonthHeaderRenderer

  ampm?: boolean
  date?: Date
  locale?: string
  hideNowIndicator?: boolean
  mode?: Mode
  scrollOffsetMinutes?: number
  showTime?: boolean

  swipeEnabled?: boolean
  weekStartsOn?: WeekNum
  onChangeDate?: DateRangeHandler
  onPressCell?: (date: Date) => void
  onPressDateHeader?: (date: Date) => void
  onPressEvent?: (event: T) => void
  weekEndsOn?: WeekNum
  maxVisibleEventCount?: number
  eventMinHeightForMonthView?: number
  activeDate?: Date
  headerComponent?: React.ReactElement | null
  headerComponentStyle?: ViewStyle
  hourStyle?: TextStyle
  showAllDayEventCell?: boolean
  showHeaderPan?: boolean
  panLeftContainerStyle?: ViewStyle
  panLeftStyle?: TextStyle
  panLeftComponent?: React.ReactElement | null
  panRightContainerStyle?: ViewStyle
  panRightStyle?: TextStyle
  panRightComponent?: React.ReactElement | null
  topHeaderComponent?: React.ReactElement | null
  topHeaderComponentStyle?: ViewStyle
  showWeekDayModes?: Mode[]
  showWeekDayInnerModes?: Mode[]
  showShortWeekDayModes?: Mode[]
  weekDayStyle?: TextStyle
  datesArrayStyle?: ViewStyle
  showDatesArrayStyleModes?: Mode[]
  cellsBorderStyle?: ViewStyle
  fullHeaderStyle?: ViewStyle
  fullBodyStyle?: ViewStyle
  increaseFirstRowHeight?: number
  animatePan?: boolean
  fadeInDuration?: number
}

function _CalendarContainer<T extends ICalendarEventBase>({
  events,
  height,
  hourRowHeight,
  ampm = false,
  date,
  eventCellStyle,
  locale = 'en',
  hideNowIndicator = false,
  mode = 'week',
  overlapOffset,
  scrollOffsetMinutes = 0,
  showTime = true,
  headerContainerStyle = {},
  headerContentStyle = {},
  dayHeaderStyle = {},
  dayHeaderHighlightColor = '',
  weekDayHeaderHighlightColor = '',
  bodyContainerStyle = {},
  swipeEnabled = true,
  weekStartsOn = 0,
  onChangeDate,
  onPressCell,
  onPressDateHeader,
  onPressEvent,
  renderEvent,
  renderHeader: HeaderComponent = CalendarHeader,
  renderHeaderForMonthView: HeaderComponentForMonthView = CalendarHeaderForMonthView,
  weekEndsOn = 6,
  maxVisibleEventCount = 3,
  eventMinHeightForMonthView = 22,
  activeDate,
  headerComponent = null,
  headerComponentStyle = {},
  hourStyle = {},
  showAllDayEventCell = true,
  showHeaderPan = false,
  panLeftContainerStyle = {},
  panLeftStyle = {},
  panLeftComponent = null,
  panRightContainerStyle = {},
  panRightStyle = {},
  panRightComponent = null,
  topHeaderComponent = null,
  topHeaderComponentStyle = {},
  showWeekDayModes = ['3days', 'custom', 'day', 'month', 'week'],
  showWeekDayInnerModes = [],
  showShortWeekDayModes = [],
  weekDayStyle = {},
  datesArrayStyle = {},
  showDatesArrayStyleModes = [],
  cellsBorderStyle = {},
  fullHeaderStyle = {},
  fullBodyStyle = {},
  increaseFirstRowHeight = 1,
  animatePan = false,
  fadeInDuration = 0,
}: CalendarContainerProps<T>) {
  const [targetDate, setTargetDate] = React.useState(dayjs(date))
  const [showWeekDay, setShowWeekDay] = React.useState(true)
  const [showWeekDayInner, setShowWeekDayInner] = React.useState(false)
  const [showShortWeekDay, setShowShortWeekDay] = React.useState(false)
  const [showDatesArrayStyle, setShowDatesArrayStyle] = React.useState(false)
  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const fadeAnim = React.useRef(new Animated.Value(1)).current
  const prevFadeAnim = React.useRef(new Animated.Value(0)).current
  const presentFadeAnim = React.useRef(new Animated.Value(1)).current
  const nextFadeAnim = React.useRef(new Animated.Value(0)).current
  const prevLeftValue = React.useRef(new Animated.Value(0)).current
  const presentLeftValue = React.useRef(new Animated.Value(0)).current
  const nextLeftValue = React.useRef(new Animated.Value(0)).current
  const leftValue = React.useRef<LayoutRectangleExtended>()
  const currentPrevLeftVal = React.useRef<number>()
  const currentPresentLeftVal = React.useRef<number>()
  const currentNextLeftVal = React.useRef<number>()

  React.useEffect(() => {
    if (date) {
      setTargetDate(dayjs(date))
    }
  }, [date])

  const allDayEvents = React.useMemo(
    () => events.filter((event) => isAllDayEvent(event.start, event.end)),
    [events],
  )

  const daytimeEvents = React.useMemo(
    () => events.filter((event) => !isAllDayEvent(event.start, event.end)),
    [events],
  )

  const dateRange = React.useMemo(() => {
    switch (mode) {
      case 'month':
        const monthPrevRange = getDatesInMonth(targetDate.subtract(1, 'month'), locale)
        const monthRange = getDatesInMonth(targetDate, locale)
        const monthNextRange = getDatesInMonth(targetDate.add(1, 'month'), locale)
        return [monthPrevRange, monthRange, monthNextRange]
      case 'week':
        const weekPrevRange = getDatesInWeek(targetDate.subtract(7, 'day'), weekStartsOn, locale)
        const weekRange = getDatesInWeek(targetDate, weekStartsOn, locale)
        const weekNextRange = getDatesInWeek(targetDate.add(7, 'day'), weekStartsOn, locale)
        return [weekPrevRange, weekRange, weekNextRange]
      case '3days':
        const threeDaysPrevRange = getDatesInNextThreeDays(targetDate.subtract(3, 'day'), locale)
        const threeDaysRange = getDatesInNextThreeDays(targetDate, locale)
        const threeDaysNextRange = getDatesInNextThreeDays(targetDate.add(3, 'day'), locale)
        return [threeDaysPrevRange, threeDaysRange, threeDaysNextRange]
      case 'day':
        const oneDayPrevRange = getDatesInNextOneDay(targetDate.subtract(1, 'day'), locale)
        const oneDayRange = getDatesInNextOneDay(targetDate, locale)
        const oneDayNextRange = getDatesInNextOneDay(targetDate.add(1, 'day'), locale)
        return [oneDayPrevRange, oneDayRange, oneDayNextRange]
      case 'custom':
        const days = Math.abs(weekStartsOn - weekEndsOn)
        const customPrevRange = getDatesInNextCustomDays(
          targetDate.subtract(days, 'day'),
          weekStartsOn,
          weekEndsOn,
          locale,
        )
        const customRange = getDatesInNextCustomDays(targetDate, weekStartsOn, weekEndsOn, locale)
        const customNextRange = getDatesInNextCustomDays(
          targetDate.add(days, 'day'),
          weekStartsOn,
          weekEndsOn,
          locale,
        )
        return [customPrevRange, customRange, customNextRange]
      default:
        throw new Error(
          `[react-native-big-calendar] The mode which you specified "${mode}" is not supported.`,
        )
    }
  }, [mode, targetDate, locale, weekEndsOn, weekStartsOn])

  React.useEffect(() => {
    if (onChangeDate) {
      onChangeDate([dateRange[1][0].toDate(), dateRange[1].slice(-1)[0].toDate()])
    }
  }, [dateRange, onChangeDate])

  const cellHeight = React.useMemo(
    () => hourRowHeight || Math.max(height - 30, MIN_HEIGHT) / 24,
    [height, hourRowHeight],
  )

  React.useEffect(() => {
    if (mode != null) {
      if (showWeekDayModes != null) setShowWeekDay(showWeekDayModes.includes(mode))
      if (showWeekDayInnerModes != null) setShowWeekDayInner(showWeekDayInnerModes.includes(mode))
      if (showShortWeekDayModes != null) setShowShortWeekDay(showShortWeekDayModes.includes(mode))
      if (showDatesArrayStyleModes != null)
        setShowDatesArrayStyle(showDatesArrayStyleModes.includes(mode))
    }
  }, [
    mode,
    showWeekDayModes,
    showWeekDayInnerModes,
    showShortWeekDayModes,
    showDatesArrayStyleModes,
  ])

  const theme = useTheme()

  const handleLeftValue = (layout: LayoutRectangleExtended) => {
    leftValue.current = layout
  }

  React.useEffect(() => {
    const idprev = prevLeftValue.addListener((value) => {
      currentPrevLeftVal.current = value.value
    })
    const idpres = presentLeftValue.addListener((value) => {
      currentPresentLeftVal.current = value.value
    })
    const idnext = nextLeftValue.addListener((value) => {
      currentNextLeftVal.current = value.value
    })
    return () => {
      prevLeftValue.removeListener(idprev)
      presentLeftValue.removeListener(idpres)
      nextLeftValue.removeListener(idnext)
    }
  }, [prevLeftValue, presentLeftValue, nextLeftValue])

  const movePrevBody = (direction: HorizontalDirection) => {
    const width = leftValue.current?.width || 0
    const presentcurrent = currentPresentLeftVal.current || 0

    // Step 1: move to the left and hide
    Animated.timing(presentLeftValue, {
      // toValue: width / 3,
      toValue: width,
      duration: fadeInDuration,
      useNativeDriver: false,
    }).start()
    Animated.timing(presentFadeAnim, {
      toValue: 0,
      duration: fadeInDuration,
      useNativeDriver: false,
    }).start(() => {
      // Step 2: move quickly to the left to starting point
      Animated.timing(presentLeftValue, {
        // toValue: presentcurrent - width / 3,
        toValue: presentcurrent - width,
        duration: 0.01,
        useNativeDriver: false,
      }).start(() => {
        // Step 3: recalculate calendar and show
        onPanLeftCallback(direction)
        Animated.timing(presentLeftValue, {
          // toValue: width / 3,
          toValue: presentcurrent,
          duration: fadeInDuration,
          useNativeDriver: false,
        }).start()
        Animated.timing(presentFadeAnim, {
          toValue: 1,
          duration: fadeInDuration,
          useNativeDriver: false,
        }).start()
      })
    })
  }

  const moveNextBody = (direction: HorizontalDirection) => {
    const width = leftValue.current?.width || 0
    const presentcurrent = currentPresentLeftVal.current || 0

    // Step 1: move to the left and hide
    Animated.timing(presentLeftValue, {
      // toValue: width / 3,
      toValue: -width,
      duration: fadeInDuration,
      useNativeDriver: false,
    }).start()
    Animated.timing(presentFadeAnim, {
      toValue: 0,
      duration: fadeInDuration,
      useNativeDriver: false,
    }).start(() => {
      // Step 2: move quickly to the left to starting point
      Animated.timing(presentLeftValue, {
        // toValue: presentcurrent - width / 3,
        toValue: presentcurrent + width,
        duration: 0.01,
        useNativeDriver: false,
      }).start(() => {
        // Step 3: recalculate calendar and show
        onPanLeftCallback(direction)
        Animated.timing(presentLeftValue, {
          // toValue: width / 3,
          toValue: -presentcurrent,
          duration: fadeInDuration,
          useNativeDriver: false,
        }).start()
        Animated.timing(presentFadeAnim, {
          toValue: 1,
          duration: fadeInDuration,
          useNativeDriver: false,
        }).start()
      })
    })
  }

  const onSwipeHorizontalCallback = React.useCallback(
    (direction: HorizontalDirection) => {
      if (!swipeEnabled) {
        return
      }
      if ((direction === 'LEFT' && !theme.isRTL) || (direction === 'RIGHT' && theme.isRTL)) {
        setTargetDate(targetDate.add(modeToNum(mode, targetDate), 'day'))
      } else {
        setTargetDate(targetDate.add(modeToNum(mode, targetDate) * -1, 'day'))
      }
    },
    [swipeEnabled, targetDate, mode, theme.isRTL],
  )

  const onSwipeHorizontal = (direction: HorizontalDirection) => {
    if (animatePan === true) {
      if ((direction === 'LEFT' && !theme.isRTL) || (direction === 'RIGHT' && theme.isRTL)) {
        movePrevBody(direction)
      } else {
        moveNextBody(direction)
      }
    } else {
      onSwipeHorizontalCallback(direction)
    }
  }

  const onPanLeftCallback = React.useCallback(
    (direction: HorizontalDirection) => {
      if (!swipeEnabled) {
        return
      }
      if (direction === 'LEFT' && !theme.isRTL) {
        setTargetDate(targetDate.add(modeToNum(mode, targetDate) * -1, 'day'))
      } else {
        setTargetDate(targetDate.add(modeToNum(mode, targetDate), 'day'))
      }
    },
    [swipeEnabled, targetDate, mode, theme.isRTL],
  )

  const onPanLeft = (direction: HorizontalDirection) => {
    if (animatePan === true) {
      movePrevBody(direction)
    } else {
      onPanLeftCallback(direction)
    }
  }

  const onPanRightCallback = React.useCallback(
    (direction: HorizontalDirection) => {
      if (!swipeEnabled) {
        return
      }
      if (direction === 'RIGHT' && !theme.isRTL) {
        setTargetDate(targetDate.add(modeToNum(mode, targetDate), 'day'))
      } else {
        setTargetDate(targetDate.add(modeToNum(mode, targetDate) * -1, 'day'))
      }
    },
    [swipeEnabled, targetDate, mode, theme.isRTL],
  )

  const onPanRight = (direction: HorizontalDirection) => {
    if (animatePan === true) {
      moveNextBody(direction)
    } else {
      onPanRightCallback(direction)
    }
  }

  const commonProps = {
    cellHeight,
    dateRange,
    mode,
    onPressEvent,
  }

  if (mode === 'month') {
    const headerProps = {
      style: headerContainerStyle,
      locale: locale,
      weekStartsOn: weekStartsOn,
      headerContentStyle: headerContentStyle,
      dayHeaderStyle: dayHeaderStyle,
      dayHeaderHighlightColor: dayHeaderHighlightColor,
      weekDayHeaderHighlightColor: weekDayHeaderHighlightColor,
      showAllDayEventCell: showAllDayEventCell,
      showHeaderPan: showHeaderPan,
      panLeft: onPanLeft,
      panRight: onPanRight,
      panLeftContainerStyle: panLeftContainerStyle,
      panLeftStyle: panLeftStyle,
      panLeftComponent: panLeftComponent,
      panRightContainerStyle: panRightContainerStyle,
      panRightStyle: panRightStyle,
      panRightComponent: panRightComponent,
      topHeaderComponent: topHeaderComponent,
      topHeaderComponentStyle: topHeaderComponentStyle,
      showWeekDay: showWeekDay,
      showWeekDayInner: showWeekDayInner,
      showShortWeekDay: showShortWeekDay,
      weekDayStyle: weekDayStyle,
      datesArrayStyle: datesArrayStyle,
      showDatesArrayStyle: showDatesArrayStyle,
      fullHeaderStyle: fullHeaderStyle,
    }
    return (
      <React.Fragment>
        <HeaderComponentForMonthView {...headerProps} />
        <CalendarBodyForMonthView<T>
          {...commonProps}
          style={bodyContainerStyle}
          containerHeight={height}
          events={[...daytimeEvents, ...allDayEvents]}
          eventCellStyle={eventCellStyle}
          weekStartsOn={weekStartsOn}
          hideNowIndicator={hideNowIndicator}
          onPressCell={onPressCell}
          onPressEvent={onPressEvent}
          onSwipeHorizontal={onSwipeHorizontal}
          renderEvent={renderEvent}
          targetDate={targetDate}
          maxVisibleEventCount={maxVisibleEventCount}
          eventMinHeightForMonthView={eventMinHeightForMonthView}
        />
      </React.Fragment>
    )
  }

  const headerProps = {
    ...commonProps,
    style: headerContainerStyle,
    allDayEvents: allDayEvents,
    onPressDateHeader: onPressDateHeader,
    activeDate,
    headerContentStyle: headerContentStyle,
    dayHeaderStyle: dayHeaderStyle,
    dayHeaderHighlightColor: dayHeaderHighlightColor,
    weekDayHeaderHighlightColor: weekDayHeaderHighlightColor,
    showAllDayEventCell: showAllDayEventCell,
    showHeaderPan: showHeaderPan,
    panLeft: onPanLeft,
    panRight: onPanRight,
    panLeftContainerStyle: panLeftContainerStyle,
    panLeftStyle: panLeftStyle,
    panLeftComponent: panLeftComponent,
    panRightContainerStyle: panRightContainerStyle,
    panRightStyle: panRightStyle,
    panRightComponent: panRightComponent,
    topHeaderComponent: topHeaderComponent,
    topHeaderComponentStyle: topHeaderComponentStyle,
    showWeekDay: showWeekDay,
    showWeekDayInner: showWeekDayInner,
    showShortWeekDay: showShortWeekDay,
    weekDayStyle: weekDayStyle,
    datesArrayStyle: datesArrayStyle,
    showDatesArrayStyle: showDatesArrayStyle,
    fullHeaderStyle: fullHeaderStyle,
  }

  return (
    <React.Fragment>
      <HeaderComponent {...headerProps} />
      <CalendarBody
        {...commonProps}
        style={bodyContainerStyle}
        containerHeight={height}
        events={daytimeEvents}
        eventCellStyle={eventCellStyle}
        hideNowIndicator={hideNowIndicator}
        overlapOffset={overlapOffset}
        scrollOffsetMinutes={scrollOffsetMinutes}
        ampm={ampm}
        showTime={showTime}
        onPressCell={onPressCell}
        onPressEvent={onPressEvent}
        onSwipeHorizontal={onSwipeHorizontal}
        renderEvent={renderEvent}
        headerComponent={headerComponent}
        headerComponentStyle={headerComponentStyle}
        hourStyle={hourStyle}
        cellsBorderStyle={cellsBorderStyle}
        fullBodyStyle={fullBodyStyle}
        increaseFirstRowHeight={increaseFirstRowHeight}
        animatePan={animatePan}
        fadeAnim={fadeAnim}
        prevFadeAnim={prevFadeAnim}
        presentFadeAnim={presentFadeAnim}
        nextFadeAnim={nextFadeAnim}
        prevLeftValue={prevLeftValue}
        presentLeftValue={presentLeftValue}
        nextLeftValue={nextLeftValue}
        handleLeftValue={handleLeftValue}
      />
    </React.Fragment>
  )
}

export const CalendarContainer = typedMemo(_CalendarContainer)
