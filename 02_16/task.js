/*
* 定义一些正则表达式，用于对输入城市、空气质量的判断
*/
// 城市名必须为中英文字符，空气质量指数必须为整数
var regcity=new RegExp("^[\u4e00-\u9fa5a-zA-Z]+$");
// var regvalue=new RegExp("^[1-9]d*$");
var regvalue=new RegExp("^[0-9]*[1-9][0-9]*$");
// 去除字符串两边的空格
function trim(str){
	return str.replace(/(^\s+)|(\s+$)/g, "");
}


/**
*  aqiData:存储用户输入的空气指数数据
*  示例格式：
*  aqi-Data={
	"北京"：90,
	"上海"：40
};
*/
// 声明对象Object,将对象序列化后就可以转换为键值对表示的对象
// 全局变量JSON对象
var aqiData={};

/*从用户输入中获取数据，向aqi-Data增加一条数据
* 添加正则验证：城市名称为中英文字符，质量指数为整数
* 然后渲染aqi-list,增加新增的数据
*/
function addAqiData(){
	// trim()去除前后空格及空字符
	var city=document.getElementById("aqi-city-input").value;
	var airvalue=document.getElementById("aqi-value").value;
	// TODO正则验证
	if(!regcity.test(trim(city))){
		alert("城市名称输入只能是中英文字符！");
	}else if(!regvalue.test(trim(airvalue))){
		alert("空气质量应为整数！");
	}else{
		// 为对象aqiData添加属性,使其成为这种格式-"北京"：90
		aqiData[city]=parseInt(trim(airvalue));
		// 将对象序列化为字符串,将所有aqiData序列化为键值对，
		JSON.stringify(aqiData);
	}
		
}

/*
* 渲染aqi-table表格,根据aqiData中的数据渲染显示表格
*/
function renderAqiList(){
	// 创建表格，并向其中添加节点信息
	var myList=document.getElementById("aqi-table");
	myList.innerHTML="<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
	// 将aqiData对象中的值渲染至表格
	for(var key in aqiData){
		//创建行节点，并将aqiData中的值写入
		var myTr=document.createElement("tr");
		myTr.innerHTML="<td>"+key+"</td><td>"+aqiData[key]+"</td><td><button>删除</button></td>";
		// 将创建的行加入到表格中
		myList.appendChild(myTr);
	}
}

/*
* 点击add-btn时的处理逻辑
* 获取用户输入，更新数据，并进行页面呈现的更新

** 用户每次输入后点击“确认添加”，都会刷新表格显示
*/
function addBtnHandle(){
	//调用函数获取用户输入、更新数据对象 
	addAqiData();
	// 调用函数渲染页面
	renderAqiList();
}

/*
* 点击表格中各个行的删除按钮时的处理逻辑
* 获取哪个城市数据被删，删除数据，并更新表格显示
*/
function delBtnHandle(event){
	// 删除数据，将点击行的城市、数据从aqiData中删除
	// TODO，获取点击行，将其中数据从JSON对象aqidata中删除
	// 根据事件流机制，获取button对象e.target,获取当前行tr
	var delCity=event.target.parentNode.parentNode.firstChild.innerHTML;
	delete aqiData[delCity];
	// 重新调用数据渲染页面
	renderAqiList();

	// 通过这种删除节点的方式，只能实现表面上的表格行的删除，实际aqiData中的数据都还存在
	// document.getElementById("aqi-table").removeChild(event.target.parentNode.parentNode);
}

function init(){
	// add-btn添加按钮，绑定点击事件
	document.getElementById("add-btn").addEventListener("click",addBtnHandle);
	// 通过事件流机制，直接给table绑定监听事件，委托给父节点触发处理函数 
	document.getElementById("aqi-table").addEventListener("click",delBtnHandle);
}

// 调用初始函数init()执行
// DOM页面载入完成后调用init()方法执行，否则DOM对象未加载完就给其添加事件监听，会报错
window.onload=function(){
	init();
};