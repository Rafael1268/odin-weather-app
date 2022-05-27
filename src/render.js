import { format, fromUnixTime, parseISO } from "date-fns";
import { averageTemp, averageWind } from "./calculations";

function renderPage(data, day, unit, days) {
  document.querySelector('#ID1').innerText = data.city.name;
  const date1 = parseISO(data.list[0].dt_txt);
  document.querySelector('#ID2').innerText = format(date1, "EEEE, do MMM");
  const temp = averageTemp(day);
  document.querySelector('#ID3').innerHTML = `${Math.round(temp)}<span>&#176;</span>`;
  document.querySelector('#ID4').innerText = data.list[0].weather[0].description;
  document.querySelector('#ID5').innerText = format(fromUnixTime(data.city.sunrise), "HH:mmaa");
  document.querySelector('#ID6').innerText = format(fromUnixTime(data.city.sunset), "HH:mmaa");
  const windSpeed = (Math.round(averageWind(day) * 100)) / 100;
  if (unit === 'metric') {
    document.querySelector('#ID7').innerText = `${windSpeed}KMH`
  } else {
    document.querySelector('#ID7').innerText = `${windSpeed}MPH`
  };
  const mainBottom = document.querySelector('.mainBottom');
  mainBottom.childNodes.forEach(child => {
    child.children[0].innerText = 'No Data';
    child.children[1].src = '';
    child.children[2].innerHTML = '';
  });
  let num = 9 - day.length;
  day.forEach(d => {
    const div = document.querySelector(`#div${num}`);
    const time = parseISO(d.dt_txt);
    div.children[0].innerText = format(time, "HH aa");
    div.children[1].src = `img/${d.weather[0].main}.png`;
    div.children[2].innerHTML = `${Math.round(d.main.temp)}<span>&#176;</span>`;
    num++;
  });

  let num1 = 1;
  days.forEach(d => {
    const dayDiv = document.querySelector(`#day${num1}`).childNodes;
    dayDiv[0].childNodes[0].innerText = format(parseISO(d[0].dt_txt), "MMM do");
    const temp2 = averageTemp(d);
    dayDiv[0].childNodes[1].innerHTML = `${Math.round(temp2)}<span>&#176;</span>`;
    num1++;
  });
};

export { renderPage };