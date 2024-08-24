<?php
	
header("Access-Control-Allow-Origin: *");

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

$acct = $data['acct'];

if (! is_dir($acct)) {
    echo 'No folder';
    return;
}

$fileList = glob($acct . '/*.dev');
$titles = array();

foreach($fileList as $fn) {

	$db = new SQLite3($fn, SQLITE3_OPEN_READONLY);

	if(!$db) {
		echo $db->lastErrorMsg();
		} 
    
    $sql = "SELECT desc FROM title";
    $titleTxt = $db->querySingle($sql);
    
    // Makes an "indexed array" (like Python list)
    //array_push($titles, $titleTxt);
    
    // Makes an "associative array" (like Python dict)
    $titles[$titleTxt] = basename($fn);
	}

$results = json_encode($titles);
echo $results;

?>