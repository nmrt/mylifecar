<?php

//
// variables needed
//
// $_SESSION
// $_uid
// $_aid
//

session_start();

$return = true;

if(!$_SESSION['localhost'])
{
	
	//
	// includes
	//
	/*include 'Mail.php';
	include 'Mail/mime.php';*/
	include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
	include_once "$_SERVER[DOCUMENT_ROOT]/php/class/XML.php"; $XML = new XML();
	include_once 'text.php';
	include_once 'globals.php';
	include_once "$_SERVER[DOCUMENT_ROOT]/php/script/corpMsgGen.php";
	
	//
	// xml
	//
	if(!$_languagexml)
	{
		$_languagexml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/page/index.xml");
		$_languagexml = $XML->toArray($_languagexml->tagChildren);
		$_languagexml = $_languagexml['body'];
	}
	
	//
	// vars
	//
	$link = "http://$_SERVER[HTTP_HOST]/?page=user&amp;action=activate&amp;uid=$_uid&amp;aid=$_aid";
	$host = preg_replace("/(?i)^www\./", '', $_SERVER['HTTP_HOST']);
	
	//
	// sql: email, first_name, last_name
	//
	$q = "SELECT nickname, email, first_name, last_name FROM users WHERE id='$_uid'";
	$r = mysql_query($q, $_mysql['db']['main']);
	$nn = mysql_result($r, 0, 0);
	$to = mysql_result($r, 0, 1);
	$fn = mysql_result($r, 0, 2);
	$ln = mysql_result($r, 0, 3);
	$_uname = ($fn && $ln) ? "$fn $ln" : $nn;
	
	//
	// from
	//
	$from = '"'.$host.'" <info@'.$_SESSION['dd'].'>';
	
	//
	// xhtml message part
	//
	ob_start();
	printf
	(
		$_userlxml['activate']['msg']['xhtml'][0],
		$_uname, $_SERVER['HTTP_HOST'], $_SERVER['HTTP_HOST']
	);
	?>
	<a href="<?php echo $link; ?>"
	style="display:block; margin:20px; font-size:20px; font-weight:bold; color:red; text-decoration:underline;"
	><?php echo $_userxml['activate']['button'][0]; ?></a>
	<?php
	$xhtmlmsg = ob_get_clean();
	
	//
	// plain message part
	//
	ob_start();
	printf
	(
		$_userlxml['activate']['msg']['plain'][0],
		$_uname, $_SERVER['HTTP_HOST'], str_replace('&amp;','&',$link)
	);
	$plainmsg = ob_get_clean();
	
	//
	// subject
	//
	ob_start();
	printf($_userlxml['activate']['msg']['subject'][0], $_SERVER['HTTP_HOST']);
	$subject = ob_get_clean();
	
	/*//
	// headers
	//
	$h = array
	(
		'To'=>$to,
		'From'=>$from,
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
	include_once "$_SERVER[DOCUMENT_ROOT]/php/script/email.php";
	$msg = corpMsgGen($xhtmlmsg, $plainmsg);
	$return = email($to, $from, $subject, $msg['xhtml'], $msg['plain']);
	
	// mysql close
	include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/close.php";
	
}


return $return;

?>