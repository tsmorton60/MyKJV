<?php
	
header("Access-Control-Allow-Origin: *");

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

$fn = $data['fn'];
$day = $data['day'];
$acct = $data['acct'];

if (! is_dir($acct)) {
    echo 'No folder';
    return;
}

$pth = $acct . '/' . $fn;

$dayGrp = explode(':', $day);

$db = new SQLite3($pth, SQLITE3_OPEN_READONLY);

$sql = "SELECT devotion FROM devotion WHERE month = '" . $dayGrp[0] . "' AND day = '" . $dayGrp[1] . "'";
$pageTxt = $db->querySingle($sql);

echo $pageTxt;

?>