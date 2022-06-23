<?php

//
// main variables
//
$_action = preg_replace("/\.[^\.]+$/", '', basename($_SERVER['PHP_SELF']));
$_sqldb = 'models';
$_sqlotb = 'ordered';
$_sqletb = 'info';

//
// inclusions
//
include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/email.php";
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/corpMsgGen.php";

//
// xml
//
include_once "$_SERVER[DOCUMENT_ROOT]/php/class/XML.php"; $XML = new XML();
$_acpxml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/page/main/index/AdministratorsControlPanel.xml");
$_acpxml = $XML->toArray($_acpxml->tagChildren);
$_acpxml = $_acpxml['body'];
$_actionxml = $_acpxml['model_order']['reports'][$_action];
$_msgxml = $_acpxml['model_order']['msg'][$_action];

function modelOrderError($action, $type='failure', $die=true)
{
	
	//
	// echo
	//
	echo '<div class="failure">';
	echo $GLOBALS['_actionxml'][$type][0];
	echo '</div>';
	
	//
	// die
	//
	if($die) { die; }
	
}

function modelOrderSuccess($action)
{
	
	?>
	<table border="0" cellspacing="0" cellpadding="0">
	<tr>
	<td>
	<div class="success">
	<?php echo $GLOBALS['_acpxml']['model_order']['reports'][$action]['success'][0]; ?>
	</div>
	</td>
	<td style="padding-left:5px;">
		<table border="0" cellspacing="0" cellpadding="0">
		<tr>
		<td>
		<?php
		
		$timer = array
		(
			'sec' => 5,
			'id' => strtoupper(md5(uniqid(time(),true)))
		);
		
		?>
		<span id="modelOrderReportTimer<?php echo $timer['id']; ?>" style="font-weight:bold;"><?php echo $timer['sec']; ?></span> 
		<?php echo $GLOBALS['_acpxml']['model_order']['reports']['timer'][0]; ?>
		<script>
		$modelOrderReportInterval<?php echo $timer['id']; ?> = setInterval
		(
			function()
			{
				var $timer = ID('modelOrderReportTimer<?php echo $timer['id']; ?>');
				if(!$timer)
				{
					clearInterval($modelOrderReportInterval<?php echo $timer['id']; ?>);
					return;
				}
				var $sec = $timer.innerHTML;
				if($sec>0) { $timer.innerHTML = $sec-1; }
				else
				{
					clearInterval($modelOrderReportInterval<?php echo $timer['id']; ?>);
					var $n = ID('main.client');
					var $core = top.Node.getElementByClassName('\\bcore\\b', $n);
					var $padd = top.Node.getElementByClassName('\\bpadding\\b', $core);
					var $get =
					[
						'target=ordered_models'
					];
					XMLHttp.loadNonXML
					(
						'/php/script/AdministratorsControlPanel/main.client.php?'+$get.join('&'),
						$padd,
						'',
						{'callback':function($el){ AppearFades($el, function(){ MultiSelect.scan($el); }); }}
					);
				}
			}
			, 1000
		);
		</script>
		</td>
		<td style="padding-left:5px;">
		<button type="button"
		onclick="clearInterval($modelOrderReportInterval<?php echo $timer['id']; ?>);"
		><?php echo $GLOBALS['_acpxml']['model_order']['reports']['timer']['cancel'][0]; ?></button>
		</td>
		</tr>
		</table>
	</td>
	</tr>
	</table>
	<?php
	
}

?>