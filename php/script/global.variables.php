<?php

//
// update user session
//
if($_SESSION['user'])
{
	include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
	$q = "SELECT * FROM users WHERE id='{$_SESSION[user][id]}'";
	$r = mysql_query($q, $_mysql['db']['main']);
	if($row=@mysql_fetch_assoc($r))
	{
		foreach($row as $k=>$v) { $_SESSION['user'][$k] = $v; }
	}
	include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/close.php";
}

$_defaultDomain	= 'mylifecar.com';
$_localhost = (preg_match("/^127\.0\.0\.1|^192\.168\./", $_SERVER['HTTP_HOST']));
$_repository = ($_localhost) ? '127.0.0.1:81' : 'sichnevyj.com';

$_release = array();
$_release['year'] = 2007;

$_language = 'en';
$_gSection = ($x=$_GET['gSection']) ? $x : 'main';
$_section = ($x=$_GET['section']) ? $x : 'index';
$_page = ($x=$_GET['page']) ? $x : 'index';

$_documentRoot = preg_replace("/\/$/", '', $_SERVER['DOCUMENT_ROOT']);
$_msie = (preg_match("/\bMSIE\b/", $_SERVER['HTTP_USER_AGENT'])) ? true : false;

preg_match("/^[^\.]+/", $_SERVER['HTTP_HOST'], $m);
if(is_dir("$_documentRoot/xml/lang/$m[0]")) { $_language = $m[0]; }
$_lang = $_language;
$_dr = $_documentRoot;
$_SESSION['defaultDomain'] = $_defaultDomain;
$_SESSION['dd'] = $_SESSION['defaultDomain'];
$_SESSION['localhost'] = $_localhost;
$_SESSION['repository'] = $_repository;
$_SESSION['lang'] = $_language;
$_SESSION['dr'] = $_dr;
$_SESSION['msie'] = $_msie;

?>