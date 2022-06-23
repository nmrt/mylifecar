<?php

ini_set('display_errors', true);
error_reporting(E_ALL^E_NOTICE);

session_start();

//
// new line function
//
function nl($text) { return "$text\n"; }

//
// main function
//
function rssGenerate($feed, $params=array())
{
	
	//
	// includes
	//
	include '../../php/script/global.variables.php';
	include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();
	
	//
	// global xml
	//
	$_rssxml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/rss.xml");
	$_rssxml = $XML->toArray($_rssxml->tagChildren);
	$_feedsxml = $_rssxml['feeds'];
	switch($feed)
	{
		case 'model':
			$_modelxml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/page/main/index/model.xml");
			$_modelxml = $XML->toArray($_modelxml->tagChildren);
			break;
	}
	
	//
	// headers
	//
	echo nl('<?xml version="1.0" encoding="utf-8"?>');
	echo nl('<rss version="2.0">');
	echo nl('<channel>');
	
	//
	// channel info
	//
	switch($feed)
	{
		case 'editor':
		case 'companies':
			$title = $_feedsxml[$feed]['title'][0];
			$desc = $_feedsxml[$feed]['desc'][0];
			$link  = "$_SERVER[HTTP_HOST]/";
			$link .= preg_replace("/(?i)^http\:\/\/(?:www\.|)$_SERVER[HTTP_HOST]\//",'',$_feedsxml[$feed]['link'][0]);
			break;
		case 'model':
			
			// vars
			$_GET['model'] = $params['id'];
			include "$_SESSION[dr]/php/script/model/variables.php";
			
			// title
			ob_start();
			printf($_rssxml['add_feeds'][$feed]['title'][0], "$realCompanyName $realModelName");
			$title = ob_get_clean();
			
			// desc
			ob_start();
			printf($_rssxml['add_feeds'][$feed]['desc'][0], "$realCompanyName $realModelName");
			$desc = ob_get_clean();
			
			// link
			$link = "$_SERVER[HTTP_HOST]/?page=model&model=$params[id]";
			
			break;
	}
	echo nl('<title><![CDATA['.$title.']]></title>');
	echo nl('<description><![CDATA['.$desc.']]></description>');
	echo nl('<link><![CDATA[http://'.$link.']]></link>');
	
	//
	// items
	//
	include "$_SESSION[dr]/php/script/mysql/connect.php";
	$sqlrows = array();
	switch($feed)
	{
		case 'editor':
			$q = "SELECT * FROM rss_editor ORDER BY id DESC";
			$sqlr = mysql_query($q, $_mysql['db']['main']);
			while($sqlrow=@mysql_fetch_assoc($sqlr))
			{
				$sqlrows[] = $sqlrow;
			}
			break;
		case 'companies':
			$q = "SELECT * FROM info ORDER BY id DESC";
			$sqlr = mysql_query($q, $_mysql['db'][$feed]);
			while($sqlrow=@mysql_fetch_assoc($sqlr))
			{
				$sqlrows[] = $sqlrow;
			}
			break;
		case 'model':
			$a = array('news','photos','people');
			foreach($a as $v)
			{
				$q = "SELECT * FROM $v WHERE model=$params[id]";
				$sqlr = mysql_query($q, $_mysql['db']['main']);
				while($sqlrow=@mysql_fetch_assoc($sqlr))
				{
					$sqlrow['tablename'] = $v;
					$sqlrows[] = $sqlrow;
				}
			}
			function cmp($a, $b)
			{
			   if($a['mts']==$b['mts']) { return 0; }
			   return ($a['mts']<$b['mts']) ? 1 : -1;
			}
			usort($sqlrows, "cmp");
			break;
	}
	for($i=0; $i<count($sqlrows); $i++)
	{
		
		$sqlrow = $sqlrows[$i];
		echo nl('<item>');
		
		//
		// title
		//
		switch($feed)
		{
			case 'editor': $title = $sqlrow['title']; break;
			case 'companies': $title = $sqlrow['realname']; break;
			case 'model':
				$title = $_modelxml['body'][$sqlrow['tablename']]['head'][0].': ';
				switch($sqlrow['tablename'])
				{
					case 'news':
					case 'photos':
						$title .= $sqlrow['title'];
						break;
					case 'people': $title .= $sqlrow['name']; break;
				}
				break;
		}
		echo nl('<title><![CDATA['.$title.']]></title>');
		
		//
		// description
		//
		switch($feed)
		{
			case 'editor': $dir = 'rss/editor'; break;
			case 'companies': $dir = 'company'; break;
			case 'model': $dir = "$feed/$sqlrow[tablename]"; break;
		}
		$f = "$_SESSION[dr]/xml/lang/$_SESSION[lang]/$dir/$sqlrow[id].xml";
		if(is_file($f))
		{
			$xml = $XML->parse($f);
			$xml = $XML->toArray($xml->tagChildren);
			switch($feed)
			{
				case 'editor':
				case 'companies':
					$desc = $xml['desc'][0];
					break;
				case 'model':
					switch($sqlrow['tablename'])
					{
					case 'news': $desc = $xml['body'][0]; break;
					case 'photos':
					case 'people':
						$desc = $xml['desc'][0];
						break;
					}
					break;
			}
			echo nl('<description><![CDATA['.$desc.']]></description>');
		}
		
		//
		// link
		//
		switch($feed)
		{
			case 'editor': $link = $sqlrow['link']; break;
			case 'companies': $link = "http://$_SERVER[HTTP_HOST]/?page=company&company=$sqlrow[id]"; break;
			case 'model': $link = "http://$_SERVER[HTTP_HOST]/?page=model&model=$params[id]&extended_block=$sqlrow[tablename]&searchID=$sqlrow[id]"; break;
		}
		echo nl('<link><![CDATA['.$link.']]></link>');
		
		echo nl('</item>');
		
	}
	include "$_SESSION[dr]/php/script/mysql/close.php";
	
	//
	// footer
	//
	echo nl('</channel>');
	echo '</rss>';
	
}

?>