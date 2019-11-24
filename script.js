import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.css'
import './style.css'

import 'bootstrap'
import $ from 'jquery'

let settings = {
  fretboard: {
    tuning: ['E', 'B', 'G', 'D', 'A', 'E'],
    firstFret: 7,
    lastFret: 12,
    showOpenStrings: true,
  },
  scale: {
    root: 'C',
    degrees: ['1', 'b3', '4', '5', 'b7'],
    showDegrees: false,
  },
};

const style = {
  fretboard: {
    stringSpacing: 55,
    fretSpacing: 120,
    markerSize: 30,
    noteSize: 40,
    openNoteSize: 30,
  },
  scaleDegreeColors: {
    0: 'black',
    1: 'darkred',
    2: 'firebrick',
    3: 'darkgreen',
    4: 'limegreen',
    5: 'gold',
    6: 'skyblue',
    7: 'darkblue',
    8: 'purple',
    9: 'mediumpurple',
    10: 'teal',
    11: 'turquoise',
  },
};

function updateFretboard() {
  let fretboardHtml = '<table>';

  for (let stringIndex = 0; stringIndex < settings.fretboard.tuning.length; stringIndex++) {
    const openNoteValue = noteNameToValue(settings.fretboard.tuning[stringIndex]);
    fretboardHtml += '<tr>';

    for (let fretIndex = settings.fretboard.firstFret; fretIndex < settings.fretboard.lastFret + 1; fretIndex++) {
      const noteValue = norm(openNoteValue + fretIndex);
      let fretHtml = `<div class="note" noteValue="${noteValue}" />`;

      const hasSingleMarker = [3, 5, 7, 9].includes(fretIndex % 12) && stringIndex === 2;
      const hasDoubleMarker = fretIndex % 12 === 0 && (stringIndex === 1 || stringIndex === 3);
      if (hasSingleMarker || hasDoubleMarker) {
        fretHtml += '<div class="marker" />';
      }

      if (fretIndex === settings.fretboard.firstFret && settings.fretboard.showOpenStrings) {
        fretHtml += `<div class="open-note" noteValue="${openNoteValue}" />`;
      }

      fretboardHtml += `<td>${fretHtml}</td>`;
    }

    fretboardHtml += '</tr>';
  }

  fretboardHtml += '</table>';

  const fretboard = $('#fretboard');
  fretboard.html(fretboardHtml);
  fretboard.find('td')
    .css('width', style.fretboard.fretSpacing)
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
    fretboard.css('margin-left', style.fretboard.openNoteSize);
  }

  updateScale();
}

function updateScale() {
  const scaleDegreeValues = settings.scale.degrees.map(scaleDegreeName => scaleDegreeNameToValue(scaleDegreeName));

  $('.note, .open-note').each(function () {
    const noteValue = parseInt($(this).attr('noteValue'));
    const scaleDegreeValue = noteValueToScaleDegreeValue(noteValue);

    if (scaleDegreeValues.includes(scaleDegreeValue)) {
      if (settings.scale.showDegrees) {
        $(this).text(scaleDegreeValueToName(scaleDegreeValue))
      } else {
        $(this).text(noteValueToName(noteValue));
      }

      $(this).css('background-color', style.scaleDegreeColors[scaleDegreeValue]);
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}

function noteValueToName(noteValue) {
  const scaleDegreeName = scaleDegreeValueToName(noteValueToScaleDegreeValue(noteValue));

  if (scaleDegreeName === undefined) {
    return undefined;
  }

  const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const rootNameIndex = noteNames.indexOf(settings.scale.root.charAt(0));
  const nameIndexOffset = parseInt(scaleDegreeName.charAt(scaleDegreeName.length - 1)) - 1;
  const naturalNoteName = noteNames[(rootNameIndex + nameIndexOffset) % 7];
  let naturalNoteValue = noteNameToValue(naturalNoteName);

  if (naturalNoteValue > noteValue) {
    naturalNoteValue -= 12;
  }

  const sharps = noteValue - naturalNoteValue;
  const flats = naturalNoteValue - noteValue + 12;

  return naturalNoteName + ((sharps < flats) ? '#'.repeat(sharps) : 'b'.repeat(flats));
}

function noteValueToScaleDegreeValue(noteValue) {
  return norm(noteValue - noteNameToValue(settings.scale.root));
}

function noteNameToValue(noteName) {
  const noteValues = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11};
  let noteValue = noteValues[noteName.charAt(0)];

  for (let i = 1; i < noteName.length; i++) {
    if (noteName.charAt(i) === 'b') noteValue--;
    if (noteName.charAt(i) === '#') noteValue++;
  }

  return norm(noteValue);
}

function scaleDegreeValueToName(scaleDegreeValue) {
  for (let i = 0; i < settings.scale.degrees.length; i++) {
    if (scaleDegreeValue === scaleDegreeNameToValue(settings.scale.degrees[i])) {
      return settings.scale.degrees[i];
    }
  }

  return undefined;
}

function scaleDegreeNameToValue(scaleDegreeName) {
  const degreeValues = {'1': 0, '2': 2, '3': 4, '4': 5, '5': 7, '6': 9, '7': 11};
  let degreeValue = degreeValues[scaleDegreeName.charAt(scaleDegreeName.length - 1)];

  for (let i = 0; i < scaleDegreeName.length - 1; i++) {
    if (scaleDegreeName.charAt(i) === 'b') degreeValue--;
    if (scaleDegreeName.charAt(i) === '#') degreeValue++;
  }

  return norm(degreeValue);
}

function norm(value) {
  return value >= 0 ? value % 12 : value % 12 + 12;
}

$(document).ready(function () {
  updateFretboard();
});
