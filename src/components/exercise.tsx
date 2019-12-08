import React from "react";
import {Fretboard, FretboardSettings} from "./fretboard";
import {Scale} from "../model/scale";
import {FretboardData, FretboardPosition} from "../model/fretboard-data";
import {ScaleDegree} from "../model/scale-degree";

export interface ExerciseController {
    validateAnswer(selection: FretboardData): boolean

    nextQuestion(): { question: string, degree: ScaleDegree }
}

type Props = {
    fretboardSettings: FretboardSettings,
    scale: Scale,
    controller: ExerciseController,
};

type State = {
    selection: FretboardData,
    question: string,
    degree: ScaleDegree,
    wrongAnswer: boolean,
};

export class Exercise extends React.Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            wrongAnswer: false,
            selection: new FretboardData(this.props.scale),
            ...this.props.controller.nextQuestion(),
        };
    }

    render() {
        return (
            <div id="exercise">
                <Fretboard
                    settings={this.props.fretboardSettings}
                    data={this.state.selection}
                    onClick={this.onClickNote.bind(this)}
                />
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Drill</h5>
                        <div id="exercise-content">
                            <div id="exercise-text">
                                {!this.state.wrongAnswer && this.state.question}
                                {this.state.wrongAnswer && (
                                    <span className="wrong"><strong>Wrong!</strong> Try again.</span>
                                )}
                            </div>
                            {!this.state.wrongAnswer && (
                                <div id="exercise-buttons">
                                    <button type="submit" className="btn btn-primary"
                                            onClick={this.onNext.bind(this)}>Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private onClickNote(position: FretboardPosition) {
        const newSelection = this.state.selection.clone();
        if (this.state.selection.getPosition(position)) {
            newSelection.clearPosition(position);
        } else {
            newSelection.setPosition(position, this.state.degree);
        }
        this.setState({selection: newSelection});
    }

    private onNext() {
        if (this.props.controller.validateAnswer(this.state.selection)) {
            this.setState({
                selection: new FretboardData(this.props.scale),
                ...this.props.controller.nextQuestion()
            });
        } else {
            this.setState({wrongAnswer: true});
            setTimeout(() => this.setState({wrongAnswer: false}), 1500);
        }
    }
}