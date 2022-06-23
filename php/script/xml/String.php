

<?php

function xmlString($xml)
{
	
	$str = '';
	
	//
	// head
	//
	$str .= '<?xml';
	foreach($xml['head']['attributes'] as $k=>$v) { $str .= " $k=\"$v\""; }
	$str .= '?>'."\n";
	
	//
	// root
	//
	$str .= '<root>';
	function f($tag, $str)
	{
		if($tag['children'])
		{
			foreach($tag['children'] as $child)
			{
				$count = 1;
				$parent = $child['parent'];
				while($parent)
				{
					$count++;
					$parent = $parent['parent'];
				}
				$t = '';
				for($i=0; $i<$count; $i++) { $t .= "\t"; }
				$str .= "\n".$t.'<'.$child['name'];
				if($child['attributes'])
				{ foreach($child['attributes'] as $k=>$v) { $str .= " $k=\"$v\""; } }
				$str .= '>';
				if($child['data']) { $str .= '<![CDATA['.$child['data'].']]>'; }
				if($child['children'])
				{
					$str = f($child, $str);
					$str .= "\n$t";
				}
				$str .= '</'.$child['name'].'>';
			}
		}
		return $str;
	}
	$str = f($xml['root'], $str);
	$str .= "\n".'</root>';
	
	return $str;
	
}

?>

