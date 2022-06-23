<?php

include "$_SESSION[dr]/php/script/mysql/connect.php";

//
// model
//
$codeModelName = $_GET['model'];
$q = "SELECT realname FROM info WHERE id='$codeModelName'";
$r = mysql_query($q, $_mysql['db']['models']);
$realModelName = mysql_result($r, 0);

//
// company
//
$q = "SELECT company FROM info WHERE id='$codeModelName'";
$r = mysql_query($q, $_mysql['db']['models']);
$codeCompanyName = mysql_result($r, 0);
$q = "SELECT realname FROM info WHERE id='$codeCompanyName'";
$r = mysql_query($q, $_mysql['db']['companies']);
$realCompanyName = mysql_result($r, 0);

//
// session
//
if($_GET['edit']=='true') { $_SESSION['model']['edit'][$codeModelName] = true; }
if($_GET['edit']=='false') { $_SESSION['model']['edit'][$codeModelName] = false; }

//
// edit
//
if($_SESSION['model']['edit'][$codeModelName])
{
	$user = $_SESSION['user'];
	if(($user['page']=='Administrator' || $user['page']==$codeModelName) && !$user['pagest']) { $_edit = true; }
	else { $_edit = false; }
}

include "$_SESSION[dr]/php/script/mysql/close.php";

?>