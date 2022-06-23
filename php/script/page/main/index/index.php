

<div class="AppearFade" style="display:none;">
<table id="companies" width="<?php echo (!$_msie?100:98) ?>%" border="0" cellspacing="0" cellpadding="0">
<?php

//
// mysql connect
//
include 'php/script/mysql/connect.php';

$q = "SELECT * FROM info ORDER BY realname";
$r = mysql_query($q, $_mysql['db']['companies']);
$i = 0;
while($row=@mysql_fetch_assoc($r))
{
	if($i%5==0) { echo '<tr>'; }
	$codeName = $row['id'];
	$name = $row['realname'];
?>
    <td width="20%">
    
    <script language="javascript" type="text/javascript">
	
	/*var $img = new Image();
	$img.src = '/img/company/color/64/<?php echo $codeName; ?>.png';
	window.preloadImages.push($img);*/
	
	</script>
	
    <!--
    //
    // dataBlock
    //
    -->
    <table class="company dataBlock pointer" width="100%" border="0" cellspacing="0" cellpadding="0"
    style="margin:0px;"
    onmouseover=
	"
		Node.getElementByClassName('\\ba\\b', this).style.textDecoration = 'none';
		//Node.getElementByClassName('\\blogo\\b', this).src = '/img/company/color/64/<?php echo $codeName; ?>.png';
		
	"
    onmouseout=
	"
		Node.getElementByClassName('\\ba\\b', this).style.textDecoration = 'underline';
		//Node.getElementByClassName('\\blogo\\b', this).src = '/img/company/grayscale/64/<?php echo $codeName; ?>.png';
	"
    onclick="location.href='/?page=company&amp;company=<?php echo $codeName; ?>';"
    >
    <tr>
    <td class="ltCornerWhite" width="1">
    <?php
    $alt = array('alt'=>'left top corner');
    $a = array
    (
        '_msie' => $alt
    );
    echo img_png('img/corners/light-grey/white-back/lt.png', $_msie, $a);
    ?>
    </td>
    <td style="
    <?php
    
    $src = 'img/corners/light-grey/white-back/st.png';
    if(!$_msie) { echo 'background-image:url('.$src.');'; }
    else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }
    
    ?>
    "></td>
    <td class="rtCornerWhite" width="1" align="right">
    <?php
    $alt = array('alt'=>'left top corner');
    $a = array
    (
        '_msie' => $alt
    );
    echo img_png('img/corners/light-grey/white-back/rt.png', $_msie, $a);
    ?>
    </td>
    </tr>
    <tr>
    <td width="1" style="
    <?php
    
    $src = 'img/corners/light-grey/white-back/sl.png';
    if(!$_msie) { echo 'background-image:url('.$src.');'; }
    else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }
    
    ?>
    "></td>
    
    <!--
    //
    // core
    //
    -->
    <td class="coreWhite">
    
    <table width="100%" border="0" cellspacing="0" cellpadding="6">
    <tr>
    
    <!--
    //
    // logo
    //
    -->
    <td width="1">
    <?php
    
    echo '<a href="/?page=company&amp;company='.$codeName.'">';
	$file = "img/company/$_SESSION[lang]/grayscale/64/$codeName.png";
	$mt = filemtime($file);
	$imgs = getimagesize($file);
    echo '<img class="logo" src="/'."$file?mt=$mt".'" '.$imgs[3].' border="0" alt="'.$name.'" title="'.$name.'" />';
    echo '</a>';
    
    ?>
    </td>
    
    <!--
    //
    // name
    //
    -->
    <td class="sansSerif bold">
    <?php
    
    //echo '<a href="/?page=company&amp;company='.$codeName.'">';
    echo '<span class="a" style="text-decoration:underline;">';
	echo $name;
	echo '</span>';
    //echo '</a>';
    
    ?>
    </td>
    </tr>
    </table>
    
    <!-- end: core --></td>
    
    <td width="1" style="
    <?php
    
    $src = 'img/corners/light-grey/white-back/sr.png';
    if(!$_msie) { echo 'background-image:url('.$src.');'; }
    else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }
    
    ?>
    "></td>
    </tr>
    <tr>
    <td class="lbCornerWhite" width="1">
    <?php
    $alt = array('alt'=>'left bottom corner');
    $a = array
    (
        '_msie' => $alt
    );
    echo img_png('img/corners/light-grey/white-back/lb.png', $_msie, $a);
    ?>
    </td>
    <td style="
    <?php
    
    $src = 'img/corners/light-grey/white-back/sb.png';
    if(!$_msie) { echo 'background-image:url('.$src.');'; }
    else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }
    
    ?>
    "></td>
    <td class="rbCornerWhite" width="1" align="right">
    <?php
    $alt = array('alt'=>'right bottom corner');
    $a = array
    (
        '_msie' => $alt
    );
    echo img_png('img/corners/light-grey/white-back/rb.png', $_msie, $a);
    ?>
    </td>
    </tr>
    <!-- end: dataBlock --></table>
    
    </td>
<?php
	if(($i+1)%5==0 || $i==mysql_num_rows($r)-1) { echo '</tr>'; }
	$i++;
}

//
// mysql close
//
include 'php/script/mysql/close.php';

?>
</table>
</div>

