
//////////////////////////////////////////////////////////////////
//
// document onclick
//
//////////////////////////////////////////////////////////////////

documentOnclick = function($ev)
{
	
	//
	// target, handler
	//
	var $target = Event.getTarget($ev);
	var $handler = Event.handler;
	if(!$target || !$handler) { return false; }
	
	//
	// class, nodeName, nodeType
	//
	var $class = $target.className;
	var $tnname = $target.nodeName.toLowerCase();
	var $tntype = $target.nodeType;
	
	//
	// main engine
	//
	
	//
	// model/news
	//
	if($class.match(/\bmodelNewsPointer\b/))
	{
		setTimeout
		(
			function()
			{
				var $x =  Node.getElementByClassName('\\bnewsHead\\b', $target, {'direction':'reverse'}).parentNode;
				var $x = Node.getElementByClassName('\\bnewsBody\\b', $x);
				Spry.Effect.Blind($x, {duration:200, from:'0%', to:'100%', toggle:true, setup:SpryEffectBlindOpenSetupFunc, finish:SpryEffectBlindOpenFinishFunc});
			}
			, 1
		);
	}
	
	//
	// acp/row
	//
	if($m=$class.match(/\bacpRowPointer\[(\w+)\]\[(\w+)\]/))
	{
		setTimeout
		(
			function()
			{
				var $x = ID('acpExtended_'+$m[1]+'_'+$m[2]).firstChild;
				if(!$x.innerHTML)
				{
					XMLHttp.loadNonXML
					(
						'/php/script/AdministratorsControlPanel/extended/'+$m[1]+'.php?id='+$m[2],
						$x,
						'',
						{
							'callback' : function($el)
							{
								Spry.Effect.Blind
								(
									$el.parentNode,
									{
										'duration' : 200,
										'from' : '0%',
										'to' : '100%',
										'toggle' : true,
										'setup' : SpryEffectBlindOpenSetupFunc,
										'finish' : SpryEffectBlindOpenFinishFunc
									}
								);
							}
						}
					);
				}
				else
				{
					Spry.Effect.Blind
					(
						$x.parentNode,
						{
							'duration' : 200,
							'from' : '0%',
							'to' : '100%',
							'toggle' : true,
							'setup' : SpryEffectBlindOpenSetupFunc,
							'finish' : SpryEffectBlindOpenFinishFunc
						}
					);
				}
			}
			, 1
		);
	}
	
}

//////////////////////////////////////////////////////////////////
//
// calendar
//
//////////////////////////////////////////////////////////////////

calendarOnSelect = function($cal)
{
	
	var $date = $cal._toFieldArray($cal.getSelectedDates());
	var $y = $date[0][0];
	var $m = $date[0][1];
	var $d = $date[0][2];
	if ($m<=9) { var $m = '0'+$m; }
	if ($d<=9) { var $d = '0'+$d; }
	
	return [$y,$m,$d];
	
}

//////////////////////////////////////////////////////////////////
//
// SpryEffectBlind funcs
//
//////////////////////////////////////////////////////////////////

SpryEffectBlindOpenSetupFunc = function($el, $ef)
{
	$el.style.width = '';
	$ef.startWidth = $el.offsetWidth;
	$ef.stopWidth = $ef.startWidth;
	if($ef.direction==2)
	{
		$el.style.height = '';
		$ef.stopHeight = $el.offsetHeight;
		$ef.heightRange = -$el.offsetHeight;
	}
}
SpryEffectBlindOpenFinishFunc = function($el, $ef)
{
	if(!$_msie)
	{
		$el.style.width = '';
		$ef.startWidth = $el.offsetWidth;
		$ef.stopWidth = $ef.startWidth;
	}
	if($ef.direction==1)
	{
		$el.style.width = '';
		$ef.startWidth = $el.offsetWidth;
		$ef.stopWidth = $ef.startWidth;
		$el.style.height = '';
		$ef.stopHeight = $el.offsetHeight;
		$ef.heightRange = -$el.offsetHeight;
	}
}

SpryEffectBlindCloseSetupFunc = function($el, $ef)
{
	$el.style.width = '';
	$ef.startWidth = $el.offsetWidth;
	$ef.stopWidth = $ef.startWidth;
}
SpryEffectBlindCloseFinishFunc = function($el, $ef)
{
	$el.style.width = '';
	$ef.startWidth = $el.offsetWidth;
	$ef.stopWidth = $ef.startWidth;
	if($ef.direction==2)
	{
		$el.style.height = '';
	}
}

//////////////////////////////////////////////////////////////////
//
// place func
//
//////////////////////////////////////////////////////////////////

place = function($trigger)
{
	
	try
	{
		
		if(!$trigger) { var $trigger = '*'; }
		
		if(($x=$trigger)=='content' || $x=='*')
		{
			var $c = document.getElementById('content');
			var $h = document.getElementById('head');
			var $f = document.getElementById('foot');
			var $doh = document.documentElement.offsetHeight;
			var $hoh = $h.offsetHeight;
			var $foh = $f.offsetHeight;
			$c.style.height = Math.max($doh-$hoh-$foh,34)+'px';
		}
		
	} // try
	catch($e) { Debuger.output($e); }
	
}

//////////////////////////////////////////////////////////////////
//
// pageScriptManager obj
//
//////////////////////////////////////////////////////////////////

var pageScriptManager = {};

//////////////////////////////////////////////////////////////////
//
// iframe funcs
//
//////////////////////////////////////////////////////////////////

//
// onfocus
//
iframeOnfocus = function($ev, $name)
{
	
	//
	// MultiSelect
	//
	if(MultiSelect)
	{
		for(var $i=0; $i<MultiSelect.instances.length; $i++)
		{
			if(MultiSelect.instances[$i]) { MultiSelect.hideOptions($i); }
		}
	}
	
	var $w = document.getElementById($name+'Iframe').contentWindow;
	var $s = Selection.get($w);
	
	if(!$_msie) { var $t = $s.range.startContainer.parentNode; }
	else if($s.range.parentElement) { var $t = $s.range.parentElement(); }
	
	var $sm = document.getElementById($name+'IframeSelectionMenu');
	
	//
	// menu buttons
	//
	var $b =
	{
		'format' : Node.getElementByClassName('\\bFormat\\b', $sm)
	};
	
	//
	// format MultiSelect
	//
	if($t && $t.nodeName && $t.nodeName.toLowerCase().match(/^h\d+$|^p$/))
	{
		$b['format'].value = $t.nodeName.toLowerCase();
	}
	else
	{
		$b['format'].value = '';
	}
	
}

//
// onkeydown
//
iframeOnkeydown = function($ev, $name)
{
	
	var $w = document.getElementById($name+'Iframe').contentWindow;
	var $target = Event.getTarget($ev, {'window':$w});
	var $keyCode = Event.handler.keyCode;
	if(Event.__KEYS__.toString().indexOf($keyCode)<0) { Event.__KEYS__.push($keyCode); }
	
}

//
// onkeyup
//
iframeOnkeyup = function($ev, $name)
{
	
	Event.__KEYS__ = [];
	
}

//
// create
//
createIframe = function($name)
{
	
	if($div=document.getElementById($name+'IframeForSale'))
	{
		var $text = '<br/>';
		if($div.innerHTML) { var $text = $div.innerHTML; }
		var $n = $div.className;
		var $iframe = Node.create('iframe', 1, {'node':$div, 'insert':'after', 'attrs':{'name':$n}})[0];
		$iframe.id = $name+'Iframe';
		$iframe.style.width = '100%';
		Node.remove($div);
		var $doc = $iframe.contentWindow.document;
		var $Date = new Date();
		var $xhtml =
		'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
			<html xmlns="http://www.w3.org/1999/xhtml">\
			<head>\
			<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
			<link href="/css/index.css?cache='+$Date.getTime()+'" rel="stylesheet" type="text/css" />\
			<link href="/css/iframe.css?cache='+$Date.getTime()+'" rel="stylesheet" type="text/css" />\
			</head>\
			<body>'+$text+'</body>\
			</html>\
		';
		$doc.open();
		$doc.write($xhtml);
		$doc.close();
		if(!$_msie) { $doc.designMode = 'on'; }
		else { $doc.body.contentEditable = true; }
		Spry.Widget.Utils.addEventListener($doc, 'mouseup', function($ev){iframeOnfocus($ev,$name)}, true);
		Spry.Widget.Utils.addEventListener($doc, 'keyup', function($ev){iframeOnfocus($ev,$name)}, true);
		Spry.Widget.Utils.addEventListener($doc, 'keydown', function($ev){iframeOnkeydown($ev,$name)}, true);
		Spry.Widget.Utils.addEventListener($doc, 'keyup', function($ev){iframeOnkeyup($ev,$name)}, true);
		Spry.Widget.Utils.addEventListener($doc, 'click', function($ev){eval($name+'IframeOnclick($ev,$name)')}, true);
		Selection.UNDO.data[Selection.UNDO.count++] = $text;
	}
	
}

//////////////////////////////////////////////////////////////////
//
// AppearFades func
//
//////////////////////////////////////////////////////////////////

AppearFades = function($root, $callback)
{
	
	if(!$root) { var $root = document.body; }
	var $AppearFades = Node.getElementsByClassName('\\bAppearFade\\b', $root);
	this.AppearFadesInstaces = [];
	var $duration = 1000;
	for(var $i=0; $i<$AppearFades.length; $i++)
	{
		this.AppearFadesInstaces[$i] = $AppearFades[$i];
		var $lastTime = 100*$i;
		setTimeout(
		function()
		{
			var $x = window.AppearFadesInstaces.shift();
			Spry.Effect.AppearFade($x, {'duration':$duration, 'from':0, 'to':100});
		},
		100*$i);
	}
	$lastTime += $duration;
	if($callback) { setTimeout($callback, $lastTime); }
	
}

//////////////////////////////////////////////////////////////////
//
// footMenu funcs
//
//////////////////////////////////////////////////////////////////

footMenuToggleSubItem = function($item)
{
	var $subitem = $item.previousSibling.firstChild;
	if($subitem.style.display=='none') { footMenuShowSubItem($item); }
	else { footMenuHideSubItem($item); }
}

footMenuShowSubItem = function($item)
{
	$item.className = $item.className.replace(/\bfootMenuItem\b/, 'footMenuItemAct');
	var $subitem = $item.previousSibling.firstChild;
	$subitem.style.display = 'block';
	$subitem.style.marginLeft = '-1px';
	$subitem.style.marginTop = -$subitem.offsetHeight-2+'px';
}

footMenuHideSubItem = function($item)
{
	$item.className = $item.className.replace(/\bfootMenuItemAct\b/, 'footMenuItem');
	var $subitem = $item.previousSibling.firstChild;
	$subitem.style.display = 'none';
}

//////////////////////////////////////////////////////////////////
//
// tip funcs
//
//////////////////////////////////////////////////////////////////

tipShow = function($iBtn)
{
	$iBtn.className += ' active';
	var $de = document.documentElement;
	var $x = $iBtn.previousSibling;
	$x.style.display = 'inline';
	if(($x.offsetLeft+$x.offsetWidth)>$de.offsetWidth) { $x.style.width = $de.offsetWidth-$x.offsetLeft+'px'; }
	$x.style.marginTop = -$x.offsetHeight+'px';
	if($x.offsetTop<0) { $x.style.marginTop = $iBtn.offsetHeight+'px'; }
}

tipHide = function($iBtn)
{
	$iBtn.className = $iBtn.className.replace(/\bactive\b/g, '');
	var $x = $iBtn.previousSibling;
	$x.style.display = 'none';
}

tipToggle = function($iBtn)
{
	var $x = $iBtn.previousSibling;
	if($x.style.display=='none') { tipShow($iBtn); }
	else { tipHide($iBtn); }
}

//////////////////////////////////////////////////////////////////
//
// ID func
//
//////////////////////////////////////////////////////////////////

ID = function($id) { return document.getElementById($id); }
