import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.css'
import './style.css'

import 'bootstrap'
import $ from 'jquery'

import {Fretboard} from "./fretboard";
import {Setup} from "./setup";

$(function() {
    new Setup(new Fretboard());
});
