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
import Button from 'react-native-button';

const {
  workoutTemplatesJSON,
  workoutDataJSON
} = require('./mock-data');

class W8M8 extends Component {

  constructor (props) {
    super(props);
    this.state = {
      stage: 1,
      selectedTemplate: null,
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

  skipRemainingSets (step) {
    var steps = this.state.steps;
    console.log(steps.length);
    var remainders = steps.filter((s) => {
      return s.name == step.name && !s.start_time;
    });
    steps.splice(steps.indexOf(remainders[0]), remainders.length * 2);
    this.setState({steps: steps});
    console.log(steps.length);
  }

  render () {
    var splash = (this.state.stage == 1) ? <SplashScreen key={0} /> : null;
    var setup = (this.state.stage == 2) ? <SetupScreen key={1} {...this.state}
      handleTemplateSelection={this.handleTemplateSelection.bind(this)}
      handleWorkoutCreation={this.handleWorkoutCreation.bind(this)}
    /> : null;
    var loading = (this.state.stage == 3) ? <LoadingScreen key={2}
      message="Please wait while your workout log sheet is created."
    />: null;
    var summary = (this.state.stage == 4) ? <SummaryScreen key={3}
      {...this.state.summary}
      handleBeginWorkout={this.handleBeginWorkout.bind(this)}
      first_exercise_name={this.state.steps[0].name}
    /> : null;
    var workoutFlow = (this.state.stage == 5) ? <WorkoutFlow key={4}
      steps={this.state.steps}
      appScope={this}
    /> : null;
    var theEnd = (this.state.stage == 6) ? <TheEndScreen key={5} />: null;
    var screens = [splash, setup, loading, summary, workoutFlow, theEnd];
    return <View style={styles.canvas}>{screens}</View>;
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
    var itemNodes = this.props.workoutTemplates.map((templateTuple) => {
      return <Picker.Item label={templateTuple[1]} value={templateTuple[0]} key={templateTuple[0]} />;
    });
    itemNodes.splice(0, 0, <Picker.Item label="Select a workout" value={null} key={0} />);
    return (
      <View style={styles.container}>
        <ScreenTitle text="Choose A Workout" />
        <Picker style={styles.picker} onValueChange={this.onChange.bind(this)} selectedValue={this.props.selectedTemplate}>{itemNodes}</Picker>
        <Button style={(this.props.selectedTemplate) ? styles.buttonPrimary : styles.buttonInactive} onPress={this.onPress.bind(this)}>BEGIN</Button>
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
          <Cell label="~ Duration" value={this.props.approx_duration} />
          <Cell label="Mucle Groups" value={this.props.muscle_groups} />
          <Cell label="Reps" value={this.props.rep_range} />
          <Cell label="Speed" value={this.props.speed} />
          <Cell label="% of Max" value={this.props.percent_of_max} />
          <Cell label="Sets" value={this.props.set_count} />
          <Cell label="Rest" value={this.props.rest_time_range} />
          <Cell label="Set Time" value={this.props.set_time_range} />
        </View>
        <View style={{width: 320}}>
          <Cell label="First Set" value={this.props.first_exercise_name} />
          <Button style={styles.buttonPrimary} onPress={this.handlePress.bind(this)}>START MY WORKOUT</Button>
        </View>
      </View>
    );
  }
}

class WorkoutFlow extends Component {
  // TODO: Develop workout-level progress component

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
    return null;
  }

  getPreviousStep () {
    var steps = this.props.steps;
    var currentStep = this.getCurrentStep();
    if (currentStep) {
      var i = steps.indexOf(currentStep);
      return steps[i - 1];
    } else {
      return steps[steps.length - 1];
    }
  }

  getUpcomingStep () {
    var currentStep = this.getCurrentStep();
    if (currentStep) {
      var i = this.props.steps.indexOf(currentStep);
      return this.props.steps[i + 1];
    } else {
      return null;
    }
  }

  render () {
    var currentStep = this.getCurrentStep();
    if (currentStep) {
      var Step = (currentStep.name == 'Rest') ? WorkoutRestScreen : WorkoutExerciseScreen;
      return (
        <Step {...currentStep}
          previousStep={this.getPreviousStep()}
          upcomingStep={this.getUpcomingStep()}
          appScope={this.props.appScope}
        />
      );
    } else {
      return <FinalWorkoutScreen
        appScope={this.props.appScope}
        previousStep={this.getPreviousStep()}
      />;
    }
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
        <ScreenTitle text={this.props.name} subtext={`${this.props.rep_range} Reps in ${this.props.min_time}–${this.props.max_time} Seconds`} />
        <Timer alive={this.state.alive} max={this.props.max_time} />
        <Button
          style={styles.buttonBright}
          onPress={this.handlePress.bind(this)}
        >
          DONE
        </Button>
      </View>
    );
  }

}

class WorkoutRestScreen extends Component {

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
    if (!this.props.upcomingStep) {
      this.props.appScope.setState({stage: 6});
    }
  }

  handleChange (prop, e) {
    var step = this.props.previousStep;
    var steps = this.props.appScope.state.steps;
    var i = steps.indexOf(step);
    step[prop] = e.nativeEvent.text;
    steps[i] = step;
    this.props.appScope.setState({steps: steps});
  }

  handleSkip (step) {
    this.props.appScope.skipRemainingSets(step);
  }

  render () {
    var actions;
    if  (this.props.upcomingStep) {
      if (this.props.upcomingStep.required) {
        actions = <Button style={styles.buttonPrimary} onPress={this.handlePress.bind(this)}>START NEXT SET</Button>
      } else {
        actions = <View>
          <Button style={styles.buttonSecondary} onPress={this.handleSkip.bind(this, this.props.upcomingStep)}>SKIP REMAINING SETS</Button>
          <Button style={styles.buttonPrimary} onPress={this.handlePress.bind(this)}>START NEXT SET</Button>
        </View>;
      }
    } else {
      actions = <Button style={styles.buttonBright} onPress={this.handlePress.bind(this)}>DONE</Button>
    }
    return (
      <View style={styles.container}>
        <View style={{width: 320}}>
          <ScreenTitle text={this.props.name} subtext={`For ${this.props.min_time / 60}–${this.props.max_time / 60} Minutes`} />
          <Timer alive={this.state.alive} max={this.props.max_time} />
        </View>

        <View style={{width: 320}}>
          <SubTitle text="Previous Set Data" />
          <View style={styles.horizontal}>
            <View>
              <Text style={styles.label}>REPS</Text>
              <TextInput keyboardType="number-pad" onChange={this.handleChange.bind(this, 'actual_reps')} style={styles.smallInput} />
            </View>
            <View>
              <Text style={styles.label}>WEIGHT</Text>
              <TextInput keyboardType="number-pad" onChange={this.handleChange.bind(this, 'actual_weight')} style={styles.smallInput} />
            </View>
          </View>
        </View>

        <View style={{width: 320}}>
          <Cell
            label={(this.props.upcomingStep) ? `Next Set ${(this.props.upcomingStep.required) ? '' : '(Optional)'}` : 'Complete Workout'}
            value={this.props.upcomingStep ? this.props.upcomingStep.name : null}
          />
          {actions}
        </View>
      </View>
    );
  }
}

class FinalWorkoutScreen extends Component {

  constructor (props) {
    super(props);
    this.state = {};
  }

  handlePress () {
    this.props.appScope.saveStep(this.props.previousStep);
    this.props.appScope.setState({stage: 6});
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
      <View style={styles.splashContainer}>
        <View style={{width: 320}}>
          <ScreenTitle text="Workout Complete" />
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
          <Button style={styles.buttonBright} onPress={this.handlePress.bind(this)}>DONE</Button>
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
    var subtext = (this.props.subtext) ? <Text style={this.style().subtext}>
      {this.props.subtext}
    </Text> : null;
    return (
      <View style={{marginBottom: 15}}>
        <Text style={this.style().main}>{this.props.text.toUpperCase()}</Text>
        {subtext}
      </View>
    );
  }

  style () {
    return {
      main: {
        color: '#333',
        fontFamily: 'Futura',
        fontSize: 28,
        fontWeight: '600',
        textAlign: 'center',
      },
      subtext: {
        marginTop: 5,
        color: '#66533D',
        fontFamily: 'Futura',
        fontSize: 20,
        fontStyle: 'italic',
        textAlign: 'center',
      }
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
      marginBottom: 10,
      color: '#333',
      fontFamily: 'Futura',
      fontSize: 20,
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
      color: '#FFCCAA',
      fontFamily: 'menlo',
      fontSize: 100,
      textAlign: 'center',
    };
    if (max && elapsed > max) style.color = '#FF3333';
    else if (max && elapsed > max - max * .2) style.color = '#FF6633';
    return style;
  }
}

class TheEndScreen extends Component {
  render () {
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <Image source={require('./images/success.png')} style={{flex: 1}} resizeMode={'contain'} />
      </View>
    );
  }
}

class Cell extends Component {
  render () {
    return (
      <View style={styles.cell}>
        <Text style={styles.cellLabel}>{this.props.label.toUpperCase()}</Text>
        <Text style={styles.cellValue}>{this.props.value}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: '#FFA033',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    alignItems: 'center',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    height: 240,
  },
  buttonSecondary: {
    color: 'white',
    backgroundColor: '#FFC552',
    borderRadius: 4,
    fontFamily: 'Futura',
    fontSize: 20,
    width: 320,
    height: 50,
    marginTop: 10,
    paddingTop: 5,
    paddingBottom: 5,
    lineHeight: 32,
  },
  buttonInactive: {
    color: '#CCBDB4',
    backgroundColor: '#E6D5CA',
    borderRadius: 4,
    fontFamily: 'Futura',
    fontSize: 20,
    width: 320,
    height: 50,
    marginTop: 10,
    paddingTop: 5,
    paddingBottom: 5,
    lineHeight: 32,
  },
  buttonPrimary: {
    color: 'white',
    backgroundColor: '#FF8800',
    borderRadius: 4,
    fontFamily: 'Futura',
    fontSize: 20,
    width: 320,
    height: 50,
    marginTop: 10,
    paddingTop: 5,
    paddingBottom: 5,
    lineHeight: 32,
  },
  buttonBright: {
    color: 'white',
    backgroundColor: '#333',
    borderRadius: 4,
    fontFamily: 'Futura',
    fontSize: 20,
    width: 320,
    height: 50,
    marginTop: 10,
    paddingTop: 5,
    paddingBottom: 5,
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
    height: 20,
    marginTop: 0,
    marginBottom: 5,
    color: '#333',
    fontFamily: 'Futura',
    fontSize: 16,
  },
  smallInput: {
    width: 155,
    height: 40,
    marginTop: 0,
    backgroundColor: 'white',
    textAlign: 'center',
  },
  giraffe: {
    marginBottom: 15,
    color: '#66533D',
    fontFamily: 'Futura',
    fontSize: 20,
    fontWeight: '600',
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingBottom: 5,
  },
  cellLabel: {
    color: '#333',
    fontFamily: 'Futura',
    fontSize: 16,
  },
  cellValue: {
    color: '#66533D',
    fontFamily: 'Futura',
    fontSize: 16,
    fontStyle: 'italic',
  },
});

AppRegistry.registerComponent('W8M8', () => W8M8);
