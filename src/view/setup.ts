import $ from "jquery";
import {FretboardSettings} from "./fretboard";
import {Scale} from "../model/scale";
import {Note} from "../model/note";
import {ScaleDegree} from "../model/scale-degree";

const scales: { [index: string]: string[] } = {
    'minor-pentatonic': ['1', 'b3', '4', '5', 'b7'],
    'major-pentatonic': ['1', '2', '3', '5', '6'],
    'minor-arpeggio': ['1', 'b3', '5'],
    'major-arpeggio': ['1', '3', '5'],
    'ionian': ['1', '2', '3', '4', '5', '6', '7'],
    'dorian': ['1', '2', 'b3', '4', '5', '6', 'b7'],
    'phrygian': ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'],
    'lydian': ['1', '2', '3', '#4', '5', '6', '7'],
    'mixolydian': ['1', '2', '3', '4', '5', '6', 'b7'],
    'aeolian': ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
    'locrian': ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
    'chromatic': ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'],
};

export class Setup {
    constructor() {
        $('#button-start').on('click', event => event.preventDefault());
    }

    onChange(callback: () => void) {
        $('.fretboard-setup').on('change', callback);
    }

    onStart(callback: () => void) {
        $('#button-start').on('click', callback);
    }

    show() {
        $('#setup').show();
    }

    hide() {
        $('#setup').hide();
    }

    get fretboardSettings(): FretboardSettings {
        return {
            firstFret: parseInt(<string>$('#select-first-fret').val()),
            lastFret: parseInt(<string>$('#select-last-fret').val()),
            openStrings: $('#check-open-strings').is(':checked'),
            labels: $('#check-show-degrees').is(':checked') ? "scale-degrees" : "notes",
        }
    }

    get scale(): Scale {
        return new Scale(
            Note.fromName(<string>$('#select-root').val()),
            scales[<string>$('#select-scale').val()].map(name => ScaleDegree.fromName(name))
        );
    }

}
