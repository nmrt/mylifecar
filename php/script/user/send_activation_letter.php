<?php

ini_set('display_errors', true);
error_reporting(E_ALL^E_NOTICE);

//
// includes
//
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/user/text.php";
$alerts = $_userxml['activate']['alerts'];
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/user/globals.php";

// mysql
include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";

//
// get user aid
//
$q = "SELECT active FROM users WHERE id='$_GET[uid]'";
$r = mysql_query($q, $_mysql['db']['main']);
if(@mysql_affected_rows($_mysql['db']['main']))
{
	$_uid = $_GET['uid'];
	$_aid = mysql_result($r, 0);
	$er = include 'activation.letter.php';
	if($er!==true) { error(); }
	else
	{
		echo '<h6 class="success">'.$alerts['letter_send'][0].'</h6>';
	}
}
else { error(); }

// mysql end
include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/close.php";

?>