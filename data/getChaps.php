<?php
	
header("Access-Control-Allow-Origin: *");

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

$acct = $data['acct'];

if (! is_dir($acct)) {
    echo 'No folder';
    return;
}

$fileList = glob($acct . '/*.bk');
$grps = array();

foreach($fileList as $fn) {

	$db = new SQLite3($fn, SQLITE3_OPEN_READONLY);

	if(!$db) {
		echo $db->lastErrorMsg();
		} 

	$chaps = array();

	$ret = $db -> query('SELECT chapter from BOOK');
	while($row = $ret -> fetchArray(SQLITE3_NUM) ) {
		
		array_push($chaps, $row['0']);
		}
		
		$db->close();
	
	$grps[basename($fn)] = $chaps;
	}

$results = json_encode($grps);
echo $results;

?>