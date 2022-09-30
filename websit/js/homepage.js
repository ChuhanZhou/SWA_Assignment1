// JavaScript Document

var host = 'http://localhost:8080/'
var xhr = new XMLHttpRequest();

var selectCity;

var city_name;
var citys_weather_data = [];

$(document).ready(function(){ 
	
	selectCity = document.getElementById('selectCity');
	
	city_name = selectCity.value;
	
	getDataByCity(city_name);
});

$(document).ready(function(){
	$("#selectCity").change(function(){
		city_name = selectCity.value;
		console.log("[select city] "+city_name);
		getDataByCity(city_name);
	});
});

function updateData(weather_datas,city_name)
{
	var n = 0;
	var single_data = createWeatherData(-1);
	var time = -1;
	if (city_name in citys_weather_data){
		time = citys_weather_data[city_name].at(-1).getTime().toISOString();
		var start = false;
		for (var i = 0; i < weather_datas.length; i++){
			data = weather_datas[i]
			if (time != data.time){
				if (start){
					time = data.time;
					if (single_data.getTime().toISOString() != (new Date(-1)).toISOString()) {
						citys_weather_data[city_name].push(single_data);
						n+=1;
					} 
					single_data = createWeatherData(time);
				}
			}
			else {
				start = true;
			}
			if (start){
				single_data.setData(data);
			}
		}
	}
	else {		
		citys_weather_data[city_name] = [];
		for (var i = 0; i < weather_datas.length; i++){
			data = weather_datas[i];
			if (time != data.time){
				if (single_data.getTime().toISOString() != (new Date(-1)).toISOString()){
					citys_weather_data[city_name].push(single_data);
					n+=1;
				}
				time = data.time;
				single_data = createWeatherData(time);
			}
			single_data.setData(data);
		}
	}
	console.log("[update city weather data] new num: "+n)
	console.log(citys_weather_data)
}

function getDataByCity(city_name)
{
	url = host + 'data/' + city_name;
	console.log("[get data] url: "+url);
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function() {
    	if (xhr.readyState == XMLHttpRequest.DONE) {
        	//alert();
			console.log("[GET city weather data successed] "+city_name);
			weather_datas = JSON.parse(xhr.responseText);
			updateData(weather_datas,city_name);
    	}
	}
	xhr.send();
}

//[object]
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
	
	return data_value
}