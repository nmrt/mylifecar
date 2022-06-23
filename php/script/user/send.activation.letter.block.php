<?php

//
// $_userxml
// $_uid
//

ob_start();
?>
<div style="margin-bottom:10px;">
<?php echo $_userxml['activate']['alerts']['letter_not_arrived'][0]; ?><br/>
<a href="javascript:void(null)" class="js"
onclick=
"
	var $c = this.nextSibling;
	$c.innerHTML = '';
	$c.style.display = 'block';
	XMLHttp.loadNonXML
	(
		'php/script/user/send_activation_letter.php?uid=<?php echo $_uid; ?>',
		$c, '',
		{hideContainer:true, hideContainerTimeout:10000}
	);
"
><?php echo $_userxml['activate']['alerts']['letter_not_arrived']['btn'][0]; ?></a><div style="margin-top:5px;"></div>
</div>
<?php
return ob_get_clean();

?>