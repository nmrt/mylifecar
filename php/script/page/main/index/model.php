

<?php

//
// session variables
//
if(!$_GET['extended_block']) { $_SESSION['model']['extended'] = array(); }

//
// includes
//
include 'php/script/model/variables.php';
include 'php/script/model/edit.access.denied.php';

//
// logo, company, model
//

?>
<table class="dataBlock" border="0" cellspacing="0" cellpadding="0" style="margin-top:0!important;">
<tr>
<td style="
<?php

$src = 'img/corners/light-grey/white-back/st.png';
if(!$_msie) { echo 'background-image:url('.$src.');'; }
else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }

?>
"></td>
<td class="rtCornerWhite" width="1" align="right">
<?php
$alt = array('alt'=>'right top corner');
$a = array
(
	'_msie' => $alt
);
echo img_png('img/corners/light-grey/white-back/rt.png', $_msie, $a);
?>
</td>
</tr>
<tr>
<td class="core coreWhite">
<div class="AppearFade" style="padding-left:20px; display:none; background-color:#fff;">
	<table border="0" cellspacing="0" cellpadding="0">
	<tr>
	<td valign="middle">
	<?php
	
	include 'php/script/user/text.php';
	include_once "$_SESSION[dr]/php/script/growingImage.php";
	$title = "$realCompanyName";
	growingImage
	(
		'companyLogo',
		"$_SESSION[dr]/img/company/$_SESSION[lang]/$codeCompanyName.png",
		$title,
		array(64, 64),
		256
	);
	$title = "$realModelName";
	
	?>
	</td>
	<td valign="middle" style="padding-left:5px;">
	<?php
	
	growingImage
	(
		'modelLogo',
		"$_SESSION[dr]/img/model/$_SESSION[lang]/$codeModelName.png",
		$title,
		array(64, 48), 0/*,
		array('style'=>'margin-left:5px;')*/
	);
	
	?>
	</td>
	<td valign="middle">
		<table border="0" cellspacing="0" cellpadding="0">
		<tr>
		<td>
		<h1>
		<a href="/?page=company&amp;company=<?php echo $codeCompanyName ?>">
		<?php echo $realCompanyName; ?></a>
		<?php 
		
		if($_GET['extended_block']) { echo '<a href="/?page=model&amp;company='.$codeCompanyName.'&amp;model='.$codeModelName.'">'; }
		echo $realModelName;
		if($_GET['extended_block']) { echo '</a>'; }
		
		if($_GET['extended_block']) { echo ' '.$Vars->page['body'][$_GET['extended_block']]['head'][0]; }
		
		$user = $_SESSION['user'];
		if($user['page']=='Administrator' || $user['page']=="$codeModelName")
		{
			if(!$_edit)
			{
				$edit = 'true';
				$value = $Vars->page['body']['edit']['enter'][0];
			}
			else
			{
				$edit = 'false';
				$value = $Vars->page['body']['edit']['exit'][0];
			}
			$q = preg_replace("/&edit=[^&]+/", '', $_SERVER['QUERY_STRING']);
			$q = str_replace('&', '&amp;', $q);
			echo
			'
				<button
				onclick="location.href=\'/?'.$q.'&amp;edit='.$edit.'\'"
				style="margin-left:6px;"
				>'.$value.'</button>
			';
		}
		
		?>
		</h1>
		</td>
		</tr>
		<?php
		
		//
		// other archives
		//
		if($_GET['extended_block'])
		{
			
			echo '<tr>';
			echo '<td>';
			echo '<table class="other-archives" border="0" cellpadding="0" cellspacing="0">';
			echo '<tr>';
			echo '<td>'.$_xml['ui']['archives'][0].':</td>';
			$exts = array('news','photos','people','conversation');
			foreach($exts as $ext)
			{
				
				echo '<td class="archives">';
				$q = array
				(
					'page=model',
					"model=$codeModelName",
					"extended_block=$ext"
				);
				if($_GET['extended_block']!=$ext) { echo '<a href="/?'.join('&amp;',$q).'">'; }
				echo $_xml[$ext]['head'][0];
				if($_GET['extended_block']!=$ext) { echo '</a>'; }
				echo '</td>';
			}
			echo '</tr>';
			echo '</table>';
			echo '</td>';
			echo '</tr>';
			
		}
		
		?>
		</table>
	</td>
	</tr>
	</table>
</div>
</td>
<td style="
<?php

$src = 'img/corners/light-grey/white-back/sr.png';
if(!$_msie) { echo 'background-image:url('.$src.');'; }
else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }

?>
"></td>
</tr>
<tr>
<td style="
<?php

$src = 'img/corners/light-grey/white-back/sb.png';
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
echo img_png('img/corners/light-grey/white-back/rb.png', $_msie, $a);
?>
</td>
</tr>
</table>

<div style="padding-left:20px;">
<?php if(!$_GET['extended_block']) { ?>
	<table width="<?php echo (!$_msie?100:98) ?>%" border="0" cellspacing="0" cellpadding="0">
	<tr>
	
	<?php
	
	$a = array
	(
		array('news','photos','people'),
		array('tech_info','history','editors_column'),
		array('owner_info','conversation','ad')
	);
	
	foreach($a as $aa)
	{
		echo '<td width="33%" valign="top" style="padding: 0 10px;">';
		foreach($aa as $v)
		{
			$dataBlockName = $v;
			$options = array
			(
				'width100'=>true,
				'AppearFade'=>true
			);
			include "php/script/dataBlock.head.php";
			include "php/script/model/$v.php";
			include "php/script/dataBlock.foot.php";
		}
		echo '</td>';
	}
	
	?>
	
	</tr>
	</table>
<?php } else { include "php/script/model/extended/$_GET[extended_block].php"; } ?>
</div>


