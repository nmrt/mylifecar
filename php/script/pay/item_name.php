<?php

function pay_item_name($id)
{
	include_once "$_SERVER[DOCUMENT_ROOT]/php/class/XML.php"; $XML = new XML();
	$xml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/page/main/index/pay.xml");
	$xml = $XML->toArray($xml->tagChildren);
	$xml = $xml['body'];
	include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
	$q = "SELECT * FROM info WHERE id='$id'";
	$r = mysql_query($q, $_mysql['db']['models']);
	$row = @mysql_fetch_assoc($r);
	$model = $row['realname'];
	$q = "SELECT * FROM info WHERE id='$row[company]'";
	$r = mysql_query($q, $_mysql['db']['companies']);
	$row = @mysql_fetch_assoc($r);
	$company = $row['realname'];
	$item_name = "$company $model".$xml['ready']['item_name'][0];
	return $item_name;
}

?>