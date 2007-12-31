<?php

header('content-type:text/plain; charset=utf-8');

//
// inclusions
//
include 'wm_config.php';
include 'wm_include.php';
include "$_SERVER[DOCUMENT_ROOT]/php/script/pay/checks.vars.php";

//
// checks function
//
function checks()
{
	
	//
	// LMI_MODE
	//
	if($_POST['LMI_MODE']!=$GLOBALS['LMI_MODE']) { error('LMI_MODE'); }
	
	//
	// LMI_PAYMENT_AMOUNT
	//
	if($_POST['LMI_PAYMENT_AMOUNT']<1) { error('LMI_PAYMENT_AMOUNT'); }
	include "$_SERVER[DOCUMENT_ROOT]/php/script/pay/amount.php";
	if($GLOBALS['custom']['promo']!='1')
	{
		if($_POST['LMI_PAYMENT_AMOUNT']!=$_amount) { error('LMI_PAYMENT_AMOUNT'); }
	}
	
	//
	// LMI_PAYEE_PURSE
	//
	if($_POST['LMI_PAYEE_PURSE']!=$GLOBALS['WM_SHOP_PURSE_WMZ']) { error('LMI_PAYEE_PURSE'); }
	
	include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
	
	//
	// LMI_PAYMENT_NO
	//
	$q = "SELECT id FROM info WHERE id='$_POST[LMI_PAYMENT_NO]'";
	$r = mysql_query($q, $_mysql['db']['models']);
	if(!@mysql_num_rows($r)) { error('LMI_PAYMENT_NO'); }
	
	//
	// LMI_SYS_INVS_NO|LMI_SYS_TRANS_NO
	//
	$q = "SELECT id FROM webmoney WHERE LMI_SYS_INVS_NO='$_POST[LMI_SYS_INVS_NO]' AND LMI_SYS_TRANS_NO='$_POST[LMI_SYS_TRANS_NO]'";
	$r = mysql_query($q, $_mysql['db']['main']);
	if(@mysql_num_rows($r)) { error('LMI_SYS_INVS_NO|LMI_SYS_TRANS_NO'); }
	
}

//
// error func
//
function error($txt='unknown error', $die=true)
{
	include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
	$q = "UPDATE users SET page='', pagest='' WHERE id='{$GLOBALS[custom][uid]}' AND page='$_POST[LMI_PAYMENT_NO]' AND pagest='Pending'";
	mysql_query($q, $_mysql['db']['main']);
	echo $txt;
	if($die) { die; }
}

//
// log it, indifferently
//
$lfp = fopen(dirname($_SERVER['DOCUMENT_ROOT']).'/webmoney/access.log', 'a');
ob_start();
echo date('r')."\n";
print_r($_POST);
$txt = ob_get_clean();
fwrite($lfp, $txt, strlen($txt));

//
// LMI_PREREQUEST
//
if($_POST['LMI_PREREQUEST']==1)
{
	
	//
	// checks
	//
	checks();
	
	//
	// reserve page
	//
	include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
	$q = "UPDATE users SET page='$_POST[LMI_PAYMENT_NO]', pagest='Pending' WHERE id='$custom[uid]'";
	mysql_query($q, $_mysql['db']['main']);
	
	//
	// LMI_PREREQUEST success
	//
	echo 'YES';
	
}

//
// Payment notification
//
else
{
	
	//
	// checks
	//
	checks();
	
	//
	// mysql vars
	//
	include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
	$sqldb = 'main';
	$sqltb = 'webmoney';
	
	//
	// First, add columns to sql table, if needed
	//
	$fields = array();
	$q = "SHOW COLUMNS FROM $sqltb";
	$sqlr = mysql_query($q, $_mysql['db'][$sqldb]);
	while($sqlrow=mysql_fetch_assoc($sqlr))
	{
		$n = $sqlrow['Field'];
		$fields[] = $n;
	}
	foreach($_POST as $k=>$v)
	{
		if(!in_array($k, $fields))
		{
			$q = "ALTER TABLE $sqltb ADD $k TEXT";
			mysql_query($q, $_mysql['db'][$sqldb]);
		}
	}
	
	//
	// hash check
	//
	$chkstr =
		$_POST['LMI_PAYEE_PURSE'].
		$_POST['LMI_PAYMENT_AMOUNT'].
		$_POST['LMI_PAYMENT_NO'].
		$_POST['LMI_MODE'].
		$_POST['LMI_SYS_INVS_NO'].
		$_POST['LMI_SYS_TRANS_NO'].
		$_POST['LMI_SYS_TRANS_DATE'].
		$LMI_SECRET_KEY.
		$_POST['LMI_PAYER_PURSE'].
		$_POST['LMI_PAYER_WM']
	;
	switch($LMI_HASH_METHOD)
	{
		
		//
		// MD5
		//
		case 'MD5':
			$md5sum = strtoupper(md5($chkstr));
			$hash_check = ($_POST['LMI_HASH']==$md5sum);
			break;
		
		//
		// SIGN
		//
		case 'SIGN':
			$PlanStr = $WM_SHOP_WMID.'967909998006'.$chkstr.$_POST['LMI_HASH'];
			$SignStr = wm_GetSign($PlanStr);
			if(strlen($SignStr)<132) { error('wm_GetSign'); }
			$req =
				'/asp/classicauth.asp?'.
				"WMID=$WM_SHOP_WMID&".
				'CWMID=967909998006&'.
				'CPS='.urlencode($chkstr).'&'.
				"CSS=$_POST[LMI_HASH]&".
				"SS=$SignStr"
			;
			$resp = wm_HttpsReq($req);
			$hash_check = ($resp=='Yes');
			break;
		
	}
	if($hash_check)
	{
		
		//
		// Now, insert values (with some exceptions) into mysql
		//
		$exceptions = array('id');
		$ks = array('promo');
		$vs = array((int)$custom['promo']);
		foreach($_POST as $k=>$v)
		{
			if(!in_array($k, $exceptions))
			{
				$ks[] = $k;
				$vs[] = "'".mysql_real_escape_string($v, $_mysql['db'][$sqldb])."'";
			}
		}
		$ks = join(', ', $ks);
		$vs = join(', ', $vs);
		$q = "INSERT INTO $sqltb ($ks) VALUES ($vs)";
		mysql_query($q, $_mysql['db'][$sqldb]);
		
		//
		// grant permissions for editing page
		//
		$q = "UPDATE users SET page='$_POST[LMI_PAYMENT_NO]', pagest='' WHERE id='$custom[uid]'";
		mysql_query($q, $_mysql['db']['main']);
		
		//
		// send letter
		//
		
		// subject
		$subject = $_payxml['result']['success']['completed']['subject'][0];
		
		// item name
		$item_name = pay_item_name($_POST['LMI_PAYMENT_NO']);
		
		// xhtml
		ob_start();
		echo '<div style="font-size:20px; font-weight:bold; color:red;">'.$_letter['title'].'</div>';
		printf
		(
			$_payxml['result']['success']['completed'][0],
			$item_name,
			"http://$_SERVER[HTTP_HOST]?page=model&amp;model=$_POST[LMI_PAYMENT_NO]&amp;edit=true",
			"http://$_SERVER[HTTP_HOST]?page=help&amp;topic=page_editing"
		);
		$xhtml = ob_get_clean();
		
		// plain
		ob_start();
		echo strip_tags($_letter['title'])."\n";
		printf
		(
			$_payxml['result']['success']['completed']['plain'][0],
			$item_name,
			"http://$_SERVER[HTTP_HOST]?page=model&model=$_POST[LMI_PAYMENT_NO]&edit=true",
			"http://$_SERVER[HTTP_HOST]?page=help&topic=page_editing"
		);
		$plain = ob_get_clean();
		
		$msg = corpMsgGen($xhtml, $plain);
		email($_letter['to'], $_letter['from'], $subject, $msg['xhtml'], $msg['plain']);
		
	}
	else { error('hash_check'); }
	
}

?>