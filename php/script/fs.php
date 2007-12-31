

<?php

session_start();

//
// includes
//
include_once 'ftp.conf.php';

//
// backup function
//
function fsBkp($file)
{
	if(!$ftps=fsFtpConnect()) { return false; }
	$ftpc = $GLOBALS['_ftpc'];
	$bkp = "$file.bkp".date('YmdHis');
	if(file_exists("$_SESSION[dr]/$file"))
	{
		if(!fsRename($file, $bkp)) { return false; }
	}
	return $bkp;
}

//
// restore backup function
//
function fsBkpr($bkp)
{
	if(!$ftps=fsFtpConnect()) { return false; }
	$ftpc = $GLOBALS['_ftpc'];
	$file = preg_replace("/\.bkp\d+$/", '', $bkp);
	if(file_exists("$_SESSION[dr]/$bkp"))
	{
		if(!fsRename($bkp, $file)) { return false; }
	}
	return $file;
}

//
// rename function
//
function fsRename($sfile, $dfile, $overwrite=false)
{
	
	//
	// vars
	//
	if(!$ftps=fsFtpConnect()) { return false; }
	$ftpc = $GLOBALS['_ftpc'];
	
	//
	// overwrite
	//
	if($overwrite)
	{
		if(!$bkp=fsBkp($dfile)) { return false; }
	}
	
	//
	// rename
	//
	if($_SESSION['localhost']) { $ok = rename("$_SESSION[dr]/$sfile", "$_SESSION[dr]/$dfile"); }
	else { $ok = ftp_rename($ftps, "$ftpc[rdir]/$sfile", "$ftpc[rdir]/$dfile"); }
	if(!$ok)
	{
		if($overwrite) { fsBkpr($bkp); }
		return false;
	}
	
	//
	// full success
	//
	if($overwrite)
	{
		if(is_file("$_SESSION[dr]/$bkp")) { fsDelete($bkp); }
		else if(is_dir("$_SESSION[dr]/$bkp")) { fsRmdir($bkp, true); }
	}
	return true;
	
}

//
// copy function
//
function fsCopy($sfile, $dfile, $overwrite=false)
{
	
	//
	// vars
	//
	if(!$ftps=fsFtpConnect()) { return false; }
	$ftpc = $GLOBALS['_ftpc'];
	
	//
	// overwrite
	//
	if($overwrite)
	{
		if(!$bkp=fsBkp($dfile)) { return false; }
	}
	
	//
	// copy
	//
	if($_SESSION['localhost']) { $ok = copy("$_SESSION[dr]/$sfile", "$_SESSION[dr]/$dfile"); }
	else
	{
		//$ok = ftp_copy($ftps, "$ftpc[rdir]/$sfile", "$ftpc[rdir]/$dfile");
		$str = file_get_contents("$_SESSION[dr]/$sfile");
		$ok = fsFwrite($dfile, $str);
	}
	if(!$ok)
	{
		if($overwrite) { fsBkpr($bkp); }
		return false;
	}
	
	//
	// full success
	//
	if($overwrite)
	{
		if(is_file("$_SESSION[dr]/$bkp")) { fsDelete($bkp); }
		else if(is_dir("$_SESSION[dr]/$bkp")) { fsRmdir($bkp, true); }
	}
	return true;
	
}

//
// delete function
//
function fsDelete($file)
{
	if(!$ftps=fsFtpConnect()) { return false; }
	$ftpc = $GLOBALS['_ftpc'];
	$bkp = "$file.bkp".date('YmdHis');
	if(is_file("$_SESSION[dr]/$file"))
	{
		if($_SESSION['localhost'])
		{
			if(!unlink("$_SESSION[dr]/$file")) { return false; }
		}
		else
		{
			if(!ftp_delete($ftps, "$ftpc[rdir]/$file")) { return false; }
		}
	}
	return true;
}

//
// fwrite function
//
function fsFwrite($file, $str, $mode='w', $overwrite=false)
{
	
	//
	// vars
	//
	$ftpc = $GLOBALS['_ftpc'];
	
	//
	// overwrite
	//
	if($overwrite)
	{
		if(!$bkp=fsBkp($file)) { return false; }
	}
	
	//
	// fopen, fwrite
	//
	if($_SESSION['localhost']) { $fp = fopen("$_SESSION[dr]/$file", $mode); }
	else { $fp = fopen("ftp://$ftpc[user]:$ftpc[pass]@$ftpc[host]/$ftpc[rdir]/$file", $mode); }
	if($fp)
	{
		$ok = fwrite($fp, $str, strlen($str));
		@fclose($fp);
	}
	if(!$ok)
	{
		if($overwrite) { fsBkpr($bkp); }
		return false;
	}
	
	//
	// full success
	//
	if($overwrite) { fsDelete($bkp); }
	return true;
	
}

//
// mkdir function
//
function fsMkdir($dir, $overwrite=false)
{
	
	//
	// vars
	//
	if(!$ftps=fsFtpConnect()) { return false; }
	$ftpc = $GLOBALS['_ftpc'];
	
	//
	// overwrite
	//
	if($overwrite)
	{
		if(!$bkp=fsBkp($dir)) { return false; }
	}
	
	//
	// mkdir
	//
	if($_SESSION['localhost']) { $ok = mkdir("$_SESSION[dr]/$dir"); }
	else { $ok = ftp_mkdir($ftps, "$ftpc[rdir]/$dir"); }
	if(!$ok)
	{
		if($overwrite) { fsBkpr($bkp); }
		return false;
	}
	
	//
	// full success
	//
	if($overwrite) { fsRmdir($bkp, true); }
	return true;
	
}

//
// rmdir function
//
function fsRmdir($dir, $contents=false)
{
	
	//
	// vars
	//
	if(!$ftps=fsFtpConnect()) { return false; }
	$ftpc = $GLOBALS['_ftpc'];
	
	if(is_dir("$_SESSION[dr]/$dir"))
	{
		
		//
		// contents
		//
		if($contents)
		{
			if($dh=opendir("$_SESSION[dr]/$dir"))
			{
				while($file=readdir($dh))
				{
					if($file!='.' && $file!='..')
					{
						if(is_file("$_SESSION[dr]/$dir/$file"))
						{
							if(!fsDelete("$dir/$file")) { return false; }
						}
						else if(is_dir("$_SESSION[dr]/$dir/$file"))
						{
							if(!fsRmdir("$dir/$file", true)) { return false; }
						}
					}
				}
			}
		}
		
		if($_SESSION['localhost'])
		{
			if(!rmdir("$_SESSION[dr]/$dir")) { return false; }
		}
		else
		{
			if(!ftp_rmdir($ftps, "$ftpc[rdir]/$dir")) { return false; }
		}
		
	}
	
	//
	// full success
	//
	return true;
	
}

//
// make ftp connection function
//
function fsFtpConnect()
{
	if(!$_SESSION['localhost'])
	{
		$ftpc = $GLOBALS['_ftpc'];
		if(!$ftps=ftp_connect($ftpc['host'])) { return false; }
		if(!ftp_login($ftps, $ftpc['user'], $ftpc['pass'])) { return false; }
		return $ftps;
	}
	return true;
}

?>

