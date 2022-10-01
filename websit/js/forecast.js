var host = 'http://localhost:8080/'
var api_type = "forecast"
var selectCity;
var city;
var showForecast;

$(document).ready(function () {
    city = selectCity.value;
    var city_url = "/" + city
    const url = host + api_type + city_url
    console.log("PRE " + url);
    $("#selectCity").change(function () {
        city = selectCity.value;
        updateData();
    });
});

$(document).ready(function(){
	$("#selectData").change(function(){
		data_name = selectData.value;
		F_updateShowType(data_name)
		console.log("[select data] "+data_name)
		if (showForecast){
			var city_url = "/" + city
            const url = host + api_type + city_url
            getWeatherInfo(url);
		}
	});
});

function F_updateShowType(type_name){
	switch (type_name){
		case "weather":
			showForecast = false
			break
		case "forecast":
			showForecast = true
			break
		default:
			break
	}
}

async function updateData() {
    var city_url = "/" + city
    const url = host + api_type + city_url
    await getWeatherInfo(url);

}
//objs
//create table
async function initTable(city_arr) {
    if (showForecast){
        console.log("[update table] type: forecast")
        var forecast_table = $('#forecast');
        if (forecast_table !== undefined) {
            forecast_table.empty();
        }
        forecast_table.append("<tr><td>City</td><td>Temperature</td><td>Precipitation</td><td>Precipitation Type</td><td>Wind Speed</td><td>Wind Directions</td><td>Cloud Coverage</td><td>Time</td></tr>");
        for (let i = 0; i < city_arr.length; i++) {
            var single_hour = city_arr[i];
            forecast_table.append(
                "<tr>" +
                "<td>" + single_hour.name + "</td>" +
                "<td>" + single_hour.temp[0] + " °C - " + single_hour.temp[1] + " °C" + "</td>" +
                "<td>" + single_hour.perc[0] + " mm - " + single_hour.perc[1] + " mm" + "</td>" +
                "<td>" + single_hour.perc_type + "</td>" +
                "<td>" + single_hour.ws[0] + " m/s - " + single_hour.ws[1] + " m/s" + "</td>" +
                "<td>" + single_hour.ws_dir + "</td>" +
                "<td>" + single_hour.cc[0] + " % - " + single_hour.cc[1] + " %" + "</td>" +
                "<td>" + single_hour.tm[0] + "\n" + single_hour.tm[1] + "</td>" +
                +"</tr>")
        }
    }
}
//get city
async function getWeatherInfo(url) {
    //console.log(">>FRE<< "+url)
    var temp_arr = [];
    var prec_arr = [];
    var prec_type_arr = [];
    var ws_arr = [];
    var ws_dir_arr = [];
    var cc_arr = [];
    var time_arr = [];
    var real_time = [];
    var city_arr = [];
    await fetchRaw(url).then(weathers => {
        weathers.forEach(weather => {
            let raw_t = weather.time
            let new_date = new Date(raw_t);
            let realdate = new_date.toLocaleDateString();
            let realtime = new_date.toLocaleTimeString();
            let date = raw_t.split("T")[0]
            let time = raw_t.split("T")[1].split(".")[0]
            let timepac = [realdate, realtime]
            if (time_arr.indexOf(time) === -1) {
                time_arr.push(time);
                real_time.push(timepac);
            }
            if (weather.type == "temperature") {
                var temp = [weather.from, weather.to];
                temp_arr.push(temp);
            }
            else if (weather.type == "precipitation") {
                var prec = [weather.from, weather.to];
                var type = weather.precipitation_types;
                prec_arr.push(prec);
                prec_type_arr.push(type);
            }
            else if (weather.type == "wind speed") {
                var ws = [weather.from, weather.to];
                var dir = weather.directions;
                ws_arr.push(ws);
                ws_dir_arr.push(dir);
            }
            else if (weather.type == "cloud coverage") {
                var cc = [weather.from, weather.to];
                cc_arr.push(cc);
            }
        });
    });
    console.log(">>FRE<< TEMP_Size: " + temp_arr.length + " | " + prec_arr.length + " | " + ws_arr.length + " | " + cc_arr.length + " | " + real_time.length + " | " + prec_type_arr.length + " | " + ws_dir_arr.length);
    for (let i = 0; i < real_time.length; i++) {
        var assemble = createCity(city, temp_arr[i], prec_arr[i], prec_type_arr[i], ws_arr[i], ws_dir_arr[i], cc_arr[i], real_time[i]);
        city_arr.push(assemble);
    }
    initTable(city_arr);

}
//fetch raw data
async function fetchRaw(url) {
    console.log(">>FRE<< " + url);
    const response = await fetch(url);
    const weathers = await response.json();
    return weathers;
}
//city factory
function createCity(cityname, temperature, precipitation, precipitation_type, wind_speed, wind_dirs, cloud_coverage, time) {
    let city = Object.create(cityFuncs);
    city.name = cityname;
    city.temp = temperature;
    city.perc = precipitation;
    city.perc_type = precipitation_type;
    city.ws = wind_speed;
    city.ws_dir = wind_dirs;
    city.cc = cloud_coverage;
    city.tm = time;
    showcity(city);
    return city;
}
function showcity(city) {
    //console.log(">>FRE<< " + city.name + " | " + city.tm); //+ " | " + city.temp + " | " + city.perc + " | " + city.perc_type + " | " + city.ws + " | " + city.ws_dir + " | " + city.cc + " | " 
}
var cityFuncs = {
    getName() {
        return this.name;
    },
    getTemp() {
        return this.temp;
    },
    getPerc() {
        return this.perc;
    },
    getPerc_type() {
        return this.perc_type;
    },
    getWs() {
        return this.ws;
    },
    getWs_dir() {
        return this.ws_dir;
    },
    getCc() {
        return this.cc;
    },
    getTime() {
        return this.tm;
    }
}
