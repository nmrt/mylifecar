<?php

function tidy($text, $rconf=array())
{
	
	$text = str_replace('<amp/>', '&', $text);
	$conf = array
	(
		/*'bare' => true,
		'clean' => true,*/
		'drop-empty-paras' => true,
		'drop-proprietary-attributes' => true,
		'indent' => true,
		'indent-spaces' => 4,
		'logical-emphasis' => true,
		'output-xhtml' => true,
		'quote-ampersand' => true,
		'quote-marks' => true,
		'show-body-only' => true,
		'break-before-br' => true
	);
	foreach($rconf as $k=>$v) { $conf[$k] = $v; }
	$tidy = tidy_parse_string($text, $conf, 'utf8');
	tidy_clean_repair($tidy);
	
	return $tidy;
	
}

?>