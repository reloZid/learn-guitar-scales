import $ from "jquery"

import {scales, settings, style} from "./global";
import {Note} from "./note";
import {ScaleDegree} from "./scale-degree";

$(function () {
    $('.fretboard-setup').on('change', setupFretboard);
    setupFretboard();
});

function setupFretboard() {
    settings.fretboard.firstFret = parseInt(<string>$('#select-first-fret').val());
    settings.fretboard.lastFret = parseInt(<string>$('#select-last-fret').val());
    settings.fretboard.showOpenStrings = $('#check-open-strings').is(':checked');
    settings.scale.degrees = scales[<string>$('#select-scale').val()];
    settings.scale.root = <string>$('#select-root').val();
    settings.scale.showDegrees = $('#check-show-degrees').is(':checked');

    generateFretboard();
    styleFretboard();
    setupScale();
}

function generateFretboard() {
    let fretboardHtml = '<table>';

    for (let stringIndex = 0; stringIndex < settings.fretboard.tuning.length; stringIndex++) {
        const openNote = Note.fromName(settings.fretboard.tuning[stringIndex]);
        fretboardHtml += '<tr>';

        for (let fretIndex = settings.fretboard.firstFret; fretIndex < settings.fretboard.lastFret + 1; fretIndex++) {
            const note = openNote.add(fretIndex);
            let fretHtml = `<div class="note" noteValue="${note.getValue()}" />`;

            const hasSingleMarker = [3, 5, 7, 9].includes(fretIndex % 12) && stringIndex === 2;
            const hasDoubleMarker = fretIndex % 12 === 0 && (stringIndex === 1 || stringIndex === 3);
            if (hasSingleMarker || hasDoubleMarker) {
                fretHtml += '<div class="marker" />';
            }

            if (fretIndex === settings.fretboard.firstFret && settings.fretboard.showOpenStrings) {
                fretHtml += `<div class="open-note" noteValue="${openNote.getValue()}" />`;
            }

            fretboardHtml += `<td>${fretHtml}</td>`;
        }

        fretboardHtml += '</tr>';
    }

    fretboardHtml += '</table>';

    const fretboard = $('#fretboard');
    fretboard.html(fretboardHtml);
}

function styleFretboard() {
    const fretboard = $('#fretboard');
    fretboard.find('td')
        .css('width', style.fretboard.fretSpacing)
        .css('min-width', style.fretboard.fretSpacing)
        .css('height', style.fretboard.stringSpacing);
    fretboard.find('div.marker')
        .css('width', style.fretboard.markerSize)
        .css('height', style.fretboard.markerSize)
        .css('border-radius', style.fretboard.markerSize / 2)
        .css('left', style.fretboard.fretSpacing / 2 - style.fretboard.markerSize / 2)
        .css('top', style.fretboard.stringSpacing - style.fretboard.markerSize / 2);
    fretboard.find('div.note')
        .css('width', style.fretboard.noteSize)
        .css('height', style.fretboard.noteSize)
        .css('border-radius', style.fretboard.noteSize / 2)
        .css('left', style.fretboard.fretSpacing / 2 - style.fretboard.noteSize / 2)
        .css('top', style.fretboard.stringSpacing / 2 - style.fretboard.noteSize / 2)
        .css('line-height', (style.fretboard.noteSize - 3) + 'px');
    fretboard.find('div.open-note')
        .css('width', style.fretboard.openNoteSize)
        .css('height', style.fretboard.openNoteSize)
        .css('border-radius', style.fretboard.openNoteSize / 2)
        .css('left', -style.fretboard.openNoteSize)
        .css('top', style.fretboard.stringSpacing / 2 - style.fretboard.openNoteSize / 2)
        .css('line-height', (style.fretboard.openNoteSize - 3) + 'px');
    if (settings.fretboard.showOpenStrings) {
        fretboard.find('table').css('margin-left', style.fretboard.openNoteSize);
    }
}

function setupScale() {
    const scaleDegreeValues = settings.scale.degrees.map(name => ScaleDegree.fromName(name).getValue());

    $('.note, .open-note').each(function () {
        const note = Note.fromValue(parseInt(<string>$(this).attr('noteValue')));
        const scaleDegree = note.getScaleDegree();

        if (scaleDegreeValues.includes(scaleDegree.getValue())) {
            if (settings.scale.showDegrees) {
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
