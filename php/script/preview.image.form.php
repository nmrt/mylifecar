

<?php

/*ini_set('display_errors', true);
error_reporting(E_ALL^E_NOTICE);*/

//
// variables
//
include_once "$_SESSION[dr]/php/script/user/text.php";
$tf = $_userxml['form'];
$ttfv = $_validatexml['text_field'];
$user = $_SESSION['user'];
$_id = md5(uniqid('',true));
$_previewImageFormID = $_id;

?>

<form method="post" enctype="multipart/form-data"
action="php/script/image.save.php"
target="previewImageIframe<?php echo $_id; ?>"
onsubmit=
"
	if(Spry.Widget.Form.onSubmit(this, this))
	{
		previewImageOnsubmit<?php echo $_id; ?>();
	}
	else { return false; }
"
>
<input type="hidden" name="id" value="<?php echo $preview_image['imgid']; ?>" />
<input type="hidden" name="form" value="<?php echo $preview_image['form']; ?>" />
<input type="hidden" name="target" value="<?php echo $preview_image['target']; ?>" />
<input type="hidden" name="cid" value="<?php echo $preview_image['cid']; ?>" />
<input type="hidden" name="mid" value="<?php echo $preview_image['mid']; ?>" />
<input type="hidden" name="block" value="<?php echo $preview_image['block']; ?>" />
	<fieldset style="padding:0;">
	<legend style="margin-left:10px; padding:0;"><?php echo $tf['image'][0] ?></legend>
	<table border="0" cellspacing="0" cellpadding="0" style="margin:10px;">
	<tr>
	
	<td valign="top">
	<div id="spryTextfieldWidget_previewImage<?php echo $_id; ?>">
	<input id="previewImageInp<?php echo $_id; ?>" name="img" type="file" size="40" />
	<span class="textfieldRequiredMsg"><?php echo $ttfv['required'][0] ?></span>
	<div class="textfieldInvalidFormatMsg" style="display:block;">
	<?php echo $ttfv['image_type'][0]; ?>
	</div>
	<div class="secondary">
	<?php
	
	switch($preview_image['target'])
	{
		case 'company':
		case 'user':
			$s = array(256,256); break;
		case 'model': $s = array(320,240); break;
	}
	printf($ttfv['image_size'][0], $s[0], $s[1]);
	
	?>
	</div>
	</div>
	</td>
	
	<td valign="top" style="padding-left:5px;">
	<input type="submit" value="<?php echo $text['ui']['preview_image'][0]; ?>"
	onclick="this.form.action='/php/script/preview.image.php';"/><br />
	<input type="submit" value="<?php echo $text['ui']['save_image'][0]; ?>"
	onclick="this.form.action='/php/script/image.save.php';"/>
	</td>
	
	<td valign="top" style="padding-left:5px;">
	<div id="previewImageResultContainer<?php echo $_id; ?>">
	<?php
	
	switch($preview_image['target'])
	{
		case 'company': $f = "$_SESSION[dr]/img/company/$_SESSION[lang]/$preview_image[imgid].png"; break;
		case 'model':
			if(!$preview_image['block']) { $f = "$_SESSION[dr]/img/model/$_SESSION[lang]/$preview_image[imgid].png"; }
			else { $f = "$_SESSION[dr]/img/model/$_SESSION[lang]/$preview_image[block]/$preview_image[imgid].png"; }
			break;
		case 'user': $f = "$_SESSION[dr]/img/users/$_SESSION[lang]/$preview_image[imgid].png"; break;
		case 'ordered_model': $f = "$_SESSION[dr]/img/model/$_SESSION[lang]/ordered/$preview_image[imgid].png"; break;
	}
	if(file_exists($f))
	{
		include_once "$_SESSION[dr]/php/script/growingImage.php";
		switch($preview_image['target'])
		{
			case 'company':
			case 'user':
				$h = 64;
				break;
			case 'model':
			case 'ordered_model':
				$h = 48;
				break;
		}
		growingImage
		(
			'previewImage',
			$f, '',
			array(64, $h), 0/*,
			array('style'=>'border: 2px solid #eee;')*/
		);
		/*echo '<div style="font-family:Verdana, Arial, Helvetica, sans-serif; font-size:9px; margin-top:5px;">';
		echo $_userxml['form']['image']['click'][0];
		echo '</div>';*/
	}
	else { echo '&nbsp;'; }
	
	?>
	</div><iframe id="previewImageIframe<?php echo $_id; ?>" name="previewImageIframe<?php echo $_id; ?>"
	onload=
	"
		var $xhtml = this.contentWindow.document.body.innerHTML;
		if($xhtml) { this.previousSibling.innerHTML = $xhtml; }
	"
	style="display:none;"></iframe>
	</td>
	
	</tr>
	</table>
	</fieldset>
</form>

<script language="javascript" type="text/javascript">

previewImageOnsubmit<?php echo $_id; ?> = function()
{
	var $con = ID('previewImageResultContainer<?php echo $_id; ?>');
	$con.innerHTML = '<img src="http://<?php echo $_SESSION['repository']; ?>/img/preload.img.gif" alt="pimg" border="0" />';
	var $f = document.<?php echo $preview_image['form']; ?>;
	var $allbtns = [];
	var $inps = $f.getElementsByTagName('input');
	var $btns = $f.getElementsByTagName('button');
	for(var $i=0; $i<$inps.length; $i++) { $allbtns.push($inps[$i]); }
	for(var $i=0; $i<$btns.length; $i++) { $allbtns.push($btns[$i]); }
	for(var $i=0; $i<$allbtns.length; $i++)
	{
		var $btn = $allbtns[$i];
		if($btn.type=='submit') { $btn.disabled = true; }
	}
}

var imvf<?php echo $_id; ?> = function()
{
	var $im = document.getElementById('previewImageInp<?php echo $_id; ?>').value;
	if($im.match(/\.png$|\.jpg$|\.jpeg$/i)) { return true; }
	else { return false; }
}
$SpryWidgetValidation_previewImage<?php echo $_id; ?> = new Spry.Widget.ValidationTextField
(
	'spryTextfieldWidget_previewImage<?php echo $_id; ?>', 'custom',
	{'validateOn':'change', 'validation':imvf<?php echo $_id; ?>}
);

</script>