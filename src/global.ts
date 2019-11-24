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

export function norm(value: number): number {
    return value >= 0 ? value % 12 : value % 12 + 12;
}
