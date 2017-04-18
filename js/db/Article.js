import React, { Component } from 'react';

let id;            // 图书ID
let summary = '';    // 图书简介
let pic = '';      // 图书海报


export default class Article extends Component {

  render(){
    return null;
  }

  setId(id){
    this.id = id;
  }

  getId(id){
    return this.id;
  }

  setName(name){
    this.name = name;
  }

  getName(){
    return this.name;
  }

  setSummary(summary){
    this.summary = summary;
  }

  getSummary(summary){
    return this.summary;
  }

  setPic(pic){
    this.pic = pic;
  }

  getPic(pic){
    return this.pic;
  }
  
};

