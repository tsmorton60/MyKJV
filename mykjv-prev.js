
// Copyright 2022
// Timothy S Morton 
// www.mykjv.com


import TinyGesture from '/tinyGesture.js';
//import {avBib} from '/kjv.js';

import {headingsAV} from '/headings.js';
//import {headings1611} from '/headings1611.js';

//import {define} from '/definitions.js';
//const defineList = Object.keys(define);

//import {notes} from '/footNotes.js';
//const notesList = Object.keys(notes);

//import {bookIdx} from '/bookIdx.js';

//import {fixBook, refTagRE} from '/findRefs.js';

var avBib;
var av1611Bib;
var topBibText;
var currBibText;
var currBibVer = 'kjv';
var currBibVer2 = 'kjv1611';

var topicsMod;
var bookIdx;
var define;
var notes;
var headings1611;

var showTimer = 0;
var hideTimer = 0;
var delay = 300;
var container;
var popup;
var chMaxInt = 0;
var bkIdx = 0;
var selectedVss = [];
var selectedListVss = [];

var bibSplit = false;
var doBibBottom = false
var syncLock = true

var refList = JSON.parse(localStorage.getItem('refList'));
if (!refList) {
	var refList = [];
}

var showXrefs = false;

var currTab = 'bible';
var schScrollPos = 0;
var listScrollPos = 0;

var popTxts;
var popBook;
var popChapInt;
var currentChap;
var currentChap2;

var currentBook;
var titlesData;
var currTitleFN;
var currChapTitle;

var devTitlesData;
var currDevDate;

var clrFrom;
var clrTo;
var clrRow;

var helpContainer = null;
var helpWin = null;

var promisesLoaded = false;
var topicsLoaded = false;

var inTouchEvt = false;
var currentPosX;
var currentPosY;

var tska;
var txtsMod;

var avGothicFont = false;

var isAccount = false;

var showWelcome = (localStorage.getItem('showWelcome') || 'true') == 'true'
var showRedLetters = (localStorage.getItem('redLetters') || 'true') == 'true'

var showHeadings = (localStorage.getItem('showHeadings') || 'true') == 'true';
var paraMode = localStorage.getItem('showPara') == 'true';
var bibHiliteValue = (localStorage.getItem('bibHilite') || 'true') == 'true';
var fontState = (localStorage.getItem('fontState') || 'false') == 'true';
var doEpub = (localStorage.getItem('doEpub') || 'false') == 'true';

// Convert setting to boolean. (localstorage only returns strings?)
//var paraMode = getPara === 'true';
//var bibHiliteValue = getbibHilite === 'true';
//var fontState = getFontState === 'true';

//var doEpub = getDoEpub === 'true';
//var showHeadings = getHeadings === 'true';

var refPos = (localStorage.getItem('refPos') || 1);
var fontSize = (localStorage.getItem('fontSize') || 0);
var colorTheme = (localStorage.getItem('colorIdx') || 0);
var acctNum = (localStorage.getItem('acctNum') || '');

var url = 'https://www.mykjv.com/data/';
var acctNum = 'titles';

//var url = 'http://localhost:8080/legacy/';



function toTitleCase(str) {
  return str.replace(/\p{L}+('\p{L}+)?/gu, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1)
  })
}


function setTheme() {

	// Brown
	if (colorTheme == 0) {
		clrFrom = "#FFFCED";
		clrTo = "#F7F2BB";
		clrRow = "#FFFBE7";

	// Gray
	} else if (colorTheme == 1) {
		clrFrom = "#FDFDFD";
		clrTo = "#EBEBEB";
		clrRow = "#F4F4F4";

	// Red
	} else if (colorTheme == 2) {
		clrFrom = "#FFF5F5";
		clrTo = "#FFDEDE";
		clrRow = "#FFF1F1";

	// Green
	} else if (colorTheme == 3) {
		clrFrom = "#F8FFF8";
		clrTo = "#DBFFDC";
		clrRow = "#EEFFEE";

	// Blue
	} else if (colorTheme == 4) {
		clrFrom = "#F6F6FF";
		clrTo = "#D8D8FA";
		clrRow = "#EFEFFF";
	}

	var heads = document.getElementsByClassName("head1");
	var foots = document.getElementsByClassName("foot1");

	for (var el of heads) { 
		el.style["background-image"] = 'linear-gradient(' + clrFrom + ', ' + clrTo + ')';
	}
	for (var el of foots) {
		el.style["background-image"] = 'linear-gradient(' + clrFrom + ', ' + clrTo + ')';
	}
    
    document.getElementById('bibDivider').style["background-image"] = 'linear-gradient(' + clrFrom + ', ' + clrTo + ')';
    
	var button = document.getElementsByClassName("tabButton");
    for (var e of button) {
        e.style["background-color"] = clrTo;
    }
	
	document.getElementById('libTitleBar').style["background-color"] = clrTo;
	document.getElementById('devTitleBar').style["background-color"] = clrTo;
    document.getElementById('topicTitleBar').style["background-color"] = clrTo;
	//var tabs = document.getElementsByClassName('libTab')
    //for (var e of tabs) {
    //    e.style["background-color"] = clrTo;
    //}
	
}

setTheme();


var isMobile = false;
if (/Mobi|Android/i.test(navigator.userAgent)) {
    isMobile = true;
}

function isTouch() { 
    return ( 'ontouchstart' in window ) ||  
           ( navigator.maxTouchPoints > 0 ); 
} 

console.log('Is touch = ' + isTouch()); 
console.log('Is mobile = ' + isMobile); 


var fullBook = {
	'Gen': 'Genesis', 'Exo': 'Exodus', 'Lev': 'Leviticus', 'Num': 'Numbers', 'Deu': 'Deuteronomy', 
	'Jos': 'Joshua', 'Jdg': 'Judges', 'Rth': 'Ruth', '1Sa': '1 Samuel', '2Sa': '2 Samuel', '1Ki': '1 Kings', 
	'2Ki': '2 Kings', '1Ch': '1 Chronicles', '2Ch': '2 Chronicles', 'Ezr': 'Ezra', 'Neh': 'Nehemiah', 
	'Est': 'Esther', 'Job': 'Job', 'Psa': 'Psalms', 'Pro': 'Proverbs', 'Ecc': 'Eccles.', 
	'Son': 'Song Solom.', 'Isa': 'Isaiah', 'Jer': 'Jeremiah', 'Lam': 'Lament.', 'Eze': 'Ezekiel', 
	'Dan': 'Daniel', 'Hos': 'Hosea', 'Joe': 'Joel', 'Amo': 'Amos', 'Oba': 'Obadiah', 'Jon': 'Jonah', 
	'Mic': 'Micah', 'Nah': 'Nahum', 'Hab': 'Habbakkuk', 'Zep': 'Zephaniah', 'Hag': 'Haggai', 'Zec': 'Zechariah', 
	'Mal': 'Malachi', 'Mat': 'Matthew', 'Mar': 'Mark', 'Luk': 'Luke', 'Joh': 'John', 'Act': 'Acts', 
	'Rom': 'Romans', '1Co': '1 Corinth.', '2Co': '2 Corinth.', 'Gal': 'Galatians', 'Eph': 'Ephesians', 
	'Phi': 'Philippians', 'Col': 'Colossians', '1Th': '1 Thess.', '2Th': '2 Thess.', 
	'1Ti': '1 Timothy', '2Ti': '2 Timothy', 'Tit': 'Titus', 'Phm': 'Philemon', 'Heb': 'Hebrews', 
	'Jam': 'James', '1Pe': '1 Peter', '2Pe': '2 Peter', '1Jo': '1 John', '2Jo': '2 John', '3Jo': '3 John', 
	'Jud': 'Jude', 'Rev': 'Revelation',
};

const bookList = Object.keys(fullBook);


var chapIdx = {
    "Gen": 50, "Exo": 40, "Lev": 27, "Num": 36, "Deu": 34, "Jos": 24, "Jdg": 21, "Rth": 4, "1Sa": 31, "2Sa": 24, 
	"1Ki": 22, "2Ki": 25, "1Ch": 29, "2Ch": 36, "Ezr": 10, "Neh": 13, "Est": 10, "Job": 42, "Psa": 150, "Pro": 31, 
	"Ecc": 12, "Son": 8, "Isa": 66, "Jer": 52, "Lam": 5, "Eze": 48, "Dan": 12, "Hos": 14, "Joe": 3, "Amo": 9, 
	"Oba": 1, "Jon": 4, "Mic": 7, "Nah": 3, "Hab": 3, "Zep": 3, "Hag": 2, "Zec": 14, "Mal": 4, "Mat": 28, 
	"Mar": 16, "Luk": 24, "Joh": 22, "Act": 28, "Rom": 16, "1Co": 16, "2Co": 13, "Gal": 6, "Eph": 6, "Phi": 4, 
	"Col": 4, "1Th": 5, "2Th": 3, "1Ti": 6, "2Ti": 4, "Tit": 3, "Phm": 1, "Heb": 13, "Jam": 5, "1Pe": 5, 
	"2Pe": 3, "1Jo": 5, "2Jo": 1, "3Jo": 1, "Jud": 1, "Rev": 22,
};

const bibBooks = Object.keys(chapIdx);

const headingsAVRefs = Object.keys(headingsAV);
//const headings1611Refs = Object.keys(headings1611);
var headings1611Refs;

const topicsDict = {						 
	"Precious Bible Promises I": "promises1",				
    "Precious Bible Promises II": "promises2",
    "Essential Bible Topics": "topics",
    "Composite Gospel Harmony": "cgi",
    "The Gospels Combined": "comGospel",
    "Jesus Is Called What...?": "titles", 
	"Jesus Commanded What...?": "commands",					 
	"Jesus Spoke With Whom...?": "discourses",					
	"Jesus Did What...?": "miracles",					
	"Jesus Said What...?": "parables",					
	"Jesus Taught What...?": "teachings",					
	"Jesus Asked What...?": "questions",					
	"Who Prayed in the Bible?": "prayers"
}    
						
const topicTitles = Object.keys(topicsDict);						
						

// Side Nav Menu

function openNav() {
  var nav = document.getElementById("sidenav");
  nav.style.backgroundColor = clrRow;
  nav.style.width = "250px";
  nav.style.border = '2px solid lightgray';
  nav.style.borderLeft = '0';
}

function closeNav() {
  var nav = document.getElementById("sidenav");	
  document.getElementById("sidenav").style.width = "0";
  nav.style.border = '0px solid lightgray';
}



function onTitles(evt) {
	var titlesWin = document.getElementById('titlesWin');

	var vScroll = window.pageYOffset || document.documentElement.scrollTop;

	titlesWin.style.top = vScroll + 130 + 'px';
	//titlesWin.style.backgroundColor = "#F7F7F7";
	titlesWin.style.display = 'block';
    console.log('on titles') 
	
}


async function onDevTitles(evt) {
	var titlesWin = document.getElementById('devWin');
	var vScroll = window.pageYOffset || document.documentElement.scrollTop;

	titlesWin.style.top = vScroll + 130 + 'px';
	titlesWin.style.display = 'block';
}



async function onBibSelect(evt) {
	var bibSelectWin = document.getElementById('bibSelectWin');
    var vertScroll = window.pageYOffset || document.documentElement.scrollTop;
    
	var cursorX = evt.pageX;
    var cursorY = evt.pageY;
	
    bibSelectWin.style.top = cursorY + 20 - vertScroll + 'px';
    bibSelectWin.style.left = cursorX + 10 + 'px';
	bibSelectWin.style.display = 'block';
}


async function onPicker(evt) {
	var pickerWin = document.getElementById('pickWin');
	
	var vScroll = window.pageYOffset || document.documentElement.scrollTop;

	pickerWin.style.top = vScroll + 75 + 'px';
	pickerWin.style.display = 'block';
	showBookGrid();
}


function showBookGrid(bk, idx) {
	var bookGrid = document.getElementById('bookGrid');
    bookGrid.innerHTML = "";
    
    for (let bk of bookList) {
        var cell = document.createElement("div");
        cell.className = "grid-item";
        cell.innerHTML = bk;
        cell.id = 'grid-' + bk;
        cell.addEventListener('click', function (evt){
            onBookPick(evt)
        });
        bookGrid.appendChild(cell);      
    };
};


function onBookPick(evt) {
	currentBook = evt.target.id.split('-')[1]; 
	var chaps = chapIdx[currentBook]
	chapGrid(chaps)
}


function chapGrid(chaps) {
	var chapGrid = document.getElementById('chapGrid');
	chapGrid.innerHTML = "";
	
    for (let i =1; i <= chaps; i++) {
	
		var cell = document.createElement("div");
		cell.className = "chap-grid-item";
		cell.innerHTML = i;
		cell.id = 'grid-' + i
		cell.addEventListener('click', function (evt){
			onChapPick(evt)
		});
		chapGrid.appendChild(cell);      
	};
	
	document.getElementById("chapTab").checked = true;
};

function onChapPick(evt) {
	var ch = evt.target.id.split('-')[1]; 
	document.getElementById("pickWin").style.display = 'none';
	
	var chap = currentBook + ' ' + ch + ':';
	
	var vsTxtList = displayBibChap(chap, []);
	
}


function buildHelpPage() {
	
	var helpWin = document.getElementById('helpWin');

	var left = 0;
	var fullW = window.innerWidth || document.documentElement.offsetWidth;
	var winW = fullW;
	if (fullW > 800) {
		winW = 800;
		left = fullW /2 - 800 /2;
	}
	
	var winH = window.innerHeight || document.documentElement.offsetHeight;
	var vScroll = window.pageYOffset || document.documentElement.scrollTop;

	helpWin.style.width = winW - 80 + 'px';
	helpWin.style.maxHeight = winH - 110 + 'px';
	
	helpWin.style.top = vScroll + 30 + 'px';
	//helpWin.style.left = left + 30 + 'px';
	
	return helpWin;
}



async function onHelp(evt) {
	
	closeNav();
	
	if (!txtsMod) {
		var txtsMod = await import('./texts.js');
	}
	
	var isSettings, txt; 
	if (evt.target.id === 'menuHelp') {
		txt = txtsMod.helpTxt;
	} else if (evt.target.id === 'menuAbout') {
		txt = txtsMod.aboutTxt;
	} else if (evt.target.id === 'menuWelcome') {
		txt = txtsMod.welcomeTxt;
	} else if (evt.target.id === 'menuSettings') {
		txt = txtsMod.settingsTxt;
		isSettings = true;
	} else if (evt.target.id === 'menuAccount') {
		txt = txtsMod.accountTxt;
        isAccount = true;
    }
	
	txt = '<span id="helpClose" class="closebtn">X</span>' + txt;
    
	var helpWin = buildHelpPage();
	
	helpWin.style.backgroundColor = clrRow;
	helpWin.innerHTML = txt;
	
    
    document.getElementById("helpClose").addEventListener('click', hideHelp);

    helpWin.addEventListener('dblclick', hideHelp);
	
	if (isSettings) {
		document.getElementsByName('colorGrp')[0].addEventListener('change', saveColorOptions);
		document.getElementsByName('refPosGrp')[0].addEventListener('change', saveRefPos);
		document.getElementsByName('fontSizeGrp')[0].addEventListener('change', onFontSize);
		document.getElementById('bibHilite').addEventListener('change', onBibHilite);
		document.getElementById('serifFont').addEventListener('change', onChangeFont);
        document.getElementById('redLetters').addEventListener('change', function(evt) {
            showRedLetters = document.getElementById('redLetters').checked;
            localStorage.setItem('redLetters', showRedLetters);
        });
		
        //document.getElementById('doEpub').addEventListener('change', function() {
        //    doEpub = document.getElementById('doEpub').checked;
        //    localStorage.setItem('doEpub', doEpub);
        //})
		
        document.colorGrp.color1[colorTheme].checked = true;
		document.refPosGrp.refPos1[refPos].checked = true;
		document.fontSizeGrp.fontSize[fontSize].checked = true;
		
		document.getElementById('bibHilite').checked = bibHiliteValue;
		document.getElementById('serifFont').checked = fontState;
        document.getElementById('redLetters').checked = showRedLetters;
        //document.getElementById('doEpub').checked = doEpub;
	
    } else if (isAccount) {
        document.getElementById('acctNum').value = (localStorage.getItem('acctNum') || '');
        document.getElementById('churchName').value = (localStorage.getItem('churchName') || 'My Bible Legacy');
    }
	
	console.log('in help') 
    helpWin.style.display = 'block';
}


var hideHelp = function(e) {
    
    console.log('in hide') 
    var win = document.getElementById("helpWin");
    if (! win.style.display == 'block') {
        console.log('Help not open');
        return;
    }
    win.style.display = 'none';
    
    if (isAccount) {
        console.log('is account') 
        
        acctNum = document.getElementById('acctNum').value.trim();
        localStorage.setItem('acctNum', acctNum);
        
        var name = document.getElementById('churchName').value.trim();
        localStorage.setItem('churchName', name);
        if (! name) {
            name = 'My Bible Legacy';
        }
        
        document.getElementById('navMenuHeading').innerHTML = name;
        document.getElementById('libChurchHead').innerHTML = name;
        isAccount = false;
        
        console.log('acctNum =', acctNum) 
    } 
}


function getCurrentChap() {
	return currentChap;
}


function showTopicTitles() {
	
    var topicsWin = document.getElementById('topicsWin');
    if (topicsWin.style.display == 'block') {
        topicsWin.style.display = 'none';
        console.log('Already showing, close'); 
        return;
    }
	
	var list = document.getElementById('topicTitleList');
    document.querySelectorAll('.topicItem').forEach(e => e.remove());
	
	for (var t of topicTitles) {
		var entry = document.createElement('li');
		entry.classList.add('topicItem');
		entry.addEventListener('click', getTopic);
		entry.appendChild(document.createTextNode(t));
		list.appendChild(entry);
	}

	var vScroll = window.pageYOffset || document.documentElement.scrollTop;

	topicsWin.style.top = vScroll + 115 + 'px';
	topicsWin.style.display = 'block';
    console.log('on topics') 
    
}



async function getTopic(evt) {
    
    document.getElementById('topicsWin').style.display = 'none';
	
    var sel = evt.target.innerText;
    var topicGrp = topicsDict[sel];
    
    document.getElementById('topicTitle').innerHTML = sel;
	
	if (! topicsMod) {
        topicsMod = await import('/lists.js');
	}
    
	var listList = [];
	listList.push('<table cellspacing="2">');
	
	let idx = 0;
	for (const [topic, vsGrp] of Object.entries(topicsMod[topicGrp])) {
		
		var fixVsGrp = vsGrp.replace(/\{(\w\w\w.+?)\}/gi, "<ref id=\"$1\">$1</ref>")
		var vsStr = '<td width="50%" style="border-left: 2px solid #C6C6C6;"><div class="pref">' + fixVsGrp + '</div></td></tr>'
		
		var promTxt = '<tr class="alt-list"><td width="50%"><a name="' + topic + '"></a><div class="promise">' + topic + '</div></td>' + vsStr;
		
		idx ++;
		listList.push(promTxt)
	}
	
	document.getElementById('topics').innerHTML = listList.join('');
	
	// Set row color
	var alt = document.querySelectorAll(".alt-list:nth-of-type(odd)");
	for (var el of alt) {
		el.style["background"] = clrRow;}
		
	
	// Add event to refs div	
	if (isTouch) {
		var elems = document.getElementsByClassName("pref");
		for (el of elems) {
			el.addEventListener('touchstart', onTouch, false);
		}	
	}	
}



async function displayBibChap(chap, vsList) {
	var bibText;
	//console.log(chap, vsList, 'in displayBibChap'); 
    
    var bibVer;
    if (doBibBottom) {
        bibVer = currBibVer2
    } else {
        bibVer = currBibVer
    }
	
	if (bibVer == 'kjv') {
		if (! avBib) {
			console.log('Loading KJV.....'); 
			var kjvMod = await import ('./kjv.js');
			avBib = kjvMod.avBib;
		}
		bibText = avBib;
	}
	else if (bibVer == 'kjv1611') {
		if (! av1611Bib) {
			console.log('Loading KJV 1611.....');
			var av1611Mod = await import ('./kjv-1611.js');
            var headings1611Mod = await import ('./headings1611.js');
            headings1611 = headings1611Mod.headings1611;
            headings1611Refs = Object.keys(headings1611);

			av1611Bib = av1611Mod.av1611Bib;
		}
		bibText = av1611Bib;
	}
	
	var txts = formChapText(chap, vsList, bibText, bibVer);
    
    if (! doBibBottom) {
        topBibText = bibText;
    }
    
	var patt = /(\w\w\w) (\d+):?/;
    var result = patt.exec(chap);
    var popChapInt = parseInt(result[2]);
    var popBook = fullBook[result[1]];
        
    loadChap(txts, popBook, popChapInt, bibVer);
	
}


function formChapText(chap, vsList, bibText, bibVer) {
    var txts = [];
	
	currBibText = bibText;
	
	var bibKeys = Object.keys(currBibText);

	//paraMode = true;
	var paraVss = [];
	
    // Get keys that start with chap
    var hits = bibKeys.filter(function(item) {
        return item.indexOf(chap) === 0;
    });
	
	if (showXrefs === true) {
		txts.push('<table cellspacing="2">');
	}

    for (var idx in hits) {
		
		var ref = hits[idx];	
        var vs = parseInt(idx) + 1;
        
        var rawTxt = currBibText[ref];
        
        if (showRedLetters == true) {
            rawTxt = rawTxt.replace(/<r>(.+?)<\/r>/g, '<span id="' + ref + '" style="color: red">$1</span>');
        } else {
            // Added to give ref id to <r> span so footnotes will work.
            rawTxt = rawTxt.replace(/<r>(.+?)<\/r>/g, '<span id="' + ref + '">$1</span>');
        }
        
        if (showHeadings == true && showXrefs === false ) {
        
            if (bibVer == 'kjv' && headingsAVRefs.includes(ref)) {
                var hd = '<div class="bibHeading">' + headingsAV[ref] + '</div>'
                if (! paraMode) {
                        txts.push(hd);
                }
                
            } else if (bibVer == 'kjv1611') {
                if (headings1611Refs.includes(ref)) {
                    var hd = '<div class="bibHeading1611">' + headings1611[ref] + '</div>'
                    if (! paraMode) {
                        txts.push(hd);
                    }
                }
            }
        }
        
        if (bibVer == 'kjv') {
            rawTxt = rawTxt.replace(/LORD/g, "L<span class=\"scaps\">ORD</span>");
            rawTxt = rawTxt.replace(/GOD/g, "G<span class=\"scaps\">OD</span>");
        }
        
        if (bibVer == 'kjv1611') {
            rawTxt = rawTxt.replace(/<tn>ÿ<\/tn>/g, "\ue110");
            rawTxt = rawTxt.replace(/<tn>ý<\/tn>/g, "\ue111");
        }
        
        var class1611 = '';
        if (bibVer == 'kjv1611') {
            class1611 = ' avRoman';
        }
        
        var clss = 'alt-verse' + class1611;
		if (! bibHiliteValue) {
			var clss = 'verse' + class1611;
		}
		
		if (paraMode == false && vsList.includes(vs.toString())) {
            clss = 'vsHilite' + class1611;
        } else if (showXrefs === true) {
			clss = 'verse' + class1611;
        } else if (paraMode === true) {
			clss = 'para' + class1611;
			if (vsList.includes(vs.toString())) {
				clss = 'paraVsHilite' + class1611;
			}
		}
        
        //var addFont = '';
        //if (bibVer == 'kjv1611') {
            //addFont = 'style="font-family: IMFell; font-size: larger;"'
        //}
		
		var xLinks = [];
		//var xrefs = tska[hits[idx]];
		
		var xStr = '';
		if (showXrefs === true) {
			var xrefs = tska[hits[idx]];
			if (typeof xrefs !== 'undefined') {
				var xrefList = xrefs.split(',');
				for (var i in xrefList) {
					var lnk = '<ref id="' + xrefList[i] + '">' + xrefList[i] + '</ref>';
					//xLinks.push(xrefList[i]);
					xLinks.push(lnk);
				}
			}
			xStr = '<td width="25%" style="border-left: 2px solid #C6C6C6;"><div class="xref" style="color: #4B50B7;">No Cross-Refs</div></td></tr>';		
			if (xLinks.length > 0) {
				var xLnks = xLinks.join(', ');
				xStr = '<td width="25%" style="border-left: 2px solid #C6C6C6;"><div class="xref">' + xLnks + '</div></td></tr>'
			}
			
			if (vs % 2 === 0) {
				var vsTxt = '<tr><td width="75%"><a name="' + vs + '"></a><div class="' + clss + '" id="' + ref + '"><span style="color: brown">' + vs + '</span> ' + rawTxt + '</div></td>' + xStr;
			} else {
				var vsTxt = '<tr style="background-color:' + clrRow + '"><td width="75%"><a name="' + vs + '"></a><div class="' + clss + '" id="' + ref + '"><span style="color: brown">' + vs + '</span> ' + rawTxt + '</div></td>' + xStr;
			}

			//console.log(vsTxt); 
			txts.push(vsTxt);

		} else {
			
			//var rawTxt = currBibText[hits[idx]];
			
			if (paraMode === true) {
                
                var hd = '';
                
                // Heading added only if between paragraphs. Others omitted. 
                if (showHeadings == true && showXrefs === false ) {
                    if (bibVer == 'kjv' && headingsAVRefs.includes(ref)) {
                        hd = '<div class="bibHeading">' + headingsAV[ref] + '</div>'
                    
                    } else if (bibVer == 'kjv1611') {
                        console.log('1611', ref) 
                        if (headings1611Refs.includes(ref)) {
                            hd = '<div class="bibHeading1611">' + headings1611[ref] + '</div>'
                        }
                    }
                }
                
				if (rawTxt.indexOf('¶') > -1 || bibVer == 'kjv1611' && ref.endsWith(':1')) {
                    
                    if (hd) {
                        console.log(ref, hd) 
                        paraVss.push(hd)
                    }
					
					rawTxt = rawTxt.replace('¶', '');
					
					if (idx === 0) {
						paraVss.push('</div><div class="paraBreak">')
					} else {
						paraVss.push('<div class="paraBreak">')
					}
					txts.push(paraVss.join(''));
					paraVss = [];
				}
								
				var vsTxt = ' <a name="' + vs + '"></a><div class="' + clss + '" id="' + ref + '"><span style="color: brown; font-size: .7em;"><b>' + vs + '</b></span> ' + rawTxt + '</div>';
                
                vsTxt = vsTxt.replace(/<fn>(\d+)<\/fn>/g, '<sup id="fn-$1" style="color: red"> $1</sup>')
				
				paraVss.push(vsTxt);
				
				if ((parseInt(idx) +1) === hits.length) {
					paraVss.push('</div>')
					txts.push(paraVss.join(''));
				}
								
			} else {
                
				var vsTxt = rawTxt.replace(/<d>(.+?)<\/d>/g, "<span id=\"def-$1\" style=\"color: blue\">$1</span>" )
				
				vsTxt = vsTxt.replace(/<fn>(\d+)<\/fn>/g, '<sup id="fn-$1" style="color: red"> $1</sup>')

				vsTxt = '<a name="' + vs + '"></a><div class="' + clss + '" id="' + ref + '"><span style="color: brown">' + vs + '</span> ' + vsTxt + '</div>';
				
				txts.push(vsTxt);
				paraVss = [];
			}
		}
    }
	
	if (showXrefs === true) {
		txts.push('</table>');
	}
	
    if (doBibBottom == false) {
        currentChap = chap;
        localStorage.setItem('currChap', chap);
    } else {
        currentChap2 = chap;
        //console.log(currentChap2, 'form') 
    }
    
	//console.log(txts.join('')) 
    
    return txts.join('');
}


function prepareBible() {
    if (doBibBottom == false) {
        displayBibChap(currentChap, []);
    } else {
        displayBibChap(currentChap2, []);
    }
}



function loadChap(popTxts, book, chapInt, bibVer) {
    
    // To make global
    popBook = book;
    popChapInt = chapInt;
    
	// Determine if top or bottom Bible is split
    if (doBibBottom == false) {
		var main = document.getElementById("chap-main");
		var bibChapElem = document.getElementById("bibChap");
	} else {
		var main = document.getElementById("chap-main2");
		var bibChapElem = document.getElementById("divChap");
	}
	
	main.innerHTML = popTxts;
	bibChapElem.innerHTML = popBook + ' ' + popChapInt
    
    
	// Makes sure Bible tab is up.
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var e of tabcontent) {
        e.style.display = "none";
    }
    document.getElementById('bible-panel').style.display = "block";
    

	// Set row color
	var alt = document.querySelectorAll(".alt-verse:nth-of-type(odd)");
	for (var el of alt) {
		el.style["background"] = clrRow;	
	}

    // Set version label
    if (currBibText === avBib) {
        var label = 'KJV';
    } else {
        var label = '1611';
    }
    var labelElem = document.getElementById("bibVersion");
	
    if (doBibBottom == true) {
        labelElem = document.getElementById("divVersion")
    }
    
    labelElem.innerHTML = label;
    doBibBottom = false;

    // Change font if selected
    if (bibVer == 'kjv1611' && avGothicFont == true) {
        let a = document.getElementsByClassName( "avRoman" );
        [...a].forEach( x => x.className += " avGothic" );
        [...a].forEach( x => x.classList.remove("avRoman") );
    }

	
    // Scroll
	var elem = document.getElementsByClassName('vsHilite') 
	if (paraMode) {
		elem = document.getElementsByClassName('paraVsHilite');
	}
	if (elem.length > 0) {		
		elem[0].scrollIntoView({behavior: "smooth", block: "center"});
	} else {
		window.scrollTo(0, 0);
	}
}



function onSearch(e) {
	e.preventDefault();
	var entry = document.getElementById('schEntry').value;
	
	// returns [txtsList, cnt, bookHits]
	var hitList = searchBib(entry);
	
	var schMain = document.getElementById("search-hits");
	var schDetails = document.getElementById("search-details");
	
	var txts = hitList[0]
	if (hitList[0].length == 0) {
		txts = ['<p align="center">No results found for <i>' + entry + '.</i></p>'];
	}

	var type = ' (find all)'; 
	if (entry.indexOf('|') > -1) {
		type = ' (find any)'
		entry = entry.replace('|', ' (or) ');
	} if (entry.indexOf('>') > -1) {
		entry = entry.replace('>', ' (for) ');
	} if (entry.indexOf('^') > -1) {
        console.log('is ^') 
		entry = entry.replace('^', ' (before) ');
	}

    entry = entry.replace(/(^\w|[\s\-]\w)/g, m => m.toUpperCase());
    	
	var detailsTxt = '<font color="brown"><i>' + entry + '</i></font>' + type + '<br>Found ' + hitList[1] + ' times in ' + hitList[0].length + ' verse(s)'
	schDetails.innerHTML = detailsTxt;
	schMain.innerHTML = txts.join('');
	
    if (hitList[0].length) {
		renderResultsVisual(hitList[2]);
	} else {
		document.getElementById('search-visual').innerHTML = '';
	}
	
	// Set row color
	var alt = document.querySelectorAll(".alt-verse:nth-of-type(odd)");
	for (var el of alt) {
		el.style["background"] = clrRow;	}


	// To get focus off of entry so keyboard will close.
	//document.getElementById('panels').focus();
	
}


//Does Bible search
function searchBib(term) {
    var txts = [];
	var cnt = 0
    var bibTxt;
    //var topBibText;
	var searchText = {};
    
    // Search only top Bible (currBibVer)
	if (currBibVer == 'kjv') {
		topBibText = avBib;
    } else {
		topBibText = av1611Bib;
	}
   
    
    
    var orderedSch = false;
    if (term.indexOf('^') > -1) {
        term = term.replace('^', '');
        orderedSch = true;
        if (term.indexOf('|') > -1) {
            alert('You cannot do an ordered (^) and ANY (|) search at the same time.');
            return [''];
        }
    }
    
    var origRangeStr = 'Gen-Rev';
    if (term.indexOf('>') > -1) {
        
        var grp = term.split('>');
        var rng = grp[0].trim().toLowerCase();
        term = grp[1].trim().toLowerCase();
        
        if (rng == 'ot') {
            origRangeStr = 'Gen-Mal'
        } else if (rng == 'nt') {
            origRangeStr = 'Mat-Rev'
        } else {
            origRangeStr = rng
        }
    
        var rangeStr = origRangeStr.toLowerCase();
        rangeStr = rangeStr.replace(/ /g, '');
        
        if (rangeStr.indexOf('-') > -1) {
            var rngGrp = rangeStr.split('-')
            //console.log(rngGrp, rngGrp[0], rngGrp[1]) 
            
            var startIdx = bookIdx[rngGrp[0]][0];
            var endIdx = bookIdx[rngGrp[1]][1] -1;
            
        } else {
            var startIdx = bookIdx[rangeStr][0];
            var endIdx = bookIdx[rangeStr][1] -1;
        }
        
        var idx = 1;
        for (const [key, value] of Object.entries(topBibText)) {
            if (idx >= startIdx && idx <= endIdx) {
                searchText[key] = value;
            }
            idx++;
        }
    } else {
        searchText = topBibText;
    }
    
	var term = term.replace(/\*/g, "\\w*").trim();	
	term = term.replace(/\s+/g, ' ')
	
	// Check if even amount of ". Add one at end if not.
	var quoteCnt = (term.match(/"/g) || []).length;
	var even = quoteCnt % 2 === 0;
	if (even == false) {
		term = term + '"';
	}	
	
	// Phrase search 
	var allWords = []
	var pList = term.match(/".+?"/g);
	var remain = term.replace(/".+?"/g, "").trim();
	for (var idx in pList) {
		var grp = pList[idx];
		grp = grp.replace(/"/g, '').trim()
		allWords.push(grp.replace(/ /g, '[\\s.,;:?!-]*(?:\\s?<[^>]+>)*\\s?'));
	}

	// Words not in phrase
    if (remain) {
        //console.log(currBibText, remain, 'remain') 
		remain = remain.replace(/\s*\|\s*/g, ' ').trim()
		remain = remain.split(' ');
		// Appends allWords with remain list
		allWords.push.apply(allWords, remain); 
	 }   
	 
	 console.log(allWords) 
     
	var reString;
	// Check for OR "|" option
	if (term.indexOf('|') > -1) {
		bibTxt = searchText;
		reString = allWords.join('|');
		var regex = new RegExp(`(?<=^|\\s|>)(${reString})\\b`, 'gi');
	
	} else {
		
		// Does AND search
		bibTxt = {}
		
		// Get verses with first word and use as data for next search
		for (const [key, value] of Object.entries(searchText)) {
            
            // Must use a positive lookbehind (?<=^|\\s|>) instead of \b because 
            // \b will not work with a long "s" (1611) at the start of a word
            
			if (value.search(new RegExp(`(?<=^|\\s|>)${allWords[0]}\\b`, 'gi')) >= 0) {
				bibTxt[key] = value;
			}
		}

		if (orderedSch) {
            var regex = `(?<=^|\\s|>)${allWords[0]}\\W+(?:\\w+\\W+)*${allWords[1]}\\b`;
        } else {
            // Joins all words into a regex string. Finds them in any order.
            var regex = allWords.map(word => "(?=.*(?<=^|\\s|>)" + word + "\\b)").join('');
		}
        regex = new RegExp(regex, 'gi');
	}
	
	// To mark all the hits
	var mkStr = allWords.map(word => "(?<=^|\\s|>)" + word + "\\b").join('|');
	var markRE = new RegExp(mkStr, 'gi')
	
	console.log(markRE) 
	console.log(regex) 
	
	// Get hits per book. Sets empty value for each book.
	var bookHits = {};
	for (var i=0, il=bibBooks.length; i<il; i++) {
		bookHits[ bibBooks[i] ] = 0;
	}
	
	var clss = 'alt-verse';
	if (! bibHiliteValue) {
		var clss = 'verse';
	}

	for (var [key, value] of Object.entries(bibTxt)) {
		if (value.search(regex) >= 0) {
            value = value.replace(/<fn>\d+<\/fn>/g, "");
            value = value.replace(/<d>(.+?)<\/d>/g, "$1");
			
			var refLink = '<ref id="' + key + '">' + key + '</ref>';
			bookHits[key.substr(0, 3)]++;
			var vsTxt = '<a name="' + key + '"></a><div class="' + clss + '"id="' + key + '">' + refLink + ' ' + value + '</div>';
			var vsTxt = vsTxt.replace(markRE, function(cap) {cnt += 1; return `<mark>${cap}</mark>`});
			txts.push(vsTxt);
		}
	}
	
	return [txts, cnt, bookHits];	
}



async function showDefinition(evt, wd) {
	hideAllTooltips();
    
    if (! define) { 
        console.log('Loading Definitions') 
        var mod = await import ('./definitions.js');
        define = mod.define;
    }

	displayPopup(evt, 'KJV Definition - '+ wd, define[wd.toLowerCase()]);
}


async function showNote(evt, wd) {
	hideAllTooltips();
    
    if (! notes) { 
        var mod = await import ('./footNotes.js');
        notes = mod.notes
    }
    
    console.log(evt.target.parentElement) 

    var fnNum = evt.target.id.slice(3, )
	var ref = evt.target.parentElement.id; 
	var ntGrp = notes[ref];
    
    console.log(ref) 
    
	var re = new RegExp(`<fn>(${fnNum}.+?)<\/fn>`, 'gi');
	var nt = ntGrp.match(re)
	
	displayPopup(evt, `KJV Footnote - ${ref}`, nt);
}

	
function displayPopup(evt, title, body) {
	
	if(evt.type == 'touchstart' || evt.type == 'touchmove' || evt.type == 'touchend' ){
		var posX = evt.targetTouches[0].clientX; 
		var posY = evt.targetTouches[0].clientY;
		var width = "300px";
	 } else {
		var posX = evt.clientX;
		var posY = evt.clientY;
		var width = "320px";
	 }
	 
	 var vsData = '<span class="capt">' + toTitleCase(title) + ':</span><span class="popBody">' + body + '</span><span class="foot">MyKJV App</span>'
	 
	 //console.log(vsData) 

	 popup = document.getElementById('popup');
	 
	 popup.style.width = width;
	 popup.style.background = "-webkit-gradient(linear, left top, left bottom, from("+ clrFrom +"), to("+ clrTo +"))";
	 popup.innerHTML = vsData;
	 
	 // Must put here to get actual size 
	 popup.style.display = "block";

	 var winW = window.innerWidth || document.documentElement.offsetWidth;
	 var winH = window.innerHeight || document.documentElement.offsetHeight;
	 var vScroll = window.pageYOffset || document.documentElement.scrollTop; // - 20
	 var hScroll = window.pageXOffset || document.documentElement.scrollLeft;
	 
	 var popW = popup.offsetWidth;
	 var popH = popup.offsetHeight;
	 
	 if (winW < 500) {
		 console.log('Narrow display. Center popup');
		 var west = winW /2 - popW /2;
		 
	 } else {
		 var west = posX + hScroll + 20;
		 if (posX + popW + 20 > winW) {
			 west = posX - popW + hScroll - 20;
             if (west < 20) {
                 west = winW /2 - popW /2;
             }
		 }
	 }
     
	 var north = posY + vScroll + 20;
	 if (posY + popH + 50 > winH) {
		 north = posY - popH + vScroll - 15;
	 }
	 
	 popup.style.top = north + 'px';
	 popup.style.left = west + 'px';
	 
}



 function onRefClick(evt) {
	hideAllTooltips();
	hideHelp(evt);
	
	//console.log('inTouchEvt', inTouchEvt) 
	
	if (!evt) {
	 var evt = window.event;
	}
	
	var target = evt.target;
    
    console.log(target)
    
    if (! target) {
        console.log('no target') 
        return
    }
    
	console.log(target.id.slice(4, )); 
	
	if (target.id.indexOf('def-') > -1){
		showDefinition(evt, target.id.slice(4, ))
		return
		
	} else if (target.id.indexOf('fn-') > -1){
		return
	}
	
	
	// Marks clicked verses when on vs text or ref.
	
	var clickedVs;
	var clickedTxt;
	
	if (! isNaN(target.innerText)) {
		target = target.parentNode;
	}
	// Check if verse text div.
	if (target.classList.contains("alt-verse") || target.classList.contains("verse") || target.classList.contains("para") || target.classList.contains("vsHilite")) {
		
		clickedVs = target.id;
		
		if (/^\d+ /.test(target.innerText)) {
			clickedTxt = getCurrentChap() + target.innerText;
		} else {
			clickedTxt = target.innerText;
		}
        
		// Determine if click on verse list page
		var vsSelectList = selectedVss;
        console.log(target.parentElement) 
		if (target.parentElement.id == 'listBody') {
			vsSelectList = selectedListVss;
		}
		
		if (target.classList.contains("vsSelect")) {
			target.classList.remove("vsSelect");
			vsSelectList = vsSelectList.filter(function(item) {
				console.log('remove', clickedVs) 
				return item !== clickedTxt;
            })
			
		} else {
			target.classList.add("vsSelect");
			
			// Check that verse clicked is not in list already
			vsSelectList.push(clickedTxt);
			console.log('added', clickedVs) 
		}
        
        selectedVss = vsSelectList;
        
	}

	//evt.stopPropagation()
	
	if (evt.target.nodeName.toLowerCase() == 'ref' ) {

		var ref = evt.target.id;
		
		var chap = ref.slice(0, ref.search(/:/) + 1);
		var vsList = ref.slice(ref.search(/:/) + 1).split((/[-,\;]+ ?/));

        var dashPatt = /(?:\u00AD|\u002D|\u2010|\u2011|\u2012|\u2013|\u2212)/;
        ref = ref.replace(dashPatt, '-');
         
		if (ref.search('-') != -1) {
			//var all = [];
			var hits = /(\d+)-(\d+)/.exec(ref);
			var start = Number(hits[1]);
			var end = Number(hits[2]);
				
			for (var i = start; i <= end; i++) {
                vsList.push(i.toString());
            }
        }
		
		var bk = (ref.slice(0, 3));
		var chInt = chap.match(/\w\w\w (\d+):/)[1];
		
		if (currTab == 'search') {
			schScrollPos = window.pageYOffset;
		} else if (currTab == 'list') {
			listScrollPos = window.pageYOffset;
		}
        
        // Clear chapter picker grid
        var chapGrid = document.getElementById('chapGrid');
        chapGrid.innerHTML = "";
		
		displayBibChap(chap, vsList)
        
        changeTab('bible-panel', document.getElementById('bible-tab'))
	}
 }


 
 var linkMouseout = function(evt) {
     if (!evt) {
         evt = window.event;
     }
	 
	if (showTimer){
         window.clearTimeout(showTimer);
         window.clearTimeout(hideTimer);
         hideTimer = window.setTimeout(function() {
             hideAllTooltips(evt)
         }, delay);
		 
		 showTimer = 0;
     }
 }


 var linkMouseover = function(evt) {
     if (!evt) {
         e = window.event;
     }
	 
	//console.log(evt.target.id, 'hover')  
	if (evt.target.id.indexOf('def-') > -1){
         window.clearTimeout(showTimer);
         showTimer = window.setTimeout(function() {
             showDefinition(evt, evt.target.id.slice(4, ))
         }, delay);
	
	} else if (evt.target.id.indexOf('fn-') > -1){
         window.clearTimeout(showTimer);
         showTimer = window.setTimeout(function() {
             showNote(evt);
         }, delay);
		 
	} else if (evt.target.nodeName.toLowerCase() == 'ref' ) {
         window.clearTimeout(showTimer);
         showTimer = window.setTimeout(function() {
             onHover(evt)
         }, delay);
     }
 }




// Determines double tap
var clickTimer = null;
function onTouch(evt) {
	console.log(evt, 'in tap');
    
    //evt.preventDefault();
	evt.stopPropagation();
    
    if (clickTimer == null) {
        clickTimer = setTimeout(function () {
            clickTimer = null;
            onHover(evt);
        }, 300)
		
    } else {
        clearTimeout(clickTimer);
        clickTimer = null;
        onRefClick(evt);
    }
}


var hideAllTooltips = function() {
	document.getElementById('popup').style.display = "none";
}



function onHover(evt) {
	 hideAllTooltips();
	 hideHelp();
	 
	 //console.log(evt.target.id, 'in hover') 
	 
     if (!evt) {
         var evt = window.event;
     }
	 
	if (evt.target.id.indexOf('def-') > -1){
		showDefinition(evt, evt.target.id.slice(4, ))
		return
		
	} else if (evt.target.id.indexOf('fn-') > -1){
        showNote(evt, evt.target.id.slice(3, ))
		return
	}
     
     if (evt.target.nodeName.toLowerCase() !== 'ref') {
         return
     }
	 
	 var ref = evt.target.id;
     	 
     var vsTxt = checkRef(ref, 0);
	 
	 if(evt.type == 'touchstart' || evt.type == 'touchmove' || evt.type == 'touchend' ){
		var posX = evt.targetTouches[0].clientX; 
		var posY = evt.targetTouches[0].clientY;
		var width = "300px";
	 } else {
		var posX = evt.clientX;
		var posY = evt.clientY;
		var width = "320px";
	 }
	 
	 var chap = ref.slice(0, ref.search(/:/) + 1);
	 var fullBk = fullBook[chap.slice(0, 3)];
	 chap = chap.replace(chap.slice(0, 3), fullBk)
	 
	 var vsData = '<span class="body"><span class="capt">' + chap + ' - King James Bible</span>' + vsTxt + '<span class="foot">MyKJV App</span></span>'

	 popup = document.getElementById('popup');
	 
	 popup.style.width = width;
	 popup.style.background = "-webkit-gradient(linear, left top, left bottom, from("+ clrFrom +"), to("+ clrTo +"))";
	 popup.innerHTML = vsData;
	 
	 // Must put here to get actual size 
	 popup.style.display = "block";

	 var winW = window.innerWidth || document.documentElement.offsetWidth;
	 var winH = window.innerHeight || document.documentElement.offsetHeight;
	 var vScroll = window.pageYOffset || document.documentElement.scrollTop; // - 20
	 var hScroll = window.pageXOffset || document.documentElement.scrollLeft;
	 
	 var popW = popup.offsetWidth;
	 var popH = popup.offsetHeight;
	 
	 //console.log(popW, popH);

	 if (winW < 500) {
		 console.log('Narrow display. Center popup');
		 var west = winW /2 - popW /2;
		 
	 } else {
		 var west = posX + hScroll + 25;
		 if (posX + popW + 15 > winW) {
			 west = posX - popW + hScroll - 20;
		 }
	 }
	 
	 var north = posY + vScroll + 20;
	 if (posY + popH + 0 > winH) {
		 north = posY - popH + vScroll - 15;
	 }
	 
	 popup.style.top = north + 'px';
	 popup.style.left = west + 'px';
	 
	 //popup.style.display = "block";
	 
}



var checkRef = function(ref, type) {
    var grp = ref.split(',');
    var chap = ref.slice(0, ref.search(/:/) + 1);

    var txts = [];
    var txt = "";
    var g;
    for (g in grp) {
        g = grp[g].replace(/^\s+/, '');

        if (g.indexOf(':') > -1) {
            txt = getRefText(g, type);
        } else {
            txt = getRefText(chap + g, type);
        }
        txts.push(txt);
    }
    return txts.join('');
};


var getRefText = function(ref, type) {
    var vs = ref.slice(ref.search(/:/) + 1);
     
     var dashPatt = /(?:\u00AD|\u002D|\u2010|\u2011|\u2012|\u2013|\u2212)/;
     ref = ref.replace(dashPatt, '-');
     
    if (ref.search('-') != -1) {
        var all = [];
        var hits = /(\d+)-(\d+)/.exec(ref);
        var chap = ref.slice(0, ref.search(/:/) + 1);
        var start = Number(hits[1]);
        var end = Number(hits[2]);
        var shorten = false;
        if (end - start > 5) {
            //console.log(start + ', ' + end)
            shorten = true;
            end = start + 4;
        }
        
		// Type 0 is mouseover; 1 is verse list.
		if (type === 1) {
            for (var i = start; i <= end; i++) {
                all.push('<div><b>' + chap + i + '</b>' + ' ' + topBibText[chap + i] + '</div>');
            }
        } else {
            for (var i = start; i <= end; i++) {
                all.push('<div style="text-indent: 1em";><b>' + i + '</b>' + ' ' + topBibText[chap + i] + '</div>');
            }
        }
        if (shorten === true) {
            all.push('<i>continued...click for all verses</i>');
        }

        return all.join('');
    }

    if (type === 1) {
        return '<b>' + ref + '</b>' + ' ' + topBibText[ref];
    } else {
        return '<div style="text-indent: 1em";><b>' + vs + '</b>' + ' ' + topBibText[ref] + '</div>';
    }
	
	selectedVss = [];
};


function onPrevBtn(evt) {
    var chap = currentChap
    if (evt.srcElement.parentElement.id == 'chap-main2' || evt.altKey) {
        //console.log('tap - bottom Bible') 
        chap = currentChap2
        doBibBottom = true;
    }
    
    if (bibSplit && evt.altKey) {
        doBibBottom = true;
    }

	var prs = /(\w\w\w) (\d+):?/.exec(chap);
	var bk = prs[1];
	var chInt = Number(prs[2]);
	chMaxInt = chapIdx[bk];
	if (chInt > 1) {
		var prevInt = chInt - 1;
		var prevChap = bk + " " + prevInt + ":";
	} else {
		bkIdx = bibBooks.indexOf(bk);
		if (bkIdx > 0) {
			bk = bibBooks[bkIdx - 1];
		} else {
			bk = 'Rev';
		}
		var prevInt = chapIdx[bk];
		var prevChap = bk + " " + prevInt + ":";
	}

	displayBibChap(prevChap, '');
	selectedVss = [];

}

function onNextBtn(evt) {
    var chap = currentChap
    //console.log(evt.composedPath().includes(document.getElementById('nextDiv'))) 
    if (evt.srcElement.parentElement.id == 'chap-main2' || evt.altKey) {
        //console.log('tap - bottom Bible') 
        chap = currentChap2
        doBibBottom = true;
    }
    
    //console.log(evt.srcElement.parentElement.id, chap) 
    
    if (bibSplit && evt.altKey) {
        doBibBottom = true;
        //console.log('do bottom') 
    }
    
	var prs = /(\w\w\w) (\d+):?/.exec(chap);
	var bk = prs[1];
	var chInt = Number(prs[2]);
	chMaxInt = chapIdx[bk];
	
    if (chInt < chMaxInt) {
		var nextInt = chInt + 1;
		var nextChap = bk + " " + nextInt + ":";
	} else {
		bkIdx = bibBooks.indexOf(bk);
		if (bkIdx < 65) {
			bk = bibBooks[bkIdx + 1];
		} else {
			bk = 'Gen';
		}
		var nextInt = 1;
		var nextChap = bk + " " + nextInt + ":";
	}

	displayBibChap(nextChap, '');
	selectedVss = [];
}


async function onXref() {
	if (!tska) {
		console.log('loading tska...') 
		var tskaMod = await import('/tska.js');
		tska = tskaMod.tska;
		//console.log(tska.tska) 
	}
	
	if (showXrefs === false) {
		showXrefs = true;
		//xbtn.style.backgroundColor = '#E8D588';
	} else {
		showXrefs = false;
		//xbtn.style.backgroundColor = '';
	}
	
	displayBibChap(currentChap, '');
}


function onPara() {
	if (paraMode === false) {
		paraMode = true;
	} else {
		paraMode = false;
	}
	
	localStorage.setItem('showPara', paraMode);
	displayBibChap(currentChap, '');
}


function onHeadings() {
	if (showHeadings === false) {
		showHeadings = true;
	} else {
		showHeadings = false;
	}
	
    localStorage.setItem('showHeadings', showHeadings);
	displayBibChap(currentChap, '');
}


// Visual search chart

function renderResultsVisual(bookHits) {
	var topVisual = document.getElementById('search-visual');
	var totalWidth = topVisual.offsetWidth,
		totalBooks = bookList.length,
		width = 1/totalBooks*100,
		html = '',
		maxCount = 0,
		baseHeight = 2,
		maxHeight = 38;

	for (var i=0, il=bookList.length; i<il; i++) {
		var count = bookHits[ bookList[i] ];
		if (count > maxCount) {
			maxCount = count;
		}
	}

	for (var i=0, il=bookList.length; i<il; i++) {
		var bookCode = bookList[i],
			count = bookHits[bookCode],
			height = maxHeight * count / maxCount + baseHeight,
			top = maxHeight + baseHeight - height;

		html += '<span class="search-result-book-bar ' + bookCode + '" data-count="' + count + '" data-id="' + bookCode + '" style="width:' + width + '%;"><span class="divisionid-' + bookCode + '" data-count="' + count + '" data-id="' + bookCode + '" style="height:' + height + 'px; margin-top: ' + top + 'px;"></span></span>';
	}

	//topVisual.html(html).show();
	topVisual.innerHTML = html;
}

// Listens to parent element but only acts on spans.
document.getElementById("search-visual").addEventListener('mouseover', function(e) {
	
	//console.log(e.target); 
	
	if(e.target && e.target.className.startsWith("search-result-book-bar") || e.target.className.startsWith("divisionid")) {
    
		var bookBar = e.target,
			count = bookBar.getAttribute('data-count'),
			bookCode = bookBar.getAttribute('data-id'),
			win = bookBar.closest('body'),
			winPos = getOffset(win),
			winWidth = win.offsetWidth,
			bookBarPos = getOffset(bookBar),
			top = bookBarPos.top, // + bookBar.height - winPos.top,
			left = bookBarPos.left - winPos.left;
			
		var topVisualLabel = document.getElementById("search-visual-label");
		topVisualLabel.innerHTML = fullBook[bookCode] + ': ' + count;
		//topVisualLabel.style.top = top  + 'px';
		topVisualLabel.style.left = left + 'px';
		topVisualLabel.style.display = 'block';

		if (left + topVisualLabel.offsetWidth > winWidth) {
			left = winWidth - topVisualLabel.offsetWidth - 20;

			topVisualLabel.style.left = left + 'px';
		}
	}
})

document.getElementById("search-visual").addEventListener('mouseout', function(e) {
	
	if(e.target && e.target.className.startsWith("search-result-book-bar") || e.target.className.startsWith("divisionid")) {
		document.getElementById("search-visual-label").style.display = 'none';
	}
})

// Scrolls to first anchor that starts with book
document.getElementById("search-visual").addEventListener('click', function(e) {

		var bookBar = e.target,
			count = bookBar.getAttribute('data-count'),
			bookCode = bookBar.getAttribute('data-id');

		var anchorList = document.getElementsByTagName('a');
		for (var i=0, il=anchorList.length; i<il; i++) {
			if (anchorList[i].name.startsWith(bookCode)) {
				anchorList[i].scrollIntoView({behavior: "smooth", block: "center"});
				break
			}
		}
});


function getOffset(element)
{
    if (!element.getClientRects().length)
    {
      return { top: 0, left: 0 };
    }

    let rect = element.getBoundingClientRect();
    let win = element.ownerDocument.defaultView;
    return (
    {
      top: rect.top + win.pageYOffset,
      left: rect.left + win.pageXOffset
    });   
}

// end visual


// Scroll to top.

var scrollbtn = document.getElementById("scrollBtn");
scrollBtn.addEventListener('click', onTop);

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.documentElement.scrollTop > 200) {
    scrollbtn.style.display = "block";
  } else {
    scrollbtn.style.display = "none";
  }
}


// When the user clicks on the button, scroll to the top of the document
function onTop() {
  //document.body.scrollTop = 0; // For Safari
  //document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  document.documentElement.scroll({top: 0, behavior: "smooth"})
  //document.querySelector('.tabs').scrollIntoView({behavior: "smooth", block: "center"});
}


// Menu

let dropdownBtn = document.querySelector('#dotMenu');
let menuContent = document.querySelector('.dot-dropdown');

dropdownBtn.addEventListener('click',(evt) => {
    if(menuContent.style.display == "none"){
        var vertScroll = window.pageYOffset || document.documentElement.scrollTop;
        var cursorX = evt.pageX;
        var cursorY = evt.pageY;
        
        menuContent.style.top = cursorY + 20 - vertScroll + 'px';
        menuContent.style.left = cursorX - 180 + 'px';
        menuContent.style.display = "block";
    
    } else {
          menuContent.style.display = "none";
    }
})


// Close window if the user clicks outside of it
window.onclick = function(event) {
  
  //console.log(event.composedPath(), 'event.path'); 
  
  if (document.getElementById("helpWin").style.display == 'block') {
      // Checks all the parent elements
      if (! event.composedPath().includes(document.getElementById('helpWin'))) {
          hideHelp();
      }
  }
  
  if (document.getElementById("sidenav").style.width == "250px" && ! event.target.matches('#barMenu')) {
      // Checks all the parent elements
      if (! event.composedPath().includes(document.getElementById('sidenav'))) {
          closeNav();
      }
  }
    
  if (!event.target.matches('#dotMenu')) {
    document.querySelector('#dot-dropdown').style.display = "none";
  }
  //if (!event.target.matches('#libBookTab') && !event.target.matches('#libTitleTabLabel') && !event.target.matches('#libChapTab') && !event.target.matches('#libChapTabLabel') && !event.target.matches('.titleItem') && !event.target.matches('.libBookIcon')) {
  //  document.querySelector('#titlesWin').style.display = "none";
  //}
  if (!event.target.matches('#bibChap') && !event.target.matches('.grid-item') && !event.target.matches('#divChap') && !event.target.matches('#bookTab') && !event.target.matches('#bookTabLabel') && !event.target.matches('#chapTab') && !event.target.matches('#chapTabLabel')) {
    document.querySelector('#pickWin').style.display = "none";
  }
  
  
  if (document.querySelector('#bibSelectWin').style.display == "block") {
      if (!event.target.matches('#bibVersion') && !event.target.matches('#divVersion')) {
        document.querySelector('#bibSelectWin').style.display = "none";
      }
  }

}


// Verse copy
document.getElementById("menuCopy").addEventListener('click', onCopy);
function onCopy() {
	
	// Placement of ref: 0 beginning; 1 end

	var modVsTxt = [];
	
	if (currTab == 'bible') {
		
		var digits = [];
		for (var idx in selectedVss) {
			var vsTxt = selectedVss[idx].replace(/^\w\w\w \d+:(\d+)/, "$1")
			var dig = /^(\d+)/.exec(vsTxt);
			digits.push(dig[0]);
			modVsTxt.push(vsTxt);
		}
		var ref = ' (' + getCurrentChap() + digits.join(", ") + ')';
	
	} else if (currTab == 'search') {

		if (refPos == 1) {
			
			for (var idx in selectedVss) {
			
				var vsRef = /^(\w\w\w \d+:\d+)/.exec(selectedVss[idx])[1];
				var vsTxt = selectedVss[idx].replace(/^\w\w\w \d+:\d+/, "")
				vsTxt = vsTxt + ' (' + vsRef + ')';
				modVsTxt.push(vsTxt);
			}
			
			var ref = '';
			
		} else {
			for (var idx in selectedVss) {
				var vsTxt = selectedVss[idx].replace(/^(\w\w\w \d+:\d+) /, "($1)")
				modVsTxt.push(vsTxt);
			}
			
			var ref = '';
		}
	} else {
		console.log('Not Bible or Search tab; no copy');
		return;
	}
	
	navigator.clipboard.writeText(modVsTxt.join('\n') + ref + '\n');
	selectedVss = [];
	console.log('Verses copied to clipboard'); 	
	
	var vsList = document.getElementsByClassName('alt-verse');
	for (var row of vsList) {
		if (row.classList.contains("vsSelect")) {
			row.classList.remove("vsSelect");	
		}	
	}
}


// Add Verse list
document.getElementById("menuAdd").addEventListener('click', onAddList);
function onAddList() {
	
	console.log(refList.length, selectedVss.length) 
	if (refList.length + selectedVss.length > 10) {
		refList = refList.slice(selectedVss.length,)
	}
	
	for (var idx in selectedVss) {
		//console.log(selectedVss) 
		
		var ref = /^(\w\w\w \d+:\d+)/.exec(selectedVss[idx]);
		
		//console.log(ref[0], 'ref') ;
		refList.push(ref[0]);
	}
	
	//console.log(refList) 
	
	localStorage.setItem("refList", JSON.stringify(refList));

	selectedVss = [];
	console.log('Verses copied to verse list'); 	
	
	var vList = document.getElementsByClassName('alt-verse');
	for (var row of vList) {
		if (row.classList.contains("vsSelect")) {
			row.classList.remove("vsSelect");	
		}	
	}
    onShowList();
}


// Show Verse list
document.getElementById("menuView").addEventListener('click', onShowList);
function onShowList() {

	//var helpWin = buildPage();
	//var helpContainer = pageData[0];
	//var helpWin = pageData[1];
	//helpWin.style.backgroundColor = "#FFFFFF";
	
	var listDiv = document.getElementById('listView');
	var listWin = document.getElementById('listBody');
	var listCount = document.getElementById('listCount');
	
	var left = 0;
	var fullW = window.innerWidth || document.documentElement.offsetWidth;
	var winW = fullW;
	if (fullW > 800) {
		winW = 800;
		left = fullW /2 - 800 /2;
	}
	
	var winH = window.innerHeight || document.documentElement.offsetHeight;
	var vScroll = window.pageYOffset || document.documentElement.scrollTop;

	listDiv.style.width = winW - 80 + 'px';
	listWin.style.maxHeight = winH - 250 + 'px';
	
	//listDiv.style.maxHeight = winH - 75 + 'px';
	
	listDiv.style.top = vScroll + 55 + 'px';
	
	//console.log(winH, 'winH' ) 
	
	var vsTxts = [];
	
	if (refList.length == 0) {
		
		var txt = '<div style="padding: 15px; color: brown">To add verses click or double tap verses under the Bible or Search panels and then select "Add To Verse List" in the menu.</div>'
		
		//vsTxts.push(txt);
		listWin.innerHTML = txt;
	
	} else {
		for (var idx in refList) {
			
			var ref = refList[idx];
			
			var rawTxt = topBibText[refList[idx]];
			var refLink = '<ref id="' + refList[idx] + '">' + refList[idx] + '</ref>';
			
			var vsTxt = '<div class="alt-verse" id="' + ref + '"><span style="color: brown">' + refLink + '</span> ' + rawTxt + '</div>';
				
			vsTxts.push(vsTxt);
		}
		
		listWin.innerHTML = vsTxts.join('');
	}
	
	listCount.innerHTML = refList.length + ' Verses';
	
	listDiv.style.display = 'block';
	
	// Set row color
	var alt = listWin.querySelectorAll(".alt-verse:nth-of-type(odd)");
	for (var el of alt) {
		el.style["background"] = clrRow;	
	}
}



function listWinClose() {
	//console.log('list close') 
	var listDiv = document.getElementById('listView');
	listDiv.style.display = 'none';
}


function copyList() {
	
	var vsTxts = [];
	for (var idx in refList) {
		var ref = refList[idx];
		var rawTxt = topText[refList[idx]];
		
		console.log(refPos, 'rpos') 
		
		if (refPos == 1) {
			var vsTxt = rawTxt + ' (' + ref + ')';
				
		} else {
			var vsTxt = '(' + ref + ') ' + rawTxt;
		}
		
		vsTxts.push(vsTxt);
	}
	
	navigator.clipboard.writeText(vsTxts.join('\n') + '\n');
	console.log('Verse list to clipboard'); 
}


function copyMarked() {
	
	navigator.clipboard.writeText(selectedListVss.join('\n') + '\n');
	selectedListVss = [];
	console.log('List verses copied to clipboard'); 	
	
	var vList = document.getElementById('listView').getElementsByClassName('alt-verse');
	for (var row of vList) {
		if (row.classList.contains("vsSelect")) {
			row.classList.remove("vsSelect");	
		}	
	}
}


function clearList() {
	refList = [];
	localStorage.setItem("refList", JSON.stringify(refList));
    selectedListVss = [];
	onShowList();
}


function clearMarked() {
	var vList = document.getElementById('listView').getElementsByClassName('alt-verse');
	for (var row of vList) {
		if (row.classList.contains("vsSelect")) {
			var ref = /^(\w\w\w \d+:\d+)/.exec(row.innerText);
			refList = refList.filter(item => item !== ref[0])
			localStorage.setItem("refList", JSON.stringify(refList));
		}	
	}
    selectedListVss = [];
	onShowList();
}


function onBibHilite() {
	bibHiliteValue = document.getElementById('bibHilite').checked;
	localStorage.setItem('bibHilite', bibHiliteValue);
	console.log(bibHiliteValue); 
    prepareBible()
}

function onChangeFont() {
	fontState = document.getElementById('serifFont').checked;
	localStorage.setItem('fontState', fontState);
    if (fontState == true) {
		document.body.style.fontFamily = 'Lora';
	} else {
		document.body.style.fontFamily = 'Verdana, Geneva, sans-serif';
	}
}



function saveColorOptions() {
	var radios = document.getElementsByName('color1');
	var idx;
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			idx = radios[i].value;
			localStorage.setItem('colorIdx', idx);
	
			colorTheme = idx;
			setTheme();
			displayBibChap(currentChap, '');
			break;
		}
	}
}


function saveRefPos() {
	var radios = document.getElementsByName('refPos1');
	var idx;
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			idx = radios[i].value;
			localStorage.setItem('refPos', idx);
			refPos = idx;
			break;
		}
	}
}


function onFontSize() {
	var radios = document.getElementsByName('fontSize');
	var idx;
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			idx = radios[i].value;
			localStorage.setItem('fontSize', idx);
			fontSize = idx;
			setFontSize();
			console.log(idx, 'Set font size') 
			break;
		}
	}
}

function setFontSize() {	
	if (fontSize == 0) {
		document.body.style.fontSize = '1em';
	} else if (fontSize == 1) {
		document.body.style.fontSize = '1.1em';
	} else if (fontSize == 2) {
		document.body.style.fontSize = '1.2em';
	} else if (fontSize == 3) {
		document.body.style.fontSize = '1.4em';
	} else if (fontSize == 4) {
		document.body.style.fontSize = '1.6em';
	}

}


function doShowWelcome() {
	if (showWelcome == true) {
		document.getElementById('menuWelcome').click();
		localStorage.setItem('showWelcome', false);
	}
}



function onKeyUp(e) {
	
	//document.querySelector('#prevDiv').style.opacity = '0';
	//document.querySelector('#nextDiv').style.opacity = '0';

    if (e.altKey && e.keyCode == 83) {
        // Get search tab and put focus on entry, Alt+S
        document.getElementById('search').checked = true;
		document.getElementById('schEntry').select();
    } else if (e.altKey && e.keyCode == 66) {
        // Get bible tab and put focus on entry, Alt+B
        document.getElementById('bible').checked = true;
		document.getElementById('refEntry').select();
    } else if (e.altKey && e.keyCode == 76) {
        // Open verse list page, Alt+L
		onShowList();    }
}

async function showSearch(evt) {
    console.log('sch'); 
    
    if (! bookIdx) { 
        console.log('Loading bookIdx') 
        bookIdx = await import ('./bookIdx.js');
    }
            
    //var sch = document.getElementById('search-panel');
    //document.getElementById("search").checked = true;
    document.getElementById('bible-panel').style.display = "none";
    document.getElementById('search-panel').style.display = "block";
    //sch.style.display = 'block';
}



const checkOnlineStatus = async () => {
	try {
		const online = await fetch("http://www.google.com");
		return online.status >= 200 && online.status < 300; // either true or false
	} catch (err) {
		return false; // definitely offline
	}
};



function onBookPrev() {
    if (titlesData) {
        var chapList = titlesData[currTitleFN];
        var idx = chapList.indexOf(currChapTitle);
        if (idx == 0) {
            console.log('first chapt');
            return;        
        }
        displayChap(chapList[idx -1]);
    }
}

function onBookNext() {
    if (titlesData) {
        var chapList = titlesData[currTitleFN];
        var idx = chapList.indexOf(currChapTitle);
        if (idx +1 == chapList.length) {
            console.log('last chapt');
            return;        
        }
        displayChap(chapList[idx +1]);
    }
}



async function onDevTitleClick(evt) {
    document.querySelector('#devWin').style.display = "none";
    document.querySelector('#loader').style.display = "block";
    var title = evt.target.innerText;
    
    //console.log(title, url) 

	let response = await fetch(url + "getDevsPage.php", {
				method: "POST",
				body: JSON.stringify({'acct': acctNum, 'fn': devTitlesData[title], 'day': currDevDate})
			  })
	
    let data = await response.text();
	
	var fixedData = data.replace(/<a href="bible:\/\/(.+?)">([^<]+)<\/a>/gi, "<ref id=\"$1\">$2</ref>");
	document.getElementById('devPage').innerHTML = fixedData;
    
    document.querySelector('#devTitle').innerHTML = title;
    document.querySelector('#loader').style.display = "none";
}



async function fetchDevData() {
    
    var urlState = checkUrl();
    if (! urlState) {
        return
    }

	var online = window.navigator.onLine;
	if (! online) {
		console.log('No internet connection');
        alert('There is no Internet connection. Connect to the Internet and try again')
		return;
	}
    
    var titlesWin = document.getElementById('devWin');
    if (titlesWin.style.display == 'block') {
        titlesWin.style.display = 'none';
        console.log('Already showing, close'); 
        return;
    }
    
	if (devTitlesData) {
		console.log('Dev titles already retrieved.');
		onDevTitles();
		return;		
	}
    
    document.querySelector('#loader').style.display = "block";
	
    let response = await fetch(url + 'getDevs.php', {
				method: "POST",
                body: JSON.stringify({'acct': acctNum})
			  })
	
    let data = await response.text();
    //console.log(data) 
	devTitlesData = JSON.parse(data);
	
	var list = document.getElementById('devTitleList');
	
    var titles = Object.keys(devTitlesData);
	for (var t of titles) {
		var entry = document.createElement('li');
		entry.classList.add('titleItem');
		entry.addEventListener('click', onDevTitleClick);
		entry.appendChild(document.createTextNode(t));
		list.appendChild(entry);
	}

	onDevTitles();
    
    const d = new Date();
    let month = d.getMonth() +1;
    let day = d.getDay();    
    currDevDate = month + ':' + day;
    
    document.querySelector('#loader').style.display = "none";
}

function checkUrl() {
    //return true;
    
    console.log('check', url) 
    if (!acctNum) {
        console.log('No acct number')
        alert('You must enter a valid Legacy account number under "Account Settings" in the Bar Menu to access your church\'s online material.');
        return false;
    }
    return true;
}



function onBookChapClick(evt) {
    document.querySelector('#titlesWin').style.display = "none";
    var chap = evt.target.innerText;
    displayChap(chap);
}    
    

async function displayChap(chap) {    
    document.querySelector('#loader').style.display = "block";
    currChapTitle = chap;

	//console.log(chap);
	let response = await fetch(url + "getPage.php", {
				method: "POST",
				body: JSON.stringify({'acct': acctNum, 'fn': currTitleFN, 'page': chap})
			  })
	
    let data = await response.text();
	var fixedData = data.replace(/<a href="bible:\/\/(.+?)">([^<]+)<\/a>/gi, "<ref id=\"$1\">$2</ref>");
    //console.log(fixedData) 
	document.getElementById('libPage').innerHTML = fixedData;
	window.scrollTo({ top: 0, behavior: 'smooth' });
    
    document.querySelector('#loader').style.display = "none";
}



function onTitleClick(evt) {
	currTitleFN = evt.target.innerText + '.bk';
	var chapList = titlesData[currTitleFN];
	var list = document.getElementById('bookChapList');
	
	// Clear previous chaps
	document.querySelectorAll('.chapItem').forEach(e => e.remove());
	
	for (var ch of chapList) {
		var entry = document.createElement('li');
		entry.classList.add('chapItem');
		entry.addEventListener('click', onBookChapClick);
		entry.appendChild(document.createTextNode(ch));
		list.appendChild(entry);
	}
	
	document.getElementById("libChapTab").checked = true;
	document.getElementById("libTitle").innerHTML = evt.target.innerText;
}



// Fetch title chapters on click
async function fetchBookData() {
    
    var titlesWin = document.getElementById('titlesWin');
    if (titlesWin.style.display == 'block') {
        titlesWin.style.display = 'none';
        console.log('Already showing, close'); 
        return;
    }
    
	var online = window.navigator.onLine;
	if (! online) {
		console.log('No internet connection');
        alert('There is no Internet connection. Connect to the Internet and try again.')
		return;
	}
    
    var urlState = checkUrl();
    if (! urlState) {
        return
    }

    if (doEpub) {
        fetchEpub();
        return;
    }
		
	if (titlesData) {
		console.log('Titles already retrieved.');
		onTitles();
		return;		
	}
	    
    document.querySelector('#loader').style.display = "block";
    
    console.log(acctNum, 'acct') 
	
    let response = await fetch(url + 'getChaps.php', {
				method: "POST",
                body: JSON.stringify({'acct': acctNum})
			  })
	
    let data = await response.text();
	//console.log(data);
    
    if (data == 'No folder') {
        document.querySelector('#loader').style.display = "none";
        //alert('The account "' + acctNum + '" could not be found. Ensure the account number has been entered correctly in "Account Settings" under the Bar Menu.')
        return;
    }
    
	titlesData = JSON.parse(data);
	
	var list = document.getElementById('titleList');
	
	var titles = Object.keys(titlesData);
	for (var t of titles) {
		var entry = document.createElement('li');
		entry.classList.add('titleItem');
		entry.addEventListener('click', onTitleClick);
		entry.appendChild(document.createTextNode(t.slice(0, -3)));
		list.appendChild(entry);
	}

	onTitles();
    
    document.querySelector('#loader').style.display = "none";
}



var epubData;
var currEpubTitle;

async function fetchEpub() {
    //document.querySelector('#loader').style.display = "block";
    console.log(acctNum, 'acct') 
	
    let response = await fetch(url + 'getEpub.php', {
				method: "POST",
                body: JSON.stringify({'acct': acctNum})
			  })
	
    let data = await response.text();
    //console.log(data) 
    
    // epubData = {title: [book.epub, {chap1: 1.html, chap2: 2.html, etc.}]}
    epubData = JSON.parse(data);
    
    document.querySelectorAll('.titleItem').forEach(e => e.remove());

	var list = document.getElementById('titleList');
	
	var titles = Object.keys(epubData);
	for (var t of titles) {
		var entry = document.createElement('li');
		entry.classList.add('titleItem');
		entry.addEventListener('click', onEpubTitleClick);
		entry.appendChild(document.createTextNode(t));
		list.appendChild(entry);
	}

	var titlesWin = document.getElementById('titlesWin');

	var vScroll = window.pageYOffset || document.documentElement.scrollTop;

	titlesWin.style.top = vScroll + 130 + 'px';
	titlesWin.style.display = 'block';
    console.log('on titles') 
    
}


function onEpubTitleClick(evt) {
    
    currEpubTitle = evt.target.innerText;
    
    // epubData = {title: [book.epub, {chap1: 1.html, chap2: 2.html, etc.}]}
    var titleGrp = epubData[currEpubTitle];
    
    var chapList = Object.keys(titleGrp[1]);
    
	// Clear previous chaps
	document.querySelectorAll('.chapItem').forEach(e => e.remove());
	
    var list = document.getElementById('bookChapList');
	for (var ch of chapList) {
		var entry = document.createElement('li');
		entry.classList.add('chapItem');
		entry.addEventListener('click', displayEpubChap);
		entry.appendChild(document.createTextNode(ch));
		list.appendChild(entry);
	}
    	
	document.getElementById("libChapTab").checked = true;
	document.getElementById("libTitle").innerHTML = evt.target.innerText;

}    
    
async function displayEpubChap(evt) { 

    document.querySelector('#titlesWin').style.display = "none";
    var chap = evt.target.innerText;
   
    document.querySelector('#loader').style.display = "block";
    currChapTitle = chap;
    
    var epubGrp = epubData[currEpubTitle];
    var epubFN = epubGrp[0];
    var chapDict = epubGrp[1];

    var htmlFN = chapDict[chap];
    console.log(epubFN, htmlFN); 

	let response = await fetch(url + "getEpubPage.php", {
				method: "POST",
				body: JSON.stringify({'acct': acctNum, 'epubFN': epubFN, 'htmlFN': htmlFN})
			  })
	
    let data = await response.text();
	
    var linked = data.replace(refTagRE, function(match, g1, g2) {
        
        console.log(match) 
        
        // g1 + g2 is book, g3 ch and vs
        var bk = g1;
        //if (g1) {
        //    var bk = g1 + g2;
        //}
        
        console.log(bk) 
        
        if (! fixBook(bk)) return match;
        if (g2.includes(' vs ') || g2.includes(' verse ')) g2 = g2.replace(/ vs | verse /g, ':');
        
        var ref = fixBook(bk) + ' ' + g2;
        
        return '<ref id="' + ref + '">' + match + '</ref>';
	})
    
	document.getElementById('libPage').innerHTML = linked;
    document.querySelector('#loader').style.display = "none";
}




// Tab changing function and listeners

function changeTab(panel, elem) {
  var e, tabcontent, tabButtons;
  
  //console.log(panel, 'panel'); 
  
  document.querySelector('#summaryWin').style.display = 'none';
  document.querySelector('#topicsWin').style.display = 'none';
  document.querySelector('#devWin').style.display = 'none';
  document.querySelector('#titlesWin').style.display = 'none';
  
  document.querySelector('#dailyWin').style.display = 'none';
  
  tabcontent = document.getElementsByClassName("tabcontent");
  for (e of tabcontent) {
    e.style.display = "none";
  }
  
  tabButtons = document.getElementsByClassName("tabButton");
  for (e of tabButtons) {
    //e.style.boxShadow = 'none';
	e.style.fontWeight = 'normal';
    e.style.color = 'gray';
  }
  
  document.getElementById(panel).style.display = "block";
  //elem.style.boxShadow = 'inset 0 0 10px 2px gray';
  elem.style.color = 'brown';
  elem.style.fontWeight = 'bold';
  
  //if (panel == 'dev-panel') {
	//document.querySelector('#dailyWin').style.display = 'block';
  //}
  
}



document.getElementById("bible-tab").addEventListener('click', function(evt) {
    changeTab('bible-panel', evt.target);
})
document.getElementById("list-tab").addEventListener('click', function(evt) {
    changeTab('topic-panel', evt.target);
	if (topicsLoaded == false) {
		console.log('loading lists'); 
		//getTopics();
		topicsLoaded = true
	}
})
document.getElementById("dev-tab").addEventListener('click', function(evt) {
    changeTab('dev-panel', evt.target);
})
document.getElementById("lib-tab").addEventListener('click', function(evt) {
    changeTab('lib-panel', evt.target);
})


// Get the element with id="defaultOpen" and click on it
document.getElementById("bible-tab").click();


function doBibSplit() {
    if (bibSplit) {
        undoBibSplit();
        return;
    }
    
    bibSplit = true;
    
    // Subtract the header, footer, and divider height.
    var innerH = window.innerHeight - 160;

    document.getElementById('bibDivider').style.display = 'flex';
    document.getElementById('chap-main').style.height = innerH /2 + 'px';
    document.getElementById('chap-main2').style.display = 'block';
    document.getElementById('chap-main2').style.height = innerH /2 + 'px';
    doBibBottom = true;
    
    document.querySelector('#prevDiv').innerHTML = '<b>PREV</b><br><span style="font-size: .7em; text-align: center; color: black">(Alt+ for Bottom)</span>';
    document.querySelector('#nextDiv').innerHTML = '<b>NEXT</b><br><span style="font-size: .7em; text-align: center; color: black;">(Alt+ for Bottom)</span>';
    
    if (! currentChap2) {
        currentChap2 = currentChap;
    }
    
    prepareBible();
}

function undoBibSplit() {
    console.log('undo split') 
    bibSplit = false;
    document.getElementById('bibDivider').style.display = 'none';
    document.getElementById('chap-main').style.height = '100%';
    document.getElementById('chap-main2').style.display = 'none';
    
    document.querySelector('#prevDiv').innerHTML = '<b>PREV</b>';
    document.querySelector('#nextDiv').innerHTML = '<b>NEXT</b>';
}



async function showSummary() {
	
    var online = window.navigator.onLine;
	if (! online) {
		console.log('No internet connection');
        alert('There is no Internet connection. The Chapter Summary is only available while online.')
		return;
	}

    let response = await fetch(url + 'getSummary.php', {
				method: "POST",
                body: JSON.stringify({'chap': currentChap})
			  })
	
    let data = await response.text();
	var fixedData = data.replace(/<a href="bible:\/\/(.+?)">([^<]+)<\/a>/gi, "<ref id=\"$1\">$2</ref>");
    document.querySelector('#summaryPage').innerHTML = fixedData;
    
    
	
    var result = /(\w\w\w) (\d+):?/.exec(currentChap);
    var chapInt = parseInt(result[2]);
    var book = fullBook[result[1]];
    
    document.querySelector('#summaryTitle').innerHTML = '<b>Summary of ' + book + ' Chapter ' + chapInt + '</b>';
    
    var summaryWin = document.getElementById('summaryWin');
    if (summaryWin.style.display == 'block') {
        summaryWin.style.display = 'none';
        console.log('Already showing, close'); 
        return;
    }
	
	var vScroll = window.pageYOffset || document.documentElement.scrollTop;

	summaryWin.style.top = vScroll + 95 + 'px';
	summaryWin.style.display = 'block';
    
}


function change1611Font() {
    if (! document.getElementsByClassName( "avRoman" ).length == 0) {
        let a = document.getElementsByClassName( "avRoman" );
        [...a].forEach( x => x.className += " avGothic" );
        [...a].forEach( x => x.classList.remove("avRoman") );
        avGothicFont = true;
    } else {
        let a = document.getElementsByClassName( "avGothic" );
        [...a].forEach( x => x.className += " avRoman" );
        [...a].forEach( x => x.classList.remove("avGothic") );
        avGothicFont = false;
    }
}


function showInitialChap() {
	
    if (fontState == true) {
		document.body.style.fontFamily = 'Lora';
	} else {
        document.body.style.fontFamily = 'Verdana, Geneva, sans-serif';
    }
	
	currentChap = localStorage.getItem('currChap');
	if (typeof(currentChap) === 'undefined' || currentChap === null) {
		currentChap = 'Joh 1:';
	}
	
    prepareBible();
}




//Add most other listeners

document.addEventListener('DOMContentLoaded', function() {
	
	setFontSize();
	
	document.querySelector('#barMenu').addEventListener('click', openNav);
    //document.querySelector('#libBarMenuIcon').addEventListener('click', openNav);
    
	document.querySelector('#navClose').addEventListener('click', closeNav);
	
    document.getElementById('bibChap').addEventListener('click', onPicker);
    document.getElementById('bibVersion').addEventListener('click', onBibSelect);

    document.getElementById('divChap').addEventListener('click', () => {
        doBibBottom = true;
		onPicker();
    })
    
	document.getElementById('divVersion').addEventListener('click', (evt) => {
        doBibBottom = true;
		onBibSelect(evt);
    })
    
    // Synced scrolling of Bible windows
    document.getElementById('chap-main').addEventListener('scroll', function(evt) {
        if (syncLock == true) {
            document.getElementById('chap-main2').scrollTop = this.scrollTop;
        }
    });

    // Add bottom Bible
	document.getElementById('addBible').addEventListener('click', doBibSplit );      

	// Remove bottom Bible
    document.getElementById('divClose').addEventListener('click', undoBibSplit);
    
	// Lock Bible panel scrolling
    document.getElementById('syncLock').addEventListener('click', function() {
        console.log('click') 
        if (syncLock == true) {
            syncLock = false;
            this.src = '/icon/lock-open.png'
        } else {
            syncLock = true;
            this.src = 'icon/lock.png'
        }
    });

	// Toggle bottom Bible (1611) font
    document.getElementById('changeFont').addEventListener('click', change1611Font);

    
    // Bible icons
    document.getElementById('searchIcon').addEventListener('click', showSearch);
    
    document.getElementById('nextDiv').addEventListener('click', onNextBtn);
    document.getElementById('prevDiv').addEventListener('click', onPrevBtn);
    
		
	// Search
	document.getElementById('doSearch').addEventListener('click', onSearch);
	document.getElementById('schEntry').addEventListener('focus', function() { this.select(); });
    
    document.getElementById('toBibPage').addEventListener('click', () => {
        //document.getElementById("bible").checked = true;
        document.getElementById('search-panel').style.display = "none";
        document.getElementById('bible-panel').style.display = "block";
    })

    // Bible Menu
    document.getElementById("kjvText").addEventListener('click', (evt) => {
        console.log(evt) 
        
        if (doBibBottom) {
            currBibVer2 = 'kjv';
        } else {
            currBibVer = 'kjv';
        }
        
        document.getElementById("versionLabel").innerHTML = '(KJV)'
        prepareBible();        
    })
    
    document.getElementById("bsbText").addEventListener('click', () => {
        
        if (doBibBottom) {
            currBibVer2 = 'kjv1611';
        } else {
            currBibVer = 'kjv1611';
        }
        
        document.getElementById("versionLabel").innerHTML = '(1611)'
        prepareBible();
    })
    
	
	// Crossrefs
	document.getElementById('togXRefs').addEventListener('click', onXref); 
	
	// Paragraphs
	document.getElementById('togPara').addEventListener('click', onPara); 
    
    // Headings
    document.getElementById('togHeadings').addEventListener('click', onHeadings); 
	
	// Help
	document.getElementById("menuHelp").addEventListener('click', onHelp);
	document.getElementById("menuAbout").addEventListener('click', onHelp);
	document.getElementById("menuSettings").addEventListener('click', onHelp);
	document.getElementById("menuWelcome").addEventListener('click', onHelp);
	//document.getElementById("menuAccount").addEventListener('click', onHelp);
	
	// Lists
	//document.getElementById('topicDropdown').addEventListener('change', getTopics);

	
	// Sub title actions
	document.getElementById('libTitle').addEventListener('click', fetchBookData);
    
    
    document.getElementById('devTitle').addEventListener('click', fetchDevData);
    document.getElementById('topicTitle').addEventListener('click', showTopicTitles);
    
    // Date Picker
    document.getElementById('dateLabel').innerHTML = new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
	
    // Library chapter change
    document.getElementById('libBackIcon').addEventListener('click', onBookPrev)
    document.getElementById('libForwIcon').addEventListener('click', onBookNext)
    
		
	document.getElementById('copyList').addEventListener('click', copyList);
	document.getElementById('clearList').addEventListener('click', clearList);
	document.getElementById('copyMarked').addEventListener('click', copyMarked);
	document.getElementById('clearMarked').addEventListener('click', clearMarked);
	
	document.getElementById('listClose').addEventListener('click', listWinClose);
    
    document.getElementById('chapSummary').addEventListener('click', showSummary);
    document.getElementById('summaryClose').addEventListener('click', function() {
            document.querySelector('#summaryWin').style.display = 'none';
    });
	
	
	document.querySelector('#dailyWin').addEventListener('click', function() {
            this.style.display = 'none';
    });
	
    
    var screenWidth = window.innerWidth || document.documentElement.offsetWidth;
    if (screenWidth < 361) {
        console.log('Small screen') ;
        var labels = document.getElementsByClassName('toolLabel')
        for (var l of labels) {
            l.style.fontSize = ".8em";
        }
    }
	
	
    const gesture = new TinyGesture(document.getElementById('chap-main'));
    const gesture2 = new TinyGesture(document.getElementById('chap-main2'));
	
	
    // Event handlers for popup
    
    var pages = ['topics', 'chap-main', 'chap-main2', 'search-hits', 'popup', 'libPage', 'summaryPage', 'listBody']
    
	if ( isTouch() == true) {
		console.log('Load touch events') 
        for (var page of pages) {
            document.getElementById(page).addEventListener('touchstart', onTouch, {passive: true});
        }
        
        // Disable mouse chapter prev/next divs
        document.querySelector('#prevDiv').style.display = 'none';
        document.querySelector('#nextDiv').style.display = 'none';
		
	} else {
		document.addEventListener("mouseover", linkMouseover);
		document.addEventListener("mouseout", linkMouseout);
        
        for (var page of pages) {
            document.getElementById(page).addEventListener('click', onRefClick);
        }
	}


	gesture.on('swiperight', evt => {
	  if (gesture.swipedVertical === false & gesture.swipedHorizontal == true) {
          console.log('swipe prev') 
		onPrevBtn(evt);
	  }
	});
	gesture.on('swipeleft', evt => {
	  if (gesture.swipedVertical === false & gesture.swipedHorizontal == true) {
		onNextBtn(evt);
	  }
	});


	gesture2.on('swiperight', evt => {
	  if (gesture.swipedVertical === false & gesture.swipedHorizontal == true) {
          console.log('swipe prev') 
		onPrevBtn(evt);
	  }
	});
	gesture2.on('swipeleft', evt => {
	  if (gesture.swipedVertical === false & gesture.swipedHorizontal == true) {
		onNextBtn(evt);
	  }
	});
	
	
	//Show prev/next on ctrl press
	if (isTouch() == false) {
		document.addEventListener('keydown', function(e) {
			if (e.ctrlKey) {
				//console.log(document.querySelector('#prevDiv').style.display) 
				if (document.querySelector('#prevDiv').style.display == 0 || document.querySelector('#prevDiv').style.display == 'none') {
					document.querySelector('#prevDiv').style.display = 'flex';
					document.querySelector('#nextDiv').style.display = 'flex';
				} else {
					document.querySelector('#prevDiv').style.display = 'none';
					document.querySelector('#nextDiv').style.display = 'none';
				}
			}
		});
	}

	
	// Show welcome page on first start
	doShowWelcome();
	
	
	// Load accl keys for non-touch
	if (isTouch() == false) {
		console.log('Loading accl key bindings') 
		document.addEventListener('keyup', onKeyUp, false);
	}


    // Insert values on load of page
        var clientW = document.documentElement.clientWidth;
        
        if (clientW > 800) {
            document.getElementById('nextDiv').style.right = (clientW - 800) /2 + 'px';
            document.getElementById('prevDiv').style.left = (clientW - 800) /2 + 'px';
			
			document.getElementById('sidenav').style.left = (clientW - 800) /2 -5 + 'px';
        }
       
    // Change values when window is resized
    window.onresize = function() {
        var clientW = document.documentElement.clientWidth;
        
        if (clientW > 800) {
            document.getElementById('nextDiv').style.right = (clientW - 800) /2 + 'px';
            document.getElementById('prevDiv').style.left = (clientW - 800) /2 + 'px';
			
			document.getElementById('sidenav').style.left = (clientW - 800) /2 + 'px';
        }
    };


    async function registerSW() { 
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js', {
            scope: '.'
        }).then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    }}

    registerSW();
    
	showInitialChap();

})

