import $ from "jquery"

import {Note} from "./note";
import {activeScale} from "./active-scale";
import {ScaleDegree} from "./scale-degree";

const tuning = ['E', 'B', 'G', 'D', 'A', 'E'];

const style = {
    stringSpacing: 55,
    fretSpacing: 120,
    markerSize: 30,
    noteSize: 40,
    openNoteSize: 30,
    scaleDegreeColors: [
        'black',
        'darkred',
        'firebrick',
        'darkgreen',
        'limegreen',
        'gold',
        'skyblue',
        'darkblue',
        'purple',
        'mediumpurple',
        'teal',
        'turquoise',
    ],
};

export interface FretboardSettings {
    firstFret: number,
    lastFret: number,
    openStrings: boolean,
    showDegrees: boolean,
}

export class Fretboard {
    private container: JQuery = $('#fretboard');
    private settings: FretboardSettings = {
        firstFret: 5,
        lastFret: 8,
        openStrings: false,
        showDegrees: true,
    };

    setup(settings: FretboardSettings) {
        this.settings = settings;
        this.generateFretboard();
        this.styleFretboard();
    }

    private generateFretboard() {
        let fretboardHtml = '<table>';

        for (let stringIndex = 0; stringIndex < tuning.length; stringIndex++) {
            const openNote = Note.fromName(tuning[stringIndex]);
            fretboardHtml += '<tr>';

            for (let fretIndex = this.settings.firstFret; fretIndex < this.settings.lastFret + 1; fretIndex++) {
                const note = openNote.add(fretIndex);
                let fretHtml = `<div class="note" noteValue="${note.getValue()}" />`;

                const hasSingleMarker = [3, 5, 7, 9].includes(fretIndex % 12) && stringIndex === 2;
                const hasDoubleMarker = fretIndex % 12 === 0 && (stringIndex === 1 || stringIndex === 3);
                if (hasSingleMarker || hasDoubleMarker) {
                    fretHtml += '<div class="marker" />';
                }

                if (fretIndex === this.settings.firstFret && this.settings.openStrings) {
                    fretHtml += `<div class="note open-note" noteValue="${openNote.getValue()}" />`;
                }

                fretboardHtml += `<td>${fretHtml}</td>`;
            }

            fretboardHtml += '</tr>';
        }

        fretboardHtml += '</table>';

        this.container.html(fretboardHtml);
    }

    private styleFretboard() {
        this.container.find('td')
            .css('width', style.fretSpacing)
            .css('min-width', style.fretSpacing)
            .css('height', style.stringSpacing);
        this.container.find('div.marker')
            .css('width', style.markerSize)
            .css('height', style.markerSize)
            .css('border-radius', style.markerSize / 2)
            .css('left', style.fretSpacing / 2 - style.markerSize / 2)
            .css('top', style.stringSpacing - style.markerSize / 2);
        this.container.find('div.note')
            .css('width', style.noteSize)
            .css('height', style.noteSize)
            .css('border-radius', style.noteSize / 2)
            .css('left', style.fretSpacing / 2 - style.noteSize / 2)
            .css('top', style.stringSpacing / 2 - style.noteSize / 2)
            .css('line-height', (style.noteSize - 3) + 'px');
        this.container.find('div.open-note')
            .css('width', style.openNoteSize)
            .css('height', style.openNoteSize)
            .css('border-radius', style.openNoteSize / 2)
            .css('left', -style.openNoteSize)
            .css('top', style.stringSpacing / 2 - style.openNoteSize / 2)
            .css('line-height', (style.openNoteSize - 3) + 'px');
        if (this.settings.openStrings) {
            this.container.find('table').css('margin-left', style.openNoteSize);
        }
    }

    showScale() {
        const scaleDegreeValues = activeScale.degrees.map(name => ScaleDegree.fromName(name).getValue());
        const showDegrees = this.settings.showDegrees;

        $('.note, .open-note').each(function () {
            const note = Note.fromValue(parseInt(<string>$(this).attr('noteValue')));
            const scaleDegree = note.getScaleDegree();

            if (scaleDegreeValues.includes(scaleDegree.getValue())) {
                if (showDegrees) {
                    $(this).text(scaleDegree.getName());
                } else {
                    $(this).text(note.getName());
                }

                $(this).css('background-color', style.scaleDegreeColors[scaleDegree.getValue()]);
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

}
