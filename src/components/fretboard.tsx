import React from "react";

import {FretboardData, FretboardPosition} from "../model/fretboard-data";

const style = {
    maxFretSpacing: 120,
    stringSpacing: 55,
    markerSize: 30,
    noteSize: 40,
    openNoteSize: 35,
    scaleDegreeColors: [
        'black',
        'darkred',
        'firebrick',
        'darkgreen',
        'limegreen',
        'goldenrod',
        'skyblue',
        'darkblue',
        'purple',
        'mediumpurple',
        'teal',
        'turquoise',
    ],
    patternBorder: 'black solid 2px',
};

export interface FretboardSettings {
    firstFret: number,
    lastFret: number,
    openStrings: boolean,
    labels: 'notes' | 'scale-degrees',
    pattern: boolean,
}

type Props = {
    settings: FretboardSettings,
    data: FretboardData,
    pattern?: FretboardData,
    onClick?: (position: FretboardPosition) => void,
}

type State = {
    fretSpacing: number,
    additionalFrets: number,
}

export class Fretboard extends React.PureComponent<Props, State> {
    private container = React.createRef<HTMLDivElement>();

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            fretSpacing: 0,
            additionalFrets: 0,
        };

        this.updateDimensions = this.updateDimensions.bind(this);
    }

    render() {
        let firstFret = this.props.settings.firstFret - Math.floor(this.state.additionalFrets / 2);
        let lastFret = this.props.settings.lastFret + Math.ceil(this.state.additionalFrets / 2);

        while (firstFret < 1) {
            firstFret++;
            lastFret++;
        }

        const rows = [];
        for (let string = 0; string < FretboardData.getStringCount(); string++) {
            const cols = [];
            for (let fret = firstFret; fret < lastFret + 1; fret++) {
                cols.push(this.renderPosition({string, fret}, fret === firstFret));
            }
            rows.push(<tr key={string}>{cols}</tr>)
        }

        const tableStyle = {
            marginLeft: this.props.settings.openStrings ? style.openNoteSize : 0,
        };

        return (
            <div id="fretboard" ref={this.container}>
                <table style={tableStyle}>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
            </div>
        );
    }

    private renderPosition(position: FretboardPosition, isFirstFret: boolean) {
        const hasMarkerText = [3, 5, 7, 9, 0].includes(position.fret % 12) && position.string === 0;
        const hasSingleMarker = [3, 5, 7, 9].includes(position.fret % 12) && position.string === 2;
        const hasDoubleMarker = position.fret % 12 === 0 && (position.string === 1 || position.string === 3);
        const hasOpenNote = isFirstFret && this.props.settings.openStrings;
        const openPosition = {string: position.string, fret: 0};
        const isAdditionalFret = position.fret < this.props.settings.firstFret || position.fret > this.props.settings.lastFret;

        const cellStyle = {
            width: this.state.fretSpacing,
            minWidth: this.state.fretSpacing,
            height: style.stringSpacing,
        };

        return (
            <td style={cellStyle} key={position.fret} className={isAdditionalFret ? "inactive" : ""}>
                {hasMarkerText && this.renderMarkerText(position.fret)}
                {(hasSingleMarker || hasDoubleMarker) && this.renderMarker()}
                {hasOpenNote && this.renderNote(openPosition)}
                {this.renderNote(position)}
            </td>
        );
    }

    private renderMarker() {
        const markerStyle = {
            left: this.state.fretSpacing / 2 - style.markerSize / 2,
            top: style.stringSpacing - style.markerSize / 2,
            width: style.markerSize,
            height: style.markerSize,
            borderRadius: style.markerSize / 2,
        };

        return <div className="marker" style={markerStyle}/>;
    }

    private renderMarkerText(fret: number) {
        const markerTextStyle = {
            width: this.state.fretSpacing,
        };

        return <div className="marker-text" style={markerTextStyle}>{fret}</div>;
    }

    private renderNote(position: FretboardPosition) {
        const openNote = position.fret === 0;
        const noteSize = openNote ? style.openNoteSize : style.noteSize;

        const noteStyle: { [index: string]: string | number } = {};

        if (openNote) {
            noteStyle.width = noteSize;
            noteStyle.height = style.stringSpacing;
            noteStyle.left = -noteSize;
        }

        return (
            <div className={openNote ? "open-note" : "note"} style={noteStyle} onClick={() => this.onClick(position)}>
                {this.renderNoteContent(position)}
            </div>
        );
    }

    private renderNoteContent(position: FretboardPosition) {
        const content = this.props.data.getPosition(position);
        const pattern = !content && this.props.settings.pattern && this.props.pattern && this.props.pattern.getPosition(position) !== undefined;

        if (!content && !pattern) {
            return [];
        }

        const openNote = position.fret === 0;
        const noteSize = openNote ? style.openNoteSize : style.noteSize;

        const contentStyle: { [index: string]: string | number } = {
            top: style.stringSpacing / 2 - noteSize / 2,
            left: openNote ? 0 : this.state.fretSpacing / 2 - noteSize / 2,
            width: noteSize,
            height: noteSize,
            borderRadius: noteSize / 2,
            lineHeight: (noteSize - 3) + 'px',
        };

        let contentText = "";
        if (content) {
            contentText = this.props.settings.labels === "notes" ? content.note.name : content.degree.name;
            contentStyle.backgroundColor = style.scaleDegreeColors[content.degree.value];
        } else if (pattern) {
            contentStyle.border = style.patternBorder;
        }

        return (
            <div className="note-content" style={contentStyle}>
                {contentText}
            </div>
        );
    }

    private onClick(position: FretboardPosition) {
        if (this.props.onClick) {
            this.props.onClick(position);
        }
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    componentDidUpdate() {
        this.updateDimensions();
    }

    private updateDimensions() {
        if (!this.container.current) {
            return;
        }

        let containerWidth = this.container.current.clientWidth;
        if (this.props.settings.openStrings) {
            containerWidth -= style.openNoteSize;
        }

        const fretCount = this.props.settings.lastFret - this.props.settings.firstFret + 1;
        let fretSpacing = containerWidth / fretCount;
        let additionalFrets = 0;

        while (fretSpacing > style.maxFretSpacing) {
            additionalFrets++;
            fretSpacing = containerWidth / (fretCount + additionalFrets);
        }

        this.setState({
            fretSpacing,
            additionalFrets,
        });
    }
}
