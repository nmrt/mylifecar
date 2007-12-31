

<?php

session_start();

//
// variables
//
include "$_SESSION[dr]/php/script/global.variables.php";
include 'variables.php';
$_page = 'model';
mb_internal_encoding('utf-8');
$seoi = $_SESSION['model']['extended']['owner_info'];

//
// classes
//
include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();
include_once "$_SESSION[dr]/php/class/Vars.php";
if(!$Vars)
{
	$Vars = new Vars();
	$Vars->init();
}

//
// includes
//
include "$_SESSION[dr]/php/script/mysql/connect.php";
include "$_SESSION[dr]/php/script/user/text.php";

//
// select owner
//
$q = "SELECT * FROM users WHERE page='$codeModelName'";
$r = mysql_query($q, $_mysql['db']['main']);
if($user=@mysql_fetch_assoc($r))
{
	
	//
	// reservation OR not
	//
	if($user['pagest']=='Pending')
	{
		echo '<div align="center">';
		echo $Vars->page['body']['owner_info']['reserved'][0];
		echo '</div>';
	}
	
	//
	// output owner data
	//
	?>
	<div>
	<table width="100%" border="0" cellspacing="0" cellpadding="6">
	<tr>
	<td class="nobr">
	<?php echo $_userText['form']['image'][0]; ?>
	<!--<div style="font-size:75%;"><?php echo $_userText['form']['image']['click'][0]; ?></div>-->
	</td>
	<td width="100%">
		<table border="0" cellspacing="0" cellpadding="0">
		<tr>
		<td>
		<?php
		
		include_once "$_SESSION[dr]/php/script/growingImage.php";
		$title = ($user['first_name'] && $user['last_name']) ? "$user[first_name] $user[last_name]" : $user['nickname'];
		growingImage
		(
			'modelOwnerInfoImage',
			"$_SESSION[dr]/img/users/$_SESSION[lang]/$user[id].png",
			$title,
			array(64, 64), 256/*,
			array('style'=>'border: 2px solid #eee;')*/
		);
		
		?>
		</td>
		</tr>
		</table>
	</td>
	</tr>
	<?php
	
	//
	// data
	//
	$a = array('nickname','first_name','last_name');
	foreach($a as $i=>$k)
	{
		$v = $user[$k];
		if($k=='email') { $v = '<a href="mailto:'.$v.'">'.$v.'</a>'; }
		$r = (($i+1)%2==0) ? 'backLightGrey' : '';
		echo '<tr class="'.$r.'">';
		echo '<td class="nobr">'.$_userText['form'][$k][0].'</td>';
		echo '<td width="100%">'.($v?"<h6>$v</h6>":'').'</td>';
		echo '</tr>';
	}
	
	//
	// country
	//
	$q = "SELECT intername FROM countries WHERE cc='$user[cc]'";
	$r = mysql_query($q, $_mysql['db']['main']);
	$country = @mysql_result($r, 0);
	$r = ($r!='backLightGrey') ? 'backLightGrey' : '';
	echo '<tr class="'.$r.'">';
	echo '<td class="nobr">'.$_userxml['form']['country'][0].'</td>';
	echo '<td width="100%">'.($country?"<h6>$country</h6>":'').'</td>';
	echo '</tr>';
	
	//
	// desc
	//
	$f = "$_SESSION[dr]/xml/lang/$_SESSION[lang]/user/$user[id].xml";
	if(is_file($f))
	{
		$xml = $XML->parse($f);
		$xml = $XML->toArray($xml->tagChildren);
		ob_start();
		?>
		<a href="javascript:void(null)" class="js"
		onclick=
		"
			var $o =
			{
				'class'		: 'owner_infoExtended',
				'name'		: '<?php echo urlencode("$realCompanyName. $realModelName. ".$Vars->page['body']['owner_info']['head'][0]); ?>',
				'body'		: '<?php echo urlencode('window/model/owner_info.php'); ?>',
				'include'	: true,
				'bodyOpts'	:
				{
					'company'	: '<?php echo $codeCompanyName; ?>',
					'model'		: '<?php echo $codeModelName; ?>'
				}
			}
			Window.addInstance($o);
		"
		>&hellip;</a>
		<?php
		$more = ob_get_clean();
		if(!$seoi) { $desc = mb_strimwidth(strip_tags($xml['desc'][0]), 0, 300).$more; }
		else { $desc = $xml['desc'][0]; }
		$r = ($r!='backLightGrey') ? 'backLightGrey' : '';
		echo '<tr class="'.$r.'">';
		echo '<td colspan="2">'.$_userText['form']['desc'][0].'</td>';
		echo '</tr>';
		echo '<tr class="'.$r.'">';
		echo '<td colspan="2"><div class="serif" style="'.($seoi?'width:300px; height:200px; overflow-y:scroll;':'').'">'.$desc.'</div></td>';
		echo '</tr>';
	}
	
	?>
    </table>
	</div>
	
	<?php
	
	//
	// if in edit mode,- edit button
	//
	if($_edit && $_SESSION['user']['page']=="$codeModelName")
	{
		echo '<div style="margin-top:10px;">';
		echo '<button
		onclick="location.href=\'/?page=user&amp;action=edit.form\'"
		>'.$_userxml['edit']['button'][0].'</button>';
		echo '</div>';
	}
	
}

else
{
	?>
	<div class="empty">
	<?php echo $Vars->page['body']['empty_block']['sg'][0].' '.$Vars->page['body']['owner_info']['head'][0]; ?>.
	</div>
	<?php
}

//
// end
//
include "$_SESSION[dr]/php/script/mysql/close.php";

?>

