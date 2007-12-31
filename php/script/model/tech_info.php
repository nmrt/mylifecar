

<?php

//
// mysql connect
//
include 'php/script/mysql/connect.php';

//
// info
//
$q = "SELECT * FROM info WHERE company='$codeCompanyName' AND id='$codeModelName'";
$r = mysql_query($q, $_mysql['db']['models']);
if($row=@mysql_fetch_assoc($r))
{
	echo '<div>';
	
	//
	// units system select
	//
	include_once "$_SERVER[DOCUMENT_ROOT]/php/script/units.php";
	$usys = unitsSystem();
	if($x=$_COOKIE["model{$codeModelName}TechinfoUnitsys"]) { $usys = $x; }
	$ussxml = $Vars->page['body'][$dataBlockName]['units_system_select'];
	?>
	<div align="right">
	<table border="0" cellspacing="0" cellpadding="0">
	<tr>
	<td><?php echo "$ussxml[0]:"; ?></td>
	<td style="padding-left:5px;">
	<select class="MultiSelect"
	onchange=
	"
		
		//
		// display elements
		//
		var $sys = (this.value=='met') ? 'imp' : 'met';
		var $sre = new RegExp('\\bunitsys_'+$sys+'\\b');
		var $dre = new RegExp('\\bunitsys_'+this.value+'\\b');
		var $con = ID('tech_info');
		var $els = $con.getElementsByTagName('span');
		for(var $i=0; $i<$els.length; $i++)
		{
			var $el = $els[$i];
			if(this.value!='both')
			{
				if($el.className.match($dre)) { $el.style.display = 'inline'; }
				else if($el.className.match($sre)) { $el.style.display = 'none'; }
			}
			else if($el.className.match(/\bunitsys_(met|imp)\b/)) { $el.style.display = 'inline'; }
		}
		
		//
		// set cockie
		//
		var $exp = new Date();
		var $year = $exp.getTime()+(1000*60*60*24*366);
		$exp.setTime($year);
		document.cookie = 'model<?php echo $codeModelName; ?>TechinfoUnitsys='+this.value+'; expires='+$exp.toGMTString()+'; path=/';
		
	"
	>
	<?php
	
	$a = array('met','imp','both');
	foreach($a as $v)
	{
		$s = ($v==$usys) ? ' selected="selected"' : '';
		echo '<option value="'.$v.'"'.$s.'>'.$ussxml[$v][0].'</option>';
	}
	
	?>
	</select>
	</td>
	</tr>
	</table>
	</div>
	<?php
	
	echo '<table width="100%" border="0" cellspacing="0" cellpadding="6">';
	$exceptions = array('company','realname');
	$i = 0;
	foreach($row as $k=>$v)
	{
		$osys = ($x=$row["{$k}_unitsys"]) ? $x : 'met';
		$dsys = ($osys=='met') ? 'imp' : 'met';
		$class = ($i%2==0) ? '' : ' backLightGrey';
		if($tag=$Vars->page['body'][$dataBlockName][$k])
		{
			if(in_array($k, $exceptions)) { continue; }
			?>
			<tr class="<?php echo $class; ?>">
			<td class="nobr"><?php echo $tag[0]; ?></td>
			<td width="100%"><?php
			
			if($v)
			{
				echo '<h6>';
				if($tag['unit'])
				{
					echo '<span class="unitsys_'.$osys.'"
					style="margin-right:10px; '.(($usys!=$osys&&$usys!='both')?'display:none;':'').'">';
					echo sprintf('%1.1f', $v).' '.$tag['unit'][$osys][0];
					echo '</span>';
					if($tag['unit'][$dsys][0])
					{
						$cv = unitsConvert($v, $tag['unit'][$osys][0].'>>'.$tag['unit'][$dsys][0]);
						echo '<span class="unitsys_'.$dsys.'"
						style="'.(($usys!=$dsys&&$usys!='both')?'display:none;':'').' padding: 0 5px; background-color:#666; color:#fff;">';
						echo sprintf('%1.1f', $cv).' '.$tag['unit'][$dsys][0];
						echo '</span>';
					}
				}
				else { echo $v; }
				echo '</h6>';
			}
			
			?></td>
			</tr>
			<?php
			$i++;
		}
	} // for
	echo '</table>';
	echo '</div>';
	
}

else
{
	?>
	<div class="empty">
	<?php echo $Vars->page['body']['empty_block']['sg'][0].' '.$Vars->page['body']['tech_info']['head'][0]; ?>.
	</div>
	<?php
}

//
// mysql close
//
include 'php/script/mysql/close.php';

?>

