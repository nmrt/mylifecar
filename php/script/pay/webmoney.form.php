<?php

$_formName = 'webmoney';
include 'amount.php';

?>
<form name="<?php echo $_formName; ?>PayForm" action="https://merchant.webmoney.ru/lmi/payment.asp" method="post"
onsubmit=
"
	if(Spry.Widget.Form.onSubmit(this, document.<?php echo $_formName; ?>PayForm))
	{
		
		var $comsel = ID('<?php echo $_formName; ?>_companies_sel');
		var $modsel = ID('<?php echo $_formName; ?>_models_sel');
		var $aminp = ID('<?php echo $_formName; ?>_amount_inp');
		var $amount = ($aminp) ? $aminp.value : '<?php echo $_amount; ?>';
		
		for(var $i=0; $i<$comsel.length; $i++)
		{
			var $opt = $comsel.options[$i];
			if($opt.selected) { var $com = $opt.innerHTML; }
		}
		for(var $i=0; $i<$modsel.length; $i++)
		{
			var $opt = $modsel.options[$i];
			if($opt.selected) { var $mod = $opt.innerHTML; }
		}
		
		var $in = $com+' '+$mod;
		$in += '<?php echo addslashes($_xml['ready']['item_name'][0]); ?>';
		
		XMLHttp.loadNonXML
		(
			'/php/script/webmoney/fields.php',
			ID('webmoneyFormFields'),
			{
				'LMI_PAYMENT_NO' : $modsel.value,
				'LMI_PAYMENT_AMOUNT' : $amount,
				'LMI_PAYMENT_DESC' : $in,
				'custom' : '<?php
				
				echo 'uid:'.$_SESSION['user']['id'];
				include 'php/script/promo.php';
				if($_left) { echo ',promo:1'; }
				
				?>'
			},
			{async:false, withoutPreloadImg:true}
		);
		
	}
	else { return false; }
"
>
<div id="webmoneyFormFields" style="display:none;"></div>
<?php include 'ready.to.pay.php'; ?>
</form>