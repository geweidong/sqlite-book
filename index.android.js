/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator
} from 'react-native';

import Main from './Main';

export default class sqliteDemo extends Component {

  render() {
    var defaultName = 'Main';  
    var defaultComponent = Main;  
    return (  
        <Navigator  
            initialRoute={{ name: defaultName, component: defaultComponent }}  
            configureScene={(route) => {  
            return Navigator.SceneConfigs.HorizontalSwipeJump;  
        }}  
        renderScene={(route, navigator) => {  
            let Component = route.component;  
            return <Component {...route.params} navigator={navigator} />  
        }}/>  
    );
  }
}

AppRegistry.registerComponent('sqliteDemo', () => sqliteDemo);