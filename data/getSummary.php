<?php
	
header("Access-Control-Allow-Origin: *");

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

$chap = $data['chap'];

$db = new SQLite3('summary.db', SQLITE3_OPEN_READONLY);

$sql = "SELECT comment FROM commentary WHERE ref = '" . $chap . "'";
$pageTxt = $db->querySingle($sql);

echo $pageTxt;

?>