import {Note} from "./note";
import {ScaleDegree} from "./scale-degree";

export class Scale {
    readonly root: Note;
    readonly degrees: ScaleDegree[];
    readonly notes: Note[];

    constructor(root: Note, degrees: ScaleDegree[]) {
        this.root = root;
        this.degrees = degrees;
        this.notes = degrees.map(degree => this.note(degree));
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
}
