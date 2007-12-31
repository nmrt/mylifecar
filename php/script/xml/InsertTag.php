

<?php

function &xmlInsertTag($tag, &$tag2, $type='append')
{
	
	switch($type)
	{
		case 'append':
			$tag['parent'] =& $tag2;
			$tag2['children'][] = $tag;
			$tag =& $tag2['children'][count($tag2['children'])-1];
			break;
		case 'after':
			$tag['parent'] =& $tag2['parent'];
			$a = array();
			foreach($tag2['parent']['children'] as $child)
			{
				$test = 0;
				if($child['name']==$tag2['name']) { $test++; }
				if($child['attributes']==$tag2['attributes']) { $test++; }
				if($test==2)
				{
					$a[] = $child;
					$a[] = $tag;
					$tag =& $a[count($a)-1];
				}
				else { $a[] = $child; }
			}
			$tag2['parent']['children'] = $a;
			break;
		case 'before':
			$tag['parent'] =& $tag2['parent'];
			$a = array();
			foreach($tag2['parent']['children'] as $child)
			{
				$test = 0;
				if($child['name']==$tag2['name']) { $test++; }
				if($child['attributes']==$tag2['attributes']) { $test++; }
				if($test==2)
				{
					$a[] = $tag;
					$tag =& $a[count($a)-1];
					$a[] = $child;
				}
				else { $a[] = $child; }
			}
			$tag2['parent']['children'] = $a;
			break;
	}
	
	return $tag;
	
}

?>

