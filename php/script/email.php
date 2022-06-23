<?php

session_start();

function email($to, $from, $subject, $xhtml='', $plain='')
{
	
	//
	// includes
	//
	include_once 'Mail.php';
	include_once 'Mail/mime.php';
	
	//
	// headers
	//
	$h = array
	(
		'To' => $to,
		'From' => $from,
		'Subject' => $subject
	);
	
	//
	// constructor
	//
	$mime = new Mail_mime("\n");
	if(!$plain) { $plain = strip_tags($xhtml); }
	$mime->setTXTBody($plain);
	if($xhtml) { $mime->setHTMLBody($xhtml); }
	
	//
	// encoding
	//
	$body = $mime->get(
	array
	(
		'head_encoding'=>'base64',
		/*'text_encoding'=>'base64',
		'html_encoding'=>'base64',*/
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
	$host = $_SESSION['dd'];
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
	
	return $mail->send($to, $hdrs, $body);
	
}

?>