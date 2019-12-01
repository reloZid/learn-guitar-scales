import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '../style.css'

import 'bootstrap'
import $ from "jquery";

import {Fretboard} from "../view/fretboard";
import {DrillMarkDegrees} from "./drill-mark-degrees";
import {Setup} from "../view/setup";
import {DrillMenu} from "../view/drill-menu";
import {FretboardData} from "../model/fretboard-data";

$(function() {
    new Main();
});

export class Main {
    private fretboard: Fretboard = new Fretboard();
    private drill: DrillMenu = new DrillMenu();
    private setup: Setup = new Setup();

    constructor() {
        this.setup.onChange(() => this.updateFretboard());
        this.setup.onStart(() => this.start());
        this.updateFretboard();
    }

    private updateFretboard() {
        const settings = this.setup.fretboardSettings;
        this.fretboard.setup(settings);

        const data = new FretboardData(this.setup.scale);
        data.setScale(settings.firstFret, settings.lastFret);
        this.fretboard.showData(data);
    }

    private start() {
        this.setup.hide();
        this.drill.show();

        new DrillMarkDegrees(this.fretboard, this.drill, this.setup.scale);
    }
}
