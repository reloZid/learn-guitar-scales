import {ExerciseController} from "../components/exercise";
import {FretboardSettings} from "../components/fretboard";
import {Scale} from "../model/scale";
import {ScaleDegree} from "../model/scale-degree";
import {FretboardData} from "../model/fretboard-data";

export class MarkDegreeExercise implements ExerciseController {
    private readonly fretboardSettings: FretboardSettings;
    private readonly scale: Scale;

    private currentDegree: ScaleDegree;

    constructor(fretboardSettings: FretboardSettings, scale: Scale) {
        this.fretboardSettings = fretboardSettings;
        this.scale = scale;
        this.currentDegree = this.scale.degrees[0];
    }

    nextQuestion(): { question: string; degree: ScaleDegree } {
        const lastDegree = this.currentDegree;
        while (this.currentDegree === lastDegree) {
            this.currentDegree = this.scale.degrees[Math.floor(Math.random() * this.scale.degrees.length)];
        }

        return {
            question: `In the key of ${this.scale.root.name}, where do you find the ${this.currentDegree.text}?`,
            degree: this.currentDegree,
        };
    }

    validateAnswer(selection: FretboardData): boolean {
        const currentNote = this.scale.note(this.currentDegree);
        const correct = new FretboardData(this.scale);

        correct.setNote(currentNote, this.fretboardSettings.firstFret, this.fretboardSettings.lastFret);
        if (this.fretboardSettings.openStrings) {
            correct.setNote(currentNote, 0, 0);
        }

        return selection.equals(correct);
    }

}
