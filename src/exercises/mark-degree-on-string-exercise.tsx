import {ExerciseController} from "../components/exercise";
import {FretboardSettings} from "../components/fretboard";
import {Scale} from "../model/scale";
import {ScaleDegree} from "../model/scale-degree";
import {FretboardData} from "../model/fretboard-data";
import {Note} from "../model/note";

export class MarkDegreeOnStringExercise implements ExerciseController {
    private readonly fretboardSettings: FretboardSettings;
    private readonly scale: Scale;

    private currentString: number;
    private currentDegree: ScaleDegree;

    constructor(fretboardSettings: FretboardSettings, scale: Scale) {
        this.fretboardSettings = fretboardSettings;
        this.scale = scale;
        this.currentString = 0;
        this.currentDegree = this.scale.degrees[0];
    }

    get name(): string {
        return "Mark Degree On String";
    }

    nextQuestion(): { question: string; degree: ScaleDegree; note: Note } {
        const availableDegreesOnStrings = [];
        for (let string = 0; string < FretboardData.getStringCount(); string++) {
            if (string === this.currentString) {
                continue;
            }

            const data = new FretboardData();
            data.setScale(this.scale);
            data.filter(position => position.string === string);
            data.clip(
                this.fretboardSettings.firstFret,
                this.fretboardSettings.lastFret,
                this.fretboardSettings.openStrings
            );

            if (!data.isEmpty()) {
                availableDegreesOnStrings.push({string, degrees: data.map((_position, content) => content.degree)});
            }
        }

        const degreesOnString = availableDegreesOnStrings[Math.floor(Math.random() * availableDegreesOnStrings.length)];
        this.currentString = degreesOnString.string;
        this.currentDegree = degreesOnString.degrees[Math.floor(Math.random() * degreesOnString.degrees.length)];

        const stringNames: { [index: number]: string } = {0: '1st', 1: '2nd', 2: '3rd', 3: '4th', 4: '5th', 5: '6th'};
        const stringName = stringNames[this.currentString];

        return {
            question: `In the key of ${this.scale.root.name}, where do you find the ${this.currentDegree.text} on the ${stringName} string?`,
            degree: this.currentDegree,
            note: this.scale.noteFromDegree(this.currentDegree),
        };
    }

    validateAnswer(selection: FretboardData): boolean {
        const correct = new FretboardData();
        correct.setDegree(this.currentDegree, this.scale);
        correct.filter(position => position.string === this.currentString);
        correct.clip(
            this.fretboardSettings.firstFret,
            this.fretboardSettings.lastFret,
            this.fretboardSettings.openStrings
        );

        return selection.equals(correct);
    }
}
