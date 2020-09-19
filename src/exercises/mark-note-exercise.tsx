import {ExerciseController} from "../components/exercise";
import {FretboardSettings} from "../components/fretboard";
import {Scale} from "../model/scale";
import {ScaleDegree} from "../model/scale-degree";
import {FretboardData} from "../model/fretboard-data";
import {Note} from "../model/note";

export class MarkNoteExercise implements ExerciseController {
    private readonly fretboardSettings: FretboardSettings;
    private readonly scale: Scale;

    private currentNote: Note;

    constructor(fretboardSettings: FretboardSettings, scale: Scale) {
        this.fretboardSettings = fretboardSettings;
        this.scale = scale;

        this.currentNote = this.scale.notes[0];
    }

    get name(): string {
        return "Mark Note";
    }

    nextQuestion(): { question: string; degree: ScaleDegree; note: Note } {
        const availableNotes = this.scale.notes.filter(note => note.value !== this.currentNote.value);
        this.currentNote = availableNotes[Math.floor(Math.random() * availableNotes.length)];

        return {
            question: `Where do you find the note ${this.currentNote.text}?`,
            degree: this.scale.degreeFromNote(this.currentNote),
            note: this.currentNote,
        };
    }

    validateAnswer(selection: FretboardData): boolean {
        const correct = new FretboardData();
        correct.setNote(this.currentNote, this.scale);
        correct.clip(
            this.fretboardSettings.firstFret,
            this.fretboardSettings.lastFret,
            this.fretboardSettings.openStrings
        );

        return selection.equals(correct);
    }

}
