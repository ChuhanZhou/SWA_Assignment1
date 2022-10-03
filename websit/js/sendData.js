var place,placeName;
var temVal,temValue;
var preVal,preValue;
var preType,preTypeName;
var wsVal,wsValue;
var direction,directionName;
var ccVal,ccValue;
var date,datePicker;
var time,timePicker;
var temArray;
var preArray;
var wsArray;
var ccArray;


$(document).ready(function(){
    placeName = document.getElementById('city');
    temValue = document.getElementById('temValue');
    preValue = document.getElementById('preValue');
    preTypeName =document.getElementById('preType');
    wsValue = document.getElementById('wsValue');
    directionName = document.getElementById('direction');
    ccValue = document.getElementById('ccValue');
    datePicker = document.getElementById('date');
    timePicker = document.getElementById('time');

    var infoList1 = [temValue,preValue,wsValue,ccValue];
    var infoList2 = [preTypeName,directionName];

    for(var i=0;i<infoList1.length;i++)
    {
      if(infoList1[i].value==null||infoList1[i].value=="")
      {
        infoList1[i].value = 0;
      }
    }

    for(var i=0;i<infoList2.length;i++)
    {
      if(infoList2[i].value==null||infoList2[i].value=="")
      {
        infoList2[i].value = "none";
      }
    }

    var now = new Date();
    if(datePicker.value==null||datePicker.value=="")
    {
        
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        var today = now.getFullYear() + "-" + (month) + "-" + (day);
        $('#date').val(today);
        datePicker.value = today;
    }

    if(timePicker.value==null||timePicker.value=="")
    {
        var hhss = now.toLocaleTimeString();
        $('#time').val(hhss);
        timePicker.value = hhss;
    }
   
});


function sendData() {
    
    place = placeName.value;
    temVal = parseInt(temValue.value);
    preVal = parseInt(preValue.value);
    preType = preTypeName.value;
    wsVal = parseInt(wsValue.value);
    direction = directionName.value;
    ccVal = parseInt(ccValue.value);
    date = datePicker.value;
    time = timePicker.value;
    console.log("DATETIME BELOW>>>>")
    var d = date +"T"+time;
    console.log("DATETIME HERE>>>>"+d)
    var datetime = new Date(Date.parse(d));
    datetime = datetime.toISOString();


    temArray = {"type": "temperature",
    "time": datetime,
    "place": place,
    "value": temVal,
    "unit": "C"};

    preArray = {"type": "precipitation",
    "time": datetime,
    "place": place,
    "value": preVal,
    "unit": "mm",
    "precipitation_type":preType};

    wsArray = {"type": "wind speed",
    "time": datetime,
    "place": place,
    "value": wsVal,
    "unit": "m/s",
    "direction": direction};

    ccArray = {"type": "cloud coverage",
    "time": datetime,
    "place": place,
    "value": ccVal,
    "unit": "%"}; 

    
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
          }
        };

        temArray = JSON.stringify(temArray);
        preArray = JSON.stringify(preArray);
        wsArray = JSON.stringify(wsArray);
        ccArray = JSON.stringify(ccArray);

        var list = new Array();
        list.push(temArray);
        list.push(preArray);
        list.push(wsArray);
        list.push(ccArray);
       
        //xhttp.responseType = 'json';

        for(var i = 0; i<list.length;i++)
        {
            xhttp.open("POST", "http://localhost:8080/data", false);
            xhttp.setRequestHeader( "Content-Type", "application/json");
            xhttp.send(list[i]);
        }
  
        xhttp.onload = function() {
            let responseObj = xhttp.response;
            console.log(responseObj.message); 
          };
    
          alert("success!!!");
    
    
  }