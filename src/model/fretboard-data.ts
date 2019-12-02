import {ScaleDegree} from "./scale-degree";
import {Note} from "./note";
import {Scale} from "./scale";

const tuning = ['E', 'B', 'G', 'D', 'A', 'E'];

export interface FretboardPosition {
    string: number,
    fret: number,
}

export interface FretboardContent {
    note: Note,
    degree: ScaleDegree,
}

function equal(pos1: FretboardPosition, pos2: FretboardPosition) {
    return pos1.string === pos2.string && pos1.fret === pos2.fret;
}

export class FretboardData {
    private readonly scale: Scale;
    private data: { position: FretboardPosition, content: FretboardContent }[] = [];

    constructor(scale: Scale) {
        this.scale = scale;
    }

    getContent(position: FretboardPosition): FretboardContent | null {
        for (const item of this.data) {
            if (equal(item.position, position)) {
                return item.content;
            }
        }
        return null;
    }

    setContent(position: FretboardPosition, note: Note): void;
    setContent(position: FretboardPosition, degree: ScaleDegree): void;
    setContent(position: FretboardPosition, noteOrDegree: Note | ScaleDegree): void {
        this.clearContent(position);
        if (noteOrDegree instanceof Note) {
            const content = {note: noteOrDegree, degree: this.scale.degree(noteOrDegree)};
            this.data.push({position, content});
        } else {
            const content = {degree: noteOrDegree, note: this.scale.note(noteOrDegree)};
            this.data.push({position, content});
        }
    }

    clearContent(position: FretboardPosition): void {
        this.data = this.data.filter(item => !equal(item.position, position));
    }

    reset(): void {
        this.data = [];
    }

    setNote(note: Note, firstFret?: number, lastFret?: number): void {
        for (const position of FretboardData.getPositions(firstFret, lastFret)) {
            const currentNote = this.getNote(position);

            if (currentNote.value == note.value) {
                this.setContent(position, note);
            }
        }
    }

    setScale(firstFret?: number, lastFret?: number): void {
        for (const position of FretboardData.getPositions(firstFret, lastFret)) {
            const note = this.getNote(position);

            if (this.scale.contains(note)) {
                this.setContent(position, note);
            }
        }
    }

    equals(other: FretboardData): boolean {
        if (other.data.length !== this.data.length) {
            return false;
        }

        for (const item of this.data) {
            const otherContent = other.getContent(item.position);

            if (!otherContent) {
                return false;
            }

            if (item.content.note.value !== otherContent.note.value) {
                return false;
            }
        }

        return true;
    }

    private getNote(position: FretboardPosition) {
        let openNote = Note.fromName(tuning[position.string]);
        return Note.fromValue((openNote.value + position.fret) % 12, this.scale);
    }

    private static getPositions(firstFret?: number, lastFret?: number): FretboardPosition[] {
        if (firstFret === undefined) {
            firstFret = 0;
        }
        if (lastFret === undefined) {
            lastFret = 24;
        }

        let positions = [];
        for (let string = 0; string < tuning.length; string++) {
            for (let fret = firstFret; fret <= lastFret; fret++) {
                positions.push({string, fret});
            }
        }
        return positions;
    }

}
