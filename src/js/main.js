/*global bootstrap, ClipboardJS*/

var requestId;

function ready(fn) {
  if (document.readyState != "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

function createTuneObj(tuneStr) {
  var tuneArr = tuneStr.trim().split(/\s+/);
  var tuneObj = Object();
  tuneObj.tempo = parseInt(tuneArr[0]);
  tuneObj.tune = [];
  tuneArr = tuneArr.splice(1);
  while (tuneArr.length > 0) {
    tuneObj.tune.push({
      frequency: parseInt(tuneArr[0]),
      duration: parseInt(tuneArr[1])
    });
    tuneArr = tuneArr.splice(2);
  }
  return tuneObj;
}

function calculateDuration(tuneObj) {
  var playlength = Number();
  for (var i = 0; i < tuneObj.tune.length; i++) {
    playlength += 1 / (tuneObj.tempo / 60) * tuneObj.tune[i].duration;
  }
  document.getElementById("notes").textContent = tuneObj.tune.length;
  document.getElementById("duration").textContent = Math.round(playlength * 1000) + "ms";
  document.getElementById("duration").title = (playlength % 1 == 0 ? playlength : playlength.toFixed(3)) + "s";
}

function play(tuneObj) {
  let audioCtx = new (window.AudioContext || window.webkitAudioContext)(),
    baseTime = audioCtx.currentTime,
    arrayLength = tuneObj.tune.length,
    playlength = 0,
    gainNode = audioCtx.createGain();
  for (var i = 0; i < arrayLength; i++) {
    let oscillator = audioCtx.createOscillator();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = 0.125;
    playlength = 1 / (tuneObj.tempo / 60) * tuneObj.tune[i].duration;
    oscillator.type = "square";
    oscillator.frequency.value = tuneObj.tune[i].frequency;
    if (i == arrayLength - 1) {
      oscillator.onended = () => {
        document.getElementById("tune-select").classList.remove("disabled");
        document.getElementById("tune-select").removeAttribute("disabled");
        document.getElementById("play").classList.remove("d-none");
        document.getElementById("stop").classList.add("d-none");
        cancelAnimationFrame(requestId);
      };
    }
    tuneObj.tune[i].oscillator = oscillator;
    oscillator.start(baseTime);
    oscillator.stop(baseTime + playlength);
    baseTime += playlength;
  }
  document.getElementById("stop").addEventListener("click", () => {
    for (let note of tuneObj.tune) {
      note.oscillator.stop();
    }
  }, {
    once: true
  });
}

function loadSelect() {
  const urlSearchParams = new URLSearchParams(window.location.search),
    params = Object.fromEntries(urlSearchParams.entries()),
    tuneParam = params["tune"];
  let data = [{
      title: "Default tune",
      tune: "480 440 1"
    }, {
      title: "Mario Coin FX",
      tune: "600 988 1 1319 4"
    }, {
      title: "Mario Bros Powerup FX",
      tune: "1750 523 1 392 1 523 1 659 1 784 1 1047 1 784 1 415 1 523 1 622 1 831 1 622 1 831 1 1046 1 1244 1 1661 1 1244 1 466 1 587 1 698 1 932 1 1175 1 1397 1 1865 1 1397 1"
    }, {
      title: "Mario Bros Music Intro",
      tune: "410 668 1 668 1 0 1 668 1 0 1 522 1 668 1 0 1 784 2 0 2 392 2"
    }, {
      title: "Imperial March 1st Verse",
      tune: "550 392 3 0 1 392 3 0 1 392 3 0 1 311 3 466 1 392 3 0 1 311 3 466 1 392 6 0 2 587 3 0 1 587 3 0 1 587 3 0 1 622 3 466 1 370 3 0 1 311 3 466 1 392 4"
    }, {
      title: "Close Encounters",
      tune: "400 880 2 988 2 783 2 392 2 587 3"
    }, {
      title: "Wolfestein 3D Music Intro",
      tune: "300 131 1 196 1 196 1 196 1 294 1 196 1 294 1 196 1 131 2"
    }, {
      title: "Joe Hisaishi's „One Summer Day“ OP chord",
      tune: "1536 349 3 698 1 523 2 784 1 1319 6"
    }],
    tuneInput = document.getElementById("tune-input"),
    tuneSelect = document.getElementById("tune-select");
  tuneSelect.remove(0);
  for (let item of data) {
    let option = document.createElement("option");
    option.textContent = item.title;
    option.value = item.tune;
    tuneSelect.appendChild(option);
  }
  let option = document.createElement("option");
  option.textContent = "URL custom input";
  option.id = "url-option";
  option.value = "";
  option.hidden = true;
  tuneSelect.appendChild(option);
  option = document.createElement("option");
  option.textContent = "Custom input";
  option.id = "custom-option";
  option.value = "";
  tuneSelect.appendChild(option);
  tuneSelect.removeAttribute("disabled");
  document.getElementById("tune-input").value = tuneSelect.value;
  if (tuneParam != undefined) {
    let urlCustomOption = document.getElementById("url-option");
    urlCustomOption.value = tuneParam;
    urlCustomOption.hidden = false;
    urlCustomOption.selected = true;
    tuneInput.readonly = false;
    tuneInput.value = tuneParam;
  }
}

function showWarningMessage(message) {
  document.getElementById("warning-alert").classList.remove("d-none");
  document.getElementById("tune-info").classList.add("d-none");
  document.getElementById("warning-alert-message").textContent = message;
  document.getElementById("play").classList.add("disabled");
  document.getElementById("play").setAttribute("disabled", "disabled");
}

function validateTuneInput(input) {
  let inputArray = input.trim().split(/\s+/),
    isAllNumbers = true,
    warningAlertContainer = document.getElementById("warning-alert"),
    tuneInfoContainer = document.getElementById("tune-info");
  for (let item of inputArray) {
    if (isNaN(item)) {
      isAllNumbers = false;
      break;
    }
  }
  if (input.length == 0) {
    showWarningMessage("Input at least one note.");
  } else if (!isAllNumbers) {
    showWarningMessage("Please enter only numbers.");
  } else {
    if (inputArray.length < 3) {
      showWarningMessage("Input at least one note.");
    } else if (inputArray.length >= 3 && inputArray.length % 2 == 0) {
      showWarningMessage("One more number to define a note.");
    } else {
      document.getElementById("play").classList.remove("disabled");
      document.getElementById("play").removeAttribute("disabled");
      warningAlertContainer.classList.add("d-none");
      tuneInfoContainer.classList.remove("d-none");
      calculateDuration(createTuneObj(input));
    }
  }
}

function addFormEvents() {
  let tuneSelect = document.getElementById("tune-select"),
    tuneInput = document.getElementById("tune-input"),
    warningAlertContainer = document.getElementById("warning-alert"),
    tuneInfoContainer = document.getElementById("tune-info");
  tuneSelect.addEventListener("change", () => {
    tuneInput.value = tuneSelect.value;
    tuneInput.parentNode.dataset.replicatedValue = tuneInput.value;
    if (tuneSelect.value === "") {
      document.getElementById("play").classList.add("disabled");
      document.getElementById("play").setAttribute("disabled", "disabled");
      warningAlertContainer.classList.remove("d-none");
      tuneInfoContainer.classList.add("d-none");
      tuneInput.removeAttribute("readonly");
    } else {
      document.getElementById("play").classList.remove("disabled");
      document.getElementById("play").removeAttribute("disabled");
      warningAlertContainer.classList.add("d-none");
      tuneInfoContainer.classList.remove("d-none");
      calculateDuration(createTuneObj(tuneSelect.value));
      tuneInput.readonly = true;
    }
    validateTuneInput(tuneInput.value);
  });
  tuneInput.addEventListener("input", () => {
    tuneInput.parentNode.dataset.replicatedValue = tuneInput.value;
    document.getElementById("custom-option").selected = true;
    validateTuneInput(tuneInput.value);
  });
  tuneInput.addEventListener("paste", () => {
    tuneInput.parentNode.dataset.replicatedValue = tuneInput.value;
    document.getElementById("custom-option").selected = true;
    validateTuneInput(tuneInput.value);
  });
  document.getElementById("tune-form").addEventListener("submit", event => {
    event.preventDefault();
    document.getElementById("tune-select").classList.add("disabled");
    document.getElementById("tune-select").setAttribute("disabled", "disabled");
    document.getElementById("play").classList.add("d-none");
    document.getElementById("stop").classList.remove("d-none");
    requestId = requestAnimationFrame(() => {
      play(createTuneObj(tuneInput.value));
    });
  });
}

function showTooltipOnce(element, text) {
  return function() {
    var tooltip = new bootstrap.Tooltip(element, {
      title: text,
      trigger: "hover"
    });
    tooltip.show();
    element.addEventListener("hidden.bs.tooltip", () => {
      tooltip.dispose();
    }, {
      once: true
    });
  };
}

ready(() => {
  let tuneInput = document.getElementById("tune-input");
  tuneInput.value = "Loading...";
  loadSelect();
  addFormEvents();
  validateTuneInput(tuneInput.value);
  calculateDuration(createTuneObj(tuneInput.value));
  let copyButton = document.getElementById("copy");
  let permalinkButton = document.getElementById("permalink");
  new bootstrap.Popover("#trivia");
  new ClipboardJS(copyButton, {
    text: () => {
      return tuneInput.value.trim().replace(/\s+/g, " ");
    }
  }).on("success", showTooltipOnce(copyButton, "Copied!"));
  new ClipboardJS(permalinkButton, {
    text: () => {
      let url = new URL(window.location.href);
      url.search = "?tune=" + tuneInput.value.trim().replace(/\s+/g, "+");
      return url.href;
    }
  }).on("success", showTooltipOnce(permalinkButton, "Copied!"));
});
