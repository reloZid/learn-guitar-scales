import {Note} from "./note";
import {ScaleDegree} from "./scale-degree";

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

export interface ScaleSettings {
    name: string,
    root: string,
}

export class Scale {
    readonly name: string;
    readonly root: Note;
    readonly degrees: ScaleDegree[];
    readonly notes: Note[];

    constructor(settings: ScaleSettings) {
        this.name = settings.name;
        this.root = Note.fromName(settings.root);

        this.degrees = scales[settings.name].map(name => ScaleDegree.fromName(name));
        this.notes = this.degrees.map(degree => this.note(degree));
    }

    note(degree: ScaleDegree): Note {
        return Note.fromValue((this.root.value + degree.value) % 12, this);
    }

    degree(note: Note): ScaleDegree {
        let value = (note.value - this.root.value) % 12;
        if (value < 0) {
            value += 12;
        }
        return ScaleDegree.fromValue(value, this);
    }

    contains(note: Note): boolean;
    contains(degree: ScaleDegree): boolean;
    contains(noteOrDegree: Note|ScaleDegree): boolean {
        if (noteOrDegree instanceof Note) {
            const note = noteOrDegree;
            return this.notes.some(item => item.value === note.value);
        }
        else {
            const degree = noteOrDegree;
            return this.degrees.some(item => item.value === degree.value);
        }
    }

    get settings(): ScaleSettings {
        return {
            name: this.name,
            root: this.root.name,
        };
    }
}
