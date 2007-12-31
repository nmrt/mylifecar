<?php

include_once "$_SERVER[DOCUMENT_ROOT]/php/class/XML.php"; $XML = new XML();
if(!$_datexml)
{
	$_datexml = $XML->parse("http://$_SESSION[repository]/xml/lang/$_SESSION[lang]/date.xml");
	$_datexml = $XML->toArray($_datexml->tagChildren);
}

function parseDate($date, $options=array())
{
	if(!isset($options['relative'])) { $options['relative'] = true; }
	$dt = explode(' ', $date);
	$d = explode('-', $dt[0]);
	$t = explode(':', $dt[1]);
	$ts = mktime(max($t[0],1),max($t[1],1),max($t[2],1), max($d[1],1),max($d[2],1),$d[0]);
	$r = '';
	if($options['relative'])
	{
		if(date('dmY',$ts)==date('dmY')) { $r = $GLOBALS['_datexml']['today'][0].', '; }
		else if(date('Yz',$ts)==(date('Yz')-1)) { $r = $GLOBALS['_datexml']['yesterday'][0].', '; }
		else if(date('Yz',$ts)==(date('Yz')-2)) { $r = $GLOBALS['_datexml']['afteryesterday'][0].', '; }
	}
	if($d[1])
	{
		$r .= $GLOBALS['_datexml']['months']['month'][(int)date('m',$ts)-1][0];
	}
	if($d[2]) { $r .= date(' j', $ts); }
	if($d[1] || $d[2]) { $r .= ', '; }
	$r .= date('Y', $ts);
	if($t[0] && $t[1]) { $r .= ", $t[0]:$t[1]"; }
	return $r;
}

?>