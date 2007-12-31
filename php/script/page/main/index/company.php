
<?php

//
// mysql connect
//
include 'php/script/mysql/connect.php';

//
// variables
//
$codeName = $_GET['company'];
$q = "SELECT realname FROM info WHERE id='$codeName'";
$r = mysql_query($q, $_mysql['db']['companies']);
$realName = mysql_result($r, 0);
$controls = $Vars->page['body']['controls'];

?>

<table width="<?php echo (!$_msie?100:98); ?>%" border="0" cellspacing="0" cellpadding="0">
<tr>
<td width="50%" valign="top" style="padding: 0 5px;">

<?php

//
// info
//
$dataBlockName = 'info';
$options = array
(
	'width100'=>true,
	'AppearFade'=>true
);
include 'php/script/dataBlock.head.php';
?>
<table width="100%" border="0" cellspacing="0" cellpadding="6">
<tr>

<!--
//
// logo
//
-->
<td valign="top">
<?php

include 'php/script/user/text.php';
include_once "$_SESSION[dr]/php/script/growingImage.php";
$user = $_SESSION['user'];
$title = ($user['first_name'] && $user['last_name']) ? "$user[first_name] $user[last_name]" : $user['nickname'];
growingImage
(
	'companyLogo',
	"$_SESSION[dr]/img/company/$_SESSION[lang]/$codeName.png",
	$title,
	array(64, 64),
	256
);
/*echo '<div style="font-family:Verdana, Arial, Helvetica, sans-serif; font-size:9px; margin-top:5px;">';
echo $_userText['form']['image']['click'][0];
echo '</div>';*/

?>
</td>

<!--
//
// data
//
-->
<td width="100%" valign="top">
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
<td><h1><?php echo $realName ?></h1></td>
</tr>
<tr>
<td>
<table width="100%" border="0" cellspacing="0" cellpadding="6">
<?php

//
// info
//
$q = "SELECT * FROM info WHERE id='$codeName'";
$r = mysql_query($q, $_mysql['db']['companies']);
if($row=@mysql_fetch_assoc($r))
{
	
	$a = array();
	foreach($row as $k=>$v)
	{
		$k = explode('_', $k);
		$s = "\$a";
		foreach($k as $kk)
		{
			$s .= "['$kk']";
		}
		$s .= "='$v';";
		eval($s);
	}
	function f($row, $xml, $padding=6, $bgc='#fff')
	{
		foreach($row as $k=>$v)
		{
			if($x=$xml[$k][0])
			{
				switch($k)
				{
					case 'date':
						$v = parseDate($v);
						break;
					case 'website':
						$v = '<a href="http://'.preg_replace("/(?i)^http:\/\//",'',$v).'">'.$v.'</a>';
						break;
				}
				?>
				<tr style="background-color:<?php echo $bgc; ?>;">
				<td class="sansSerif nobr"
                style="padding-left:<?php echo $padding ?>px;"><?php echo $x; ?></td>
				<td width="100%"><h6><?php
				
				if(trim($v) && !is_array($v)) { echo $v; }
				else { echo '&nbsp;'; }
				
				?></h6></td>
				</tr>
				<?php
				if(is_array($v)) { f($v, $xml[$k], $padding+20, (($bgc=='#fff')?'#eee':'#fff')); }
			}
		}
	}
	f($a, $Vars->page['body']['info']);
}
?>
</table>
</td>
</tr>

<!--
//
// description
//
-->
<tr>
<td>
<div class="serif serifTD" style="padding:6px;">
<?php

$xml = $XML->parse("xml/lang/$_SESSION[lang]/company/$codeName.xml");
$xml = $XML->toArray($xml->tagChildren);
echo $xml['desc'][0];

?>
</div>
</td>
</tr>

</table>
</td>

</tr>
</table>
<?php include 'php/script/dataBlock.foot.php'; ?>

</td>
<td width="50%" valign="top" style="padding: 0 5px;">

<?php

//
// models
//
$dataBlockName = 'models';
$options = array
(
	'width100'=>true,
	'AppearFade'=>true
);
include 'php/script/dataBlock.head.php';

$q = "SELECT * FROM info WHERE company='$codeName' ORDER BY realname";
$r = mysql_query($q, $_mysql['db']['models']);
$i = 0;
if(@mysql_num_rows($r))
{
	?>
	<table width="100%" border="0" cellspacing="0" cellpadding="5">
	<tr>
	<th></th>
	<th><?php echo $_xml['models']['name'][0]; ?></th>
	<th><?php echo $_xml['models']['year'][0]; ?></th>
	<th><?php echo $_xml['models']['owner'][0]; ?></th>
	</tr>
	<?php
}
while($row=@mysql_fetch_array($r))
{
	?>
	
	<tr>
	<td>
	<?php
	
	//
	// img
	//
	$src = "img/model/$_SESSION[lang]/grayscale/32/$row[id].png";
	if(!is_file("$_SESSION[dr]/$src")) { $src = 'img/ui/color/32/no.image.png'; }
	$mt = filemtime($src);
	$imgs = getimagesize($src);
	?>
	<a href="/?page=model&amp;model=<?php echo $row['id'] ?>">
	<img src="/<?php echo "$src?mt=$mt"; ?>" <?php echo $imgs[3]; ?>
	alt="<?php echo $row['id'] ?>" border="0" />
	</a>
	
	</td>
	<td width="100%">
	<?php
	
	//
	// name
	//
	echo '<a href="/?page=model&amp;model='.$row['id'].'">';
	echo $row['realname'];
	echo '</a>';
	
	?>
	<?php if($_SESSION['user']['page']=='Administrator') { ?>
		<a href="/?page=model&amp;model=<?php echo $row['id'] ?>&amp;edit=true"
		style="font-size:75%; text-decoration:none; color:#fff; background-color:#666; padding: 0 4px 2px 4px;"
		>e</a>
	<?php } ?>
	</td>
	<td class="secondary">
	<?php
	
	//
	// year
	//
	echo $row['production'];
	
	?>
	</td>
	<td class="secondary">
	<?php
	
	//
	// status: rsrv, free
	//
	$q = "SELECT * FROM users WHERE page='$row[id]'";
	$mpr = mysql_query($q, $_mysql['db']['main']);
	$mprow = @mysql_fetch_assoc($mpr);
	if($mpnr=@mysql_num_rows($mpr))
	{
		//$text = $_languagexml['model']['reserved'][0];
		$text = $mprow['nickname'];
		//$color = 'green';
	}
	else
	{
		$text = $_languagexml['model']['free'][0];
		//$color = 'red';
	}
	$sqlrow = @mysql_fetch_assoc($mpr);
	if(!$mpnr) { echo '<a href="/?page=pay&amp;cid='.$row['company'].'&amp;mid='.$row['id'].'">'; }
	else { echo '<div style="color:green;">'; }
	echo $text;
	if(!$mpnr) { echo '</a>'; }
	else { echo '</div>'; }
	
	?>
	</td>
	</tr>
	
	<?php
	$i++;
}
if(@mysql_num_rows($r)) { echo '</table>'; }

include 'php/script/dataBlock.foot.php';

?>

</td>
</tr>
</table>

<?php

//
// other companies
//
$dataBlockName = 'other_companies';
$options = array
(
	'width100'=>true,
	'AppearFade'=>true
);
include 'php/script/dataBlock.head.php';

//
// core
//
echo '<table width="100%" border="0" cellpadding="5" cellspacing="0">';

//
// mysql query
//
$q = "SELECT * FROM info ORDER BY realname";
$_mysqlr = mysql_query($q, $_mysql['db']['companies']);
$i=0; while($_mysqlrow=@mysql_fetch_assoc($_mysqlr))
{
	
	if($i%5==0) { echo '<tr>'; }
	
	echo '<td width="20%" align="left" valign="middle">';
	echo '<table border="0" cellpadding="0" cellspacing="0">';
	echo '<tr>';
	
	//
	// image
	//
	echo '<td>';
	$src = "img/company/$_SESSION[lang]/grayscale/32/$_mysqlrow[id].png";
	if(!is_file("$_SESSION[dr]/$src")) { $src = 'img/ui/color/32/no.image.png'; }
	$mt = filemtime($src);
	$imgs = getimagesize($src);
	if($_mysqlrow['id']!=$codeName) { echo '<a href="/?page=company&amp;company='.$_mysqlrow['id'].'">'; }
	?>
	<img src="/<?php echo "$src?mt=$mt"; ?>" <?php echo $imgs[3]; ?>
	alt="<?php echo $_mysqlrow['id'] ?>" border="0" />
	<?php
	if($_mysqlrow['id']!=$codeName) { echo '</a>'; }
	echo '</td>';
	
	echo '<td style="padding-left:5px;">';
	if($_mysqlrow['id']!=$codeName) { echo '<a href="/?page=company&amp;company='.$_mysqlrow['id'].'">'; }
	echo $_mysqlrow['realname'];
	if($_mysqlrow['id']!=$codeName) { echo '</a>'; }
	echo '</td>';
	
	echo '</tr>';
	echo '</table>';
	echo '</td>';
	
	if(($i+1)%5==0 || $i==mysql_num_rows($_mysqlr)-1) { echo '</tr>'; }
	$i++;
	
}

echo '</table>';

include 'php/script/dataBlock.foot.php';

//
// mysql close
//
include 'php/script/mysql/close.php';

?>


