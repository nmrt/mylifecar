<?php

session_start();

function img_png($src, $msie=NULL, $attrs=array(), $sizingMethod='scale')
{
	
	$msie = (preg_match("/\bMSIE\b/", $_SERVER['HTTP_USER_AGENT'])) ? true : false;
	
	//
	// string for return
	//
	$png = '';
	
	//
	// modification time
	//
	$mt = filemtime("$_SESSION[dr]/".preg_replace("/^\//",'',$src));
	
	//
	// img size
	//
	if(!$imgs=@getimagesize($src))
	{
		$imgs = @getimagesize($_SESSION['dr'].'/'.preg_replace("/^\//",'',$src));
	}
	
	//
	// if not msie (firefox,..)
	//
	if(!$msie)
	{
		$png  = '<img src="'.$src.(preg_match("/\?/",$src)?'&amp;':'?')."mt=$mt".'"';
		$png .= " $imgs[3]";
		if(is_array($attrs['_msie']))
		{ foreach($attrs['_msie'] as $k=>$v) { $png .= " $k=\"$v\""; } }
		$png .= ' />';
	}
	
	//
	// if msie, after all
	//
	else
	{
		$png  = '<div style="';
		$png .= 'width:'.$imgs[0].'px; height:'.$imgs[1].'px; ';
		$png .= 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.(preg_match("/\?/",$src)?'&amp;':'?')."mt=$mt".'\', sizingMethod=\''.$sizingMethod.'\');';
		$png .= ' font-size:1px;';
		$png .= $attrs['msie']['style'].'"';
		if(!$attrs['msie']) { $attrs['msie'] = array(); }
		if(!$attrs['msie']['class']) { $attrs['msie']['class'] = ''; }
		$attrs['msie']['class'] .= ' png';
		foreach($attrs['msie'] as $k=>$v)
		{
			if($k!='style') { $png .= " $k=\"$v\""; }
		}
		$png .= '></div>';
	}
	
	return $png;
	
}

?>