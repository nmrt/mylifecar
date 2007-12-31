<?php

////////////////////////////////////////////////////////////
//
// class XML
//
////////////////////////////////////////////////////////////

class XML
{
	
	var $xml;
	var $path;
	var $parser;
	
	function XML($path="")
	{
		include_once 'XMLParser.php';
		$this->path = $path;
	}
	
	////////////////////////////////////////////////////////////
	//
	// method parse
	//
	////////////////////////////////////////////////////////////
	
	function parse($path="")
	{
		
		if(!$path) { $path = $this->path; }
		if(preg_match("/^http:\/\//", $path))
		{
			$ch = @curl_init($path);
			@curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			$f = @curl_exec($ch);
			@curl_close($ch);
		}
		else { $f = @file_get_contents($path); }
		if(!$f)
		{
			$dr = preg_replace("/\/$/", '', $_SERVER['DOCUMENT_ROOT']);
			echo '<h6>Doesn\'t exist: '.str_replace($dr,'',$path).'</h6>';
			return new XMLTag('root');
		}
		$parser = new XMLParser($f);
		$parser->Parse();
		$xml = $parser->document;
		$this->xml = $xml;
		$this->parser = $parser;
		return $this->xml;
		
	}
	
	////////////////////////////////////////////////////////////
	//
	// method toArray
	//
	////////////////////////////////////////////////////////////
	
	function toArray($node, $return=array())
	{
		
		if(!is_array($node)) { $node = array($node); }
		foreach($node as $n)
		{ $return[$n->tagName]['%count']++; }
		$i=0; foreach($node as $n)
		{
			if($return[$n->tagName]['%count']==1)
			{
				$return[$n->tagName][] = $n->tagData;
				foreach($n->tagAttrs as $a=>$v)
				{ $return[$n->tagName]['@'.$a] = $v; }
				$return[$n->tagName] = $this->toArray($n->tagChildren, $return[$n->tagName]);
			}
			else
			{
				$return[$n->tagName][$i][] = $n->tagData;
				foreach($n->tagAttrs as $a=>$v)
				{ $return[$n->tagName][$i]['@'.$a] = $v; }
				$return[$n->tagName][$i] = $this->toArray($n->tagChildren, $return[$n->tagName][$i]);
				$i++;
				if($i==$return[$n->tagName]['%count']) { $i=0; }
			}
		}
		return $return;
		
	}
	
	////////////////////////////////////////////////////////////
	//
	// method toPlural
	//
	////////////////////////////////////////////////////////////
	
	function toPlural($node)
	{
		
		$return = $node;
		if($node['%count']==1)
		{
			foreach($node as $k=>$v) { $return[$k] = $v; }
			$return = array($return);
		}
		return $return;
		
	}
	
	////////////////////////////////////////////////////////////
	//
	// method getElementsByName
	//
	////////////////////////////////////////////////////////////
	
	function getElementsByName($name, $element="", $options=array())
	{
		
		if(!$element) { $element = $this->xml; }
		if(gettype($options['clearCache'])!='boolean') { $options['clearCache'] = true; }
		if($options['clearCache'])
		{
			$this->result = array();
			$options['clearCache'] = false;
		}
		$elements = $element->tagChildren;
		foreach($elements as $element)
		{
			if($options['strict']) { $r = ($name==$element->tagName); }
			else { $r = preg_match($name, $element->tagName); }
			if($r) { $this->result[] = $element; }
			if($options['first'])
			{ if(count($this->result)>0) { return $this->result[0]; } }
			if(count($element->tagChildren)>0) { $this->getElementsByName($name, $element, $options); }
		}
		return $this->result;
		
	}
	
	////////////////////////////////////////////////////////////
	//
	// method getElementByName
	//
	////////////////////////////////////////////////////////////
	
	function getElementByName($name, $element)
	{
		
		$options = array('first'=>true, 'strict'=>true);
		return $this->getElementsByName($name, $element, $options);
		
	}
	
	////////////////////////////////////////////////////////////
	//
	// method getElementsByAttr
	//
	////////////////////////////////////////////////////////////
	
	function getElementsByAttr($attr, $value, $element="", $result=array())
	{
		
		if(strlen($element)==0) { $element = $this->xml; }
		$elements = $element->tagChildren;
		foreach($elements as $element)
		{
			foreach($element->tagAttrs as $tagAttr)
			{
				if(isset($element->tagAttrs[$attr]))
				{
					if(preg_match($value, $tagAttr)) { $result[] = $element; }
				}
			}
			if(count($element->tagChildren)>0) { $result = $this->getXMLelementsByAttr($attr, $value, $element, $result); }
		}
		return $result;
		
	}
	
} // class XML

?>