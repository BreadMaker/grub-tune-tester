/*jshint -W056 */
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var tempo = 0;

function beep(tune) {
    if (tune.length === 0) {
        $("#tune, #play").removeClass("disabled").removeAttr("disabled");
        return;
    }
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.value = 0.25;
    oscillator.frequency.value = tune[0];
    oscillator.type = "square";

    oscillator.start();

    var duration = (tune[1] * 60000) / tempo;

    setTimeout(function () {
        oscillator.stop();
        beep(tune.splice(2));
    }, duration);
}

$(document).ready(function () {
    $("#tune-form").submit(function (e) {
        e.preventDefault();
        var inputArr = $("#tune").val().split(" ");
        tempo = inputArr[0];
        $("#tune, #play").addClass("disabled").attr("disabled",
            "disabled");
        beep(inputArr.splice(1));
    });
});
