import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.css'
import './style.css'

import 'bootstrap'
import $ from 'jquery'

import {Fretboard} from "./view/fretboard";
import {Setup} from "./controller/setup";

$(function() {
    new Setup(new Fretboard());
});
