const ROAST_DEGREE = 1;
const BOTTOM_INTERVAL = 50;
const TOP_INTERVAL = 700;
const ROAST_CHECK_INTERVAL = 100;
const INITIAL_STEAK_COLOR = [255, 195, 201];

const steak = document.getElementById("steak");
const heat = document.getElementById("heat");
const startButton = document.getElementById("start");
const rotateButton = document.getElementById("rotate");
const removeButton = document.getElementById("remove");
const rawInfo = document.getElementById("raw");
const doneInfo = document.getElementById("done");
const burntInfo = document.getElementById("burnt");
const gameTitle = document.querySelector(".title");

let raw = 0;
let done = 0;
let burnt = 0;

const setCSSVariable = (name, rgbColor) => {
  document.documentElement.style.setProperty(
    `--${name}`,
    `rgb(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]})`
  );
};

const colorIsBlack = rgbColor => rgbColor.every(colorValue => colorValue === 0);

const clearIntervals = intervalsArray => {
  intervalsArray.forEach(interval => clearInterval(interval));
};

const setBeforeStartStyle = () => {
  startButton.style.display = "block";
  rotateButton.style.display = "none";
  removeButton.style.display = "none";
  steak.style.opacity = 0;
  heat.style.display = "none";
};

const setAfterStartStyle = () => {
  steak.style.opacity = 1;
  heat.style.display = "block";
  startButton.style.display = "none";
  rotateButton.style.display = "block";
  removeButton.style.display = "block";
};

class Grill {
  constructor() {
    Object.keys(this.colors).map(key => {
      setCSSVariable(key, this.colors[key]);
    });

    startButton.addEventListener("click", () => {
      this.startRoasting();
      this.startTimer();
      setAfterStartStyle();
    });

    rotateButton.addEventListener("click", () => {
      const temp = this.colors.color1;
      this.colors.color1 = this.colors.color2;
      this.colors.color2 = temp;
    });

    removeButton.addEventListener("click", () => {
      const firstRgb = this.colors.color1[0];
      const secondRgb = this.colors.color2[0];
      const intervalsToStop = [
        this.roastCheckInterval,
        this.interval1,
        this.interval2
      ];

      if (
        firstRgb < 255 &&
        firstRgb > 200 &&
        secondRgb < 255 &&
        secondRgb > 200
      ) {
        clearIntervals(intervalsToStop);
        raw++;
        rawInfo.textContent = raw;
        setBeforeStartStyle();
      } else if (
        firstRgb < 200 &&
        firstRgb > 60 &&
        secondRgb < 200 &&
        secondRgb > 60
      ) {
        clearIntervals(intervalsToStop);
        done++;
        doneInfo.textContent = done;
        setBeforeStartStyle();
      } else {
        clearIntervals(intervalsToStop);
        burnt++;
        burntInfo.textContent = burnt;
        setBeforeStartStyle();
      }
      this.colors.color1 = INITIAL_STEAK_COLOR;
      this.colors.color2 = INITIAL_STEAK_COLOR;
    });
  }

  colors = {
    color1: INITIAL_STEAK_COLOR,
    color2: INITIAL_STEAK_COLOR
  };

  names = ["color1", "color2"];

  darken = nameIndex => {
    const variableName = this.names[nameIndex]; // 'color1' or 'color2'
    this.colors[variableName] = this.colors[variableName].map(colorValue => {
      const newRoastDegree = colorValue - ROAST_DEGREE;
      return newRoastDegree < 0 ? 0 : newRoastDegree;
    });
    setCSSVariable(variableName, this.colors[variableName]);
  };

  startTimer = () => {
    this.roastCheckInterval = setInterval(() => {
      const isBlack = Object.keys(this.colors).every(key =>
        colorIsBlack(this.colors[key])
      );

      if (isBlack) {
        clearInterval(this.roastCheckInterval);
        burnt++;
        burntInfo.textContent = burnt;
        setBeforeStartStyle();
      }
    }, ROAST_CHECK_INTERVAL);
  };

  startRoasting = () => {
    const gameOver = () => {
      burnt++;
      burntInfo.textContent = burnt;
      clearIntervals([this.interval1, this.interval2, this.roastCheckInterval]);
      setBeforeStartStyle();
    };

    this.interval1 = setInterval(() => {
      this.darken(0);
      const rgbColor = this.colors[this.names[0]];

      if (colorIsBlack(rgbColor)) {
        gameOver();
      }
    }, TOP_INTERVAL);

    this.interval2 = setInterval(() => {
      this.darken(1);
      const rgbColor = this.colors[this.names[1]];

      if (colorIsBlack(rgbColor)) {
        gameOver();
      }
    }, BOTTOM_INTERVAL);
  };
}

new Grill();
