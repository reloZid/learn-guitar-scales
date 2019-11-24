export let settings = {
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

export const style = {
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

export const scales = {
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
};
