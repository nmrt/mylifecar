<?php

session_start();

//
// inclusions
//
include "$_SESSION[dr]/php/script/mysql/connect.php";
include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();
include "$_SESSION[dr]/php/script/parseDate.php";
include "$_SESSION[dr]/php/script/img/png.php";

//
// global xml
//
$_acpxml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/page/main/index/AdministratorsControlPanel.xml");
$_acpxml = $XML->toArray($_acpxml->tagChildren);
$_acpxml = $_acpxml['body'];
$_btnsxml = $_acpxml['buttons']['ordered_model'];
$_modelxml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/page/main/index/model.xml");
$_modelxml = $XML->toArray($_modelxml->tagChildren);
$_modelxml = $_modelxml['body'];
$_techinfoxml = $_modelxml['tech_info'];

?>
<table border="0" cellspacing="0" cellpadding="5">
<tr>
<td valign="top">
<?php

//
// img
//
$src = "img/model/$_SESSION[lang]/ordered/$_GET[id].png";
if(!is_file("$_SESSION[dr]/$src")) { $src = 'img/ui/no.image.png'; }
$mt = filemtime("$_SESSION[dr]/$src");
$imgs = getimagesize("$_SESSION[dr]/$src");

?>
<img src="<?php echo "/$src?mt=$mt"; ?>" <?php echo $imgs[3]; ?> alt="<?php echo $_GET['id']; ?>" border="0" />
</td>
<td class="serif" valign="top">
	
	<!--
	//
	// data
	//
	-->
	<table border="0" cellspacing="0" cellpadding="5">
	<?php
	
	$q = "SELECT * FROM ordered WHERE id='$_GET[id]'";
	$omsqlr = mysql_query($q, $_mysql['db']['models']);
	$omsqlrow = @mysql_fetch_assoc($omsqlr);
	$omsqlrowi=0; foreach($omsqlrow as $omsqlrowk=>$omsqlrowv)
	{
		if(preg_match("/_unitsys$/", $omsqlrowk)) { continue; }
		$_key = ($x=$_techinfoxml[$omsqlrowk][0]) ? $x : $omsqlrowk;
		echo '<tr style="background-color:'.(($omsqlrowi%2==0)?'#fff':'#eee').';">';
		echo '<td>'.$_key.'<td>';
		switch($omsqlrowk)
		{
			
			//
			// modification timestamp
			//
			case 'mts': echo parseDate($omsqlrowv); break;
			
			//
			// status
			//
			case 'status':
				$a = array
				(
					'_msie' => array
					(
						'alt' => $v,
						'border' => 0
					)
				);
				?>
				<table border="0" cellspacing="0" cellpadding="0">
				<tr>
				<td><?php echo img_png("img/acp/ordered_model/$omsqlrowk/$omsqlrowv.png", 0, $a); ?></td>
				<td style="padding-left:5px;"><?php echo $_acpxml['model_order'][$omsqlrowk]["s$omsqlrowv"][0]; ?></td>
				</tr>
				</table>
				<?php
				break;
			
			//
			// user id
			//
			case 'uid':
				$q = "SELECT * FROM users WHERE id='$omsqlrowv'";
				$usqlr = mysql_query($q, $_mysql['db']['main']);
				$usqlrow = @mysql_fetch_assoc($usqlr);
				echo "$usqlrow[nickname] [$omsqlrowv]";
				break;
			
			//
			// company name
			//
			case 'company':
				$q = "SELECT * FROM info WHERE id='$omsqlrowv'";
				$csqlr = mysql_query($q, $_mysql['db']['companies']);
				$csqlrow = @mysql_fetch_assoc($csqlr);
				echo $csqlrow['realname'];
				break;
			
			//
			// default value
			//
			default:
				echo $omsqlrowv;
				$usys = ($x=$omsqlrow["{$omsqlrowk}_unitsys"]) ? $x : 'met';
				if($x=$_techinfoxml[$omsqlrowk]['unit'])
				{
					echo " {$x[$usys][0]}";
				}
				break;
			
		}
		echo '</td>';
		echo '</tr>';
		$omsqlrowi++;
	}
	
	?>
	</table>
	
	<!--
	//
	// btns
	//
	-->
	<?php if(!$omsqlrow['status']) { ?>
	<table border="0" cellspacing="0" cellpadding="5">
	<tr>
	<td>
	<button type="button" style="color:green;"
	onclick=
	"
		if(confirm('<?php printf($_btnsxml['accept']['confirm'][0], $_GET['id']); ?>'))
		{
			XMLHttp.loadNonXML
			(
				'/php/script/AdministratorsControlPanel/ordered_model/accept.php?id=<?php echo $_GET['id']; ?>',
				ID('orderModelXMLHttpContainer')
			);
		}
	"
	><?php echo $_btnsxml['accept'][0]; ?></button>
	</td>
	<td>
	<button type="button" style="color:red;"
	onclick=
	"
		if(confirm('<?php printf($_btnsxml['decline']['confirm'][0], $_GET['id']); ?>'))
		{
			XMLHttp.loadNonXML
			(
				'/php/script/AdministratorsControlPanel/ordered_model/decline.php?id=<?php echo $_GET['id']; ?>',
				ID('orderModelXMLHttpContainer')
			);
		}
	"
	><?php echo $_btnsxml['decline'][0]; ?></button>
	</td>
	<td><div id="orderModelXMLHttpContainer"></div></td>
	</tr>
	</table>
	<?php } ?>
	
</td>
</tr>
</table>