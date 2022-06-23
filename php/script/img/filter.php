<?php

//
// variables
//
$src = urldecode($_GET['src']);
$filter = $_GET['filter'];
$imgs = getimagesize($src);
$type = explode('/', $imgs['mime']);

//
// content type
//
header("Content-type: image/png");

//
// create image from :?
//
eval("\$img = imagecreatefrom$type[1](\$src);");
$b = imagecolorallocate($img, 0,0,0);
imagecolortransparent($img, $b);

//
// action
//
foreach($filter as $f)
{
	$arg = '';
	if($x=$f['arg']) { $arg = ', '.join(',',$x); }
	eval('imagefilter($img, IMG_FILTER_'.strtoupper($f['n']).$arg.');');
}

//
// output
//
imagepng($img);
imagedestroy($img);

?>
