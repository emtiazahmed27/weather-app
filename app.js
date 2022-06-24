//getting elements
const wrapper=document.querySelector(".wrapper");
const inputPart=wrapper.querySelector(".input-part");
const infoText=inputPart.querySelector(".info-txt");
const inputField=document.querySelector("input");
const locatonBtn=document.querySelector(".btn");
const weatherPart=document.querySelector(".weather-part");
const wIcon=document.querySelector(".weather-icon img");
const arrow=document.querySelector("header i");

let api;

//first we have to make an api call/request
inputField.addEventListener("keyup", (e)=>{
    //if user pressed Enter and input value is not empty
    if( e.key == "Enter" && inputField.value!=""){
        requestApi(inputField.value);
        inputPart.style.display="block";
        arrow.style.display="block"
    }
})

//api request function
function requestApi(city){
    api= `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5117edc8c3fd90a7fc6a3fd708e5688f&units=metric`;
   fetchData();
   //calling fetch-function to feetch data
}

//data-fetching function
function fetchData(){
    infoText.innerText="Getting weather details..."
    infoText.classList.add("pending");
    //getting api response and returning it with parsing into js obj and in another
    //then function calling weatherDetails function with passing api reult as an arguments as an argument
    fetch(api).then(response => response.json()).then(reult => weatherDetails(reult));
}

locatonBtn.addEventListener("click",()=>{
    infoText.innerText="Getting weather details...";
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    }else{
        alert("Your browser does not support geolocation api")
    }
})

function onSuccess(position){
    const {latitude,longitude} = position.coords;
    //getting latitude and longitude of the user device from coords object
     api=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=5117edc8c3fd90a7fc6a3fd708e5688f&units=metric`;
     fetchData();
     inputPart.style.display="none";
     arrow.style.display="block";
     console.log(latitude,longitude);
}

function onError(error){
   infoText.innerText=error.message;
   infoText.classList.add("error");
}

//weather app
function weatherDetails(info){
    // infoText.classList.replace("pending", "error");
    if(info.cod=="404"){
        infoText.innerText=`${inputField.value} isn't valid city name`;
        infoText.classList.replace("pending", "error");
        inputPart.style.display="block";
    }else{
        const city=info.name;
        const country=info.sys.country;
        const {id}=info.weather[0];
        const {feels_like, humidity,temp}=info.main;

        //icon changing
        if(id ==800){
            wIcon.src="images/clear.svg";
        }else if(id >=200 && id<= 232){
            wIcon.src="images/strom.svg";
        }else if(id >=600 && id<= 622){
            wIcon.src="images/snow.svg";
        }else if(id >=700 && id<= 781){
            wIcon.src="images/haze.svg";
        }else if(id >=801 && id<= 804){
            wIcon.src="images/cloud.svg";
        }else if(id >=300 && id<= 321){
            wIcon.src="images/clear.svg";
        }

        wrapper.querySelector(".temp .numb").innerText=Math.floor(temp);
        wrapper.querySelector(".location span").innerText=`${city},${country}`;
        wrapper.querySelector(".temp .numb-2").innerText=Math.floor(feels_like);
        wrapper.querySelector(".humidity .humi").innerText=`${humidity}%`;

        infoText.style.display="none";
        weatherPart.style.display="block"
        // console.log(info);
    }   
}

//arrow-btn function
arrow.addEventListener("click", ()=>{
    weatherPart.style.display="none";
    infoText.style.display="block";
    infoText.classList.remove("pending", "error");
    infoText.innerText="Please enter a valid city name";
    inputPart.style.display="block";
    
    inputField.value="";
    arrow.style.display="none";
    // document.location.reload();
})