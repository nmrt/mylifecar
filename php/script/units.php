<?php

session_start();

function unitsSystem()
{
	
	if(!$_SESSION['localhost'])
	{
		include_once 'Net/GeoIP.php';
		$geoip = Net_GeoIP::getInstance("/var/www/nnn/GeoIP.dat", Net_GeoIP::SHARED_MEMORY);
		$ucc = strtolower($geoip->lookupCountryCode($_SERVER['REMOTE_ADDR']));
	}
	else { $ucc = 'ua'; }
	$cc = ($x=$_SESSION['user']['cc']) ? $x : $ucc;
	switch($cc)
	{
		default: $sys = 'met'; break;
		case 'us':
		case 'gb':
		case 'ca': $sys = 'imp'; break;
	}
	
	return $sys;
	
}

function unitsConvert($value, $exp)
{
	$rvalue = $value;
	$km_mi = 0.6213711922;
	$kg_lb = 2.20462262;
	$gal_L = 3.785411784;
	$in_mm = 25.4;
	$mi_km = 1/$km_mi;
	$lb_kg = 1/$kg_lb;
	$L_gal = 1/$gal_L;
	$mm_in = 1/$in_mm;
	switch($exp)
	{
		
		// speed
		case 'km>>mi':
		case 'km/h>>mph':
			$rvalue = $rvalue*$km_mi;
			break;
		case 'mi>>km':
		case 'mph>>km/h':
			$rvalue = $rvalue*$mi_km;
			break;
		case 's (0-100km/h)>>s (0-60mph)':
			$mi = 100*$km_mi;
			$mps = $mi/$rvalue;
			$rvalue = 60/$mps;
			break;
		case 's (0-60mph)>>s (0-100km/h)':
			$km = 60*$mi_km;
			$kms = $km/$rvalue;
			$rvalue = 100/$kms;
			break;
		
		// weight
		case 'kg>>lb': $rvalue = $rvalue*$kg_lb; break;
		case 'lb>>kg': $rvalue = $rvalue*$lb_kg; break;
		case 'L>>gal': $rvalue = $rvalue*$L_gal; break;
		case 'gal>>L': $rvalue = $rvalue*$gal_L; break;
		
		// length
		case 'mm>>in': $rvalue = $rvalue*$mm_in; break;
		case 'in>>mm': $rvalue = $rvalue*$in_mm; break;
		
	}
	return $rvalue;
}

?>