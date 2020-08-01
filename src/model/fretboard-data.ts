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
    static getStringCount(): number {
        return tuning.length;
    }

    static getFretCount(): number {
        return 24;
    }

    private data: { position: FretboardPosition, content: FretboardContent }[] = [];

    getContent(position: FretboardPosition): FretboardContent | undefined {
        for (const item of this.data) {
            if (equal(item.position, position)) {
                return item.content;
            }
        }
        return undefined;
    }

    setContent(position: FretboardPosition, content: FretboardContent) {
        this.data = this.data.filter(item => !equal(item.position, position));
        this.data.push({position, content});
    }

    clearContent(position: FretboardPosition) {
        this.data = this.data.filter(item => !equal(item.position, position));
    }

    clip(firstFret: number, lastFret: number, openStrings: boolean) {
        this.data = this.data.filter(item => {
            if (item.position.fret === 0) {
                return openStrings;
            } else {
                return item.position.fret >= firstFret && item.position.fret <= lastFret;
            }
        });
    }

    setNote(note: Note, scale: Scale) {
        for (const position of FretboardData.getAllPositions()) {
            const currentNote = FretboardData.getNote(position, scale);

            if (currentNote.value === note.value) {
                this.setContent(position, {note, degree: scale.degreeFromNote(note)});
            }
        }
    }

    setDegree(degree: ScaleDegree, scale: Scale) {
        this.setNote(scale.noteFromDegree(degree), scale);
    }

    setScale(scale: Scale) {
        for (const position of FretboardData.getAllPositions()) {
            const note = FretboardData.getNote(position, scale);

            if (scale.containsNote(note)) {
                this.setContent(position, {note, degree: scale.degreeFromNote(note)});
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
        const clone = new FretboardData();
        clone.data = this.data.slice();
        return clone;
    }

    private static getNote(position: FretboardPosition, scale: Scale) {
        let openNote = Note.fromName(tuning[position.string]);
        return scale.noteFromValue((openNote.value + position.fret) % 12);
    }

    private static getAllPositions(): FretboardPosition[] {
        let positions = [];
        for (let string = 0; string < FretboardData.getStringCount(); string++) {
            for (let fret = 0; fret <= FretboardData.getFretCount(); fret++) {
                positions.push({string, fret});
            }
        }
        return positions;
    }

}
