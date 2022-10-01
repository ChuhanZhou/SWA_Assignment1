// JavaScript Document

var host = 'http://localhost:8080/'
var xhr = new XMLHttpRequest();

var selectCity;
var selectData;
var lastDateText;
var minTempText;
var maxTempText;
var totalPrecipitationText;
var averageWindSpeedText;

var showWeather;
var city_name;
var citys_weather_data = [];

$(document).ready(function(){ 
	selectCity = document.getElementById('selectCity');
	selectData = document.getElementById('selectData');
	lastDateText = document.getElementById('lastDateText');
	minTempText = document.getElementById('minTempText');
	maxTempText = document.getElementById('maxTempText');
	totalPrecipitationText = document.getElementById('totalPrecipitationText');
	averageWindSpeedText = document.getElementById('averageWindSpeedText');

	city_name = selectCity.value;

	HP_updateShowType(selectData.value)
	HP_getDataByCity(city_name);
});

$(document).ready(function(){
	$("#selectCity").change(function(){
		city_name = selectCity.value
		console.log("[select city] "+city_name)
		HP_getDataByCity(city_name)
		
	});
});

$(document).ready(function(){
	$("#selectData").change(function(){
		data_name = selectData.value;
		HP_updateShowType(data_name)
		console.log("[select data] "+data_name)
		if (showWeather){
			HP_getDataByCity(city_name)
			HP_initTable(city_name)
		}
	});
});

function HP_updateLastDayInfo(){
	last_date = citys_weather_data[city_name].at(-1).getDate()
	lastDateText.textContent = last_date;
	minTemperature = HP_getMinTemperature(city_name,last_date)
	maxTemperature = HP_getMaxTemperature(city_name,last_date)
	totalPrecipitation = HP_getTotalPrecipitation(city_name,last_date)
	averageWindSpeed = HP_getAverageWindSpeed(city_name,last_date)
	minTempText.textContent = minTemperature.getValue().toFixed(1)+" °"+minTemperature.getUnit()
	maxTempText.textContent = maxTemperature.getValue().toFixed(1)+" °"+minTemperature.getUnit()
	totalPrecipitationText.textContent = totalPrecipitation.getValue().toFixed(1)+" "+totalPrecipitation.getUnit()
	averageWindSpeedText.textContent = averageWindSpeed.getValue().toFixed(1)+" "+averageWindSpeed.getUnit()
}

function HP_initTable(city_name) {
	console.log("[update table] type: weather")
    var forecast_table = $('#forecast');
	city_data = citys_weather_data[city_name]
    if (forecast_table !== undefined) {
        forecast_table.empty();
    }
    forecast_table.append("<tr><td>City</td><td>Temperature</td><td>Precipitation</td><td>Precipitation Type</td><td>Wind Speed</td><td>Wind Directions</td><td>Cloud Coverage</td><td>Time</td></tr>");
	for (let i = city_data.length-1; i >=0; i--) {
		daily_datas = city_data[i].getWeatherDatas()
		
		for(let d_i = daily_datas.length-1; d_i >=0; d_i--){
			var single_hour = daily_datas[d_i];
        	forecast_table.append(
            	"<tr>" +
            	"<td>" + city_name + "</td>" +
            	"<td>" + single_hour.getTemperature().getValue() + " °" + single_hour.getTemperature().getUnit() + "</td>" +
            	"<td>" + single_hour.getPrecipitation().getValue() + " " + single_hour.getPrecipitation().getUnit() + "</td>" +
            	"<td>" + single_hour.getPrecipitation().getPrecipitationType() + "</td>" +
            	"<td>" + single_hour.getWindSpeed().getValue() + " " + single_hour.getWindSpeed().getUnit() + "</td>" +
            	"<td>" + single_hour.getWindSpeed().getDirection() + "</td>" +
            	"<td>" + single_hour.getCloudCoverage().getValue() + " " + single_hour.getCloudCoverage().getUnit() + "</td>" +
            	"<td>" + single_hour.getTime().toLocaleString() + "</td>" +
            	+"</tr>")
		}
    }
}

function HP_updateShowType(type_name){
	switch (type_name){
		case "weather":
			showWeather = true
			break
		case "forecast":
			showWeather = false
			break
		default:
			break
	}
}

function HP_updateData(weather_datas,city_name)
{
	var n = 0
	var time = -1
	var date = "-1"
	var daily_data = createDailyWeatherData(date)
	var single_data = createWeatherData(time)

	if (city_name in citys_weather_data && citys_weather_data[city_name].length>0){
		time = citys_weather_data[city_name].at(-1).getWeatherDatas().at(-1).getTime().toISOString();
		date = citys_weather_data[city_name].at(-1).getDate()
		daily_data = citys_weather_data[city_name].at(-1)
		var start = false;
		for (var i = 0; i < weather_datas.length; i++){
			data = weather_datas[i]
			data_date = (new Date(data.time)).toLocaleDateString()
			if (time != data.time){
				if (start){
					time = data.time;
					if (single_data.getTime().toISOString() != (new Date(-1)).toISOString()) {
						daily_data.getWeatherDatas().push(single_data);
						n+=1;
					} 
					single_data = createWeatherData(time);
				}
			}
			else {
				start = true;
			}

			if (date != data_date && start){
				if (daily_data.getDate() != "-1"){
					date = data_date
					daily_data = createDailyWeatherData(date)
					citys_weather_data[city_name].push(daily_data);
				}
			}

			if (start){
				single_data.setData(data);
			}
		}
		if (single_data.getTime().toISOString() != (new Date(-1)).toISOString()){
			daily_data.getWeatherDatas().push(single_data)
			n+=1
		}
	}
	else {		
		citys_weather_data[city_name] = [];
		for (var i = 0; i < weather_datas.length; i++){
			data = weather_datas[i];
			data_date = (new Date(data.time)).toLocaleDateString()

			if (time != data.time){
				if (single_data.getTime().toISOString() != (new Date(-1)).toISOString()){
					daily_data.getWeatherDatas().push(single_data);
					n+=1;
				}
				time = data.time;
				single_data = createWeatherData(time);
			}

			if (date != data_date){
				if (daily_data.getDate() != "-1"){
					citys_weather_data[city_name].push(daily_data);
				}
				date = data_date
				daily_data = createDailyWeatherData(date)
			}

			single_data.setData(data);
		}
		if (single_data.getTime().toISOString() != (new Date(-1)).toISOString()){
			daily_data.getWeatherDatas().push(single_data)
			citys_weather_data[city_name].push(daily_data)
			n+=1
		}
	}
	console.log("[update city weather data] new num: "+n)
}

function HP_getDataByCity(city_name)
{
	url = host + 'data/' + city_name;
	console.log("[get data] url: "+url);
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function() {
    	if (xhr.readyState == XMLHttpRequest.DONE) {
			console.log("[GET city weather data successed] "+city_name);
			weather_datas = JSON.parse(xhr.responseText);
			HP_updateData(weather_datas,city_name);
			HP_updateLastDayInfo()
			if (showWeather){
				HP_initTable(city_name)
			}
    	}
	}
	xhr.send();
}

function HP_getMinTemperature(city_name,date){
	city_weather_data = citys_weather_data[city_name]
	min_temp = undefined
	for (var i = city_weather_data.length-1; i >=0; i--){
		date_data = city_weather_data[i]
		if (date_data.getDate()==date){
			for(var d_i = 0; d_i < date_data.getWeatherDatas().length; d_i++){
				temp = date_data.getWeatherDatas()[d_i].getTemperature()
				if (min_temp==undefined || temp.getValue()<min_temp.getValue()){
					min_temp = temp
				}
			}
			break
		}
	}
	return min_temp
}

function HP_getMaxTemperature(city_name,date){
	city_weather_data = citys_weather_data[city_name]
	max_temp = undefined
	for (var i = city_weather_data.length-1; i >=0; i--){
		date_data = city_weather_data[i]
		if (date_data.getDate()==date){
			for(var d_i = 0; d_i < date_data.getWeatherDatas().length; d_i++){
				temp = date_data.getWeatherDatas()[d_i].getTemperature()
				if (max_temp==undefined || temp.getValue()>max_temp.getValue()){
					max_temp = temp
				}
			}
			break
		}
	}
	return max_temp
}

function HP_getTotalPrecipitation(city_name,date){
	city_weather_data = citys_weather_data[city_name]
	total_precipitation = undefined
	for (var i = city_weather_data.length-1; i >=0; i--){
		date_data = city_weather_data[i]
		if (date_data.getDate()==date){
			for(var d_i = 0; d_i < date_data.getWeatherDatas().length; d_i++){
				precipitation = date_data.getWeatherDatas()[d_i].getPrecipitation()
				if (total_precipitation==undefined){
					total_precipitation = precipitation.getDataValue().copy()
				}
				else
				{
					total_precipitation.setValue(total_precipitation.getValue()+precipitation.getValue())
				}
			}
			break
		}
	}
	return total_precipitation
}

function HP_getAverageWindSpeed(city_name,date){
	city_weather_data = citys_weather_data[city_name]
	average_wind_speed = undefined
	for (var i = city_weather_data.length-1; i >=0; i--){
		date_data = city_weather_data[i]
		if (date_data.getDate()==date){
			for(var d_i = 0; d_i < date_data.getWeatherDatas().length; d_i++){
				wind_speed = date_data.getWeatherDatas()[d_i].getWindSpeed()
				if (average_wind_speed==undefined){
					average_wind_speed = wind_speed.getDataValue().copy()
				}
				else
				{
					average_wind_speed.setValue(average_wind_speed.getValue()+wind_speed.getValue())
				}
			}
			average_wind_speed.setValue(average_wind_speed.getValue()/date_data.getWeatherDatas().length)
			break
		}
	}
	return average_wind_speed
}

//[object]
const createDailyWeatherData = function(date){
	const daily_weather_data = {}
	daily_weather_data.date = date
	daily_weather_data.weather_datas = []

	daily_weather_data.getDate = function(){
        return daily_weather_data.date
    }

	daily_weather_data.getWeatherDatas = function(){
        return daily_weather_data.weather_datas
    }

	daily_weather_data.setWeatherDatas = function(weather_datas){
        daily_weather_data.weather_datas = weather_datas
    }
	return daily_weather_data
}

const createWeatherData = function(time){
	
    const weather_data = {}
    weather_data.temperature = 0;
    weather_data.precipitation = 0;
	weather_data.wind_speed = 0;
	weather_data.cloud_coverage = 0;
	weather_data.time = new Date(time);
	
    weather_data.getTime = function(){
        return weather_data.time
    }
	
	weather_data.getTemperature = function(){
		return weather_data.temperature
	}
	
	weather_data.setTemperature = function(data){
		weather_data.temperature = createDataValue(data.value,data.unit)
	}
	
	weather_data.getPrecipitation = function(){
		return weather_data.precipitation
	}
	
	weather_data.setPrecipitation = function(data){
		weather_data.precipitation = createPrecipitationDataValue(data.value,data.unit,data.precipitation_type)
	}
	
	weather_data.getWindSpeed = function(){
		return weather_data.wind_speed
	}
	
	weather_data.setWindSpeed = function(data){
		weather_data.wind_speed = createWindSpeedDataValue(data.value,data.unit,data.direction)
	}
	
	weather_data.getCloudCoverage = function(){
		return weather_data.cloud_coverage
	}
	
	weather_data.setCloudCoverage = function(data){
		weather_data.cloud_coverage = createDataValue(data.value,data.unit)
	}
	
	weather_data.setData = function(data){
		switch(data.type) {
			case "temperature":
				weather_data.setTemperature(data)
				break
			case "precipitation":
				weather_data.setPrecipitation(data)
				break
			case "wind speed":
				weather_data.setWindSpeed(data)
				break
			case "cloud coverage":
				weather_data.setCloudCoverage(data)
				break
			default:
				break
		}
	}
	
    return weather_data
}

const createWindSpeedDataValue = function(value,unit,direction){
	const data_value = {}
	data_value.direction = direction;
	Object.setPrototypeOf(data_value,createDataValue(value,unit))
	
	data_value.getDirection = function(){
		return data_value.direction
	}
	
	data_value.setDirection = function(direction){
		data_value.direction = direction
	}

	data_value.copy = function(){
		return createWindSpeedDataValue(value,unit,direction)
	}
	
	return data_value
}

const createPrecipitationDataValue = function(value,unit,precipitation_type){
	const data_value = {}
	data_value.precipitation_type = precipitation_type;
	Object.setPrototypeOf(data_value,createDataValue(value,unit))
	
	data_value.getPrecipitationType = function(){
		return data_value.precipitation_type
	}
	
	data_value.setPrecipitationType = function(precipitation_type){
		data_value.precipitation_type = precipitation_type
	}

	data_value.copy = function(){
		return createPrecipitationDataValue(value,unit,precipitation_type)
	}
	
	return data_value
}

const createDataValue = function(value,unit){
	const data_value = {}
	data_value.value = value;
	data_value.unit = unit;
	
	data_value.getValue = function(){
		return data_value.value
	}
	
	data_value.getUnit = function(){
		return data_value.unit
	}
	
	data_value.setValue = function(value){
		data_value.value = value
	}
	
	data_value.setUnit = function(unit){
		data_value.unit = unit
	}

	data_value.getDataValue = function(){
		return data_value
	}

	data_value.copy = function(){
		return createDataValue(value,unit)
	}
	
	return data_value
}