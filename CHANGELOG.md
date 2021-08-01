# Changelog

## 2.0.0-rc

This is a release candidate for v2.0.0.

### New Features

- Make header injectable #473
- Make header for month view injectable #473
- (breaking) Enable to inject styles for header and body separately #409
- Add theme functionality. A lot of people are requesting additional customization feature, so provided the customization option. #243 #93

```typescript
export interface ThemeInterface {
  palette: {
    primary: Palette
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

### Bug fixes

- Show AM/PM format event #445
- Fix Android start/end property and month view style
- Fix Android css #486

### Chore

- Update deps

### Breaking

- Removed `style` prop as it is ambigious

For more details, see #475 #486

## 1.0.5

- Exported CalendarBody component #474

## 1.0.4

- [hotfix] Fix css properties on platform native #470
- Add `key` prop for month view components #470
- Improve Demo app usability #470

## 1.0.3

- Fix the month view for the mobile #466
- Kind error message for invalid mode #466

## 1.0.2

- Fixes the issue where the change from day to week view would display the wrong week when the startOfWeek is not the default #438
- Update deps

## 1.0.1

We're excited to announce the first stable version! It contains lots of bug fixes, and new mode "month".

- Add month view #410
- Fix warning android timer #414
- Fix Events spanning multiple days not rendering correct #416
- Replace tslint with eslint #415
- Fix bugs on wrong React hooks implementation
- **Breaking**: Remove eventRenderer and add custom render function capability #408

# Migration from 0.x

If you use `event.eventRenderer` , you should mmove the code to the `<Calendar />` component.

Before:

```typescript
<Calendar
  events={[
    {
      // ...
      eventRenderer?: () => <TouchableOpacity /* ... */ />
    },
  ]}
/>
```

After:

```typescript
<Calendar
  events=[
    {
      // ...
    },
  ]
  eventRenderer: () => <TouchableOpacity /* ... */ />
/>
```

Details: https://github.com/acro5piano/react-native-big-calendar/pull/408

## 0.9.2

- Do not use `setInterval` if `hideNowIndicator` is specified by @acro5piano

## 0.9.1

- Fix bumping version. I'm too sleepy!

## 0.9.0

- New mode, `custom` which enables to specify week start and end date at the same time by @RajRohitYadav on #382

## 0.8.2

- Added contentOffset for iOS to avoid initial scroll for `scrollOffsetMinutes`. @RajRohitYadav

## 0.8.1

- Add default export for supporting both style by @sebastienfi
- Internal refactoring by @sebastienfi

## 0.8.0

- Add custom renderer for events by @sebastienfi

## 0.7.5

- Double checking that object exists before calling scrollTo method upon it by @filipearena
- Update deps by @acro5piano

## 0.7.4

- Fix Android scrolling issue by adding `nestedScrollEnabled` by @acro5piano and @deepakmehra96

## 0.7.3

- Fix type of event callback function by @acro5piano
- Extract function from `React.memo` to show proper display name by @acro5piano
- Update deps by @acro5piano

## 0.7.2

- Update deps by @acro5piano

## 0.7.1

- Fixes an issue with displaying events that occur at midnight by @OffensivelyBad
- Fix modeToNum in utils by @huikaihoo
- Update deps by @acro5piano

## 0.7.0

- RTL support by @Gilad-Shnoor
- Update deps by @acro5piano

## 0.6.0

- Add option to hide the nowIndicator by @OffensivelyBad
- Update deps by @acro5piano

## 0.5.0

- Support for overlapping events, ability to display child components in events by @OffensivelyBad
- update deps by @acro5piano

## 0.4.1

- fix `day` mode by @joelbarron
- update deps by @acro5piano

## 0.4.0

- add onPressCell props by @acro5piano

## 0.3.2

- Fix to overlapped header 74db874 by @oportojca

## 0.3.1

- Fix #85 by @acro5piano
- Fix adding `key` by @acro5piano
- Remove `lib` for React Native env by @acro5piano

## 0.3.1

- Fix #85 by @acro5piano
- Fix adding `key` by @acro5piano
- Remove `lib` for React Native env by @acro5piano

## 0.3.0

- Add `onPressDateHeader` props by @oportojca

## 0.2.6

- Add `delayPressIn` props by @acro5piano

## 0.1.0

- First stable release by @acro5piano
