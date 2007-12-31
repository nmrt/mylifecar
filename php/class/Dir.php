<?php

////////////////////////////////////////////////////////////
//
// class Dir
//
////////////////////////////////////////////////////////////

class Dir
{
	
	////////////////////////////////////////////////////////////
	//
	// method init
	//
	////////////////////////////////////////////////////////////
	
	function read($dir='', $options=array())
	{
		
		if($dir) { $this->dir = $dir; }
		if($options)
		{
			foreach($options as $o=>$v)
			{ $this->options[$o] = $v; }
		}
		if(!is_bool($options['clearCache'])) { $options['clearCache'] = true; }
		if($options['clearCache'])
		{
			$this->files = $this->dirs = $this->d = $this->f = array();
			$options['clearCache'] = false;
		}
		if(is_dir($this->dir))
		{
			clearstatcache();
			$rdir = getcwd();
			chdir($this->dir);
			$cwd = str_replace('\\', '/', getcwd());
			$dirs = $files = array();
			if ($od = opendir("."))
			{
				while (($file = readdir($od)) !== false)
				{
					if (is_dir($file) && $file != "." && $file != "..") { $dirs[] = $file; }
					else if (is_file($file)) { $files[] = $file; }
				}  
				@sort($dirs);
				@sort($files);
				foreach($files as $file) { $this->files[] = "$cwd/$file"; }
				foreach($dirs as $dir)
				{
					$this->dirs[] = "$cwd/$dir";
					if($this->options['includeSubFolders']) { $this->read("$cwd/$dir", $options); }
				}
				closedir($od);
			}
			chdir($rdir);
			$this->d = $this->dirs;
			$this->f = $this->files;
			return array('dirs'=>$this->dirs, 'files'=>$this->files, 'd'=>$this->d, 'f'=>$this->f);
		}
		
	}
	
} // class Dir()

?>