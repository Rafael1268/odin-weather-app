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

document.querySelector('#toggleUnits').addEventListener('click', () => toggleUnits());
document.querySelector('#searchBar').addEventListener('keydown', () => {
  if (event.key === 'Enter') {
    getData(event.target.value);
    event.target.value = '';
  };
});

async function getWeather(city) {
  try {
    const cityCords = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=4467607ba20a15e6c87ad7f913c73842`);
    const data = await cityCords.json();
    const weather = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appid=4467607ba20a15e6c87ad7f913c73842&units=${unit}`)
    const result = await weather.json();
    return result;
  } catch (err) {
    console.log(err);
  };
};

function getData(city) {
  lastSearch = city;
  getWeather(city).then(result => {
    data = result;
    const dates = getDates();
    seperateDates(dates);
    renderPage(data, day1, unit, [day1, day2, day3, day4, day5]);
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
  const searchBar = document.querySelector('#searchBar');
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
  };
};