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

    setPosition(position: FretboardPosition, note: Note): FretboardData;
    setPosition(position: FretboardPosition, degree: ScaleDegree): FretboardData;
    setPosition(position: FretboardPosition, noteOrDegree: Note | ScaleDegree): FretboardData {
        this.data = this.data.filter(item => !equal(item.position, position));
        if (noteOrDegree instanceof Note) {
            const content = {note: noteOrDegree, degree: this.scale.degree(noteOrDegree)};
            this.data.push({position, content});
        } else {
            const content = {degree: noteOrDegree, note: this.scale.note(noteOrDegree)};
            this.data.push({position, content});
        }
        return this;
    }

    clearPosition(position: FretboardPosition): FretboardData {
        this.data = this.data.filter(item => !equal(item.position, position));
        return this;
    }

    clip(settings: FretboardSettings): FretboardData {
        this.data = this.data.filter(item => {
            if (item.position.fret === 0) {
                return settings.openStrings;
            } else {
                return item.position.fret >= settings.firstFret && item.position.fret <= settings.lastFret;
            }
        });
        return this;
    }

    setNote(note: Note): FretboardData {
        for (const position of FretboardData.getPositions()) {
            const currentNote = this.getNote(position);

            if (currentNote.value == note.value) {
                this.setPosition(position, note);
            }
        }
        return this;
    }

    setScale(): FretboardData {
        for (const position of FretboardData.getPositions()) {
            const note = this.getNote(position);

            if (this.scale.contains(note)) {
                this.setPosition(position, note);
            }
        }
        return this;
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

    filter(callback: (position: FretboardPosition, content: FretboardContent) => boolean): FretboardData {
        this.data = this.data.filter(item => callback(item.position, item.content));
        return this;
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
        return Note.fromValue((openNote.value + position.fret) % 12, this.scale);
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
