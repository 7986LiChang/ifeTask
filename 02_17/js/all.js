/*定义数据格式城市-日期-空气指数*/

// 示例，为JSON对象
// var aqiSourceData={
// 	"北京":{
// 		"2016-09-01":89,
// 		"2016-09-02":85,
// 		"2016-09-03":79,
// 		"2016-09-04":92
// 	},
// 	"上海":{
// 		"2016-09-01":85,
// 		"2016-09-02":75,
// 		"2016-09-03":56,
// 		"2016-09-04":83
// 	}
// };

/*以下两个函数随机模拟生成测试数据*/
// 将 标准格式日期 转换为样式：2016-09-01
function getDateStr(dat){
	var y = dat.getFullYear();
	var m = dat.getMonth()+1;
	m = m < 10 ? '0'+m : m;
	var d = dat.getDate();
	d = d < 10 ? "0"+d : d;
	return y + "-" + m + "-" +d;
}

// 随机生成连续3个月的数据，从2016-09-01至2016-11-30共91天
function randomBuildData(seed){
	var returnData={};
	var dat = new Date("2016-09-01");
	var datStr = " ";
	for(var i = 1;i< 92;i++){
		datStr=getDateStr(dat);
		returnData[datStr]=Math.ceil(Math.random() * seed);
		dat.setDate(dat.getDate() + 1);
	}
	return returnData;
}
// 原始数据：城市固定，利用以上两个函数随机生成 城市-日期-指数 数据
var aqiSourceData = {
	"北京" : randomBuildData(500),
	"上海" : randomBuildData(300),
	"广州" : randomBuildData(200),
	"深圳" : randomBuildData(100),
	"成都" : randomBuildData(300),
	"西安" : randomBuildData(500),
	"福州" : randomBuildData(100),
	"厦门" : randomBuildData(100),
	"沈阳" : randomBuildData(500)
};

// 保存渲染图表需要的数据
var chartData = {
	option : {city : "", time : ""},  //记录表单选择项：城市，时间粒度
	data : {}, //记录当前选择城市，时间粒度下的 平均空气质量数据
	temp : {}  //记录{城市：时间} ：平均空气质量
};

// 渲染图标需要的数据
function initAqiChartData(){
	chartData.data = {};
	var tempName = chartData.option.cicy + ":" + chartData.option.time;
	//temp中还未记录空气质量，则定义
	// 否则，data值直接从temp中获取
	if(typeof chartData.temp[tempName] == "undefined"){
		// 根据当前所选城市从aqiSourceData中获取空气质量数据信息
		var airqualityData = aqiSourceData[chartData.option.city];
		chartData.data = getAverageData(airqualityData, chartData.option.time);
		chartData.temp[tempName] = chartData.data;
	} 
	else{
		chartData.data = chartData.temp[tempName];
	}
}

// 根据选择时间粒度，处理空气质量数据
function getAverageData(sourceData, timeMode){
	// 选择日，直接将sourceData返回
	if(timeMode == "day"){
		return sourceData;
	}

	// 选择周，将每周数据平均后返回


	// 选择月，将每月数据平均后返回

}



// 记录当前页面的表单选项,选择时间粒度以及城市
var pageState= {
	nowSelectCity : -1,
	nowGraTime : "day"
};
// 记录柱状条颜色
var color = ["#7c8489", "#4fb3a4", "#ff7073", "#f5b977", "#fdfc7f"];
// 获取图表显示div
var histogramWidth = {};
histogramWidth["day"] = 10;
histogramWidth["week"] = 70;
histogramWidth["month"] = 100;

/*渲染图表*/
// 从chartData中的数据获取显示
function renderChart(){
	// 动态生成柱状div模拟柱状图
	var histogramWrap = document.getElementById("histogram-wrap");

	// 根据选择的时间粒度，生成每日/周/月的柱状表示,即chartData.data中的数据
	for( var date in chartData.data ){
		// 创建柱状div
		var histogram = document.createElement("div");
		// 依据空气质量数据确定柱状高度
		histogram.style.height = chartData.data[date] + "px";
		histogram.style.width = 10 + "px";
		histogram.style.backgroundColor = getColor();
		histogram.innerHTML = "";
		// 通过title标签在鼠标移至元素上方时，显示提示文字
		histogram.title = date + ":" +chartData.data[date]; 
		histogramWrap.appendChild(histogram);

	}	
}

/*柱状条颜色随机*/
function getColor(){
	return color[Math.round (Math.random() * ( color.length-1 ) )];
}


/*选择时间粒度的处理：日、月、周的radio事件点击时的处理函数*/
function graTimeChange(){
	// 更新chartData.option.time值
	// 确定选中项是否切换.   this为当前选中的radio项
	if(chartData.option.time == this.value) return;
	chartData.option.time = this.value;

	// 更新表格数据chartData
	initAqiChartData();

	// 选择变化后，要重新加载图表显示
	renderChart();

}


/*选择城市的处理：select发生变化时的处理*/
function citySelectChange(){
	if(chartData.option.city == this.value) return;
	chartData.option.city = this.value;
	initAqiChartData();
	renderChart();
}

/*初始化日、月、周的radio事件当点击时，调用函数graTimeChange*/
function initGraTime(){
	//为每个radio选项添加事件监听事件
	var timeRadios = document.getElementsByName("gra-time");
	for(var i = 0;i < timeRadios.length;i++){
		timeRadios[i].addEventListener("click", graTimeChange);
	}
}

/*初始化城市select事件,当点击时，调用函数citySelectChange*/
function  initGraCity(){
	// 为select中每个option列表项添加监听事件
	/*var cityOptions = document.getElementById("city-select").options;
	for(var i = 0;i < cityOptions.length;i++){
		cityOptions[i].addEventListener("click",citySelectChange);
	}*/
	// 给select列表添加事件监听
	var citySelect = document.getElementById("city-select");
	citySelect.addEventListener("click",citySelectChange);
}


// 为表格数据初始化chartData中的option数据
function initOption(){
	// 获取城市列表select的选择项
	var cityOptions = document.getElementById("city-select").options;
	for(var i = 0;i < cityOptions.length;i++){
		if(cityOptions[i].selected){
			chartData.option.city = cityOptions[i].value;
		}
	}
	// 获取日期粒度radio的选择项,遍历radio数组得到
	var timeRadios = document.getElementsByName("gra-time");
	for(var i = 0;i < timeRadios.length;i++){
		if(timeRadios[i].checked){
			chartData.option.time = timeRadios[i].value;
		}
	}

	/*使用querySelector, queryAllSelector,选择条件与css一致
	*/
	// 获取里列表项，value得到选中项的值
	/*chartData.option.city = document.querySelector("#city-select").value;
	chartData.option.time = document.querySelector("[name = \"gra-time \"][checked = \"checked \"]").value;*/

}




/*初始化函数*/
function init(){
	initOption();
	initAqiChartData();
	initGraTime();
	initGraCity();

}

/*页面加载完毕时调用init()*/
window.onload=function(){
	init();
};
