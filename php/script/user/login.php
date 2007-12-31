

<?php

//
// variables
//
include 'text.php';
foreach($_POST as $k=>$v) { $$k = $v; }
$alerts = $text['login']['alerts'];
include 'globals.php';

//
// mysql
//
include 'php/script/mysql/connect.php';
$q = "SELECT * FROM users WHERE nickname='$nickname'";
$r = mysql_query($q, $_mysql['db']['main']);

//
// exists
//
if(@mysql_num_rows($r))
{
	
	$user = mysql_fetch_assoc($r);
	
	//
	// access granted
	//
	if(md5($password)==$user['password'])
	{
		
		//
		// active
		//
		if($user['active']=='1')
		{
			foreach($user as $k=>$v)
			{ $_SESSION['user'][$k] = $v; }
			$u = ($user['first_name'] && $user['last_name']) ? $user['first_name'].' '.$user['last_name'] : $user['nickname'];
			$r = '<h2 class="success">'.$alerts['ok'][0].': '.$u.'</h2>';
			$rtip = '<div class="tip">'.$alerts['ok']['tip'][0].'</div>';
			if($x=$_SESSION['continue'])
			{
				$url = $x;
				$_SESSION['continue'] = '';
			}
			else
			{
				$_SESSION['report'] = $r.$rtip;
				$url = '/?page=user';
			}
			?>
			<script type="text/javascript">
			location.href = '<?php echo $url; ?>';
			</script>
			<?php
		}
		
		//
		// NOT active
		//
		else if(!$_error)
		{
			error('not_actived', $nickname);
			$_uid = $user['id'];
			echo include 'send.activation.letter.block.php';
			include 'login.form.php';
		}
		
	}
	
	//
	// access denied
	//
	else if(!$_error)
	{
		error('bad_password', $nickname);
		include 'login.form.php';
	}
	
}

//
// not exists
//
else if(!$_error)
{
	error('not_exists', $nickname);
	include 'login.form.php';
}

include 'php/script/mysql/close.php';

?>

