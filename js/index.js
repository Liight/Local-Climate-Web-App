// Declare API Key & Required Variables
var appID = "121dd847b22a15c0f735b3e0899c8e5b";
var lat, lon, units, weatherAPICall;
var currentCountryCode;
var yPos = $(window).height() / 7;

// Buttons to change units
$("#celsius").click(function() {
  $("#farenheight").removeClass("btn-primary");
  $(this).addClass("btn-primary");
  units = "metric";
  getWeatherData(false, "metric");
});
$("#farenheight").click(function() {
  $("#celsius").removeClass("btn-primary");
  $(this).addClass("btn-primary");
  units = "imperial";
  getWeatherData(false, "imperial");
});

// Main Function to Get The Weather Data
function getWeatherData(x, u) {
  // Get the geolocation
  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(function(position) {
      // Get & Declare Local Co-ordinates
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      // Access GeoNames API to get Country Code
      $.getJSON('https://ws.geonames.org/countryCode', {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        type: 'JSON',
        username: 'Liiight'
      }, function(result) {
        currentCountryCode = result.countryCode;
      });
      // Get Appropriate Units For Country
      function getUnits() {
          var imperialCountryCodes = ['BS', 'BZ', 'KY', 'PW', 'US'];
          if (imperialCountryCodes.indexOf(currentCountryCode) === -1) {
            units = "metric";
            $("#celsius").addClass("btn-primary");
          } else {
            units = "imperial"
            $("#farenheight").addClass("btn-primary");
          }
        }
        // If Not Requested By Switch, get Country Units 
      if (x === true) {
        getUnits();
      } else {
        units = u;
      }
      //Call Open Weather Map API with local position & appropriate units of measurement
      weatherAPICall = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=" + units + "&APPID=" + appID;
      $.get(weatherAPICall, function(weather) {
        // Declare Usefull Variables
        var location = weather.name;
        var country = weather.sys.country;
        var windDir = weather.wind.deg;
        var windSpeed = weather.wind.speed;
        var temperature = weather.main.temp;
        var conditions = weather.weather[0].id;
        var conditionsText = weather.weather[0].main;
        var descriptionText = weather.weather[0].description;
        var humidity = weather.main.humidity;
        var pressure = weather.main.pressure;
        var lat = weather.coord.lat;
        var lon = weather.coord.lon;
        var sunrise = weather.sys.sunrise;
        var sunset = weather.sys.sunset;
        var bg, windSpeedUnit, tempUnit;

        // Assign appropriate Unit reference
        if (units === "metric") {
          windSpeedUnit = windSpeed + " m/s";
          //tempUnit = temperature + " C"
        } else if (units === "imperial") {
          windSpeedUnit = windSpeed + " ft/s"
            //tempUnit = temperature + " F";
        }

        // Get Appropriate Weather icons
        function getImg(x, y) {
          var i;
          if (x >= 200 && x <= 232) {
            i = "<img src='http://openweathermap.org/img/w/11d.png'/>"; // 200 - 232 Group 2xx: Thunderstorm
            bg = "http://oi66.tinypic.com/263bjer.jpg";
          } else if (x >= 300 && x <= 321) {
            i = "<img src='http://openweathermap.org/img/w/09d.png'/>"; // 300 - 321 Group 3xx: Drizzle
            bg = "http://oi66.tinypic.com/33kre2v.jpg";
          } else if (x >= 500 && x <= 531) {
            i = "<img src='http://openweathermap.org/img/w/10d.png'/>"; // 500 - 531 Group 5xx: Rain
            bg = "http://oi63.tinypic.com/2i9qclc.jpg";
          } else if (x >= 600 && x <= 622) {
            i = "<img src='http://openweathermap.org/img/w/13d.png'/>"; // 600 - 622 Group 6xx: Snow
            bg = "http://oi66.tinypic.com/3329hza.jpg";
          } else if (x >= 701 && x <= 781) {
            i = "<img src='http://openweathermap.org/img/w/50d.png'/>"; // 701 - 781 Group 7xx: Atmosphere
          } else if (x === 800) {
            i = "<img src='http://openweathermap.org/img/w/01d.png'/>"; // 800       Group 800: Clear
            bg = "http://oi68.tinypic.com/5d5gdt.jpg";
          } else if (x >= 801 && x <= 804) {
            i = "<img src='http://openweathermap.org/img/w/03d.png'/>"; // 801 - 804 Group 80x: Clouds
            bg = "http://oi65.tinypic.com/2rmmbl2.jpg";
          }
          //var x = "<img src='http://openweathermap.org/img/w/11d.png'/>"; // 900 - 906 Group 90x: Extreme
          //var x = "<img src='http://openweathermap.org/img/w/11d.png'/>"; // 951 - 962 Group 9xx: Additional
          if (x === conditions && y === false) {
            return i;
          } else {
            return bg
          }
        }

        // Create a new JavaScript Date object based on the unix_Timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds. (javascript deals in milliseconds)
        function unixTimeStampConverter(unix_timestamp) {
          var date = new Date(unix_timestamp * 1000);
          // Hours part from the timestamp
          var hours = date.getHours();
          // Minutes part from the timestamp
          var minutes = "0" + date.getMinutes();

          // Display local time if required
          if (unix_timestamp === "now") {
            var currentdate = new Date();
            if (currentdate.getMinutes() < 10) {
              var datetime = currentdate.getHours() + ":0" + currentdate.getMinutes();
            } else {
              var datetime = currentdate.getHours() + ":" + currentdate.getMinutes();
            }
            return datetime;
          }

          // Will display time in 10:30 format
          var formattedTime = hours + ':' + minutes.substr(-2);
          return formattedTime;
        }
        // Convert time from Unix Time
        function getTime(x) {
          return unixTimeStampConverter(x);
        }

        //Get Wind direction from degrees
        function getWindDirection(windDir) {
          var wd = windDir;
          if (wd >= 345 && wd <= 15) {
            return "N";
          } else if (wd >= 15 && wd <= 45) {
            return "N, NE";
          } else if (wd >= 45 && wd <= 75) {
            return "NE, N";
          } else if (wd >= 75 && wd <= 105) {
            return "E";
          } else if (wd >= 105 && wd <= 135) {
            return "E, SE";
          } else if (wd >= 135 && wd <= 165) {
            return "SE, E";
          } else if (wd >= 165 && wd <= 195) {
            return "S";
          } else if (wd >= 195 && wd <= 225) {
            return "S, SW";
          } else if (wd >= 225 && wd <= 255) {
            return "W, SW";
          } else if (wd >= 255 && wd <= 285) {
            return "W";
          } else if (wd >= 285 && wd <= 315) {
            return "W, NW";
          } else if (wd >= 315 && wd <= 345) {
            return "N, NW";
          }
        }
        // Dynamically populate the data onscreen
        $("#location").html("<h1><b>" + location + ", " + country + "</b></h1>" + "<br><p id=\"time\">" + getTime("now") + "</p>");
        $("#mainData").html("<span id=\"icon\">" + getImg(conditions, false) + "</span><br><span id=\"temp\">" + temperature + "&deg;</span><br><span id=\"conditions\"><span id=\"c\">" + conditionsText + "</span><br>" + windSpeedUnit + " wind direction " + getWindDirection(windDir) + "<br>Humidity: " + humidity + " %<br> Pressure: " + pressure + " hPa</span>");
        $("#map").html("latitude: " + lat + "<br>longitude: " + lon + "<br>Get a map here"); // use google maps api
        $(".background").css("background-image", "url(" + getImg(x, true) + "no-repeat"); // get the appropriate background
      })
    });
  } else {
    alert("Your browser does not support geolocation, consider updating your browser to use this feature");
  }
}
getWeatherData(true);