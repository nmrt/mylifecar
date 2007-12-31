<?php header('content-type:text/plain; charset=utf-8'); ?>
<pre>
<?php

/*ini_set('display_errors', true);
error_reporting(E_ALL^E_NOTICE);*/

//
// inclusions
//
include "$_SERVER[DOCUMENT_ROOT]/php/script/pay/checks.vars.php";
/*include "$_SERVER[DOCUMENT_ROOT]/php/script/global.variables.php";
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/email.php";
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/corpMsgGen.php";
include_once "$_SERVER[DOCUMENT_ROOT]/php/class/XML.php"; $XML = new XML();

//
// xml
//
$_languagexml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/page/index.xml");
$_languagexml = $XML->toArray($_languagexml->tagChildren);
$_languagexml = $_languagexml['body'];
$_payxml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/page/main/index/pay.xml");
$_payxml = $XML->toArray($_payxml->tagChildren);
$_payxml = $_payxml['body'];

//
// parse custom
//
$custom = array();
$a = explode(',', $_POST['custom']);
foreach($a as $v)
{
	list($key, $val) = explode(':', $v);
	$custom[$key] = $val;
}
echo 'custom: ';
print_r($custom);

//
// letter
//
$_letter = array();
include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
$q = "SELECT * FROM users WHERE id='$custom[uid]'";
$r = mysql_query($q, $_mysql['db']['main']);
$row = @mysql_fetch_assoc($r);
include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/close.php";
// to
$_letter['to'] = $row['email'];
// from
$host = preg_replace("/(?i)^www\./", '', $_SERVER['HTTP_HOST']);
$_letter['from'] = '"'.$host.'" <'."info@$host".'>';
// title
ob_start();
$un = ($row['first_name']&&$row['last_name']) ? "$row[first_name] $row[last_name]" : $row['nickname'];
switch($_POST['payment_status'])
{
	case 'Completed':
	case 'Pending': $st = 'success'; break;
	case 'Denied':
	case 'Failed': $st = 'failure'; break;
}
printf($_payxml['result'][$st][0], $un);
$_letter['title'] = ob_get_clean();*/

//
// item name
//
$_item_name = pay_item_name($_POST['item_number']);

//
// checks
//
function checks()
{
	include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
	$q = "SELECT txn_id FROM paypal WHERE txn_id='$GLOBALS[txn_id]'";
	$r = mysql_query($q, $_mysql['db']['main']);
	if(!@mysql_num_rows($r))
	{
		echo "txn_id is valid\n";
		if($GLOBALS['receiver_email']=='payment@mylifecar.com' || $GLOBALS['receiver_email']=='paymen_1196106244_biz@mylifecar.com')
		{
			echo "receiver_email is valid\n";
			if($GLOBALS['payment_currency']=='USD')
			{
				echo "payment_currency is valid\n";
				include "$_SERVER[DOCUMENT_ROOT]/php/script/pay/amount.php";
				if($GLOBALS['custom']['promo']!='1')
				{
					echo "promo mode is NOT 1\n";
					if($GLOBALS['payment_amount']!=$_amount)
					{
						echo "amount is NOT valid\n";
						return false;
					} else { echo "amount is valid\n"; }
				} else { echo "promo mode is 1\n"; }
				/*$q = "SELECT item_number FROM paypal WHERE item_number='$item_number'";
				$r = mysql_query($q, $_mysql['db']['main']);
				if(!@mysql_num_rows($r))
				{
					$q = "SELECT custom FROM paypal WHERE custom LIKE '%uid:$custom[uid]%'";
					$r = mysql_query($q, $_mysql['db']['main']);
					if(!@mysql_num_rows($r))
					{*/
						return true;
					/*}
				}*/
			}
		}
	} else { echo "txn_id is NOT valid\n"; }
	include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/close.php";
	return false;
}

//
// log it, indifferently
//
$lfp = fopen(dirname($_SERVER['DOCUMENT_ROOT']).'/paypal/access.log', 'a');
ob_start();
echo date('r')."\n";
print_r($_POST);
$txt = ob_get_clean();
if(fwrite($lfp, $txt, strlen($txt))) { echo "logged\n"; }

// read the post from PayPal system and add 'cmd'
$req = 'cmd=_notify-validate';

foreach($_POST as $key=>$value)
{
	$value = urlencode(stripslashes($value));
	$req .= "&$key=$value";
}

// post back to PayPal system to validate
$header  = '';
$header .= "POST /cgi-bin/webscr HTTP/1.0\r\n";
$header .= "Content-Type: application/x-www-form-urlencoded\r\n";
$header .= 'Content-Length: '.strlen($req)."\r\n\r\n";
$fp = fsockopen('www.paypal.com', 80, $errno, $errstr, 30); // www.sandbox.paypal.com

// assign posted variables to local variables
$item_name = $_POST['item_name'];
$item_number = $_POST['item_number'];
$payment_status = $_POST['payment_status'];
$payment_amount = $_POST['mc_gross'];
$payment_currency = $_POST['mc_currency'];
$txn_id = $_POST['txn_id'];
$receiver_email = $_POST['receiver_email'];
$payer_email = $_POST['payer_email'];

if(!$fp)
{
	// HTTP ERROR
	echo "http error\n";
}
else
{
	fputs ($fp, $header.$req);
	while(!feof($fp))
	{
		$res = fgets($fp, 1024);
		if(strcmp($res,'VERIFIED')==0)
		{
			
			echo "VERIFIED\n";
			
			//
			// Paypal suggestions
			//
			// check the payment_status is Completed
			// check that txn_id has not been previously processed
			// check that receiver_email is your Primary PayPal email
			// check that payment_amount/payment_currency are correct
			// process payment
			
			switch($payment_status)
			{
				
				//
				// Completed
				//
				case 'Completed':
					echo "Completed\n";
					if(checks())
					{
						
						include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
						
						//
						// First, add columns to sql table, if needed
						//
						$fields = array();
						$q = "SHOW COLUMNS FROM paypal";
						$sqlr = mysql_query($q, $_mysql['db']['main']);
						while($sqlrow=mysql_fetch_assoc($sqlr))
						{
							$n = $sqlrow['Field'];
							$fields[] = $n;
						}
						//print_r($fields);
						foreach($_POST as $k=>$v)
						{
							if(!in_array($k, $fields))
							{
								$q = "ALTER TABLE paypal ADD $k TEXT";
								//echo "$q\n";
								mysql_query($q, $_mysql['db']['main']);
							}
						}
						
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
								$vs[] = "'".mysql_real_escape_string($v, $_mysql['db']['main'])."'";
							}
						}
						$ks = join(', ', $ks);
						$vs = join(', ', $vs);
						$q = "INSERT INTO paypal ($ks) VALUES ($vs)";
						$t = "$q\n";
						//echo "$q\n";
						mysql_query($q, $_mysql['db']['main']);
						
						//
						// grant permissions for editing page
						//
						$q = "UPDATE users SET page='$item_number', pagest='' WHERE id='$custom[uid]'";
						mysql_query($q, $_mysql['db']['main']);
						
						include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/close.php";
						
						//
						// send letter
						//
						$subject = $_payxml['result']['success']['completed']['subject'][0];
						
						// xhtml
						ob_start();
						echo '<div style="font-size:20px; font-weight:bold; color:red;">'.$_letter['title'].'</div>';
						printf
						(
							$_payxml['result']['success']['completed'][0],
							$_item_name,
							"http://$_SERVER[HTTP_HOST]?page=model&amp;model=$item_number&amp;edit=true",
							"http://$_SERVER[HTTP_HOST]?page=help&amp;topic=page_editing"
						);
						$xhtml = ob_get_clean();
						
						// plain
						ob_start();
						echo strip_tags($_letter['title'])."\n";
						printf
						(
							$_payxml['result']['success']['completed']['plain'][0],
							$_item_name,
							"http://$_SERVER[HTTP_HOST]?page=model&model=$item_number&edit=true",
							"http://$_SERVER[HTTP_HOST]?page=help&topic=page_editing"
						);
						$plain = ob_get_clean();
						
						$msg = corpMsgGen($xhtml, $plain);
						$ok = email($_letter['to'], $_letter['from'], $subject, $msg['xhtml'], $msg['plain']);
						echo "mail: $ok\n";
						
					}		
					break;
				
				//
				// Pending
				//
				case 'Pending':
					echo "Pending\n";
					if(checks())
					{
						
						include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
						
						//
						// reserve page
						//
						$q = "UPDATE users SET page='$item_number', pagest='Pending' WHERE id='$custom[uid]'";
						mysql_query($q, $_mysql['db']['main']);
						
						include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/close.php";
						
						//
						// send letter
						//
						$subject = $_payxml['result']['success']['pending']['subject'][0];
						
						// xhtml
						ob_start();
						echo '<div style="font-size:20px; font-weight:bold; color:red;">'.$_letter['title'].'</div>';
						printf
						(
							$_payxml['result']['success']['pending'][0],
							$_POST['pending_reason']
						);
						$xhtml = ob_get_clean();
						
						// plain
						ob_start();
						echo strip_tags($_letter['title'])."\n";
						printf
						(
							$_payxml['result']['success']['pending']['plain'][0],
							$_POST['pending_reason']
						);
						$plain = ob_get_clean();
						
						$msg = corpMsgGen($xhtml, $plain);
						$ok = email($_letter['to'], $_letter['from'], $subject, $msg['xhtml'], $msg['plain']);
						echo "mail: $ok\n";
						
					}
					break;
				
				//
				// Denied, Failed
				//
				case 'Denied':
				case 'Failed':
					echo "Denied, Failed\n";
						
						include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
						
						//
						// remove Pending page status, if any
						//
						$q = "UPDATE users SET page='', pagest='' WHERE id='$custom[uid]' AND page='$item_number' AND pagest='Pending'";
						mysql_query($q, $_mysql['db']['main']);
						
						include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/close.php";
						
						//
						// send letter
						//
						$subject = $_payxml['result']['failure']['subject'][0];
						$host = preg_replace("/(?i)^www\./", '', $_SERVER['HTTP_HOST']);
						
						// xhtml
						ob_start();
						echo '<div style="font-size:20px; font-weight:bold; color:red;">'.$_letter['title'].'</div>';
						printf
						(
							$_payxml['result']['failure']['xhtml'][0],
							$_POST['payment_status'],
							"info@$host",
							"info@$host"
						);
						$xhtml = ob_get_clean();
						
						// plain
						ob_start();
						echo strip_tags($_letter['title'])."\n";
						printf
						(
							$_payxml['result']['failure']['plain'][0],
							$_POST['payment_status'],
							"info@$host"
						);
						$plain = ob_get_clean();
						
						$msg = corpMsgGen($xhtml, $plain);
						$ok = email($_letter['to'], $_letter['from'], $subject, $msg['xhtml'], $msg['plain']);
						echo "mail: $ok\n";
						
					break;
				
			}
		
		}
		else if(strcmp($res,'INVALID')==0)
		{
			
			echo "INVALID\n";
			
			// log for manual investigation
			
		}
	}
	fclose($fp);
}

?>
</pre>