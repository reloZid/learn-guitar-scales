function show_degree(note) {
    note.find(".degree").show();
}

function hide_degree(note) {
    let degree = note.find(".degree");

    if (degree.is(":visible")) {
        degree.hide();

        if (note.hasClass("highlight")) {
            highlight_note(note.parents(".guitar_neck"));
        }
    }
}

function highlight_note(table) {
    let notes = table.find(".note").not(".reference").not(".highlight");
    table.find(".note").removeClass("highlight");
    notes.random().addClass("highlight");
}

$(document).ready(function() {
    let notes = $(".note");

    notes.not(".reference").find(".degree").hide();

    notes.not(".reference").mousedown(function () {
        show_degree($(this));
    }).mouseup(function () {
        hide_degree($(this));
    }).mouseleave(function () {
        hide_degree($(this));
    });

    $.fn.random = function() {
        return this.eq(Math.floor(Math.random() * this.length));
    };

    $(".guitar_neck").each(function() {
        highlight_note($(this));
    });
});