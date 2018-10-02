function show_degree(note) {
    note.find(".degree").show();
}

function hide_degree(note) {
    let degree = note.find(".degree");

    if (degree.is(":visible")) {
        degree.hide();

        if (note.hasClass("highlight")) {
            highlight_note(note.parents(".fretboard"));
        }
    }
}

function highlight_note(table) {
    let notes = table.find(".note").not(".reference").not(".highlight");
    table.find(".note").removeClass("highlight");
    notes.random().addClass("highlight");
}

function generate_fretboard(start_fret, fret_count, degrees) {
    let html = '<table class="fretboard">';

    let tuning = {
        1: 0,
        2: 7,
        3: 3,
        4: 10,
        5: 5,
        6: 0,
    };

    let degree_names = {
        0: 'R',
        1: 'b2',
        2: '2',
        3: 'b3',
        4: '3',
        5: '4',
        6: 'b5',
        7: '5',
        8: 'b6',
        9: '6',
        10: 'b7',
        11: '7',
    };

    for (let string = 1; string <= 6; string++) {
        html += '<tr>';

        for (let fret = start_fret; fret < start_fret + fret_count; fret++) {
            let degree = (tuning[string] + fret) % 12;
            let degree_name = degree_names[degree];

            html += '<td>';

            if (degrees.indexOf(degree) >= 0) {
                html += '<div class="note"><div class="degree">' + degree_name + '</div></div>';
            }

            html += '</td>';
        }

        html += '</tr>';
    }

    html += '</table>';

    return html;
}

$(document).ready(function() {
    $.fn.random = function() {
        return this.eq(Math.floor(Math.random() * this.length));
    };

    let minor_pentatonic = [ 0, 3, 5, 7, 10 ];
    //let major_pentatonic = [ 0, 2, 4, 7, 9 ];
    $("#min_pent_6").html(generate_fretboard(0, 4, minor_pentatonic));
    $("#min_pent_4").html(generate_fretboard(2, 4, minor_pentatonic));
    $("#min_pent_2").html(generate_fretboard(4, 4, minor_pentatonic));
    $("#min_pent_5").html(generate_fretboard(7, 4, minor_pentatonic));
    $("#min_pent_3").html(generate_fretboard(9, 4, minor_pentatonic));

    let notes = $(".note");
    notes.not(".reference").find(".degree").hide();
    notes.not(".reference").mousedown(function () {
        show_degree($(this));
    }).mouseup(function () {
        hide_degree($(this));
    }).mouseleave(function () {
        hide_degree($(this));
    });

    $(".fretboard").each(function() {
        highlight_note($(this));
    });
});