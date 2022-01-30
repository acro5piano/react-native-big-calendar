![test](https://github.com/llotheo/react-native-big-calendar/workflows/test/badge.svg)
![release](https://github.com/llotheo/react-native-big-calendar/workflows/release/badge.svg)
[![npm version](https://badge.fury.io/js/react-native-big-calendar.svg)](https://badge.fury.io/js/react-native-big-calendar)
[![Netlify Status](https://api.netlify.com/api/v1/badges/ca0f2cc8-bb4f-4a18-be48-c2b10e2b6046/deploy-status)](https://app.netlify.com/sites/react-native-big-calendar/deploys)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=llotheo/react-native-big-calendar)](https://dependabot.com)

# react-native-big-calendar

Cross-platform gcal/outlook like calendar component for React Native.

### ⚠️ Help me to debug this component ⚠️

It's a hard task to debug three platforms. I usually develop with the Web version first, then confirm its functionality with real devices. My PC is Linux and my phone is Android, so Android is easiliy tested, but to debug on iOS, I have to bring my Macbook Pro from my garage and connect my wife's iPhone and test it. Every time I launch my Macbook Pro, it requires the Xcode update and even full system update. It takes so long time to start debug. As React Native works on iOS better than Android, I ~~always~~ sometimes skip testing it, so there should be a bug on iOS. If you help me debug it, I would much appreciate!

[Components Demo](https://react-native-big-calendar.netlify.com/?path=/story/desktop--3days-mode)

<img src="./assets/screenshot-mobile.png" height="500">

<img src="https://user-images.githubusercontent.com/10719495/117629046-b98a2480-b1b4-11eb-89df-02c373438e45.png" height="500">

# Features

- Cross Platform: Runs on the Web, iOS, Android with the power of React
- Type-safe: Fully written in TypeScript
- Customizable: Able to provide your own theme, and pass your component to render.
- Lightweight: ~37.4KB, dependency is `dayjs` and `calendarize` and `merge-anything`

# Install

```
npm install --save react-native-big-calendar
```

Or if you use Yarn:

```
yarn add react-native-big-calendar
```

### Other dependencies

Please ensure peer dependencies are installed.

```sh
npm install react react-native
```

### TypeScript

If you use TypeScript ensure `@types/react` and `@types/react-native` is installed. `react-native-big-calendar` internally uses them.

```sh
npm install --save-dev @types/react @types/react-native
```

### Usage on the Web

If you are using this module on the Web, please install `react-native-web`.

```sh
npm install react-native-web
```

If you are using Create React App, you are ready to go 🎉

For more details, please refer to the official react-native-web installation guide.

https://github.com/necolas/react-native-web

# Getting Started

```typescript
import { Calendar } from 'react-native-big-calendar'

const events = [
  {
    title: 'Meeting',
    start: new Date(2020, 1, 11, 10, 0),
    end: new Date(2020, 1, 11, 10, 30),
  },
  {
    title: 'Coffee break',
    start: new Date(2020, 1, 11, 15, 45),
    end: new Date(2020, 1, 11, 16, 30),
  },
]

function App() {
  return <Calendar events={events} height={600} />
}
```

# API Documentation

**Summary**

```typescript
export interface CalendarProps<T extends ICalendarEventBase> {
  events: T
  height: number
  overlapOffset?: number
  hourRowHeight?: number
  ampm?: boolean
  date?: Date
  eventCellStyle?: EventCellStyle<T>
  calendarContainerStyle?: ViewStyle
  headerContainerStyle?: ViewStyle
  bodyContainerStyle?: ViewStyle
  renderEvent?: (
    event: T,
    touchableOpacityProps: CalendarTouchableOpacityProps,
  ) => ReactElement | null
  renderHeader?: React.ComponentType<CalendarHeaderProps<T> & { mode: Mode }>
  renderHeaderForMonthView?: React.ComponentType<CalendarHeaderForMonthViewProps>
  locale?: string
  hideNowIndicator?: boolean
  mode?: Mode
  scrollOffsetMinutes?: number
  showTime?: boolean
  swipeEnabled?: boolean
  weekStartsOn?: WeekNum
  weekEndsOn?: WeekNum
  onChangeDate?: DateRangeHandler
  onPressCell?: (date: Date) => void
  onPressDateHeader?: (date: Date) => void
  onPressEvent?: (event: ICalendarEvent<T>) => void
  eventMinHeightForMonthView?: number
  activeDate?: Date
  headerComponent?: React.ReactElement | null
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
  fadeOutDuration?: number
}
```

`<Calendar />` Props are:

| name                          | required | type                                                   | description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------- | -------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `events`                      | yes      | `ICalendarEvent<T>[]`                                  | The events which will be rendered on the calendar. You can extend the type `ICalendarEvent` by providing a value to generic type T (see `./stories/events.tsx` for an example). with optional children to display custom components inside the event, and optional event renderer function to take complete control over the rendered event (advanced feature). Events that occur during the same time range will be layered, offset, and given a unique color. |
| `height`                      | yes      | `number`                                               | Calendar height.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `hideNowIndicator`            | no       | `boolean`                                              | Hides the indicator for the current time. By default the now indicator is shown.                                                                                                                                                                                                                                                                                                                                                                                |
| `hourRowHeight`               | no       | `number`                                               | Hour row height                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `onPressEvent`                | no       | `(event: ICalendarEvent<T>) => void`                   | Event handler which will be fired when the user clicks an event.                                                                                                                                                                                                                                                                                                                                                                                                |
| `onChangeDate`                | no       | `([start: Date, end: Date]) => void`                   | Event handler which will be fired when the current date range changed.                                                                                                                                                                                                                                                                                                                                                                                          |
| `onPressCell`                 | no       | `(date: Date) => void`                                 | Event handler which will be fired when the current date cell is clicked. The minute set to 0.                                                                                                                                                                                                                                                                                                                                                                   |
| `onPressDateHeader`           | no       | `(date: Date) => void`                                 | Event handler which will be fired when the user clicks a date from the header.                                                                                                                                                                                                                                                                                                                                                                                  |
| `mode`                        | no       | 'month' \| 'week' \| `'3days' \| 'day' \| 'custom'`    |                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `eventCellStyle`              | no       | `ViewStyle \| (event: ICalendarEvent<T>) => ViewStyle` | The style of Event cell. Accepts either style object (static) or function (dynamic).                                                                                                                                                                                                                                                                                                                                                                            |
| `headerContentStyle`          | no       | `ViewStyle`                                            | The style of the Header's content. Accepts a style object (static).                                                                                                                                                                                                                                                                                                                                                                                             |
| `dayHeaderStyle`              | no       | `ViewStyle`                                            | The style of the Header's day numbers. Accepts a style object (static).                                                                                                                                                                                                                                                                                                                                                                                         |
| `dayHeaderHighlightColor`     | no       | `string`                                               | The style of the Header's highlighted day number. Accepts a style object (static).                                                                                                                                                                                                                                                                                                                                                                              |
| `weekDayHeaderHighlightColor` | no       | `string`                                               | The style of the Header's highlighted week day. Accepts a style object (static).                                                                                                                                                                                                                                                                                                                                                                                |
| `scrollOffsetMinutes`         | no       | `number`                                               | Scroll to specific minutes in a day. e.g.) set `480` to scroll to 8am when the calendar rendered.                                                                                                                                                                                                                                                                                                                                                               |
| `date`                        | no       | `Date`                                                 | Initial date of calendar. Defualts to `new Date` (current time).                                                                                                                                                                                                                                                                                                                                                                                                |
| `swipeEnabled`                | no       | `boolean`                                              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `showTime`                    | no       | `boolean`                                              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `ampm`                        | no       | `boolean`                                              | Use 12 hours time format instead of 24 hours.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `weekStartsOn`                | no       | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6`                      | Which day the week starts on. Sunday is `0`.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `weekEndsOn`                  | no       | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6`                      | Which day the week ends on. Sunday is `0`.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `locale`                      | no       | `string`                                               | Custom locale. See I18n section                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `overlapOffset`               | no       | `number`                                               | Adjusts the indentation of events that occur during the same time period. Defaults to 20 on web and 8 on mobile.                                                                                                                                                                                                                                                                                                                                                |
| `isRTL`                       | no       | `boolean`                                              | Switches the direction of the layout for use with RTL languages. Defaults to false.                                                                                                                                                                                                                                                                                                                                                                             |
| `renderEvent`                 | no       | `EventRenderer`                                        | Custom event renderer. See below type definition.                                                                                                                                                                                                                                                                                                                                                                                                               |
| `renderHeader`                | no       | `HeaderRenderer`                                       | Custom header renderer.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `eventMinHeightForMonthView`  | no       | `number`                                               | Minimun height for events in month view. Should match the min-height of your custom events. Defaults to 22.                                                                                                                                                                                                                                                                                                                                                     |
| `activeDate`                  | no       | `Date`                                                 | Date highlighted in header. Defualts to today (current time).                                                                                                                                                                                                                                                                                                                                                                                                   |
| `headerComponent`             | no       | `ReactElement`                                         | Calendar body header component.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `hourStyle`                   | no       | `TextStyle`                                            | Calendar body hours styling. Accepts a style object (static)                                                                                                                                                                                                                                                                                                                                                                                                    |
| `showAllDayEventCell`         | no       | `boolean`                                              | Show/hide the all day event cell                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `showHeaderPan`               | no       | `boolean`                                              | Show/hide the top header pan arrows or custom components                                                                                                                                                                                                                                                                                                                                                                                                        |
| `panLeftContainerStyle`       | no       | `ViewStyle`                                            | Pan left container style. Accepts a style object (static).                                                                                                                                                                                                                                                                                                                                                                                                      |
| `panLeftStyle`                | no       | `TextStyle`                                            | Pan left style. Accepts a style object (static).                                                                                                                                                                                                                                                                                                                                                                                                                |
| `panLeftComponent`            | no       | `ReactElement`                                         | Pan left component.                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `panRightContainerStyle`      | no       | `ViewStyle`                                            | Pan right container style. Accepts a style object (static).                                                                                                                                                                                                                                                                                                                                                                                                     |
| `panRightStyle`               | no       | `TextStyle`                                            | Pan right style. Accepts a style object (static).                                                                                                                                                                                                                                                                                                                                                                                                               |
| `panRightComponent`           | no       | `ReactElement`                                         | Pan right component.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `topHeaderComponent`          | no       | `ReactElement`                                         | Top header component.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `showWeekDayModes`            | no       | `Mode[]`                                               | Modes array to show the week day on.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `showWeekDayInnerModes`       | no       | `Mode[]`                                               | Modes array to show the week day on inside with the week day.                                                                                                                                                                                                                                                                                                                                                                                                   |
| `showShortWeekDayModes`       | no       | `Mode[]`                                               | Show short (1 letter) week day.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `weekDayStyle`                | no       | `TextStyle`                                            | Week day style. Accepts a style object (static).                                                                                                                                                                                                                                                                                                                                                                                                                |
| `datesArrayStyle`             | no       | `ViewStyle`                                            | Dates array style. Accepts a style object (static).                                                                                                                                                                                                                                                                                                                                                                                                             |
| `showDatesArrayStyleModes`    | no       | `Mode[]`                                               | Modes array to apply the Dates array Style to.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `cellsBorderStyle`            | no       | `ViewStyle`                                            | Calendar body cells style. Accepts a style object (static).                                                                                                                                                                                                                                                                                                                                                                                                     |
| `fullHeaderStyle`             | no       | `ViewStyle`                                            | Full header style. Accepts a style object (static).                                                                                                                                                                                                                                                                                                                                                                                                             |
| `fullBodyStyle`               | no       | `ViewStyle`                                            | Full body style. Accepts a style object (static).                                                                                                                                                                                                                                                                                                                                                                                                               |
| `increaseFirstRowHeight`      | no       | `number`                                               | Number to multiply to increase first row height.                                                                                                                                                                                                                                                                                                                                                                                                                |
| `animatePan`                  | no       | `boolean`                                              | Animate pan transition (Fade Out/In) for the Calendar Body.                                                                                                                                                                                                                                                                                                                                                                                                     |
| `fadeInDuration`              | no       | `number`                                               | Animate pan transition (Fade Out/In) duration in ms for the Calendar Body.                                                                                                                                                                                                                                                                                                                                                                                      |
| `contentItemsContainerStyle`  | no       | `ViewStyle`                                            | Body's ScrollView items container styles.                                                                                                                                                                                                                                                                                                                                                                                                                       |

## EventRenderer

```typescript
type EventRenderer<T> = (
  event: ICalendarEvent<T>,
  touchableOpacityProps: CalendarTouchableOpacityProps,
) => ReactElement | null
```

For more information, see [Storybook](https://github.com/llotheo/react-native-big-calendar/blob/master/stories/index.stories.tsx)

## ICalendarEventBase

```typescript
interface ICalendarEventBase {
  start: Date
  end: Date
  title: string
  children?: ReactElement | null
}
```

## All day events

All day events should start and end on 0 in hour, minutes, and seconds (T00:00:00). For example:

```typescript
{
    title: 'all day event',
    start: "2021-12-24T00:00:00.000Z",
    end: "2021-12-24T00:00:00.000Z", // same date as `start`
}
```

## Using a custom event render function

You can specify custom event render function which receives the calculated `TouchableOpacity` prop and `event`.

- The function `renderEvent` must return a `ReactElement`.
- The component _should_ be wrapped inside a `TouchableOpacity` or _any_ DOM element which accepts positioning and click events (`onPress`, ...).

```typescript
export interface MyCustomEventType {
  color: string
}

const renderEvent = <T extends ICalendarEventBase>(
  event: T,
  touchableOpacityProps: CalendarTouchableOpacityProps,
) => (
  <TouchableOpacity {...touchableOpacityProps}>
    <Text>{`My custom event: ${event.title} with a color: ${event.color}`}</Text>
  </TouchableOpacity>
)

<Calendar renderEvent={renderEvent} />
```

## Displaying event's notes

Your events can contain a prop `children` An example can be found [here](./stories/events.tsx).

```typescript
const eventNotes = useMemo(
  () => (
    <View style={{ marginTop: 3 }}>
      <Text style={{ fontSize: 10, color: 'white' }}> Phone number: 555-123-4567 </Text>
      <Text style={{ fontSize: 10, color: 'white' }}> Arrive 15 minutes early </Text>
    </View>
  ),
  [],
)

export const myEvents: ICalendarEventBase[] = [
  {
    title: 'Custom reminder',
    start: dayjs().set('hour', 16).set('minute', 0).toDate(),
    end: dayjs().set('hour', 17).set('minute', 0).toDate(),
    children: eventNotes,
  },
]
```

## Theme

You can customize the calendar by passing the `theme` prop. `theme` should be like this interface partially:

```typescript
export interface Palette {
  main: string
  contrastText: string
}

export interface ThemeInterface {
  palette: {
    primary: Palette
    evenCellBg: string
    oddCellBg: string
    nowIndicator: string
    gray: {
      100: string
      200: string
      300: string
      500: string
      800: string
    }
  }
  isRTL: boolean
  typography: {
    fontFamily?: string
    xs: Typography
    sm: Typography
    xl: Typography
  }
  eventCellOverlappings: readonly Palette[]
}
```

For example:

```typescript
const darkTheme = {
  palette: {
    primary: {
      main: '#6185d0',
      contrastText: '#000',
    },
    evenCellBg: '#333',
    oddCellBg: '#555',
    gray: {
      '100': '#333',
      '200': '#666',
      '300': '#888',
      '500': '#aaa',
      '800': '#ccc',
    },
  },
}

<Calendar
  height={SCREEN_HEIGHT}
  theme={darkTheme}
/>
```

## I18n

Please specity your locale via `locale` prop **and** import day.js locale file:

```typescript
import 'dayjs/locale/ja'

<Calendar
  locale="ja"
  {/* ... */}
/>
```

You can find your dayjs locale here:

https://github.com/iamkun/dayjs/tree/dev/src/locale

# Screenshots

<img src="./assets/screenshot-mobile.png" height="500">
<img src="./assets/screenshot-simulator.png" height="500">
<img src="./assets/screenshot-desktop.png" height="500">

# Who's using this?

<p>
<a href="https://www.nupp1.io?utm_source=react-native-big-calendar">
  <img src="https://www.nupp1.io/images/logo-with-text.svg" height="80" />
</a>
</p>
</p>
<a href="https://www.telaqua.com?utm_source=react-native-big-calendar">
  <img src="https://www.telaqua.com/static/images/Logo.svg" height="80" />
</a>
</p>

If you are using this library, please send a PR to add your organization!

# Enterprise support

First, thank you for your interest in this project. As this library is getting famous, lots of people are requesting features they need. I would like to respond all of them as possible, but there are limited hours I'm working on this. To be a full-time open sourcer and make this project sustainable, I've decided to add the enterprise support.

Enterprise customers are able to obtain:

- Full customization like colors, logos, images, and more.
- Priority response and development.
- Consultancy for React, TypeScript, and React Native application.

Note that some Enterprise features will be merged to the OSS version too.

If you are interested in those features, please send an email to: ketsume0211@gmail.com

# Hire me

I'm a freelance software engineer specialized in React, React Native and TypeScript. Also available for GraphQL and RDB backend, and Node.JS applications.

If you are interested in hiring me, please send an email to: ketsume0211@gmail.com

I'm based in Japan (by the beautiful sea), so a remote contract job is especially welcome.
