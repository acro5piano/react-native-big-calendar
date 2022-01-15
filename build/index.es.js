import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import { merge } from 'merge-anything';
import * as React from 'react';
import React__default, { createContext, useContext } from 'react';
import { Platform, StyleSheet, PanResponder, TouchableOpacity, Text, TouchableWithoutFeedback, View, ScrollView } from 'react-native';
import calendarize from 'calendarize';

/*! *****************************************************************************
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

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __spreadArray(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
}

var defaultTheme = {
    isRTL: false,
    palette: {
        primary: {
            main: '#FEA621',
            // main: 'rgb(66, 133, 244)',
            contrastText: '#fff',
        },
        evenCellBg: '#fff',
        oddCellBg: '#fff',
        nowIndicator: '#FEA621',
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
            fontSize: 16,
        },
    },
};

var ThemeContext = createContext(defaultTheme);
var useTheme = function () {
    var customTheme = useContext(ThemeContext);
    if (!customTheme) {
        return defaultTheme;
    }
    return customTheme;
};

var MIN_HEIGHT = 1200;
var HOUR_GUIDE_WIDTH = 50;
var OVERLAP_OFFSET = Platform.OS === 'web' ? 20 : 8;
var OVERLAP_PADDING = Platform.OS === 'web' ? 3 : 0;
var eventCellCss = StyleSheet.create({
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
});
/*
 * Utility-first CSS.
 */
var u = StyleSheet.create({
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
    truncate: Platform.OS === 'web'
        ? {
            overflow: 'hidden',
            // textOverflow: 'ellipsis',
            // whiteSpace: 'nowrap',
        }
        : {},
});

var typedMemo = React__default.memo;
var DAY_MINUTES = 1440;
function getDatesInMonth(date, locale) {
    if (date === void 0) { date = new Date(); }
    if (locale === void 0) { locale = 'en'; }
    var subject = dayjs(date);
    var days = Array(subject.daysInMonth() - 1)
        .fill(0)
        .map(function (_, i) {
        return subject.date(i + 1).locale(locale);
    });
    return days;
}
function getDatesInWeek(date, weekStartsOn, locale) {
    if (date === void 0) { date = new Date(); }
    if (weekStartsOn === void 0) { weekStartsOn = 0; }
    if (locale === void 0) { locale = 'en'; }
    var subject = dayjs(date);
    var subjectDOW = subject.day();
    var days = Array(7)
        .fill(0)
        .map(function (_, i) {
        return subject
            .add(i - (subjectDOW < weekStartsOn ? 7 + subjectDOW : subjectDOW) + weekStartsOn, 'day')
            .locale(locale);
    });
    return days;
}
function getDatesInNextThreeDays(date, locale) {
    if (date === void 0) { date = new Date(); }
    if (locale === void 0) { locale = 'en'; }
    var subject = dayjs(date).locale(locale);
    var days = Array(3)
        .fill(0)
        .map(function (_, i) {
        return subject.add(i, 'day');
    });
    return days;
}
function getDatesInNextOneDay(date, locale) {
    if (date === void 0) { date = new Date(); }
    if (locale === void 0) { locale = 'en'; }
    var subject = dayjs(date).locale(locale);
    var days = Array(1)
        .fill(0)
        .map(function (_, i) {
        return subject.add(i, 'day');
    });
    return days;
}
var hours = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
];
function formatHour(hour, ampm) {
    if (ampm === void 0) { ampm = false; }
    if (ampm) {
        if (hour === 0) {
            return '';
        }
        if (hour === 12) {
            return "12 PM";
        }
        if (hour > 12) {
            return "".concat(hour - 12, " PM");
        }
        return "".concat(hour, " AM");
    }
    return "".concat(hour, ":00");
}
function isToday(date) {
    var today = dayjs();
    return today.isSame(date, 'day');
}
function getRelativeTopInDay(date) {
    return (100 * (date.hour() * 60 + date.minute())) / DAY_MINUTES;
}
function todayInMinutes() {
    var today = dayjs();
    return today.diff(dayjs().startOf('day'), 'minute');
}
function modeToNum(mode, current) {
    if (mode === 'month') {
        if (!current) {
            throw new Error('You must specify current date if mode is month');
        }
        if (current instanceof Date) {
            current = dayjs(current);
        }
        return current.daysInMonth() - current.date() + 1;
    }
    switch (mode) {
        case 'day':
            return 1;
        case '3days':
            return 3;
        case 'week':
        case 'custom':
            return 7;
        default:
            throw new Error('undefined mode');
    }
}
function formatStartEnd(start, end, format) {
    return "".concat(dayjs(start).format(format), " - ").concat(dayjs(end).format(format));
}
function isAllDayEvent(start, end) {
    var _start = dayjs(start);
    var _end = dayjs(end);
    return _start.hour() === 0 && _start.minute() === 0 && _end.hour() === 0 && _end.minute() === 0;
}
function getCountOfEventsAtEvent(event, eventList) {
    return eventList.filter(function (e) {
        return dayjs(event.start).isBetween(e.start, e.end, 'minute', '[)') ||
            dayjs(e.start).isBetween(event.start, event.end, 'minute', '[)');
    }).length;
}
function getOrderOfEvent(event, eventList) {
    var events = eventList
        .filter(function (e) {
        return dayjs(event.start).isBetween(e.start, e.end, 'minute', '[)') ||
            dayjs(e.start).isBetween(event.start, event.end, 'minute', '[)');
    })
        .sort(function (a, b) {
        if (dayjs(a.start).isSame(b.start)) {
            return dayjs(a.start).diff(a.end) < dayjs(b.start).diff(b.end) ? -1 : 1;
        }
        else {
            return dayjs(a.start).isBefore(b.start) ? -1 : 1;
        }
    });
    var index = events.indexOf(event);
    return index === -1 ? 0 : index;
}
function getStyleForOverlappingEvent(eventPosition, overlapOffset, palettes) {
    var overlapStyle = {};
    var offset = overlapOffset;
    var start = eventPosition * offset;
    var zIndex = 100 + eventPosition;
    var bgColors = palettes.map(function (p) { return p.main; });
    overlapStyle = {
        start: start + OVERLAP_PADDING,
        end: OVERLAP_PADDING,
        backgroundColor: bgColors[eventPosition % bgColors.length] || bgColors[0],
        zIndex: zIndex,
    };
    return overlapStyle;
}
function getDatesInNextCustomDays(date, weekStartsOn, weekEndsOn, locale) {
    if (date === void 0) { date = new Date(); }
    if (weekStartsOn === void 0) { weekStartsOn = 0; }
    if (weekEndsOn === void 0) { weekEndsOn = 6; }
    if (locale === void 0) { locale = 'en'; }
    var subject = dayjs(date);
    var subjectDOW = subject.day();
    var days = Array(weekDaysCount(weekStartsOn, weekEndsOn))
        .fill(0)
        .map(function (_, i) {
        return subject.add(i - subjectDOW + weekStartsOn, 'day').locale(locale);
    });
    return days;
}
// TODO: This method should be unit-tested
function weekDaysCount(weekStartsOn, weekEndsOn) {
    // handle reverse week
    if (weekEndsOn < weekStartsOn) {
        var daysCount = 1;
        var i = weekStartsOn;
        while (i !== weekEndsOn) {
            ++i;
            ++daysCount;
            if (i > 6) {
                i = 0;
            }
            // fallback for infinite
            if (daysCount > 7) {
                break;
            }
        }
        return daysCount;
    }
    // normal week
    if (weekEndsOn > weekStartsOn) {
        return weekEndsOn - weekStartsOn + 1;
    }
    // default
    return 1;
}
function getEventSpanningInfo(event, date, dayOfTheWeek, calendarWidth) {
    var dayWidth = calendarWidth / 7;
    // adding + 1 because durations start at 0
    var eventDuration = dayjs.duration(dayjs(event.end).diff(dayjs(event.start))).days() + 1;
    var eventDaysLeft = dayjs.duration(dayjs(event.end).diff(date)).days() + 1;
    var weekDaysLeft = 7 - dayOfTheWeek;
    var isMultipleDays = eventDuration > 1;
    // This is to determine how many days from the event to show during a week
    var eventWeekDuration = eventDuration > weekDaysLeft
        ? weekDaysLeft
        : dayOfTheWeek === 0 && eventDaysLeft < eventDuration
            ? eventDaysLeft
            : eventDuration;
    var isMultipleDaysStart = isMultipleDays &&
        (date.isSame(event.start, 'day') ||
            (dayOfTheWeek === 0 && date.isAfter(event.start)) ||
            date.get('date') === 1);
    // - 6 to take in account the padding
    var eventWidth = dayWidth * eventWeekDuration - 6;
    return { eventWidth: eventWidth, isMultipleDays: isMultipleDays, isMultipleDaysStart: isMultipleDaysStart, eventWeekDuration: eventWeekDuration };
}
function isPair(i) {
    return i % 2 === 0;
}
function objHasContent(obj) {
    return !!Object.keys(obj).length;
}
function stringHasContent(string) {
    return !!string.length;
}

function useNow(enabled) {
    var _a = React__default.useState(dayjs()), now = _a[0], setNow = _a[1];
    React__default.useEffect(function () {
        if (!enabled) {
            return function () { };
        }
        var pid = setInterval(function () { return setNow(dayjs()); }, 60 * 1000);
        return function () { return clearInterval(pid); };
    }, [enabled]);
    return {
        now: now,
    };
}

var SWIPE_THRESHOLD = 50;
function usePanResponder(_a) {
    var onSwipeHorizontal = _a.onSwipeHorizontal;
    var _b = React__default.useState(false), panHandled = _b[0], setPanHandled = _b[1];
    var panResponder = React__default.useMemo(function () {
        return PanResponder.create({
            // see https://stackoverflow.com/questions/47568850/touchableopacity-with-parent-panresponder
            onMoveShouldSetPanResponder: function (_, _a) {
                var dx = _a.dx, dy = _a.dy;
                return dx > 2 || dx < -2 || dy > 2 || dy < -2;
            },
            onPanResponderMove: function (_, _a) {
                var dy = _a.dy, dx = _a.dx;
                if (dy < -1 * SWIPE_THRESHOLD || SWIPE_THRESHOLD < dy || panHandled) {
                    return;
                }
                if (dx < -1 * SWIPE_THRESHOLD) {
                    onSwipeHorizontal && onSwipeHorizontal('LEFT');
                    setPanHandled(true);
                    return;
                }
                if (dx > SWIPE_THRESHOLD) {
                    onSwipeHorizontal && onSwipeHorizontal('RIGHT');
                    setPanHandled(true);
                    return;
                }
            },
            onPanResponderEnd: function () {
                setPanHandled(false);
            },
        });
    }, [panHandled, onSwipeHorizontal]);
    return panResponder;
}

function useCalendarTouchableOpacityProps(_a) {
    var event = _a.event, eventCellStyle = _a.eventCellStyle, _b = _a.injectedStyles, injectedStyles = _b === void 0 ? [] : _b, onPressEvent = _a.onPressEvent;
    var getEventStyle = React__default.useMemo(function () { return (typeof eventCellStyle === 'function' ? eventCellStyle : function () { return eventCellStyle; }); }, [eventCellStyle]);
    var plainJsEvent = React__default.useMemo(function () { return (__assign(__assign({}, event), { start: dayjs(event.start).toDate(), end: dayjs(event.end).toDate() })); }, [event]);
    var _onPress = React__default.useCallback(function () {
        onPressEvent && onPressEvent(plainJsEvent);
    }, [onPressEvent, plainJsEvent]);
    var touchableOpacityProps = {
        delayPressIn: 20,
        key: event.start.toString(),
        style: __spreadArray(__spreadArray([eventCellCss.style], injectedStyles, true), [getEventStyle(plainJsEvent)]),
        onPress: _onPress,
        disabled: !onPressEvent,
    };
    return touchableOpacityProps;
}

function DefaultCalendarEventRenderer(_a) {
    var touchableOpacityProps = _a.touchableOpacityProps, event = _a.event, _b = _a.showTime, showTime = _b === void 0 ? true : _b, textColor = _a.textColor, ampm = _a.ampm;
    var theme = useTheme();
    var eventTimeStyle = { fontSize: theme.typography.xs.fontSize, color: textColor };
    var eventTitleStyle = { fontSize: theme.typography.sm.fontSize, color: textColor };
    return (React.createElement(TouchableOpacity, __assign({}, touchableOpacityProps), dayjs(event.end).diff(event.start, 'minute') < 32 && showTime ? (React.createElement(Text, { style: eventTitleStyle },
        event.title,
        ",",
        React.createElement(Text, { style: eventTimeStyle }, dayjs(event.start).format(ampm ? 'hh:mm a' : 'HH:mm')))) : (React.createElement(React.Fragment, null,
        React.createElement(Text, { style: eventTitleStyle }, event.title),
        showTime && (React.createElement(Text, { style: eventTimeStyle }, formatStartEnd(event.start, event.end, ampm ? 'h:mm a' : 'HH:mm'))),
        event.children && event.children))));
}

var getEventCellPositionStyle = function (start, end) {
    var relativeHeight = 100 * (1 / DAY_MINUTES) * dayjs(end).diff(start, 'minute');
    var relativeTop = getRelativeTopInDay(dayjs(start));
    return {
        height: "".concat(relativeHeight, "%"),
        top: "".concat(relativeTop, "%"),
    };
};
function _CalendarEvent(_a) {
    var event = _a.event, onPressEvent = _a.onPressEvent, eventCellStyle = _a.eventCellStyle, showTime = _a.showTime, _b = _a.eventCount, eventCount = _b === void 0 ? 1 : _b, _c = _a.eventOrder, eventOrder = _c === void 0 ? 0 : _c, _d = _a.overlapOffset, overlapOffset = _d === void 0 ? OVERLAP_OFFSET : _d, renderEvent = _a.renderEvent, ampm = _a.ampm;
    var theme = useTheme();
    var palettes = React.useMemo(function () { return __spreadArray([theme.palette.primary], theme.eventCellOverlappings); }, [theme]);
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
    });
    var textColor = React.useMemo(function () {
        var fgColors = palettes.map(function (p) { return p.contrastText; });
        return fgColors[eventCount % fgColors.length] || fgColors[0];
    }, [eventCount, palettes]);
    if (renderEvent) {
        return renderEvent(event, touchableOpacityProps);
    }
    return (React.createElement(DefaultCalendarEventRenderer, { event: event, showTime: showTime, ampm: ampm, touchableOpacityProps: touchableOpacityProps, textColor: textColor }));
}
var CalendarEvent = typedMemo(_CalendarEvent);

var HourGuideCell = function (_a) {
    var cellHeight = _a.cellHeight, onPress = _a.onPress, date = _a.date, hour = _a.hour, index = _a.index;
    var theme = useTheme();
    var evenCellBg = theme.palette.evenCellBg;
    var oddCellBg = theme.palette.oddCellBg;
    return (React.createElement(TouchableWithoutFeedback, { onPress: function () { return onPress(date.hour(hour).minute(0)); } },
        React.createElement(View, { style: [
                u['border-l'],
                u['border-b'],
                { borderColor: theme.palette.gray['200'] },
                { height: cellHeight },
                { backgroundColor: isPair(index) ? evenCellBg : oddCellBg },
            ] })));
};

var _HourGuideColumn = function (_a) {
    var cellHeight = _a.cellHeight, hour = _a.hour, ampm = _a.ampm, index = _a.index, _b = _a.hourStyle, hourStyle = _b === void 0 ? {} : _b;
    var theme = useTheme();
    var textStyle = React.useMemo(function () { return ({ color: theme.palette.gray[500], fontSize: theme.typography.xs.fontSize }); }, [theme]);
    var evenCellBg = theme.palette.evenCellBg;
    var oddCellBg = theme.palette.oddCellBg;
    return (React.createElement(View, { style: { height: cellHeight, backgroundColor: isPair(index) ? evenCellBg : oddCellBg } },
        React.createElement(Text, { style: [objHasContent(hourStyle) ? hourStyle : textStyle, u['text-center']] }, formatHour(hour, ampm))));
};
var HourGuideColumn = React.memo(_HourGuideColumn, function () { return true; });

var styles = StyleSheet.create({
    nowIndicator: {
        position: 'absolute',
        zIndex: 10000,
        height: 2,
        width: '100%',
    },
});
function _CalendarBody(_a) {
    var containerHeight = _a.containerHeight, cellHeight = _a.cellHeight, dateRange = _a.dateRange, style = _a.style, onPressCell = _a.onPressCell, events = _a.events, onPressEvent = _a.onPressEvent, eventCellStyle = _a.eventCellStyle, ampm = _a.ampm, showTime = _a.showTime, scrollOffsetMinutes = _a.scrollOffsetMinutes, onSwipeHorizontal = _a.onSwipeHorizontal, hideNowIndicator = _a.hideNowIndicator, overlapOffset = _a.overlapOffset, renderEvent = _a.renderEvent, _b = _a.headerComponent, headerComponent = _b === void 0 ? null : _b, _c = _a.headerComponentStyle, headerComponentStyle = _c === void 0 ? {} : _c, _d = _a.hourStyle, hourStyle = _d === void 0 ? {} : _d;
    var scrollView = React.useRef(null);
    var now = useNow(!hideNowIndicator).now;
    React.useEffect(function () {
        if (scrollView.current && scrollOffsetMinutes && Platform.OS !== 'ios') {
            // We add delay here to work correct on React Native
            // see: https://stackoverflow.com/questions/33208477/react-native-android-scrollview-scrollto-not-working
            setTimeout(function () {
                if (scrollView && scrollView.current) {
                    scrollView.current.scrollTo({
                        y: (cellHeight * scrollOffsetMinutes) / 60,
                        animated: false,
                    });
                }
            }, Platform.OS === 'web' ? 0 : 10);
        }
    }, [scrollView, scrollOffsetMinutes, cellHeight]);
    var panResponder = usePanResponder({
        onSwipeHorizontal: onSwipeHorizontal,
    });
    var _onPressCell = React.useCallback(function (date) {
        onPressCell && onPressCell(date.toDate());
    }, [onPressCell]);
    var _renderMappedEvent = function (event) { return (React.createElement(CalendarEvent, { key: "".concat(event.start).concat(event.title).concat(event.end), event: event, onPressEvent: onPressEvent, eventCellStyle: eventCellStyle, showTime: showTime, eventCount: getCountOfEventsAtEvent(event, events), eventOrder: getOrderOfEvent(event, events), overlapOffset: overlapOffset, renderEvent: renderEvent, ampm: ampm })); };
    var theme = useTheme();
    return (React.createElement(React.Fragment, null,
        headerComponent != null ? React.createElement(View, { style: headerComponentStyle }, headerComponent) : null,
        React.createElement(ScrollView, __assign({ style: [
                {
                    height: containerHeight - cellHeight * 3,
                },
                style,
            ], ref: scrollView, scrollEventThrottle: 32 }, (Platform.OS !== 'web' ? panResponder.panHandlers : {}), { showsVerticalScrollIndicator: false, nestedScrollEnabled: true, contentOffset: Platform.OS === 'ios' ? { x: 0, y: scrollOffsetMinutes } : { x: 0, y: 0 } }),
            React.createElement(View, __assign({ style: [u['flex-1'], theme.isRTL ? u['flex-row-reverse'] : u['flex-row']] }, (Platform.OS === 'web' ? panResponder.panHandlers : {})),
                React.createElement(View, { style: [u['z-20'], u['w-50']] }, hours.map(function (hour, index) { return (React.createElement(HourGuideColumn, { key: hour, cellHeight: cellHeight, hour: hour, ampm: ampm, index: index, hourStyle: hourStyle })); })),
                dateRange.map(function (date) { return (React.createElement(View, { style: [u['flex-1'], u['overflow-hidden']], key: date.toString() },
                    hours.map(function (hour, index) { return (React.createElement(HourGuideCell, { key: hour, cellHeight: cellHeight, date: date, hour: hour, onPress: _onPressCell, index: index })); }),
                    events
                        .filter(function (_a) {
                        var start = _a.start;
                        return dayjs(start).isBetween(date.startOf('day'), date.endOf('day'), null, '[)');
                    })
                        .map(_renderMappedEvent),
                    events
                        .filter(function (_a) {
                        var start = _a.start, end = _a.end;
                        return dayjs(start).isBefore(date.startOf('day')) &&
                            dayjs(end).isBetween(date.startOf('day'), date.endOf('day'), null, '[)');
                    })
                        .map(function (event) { return (__assign(__assign({}, event), { start: dayjs(event.end).startOf('day') })); })
                        .map(_renderMappedEvent),
                    events
                        .filter(function (_a) {
                        var start = _a.start, end = _a.end;
                        return dayjs(start).isBefore(date.startOf('day')) &&
                            dayjs(end).isAfter(date.endOf('day'));
                    })
                        .map(function (event) { return (__assign(__assign({}, event), { start: dayjs(event.end).startOf('day'), end: dayjs(event.end).endOf('day') })); })
                        .map(_renderMappedEvent),
                    isToday(date) && !hideNowIndicator && (React.createElement(View, { style: __assign(__assign({}, styles.nowIndicator), { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', top: "".concat(getRelativeTopInDay(now), "%") }) },
                        React.createElement(View, { style: { width: 2, height: 2, borderRadius: 1, backgroundColor: theme.palette.nowIndicator } }),
                        React.createElement(View, { style: [
                                // styles.nowIndicator,
                                { backgroundColor: theme.palette.nowIndicator },
                            ] }))))); })))));
}
var CalendarBody = typedMemo(_CalendarBody);

function _CalendarEventForMonthView(_a) {
    var event = _a.event, onPressEvent = _a.onPressEvent, eventCellStyle = _a.eventCellStyle, renderEvent = _a.renderEvent, date = _a.date, dayOfTheWeek = _a.dayOfTheWeek, calendarWidth = _a.calendarWidth, isRTL = _a.isRTL, eventMinHeightForMonthView = _a.eventMinHeightForMonthView;
    var theme = useTheme();
    var _b = React.useMemo(function () { return getEventSpanningInfo(event, date, dayOfTheWeek, calendarWidth); }, [date, dayOfTheWeek, event, calendarWidth]), eventWidth = _b.eventWidth, isMultipleDays = _b.isMultipleDays, isMultipleDaysStart = _b.isMultipleDaysStart, eventWeekDuration = _b.eventWeekDuration;
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
    });
    return (React.createElement(TouchableOpacity, { style: { minHeight: eventMinHeightForMonthView }, onPress: function () { return onPressEvent === null || onPressEvent === void 0 ? void 0 : onPressEvent(event); } }, (!isMultipleDays && date.isSame(event.start, 'day')) ||
        (isMultipleDays && isMultipleDaysStart) ? (renderEvent ? (renderEvent(event, touchableOpacityProps)) : (React.createElement(View, __assign({}, touchableOpacityProps),
        React.createElement(Text, { style: [
                { color: theme.palette.primary.contrastText },
                theme.typography.xs,
                u['truncate'],
                isRTL && { textAlign: 'right' },
            ], numberOfLines: 1 }, event.title)))) : null));
}
var CalendarEventForMonthView = typedMemo(_CalendarEventForMonthView);

function _CalendarBodyForMonthView(_a) {
    var containerHeight = _a.containerHeight, targetDate = _a.targetDate, style = _a.style, onPressCell = _a.onPressCell, events = _a.events, onPressEvent = _a.onPressEvent, eventCellStyle = _a.eventCellStyle, onSwipeHorizontal = _a.onSwipeHorizontal, hideNowIndicator = _a.hideNowIndicator, renderEvent = _a.renderEvent, maxVisibleEventCount = _a.maxVisibleEventCount, weekStartsOn = _a.weekStartsOn, eventMinHeightForMonthView = _a.eventMinHeightForMonthView;
    var now = useNow(!hideNowIndicator).now;
    var _b = React.useState(0), calendarWidth = _b[0], setCalendarWidth = _b[1];
    var panResponder = usePanResponder({
        onSwipeHorizontal: onSwipeHorizontal,
    });
    var weeks = calendarize(targetDate.toDate(), weekStartsOn);
    var minCellHeight = containerHeight / 5 - 30;
    var theme = useTheme();
    return (React.createElement(View, __assign({ style: [
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
        ], onLayout: function (_a) {
            var layout = _a.nativeEvent.layout;
            return setCalendarWidth(layout.width);
        } }, panResponder.panHandlers), weeks.map(function (week, i) { return (React.createElement(View, { key: i, style: [
            u['flex-1'],
            theme.isRTL ? u['flex-row-reverse'] : u['flex-row'],
            Platform.OS === 'android' && style,
            {
                minHeight: minCellHeight,
            },
        ] }, week
        .map(function (d) { return (d > 0 ? targetDate.date(d) : null); })
        .map(function (date, ii) { return (React.createElement(TouchableOpacity, { onPress: function () { return date && onPressCell && onPressCell(date.toDate()); }, style: [
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
        ], key: ii },
        React.createElement(View, { style: [__assign({}, ((date === null || date === void 0 ? void 0 : date.format('YYYY-MM-DD')) === now.format('YYYY-MM-DD')) ? { textAlign: 'center', backgroundColor: theme.palette.primary.main, width: 22, height: 18, borderRadius: 16, marginLeft: 15, justifyContent: 'center', alignItems: 'center' } : { textAlign: 'center', alignSelf: 'center' })] },
            React.createElement(Text, { style: [
                    { textAlign: 'center' },
                    theme.typography.sm,
                    {
                        color: (date === null || date === void 0 ? void 0 : date.format('YYYY-MM-DD')) === now.format('YYYY-MM-DD')
                            ? '#fff'
                            : theme.palette.gray['800'],
                    },
                ] }, date && date.format('D'))),
        date &&
            events
                .sort(function (a, b) {
                if (dayjs(a.start).isSame(b.start, 'day')) {
                    var aDuration = dayjs.duration(dayjs(a.end).diff(dayjs(a.start))).days();
                    var bDuration = dayjs.duration(dayjs(b.end).diff(dayjs(b.start))).days();
                    return bDuration - aDuration;
                }
                return a.start.getTime() - b.start.getTime();
            })
                .filter(function (_a) {
                var start = _a.start, end = _a.end;
                return date.isBetween(dayjs(start).startOf('day'), dayjs(end).endOf('day'), null, '[)');
            })
                .reduce(function (elements, event, index, events) { return __spreadArray(__spreadArray([], elements, true), [
                index > maxVisibleEventCount ? null : index === maxVisibleEventCount ? (React.createElement(Text, { key: index, style: { fontSize: 11, marginTop: 2, fontWeight: 'bold' } },
                    events.length - maxVisibleEventCount,
                    " More")) : (React.createElement(CalendarEventForMonthView, { key: index, event: event, eventCellStyle: eventCellStyle, onPressEvent: onPressEvent, renderEvent: renderEvent, date: date, dayOfTheWeek: ii, calendarWidth: calendarWidth, isRTL: theme.isRTL, eventMinHeightForMonthView: eventMinHeightForMonthView })),
            ]); }, []))); }))); })));
}
var CalendarBodyForMonthView = typedMemo(_CalendarBodyForMonthView);

function _CalendarHeader(_a) {
    var dateRange = _a.dateRange, cellHeight = _a.cellHeight, style = _a.style, allDayEvents = _a.allDayEvents, onPressDateHeader = _a.onPressDateHeader, onPressEvent = _a.onPressEvent, activeDate = _a.activeDate, _b = _a.headerContentStyle, headerContentStyle = _b === void 0 ? {} : _b, _c = _a.dayHeaderStyle, dayHeaderStyle = _c === void 0 ? {} : _c, _d = _a.dayHeaderHighlightColor, dayHeaderHighlightColor = _d === void 0 ? '' : _d, _e = _a.weekDayHeaderHighlightColor, weekDayHeaderHighlightColor = _e === void 0 ? '' : _e, _f = _a.showAllDayEventCell, showAllDayEventCell = _f === void 0 ? true : _f;
    var _onPressHeader = React.useCallback(function (date) {
        onPressDateHeader && onPressDateHeader(date);
    }, [onPressDateHeader]);
    var _onPressEvent = React.useCallback(function (event) {
        onPressEvent && onPressEvent(event);
    }, [onPressEvent]);
    var theme = useTheme();
    var borderColor = { borderColor: theme.palette.gray['200'] };
    var primaryBg = { backgroundColor: theme.palette.primary.main };
    return (React.createElement(View, { style: [
            showAllDayEventCell ? u['border-b-2'] : {},
            showAllDayEventCell ? borderColor : {},
            theme.isRTL ? u['flex-row-reverse'] : u['flex-row'],
            style,
        ] },
        React.createElement(View, { style: [u['z-10'], u['w-50'], borderColor] }),
        dateRange.map(function (date) {
            var shouldHighlight = activeDate ? date.isSame(activeDate, 'date') : isToday(date);
            return (React.createElement(TouchableOpacity, { style: [u['flex-1'], u['pt-2']], onPress: function () { return _onPressHeader(date.toDate()); }, disabled: onPressDateHeader === undefined, key: date.toString() },
                React.createElement(View, { style: [
                        { height: cellHeight },
                        objHasContent(headerContentStyle) ? headerContentStyle : u['justify-between'],
                    ] },
                    React.createElement(Text, { style: [
                            theme.typography.xs,
                            u['text-center'],
                            {
                                color: shouldHighlight
                                    ? stringHasContent(weekDayHeaderHighlightColor)
                                        ? weekDayHeaderHighlightColor
                                        : theme.palette.primary.main
                                    : theme.palette.gray['500'],
                            },
                        ] }, date.format('ddd')),
                    React.createElement(View, { style: objHasContent(dayHeaderStyle)
                            ? dayHeaderStyle
                            : shouldHighlight
                                ? [
                                    primaryBg,
                                    // u['h-36'],
                                    // u['w-36'],
                                    // u['pb-6'],
                                    // u['rounded-full'],
                                    u['items-center'],
                                    // u['justify-center'],
                                    // u['self-center'],
                                    // u['z-20'],
                                    { width: 32, marginHorizontal: 10, height: 24, justifyContent: 'center', alignItems: 'center', borderRadius: 6 }
                                ]
                                : { marginBottom: 0 } },
                        React.createElement(Text, { style: [
                                {
                                    color: shouldHighlight
                                        ? stringHasContent(dayHeaderHighlightColor)
                                            ? dayHeaderHighlightColor
                                            : theme.palette.primary.contrastText
                                        : theme.palette.gray['800'],
                                },
                                theme.typography.xl,
                                u['text-center'],
                                { flex: 1, marginTop: 1 },
                                Platform.OS === 'web' &&
                                    shouldHighlight &&
                                    !stringHasContent(dayHeaderHighlightColor) &&
                                    u['mt-6'],
                            ] }, date.format('D')))),
                showAllDayEventCell ? (React.createElement(View, { style: [
                        u['border-l'],
                        { borderColor: theme.palette.gray['200'] },
                        { height: cellHeight },
                    ] }, allDayEvents.map(function (event) {
                    if (!dayjs(date).isBetween(event.start, event.end, 'day', '[]')) {
                        return null;
                    }
                    return (React.createElement(TouchableOpacity, { style: [eventCellCss.style, primaryBg, u['mt-2']], key: "".concat(event.start).concat(event.title), onPress: function () { return _onPressEvent(event); } },
                        React.createElement(Text, { style: {
                                fontSize: theme.typography.sm.fontSize,
                                color: theme.palette.primary.contrastText,
                            } }, event.title)));
                }))) : null));
        })));
}
var CalendarHeader = typedMemo(_CalendarHeader);

function _CalendarHeaderForMonthView(_a) {
    var locale = _a.locale, weekStartsOn = _a.weekStartsOn, style = _a.style;
    var dates = getDatesInWeek(new Date(), weekStartsOn, locale);
    var todayWeekNum = dayjs().day();
    var theme = useTheme();
    return (React.createElement(View, { style: [
            u['border-b'],
            { borderColor: theme.palette.gray['100'] },
            theme.isRTL ? u['flex-row-reverse'] : u['flex-row'],
            style,
        ] }, dates.map(function (date) { return (React.createElement(View, { style: { flex: 1, paddingTop: 2 }, key: date.toISOString() },
        React.createElement(View, { style: { height: 30 } },
            React.createElement(Text, { style: [
                    u['text-center'],
                    {
                        color: todayWeekNum === date.day()
                            ? theme.palette.primary.main
                            : theme.palette.gray['800'],
                    },
                ] }, date.format('ddd'))))); })));
}
var CalendarHeaderForMonthView = typedMemo(_CalendarHeaderForMonthView);

function _CalendarContainer(_a) {
    var events = _a.events, height = _a.height, hourRowHeight = _a.hourRowHeight, _b = _a.ampm, ampm = _b === void 0 ? false : _b, date = _a.date, eventCellStyle = _a.eventCellStyle, _c = _a.locale, locale = _c === void 0 ? 'en' : _c, _d = _a.hideNowIndicator, hideNowIndicator = _d === void 0 ? false : _d, _e = _a.mode, mode = _e === void 0 ? 'week' : _e, overlapOffset = _a.overlapOffset, _f = _a.scrollOffsetMinutes, scrollOffsetMinutes = _f === void 0 ? 0 : _f, _g = _a.showTime, showTime = _g === void 0 ? true : _g, _h = _a.headerContainerStyle, headerContainerStyle = _h === void 0 ? {} : _h, _j = _a.headerContentStyle, headerContentStyle = _j === void 0 ? {} : _j, _k = _a.dayHeaderStyle, dayHeaderStyle = _k === void 0 ? {} : _k, _l = _a.dayHeaderHighlightColor, dayHeaderHighlightColor = _l === void 0 ? '' : _l, _m = _a.weekDayHeaderHighlightColor, weekDayHeaderHighlightColor = _m === void 0 ? '' : _m, _o = _a.bodyContainerStyle, bodyContainerStyle = _o === void 0 ? {} : _o, _p = _a.swipeEnabled, swipeEnabled = _p === void 0 ? true : _p, _q = _a.weekStartsOn, weekStartsOn = _q === void 0 ? 0 : _q, onChangeDate = _a.onChangeDate, onPressCell = _a.onPressCell, onPressDateHeader = _a.onPressDateHeader, onPressEvent = _a.onPressEvent, renderEvent = _a.renderEvent, _r = _a.renderHeader, HeaderComponent = _r === void 0 ? CalendarHeader : _r, _s = _a.renderHeaderForMonthView, HeaderComponentForMonthView = _s === void 0 ? CalendarHeaderForMonthView : _s, _t = _a.weekEndsOn, weekEndsOn = _t === void 0 ? 6 : _t, _u = _a.maxVisibleEventCount, maxVisibleEventCount = _u === void 0 ? 3 : _u, _v = _a.eventMinHeightForMonthView, eventMinHeightForMonthView = _v === void 0 ? 22 : _v, activeDate = _a.activeDate, _w = _a.headerComponent, headerComponent = _w === void 0 ? null : _w, _x = _a.headerComponentStyle, headerComponentStyle = _x === void 0 ? {} : _x, _y = _a.hourStyle, hourStyle = _y === void 0 ? {} : _y, _z = _a.showAllDayEventCell, showAllDayEventCell = _z === void 0 ? true : _z;
    var _0 = React__default.useState(dayjs(date)), targetDate = _0[0], setTargetDate = _0[1];
    React__default.useEffect(function () {
        if (date) {
            setTargetDate(dayjs(date));
        }
    }, [date]);
    var allDayEvents = React__default.useMemo(function () { return events.filter(function (event) { return isAllDayEvent(event.start, event.end); }); }, [events]);
    var daytimeEvents = React__default.useMemo(function () { return events.filter(function (event) { return !isAllDayEvent(event.start, event.end); }); }, [events]);
    var dateRange = React__default.useMemo(function () {
        switch (mode) {
            case 'month':
                return getDatesInMonth(targetDate, locale);
            case 'week':
                return getDatesInWeek(targetDate, weekStartsOn, locale);
            case '3days':
                return getDatesInNextThreeDays(targetDate, locale);
            case 'day':
                return getDatesInNextOneDay(targetDate, locale);
            case 'custom':
                return getDatesInNextCustomDays(targetDate, weekStartsOn, weekEndsOn, locale);
            default:
                throw new Error("[react-native-big-calendar] The mode which you specified \"".concat(mode, "\" is not supported."));
        }
    }, [mode, targetDate, locale, weekEndsOn, weekStartsOn]);
    React__default.useEffect(function () {
        if (onChangeDate) {
            onChangeDate([dateRange[0].toDate(), dateRange.slice(-1)[0].toDate()]);
        }
    }, [dateRange, onChangeDate]);
    var cellHeight = React__default.useMemo(function () { return hourRowHeight || Math.max(height - 30, MIN_HEIGHT) / 24; }, [height, hourRowHeight]);
    var theme = useTheme();
    var onSwipeHorizontal = React__default.useCallback(function (direction) {
        if (!swipeEnabled) {
            return;
        }
        if ((direction === 'LEFT' && !theme.isRTL) || (direction === 'RIGHT' && theme.isRTL)) {
            setTargetDate(targetDate.add(modeToNum(mode, targetDate), 'day'));
        }
        else {
            setTargetDate(targetDate.add(modeToNum(mode, targetDate) * -1, 'day'));
        }
    }, [swipeEnabled, targetDate, mode, theme.isRTL]);
    var commonProps = {
        cellHeight: cellHeight,
        dateRange: dateRange,
        mode: mode,
        onPressEvent: onPressEvent,
    };
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
        };
        return (React__default.createElement(React__default.Fragment, null,
            React__default.createElement(HeaderComponentForMonthView, __assign({}, headerProps_1)),
            React__default.createElement(CalendarBodyForMonthView, __assign({}, commonProps, { style: bodyContainerStyle, containerHeight: height, events: __spreadArray(__spreadArray([], daytimeEvents, true), allDayEvents), eventCellStyle: eventCellStyle, weekStartsOn: weekStartsOn, hideNowIndicator: hideNowIndicator, onPressCell: onPressCell, onPressEvent: onPressEvent, onSwipeHorizontal: onSwipeHorizontal, renderEvent: renderEvent, targetDate: targetDate, maxVisibleEventCount: maxVisibleEventCount, eventMinHeightForMonthView: eventMinHeightForMonthView }))));
    }
    var headerProps = __assign(__assign({}, commonProps), { style: headerContainerStyle, allDayEvents: allDayEvents, onPressDateHeader: onPressDateHeader, activeDate: activeDate, headerContentStyle: headerContentStyle, dayHeaderStyle: dayHeaderStyle, dayHeaderHighlightColor: dayHeaderHighlightColor, weekDayHeaderHighlightColor: weekDayHeaderHighlightColor, showAllDayEventCell: showAllDayEventCell });
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement(HeaderComponent, __assign({}, headerProps)),
        React__default.createElement(CalendarBody, __assign({}, commonProps, { style: bodyContainerStyle, containerHeight: height, events: daytimeEvents, eventCellStyle: eventCellStyle, hideNowIndicator: hideNowIndicator, overlapOffset: overlapOffset, scrollOffsetMinutes: scrollOffsetMinutes, ampm: ampm, showTime: showTime, onPressCell: onPressCell, onPressEvent: onPressEvent, onSwipeHorizontal: onSwipeHorizontal, renderEvent: renderEvent, headerComponent: headerComponent, headerComponentStyle: headerComponentStyle, hourStyle: hourStyle }))));
}
var CalendarContainer = typedMemo(_CalendarContainer);

dayjs.extend(isBetween);
function _Calendar(_a) {
    var _b = _a.theme, theme = _b === void 0 ? defaultTheme : _b, isRTL = _a.isRTL, props = __rest(_a, ["theme", "isRTL"]);
    var _theme = merge(defaultTheme, theme, { isRTL: isRTL });
    return (React__default.createElement(ThemeContext.Provider, { value: _theme },
        React__default.createElement(CalendarContainer, __assign({}, props))));
}
var Calendar = typedMemo(_Calendar);

dayjs.extend(duration);
dayjs.extend(isBetween);

export { Calendar, CalendarBody, CalendarBodyForMonthView, CalendarEvent, CalendarEventForMonthView, CalendarHeader, CalendarHeaderForMonthView, DAY_MINUTES, DefaultCalendarEventRenderer, HOUR_GUIDE_WIDTH, MIN_HEIGHT, OVERLAP_OFFSET, OVERLAP_PADDING, ThemeContext, Calendar as default, defaultTheme, eventCellCss, formatHour, formatStartEnd, getCountOfEventsAtEvent, getDatesInMonth, getDatesInNextCustomDays, getDatesInNextOneDay, getDatesInNextThreeDays, getDatesInWeek, getEventSpanningInfo, getOrderOfEvent, getRelativeTopInDay, getStyleForOverlappingEvent, hours, isAllDayEvent, isPair, isToday, modeToNum, objHasContent, stringHasContent, todayInMinutes, typedMemo, u, useTheme };
//# sourceMappingURL=index.es.js.map
