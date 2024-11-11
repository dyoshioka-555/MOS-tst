Array.prototype.shuffle = function () {
    var i = this.length;
    while (i) {
        var j = Math.floor(Math.random() * i);
        var t = this[--i];
        this[i] = this[j];
        this[j] = t;
    }
    return this;
}

Array.prototype.zip = function (...args) {
    const new_array = [];
    for (let i = 0; i < this.length; i++) {
        new_array.push([this[i], ...args.map(arg => arg[i])]);
    }
    return new_array;
}

// invalid enter key
function invalid_enter() {
    if (window.event.keyCode == 13) {
        return false;
    }
}

// start experiment
function start_experiment() {
    // get user name
    var name = document.getElementById("name").value.replace(" ", "_");
    if (name == "") {
        alert("Please enter your name.");
        return false;
    }

    // get setlist number
    var set_num = "0"
    var number = document.getElementsByName("set");
    for (var i = 0; i < number.length; i++) {
        if (number[i].checked) {
            set_num = number[i].value;
        }
    }
    if (set_num == "0") {
        alert("Please press the setlist number button.");
        return false;
    }

    // convert display
    Display();

    // read filepath

    var method_paths = [];

    method_paths.push(wav_dir + "set" + set_num + "/ori.list");
    method_paths.push(wav_dir + "set" + set_num + "/Fastspeech2.list");
    method_paths.push(wav_dir + "set" + set_num + "/DVT.list");

    file_list = makeFileList(method_paths);
    console.log(file_list);
    outfile = name + "_set" + set_num + ".csv";
    scores = (new Array(file_list.length)).fill(0);
    eval = document.getElementsByName("eval");
    outfile = name + "_set" + set_num + ".csv";
    init()
}

// convert display
function Display() {
    document.getElementById("Display1").style.display = "none";
    document.getElementById("Display2").style.display = "block";
}

function loadText(filename) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", filename, false);
    xhr.send(null);
    var list = xhr.responseText.split(/\r\n|\r|\n/);
    list.pop();

    return list;
}

// make file list
function makeFileList(method_paths) {
    var files = [];
    for (var i = 0; i < method_paths.length; i++) {
        tmp = loadText(method_paths[i]);
        files = files.concat(tmp);
    }
    files.shuffle();
    return files;
}


function setAudio() {
    document.getElementById("page").textContent = "" + (n + 1) + "/" + scores.length;
    document.getElementById("audio").innerHTML = 'Voice:<br>'
        + '<audio id="audio1" src="' + file_list[n]
        + '" controls preload="auto">'
        + '</audio>';

}


function init() {
    n = 0;
    setAudio();
    evalCheck();
    setButton();
}
function evalCheck() {
    const c = scores[n];
    if ((c <= 0) || (c > eval.length)) {
        for (var i = 0; i < eval.length; i++) {
            eval[i].checked = false;
        }
    }
    else {
        eval[5 - c].checked = true;
    }
}


function setButton() {
    if (n == (scores.length - 1)) {
        document.getElementById("prev").disabled = false;
        document.getElementById("next2").disabled = true;
        document.getElementById("finish").disabled = true;
        for (var i = 0; i < eval.length; i++) {
            if (eval[i].checked) {
                document.getElementById("finish").disabled = false;
                break;
            }
        }
    }
    else {
        if (n == 0) {
            document.getElementById("prev").disabled = true;
        }
        else {
            document.getElementById("prev").disabled = false;
        }
        document.getElementById("next2").disabled = true;
        document.getElementById("finish").disabled = true;
        for (var i = 0; i < eval.length; i++) {
            if (eval[i].checked) {
                document.getElementById("next2").disabled = false;
                break;
            }
        }
    }
}

function evaluation() {
    for (var i = 0; i < eval.length; i++) {
        if (eval[i].checked) {
            scores[n] = 5 - i;
        }
    }
    setButton();
}


function exportCSV() {
    var csvData = "";
    for (var i = 0; i < file_list.length; i++) {
        csvData += "" + file_list[i] + ","
            + scores[i] + "\r\n";
    }

    const link = document.createElement("a");
    document.body.appendChild(link);
    link.style = "display:none";
    const blob = new Blob([csvData], { type: "octet/stream" });
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = outfile;
    link.click();
    window.URL.revokeObjectURL(url);
    link.parentNode.removeChild(link);
}

function next() {
    n++;
    setAudio();
    evalCheck();
    setButton();
}

function prev() {
    n--;
    setAudio();
    evalCheck();
    setButton();
}

function finish() {
    exportCSV();
}


// --------- 設定 --------- //

// directory name
const wav_dir = "wav/";

// invalid enter key
document.onkeypress = invalid_enter();

//var natural;
var method1;
var method2;
var method3;
//var method4;

var outfile;
var file_list;
var scores;


// ローカルで行う場合はloadText()は動作しないため
var n = 0;
var eval = document.getElementsByName("eval");
//var eval3 = document.getElementsByName("eval3");