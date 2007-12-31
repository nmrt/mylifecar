<pre><?php

//
// add attributes implementation
// ['@attr_name'] => 'attr_value'
//

include_once 'php/class/XML.php'; $XML = new XML();

function parse($xml, $fp, $tagname='')
{
	foreach($xml->tagChildren as $tc)
	{
		if($tc->tagData)
		{
			ob_start();
			echo "\n$tagname/".$tc->tagName."\n";
			echo $tc->tagData."\n";
			$txt = ob_get_clean();
			fwrite($fp, $txt, strlen($txt));
		}
		if(is_array($tc->tagChildren)) { parse($tc, $fp, "$tagname/".$tc->tagName); }
	}
}

$exceptions = array
(
	'dirs' => array
	(
		'xml/lang/en/company',
		'xml/lang/en/model',
		'xml/lang/en/user'
	),
	'files' => array()
);

function scan($dir, $fp)
{
	$dh = opendir($dir);
	while($file=readdir($dh))
	{
		if($file!='.' && $file!='..')
		{
			$ext = substr($file, strrpos($file,'.')+1);
			if(is_file("$dir/$file") && $ext=='xml')
			{
				if(!in_array("$dir/$file", $GLOBALS['exceptions']['files']))
				{
					ob_start();
					echo "\n\n";
					for($i=0; $i<strlen("$dir/$file"); $i++) { echo '='; } echo "\n";
					echo "$dir/$file\n";
					$txt = ob_get_clean();
					fwrite($fp, $txt, strlen($txt));
					$xml = $GLOBALS['XML']->parse("$dir/$file");
					parse($xml, $fp);
				}
			}
			else if(is_dir("$dir/$file"))
			{
				if(!in_array("$dir/$file", $GLOBALS['exceptions']['dirs'])) { scan("$dir/$file", $fp); }
			}
		}
	}
}

$fp = fopen('xml.txt', 'w');
scan('xml', $fp);

?></pre>