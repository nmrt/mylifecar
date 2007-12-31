<?php

include 'wm_config.php';

?>
<input type="hidden" name="LMI_RESULT_URL" value="http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/webmoney/result.php" />
<input type="hidden" name="LMI_SUCCESS_URL" value="http://<?php echo $_SERVER['HTTP_HOST']; ?>?page=pay&cmd=return&val=1" />
<input type="hidden" name="LMI_FAIL_URL" value="http://<?php echo $_SERVER['HTTP_HOST']; ?>?page=pay&cmd=return&val=0" />
<input type="hidden" name="LMI_PAYEE_PURSE" value="<?php echo $WM_SHOP_PURSE_WMZ; ?>" />
<input type="hidden" name="LMI_SIM_MODE" value="<?php echo $LMI_SIM_MODE; ?>" />
<?php
foreach($_POST as $k=>$v)
{
	?><input type="hidden" name="<?php echo $k; ?>" value="<?php echo $v; ?>" /><?php
}

?>