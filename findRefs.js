export function fixBook(bk) {

     var bookDict = {
         "1 ?Jo": "1Jo", "2 ?Jo": "2Jo", "3 ?Jo": "3Jo", "1 ?Jn": "1Jo", "2 ?Jn": "2Jo", "3 ?Jn": "3Jo", 
		 "Ge": "Gen", "Ex": "Exo", "Le": "Lev", "Nu": "Num", "De": "Deu", "Jos": "Jos", "Judg": "Jdg",
		 "Jg": "Jdg", "Ru": "Rth", "1 ?Sa": "1Sa", "2 ?Sa": "2Sa", "1 ?Ki": "1Ki", "2 ?Ki": "2Ki", "1 ?Ch": "1Ch", 
		 "2 ?Ch": "2Ch", "Ezr": "Ezr", "Ne": "Neh", "Es": "Est", "Job": "Job", "Ps": "Psa", "Pr": "Pro", 
		 "Ec": "Ecc", "So": "Son", "Is": "Isa", "Je": "Jer", "La": "Lam", "Eze": "Eze", "Da": "Dan", "Ho": "Hos", 
		 "Joe": "Joe", "Am": "Amo", "Ob": "Oba", "Jon": "Jon", "Mi": "Mic", "Na": "Nah", "Hab": "Hab", 
		 "Zep": "Zep", "Hag": "Hag", "Zec": "Zec", "Mal": "Mal", "Jgs": "Jdg", "Rth": "Rth", "Mat": "Mat", "Mar": "Mar",
		 "Mr": "Mar", "Lu": "Luk", "Joh": "Joh", "Ac": "Act", "Ro": "Rom", "1 ?Co": "1Co", "2 ?Co": "2Co", 
		 "Ga": "Gal", "Ep": "Eph", "Phi": "Phi", "Php": "Phi", "Col": "Col", "1 ?Th": "1Th", "2 ?Th": "2Th", 
		 "1 ?Ti": "1Ti", "2 ?Ti": "2Ti", "Tit": "Tit", "He": "Heb", "Ja": "Jam", "1 ?Pe": "1Pe", "2 ?Pe": "2Pe", 
		 "Jud": "Jud", "Re": "Rev", "Mt": "Mat", "Mk": "Mar", "Lk": "Luk", "Jn": "Joh", "Jas": "Jam", "1I ?Kgs": "1Ki", 
		 "2 ?Kgs": "2Ki", "Phm": "Phm", "Phile": "Phm", "Jdg": "Jdg", "1S": "1Sa", "2S": "2Sa", "1K": "1Ki", 
		 "2K": "2Ki", "1P": "1Pe", "2P": "2Pe", "1J": "1Jo", "2J": "2Jo", "3J": "3Jo", "Jde": "Jud", "Tts": "Tit", "Jhn": "Joh",
     };

    var b;
    for (b in bookDict) {
        var patt = new RegExp('^' + b + "\\w*", "i");
        if (patt.test(bk)) {
            return bookDict[b];
        }
    }
    return false;
}


var books = "Genesis|Gen?|Gn|Exodus|Exod?|Ex|Leviticus|Le?v|Numbers|Nu?m|Nu|Deuteronomy|Deut?|Dt|"+
"Joshua|Josh?|Jsh|Judges|Ju?dg|Jg|Ru(?:th)?|Ru?t|(?:1|i|2|ii) ?Samuel|(?:1|i|2|ii) ?S(?:a|m)|"+
"(?:1|i|2|ii) ?Sam|(?:1|i|2|ii) ?Kin(?:gs?)?|(?:1|i|2|ii) ?Kgs|(?:1|i|2|ii) ?Chronicles|"+
"(?:1|i|2|ii) ?Chr(?:o?n)?|(?:1|i|2|ii) ?Cr|Ezra?|Nehemiah|Neh?|Esther|Esth?|Jo?b|Psalms?|Psa?|Proverbs|Pro?v?|Ecclesiastes|Ec(?:cl?)?|"+
"Song of Solomon|Song of Songs?|Son(?:gs?)?|SS|Isaiah?|Isa?|Jeremiah|Je?r|Lamentations|La(?:me?)?|Ezekiel|Eze?k?|Daniel|Da?n|Da|"+
"Hosea|Hos?|Hs|Jo(?:el?)?|Am(?:os?)?|Obadiah|Ob(?:ad?)?|Jon(?:ah?)?|Jnh|Mic(?:ah?)?|Mi|Nah?um|Nah?|Habakkuk|Hab|Zephaniah|Ze?ph?|"+
"Haggai|Hagg?|Hg|Zechariah|Ze?ch?|Malachi|Ma?l|Matthew|Matt?|Mt|Mark|Ma(?:r|k)|M(?:r|k)|Luke?|Lk|Lu?c|John|Jn|Ac(?:ts?)?|"+
"Romans|Ro?m|(?:1|i|2|ii) ?Corinthians|(?:1|i|2|ii) ?C(?:or?)?|Galatians|Gal?|Gl|Ephesians|Eph?|Philippians|Phil|Colossians|Col|"+
"(?:1|i|2|ii) ?Thessalonians|(?:1|i|2|ii) ?Th(?:e(?:ss?)?)?|(?:1|i|2|ii) ?Timothy|(?:1|i|2|ii) ?Tim|(?:1|i|2|ii) ?T(?:i|m)|"+
"Ti(?:tus)?|Ti?t|Philemon|Phl?m|Hebrews|Heb?|Jam(?:es)?|Jms|Jas|(?:1|i|2|ii) ?Peter|(?:1|i|2|ii) ?Pe?t?|(?:1|i|2|ii|3|iii) ?J(?:oh)?n?|"+
"Jude?|Revelations?|Rev|R(?:e|v)";



var books2 = "Genesis|Gen|Ge|Gn|Exodus|Ex|Exod?|Leviticus|Lev?|Lv|Levit?|Numbers|"+
            "Nu|Nm|Hb|Nmb|Numb?|Deuteronomy|Deut?|De|Dt|Joshua|Josh?|Jsh|Judges|Jdgs?|Judg?|Jd|Ruth|Ru|Rth|"+
            "Samuel|Sam?|Sml|Kings|Kngs?|Kgs|Kin?|Chronicles|Chr?|Chron|Ezra|Ez|"+
            "Nehemiah|Nehem?|Ne|Esther|Esth?|Es|Job|Jb|Psalms?|Psa?|Pss|Psm|Proverbs?|Prov?|Prv|Pr|"+
            "Ecclesiastes|Eccl?|Eccles|Ecc?|Songs?ofSolomon|Song?|So|Songs|Isaiah|Isa|Is|Jeremiah|"+
            "Jer?|Jr|Jerem|Lamentations|Lam|Lament?|Ezekiel|Ezek?|Ezk|Daniel|Dan?|Dn|Hosea|"+
            "Hos?|Joel|Jo|Amos|Am|Obadiah|Obad?|Ob|Jonah|Jon|Jnh|Micah|Mi?c|Nahum|Nah?|"+
            "Habakkuk|Ha?b|Habak|Zephaniah|Ze?ph?|Haggai|Ha?g|Hagg|Zechariah|Zech?|Ze?c|"+
            "Malachi|Malac?|Ma?l|Matthew|Mat?|Matt?|Mt|Mark?|Mrk?|Mk|Luke|Lu?k|Lk|John?|Jhn|Jo|Jn|"+
            "Acts?|Ac|Romans|Rom?|Rm|Corinthians|Cor?|Corin|Galatians|Gal?|Galat|"+
            "Ephesians|Eph|Ephes|Philippians|Phili?|Php|Phi|Colossians|Col?|Colos|"+
            "Thessalonians|Thess?|Th|Timothy|Tim?|Titus|Tts|Tit?|Philemon|Phm?|Philem|Pm|"+
            "Hebrews|Hebr?|James|Jam|Jms?|Jas|Peter|Pete?|Pe|Pt|Jude?|Jd|Ju|Revelations?|Rev?|"+
            "Revel";

var vols = "I+|1st|2nd|3rd|First|Second|Third|1|2|3";
var dashPatt = '(?:\u002D|\u2010|\u2011|\u2012|\u2013|\u2212|,)';
var verse = "\\d+(?::|\.| vs | verse )\\d+(?:\\s?" + dashPatt + "\\s?(?![12]\\s*[A-Z])\\d+)*";

//var fullPattern = "\b(?:(" + vols + ")\\s?)?(" + books + ")\\.?\\s?(" + verse + ")";

var fullPattern = "\\b(" + books + ")\\.?\\s?(" + verse + ")";


//var fullPattern = '(' + bookPatts.join('|') + ')\\.? \\s+(\\d{1,3}(?::|\.| vs | verse )\\d{1,3}(?:' + dashPatt + '\\d{1,3})?)';
//console.log(fullPattern); 

export var refTagRE = new RegExp(fullPattern, 'g')

