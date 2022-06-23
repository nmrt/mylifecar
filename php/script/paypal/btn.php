<?php

/*ini_set('display_errors', true);
error_reporting(E_ALL^E_NOTICE);*/

session_start();
if(!$_SESSION['user']) { die('log in'); }

include_once 'ewp.php';

$paypal =& new PayPalEWP();

$dir = dirname($_SERVER['DOCUMENT_ROOT']).'/paypal';
$paypal->setTempFileDirectory('/tmp');
$paypal->setCertificate("$dir/my_cert.pem", "$dir/my_key.pem"); // sandbox/
$paypal->setCertificateID('THCCES5YHGPRU'); // real:THCCES5YHGPRU, sandbox:2CRALE46FXENA
$paypal->setPayPalCertificate("$dir/paypal_cert.pem"); // sandbox/

$parameters = array
(
	
	// main
	'cmd' => '_xclick',
	'business' => 'payment@mylifecar.com', // paymen_1196106244_biz
	'item_name' => $_POST['item_name'],
	'item_number' => $_POST['item_number'],
	'amount' => $_POST['amount'],
	'currency_code' => 'USD',
	'charset' => 'utf-8',
	
	// returns
	'return' => "http://$_SERVER[HTTP_HOST]?page=pay&cmd=return",
	'cancel_return' => "http://$_SERVER[HTTP_HOST]?page=pay",
	'notify_url' => "http://$_SERVER[HTTP_HOST]/php/script/paypal/ipn.php",
	
	// misc
	'quantity' => '1',
	'tax' => '0',
	'no_shipping' => '1',
	'no_note' => '1',
	'bn' => 'PP-PayNowBF',
	'custom' => $_POST['custom'], // custom var that will be returned to me
	'rm' => '2', // 0|1:GET, 2:POST returns
	
	// appearance
	//'cs' => '1', // background color
	//'cbt' => '', // continue button text
	//'cpp_header_image' => '',
	'cpp_headerback_color' => '666666',
	'cpp_headerborder_color' => '666666',
	'cpp_payflow_color' => '666666',
	'image_url' => "http://$_SERVER[HTTP_HOST]/img/logo.150x50px.jpg" // 150x50px logo
	//'image' => '' // button image
	
);

$encryptedButton = $paypal->encryptButton($parameters);

?>

<input
name="encrypted"
value="-----BEGIN PKCS7-----<?php echo preg_replace("/\n/",'',$encryptedButton); ?>-----END PKCS7-----"
type="hidden"
/>
