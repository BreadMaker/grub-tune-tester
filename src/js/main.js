/*jshint -W056 */
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

function createTuneObj(tuneStr) {
    var tuneArr = tuneStr.split(" ");
    var tuneObj = {};
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
    var playlength = 0;
    for (var i = 0; i < tuneObj.tune.length; i++) {
        playlength += 1 / (tuneObj.tempo / 60) * tuneObj.tune[i].duration;
    }
    $("#notes").text(tuneObj.tune.length);
    $("#duration").text(Math.round(playlength * 1000));
}

function play(tuneObj) {
    if (isNaN(tuneObj.tempo)) {
        $("#tune, #play").removeClass("disabled").removeAttr("disabled");
        return;
    }
    var baseTime = audioCtx.currentTime,
        arrayLength = tuneObj.tune.length,
        playlength = 0,
        gainNode = audioCtx.createGain();
    for (var i = 0; i < arrayLength; i++) {
        var oscillator = audioCtx.createOscillator();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        gainNode.gain.value = 0.0625;
        playlength = 1 / (tuneObj.tempo / 60) * tuneObj.tune[i].duration;
        oscillator.type = "square";
        oscillator.frequency.value = tuneObj.tune[i].frequency;
        if (i == arrayLength - 1) {
            /*jshint -W083 */
            oscillator.onended = function (ev) {
                $("#tune, #play").removeClass("disabled").removeAttr("disabled");
            };
        }
        oscillator.start(baseTime);
        oscillator.stop(baseTime + playlength);
        baseTime += playlength;
    }
}

$(document).ready(function () {
    $("#tune").dropdown({
        onChange: function (text, value) {
            calculateDuration(createTuneObj(value));
        },
        allowAdditions: true,
        hideAdditions: false
    }).trigger("change");
    $("#tune-form").submit(function (e) {
        e.preventDefault();
        $("#tune, #play").addClass("disabled").attr("disabled",
            "disabled");
        play(createTuneObj($("#tune").val()));
    });
    calculateDuration(createTuneObj($("#tune").val()));
});
