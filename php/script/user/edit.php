

<?php

session_start();

//
// variables
//
include 'text.php';
$alerts = $text['edit']['alerts'];
$user = $_SESSION['user'];
$_sql = $_POST['sql'];
include_once "$_SESSION[dr]/php/script/tidy.php";
include 'globals.php';

//
// mysql
//
include 'php/script/mysql/connect.php';

//
// ! exist
//
$q = "SELECT * FROM users WHERE nickname='$_sql[nickname]'";
$r = mysql_query($q, $_mysql['db']['main']);
if(@mysql_num_rows($r) && $_sql['nickname']!=$user['nickname'])
{
	error('exists', $_sql['nickname']);
	include 'edit.form.php';
}

//
// ! wrong pass
//
if(!$_error && md5($_sql['password'])!=$user['password'])
{
	error('wrong_password');
	include 'edit.form.php';
}
	
//
// save data
//
if(!$_error)
{
	if($x=$_POST['npassword']) { $_sql['password'] = $x; }
	foreach($_sql as $k=>$v)
	{
		if($k=='password') { $v = md5($v); }
		$q = "UPDATE users SET $k='$v' WHERE id=$user[id]";
		$r = mysql_query($q, $_mysql['db']['main']);
		$_SESSION['user'][$k] = $v;
	}
	if(!$_error && mysql_error($_mysql['db']['main'])) { error(); }
}

//
// fs
//
include "$_SESSION[dr]/php/script/fs.php";

if(!$_error)
{
	
	//
	// xml
	//
	$dr = $Dir->read("$_documentRoot/php/script/xml");
	foreach($dr['f'] as $f) { include $f; }
	
	//
	// xml desc
	//
	$tidy = tidy($_POST['desc']);
	$xml = xmlGenerateSchema();
	$desc = xmlGenerateTag('desc', '', $tidy);
	xmlInsertTag($desc, $xml['root']);
	$str = xmlString($xml);
	$f = "xml/lang/$_SESSION[lang]/user/$user[id].xml";
	
	//
	// backup
	//
	if(!$_error && !$bkp=fsBkp($f)) { error(); }
	
	//
	// fwrite
	//
	if(!$_error && fsFwrite($f, $str))
	{
		//
		// success
		//
		$u = ($_sql['first_name'] && $_sql['last_name'])
		? $_sql['first_name'].' '.$_sql['last_name'] : $_sql['nickname'];
		$r = '<h2 class="success">'.$alerts['ok'][0].': '.$u.'</h2>';
		//$rtip = '<div class="tip">'.$alerts['ok']['tip'][0].'</div>';
		$_SESSION['report'] = $r.$rtip;
		fsDelete($bkp);
	}
	else
	{
		
		//
		// return file's bkp on failure
		//
		fsRename($bkp, $f);
		error();
		
	}
	
	//
	// close handlers
	//
	fclose($fp);
	ftp_close($_ftps);
	
	//
	// full success
	//
	if(!$_error)
	{
		?>
		<script type="text/javascript">
		location.href='/?page=user';
		</script>
		<?php
	}
	
}

include 'php/script/mysql/close.php';

?>

