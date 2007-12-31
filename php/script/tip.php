<?php

function tip($text)
{
	$iText = 'i';
	$tip  = ' ';
	$tip .= '<span class="tipWindow" style="display:none;">'.$text.'</span>';
	$tip .= '<span class="tipIBtn"';
	$tip .= ' onmouseover="this.className+=\' over\';"';
	$tip .= ' onmouseout="this.className=this.className.replace(/\bover\b/g,\'\');"';
	$tip .= ' onclick="tipToggle(this)">'.$iText.'</span>';
	return $tip;
}

?>