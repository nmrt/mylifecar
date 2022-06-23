<?php

ini_set('display_errors', true);
error_reporting(E_ALL ^ E_NOTICE);

include "$_SERVER[DOCUMENT_ROOT]/php/script/fs.php";

$ok = fsCopy('test/c.png', 'test/c2.png', true);
var_dump($ok);

?>