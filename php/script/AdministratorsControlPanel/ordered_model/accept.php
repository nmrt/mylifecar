<?php

session_start();

//
// main variables
//
$_action = preg_replace("/\.[^\.]+$/", '', basename($_SERVER['PHP_SELF']));
$_sqldb = 'models';
$_sqlotb = 'ordered';
$_sqletb = 'info';

//
// inclusions
//
include "$_SERVER[DOCUMENT_ROOT]/php/script/fs.php";
include "$_SERVER[DOCUMENT_ROOT]/php/script/image.save.thumbs.php";
include 'vars.php';

//
// select ordered model sql row
//
$q = "SELECT * FROM $_sqlotb WHERE id='$_GET[id]'";
$_sqlsr = mysql_query($q, $_mysql['db'][$_sqldb]);
$_sqlsrow = @mysql_fetch_assoc($_sqlsr);
if(mysql_error($_mysql['db'][$_sqldb])) { modelOrderError($_action); }

//
// add ordered model to existing models
//
$ks = $vs = array();
$exc = array('id','mts','status','uid');
foreach($_sqlsrow as $k=>$v)
{
	if(in_array($k, $exc)) { continue; }
	$ks[] = $k;
	$vs[] = "'".mysql_real_escape_string($v, $_mysql['db'][$_sqldb])."'";
}
$ks = join(', ', $ks);
$vs = join(', ', $vs);
$q = "INSERT INTO $_sqletb ($ks) VALUES ($vs)";
mysql_query($q, $_mysql['db'][$_sqldb]);
if(mysql_error($_mysql['db'][$_sqldb])) { modelOrderError($_action); }

//
// mysql insert id
//
$_iid = mysql_insert_id($_mysql['db'][$_sqldb]);

//
// copy image
//
$dir = "img/model/$_SESSION[lang]";
$img = "$dir/ordered/$_GET[id].png";
if(is_file("$_SERVER[DOCUMENT_ROOT]/$img"))
{
	if(!fsRename($img, "$dir/$_iid.png")) { modelOrderError($_action); }
	if(!fsCopy("$dir/$_iid.png", $img)) { modelOrderError($_action); }
	imageSaveThumbs($_iid, $dir);
}

//
// reserve model-page by user
//
$q = "UPDATE users SET page='$_iid', pagest='Pending' WHERE id='$_sqlsrow[uid]'";
mysql_query($q, $_mysql['db']['main']);
if(mysql_error($_mysql['db']['main'])) { modelOrderError($_action); }

//
// update order status
//
$q = "UPDATE $_sqlotb SET status='1' WHERE id='$_GET[id]'";
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
$_link = "http://$_SERVER[HTTP_HOST]?page=pay&cid=$_sqlsrow[company]&mid=$_iid";
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
	preg_replace("/\&/", '&amp;', $_link)
);
$xhtml = ob_get_clean();
// plain
ob_start();
printf
(
	$_msgxml['plain'][0],
	$_uname,
	$_cmname,
	$_link
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