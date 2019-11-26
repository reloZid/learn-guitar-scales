import $ from "jquery";
import {Fretboard} from "../view/fretboard";
import {Scale} from "../model/scale";
import {ScaleDegree} from "../model/scale-degree";
import {Note} from "../model/note";

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
    private fretboard: Fretboard;

    constructor(fretboard: Fretboard) {
        this.fretboard = fretboard;
        $('.fretboard-setup').on('change', () => this.applySettings());
        this.applySettings();
    }

    private applySettings() {
        this.fretboard.setup({
            firstFret: parseInt(<string>$('#select-first-fret').val()),
            lastFret: parseInt(<string>$('#select-last-fret').val()),
            openStrings: $('#check-open-strings').is(':checked'),
            showDegrees: $('#check-show-degrees').is(':checked'),
        });
        this.fretboard.showScale(new Scale(
            Note.fromName(<string>$('#select-root').val()),
            scales[<string>$('#select-scale').val()].map(name => ScaleDegree.fromName(name))
        ));
    }
}
