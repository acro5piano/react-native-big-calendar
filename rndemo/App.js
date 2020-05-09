import React from 'react';
import {Dimensions, SafeAreaView, ScrollView, StatusBar} from 'react-native';
import {Calendar} from './build';
import dayjs from 'dayjs';

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
  const [additionalEvents, setAdditionalEvents] = React.useState([]);
  const addEvent = React.useCallback(
    (start: Date) => {
      const title = 'new Event';
      const end = dayjs(start).add(1, 'hour');
      setAdditionalEvents([...additionalEvents, {start, end, title}]);
    },
    [additionalEvents, setAdditionalEvents],
  );
  console.log(additionalEvents);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView>
          <Calendar
            height={Dimensions.get('window').height - 50}
            events={[...events, ...additionalEvents]}
            onPressCell={addEvent}
            onPressEvent={(e) => alert(e.title)}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
