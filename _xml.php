<pre><?php

$dir = 'php/script/xml';
$dh = opendir($dir);
while($file=readdir($dh))
{
	if(is_file("$dir/$file")) { include_once "$dir/$file"; }
}

$txt = file_get_contents('xml.txt');
$files = preg_split("/[\r\n]+=+[\r\n]+/", $txt, -1, PREG_SPLIT_NO_EMPTY);
foreach($files as $file)
{
	$xml = xmlGenerateSchema();
	$blocks = preg_split("/(\r\n){2}/", $file, -1, PREG_SPLIT_NO_EMPTY);
	$name = $blocks[0];
	var_dump($name);
	array_splice($blocks, 0, 1);
	foreach($blocks as $block)
	{
		$rows = preg_split("/[\r\n]/", $block, -1, PREG_SPLIT_NO_EMPTY);
		$tag = $rows[0];
		//var_dump($tag);
		array_splice($rows, 0, 1);
		$rows = join("\n", $rows);
		//var_dump($rows);
		$tagps = preg_split("/\//", $tag, -1, PREG_SPLIT_NO_EMPTY);
		$tagstr = '[root]';
		for($i=0; $i<count($tagps)-1; $i++)
		{
			$tagp = $tagps[$i];
			$tagstrb = $tagstr;
			$tagstr .= '['.$tagp.']';
			if(!eval("return \$xml{$tagstr};"))
			{
				$tagxml = xmlGenerateTag($tagp, '', '');
				eval("xmlInsertTag(\$tagxml, \$xml{$tagstrb});");
			}
		}
		$tagxml = xmlGenerateTag($tagps[count($tagps)-1], '', $rows);
		eval("xmlInsertTag(\$tagxml, \$xml{$tagstr});");
	}
	print_r($xml);
}

?></pre>