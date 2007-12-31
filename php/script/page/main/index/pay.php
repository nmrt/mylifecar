<?php

/*$us = array('nmrt','test');
if(!in_array($_SESSION['user']['nickname'], $us)) { echo '<h1>Sorry, but this service is temporary unavailable.</h1>'; }
else {*/

echo '<table width="'.(!$_msie?100:98).'%" border="0" cellpadding="0" cellspacing="0">';
echo '<tr>';

//
// main window
//
echo '<td valign="top">';
$dataBlockHeadText = '';
$options = array
(
	'width100' => true,
	'AppearFade' => true
);
include 'php/script/dataBlock.head.php';

//
// core
//
//echo '<div align="center">';

//
// no cmd, default
//
if(!$_GET['cmd'])
{
	if(!$_SESSION['user']) { include 'php/script/pay/not.logged.in.php'; }
	else if
	(
		$_SESSION['user']['page'] &&
		$_SESSION['user']['page']!='Administrator' &&
		$_SESSION['user']['pagest']!='Pending'
	)
	{ include 'php/script/pay/already.have.one.php'; }
	else
	{
		?>
		<div id="cmdTabbedPanel" class="TabbedPanels">
			<ul class="TabbedPanelsTabGroup">
				<li class="TabbedPanelsTab"><img src="https://www.sandbox.paypal.com/en_US/i/logo/PayPal_mark_60x38.gif" border="0" alt="Acceptance Mark" /></li>
				<!--<li class="TabbedPanelsTab"><img src="/img/webmoney.jpg" border="0" alt="webmoney" /></li>-->
			</ul>
			<div class="TabbedPanelsContentGroup">
				<div class="TabbedPanelsContent"><?php include 'php/script/pay/paypal.form.php'; ?></div>
				<!--<div class="TabbedPanelsContent"><?php include 'php/script/pay/webmoney.form.php'; ?></div>-->
			</div>
		</div>
		<?php
		if($x=$_SESSION['user']['cc']) { $ucc = $x; }
		else if(!$_SESSION['localhost'])
		{
			include_once 'Net/GeoIP.php';
			$geoip = Net_GeoIP::getInstance("/var/www/nnn/GeoIP.dat", Net_GeoIP::SHARED_MEMORY);
			$ucc = strtolower($geoip->lookupCountryCode($_SERVER['REMOTE_ADDR']));
		}
		else { $ucc = 'ua'; }
		switch($ucc)
		{
			default: $defaultTab = 0; break;
			case 'ua':
			case 'ru':
				$defaultTab = 1;
				break;
		}
		?><script type="text/javascript"> new Spry.Widget.TabbedPanels('cmdTabbedPanel'/*, {'defaultTab':<?php echo $defaultTab; ?>}*/); </script><?php
		
	}
}

//
// cmd
//
else
{
	//echo'<pre>';print_r($_POST);echo'</pre>';
	include "php/script/pay/$_GET[cmd].php";
}

//echo '</div>';

include 'php/script/dataBlock.foot.php';
echo '</td>';

//
// additional links
//
echo '<td valign="top" width="300" style="padding: 0 10px;">';
$dataBlockHeadText = $_xml['add_links'][0];
$options = array
(
	'width100' => true,
	'AppearFade' => true
);
include 'php/script/dataBlock.head.php';

//
// core
//
if($_SESSION['user'])
{
	?>
	<a class="typeB js" href="javascript:void(null)"
	onclick=
	"
		var $o =
		{
			'class'		: 'orderModel',
			'name'		: '<?php echo urlencode($_xml['ready']['order_model'][0]); ?>',
			'body'		: '<?php echo urlencode('window/orderModel.php'); ?>',
			'include'	: true,
			'callback'	: function($el)
			{
				MultiSelect.scan($el);
			}
		}
		Window.addInstance($o);
	"
	>
	<?php
}
echo $_xml['ready']['order_model']['question'][0];
if($_SESSION['user']) { ?></a><?php }
else
{
	$text = $_userxml['ui']['must_be_logged_in'][0];
	echo tip($text);
}

include 'php/script/dataBlock.foot.php';
echo '</td>';

//
// promotion
//
echo '<td valign="top" width="200">';
$dataBlockHeadText = $_languagexml['action100']['promotion'][0];
$options = array
(
	'width100' => true,
	'AppearFade' => true
);
include 'php/script/dataBlock.head.php';

//
// core
//
include 'php/script/promo.php';
if($_left)
{
	printf($_languagexml['action100'][0], $_count, $_left);
	echo '<ul style="padding:20px; margin:0;">';
	$adds = $_languagexml['action100']['add'];
	$adds = $XML->toPlural($adds);
	foreach($adds as $v)
	{
		if(is_array($v))
		{
			echo '<li>';
			switch($v['@id'])
			{
				default: echo $v[0]; break;
				case 'nLargestPrices': printf($v[0], $_forRevard); break;
			}
			echo '</li>';
		}
	}
	echo '</ul>';
}
else { echo $_xml['no_promo_at_this_time'][0]; }

include 'php/script/dataBlock.foot.php';
echo '</td>';

echo '</tr>';
echo '</table>';

//} // tmp else

?>