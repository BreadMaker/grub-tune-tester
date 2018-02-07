/*jshint -W056 */
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

function composeTune(tuneArr) {
    var tune = [];
    while (tuneArr.length > 0) {
        tune.push({
            frequency: tuneArr[0],
            duration: tuneArr[1]
        });
        tuneArr = tuneArr.splice(2);
    }
    return tune;
}

function play(tempo, tune) {
    var oscillator, baseTime = audioCtx.currentTime,
        arrayLength = tune.length,
        playlength = 0,
        gainNode = audioCtx.createGain();
    for (var i = 0; i < arrayLength; i++) {
        oscillator = audioCtx.createOscillator();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        gainNode.gain.value = 0.125;
        playlength = 1 / (tempo / 60) * tune[i].duration;
        oscillator.type = "square";
        oscillator.frequency.value = tune[i].frequency;
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
            console.log(value);
        },
        allowAdditions: true
    });
    $("#tune-form").submit(function (e) {
        e.preventDefault();
        var inputArr = $("#tune").val().split(" ");
        $("#tune, #play").addClass("disabled").attr("disabled",
            "disabled");
        play(inputArr[0], composeTune(inputArr.splice(1)));
    });
});
