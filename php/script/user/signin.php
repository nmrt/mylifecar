

<?php

session_start();

//
// vars
//
include 'text.php';
$_sql = $_POST['sql'];
$_uname = ($_sql['first_name'] && $_sql['last_name'])
? $_sql['first_name'].' '.$_sql['last_name'] : $_sql['nickname'];
$alerts = $text['signin']['alerts'];
include_once "$_SESSION[dr]/php/script/tidy.php";
include 'globals.php';

//
// mysql
//
include 'php/script/mysql/connect.php';
$q = "SELECT * FROM users WHERE nickname = '$_sql[nickname]'";
$r = mysql_query($q, $_mysql['db']['main']);

//
// not exist
//
if(!@mysql_num_rows($r))
{
	
	$_aid = md5(uniqid(rand(),true));
	$_key = strtoupper(md5(uniqid(rand(),true)));
	$_sql['active'] = $_aid;
	$_sql['uniqkey'] = $_key;
	$ks = $vs = array();
	foreach($_sql as $k=>$v)
	{
		$ks[] = $k;
		switch($k)
		{
			case 'password': $v = md5($v); break;
		}
		$vs[] = "'".mysql_real_escape_string($v, $_mysql['db']['main'])."'";
	}
	$ks = join(', ', $ks);
	$vs = join(', ', $vs);
	$q = "INSERT INTO users ($ks) VALUES ($vs)";
	mysql_query($q, $_mysql['db']['main']);
	
	//
	// ok
	//
	if(!mysql_error($_mysql['db']['main']))
	{

		//
		// id
		//
		$id = mysql_insert_id($_mysql['db']['main']);
		$_uid = $id;
		include 'php/script/mysql/close.php';
		
		//
		// letter
		//
		$er = include 'activation.letter.php';
		
		
		if($er!==true) { error(); }
		else
		{
	
			//
			// success
			//
			$r = '<h2 class="success">'.$alerts['ok'][0].': '.$_uname.'</h2>';
			$rtip = '<div class="tip">'.$alerts['ok']['tip'][0].'</div>';
			$ra = include 'send.activation.letter.block.php';
			$_SESSION['report'] = $r.$rtip.$ra;
			?>
			<script type="text/javascript">
			location.href='/?page=user&action=login.form';
			</script>
			<?php
			
		}

	}
	
	//
	// failure
	//
	else if(!$_error)
	{
		error();
		include 'signin.form.php';
	}
	
}

//
// exist
//
else if(!$_error)
{
	error('exists', $_uname);
	include 'signin.form.php';
}

?>

