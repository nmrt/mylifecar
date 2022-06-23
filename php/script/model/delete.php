

<?php

/*ini_set('display_errors', true);
error_reporting(E_ALL^E_NOTICE);*/

session_start();

//
// variables
//
$user = $_SESSION['user'];
$id = $_GET['id'];
$company = $_GET['company'];
$model = $_GET['model'];
$block = $_GET['block'];
$_error = false;

//
// includes
//
include "$_SESSION[dr]/php/script/mysql/connect.php";
include "$_SESSION[dr]/php/script/fs.php";
include 'error.php';

//
// mysql operations
//
$q = "SELECT * FROM $block WHERE id=$id";
$r = mysql_query($q, $_mysql['db']['main']);
if(mysql_error($_mysql['db']['main'])) { modelEditError(); }

//
// mysql SELECT success
//
$q = "DELETE FROM $block WHERE id=$id";
$r = mysql_query($q, $_mysql['db']['main']);
if(mysql_error($_mysql['db']['main'])) { modelEditError(); }
include "$_SESSION[dr]/php/script/mysql/close.php";

//
// img
//
$f = "img/model/$_SESSION[lang]/$block/$id.png";
if(!fsDelete($f)) { modelEditError(); }

//
// img thumbs
//
$dir = "img/model/$_SESSION[lang]/$block";
$css = array('color','grayscale');
$ss = array(32,64);
foreach($css as $cs)
{
	foreach($ss as $s)
	{
		$f = "$dir/$cs/$s/$id.png";
		if(!fsDelete($f)) { modelEditError(); }
	}
}

//
// xml operations
//
$f = "xml/lang/$_SESSION[lang]/model/$block/$id.xml";
if(!fsDelete($f)) { modelEditError(); }

?>

