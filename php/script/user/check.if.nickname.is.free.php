

<?php

session_start();

include "$_SESSION[dr]/php/script/mysql/connect.php";
include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();
include "$_SESSION[dr]/php/script/user/text.php";

$q = "SELECT * FROM users WHERE nickname='$_GET[n]'";
$r = mysql_query($q, $_mysql['db']['main']);

if(!@mysql_affected_rows($_mysql['db']['main']))
{ echo '<span class="sansSerif" style="color:green;">'.$_userxml['form']['nickname']['is_free'][0].'</span>'; }
else { echo '<span class="sansSerif" style="color:red;">'.$_userxml['form']['nickname']['is_reserved'][0].'</span>'; }

include "$_SESSION[dr]/php/script/mysql/close.php";

?>

