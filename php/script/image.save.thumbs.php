

<?php

/*ini_set('display_errors', true);
error_reporting(E_ALL^E_NOTICE);*/

//ini_set('memory_limit', '128M');
session_start();

function imageSaveThumbs($id, $dir)
{
	
	//
	// preparations
	//
	include_once "$_SESSION[dr]/php/script/img/grayscale.php";
	include_once "$_SESSION[dr]/php/script/fs.php";
	include_once "$_SESSION[dr]/php/script/image.operations.globals.php";
	
	//
	// color systems, sizes
	//
	$css = array('color','grayscale');
	$sizes = array(32,64);
	
	//
	// engine
	//
	$simgs = getimagesize("$_SESSION[dr]/$dir/$id.png");
	$simg = imagecreatefrompng("$_SESSION[dr]/$dir/$id.png");
	foreach($css as $cs)
	{
		foreach($sizes as $width)
		{
			
			$delta = $simgs[0]/$width;
			$height = $simgs[1]/$delta;
			$dimg = imagecreatetruecolor($width, $height);
			imagecopyresampled($dimg,$simg, 0,0, 0,0, $width,$height, $simgs[0],$simgs[1]);
			switch($cs)
			{
				case 'grayscale':
					img_grayscale($dimg);
					break;
			}
			$f = "$dir/$cs/$width/$id.png";
			
			//
			// backup
			//
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
			
			imagedestroy($dimg);
			
		}
	}
		
}

?>

