

<?php

session_start();

//
// includes
//
include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();

//
// desc
//
$xml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/rss/editor/$_GET[id].xml");
$xml = $XML->toArray($xml->tagChildren);

?>

<table border="0" cellspacing="0" cellpadding="5">
<tr>
<td class="serif" valign="top"><?php echo $xml['desc'][0]; ?></td>
</tr>
</table>

