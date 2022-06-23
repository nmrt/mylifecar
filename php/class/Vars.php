<?php

////////////////////////////////////////////////////////////
//
// class Vars
//
////////////////////////////////////////////////////////////

class Vars
{
	
	////////////////////////////////////////////////////////////
	//
	// method init
	//
	////////////////////////////////////////////////////////////
	
	function init()
	{
		
		//
		// vars
		//
		foreach($GLOBALS as $k=>$v) { $$k = $GLOBALS[$k]; }
		
		//
		// language
		//
		$language = array();
		$language['@name'] = $_language;
		$l = $language['@name'];
		$s = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/page/index.xml");
		$s = $XML->toArray($s->tagChildren);
		$language['head'] = $s['head'];
		$language['body'] = $s['body'];
		
		//
		// gSection, section
		//
		$gSection = array();
		$gSection['@name'] = ($x=$_GET['gSection']) ? $x : $_gSection;
		$gs = $gSection['@name'];
		$section = array();
		$section['@name'] = ($x=$_GET['section']) ? $x : $_section;
		$s = $section['@name'];
		
		//
		// page
		//
		$page = array();
		$page['@name'] = ($x=$_GET['page']) ? $x : $_page;
		$p = $page['@name'];
		$f = "$_SESSION[dr]/xml/lang/$_SESSION[lang]/page/$gs/$s/$p.xml";
		if(file_exists($f))
		{
			$s = $XML->parse($f);
			$s = $XML->toArray($s->tagChildren);
			$page['head'] = $s['head'];
			$page['body'] = $s['body'];
		}
		
		$this->language = $language;
		$this->gSection = $gSection;
		$this->section = $section;
		$this->page = $page;
		
	}
	
} // class Vars

?>