import {ScaleDegree} from "./scale-degree";
import {Note} from "./note";
import {Scale} from "./scale";
import {FretboardSettings} from "../components/fretboard";

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
    static getStringCount(): number {
        return tuning.length;
    }

    static getFretCount(): number {
        return 24;
    }

    private readonly scale: Scale;
    private data: { position: FretboardPosition, content: FretboardContent }[] = [];

    constructor(scale: Scale) {
        this.scale = scale;
    }

    getPosition(position: FretboardPosition): FretboardContent | undefined {
        for (const item of this.data) {
            if (equal(item.position, position)) {
                return item.content;
            }
        }
        return undefined;
    }

    setPosition(position: FretboardPosition, note: Note): void;
    setPosition(position: FretboardPosition, degree: ScaleDegree): void;
    setPosition(position: FretboardPosition, noteOrDegree: Note | ScaleDegree) {
        this.data = this.data.filter(item => !equal(item.position, position));
        if (noteOrDegree instanceof Note) {
            const content = {note: noteOrDegree, degree: this.scale.degreeFromNote(noteOrDegree)};
            this.data.push({position, content});
        } else {
            const content = {degree: noteOrDegree, note: this.scale.noteFromDegree(noteOrDegree)};
            this.data.push({position, content});
        }
    }

    clearPosition(position: FretboardPosition) {
        this.data = this.data.filter(item => !equal(item.position, position));
    }

    clip(settings: FretboardSettings) {
        this.data = this.data.filter(item => {
            if (item.position.fret === 0) {
                return settings.openStrings;
            } else {
                return item.position.fret >= settings.firstFret && item.position.fret <= settings.lastFret;
            }
        });
    }

    setNote(note: Note) {
        for (const position of FretboardData.getPositions()) {
            const currentNote = this.getNote(position);

            if (currentNote.value === note.value) {
                this.setPosition(position, note);
            }
        }
    }

    setScale() {
        for (const position of FretboardData.getPositions()) {
            const note = this.getNote(position);

            if (this.scale.containsNote(note)) {
                this.setPosition(position, note);
            }
        }
    }

    equals(other: FretboardData): boolean {
        if (other.data.length !== this.data.length) {
            return false;
        }

        for (const item of this.data) {
            const otherContent = other.getPosition(item.position);

            if (!otherContent) {
                return false;
            }

            if (item.content.note.value !== otherContent.note.value) {
                return false;
            }
        }

        return true;
    }

    isEmpty(): boolean {
        return this.data.length === 0;
    }

    filter(callback: (position: FretboardPosition, content: FretboardContent) => boolean) {
        this.data = this.data.filter(item => callback(item.position, item.content));
    }

    map<T>(callback: (position: FretboardPosition, content: FretboardContent) => T): T[] {
        return this.data.map(item => callback(item.position, item.content));
    }

    clone(): FretboardData {
        const clone = new FretboardData(this.scale);
        clone.data = this.data.slice();
        return clone;
    }

    private getNote(position: FretboardPosition) {
        let openNote = Note.fromName(tuning[position.string]);
        return this.scale.noteFromValue((openNote.value + position.fret) % 12);
    }

    private static getPositions(): FretboardPosition[] {
        let positions = [];
        for (let string = 0; string < FretboardData.getStringCount(); string++) {
            for (let fret = 0; fret <= FretboardData.getFretCount(); fret++) {
                positions.push({string, fret});
            }
        }
        return positions;
    }

}
