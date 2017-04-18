/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  ScrollView
} from 'react-native';

// 引入数据库类和Book类
import SQLite from './js/db/SQLite';
import Article from './js/db/Article';

// 引入AsyncStorage类
import Storage from './Storage';

// 引入json文件
import TestJson from './test.json';

const sqlite = new SQLite();
const article = new Article();

export default class ArticlePage extends Component {
  constructor(props){
    super(props);
    this.state = {
        id:null,
        pic:null,
        summary:null
    };
  }

  componentDidMount(){
    sqlite.findArticleCache(this.props.id).then((results) => {
      //console.log(results);// OK

      this.setState({
        pic:results.pic,
        summary:results.summary
      })

    }).catch((err) => {
      console.log(err);
    })
  }

  render() {
    return (
      <View style={{flex:1,backgroundColor:'#fff'}}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTxt}>文章详情</Text>
        </View>

        <ScrollView>
          <Image source={{uri:this.state.pic}} style={{width:100,height:150}} />
          <Text>{this.state.summary}</Text>
          <Text>其他测试文字</Text>
          <Text>
            {TestJson.summary}
          </Text>
        </ScrollView>
          
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer:{
    height:30,
    backgroundColor:'#398DEE',
    justifyContent:'center',
    alignItems:'center',
    shadowColor:'#000',
    // shadowOpacity:0.5,

  },
  headerTxt:{
    color:'#fff',
    fontSize:14,
  },
});

