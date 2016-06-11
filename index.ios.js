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
  View
} from 'react-native';

import Button from 'react-native-button'

import {
  Cell,
  CustomCell,
  Section,
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
    setTimeout(onload.bind(this, workoutTemplatesJSON), 1000);
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
    }, 1000);
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
      var d = workoutDataJSON;
      this.setState({stage: 4, summary: d.summary, steps: d.steps});
    }, 1000);
  }

  handleWorkoutConfirmation () {
    this.setState({stage: 5});
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
        handleWorkoutConfirmation={this.handleWorkoutConfirmation.bind(this)}
      />
    </View> : null;
    var workoutFlow = (this.state.stage == 5) ? <View style={styles.container} key={4}>
      <WorkoutFlow {...this.state.steps} appScope={this} />
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
      <View style={styles.container}>
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
      <View style={styles.container2}>
        <Text>Start a new workout!</Text>
        <Button style={(this.props.selectedTemplate) ? styles.buttonActive : styles.buttonInactive} onPress={this.onPress.bind(this)}>BEGIN</Button>
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
    this.props.handleWorkoutConfirmation()
  }

  render () {
    return (
      <TableView>
        <Section header="Workout Summary">
          <Cell cellstyle="RightDetail" title="Mucle Groups" detail={this.props.muscle_groups} />
          <Cell cellstyle="RightDetail" title="Reps" detail={this.props.rep_range} />
          <Cell cellstyle="RightDetail" title="Speed" detail={this.props.speed} />
          <Cell cellstyle="RightDetail" title="% of Max" detail={this.props.percent_of_max} />
          <Cell cellstyle="RightDetail" title="Sets" detail={this.props.set_count} />
          <Cell cellstyle="RightDetail" title="~ Duration" detail={this.props.approx_duration} />
          <Cell cellstyle="RightDetail" title="Rest" detail={this.props.rest_time_range} />
          <Cell cellstyle="RightDetail" title="Set Time" detail={this.props.set_time_range} />
        </Section>
      </TableView>
      <Button style={styles.buttonActive} onpress={this.handlePress.bind(this)}>Confirm</Button>
    );
  }
}

class WorkoutFlow extends Component {
  render () {}
}

class WorkoutExerciseScreen extends Component {
  render () {}
}

class WorkoutRestScreen extends Component {
  render () {}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonActive: {
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
  buttonInactive: {
    color: '#F0E6D3',
    backgroundColor: '#E0D7C5',
    borderRadius: 4,
    fontSize: 20,
    width: 320,
    height: 40,
    marginTop: 40,
    marginBottom: 40,
    lineHeight: 32,
  },
});

AppRegistry.registerComponent('W8M8', () => W8M8);
