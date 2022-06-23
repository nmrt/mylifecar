<?php

//
// inclusions
//
include "$_SERVER[DOCUMENT_ROOT]/php/script/global.variables.php";
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/email.php";
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/corpMsgGen.php";
include_once "$_SERVER[DOCUMENT_ROOT]/php/class/XML.php"; $XML = new XML();
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/pay/item_name.php";

//
// xml
//
$_languagexml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/page/index.xml");
$_languagexml = $XML->toArray($_languagexml->tagChildren);
$_languagexml = $_languagexml['body'];
$_payxml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/page/main/index/pay.xml");
$_payxml = $XML->toArray($_payxml->tagChildren);
$_payxml = $_payxml['body'];

//
// parse custom
//
$custom = array();
$a = explode(',', $_POST['custom']);
foreach($a as $v)
{
	list($key, $val) = explode(':', $v);
	$custom[$key] = $val;
}

//
// letter
//
$_letter = array();
include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
$q = "SELECT * FROM users WHERE id='$custom[uid]'";
$r = mysql_query($q, $_mysql['db']['main']);
$row = @mysql_fetch_assoc($r);
include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/close.php";
// to
$_letter['to'] = $row['email'];
// from
$host = preg_replace("/(?i)^www\./", '', $_SERVER['HTTP_HOST']);
$_letter['from'] = '"'.$host.'" <'."info@$_SESSION[dd]".'>';
// title
ob_start();
$un = ($row['first_name']&&$row['last_name']) ? "$row[first_name] $row[last_name]" : $row['nickname'];
switch($_POST['payment_status'])
{
	default: $st = 'success'; break;
	case 'Completed':
	case 'Pending': $st = 'success'; break;
	case 'Denied':
	case 'Failed': $st = 'failure'; break;
}
printf($_payxml['result'][$st][0], $un);
$_letter['title'] = ob_get_clean();

?>