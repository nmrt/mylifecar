

<?php

session_start();

include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();

$_userlxml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/user.xml");
$_userlxml = $XML->toArray($_userlxml->tagChildren);

$text = $XML->parse("http://$_SESSION[repository]/xml/lang/$_SESSION[lang]/user.xml");
$text = $XML->toArray($text->tagChildren);
$_userText = $text;
$_userxml = $text;

$validate = $XML->parse("http://$_SESSION[repository]/xml/lang/$_SESSION[lang]/validation.xml");
$validate = $XML->toArray($validate->tagChildren);
$_validatexml = $validate;

?>

