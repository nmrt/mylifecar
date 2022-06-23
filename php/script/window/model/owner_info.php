

<?php

session_start();

$_SESSION['model']['extended']['owner_info'] = true;
$a = array('company','model');
foreach($a as $k) { $_GET[$k] = $_GET['o'][$k]; }
include "$_SESSION[dr]/php/script/model/owner_info.php";

?>

