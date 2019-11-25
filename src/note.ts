import {activeScale} from "./active-scale";
import {ScaleDegree} from "./scale-degree";

export class Note {
    private readonly value: number;

    static fromValue(value: number): Note {
        return new Note(value);
    }

    static fromName(name: string): Note {
        const noteValues: { [index: string]: number } = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11};
        let noteValue = noteValues[name.charAt(0)];

        for (let i = 1; i < name.length; i++) {
            switch (name.charAt(i)) {
                case 'b':
                    noteValue--;
                    break;
                case '#':
                    noteValue++;
                    break;
                default:
                    throw new Error('Invalid note name!');
            }
        }

        return new Note(noteValue);
    }

    private constructor(value: number) {
        this.value = value >= 0 ? value % 12 : value % 12 + 12;
    }

    add(halfsteps: number) {
        return new Note(this.value + halfsteps);
    }

    getValue(): number {
        return this.value;
    }

    getName(): string {
        const scaleDegreeName = this.getScaleDegree().getName();
        const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const rootNameIndex = noteNames.indexOf(activeScale.root.charAt(0));
        const nameIndexOffset = parseInt(scaleDegreeName.charAt(scaleDegreeName.length - 1)) - 1;
        const naturalNoteName = noteNames[(rootNameIndex + nameIndexOffset) % 7];
        let naturalNoteValue = Note.fromName(naturalNoteName).value;

        if (naturalNoteValue > this.value) {
            naturalNoteValue -= 12;
        }

        const sharps = this.value - naturalNoteValue;
        const flats = naturalNoteValue - this.value + 12;

        return naturalNoteName + ((sharps < flats) ? '#'.repeat(sharps) : 'b'.repeat(flats));
    }

    getScaleDegree(): ScaleDegree {
        return ScaleDegree.fromValue(this.value - Note.fromName(activeScale.root).value);
    }
}
