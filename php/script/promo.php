<?php

$_count = 100;
$_forRevard = 5;
include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
$q = "SELECT id FROM paypal WHERE promo='1'";
$r = mysql_query($q, $_mysql['db']['main']);
$pn = (int)@mysql_num_rows($r);
$q = "SELECT id FROM webmoney WHERE promo='1'";
$r = mysql_query($q, $_mysql['db']['main']);
$wn = (int)@mysql_num_rows($r);
$_left = $_count-$pn-$wn;
include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/close.php";

?>