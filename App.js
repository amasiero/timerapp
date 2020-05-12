import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import uuid from 'react-native-uuid';

import EditableTimer from './components/EditableTimer';
import ToggleableTimerForm from './components/ToggleableTimerForm';

import {newTimer} from './utils/TimerUtils';

class App extends React.Component {
  state = {
    timers: [
      {
        title: 'Mow the lawn',
        project: 'House Chores',
        elapsed: 8986300,
        isRunning: true,
        id: uuid.v4(), 
      },
      {
        title: 'Bake squash',
        project: 'Kitchen Chores',
        elapsed: 3890985,
        isRunning: false,
        id: uuid.v4(), 
      }
    ]
  };

  componentDidMount() {
    const TIME_INTERVAL = 1000;

    this.intervalId = setInterval(() => {
      const {timers} = this.state;

      this.setState({
        timers: timers.map(timer => {
          const { elapsed, isRunning } = timer;

          return {
            ...timer,
            elapsed: isRunning ? elapsed + TIME_INTERVAL : elapsed,
          }
        }),
      });
    }, TIME_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  handleCreateFormSubmit = timer => {
    const { timers } = this.state;
    this.setState({
      timers: [
        newTimer(timer),
        ...timers
      ]
    })
  }

  handleFormSubmit = attrs => {
    const { timers } = this.state;
    this.setState({
      timers: timers.map(timer => {
        if(timer.id === attrs.id) {
          const {title, project} = attrs;
          return {
            ...timer,
            title,
            project
          }
        }
        return timer;
      })
    });
  }

  handleRemovePress = (timerId) => {
    this.setState({
      timers: this.state.timers.filter(t => t.id !== timerId),
    });
  }

  toggleTimer = timerId => {
    this.setState(prevState => {
      const { timers } = prevState;

      return {
        timers: timers.map(timer => {
          const {id, isRunning} = timer;
          if(id === timerId) {
            return {
              ...timer,
              isRunning: !isRunning,
            }
          }
          return timer;
        }),
      };
    });
  }

  render() {
    const { timers } = this.state;

    return (
      <View style={styles.appContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Timers</Text>
        </View>
        <ScrollView style={styles.timerList}>
          <ToggleableTimerForm 
            onFormSubmit={ this.handleCreateFormSubmit } 
          />
          {timers.map(
            ({title, project, id, elapsed, isRunning}) => (
              <EditableTimer
                key={id}
                id={id}
                title={title}
                project={project}
                elapsed={elapsed}
                isRunning={isRunning}
                onFormSubmit={ this.handleFormSubmit }
                onRemovePress={ this.handleRemovePress }
                onStartPress={ this.toggleTimer }
                onStopPress={ this.toggleTimer }
              />
            )
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1
  },
  titleContainer: {
    paddingTop: 35,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D6D7DA'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  timerList: {
    paddingBottom: 15
  }
});

export default App;
