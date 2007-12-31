<?php

/*ini_set('display_errors', true);
error_reporting(E_ALL ^ E_NOTICE);*/

session_start();

function corpMsgGen($xhtml, $plain='')
{
	
	//
	// preparations
	//
	$return = array();
	if(!$plain) { $plain = strip_tags($xhtml); }
	
	//
	// inclusions, variables
	//
	include_once "$_SERVER[DOCUMENT_ROOT]/php/class/XML.php"; $XML = new XML();
	$_languagexml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/page/index.xml");
	$_languagexml = $XML->toArray($_languagexml->tagChildren);
	$_languagexml = $_languagexml['body'];
	$_host = preg_replace("/(?i)w{3}\./", '', $_SERVER['HTTP_HOST']);
	
	//
	// xhtml
	//
	ob_start();
	?>
	<div style="font-family:Verdana; font-size:12px; color:#eee; background-color:#666; padding:20px;">
	<div style="font-family:'Trebuchet MS'; font-size:36px;"><?php echo $_languagexml['head']['title'][0]; ?></div>
	<?php echo $_languagexml['head']['slogan'][0]; ?>
	<hr noshade="noshade" size="2" style="margin: 10px 0; color:#ccc;" />
	<?php echo $xhtml; ?>
	<div style="margin-top:20px;">
	<a href="http://<?php echo $_host; ?>" target="_blank"
	style="font-family:Verdana; font-size:9px; color:red; background:none; text-decoration:underline;"
	><?php echo $_host; ?></a>
	</div>
	</div>
	<?php
	$return['xhtml'] = ob_get_clean();
	
	//
	// plain
	//
	ob_start();
	echo "$_host\n";
	$slogan = strip_tags($_languagexml['head']['slogan'][0]);
	echo "$slogan\n";
	for($i=0; $i<strlen($slogan); $i++) { echo '='; } echo "\n";
	echo $plain;
	$return['plain'] = ob_get_clean();
	
	return $return;
	
}

?>