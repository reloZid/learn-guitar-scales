import $ from "jquery"

import {FretboardData, FretboardPosition} from "../model/fretboard-data";

const stringCount = 6;

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
    labels: 'notes'|'scale-degrees',
}

export class Fretboard {
    private _settings: FretboardSettings = {
        firstFret: 5,
        lastFret: 8,
        openStrings: false,
        labels: 'notes',
    };

    setup(settings: FretboardSettings) {
        this._settings = settings;
        this.generateFretboard();
        this.styleFretboard();
    }

    get settings() {
        return this._settings;
    }

    private generateFretboard() {
        let fretboardHtml = '<table>';

        for (let string = 0; string < stringCount; string++) {
            fretboardHtml += '<tr>';

            for (let fret = this._settings.firstFret; fret < this._settings.lastFret + 1; fret++) {
                fretboardHtml += '<td>';

                const hasSingleMarker = [3, 5, 7, 9].includes(fret % 12) && string === 2;
                const hasDoubleMarker = fret % 12 === 0 && (string === 1 || string === 3);
                if (hasSingleMarker || hasDoubleMarker) {
                    fretboardHtml += '<div class="marker" />';
                }

                if (fret === this._settings.firstFret && this._settings.openStrings) {
                    fretboardHtml += `<div class="open-note" fret="0" string="${string}">`;
                    fretboardHtml += '<div class="note-content"/>';
                    fretboardHtml += '</div>';
                }

                fretboardHtml += `<div class="note" fret="${fret}" string="${string}">`;
                fretboardHtml += '<div class="note-content"/>';
                fretboardHtml += '</div>';

                fretboardHtml += '</td>';
            }

            fretboardHtml += '</tr>';
        }

        fretboardHtml += '</table>';
        $('#fretboard').html(fretboardHtml);
    }

    private styleFretboard() {
        const fretboard = $('#fretboard');
        fretboard.find('td')
            .css('width', style.fretSpacing)
            .css('min-width', style.fretSpacing)
            .css('height', style.stringSpacing);
        fretboard.find('.marker')
            .css('left', style.fretSpacing / 2 - style.markerSize / 2)
            .css('top', style.stringSpacing - style.markerSize / 2)
            .css('width', style.markerSize)
            .css('height', style.markerSize)
            .css('border-radius', style.markerSize / 2);
        fretboard.find('.note .note-content')
            .css('left', style.fretSpacing / 2 - style.noteSize / 2)
            .css('top', style.stringSpacing / 2 - style.noteSize / 2)
            .css('width', style.noteSize)
            .css('height', style.noteSize)
            .css('border-radius', style.noteSize / 2)
            .css('line-height', (style.noteSize - 3) + 'px');
        fretboard.find('.open-note')
            .css('left', -style.openNoteSize)
            .css('width', style.openNoteSize)
            .css('height', style.stringSpacing);
        fretboard.find('.open-note .note-content')
            .css('top', style.stringSpacing / 2 - style.openNoteSize / 2)
            .css('width', style.openNoteSize)
            .css('height', style.openNoteSize)
            .css('border-radius', style.openNoteSize / 2)
            .css('line-height', (style.openNoteSize - 3) + 'px');
        if (this._settings.openStrings) {
            fretboard.find('table').css('margin-left', style.openNoteSize);
        }
    }

    onClick(callback: (position: FretboardPosition) => void) {
        $('.note, .open-note').on('click', function () {
            const fret = parseInt(<string>$(this).attr('fret'));
            const string = parseInt(<string>$(this).attr('string'));
            callback({string, fret});
        });
    }

    showData(data: FretboardData) {
        const labels = this._settings.labels;
        $('.note, .open-note').each(function() {
            const fret = parseInt(<string>$(this).attr('fret'));
            const string = parseInt(<string>$(this).attr('string'));
            const contentElement = $(this).find('.note-content');

            const content = data.getContent({string, fret});

            if (content) {
                contentElement.text(labels === "notes" ? content.note.name : content.degree.name);
                contentElement.css('background-color', style.scaleDegreeColors[content.degree.value]);
                contentElement.show();
            } else {
                contentElement.hide();
            }
        });
    }

}
