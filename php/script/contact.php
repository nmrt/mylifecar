<?php

session_start();
if(!$_SESSION['user']) { die('log in'); }

//
// includes
//
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/email.php";
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/user/text.php";

//
// send letter
//
$to = "info@$_SESSION[dd]";
$fr = '"'.$_SESSION['user']['nickname'].'" <'.$_SESSION['user']['email'].'>';
$ok = email($to, $fr, $_POST['form']['subject'], $_POST['form']['message']);

//
// reports
//
if($ok===true)
{
	echo '<span class="success">'.$_userlxml['contact_us']['report']['success'][0].'</span>';
	?>
	<script type="text/javascript">
	ID('contactFormSendBtn').style.display = 'none';
	ID('contactFormCloseBtn').style.display = 'inline';
	</script>
	<?php
}
else { echo '<span class="failure">'.$_userlxml['contact_us']['report']['failure'][0].'</span>'; }

?>