<?php
// $Id: wm_config.php,v 1.8 2006/01/20 19:32:32 asor Exp $
//
//            ****************************************************
//            ***   WM Shop Constant Information Section       ***
//            ****************************************************

//Public variables Section

//$WM_SHOP_PURSE_WMR = 'R333333333333';   // Shop settlement purse 
$WM_SHOP_PURSE_WMZ = 'Z166615547873';
$WM_SHOP_WMID  = '395013849148';        // Shop WMID

// Signature Section configuration 

$WM_WMSIGNER_PATH = '/var/www/nnn/domains/mylifecar.com/webmoney/wmsigner';       //Path to WMSigner section. 
//  *********    Attention!!!!!! ***********
// 1. WMSigner should be located in a folder, where users will not be able to donwload it.
//   Same referrs to WMSigner.ini and key file.
// 2. WMSigner.ini conf searches for signer section at the same folder, where it is located itself.
// 3. WMSigner looks for keys file the path it is stated in WMSigner.ini, taking into account the fact that "current" 
//   folder is the one, where WMSigner script is located.
// For example:
// Scipts and html-documents folder: /home/my_site/html
// WMSigner folder: /home/my_site/sign
// Configuration file: /home/my_site/sign/WMSigner.ini :
//	123456789012
//	pass
//	/home/my_site/sign/keyfile.kwm
// (important: no spaces in the beginning of a string but obligatory LF at the end of the file!)
// For PHP+Apache for Windows (not checked!):
// $WM_WMSIGNER_PATH = 'd:\sign\WMSigner.exe';

$WM_CACERT = './WebMoneyCA.crt'; // WebMoney root certificate path, in PEM-format
//You can as well download this file at: https://www.wmcert.com/Cert/WebMoneyCA.crt

$LMI_MODE = '0';	// Payment request test mode. 
$LMI_SIM_MODE = '0';	// Extra field for test mode.
$LMI_SECRET_KEY = 'SecretKey';// Secret Key, known to seller and WM Merchant Interface service only.
			       //  DO NOT FORGET TO CHANGE IT here and in merchant settings!
$LMI_HASH_METHOD = 'SIGN'; // Method of forming control signature for  MD5|SIGN

//Data needed to access database

/*$DB_HOST = 'localhost';
$DB_USER = 'merchanter';
$DB_PASS = 'xxxxxxxxxxxxx';
$DB_DBASE = 'merchant';*/

?>