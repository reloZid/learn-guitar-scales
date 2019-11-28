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
}
