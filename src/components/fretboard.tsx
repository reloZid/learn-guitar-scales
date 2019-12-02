import React from "react";

import {FretboardContent, FretboardData, FretboardPosition} from "../model/fretboard-data";

const style = {
    stringSpacing: 55,
    fretSpacing: 120,
    markerSize: 30,
    noteSize: 40,
    openNoteSize: 35,
    scaleDegreeColors: [
        'black',
        'darkred',
        'firebrick',
        'darkgreen',
        'limegreen',
        'gold',
        'skyblue',
        'darkblue',
        'purple',
        'mediumpurple',
        'teal',
        'turquoise',
    ],
};

export interface FretboardSettings {
    firstFret: number,
    lastFret: number,
    openStrings: boolean,
    labels: 'notes' | 'scale-degrees',
}

type Props = {
    settings: FretboardSettings,
    data: FretboardData,
    onClick?: (position: FretboardPosition) => void,
}

export class Fretboard extends React.Component<Props, {}> {
    render() {
        const rows = [];
        for (let string = 0; string < FretboardData.getStringCount(); string++) {
            const cols = [];
            for (let fret = this.props.settings.firstFret; fret < this.props.settings.lastFret + 1; fret++) {
                cols.push(this.renderPosition({string, fret}));
            }
            rows.push(<tr key={string}>{cols}</tr>)
        }

        const tableStyle = {
            marginLeft: this.props.settings.openStrings ? style.openNoteSize : 0,
        };

        return (
            <div id="fretboard">
                <table style={tableStyle}>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
            </div>
        );
    }

    private renderPosition(position: FretboardPosition) {
        const hasSingleMarker = [3, 5, 7, 9].includes(position.fret % 12) && position.string === 2;
        const hasDoubleMarker = position.fret % 12 === 0 && (position.string === 1 || position.string === 3);
        const hasOpenNote = position.fret === this.props.settings.firstFret && this.props.settings.openStrings;
        const openPosition = {string: position.string, fret: 0};

        const cellStyle = {
            width: style.fretSpacing,
            minWidth: style.fretSpacing,
            height: style.stringSpacing,
        };

        return (
            <td style={cellStyle} key={position.fret}>
                {(hasSingleMarker || hasDoubleMarker) && Fretboard.renderMarker()}
                {hasOpenNote && this.renderOpenNote(openPosition, this.props.data.getPosition(openPosition))}
                {this.renderNote(position, this.props.data.getPosition(position))}
            </td>
        );
    }

    private static renderMarker() {
        const markerStyle = {
            left: style.fretSpacing / 2 - style.markerSize / 2,
            top: style.stringSpacing - style.markerSize / 2,
            width: style.markerSize,
            height: style.markerSize,
            borderRadius: style.markerSize / 2,
        };

        return <div className="marker" style={markerStyle}/>;
    }

    private renderOpenNote(position: FretboardPosition, content?: FretboardContent) {
        const noteStyle = {
            left: -style.openNoteSize,
            width: style.openNoteSize,
            height: style.stringSpacing,
        };

        const contentStyle = {
            top: style.stringSpacing / 2 - style.openNoteSize / 2,
            width: style.openNoteSize,
            height: style.openNoteSize,
            borderRadius: style.openNoteSize / 2,
            lineHeight: (style.openNoteSize - 3) + 'px',
            backgroundColor: style.scaleDegreeColors[content && content.degree.value || 0],
        };

        return (
            <div className="open-note" style={noteStyle} onClick={() => this.onClick(position)}>
                {content && (
                    <div className="note-content" style={contentStyle}>
                        {this.props.settings.labels == "notes" ? content.note.name : content.degree.name}
                    </div>
                )}
            </div>
        );
    }

    private renderNote(position: FretboardPosition, content?: FretboardContent) {
        const contentStyle = {
            left: style.fretSpacing / 2 - style.noteSize / 2,
            top: style.stringSpacing / 2 - style.noteSize / 2,
            width: style.noteSize,
            height: style.noteSize,
            borderRadius: style.noteSize / 2,
            lineHeight: (style.noteSize - 3) + 'px',
            backgroundColor: style.scaleDegreeColors[content && content.degree.value || 0],
        };

        return (
            <div className="note" onClick={() => this.onClick(position)}>
                {content && (
                    <div className="note-content" style={contentStyle}>
                        {this.props.settings.labels == "notes" ? content.note.name : content.degree.name}
                    </div>
                )}
            </div>
        );
    }

    private onClick(position: FretboardPosition) {
        if (this.props.onClick) {
            this.props.onClick(position);
        }
    }
}
