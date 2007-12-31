

<?php

ini_set('display_errors', true);
error_reporting(E_ALL^E_NOTICE);

ini_set('memory_limit', '128M');
session_start();

//
// includes
//
include 'image.operations.globals.php';
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/catchFatalError.php";

$user = $_SESSION['user'];
$simg = $_FILES['img'];

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
	$w = 64;
	$d = $simgs[0]/$w;
	$h = (int)($simgs[1]/$d);
	$dimgs = array($w,$h);
	
	//
	// engine
	//
	$c = "return imagecreatefrom$stype('".$src."');";
	$s = imgEditError('too_big', true);
	$simg = catchFatalError($c, $s);
	$dimg = imagecreatetruecolor($dimgs[0],$dimgs[1]);
	$b = imagecolorallocate($dimg, 255,255,255);
	imagefilledrectangle($dimg, 0,0, $dimgs[0],$dimgs[1], $b);
	imagecopyresampled($dimg,$simg, 0,0, 0,0, $dimgs[0],$dimgs[1], $simgs[0],$simgs[1]);
	ob_start();
	imagepng($dimg);
	$imgc = ob_get_clean();
	
	//
	// firefox will make it faster!)
	//
	if(!$_SESSION['msie'])
	{
		echo '<img src="data:image/png;base64,'.base64_encode($imgc).'" alt="preview" border="0" style="border: 2px solid #eee;" />';
	}
	
	//
	// it's f*cking msie turn
	//
	else
	{
		include "$_SESSION[dr]/php/script/fs.php";
		$f = 'img/previews/'.date('YmdHis').'.png';
		if(!fsFwrite($f, $imgc, 'wb')) { imgEditError(); }
		echo '<img src="/'.$f.'" alt="preview" border="0" style="border: 2px solid #eee;" />';
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

