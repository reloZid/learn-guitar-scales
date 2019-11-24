const noteE1 = 16; // C0 being zero

let settings = {
  fretboard: {
    tuning: [
      noteE1 + 24,
      noteE1 + 19,
      noteE1 + 15,
      noteE1 + 10,
      noteE1 + 5,
      noteE1,
    ],
    firstFret: 7,
    lastFret: 12,
    showOpenStrings: true,
  },
  scale: {
    rootNote: noteE1,
    degrees: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
};

const style = {
  scaleDegrees: {
    0: {name: 'R', color: 'black'},
    1: {name: 'b2', color: 'darkred'},
    2: {name: '2', color: 'firebrick'},
    3: {name: 'b3', color: 'darkgreen'},
    4: {name: '3', color: 'limegreen'},
    5: {name: '4', color: 'gold'},
    6: {name: 'b5', color: 'skyblue'},
    7: {name: '5', color: 'darkblue'},
    8: {name: 'b6', color: 'purple'},
    9: {name: '6', color: 'mediumpurple'},
    10: {name: 'b7', color: 'teal'},
    11: {name: '7', color: 'turquoise'},
  },
  fretboard: {
    stringSpacing: 55,
    fretSpacing: 120,
    markerSize: 30,
    noteSize: 40,
    openNoteSize: 30,
  }
};

function updateFretboard() {
  let fretboardHtml = '<table>';

  for (let stringIndex = 0; stringIndex < settings.fretboard.tuning.length; stringIndex++) {
    fretboardHtml += '<tr>';

    for (let fretIndex = settings.fretboard.firstFret; fretIndex < settings.fretboard.lastFret + 1; fretIndex++) {
      const noteValue = settings.fretboard.tuning[stringIndex] + fretIndex;
      let fretHtml = `<div class="note" noteValue="${noteValue}" />`;

      const hasSingleMarker = [3, 5, 7, 9].includes(fretIndex % 12) && stringIndex === 2;
      const hasDoubleMarker = fretIndex % 12 === 0 && (stringIndex === 1 || stringIndex === 3);
      if (hasSingleMarker || hasDoubleMarker) {
        fretHtml += '<div class="marker" />';
      }

      if (fretIndex === settings.fretboard.firstFret && settings.fretboard.showOpenStrings) {
        const openNoteValue = settings.fretboard.tuning[stringIndex];
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
  $('.note, .open-note').each(function() {
    const noteValue = parseInt($(this).attr('noteValue'));
    let scaleDegree = (noteValue - settings.scale.rootNote) % 12;
    if (scaleDegree < 0) {
      scaleDegree += 12;
    }

    if (settings.scale.degrees.includes(scaleDegree)) {
      $(this).text(style.scaleDegrees[scaleDegree].name);
      $(this).css('background-color', style.scaleDegrees[scaleDegree].color);
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}

$(document).ready(function () {
  updateFretboard();
});
