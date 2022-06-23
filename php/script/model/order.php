<?php

/*ini_set('display_errors', true);
error_reporting(E_ALL ^ E_NOTICE);*/

session_start();
if(!$_SESSION['user']) { die('Access denied!'); }

//
// inclusions
//
include_once "$_SERVER[DOCUMENT_ROOT]/php/class/XML.php"; $XML = new XML();
include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
include "$_SERVER[DOCUMENT_ROOT]/php/script/fs.php";
include "$_SERVER[DOCUMENT_ROOT]/php/script/parseDate.php";
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/email.php";
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/corpMsgGen.php";
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/image.save.thumbs.php";

//
// main vars
//
$_sqldb = 'models';
$_sqltable = 'ordered';
$_user = $_SESSION['user'];
$_host = preg_replace("/(?i)w{3}\./", '', $_SERVER['HTTP_HOST']);
$_uname = ($_user['first_name'] && $_user['last_name']) ? "$_user[first_name] $_user[last_name]" : $_user['nickname'];

//
// glob xml
//
$_payxml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/page/main/index/pay.xml");
$_payxml = $XML->toArray($_payxml->tagChildren);
$_payxml = $_payxml['body'];
$_alertsxml = $_payxml['ready']['order_model']['alerts'];
$_msgxml = $_payxml['ready']['order_model']['msg'];
$_modelxml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/page/main/index/model.xml");
$_modelxml = $XML->toArray($_modelxml->tagChildren);
$_modelxml = $_modelxml['body'];

//
// error func
//
function orderModelError($type='failure', $die=true)
{
	echo '<div class="failure">';
	echo $GLOBALS['_alertsxml'][$type][0];
	echo '</div>';
	if($die) { die; }
}

//
// First, add columns to sql table, if needed
//
$fields = array();
$q = "SHOW COLUMNS FROM $_sqltable";
$sqlr = mysql_query($q, $_mysql['db'][$_sqldb]);
while($sqlrow=@mysql_fetch_assoc($sqlr))
{
	$n = $sqlrow['Field'];
	$fields[] = $n;
}
//print_r($fields);
foreach($_POST['form'] as $k=>$v)
{
	if(!in_array($k, $fields))
	{
		switch($v['type'])
		{
			default:
				$t = 'TEXT';
				$l = 0;
				break;
			case 'string':
				$t = 'VARCHAR';
				$l = $v['len']/3;
				break;
			case 'int':
				$t = 'INT';
				$l = $v['len'];
				break;
			case 'real':
				$t = 'FLOAT';
				$l = 0;
				break;
		}
		$q = "ALTER TABLE $_sqltable ADD $k $t";
		if($l) { $q .= "($l)"; }
		//echo "$q\n";
		mysql_query($q, $_mysql['db'][$_sqldb]);
	}
}
if(mysql_error($_mysql['db'][$_sqldb])) { orderModelError(); }

//
// Now, insert values (with some exceptions) into sql table
//
$exceptions = array('id');
$ks = array('uid');
$vs = array($_user['id']);
foreach($_POST['form'] as $k=>$v)
{
	if(!in_array($k, $exceptions))
	{
		$ks[] = $k;
		$vs[] = "'".mysql_real_escape_string($v['value'], $_mysql['db']['main'])."'";
	}
}
$ks = join(', ', $ks);
$vs = join(', ', $vs);
$q = "INSERT INTO $_sqltable ($ks) VALUES ($vs)";
//echo "$q\n";
mysql_query($q, $_mysql['db'][$_sqldb]);
if(mysql_error($_mysql['db'][$_sqldb])) { orderModelError(); }

//
// id
//
$_id = mysql_insert_id($_mysql['db'][$_sqldb]);

//
// img
//
if($img=$_POST['img'])
{
	
	$dimg = "img/model/$_SESSION[lang]/ordered/$_id.png";
	
	//
	// make backup
	//
	if(!$bkp=fsBkp($dimg)) { orderModelError(); }
	
	//
	// rename simg into dimg
	//
	if(!fsRename($img, $dimg))
	{
		//
		// restore backup on failure
		//
		fsBkpr($bkp);
		orderModelError();
	}
	else
	{
		//
		// delete backup on success
		//
		fsDelete($bkp);
		imageSaveThumbs($_id, "img/model/$_SESSION[lang]/ordered");
	}
	
}

//
// send email
//
$to = $_user['email'];
$from = '"'.$_host.'" <info@'.$_host.'>';
// subject
ob_start();
printf($_msgxml['subject'][0], $_host);
$subject = ob_get_clean();
// config
ob_start();
foreach($_POST['form'] as $k=>$v)
{
	if(!preg_match("/_unitsys$/", $k))
	{
		echo $_modelxml['tech_info'][$k][0].': ';
		switch($k)
		{
			case 'company':
				$q = "SELECT * FROM info WHERE id='$v[value]'";
				$sqlr = mysql_query($q, $_mysql['db']['companies']);
				$sqlrow = @mysql_fetch_assoc($sqlr);
				echo $sqlrow['realname'];
				break;
			default: echo $v['value']; break;
		}
		if($unit=$_modelxml['tech_info'][$k]['unit'])
		{
			$usys = ($x=$_POST['form']["{$k}_unitsys"]['value']) ? $x : 'met';
			echo ' '.$unit[$usys][0];
		}
		echo "\n";
	}
}
$config = ob_get_clean();
// xhtml
ob_start();
printf($_msgxml['xhtml'][0], $_uname, parseDate(date('Y-m-d'),array('relative'=>false)));
echo '<div style="margin-top:20px;">'.nl2br($config).'</div>';
$xhtml = ob_get_clean();
// plain
ob_start();
printf($_msgxml['plain'][0], $_uname, parseDate(date('Y-m-d'),array('relative'=>false)));
echo "\n\n".strip_tags($config);
$plain = ob_get_clean();
// send
$msg = corpMsgGen($xhtml, $plain);
$ok = email($to, $from, $subject, $msg['xhtml'], $msg['plain']);
if($ok!==true) { orderModelError(); }

//
// full success
//
?>
<div class="success"><?php echo $_alertsxml['success'][0]; ?></div>
<script type="text/javascript">
ID('orderModelSubmitBtn').style.display = 'none';
ID('orderModelCloseBtn').style.display = 'inline';
</script>