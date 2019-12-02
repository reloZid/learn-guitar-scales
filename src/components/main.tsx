import "bootstrap"
import "bootstrap/dist/css/bootstrap.css"
import "@fortawesome/fontawesome-free/css/all.css"
import "../style.css"

import React from "react";
import ReactDOM from "react-dom";
import {FretboardSettings} from "./fretboard";
import {FretboardData} from "../model/fretboard-data";
import {Scale} from "../model/scale";
import {Setup} from "./setup";
import {Exercise} from "./exercise";
import {MarkDegreeExercise} from "../exercises/mark-degree-exercise";

type State = {
    mode: 'setup' | 'exercise',
    scale: Scale,
    fretboardSettings: FretboardSettings,
    fretboardData: FretboardData,
}

export class Main extends React.Component<{}, State> {
    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            mode: 'setup',
            scale: Setup.getDefaultScale(),
            fretboardSettings: Setup.getDefaultFretboardSettings(),
            fretboardData: FretboardData.forScale(Setup.getDefaultScale()),
        };
    }

    render() {
        return (
            <div className="container">
                <h1>Learn Guitar Scales</h1>
                {this.state.mode === "setup" && (
                    <Setup
                        fretboardSettings={this.state.fretboardSettings}
                        scale={this.state.scale}
                        onFretboardSettingsChanged={this.onFretboardSettingsChanged.bind(this)}
                        onScaleChanged={this.onScaleChanged.bind(this)}
                        onStart={this.onStart.bind(this)}
                    />
                )}
                {this.state.mode === "exercise" && (
                    <Exercise
                        fretboardSettings={this.state.fretboardSettings}
                        scale={this.state.scale}
                        controller={new MarkDegreeExercise(this.state.fretboardSettings, this.state.scale)}
                    />
                )}
            </div>
        );
    }

    onFretboardSettingsChanged(fretboardSettings: FretboardSettings) {
        this.setState({fretboardSettings});
    }

    onScaleChanged(scale: Scale) {
        this.setState({scale, fretboardData: FretboardData.forScale(scale)});
    }

    onStart() {
        this.setState({mode: "exercise"});
    }
}

ReactDOM.render(<Main/>, document.getElementById('root'));
