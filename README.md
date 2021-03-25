![test](https://github.com/llotheo/react-native-big-calendar/workflows/test/badge.svg)
![release](https://github.com/llotheo/react-native-big-calendar/workflows/release/badge.svg)
[![npm version](https://badge.fury.io/js/react-native-big-calendar.svg)](https://badge.fury.io/js/react-native-big-calendar)
[![Netlify Status](https://api.netlify.com/api/v1/badges/ca0f2cc8-bb4f-4a18-be48-c2b10e2b6046/deploy-status)](https://app.netlify.com/sites/react-native-big-calendar/deploys)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=llotheo/react-native-big-calendar)](https://dependabot.com)

# react-native-big-calendar

Cross-platform gcal/outlook like calendar component for React Native.

[Components Demo](https://react-native-big-calendar.netlify.com/?path=/story/desktop--3days-mode)

<img src="./assets/screenshot-mobile.png" height="500">

# Features

- Cross Platform: Runs on the Web, iOS, Android with the power of React
- Type-safe: Fully written in TypeScript
- Customizable: Adjust styles of components
- Lightweight: ~15kb, only one dependency is `dayjs`

# Install

```
npm install --save react-native-big-calendar
```

Or if you use Yarn:

```
yarn add react-native-big-calendar
```

If you use TypeScript ensure `@types/react` and `@types/react-native` is installed. `react-native-big-calendar` uses them internally.

```
yarn add -D @types/react @types/react-native
```

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
export interface CalendarProps<T> {
  events: ICalendarEvent<T>[]
  height: number
  overlapOffset?: number
  ampm?: boolean
  date?: Date
  eventCellStyle?: EventCellStyle<T>
  locale?: string
  hideNowIndicator?: boolean
  mode?: Mode
  scrollOffsetMinutes?: number
  showTime?: boolean
  style?: ViewStyle
  swipeEnabled?: boolean
  weekStartsOn?: WeekNum
  isRTL?: boolean
  onChangeDate?: DateRangeHandler
  onPressCell?: (date: Date) => void
  onPressDateHeader?: (date: Date) => void
  onPressEvent?: (event: ICalendarEvent<T>) => void
}
```


`<Calendar />` Props are:

| name                  | required | type                                                   | description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|-----------------------|----------|--------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `events`              | yes      | `ICalendarEvent<T>[]`                                  | The events which will be rendered on the calendar. You can extend the type `ICalendarEvent` by providing a value to generic type T (see `./stories/events.tsx` for an example). with optional children to display custom components inside the event, and optional event renderer function to take complete control over the rendered event (advanced feature). Events that occur during the same time range will be layered, offset, and given a unique color. |
| `height`              | yes      | `number`                                               | Calendar height.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `hideNowIndicator`    | no       | `boolean`                                              | Hides the indicator for the current time. By default the now indicator is shown.                                                                                                                                                                                                                                                                                                                                                                                |
| `onPressEvent`        | no       | `(event: ICalendarEvent<T>) => void`                   | Event handler which will be fired when the user clicks an event.                                                                                                                                                                                                                                                                                                                                                                                                |
| `onChangeDate`        | no       | `([start: Date, end: Date]) => void`                   | Event handler which will be fired when the current date range changed.                                                                                                                                                                                                                                                                                                                                                                                          |
| `onPressCell`         | no       | `(date: Date) => void`                                 | Event handler which will be fired when the current date cell is clicked. The minute set to 0.                                                                                                                                                                                                                                                                                                                                                                   |
| `onPressDateHeader`   | no       | `(date: Date) => void`                                 | Event handler which will be fired when the user clicks a date from the header.                                                                                                                                                                                                                                                                                                                                                                                  |
| `mode`                | no       | `'3days' \| 'week' \| 'day'`                           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `style`               | no       | `import('react-native').ViewStyle`                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `eventCellStyle`      | no       | `ViewStyle \| (event: ICalendarEvent<T>) => ViewStyle` | The style of Event cell. Accepts either style object (static) or function (dynamic).                                                                                                                                                                                                                                                                                                                                                                            |
| `scrollOffsetMinutes` | no       | `number`                                               | Scroll to specific minutes in a day. e.g.) set `480` to scroll to 8am when the calendar rendered.                                                                                                                                                                                                                                                                                                                                                               |
| `date`                | no       | `Date`                                                 | Initial date. Defualts to `Date`                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `swipeEnabled`        | no       | `boolean`                                              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `showTime`            | no       | `boolean`                                              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `ampm`                | no       | `boolean`                                              | Use 12 hours time format instead of 24 hours.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `weekStartsOn`        | no       | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Which day the week starts on. Sunday is `0`.                                                                                                                                                                                                                                                                                       |
| `locale`              | no       | `string`                                               | Custom locale. See I18n section                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `overlapOffset`       | no       | `number`                                               | Adjusts the indentation of events that occur during the same time period. Defaults to 20 on web and 8 on mobile.                                                                                                                                                                                                                                                                                                                                                |
| `isRTL`               | no       | `boolean`                                              | Switches the direction of the layout for use with RTL languages. Defaults to false.                                                                                                                                                                                                                                                                                                                                                                             |

For more information, see [Storybook](https://github.com/llotheo/react-native-big-calendar/blob/master/stories/index.stories.tsx)

## ICalendarEvent<T>

```typescript
interface ICalendarEventBase<T> {
  start: Date
  end: Date
  title: string
  children?: ReactElement | null
  eventRenderer?: (
    event: ICalendarEvent<T>,
    touchableOpacityProps: CalendarTouchableOpacityProps,
  ) => ReactElement | null
}

export type ICalendarEvent<T = any> = ICalendarEventBase<T> & T
```

## Extending props of events and using a custom event render function

You can override the component which renders a specific event. You choose to do so for all your events, or a specific event. You can extend the props on an event by implementing (in TypeScript) the type with generics `ICalendarEvent<T>` where `T` should be your custom interface (or type) with more props to an event. An example can be found [here](./stories/events.tsx).

- The function `eventRenderer` must return a `ReactElement`. 
- The component _should_ be wrapped inside a `TouchableOpacity` if you are using `react-native`, or _any_ DOM element which accepts positioning and click events (`onPress`, ...). 


```typescript
export interface MyCustomEventType {
  color: string
}

const eventRenderer = (event: ICalendarEvent<MyCustomEventType>, touchableOpacityProps: CalendarTouchableOpacityProps) => (
  <TouchableOpacity {...touchableOpacityProps}>
    <Text>{`My custom event: ${event.title} with a color: ${event.color}`}</Text>
  </TouchableOpacity>
)

export const myEvents: ICalendarEvent<MyCustomEventType>[] = [
  {
    title: 'Custom reminder',
    start: dayjs().set('hour', 16).set('minute', 0).toDate(),
    end: dayjs().set('hour', 17).set('minute', 0).toDate(),
    color: 'purple',
    eventRenderer,
  },
]
```

## Displaying event's notes

Your events can contain a prop `children` An example can be found [here](./stories/events.tsx).

```typescript
const eventNotes = useMemo(() => (
  <View style={{ marginTop: 3 }}>
    <Text style={{ fontSize: 10, color: 'white' }}> Phone number: 555-123-4567 </Text>
    <Text style={{ fontSize: 10, color: 'white' }}> Arrive 15 minutes early </Text>
  </View>
), [])

export const myEvents: ICalendarEvent[] = [
  {
    title: 'Custom reminder',
    start: dayjs().set('hour', 16).set('minute', 0).toDate(),
    end: dayjs().set('hour', 17).set('minute', 0).toDate(),
    children: eventNotes,
  },
]
```
# I18n

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

# TODO

- [x] Add API Documentation
- [x] Add `onClickCell` feature
- [ ] Add `onDragCell` feature
- [ ] Allow component replacement
  - [x] Event
  - [ ] Complete Header
  - [ ] Hour indicator
- [ ] Style customize
  - [ ] Blue active day
  - [ ] Blue active day text
  - [ ] Today indicator
- [ ] Support the month view layout
- [ ] Provide an example with `expo`
