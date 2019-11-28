import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '../style.css'

import 'bootstrap'
import $ from "jquery";

import {Fretboard} from "../view/fretboard";
import {DrillMarkDegrees} from "./drill-mark-degrees";
import {Setup} from "../view/setup";
import {Drill} from "../view/drill";

$(function() {
    new Main();
});

export class Main {
    private fretboard: Fretboard = new Fretboard();
    private drill: Drill = new Drill();
    private setup: Setup = new Setup();

    constructor() {
        this.setup.onChange(() => this.updateFretboard());
        this.setup.onStart(() => this.start());
        this.updateFretboard();
    }

    private updateFretboard() {
        this.fretboard.setup(this.setup.fretboardSettings);
        this.fretboard.showScale(this.setup.scale, this.setup.showDegrees);
    }

    private start() {
        this.fretboard.hideNotes();

        this.setup.hide();
        this.drill.show();

        new DrillMarkDegrees(this.fretboard, this.drill, this.setup.scale);
    }
}
