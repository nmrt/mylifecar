

<?php

session_start();

/*ini_set('display_errors', true);
error_reporting(E_ALL^E_NOTICE);*/

//
// variables
//
$block = $_GET['block'];
$_documentRoot = $_SESSION['dr'];
$_msie = $_SESSION['msie'];
$id = $_POST['id'];

//
// includes
//
include_once "$_documentRoot/php/class/Dir.php"; $Dir = new Dir();
$dr = $Dir->read("$_documentRoot/php/script/xml");
foreach($dr['f'] as $f) { include_once $f; }
include_once "$_documentRoot/php/class/XML.php"; $XML = new XML();
include_once "$_SESSION[dr]/php/script/tidy.php";
include "$_SESSION[dr]/php/script/fs.php";
include 'error.php';

//
// xml
//
$xml = xmlGenerateSchema();
if(!$modelxml)
{
	$modelxml = $XML->parse("$_documentRoot/xml/lang/$_SESSION[lang]/page/main/index/model.xml");
	$modelxml = $XML->toArray($modelxml->tagChildren);
}

//
// tidy
//
switch($block)
{
	case 'history':
	case 'editors_column':
		$tidy = tidy($_POST['text']); break;
	case 'news': $tidy = tidy($_POST['body']); break;
	case 'photos':
	case 'people':
	case 'conversation':
		$tidy = tidy($_POST['desc']); break;
}

//
// tidy failure
//
//if(tidy_error_count($tidy)) { modelEditError(); }

//
// engine
//
include "$_SESSION[dr]/php/script/mysql/connect.php";
switch($block)
{
	case 'news':
	case 'photos':
	case 'people':
	case 'conversation':
		
		
		//
		// mysql
		//
		switch($_POST['type'])
		{
			case 'add':
				$ks = $vs = array();
				switch($block)
				{
					case 'conversation':
						$_POST['form']['uid'] = $_SESSION['user']['id'];
						break;
				}
				foreach($_POST['form'] as $k=>$v)
				{
					$ks[] = $k;
					switch($block)
					{
						case 'conversation':
							switch($k)
							{
								case 'descrpt':
									$v = tidy($v);
									break;
							}
							break;
					}
					$vs[] = "'".mysql_real_escape_string($v, $_mysql['db']['main'])."'";
				}
				$ks = join(', ', $ks);
				$vs = join(', ', $vs);
				$q = "INSERT INTO $block ($ks) VALUES ($vs)";
				$r = mysql_query($q, $_mysql['db']['main']);
				break;
			case 'edit':
				foreach($_POST['form'] as $k=>$v)
				{
					switch($block)
					{
						case 'conversation':
							switch($k)
							{
								case 'descrpt':
									$v = tidy($v);
									break;
							}
							break;
					}
					$v = mysql_real_escape_string($v, $_mysql['db']['main']);
					$q = "UPDATE $block SET $k='$v' WHERE id=$_POST[id]";
					$r = mysql_query($q, $_mysql['db']['main']);
				}
				break;
		}
		if($e=mysql_error($_mysql['db']['main'])) { modelEditError(); }
		
		//
		// id
		//
		if(!$id) { $id = mysql_insert_id($_mysql['db']['main']); }
		
		//
		// img
		//
		if($img=$_POST['img'])
		{
			
			$dimg = "img/model/$_SESSION[lang]/$block/$id.png";
			
			//
			// make backup
			//
			if(!$bkp=fsBkp($dimg)) { modelEditError(); }
			
			//
			// rename simg into dimg
			//
			if(!fsRename($img, $dimg))
			{
				//
				// restore backup on failure
				//
				fsBkpr($bkp);
				modelEditError();
			}
			else
			{
				
				//
				// delete backup on success
				//
				fsDelete($bkp);
				
				//
				// save img thumbs
				//
				include "$_SESSION[dr]/php/script/image.save.thumbs.php";
				imageSaveThumbs($id, "img/model/$_SESSION[lang]/$block");
				
			}
			
		}
		break;
}
include "$_SESSION[dr]/php/script/mysql/close.php";

// xml
switch($block)
{
	case 'history':
	case 'editors_column':
		$_tag = xmlGenerateTag('text', '', $tidy); break;
	case 'news': $_tag = xmlGenerateTag('body', '', $tidy); break;
	case 'photos':
	case 'people':
		$_tag = xmlGenerateTag('desc', '', $tidy); break;
}

//
// write xml
//
if($_tag)
{
	
	xmlInsertTag($_tag, $xml['root']);
	$str = xmlString($xml);
	$f = "xml/lang/$_SESSION[lang]/model/$block/$id.xml";
	
	//
	// make backup
	//
	if(!$bkp=fsBkp($f)) { modelEditError(); }
	
	//
	// fwrite
	//
	if(fsFwrite($f, $str))
	{
		//
		// delete backup on success
		//
		fsDelete($bkp);
	}
	else
	{
		//
		// restore backup on failure
		//
		fsBkpr($bkp);
		modelEditError();
	}
	
}

//
// success
//
echo '<span class="success">'.$modelxml['body']['edit']['saved'][0].'</span>';

?>

