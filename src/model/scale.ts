import {Note} from "./note";
import {ScaleDegree} from "./scale-degree";

const scales: { [index: string]: string[] } = {
    'root-fifth': ['1', '5'],
    'minor-pentatonic': ['1', 'b3', '4', '5', 'b7'],
    'major-pentatonic': ['1', '2', '3', '5', '6'],
    'minor-arpeggio': ['1', 'b3', '5'],
    'major-arpeggio': ['1', '3', '5'],
    'dominant-arpeggio': ['1', '3', '5', 'b7'],
    'ionian': ['1', '2', '3', '4', '5', '6', '7'],
    'dorian': ['1', '2', 'b3', '4', '5', '6', 'b7'],
    'phrygian': ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'],
    'lydian': ['1', '2', '3', '#4', '5', '6', '7'],
    'mixolydian': ['1', '2', '3', '4', '5', '6', 'b7'],
    'aeolian': ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
    'locrian': ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
    'chromatic': ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'],
};

export class Scale {
    readonly root: Note;
    readonly name: string;
    readonly notes: Note[];
    readonly degrees: ScaleDegree[];

    constructor(root: Note, name: string) {
        if (scales[name] === undefined) {
            throw new TypeError("Invalid scale name!");
        }

        this.root = root;
        this.name = name;

        this.degrees = scales[name].map(degreeName => ScaleDegree.fromName(degreeName));
        this.notes = this.degrees.map(degree => this.noteFromDegree(degree));
    }

    containsNote(note: Note): boolean {
        return this.notes.some(item => item.value === note.value);
    }

    containsDegree(degree: ScaleDegree): boolean {
        return this.degrees.some(item => item.value === degree.value);
    }

    noteFromDegree(degree: ScaleDegree): Note {
        const noteValue = (this.root.value + degree.value) % 12;
        return this.noteFromValue(noteValue);
    }

    degreeFromNote(note: Note): ScaleDegree {
        let degreeValue = (note.value - this.root.value) % 12;

        if (degreeValue < 0) {
            degreeValue += 12;
        }

        return this.degreeFromValue(degreeValue);
    }

    degreeFromValue(value: number): ScaleDegree {
        // try to use the same name as in the scale
        for (const scaleDegree of this.degrees) {
            if (scaleDegree.value === value) {
                return scaleDegree;
            }
        }

        // otherwise use default name
        const defaultNames: { [index: number]: string } = {
            0: '1', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4', 6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7'
        };

        return ScaleDegree.fromName(defaultNames[value]);
    }

    noteFromValue(value: number): Note {
        let scaleDegreeValue =  value - this.root.value;

        if (scaleDegreeValue < 0) {
            scaleDegreeValue += 12;
        }

        const scaleDegree = this.degreeFromValue(scaleDegreeValue);

        const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const rootNameIndex = noteNames.indexOf(this.root.name.charAt(0));
        const nameOffset = parseInt(scaleDegree.naturalDegree.name) - 1;
        const naturalNoteName = noteNames[(rootNameIndex + nameOffset) % 7];

        let naturalNoteValue = Note.fromName(naturalNoteName).value;

        if (naturalNoteValue > value) {
            naturalNoteValue -= 12;
        }

        const sharps = value - naturalNoteValue;
        const flats = naturalNoteValue - value + 12;
        const noteModifier = sharps < flats ? '#'.repeat(sharps) : 'b'.repeat(flats);

        return Note.fromName(naturalNoteName + noteModifier);
    }
}
