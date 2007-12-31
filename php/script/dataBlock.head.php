

<?php

session_start();

//
// xml
//
include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();
$_languagexml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/page/index.xml");
$_languagexml = $XML->toArray($_languagexml->tagChildren);
$_languagexml = $_languagexml['body'];

?>

<table <?php echo (($x=$dataBlockName)?'id="'.$x.'"':''); ?> class="dataBlock <?php echo $dataBlockName ?>"
<?php if($options['width100']) { echo 'width="'.(!$_msie?100:98).'%"'; } ?>
border="0" cellspacing="0" cellpadding="0">
<tr>
<td class="ltCornerLightGrey" width="1">
<?php
$alt = array('alt'=>'left top corner');
$a = array
(
	'_msie' => $alt
);
echo img_png('img/corners/light-grey/light-grey-back/lt.png', $_msie, $a);
?>
</td>
<td style="
<?php

$src = 'img/corners/light-grey/light-grey-back/st.png';
if(!$_msie) { echo 'background-image:url('.$src.');'; }
else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }

?>
"></td>
<td class="rtCornerLightGrey" width="1" align="right">
<?php
$alt = array('alt'=>'right top corner');
$a = array
(
	'_msie' => $alt
);
echo img_png('img/corners/light-grey/light-grey-back/rt.png', $_msie, $a);
?>
</td>
</tr>
<tr class="dataBlockHeadTr">
<td width="1" style="
<?php

$src = 'img/corners/light-grey/light-grey-back/sl.png';
if(!$_msie) { echo 'background-image:url('.$src.');'; }
else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }

?>
"></td>

<!--
//
// head
//
-->
<?php

//
// collapsed coockies
//
$_collapsedid = $Vars->page['@name'];
switch($_collapsedid)
{
	case 'company': $_collapsedid .= $_GET['company']; break;
	case 'model': $_collapsedid .= $_GET['model']; break;
	case 'user': $_collapsedid .= $_GET['action']; break;
}
$_collapsedid .= $dataBlockName;
$_collapsed = ($_COOKIE["collapsed_$_collapsedid"]=='true') ? true : false;

?>
<td class="head" style="background-color:#eee; padding-bottom:4px;">
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
	<tr>
	<td class="pointer <?php echo ($_collapsed?'open':'close'); ?>" width="100%"
	title="<?php
	
	$dbxml = $Vars->language['body']['data_block'];
	if($_collapsed) {echo $dbxml['click_to_expand'][0];  }
	else { echo $dbxml['click_to_collapse'][0]; }
	
	?>"
	onclick=
	"
		var $x = Node.getElementByClassName('\\bdataBlockHeadTr\\b', this, {direction:'reverse'}).parentNode;
		var $x = Node.getElementByClassName('\\bscroller\\b', $x);
		var $to = '<?php echo $Vars->language['body']['data_block']['click_to_expand'][0] ?>';
		var $tc = '<?php echo $Vars->language['body']['data_block']['click_to_collapse'][0] ?>';
		var $vs = Node.getElementByClassName('\\bview-status\\b', this);
		if(this.className.match(/\bclose\b/))
		{
			this.className = this.className.replace(/\bclose\b/, 'open');
			this.title = $to;
			var $ck = true;
			$vs.innerHTML = '[<?php echo $_languagexml['data_block']['view_status']['collapsed'][0]; ?>]';
		}
		else
		{
			this.className = this.className.replace(/\bopen\b/, 'close');
			this.title = $tc;
			var $ck = false;
			$vs.innerHTML = '[<?php echo $_languagexml['data_block']['view_status']['expanded'][0]; ?>]';
		}
		Spry.Effect.Blind($x, {duration:200,
		from:'<?php echo ($_collapsed?'0':'100'); ?>%', to:'<?php echo ($_collapsed?'100':'0'); ?>%',
		toggle:true,
		setup:SpryEffectBlind<?php echo ($_collapsed?'Open':'Close'); ?>SetupFunc,
		finish:SpryEffectBlind<?php echo ($_collapsed?'Open':'Close'); ?>FinishFunc});
		
		var $exp = new Date();
		var $year = $exp.getTime()+(1000*60*60*24*366);
		$exp.setTime($year);
		document.cookie = 'collapsed_<?php echo $_collapsedid; ?>='+$ck+'; expires='+$exp.toGMTString()+'; path=/';
		
	"
	>
	<div <?php if($options['AppearFade']) { echo 'class="AppearFade" style="visibility:hidden; background-color:#eee;"'; }  ?>>
		<table border="0" cellspacing="0" cellpadding="2">
		<tr>
		<td><?php echo $dataBlockHeadImg; ?></td>
		<td>
		<?php
		
		if($dataBlockHeadText) { echo $dataBlockHeadText; }
		else { echo $Vars->page['body'][$dataBlockName]['head'][0]; }
		
		?>
		</td>
		<td class="view-status">[<?php
		
		$vs = $_collapsed ? 'collapsed' : 'expanded';
		echo $_languagexml['data_block']['view_status'][$vs][0];
		
		?>]</td>
		</tr>
		</table>
	</div>
	</td>
	<td style="padding-right:5px;">
	<?php
	
	$txt = '';
	if($x=$dataBlockTip) { $txt = $x; }
	else if($x=$Vars->page['body'][$dataBlockName]['head']['tip'][0]) { $txt = $x; }
	if($txt) { echo tip($txt); }
	
	?>
	</td>
	</tr>
	</table>
<!-- end: head --></td>

<td width="1" style="
<?php

$src = 'img/corners/light-grey/light-grey-back/sr.png';
if(!$_msie) { echo 'background-image:url('.$src.');'; }
else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }

?>
"></td>
</tr>
<tr>
<td width="1" style="
<?php

$src = 'img/corners/light-grey/white-back/sl.png';
if(!$_msie) { echo 'background-image:url('.$src.');'; }
else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }

?>
"></td>

<!--
//
// core
//
-->
<td class="core coreWhite"><div class="scroller" style=" <?php echo ($_collapsed?'display:none;':''); ?>"
><div class="padding AppearFade" style="padding:10px 0 0 0 !important; display:none; background-color:#fff;">
