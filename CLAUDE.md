# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native Big Calendar is a cross-platform calendar component for React Native that runs on Web, iOS, and Android. It's fully TypeScript-based and provides extensive customization options including themes, custom event renderers, and multiple view modes.

## Common Development Commands

### Building and Testing

- `bun run build` - Clean build using Rollup with TypeScript
- `bun run test` - Run Jest tests
- `bun run lint` - Run Biome linter with error-on-warnings
- `bun run lint:fix` - Auto-fix linting issues with Biome
- `bun run watch` - Watch mode for development builds

### Demo Development

- `bun sync-demo` - Build library and copy to expo-demo (run this after any src changes)
- `cd expo-demo && bun start` - Start Expo development server for testing

### Storybook

- `bun run storybook` - Start Storybook development server on port 7007
- `bun run build-storybook` - Build static Storybook

## Code Architecture

### Core Components Structure

- `src/components/Calendar.tsx` - Main calendar wrapper with theme provider
- `src/components/CalendarContainer.tsx` - Core calendar logic and state management
- `src/components/CalendarBody.tsx` - Week/day view body renderer
- `src/components/CalendarBodyForMonthView.tsx` - Month view body renderer
- `src/components/CalendarHeader.tsx` - Header for week/day views
- `src/components/CalendarHeaderForMonthView.tsx` - Header for month view
- `src/components/Schedule.tsx` - Schedule view implementation

### Key Architectural Patterns

- **Theme System**: Uses React Context (`ThemeContext`) with deep merge for theme customization
- **Mode-based Rendering**: Different components for different calendar modes (week, month, day, schedule, etc.)
- **Event Processing**: Complex event overlap calculation and positioning logic
- **Performance Optimization**: "Enriched Events" system for pre-processing event data
- **Cross-platform**: Uses react-native-web for web compatibility

### Critical Dependencies

- `dayjs` - Date manipulation (with plugins: duration, isBetween, isoWeek)
- `calendarize` - Calendar date generation
- `react-native-gesture-handler` - Touch gesture handling
- `react-native-infinite-pager` - Swipe navigation between dates
- `react-native-reanimated` - Smooth animations

### TypeScript Interfaces

- `ICalendarEventBase` - Base event interface in `src/interfaces.ts`
- `ThemeInterface` - Theme structure in `src/theme/ThemeInterface.ts`
- `CalendarProps<T>` - Main component props with generic event type support

### Utilities

- `src/utils/datetime.ts` - Date manipulation and calendar logic
- `src/utils/object.ts` - Deep merge and object utilities
- `src/utils/react.ts` - React-specific utilities including `typedMemo`

## Build Configuration

- **Bundler**: Rollup with TypeScript plugin
- **Linter**: Biome (replaces ESLint/Prettier)
- **Test Runner**: Jest with SWC transform
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **Package Manager**: Bun (with fallback yarn support via Volta)

## Testing Strategy

- Unit tests in `src/utils/__tests__/`
- Stories-based testing with Storybook
- Real device testing via expo-demo
- Cross-platform testing (Web, iOS, Android)

## Development Workflow

1. Make changes to `src/` files
2. Run `bun sync-demo` to copy build to demo
3. Test changes in `expo-demo` with `bun start`
4. Run `bun run lint` and `bun run test` before committing
5. Use Storybook for component-level testing and documentation

## Performance Considerations

- Use `enrichedEventsByDate` prop for pre-processed event data
- Enable `eventsAreSorted` when events are already sorted
- Consider `enableEnrichedEvents` for large event datasets
- Event overlap calculation is computationally expensive - cache when possible
