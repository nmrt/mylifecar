<?php

//
// variables
//
$uid = $_GET['uid'];
$aid = $_GET['aid'];
$alerts = $_userxml['activate']['alerts'];
include 'globals.php';

//
// parameters exist
//
if($uid && $aid)
{
	
	//
	// mysql
	//
	include 'php/script/mysql/connect.php';
	$q = "SELECT * FROM users WHERE id=$uid";
	$mysqlSelectr = mysql_query($q, $_mysql['db']['main']);
	$user = @mysql_fetch_assoc($mysqlSelectr);
	
	//
	// ? already activated
	//
	if(!$_error && $user['active']=='1')
	{
		error('already', $user['nickname']);
		include 'login.form.php';
	}
	
	if(!$_error)
	{
		
		//
		// activate, at last
		//
		$q = "UPDATE users SET active='1' WHERE (id='$uid' AND active='$aid')";
		$mysqlr = mysql_query($q, $_mysql['db']['main']);
		
		//
		// activation failure
		//
		if(!@mysql_affected_rows($_mysql['db']['main'])) { error('access_denied'); }
		
	}
	
	//
	// fs
	//
	include "$_SESSION[dr]/php/script/fs.php";
	
	//
	// img dir
	//
	if(!$_error && @mysql_num_rows($mysqlSelectr))
	{
		$dir = "img/users/$uid";
		if(!is_dir("$_SERVER[DOCUMENT_ROOT]/$dir"))
		{
			if(!$_error && !fsMkdir($dir)) { error(); }
		}
	}
	
	//
	// full success
	//
	if(!$_error)
	{
		
		if(!$_SESSION['localhost'])
		{
			
			//
			// includes
			//
			include 'Mail.php';
			include 'Mail/mime.php';
			include_once "$_SERVER[DOCUMENT_ROOT]/php/script/corpMsgGen.php";
			include_once "$_SERVER[DOCUMENT_ROOT]/php/script/email.php";
			
			//
			// xml
			//
			$_userlxml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/user.xml");
			$_userlxml = $XML->toArray($_userlxml->tagChildren);
			
			//
			// vars
			//
			$host = preg_replace("/(?i)^www\./", '', $_SERVER['HTTP_HOST']);
			$to = $user['email'];
			$from = '"'.$host.'" <info@'.$_SESSION['dd'].'>';
			$_uname = ($user['first_name'] && $user['last_name'])
			? "$user[first_name] $user[last_name]" : $user['nickname'];
			
			//
			// xhtml message part
			//
			ob_start();
			printf
			(
				$_userlxml['activate']['msg']['complete']['xhtml'][0],
				$_uname, $host, $user['nickname'], $user['uniqkey']
			);
			$xhtmlmsg = ob_get_clean();
			
			//
			// plain message part
			//
			ob_start();
			printf
			(
				$_userlxml['activate']['msg']['complete']['plain'][0],
				$_uname, $host, $user['nickname'], $user['uniqkey']
			);
			$plainmsg = ob_get_clean();
			
			//
			// subject
			//
			ob_start();
			printf($_userlxml['activate']['msg']['complete']['subject'][0], $host);
			$subject = ob_get_clean();
			
			/*//
			// headers
			//
			$h = array
			(
				'To'=>$to,
				'From'=>'"'.$host.'" <info@'.$host.'>',
				'Subject'=>$subject
			);
			
			//
			// constructor
			//
			$mime = new Mail_mime("\n");
			$mime->setTXTBody($plainmsg);
			$mime->setHTMLBody($xhtmlmsg);
			
			//
			// encoding
			//
			$body = $mime->get(
			array
			(
				head_encoding'=>'base64',
				'text_encoding'=>'base64',
				'html_encoding'=>'base64',
				'head_charset'=>'UTF-8',
				'text_charset'=>'UTF-8',
				'html_charset'=>'UTF-8'
			)
			);
			$hdrs = $mime->headers($h);
			//$hdrs['Subject'] = preg_replace("/\r\n|\n\r|\n|\r/", '', $hdrs['Subject']);
			
			//
			// factory, send
			//
			$mail =& Mail::factory
			(
				'smtp',
				array
				(
					'auth' => true,
					'host' => "mail.$host",
					'username' => "info@$host",
					'password' => "$host"
				)
			);
			$return = $mail->send($to, $hdrs, $body);*/
			$msg = corpMsgGen($xhtmlmsg, $plainmsg);
			$return = email($to, $from, $subject, $msg['xhtml'], $msg['plain']);
			
		}
				
		echo '<h2 class="success">'.$alerts['ok'][0].': '.$user['nickname'].'</h2>';
		echo '<div class="tip">'.$alerts['ok']['tip'][0].'</div>';
		include 'login.form.php';
	}
	
	// mysql end
	include 'php/script/mysql/close.php';
	
}

//
// access dinied, no parametrs
//
else { error('access_denied'); }

?>