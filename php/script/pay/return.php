<?php

session_start();

//
// user name
//
$_user = $_SESSION['user'];
$_uname = ($_user['first_name']&&$_user['last_name'])
? "$_user[first_name] $_user[last_name]"
: $_user['nickname'];

//
// item_name
//
include 'item_name.php';

//
// head
//
switch($_POST['payment_status'])
{
	default:
		switch($_GET['val'])
		{
			case '0': $st = 'failure'; break;
			case '1': $st = 'success'; break;
		}
		break;
	case 'Completed':
	case 'Pending': $st = 'success'; break;
	case 'Denied':
	case 'Failed': $st = 'failure'; break;
}
echo '<h1>';
printf($_xml['result'][$st][0], $_uname);
echo '</h1>';

//
// body
//
$host = preg_replace("/(?i)^www\./", '', $_SERVER['HTTP_HOST']);
switch($_POST['payment_status'])
{
	
	default:
		switch($_GET['val'])
		{
			case '0':
				printf
				(
					$_xml['result']['failure']['xhtml'][0],
					'NONE',
					"info@$host",
					"info@$host"
				);
				break;
			
			case '1':
				printf
				(
					$_xml['result']['success']['completed'][0],
					pay_item_name($_POST['LMI_PAYMENT_NO']),
					"http://$_SERVER[HTTP_HOST]?page=model&amp;model=$_POST[LMI_PAYMENT_NO]&amp;edit=true",
					"http://$_SERVER[HTTP_HOST]?page=help&amp;topic=page_editing"
				);
				break;
			
		}
		break;
	
	case 'Completed':
		printf
		(
			$_xml['result']['success']['completed'][0],
			pay_item_name($_POST['item_number']),
			"http://$_SERVER[HTTP_HOST]?page=model&amp;model=$_POST[item_number]&amp;edit=true",
			"http://$_SERVER[HTTP_HOST]?page=help&amp;topic=page_editing"
		);
		break;
	
	case 'Pending':
		printf
		(
			$_xml['result']['success']['pending'][0],
			$_POST['pending_reason']
		);
		break;
	
	case 'Denied':
	case 'Failed':
		printf
		(
			$_xml['result']['failure']['xhtml'][0],
			$_POST['payment_status'],
			"info@$host",
			"info@$host"
		);
		break;
	
}

?>
