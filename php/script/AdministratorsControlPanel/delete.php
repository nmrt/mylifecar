

<?php

/*ini_set('display_errors', true);
error_reporting(E_ALL^E_NOTICE);*/

session_start();

//
// target
//
$_targetsg = $_GET['target'];
printf("\ntarget: %s", $_targetsg);
switch($_targetsg)
{
	case 'company': $_targetpl = 'companies'; break;
	case 'model': $_targetpl = 'models'; break;
	case 'user': $_targetpl = 'users'; break;
	case 'rss_item': $_targetpl = 'rss'; break;
	case 'ordered_model': $_targetpl = 'ordered_models'; break;
}

//
// variables
//
$_id = $_GET['id'];
printf("\nid: %s", $_id);

//
// includes
//
include "$_SESSION[dr]/php/script/mysql/connect.php";
include "$_SESSION[dr]/php/class/Dir.php"; $Dir = new Dir();
include "$_SESSION[dr]/php/script/fs.php";
include 'error.php';

//
// mysql DELETE
//
switch($_targetsg)
{
	case 'company':
	case 'model':
		$tb = 'info';
		$db = $_targetpl;
		break;
	case 'user':
		$tb = $_targetpl;
		$db = 'main';
		break;
	case 'rss_item':
		$tb = 'rss_editor';
		$db = 'main';
		break;
	case 'ordered_model':
		$tb = 'ordered';
		$db = 'models';
		break;
}
$q = "DELETE FROM $tb WHERE id=$_id";
printf("\nquery: %s", $q);
$r = mysql_query($q, $_mysql['db'][$db]);
if($_mysqlerror=@mysql_error($db)) { adminEditError('mysql', $_mysqlerror); }

//
// img
//
switch($_targetsg)
{
	case 'company':
	case 'model':
		$f = "img/$_targetsg/$_SESSION[lang]/$_id.png"; break;
	case 'user': $f = "img/$_targetpl/$_SESSION[lang]/$_id.png"; break;
	case 'ordered_model': $f = "img/model/$_SESSION[lang]/ordered/$_id.png"; break;
}
printf("\nimg: %s", $f);
if(!fsDelete($f)) { adminEditError('delete', $f); }

//
// img success
//
switch($_targetsg)
{
	case 'company':
	case 'model':
		$dir = "img/$_targetsg/$_SESSION[lang]"; break;
	case 'user': $dir = "img/$_targetpl/$_SESSION[lang]"; break;
	case 'ordered_model': $dir = "img/model/$_SESSION[lang]/ordered"; break;
}
$css = array('color','grayscale');
$ss = array(32,64);
foreach($css as $cs)
{
	foreach($ss as $s)
	{
		$f = "$dir/$cs/$s/$_id.png";
		if(!fsDelete($f)) { adminEditError('delete', $f); }
	}
}

//
// xml operations
//
switch($_targetsg)
{
	case 'company':
	case 'user':
		$f = "xml/lang/$_SESSION[lang]/$_targetsg/$_id.xml"; break;
	case 'model': $f = ''; break;
	case 'rss_item': $f = "xml/lang/$_SESSION[lang]/rss/editor/$_id.xml"; break;
}
printf("\nxml: %s", $f);
if(!fsDelete($f)) { adminEditError('delete', $f); }

//
// dirs
//
switch($_targetsg)
{
	case 'company':
	case 'rss_item':
	case 'ordered_model':
		$dirs = array();
		break;
	case 'model': $dirs = array(/*"img/$_targetsg/$_id", "xml/lang/$_SESSION[lang]/$_targetsg/$_id"*/); break;
	case 'user': $dirs = array("img/$_targetpl/$_id"); break;
}
foreach($dirs as $dir)
{
	printf("\ndir: %s", $dir);
	if(!fsRmdir($dir, true)) { adminEditError('rmdir', $dir); }
}

//
// end
//
include "$_SESSION[dr]/php/script/mysql/close.php";

?>

