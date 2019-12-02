import {Fretboard} from "../view/fretboard";
import {Scale} from "../model/scale";
import {ScaleDegree} from "../model/scale-degree";
import {DrillMenu} from "../view/drill-menu";
import {FretboardData} from "../model/fretboard-data";

export class DrillMarkDegrees {
    private readonly fretboard: Fretboard;
    private readonly drillMenu: DrillMenu;
    private readonly scale: Scale;

    private readonly selection: FretboardData;
    private currentDegree: ScaleDegree;

    constructor(fretboard: Fretboard, drillMenu: DrillMenu, scale: Scale) {
        this.fretboard = fretboard;
        this.drillMenu = drillMenu;
        this.scale = scale;
        this.currentDegree = this.scale.degrees[0];
        this.selection = new FretboardData(scale);

        this.next();

        this.fretboard.onClick((position) => {
            if (this.selection.getContent(position) !== null) {
                this.selection.clearContent(position);
            } else {
                this.selection.setContent(position, this.currentDegree);
            }
            this.fretboard.showData(this.selection);
        });

        this.drillMenu.onNext(() => {
            if (this.validate()) {
                this.drillMenu.correct(() => this.next());
            } else {
                this.drillMenu.wrongTryAgain();
            }
        });
    }

    private validate(): boolean {
        const settings = this.fretboard.settings;
        const currentNote = this.scale.note(this.currentDegree);
        const correct = new FretboardData(this.scale);

        correct.setNote(currentNote, settings.firstFret, settings.lastFret);
        if (settings.openStrings) {
            correct.setNote(currentNote, 0, 0);
        }

        return this.selection.equals(correct);
    }

    private next() {
        this.selection.reset();
        this.fretboard.showData(this.selection);

        const lastDegree = this.currentDegree;
        while (this.currentDegree === lastDegree) {
            this.currentDegree = this.scale.degrees[Math.floor(Math.random() * this.scale.degrees.length)];
        }

        this.drillMenu.question(`In the key of ${this.scale.root.name}, where do you find the ${this.currentDegree.text}?`);
    }

}
