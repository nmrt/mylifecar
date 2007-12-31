

<?php

/*ini_set('display_errors', true);
error_reporting(E_ALL^E_NOTICE);*/

ini_set('memory_limit', '128M');
session_start();

//
// variables
//
$user = $_SESSION['user'];
$simg = $_FILES['img'];
include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();
include "$_SESSION[dr]/php/script/user/text.php";
switch($_POST['target'])
{
	case 'company': $_targetpl = 'companies'; break;
	case 'model': $_targetpl = 'models'; break;
	case 'user': $_targetpl = 'users'; break;
	case 'ordered_model': $_targetpl = 'ordered_models'; break;
}

//
// includes
//
include 'image.operations.globals.php';
include_once "$_SESSION[dr]/php/script/img/grayscale.php";
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/catchFatalError.php";

if(($src=$simg['tmp_name']) && !$simg['error'])
{
	$stype = $simg['type'];
	$stype = explode('/', $stype);
	switch($stype[1])
	{
		case 'jpg':
		case 'jpeg':
		case 'pjpeg': $stype = 'jpeg'; break;
		case 'png': $stype = 'png'; break;
	}
	$simgs = getimagesize($src);
	switch($_POST['target'])
	{
		case 'company':
		case 'user':
			$dimgs = array(256,256);
			break;
		case 'model':
		case 'ordered_model':
			$dimgs = array(320,240);
			break;
	}
	
	//
	// engine
	//
	$c = "return imagecreatefrom$stype('".$src."');";
	$s = imgEditError('too_big', true);
	$simg = catchFatalError($c, $s);
	$dimg = imagecreatetruecolor($dimgs[0],$dimgs[1]);
	$b = imagecolorallocate($dimg, 255,255,255);
	imagefilledrectangle($dimg, 0,0, $dimgs[0],$dimgs[1], $b);
	$left = 0;
	$top = 0;
	$width = $dimgs[0];
	$delta = $simgs[0]/$width;
	$height = $simgs[1]/$delta;
	if($height<$dimgs[1]) { $top = ($dimgs[1]-$height)/2; }
	if($height>$dimgs[1])
	{
		$height = $dimgs[1];
		$delta = $simgs[1]/$height;
		$width = $simgs[0]/$delta;
		if($width<$dimgs[0]) { $left = ($dimgs[0]-$width)/2; }
	}
	imagecopyresampled($dimg,$simg, $left,$top, 0,0, $width,$height, $simgs[0],$simgs[1]);
	
	//
	// fs
	//
	include "$_SESSION[dr]/php/script/fs.php";
	
	//
	// determination file location;
	// backup creating, if needed
	//
	if($_POST['id'])
	{
		switch($_POST['target'])
		{
			case 'company': $f = "img/company/$_SESSION[lang]/$_POST[id].png"; break;
			case 'model':
				if(!$_POST['block']) { $f = "img/model/$_SESSION[lang]/$_POST[id].png"; }
				else { $f = "img/model/$_SESSION[lang]/$_POST[block]/$_POST[id].png"; }
				break;
			case 'user': $f = "img/users/$_SESSION[lang]/$_POST[id].png"; break;
			case 'ordered_model': $f = "img/model/$_SESSION[lang]/ordered/$_POST[id].png"; break;
		}
	}
	else { $f = "tmp/".date('YmdHis').".png"; }
	if(!$bkp=fsBkp($f)) { imgEditError(); }
	
	//
	// output
	//
	ob_start();
	imagepng($dimg);
	$imgc = ob_get_clean();
	if(!fsFwrite($f, $imgc, 'wb'))
	{
		//
		// return file's bkp on failure
		//
		fsRename($bkp, $f);
		imgEditError();
	}
	
	//
	// delete backup on success
	//
	else { fsDelete($bkp); }
	
	if($_POST['id'])
	{
		
		//
		// save image thumbnails
		//
		switch($_POST['target'])
		{
			case 'company': $dir = "img/company/$_SESSION[lang]"; break;
			case 'model':
				if(!$_POST['block']) { $dir = "img/model/$_SESSION[lang]"; }
				else { $dir = "img/model/$_SESSION[lang]/$_POST[block]"; }
				break;
			case 'user': $dir = "img/users/$_SESSION[lang]"; break;
			case 'ordered_model': $dir = "img/model/$_SESSION[lang]/ordered"; break;
		}
		include "$_SESSION[dr]/php/script/image.save.thumbs.php";
		imageSaveThumbs($_POST['id'], $dir);
		
		//
		// growingImage
		//
		include_once "$_SESSION[dr]/php/script/growingImage.php";
		switch($_POST['target'])
		{
			case 'company':
			case 'user':
				$size = array(64,64);
				break;
			case 'model':
			case 'ordered_model':
				$size = array(64,48);
				break;
		}
		growingImage
		(
			'mainManagerImage'.time(),
			"$_SESSION[dr]/$f", 'preview',
			array($size[0],$size[1])/*, 0,
			array('style'=>'border: 2px solid #eee;')*/
		);
		
	}
	
	?><script type="text/javascript">imgSaveResFormSubBtns();</script><?php
	
	//
	// tip
	//
	if(!$_POST['id'])
	{
		echo '<div class="secondary" style="width:100px;">';
		echo $_userxml['ui']['save_image']['note'][0];
		echo '</div>';
		?>
		<script type="text/javascript">
		top.document.<?php echo $_POST['form']; ?>.img.value = '<?php echo $f; ?>';
		</script>
		<?php
	}
	
	//
	// after loads
	//
	else if($_POST['block'])
	{
		?>
		<script type="text/javascript">
		var $n = top.document.getElementById('<?php echo $_POST['block']; ?>');
		var $core = top.Node.getElementByClassName('\\bcore\\b', $n);
		var $padd = top.Node.getElementByClassName('\\bpadding\\b', $core);
		var $get =
		[
			'company=<?php echo $_POST['cid']; ?>',
			'model=<?php echo $_POST['mid']; ?>'
		];
		top.XMLHttp.load('http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/model/<?php echo $_POST['block']; ?>.php?'+$get.join('&'),
		{'container':$padd, 'xml':false, 'callback':function($el){ top.AppearFades($el, function(){ top.MultiSelect.scan($el); }); }});
		</script>
		<?php
	}
	else if($_POST['target']!='user')
	{
		?>
		<script type="text/javascript">
		var $n = top.document.getElementById('main.client');
		var $core = top.Node.getElementByClassName('\\bcore\\b', $n);
		var $padd = top.Node.getElementByClassName('\\bpadding\\b', $core);
		var $get =
		[
			'target=<?php echo $_targetpl; ?>'
		];
		top.XMLHttp.load('http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/AdministratorsControlPanel/main.client.php?'+$get.join('&'),
		{'container':$padd, 'xml':false, 'callback':function($el){ top.AppearFades($el, function(){ top.MultiSelect.scan($el); }); }});
		</script>
		<?php
	}

	//
	// cleaning
	//
	imagedestroy($simg);
	imagedestroy($dimg);
	
}

//
// uknown error
//
else { imgEditError(); }


?>

