'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

var dayjs = require('dayjs')
var duration = require('dayjs/plugin/duration')
var isBetween = require('dayjs/plugin/isBetween')
var mergeAnything = require('merge-anything')
var React = require('react')
var calendarize = require('calendarize')
var reactNative = require('react-native')

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : { default: e }
}

function _interopNamespace(e) {
  if (e && e.__esModule) return e
  var n = Object.create(null)
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k)
        Object.defineProperty(
          n,
          k,
          d.get
            ? d
            : {
                enumerable: true,
                get: function () {
                  return e[k]
                },
              },
        )
      }
    })
  }
  n['default'] = e
  return Object.freeze(n)
}

var dayjs__default = /*#__PURE__*/ _interopDefaultLegacy(dayjs)
var duration__default = /*#__PURE__*/ _interopDefaultLegacy(duration)
var isBetween__default = /*#__PURE__*/ _interopDefaultLegacy(isBetween)
var React__default = /*#__PURE__*/ _interopDefaultLegacy(React)
var React__namespace = /*#__PURE__*/ _interopNamespace(React)
var calendarize__default = /*#__PURE__*/ _interopDefaultLegacy(calendarize)

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function () {
  __assign =
    Object.assign ||
    function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i]
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
      }
      return t
    }
  return __assign.apply(this, arguments)
}

function __rest(s, e) {
  var t = {}
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p]
  if (s != null && typeof Object.getOwnPropertySymbols === 'function')
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]]
    }
  return t
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i)
        ar[i] = from[i]
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from))
}

var defaultTheme = {
  isRTL: false,
  palette: {
    primary: {
      main: 'rgb(66, 133, 244)',
      contrastText: '#fff',
    },
    nowIndicator: 'red',
    gray: {
      // 50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      // 400: '#bdbdbd',
      500: '#9e9e9e',
      // 600: '#757575',
      // 700: '#616161',
      800: '#424242',
      // 900: '#212121',
    },
    moreLabel: '#000000',
  },
  eventCellOverlappings: [
    { main: '#E26245', contrastText: '#fff' },
    { main: '#4AC001', contrastText: '#fff' },
    { main: '#5934C7', contrastText: '#fff' }, // purple
  ],
  typography: {
    xs: {
      fontSize: 10,
    },
    sm: {
      fontSize: 12,
    },
    xl: {
      fontSize: 22,
    },
    moreLabel: {
      fontSize: 11,
      fontWeight: 'bold',
    },
  },
}

var ThemeContext = React.createContext(defaultTheme)
var useTheme = function () {
  var customTheme = React.useContext(ThemeContext)
  if (!customTheme) {
    return defaultTheme
  }
  return customTheme
}

var MIN_HEIGHT = 1200
var HOUR_GUIDE_WIDTH = 50
var OVERLAP_OFFSET = reactNative.Platform.OS === 'web' ? 20 : 8
var OVERLAP_PADDING = reactNative.Platform.OS === 'web' ? 3 : 0
var eventCellCss = reactNative.StyleSheet.create({
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
var u = reactNative.StyleSheet.create({
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
    reactNative.Platform.OS === 'web'
      ? {
          overflow: 'hidden',
          // textOverflow: 'ellipsis',
          // whiteSpace: 'nowrap',
        }
      : {},
})

var typedMemo = React__default['default'].memo
var DAY_MINUTES = 1440
function getDatesInMonth(date, locale) {
  if (date === void 0) {
    date = new Date()
  }
  if (locale === void 0) {
    locale = 'en'
  }
  var subject = dayjs__default['default'](date)
  var days = Array(subject.daysInMonth() - 1)
    .fill(0)
    .map(function (_, i) {
      return subject.date(i + 1).locale(locale)
    })
  return days
}
function getDatesInWeek(date, weekStartsOn, locale) {
  if (date === void 0) {
    date = new Date()
  }
  if (weekStartsOn === void 0) {
    weekStartsOn = 0
  }
  if (locale === void 0) {
    locale = 'en'
  }
  var subject = dayjs__default['default'](date)
  var subjectDOW = subject.day()
  var days = Array(7)
    .fill(0)
    .map(function (_, i) {
      return subject
        .add(i - (subjectDOW < weekStartsOn ? 7 + subjectDOW : subjectDOW) + weekStartsOn, 'day')
        .locale(locale)
    })
  return days
}
function getDatesInNextThreeDays(date, locale) {
  if (date === void 0) {
    date = new Date()
  }
  if (locale === void 0) {
    locale = 'en'
  }
  var subject = dayjs__default['default'](date).locale(locale)
  var days = Array(3)
    .fill(0)
    .map(function (_, i) {
      return subject.add(i, 'day')
    })
  return days
}
function getDatesInNextOneDay(date, locale) {
  if (date === void 0) {
    date = new Date()
  }
  if (locale === void 0) {
    locale = 'en'
  }
  var subject = dayjs__default['default'](date).locale(locale)
  var days = Array(1)
    .fill(0)
    .map(function (_, i) {
      return subject.add(i, 'day')
    })
  return days
}
var hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
function formatHour(hour, ampm) {
  if (ampm === void 0) {
    ampm = false
  }
  if (ampm) {
    if (hour === 0) {
      return ''
    }
    if (hour === 12) {
      return '12 PM'
    }
    if (hour > 12) {
      return ''.concat(hour - 12, ' PM')
    }
    return ''.concat(hour, ' AM')
  }
  return ''.concat(hour, ':00')
}
function isToday(date) {
  var today = dayjs__default['default']()
  return today.isSame(date, 'day')
}
function getRelativeTopInDay(date) {
  return (100 * (date.hour() * 60 + date.minute())) / DAY_MINUTES
}
function todayInMinutes() {
  var today = dayjs__default['default']()
  return today.diff(dayjs__default['default']().startOf('day'), 'minute')
}
function modeToNum(mode, current) {
  if (mode === 'month') {
    if (!current) {
      throw new Error('You must specify current date if mode is month')
    }
    if (current instanceof Date) {
      current = dayjs__default['default'](current)
    }
    return current.daysInMonth() - current.date() + 1
  }
  switch (mode) {
    case 'day':
      return 1
    case '3days':
      return 3
    case 'week':
    case 'custom':
      return 7
    default:
      throw new Error('undefined mode')
  }
}
function formatStartEnd(start, end, format) {
  return ''
    .concat(dayjs__default['default'](start).format(format), ' - ')
    .concat(dayjs__default['default'](end).format(format))
}
function isAllDayEvent(start, end) {
  var _start = dayjs__default['default'](start)
  var _end = dayjs__default['default'](end)
  return _start.hour() === 0 && _start.minute() === 0 && _end.hour() === 0 && _end.minute() === 0
}
function getCountOfEventsAtEvent(event, eventList) {
  return eventList.filter(function (e) {
    return (
      dayjs__default['default'](event.start).isBetween(e.start, e.end, 'minute', '[)') ||
      dayjs__default['default'](e.start).isBetween(event.start, event.end, 'minute', '[)')
    )
  }).length
}
function getOrderOfEvent(event, eventList) {
  var events = eventList
    .filter(function (e) {
      return (
        dayjs__default['default'](event.start).isBetween(e.start, e.end, 'minute', '[)') ||
        dayjs__default['default'](e.start).isBetween(event.start, event.end, 'minute', '[)')
      )
    })
    .sort(function (a, b) {
      if (dayjs__default['default'](a.start).isSame(b.start)) {
        return dayjs__default['default'](a.start).diff(a.end) <
          dayjs__default['default'](b.start).diff(b.end)
          ? -1
          : 1
      } else {
        return dayjs__default['default'](a.start).isBefore(b.start) ? -1 : 1
      }
    })
  var index = events.indexOf(event)
  return index === -1 ? 0 : index
}
function getStyleForOverlappingEvent(eventPosition, overlapOffset, palettes) {
  var overlapStyle = {}
  var offset = overlapOffset
  var start = eventPosition * offset
  var zIndex = 100 + eventPosition
  var bgColors = palettes.map(function (p) {
    return p.main
  })
  overlapStyle = {
    start: start + OVERLAP_PADDING,
    end: OVERLAP_PADDING,
    backgroundColor: bgColors[eventPosition % bgColors.length] || bgColors[0],
    zIndex: zIndex,
  }
  return overlapStyle
}
function getDatesInNextCustomDays(date, weekStartsOn, weekEndsOn, locale) {
  if (date === void 0) {
    date = new Date()
  }
  if (weekStartsOn === void 0) {
    weekStartsOn = 0
  }
  if (weekEndsOn === void 0) {
    weekEndsOn = 6
  }
  if (locale === void 0) {
    locale = 'en'
  }
  var subject = dayjs__default['default'](date)
  var subjectDOW = subject.day()
  var days = Array(weekDaysCount(weekStartsOn, weekEndsOn))
    .fill(0)
    .map(function (_, i) {
      return subject.add(i - subjectDOW + weekStartsOn, 'day').locale(locale)
    })
  return days
}
// TODO: This method should be unit-tested
function weekDaysCount(weekStartsOn, weekEndsOn) {
  // handle reverse week
  if (weekEndsOn < weekStartsOn) {
    var daysCount = 1
    var i = weekStartsOn
    while (i !== weekEndsOn) {
      ++i
      ++daysCount
      if (i > 6) {
        i = 0
      }
      // fallback for infinite
      if (daysCount > 7) {
        break
      }
    }
    return daysCount
  }
  // normal week
  if (weekEndsOn > weekStartsOn) {
    return weekEndsOn - weekStartsOn + 1
  }
  // default
  return 1
}
function getEventSpanningInfo(event, date, dayOfTheWeek, calendarWidth, showAdjacentMonths) {
  var dayWidth = calendarWidth / 7
  // adding + 1 because durations start at 0
  var eventDuration =
    Math.floor(
      dayjs__default['default']
        .duration(dayjs__default['default'](event.end).diff(dayjs__default['default'](event.start)))
        .asDays(),
    ) + 1
  var eventDaysLeft =
    Math.floor(
      dayjs__default['default'].duration(dayjs__default['default'](event.end).diff(date)).asDays(),
    ) + 1
  var weekDaysLeft = 7 - dayOfTheWeek
  var monthDaysLeft = date.endOf('month').date() - date.date()
  // console.log(dayOfTheWeek === 0 && !showAdjacentMonths && monthDaysLeft < 7)
  var isMultipleDays = eventDuration > 1
  // This is to determine how many days from the event to show during a week
  var eventWeekDuration =
    !showAdjacentMonths && monthDaysLeft < 7 && monthDaysLeft < eventDuration
      ? monthDaysLeft + 1
      : eventDaysLeft > weekDaysLeft
      ? weekDaysLeft
      : eventDaysLeft < eventDuration
      ? eventDaysLeft
      : eventDuration
  var isMultipleDaysStart =
    isMultipleDays &&
    (date.isSame(event.start, 'day') ||
      (dayOfTheWeek === 0 && date.isAfter(event.start)) ||
      (!showAdjacentMonths && date.get('date') === 1))
  // - 6 to take in account the padding
  var eventWidth = dayWidth * eventWeekDuration - 6
  return {
    eventWidth: eventWidth,
    isMultipleDays: isMultipleDays,
    isMultipleDaysStart: isMultipleDaysStart,
    eventWeekDuration: eventWeekDuration,
  }
}
function objHasContent(obj) {
  return !!Object.keys(obj).length
}
function stringHasContent(string) {
  return !!string.length
}
function getWeeksWithAdjacentMonths(targetDate, weekStartsOn) {
  var weeks = calendarize__default['default'](targetDate.toDate(), weekStartsOn)
  var firstDayIndex = weeks[0].findIndex(function (d) {
    return d === 1
  })
  var lastDay = targetDate.endOf('month').date()
  var lastDayIndex = weeks[weeks.length - 1].findIndex(function (d) {
    return d === lastDay
  })
  weeks = weeks.map(function (week, iw) {
    return week.map(function (d, id) {
      if (d !== 0) {
        return d
      } else if (iw === 0) {
        return d - (firstDayIndex - id - 1)
      } else {
        return lastDay + (id - lastDayIndex)
      }
    })
  })
  return weeks
}

function useNow(enabled) {
  var _a = React__default['default'].useState(dayjs__default['default']()),
    now = _a[0],
    setNow = _a[1]
  React__default['default'].useEffect(
    function () {
      if (!enabled) {
        return function () {}
      }
      var pid = setInterval(function () {
        return setNow(dayjs__default['default']())
      }, 60 * 1000)
      return function () {
        return clearInterval(pid)
      }
    },
    [enabled],
  )
  return {
    now: now,
  }
}

var SWIPE_THRESHOLD = 50
function usePanResponder(_a) {
  var onSwipeHorizontal = _a.onSwipeHorizontal
  var _b = React__default['default'].useState(false),
    panHandled = _b[0],
    setPanHandled = _b[1]
  var panResponder = React__default['default'].useMemo(
    function () {
      return reactNative.PanResponder.create({
        // see https://stackoverflow.com/questions/47568850/touchableopacity-with-parent-panresponder
        onMoveShouldSetPanResponder: function (_, _a) {
          var dx = _a.dx,
            dy = _a.dy
          return dx > 2 || dx < -2 || dy > 2 || dy < -2
        },
        onPanResponderMove: function (_, _a) {
          var dy = _a.dy,
            dx = _a.dx
          if (dy < -1 * SWIPE_THRESHOLD || SWIPE_THRESHOLD < dy || panHandled) {
            return
          }
          if (dx < -1 * SWIPE_THRESHOLD) {
            onSwipeHorizontal && onSwipeHorizontal('LEFT')
            setPanHandled(true)
            return
          }
          if (dx > SWIPE_THRESHOLD) {
            onSwipeHorizontal && onSwipeHorizontal('RIGHT')
            setPanHandled(true)
            return
          }
        },
        onPanResponderEnd: function () {
          setPanHandled(false)
        },
      })
    },
    [panHandled, onSwipeHorizontal],
  )
  return panResponder
}

function useCalendarTouchableOpacityProps(_a) {
  var event = _a.event,
    eventCellStyle = _a.eventCellStyle,
    _b = _a.injectedStyles,
    injectedStyles = _b === void 0 ? [] : _b,
    onPressEvent = _a.onPressEvent
  var getEventStyle = React__default['default'].useMemo(
    function () {
      return typeof eventCellStyle === 'function'
        ? eventCellStyle
        : function () {
            return eventCellStyle
          }
    },
    [eventCellStyle],
  )
  var plainJsEvent = React__default['default'].useMemo(
    function () {
      return __assign(__assign({}, event), {
        start: dayjs__default['default'](event.start).toDate(),
        end: dayjs__default['default'](event.end).toDate(),
      })
    },
    [event],
  )
  var _onPress = React__default['default'].useCallback(
    function () {
      onPressEvent && onPressEvent(plainJsEvent)
    },
    [onPressEvent, plainJsEvent],
  )
  var touchableOpacityProps = {
    delayPressIn: 20,
    key: ''.concat(event.start.toISOString(), '_').concat(event.title),
    style: __spreadArray(
      __spreadArray([eventCellCss.style], injectedStyles, true),
      [getEventStyle(plainJsEvent)],
      false,
    ),
    onPress: _onPress,
    disabled: !onPressEvent,
  }
  return touchableOpacityProps
}

function DefaultCalendarEventRenderer(_a) {
  var touchableOpacityProps = _a.touchableOpacityProps,
    event = _a.event,
    _b = _a.showTime,
    showTime = _b === void 0 ? true : _b,
    textColor = _a.textColor,
    ampm = _a.ampm
  var theme = useTheme()
  var eventTimeStyle = { fontSize: theme.typography.xs.fontSize, color: textColor }
  var eventTitleStyle = { fontSize: theme.typography.sm.fontSize, color: textColor }
  return React__namespace.createElement(
    reactNative.TouchableOpacity,
    __assign({}, touchableOpacityProps),
    dayjs__default['default'](event.end).diff(event.start, 'minute') < 32 && showTime
      ? React__namespace.createElement(
          reactNative.Text,
          { style: eventTitleStyle },
          event.title,
          ',',
          React__namespace.createElement(
            reactNative.Text,
            { style: eventTimeStyle },
            dayjs__default['default'](event.start).format(ampm ? 'hh:mm a' : 'HH:mm'),
          ),
        )
      : React__namespace.createElement(
          React__namespace.Fragment,
          null,
          React__namespace.createElement(reactNative.Text, { style: eventTitleStyle }, event.title),
          showTime &&
            React__namespace.createElement(
              reactNative.Text,
              { style: eventTimeStyle },
              formatStartEnd(event.start, event.end, ampm ? 'h:mm a' : 'HH:mm'),
            ),
          event.children && event.children,
        ),
  )
}

var getEventCellPositionStyle = function (start, end) {
  var relativeHeight =
    100 * (1 / DAY_MINUTES) * dayjs__default['default'](end).diff(start, 'minute')
  var relativeTop = getRelativeTopInDay(dayjs__default['default'](start))
  return {
    height: ''.concat(relativeHeight, '%'),
    top: ''.concat(relativeTop, '%'),
  }
}
function _CalendarEvent(_a) {
  var event = _a.event,
    onPressEvent = _a.onPressEvent,
    eventCellStyle = _a.eventCellStyle,
    showTime = _a.showTime,
    _b = _a.eventCount,
    eventCount = _b === void 0 ? 1 : _b,
    _c = _a.eventOrder,
    eventOrder = _c === void 0 ? 0 : _c,
    _d = _a.overlapOffset,
    overlapOffset = _d === void 0 ? OVERLAP_OFFSET : _d,
    renderEvent = _a.renderEvent,
    ampm = _a.ampm
  var theme = useTheme()
  var palettes = React__namespace.useMemo(
    function () {
      return __spreadArray([theme.palette.primary], theme.eventCellOverlappings, true)
    },
    [theme],
  )
  var touchableOpacityProps = useCalendarTouchableOpacityProps({
    event: event,
    eventCellStyle: eventCellStyle,
    onPressEvent: onPressEvent,
    injectedStyles: [
      getEventCellPositionStyle(event.start, event.end),
      getStyleForOverlappingEvent(eventOrder, overlapOffset, palettes),
      u['absolute'],
      u['mt-2'],
      u['mx-3'],
    ],
  })
  var textColor = React__namespace.useMemo(
    function () {
      var fgColors = palettes.map(function (p) {
        return p.contrastText
      })
      return fgColors[eventCount % fgColors.length] || fgColors[0]
    },
    [eventCount, palettes],
  )
  if (renderEvent) {
    return renderEvent(event, touchableOpacityProps)
  }
  return React__namespace.createElement(DefaultCalendarEventRenderer, {
    event: event,
    showTime: showTime,
    ampm: ampm,
    touchableOpacityProps: touchableOpacityProps,
    textColor: textColor,
  })
}
var CalendarEvent = typedMemo(_CalendarEvent)

var _HourGuideCell = function (_a) {
  var cellHeight = _a.cellHeight,
    onPress = _a.onPress,
    date = _a.date,
    hour = _a.hour,
    index = _a.index,
    calendarCellStyle = _a.calendarCellStyle
  var theme = useTheme()
  var getCalendarCellStyle = React__namespace.useMemo(
    function () {
      return typeof calendarCellStyle === 'function'
        ? calendarCellStyle
        : function () {
            return calendarCellStyle
          }
    },
    [calendarCellStyle],
  )
  return React__namespace.createElement(
    reactNative.TouchableWithoutFeedback,
    {
      onPress: function () {
        return onPress(date.hour(hour).minute(0))
      },
    },
    React__namespace.createElement(reactNative.View, {
      style: [
        u['border-l'],
        u['border-b'],
        { borderColor: theme.palette.gray['200'] },
        { height: cellHeight },
        __assign({}, getCalendarCellStyle(date.toDate(), index)),
      ],
    }),
  )
}
var HourGuideCell = React__namespace.memo(_HourGuideCell)

var _HourGuideColumn = function (_a) {
  var cellHeight = _a.cellHeight,
    hour = _a.hour,
    ampm = _a.ampm,
    _b = _a.hourStyle,
    hourStyle = _b === void 0 ? {} : _b
  var theme = useTheme()
  var textStyle = React__namespace.useMemo(
    function () {
      return { color: theme.palette.gray[500], fontSize: theme.typography.xs.fontSize }
    },
    [theme],
  )
  return React__namespace.createElement(
    reactNative.View,
    { style: { height: cellHeight } },
    React__namespace.createElement(
      reactNative.Text,
      { style: [objHasContent(hourStyle) ? hourStyle : textStyle, u['text-center']] },
      formatHour(hour, ampm),
    ),
  )
}
var HourGuideColumn = React__namespace.memo(_HourGuideColumn, function () {
  return true
})

var styles = reactNative.StyleSheet.create({
  nowIndicator: {
    position: 'absolute',
    zIndex: 10000,
    height: 2,
    width: '100%',
  },
})
function _CalendarBody(_a) {
  var cellHeight = _a.cellHeight,
    dateRange = _a.dateRange,
    style = _a.style,
    onPressCell = _a.onPressCell,
    events = _a.events,
    onPressEvent = _a.onPressEvent,
    eventCellStyle = _a.eventCellStyle,
    calendarCellStyle = _a.calendarCellStyle,
    ampm = _a.ampm,
    showTime = _a.showTime,
    onSwipeHorizontal = _a.onSwipeHorizontal,
    hideNowIndicator = _a.hideNowIndicator,
    overlapOffset = _a.overlapOffset,
    renderEvent = _a.renderEvent,
    _b = _a.headerComponent,
    headerComponent = _b === void 0 ? null : _b,
    _c = _a.headerComponentStyle,
    headerComponentStyle = _c === void 0 ? {} : _c,
    _d = _a.hourStyle,
    hourStyle = _d === void 0 ? {} : _d,
    _e = _a.hideHours,
    hideHours = _e === void 0 ? false : _e
  var now = useNow(!hideNowIndicator).now
  var panResponder = usePanResponder({
    onSwipeHorizontal: onSwipeHorizontal,
  })
  var _onPressCell = React__namespace.useCallback(
    function (date) {
      onPressCell && onPressCell(date.toDate())
    },
    [onPressCell],
  )
  var _renderMappedEvent = React__namespace.useCallback(
    function (event, index) {
      return React__namespace.createElement(CalendarEvent, {
        key: ''.concat(index).concat(event.start).concat(event.title).concat(event.end),
        event: event,
        onPressEvent: onPressEvent,
        eventCellStyle: eventCellStyle,
        showTime: showTime,
        eventCount: getCountOfEventsAtEvent(event, events),
        eventOrder: getOrderOfEvent(event, events),
        overlapOffset: overlapOffset,
        renderEvent: renderEvent,
        ampm: ampm,
      })
    },
    [ampm, eventCellStyle, events, onPressEvent, overlapOffset, renderEvent, showTime],
  )
  var theme = useTheme()
  return React__namespace.createElement(
    React__namespace.Fragment,
    null,
    headerComponent != null
      ? React__namespace.createElement(
          reactNative.View,
          { style: headerComponentStyle },
          headerComponent,
        )
      : null,
    React__namespace.createElement(
      reactNative.View,
      { style: [style, { height: '100%' }] },
      React__namespace.createElement(
        reactNative.View,
        __assign(
          { style: [u['flex-1'], theme.isRTL ? u['flex-row-reverse'] : u['flex-row']] },
          reactNative.Platform.OS === 'web' ? panResponder.panHandlers : {},
        ),
        !hideHours &&
          React__namespace.createElement(
            reactNative.View,
            { style: [u['z-20'], u['w-50']] },
            hours.map(function (hour) {
              return React__namespace.createElement(HourGuideColumn, {
                key: hour,
                cellHeight: cellHeight,
                hour: hour,
                ampm: ampm,
                hourStyle: hourStyle,
              })
            }),
          ),
        dateRange.map(function (date) {
          return React__namespace.createElement(
            reactNative.View,
            { style: [u['flex-1'], u['overflow-hidden']], key: date.toString() },
            hours.map(function (hour, index) {
              return React__namespace.createElement(HourGuideCell, {
                key: hour,
                cellHeight: cellHeight,
                date: date,
                hour: hour,
                onPress: _onPressCell,
                index: index,
                calendarCellStyle: calendarCellStyle,
              })
            }),
            events
              .filter(function (_a) {
                var start = _a.start
                return dayjs__default['default'](start).isBetween(
                  date.startOf('day'),
                  date.endOf('day'),
                  null,
                  '[)',
                )
              })
              .map(_renderMappedEvent),
            events
              .filter(function (_a) {
                var start = _a.start,
                  end = _a.end
                return (
                  dayjs__default['default'](start).isBefore(date.startOf('day')) &&
                  dayjs__default['default'](end).isBetween(
                    date.startOf('day'),
                    date.endOf('day'),
                    null,
                    '[)',
                  )
                )
              })
              .map(function (event) {
                return __assign(__assign({}, event), {
                  start: dayjs__default['default'](event.end).startOf('day'),
                })
              })
              .map(_renderMappedEvent),
            events
              .filter(function (_a) {
                var start = _a.start,
                  end = _a.end
                return (
                  dayjs__default['default'](start).isBefore(date.startOf('day')) &&
                  dayjs__default['default'](end).isAfter(date.endOf('day'))
                )
              })
              .map(function (event) {
                return __assign(__assign({}, event), {
                  start: dayjs__default['default'](event.end).startOf('day'),
                  end: dayjs__default['default'](event.end).endOf('day'),
                })
              })
              .map(_renderMappedEvent),
            isToday(date) &&
              !hideNowIndicator &&
              React__namespace.createElement(reactNative.View, {
                style: [
                  styles.nowIndicator,
                  { backgroundColor: theme.palette.nowIndicator },
                  { top: ''.concat(getRelativeTopInDay(now), '%') },
                ],
              }),
          )
        }),
      ),
    ),
  )
}
var CalendarBody = typedMemo(_CalendarBody)

function _CalendarEventForMonthView(_a) {
  var event = _a.event,
    onPressEvent = _a.onPressEvent,
    eventCellStyle = _a.eventCellStyle,
    renderEvent = _a.renderEvent,
    date = _a.date,
    dayOfTheWeek = _a.dayOfTheWeek,
    calendarWidth = _a.calendarWidth,
    isRTL = _a.isRTL,
    eventMinHeightForMonthView = _a.eventMinHeightForMonthView,
    showAdjacentMonths = _a.showAdjacentMonths
  var theme = useTheme()
  var _b = React__namespace.useMemo(
      function () {
        return getEventSpanningInfo(event, date, dayOfTheWeek, calendarWidth, showAdjacentMonths)
      },
      [date, dayOfTheWeek, event, calendarWidth, showAdjacentMonths],
    ),
    eventWidth = _b.eventWidth,
    isMultipleDays = _b.isMultipleDays,
    isMultipleDaysStart = _b.isMultipleDaysStart,
    eventWeekDuration = _b.eventWeekDuration
  var touchableOpacityProps = useCalendarTouchableOpacityProps({
    event: event,
    eventCellStyle: eventCellStyle,
    onPressEvent: onPressEvent,
    injectedStyles: [
      { backgroundColor: theme.palette.primary.main },
      isMultipleDaysStart && eventWeekDuration > 1
        ? {
            position: 'absolute',
            width: eventWidth,
            zIndex: 10000,
          }
        : {},
      isRTL ? { right: 0 } : { left: 0 },
      u['mt-2'],
    ],
  })
  return React__namespace.createElement(
    reactNative.TouchableOpacity,
    {
      style: { minHeight: eventMinHeightForMonthView },
      onPress: function () {
        return onPressEvent === null || onPressEvent === void 0 ? void 0 : onPressEvent(event)
      },
    },
    (!isMultipleDays && date.isSame(event.start, 'day')) || (isMultipleDays && isMultipleDaysStart)
      ? renderEvent
        ? renderEvent(event, touchableOpacityProps)
        : React__namespace.createElement(
            reactNative.View,
            __assign({}, touchableOpacityProps),
            React__namespace.createElement(
              reactNative.Text,
              {
                style: [
                  { color: theme.palette.primary.contrastText },
                  theme.typography.xs,
                  u['truncate'],
                  isRTL && { textAlign: 'right' },
                ],
                numberOfLines: 1,
              },
              event.title,
            ),
          )
      : null,
  )
}
var CalendarEventForMonthView = typedMemo(_CalendarEventForMonthView)

function _CalendarBodyForMonthView(_a) {
  var containerHeight = _a.containerHeight,
    targetDate = _a.targetDate,
    style = _a.style,
    onPressCell = _a.onPressCell,
    onPressDateHeader = _a.onPressDateHeader,
    events = _a.events,
    onPressEvent = _a.onPressEvent,
    eventCellStyle = _a.eventCellStyle,
    calendarCellStyle = _a.calendarCellStyle,
    calendarCellTextStyle = _a.calendarCellTextStyle,
    onSwipeHorizontal = _a.onSwipeHorizontal,
    hideNowIndicator = _a.hideNowIndicator,
    showAdjacentMonths = _a.showAdjacentMonths,
    renderEvent = _a.renderEvent,
    maxVisibleEventCount = _a.maxVisibleEventCount,
    weekStartsOn = _a.weekStartsOn,
    eventMinHeightForMonthView = _a.eventMinHeightForMonthView,
    moreLabel = _a.moreLabel,
    sortedMonthView = _a.sortedMonthView
  var now = useNow(!hideNowIndicator).now
  var _b = React__namespace.useState(0),
    calendarWidth = _b[0],
    setCalendarWidth = _b[1]
  var panResponder = usePanResponder({
    onSwipeHorizontal: onSwipeHorizontal,
  })
  var weeks = showAdjacentMonths
    ? getWeeksWithAdjacentMonths(targetDate, weekStartsOn)
    : calendarize__default['default'](targetDate.toDate(), weekStartsOn)
  var minCellHeight = containerHeight / 5 - 30
  var theme = useTheme()
  var getCalendarCellStyle = React__namespace.useMemo(
    function () {
      return typeof calendarCellStyle === 'function'
        ? calendarCellStyle
        : function () {
            return calendarCellStyle
          }
    },
    [calendarCellStyle],
  )
  var getCalendarCellTextStyle = React__namespace.useMemo(
    function () {
      return typeof calendarCellTextStyle === 'function'
        ? calendarCellTextStyle
        : function () {
            return calendarCellTextStyle
          }
    },
    [calendarCellTextStyle],
  )
  var sortedEvents = React__namespace.useCallback(
    function (day) {
      return sortedMonthView
        ? events
            .filter(function (_a) {
              var start = _a.start,
                end = _a.end
              return day.isBetween(
                dayjs__default['default'](start).startOf('day'),
                dayjs__default['default'](end).endOf('day'),
                null,
                '[)',
              )
            })
            .sort(function (a, b) {
              if (dayjs__default['default'](a.start).isSame(b.start, 'day')) {
                var aDuration = dayjs__default['default']
                  .duration(
                    dayjs__default['default'](a.end).diff(dayjs__default['default'](a.start)),
                  )
                  .days()
                var bDuration = dayjs__default['default']
                  .duration(
                    dayjs__default['default'](b.end).diff(dayjs__default['default'](b.start)),
                  )
                  .days()
                return bDuration - aDuration
              }
              return a.start.getTime() - b.start.getTime()
            })
        : events.filter(function (_a) {
            var start = _a.start,
              end = _a.end
            return day.isBetween(
              dayjs__default['default'](start).startOf('day'),
              dayjs__default['default'](end).endOf('day'),
              null,
              '[)',
            )
          })
    },
    [events, sortedMonthView],
  )
  return React__namespace.createElement(
    reactNative.View,
    __assign(
      {
        style: [
          {
            height: containerHeight,
          },
          u['flex-column'],
          u['flex-1'],
          u['border-b'],
          u['border-l'],
          u['border-r'],
          u['rounded'],
          { borderColor: theme.palette.gray['200'] },
          style,
        ],
        onLayout: function (_a) {
          var layout = _a.nativeEvent.layout
          return setCalendarWidth(layout.width)
        },
      },
      panResponder.panHandlers,
    ),
    weeks.map(function (week, i) {
      return React__namespace.createElement(
        reactNative.View,
        {
          key: i,
          style: [
            u['flex-1'],
            theme.isRTL ? u['flex-row-reverse'] : u['flex-row'],
            reactNative.Platform.OS === 'android' && style,
            {
              minHeight: minCellHeight,
            },
          ],
        },
        week
          .map(function (d) {
            return showAdjacentMonths ? targetDate.date(d) : d > 0 ? targetDate.date(d) : null
          })
          .map(function (date, ii) {
            return React__namespace.createElement(
              reactNative.TouchableOpacity,
              {
                onPress: function () {
                  return date && onPressCell && onPressCell(date.toDate())
                },
                style: [
                  i > 0 && u['border-t'],
                  theme.isRTL && ii > 0 && u['border-r'],
                  !theme.isRTL && ii > 0 && u['border-l'],
                  { borderColor: theme.palette.gray['200'] },
                  u['p-2'],
                  u['flex-1'],
                  u['flex-column'],
                  {
                    minHeight: minCellHeight,
                  },
                  __assign(
                    {},
                    getCalendarCellStyle(
                      date === null || date === void 0 ? void 0 : date.toDate(),
                      i,
                    ),
                  ),
                ],
                key: ii,
              },
              React__namespace.createElement(
                reactNative.TouchableOpacity,
                {
                  onPress: function () {
                    return (
                      date &&
                      (onPressDateHeader
                        ? onPressDateHeader(date.toDate())
                        : onPressCell && onPressCell(date.toDate()))
                    )
                  },
                },
                React__namespace.createElement(
                  reactNative.Text,
                  {
                    style: [
                      { textAlign: 'center' },
                      theme.typography.sm,
                      {
                        color:
                          (date === null || date === void 0
                            ? void 0
                            : date.format('YYYY-MM-DD')) === now.format('YYYY-MM-DD')
                            ? theme.palette.primary.main
                            : (date === null || date === void 0 ? void 0 : date.month()) !==
                              targetDate.month()
                            ? theme.palette.gray['500']
                            : theme.palette.gray['800'],
                      },
                      __assign(
                        {},
                        getCalendarCellTextStyle(
                          date === null || date === void 0 ? void 0 : date.toDate(),
                          i,
                        ),
                      ),
                    ],
                  },
                  date && date.format('D'),
                ),
              ),
              date &&
                sortedEvents(date).reduce(function (elements, event, index, events) {
                  return __spreadArray(
                    __spreadArray([], elements, true),
                    [
                      index > maxVisibleEventCount
                        ? null
                        : index === maxVisibleEventCount
                        ? React__namespace.createElement(
                            reactNative.Text,
                            {
                              key: index,
                              style: [
                                theme.typography.moreLabel,
                                { marginTop: 2, color: theme.palette.moreLabel },
                              ],
                            },
                            moreLabel.replace(
                              '{moreCount}',
                              ''.concat(events.length - maxVisibleEventCount),
                            ),
                          )
                        : React__namespace.createElement(CalendarEventForMonthView, {
                            key: index,
                            event: event,
                            eventCellStyle: eventCellStyle,
                            onPressEvent: onPressEvent,
                            renderEvent: renderEvent,
                            date: date,
                            dayOfTheWeek: ii,
                            calendarWidth: calendarWidth,
                            isRTL: theme.isRTL,
                            eventMinHeightForMonthView: eventMinHeightForMonthView,
                            showAdjacentMonths: showAdjacentMonths,
                          }),
                    ],
                    false,
                  )
                }, []),
            )
          }),
      )
    }),
  )
}
var CalendarBodyForMonthView = typedMemo(_CalendarBodyForMonthView)

function _CalendarHeader(_a) {
  var dateRange = _a.dateRange,
    cellHeight = _a.cellHeight,
    style = _a.style,
    allDayEvents = _a.allDayEvents,
    onPressDateHeader = _a.onPressDateHeader,
    onPressEvent = _a.onPressEvent,
    activeDate = _a.activeDate,
    _b = _a.headerContentStyle,
    headerContentStyle = _b === void 0 ? {} : _b,
    _c = _a.dayHeaderStyle,
    dayHeaderStyle = _c === void 0 ? {} : _c,
    _d = _a.dayHeaderHighlightColor,
    dayHeaderHighlightColor = _d === void 0 ? '' : _d,
    _e = _a.weekDayHeaderHighlightColor,
    weekDayHeaderHighlightColor = _e === void 0 ? '' : _e,
    _f = _a.showAllDayEventCell,
    showAllDayEventCell = _f === void 0 ? true : _f,
    _g = _a.hideHours,
    hideHours = _g === void 0 ? false : _g
  var _onPressHeader = React__namespace.useCallback(
    function (date) {
      onPressDateHeader && onPressDateHeader(date)
    },
    [onPressDateHeader],
  )
  var _onPressEvent = React__namespace.useCallback(
    function (event) {
      onPressEvent && onPressEvent(event)
    },
    [onPressEvent],
  )
  var theme = useTheme()
  var borderColor = { borderColor: theme.palette.gray['200'] }
  var primaryBg = { backgroundColor: theme.palette.primary.main }
  return React__namespace.createElement(
    reactNative.View,
    {
      style: [
        showAllDayEventCell ? u['border-b-2'] : {},
        showAllDayEventCell ? borderColor : {},
        theme.isRTL ? u['flex-row-reverse'] : u['flex-row'],
        style,
      ],
    },
    !hideHours &&
      React__namespace.createElement(reactNative.View, {
        style: [u['z-10'], u['w-50'], borderColor],
      }),
    dateRange.map(function (date) {
      var shouldHighlight = activeDate ? date.isSame(activeDate, 'date') : isToday(date)
      return React__namespace.createElement(
        reactNative.TouchableOpacity,
        {
          style: [u['flex-1'], u['pt-2']],
          onPress: function () {
            return _onPressHeader(date.toDate())
          },
          disabled: onPressDateHeader === undefined,
          key: date.toString(),
        },
        React__namespace.createElement(
          reactNative.View,
          {
            style: [
              { height: cellHeight },
              objHasContent(headerContentStyle) ? headerContentStyle : u['justify-between'],
            ],
          },
          React__namespace.createElement(
            reactNative.Text,
            {
              style: [
                theme.typography.xs,
                u['text-center'],
                {
                  color: shouldHighlight
                    ? stringHasContent(weekDayHeaderHighlightColor)
                      ? weekDayHeaderHighlightColor
                      : theme.palette.primary.main
                    : theme.palette.gray['500'],
                },
              ],
            },
            date.format('ddd'),
          ),
          React__namespace.createElement(
            reactNative.View,
            {
              style: objHasContent(dayHeaderStyle)
                ? dayHeaderStyle
                : shouldHighlight
                ? [
                    primaryBg,
                    u['h-36'],
                    u['w-36'],
                    u['pb-6'],
                    u['rounded-full'],
                    u['items-center'],
                    u['justify-center'],
                    u['self-center'],
                    u['z-20'],
                  ]
                : [u['mb-6']],
            },
            React__namespace.createElement(
              reactNative.Text,
              {
                style: [
                  {
                    color: shouldHighlight
                      ? stringHasContent(dayHeaderHighlightColor)
                        ? dayHeaderHighlightColor
                        : theme.palette.primary.contrastText
                      : theme.palette.gray['800'],
                  },
                  theme.typography.xl,
                  u['text-center'],
                  reactNative.Platform.OS === 'web' &&
                    shouldHighlight &&
                    !stringHasContent(dayHeaderHighlightColor) &&
                    u['mt-6'],
                ],
              },
              date.format('D'),
            ),
          ),
        ),
        showAllDayEventCell
          ? React__namespace.createElement(
              reactNative.View,
              {
                style: [
                  u['border-l'],
                  { borderColor: theme.palette.gray['200'] },
                  { height: cellHeight },
                ],
              },
              allDayEvents.map(function (event, index) {
                if (
                  !dayjs__default['default'](date).isBetween(event.start, event.end, 'day', '[]')
                ) {
                  return null
                }
                return React__namespace.createElement(
                  reactNative.TouchableOpacity,
                  {
                    style: [eventCellCss.style, primaryBg, u['mt-2']],
                    key: index,
                    onPress: function () {
                      return _onPressEvent(event)
                    },
                  },
                  React__namespace.createElement(
                    reactNative.Text,
                    {
                      style: {
                        fontSize: theme.typography.sm.fontSize,
                        color: theme.palette.primary.contrastText,
                      },
                    },
                    event.title,
                  ),
                )
              }),
            )
          : null,
      )
    }),
  )
}
var CalendarHeader = typedMemo(_CalendarHeader)

function _CalendarHeaderForMonthView(_a) {
  var locale = _a.locale,
    weekStartsOn = _a.weekStartsOn,
    style = _a.style
  var dates = getDatesInWeek(new Date(), weekStartsOn, locale)
  var todayWeekNum = dayjs__default['default']().day()
  var theme = useTheme()
  return React__namespace.createElement(
    reactNative.View,
    {
      style: [
        u['border-b'],
        { borderColor: theme.palette.gray['100'] },
        theme.isRTL ? u['flex-row-reverse'] : u['flex-row'],
        style,
      ],
    },
    dates.map(function (date) {
      return React__namespace.createElement(
        reactNative.View,
        { style: { flex: 1, paddingTop: 2 }, key: date.toISOString() },
        React__namespace.createElement(
          reactNative.View,
          { style: { height: 30 } },
          React__namespace.createElement(
            reactNative.Text,
            {
              style: [
                u['text-center'],
                {
                  color:
                    todayWeekNum === date.day()
                      ? theme.palette.primary.main
                      : theme.palette.gray['800'],
                },
              ],
            },
            date.format('ddd'),
          ),
        ),
      )
    }),
  )
}
var CalendarHeaderForMonthView = typedMemo(_CalendarHeaderForMonthView)

function _CalendarContainer(_a) {
  var events = _a.events,
    height = _a.height,
    hourRowHeight = _a.hourRowHeight,
    _b = _a.ampm,
    ampm = _b === void 0 ? false : _b,
    date = _a.date,
    eventCellStyle = _a.eventCellStyle,
    calendarCellStyle = _a.calendarCellStyle,
    calendarCellTextStyle = _a.calendarCellTextStyle,
    _c = _a.locale,
    locale = _c === void 0 ? 'en' : _c,
    _d = _a.hideNowIndicator,
    hideNowIndicator = _d === void 0 ? false : _d,
    _e = _a.mode,
    mode = _e === void 0 ? 'week' : _e,
    overlapOffset = _a.overlapOffset,
    _f = _a.scrollOffsetMinutes,
    scrollOffsetMinutes = _f === void 0 ? 0 : _f,
    _g = _a.showTime,
    showTime = _g === void 0 ? true : _g,
    _h = _a.headerContainerStyle,
    headerContainerStyle = _h === void 0 ? {} : _h,
    _j = _a.headerContentStyle,
    headerContentStyle = _j === void 0 ? {} : _j,
    _k = _a.dayHeaderStyle,
    dayHeaderStyle = _k === void 0 ? {} : _k,
    _l = _a.dayHeaderHighlightColor,
    dayHeaderHighlightColor = _l === void 0 ? '' : _l,
    _m = _a.weekDayHeaderHighlightColor,
    weekDayHeaderHighlightColor = _m === void 0 ? '' : _m,
    _o = _a.bodyContainerStyle,
    bodyContainerStyle = _o === void 0 ? {} : _o,
    _p = _a.swipeEnabled,
    swipeEnabled = _p === void 0 ? true : _p,
    _q = _a.weekStartsOn,
    weekStartsOn = _q === void 0 ? 0 : _q,
    _r = _a.onChangeDate,
    onChangeDate = _r === void 0 ? function () {} : _r,
    onPressCell = _a.onPressCell,
    onPressDateHeader = _a.onPressDateHeader,
    onPressEvent = _a.onPressEvent,
    renderEvent = _a.renderEvent,
    _s = _a.renderHeader,
    HeaderComponent = _s === void 0 ? CalendarHeader : _s,
    _t = _a.renderHeaderForMonthView,
    HeaderComponentForMonthView = _t === void 0 ? CalendarHeaderForMonthView : _t,
    _u = _a.weekEndsOn,
    weekEndsOn = _u === void 0 ? 6 : _u,
    _v = _a.maxVisibleEventCount,
    maxVisibleEventCount = _v === void 0 ? 3 : _v,
    _w = _a.eventMinHeightForMonthView,
    eventMinHeightForMonthView = _w === void 0 ? 22 : _w,
    activeDate = _a.activeDate,
    _x = _a.headerComponent,
    headerComponent = _x === void 0 ? null : _x,
    _y = _a.headerComponentStyle,
    headerComponentStyle = _y === void 0 ? {} : _y,
    _z = _a.hourStyle,
    hourStyle = _z === void 0 ? {} : _z,
    _0 = _a.showAllDayEventCell,
    showAllDayEventCell = _0 === void 0 ? true : _0,
    _1 = _a.moreLabel,
    moreLabel = _1 === void 0 ? '{moreCount} More' : _1,
    _2 = _a.showAdjacentMonths,
    showAdjacentMonths = _2 === void 0 ? true : _2,
    _3 = _a.sortedMonthView,
    sortedMonthView = _3 === void 0 ? true : _3,
    _4 = _a.hideHours,
    hideHours = _4 === void 0 ? false : _4
  var _5 = React__default['default'].useState(dayjs__default['default'](date)),
    targetDate = _5[0],
    setTargetDate = _5[1]
  React__default['default'].useEffect(
    function () {
      if (date) {
        setTargetDate(dayjs__default['default'](date))
      }
    },
    [date],
  )
  var allDayEvents = React__default['default'].useMemo(
    function () {
      return events.filter(function (event) {
        return isAllDayEvent(event.start, event.end)
      })
    },
    [events],
  )
  var daytimeEvents = React__default['default'].useMemo(
    function () {
      return events.filter(function (event) {
        return !isAllDayEvent(event.start, event.end)
      })
    },
    [events],
  )
  var dateRange = React__default['default'].useMemo(
    function () {
      switch (mode) {
        case 'month':
          return getDatesInMonth(targetDate, locale)
        case 'week':
          return getDatesInWeek(targetDate, weekStartsOn, locale)
        case '3days':
          return getDatesInNextThreeDays(targetDate, locale)
        case 'day':
          return getDatesInNextOneDay(targetDate, locale)
        case 'custom':
          return getDatesInNextCustomDays(targetDate, weekStartsOn, weekEndsOn, locale)
        default:
          throw new Error(
            '[react-native-big-calendar] The mode which you specified "'.concat(
              mode,
              '" is not supported.',
            ),
          )
      }
    },
    [mode, targetDate, locale, weekEndsOn, weekStartsOn],
  )
  var cellHeight = React__default['default'].useMemo(
    function () {
      return hourRowHeight || Math.max(height - 30, MIN_HEIGHT) / 24
    },
    [height, hourRowHeight],
  )
  var theme = useTheme()
  var onSwipeHorizontal = React__default['default'].useCallback(
    function (direction) {
      if (!swipeEnabled) {
        return
      }
      if ((direction === 'LEFT' && !theme.isRTL) || (direction === 'RIGHT' && theme.isRTL)) {
        var targetedDate = targetDate.add(modeToNum(mode, targetDate), 'day')
        /* eslint-disable */
        setTargetDate(targetedDate)
        onChangeDate([targetedDate.toDate(), dateRange.slice(-1)[0].toDate()])
      } else {
        var targetedDate = targetDate.add(targetDate.date() * -1, 'day')
        if (mode === 'month') {
          setTargetDate(targetedDate)
        } else {
          setTargetDate(targetedDate)
        }
        onChangeDate([targetedDate.toDate(), dateRange.slice(-1)[0].toDate()])
      }
    },
    [swipeEnabled, targetDate, mode, theme.isRTL],
  )
  var commonProps = {
    cellHeight: cellHeight,
    dateRange: dateRange,
    mode: mode,
    onPressEvent: onPressEvent,
    hideHours: hideHours,
  }
  if (mode === 'month') {
    var headerProps_1 = {
      style: headerContainerStyle,
      locale: locale,
      weekStartsOn: weekStartsOn,
      headerContentStyle: headerContentStyle,
      dayHeaderStyle: dayHeaderStyle,
      dayHeaderHighlightColor: dayHeaderHighlightColor,
      weekDayHeaderHighlightColor: weekDayHeaderHighlightColor,
      showAllDayEventCell: showAllDayEventCell,
    }
    return React__default['default'].createElement(
      React__default['default'].Fragment,
      null,
      React__default['default'].createElement(
        HeaderComponentForMonthView,
        __assign({}, headerProps_1),
      ),
      React__default['default'].createElement(
        CalendarBodyForMonthView,
        __assign({}, commonProps, {
          style: bodyContainerStyle,
          containerHeight: height,
          events: __spreadArray(__spreadArray([], daytimeEvents, true), allDayEvents, true),
          eventCellStyle: eventCellStyle,
          calendarCellStyle: calendarCellStyle,
          calendarCellTextStyle: calendarCellTextStyle,
          weekStartsOn: weekStartsOn,
          hideNowIndicator: hideNowIndicator,
          showAdjacentMonths: showAdjacentMonths,
          onPressCell: onPressCell,
          onPressDateHeader: onPressDateHeader,
          onPressEvent: onPressEvent,
          onSwipeHorizontal: onSwipeHorizontal,
          renderEvent: renderEvent,
          targetDate: targetDate,
          maxVisibleEventCount: maxVisibleEventCount,
          eventMinHeightForMonthView: eventMinHeightForMonthView,
          sortedMonthView: sortedMonthView,
          moreLabel: moreLabel,
        }),
      ),
    )
  }
  var headerProps = __assign(__assign({}, commonProps), {
    style: headerContainerStyle,
    allDayEvents: allDayEvents,
    onPressDateHeader: onPressDateHeader,
    activeDate: activeDate,
    headerContentStyle: headerContentStyle,
    dayHeaderStyle: dayHeaderStyle,
    dayHeaderHighlightColor: dayHeaderHighlightColor,
    weekDayHeaderHighlightColor: weekDayHeaderHighlightColor,
    showAllDayEventCell: showAllDayEventCell,
  })
  return React__default['default'].createElement(
    React__default['default'].Fragment,
    null,
    React__default['default'].createElement(HeaderComponent, __assign({}, headerProps)),
    React__default['default'].createElement(
      CalendarBody,
      __assign({}, commonProps, {
        style: bodyContainerStyle,
        containerHeight: height,
        events: daytimeEvents,
        eventCellStyle: eventCellStyle,
        calendarCellStyle: calendarCellStyle,
        hideNowIndicator: hideNowIndicator,
        overlapOffset: overlapOffset,
        scrollOffsetMinutes: scrollOffsetMinutes,
        ampm: ampm,
        showTime: showTime,
        onPressCell: onPressCell,
        onPressEvent: onPressEvent,
        onSwipeHorizontal: onSwipeHorizontal,
        renderEvent: renderEvent,
        headerComponent: headerComponent,
        headerComponentStyle: headerComponentStyle,
        hourStyle: hourStyle,
      }),
    ),
  )
}
var CalendarContainer = typedMemo(_CalendarContainer)

dayjs__default['default'].extend(isBetween__default['default'])
function _Calendar(_a) {
  var _b = _a.theme,
    theme = _b === void 0 ? defaultTheme : _b,
    isRTL = _a.isRTL,
    props = __rest(_a, ['theme', 'isRTL'])
  var _theme = mergeAnything.merge(defaultTheme, theme, { isRTL: isRTL })
  return React__default['default'].createElement(
    ThemeContext.Provider,
    { value: _theme },
    React__default['default'].createElement(CalendarContainer, __assign({}, props)),
  )
}
var Calendar = typedMemo(_Calendar)

dayjs__default['default'].extend(duration__default['default'])
dayjs__default['default'].extend(isBetween__default['default'])

exports.Calendar = Calendar
exports.CalendarBody = CalendarBody
exports.CalendarBodyForMonthView = CalendarBodyForMonthView
exports.CalendarEvent = CalendarEvent
exports.CalendarEventForMonthView = CalendarEventForMonthView
exports.CalendarHeader = CalendarHeader
exports.CalendarHeaderForMonthView = CalendarHeaderForMonthView
exports.DAY_MINUTES = DAY_MINUTES
exports.DefaultCalendarEventRenderer = DefaultCalendarEventRenderer
exports.HOUR_GUIDE_WIDTH = HOUR_GUIDE_WIDTH
exports.MIN_HEIGHT = MIN_HEIGHT
exports.OVERLAP_OFFSET = OVERLAP_OFFSET
exports.OVERLAP_PADDING = OVERLAP_PADDING
exports.ThemeContext = ThemeContext
exports['default'] = Calendar
exports.defaultTheme = defaultTheme
exports.eventCellCss = eventCellCss
exports.formatHour = formatHour
exports.formatStartEnd = formatStartEnd
exports.getCountOfEventsAtEvent = getCountOfEventsAtEvent
exports.getDatesInMonth = getDatesInMonth
exports.getDatesInNextCustomDays = getDatesInNextCustomDays
exports.getDatesInNextOneDay = getDatesInNextOneDay
exports.getDatesInNextThreeDays = getDatesInNextThreeDays
exports.getDatesInWeek = getDatesInWeek
exports.getEventSpanningInfo = getEventSpanningInfo
exports.getOrderOfEvent = getOrderOfEvent
exports.getRelativeTopInDay = getRelativeTopInDay
exports.getStyleForOverlappingEvent = getStyleForOverlappingEvent
exports.getWeeksWithAdjacentMonths = getWeeksWithAdjacentMonths
exports.hours = hours
exports.isAllDayEvent = isAllDayEvent
exports.isToday = isToday
exports.modeToNum = modeToNum
exports.objHasContent = objHasContent
exports.stringHasContent = stringHasContent
exports.todayInMinutes = todayInMinutes
exports.typedMemo = typedMemo
exports.u = u
exports.useTheme = useTheme
//# sourceMappingURL=index.js.map
