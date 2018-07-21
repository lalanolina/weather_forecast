'use strict';

const baseURL = 'https://api.weatherbit.io/v2.0/forecast/daily';
const apiKey = '911fda3e9c6a41de9dc8661b8753df18';
const weekdays = {
	'0': 'Dom',
	'1': 'Seg',
	'2': 'Ter',
	'3': 'Qua',
	'4': 'Qui',
	'5': 'Sex',
	'6': 'Sáb'
	};
	
let unit = '°C';
let city ='São Paulo'
getForecast('São Paulo');

$('#search').click(function(event){
	event.preventDefault();
	const newCity = $('#city').val();
	city = newCity;
	getForecast(city);
	
});

//função que é utilizada para selecionar se a unidade de temperatura deseja está em celsius ou fahrenheit
$('#myonoffswitch').on('change',function(event) {
	if (unit === '°F'){
	unit = '°C';
	}
	else{ 
		unit = '°F';
	}
	console.log(unit);	
	getForecast(city);
});

//função que conecta ao API e monta a previsão do tempo (d0 e dias futuros)
function getForecast(city) {
	$('#loader').css('display', '');
	$('#forecast').css('display', 'none');
	
	clearFields();
	$.ajax({
		url: baseURL,
		data: {
			key: apiKey,
			city: city,
			lang: 'pt'
		},
		success: function(result){
			$('#loader').css('display', 'none');
			$('#forecast').css('display', '');
			$('#city-name').text(result.city_name);	
			const forecast = result.data;
			const today = forecast[0];
			displayToday(today);
			const nextDays = forecast.slice(1);
			displayNextDays(nextDays);			
		},
		error:function(error){
			console.log(error.responseText);
		}
	});
}

//função para zerar os campos da previsão de tempo dos próximos dias 
function clearFields() {
	$('#next-days').empty();
}

//função que exibe o dia atual
function displayToday(today){
	const temperature = convert(today.temp);
	const windSpeed = Math.round(today.wind_spd);
	const humidity = today.rh;
	const weather = today.weather.description;	
	const icon = today.weather.icon;
	const iconURL = `https://www.weatherbit.io/static/img/icons/${icon}.png`;

	$('#current-temperature').text(temperature);
	$('#current-wind').text(windSpeed);
	$('#current-humidity').text(humidity);
	$('#current-weather').text(weather);
	$('#weather-icon').attr('src',iconURL);
	$('#current-unit').text(unit);
}

//função que exibe os dias seguintes
function displayNextDays(nextDays){
	for(let i=0; i<nextDays.length; i=i+1){
		const day = nextDays[i];
		const min = convert(day.min_temp);
		const max = convert(day.max_temp);
		const date = new Date(day.valid_date);
		const weekday = weekdays[date.getUTCDay()];
		
		const card = $(
			`<div class="day-card">
				<div class="date">${date.getUTCDate()}/${date.getUTCMonth() + 1}</div>
				<div class="weekday">${weekday}</div>
				<span class="max">${min}</span>
				<span class="unit">${unit}</span>
				<span class="min">${max}</span>
				<span class="unit">${unit}</span>
			</div>`);
		card.appendTo('#next-days');
	}
	
}

//função que converte o valor de uma temperatura de celsius para fahrenheit
    function convert(temperature) {
      if (unit === '°C'){
	  return Math.round(temperature);
	  }
	  else{
	  return Math.round(1.8 * temperature + 32);
	  }
    }
