<?php

session_start();

//
// includes
//
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/user/text.php";
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/email.php";
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/corpMsgGen.php";

//
// variables
//
$_xml = $_userlxml['restore'];
$_alertsxml = $_xml['alerts'];
$_msgxml = $_xml['msg'];
$_host = preg_replace("/(?i)w{3}\./", '', $_SERVER['HTTP_HOST']);

//
// error function
//
function error($code='failure', $die=true)
{
	echo '<div class="failure">';
	echo $GLOBALS['_alertsxml'][$code][0];
	echo '</div>';
	if($die) { die; }
}

//
// no key was posted
//
if(!$_POST['key']) { error('no_key'); }

//
// SELECT user with specified key
//
$q = "SELECT * FROM users WHERE uniqkey='$_POST[key]'";
$sqlr = mysql_query($q, $_mysql['db']['main']);
if(!@mysql_num_rows($sqlr)) { error('not_exists'); }
$sqlrow = @mysql_fetch_assoc($sqlr);
$_uname = ($sqlrow['first_name'] && $sqlrow['last_name']) ? "$sqlrow[first_name] $sqlrow[last_name]" : $sqlrow['nickname'];

//
// generate random password
//
$_npassword = substr(md5(uniqid(rand(), true)), 0, 5);

//
// change user's password
//
$q = "UPDATE users SET password=md5('$_npassword') WHERE uniqkey='$_POST[key]'";
mysql_query($q, $_mysql['db']['main']);

//
// send email
//
$to = $sqlrow['email'];
$from = '"'.$_host.'" <info@'.$_SESSION['dd'].'>';
// subject
ob_start();
printf($_msgxml['subject'][0], $_host);
$subject = ob_get_clean();
// xhtml
ob_start();
printf($_msgxml['xhtml'][0], $_uname, $sqlrow['nickname'], $_npassword, $sqlrow['uniqkey']);
$xhtml = ob_get_clean();
// plain
ob_start();
printf($_msgxml['plain'][0], $_uname, $sqlrow['nickname'], $_npassword, $sqlrow['uniqkey']);
$plain = ob_get_clean();
// send
$msg = corpMsgGen($xhtml, $plain);
if(email($to, $from, $subject, $msg['xhtml'], $msg['plain']))
{
	?>
	<div class="success">
	<?php echo $_alertsxml['sent'][0]; ?>
	</div>
	<script type="text/javascript">
	ID('restoreAccountWindowSubmitBtn').style.display = 'none';
	ID('restoreAccountWindowCloseBtn').style.display = 'block';
	</script>
	<?php
}
else { error('not_sent'); }

?>