<?php

//
// content type
//
header("Content-type: image/png");

//
// variables
//
$src = urldecode($_GET['src']);
$width = $_GET['width'];
$height = $_GET['height'];
$constrain = true;
if($_GET['constrain']=='0') { $constrain = false; }
$simgs = getimagesize($src);
if($constrain)
{
	if($width && !$height)
	{
		$delta = $simgs[0]/$width;
		$height = $simgs[1]/$delta;
	}
	else if($height && !$width)
	{
		$delta = $simgs[1]/$height;
		$width = $simgs[0]/$delta;
	}
}
$stype = explode('/', $simgs['mime']);
switch($stype[1])
{
	case 'jpg':
	case 'jpeg':
	case 'pjpeg': $stype = 'jpeg'; break;
	case 'png': $stype = 'png'; break;
}

//
// source image
//
eval("\$simg = imagecreatefrom$stype(\$src);");

//
// destiantion image
//
$dimg  = imagecreatetruecolor($width, $height);
$b = imagecolorallocate($dimg, 255,255,255);
imagefilledrectangle($dimg, 0,0, $width,$height, $b);

//
// action
//
$left = $top = 0;
if($constrain)
{
	if($width<$_GET['width']) { $left = ($_GET['width']-$width)/2; }
	if($height<$_GET['height']) { $top = ($_GET['height']-$height)/2; }
}
imagecopyresampled($dimg,$simg, $left,$top, 0,0, $width,$height, $simgs[0],$simgs[1]);

//
// grayscale
//
if($_GET['grayscale'])
{
	include 'grayscale.php';
	img_grayscale($dimg);
}

//
// output
//
imagepng($dimg);
imagedestroy($dimg);

?>
