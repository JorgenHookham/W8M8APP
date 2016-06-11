/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  Picker,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import Button from 'react-native-button'

import {
  Cell,
  CustomCell,
  TableView
} from 'react-native-tableview-simple';

const {
  workoutTemplatesJSON,
  workoutDataJSON
} = require('./mock-data');

class W8M8 extends Component {

  constructor (props) {
    super(props);
    this.state = {
      stage: 1,
      selectedTemplate: null
    };
  }

  componentDidMount () {
    var app = this;
    this.requestWorkoutTemplates((response) => {
      app.setState({
        stage: 2,
        workoutTemplates: JSON.parse(response.responseText),
      });
    });
  }

  requestWorkoutTemplates (onload) {
    // Real request
    // var request = new XMLHttpRequest();
    // request.onload = onload.bind(this, request);
    // request.open('GET', 'http://w8m8.herokuapp.com/api/workout-templates/?format=json');
    // request.send();
    // Mock request
    setTimeout(onload.bind(this, workoutTemplatesJSON), 100);
  }

  handleTemplateSelection (selectedTemplate) {
    this.setState({selectedTemplate: selectedTemplate})
  }

  handleWorkoutCreation () {
    this.setState({stage: 3});
    var app = this;
    // Real request
    // var request = new XMLHttpRequest();
    // var params = `template_sheet_id=${this.state.selectedTemplate}`
    // request.onload = (response) => {
    //   var d = JSON.parse(response.target.responseText);
    //   this.setState({workoutSheetId: d});
    //   this.getWorkoutData();
    // };
    // request.open('POST', 'http://w8m8.herokuapp.com/api/workouts/?format=json');
    // request.send(params);
    // Mock request
    setTimeout(() => {
      var d = '';
      this.setState({workoutSheetId: d});
      this.getWorkoutData();
    }, 100);
  }

  getWorkoutData () {
    var app = this;
    // Real request
    // var request = new XMLHttpRequest();
    // request.onload = (response) => {
    //   var d = JSON.parse(response.currentTarget.responseText);
    //   this.setState({stage: 4, summary: d.summary, steps: d.steps});
    // };
    // request.open('GET', `http://w8m8.herokuapp.com/api/workouts/${this.state.workoutSheetId}/?format=json`);
    // request.send();
    // Mock request
    setTimeout(() => {
      var d = JSON.parse(workoutDataJSON.responseText);
      this.setState({stage: 4, summary: d.summary, steps: d.steps});
    }, 100);
  }

  saveStep (step) {
    var data = {
      spreadsheet_id: this.state.workoutSheetId,
      row_number: step.row_number,
      actual_weight: step.actual_weight,
      actual_reps: step.actual_reps,
      actual_start_time: step.start_time,
      actual_stop_time: step.stop_time,
    };
    // Real request
    // TODO: Make sure this works
    // var request = new XMLHttpRequest();
    // request.open('PATCH', `http://w8m8.herokuapp.com/api/workouts/${this.state.workoutSheetId}/?format=json`);
    // request.send(data);
    console.log(data);
  }

  handleBeginWorkout () {
    this.setState({stage: 5, startTime: new Date()});
  }

  indexOfStepByRow (row_number) {
    for (var i = 0; i < this.state.steps.length; i++) {
      if (this.state.steps[i].row_number == row_number) {
        return i;
      }
    }
  }

  render () {
    var splash = (this.state.stage == 1) ? <View style={styles.container} key={0}>
      <SplashScreen />
    </View> : null;
    var setup = (this.state.stage == 2) ? <View style={styles.container} key={1}>
      <SetupScreen {...this.state}
        handleTemplateSelection={this.handleTemplateSelection.bind(this)}
        handleWorkoutCreation={this.handleWorkoutCreation.bind(this)}
      />
    </View> : null;
    var loading = (this.state.stage == 3) ? <View style={styles.container} key={2}>
      <LoadingScreen message="Please wait while your workout log sheet is created." />
    </View> : null;
    var summary = (this.state.stage == 4) ? <View style={styles.container} key={3}>
      <SummaryScreen {...this.state.summary}
        handleBeginWorkout={this.handleBeginWorkout.bind(this)}
      />
    </View> : null;
    var workoutFlow = (this.state.stage == 5) ? <View style={styles.container} key={4}>
      <WorkoutFlow steps={this.state.steps} appScope={this} />
    </View> : null;
    var screens = [splash, setup, loading, summary, workoutFlow];
    return (
      <View style={styles.container}>
        {screens}
      </View>
    );
  }

}

class SplashScreen extends Component {
  render () {
    return (
      <View style={styles.splashContainer}>
        <Image style={styles.splashImage} source={require('./images/splash.png')} resizeMode={'contain'}></Image>
        <Image style={styles.loader} source={require('./images/gears.gif')} resizeMode={'contain'}></Image>
      </View>
    );
  }
}

class SetupScreen extends Component {

  onChange (selectedTemplate) {
    this.props.handleTemplateSelection(selectedTemplate)
  }

  onPress (e) {
    if (this.props.selectedTemplate) {
      this.props.handleWorkoutCreation();
    }
  }

  render () {
    var i = 0;
    var itemNodes = this.props.workoutTemplates.map((templateTuple) => {
      i++;
      return (
        <Picker.Item label={templateTuple[1]} value={templateTuple[0]} key={i} />
      );
    });
    itemNodes.splice(0, 0, <Picker.Item label="Select a workout" value={null} key={0} />)
    return (
      <View>
        <ScreenTitle text="Select Workout Template" />
        <Button style={(this.props.selectedTemplate) ? styles.buttonBright : styles.buttonInactive} onPress={this.onPress.bind(this)}>BEGIN</Button>
        <Picker style={styles.picker} onValueChange={this.onChange.bind(this)} selectedValue={this.props.selectedTemplate}>{itemNodes}</Picker>
      </View>
    );
  }
}

class LoadingScreen extends Component {
  render () {
    return (
      <View style={styles.container}>
        <Text>{this.props.message}</Text>
        <Image style={styles.loader} source={require('./images/gears.gif')} resizeMode={'contain'}></Image>
      </View>
    );
  }
}

class SummaryScreen extends Component {

  handlePress (e) {
    this.props.handleBeginWorkout()
  }

  render () {
    return (
      <View style={styles.container}>
        <ScreenTitle text="Workout Summary" />
        <View style={{width: 320}}>
          <TableView style={styles.table}>
            <Cell cellstyle="RightDetail" title="~ Duration" detail={this.props.approx_duration} />
            <Cell cellstyle="RightDetail" title="Mucle Groups" detail={this.props.muscle_groups} />
            <Cell cellstyle="RightDetail" title="Reps" detail={this.props.rep_range} />
            <Cell cellstyle="RightDetail" title="Speed" detail={this.props.speed} />
            <Cell cellstyle="RightDetail" title="% of Max" detail={this.props.percent_of_max} />
            <Cell cellstyle="RightDetail" title="Sets" detail={this.props.set_count} />
            <Cell cellstyle="RightDetail" title="Rest" detail={this.props.rest_time_range} />
            <Cell cellstyle="RightDetail" title="Set Time" detail={this.props.set_time_range} />
          </TableView>
        </View>
        <Button style={styles.buttonBright} onPress={this.handlePress.bind(this)}>START MY WORKOUT</Button>
      </View>
    );
  }
}

class WorkoutFlow extends Component {
  // TODO: Develop workout-level progress component
  // TODO: Handle the end of a workout

  constructor (props) {
    super(props);
  }

  getCurrentStep () {
    for (var i = 0; i < this.props.steps.length; i++) {
      var step = this.props.steps[i];
      if (!step.complete) {
        return step;
      }
    }
  }

  getPreviousStep () {
    var currentStep = this.getCurrentStep();
    var i = this.props.steps.indexOf(currentStep);
    return this.props.steps[i - 1];
  }

  getUpcomingStep () {
    var currentStep = this.getCurrentStep();
    var i = this.props.steps.indexOf(currentStep);
    return this.props.steps[i + 1];
  }

  render () {
    var currentStep = this.getCurrentStep();
    if (this.props.steps.indexOf(currentStep) == 0) {
      var Step = WorkoutFirstExerciseScreen;
    } else {
      var Step = (currentStep.name == 'Rest') ? WorkoutRestScreen : WorkoutExerciseScreen;
    }
    return (
      <Step {...currentStep}
        previousStep={this.getPreviousStep()}
        upcomingStep={this.getUpcomingStep()}
        appScope={this.props.appScope}
      />
    );
  }
}

class WorkoutFirstExerciseScreen extends Component {

  constructor (props) {
    super(props);
    this.state = props;
    this.state.complete = false;
    this.state.alive = false;
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.start_time != prevState.start_time || this.state.stop_time != prevState.stop_time) {
      var i = this.props.appScope.indexOfStepByRow(this.props.row_number);
      var steps = this.props.appScope.state.steps;
      steps[i] = this.state;
      this.props.appScope.setState({steps: steps});
    }
  }

  handlePress () {
    if (this.state.start_time) {
      this.setState({stop_time: new Date(), complete: true, alive: false});
    } else {
      this.setState({alive: true, start_time: new Date()});
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={{width: 320}}>
          <ScreenTitle text={this.props.name} />
          <Timer alive={this.state.alive} max={this.props.max_time} />
          <TableView style={styles.table}>
            <Cell cellstyle="RightDetail" title="Target Time" detail={`${this.props.min_time}s–${this.props.max_time}s`} />
            <Cell cellstyle="RightDetail" title="~ Weight" detail={this.props.weight} />
            <Cell cellstyle="RightDetail" title="Reps" detail={this.props.rep_range} />
          </TableView>
        </View>
        <Button
          style={this.state.start_time ? styles.buttonBright : styles.buttonPrimary}
          onPress={this.handlePress.bind(this)}
        >
          {this.state.start_time ? 'FINISH' : 'START'} THIS SET
        </Button>
      </View>
    );
  }
}

class WorkoutExerciseScreen extends Component {

  constructor (props) {
    super(props);
    this.state = props;
    this.state.complete = false;
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.start_time != prevState.start_time || this.state.stop_time != prevState.stop_time) {
      var i = this.props.appScope.indexOfStepByRow(this.props.row_number);
      var steps = this.props.appScope.state.steps;
      steps[i] = this.state;
      this.props.appScope.setState({steps: steps});
    }
  }

  componentDidMount () {
    this.setState({start_time: new Date(), alive: true});
  }

  handlePress () {
    this.setState({stop_time: new Date(), complete: true, alive: false});
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={{width: 320}}>
          <ScreenTitle text={this.props.name} />
          <Timer alive={this.state.alive} max={this.props.max_time} />
          <TableView style={styles.table}>
            <Cell cellstyle="RightDetail" title="Target Time" detail={`${this.props.min_time}s–${this.props.max_time}s`} />
            <Cell cellstyle="RightDetail" title="~ Weight" detail={this.props.weight} />
            <Cell cellstyle="RightDetail" title="Reps" detail={this.props.rep_range} />
          </TableView>
        </View>
        <Button
          style={styles.buttonBright}
          onPress={this.handlePress.bind(this)}
        >
          FINISH THIS SET
        </Button>
      </View>
    );
  }

}

class WorkoutRestScreen extends Component {
  // TODO: Allow optional exercises (and subsequent rests) to be skipped

  constructor (props) {
    super(props);
    this.state = props;
    this.state.complete = false;
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.start_time != prevState.start_time || this.state.stop_time != prevState.stop_time) {
      var i = this.props.appScope.indexOfStepByRow(this.props.row_number);
      var steps = this.props.appScope.state.steps;
      steps[i] = this.state;
      this.props.appScope.setState({steps: steps});
    }
    if (this.state.complete && this.state.stop_time) {
      this.props.appScope.saveStep(this.state);
    }
  }

  componentDidMount () {
    this.setState({start_time: new Date(), alive: true});
  }

  handlePress () {
    this.setState({stop_time: new Date(), complete: true, alive: false});
    this.props.appScope.saveStep(this.props.previousStep);
  }

  handleChange (prop, e) {
    var step = this.props.previousStep;
    var steps = this.props.appScope.state.steps;
    var i = steps.indexOf(step);
    step[prop] = e.nativeEvent.text;
    steps[i] = step;
    this.props.appScope.setState({steps: steps});
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={{width: 320}}>
          <ScreenTitle text={this.props.name} />
          <Timer alive={this.state.alive} max={this.props.max_time} />
          <TableView style={styles.table}>
            <Cell cellstyle="RightDetail" title="Rest Duration" detail={`${this.props.min_time / 60}–${this.props.max_time / 60} Minutes`} />
          </TableView>
        </View>

        <View style={{width: 320}}>
          <SubTitle text="Previous Set Data" />
          <View style={styles.horizontal}>
            <Text style={styles.label}>REPS</Text>
            <TextInput onChange={this.handleChange.bind(this, 'actual_reps')} style={styles.smallInput} />
          </View>
          <View style={styles.horizontal}>
            <Text style={styles.label}>WEIGHT</Text>
            <TextInput onChange={this.handleChange.bind(this, 'actual_weight')} style={styles.smallInput} />
          </View>
        </View>

        <View style={{width: 320}}>
          <SubTitle text="Next Set" />
          <TableView>
            <Cell cellstyle="RightDetail" title="Exercise" detail={this.props.upcomingStep.name} />
          </TableView>
          <Button
            style={styles.buttonBright}
            onPress={this.handlePress.bind(this)}
          >
            START NEXT SET
          </Button>
        </View>
      </View>
    );
  }
}

class ScreenTitle extends Component {

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <Text style={this.style()}>{this.props.text.toUpperCase()}</Text>
    );
  }

  style () {
    return {
      marginBottom: 15,
      color: '#333',
      fontSize: 20,
      fontWeight: '600',
      textAlign: 'center',
      // textTransform: 'uppercase',  // React Native doesn't support this
    };
  }

}

class SubTitle extends Component {

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <Text style={this.style()}>{this.props.text.toUpperCase()}</Text>
    );
  }

  style () {
    return {
      marginBottom: 15,
      fontSize: 16,
      fontWeight: '600',
    };
  }
}

class Timer extends Component {

  constructor (props) {
    super(props);
    this.state = {elapsed: 0};
  }

  componentDidMount () {
    if (this.props.alive && !this.interval) this.start();
    else if (!this.props.alive && this.interval) this.stop();
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.alive && !this.interval) this.start();
    else if (!this.props.alive && this.interval) this.stop();
  }

  render () {
    var minutes = Math.floor(this.state.elapsed / 60000);
    var remainder = this.state.elapsed % 60000;
    var seconds = Math.floor(remainder / 1000);
    minutes = (minutes > 9) ? minutes : `0${minutes}`;
    seconds = (seconds > 9) ? seconds : `0${seconds}`;
    return (
      <Text style={this.style()}>{minutes}:{seconds}</Text>
    );
  }

  start () {
    var timerComponent = this;
    var interval = this.interval = setInterval(() => {
      var elapsed = timerComponent.state.elapsed + 1000;
      timerComponent.setState({elapsed: elapsed});
    }, 1000);
    this.setState({timing: true});
  }

  stop () {
    clearInterval(this.interval);
    this.interval = null;
  }

  style () {
    var max = this.props.max * 1000, elapsed = this.state.elapsed;
    var style = {
      marginBottom: 15,
      color: '#333333',
      fontFamily: 'courier new',
      fontSize: 100,
      textAlign: 'center',
    };
    if (max && elapsed > max) style.color = 'red';
    else if (max && elapsed > max - max * .2) style.color = 'orange';
    return style;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    backgroundColor: '#FFBB33',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#FFBB33',
  },
  splashImage: {
    width: 320,
    height: 320,
    marginBottom: 40,
  },
  loader: {
    width: 40,
    height: 40,
  },
  picker: {
    width: 320,
    height: 68,
  },
  buttonSecondary: {
    color: 'white',
    backgroundColor: '#FFC552',
    borderRadius: 4,
    fontSize: 20,
    width: 320,
    height: 40,
    marginTop: 40,
    marginBottom: 40,
    lineHeight: 32,
  },
  buttonInactive: {
    color: '#D99F2B',
    backgroundColor: '#F2B230',
    borderRadius: 4,
    fontSize: 20,
    width: 320,
    height: 40,
    marginTop: 40,
    marginBottom: 40,
    lineHeight: 32,
  },
  buttonPrimary: {
    color: 'white',
    backgroundColor: '#FFCC33',
    borderRadius: 4,
    fontSize: 20,
    width: 320,
    height: 40,
    marginTop: 40,
    marginBottom: 40,
    lineHeight: 32,
  },
  buttonBright: {
    color: 'white',
    backgroundColor: '#FF8533',
    borderRadius: 4,
    fontSize: 20,
    width: 320,
    height: 40,
    marginTop: 40,
    marginBottom: 40,
    lineHeight: 32,
  },
  textInput: {
    width: 320,
    height: 40,
    backgroundColor: 'white',
    color: '#666666',
  },
  table: {
    width: 320,
  },
  horizontal: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    height: 40,
    lineHeight: 28,
  },
  smallInput: {
    width: 100,
    height: 40,
    marginBottom: 10,
    marginLeft: 10,
    backgroundColor: 'white',
    textAlign: 'center',
  },
});

AppRegistry.registerComponent('W8M8', () => W8M8);
