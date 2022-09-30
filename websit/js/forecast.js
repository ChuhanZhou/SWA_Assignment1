var host = 'http://localhost:8080/'
var api_type = "forecast"
var selectCity;
var city;
const city_arr = [];
$(document).ready(function () {
    selectCity = document.getElementById('selectCity');
    city = selectCity.value;
    updateData();
});

$(document).ready(function () {
    $("#selectCity").change(function () {
        city = selectCity.value;
        console.log("[select city] " + city);
        updateData();
    });
});

function updateData() {
    getWeatherInfo();
    //getDataByCity();
}

function getDataByCity() {
    console.log(">>FRE<< create city " + city);
    createCity(city, [1, 3], [12, 23], "prec", [34, 45], "east", [56, 67], "2022")
}

//objs
//get city
async function getWeatherInfo() {
    var city_url = "/" + city
    url = host + api_type + city_url
    var temp_arr = [];
    var prec_arr = [];
    var prec_type_arr = [];
    var ws_arr = [];
    var ws_dir_arr = [];
    var cc_arr = [];
    var time_arr = [];
    var real_time = [];
    await fetchRaw(url).then(weathers => {
        weathers.forEach(weather => {
            let raw_t = weather.time
            let date = raw_t.split("T")[0]
            let time = raw_t.split("T")[1].split(".")[0]
            let timepac = [date,time]
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
    console.log(">>FRE<< " + city.name + " | " + city.tm); //+ " | " + city.temp + " | " + city.perc + " | " + city.perc_type + " | " + city.ws + " | " + city.ws_dir + " | " + city.cc + " | " 
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
