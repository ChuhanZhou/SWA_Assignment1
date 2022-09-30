// JavaScript Document

var host = 'http://localhost:8080/'
var xhr = new XMLHttpRequest();

var selectCity;

var city;

$(document).ready(function(){ 
	
	selectCity = document.getElementById('selectCity');
	
	city = selectCity.value;
	
	updateData();
});

$(document).ready(function(){
	$("#selectCity").change(function(){
		city = selectCity.value;
		console.log("[select city] "+city);
		updateData();
	});
});

function updateData()
{
	getDataByCity();
}

function getDataByCity()
{
	url = host + 'data/' + city;
	console.log("[get data] url: "+url);
	xhr.open("GET", url, false);
	xhr.onreadystatechange = function() {
    	if (xhr.readyState == XMLHttpRequest.DONE) {
        	//alert();
			console.log("[GET city data successed] "+city);
			weather = JSON.parse(xhr.responseText)
			console.log(weather)
    	}
	}
	console.log(xhr.disconnect)
	xhr.send();
}

//[object]
const WeatherData = function(time){
    const weather_data = {}
    weather_data.temperature = 0;
    weather_data.precipitation = 0;
	weather_data.wind_speed = 0;
	weather_data.cloud_coverage = 0;
	weather_data.time = time;
	

    point.getX = function(){
        return point.x
    }

    point.getY = function(){
        return point.y
    }

    point.moveTo = function(x,y){
        point.x = x
        point.y = y
    }

    point.toString = function(){
        return 'x:'+point.x+' y:'+point.y
    }

    return point
}