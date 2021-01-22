var api_key = "752b41def39260e71140c4018e9a0f11";
var cityName;
var queryURL;
var arrayOfCities = [];


$(document).ready(function() {

    startUp();

//will update the page with local storage on startup
function startUp(){
    if (cityName == null)   {
        cityName = "raleigh";
    }
    cityName = localStorage.getItem('starter-city');
    queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + api_key;

    updateForecast(); 
    fiveDaySchedule();
}

//when search button is clicked it searchs for the city in the list
$("#city-button").on("click", function() {
    
    cityName = $("#search-city").val();
    queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + api_key;

    updateForecast(); 
    fiveDaySchedule();
    updateCitiesList();
    
});

//when an item on the unordered list is clicked it will search the city
$("ul").on("click", "li", function() {

    cityName = $(this).text();
    console.log(this);
    queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + api_key;

    updateForecast();
    fiveDaySchedule();
    updateCitiesList();

});

//function that updates the list of cities on the list on the left. Limiting it to 8 since I dont want too many
function updateCitiesList () {
    //if statement that checks if the city name is already in the list. If it is it will be removed to be put back into the list at the top after.
    if (arrayOfCities.includes(cityName.toLowerCase())) {
        var index = arrayOfCities.indexOf(cityName);
        arrayOfCities.splice(index, 1);
    }
    arrayOfCities.unshift(cityName.toLowerCase()); //adds the new city to front of the list
    $(".list-of-cities").empty(); //empties list as a whole for elements to be added back when iterating through the loop
    //if there are more than 8 on the list they will be removed from bottom
    while (arrayOfCities.length > 8) {
        arrayOfCities.pop();
    }
    //for loop for adding and appending cities to searched list on the left side
    for (var i = 0; i < arrayOfCities.length; i++) {
        var newCity = document.createElement("li");
        newCity.classList += "city-in-list list-group-item";
        newCity.id = "city-number" + i;
        document.getElementById("unordered-list-cities").appendChild(newCity);
        $("#"+newCity.id).append(arrayOfCities[i]);
    }
    localStorage.setItem('starter-city', cityName); //saving latest city to local storage
    
}

//updates the forecast on the top right side of the screen with data pulled from 2 APIs
function updateForecast () {
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(pageInfo) {
        var temperature = pageInfo.main.temp;
        var humid = pageInfo.main.humidity;
        var windSpd = pageInfo.wind.speed;
        var long = pageInfo.coord.lon;
        var lati = pageInfo.coord.lat; 
        var nameOfCity = pageInfo.name;

        //adding variables to HTML
        $(".temperature").empty();
        $(".temperature").append("Temperature: " + temperature + " °F");
        $(".humidity").empty();
        $(".humidity").append("Humidity: " + humid + "%");
        $(".wind-speed").empty();
        $(".wind-speed").append("Wind Speed: " + windSpd + " MPH");

        //building url for second api
        var queryURLuV = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lati + "&lon=" + long + "&appid=752b41def39260e71140c4018e9a0f11"

        $.ajax({
            url: queryURLuV,
            method: "GET"
        }).then(function(pageInfo2) {
            var uV = pageInfo2.value;
            var dateInfo = pageInfo2.date_iso
            var imgOfIcon = pageInfo.weather[0].icon;

            var help = dateInfo.split("-");
            var uvId = document.getElementById("uv-index");

            //else if tree to make sure correct color is displayed. The graphic I got on google images said: <=2 then low, 2-7 med/high, 7+ is severe
            if (uV <= 2)    {
                $("#uv-index").empty();
                $("#uv-index").removeClass();
                $("#uv-index").append("UV Index: "+ uV);
                uvId.classList.add("uv-low");
            } else if (uV > 2 && uV <= 7)    {
                $("#uv-index").empty();
                $("#uv-index").removeClass();
                $("#uv-index").append("UV Index: "+ uV);
                uvId.classList.add("uv-moderate");
            } else if (uV > 7)  {
                $("#uv-index").empty();
                $("#uv-index").removeClass();
                $("#uv-index").append("UV Index: "+ uV);
                uvId.classList.add("uv-high");
            } else {
                $("#uv-index").empty();
                $("#uv-index").removeClass();
                $("#uv-index").append("UV Index: could not be found");
            }


            var fullNameTitle = nameOfCity + " (" + help[1] + "/"+help[2].charAt(0) + help[2].charAt(1)+"/"+help[0]+")";

            $(".city-name").empty();
            $(".city-name").append(fullNameTitle);

            var imgText = "http://openweathermap.org/img/wn/" +imgOfIcon + "@2x.png";

            $(".image-of-weather").attr("src", imgText);





            

        });
    });
}

//function for building the 5 day schedule using a seperate api that had to be iterated through due to it being every 3 hours
function fiveDaySchedule () {
    var urlFiveDay = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + api_key;
    $.ajax({
        url: urlFiveDay,
        method: "GET"
    }).then(function(pageInfo) {

        //removing old blocks
        for (var i = 1; i <6; i++) {
            $("#daily-block"+i).remove();
        }
        
        //for loop for adding in new blocks
        for (var i = 1; i <6; i++) {

            //all of the variables for the week

            var dateOfWeather =pageInfo.list[8*i-1].dt_txt;
            dateElements = dateOfWeather.split("-");
            finalDate = "("+dateElements[1]+"/"+dateElements[2].charAt(0)+dateElements[2].charAt(1)+"/"+dateElements[0]+")";

            var imgOfIcon = pageInfo.list[(8*i-1)].weather[0].icon;
            var temperature = pageInfo.list[(8*i-1)].main.temp;
            var humid = pageInfo.list[(8*i-1)].main.humidity;

            //making new div to store all in

            var newDiv = document.createElement("div");
            newDiv.classList.add("five-day-block");
            newDiv.id = "daily-block" + i;
            document.getElementById("five-day-append").appendChild(newDiv);

            //Making the elements for the individual boxes

            var newDate = document.createElement("h5");
            newDate.classList += "date-block";
            newDate.id = "date-block" + i;
            document.getElementById(newDiv.id).appendChild(newDate);
            $("#"+newDate.id).append(finalDate);

            var newIcon = document.createElement("img");
            newIcon.classList += "weather-icon";
            newIcon.id = "weather-icon" + i;
            document.getElementById(newDiv.id).appendChild(newIcon);
            $("#"+newIcon.id).attr("src", "http://openweathermap.org/img/wn/" +imgOfIcon + "@2x.png");

            var newTemp = document.createElement("p");
            newTemp.classList += "temp-block";
            newTemp.id = "temp-block" + i;
            document.getElementById(newDiv.id).appendChild(newTemp);
            $("#"+newTemp.id).append("Temperature: " +temperature+" °F");

            var newHum = document.createElement("p");
            newHum.classList += "hum-block";
            newHum.id = "hum-block" + i;
            document.getElementById(newDiv.id).appendChild(newHum);
            $("#"+newHum.id).append("Humidity: " +humid + "%");

            
        }
    });
}

});