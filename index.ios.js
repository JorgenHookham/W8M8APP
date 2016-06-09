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

class W8M8APP extends Component {

  constructor (props) {
    super(props);
    this.state = {
      stage: 1,
      selectedTemplate: null
    };
  }

  componentDidMount () {
    var app = this;
    this.requestWorkoutTemplates((request) => {
      app.setState({
        stage: 2,
        workoutTemplates: JSON.parse(request.responseText),
      });
    });
  }

  requestWorkoutTemplates (onload) {
    var request = new XMLHttpRequest();
    request.onload = onload.bind(this, request);
    request.open('GET', 'http://w8m8.herokuapp.com/api/workout-templates/?format=json');
    request.send();
  }

  handleSetup (selectedTemplate) {
    this.setState({selectedTemplate: selectedTemplate})
  }

  render() {
    var splash = (this.state.stage == 1) ? <View style={styles.container}>
      <Splash></Splash>
    </View> : null;
    var setup = (this.state.stage == 2) ? <View style={styles.container}>
      <Setup {...this.state} onChange={this.handleSetup.bind(this)}></Setup>
    </View> : null;
    return (
      <View style={styles.container}>
        {splash}
        {setup}
      </View>
    );
  }

}

class Splash extends Component {
  render () {
    return (
      <View style={styles.container}>
        <Image style={styles.splashImage} source={require('./images/splash.png')} resizeMode={'contain'}></Image>
        <Image style={styles.loader} source={require('./images/gears.gif')} resizeMode={'contain'}></Image>
      </View>
    );
  }
}

class Setup extends Component {

  onChange (selectedTemplate) {
    this.props.onChange(selectedTemplate)
  }

  onPress (e) {
    console.log('Pressed!');
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
        <Button style={(this.props.selectedTemplate) ? styles.buttonActive : styles.buttonInactive} onPress={this.onPress.bind(this)}>Begin</Button>
        <Picker style={styles.picker} onValueChange={this.onChange.bind(this)} selectedValue={this.props.selectedTemplate}>{itemNodes}</Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
    backgroundColor: 'green',
    fontSize: 20,
    width: 320,
    height: 40,
    marginTop: 40,
    marginBottom: 40,
    lineHeight: 30,
  },
  buttonInactive: {
    color: 'white',
    backgroundColor: '#CCC',
    fontSize: 20,
    width: 320,
    height: 40,
    marginTop: 40,
    marginBottom: 40,
    lineHeight: 30,
  },
});

AppRegistry.registerComponent('W8M8APP', () => W8M8APP);
