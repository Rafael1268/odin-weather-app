function averageTemp(d) {
  let num = 0;
  d.forEach(p => {
    num = num + p.main.temp;
  });
  return num / d.length;
};

function averageWind(d) {
  let num = 0;
  d.forEach(p => {
    num = num + p.wind.speed;
  });
  return num / d.length;
};

export { averageTemp, averageWind };