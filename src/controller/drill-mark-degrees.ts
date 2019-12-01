import {Fretboard, NotePosition} from "../view/fretboard";
import {Scale} from "../model/scale";
import {ScaleDegree} from "../model/scale-degree";
import {Drill} from "../view/drill";

export class DrillMarkDegrees {
    private fretboard: Fretboard;
    private drill: Drill;
    private scale: Scale;

    private currentDegree: ScaleDegree;
    private selectedPositions: NotePosition[] = [];

    constructor(fretboard: Fretboard, drill: Drill, scale: Scale) {
        this.fretboard = fretboard;
        this.drill = drill;
        this.scale = scale;
        this.currentDegree = this.scale.degrees[0];

        this.next();

        this.fretboard.onClick((position) => {
            if (this.isPositionSelected(position)) {
                this.unselectPosition(position);
            } else {
                this.selectPosition(position);
            }
        });

        this.drill.onNext(() => {
            if (this.validate()) {
                this.next();
            } else {
                this.drill.wrongTryAgain();
            }
        });
    }

    private validate(): boolean {
        let correctPositions = this.fretboard.visiblePositions(this.scale.note(this.currentDegree));

        if (this.selectedPositions.length !== correctPositions.length) {
            return false;
        }

        for (let position of correctPositions) {
            if (!this.isPositionSelected(position)) {
                return false;
            }
        }

        return true;
    }

    private next() {
        this.fretboard.hideNotes();
        this.selectedPositions = [];

        this.chooseRandomDegree();
        this.drill.question(`In the key of ${this.scale.root.name}, where do you find the ${this.currentDegree.text}?`);
    }

    private isPositionSelected(position: NotePosition): boolean {
        return this.selectedPositions.some(item => item.string === position.string && item.fret === position.fret);
    }

    private selectPosition(position: NotePosition) {
        this.fretboard.showNoteAs(position, <ScaleDegree>this.currentDegree);
        this.selectedPositions.push(position);
    }

    private unselectPosition(position: NotePosition) {
        this.fretboard.hideNote(position);
        this.selectedPositions = this.selectedPositions.filter(item => item.string !== position.string && item.fret !== position.fret);
    }

    private chooseRandomDegree() {
        const lastDegree = this.currentDegree;

        while (this.currentDegree === lastDegree) {
            this.currentDegree = this.scale.degrees[Math.floor(Math.random() * this.scale.degrees.length)];
        }
    }
}
