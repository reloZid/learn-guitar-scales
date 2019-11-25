import $ from "jquery";
import {scales, settings} from "./global";
import {setupFretboard} from "./fretboard";

$(function () {
    $('.fretboard-setup').on('change', applySettings);
    applySettings();
});

function applySettings() {
    settings.fretboard.firstFret = parseInt(<string>$('#select-first-fret').val());
    settings.fretboard.lastFret = parseInt(<string>$('#select-last-fret').val());
    settings.fretboard.showOpenStrings = $('#check-open-strings').is(':checked');
    settings.scale.degrees = scales[<string>$('#select-scale').val()];
    settings.scale.root = <string>$('#select-root').val();
    settings.scale.showDegrees = $('#check-show-degrees').is(':checked');
    setupFretboard();
}
