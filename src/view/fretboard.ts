import $ from "jquery"

import {Note} from "../model/note";
import {Scale} from "../model/scale";
import {ScaleDegree} from "../model/scale-degree";

const tuning = ['E', 'B', 'G', 'D', 'A', 'E'];

const style = {
    stringSpacing: 55,
    fretSpacing: 120,
    markerSize: 30,
    noteSize: 40,
    openNoteSize: 35,
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
}

export interface NotePosition {
    string: number,
    fret: number,
}

export class Fretboard {
    private container: JQuery = $('#fretboard');
    private settings: FretboardSettings = {
        firstFret: 5,
        lastFret: 8,
        openStrings: false,
    };

    setup(settings: FretboardSettings) {
        this.settings = settings;
        this.generateFretboard();
        this.styleFretboard();
        $('.note, .open-note').on('click', () => console.log('clicked'));
    }

    private generateFretboard() {
        let fretboardHtml = '<table>';

        for (let stringNumber = 1; stringNumber <= tuning.length; stringNumber++) {
            const openNote = Note.fromName(tuning[stringNumber - 1]);
            fretboardHtml += '<tr>';

            for (let fretNumber = this.settings.firstFret; fretNumber < this.settings.lastFret + 1; fretNumber++) {
                const note = Note.fromValue((openNote.value + fretNumber) % 12);
                fretboardHtml += '<td>';

                const hasSingleMarker = [3, 5, 7, 9].includes(fretNumber % 12) && stringNumber === 3;
                const hasDoubleMarker = fretNumber % 12 === 0 && (stringNumber === 2 || stringNumber === 4);
                if (hasSingleMarker || hasDoubleMarker) {
                    fretboardHtml += '<div class="marker" />';
                }

                if (fretNumber === this.settings.firstFret && this.settings.openStrings) {
                    fretboardHtml += `<div class="open-note" value="${openNote.value}" fret="0" string="${stringNumber}">`;
                    fretboardHtml += '<div class="note-content"/>';
                    fretboardHtml += '</div>';
                }

                fretboardHtml += `<div class="note" value="${note.value}" fret="${fretNumber}" string="${stringNumber}">`;
                fretboardHtml += '<div class="note-content"/>';
                fretboardHtml += '</div>';

                fretboardHtml += '</td>';
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
        this.container.find('.marker')
            .css('left', style.fretSpacing / 2 - style.markerSize / 2)
            .css('top', style.stringSpacing - style.markerSize / 2)
            .css('width', style.markerSize)
            .css('height', style.markerSize)
            .css('border-radius', style.markerSize / 2);
        this.container.find('.note .note-content')
            .css('left', style.fretSpacing / 2 - style.noteSize / 2)
            .css('top', style.stringSpacing / 2 - style.noteSize / 2)
            .css('width', style.noteSize)
            .css('height', style.noteSize)
            .css('border-radius', style.noteSize / 2)
            .css('line-height', (style.noteSize - 3) + 'px');
        this.container.find('.open-note')
            .css('left', -style.openNoteSize)
            .css('width', style.openNoteSize)
            .css('height', style.stringSpacing);
        this.container.find('.open-note .note-content')
            .css('top', style.stringSpacing / 2 - style.openNoteSize / 2)
            .css('width', style.openNoteSize)
            .css('height', style.openNoteSize)
            .css('border-radius', style.openNoteSize / 2)
            .css('line-height', (style.openNoteSize - 3) + 'px');
        if (this.settings.openStrings) {
            this.container.find('table').css('margin-left', style.openNoteSize);
        }
    }

    onClick(callback: (position: NotePosition, note: Note) => void) {
        $('.note, .open-note').on('click', function () {
            const fretNumber = parseInt(<string>$(this).attr('fret'));
            const stringNumber = parseInt(<string>$(this).attr('string'));
            const noteValue = parseInt(<string>$(this).attr('value'));
            callback({fret: fretNumber, string: stringNumber}, Note.fromValue(noteValue));
        });
    }

    showScale(scale: Scale, showDegrees: boolean) {
        const noteValues = scale.notes.map(note => note.value);

        $('.note, .open-note').each(function () {
            const content = $(this).find('.note-content');
            const noteValue = parseInt(<string>$(this).attr('value'));
            const index = noteValues.indexOf(noteValue);

            if (index >= 0) {
                if (showDegrees) {
                    content.text(scale.degrees[index].name);
                } else {
                    content.text(scale.notes[index].name);
                }

                content.css('background-color', style.scaleDegreeColors[scale.degrees[index].value]);
                content.show();
            } else {
                content.hide();
            }
        });
    }

    showNoteAs(position: NotePosition, degree: ScaleDegree) {
        const note = $('.note, .open-note').filter(function() {
            return parseInt(<string>$(this).attr('fret')) === position.fret &&
                parseInt(<string>$(this).attr('string')) === position.string;
        });
        const content = note.find('.note-content');
        content.text(degree.name);
        content.css('background-color', style.scaleDegreeColors[degree.value]);
        content.show();
    }

    hideNote(position: NotePosition) {
        const note = $('.note, .open-note').filter(function() {
            return parseInt(<string>$(this).attr('fret')) === position.fret &&
                parseInt(<string>$(this).attr('string')) === position.string;
        });
        const content = note.find('.note-content');
        content.hide();
    }

    hideNotes() {
        $('.note-content').hide();
    }

    visiblePositions(note: Note): NotePosition[] {
        let positions: NotePosition[] = [];
        $('.note, .open-note').filter(function() {
            return parseInt(<string>$(this).attr('value')) === note.value;
        }).each(function() {
            positions.push({
                string: parseInt(<string>$(this).attr('string')),
                fret: parseInt(<string>$(this).attr('fret'))
            });
        });
        return positions;
    }
}
