import dayjs from 'dayjs';
import React from 'react';
import {Dimensions, SafeAreaView, StatusBar} from 'react-native';
import {Calendar, ICalendarEvent} from './build';

const events = [
  {
    title: 'Meeting',
    start: dayjs().set('hour', 10).set('minute', 0).toDate(),
    end: dayjs().set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Coffee break',
    start: dayjs().set('hour', 14).set('minute', 30).toDate(),
    end: dayjs().set('hour', 15).set('minute', 30).toDate(),
  },
  {
    title: 'Repair my car',
    start: dayjs().add(1, 'day').set('hour', 7).set('minute', 45).toDate(),
    end: dayjs().add(1, 'day').set('hour', 13).set('minute', 30).toDate(),
  },
];

const App = () => {
  const [additionalEvents, setAdditionalEvents] = React.useState<
    ICalendarEvent[]
  >([]);

  const addEvent = React.useCallback(
    start => {
      const title = 'new Event';
      const end = dayjs(start).add(59, 'minute');
      setAdditionalEvents([...additionalEvents, {start, end, title}]);
    },
    [additionalEvents, setAdditionalEvents],
  );

  return (
    <React.Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Calendar
          height={Dimensions.get('window').height}
          events={[...events, ...additionalEvents]}
          onPressCell={addEvent}
        />
      </SafeAreaView>
    </React.Fragment>
  );
};

export default App;
