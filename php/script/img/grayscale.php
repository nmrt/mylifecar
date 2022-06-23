<?php

function img_grayscale(&$img)
{
	
	imagetruecolortopalette($img, false, 255);
	for($i=0; $i<imagecolorstotal($img); $i++)
	{
		$col = imagecolorsforindex($img, $i);
		$grey = round(0.299*$col['red'] + 0.587*$col['green'] + 0.114*$col['blue']);
		imagecolorset($img, $i, $grey,$grey,$grey);
	}
	
}

?>