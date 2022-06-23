

<?php

session_start();

//
// includes
//
include "$_SESSION[dr]/php/script/mysql/connect.php";
include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();

//
// mysql SELECT for model/company
//
$q = "SELECT company FROM info WHERE id=$_GET[id]";
$r = mysql_query($q, $_mysql['db']['models']);
$company = mysql_result($r, 0);

//
// img
//
$src = "img/model/$_SESSION[lang]/$_GET[id].png";
if(!is_file("$_SESSION[dr]/$src")) { $src = 'img/ui/no.image.png'; }
$imgs = getimagesize("$_SERVER[DOCUMENT_ROOT]/$src");
$mt = filemtime("$_SESSION[dr]/$src");

//
// desc
//
/*$xml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/model/$_GET[id].xml");
$xml = $XML->toArray($xml->tagChildren);*/

?>

<table border="0" cellspacing="0" cellpadding="5">
<tr>
<td valign="top"><img src="/<?php echo "$src?mt=$mt"; ?>" <?php echo $imgs[3]; ?> alt="<?php echo $_GET['id']; ?>" border="0" /></td>
<td class="serif" valign="top"><?php /*echo $xml['desc'][0];*/ ?></td>
</tr>
</table>

<?

//
// end
//
include "$_SESSION[dr]/php/script/mysql/close.php";

?>

