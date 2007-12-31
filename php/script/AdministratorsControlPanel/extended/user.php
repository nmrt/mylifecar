

<?php

session_start();

//
// includes
//
include "$_SESSION[dr]/php/script/mysql/connect.php";
include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();

//
// img
//
$src = "img/users/$_SESSION[lang]/$_GET[id].png";
if(!is_file("$_SESSION[dr]/$src")) { $src = 'img/ui/no.image.png'; }
$imgs = getimagesize("$_SESSION[dr]/$src");
$mt = filemtime("$_SESSION[dr]/$src");

//
// desc
//
$xml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/user/$_GET[id].xml");
$xml = $XML->toArray($xml->tagChildren);

?>

<table border="0" cellspacing="0" cellpadding="5">
<tr>
<td valign="top"><img src="/<?php echo "$src?mt=$mt"; ?>" <?php echo $imgs[3]; ?> alt="<?php echo $_GET['id']; ?>" border="0" /></td>
<td class="serif serifTD" valign="top"><?php echo $xml['desc'][0]; ?></td>
</tr>
</table>

<?

//
// end
//
include "$_SESSION[dr]/php/script/mysql/close.php";

?>

