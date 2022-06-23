<?php

echo '<table border="0" cellpadding="0" cellspacing="0">';

echo '<tr>';
echo '<td align="left" colspan="2"><h1>'.$_xml['steps'][0].'</h1></td>';
echo '</tr>';

$color = array('#99FF66','#FFFF99','#CC99FF');
foreach($_xml['steps']['step'] as $v)
{
	if(is_array($v))
	{
		echo '<tr>';
		echo '<td align="left" style="padding:10px;">';
		echo $v[0];
		echo '</td>';
		switch($v['@class'])
		{
			
			//
			// sign in, log in
			//
			case 'signinLogin':
				echo '<td align="left" style="padding-left:10px;">';
				echo '<table border="0" cellspacing="0" cellpadding="2">';
				$a = array('signin.form','login.form');
				foreach($a as $v)
				{
					$pv = $v;
					if($x=strrpos($v,'.')) { $pv = substr($v,0,$x); }
					switch($v)
					{
						default: $c = ''; break;
						case 'login.form':
							$c = '&amp;continue='.urlencode("$_SERVER[PHP_SELF]?$_SERVER[QUERY_STRING]");
							break;
					}
					?>
					<tr>
					<td>
					<?php
					
					echo '<a href="/?page=user&amp;action='.$v.$c.'">';
					$_m = array('alt'=>$text[$pv]['button'][0]);
					echo img_png("img/ui/color/$pv.png", $_msie, array('_msie'=>$_m));
					echo '</a>';
					
					?>
					</td>
					<td>
					<?php
					
					echo '<a href="/?page=user&amp;action='.$v.$c.'">';
					echo $text[$pv]['button'][0];
					echo '</a>';
					
					?>
					</td>
					</tr>
					<?php
				}
				echo '</table>';
				echo '</td>';
				break;
			
			//
			// activate
			//
			case 'pre.act.link':
				echo '<td align="left" style="padding-left:10px;">';
				echo '<img src="/img/pay/pre.act.link.jpg" border="0" alt="activate link preview" />';
				echo '</td>';
				break;
			
			//
			// pay button, at last
			//
			case 'payBtn':
				echo '<td align="left" style="padding-left:10px;">';
				echo '<button type="button" disabled="disabled">'.$_xml['btn'][0].'</button>';
				echo '</td>';
				break;
			
		}
		echo '</tr>';
		echo '<tr>';
		$b = '';
		if(next($color)) { $b = 'border-bottom: 1px dashed #ccc;'; }
		echo '<td colspan="2" style="'.$b.' font-size:1px;">';
		echo '&nbsp;</td>';
		echo '</tr>';
	}
}
echo '</table>';

?>