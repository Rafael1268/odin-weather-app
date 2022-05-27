import "./style.css";
import { renderPage } from "./render.js";

const { add, parseISO, isSameDay } = require("date-fns");

let data;
let day1 = [];
let day2 = [];
let day3 = [];
let day4 = [];
let day5 = [];
let unit = 'metric';
let lastSearch = '';
let selectedDay = '';

document.querySelector('#toggleUnits').addEventListener('click', () => toggleUnits());
document.querySelector('#searchBar').addEventListener('keydown', () => {
  if (event.key === 'Enter') {
    getData(event.target.value);
    event.target.value = '';
  };
});
document.querySelector('#day1').addEventListener('click', () => {
  selectedDay = 'day1';
  if (lastSearch === '') return; 
  renderPage(data, day1, unit, [day1, day2, day3, day4, day5]);
});
document.querySelector('#day2').addEventListener('click', () => {
  selectedDay = 'day2';
  if (lastSearch === '') return; 
  renderPage(data, day2, unit, [day1, day2, day3, day4, day5]);
});
document.querySelector('#day3').addEventListener('click', () => {
  selectedDay = 'day3';
  if (lastSearch === '') return; 
  renderPage(data, day3, unit, [day1, day2, day3, day4, day5]);
});
document.querySelector('#day4').addEventListener('click', () => {
  selectedDay = 'day4';
  if (lastSearch === '') return; 
  renderPage(data, day4, unit, [day1, day2, day3, day4, day5]);
});
document.querySelector('#day5').addEventListener('click', () => {
  selectedDay = 'day5';
  if (lastSearch === '') return; 
  renderPage(data, day5, unit, [day1, day2, day3, day4, day5]);
});

async function getWeather(city) {
  try {
    const cityCords = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=4467607ba20a15e6c87ad7f913c73842`);
    const data = await cityCords.json();
    const weather = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appid=4467607ba20a15e6c87ad7f913c73842&units=${unit}`)
    const result = await weather.json();
    return result;
  } catch (err) {
    console.log(err);
    alert('City not found!');
    return;
  };
};

function getData(city) {
  lastSearch = city;
  getWeather(city).then(result => {
    data = result;
    const dates = getDates();
    seperateDates(dates);
    let wDay;
    switch (selectedDay) {
      case 'day1':
        wDay = day1;
        break;
      case 'day2':
        wDay = day2;
        break;
      case 'day3':
        wDay = day3;
        break;
      case 'day4':
        wDay = day4;
        break;
      case 'day5':
        wDay = day5;
        break;
      default:
        wDay = day1;
        break;
    };
    renderPage(data, wDay, unit, [day1, day2, day3, day4, day5]);
  });
};

function getDates() {
  const day1 = parseISO(data.list[0].dt_txt);
  const day2 = add(day1, { days: 1 });
  const day3 = add(day2, { days: 1 });
  const day4 = add(day3, { days: 1 });
  const day5 = add(day4, { days: 1 });
  return [day1, day2, day3, day4, day5];
};

function seperateDates(dates) {
  day1 = [];
  day2 = [];
  day3 = [];
  day4 = [];
  day5 = [];
  data.list.forEach(d => {
    const date = parseISO(d.dt_txt);
    if (isSameDay(date, dates[0])) {
      day1.push(d);
    } else if (isSameDay(date, dates[1])) {
      day2.push(d);
    } else if (isSameDay(date, dates[2])) {
      day3.push(d);
    } else if (isSameDay(date, dates[3])) {
      day4.push(d);
    } else if (isSameDay(date, dates[4])) {
      day5.push(d);
    };
  });
};

function toggleUnits() {
  const unitBtn = document.querySelector('#toggleUnits');
  if (unit === 'metric') {
    unit = 'imperial';
    unitBtn.innerText = 'Imperial';
  } else {
    unit = 'metric';
    unitBtn.innerText = 'Metric';
  };
  if (lastSearch === '') {
    return;
  } else {
    getData(lastSearch);
  }
};