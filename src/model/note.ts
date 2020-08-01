import {ScaleDegree} from "./scale-degree";
import {Scale} from "./scale";

export class Note {

    static fromValue(value: number, scale?: Scale): Note {
        if (value < 0 || value > 11) {
            throw new TypeError('Invalid note value!');
        }

        if (scale) {
            let scaleDegreeValue =  value - scale.root.value;
            if (scaleDegreeValue < 0) {
                scaleDegreeValue += 12;
            }
            const scaleDegree = ScaleDegree.fromValue(scaleDegreeValue, scale);

            const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
            const rootNameIndex = noteNames.indexOf(scale.root.name.charAt(0));
            const nameOffset = parseInt(scaleDegree.name.charAt(scaleDegree.name.length - 1)) - 1;
            const naturalNoteName = noteNames[(rootNameIndex + nameOffset) % 7];
            let naturalNoteValue = Note.fromName(naturalNoteName).value;

            if (naturalNoteValue > value) {
                naturalNoteValue -= 12;
            }

            const sharps = value - naturalNoteValue;
            const flats = naturalNoteValue - value + 12;

            return new Note(naturalNoteName + ((sharps < flats) ? '#'.repeat(sharps) : 'b'.repeat(flats)));
        } else {
            const defaultNames: { [index: number]: string } = {
                0: 'C', 1: 'C#', 2: 'D', 3: 'D#', 4: 'E', 5: 'F', 6: 'F#', 7: 'G', 8: 'G#', 9: 'A', 10: 'A#', 11: 'B'
            };
            return new Note(defaultNames[value]);
        }
    }

    static fromName(name: string): Note {
        return new Note(name);
    }

    private static isNameValid(name: string): boolean {
        if (name.length < 1) {
            return false;
        }

        const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const noteModifiers = ['', 'b', 'bb', '#', '##'];

        return noteNames.includes(name.charAt(0)) &&
               noteModifiers.includes(name.substring(1));
    }

    readonly name: string;

    private constructor(name: string) {
        if (!Note.isNameValid(name)) {
            throw new TypeError('Invalid note name!');
        }

        this.name = name;
    }

    get value(): number {
        const noteValues: { [index: string]: number } = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11};
        const noteModifiers: { [index: string]: number } = {'': 0, 'b': -1, 'bb': -2, '#': 1, '##': 2};

        const noteValue = noteValues[this.name.charAt(0)];
        const noteModifier = noteModifiers[this.name.substring(1)];

        return noteValue + noteModifier;
    }
}
