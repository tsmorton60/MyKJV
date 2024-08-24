<?php
	
header("Access-Control-Allow-Origin: *");

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

$fn = $data['fn'];
$chap = SQLite3::escapeString($data['page']);
$acct = $data['acct'];

$pth = $acct . '/' . $fn;

$db = new SQLite3($pth, SQLITE3_OPEN_READONLY);

$sql = "SELECT text FROM book WHERE chapter = '" . $chap . "'";
$pageTxt = $db->querySingle($sql);

// If text contains an image, extract image blob from db and encode to base64 to embed in text.
if (strpos($pageTxt, '<img') !== false) {
    preg_match_all('/src="memory:([^"]+)"/', $pageTxt, $matches);
	$fnArray = $matches[1];
	
	foreach($fnArray as $fn ) {
	
		$imgSql = "SELECT imageData FROM images WHERE fName = '" . strtolower($fn) . "'";
		$blob = $db->querySingle($imgSql);
		$imgData = base64_encode($blob);	
        
		$patt = '/src="memory:' . $fn . '"/';
		$repl = '/src="data:image/png;base64,' . $imgData . '"/';
		
		$pageTxt = preg_replace($patt, $repl, $pageTxt);
	}
}

echo $pageTxt;

?>