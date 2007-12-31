
<!--
//
// user panel
//
-->
<div align="right">
<table border="0" cellspacing="0" cellpadding="0">
<tr>
<?php

//
// promo
//
include 'php/script/promo.php';
if($_left)
{
	?>
	<td align="left" valign="middle" style="padding-right:20px;">
	<div class="headPromotion">
	<!--<div class="headPromotionBg"><?php echo $_languagexml['action100']['promotion'][0]; ?></div>-->
	<h6> <!-- style="position:relative;" -->
	<?php printf($_languagexml['action100'][0], $_count, $_left); ?> 
	<a href="/?page=pay"><?php echo $_languagexml['action100']['btn'][0]; ?></a>
	</h6>
	</div>
	</td>
	<?php
}


?>
<td valign="top">
	<table class="dataBlock userPanel" border="0" cellspacing="0" cellpadding="0" style="margin: 0 20px 0 0 !important;">
	<tr>
	<td style="
	<?php
	
	$src = '/img/corners/light-grey/white-back/sl.png';
	if(!$_msie) { echo 'background-image:url('.$src.');'; }
	else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }
	
	?>
	"></td>
	<td class="core coreWhite">
	<div class="AppearFade" style="padding-top:20px; visibility:hidden; background-color:#fff;">
		<table border="0" cellspacing="0" cellpadding="2">
		<tr>
		<?php
		
		include "php/script/user/text.php";
		
		//
		// logged in OR not
		//
		$_user = $_SESSION['user'];
		if(!$_user) { $a = array('login.form','signin.form'); }
		else
		{
			$u = ($_user['first_name'] && $_user['last_name'])
			? $_user['first_name'].' '.$_user['last_name']
			: $_user['nickname'];
			if($_user['page']=='Administrator')
			{
				$adm = '<span style="font-size:75%; color:#fff; background-color:#666; padding: 0 4px 2px 4px; margin: 0 10px 0 3px;">';
				$adm .= 'a</span>';
			}
			echo '<td class="nobr">'.$text['ui']['welcome'][0].', '.$u.$adm.'</td>';
			$a = array('edit.form','logout');
		}
		
		foreach($a as $i=>$v)
		{
			$pv = $v;
			if($x=strrpos($v,'.')) { $pv = substr($v,0,$x); }
			$attrs = array
			(
				'_msie' => array
				(
					'alt'=>$text[$pv]['button'][0],
					'title'=>$text[$pv]['button'][0],
					'border'=>'0'
				),
				'msie' => array('title'=>$text[$pv]['button'][0],'class'=>'pointer')
			);
			?>
			<td>
			<table border="0" cellspacing="0" cellpadding="2">
			<tr>
			<td<?php echo ($_msie?' width="1"':'') ?>>
			<?php
			
			//
			// continue after login
			//
			if($v=='login.form') { $con = '&amp;continue='.urlencode($_SERVER['PHP_SELF'].'?'.$_SERVER['QUERY_STRING']); }
			else { $con = ''; }
			
			?>
			<a href="/?page=user&amp;action=<?php echo $v.$con; ?>">
			<?php echo img_png("/img/ui/color/$pv.png", $_msie, $attrs); ?>
			</a>
			</td>
			<td class="nobr">
			<a href="/?page=user&amp;action=<?php echo $v.$con; ?>">
			<?php echo $text[$pv]['button'][0]; ?>
			</a>
			</td>
			
			</tr>
			</table>
			</td>
			<?php
		
		}
		
		//
		// edit page OR AdministratorsControlPanel
		//
		if($_user)
		{
			$_userpagexml = $XML->parse("xml/lang/$_lang/page/main/index/user.xml");
			$_userpagexml = $XML->toArray($_userpagexml->tagChildren);
			$atext = $_userpagexml['body']['ui']['edit_page_btn'][0];
			if($_user['page'] && $_user['page']!='Administrator' && !$_user['pagest'])
			{
				$src = 'img/ui/color/edit.page.png';
				$a = '<a href="/?page=model&amp;model='.$_user['page'].'&amp;edit=true">';
			}
			else if($_user['page']=='Administrator')
			{
				$src = 'img/ui/color/edit.page.png';
				$a = '<a href="/?page=AdministratorsControlPanel">';
				$atext = $_userpagexml['body']['ui']['acp_btn'][0];
			}
			else
			{
				$src = 'img/ui/grayscale/edit.page.png';
				$a = '';
			}
			?>
			<td>
			<table border="0" cellspacing="0" cellpadding="2">
			<tr>
			<td>
			<?php
			echo $a;
			$_m = array
			(
				'alt'=>$_userxml['edit_page']['button'][0],
				'title'=>$_userxml['edit_page']['button'][0],
				'border'=>'0'
			);
			$m = array('title'=>$_userxml['edit_page']['button'][0]);
			if($a) { $m['class'] = 'pointer'; }
			echo img_png($src, $_msie, array('_msie'=>$_m,'msie'=>$m));
			if($a) { echo '</a>'; }
			?>
			</td>
			<td class="nobr">
			<?php
			echo $a;
			echo $atext;
			if($a) { echo '</a>'; }
			?>
			</td>
			</tr>
			</table>
			</td>
			<?php
		}
		?>
		
		</tr>
		</table>
	</div>
	</td>
	<td style="
	<?php
	
	$src = '/img/corners/light-grey/white-back/sr.png';
	if(!$_msie) { echo 'background-image:url('.$src.');'; }
	else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }
	
	?>
	"></td>
	</tr>
	<tr>
	<td class="lbCornerWhite" width="1" align="right">
	<?php
	$alt = array('alt'=>'left bottom corner');
	$a = array
	(
		'_msie' => $alt
	);
	echo img_png('/img/corners/light-grey/white-back/lb.png', $_msie, $a);
	?>
	</td>
	<td style="
	<?php
	
	$src = '/img/corners/light-grey/white-back/sb.png';
	if(!$_msie) { echo 'background-image:url('.$src.');'; }
	else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }
	
	?>
	"></td>
	<td class="rbCornerWhite" width="1" align="right">
	<?php
	$alt = array('alt'=>'right bottom corner');
	$a = array
	(
		'_msie' => $alt
	);
	echo img_png('/img/corners/light-grey/white-back/rb.png', $_msie, $a);
	?>
	</td>
	</tr>
	</table>
</td>
</tr>
</table>
</div>

<table class="AppearFade" width="100%" border="0" cellspacing="0" cellpadding="0" style="visibility:hidden">
<tr>

<!--
//
// title
//
-->
<td class="title" style="background-color:#666;">
<!--<div align="center" style="color:#FF0099; white-space:nowrap;"><?php printf($Vars->language['body']['head']['under_construction'][0], (31-date('d'))); ?></div>-->
<h1><a href="/"><?php echo $Vars->language['body']['head']['title'][0]; ?></a></h1>
<?php echo $Vars->language['body']['head']['slogan'][0]; ?>
</td>

<!-- blank space -->
<td class="borderBottom">&nbsp;</td>

<!--
//
// menu
//
-->
<?php

$l = $Vars->language['@name'];
$gs = $Vars->gSection['@name'];
$s = $Vars->section['@name'];
$p = $Vars->page['@name'];
$menu = $XML->parse("xml/lang/$_lang/menu.xml");
$menu = $XML->toArray($menu->tagChildren);
$i = 0;
foreach($menu as $codePageName=>$realPageName)
{
	$c = ($gs=='main' && $s=='index' && $p==$codePageName)
	? ' current' : '';
?>
<td class="menu<?php echo $c ?>">
<table border="0" cellspacing="0" cellpadding="0">

<!--
//
// current
//
-->
<?php

$src = 'img/current.arrow.png';
$imgs = getimagesize($src);

?>
<tr>
<td colspan="3" class="currentImg" style="height:<?php echo $imgs[1]; ?>px;">
<?php

$t = $Vars->language['body']['head']['current_arrow'][0];
if($c) { echo img_png("/$src", $_msie, array('_msie'=>array('alt'=>'current_arrow'),'msie'=>array('alt'=>'current_arrow'))); }

?>
</td>
</tr>

<!--
//
// text, corners
//
-->
<?php $cd = ($c) ? 'light-grey/white-back' : 'light-grey/light-grey-back' ?>
<tr>
<td width="1">
<?php
$alt = array('alt'=>'left top corner');
$a = array
(
	'_msie' => $alt
);
echo img_png("/img/corners/$cd/lt.png", $_msie, $a);
?>
</td>
<td style="
<?php

$src = "/img/corners/$cd/st.png";
if(!$_msie) { echo 'background-image:url('.$src.');'; }
else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }

?>
"></td>
<td width="1" align="right">
<?php
$alt = array('alt'=>'left top corner');
$a = array
(
	'_msie' => $alt
);
echo img_png("/img/corners/$cd/rt.png", $_msie, $a);
?>
</td>
</tr>
<tr>
<td width="1" style="
<?php

$src = "/img/corners/$cd/sl.png";
if(!$_msie) { echo 'background-image:url('.$src.');'; }
else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }

?>
"></td>
<td>
<?php

if(!$c)
{
	echo
	'
		<a
		href="/?page='.$codePageName.'">
	';
} else { echo '<div class="a">'; }
echo $realPageName[0];
if(!$c) { echo '</a>'; } else { echo '</div>'; }

?>
</td>
<td width="1" style="
<?php

$src = "/img/corners/$cd/sr.png";
if(!$_msie) { echo 'background-image:url('.$src.');'; }
else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }

?>
"></td>
</tr>

<!--
//
// bottom line
//
-->
<?php
$c = ($c)
? 'background-color:#ccc;' : 'background-color:#ccc;';
?>
<tr class="">
<td style="font-size:2px; border-left:5px solid #ccc; <?php echo $c ?>"><div style="height:2px;"></div></td>
<td style="font-size:2px; <?php echo $c ?>"><div style="height:2px;"></div></td>
<td style="font-size:2px; border-right:5px solid #ccc; <?php echo $c ?>"><div style="height:2px;"></div></td>
</tr>

</table>
</td>
<td width="20" class="borderBottom">&nbsp;</td>
<?php $i++; } ?>

<!-- blank space -->
<td class="borderBottom">&nbsp;</td>

</tr>
</table>
