/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @ListVew九宫格布局
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
  Navigator
} from 'react-native';

// const URL = 'https://api.douban.com/v2/book/search?count=20&q=余秋雨';
const URL = `https://api.douban.com/v2/book/search?count=20&q=${encodeURI('余秋雨')}`;
const STORAGE_KEY_ONE = "0";

import Dimensions from 'Dimensions';
// 引入数据库类和Book类
import SQLite from './js/db/SQLite';
import Book from './js/db/Book';
import Article from './js/db/Article';

// 引入AsyncStorage类
import Storage from './Storage';

// 引入子组件ArticlePage.js
import ArticlePage from './ArticlePage';

const sqlite = new SQLite();
const book = new Book();
const article = new Article();

const {width,height} = Dimensions.get('window');
const cols = 3;
const boxW = 80;

const wMargin = Number.parseInt((width - cols*boxW) / (cols+1));
const hMargin = 25;

export default class Main extends Component {

	constructor(props){
		super(props);
		this.state = {
			dataSource: null,
			isLoaded:false,
			isInitLoad:true, // 是第一次进入			
			isApiChanged:false // API是否发生变化
		};
	}

	componentDidMount(){

		// 判读API是否发生变化，如果发生变化，那么就从新请求
		this._initFetchData();

		sqlite.createTable();

		Storage.get('VALUE').then((data) => {
	      if(data == null){
	        // 表示第一次加载APP，从网络上获取数据
	        this.fetchData();
	      }else{
	      	// 从缓存中获取
			this._renderRowByCache();
			this.setState({
				isInitLoad:false // 不是第一次进入
			})
	      }
	    });
		
	}

	componentWillUnMount(){
		sqlite.close();
	}
	// API是否发变化
	_initFetchData(){
		if(this.state.isApiChanged){
			sqlite.deleteAllBooks();
			Storage.save('VALUE',null);
		}
	}

	// 网络请求数据
	fetchData(){
		fetch(URL)
			.then((response) => response.json())
			.then((data) => {
				let dataList = data.books;
				this.setState({
					dataSource:new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(dataList),
					isLoaded:true
				})

			})
			.catch((err) => {
				console.log(err.message);
				// throw error;
				this.setState({
					dataSource: null,
					isLoaded:false
				})
			})
			.done()
	}
	// 删除所有的缓存记录
	_deleteAllBooks(){
		sqlite.deleteAllBooks();
		sqlite.deleteAllArticles();
	}

	// 渲染ListView部分
	_renderListView(){ 
		var list = this.state.isLoaded ? 
			(<ListView 
 	  			dataSource={this.state.dataSource}
 	  			renderRow={(rowData)=>this._renderRow(rowData)}
 	  			contentContainerStyle={styles.listViewStyle}
 	  		/>) :
	  		(<View style={styles.indicatorStyle}>
				<ActivityIndicator size='large' color='#398DEE'/>
	  		</View>);
		
		return list;

	}

	render() {
		return (
		  <View style={{flex:1,backgroundColor:'#fff'}}>
		  	<View style={styles.headerContainer}>
		  		<Text style={styles.headerTxt}>杂志列表</Text>
		  	</View>

	  		{
	  			this._renderListView()
	  		}

	  		<Text style={{color:'red'}} onPress={()=>this._deleteAllBooks()}>删除所有缓存记录</Text>
	  		<Text style={{color:'blue'}} onPress={()=>this._deleteValue()}>删除VALUE</Text>
		  		
		  </View>
		);
	}
	
	// 删除VALUE
	_deleteValue(){
		Storage.delete('VALUE');

		Storage.get('VALUE').then((data) => {
			console.log(data)
		})
		
	}

	// 进入二级页面文章页
	_gotoArticlePage(data){
		const {navigator} = this.props;
		if(navigator){
			navigator.push({
				name:'ArticlePage',
				component:ArticlePage,
				params:{
					id:data.id
				}
			})
		}
	}

	_renderRow(rowData){
		// 如果是第一次进入，从网络上获取数据，此时插入数据库，保存缓存，并将VALUE置为0
		if(this.state.isInitLoad){
			book.setName(rowData.pubdate);
			book.setPic(rowData.images.medium);
			book.setId(rowData.id);

			article.setSummary(rowData.summary);
			article.setPic(rowData.images.large);
			article.setId(rowData.id);

			sqlite.saveBooks(book).then(()=>{
		 	    console.log('图书列表保存成功');
		 		Storage.save('VALUE',0);
		 	}).catch((err)=>{
		 	    console.log('图书列表保存失败');
		 	});

		 	sqlite.saveArticles(article).then(()=>{
		 	    console.log('文章详情保存成功');
		 		// Storage.save('VALUE',0);
		 	}).catch((err)=>{
		 	    console.log('文章详情保存失败');
		 	});

		 	console.log(article)

		 	return (
				<TouchableOpacity style={styles.wrapStyle} activeOpacity={0.5} onPress={()=>this._gotoArticlePage(rowData)}>
					<View style={styles.innerView}>
						<Image source={{uri:rowData.images.medium}} style={styles.imgView} />
						<Text style={{color:'gray'}}>{rowData.pubdate}</Text>
					</View>
				</TouchableOpacity>
			)
		}else{
			// 如果不是第一次进入，那么直接从缓存中拿取数据
			return (
				<TouchableOpacity style={styles.wrapStyle} activeOpacity={0.5} onPress={()=>this._gotoArticlePage(rowData)}>
					<View style={styles.innerView}>
						<Image source={{uri:rowData.pic}} style={styles.imgView} />
						<Text style={{color:'gray'}}>{rowData.name}</Text>
					</View>
				</TouchableOpacity>
			)
		}

	}

	// 从缓存中拿取数据
	_renderRowByCache(){
		sqlite.listBookCache().then((results)=>{
			this.setState({
				dataSource:new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(results),
				isLoaded:true
			});


		})
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
	indicatorStyle:{
		marginTop:30,
		justifyContent:'center',
		alignItems:'center'
	},
	listViewStyle:{
        // 改变主轴的方向  
        flexDirection:'row',  
        // 多行显示  
         flexWrap:'wrap',  
        // 侧轴方向  
        alignItems:'center', // 必须设置,否则换行不起作用  
	},
	wrapStyle:{
		width:80,
		height:100,
		marginLeft:wMargin,
		marginTop:hMargin,
	},
	innerView:{
		width:80,
		height:100,
		alignItems:'center',
		justifyContent:'center'
	},
	imgView:{
		width:61,
		height:72
	}
});

