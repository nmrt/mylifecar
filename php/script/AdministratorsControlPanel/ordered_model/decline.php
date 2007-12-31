<?php

session_start();

//
// main variables
//
include 'vars.php';

//
// select ordered model sql row
//
$q = "SELECT * FROM $_sqlotb WHERE id='$_GET[id]'";
$_sqlsr = mysql_query($q, $_mysql['db'][$_sqldb]);
$_sqlsrow = @mysql_fetch_assoc($_sqlsr);
if(mysql_error($_mysql['db'][$_sqldb])) { modelOrderError($_action); }

//
// update order status
//
$q = "UPDATE $_sqlotb SET status='2' WHERE id='$_GET[id]'";
mysql_query($q, $_mysql['db'][$_sqldb]);
if(mysql_error($_mysql['db'][$_sqldb])) { modelOrderError($_action); }

//
// send information letter
//
$q = "SELECT * FROM users WHERE id='$_sqlsrow[uid]'";
$r = mysql_query($q, $_mysql['db']['main']);
$_user = @mysql_fetch_assoc($r);
$q = "SELECT * FROM info WHERE id='$_sqlsrow[company]'";
$r = mysql_query($q, $_mysql['db']['companies']);
$_compsql = @mysql_fetch_assoc($r);
$_host = preg_replace("/(?i)w{3}\./", '', $_SERVER['HTTP_HOST']);
$_uname = ($_user['first_name'] && $_user['last_name']) ? "$_user[first_name] $_user[last_name]" : $_user['nickname'];
$_cmname = "$_compsql[realname] $_sqlsrow[realname]";
$_email = "info@$_host";
$to = $_user['email'];
$from = '"'.$_host.'" <info@'.$_host.'>';
// subject
$subject = $_msgxml['subject'][0];
// xhtml
ob_start();
printf
(
	$_msgxml['xhtml'][0],
	$_uname,
	$_cmname,
	$_email
);
$xhtml = ob_get_clean();
// plain
ob_start();
printf
(
	$_msgxml['plain'][0],
	$_uname,
	$_cmname,
	$_email
);
$plain = ob_get_clean();
// send
$msg = corpMsgGen($xhtml, $plain);
$ok = email($to, $from, $subject, $msg['xhtml'], $msg['plain']);
if($ok!==true) { modelOrderError(); }

//
// full success
//
modelOrderSuccess($_action);

?>