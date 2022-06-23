
<?php
$file = 'favicon.ico';
if(is_file($file))
{
	$mt = filemtime($file);
	echo '<link rel="shortcut icon" type="image/x-icon" href="/'."$file?mt=$mt".'" />';
}
?>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Content-language" content="<?php echo $Vars->language['@name'] ?>" />

<?php

//
// variables
//
$gs = $Vars->gSection['@name'];
$s = $Vars->section['@name'];
$p = $Vars->page['@name'];

//
// title, description
//
$ptitle = $Vars->page['head']['title'][0];
$ltitle = $Vars->language['head']['title'][0];
$pdesc = $Vars->page['head']['description'][0];
$ldesc = $Vars->language['head']['description'][0];
include 'php/script/mysql/connect.php';
switch($gs)
{
	case 'main':
		switch($s)
		{
			case 'index':
				switch($p)
				{
					case 'company':
						$q = "SELECT realname FROM info WHERE id='$_GET[company]'";
						$r = mysql_query($q, $_mysql['db']['companies']);
						$c = mysql_result($r, 0);
						$title = "$c. $ptitle $ltitle";
						$description = "$c. $pdesc $ldesc";
						break;
					case 'model':
						$q = "SELECT company FROM info WHERE id='$_GET[model]'";
						$r = mysql_query($q, $_mysql['db']['models']);
						$cc = mysql_result($r, 0);
						$q = "SELECT realname FROM info WHERE id='$cc'";
						$r = mysql_query($q, $_mysql['db']['companies']);
						$c = mysql_result($r, 0);
						$q = "SELECT realname FROM info WHERE id='$_GET[model]'";
						$r = mysql_query($q, $_mysql['db']['models']);
						$m = mysql_result($r, 0);
						if($x=$_GET['extended_block']) { $eb = ' '.$Vars->page['body'][$x]['head'][0]; }
						else { $eb = ''; }
						$title = "$c. $m. $ptitle{$eb} $ltitle";
						$desc = "$c. $m. $pdesc{$eb} $ldesc";
						break;
					default:
						$title = "$ptitle $ltitle";
						$desc = "$pdesc $ldesc";
						break;
				}
				break;
		}
		break;
}
include 'php/script/mysql/close.php';

?>
<title><?php echo $title; ?></title>
<meta name="description" content="<?php echo desc; ?>" />

<?php

//
// css
//
$gs = $Vars->gSection['@name'];
$s = $Vars->section['@name'];
$p = $Vars->page['@name'];
$dir = 'css';
$files = array('repository.css','index.css',"page/$gs/$s/$p.css");
foreach($files as $file)
{
	if(is_file("$dir/$file"))
	{
		$mt = filemtime("$dir/$file");
		echo '<link href="/'."$dir/$file?mt=$mt".'" rel="stylesheet" type="text/css" />'."\n";
	}
}

?>

<!--
//
// rss
//
-->
<?php

foreach($_rssxml['feeds'] as $k=>$v)
{
	if(is_array($v))
	{
		echo '<link';
		echo ' title="'.$v['title'][0].'"';
		echo ' href="http://'.$_SERVER['HTTP_HOST'].'/rss/'.$k.'"';
		echo ' rel="alternate" type="application/rss+xml" />';
	}
}

?>

<!--
//
// misc js vars
//
-->
<script language="JavaScript" type="text/javascript">

//
// user
//
var $_user = [];
$_user['nickname'] = '<?php echo $_SESSION['user']['nickname'] ?>';

//
// query
//
var $_query = [];
<?php
foreach($_GET as $k=>$v)
{ echo '$_query[\''.$k.'\'] = \''.str_replace('/','\/',urldecode($v)).'\';'."\n"; }
?>
$_query['language'] = '<?php echo $Vars->language['@name']; ?>';
$_query['gSection'] = '<?php echo $Vars->gSection['@name']; ?>';
$_query['section'] = '<?php echo $Vars->section['@name']; ?>';
$_query['page'] = '<?php echo $Vars->page['@name']; ?>';

//
// php variables
//
$_SESSION = [];
$_SESSION['dr'] = '<?php echo $_SESSION['dr']; ?>';
$_SERVER = [];
$_SERVER['HTTP_HOST'] = '<?php echo $_SERVER['HTTP_HOST']; ?>';

</script>

