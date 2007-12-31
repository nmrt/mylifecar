

<?php

/*ini_set('display_errors', true);
error_reporting(E_ALL^E_NOTICE);*/

session_start();

//
// target
//
$_opts = $_POST['opts'];
$_targetsg = $_opts['target'];
printf("\ntarget: %s", $_targetsg);
switch($_targetsg)
{
	case 'company': $_targetpl = 'companies'; break;
	case 'model': $_targetpl = 'models'; break;
	case 'user': $_targetpl = 'users'; break;
	case 'rss_item': $_targetpl = 'rss'; break;
	case 'ordered_model': $_targetpl = 'ordered_models'; break;
}

//
// variables
//
$_form = $_POST['form'];

//
// includes
//
include "$_SESSION[dr]/php/class/Dir.php"; $Dir = new Dir();
$dr = $Dir->read("$_SESSION[dr]/php/script/xml");
foreach($dr['f'] as $f) { include $f; }
include "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();
include "$_SESSION[dr]/php/script/mysql/connect.php";
include "$_SESSION[dr]/php/script/fs.php";
include 'error.php';
include "$_SESSION[dr]/php/script/tidy.php";

//
// xml
//
$_modelxml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/page/main/index/model.xml");
$_modelxml = $XML->toArray($_modelxml->tagChildren);

//
// mysql INSERT OR UPDATE
//
switch($_targetsg)
{
	case 'company':
	case 'model':
		$sqlt = 'info';
		$sqldb = $_targetpl;
		break;
	case 'user':
		$sqlt = $_targetpl;
		$sqldb = 'main';
		break;
	case 'rss_item':
		$sqlt = 'rss_editor';
		$sqldb = 'main';
		break;
	case 'ordered_model':
		$sqlt = 'ordered';
		$sqldb = 'models';
		break;
}
if(!$_opts['id'])
{
	switch($_targetsg)
	{
		case 'company':
		case 'model':
		case 'rss_item':
			$ks = array();
			foreach($_form as $k=>$v) { $ks[] = "$k"; }
			$ks = join(', ', $ks);
			$vs = array();
			foreach($_form as $v)
			{
				$v = preg_replace("/<amp\/>/", '&', $v);
				$vs[] = "'".addslashes($v)."'";
			}
			$vs = join(', ', $vs);
			$q = "INSERT INTO $sqlt ($ks) VALUES ($vs)";
			printf("\nquery: %s", $q);
			$r = mysql_query($q, $_mysql['db'][$sqldb]);
			break;
	}
}
else
{
	switch($_targetsg)
	{
		case 'company':
		case 'model':
		case 'rss_item':
		case 'ordered_model':
			foreach($_form as $k=>$v)
			{
				$v = preg_replace("/<amp\/>/", '&', $v);
				$q = "UPDATE $sqlt SET $k='".addslashes($v)."' WHERE id=$_opts[id]";
				printf("\nquery: %s", $q);
				$r = mysql_query($q, $_mysql['db'][$sqldb]);
			}
			break;
		case 'user':
			/*$page = array();
			$page[] = $_form['page']['company'];
			if($x=$_form['page']['model']) { $page[] = $x; }*/
			$page = ($x=$_form['page']['model']) ? $x : $_form['page']['company'];
			$q = "UPDATE users SET page='$page', pagest='$_form[pagest]' WHERE id=$_opts[id]";
			printf("\nquery: %s", $q);
			$r = mysql_query($q, $_mysql['db']['main']);
			break;
	}
}

switch($_targetsg)
{
	case 'company':
	case 'model':
	case 'rss_item':
		
		if($_mysqlerror=mysql_error($_mysql['db'][$sqldb])) { adminEditError('mysql', $_mysqlerror); }
		
		//
		// mysql id
		//
		if(!$_opts['id']) { $id = mysql_insert_id($_mysql['db'][$sqldb]); }
		else { $id = $_opts['id']; }
		printf("\nid: %s", $id);
		
		//
		// make dirs
		//
		/*switch($_targetsg)
		{
			case 'company': $dirs = array(); break;
			case 'model':
				$dirs = array
				(
					"img/$_targetsg/$id",
					"img/$_targetsg/$id/news",
					"img/$_targetsg/$id/people",
					"img/$_targetsg/$id/photos",
					"xml/lang/$_SESSION[lang]/$_targetsg/$id",
					"xml/lang/$_SESSION[lang]/$_targetsg/$id/news",
					"xml/lang/$_SESSION[lang]/$_targetsg/$id/people",
					"xml/lang/$_SESSION[lang]/$_targetsg/$id/photos"
				);
				break;
		}
		foreach($dirs as $dir)
		{
			printf("\ndir: %s", $dir);
			if(!is_dir("$_SESSION[dr]/$dir"))
			{
				if(mkdir("$_SESSION[dr]/$dir"))
				{
					//
					// dir success
					//
					echo "\n"; ?><script type="text/javascript" language="javascript">$_<?php echo $_opts['target']; ?>SaveError=false;</script><?php
				}
				else
				{
					//
					// dir failure
					//
					$_error = true;
					echo "\n"; ?><script type="text/javascript" language="javascript">$_<?php echo $_opts['target']; ?>SaveError={'type':'dir','desc':'<?php echo $dir; ?>'};</script><?php
					echo "\n".'<span class="failure">'.$_modelxml['body']['edit']['not_saved'][0].":</span> ".$rstr;
				}
			}
		}*/
		
		//
		// img
		//
		if($img=$_POST['img'])
		{
			
			switch($_targetsg)
			{
				case 'company':
				case 'model':
					$nimg = "img/$_targetsg/$_SESSION[lang]/$id.png"; break;
			}
			printf("\noimg: %s", $img);
			printf("\nnimg: %s", $nimg);
			
			//
			// make backup
			//
			if(!$bkp=fsBkp($nimg)) { adminEditError('bkp', $nimg); }
			
			//
			// rename simg into dimg
			//
			if(fsRename($img, $nimg))
			{
				//
				// img success
				//
				fsDelete($bkp);
				include "$_SESSION[dr]/php/script/image.save.thumbs.php";
				imageSaveThumbs($id, "img/$_targetsg/$_SESSION[lang]");
			}
			else
			{
				//
				// img failure
				//
				fsBkpr($bkp);
				adminEditError('rename', "$img, $nimg");
			}
		}
		
		//
		// xml schema
		//
		$_xmlschema = xmlGenerateSchema();
		switch($_targetsg)
		{
			case 'company':
			case 'rss_item':
				
				//
				// xml
				//
				/*$tidy = new tidy;
				$tidy->parseString(str_replace('<amp/>', '&', $_POST['xml']), array('output-xhtml'=>true,'show-body-only'=>true), 'utf8');
				$tidy->cleanRepair();*/
				$tidy = tidy($_POST['xml']);
				$tag = xmlGenerateTag('desc', '', $tidy);
				xmlInsertTag($tag, $_xmlschema['root']);
				$str = xmlString($_xmlschema);
				switch($_targetsg)
				{
					case 'company': $dir = $_targetsg; break;
					case 'rss_item': $dir = 'rss/editor'; break;
				}
				$f = "xml/lang/$_SESSION[lang]/$dir/$id.xml";
				printf("\nxml: %s", $f);
				
				//
				// make backup
				//
				if(!$bkp=fsBkp($f)) { adminEditError('bkp', $f); }
				
				//
				// fwrite
				//
				if(fsFwrite($f, $str))
				{
					//
					// xml success
					//
					fsDelete($bkp);
				}
				else
				{
					//
					// xml failure
					//
					fsBkpr($bkp);
					adminEditError('fwrite', $f);
				}
				
				break;
		}
		
	break;

}

//
// end
//
include "$_SESSION[dr]/php/script/mysql/close.php";

?>

