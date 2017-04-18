import React, { Component } from 'react';


export default class Book extends Component {

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

  getName(name){
    return this.name;
  }

  setPic(pic){
    this.pic = pic;
  }

  getPic(pic){
    return this.pic;
  }
  
};

