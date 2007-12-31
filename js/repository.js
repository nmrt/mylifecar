

var Debuger = {}

Debuger.createWindow = function()
{
	
	/*try
	{*/
		
		var $window = Node.createElements(['div'])[0];
		var $x =  Node.createElements('a')[0];
		$x.id = 'debugerWindowX';
		$x.innerHTML = 'x';
		$x.href = 'javascript:void(null)';
		$x.onclick = function($e)
		{
			var $dw = document.getElementById('debugerWindow');
			if(parseInt($dw.style.bottom)==0)
			{
				$dw.style.bottom = '-450px';
				this.style.bottom = parseInt(this.style.bottom)-$dw.offsetHeight+6+'px';
			}
			else
			{
				$dw.style.bottom = '0px';
				this.style.bottom = $dw.offsetHeight+6+'px';
			}
		}
		
		var $padding = Node.createElements(['div'])[0];
		$padding.className = 'padding';
		$window.id = 'debugerWindow';
		$window.style.width = document.documentElement.clientWidth-12+'px';
		$window.style.bottom = '0px';
		
		if(!$_msie)
		{
			$window.style.position = 'fixed';
			$x.style.position = 'fixed';
			$window.style.opacity = "0.88";
		}
		else
		{
			$window.style.position = 'absolute';
			$x.style.position = 'absolute';
			$window.style.filter = "alpha(opacity=88)";
		}
		
		Node.appendTo(document.body, $x);
		Node.appendTo($window, $padding);
		var $return = Node.appendTo(document.body, $window);
		$x.style.bottom = $return.offsetHeight+6+'px';
		
		//
		// take a look at this
		//
		/*document.documentElement.style.height = document.documentElement.offsetHeight-$return.offsetHeight+'px';
		window.onresize();*/
		
		this.window = $return;
		
		return $return;
		
	/*} // try
	catch($e) { alert($e.message); }*/
	
}


Debuger.output = function($var, $options)
{
	
	/*try
	{*/
		
		if(!$options) { var $options = {}; }
		
		//
		// ENabled or DISabled
		//
		if(!$options.force)
		{
			if(typeof($_SERVER)!='undefined')
			{
				if($_SERVER['HTTP_HOST'])
				{
					if(!$_SERVER['HTTP_HOST'].match(/^127\.0\.0\.1$|^192\.168\./))
					{
						this.disabled = true;
					}
				}
			}
			//
			// NOT because of there are no bugs,
			// but directly opsitive: msie (fucking browser!) debuger is one big BUG!
			//
			//if(navigator.appName=='Microsoft Internet Explorer') { this.disabled = true; }
			if(this.disabled) { return; }
		}
		
		if(typeof($options.replace)!='boolean') { $options.replace = false; }
		if(typeof($options.scrollToEnd)!='boolean') { $options.scrollToEnd = true; }
		if(!document.getElementById('debugerWindow')) { var $window = this.createWindow(); }
		else { var $window = document.getElementById('debugerWindow'); }
		var $window = Node.getElementByClassName('\\bpadding\\b', $window);
		if($options.replace) { $window.innerHTML = ''; }
		
		var $table = Node.createElements(['table'])[0];
		Node.setAttrs({border:'1'});
		Node.setAttrs({cellpadding:'13'});
		Node.setAttrs({cellspacing:'0'});
		var $msie = (navigator.appName=='Microsoft Internet Explorer') ? true : false;
		$table.style.width = (!$msie?100:98)+'%';
		var $tbody = Node.createElements(['tbody'])[0];
		
		if(typeof($var)=='object')
		{
			//
			// prepare props
			//
			this.props = [];
			var $i = 0;
			
			for(var $prop in $var)
			{
				
				//
				// generate props
				//
				var $o = {'..':$var};
				if(typeof($var[$prop])=='object')
				{
					for(var $pp in $var[$prop])
					{ $o[$pp] = $var[$prop][$pp]; }
				}
				else { $o[$prop] = $var[$prop]; }
				this.props.push($o);
				
				var $tr = Node.createElements(['tr'])[0];
				var $tds = Node.createElements(['td'], 2);
				Node.setAttrs({align:'left',valign:'top'});
				$tds[0].width = '1';
				if(typeof($var[$prop])!='undefined')
				{
					$tds[0].innerHTML = '<span\
					style="color:red!important; cursor:pointer!important;"\
					onclick=\
					"\
						Debuger.output(Debuger.props['+$i+'], {scrollToEnd:false, replace:true});\
					"\
					>'+$prop+'</span>';
					$tds[1].innerHTML = '<span style="color:red!important;">'+($var[$prop]||'&nbsp;')+'</span>';
				}
				else
				{
					$tds[0].innerHTML = $prop;
					$tds[1].innerHTML = $var[$prop] || 'undefined';
				}
				Node.appendTo($tr, $tds);
				Node.appendTo($tbody, [$tr]);
				$i++;
			}
		}
		else
		{
			var $tr = Node.createElements(['tr'])[0];
			var $td = Node.createElements(['td'])[0];
			Node.setAttrs({align:'left',valign:'top'});
			$td.innerHTML = $var;
			Node.appendTo($tr, [$td]);
			Node.appendTo($tbody, [$tr]);
		}
		
		Node.appendTo($table, [$tbody])[0];
		$output = Node.appendTo($window, [$table])[0];
		var $hr = Node.createElements('hr')[0];
		var $hr = Node.appendTo($window, $hr);
		Node.setAttrs({color:'#ff0000', noshade:'true', size:'6'});
		var $window = $window.parentNode;
		if($options.scrollToEnd) { $window.scrollTop = $window.scrollHeight; }
		this.data = $output;
		
		return $output;
		
	/*} // try
	catch($e) { alert($e.message); }*/
	
}


var Event = {}
//////////////////////////////////////////////////////////////////
//
// class Event method getTarget
//
//////////////////////////////////////////////////////////////////

Event.getTarget = function($handler, $options)
{
	
	try
	{
		if(!$handler) { var $handler = this.handler; }
		if(!$options) { var $options = {}; }
		if(!$options.window) { $options.window = window; }
		this.handler = $handler || $options.window.event;
		this.target = this.handler.target || this.handler.srcElement;
		return this.target;
	} // try
	catch($e) { Debuger.output($e); }
	
}
Event.submit = function($form, $action, $container, $callback, $_options)
{
	
	/*try
	{*/
		
		if(!$action) { var $action = $form.attributes.getNamedItem('action').value; }
		if($container && typeof($container)=='string') { var $container = document.getElementById($container); }
		if(!$container) { var $container = Node.getElementByClassName('\\bXMLHttpContainer\\b', $form); }
		if(!$_options) { var $_options = {}; }
		
		var $post = [];
		
		//
		// inputs
		//
		var $inputs = $form.getElementsByTagName('input');
		for(var $i=0; $i<$inputs.length; $i++)
		{
			if(($x=$inputs[$i]).name)
			{ $post.push($x.name+'='+$x.value.replace(/&/g, '<amp/>')); }
		}
		
		//
		// select
		//
		var $selects = $form.getElementsByTagName('select');
		for(var $i=0; $i<$selects.length; $i++)
		{
			if(($x=$selects[$i]).name)
			{
				if(!$x.multiple) { $post.push($x.name+'='+$x.value.replace(/&/g, '<amp/>')); }
				else
				{
					$post[$x.name] = [];
					var $opts = $x.getElementsByTagName('option');
					for(var $ii=0; $ii<$opts.length; $ii++)
					{
						var $opt = $opts[$ii];
						if($opt.selected) { $post.push($x.name+'='+$opt.value.replace(/&/g, '<amp/>')); }
					}
				}
			}
		}
		
		//
		// MultiSelect
		//
		var $divs = $form.getElementsByTagName('div');
		for(var $i=0; $i<$divs.length; $i++)
		{
			var $div = $divs[$i];
			if($div.className.match(/\bMultiSelect\b/))
			{
				var $ms = $div;
				if($ms.name)
				{ $post.push($ms.name+'='+$ms.value.replace(/&/g, '<amp/>')); }
			}
		}
		
		//
		// textarea
		//
		var $textareas = $form.getElementsByTagName('textarea');
		for(var $i=0; $i<$textareas.length; $i++)
		{
			if(($x=$textareas[$i]).name)
			{ $post.push($x.name+'='+$x.value.replace(/&/g, '<amp/>')); }
		}
		
		//
		// iframes
		//
		var $iframes = $form.getElementsByTagName('iframe');
		for(var $i=0; $i<$iframes.length; $i++)
		{
			var $iframe = $iframes[$i];
			var $name = $iframe.attributes.getNamedItem('name');
			if($name)
			{
				var $xhtml = $iframe.contentWindow.document.body.innerHTML.replace(/&/g, '<amp/>');
				$post.push($name.value+'='+$xhtml);
			}
		}
		
		$post = $post.join('&');
		$_options['xml'] = false;
		$_options['container'] = $container;
		$_options['postData'] = $post;
		$_options['callback'] = $callback;
		return XMLHttp.load($action, $_options);
		
	/*} // try
	catch($e) { Debuger.output($e); }*/
	
}
//////////////////////////////////////////////////////////////////
//
// class Event method initKeys
//
//////////////////////////////////////////////////////////////////

Event.initKeys = function()
{
	
	try
	{
		//
		// keys
		//
		this.keys = [];
		// controls
		this.keys['controls'] = [];
		this.keys['controls']['enter'] = {key:'Enter', code:13};
		this.keys['controls']['esc'] = {key:'Esc', code:27};
		this.keys['controls']['ctrl'] = {key:'Ctrl', code:17};
		this.keys['controls']['shift'] = {key:'Shift', code:16};
		this.keys['controls']['alt'] = {key:'Alt', code:18};
		this.keys['controls']['tab'] = {key:'Tab', code:9};
		// arrows
		this.keys['controls']['arrowLeft'] = {key:'Стрілка Вліво', code:37};
		this.keys['controls']['arrowTop'] = {key:'Стрілка Вгору', code:38};
		this.keys['controls']['arrowDown'] = {key:'Стрілка Донизу', code:40};
		this.keys['controls']['arrowRight'] = {key:'Стрілка Вправо', code:39};
		// locks
		this.keys['controls']['capsLock'] = {key:'Caps Lock (Блок Регістру)', code:20};
		this.keys['controls']['scrollLock'] = {key:'Scroll Lock (Блок Прокрутки)', code:145};
		this.keys['controls']['numLock'] = {key:'Num Lock (Блок Цифр)', code:144};
		// f1-f12
		this.keys['controls']['f1'] = {key:'F1', code:112};
		this.keys['controls']['f2'] = {key:'F2', code:113};
		this.keys['controls']['f3'] = {key:'F3', code:114};
		this.keys['controls']['f4'] = {key:'F4', code:115};
		this.keys['controls']['f5'] = {key:'F5', code:116};
		this.keys['controls']['f6'] = {key:'F6', code:117};
		this.keys['controls']['f7'] = {key:'F7', code:118};
		this.keys['controls']['f8'] = {key:'F8', code:119};
		this.keys['controls']['f9'] = {key:'F9', code:120};
		this.keys['controls']['f10'] = {key:'F10', code:121};
		this.keys['controls']['f11'] = {key:'F11', code:122};
		this.keys['controls']['f12'] = {key:'F12', code:123};
		// miscellaneous
		this.keys['controls']['insert'] = {key:'Insert (Вставити)', code:45};
		this.keys['controls']['delete'] = {key:'Delete (Видалити)', code:46};
		this.keys['controls']['home'] = {key:'Home', code:36};
		this.keys['controls']['end'] = {key:'End (Кінець)', code:35};
		this.keys['controls']['pageUp'] = {key:'Page Up (Сторінка Вгору)', code:33};
		this.keys['controls']['pageDown'] = {key:'Page Down (Сторінка Вниз)', code:34};
		this.keys['controls']['pause'] = {key:'Pause (Пауза)', code:19};
		this.keys['controls']['backspace'] = {key:'Backspace', code:8};
		// windows
		this.keys['controls']['win'] = {key:'Windows (Функціональна клавіша Windows)', code:91};
		this.keys['controls']['menu'] = {key:'Контекстне Меню', code:93}
		// letters
		this.keys['letters'] = [];
		this.keys['letters']['a'] = {key:'A (Ф)', code:65};
		this.keys['letters']['b'] = {key:'B (И)', code:66};
		this.keys['letters']['c'] = {key:'C (С)', code:67};
		this.keys['letters']['d'] = {key:'D (В)', code:68};
		this.keys['letters']['e'] = {key:'E (У)', code:69};
		this.keys['letters']['f'] = {key:'F (А)', code:70};
		this.keys['letters']['g'] = {key:'G (П)', code:71};
		this.keys['letters']['h'] = {key:'H (Р)', code:72};
		this.keys['letters']['i'] = {key:'I (Ш)', code:73};
		this.keys['letters']['j'] = {key:'J (О)', code:74};
		this.keys['letters']['k'] = {key:'K (Л)', code:75};
		this.keys['letters']['l'] = {key:'L (Д)', code:76};
		this.keys['letters']['m'] = {key:'M (Ь)', code:77};
		this.keys['letters']['n'] = {key:'N (Т)', code:78};
		this.keys['letters']['o'] = {key:'O (Щ)', code:79};
		this.keys['letters']['p'] = {key:'P (З)', code:80};
		this.keys['letters']['q'] = {key:'Q (Й)', code:81};
		this.keys['letters']['r'] = {key:'R (К)', code:82};
		this.keys['letters']['s'] = {key:'S (І)', code:83};
		this.keys['letters']['t'] = {key:'T (Е)', code:84};
		this.keys['letters']['u'] = {key:'U (Г)', code:85};
		this.keys['letters']['v'] = {key:'V (М)', code:86};
		this.keys['letters']['w'] = {key:'W (Ц)', code:87};
		this.keys['letters']['x'] = {key:'X (Ч)', code:88};
		this.keys['letters']['y'] = {key:'Y (Н)', code:89};
		this.keys['letters']['z'] = {key:'Z (Я)', code:90};
	} // try
	catch($e) { Debuger.output($e); }
	
}


var Node = {}
//////////////////////////////////////////////////////////////////
//
// Node.appendTo
//
//////////////////////////////////////////////////////////////////

Node.appendTo = function($parentNode, $currentNodes)
{
	
	try
	{
		if(!$parentNode) { var $parentNode = this.parentNode; }
		if(!$currentNodes) { var $currentNodes = this.currentNodes; }
		if(!$parentNode || !$currentNodes) { return; }
		var $appendedNodes = [];
		if(typeof($currentNodes)=='object' && $currentNodes.constructor==(Array||Object))
		{
			for(var $i in $currentNodes)
			{
				$appendedNodes.push($parentNode.appendChild($currentNodes[$i]));
			}
		}
		else
		{
			$appendedNodes = $parentNode.appendChild($currentNodes);
		}
		this.currentNodes = $appendedNodes;
		this.parentNode = $parentNode;
		
		return $appendedNodes;
	}
	catch($e) { Debuger.output($e); }
	
}

//////////////////////////////////////////////////////////////////
//
// Node.areIdentical
//
//////////////////////////////////////////////////////////////////

Node.areIdentical = function($node1, $node2)
{
	
	/*try
	{*/
		if($node1.nodeType==$node2.nodeType)
		{
			if($node1.nodeName.toLowerCase()==$node2.nodeName.toLowerCase())
			{
				if($node1.nodeValue) { if(!$node2.nodeValue || $node1.nodeValue!=$node2.nodeValue) { return false; } }
				else if($node1.innerHTML) { if(!$node2.innerHTML || $node1.innerHTML!=$node2.innerHTML) { return false; } }
				if($node1.attributes)
				{
					if(!$node2.attributes) { return false; }
					if($node1.attributes.length==$node2.attributes.length)
					{
						var $result = 0;
						for(var $i=0; $i<$node1.attributes.length; $i++)
						{
							if($attr2=$node2.attributes.getNamedItem(($attr1=$node1.attributes[$i]).name))
							{
								if($attr1.nodeValue==$attr2.nodeValue) { $result++; }
							}
						}
						if($result==$node1.attributes.length) { return true; }
					}
				}
				else if(!$node2.attributes) { return true; }
			}
		}
		return false;
	/*} // try
	catch($e) { Debuger.output($e); }*/
	
}

//////////////////////////////////////////////////////////////////
//
// Node.create
//
//////////////////////////////////////////////////////////////////

var create = function($currentNodes, $count, $options)
{
	
	try
	{
		if(!$currentNodes) { var $currentNodes = this.currentNodes; }
		if(!$count) { $count = 1; }
		if(!$options) { var $options = {}; }
		if(!$options.window) { $options.window = window; }
		var $node = $options.parentNode || $options.node;
		var $xhtml = $options.innerHTML || $options.xhtml;
		if(!$options.insert) { $options.insert = 'append'; }
		var $createdNodes = [];
		for(var $i=0; $i<$count; $i++)
		{
			if($currentNodes.push)
			{
				for(var $ii in $currentNodes)
				{
					$createdNodes.push($options.window.document.createElement($currentNodes[$ii]));
				}
			}
			else { $createdNodes.push($options.window.document.createElement($currentNodes)); }
		}
		this.currentNodes = $createdNodes;
		if($node) { this.insert(this.currentNodes, $node, $options.insert); }
		if($options.attrs) { this.setAttrs($options.attrs); }
		if(!this.currentNodes.push) { this.currentNodes = [this.currentNodes]; }
		if($xhtml)
		{
			for(var $i in this.currentNodes)
			{
				if(typeof($xhtml)=='string') { this.currentNodes[$i].innerHTML = $xhtml; }
				if(typeof($xhtml)=='object') { this.insert($xhtml, this.currentNodes[$i]); }
			}
		}
		if(!this.currentNodes.push) { this.currentNodes = [this.currentNodes]; }
		return this.currentNodes;
	}
	catch($e) { Debuger.output($e); }
	
}
Node.createElements = create;
Node.create = create;

//////////////////////////////////////////////////////////////////
//
// Node.createDiv
//
//////////////////////////////////////////////////////////////////

Node.createDiv = function($options)
{
	
	/*try
	{*/
		var $this = this;
		if(!$options) { var $options = {}; }
		var $node = $options.parentNode || $options.node;
		var $xhtml = $options.innerHTML || $options.xhtml;
		var $div = this.createElements('div', 1, $options)[0];
		if(!$options.insert) { $options.insert = 'append'; }
		if($node) { var $div = this.insert($div, $node, $options.insert); }
		if($options.attrs) { this.setAttrs($options.attrs); }
		if($xhtml)
		{
			if(typeof($xhtml)=='string') { $div.innerHTML += $xhtml; }
			if(typeof($xhtml)=='object') { this.insert($xhtml, $div); }
		}
		this.currentNodes = $div;
		return $div;
	/*} // try
	catch($e) { Debuger.output($e); }*/
	
}

//////////////////////////////////////////////////////////////////
//
// Node.createIframe
//
//////////////////////////////////////////////////////////////////

Node.createIframe = function($options)
{
	
	try
	{
		if(!$options) { $options = {}; }
		var $node = $options.parentNode || $options.node;
		var $xhtml = $options.innerHTML || $options.xhtml;
		if(!$xhtml) { $xhtml = ''; }
		if(typeof($options.editable)!='boolean') { $options.editable = true; }
		if(typeof($options.events)!='boolean') { $options.events = true; }
		var $iframe = this.createElements('iframe')[0];
		if($node) { var $iframe = this.insert($iframe, $node, $options.insert); }
		if($options.attrs) { this.setAttrs($options.attrs); }
		var $window = $iframe.contentWindow;
		var $document = $window.document;
		var $Date = new Date();
		var $innerHTML = $xhtml;
		$document.open();
		$document.write($innerHTML);
		$document.close();
		var $body = $document.body;
		if($_browser!='Netscape')
		{ if($options.editable) { $body.contentEditable = true; } }
		if($options.editable) { $document.designMode = 'on'; }
		if($options.events)
		{
			if($document.addEventListener)
			{
				$document.addEventListener('mouseover', Event.onMouseOver, true);
				$document.addEventListener('mouseout', Event.onMouseOut, true);
				$document.addEventListener('focus', Event.onFocus, true);
				$document.addEventListener('blur', Event.onBlur, true);
				$document.addEventListener('click', Event.onClick, true);
				$document.addEventListener('click', Event.iframeOnClick, true);
				$document.addEventListener('keydown', Event.onKeyDown, true);
				$document.addEventListener('keyup', Event.onKeyUp, true);
				$document.addEventListener('keyup', Event.iframeOnKeyUp, true);
			}
			else if($document.attachEvent)
			{
				$document.attachEvent('onmouseover', Event.onMouseOver);
				$document.attachEvent('onmouseout', Event.onMouseOut);
				$document.attachEvent('onfocus', Event.onFocus);
				$document.attachEvent('onblur', Event.onBlur);
				$document.attachEvent('onclick', Event.onClick);
				$document.attachEvent('onclick', Event.iframeOnClick);
				$document.attachEvent('onkeydown', Event.onKeyDown);
				$document.attachEvent('onkeyup', Event.onKeyUp);
				$document.attachEvent('onkeyup', Event.iframeOnKeyUp);
			}
		}
		return $iframe;
	} // try
	catch($e) { Debuger.output($e); }
	
}

//////////////////////////////////////////////////////////////////
//
// Node.createTable
//
//////////////////////////////////////////////////////////////////

Node.createTable = function($options)
{
	
	try
	{
		var $this = this;
		if(!$options) { var $options = {}; }
		var $node = $options.parentNode || $options.node;
		if(!$options.attrs) { $options.attrs = {}; }
		if(!$options.attrs.border) { $options.attrs.border = 0; }
		if(!$options.attrs.cellpadding) { $options.attrs.cellpadding = 0; }
		if(!$options.attrs.cellspacing) { $options.attrs.cellspacing = 0; }
		var $table = this.createElements('table')[0];
		if($node) { var $table = this.insert($table, $node, $options.insert); }
		$this.setAttrs($options.attrs);
		var $tbody = $this.createElements('tbody')[0];
		var $tbody = $this.appendTo($table, $tbody);
		for(var $trN in $options.trs)
		{
			var $tr = $this.createElements('tr')[0];
			var $tr = $this.appendTo($tbody, $tr);
			for(var $tdN in $options.trs[$trN])
			{
				var $td = $this.createElements('td', 1, {parentNode:$tr})[0];
				if(typeof($x=$options.trs[$trN][$tdN])=='string') { $td.innerHTML = $x; }
				if(typeof($x)=='object')
				{
					if($x.attrs) { this.setAttrs($x.attrs); }
					if($x.node)
					{
						if(typeof($x.node)=='string') { $td.innerHTML = $x.node; }
						if(typeof($x.node)=='object')
						{
							if($x.node.push)
							{
								for(var $i in $x.node)
								{ this.insert($x.node[$i], $td); }
							}
							else { this.insert($x.node, $td); }
						}
					}
				}
			}
		}
		this.currentNodes = $table;
		return $table;
	} // try
	catch($e) { Debuger.output($e); }
	
}

//////////////////////////////////////////////////////////////////
//
// Node.getElementByClassName
//
//////////////////////////////////////////////////////////////////

Node.getElementByClassName = function($className, $node, $options)
{
	
	try
	{
		if (!$node) { var $node = document; }
		if (!$options) { var $options = {}; }
		var $attrs = {};
		$attrs['class'] = $className;
		$options['first'] = true;
		var $return = this.getElementsByAttrs($attrs, $node, $options);
		return $return;
	} // try
	catch($e) { Debuger.output($e); }
	
}

//////////////////////////////////////////////////////////////////
//
// Node.getElementsByAttrs
//
//////////////////////////////////////////////////////////////////

Node.getElementsByAttrs = function($attrs, $node, $options)
{
	
	try
	{
		var $this = this;
		if (!$node) { var $node = document; }
		if (!$options) { var $options = {}; }
		if (!$options.nodeName) { $options.nodeName = '*'; }
		if (typeof($options.clearCashe)!='boolean') { $options.clearCashe = true; }
		if (typeof($options.noDuplicate)!='boolean') { $options.noDuplicate = true; }
		if (!$options.direction) { $options.direction = 'normal'; }
		var $useString = $options.useString || $options.string;
		if($options.clearCashe)
		{
			if(!$options.first) { this.stack = []; }
			else { this.stack = null; }
			$options.clearCashe = false;
		}
		var check = function($attrs, $node, $options)
		{
			if ($node.nodeType==1)
			{
				for(var $attr in $attrs)
				{
					if ($$attr=$node.attributes.getNamedItem($attr))
					{
						if($useString || $options.strict)
						{
							if(!$options.strict) { var $result = $$attr.value.indexOf($attrs[$attr])>=0; }
							else { var $result = $$attr.nodeValue==$attrs[$attr]; }
						}
						else
						{
							var $REoptions = ($x=$options.REoptions) ? $x : '';
							var $RE = new RegExp($attrs[$attr], $REoptions);
							var $result = $$attr.value.match($RE);
						}
						if ($result && ($node.nodeName.toLowerCase()==$options.nodeName.toLowerCase()||$options.nodeName=='*'))
						{
							if($options.noDuplicate)
							{
								if($options.first) { return($this.stack=$node); }
								if($this.stack.length==0) { $this.stack.push($node); }
								var $result=0; for(var $i in $this.stack)
								{
									if(!$this.areIdentical($this.stack[$i], $node)) { $result++; }
								}
								if($result==$this.stack.length) { $this.stack.push($node); }
							}
							else { $this.stack.push($node); }
						}
					}
				}
			}
		}
		if($options.direction=='revers') { $options.direction = 'reverse'; }
		switch($options.direction)
		{
			case 'normal':
				var $childNodes = $node.childNodes;
				for (var $i=0; $i<$childNodes.length; $i++)
				{
					check($attrs, $childNodes[$i], $options);
					if($options.first)
					{ if(this.stack) { return (this.currentNodes=this.stack); } }
					this.getElementsByAttrs($attrs, $childNodes[$i], $options);
				}
				break;
			case 'reverse':
				var $parentNode = $node;
				while($parentNode=$parentNode.parentNode)
				{
					var $childNode = $parentNode.firstChild;
					while($childNode)
					{
						check($attrs, $childNode, $options);
						if($options.first)
						{ if(this.stack) { return (this.currentNodes=this.stack); } }
						if($childNode.hasChildNodes())
						{
							$options.direction = 'normal';
							this.getElementsByAttrs($attrs, $childNode, $options);
						}
						var $childNode = $childNode.nextSibling;
					}
				}
				break;
		}
		return (this.currentNodes=this.stack);
	}
	catch($e) { Debuger.output($e); }
	
}

//////////////////////////////////////////////////////////////////
//
// Node.getElementsByClassName
//
//////////////////////////////////////////////////////////////////

Node.getElementsByClassName = function($className, $node, $options)
{
	
	try
	{
		if (!$node) { var $node = document; }
		if (!$options) { var $options = {}; }
		var $attrs = {};
		var $return = [];
		if($className.constructor==(Array||Object))
		{
			for(var $i in $className)
			{
				$attrs['class'] = $className[$i];
				$return.push(this.getElementsByAttrs($attrs, $node, $options));
			}
		}
		else if(typeof($className)=='string')
		{
			$attrs['class'] = $className;
			var $return = this.getElementsByAttrs($attrs, $node, $options);
		}
		return $return;
	} // try
	catch($e) { Debuger.output($e); }
	
}

//////////////////////////////////////////////////////////////////
//
// Node.getElementByName
//
//////////////////////////////////////////////////////////////////

Node.getElementByName = function($name, $node, $options)
{
	
	try
	{
		if (!$node) { var $node = document; }
		if(!$options) { var $options = {}; }
		$options.strict = true;
		$options.first = true;
		return this.getElementsByAttrs({name:$name}, $node, $options);
	} // try
	catch($e) { Debuger.output($e); }
	
}

//////////////////////////////////////////////////////////////////
//
// Node.insert
//
//////////////////////////////////////////////////////////////////

Node.insert = function($nodes1, $node2, $type)
{
	
	try
	{
		if(!$nodes1.push) { var $nodes1 = [$nodes1]; }
		if(!$type) { var $type = 'append'; }
		var $return = [];
		for(var $i in $nodes1)
		{
			switch($type)
			{
				case 'append':
					$return.push(this.appendTo($node2, $nodes1[$i]));
					break;
				case 'before':
					$return.push($node2.parentNode.insertBefore($nodes1[$i], $node2));
					break;
				case 'after':
					if($node2.nextSibling)
					{ $return.push($node2.parentNode.insertBefore($nodes1[$i], $node2.nextSibling)); }
					else { $return.push(this.appendTo($node2.parentNode, $nodes1[$i])); }
					break;
			}
		}
		if($return.length==1) { var $return = $return[0]; }
		this.currentNodes = $return;
		return $return;
	} // try
	catch($e) { Debuger.output($e); }
	
}

//////////////////////////////////////////////////////////////////
//
// Node.isDisabled
//
//////////////////////////////////////////////////////////////////

Node.isDisabled = function($elORid)
{
	
	try
	{
		if(typeof($elORid)=='string') { var $elORid = document.getElementById($elORid); }
		if(!$elORid) { return null; }
		if($elORid.nodeType==1)
		{
			if($elORid.className.match(/\bdisabled\b/)) { return true; }
			else { return false; }
		}
		else { return null; }
	}
	catch($e) { Debuger.output($e); }
	
}

//////////////////////////////////////////////////////////////////
//
// Node.isParentOf
//
//////////////////////////////////////////////////////////////////

Node.isParentOf = function($n1, $n2)
{
	
	/*try
	{*/
		while($n2=$n2.parentNode)
		{ if(this.areIdentical($n2, $n1)) { return true; } }
		return false;
	/*}
	catch($e) { Debuger.output($e); }*/
	
}

//////////////////////////////////////////////////////////////////
//
// Node.remove
//
//////////////////////////////////////////////////////////////////

Node.remove = function($nodes)
{
	
	try
	{
		if(!$nodes) { return false; }
		if(!$nodes.push) { var $nodes = [$nodes]; }
		var $return = [];
		for(var $i in $nodes)
		{
			$return.push($nodes[$i].parentNode.removeChild($nodes[$i]));
		}
		if($return.length==1) { var $return = $return[0]; }
		this.currentNodes = $return;
		return $return;
	} // try
	catch($e) { Debuger.output($e); }
	
}

//////////////////////////////////////////////////////////////////
//
// Node.setAttrs
//
//////////////////////////////////////////////////////////////////

Node.setAttrs = function($attrs, $currentNodes, $options)
{
	
	/*try
	{*/
		if(!$attrs) { var $attrs = this.attrs; }
		if(!$currentNodes) { var $currentNodes = this.currentNodes; }
		if(!$options) { var $options = {}; }
		if(!$options.window) { $options.window = window; }
		if(typeof($currentNodes)=='object' && $currentNodes.constructor==(Array||Object))
		{
			for(var $i in $currentNodes)
			{
				for(var $prop in $attrs)
				{
					var $attr = $options.window.document.createAttribute($prop);
					$attr.value = $attrs[$prop];
					$currentNodes[$i].attributes.setNamedItem($attr);
				}
			}
		}
		else
		{
			for(var $prop in $attrs)
			{
				var $attr = $options.window.document.createAttribute($prop);
				$attr.value = $attrs[$prop];
				$currentNodes.attributes.setNamedItem($attr);
			}
		}
	/*} // try
	catch($e) { Debuger.output($e); }*/
	
}

//////////////////////////////////////////////////////////////////
//
// Node.removeAttrs
//
//////////////////////////////////////////////////////////////////

Node.removeAttrs = function($attrs, $currentNodes)
{
	
	try
	{
		if(!$attrs) { var $attrs = this.attrs; }
		if(!$currentNodes) { var $currentNodes = this.currentNodes; }
		if(!$attrs || !$currentNodes) { return; }
		if($currentNodes.push)
		{
			for(var $i=0; $i<$currentNodes.length; $i++)
			{
				if($attrs.push)
				{
					for(var $ii=0; $ii<$attrs.length; $ii++)
					{
						if($currentNodes[$i].attributes.getNamedItem($attrs[$ii])) { $currentNodes[$i].attributes.removeNamedItem($attrs[$ii]); }
					}
				}
				else
				{
					if($currentNodes[$i].attributes.getNamedItem($attrs)) { $currentNodes[$i].attributes.removeNamedItem($attrs); }
				}
			}
		}
		else
		{
			if($attrs.push)
			{
				for(var $i=0; $i<$attrs.length; $i++)
				{
					if($currentNodes.attributes.getNamedItem($attrs[$i])) { $currentNodes.attributes.removeNamedItem($attrs[$i]); }
				}
			}
			else
			{
				if($currentNodes.attributes.getNamedItem($attrs)) { $currentNodes.attributes.removeNamedItem($attrs); }
			}
		}
	} // try
	catch($e) { Debuger.output($e); }
	
}

//////////////////////////////////////////////////////////////////
//
// Node.disable
//
//////////////////////////////////////////////////////////////////

var disable = function($elORid)
{
	
	try
	{
		if(typeof($elORid)=='string') { var $elORid = document.getElementById($elORid); }
		if($elORid) { $elORid.className += ' disabled'; return $elORid; }
		else { return false; }
	}
	catch($e) { Debuger.output($e); }
	
}
Node.disable = disable;
Node.disableElement = disable;

//////////////////////////////////////////////////////////////////
//
// Node.enable
//
//////////////////////////////////////////////////////////////////

var enable = function($elORid)
{
	
	try
	{
		if(typeof($elORid)=='string') { var $elORid = document.getElementById($elORid); }
		if($elORid) { $elORid.className = $elORid.className.replace(/\bdisabled\b/g, ''); return $elORid; }
		else { return false; }
	}
	catch($e) { Debuger.output($e); }
	
}
Node.enable = enable;
Node.enableElement = enable;

//////////////////////////////////////////////////////////////////
//
// Node.createText
//
//////////////////////////////////////////////////////////////////

Node.createText = function($options)
{
	
	try
	{
		if(typeof($options)!='object') { var $options = {}; }
		if(typeof($options.nodeValue)!='string') { $options.nodeValue = ''; }
		$value = $options.value || $options.nodeValue;
		var $insert = 'append';
		if(!$options.insertType)
		{ if($options.insert) { var $insert = $options.insert; } }
		else { var $insert = $options.insertType; }
		var $textNode = document.createTextNode($value);
		if($options.node)
		{
			if($insert.match(/append/i)) { var $textNode = this.appendTo($options.node, $textNode); }
			if($insert.match(/before/i)) { var $textNode = $options.node.parentNode.insertBefore($textNode, $options.node); }
			if($insert.match(/after/i))
			{
				if($options.node.nextSibling) { var $textNode = $options.node.parentNode.insertBefore($textNode, $options.node.nextSibling); }
				else { var $textNode = this.appendTo($options.node.parentNode, $textNode); }
			}
		}
		this.currentNodes = $textNode;
		return $textNode;
	} // try
	catch($e) { Debuger.output($e); }
	
}

//////////////////////////////////////////////////////////////////
//
// Node.createInput
//
//////////////////////////////////////////////////////////////////

Node.createInput = function($type, $options)
{
	
	try
	{
		if(!$type) { $type = 'text'; }
		if(!$options) { var $options = {}; }
		if(!$options.node) { $options.node = document.body; }
		if(!$options.attrs) { $options.attrs = {}; }
		if(!$options.name) { $options.name = ''; }
		if(!$options.value) { $options.value = ''; }
		if(!$options.insert) { $options.insert = 'append'; }
		$options.attrs['type'] = $type;
		$options.attrs['name'] = $options.name;
		$options.attrs['value'] = $options.value;
		var $input = this.createElements('input', 1, {attrs:$options.attrs})[0];
		var $input = this.insert($input, $options.node, $options.insert);
		this.currentNodes = $input;
		return $input;
	} // try
	catch($e) { Debuger.output($e); }
	
}


var Selection =
{
	'UNDO' :
	{
		'max' : 20,
		'data' : [],
		'count' : 0
	}
}

Selection.format = function($window, $command, $attrs, $type, $replace)
{
	
	try
	{
		
		this.get($window);
		
		if($type=='exec') { $window.document.execCommand($command, false, $attrs); }
		
		else if($type=='format')
		{
			
			//
			// browser: NOT msie
			//
			if(!$_msie)
			{
				if(!this._format($window, $command))
				{
					var $newNode = Node.create($command, 1, {'attrs':$attrs, 'window':$window})[0];
					this.range.surroundContents($newNode);
					this.selection.removeAllRanges();
					this.range.selectNodeContents($newNode);
					this.range.collapse(false);
					this.selection.addRange(this.range);
				}
			}
			
			//
			// browser: msie
			//
			else
			{
				if(!this._format($window, $command))
				{
					var $strAttrs = '';
					for(var $k in $attrs)
					{ $strAttrs += ' '+$k+'="'+$attrs[$k]+'"' }
					if(!$replace) { this.range.pasteHTML('<'+$command+$strAttrs+'>'+this.range.htmlText+'</'+$command+'>'); }
					else
					{
						this.deleteContents($window);
						this.range.pasteHTML('<'+$command+$strAttrs+' />');
					}
				}
			}
			
		}
		
	} // try
	catch($e) { Debuger.output($e); }
	
}



Selection._format = function($window, $command)
{
	
	try
	{
		
		if(!$command) { $command = ''; }
		
		this.get($window);
		
		//
		// browser: NOT msie
		//
		if(!$_msie)
		{
			
			//
			// determine: format or not
			//
			var $format = true;
			var $sc = this.range.startContainer;
			var $ec = this.range.endContainer;
			if($sc.parentNode.nodeName.toLowerCase()==$command.toLowerCase())
			{
				if($sc.parentNode==$ec.parentNode)
				{
					$format = false;
				}
			}
			
			//
			// _format
			//
			if(!$format)
			{
				var $d = this.range.startContainer.parentNode;
				var $x = this.range.createContextualFragment($d.innerHTML);
				Node.insert($x, $d, 'before');
				Node.remove($d);
				return true;
			}
			
			//
			// format
			//
			else { return false; }
		}
		
		//
		// browser: msie
		//
		else
		{
			
			//
			// determine: format or not
			//
			var $format = true;
			var $pe = this.range.parentElement();
			if($pe.nodeName.toLowerCase()==$command.toLowerCase())
			{
				$format = false;
			}
			
			//
			// _format
			//
			if(!$format)
			{
				for(var $i=0; $i<$pe.childNodes.length; $i++)
				{
					var $x = $pe.childNodes[$i];
					Node.insert($x, $pe, 'before');
				}
				Node.remove($pe);
				return true;
			}
			
			//
			// format
			//
			else { return false; }
			
		}
		
	} // try
	catch($e) { Debuger.output($e); }
	
}



Selection.get = function($window)
{
	
	try
	{
		
		$window.focus();
		
		if(!$_msie)
		{
			this.selection = $window.getSelection();
			var $b = $window.document.body;
			if(!this.selection.rangeCount) { this.make($window, '', {sc:$b, ec:$b, so:0, eo:0}); }
			this.range = this.selection.getRangeAt(0);
		}
		
		else
		{
			this.selection = $window.document.selection;
			this.range = this.selection.createRange();
			//this.mark = this.getOptions().mark;
		}
		
		return {'selection':this.selection, 'range':this.range};
		
	} // try
	catch($e) { Debuger.output($e); }
	
}



Selection.make = function($window, $type, $opts)
{
	
	try
	{
		
		$window.focus();
		
		if(!$_msie)
		{
			this.selection = $window.getSelection();
			this.selection.removeAllRanges();
			this.range = $window.document.createRange();
			switch($type)
			{
				default:
					this.range.setStart($opts.sc, $opts.so);
					this.range.setEnd($opts.ec, $opts.eo);
					break;
				case 'beforeAfter':
					this.range.setStartBefore($opts.sc);
					this.range.setEndAfter($opts.ec);
					break;
				case 'before':
					this.range.setStartBefore($opts.sc);
					this.range.setEndBefore($opts.ec);
				case 'after':
					this.range.setStartAfter($opts.sc);
					this.range.setEndAfter($opts.ec);
					break;
			}
			this.selection.addRange(this.range);
		}
		
		else
		{
			this.range.moveToBookmark($opts.mark);
			this.range.select();
		}
		
		return {'selection':this.selection, 'range':this.range};
		
	} // try
	catch($e) { Debuger.output($e); }
	
}



Selection.save = function($window)
{
	
	try
	{
		
		this.get($window);
		
		var $return =
		{
			's' : this.selection,
			'r' : this.range
		}
		
		if($_msie)
		{
			$return.mark = this.range.getBookmark();
		}
		
		return $return;
		
	} // try
	catch($e) { Debuger.output($e); }
	
}



Selection.codeView = function($window)
{
	
	try
	{
		
		//
		// disable controls
		//
		var $sm = Node.getElementByClassName('\\bSelectionMenu\\b', $window.frameElement, {'direction':'reverse'});
		var $imgs = $sm.getElementsByTagName('img');
		for(var $i=0; $i<$imgs.length; $i++)
		{ if(!$imgs[$i].className.match(/\bcode\b|\btext\b/)) { Node.disable($imgs[$i]); } }
		var $selects = $sm.getElementsByTagName('select');
		for(var $i=0; $i<$selects.length; $i++)
		{ $selects[$i].disabled = true; }
		var $divs = $sm.getElementsByTagName('div');
		for(var $i=0; $i<$divs.length; $i++)
		{
			var $div = $divs[$i];
			if($div.className.match(/\bMultiSelect\b/))
			{
				Node.disable($div);
				$div.getElementsByTagName('input')[0].disabled = true;
			}
		}
		
		//
		// code view
		//
		var $body = $window.document.body;
		var $html = $body.innerHTML;
		$body.innerHTML = '';
		if(!$_msie) { Node.createText({'value':$html, 'node':$body}); }
		else { $body.innerText = $html; }
		$body.style.fontFamily = 'monospace';
		$body.style.fontSize = '12px';
		
	} // try
	catch($e) { Debuger.output($e); }
	
}



Selection.textView = function($window)
{
	
	try
	{
		
		//
		// enable controls
		//
		var $sm = Node.getElementByClassName('\\bSelectionMenu\\b', $window.frameElement, {'direction':'reverse'});
		var $imgs = $sm.getElementsByTagName('img');
		for(var $i=0; $i<$imgs.length; $i++)
		{ if(!$imgs[$i].className.match(/\bcode\b|\btext\b/)) { Node.enable($imgs[$i]); } }
		var $selects = $sm.getElementsByTagName('select');
		for(var $i=0; $i<$selects.length; $i++)
		{ $selects[$i].disabled = false; }
		var $divs = $sm.getElementsByTagName('div');
		for(var $i=0; $i<$divs.length; $i++)
		{
			var $div = $divs[$i];
			if($div.className.match(/\bMultiSelect\b/))
			{
				Node.enable($div);
				$div.getElementsByTagName('input')[0].disabled = false;
			}
		}
		
		//
		// text view
		//
		var $body = $window.document.body;
		if(!$_msie)
		{
			var $html = '';
			for(var $i=0; $i<$body.childNodes.length; $i++)
			{
				$html += ($x=$body.childNodes[$i]).nodeValue || $x.innerHTML;
				//Node.remove($x);
			}
		}
		else { var $html = $body.innerText; }
		$body.innerHTML = $html;
		$body.style.fontFamily = '';
		$body.style.fontSize = '';
		
	} // try
	catch($e) { Debuger.output($e); }
	
}



Selection.deleteContents = function($window)
{
	
	try
	{
		
		this.get($window);
		
		if(!$_msie) { this.range.deleteContents(); }
		else { this.selection.clear(); }
		
	} // try
	catch($e) { Debuger.output($e); }
	
}



Selection.saveUndo = function($window)
{
	
	if(this.UNDO.count>this.UNDO.max)
	{
		this.UNDO.data.shift();
		this.UNDO.count--;
	}
	setTimeout(function()
	{
		Selection.UNDO.data[Selection.UNDO.count++] = $window.document.body.innerHTML;
	}
	, 1);
	
}

Selection.clearUndo = function()
{
	
	this.UNDO.data = [];
	this.UNDO.count = 0;
	
}


Selection.undo = function($window)
{
	
	if(this.UNDO.count>1)
	{
		var $xhtml = this.UNDO.data[(--this.UNDO.count)-1];
		$window.document.body.innerHTML = $xhtml;
	}
	
}

Selection.redo = function($window)
{
	
	if(this.UNDO.count<this.UNDO.data.length)
	{
		var $xhtml = this.UNDO.data[this.UNDO.count++];
		$window.document.body.innerHTML = $xhtml;
	}
	
}/* xpath.js - Revision: Spry Preview Release 1.4 */

// Copyright (c) 2005, Google Inc.
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//         
//  * Redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer.
// 
//  * Redistributions in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in the
//    documentation and/or other materials provided with the
//    distribution.
// 
//  * Neither the name of Google Inc. nor the names of its contributors
//    may be used to endorse or promote products derived from this
//    software without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// An XPath parser and evaluator written in JavaScript. The
// implementation is complete except for functions handling
// namespaces.
//
// Reference: [XPATH] XPath Specification
// <http://www.w3.org/TR/1999/REC-xpath-19991116>.
//
//
// The API of the parser has several parts:
//
// 1. The parser function xpathParse() that takes a string and returns
// an expession object.
//
// 2. The expression object that has an evaluate() method to evaluate the
// XPath expression it represents. (It is actually a hierarchy of
// objects that resembles the parse tree, but an application will call
// evaluate() only on the top node of this hierarchy.)
//
// 3. The context object that is passed as an argument to the evaluate()
// method, which represents the DOM context in which the expression is
// evaluated.
//
// 4. The value object that is returned from evaluate() and represents
// values of the different types that are defined by XPath (number,
// string, boolean, and node-set), and allows to convert between them.
//
// These parts are near the top of the file, the functions and data
// that are used internally follow after them.
//
//
// TODO(mesch): add jsdoc comments. Use more coherent naming.
//
//
// Author: Steffen Meschkat <mesch@google.com>


// The entry point for the parser.
//
// @param expr a string that contains an XPath expression.
// @return an expression object that can be evaluated with an
// expression context.

function xpathParse(expr) {
  if (xpathdebug) {
    Log.write('XPath parse ' + expr);
  }
  xpathParseInit();

  var cached = xpathCacheLookup(expr);
  if (cached) {
    if (xpathdebug) {
      Log.write(' ... cached');
    }
    return cached;
  }

  // Optimize for a few common cases: simple attribute node tests
  // (@id), simple element node tests (page), variable references
  // ($address), numbers (4), multi-step path expressions where each
  // step is a plain element node test
  // (page/overlay/locations/location).
  
  if (expr.match(/^(\$|@)?\w+$/i)) {
    var ret = makeSimpleExpr(expr);
    xpathParseCache[expr] = ret;
    if (xpathdebug) {
      Log.write(' ... simple');
    }
    return ret;
  }

  if (expr.match(/^\w+(\/\w+)*$/i)) {
    var ret = makeSimpleExpr2(expr);
    xpathParseCache[expr] = ret;
    if (xpathdebug) {
      Log.write(' ... simple 2');
    }
    return ret;
  }

  var cachekey = expr; // expr is modified during parse
  if (xpathdebug) {
    Timer.start('XPath parse', cachekey);
  }

  var stack = [];
  var ahead = null;
  var previous = null;
  var done = false;

  var parse_count = 0;
  var lexer_count = 0;
  var reduce_count = 0;
  
  while (!done) {
    parse_count++;
    expr = expr.replace(/^\s*/, '');
    previous = ahead;
    ahead = null;

    var rule = null;
    var match = '';
    for (var i = 0; i < xpathTokenRules.length; ++i) {
      var result = xpathTokenRules[i].re.exec(expr);
      lexer_count++;
      if (result && result.length > 0 && result[0].length > match.length) {
        rule = xpathTokenRules[i];
        match = result[0];
        break;
      }
    }

    // Special case: allow operator keywords to be element and
    // variable names.

    // NOTE(mesch): The parser resolves conflicts by looking ahead,
    // and this is the only case where we look back to
    // disambiguate. So this is indeed something different, and
    // looking back is usually done in the lexer (via states in the
    // general case, called "start conditions" in flex(1)). Also,the
    // conflict resolution in the parser is not as robust as it could
    // be, so I'd like to keep as much off the parser as possible (all
    // these precedence values should be computed from the grammar
    // rules and possibly associativity declarations, as in bison(1),
    // and not explicitly set.

    if (rule &&
        (rule == TOK_DIV || 
         rule == TOK_MOD ||
         rule == TOK_AND || 
         rule == TOK_OR) &&
        (!previous || 
         previous.tag == TOK_AT || 
         previous.tag == TOK_DSLASH || 
         previous.tag == TOK_SLASH ||
         previous.tag == TOK_AXIS || 
         previous.tag == TOK_DOLLAR)) {
      rule = TOK_QNAME;
    }

    if (rule) {
      expr = expr.substr(match.length);
      if (xpathdebug) {
        Log.write('token: ' + match + ' -- ' + rule.label);
      }
      ahead = {
        tag: rule,
        match: match,
        prec: rule.prec ?  rule.prec : 0, // || 0 is removed by the compiler
        expr: makeTokenExpr(match)
      };

    } else {
      if (xpathdebug) {
        Log.write('DONE');
      }
      done = true;
    }

    while (xpathReduce(stack, ahead)) {
      reduce_count++;
      if (xpathdebug) {
        Log.write('stack: ' + stackToString(stack));
      }
    }
  }

  if (xpathdebug) {
    Log.write(stackToString(stack));
  }

  if (stack.length != 1) {
    throw 'XPath parse error ' + cachekey + ':\n' + stackToString(stack);
  }

  var result = stack[0].expr;
  xpathParseCache[cachekey] = result;

  if (xpathdebug) {
    Timer.end('XPath parse', cachekey);
  }

  if (xpathdebug) {
    Log.write('XPath parse: ' + parse_count + ' / ' + 
              lexer_count + ' / ' + reduce_count);
  }

  return result;
}

var xpathParseCache = {};

function xpathCacheLookup(expr) {
  return xpathParseCache[expr];
}

function xpathReduce(stack, ahead) {
  var cand = null;

  if (stack.length > 0) {
    var top = stack[stack.length-1];
    var ruleset = xpathRules[top.tag.key];

    if (ruleset) {
      for (var i = 0; i < ruleset.length; ++i) {
        var rule = ruleset[i];
        var match = xpathMatchStack(stack, rule[1]);
        if (match.length) {
          cand = {
            tag: rule[0],
            rule: rule,
            match: match
          };
          cand.prec = xpathGrammarPrecedence(cand);
          break;
        }
      }
    }
  }

  var ret;
  if (cand && (!ahead || cand.prec > ahead.prec || 
               (ahead.tag.left && cand.prec >= ahead.prec))) {
    for (var i = 0; i < cand.match.matchlength; ++i) {
      stack.pop();
    }

    if (xpathdebug) {
      Log.write('reduce ' + cand.tag.label + ' ' + cand.prec +
                ' ahead ' + (ahead ? ahead.tag.label + ' ' + ahead.prec + 
                             (ahead.tag.left ? ' left' : '')
                             : ' none '));
    }

    var matchexpr = mapExpr(cand.match, function(m) { return m.expr; });
    cand.expr = cand.rule[3].apply(null, matchexpr);

    stack.push(cand);
    ret = true;

  } else {
    if (ahead) {
      if (xpathdebug) {
        Log.write('shift ' + ahead.tag.label + ' ' + ahead.prec + 
                  (ahead.tag.left ? ' left' : '') +
                  ' over ' + (cand ? cand.tag.label + ' ' + 
                              cand.prec : ' none'));
      }
      stack.push(ahead);
    }
    ret = false;
  }
  return ret;
}

function xpathMatchStack(stack, pattern) {

  // NOTE(mesch): The stack matches for variable cardinality are
  // greedy but don't do backtracking. This would be an issue only
  // with rules of the form A* A, i.e. with an element with variable
  // cardinality followed by the same element. Since that doesn't
  // occur in the grammar at hand, all matches on the stack are
  // unambiguous.

  var S = stack.length;
  var P = pattern.length;
  var p, s;
  var match = [];
  match.matchlength = 0;
  var ds = 0;
  for (p = P - 1, s = S - 1; p >= 0 && s >= 0; --p, s -= ds) {
    ds = 0;
    var qmatch = [];
    if (pattern[p] == Q_MM) {
      p -= 1;
      match.push(qmatch);
      while (s - ds >= 0 && stack[s - ds].tag == pattern[p]) {
        qmatch.push(stack[s - ds]);
        ds += 1;
        match.matchlength += 1;
      }

    } else if (pattern[p] == Q_01) {
      p -= 1;
      match.push(qmatch);
      while (s - ds >= 0 && ds < 2 && stack[s - ds].tag == pattern[p]) {
        qmatch.push(stack[s - ds]);
        ds += 1;
        match.matchlength += 1;
      }

    } else if (pattern[p] == Q_1M) {
      p -= 1;
      match.push(qmatch);
      if (stack[s].tag == pattern[p]) {
        while (s - ds >= 0 && stack[s - ds].tag == pattern[p]) {
          qmatch.push(stack[s - ds]);
          ds += 1;
          match.matchlength += 1;
        }
      } else {
        return [];
      }

    } else if (stack[s].tag == pattern[p]) {
      match.push(stack[s]);
      ds += 1;
      match.matchlength += 1;

    } else {
      return [];
    }

    reverseInplace(qmatch);
    qmatch.expr = mapExpr(qmatch, function(m) { return m.expr; });
  }

  reverseInplace(match);

  if (p == -1) {
    return match;

  } else {
    return [];
  }
}

function xpathTokenPrecedence(tag) {
  return tag.prec || 2;
}

function xpathGrammarPrecedence(frame) {
  var ret = 0;

  if (frame.rule) { /* normal reduce */
    if (frame.rule.length >= 3 && frame.rule[2] >= 0) {
      ret = frame.rule[2];

    } else {
      for (var i = 0; i < frame.rule[1].length; ++i) {
        var p = xpathTokenPrecedence(frame.rule[1][i]);
        ret = Math.max(ret, p);
      }
    }
  } else if (frame.tag) { /* TOKEN match */
    ret = xpathTokenPrecedence(frame.tag);

  } else if (frame.length) { /* Q_ match */
    for (var j = 0; j < frame.length; ++j) {
      var p = xpathGrammarPrecedence(frame[j]);
      ret = Math.max(ret, p);
    }
  }

  return ret;
}

function stackToString(stack) {
  var ret = '';
  for (var i = 0; i < stack.length; ++i) {
    if (ret) {
      ret += '\n';
    }
    ret += stack[i].tag.label;
  }
  return ret;
}


// XPath expression evaluation context. An XPath context consists of a
// DOM node, a list of DOM nodes that contains this node, a number
// that represents the position of the single node in the list, and a
// current set of variable bindings. (See XPath spec.)
//
// The interface of the expression context:
//
//   Constructor -- gets the node, its position, the node set it
//   belongs to, and a parent context as arguments. The parent context
//   is used to implement scoping rules for variables: if a variable
//   is not found in the current context, it is looked for in the
//   parent context, recursively. Except for node, all arguments have
//   default values: default position is 0, default node set is the
//   set that contains only the node, and the default parent is null.
//
//     Notice that position starts at 0 at the outside interface;
//     inside XPath expressions this shows up as position()=1.
//
//   clone() -- creates a new context with the current context as
//   parent. If passed as argument to clone(), the new context has a
//   different node, position, or node set. What is not passed is
//   inherited from the cloned context.
//
//   setVariable(name, expr) -- binds given XPath expression to the
//   name.
//
//   getVariable(name) -- what the name says.
//
//   setNode(node, position) -- sets the context to the new node and
//   its corresponding position. Needed to implement scoping rules for
//   variables in XPath. (A variable is visible to all subsequent
//   siblings, not only to its children.)

function ExprContext(node, position, nodelist, parent) {
  this.node = node;
  this.position = position || 0;
  this.nodelist = nodelist || [ node ];
  this.variables = {};
  this.parent = parent || null;
  this.root = parent ? parent.root : node.ownerDocument;
}

ExprContext.prototype.clone = function(node, position, nodelist) {
  return new
  ExprContext(node || this.node,
              typeof position != 'undefined' ? position : this.position,
              nodelist || this.nodelist, this);
};

ExprContext.prototype.setVariable = function(name, value) {
  this.variables[name] = value;
};

ExprContext.prototype.getVariable = function(name) {
  if (typeof this.variables[name] != 'undefined') {
    return this.variables[name];

  } else if (this.parent) {
    return this.parent.getVariable(name);

  } else {
    return null;
  }
}

ExprContext.prototype.setNode = function(node, position) {
  this.node = node;
  this.position = position;
}


// XPath expression values. They are what XPath expressions evaluate
// to. Strangely, the different value types are not specified in the
// XPath syntax, but only in the semantics, so they don't show up as
// nonterminals in the grammar. Yet, some expressions are required to
// evaluate to particular types, and not every type can be coerced
// into every other type. Although the types of XPath values are
// similar to the types present in JavaScript, the type coercion rules
// are a bit peculiar, so we explicitly model XPath types instead of
// mapping them onto JavaScript types. (See XPath spec.)
//
// The four types are:
//
//   StringValue
//
//   NumberValue
//
//   BooleanValue
//
//   NodeSetValue
//
// The common interface of the value classes consists of methods that
// implement the XPath type coercion rules:
//
//   stringValue() -- returns the value as a JavaScript String,
//
//   numberValue() -- returns the value as a JavaScript Number,
//
//   booleanValue() -- returns the value as a JavaScript Boolean,
//
//   nodeSetValue() -- returns the value as a JavaScript Array of DOM
//   Node objects.
//

function StringValue(value) {
  this.value = value;
  this.type = 'string';
}

StringValue.prototype.stringValue = function() {
  return this.value;
}

StringValue.prototype.booleanValue = function() {
  return this.value.length > 0;
}

StringValue.prototype.numberValue = function() {
  return this.value - 0;
}

StringValue.prototype.nodeSetValue = function() {
  throw this + ' ' + Error().stack;
}

function BooleanValue(value) {
  this.value = value;
  this.type = 'boolean';
}

BooleanValue.prototype.stringValue = function() {
  return '' + this.value;
}

BooleanValue.prototype.booleanValue = function() {
  return this.value;
}

BooleanValue.prototype.numberValue = function() {
  return this.value ? 1 : 0;
}

BooleanValue.prototype.nodeSetValue = function() {
  throw this + ' ' + Error().stack;
}

function NumberValue(value) {
  this.value = value;
  this.type = 'number';
}

NumberValue.prototype.stringValue = function() {
  return '' + this.value;
}

NumberValue.prototype.booleanValue = function() {
  return !!this.value;
}

NumberValue.prototype.numberValue = function() {
  return this.value - 0;
}

NumberValue.prototype.nodeSetValue = function() {
  throw this + ' ' + Error().stack;
}

function NodeSetValue(value) {
  this.value = value;
  this.type = 'node-set';
}

NodeSetValue.prototype.stringValue = function() {
  if (this.value.length == 0) {
    return '';
  } else {
    return xmlValue(this.value[0]);
  }
}

NodeSetValue.prototype.booleanValue = function() {
  return this.value.length > 0;
}

NodeSetValue.prototype.numberValue = function() {
  return this.stringValue() - 0;
}

NodeSetValue.prototype.nodeSetValue = function() {
  return this.value;
};

// XPath expressions. They are used as nodes in the parse tree and
// possess an evaluate() method to compute an XPath value given an XPath
// context. Expressions are returned from the parser. Teh set of
// expression classes closely mirrors the set of non terminal symbols
// in the grammar. Every non trivial nonterminal symbol has a
// corresponding expression class.
//
// The common expression interface consists of the following methods:
//
// evaluate(context) -- evaluates the expression, returns a value.
//
// toString() -- returns the XPath text representation of the
// expression (defined in xsltdebug.js).
//
// parseTree(indent) -- returns a parse tree representation of the
// expression (defined in xsltdebug.js).

function TokenExpr(m) {
  this.value = m;
}

TokenExpr.prototype.evaluate = function() {
  return new StringValue(this.value);
};

function LocationExpr() {
  this.absolute = false;
  this.steps = [];
}

LocationExpr.prototype.appendStep = function(s) {
  this.steps.push(s);
}

LocationExpr.prototype.prependStep = function(s) {
  var steps0 = this.steps;
  this.steps = [ s ];
  for (var i = 0; i < steps0.length; ++i) {
    this.steps.push(steps0[i]);
  }
};

LocationExpr.prototype.evaluate = function(ctx) {
  var start;
  if (this.absolute) {
    start = ctx.root;

  } else {
    start = ctx.node;
  }

  var nodes = [];
  xPathStep(nodes, this.steps, 0, start, ctx);
  return new NodeSetValue(nodes);
};

function xPathStep(nodes, steps, step, input, ctx) {
  var s = steps[step];
  var ctx2 = ctx.clone(input);
  var nodelist = s.evaluate(ctx2).nodeSetValue();

  for (var i = 0; i < nodelist.length; ++i) {
    if (step == steps.length - 1) {
      nodes.push(nodelist[i]);
    } else {
      xPathStep(nodes, steps, step + 1, nodelist[i], ctx);
    }
  }
}

function StepExpr(axis, nodetest, predicate) {
  this.axis = axis;
  this.nodetest = nodetest;
  this.predicate = predicate || [];
}

StepExpr.prototype.appendPredicate = function(p) {
  this.predicate.push(p);
}

StepExpr.prototype.evaluate = function(ctx) {
  var input = ctx.node;
  var nodelist = [];

  // NOTE(mesch): When this was a switch() statement, it didn't work
  // in Safari/2.0. Not sure why though; it resulted in the JavaScript
  // console output "undefined" (without any line number or so).

  if (this.axis ==  xpathAxis.ANCESTOR_OR_SELF) {
    nodelist.push(input);
    for (var n = input.parentNode; n; n = input.parentNode) {
      nodelist.push(n);
    }

  } else if (this.axis == xpathAxis.ANCESTOR) {
    for (var n = input.parentNode; n; n = input.parentNode) {
      nodelist.push(n);
    }

  } else if (this.axis == xpathAxis.ATTRIBUTE) {
    copyArray(nodelist, input.attributes);

  } else if (this.axis == xpathAxis.CHILD) {
    copyArray(nodelist, input.childNodes);

  } else if (this.axis == xpathAxis.DESCENDANT_OR_SELF) {
    nodelist.push(input);
    xpathCollectDescendants(nodelist, input);

  } else if (this.axis == xpathAxis.DESCENDANT) {
    xpathCollectDescendants(nodelist, input);

  } else if (this.axis == xpathAxis.FOLLOWING) {
    for (var n = input.parentNode; n; n = n.parentNode) {
      for (var nn = n.nextSibling; nn; nn = nn.nextSibling) {
        nodelist.push(nn);
        xpathCollectDescendants(nodelist, nn);
      }
    }

  } else if (this.axis == xpathAxis.FOLLOWING_SIBLING) {
    for (var n = input.nextSibling; n; n = input.nextSibling) {
      nodelist.push(n);
    }

  } else if (this.axis == xpathAxis.NAMESPACE) {
    alert('not implemented: axis namespace');

  } else if (this.axis == xpathAxis.PARENT) {
    if (input.parentNode) {
      nodelist.push(input.parentNode);
    }

  } else if (this.axis == xpathAxis.PRECEDING) {
    for (var n = input.parentNode; n; n = n.parentNode) {
      for (var nn = n.previousSibling; nn; nn = nn.previousSibling) {
        nodelist.push(nn);
        xpathCollectDescendantsReverse(nodelist, nn);
      }
    }

  } else if (this.axis == xpathAxis.PRECEDING_SIBLING) {
    for (var n = input.previousSibling; n; n = input.previousSibling) {
      nodelist.push(n);
    }

  } else if (this.axis == xpathAxis.SELF) {
    nodelist.push(input);

  } else {
    throw 'ERROR -- NO SUCH AXIS: ' + this.axis;
  }

  // process node test
  var nodelist0 = nodelist;
  nodelist = [];
  for (var i = 0; i < nodelist0.length; ++i) {
    var n = nodelist0[i];
    if (this.nodetest.evaluate(ctx.clone(n, i, nodelist0)).booleanValue()) {
      nodelist.push(n);
    }
  }

  // process predicates
  for (var i = 0; i < this.predicate.length; ++i) {
    var nodelist0 = nodelist;
    nodelist = [];
    for (var ii = 0; ii < nodelist0.length; ++ii) {
      var n = nodelist0[ii];
      if (this.predicate[i].evaluate(ctx.clone(n, ii, nodelist0)).booleanValue()) {
        nodelist.push(n);
      }
    }
  }

  return new NodeSetValue(nodelist);
};

function NodeTestAny() {
  this.value = new BooleanValue(true);
}

NodeTestAny.prototype.evaluate = function(ctx) {
  return this.value;
};

function NodeTestElement() {}

NodeTestElement.prototype.evaluate = function(ctx) {
  return new BooleanValue(ctx.node.nodeType == DOM_ELEMENT_NODE);
}

function NodeTestText() {}

NodeTestText.prototype.evaluate = function(ctx) {
  return new BooleanValue(ctx.node.nodeType == DOM_TEXT_NODE);
}

function NodeTestComment() {}

NodeTestComment.prototype.evaluate = function(ctx) {
  return new BooleanValue(ctx.node.nodeType == DOM_COMMENT_NODE);
}

function NodeTestPI(target) {
  this.target = target;
}

NodeTestPI.prototype.evaluate = function(ctx) {
  return new
  BooleanValue(ctx.node.nodeType == DOM_PROCESSING_INSTRUCTION_NODE &&
               (!this.target || ctx.node.nodeName == this.target));
}

function NodeTestNC(nsprefix) {
  this.regex = new RegExp("^" + nsprefix + ":");
  this.nsprefix = nsprefix;
}

NodeTestNC.prototype.evaluate = function(ctx) {
  var n = ctx.node;
  return new BooleanValue(this.regex.match(n.nodeName));
}

function NodeTestName(name) {
  this.name = name;
}

NodeTestName.prototype.evaluate = function(ctx) {
  var n = ctx.node;
  return new BooleanValue(n.nodeName == this.name);
}

function PredicateExpr(expr) {
  this.expr = expr;
}

PredicateExpr.prototype.evaluate = function(ctx) {
  var v = this.expr.evaluate(ctx);
  if (v.type == 'number') {
    // NOTE(mesch): Internally, position is represented starting with
    // 0, however in XPath position starts with 1. See functions
    // position() and last().
    return new BooleanValue(ctx.position == v.numberValue() - 1);
  } else {
    return new BooleanValue(v.booleanValue());
  }
};

function FunctionCallExpr(name) {
  this.name = name;
  this.args = [];
}

FunctionCallExpr.prototype.appendArg = function(arg) {
  this.args.push(arg);
};

FunctionCallExpr.prototype.evaluate = function(ctx) {
  var fn = '' + this.name.value;
  var f = this.xpathfunctions[fn];
  if (f) {
    return f.call(this, ctx);
  } else {
    Log.write('XPath NO SUCH FUNCTION ' + fn);
    return new BooleanValue(false);
  }
};

FunctionCallExpr.prototype.xpathfunctions = {
  'last': function(ctx) {
    assert(this.args.length == 0);
    // NOTE(mesch): XPath position starts at 1.
    return new NumberValue(ctx.nodelist.length);
  },

  'position': function(ctx) {
    assert(this.args.length == 0);
    // NOTE(mesch): XPath position starts at 1.
    return new NumberValue(ctx.position + 1);
  },

  'count': function(ctx) {
    assert(this.args.length == 1);
    var v = this.args[0].evaluate(ctx);
    return new NumberValue(v.nodeSetValue().length);
  },

  'id': function(ctx) {
    assert(this.args.length == 1);
    var e = this.args.evaluate(ctx);
    var ret = [];
    var ids;
    if (e.type == 'node-set') {
      ids = [];
      for (var i = 0; i < e.length; ++i) {
        var v = xmlValue(e[i]).split(/\s+/);
        for (var ii = 0; ii < v.length; ++ii) {
          ids.push(v[ii]);
        }
      }
    } else {
      ids = e.split(/\s+/);
    }
    var d = ctx.node.ownerDocument;
    for (var i = 0; i < ids.length; ++i) {
      var n = d.getElementById(ids[i]);
      if (n) {
        ret.push(n);
      }
    }
    return new NodeSetValue(ret);
  },

  'local-name': function(ctx) {
    alert('not implmented yet: XPath function local-name()');
  },

  'namespace-uri': function(ctx) {
    alert('not implmented yet: XPath function namespace-uri()');
  },

  'name': function(ctx) {
    assert(this.args.length == 1 || this.args.length == 0);
    var n;
    if (this.args.length == 0) {
      n = [ ctx.node ];
    } else {
      n = this.args[0].evaluate(ctx).nodeSetValue();
    }

    if (n.length == 0) {
      return new StringValue('');
    } else {
      return new StringValue(n[0].nodeName);
    }
  },

  'string':  function(ctx) {
    assert(this.args.length == 1 || this.args.length == 0);
    if (this.args.length == 0) {
      return new StringValue(new NodeSetValue([ ctx.node ]).stringValue());
    } else {
      return new StringValue(this.args[0].evaluate(ctx).stringValue());
    }
  },

  'concat': function(ctx) {
    var ret = '';
    for (var i = 0; i < this.args.length; ++i) {
      ret += this.args[i].evaluate(ctx).stringValue();
    }
    return new StringValue(ret);
  },

  'starts-with': function(ctx) {
    assert(this.args.length == 2);
    var s0 = this.args[0].evaluate(ctx).stringValue();
    var s1 = this.args[1].evaluate(ctx).stringValue();
    return new BooleanValue(s0.indexOf(s1) == 0);
  },

  'contains': function(ctx) {
    assert(this.args.length == 2);
    var s0 = this.args[0].evaluate(ctx).stringValue();
    var s1 = this.args[1].evaluate(ctx).stringValue();
    return new BooleanValue(s0.indexOf(s1) != -1);
  },

  'substring-before': function(ctx) {
    assert(this.args.length == 2);
    var s0 = this.args[0].evaluate(ctx).stringValue();
    var s1 = this.args[1].evaluate(ctx).stringValue();
    var i = s0.indexOf(s1);
    var ret;
    if (i == -1) {
      ret = '';
    } else {
      ret = s0.substr(0,i);
    }
    return new StringValue(ret);
  },

  'substring-after': function(ctx) {
    assert(this.args.length == 2);
    var s0 = this.args[0].evaluate(ctx).stringValue();
    var s1 = this.args[1].evaluate(ctx).stringValue();
    var i = s0.indexOf(s1);
    var ret;
    if (i == -1) {
      ret = '';
    } else {
      ret = s0.substr(i + s1.length);
    }
    return new StringValue(ret);
  },

  'substring': function(ctx) {
    // NOTE: XPath defines the position of the first character in a
    // string to be 1, in JavaScript this is 0 ([XPATH] Section 4.2).
    assert(this.args.length == 2 || this.args.length == 3);
    var s0 = this.args[0].evaluate(ctx).stringValue();
    var s1 = this.args[1].evaluate(ctx).numberValue();
    var ret;
    if (this.args.length == 2) {
      var i1 = Math.max(0, Math.round(s1) - 1);
      ret = s0.substr(i1);

    } else {
      var s2 = this.args[2].evaluate(ctx).numberValue();
      var i0 = Math.round(s1) - 1;
      var i1 = Math.max(0, i0);
      var i2 = Math.round(s2) - Math.max(0, -i0);
      ret = s0.substr(i1, i2);
    }
    return new StringValue(ret);
  },

  'string-length': function(ctx) {
    var s;
    if (this.args.length > 0) {
      s = this.args[0].evaluate(ctx).stringValue();
    } else {
      s = new NodeSetValue([ ctx.node ]).stringValue();
    }
    return new NumberValue(s.length);
  },

  'normalize-space': function(ctx) {
    var s;
    if (this.args.length > 0) {
      s = this.args[0].evaluate(ctx).stringValue();
    } else {
      s = new NodeSetValue([ ctx.node ]).stringValue();
    }
    s = s.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s+/g, ' ');
    return new StringValue(s);
  },

  'translate': function(ctx) {
    assert(this.args.length == 3);
    var s0 = this.args[0].evaluate(ctx).stringValue();
    var s1 = this.args[1].evaluate(ctx).stringValue();
    var s2 = this.args[2].evaluate(ctx).stringValue();

    for (var i = 0; i < s1.length; ++i) {
      s0 = s0.replace(new RegExp(s1.charAt(i), 'g'), s2.charAt(i));
    }
    return new StringValue(s0);
  },

  'boolean': function(ctx) {
    assert(this.args.length == 1);
    return new BooleanValue(this.args[0].evaluate(ctx).booleanValue());
  },

  'not': function(ctx) {
    assert(this.args.length == 1);
    var ret = !this.args[0].evaluate(ctx).booleanValue();
    return new BooleanValue(ret);
  },

  'true': function(ctx) {
    assert(this.args.length == 0);
    return new BooleanValue(true);
  },

  'false': function(ctx) {
    assert(this.args.length == 0);
    return new BooleanValue(false);
  },

  'lang': function(ctx) {
    assert(this.args.length == 1);
    var lang = this.args[0].evaluate(ctx).stringValue();
    var xmllang;
    var n = ctx.node;
    while (n && n != n.parentNode /* just in case ... */) {
      xmllang = n.getAttribute('xml:lang');
      if (xmllang) {
        break;
      }
      n = n.parentNode;
    }
    if (!xmllang) {
      return new BooleanValue(false);
    } else {
      var re = new RegExp('^' + lang + '$', 'i');
      return new BooleanValue(xmllang.match(re) ||
                              xmllang.replace(/_.*$/,'').match(re));
    }
  },

  'number': function(ctx) {
    assert(this.args.length == 1 || this.args.length == 0);

    if (this.args.length == 1) {
      return new NumberValue(this.args[0].evaluate(ctx).numberValue());
    } else {
      return new NumberValue(new NodeSetValue([ ctx.node ]).numberValue());
    }
  },

  'sum': function(ctx) {
    assert(this.args.length == 1);
    var n = this.args[0].evaluate(ctx).nodeSetValue();
    var sum = 0;
    for (var i = 0; i < n.length; ++i) {
      sum += xmlValue(n[i]) - 0;
    }
    return new NumberValue(sum);
  },

  'floor': function(ctx) {
    assert(this.args.length == 1);
    var num = this.args[0].evaluate(ctx).numberValue();
    return new NumberValue(Math.floor(num));
  },

  'ceiling': function(ctx) {
    assert(this.args.length == 1);
    var num = this.args[0].evaluate(ctx).numberValue();
    return new NumberValue(Math.ceil(num));
  },

  'round': function(ctx) {
    assert(this.args.length == 1);
    var num = this.args[0].evaluate(ctx).numberValue();
    return new NumberValue(Math.round(num));
  },

  // TODO(mesch): The following functions are custom. There is a
  // standard that defines how to add functions, which should be
  // applied here.

  'ext-join': function(ctx) {
    assert(this.args.length == 2);
    var nodes = this.args[0].evaluate(ctx).nodeSetValue();
    var delim = this.args[1].evaluate(ctx).stringValue();
    var ret = '';
    for (var i = 0; i < nodes.length; ++i) {
      if (ret) {
        ret += delim;
      }
      ret += xmlValue(nodes[i]);
    }
    return new StringValue(ret);
  },

  // ext-if() evaluates and returns its second argument, if the
  // boolean value of its first argument is true, otherwise it
  // evaluates and returns its third argument.

  'ext-if': function(ctx) {
    assert(this.args.length == 3);
    if (this.args[0].evaluate(ctx).booleanValue()) {
      return this.args[1].evaluate(ctx);
    } else {
      return this.args[2].evaluate(ctx);
    }
  },

  'ext-sprintf': function(ctx) {
    assert(this.args.length >= 1);
    var args = [];
    for (var i = 0; i < this.args.length; ++i) {
      args.push(this.args[i].evaluate(ctx).stringValue());
    }
    return new StringValue(sprintf.apply(null, args));
  },

  // ext-cardinal() evaluates its single argument as a number, and
  // returns the current node that many times. It can be used in the
  // select attribute to iterate over an integer range.
  
  'ext-cardinal': function(ctx) {
    assert(this.args.length >= 1);
    var c = this.args[0].evaluate(ctx).numberValue();
    var ret = [];
    for (var i = 0; i < c; ++i) {
      ret.push(ctx.node);
    }
    return new NodeSetValue(ret);
  }
};

function UnionExpr(expr1, expr2) {
  this.expr1 = expr1;
  this.expr2 = expr2;
}

UnionExpr.prototype.evaluate = function(ctx) {
  var nodes1 = this.expr1.evaluate(ctx).nodeSetValue();
  var nodes2 = this.expr2.evaluate(ctx).nodeSetValue();
  var I1 = nodes1.length;
  for (var i2 = 0; i2 < nodes2.length; ++i2) {
    for (var i1 = 0; i1 < I1; ++i1) {
      if (nodes1[i1] == nodes2[i2]) {
        // break inner loop and continue outer loop, labels confuse
        // the js compiler, so we don't use them here.
        i1 = I1;
      }
    }
    nodes1.push(nodes2[i2]);
  }
  return new NodeSetValue(nodes2);
};

function PathExpr(filter, rel) {
  this.filter = filter;
  this.rel = rel;
}

PathExpr.prototype.evaluate = function(ctx) {
  var nodes = this.filter.evaluate(ctx).nodeSetValue();
  var nodes1 = [];
  for (var i = 0; i < nodes.length; ++i) {
    var nodes0 = this.rel.evaluate(ctx.clone(nodes[i], i, nodes)).nodeSetValue();
    for (var ii = 0; ii < nodes0.length; ++ii) {
      nodes1.push(nodes0[ii]);
    }
  }
  return new NodeSetValue(nodes1);
};

function FilterExpr(expr, predicate) {
  this.expr = expr;
  this.predicate = predicate;
}

FilterExpr.prototype.evaluate = function(ctx) {
  var nodes = this.expr.evaluate(ctx).nodeSetValue();
  for (var i = 0; i < this.predicate.length; ++i) {
    var nodes0 = nodes;
    nodes = [];
    for (var j = 0; j < nodes0.length; ++j) {
      var n = nodes0[j];
      if (this.predicate[i].evaluate(ctx.clone(n, j, nodes0)).booleanValue()) {
        nodes.push(n);
      }
    }
  }

  return new NodeSetValue(nodes);
}

function UnaryMinusExpr(expr) {
  this.expr = expr;
}

UnaryMinusExpr.prototype.evaluate = function(ctx) {
  return new NumberValue(-this.expr.evaluate(ctx).numberValue());
};

function BinaryExpr(expr1, op, expr2) {
  this.expr1 = expr1;
  this.expr2 = expr2;
  this.op = op;
}

BinaryExpr.prototype.evaluate = function(ctx) {
  var ret;
  switch (this.op.value) {
    case 'or':
      ret = new BooleanValue(this.expr1.evaluate(ctx).booleanValue() ||
                             this.expr2.evaluate(ctx).booleanValue());
      break;

    case 'and':
      ret = new BooleanValue(this.expr1.evaluate(ctx).booleanValue() &&
                             this.expr2.evaluate(ctx).booleanValue());
      break;

    case '+':
      ret = new NumberValue(this.expr1.evaluate(ctx).numberValue() +
                            this.expr2.evaluate(ctx).numberValue());
      break;

    case '-':
      ret = new NumberValue(this.expr1.evaluate(ctx).numberValue() -
                            this.expr2.evaluate(ctx).numberValue());
      break;

    case '*':
      ret = new NumberValue(this.expr1.evaluate(ctx).numberValue() *
                            this.expr2.evaluate(ctx).numberValue());
      break;

    case 'mod':
      ret = new NumberValue(this.expr1.evaluate(ctx).numberValue() %
                            this.expr2.evaluate(ctx).numberValue());
      break;

    case 'div':
      ret = new NumberValue(this.expr1.evaluate(ctx).numberValue() /
                            this.expr2.evaluate(ctx).numberValue());
      break;

    case '=':
      ret = this.compare(ctx, function(x1, x2) { return x1 == x2; });
      break;

    case '!=':
      ret = this.compare(ctx, function(x1, x2) { return x1 != x2; });
      break;

    case '<':
      ret = this.compare(ctx, function(x1, x2) { return x1 < x2; });
      break;

    case '<=':
      ret = this.compare(ctx, function(x1, x2) { return x1 <= x2; });
      break;

    case '>':
      ret = this.compare(ctx, function(x1, x2) { return x1 > x2; });
      break;

    case '>=':
      ret = this.compare(ctx, function(x1, x2) { return x1 >= x2; });
      break;

    default:
      alert('BinaryExpr.evaluate: ' + this.op.value);
  }
  return ret;
};

BinaryExpr.prototype.compare = function(ctx, cmp) {
  var v1 = this.expr1.evaluate(ctx);
  var v2 = this.expr2.evaluate(ctx);

  var ret;
  if (v1.type == 'node-set' && v2.type == 'node-set') {
    var n1 = v1.nodeSetValue();
    var n2 = v2.nodeSetValue();
    ret = false;
    for (var i1 = 0; i1 < n1.length; ++i1) {
      for (var i2 = 0; i2 < n2.length; ++i2) {
        if (cmp(xmlValue(n1[i1]), xmlValue(n2[i2]))) {
          ret = true;
          // Break outer loop. Labels confuse the jscompiler and we
          // don't use them.
          i2 = n2.length;
          i1 = n1.length;
        }
      }
    }

  } else if (v1.type == 'node-set' || v2.type == 'node-set') {

    if (v1.type == 'number') {
      var s = v1.numberValue();
      var n = v2.nodeSetValue();

      ret = false;
      for (var i = 0;  i < n.length; ++i) {
        var nn = xmlValue(n[i]) - 0;
        if (cmp(s, nn)) {
          ret = true;
          break;
        }
      }

    } else if (v2.type == 'number') {
      var n = v1.nodeSetValue();
      var s = v2.numberValue();

      ret = false;
      for (var i = 0;  i < n.length; ++i) {
        var nn = xmlValue(n[i]) - 0;
        if (cmp(nn, s)) {
          ret = true;
          break;
        }
      }

    } else if (v1.type == 'string') {
      var s = v1.stringValue();
      var n = v2.nodeSetValue();

      ret = false;
      for (var i = 0;  i < n.length; ++i) {
        var nn = xmlValue(n[i]);
        if (cmp(s, nn)) {
          ret = true;
          break;
        }
      }

    } else if (v2.type == 'string') {
      var n = v1.nodeSetValue();
      var s = v2.stringValue();

      ret = false;
      for (var i = 0;  i < n.length; ++i) {
        var nn = xmlValue(n[i]);
        if (cmp(nn, s)) {
          ret = true;
          break;
        }
      }

    } else {
      ret = cmp(v1.booleanValue(), v2.booleanValue());
    }

  } else if (v1.type == 'boolean' || v2.type == 'boolean') {
    ret = cmp(v1.booleanValue(), v2.booleanValue());

  } else if (v1.type == 'number' || v2.type == 'number') {
    ret = cmp(v1.numberValue(), v2.numberValue());

  } else {
    ret = cmp(v1.stringValue(), v2.stringValue());
  }

  return new BooleanValue(ret);
}

function LiteralExpr(value) {
  this.value = value;
}

LiteralExpr.prototype.evaluate = function(ctx) {
  return new StringValue(this.value);
};

function NumberExpr(value) {
  this.value = value;
}

NumberExpr.prototype.evaluate = function(ctx) {
  return new NumberValue(this.value);
};

function VariableExpr(name) {
  this.name = name;
}

VariableExpr.prototype.evaluate = function(ctx) {
  return ctx.getVariable(this.name);
}

// Factory functions for semantic values (i.e. Expressions) of the
// productions in the grammar. When a production is matched to reduce
// the current parse state stack, the function is called with the
// semantic values of the matched elements as arguments, and returns
// another semantic value. The semantic value is a node of the parse
// tree, an expression object with an evaluate() method that evaluates the
// expression in an actual context. These factory functions are used
// in the specification of the grammar rules, below.

function makeTokenExpr(m) {
  return new TokenExpr(m);
}

function passExpr(e) {
  return e;
}

function makeLocationExpr1(slash, rel) {
  rel.absolute = true;
  return rel;
}

function makeLocationExpr2(dslash, rel) {
  rel.absolute = true;
  rel.prependStep(makeAbbrevStep(dslash.value));
  return rel;
}

function makeLocationExpr3(slash) {
  var ret = new LocationExpr();
  ret.appendStep(makeAbbrevStep('.'));
  ret.absolute = true;
  return ret;
}

function makeLocationExpr4(dslash) {
  var ret = new LocationExpr();
  ret.absolute = true;
  ret.appendStep(makeAbbrevStep(dslash.value));
  return ret;
}

function makeLocationExpr5(step) {
  var ret = new LocationExpr();
  ret.appendStep(step);
  return ret;
}

function makeLocationExpr6(rel, slash, step) {
  rel.appendStep(step);
  return rel;
}

function makeLocationExpr7(rel, dslash, step) {
  rel.appendStep(makeAbbrevStep(dslash.value));
  return rel;
}

function makeStepExpr1(dot) {
  return makeAbbrevStep(dot.value);
}

function makeStepExpr2(ddot) {
  return makeAbbrevStep(ddot.value);
}

function makeStepExpr3(axisname, axis, nodetest) {
  return new StepExpr(axisname.value, nodetest);
}

function makeStepExpr4(at, nodetest) {
  return new StepExpr('attribute', nodetest);
}

function makeStepExpr5(nodetest) {
  return new StepExpr('child', nodetest);
}

function makeStepExpr6(step, predicate) {
  step.appendPredicate(predicate);
  return step;
}

function makeAbbrevStep(abbrev) {
  switch (abbrev) {
  case '//':
    return new StepExpr('descendant-or-self', new NodeTestAny);

  case '.':
    return new StepExpr('self', new NodeTestAny);

  case '..':
    return new StepExpr('parent', new NodeTestAny);
  }
}

function makeNodeTestExpr1(asterisk) {
  return new NodeTestElement;
}

function makeNodeTestExpr2(ncname, colon, asterisk) {
  return new NodeTestNC(ncname.value);
}

function makeNodeTestExpr3(qname) {
  return new NodeTestName(qname.value);
}

function makeNodeTestExpr4(typeo, parenc) {
  var type = typeo.value.replace(/\s*\($/, '');
  switch(type) {
  case 'node':
    return new NodeTestAny;

  case 'text':
    return new NodeTestText;

  case 'comment':
    return new NodeTestComment;

  case 'processing-instruction':
    return new NodeTestPI;
  }
}

function makeNodeTestExpr5(typeo, target, parenc) {
  var type = typeo.replace(/\s*\($/, '');
  if (type != 'processing-instruction') {
    throw type + ' ' + Error().stack;
  }
  return new NodeTestPI(target.value);
}

function makePredicateExpr(pareno, expr, parenc) {
  return new PredicateExpr(expr);
}

function makePrimaryExpr(pareno, expr, parenc) {
  return expr;
}

function makeFunctionCallExpr1(name, pareno, parenc) {
  return new FunctionCallExpr(name);
}

function makeFunctionCallExpr2(name, pareno, arg1, args, parenc) {
  var ret = new FunctionCallExpr(name);
  ret.appendArg(arg1);
  for (var i = 0; i < args.length; ++i) {
    ret.appendArg(args[i]);
  }
  return ret;
}

function makeArgumentExpr(comma, expr) {
  return expr;
}

function makeUnionExpr(expr1, pipe, expr2) {
  return new UnionExpr(expr1, expr2);
}

function makePathExpr1(filter, slash, rel) {
  return new PathExpr(filter, rel);
}

function makePathExpr2(filter, dslash, rel) {
  rel.prependStep(makeAbbrevStep(dslash.value));
  return new PathExpr(filter, rel);
}

function makeFilterExpr(expr, predicates) {
  if (predicates.length > 0) {
    return new FilterExpr(expr, predicates);
  } else {
    return expr;
  }
}

function makeUnaryMinusExpr(minus, expr) {
  return new UnaryMinusExpr(expr);
}

function makeBinaryExpr(expr1, op, expr2) {
  return new BinaryExpr(expr1, op, expr2);
}

function makeLiteralExpr(token) {
  // remove quotes from the parsed value:
  var value = token.value.substring(1, token.value.length - 1);
  return new LiteralExpr(value);
}

function makeNumberExpr(token) {
  return new NumberExpr(token.value);
}

function makeVariableReference(dollar, name) {
  return new VariableExpr(name.value);
}

// Used before parsing for optimization of common simple cases. See
// the begin of xpathParse() for which they are.
function makeSimpleExpr(expr) {
  if (expr.charAt(0) == '$') {
    return new VariableExpr(expr.substr(1));
  } else if (expr.charAt(0) == '@') {
    var a = new NodeTestName(expr.substr(1));
    var b = new StepExpr('attribute', a);
    var c = new LocationExpr();
    c.appendStep(b);
    return c;
  } else if (expr.match(/^[0-9]+$/)) {
    return new NumberExpr(expr);
  } else {
    var a = new NodeTestName(expr);
    var b = new StepExpr('child', a);
    var c = new LocationExpr();
    c.appendStep(b);
    return c;
  }
}

function makeSimpleExpr2(expr) {
  var steps = expr.split('/');
  var c = new LocationExpr();
  for (var i = 0; i < steps.length; i++) {
    var a = new NodeTestName(steps[i]);
    var b = new StepExpr('child', a);
    c.appendStep(b);
  }
  return c;
}

// The axes of XPath expressions.

var xpathAxis = {
  ANCESTOR_OR_SELF: 'ancestor-or-self',
  ANCESTOR: 'ancestor',
  ATTRIBUTE: 'attribute',
  CHILD: 'child',
  DESCENDANT_OR_SELF: 'descendant-or-self',
  DESCENDANT: 'descendant',
  FOLLOWING_SIBLING: 'following-sibling',
  FOLLOWING: 'following',
  NAMESPACE: 'namespace',
  PARENT: 'parent',
  PRECEDING_SIBLING: 'preceding-sibling',
  PRECEDING: 'preceding',
  SELF: 'self'
};

var xpathAxesRe = [
    xpathAxis.ANCESTOR_OR_SELF,
    xpathAxis.ANCESTOR,
    xpathAxis.ATTRIBUTE,
    xpathAxis.CHILD,
    xpathAxis.DESCENDANT_OR_SELF,
    xpathAxis.DESCENDANT,
    xpathAxis.FOLLOWING_SIBLING,
    xpathAxis.FOLLOWING,
    xpathAxis.NAMESPACE,
    xpathAxis.PARENT,
    xpathAxis.PRECEDING_SIBLING,
    xpathAxis.PRECEDING,
    xpathAxis.SELF
].join('|');


// The tokens of the language. The label property is just used for
// generating debug output. The prec property is the precedence used
// for shift/reduce resolution. Default precedence is 0 as a lookahead
// token and 2 on the stack. TODO(mesch): this is certainly not
// necessary and too complicated. Simplify this!

// NOTE: tabular formatting is the big exception, but here it should
// be OK.

var TOK_PIPE =   { label: "|",   prec:   17, re: new RegExp("^\\|") };
var TOK_DSLASH = { label: "//",  prec:   19, re: new RegExp("^//")  };
var TOK_SLASH =  { label: "/",   prec:   30, re: new RegExp("^/")   };
var TOK_AXIS =   { label: "::",  prec:   20, re: new RegExp("^::")  };
var TOK_COLON =  { label: ":",   prec: 1000, re: new RegExp("^:")  };
var TOK_AXISNAME = { label: "[axis]", re: new RegExp('^(' + xpathAxesRe + ')') };
var TOK_PARENO = { label: "(",   prec:   34, re: new RegExp("^\\(") };
var TOK_PARENC = { label: ")",               re: new RegExp("^\\)") };
var TOK_DDOT =   { label: "..",  prec:   34, re: new RegExp("^\\.\\.") };
var TOK_DOT =    { label: ".",   prec:   34, re: new RegExp("^\\.") };
var TOK_AT =     { label: "@",   prec:   34, re: new RegExp("^@")   };

var TOK_COMMA =  { label: ",",               re: new RegExp("^,") };

var TOK_OR =     { label: "or",  prec:   10, re: new RegExp("^or\\b") };
var TOK_AND =    { label: "and", prec:   11, re: new RegExp("^and\\b") };
var TOK_EQ =     { label: "=",   prec:   12, re: new RegExp("^=")   };
var TOK_NEQ =    { label: "!=",  prec:   12, re: new RegExp("^!=")  };
var TOK_GE =     { label: ">=",  prec:   13, re: new RegExp("^>=")  };
var TOK_GT =     { label: ">",   prec:   13, re: new RegExp("^>")   };
var TOK_LE =     { label: "<=",  prec:   13, re: new RegExp("^<=")  };
var TOK_LT =     { label: "<",   prec:   13, re: new RegExp("^<")   };
var TOK_PLUS =   { label: "+",   prec:   14, re: new RegExp("^\\+"), left: true };
var TOK_MINUS =  { label: "-",   prec:   14, re: new RegExp("^\\-"), left: true };
var TOK_DIV =    { label: "div", prec:   15, re: new RegExp("^div\\b"), left: true };
var TOK_MOD =    { label: "mod", prec:   15, re: new RegExp("^mod\\b"), left: true };

var TOK_BRACKO = { label: "[",   prec:   32, re: new RegExp("^\\[") };
var TOK_BRACKC = { label: "]",               re: new RegExp("^\\]") };
var TOK_DOLLAR = { label: "$",               re: new RegExp("^\\$") };

var TOK_NCNAME = { label: "[ncname]", re: new RegExp('^[a-z][-\\w]*','i') };

var TOK_ASTERISK = { label: "*", prec: 15, re: new RegExp("^\\*"), left: true };
var TOK_LITERALQ = { label: "[litq]", prec: 20, re: new RegExp("^'[^\\']*'") };
var TOK_LITERALQQ = {
  label: "[litqq]",
  prec: 20,
  re: new RegExp('^"[^\\"]*"')
};

var TOK_NUMBER  = {
  label: "[number]",
  prec: 35,
  re: new RegExp('^\\d+(\\.\\d*)?') };

var TOK_QNAME = {
  label: "[qname]",
  re: new RegExp('^([a-z][-\\w]*:)?[a-z][-\\w]*','i')
};

var TOK_NODEO = {
  label: "[nodetest-start]",
  re: new RegExp('^(processing-instruction|comment|text|node)\\(')
};

// The table of the tokens of our grammar, used by the lexer: first
// column the tag, second column a regexp to recognize it in the
// input, third column the precedence of the token, fourth column a
// factory function for the semantic value of the token.
//
// NOTE: order of this list is important, because the first match
// counts. Cf. DDOT and DOT, and AXIS and COLON.

var xpathTokenRules = [
    TOK_DSLASH,
    TOK_SLASH,
    TOK_DDOT,
    TOK_DOT,
    TOK_AXIS,
    TOK_COLON,
    TOK_AXISNAME,
    TOK_NODEO,
    TOK_PARENO,
    TOK_PARENC,
    TOK_BRACKO,
    TOK_BRACKC,
    TOK_AT,
    TOK_COMMA,
    TOK_OR,
    TOK_AND,
    TOK_NEQ,
    TOK_EQ,
    TOK_GE,
    TOK_GT,
    TOK_LE,
    TOK_LT,
    TOK_PLUS,
    TOK_MINUS,
    TOK_ASTERISK,
    TOK_PIPE,
    TOK_MOD,
    TOK_DIV,
    TOK_LITERALQ,
    TOK_LITERALQQ,
    TOK_NUMBER,
    TOK_QNAME,
    TOK_NCNAME,
    TOK_DOLLAR
];

// All the nonterminals of the grammar. The nonterminal objects are
// identified by object identity; the labels are used in the debug
// output only.
var XPathLocationPath = { label: "LocationPath" };
var XPathRelativeLocationPath = { label: "RelativeLocationPath" };
var XPathAbsoluteLocationPath = { label: "AbsoluteLocationPath" };
var XPathStep = { label: "Step" };
var XPathNodeTest = { label: "NodeTest" };
var XPathPredicate = { label: "Predicate" };
var XPathLiteral = { label: "Literal" };
var XPathExpr = { label: "Expr" };
var XPathPrimaryExpr = { label: "PrimaryExpr" };
var XPathVariableReference = { label: "Variablereference" };
var XPathNumber = { label: "Number" };
var XPathFunctionCall = { label: "FunctionCall" };
var XPathArgumentRemainder = { label: "ArgumentRemainder" };
var XPathPathExpr = { label: "PathExpr" };
var XPathUnionExpr = { label: "UnionExpr" };
var XPathFilterExpr = { label: "FilterExpr" };
var XPathDigits = { label: "Digits" };

var xpathNonTerminals = [
    XPathLocationPath,
    XPathRelativeLocationPath,
    XPathAbsoluteLocationPath,
    XPathStep,
    XPathNodeTest,
    XPathPredicate,
    XPathLiteral,
    XPathExpr,
    XPathPrimaryExpr,
    XPathVariableReference,
    XPathNumber,
    XPathFunctionCall,
    XPathArgumentRemainder,
    XPathPathExpr,
    XPathUnionExpr,
    XPathFilterExpr,
    XPathDigits
];

// Quantifiers that are used in the productions of the grammar.
var Q_01 = { label: "?" };
var Q_MM = { label: "*" };
var Q_1M = { label: "+" };

// Tag for left associativity (right assoc is implied by undefined).
var ASSOC_LEFT = true;

// The productions of the grammar. Columns of the table:
//
// - target nonterminal,
// - pattern,
// - precedence,
// - semantic value factory
//
// The semantic value factory is a function that receives parse tree
// nodes from the stack frames of the matched symbols as arguments and
// returns an a node of the parse tree. The node is stored in the top
// stack frame along with the target object of the rule. The node in
// the parse tree is an expression object that has an evaluate() method
// and thus evaluates XPath expressions.
//
// The precedence is used to decide between reducing and shifting by
// comparing the precendence of the rule that is candidate for
// reducing with the precedence of the look ahead token. Precedence of
// -1 means that the precedence of the tokens in the pattern is used
// instead. TODO: It shouldn't be necessary to explicitly assign
// precedences to rules.

var xpathGrammarRules =
  [
   [ XPathLocationPath, [ XPathRelativeLocationPath ], 18,
     passExpr ],
   [ XPathLocationPath, [ XPathAbsoluteLocationPath ], 18,
     passExpr ],

   [ XPathAbsoluteLocationPath, [ TOK_SLASH, XPathRelativeLocationPath ], 18, 
     makeLocationExpr1 ],
   [ XPathAbsoluteLocationPath, [ TOK_DSLASH, XPathRelativeLocationPath ], 18,
     makeLocationExpr2 ],

   [ XPathAbsoluteLocationPath, [ TOK_SLASH ], 0,
     makeLocationExpr3 ],
   [ XPathAbsoluteLocationPath, [ TOK_DSLASH ], 0,
     makeLocationExpr4 ],

   [ XPathRelativeLocationPath, [ XPathStep ], 31,
     makeLocationExpr5 ],
   [ XPathRelativeLocationPath,
     [ XPathRelativeLocationPath, TOK_SLASH, XPathStep ], 31,
     makeLocationExpr6 ],
   [ XPathRelativeLocationPath,
     [ XPathRelativeLocationPath, TOK_DSLASH, XPathStep ], 31,
     makeLocationExpr7 ],

   [ XPathStep, [ TOK_DOT ], 33,
     makeStepExpr1 ],
   [ XPathStep, [ TOK_DDOT ], 33,
     makeStepExpr2 ],
   [ XPathStep,
     [ TOK_AXISNAME, TOK_AXIS, XPathNodeTest ], 33,
     makeStepExpr3 ],
   [ XPathStep, [ TOK_AT, XPathNodeTest ], 33,
     makeStepExpr4 ],
   [ XPathStep, [ XPathNodeTest ], 33,
     makeStepExpr5 ],
   [ XPathStep, [ XPathStep, XPathPredicate ], 33,
     makeStepExpr6 ],

   [ XPathNodeTest, [ TOK_ASTERISK ], 33,
     makeNodeTestExpr1 ],
   [ XPathNodeTest, [ TOK_NCNAME, TOK_COLON, TOK_ASTERISK ], 33,
     makeNodeTestExpr2 ],
   [ XPathNodeTest, [ TOK_QNAME ], 33,
     makeNodeTestExpr3 ],
   [ XPathNodeTest, [ TOK_NODEO, TOK_PARENC ], 33,
     makeNodeTestExpr4 ],
   [ XPathNodeTest, [ TOK_NODEO, XPathLiteral, TOK_PARENC ], 33,
     makeNodeTestExpr5 ],

   [ XPathPredicate, [ TOK_BRACKO, XPathExpr, TOK_BRACKC ], 33,
     makePredicateExpr ],

   [ XPathPrimaryExpr, [ XPathVariableReference ], 33,
     passExpr ],
   [ XPathPrimaryExpr, [ TOK_PARENO, XPathExpr, TOK_PARENC ], 33,
     makePrimaryExpr ],
   [ XPathPrimaryExpr, [ XPathLiteral ], 30,
     passExpr ],
   [ XPathPrimaryExpr, [ XPathNumber ], 30,
     passExpr ],
   [ XPathPrimaryExpr, [ XPathFunctionCall ], 30,
     passExpr ],

   [ XPathFunctionCall, [ TOK_QNAME, TOK_PARENO, TOK_PARENC ], -1,
     makeFunctionCallExpr1 ],
   [ XPathFunctionCall,
     [ TOK_QNAME, TOK_PARENO, XPathExpr, XPathArgumentRemainder, Q_MM,
       TOK_PARENC ], -1,
     makeFunctionCallExpr2 ],
   [ XPathArgumentRemainder, [ TOK_COMMA, XPathExpr ], -1,
     makeArgumentExpr ],

   [ XPathUnionExpr, [ XPathPathExpr ], 20,
     passExpr ],
   [ XPathUnionExpr, [ XPathUnionExpr, TOK_PIPE, XPathPathExpr ], 20,
     makeUnionExpr ],

   [ XPathPathExpr, [ XPathLocationPath ], 20, 
     passExpr ], 
   [ XPathPathExpr, [ XPathFilterExpr ], 19, 
     passExpr ], 
   [ XPathPathExpr, 
     [ XPathFilterExpr, TOK_SLASH, XPathRelativeLocationPath ], 20,
     makePathExpr1 ],
   [ XPathPathExpr,
     [ XPathFilterExpr, TOK_DSLASH, XPathRelativeLocationPath ], 20,
     makePathExpr2 ],

   [ XPathFilterExpr, [ XPathPrimaryExpr, XPathPredicate, Q_MM ], 20,
     makeFilterExpr ], 

   [ XPathExpr, [ XPathPrimaryExpr ], 16,
     passExpr ],
   [ XPathExpr, [ XPathUnionExpr ], 16,
     passExpr ],

   [ XPathExpr, [ TOK_MINUS, XPathExpr ], -1,
     makeUnaryMinusExpr ],

   [ XPathExpr, [ XPathExpr, TOK_OR, XPathExpr ], -1,
     makeBinaryExpr ],
   [ XPathExpr, [ XPathExpr, TOK_AND, XPathExpr ], -1,
     makeBinaryExpr ],

   [ XPathExpr, [ XPathExpr, TOK_EQ, XPathExpr ], -1,
     makeBinaryExpr ],
   [ XPathExpr, [ XPathExpr, TOK_NEQ, XPathExpr ], -1,
     makeBinaryExpr ],

   [ XPathExpr, [ XPathExpr, TOK_LT, XPathExpr ], -1,
     makeBinaryExpr ],
   [ XPathExpr, [ XPathExpr, TOK_LE, XPathExpr ], -1,
     makeBinaryExpr ],
   [ XPathExpr, [ XPathExpr, TOK_GT, XPathExpr ], -1,
     makeBinaryExpr ],
   [ XPathExpr, [ XPathExpr, TOK_GE, XPathExpr ], -1,
     makeBinaryExpr ],

   [ XPathExpr, [ XPathExpr, TOK_PLUS, XPathExpr ], -1,
     makeBinaryExpr, ASSOC_LEFT ],
   [ XPathExpr, [ XPathExpr, TOK_MINUS, XPathExpr ], -1,
     makeBinaryExpr, ASSOC_LEFT ],

   [ XPathExpr, [ XPathExpr, TOK_ASTERISK, XPathExpr ], -1,
     makeBinaryExpr, ASSOC_LEFT ],
   [ XPathExpr, [ XPathExpr, TOK_DIV, XPathExpr ], -1,
     makeBinaryExpr, ASSOC_LEFT ],
   [ XPathExpr, [ XPathExpr, TOK_MOD, XPathExpr ], -1,
     makeBinaryExpr, ASSOC_LEFT ],

   [ XPathLiteral, [ TOK_LITERALQ ], -1,
     makeLiteralExpr ],
   [ XPathLiteral, [ TOK_LITERALQQ ], -1,
     makeLiteralExpr ],

   [ XPathNumber, [ TOK_NUMBER ], -1,
     makeNumberExpr ],

   [ XPathVariableReference, [ TOK_DOLLAR, TOK_QNAME ], 200,
     makeVariableReference ]
   ];

// That function computes some optimizations of the above data
// structures and will be called right here. It merely takes the
// counter variables out of the global scope.

var xpathRules = [];

function xpathParseInit() {
  if (xpathRules.length) {
    return;
  }

  // Some simple optimizations for the xpath expression parser: sort
  // grammar rules descending by length, so that the longest match is
  // first found.

  xpathGrammarRules.sort(function(a,b) {
    var la = a[1].length;
    var lb = b[1].length;
    if (la < lb) {
      return 1;
    } else if (la > lb) {
      return -1;
    } else {
      return 0;
    }
  });

  var k = 1;
  for (var i = 0; i < xpathNonTerminals.length; ++i) {
    xpathNonTerminals[i].key = k++;
  }

  for (i = 0; i < xpathTokenRules.length; ++i) {
    xpathTokenRules[i].key = k++;
  }

  if (xpathdebug)
  Log.write('XPath parse INIT: ' + k + ' rules');

  // Another slight optimization: sort the rules into bins according
  // to the last element (observing quantifiers), so we can restrict
  // the match against the stack to the subest of rules that match the
  // top of the stack.
  //
  // TODO(mesch): What we actually want is to compute states as in
  // bison, so that we don't have to do any explicit and iterated
  // match against the stack.

  function push_(array, position, element) {
    if (!array[position]) {
      array[position] = [];
    }
    array[position].push(element);
  }

  for (i = 0; i < xpathGrammarRules.length; ++i) {
    var rule = xpathGrammarRules[i];
    var pattern = rule[1];

    for (var j = pattern.length - 1; j >= 0; --j) {
      if (pattern[j] == Q_1M) {
        push_(xpathRules, pattern[j-1].key, rule);
        break;
        
      } else if (pattern[j] == Q_MM || pattern[j] == Q_01) {
        push_(xpathRules, pattern[j-1].key, rule);
        --j;

      } else {
        push_(xpathRules, pattern[j].key, rule);
        break;
      }
    }
  }

  if (xpathdebug)
  Log.write('XPath parse INIT: ' + xpathRules.length + ' rule bins');
  
  var sum = 0;
  mapExec(xpathRules, function(i) {
    if (i) {
      sum += i.length;
    }
  });
  
  if (xpathdebug)
  Log.write('XPath parse INIT: ' + (sum / xpathRules.length) + ' average bin size');
}

// Local utility functions that are used by the lexer or parser.

function xpathCollectDescendants(nodelist, node) {
  for (var n = node.firstChild; n; n = n.nextSibling) {
    nodelist.push(n);
    arguments.callee(nodelist, n);
  }
}

function xpathCollectDescendantsReverse(nodelist, node) {
  for (var n = node.lastChild; n; n = n.previousSibling) {
    nodelist.push(n);
    arguments.callee(nodelist, n);
  }
}


// The entry point for the library: match an expression against a DOM
// node. Returns an XPath value.
function xpathDomEval(expr, node) {
  var expr1 = xpathParse(expr);
  var ret = expr1.evaluate(new ExprContext(node));
  return ret;
}

// Utility function to sort a list of nodes. Used by xsltSort() and
// nxslSelect().
function xpathSort(input, sort) {
  if (sort.length == 0) {
    return;
  }

  var sortlist = [];

  for (var i = 0; i < input.nodelist.length; ++i) {
    var node = input.nodelist[i];
    var sortitem = { node: node, key: [] };
    var context = input.clone(node, 0, [ node ]);
    
    for (var j = 0; j < sort.length; ++j) {
      var s = sort[j];
      var value = s.expr.evaluate(context);

      var evalue;
      if (s.type == 'text') {
        evalue = value.stringValue();
      } else if (s.type == 'number') {
        evalue = value.numberValue();
      }
      sortitem.key.push({ value: evalue, order: s.order });
    }

    // Make the sort stable by adding a lowest priority sort by
    // id. This is very convenient and furthermore required by the
    // spec ([XSLT] - Section 10 Sorting).
    sortitem.key.push({ value: i, order: 'ascending' });

    sortlist.push(sortitem);
  }

  sortlist.sort(xpathSortByKey);

  var nodes = [];
  for (var i = 0; i < sortlist.length; ++i) {
    nodes.push(sortlist[i].node);
  }
  input.nodelist = nodes;
  input.setNode(nodes[0], 0);
}


// Sorts by all order criteria defined. According to the JavaScript
// spec ([ECMA] Section 11.8.5), the compare operators compare strings
// as strings and numbers as numbers.
//
// NOTE: In browsers which do not follow the spec, this breaks only in
// the case that numbers should be sorted as strings, which is very
// uncommon.

function xpathSortByKey(v1, v2) {
  // NOTE: Sort key vectors of different length never occur in
  // xsltSort.

  for (var i = 0; i < v1.key.length; ++i) {
    var o = v1.key[i].order == 'descending' ? -1 : 1;
    if (v1.key[i].value > v2.key[i].value) {
      return +1 * o;
    } else if (v1.key[i].value < v2.key[i].value) {
      return -1 * o;
    }
  }

  return 0;
}


// Copyright (c) 2005, Google Inc.
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//         
//  * Redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer.
// 
//  * Redistributions in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in the
//    documentation and/or other materials provided with the
//    distribution.
// 
//  * Neither the name of Google Inc. nor the names of its contributors
//    may be used to endorse or promote products derived from this
//    software without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// Miscellania that support the ajaxslt implementation.
//
// Author: Steffen Meschkat <mesch@google.com>
//

function el(i) {
  return document.getElementById(i);
}

function px(x) {
  return x + 'px';
}

// Split a string s at all occurrences of character c. This is like
// the split() method of the string object, but IE omits empty
// strings, which violates the invariant (s.split(x).join(x) == s).
function stringSplit(s, c) {
  var a = s.indexOf(c);
  if (a == -1) {
    return [ s ];
  }
  
  var parts = [];
  parts.push(s.substr(0,a));
  while (a != -1) {
    var a1 = s.indexOf(c, a + 1);
    if (a1 != -1) {
      parts.push(s.substr(a + 1, a1 - a - 1));
    } else {
      parts.push(s.substr(a + 1));
    } 
    a = a1;
  }

  return parts;
}

// Returns the text value if a node; for nodes without children this
// is the nodeValue, for nodes with children this is the concatenation
// of the value of all children.
function xmlValue(node) {
  if (!node) {
    return '';
  }

  var ret = '';
  if (node.nodeType == DOM_TEXT_NODE ||
      node.nodeType == DOM_CDATA_SECTION_NODE ||
      node.nodeType == DOM_ATTRIBUTE_NODE) {
    ret += node.nodeValue;

  } else if (node.nodeType == DOM_ELEMENT_NODE ||
             node.nodeType == DOM_DOCUMENT_NODE ||
             node.nodeType == DOM_DOCUMENT_FRAGMENT_NODE) {
    for (var i = 0; i < node.childNodes.length; ++i) {
      ret += arguments.callee(node.childNodes[i]);
    }
  }
  return ret;
}

// Returns the representation of a node as XML text.
function xmlText(node) {
  var ret = '';
  if (node.nodeType == DOM_TEXT_NODE) {
    ret += xmlEscapeText(node.nodeValue);
    
  } else if (node.nodeType == DOM_ELEMENT_NODE) {
    ret += '<' + node.nodeName;
    for (var i = 0; i < node.attributes.length; ++i) {
      var a = node.attributes[i];
      if (a && a.nodeName && a.nodeValue) {
        ret += ' ' + a.nodeName;
        ret += '="' + xmlEscapeAttr(a.nodeValue) + '"';
      }
    }

    if (node.childNodes.length == 0) {
      ret += '/>';

    } else {
      ret += '>';
      for (var i = 0; i < node.childNodes.length; ++i) {
        ret += arguments.callee(node.childNodes[i]);
      }
      ret += '</' + node.nodeName + '>';
    }
    
  } else if (node.nodeType == DOM_DOCUMENT_NODE || 
             node.nodeType == DOM_DOCUMENT_FRAGMENT_NODE) {
    for (var i = 0; i < node.childNodes.length; ++i) {
      ret += arguments.callee(node.childNodes[i]);
    }
  }
  
  return ret;
}

// Applies the given function to each element of the array.
function mapExec(array, func) {
  for (var i = 0; i < array.length; ++i) {
    func(array[i]);
  }
}

// Returns an array that contains the return value of the given
// function applied to every element of the input array.
function mapExpr(array, func) {
  var ret = [];
  for (var i = 0; i < array.length; ++i) {
    ret.push(func(array[i]));
  }
  return ret;
};

// Reverses the given array in place.
function reverseInplace(array) {
  for (var i = 0; i < array.length / 2; ++i) {
    var h = array[i];
    var ii = array.length - i - 1;
    array[i] = array[ii];
    array[ii] = h;
  }
}

// Shallow-copies an array.
function copyArray(dst, src) { 
  for (var i = 0; i < src.length; ++i) {
    dst.push(src[i]);
  }
}

function assert(b) {
  if (!b) {
    throw 'assertion failed';
  }
}

// Based on
// <http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247>
var DOM_ELEMENT_NODE = 1;
var DOM_ATTRIBUTE_NODE = 2;
var DOM_TEXT_NODE = 3;
var DOM_CDATA_SECTION_NODE = 4;
var DOM_ENTITY_REFERENCE_NODE = 5;
var DOM_ENTITY_NODE = 6;
var DOM_PROCESSING_INSTRUCTION_NODE = 7;
var DOM_COMMENT_NODE = 8;
var DOM_DOCUMENT_NODE = 9;
var DOM_DOCUMENT_TYPE_NODE = 10;
var DOM_DOCUMENT_FRAGMENT_NODE = 11;
var DOM_NOTATION_NODE = 12;


var xpathdebug = false; // trace xpath parsing
var xsltdebug = false; // trace xslt processing


// Escape XML special markup chracters: tag delimiter < > and entity
// reference start delimiter &. The escaped string can be used in XML
// text portions (i.e. between tags).
function xmlEscapeText(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Escape XML special markup characters: tag delimiter < > entity
// reference start delimiter & and quotes ". The escaped string can be
// used in double quoted XML attribute value portions (i.e. in
// attributes within start tags).
function xmlEscapeAttr(s) {
  return xmlEscapeText(s).replace(/\"/g, '&quot;');
}

// Escape markup in XML text, but don't touch entity references. The
// escaped string can be used as XML text (i.e. between tags).
function xmlEscapeTags(s) {
  return s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// An implementation of the debug log. 

var logging__ = true;

function Log() {};

Log.lines = [];

Log.write = function(s) {
  if (logging__) {
    this.lines.push(xmlEscapeText(s));
    this.show();
  }
};

// Writes the given XML with every tag on a new line.
Log.writeXML = function(xml) {
  if (logging__) {
    var s0 = xml.replace(/</g, '\n<');
    var s1 = xmlEscapeText(s0);
    var s2 = s1.replace(/\s*\n(\s|\n)*/g, '<br/>');
    this.lines.push(s2);
    this.show();
  }
}

// Writes without any escaping
Log.writeRaw = function(s) {
  if (logging__) {
    this.lines.push(s);
    this.show();
  }
}

Log.clear = function() {
  if (logging__) {
    var l = this.div();
    l.innerHTML = '';
    this.lines = [];
  }
}

Log.show = function() {
  var l = this.div();
  l.innerHTML += this.lines.join('<br/>') + '<br/>';
  this.lines = [];
  l.scrollTop = l.scrollHeight;
}

Log.div = function() {
  var l = document.getElementById('log');
  if (!l) {
    l = document.createElement('div');
    l.id = 'log';
    l.style.position = 'absolute';
    l.style.right = '5px';
    l.style.top = '5px';
    l.style.width = '250px';
    l.style.height = '150px';
    l.style.overflow = 'auto';
    l.style.backgroundColor = '#f0f0f0';
    l.style.border = '1px solid gray';
    l.style.fontSize = '10px';
    l.style.padding = '5px';
    document.body.appendChild(l);
  }
  return l;
}


function Timer() {}
Timer.start = function() {}
Timer.end = function() {}
/* SpryData.js - Revision: Spry Preview Release 1.4 */

// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry; if (!Spry) Spry = {};

//////////////////////////////////////////////////////////////////////
//
// Spry.Utils
//
//////////////////////////////////////////////////////////////////////

if (!Spry.Utils) Spry.Utils = {};

Spry.Utils.msProgIDs = ["MSXML2.XMLHTTP.5.0", "MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];

Spry.Utils.createXMLHttpRequest = function()
{
	var req = null;
	try
	{
		if (window.XMLHttpRequest)
			req = new XMLHttpRequest();
		else if (window.ActiveXObject)
		{
			while (!req && Spry.Utils.msProgIDs.length)
			{
				try { req = new ActiveXObject(Spry.Utils.msProgIDs[0]); } catch (e) { req = null; }
				if (!req)
					Spry.Utils.msProgIDs.splice(0, 1);
			}
		}
	}
	catch (e) { req = null;	}

	if (!req)
		Spry.Debug.reportError("Failed to create an XMLHttpRequest object!" );

	return req;
};

Spry.Utils.loadURL = function(method, url, async, callback, opts)
{
	var req = new Spry.Utils.loadURL.Request();
	req.method = method;
	req.url = url;
	req.async = async;
	req.successCallback = callback;
	Spry.Utils.setOptions(req, opts);
	
	try
	{
		req.xhRequest = Spry.Utils.createXMLHttpRequest();
		if (!req.xhRequest)
			return null;

		if (req.async)
			req.xhRequest.onreadystatechange = function() { Spry.Utils.loadURL.callback(req); };

		req.xhRequest.open(req.method, req.url, req.async, req.username, req.password);
		
		if (req.headers)
		{
			for (var name in req.headers)
				req.xhRequest.setRequestHeader(name, req.headers[name]);
		}

		req.xhRequest.send(req.postData);

		if (!req.async)
			Spry.Utils.loadURL.callback(req);
	}
	catch(e) { req = null; Spry.Debug.reportError("Exception caught while loading " + url + ": " + e); }

	return req;
};

Spry.Utils.loadURL.callback = function(req)
{
	if (!req || req.xhRequest.readyState != 4)
		return;
	
	//
	// my fix for abort() to work correctly
	//
	if(!req.xhRequest.responseText) { return; }
	
	if (req.successCallback && (req.xhRequest.status == 200 || req.xhRequest.status == 0))
		req.successCallback(req);
	else if (req.errorCallback)
		req.errorCallback(req);
};

Spry.Utils.loadURL.Request = function()
{
	var props = Spry.Utils.loadURL.Request.props;
	var numProps = props.length;

	for (var i = 0; i < numProps; i++)
		this[props[i]] = null;

	this.method = "GET";
	this.async = true;
	this.headers = {};
};

Spry.Utils.loadURL.Request.props = [ "method", "url", "async", "username", "password", "postData", "successCallback", "errorCallback", "headers", "userData", "xhRequest" ];

Spry.Utils.loadURL.Request.prototype.extractRequestOptions = function(opts, undefineRequestProps)
{
	if (!opts)
		return;

	var props = Spry.Utils.loadURL.Request.props;
	var numProps = props.length;

	for (var i = 0; i < numProps; i++)
	{
		var prop = props[i];
		if (opts[prop] != undefined)
		{
			this[prop] = opts[prop];
			if (undefineRequestProps)
				opts[prop] = undefined;
		}
	}
};

Spry.Utils.loadURL.Request.prototype.clone = function()
{
	var props = Spry.Utils.loadURL.Request.props;
	var numProps = props.length;
	var req = new Spry.Utils.loadURL.Request;
	for (var i = 0; i < numProps; i++)
		req[props[i]] = this[props[i]];
	if (this.headers)
	{
		req.headers = {};
		Spry.Utils.setOptions(req.headers, this.headers);
	}
	return req;
};

Spry.Utils.setInnerHTML = function(ele, str, preventScripts)
{
	if (!ele)
		return;
	ele = $(ele);
	var scriptExpr = "<script[^>]*>(.|\s|\n|\r)*?</script>";
	ele.innerHTML = str.replace(new RegExp(scriptExpr, "img"), "");

	if (preventScripts)
		return;
		
	var matches = str.match(new RegExp(scriptExpr, "img"));
	if (matches)
	{
		var numMatches = matches.length;
		for (var i = 0; i < numMatches; i++)
		{
			var s = matches[i].replace(/<script[^>]*>[\s\r\n]*(<\!--)?|(-->)?[\s\r\n]*<\/script>/img, "");
			Spry.Utils.eval(s);
		}
	}
};

Spry.Utils.updateContent = function (ele, url, finishFunc, opts)
{
	var method = (opts && opts.method) ? opts.method : "GET";
	Spry.Utils.loadURL(method, url, false, function(req)
	{
		Spry.Utils.setInnerHTML(ele, req.xhRequest.responseText);
		if (finishFunc)
			finishFunc(ele, url);
	}, opts);
};

Spry.Utils.addEventListener = function(element, eventType, handler, capture)
{
	try
	{
		element = $(element);
		if (element.addEventListener)
			element.addEventListener(eventType, handler, capture);
		else if (element.attachEvent)
			element.attachEvent("on" + eventType, handler);
	}
	catch (e) {}
};

Spry.Utils.removeEventListener = function(element, eventType, handler, capture)
{
	try
	{
		element = $(element);
		if (element.removeEventListener)
			element.removeEventListener(eventType, handler, capture);
		else if (element.detachEvent)
			element.detachEvent("on" + eventType, handler);
	}
	catch (e) {}
};

Spry.Utils.addLoadListener = function(handler)
{
	if (typeof window.addEventListener != 'undefined')
		window.addEventListener('load', handler, false);
	else if (typeof document.addEventListener != 'undefined')
		document.addEventListener('load', handler, false);
	else if (typeof window.attachEvent != 'undefined')
		window.attachEvent('onload', handler);
};

Spry.Utils.eval = function(str)
{
	// Call this method from your JS function when
	// you don't want the JS expression to access or
	// interfere with any local variables in your JS
	// function.

	return eval(str);
};

Spry.Utils.escapeQuotesAndLineBreaks = function(str)
{
	if (str)
	{
		str = str.replace(/\\/g, "\\\\");
		str = str.replace(/["']/g, "\\$&");
		str = str.replace(/\n/g, "\\n");
		str = str.replace(/\r/g, "\\r");
	}
	return str;
};

Spry.Utils.encodeEntities = function(str)
{
	if (str && str.search(/[&<>"]/) != -1)
	{
		str = str.replace(/&/g, "&amp;");
		str = str.replace(/</g, "&lt;");
		str = str.replace(/>/g, "&gt;");
		str = str.replace(/"/g, "&quot;");
	}
	return str
};

Spry.Utils.decodeEntities = function(str)
{
	var d = Spry.Utils.decodeEntities.div;
	if (!d)
	{
		d = document.createElement('div');
		Spry.Utils.decodeEntities.div = d;
		if (!d) return str;
	}
	d.innerHTML = str;
	if (d.childNodes.length == 1 && d.firstChild.nodeType == 3 /* Node.TEXT_NODE */ && d.firstChild.nextSibling == null)
		str = d.firstChild.data;
	else
	{
		// Hmmm, innerHTML processing of str produced content
		// we weren't expecting, so just replace entities we
		// expect folks will use in node attributes that contain
		// JavaScript.
		str = str.replace(/&lt;/, "<");
		str = str.replace(/&gt;/, ">");
		str = str.replace(/&quot;/, "\"");
		str = str.replace(/&amp;/, "&");
	}
	return str;
};

Spry.Utils.fixupIETagAttributes = function(inStr)
{
	var outStr = "";

	// Break the tag string into 3 pieces.

	var tagStart = inStr.match(/^<[^\s>]+\s*/)[0];
	var tagEnd = inStr.match(/\s*\/?>$/)[0];
	var tagAttrs = inStr.replace(/^<[^\s>]+\s*|\s*\/?>/g, "");

	// Write out the start of the tag.
	outStr += tagStart;

	// If the tag has attributes, parse it out manually to avoid accidentally fixing up
	// attributes that contain JavaScript expressions.

	if (tagAttrs)
	{
		var startIndex = 0;
		var endIndex = 0;

		while (startIndex < tagAttrs.length)
		{
			// Find the '=' char of the attribute.
			while (tagAttrs.charAt(endIndex) != '=' && endIndex < tagAttrs.length)
				++endIndex;

			// If we are at the end of the string, just write out what we've
			// collected.

			if (endIndex >= tagAttrs.length)
			{
				outStr += tagAttrs.substring(startIndex, endIndex);
				break;
			}

			// Step past the '=' character and write out what we've
			// collected so far.

			++endIndex;
			outStr += tagAttrs.substring(startIndex, endIndex);
			startIndex = endIndex;

			if (tagAttrs.charAt(endIndex) == '"' || tagAttrs.charAt(endIndex) == "'")
			{
				// Attribute is quoted. Advance us past the quoted value!
				var savedIndex = endIndex++;
				while (endIndex < tagAttrs.length)
				{
					if (tagAttrs.charAt(endIndex) == tagAttrs.charAt(savedIndex))
					{
						endIndex++;
						break;
					}
					else if (tagAttrs.charAt(endIndex) == "\\")
						endIndex++;
					endIndex++;
				}

				outStr += tagAttrs.substring(startIndex, endIndex);
				startIndex = endIndex;
			}
			else
			{
				// This attribute value wasn't quoted! Wrap it with quotes and
				// write out everything till we hit a space, or the end of the
				// string.

				outStr += "\"";
				
				var sIndex = tagAttrs.slice(endIndex).search(/\s/);
				endIndex = (sIndex != -1) ? (endIndex + sIndex) : tagAttrs.length;
				outStr += tagAttrs.slice(startIndex, endIndex);				
				outStr += "\"";				
				startIndex = endIndex;
			}
		}
	}

	outStr += tagEnd;

	// Write out the end of the tag.
	return outStr;
}

Spry.Utils.fixUpIEInnerHTML = function(inStr)
{
	var outStr = "";

	// Create a regular expression that will match:
	//     <!--
	//     <![CDATA[
	//     <tag>
	//     -->
	//     ]]>
	//     ]]&gt;   // Yet another workaround for an IE innerHTML bug.
	//
	// The idea here is that we only want to fix up attribute values on tags that
	// are not in any comments or CDATA.

	var regexp = new RegExp("<\\!--|<\\!\\[CDATA\\[|<\\w+[^<>]*>|-->|\\]\\](>|\&gt;)", "g");
	var searchStartIndex = 0;
	var skipFixUp = 0;
	
	while (inStr.length)
	{
		var results = regexp.exec(inStr);
		if (!results || !results[0])
		{
			outStr += inStr.substr(searchStartIndex, inStr.length - searchStartIndex);
			break;
		}

		if (results.index != searchStartIndex)
		{
			// We found a match but it's not at the start of the inStr.
			// Create a string token for everything that precedes the match.
			outStr += inStr.substr(searchStartIndex, results.index - searchStartIndex);
		}

		if (results[0] == "<!--" || results[0] == "<![CDATA[")
		{
			++skipFixUp;
			outStr += results[0];
		}
		else if (results[0] == "-->" || results[0] == "]]>" || (skipFixUp && results[0] == "]]&gt;"))
		{
			--skipFixUp;
			outStr += results[0];
		}
		else if (!skipFixUp && results[0].charAt(0) == '<')
			outStr += Spry.Utils.fixupIETagAttributes(results[0]);
		else
			outStr += results[0];

		searchStartIndex = regexp.lastIndex;
	}
	
	return outStr;
};

Spry.Utils.stringToXMLDoc = function(str)
{
	var xmlDoc = null;

	try
	{
		// Attempt to parse the string using the IE method.

		var xmlDOMObj = new ActiveXObject("Microsoft.XMLDOM");
		xmlDOMObj.async = false;
		xmlDOMObj.loadXML(str);
		xmlDoc = xmlDOMObj;
	}
	catch (e)
	{
		// The IE method didn't work. Try the Mozilla way.

		try
		{
			var domParser = new DOMParser;
			xmlDoc = domParser.parseFromString(str, 'text/xml');
		}
		catch (e)
		{
			Spry.Debug.reportError("Caught exception in Spry.Utils.stringToXMLDoc(): " + e + "\n");
			xmlDoc = null;
		}
	}

	return xmlDoc;
};

Spry.Utils.serializeObject = function(obj)
{
	// Create a JSON representation of a given object.

	var str = "";
	var firstItem = true;

	if (obj == null || obj == undefined)
		return str + obj;

	var objType = typeof obj;

	if (objType == "number" || objType == "boolean")
		str += obj;
	else if (objType == "string")
		str += "\"" + Spry.Utils.escapeQuotesAndLineBreaks(obj) + "\"";
	else if (obj.constructor == Array)
	{
		str += "[";
		for (var i = 0; i < obj.length; i++)
		{
			if (!firstItem)
				str += ", ";
			str += Spry.Utils.serializeObject(obj[i]);
			firstItem = false;
		}
		str += "]";
	}
	else if (objType == "object")
	{
		str += "{";
		for (var p in obj)
		{
			if (!firstItem)
				str += ", ";
			str += "\"" + p + "\": " + Spry.Utils.serializeObject(obj[p]);
			firstItem = false;
		}
		str += "}";
	}
	return str;
};

Spry.Utils.getNodesByFunc = function(root, func)
{
	var nodeStack = new Array;
	var resultArr = new Array;
	var node = root;

	while (node)
	{
		if (func(node))
			resultArr.push(node);

		if (node.hasChildNodes())
		{
			nodeStack.push(node);
			node = node.firstChild;
		}
		else
		{
			if (node == root)
				node = null;
			else
				try { node = node.nextSibling; } catch (e) { node = null; };
		}
		
		while (!node && nodeStack.length > 0)
		{
			node = nodeStack.pop();
			if (node == root)
				node = null;
			else
				try { node = node.nextSibling; } catch (e) { node = null; }
		}
	}
	
	if (nodeStack && nodeStack.length > 0)
		Spry.Debug.trace("-- WARNING: Spry.Utils.getNodesByFunc() failed to traverse all nodes!\n");

	return resultArr;
};

Spry.Utils.addClassName = function(ele, className)
{
	ele = $(ele);
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) != -1))
		return;
	ele.className += (ele.className ? " " : "") + className;
};

Spry.Utils.removeClassName = function(ele, className)
{
	ele = $(ele);
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) == -1))
		return;
	ele.className = ele.className.replace(new RegExp("\\s*\\b" + className + "\\b", "g"), "");
};

Spry.Utils.getFirstChildWithNodeName = function(node, nodeName)
{
	var child = node.firstChild;

	while (child)
	{
		if (child.nodeName == nodeName)
			return child;
		child = child.nextSibling;
	} 

	return null;
};

Spry.Utils.nodeContainsElementNode = function(node)
{
	if (node)
	{
		node = node.firstChild;

		while (node)
		{
			if (node.nodeType == 1 /* Node.ELEMENT_NODE */)
				return true;

			node = node.nextSibling;
		}
	}
	return false;
};

Spry.Utils.getNodeText = function(node)
{
	var txt = "";
  
	if (!node)
		return;

	try
	{
		var child = node.firstChild;
 
		while (child)
		{
			try
			{
				if (child.nodeType == 3 /* TEXT_NODE */)
					txt += Spry.Utils.encodeEntities(child.data);
				else if (child.nodeType == 4 /* CDATA_SECTION_NODE */)
					txt += child.data;
			} catch (e) { Spry.Debug.reportError("Spry.Utils.getNodeText() exception caught: " + e + "\n"); }

			child = child.nextSibling;
		}
	}
	catch (e) { Spry.Debug.reportError("Spry.Utils.getNodeText() exception caught: " + e + "\n"); }
  
	return txt;
};

Spry.Utils.CreateObjectForNode = function(node)
{
	if (!node)
		return null;

	var obj = null;
	var i = 0;
	var attr = null;

	try
	{
		for (i = 0; i < node.attributes.length; i++)
		{
			attr = node.attributes[i];
			if (attr && attr.nodeType == 2 /* Node.ATTRIBUTE_NODE */)
			{
				if (!obj)
				{
					obj = new Object();
					if (!obj)
					{
						Spry.Debug.reportError("Spry.Utils.CreateObjectForNode(): Object creation failed!");
						return null;
					}
				}
		
				obj["@" + attr.name] = attr.value;
			}
		}
	}
	catch (e)
	{
		Spry.Debug.reportError("Spry.Utils.CreateObjectForNode() caught exception while accessing attributes: " + e + "\n");
	}
  
	var child = node.firstChild;
	
	if (child && !child.nextSibling && child.nodeType != 1 /* Node.ELEMENT_NODE */)
	{
		// We have a single child and it's not an element. It must
		// be the text value for this node. Add it to the record set and
		// give it the column the same name as the node.

		if (!obj)
		{
			obj = new Object();
			if (!obj)
			{
				Spry.Debug.reportError("Spry.Utils.CreateObjectForNode(): Object creation failed!");
				return null;
			}
		}

		obj[node.nodeName] = Spry.Utils.getNodeText(node);
	}
  
	while (child)
	{
		// Add the text value for each child element. Note that
		// We skip elements that have element children (sub-elements)
		// because we don't handle multi-level data sets right now.
	
		if (child.nodeType == 1 /* Node.ELEMENT_NODE */)
		{
			if (!Spry.Utils.nodeContainsElementNode(child))
			{
				var txt = Spry.Utils.getNodeText(child);
				if (!obj)
				{
					obj = new Object();
					if (!obj)
					{
						Spry.Debug.reportError("Spry.Utils.CreateObjectForNode(): Object creation failed!");
						return null;
					}
				}
	  
				obj[child.nodeName] = txt;

				// Now add properties for any attributes on the child. The property
				// name will be of the form "<child.nodeName>/@<attr.name>".
				try
				{
					var namePrefix = child.nodeName + "/@";
					
					for (i = 0; i < child.attributes.length; i++)
					{
						attr = child.attributes[i];
						if (attr && attr.nodeType == 2 /* Node.ATTRIBUTE_NODE */)
							obj[namePrefix + attr.name] = attr.value;
					}
				}
				catch (e)
				{
					Spry.Debug.reportError("Spry.Utils.CreateObjectForNode() caught exception while accessing attributes: " + e + "\n");
				}
        
			}
			// else Spry.Debug.trace("WARNING: Skipping '" + child.nodeName + "' node! Multi-level data sets are not supported right now!\n");
		}

		child = child.nextSibling;
	}
  
	return obj;
};

Spry.Utils.getRecordSetFromXMLDoc = function(xmlDoc, path)
{
	if (!xmlDoc || !path)
		return null;

	var recordSet = new Object();
	recordSet.xmlDoc = xmlDoc;
	recordSet.xmlPath = path;
	recordSet.dataHash = new Object;
	recordSet.data = new Array;
	recordSet.getData = function() { return this.data; };

	// Use the XPath library to find the nodes that will
	// make up our data set. The result should be an array
	// of subtrees that we need to flatten.

	var ctx = new ExprContext(xmlDoc);
	var pathExpr = xpathParse(path);
	var e = pathExpr.evaluate(ctx);

	// XXX: Note that we should check the result type of the evaluation
	// just in case it's a boolean, string, or number value instead of
	// a node set.
  
	var nodeArray = e.nodeSetValue();

	var isDOMNodeArray = true;

	if (nodeArray && nodeArray.length > 0)
		isDOMNodeArray = nodeArray[0].nodeType != 2 /* Node.ATTRIBUTE_NODE */;

	var nextID = 0;

	// We now have the set of nodes that make up our data set
	// so process each one.

	for (var i = 0; i < nodeArray.length; i++)
	{
		var rowObj = null;
	
		if (isDOMNodeArray)
			rowObj = Spry.Utils.CreateObjectForNode(nodeArray[i]);
		else // Must be a Node.ATTRIBUTE_NODE array.
		{
			rowObj = new Object;
			rowObj["@" + nodeArray[i].name] = nodeArray[i].value;
		}
	
		if (rowObj)
		{
			// We want to make sure that every row has a unique ID and since we
			// we don't know which column, if any, in this recordSet is a unique
			// identifier, we generate a unique ID ourselves and store it under
			// the ds_RowID column in the row object.

			rowObj['ds_RowID'] = nextID++;
			recordSet.dataHash[rowObj['ds_RowID']] = rowObj;
			recordSet.data.push(rowObj);
		}
	}
  
	return recordSet;
};

Spry.Utils.setOptions = function(obj, optionsObj, ignoreUndefinedProps)
{
	if (!optionsObj)
		return;

	for (var optionName in optionsObj)
	{
		if (ignoreUndefinedProps && optionsObj[optionName] == undefined)
			continue;
		obj[optionName] = optionsObj[optionName];
	}
};

Spry.Utils.SelectionManager = {};
Spry.Utils.SelectionManager.selectionGroups = new Object;

Spry.Utils.SelectionManager.SelectionGroup = function()
{
	this.selectedElements = new Array;
};

Spry.Utils.SelectionManager.SelectionGroup.prototype.select = function(element, className, multiSelect)
{
	var selObj = null;

	if (!multiSelect)
	{
		// Multiple selection is not enabled, so clear any
		// selected elements from our list.

		this.clearSelection();
	}
	else
	{
		// Multiple selection is enabled, so check to see if element
		// is already in the array. If it is, make sure the className
		// is the className that was passed in.

		for (var i = 0; i < this.selectedElements.length; i++)
		{
			selObj = this.selectedElements[i].element;

			if (selObj.element == element)
			{
				if (selObj.className != className)
				{
					Spry.Utils.removeClassName(element, selObj.className);
					Spry.Utils.addClassName(element, className);
				}
				return;
			}
		}
	}

	// Add the element to our list of selected elements.

	selObj = new Object;
	selObj.element = element;
	selObj.className = className;
	this.selectedElements.push(selObj);
	Spry.Utils.addClassName(element, className);
};

Spry.Utils.SelectionManager.SelectionGroup.prototype.unSelect = function(element)
{
	for (var i = 0; i < this.selectedElements.length; i++)
	{
		var selObj = this.selectedElements[i].element;
	
		if (selObj.element == element)
		{
			Spry.Utils.removeClassName(selObj.element, selObj.className);
			return;
		}
	}
};

Spry.Utils.SelectionManager.SelectionGroup.prototype.clearSelection = function()
{
	var selObj = null;

	do
	{
		selObj = this.selectedElements.shift();
		if (selObj)
			Spry.Utils.removeClassName(selObj.element, selObj.className);
	}
	while (selObj);
};

Spry.Utils.SelectionManager.getSelectionGroup = function(selectionGroupName)
{
	if (!selectionGroupName)
		return null;

	var groupObj = Spry.Utils.SelectionManager.selectionGroups[selectionGroupName];

	if (!groupObj)
	{
		groupObj = new Spry.Utils.SelectionManager.SelectionGroup();
		Spry.Utils.SelectionManager.selectionGroups[selectionGroupName] = groupObj;
	}

	return groupObj;
};

Spry.Utils.SelectionManager.select = function(selectionGroupName, element, className, multiSelect)
{
	var groupObj = Spry.Utils.SelectionManager.getSelectionGroup(selectionGroupName);

	if (!groupObj)
		return;

	groupObj.select(element, className, multiSelect);
};

Spry.Utils.SelectionManager.unSelect = function(selectionGroupName, element)
{
	var groupObj = Spry.Utils.SelectionManager.getSelectionGroup(selectionGroupName);

	if (!groupObj)
		return;

	groupObj.unSelect(element, className);
};

Spry.Utils.SelectionManager.clearSelection = function(selectionGroupName)
{
	var groupObj = Spry.Utils.SelectionManager.getSelectionGroup(selectionGroupName);

	if (!groupObj)
		return;

	groupObj.clearSelection();
};

//////////////////////////////////////////////////////////////////////
//
// Define Prototype's $() convenience function.
//
//////////////////////////////////////////////////////////////////////

function $()
{
	var elements = new Array();
	
	for (var i = 0; i < arguments.length; i++)
	{
		var element = arguments[i];
		if (typeof element == 'string')
			element = document.getElementById(element);
		
		if (arguments.length == 1)
			return element;
		
		elements.push(element);
	}
	
	return elements;
}

Spry.Utils.Notifier = function()
{
	this.observers = [];
	this.suppressNotifications = 0;
};

Spry.Utils.Notifier.prototype.addObserver = function(observer)
{
	if (!observer)
		return;

	// Make sure the observer isn't already on the list.

	var len = this.observers.length;
	for (var i = 0; i < len; i++)
	{
		if (this.observers[i] == observer)
			return;
	}
	this.observers[len] = observer;
};

Spry.Utils.Notifier.prototype.removeObserver = function(observer)
{
	if (!observer)
		return;

	for (var i = 0; i < this.observers.length; i++)
	{
		if (this.observers[i] == observer)
		{
			this.observers.splice(i, 1);
			break;
		}
	}
};

Spry.Utils.Notifier.prototype.notifyObservers = function(methodName, data)
{
	if (!methodName)
		return;

	if (!this.suppressNotifications)
	{
		var len = this.observers.length;
		for (var i = 0; i < len; i++)
		{
			var obs = this.observers[i];
			if (obs)
			{
				if (typeof obs == "function")
					obs(methodName, this, data);
				else if (obs[methodName])
					obs[methodName](this, data);
			}
		}
	}
};

Spry.Utils.Notifier.prototype.enableNotifications = function()
{
	if (--this.suppressNotifications < 0)
	{
		this.suppressNotifications = 0;
		Spry.Debug.reportError("Unbalanced enableNotifications() call!\n");
	}
};

Spry.Utils.Notifier.prototype.disableNotifications = function()
{
	++this.suppressNotifications;
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Debug
//
//////////////////////////////////////////////////////////////////////

Spry.Debug = {};
Spry.Debug.enableTrace = true;
Spry.Debug.debugWindow = null;

Spry.Debug.createDebugWindow = function()
{
	if (!Spry.Debug.enableTrace || Spry.Debug.debugWindow)
		return;
	try
	{
		Spry.Debug.debugWindow = document.createElement("div");
		var div = Spry.Debug.debugWindow;
		div.style.fontSize = "12px";
		div.style.fontFamily = "console";
		div.style.position = "absolute";
		div.style.width = "400px";
		div.style.height = "300px";
		div.style.overflow = "auto";
		div.style.border = "solid 1px black";
		div.style.backgroundColor = "white";
		div.style.color = "black";
		div.style.bottom = "0px";
		div.style.right = "0px";
		// div.style.opacity = "0.5";
		// div.style.filter = "alpha(opacity=50)";
		div.setAttribute("id", "SpryDebugWindow");
		document.body.appendChild(Spry.Debug.debugWindow);
	}
	catch (e) {}
};

Spry.Debug.debugOut = function(str, bgColor)
{
	if (!Spry.Debug.debugWindow)
	{
		Spry.Debug.createDebugWindow();
		if (!Spry.Debug.debugWindow)
			return;
	}

	var d = document.createElement("div");
	if (bgColor)
		d.style.backgroundColor = bgColor;
	d.innerHTML = str;
	Spry.Debug.debugWindow.appendChild(d);	
};

Spry.Debug.trace = function(str)
{
	Spry.Debug.debugOut(str);
};

Spry.Debug.reportError = function(str)
{
	Spry.Debug.debugOut(str, "red");
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Data
//
//////////////////////////////////////////////////////////////////////

Spry.Data = {};
Spry.Data.regionsArray = {};

Spry.Data.initRegions = function(rootNode)
{
	if (!rootNode)
		rootNode = document.body;

	var lastRegionFound = null;

	var regions = Spry.Utils.getNodesByFunc(rootNode, function(node)
	{
		try
		{
			if (node.nodeType != 1 /* Node.ELEMENT_NODE */)
				return false;

			// Region elements must have an spryregion attribute with a
			// non-empty value. An id attribute is also required so we can
			// reference the region by name if necessary.

			var attrName = "spry:region";
			var attr = node.attributes.getNamedItem(attrName);
			if (!attr)
			{
				attrName = "spry:detailregion";
				attr = node.attributes.getNamedItem(attrName);
			}
			if (attr)
			{
				if (lastRegionFound)
				{
					var parent = node.parentNode;
					while (parent)
					{
						if (parent == lastRegionFound)
						{
							Spry.Debug.reportError("Found a nested " + attrName + " in the following markup. Nested regions are currently not supported.<br/><pre>" + Spry.Utils.encodeEntities(parent.innerHTML) + "</pre>");
							return false;
						}
						parent = parent.parentNode;
					}
				}

				if (attr.value)
				{
					attr = node.attributes.getNamedItem("id");
					if (!attr || !attr.value)
					{
						// The node is missing an id attribute so add one.
						node.setAttribute("id", "spryregion" + (++Spry.Data.initRegions.nextUniqueRegionID));
					}

					lastRegionFound = node;
					return true;
				}
				else
					Spry.Debug.reportError(attrName + " attributes require one or more data set names as values!");
			}
		}
		catch(e) {}
		return false;
	});

	var name, dataSets, i;
  
	for (i = 0; i < regions.length; i++)
	{
		var rgn = regions[i];

		var isDetailRegion = false;

		// Get the region name.
		name = rgn.attributes.getNamedItem("id").value;

		attr = rgn.attributes.getNamedItem("spry:region");
		if (!attr)
		{
			attr = rgn.attributes.getNamedItem("spry:detailregion");
			isDetailRegion = true;
		}

		if (!attr.value)
		{
			Spry.Debug.reportError("spry:region and spry:detailregion attributes require one or more data set names as values!");
			continue;
		}

		// Remove the spry:region or spry:detailregion attribute so it doesn't appear in
		// the output generated by our processing of the dynamic region.
		rgn.attributes.removeNamedItem(attr.nodeName);

		// Remove the hiddenRegionCSS class from the rgn.
		Spry.Utils.removeClassName(rgn, Spry.Data.Region.hiddenRegionClassName);

		// Get the DataSets that should be bound to the region.
		dataSets = Spry.Data.Region.strToDataSetsArray(attr.value);

		if (!dataSets.length)
		{
			Spry.Debug.reportError("spry:region or spry:detailregion attribute has no data set!");
			continue;
		}
	
		var hasBehaviorAttributes = false;
		var hasSpryContent = false;
		var dataStr = "";

		var parent = null;
		var regionStates = {};
		var regionStateMap = {};

		// Check if there are any attributes on the region node that remap
		// the default states.

		attr = rgn.attributes.getNamedItem("spry:readystate");
		if (attr && attr.value)
			regionStateMap["ready"] = attr.value;
		attr = rgn.attributes.getNamedItem("spry:errorstate");
		if (attr && attr.value)
			regionStateMap["error"] = attr.value;
		attr = rgn.attributes.getNamedItem("spry:loadingstate");
		if (attr && attr.value)
			regionStateMap["loading"] = attr.value;
		
		// Find all of the processing instruction regions in the region.
		// Insert comments around the regions we find so we can identify them
		// easily when tokenizing the region html string.

		var piRegions = Spry.Utils.getNodesByFunc(rgn, function(node)
		{
			try
			{
				if (node.nodeType == 1 /* ELEMENT_NODE */)
				{
					var attributes = node.attributes;
					var numPI = Spry.Data.Region.PI.orderedInstructions.length;
					var lastStartComment = null;
					var lastEndComment = null;

					for (var i = 0; i < numPI; i++)
					{
						var piName = Spry.Data.Region.PI.orderedInstructions[i];
						var attr = attributes.getNamedItem(piName);
						if (!attr)
							continue;
	
						var piDesc = Spry.Data.Region.PI.instructions[piName];
						var childrenOnly = (node == rgn) ? true : piDesc.childrenOnly;
						var openTag = piDesc.getOpenTag(node, piName);
						var closeTag = piDesc.getCloseTag(node, piName);
	
						if (childrenOnly)
						{
								var oComment = document.createComment(openTag);
								var cComment = document.createComment(closeTag)

								if (!lastStartComment)
									node.insertBefore(oComment, node.firstChild);
								else
									node.insertBefore(oComment, lastStartComment.nextSibling);
								lastStartComment = oComment;

								if (!lastEndComment)
									node.appendChild(cComment);
								else
									node.insertBefore(cComment, lastEndComment);
								lastEndComment = cComment;
						}
						else
						{
							var parent = node.parentNode;
							parent.insertBefore(document.createComment(openTag), node);
							parent.insertBefore(document.createComment(closeTag), node.nextSibling);
						}

						// If this is a spry:state processing instruction, record the state name
						// so we know that we should re-generate the region if we ever see that state.

						if (piName == "spry:state")
							regionStates[attr.value] = true;

						node.removeAttribute(piName);
					}

					if (Spry.Data.Region.enableBehaviorAttributes)
					{
						var bAttrs = Spry.Data.Region.behaviorAttrs;
						for (var behaviorAttrName in bAttrs)
						{
							var bAttr = attributes.getNamedItem(behaviorAttrName);
							if (bAttr)
							{
								hasBehaviorAttributes = true;
								if (bAttrs[behaviorAttrName].setup)
									bAttrs[behaviorAttrName].setup(node, bAttr.value);
							}
						}
					}
				}
			}
			catch(e) {}
			return false;
		});
	
		// Get the data in the region.
		dataStr = rgn.innerHTML;

		// Argh! IE has an innerHTML bug where it will remove the quotes around any
		// attribute value that it thinks is a single word. This includes removing quotes
		// around our data references which is problematic since a single data reference
		// can be replaced with multiple words. If we are running in IE, we have to call
		// fixUpIEInnerHTML to get around this problem.

		if (window.ActiveXObject && !Spry.Data.Region.disableIEInnerHTMLFixUp && dataStr.search(/=\{/) != -1)
		{
			if (Spry.Data.Region.debug)
				Spry.Debug.trace("<hr />Performing IE innerHTML fix up of Region: " + name + "<br /><br />" + Spry.Utils.encodeEntities(dataStr));

			dataStr = Spry.Utils.fixUpIEInnerHTML(dataStr);
		}

		if (Spry.Data.Region.debug)
			Spry.Debug.trace("<hr />Region template markup for '" + name + "':<br /><br />" + Spry.Utils.encodeEntities(dataStr));

		if (!hasSpryContent)
		{
			// Clear the region.
			rgn.innerHTML = "";
		}

		// Create a Spry.Data.Region object for this region.
		var region = new Spry.Data.Region(rgn, name, isDetailRegion, dataStr, dataSets, regionStates, regionStateMap, hasBehaviorAttributes);
		Spry.Data.regionsArray[region.name] = region;
	}

	Spry.Data.updateAllRegions();
};

Spry.Data.initRegions.nextUniqueRegionID = 0;

Spry.Data.updateRegion = function(regionName)
{
	if (!regionName || !Spry.Data.regionsArray || !Spry.Data.regionsArray[regionName])
		return;

	try { Spry.Data.regionsArray[regionName].updateContent(); }
	catch(e) { Spry.Debug.reportError("Spry.Data.updateRegion(" + regionName + ") caught an exception: " + e + "\n"); }
};

Spry.Data.getRegion = function(regionName)
{
	return Spry.Data.regionsArray[regionName];
};


Spry.Data.updateAllRegions = function()
{
	if (!Spry.Data.regionsArray)
		return;

	for (var regionName in Spry.Data.regionsArray)
		Spry.Data.updateRegion(regionName);
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Data.DataSet
//
//////////////////////////////////////////////////////////////////////

Spry.Data.DataSet = function()
{
	Spry.Utils.Notifier.call(this);

	this.name = "";
	this.internalID = Spry.Data.DataSet.nextDataSetID++;
	this.curRowID = 0;
	this.data = null;
	this.unfilteredData = null;
	this.dataHash = null;
	this.columnTypes = new Object;
	this.filterFunc = null;		// non-destructive filter function
	this.filterDataFunc = null;	// destructive filter function

	this.distinctOnLoad = false;
	this.sortOnLoad = null;
	this.sortOrderOnLoad = "ascending";
	this.keepSorted = false;

	this.dataWasLoaded = false;
	this.pendingRequest = null;

	this.lastSortColumns = [];
	this.lastSortOrder = "";

	this.loadIntervalID = 0;
};

Spry.Data.DataSet.prototype = new Spry.Utils.Notifier();
Spry.Data.DataSet.prototype.constructor = Spry.Data.DataSet;

Spry.Data.DataSet.prototype.getData = function(unfiltered)
{
	return (unfiltered && this.unfilteredData) ? this.unfilteredData : this.data;
};

Spry.Data.DataSet.prototype.getUnfilteredData = function()
{
	// XXX: Deprecated.
	return this.getData(true);
};

Spry.Data.DataSet.prototype.getLoadDataRequestIsPending = function()
{
	return this.pendingRequest != null;
};

Spry.Data.DataSet.prototype.getDataWasLoaded = function()
{
	return this.dataWasLoaded;
};

Spry.Data.DataSet.prototype.loadData = function()
{
	// The idea here is that folks using the base class DataSet directly
	// would change the data in the DataSet manually and then call loadData()
	// to fire off an async notifications to say that it was ready for consumption.
	//
	// Firing off data changed notificataions synchronously from this method
	// can wreak havoc with complicated master/detail regions that use data sets
	// that have master/detail relationships with other data sets. Our data set
	// logic already handles async data loading nicely so we use a timer to fire
	// off the data changed notification to insure that it happens after this
	// function is finished and the JS stack unwinds.
	//
	// Other classes that derive from this class and load data synchronously
	// inside their loadData() implementation should also fire off an async
	// notification in this same manner to avoid this same problem.

	var self = this;

	this.pendingRequest = new Object;
	this.dataWasLoaded = false;
	this.pendingRequest.timer = setTimeout(function()
	{
		self.pendingRequest = null;
		self.dataWasLoaded = true;

		if (self.filterDataFunc)
			self.filterData(self.filterDataFunc, true);

		if (self.distinctOnLoad)
			self.distinct();

		if (self.keepSorted && self.getSortColumn())
			self.sort(self.lastSortColumns, self.lastSortOrder)
		else if (self.sortOnLoad)
			self.sort(self.sortOnLoad, self.sortOrderOnLoad);
	
		if (self.filterFunc)
			self.filter(self.filterFunc, true);
	
		self.notifyObservers("onDataChanged");
	}, 0);  
};

Spry.Data.DataSet.prototype.cancelLoadData = function()
{
	if (this.pendingRequest && this.pendingRequest.timer)
		clearTimeout(this.pendingRequest.timer);
	this.pendingRequest = null;
};

Spry.Data.DataSet.prototype.getRowCount = function(unfiltered)
{
	var rows = this.getData(unfiltered);
	return rows ? rows.length : 0;
};

Spry.Data.DataSet.prototype.getRowByID = function(rowID)
{
	if (!this.data)
		return null;
	return this.dataHash[rowID];
};

Spry.Data.DataSet.prototype.getRowByRowNumber = function(rowNumber, unfiltered)
{
	var rows = this.getData(unfiltered);
	if (rows && rowNumber >= 0 && rowNumber < rows.length)
		return rows[rowNumber];
	return null;
};

Spry.Data.DataSet.prototype.getCurrentRow = function()
{
	return this.getRowByID(this.curRowID);
};

Spry.Data.DataSet.prototype.setCurrentRow = function(rowID)
{
	if (this.curRowID == rowID)
		return;

	var nData = { oldRowID: this.curRowID, newRowID: rowID };
	this.curRowID = rowID;
	this.notifyObservers("onCurrentRowChanged", nData);
};

Spry.Data.DataSet.prototype.getRowNumber = function(row)
{
	if (row && this.data && this.data.length)
	{
		var numRows = this.data.length;
		for (var i = 0; i < numRows; i++)
		{
			if (this.data[i] == row)
				return i;
		}
	}

	return 0;
};

Spry.Data.DataSet.prototype.getCurrentRowNumber = function()
{
	return this.getRowNumber(this.getCurrentRow());
};

Spry.Data.DataSet.prototype.setCurrentRowNumber = function(rowNumber)
{
	if (!this.data || rowNumber >= this.data.length)
	{
		Spry.Debug.trace("Invalid row number: " + rowNumber + "\n");
		return;
	}

	var rowID = this.data[rowNumber]["ds_RowID"];

	if (rowID == undefined || this.curRowID == rowID)
		return;

	this.setCurrentRow(rowID);
};

Spry.Data.DataSet.prototype.findRowsWithColumnValues = function(valueObj, firstMatchOnly, unfiltered)
{
	var results = [];
	var rows = this.getData(unfiltered);
	if (rows)
	{
		var numRows = rows.length;
		for (var i = 0; i < numRows; i++)
		{
			var row = rows[i];
			var matched = true;

			for (var colName in valueObj)
			{
				if (valueObj[colName] != row[colName])
				{
					matched = false;
					break;
				}
			}
			
			if (matched)
			{
				if (firstMatchOnly)
					return row;
				results.push(row);
			}
		}
	}

	return results;
};

Spry.Data.DataSet.prototype.setColumnType = function(columnName, columnType)
{
	if (columnName)
		this.columnTypes[columnName] = columnType;
};

Spry.Data.DataSet.prototype.getColumnType = function(columnName)
{
	if (this.columnTypes[columnName])
		return this.columnTypes[columnName];
	return "string";
};

Spry.Data.DataSet.prototype.distinct = function()
{
	if (this.data)
	{
		var oldData = this.data;
		this.data = [];
		this.dataHash = {};

		var alreadySeenHash = {};
		var i = 0;

		for (var i = 0; i < oldData.length; i++)
		{
			var rec = oldData[i];
			var hashStr = "";
			for (var recField in rec)
			{
				if (recField != "ds_RowID")
				{
					if (hashStr)
						hashStr += ",";
					hashStr += recField + ":" + "\"" + rec[recField] + "\"";
				}
			}
			if (!alreadySeenHash[hashStr])
			{
				this.data.push(rec);
				this.dataHash[rec['ds_RowID']] = rec;
				alreadySeenHash[hashStr] = true;
			}
		}
	}
};

Spry.Data.DataSet.prototype.getSortColumn = function() {
	return (this.lastSortColumns && this.lastSortColumns.length > 0) ? this.lastSortColumns[0] : "";
};

Spry.Data.DataSet.prototype.getSortOrder = function() {
	return this.lastSortOrder ? this.lastSortOrder : "";
};

Spry.Data.DataSet.prototype.sort = function(columnNames, sortOrder)
{
	// columnNames can be either the name of a column to
	// sort on, or an array of column names, but it can't be
	// null/undefined.

	if (!columnNames)
		return;

	// If only one column name was specified for sorting, do a
	// secondary sort on ds_RowID so we get a stable sort order.

	if (typeof columnNames == "string")
		columnNames = [ columnNames, "ds_RowID" ];
	else if (columnNames.length < 2 && columnNames[0] != "ds_RowID")
		columnNames.push("ds_RowID");

	if (!sortOrder)
		sortOrder = "toggle";

	if (sortOrder == "toggle")
	{
		if (this.lastSortColumns.length > 0 && this.lastSortColumns[0] == columnNames[0] && this.lastSortOrder == "ascending")
			sortOrder = "descending";
		else
			sortOrder = "ascending";
	}

	if (sortOrder != "ascending" && sortOrder != "descending")
	{
		Spry.Debug.reportError("Invalid sort order type specified: " + sortOrder + "\n");
		return;
	}

	var nData = {
		oldSortColumns: this.lastSortColumns,
		oldSortOrder: this.lastSortOrder,
		newSortColumns: columnNames,
		newSortOrder: sortOrder
	};
	this.notifyObservers("onPreSort", nData);

	var cname = columnNames[columnNames.length - 1];
	var sortfunc = Spry.Data.DataSet.prototype.sort.getSortFunc(cname, this.getColumnType(cname), sortOrder);

	for (var i = columnNames.length - 2; i >= 0; i--)
	{
		cname = columnNames[i];
		sortfunc = Spry.Data.DataSet.prototype.sort.buildSecondarySortFunc(Spry.Data.DataSet.prototype.sort.getSortFunc(cname, this.getColumnType(cname), sortOrder), sortfunc);
	}

	if (this.unfilteredData)
	{
		this.unfilteredData.sort(sortfunc);
		if (this.filterFunc)
			this.filter(this.filterFunc, true);
	}
	else
		this.data.sort(sortfunc);

	this.lastSortColumns = columnNames.slice(0); // Copy the array.
	this.lastSortOrder = sortOrder;

	this.notifyObservers("onPostSort", nData);
};

Spry.Data.DataSet.prototype.sort.getSortFunc = function(prop, type, order)
{
	var sortfunc = null;
	if (type == "number")
	{
		if (order == "ascending")
			sortfunc = function(a, b){ return a[prop]-b[prop]; };
		else // order == "descending"
			sortfunc = function(a, b){ return b[prop]-a[prop]; };
	}
	else if (type == "date")
	{
		if (order == "ascending")
			sortfunc = function(a, b)
			{
				var dA = a[prop];
				var dB = b[prop];			
				dA = dA ? (new Date(dA)) : 0;
				dB = dB ? (new Date(dB)) : 0;
				return dA - dB;
			};
		else // order == "descending"
			sortfunc = function(a, b)
			{
				var dA = a[prop];
				var dB = b[prop];			
				dA = dA ? (new Date(dA)) : 0;
				dB = dB ? (new Date(dB)) : 0;
				return dB - dA;
			};
	}
	else // type == "string"
	{
		if (order == "ascending")
			sortfunc = function(a, b){
				var tA = a[prop].toString();
				var tB = b[prop].toString();
				var tA_l = tA.toLowerCase();
				var tB_l = tB.toLowerCase();
				var min_len = tA.length > tB.length ? tB.length : tA.length;

				for (var i=0; i < min_len; i++){
					var a_l_c = tA_l.charAt(i);
					var b_l_c = tB_l.charAt(i);
					var a_c = tA.charAt(i);
					var b_c = tB.charAt(i);
					if (a_l_c > b_l_c){
							return 1;
					}else if (a_l_c < b_l_c){
						 return -1;
					}else if (a_c > b_c){
						 return 1;
					}else if (a_c < b_c){
						 return -1;
					}
				}
				if(tA.length == tB.length){
					return 0;
				}else if (tA.length > tB.length){
					return 1;
				}else{
					return -1;	
				}
			};
		else // order == "descending"
			sortfunc = function(a, b){
				var tA = a[prop].toString();
				var tB = b[prop].toString();
				var tA_l = tA.toLowerCase();
				var tB_l = tB.toLowerCase();
				var min_len = tA.length > tB.length ? tB.length : tA.length;
				for (var i=0; i < min_len; i++){
					var a_l_c = tA_l.charAt(i);
					var b_l_c = tB_l.charAt(i);
					var a_c = tA.charAt(i);
					var b_c = tB.charAt(i);
					if (a_l_c > b_l_c){
							return -1;
					}else if (a_l_c < b_l_c){
						 return 1;
					}else if (a_c > b_c){
						 return -1;
					}else if (a_c < b_c){
						 return 1;
					}
				}
				if(tA.length == tB.length){
					return 0;
				}else if (tA.length > tB.length){
					return -1;
				}else{
					return 1;	
				}
			};	
     }

	return sortfunc;
};

Spry.Data.DataSet.prototype.sort.buildSecondarySortFunc = function(funcA, funcB)
{
	return function(a, b)
	{
		var ret = funcA(a, b);
		if (ret == 0)
			ret = funcB(a, b);
		return ret;
	};
};

Spry.Data.DataSet.prototype.filterData = function(filterFunc, filterOnly)
{
	// This is a destructive filter function.
	
	var dataChanged = false;

	if (!filterFunc)
	{
		// Caller wants to remove the filter.

		this.filterDataFunc = null;
		dataChanged = true;
	}
	else
	{
		this.filterDataFunc = filterFunc;
		
		if (this.dataWasLoaded && ((this.unfilteredData && this.unfilteredData.length) || (this.data && this.data.length)))
		{
			if (this.unfilteredData)
			{
				this.data = this.unfilteredData;
				this.unfilteredData = null;
			}
	
			var oldData = this.data;
			this.data = [];
			this.dataHash = {};
	
			for (var i = 0; i < oldData.length; i++)
			{
				var newRow = filterFunc(this, oldData[i], i);
				if (newRow)
				{
					this.data.push(newRow);
					this.dataHash[newRow["ds_RowID"]] = newRow;
				}
			}
	
			dataChanged = true;
		}
	}

	if (dataChanged)
	{
		if (!filterOnly)
		{
			this.disableNotifications();
			if (this.filterFunc)
				this.filter(this.filterFunc, true);
			this.enableNotifications();
		}

		this.notifyObservers("onDataChanged");
	}
};

Spry.Data.DataSet.prototype.filter = function(filterFunc, filterOnly)
{
	// This is a non-destructive filter function.

	var dataChanged = false;

	if (!filterFunc)
	{
		if (this.filterFunc && this.unfilteredData)
		{
			// Caller wants to remove the filter. Restore the unfiltered
			// data and trigger a data changed notification.
	
			this.data = this.unfilteredData;
			this.unfilteredData = null;
			this.filterFunc = null;
			dataChanged = true;
		}
	}
	else
	{
		this.filterFunc = filterFunc;
		
		if (this.dataWasLoaded && (this.unfilteredData || (this.data && this.data.length)))
		{
			if (!this.unfilteredData)
				this.unfilteredData = this.data;
	
			var udata = this.unfilteredData;
			this.data = [];
	
			for (var i = 0; i < udata.length; i++)
			{
				var newRow = filterFunc(this, udata[i], i);
	
				if (newRow)
					this.data.push(newRow);
			}
	
			dataChanged = true;
		}
	}

	if (dataChanged)
		this.notifyObservers("onDataChanged");
};

Spry.Data.DataSet.prototype.startLoadInterval = function(interval)
{
	this.stopLoadInterval();
	if (interval > 0)
	{
		var self = this;
		this.loadInterval = interval;
		this.loadIntervalID = setInterval(function() { self.loadData(); }, interval);
	}
};

Spry.Data.DataSet.prototype.stopLoadInterval = function()
{
	if (this.loadIntervalID)
		clearInterval(this.loadIntervalID);
	this.loadInterval = 0;
	this.loadIntervalID = null;
};

Spry.Data.DataSet.nextDataSetID = 0;

//////////////////////////////////////////////////////////////////////
//
// Spry.Data.XMLDataSet
//
//////////////////////////////////////////////////////////////////////

Spry.Data.XMLDataSet = function(dataSetURL, dataSetPath, dataSetOptions)
{
	// Call the constructor for our DataSet base class so that
	// our base class properties get defined. We'll call setOptions
	// manually after we set up our XMLDataSet properties.

	Spry.Data.DataSet.call(this);
	
	// XMLDataSet Properties:

	this.url = dataSetURL;
	this.xpath = dataSetPath;
	this.doc = null;
	this.dataSetsForDataRefStrings = new Array;
	this.hasDataRefStrings = false;
	this.useCache = true;

	// Create a loadURL request object to store any load options
	// the caller specified. We'll fill in the URL at the last minute
	// before we make the actual load request because our URL needs
	// to be processed at the last possible minute in case it contains
	// data references.

	this.requestInfo = new Spry.Utils.loadURL.Request();
	this.requestInfo.extractRequestOptions(dataSetOptions, true);

	// If the caller wants to use "POST" to fetch the data, but didn't
	// provide the content type, default to x-www-form-urlencoded.

	if (this.requestInfo.method == "POST")
	{
		if (!this.requestInfo.headers)
			this.requestInfo.headers = {};
		if (!this.requestInfo.headers['Content-Type'])
			this.requestInfo.headers['Content-Type'] = "application/x-www-form-urlencoded; charset=UTF-8";
	}

	Spry.Utils.setOptions(this, dataSetOptions, true);
	
	this.recalculateDataSetDependencies();

	if (this.loadInterval > 0)
		this.startLoadInterval(this.loadInterval);
}; // End of Spry.Data.XMLDataSet() constructor.

Spry.Data.XMLDataSet.prototype = new Spry.Data.DataSet();
Spry.Data.XMLDataSet.prototype.constructor = Spry.Data.XMLDataSet;

Spry.Data.XMLDataSet.prototype.recalculateDataSetDependencies = function()
{
	this.hasDataRefStrings = false;

	if (!this.url)
		return;

	// Clear all old callbacks that may have been registered.

	var i = 0;
	for (i = 0; i < this.dataSetsForDataRefStrings.length; i++)
	{
		var ds = this.dataSetsForDataRefStrings[i];
		if (ds)
			ds.removeObserver(this);
	}

	// Now run through the strings that may contain data references and figure
	// out what data sets they require. Note that the data references in these
	// strings must be fully qualified with a data set name. (ex: {dsDataSetName::columnName})

	this.dataSetsForDataRefStrings = new Array();

	var regionStrs = [ this.url, this.xpath, this.requestInfo.postData ];

	// If postData exists, and is a string, we want to check it for data refs.
	var postData = this.requestInfo.postData;
	if (postData && (typeof postData) == "string")
		regionStrs.push(postData);

	var dsCount = 0;

	for (var n = 0; n < regionStrs.length; n++)
	{
		var tokens = Spry.Data.Region.getTokensFromStr(regionStrs[n]);

		for (i = 0; tokens && i < tokens.length; i++)
		{
			if (tokens[i].search(/{[^}:]+::[^}]+}/) != -1)
			{
				var dsName = tokens[i].replace(/^\{|::.*\}/g, "");
				var ds = null;
				if (!this.dataSetsForDataRefStrings[dsName])
				{
					try { ds = eval(dsName); } catch (e) { ds = null; }
	
					if (dsName && ds)
					{
						// The dataSetsForDataRefStrings array serves as both an
						// array of data sets and a hash lookup by name.

						this.dataSetsForDataRefStrings[dsName] = ds;
						this.dataSetsForDataRefStrings[dsCount++] = ds;
						this.hasDataRefStrings = true;
					}
				}
			}
		}
	}

	// Set up observers on any data sets our URL depends on.

	for (i = 0; i < this.dataSetsForDataRefStrings.length; i++)
	{
		var ds = this.dataSetsForDataRefStrings[i];
		ds.addObserver(this);
	}
};

Spry.Data.XMLDataSet.prototype.attemptLoadData = function()
{
	// We only want to trigger a load when all of our data sets have data!
	for (var i = 0; i < this.dataSetsForDataRefStrings.length; i++)
	{
		var ds = this.dataSetsForDataRefStrings[i];
		if (ds.getLoadDataRequestIsPending() || !ds.getDataWasLoaded())
			return;
	}

	this.loadData();
};

Spry.Data.XMLDataSet.prototype.onCurrentRowChanged = function(ds, data)
{
	this.attemptLoadData();
};

Spry.Data.XMLDataSet.prototype.onPostSort = function(ds, data)
{
	this.attemptLoadData();
};
			
Spry.Data.XMLDataSet.prototype.onDataChanged = function(ds, data)
{
	this.attemptLoadData();
};
			
Spry.Data.XMLDataSet.prototype.loadData = function()
{
	if (!this.url || !this.xpath)
		return;

	this.cancelLoadData();

	var url = this.url;
	var postData = this.requestInfo.postData;

	if (this.hasDataRefStrings)
	{
		var allDataSetsReady = true;

		for (var i = 0; i < this.dataSetsForDataRefStrings.length; i++)
		{
			var ds = this.dataSetsForDataRefStrings[i];
			if (ds.getLoadDataRequestIsPending())
				allDataSetsReady = false;
			else if (!ds.getDataWasLoaded())
			{
				// Kick off the load of this data set!
				ds.loadData();
				allDataSetsReady = false;
			}
		}

		// If our data sets aren't ready, just return. We'll
		// get called back to load our data when they are all
		// done.

		if (!allDataSetsReady)
			return;

		url = Spry.Data.Region.processDataRefString(null, this.url, this.dataSetsForDataRefStrings);
		if (!url)
			return;
			
		if (postData && (typeof postData) == "string")
			postData = Spry.Data.Region.processDataRefString(null, postData, this.dataSetsForDataRefStrings);
	}

	this.notifyObservers("onPreLoad");

	this.data = null;
	this.dataWasLoaded = false;
	this.unfilteredData = null;
	this.dataHash = null;
	this.curRowID = 0;

	// At this point the url should've been processed if it contained any
	// data references. Set the url of the requestInfo structure and pass it
	// to LoadManager.loadData().

	var req = this.requestInfo.clone();
	req.url = url;
	req.postData = postData;

	this.pendingRequest = new Object;
	this.pendingRequest.data = Spry.Data.XMLDataSet.LoadManager.loadData(req, this, this.useCache);
};

Spry.Data.XMLDataSet.prototype.cancelLoadData = function()
{
	if (this.pendingRequest)
	{
		Spry.Data.XMLDataSet.LoadManager.cancelLoadData(this.pendingRequest.data, this);
		this.pendingRequest = null;
	}
};

Spry.Data.XMLDataSet.prototype.getURL = function() { return this.url; };
Spry.Data.XMLDataSet.prototype.setURL = function(url, requestOptions)
{
	if (this.url == url)
		return;
	this.url = url;

	if (requestOptions)
		this.requestInfo.extractRequestOptions(requestOptions);

	this.cancelLoadData();
	this.recalculateDataSetDependencies();
	this.dataWasLoaded = false;
};
Spry.Data.XMLDataSet.prototype.getDocument = function() { return this.doc; };
Spry.Data.XMLDataSet.prototype.getXPath = function() { return this.xpath; };
Spry.Data.XMLDataSet.prototype.setXPath = function(path)
{
	if (this.xpath != path)
	{
		this.xpath = path;
		if (this.dataWasLoaded && this.doc)
			this.setDataFromDoc(this.doc);
	}
};

Spry.Data.XMLDataSet.prototype.setDataFromDoc = function(doc)
{
	this.pendingRequest = null;

	var rs = null;

	rs = Spry.Utils.getRecordSetFromXMLDoc(doc, Spry.Data.Region.processDataRefString(null, this.xpath, this.dataSetsForDataRefStrings));

	if (!rs)
	{
		Spry.Debug.reportError("Spry.Data.XMLDataSet.setDataFromDoc() failed to create dataSet '" + this.name + "'for '" + this.xpath + "' - " + this.url + "\n");
		return;
	}

	this.doc = rs.xmlDoc;
	this.data = rs.data;
	this.dataHash = rs.dataHash;
	this.dataWasLoaded = (this.doc != null);

	// If there is a data filter installed, run it.

	if (this.filterDataFunc)
		this.filterData(this.filterDataFunc, true);

	// If the distinct flag was set, run through all the records in the recordset
	// and toss out any that are duplicates.

	if (this.distinctOnLoad)
		this.distinct();

	// If sortOnLoad was set, sort the data based on the columns
	// specified in sortOnLoad.

	if (this.keepSorted && this.getSortColumn())
		this.sort(this.lastSortColumns, this.lastSortOrder)
	else if (this.sortOnLoad)
		this.sort(this.sortOnLoad, this.sortOrderOnLoad);

	// If there is a view filter installed, run it.

	if (this.filterFunc)
		this.filter(this.filterFunc, true);

	// The default "current" row is the first row of the data set.
	if (this.data && this.data.length > 0)
		this.curRowID = this.data[0]['ds_RowID'];
	else
		this.curRowID = 0;

	this.notifyObservers("onPostLoad");
	this.notifyObservers("onDataChanged");
};

Spry.Data.XMLDataSet.prototype.onRequestResponse = function(cachedRequest, req)
{
	this.setDataFromDoc(cachedRequest.doc);
};

Spry.Data.XMLDataSet.prototype.onRequestError = function(cachedRequest, req)
{
	this.notifyObservers("onLoadError", req);
	// Spry.Debug.reportError("Spry.Data.XMLDataSet.LoadManager.CachedRequest.loadDataCallback(" + req.xhRequest.status + ") failed to load: " + req.url + "\n");
};

Spry.Data.XMLDataSet.LoadManager = {};
Spry.Data.XMLDataSet.LoadManager.cache = [];

Spry.Data.XMLDataSet.LoadManager.CachedRequest = function(reqInfo)
{
	Spry.Utils.Notifier.call(this);

	this.reqInfo = reqInfo;
	this.doc = null;
	this.timer = null;
	this.state = Spry.Data.XMLDataSet.LoadManager.CachedRequest.NOT_LOADED;
};

Spry.Data.XMLDataSet.LoadManager.CachedRequest.prototype = new Spry.Utils.Notifier();
Spry.Data.XMLDataSet.LoadManager.CachedRequest.prototype.constructor = Spry.Data.XMLDataSet.LoadManager.CachedRequest;

Spry.Data.XMLDataSet.LoadManager.CachedRequest.NOT_LOADED      = 1;
Spry.Data.XMLDataSet.LoadManager.CachedRequest.LOAD_REQUESTED  = 2;
Spry.Data.XMLDataSet.LoadManager.CachedRequest.LOAD_FAILED     = 3;
Spry.Data.XMLDataSet.LoadManager.CachedRequest.LOAD_SUCCESSFUL = 4;

Spry.Data.XMLDataSet.LoadManager.CachedRequest.prototype.loadDataCallback = function(req)
{
	if (req.xhRequest.readyState != 4)
		return;

	var xmlDoc = req.xhRequest.responseXML;

	if (req.xhRequest.status != 200)
	{
		if (req.xhRequest.status == 0)
		{
			// The page that is attempting to load data was probably loaded with
			// a file:// url. Mozilla based browsers will actually provide the complete DOM
			// tree for the data, but IE provides an empty document node so try to parse
			// the xml text manually to create a dom tree we can use.

			if (req.xhRequest.responseText && (!xmlDoc || !xmlDoc.firstChild))
				xmlDoc = Spry.Utils.stringToXMLDoc(req.xhRequest.responseText);
		}
	}

	if (!xmlDoc  || !xmlDoc.firstChild || xmlDoc.firstChild.nodeName == "parsererror")
	{
		this.state = Spry.Data.XMLDataSet.LoadManager.CachedRequest.LOAD_FAILED;
		this.notifyObservers("onRequestError", req);
		this.observers.length = 0; // Clear the observers list.
		return;
	}

	this.doc = xmlDoc;
	this.state = Spry.Data.XMLDataSet.LoadManager.CachedRequest.LOAD_SUCCESSFUL;

	// Notify all of the cached request's observers!
	this.notifyObservers("onRequestResponse", req);

	// Clear the observers list.
	this.observers.length = 0;
};

Spry.Data.XMLDataSet.LoadManager.CachedRequest.prototype.loadData = function()
{
	// IE will synchronously fire our loadDataCallback() during the call
	// to an async Spry.Utils.loadURL() if the data for the url is already
	// in the browser's local cache. This can wreak havoc with complicated master/detail
	// regions that use data sets that have master/detail relationships with other
	// data sets. Our data set logic already handles async data loading nicely so we
	// use a timer to fire off the async Spry.Utils.loadURL() call to insure that any
	// data loading happens asynchronously after this function is finished.

	var self = this;
	this.cancelLoadData();
	this.doc = null;
	this.state = Spry.Data.XMLDataSet.LoadManager.CachedRequest.LOAD_REQUESTED;

	var reqInfo = this.reqInfo.clone();
	reqInfo.successCallback = function(req) { self.loadDataCallback(req); };
	reqInfo.errorCallback = reqInfo.successCallback;

	this.timer = setTimeout(function()
	{
		self.timer = null;
		Spry.Utils.loadURL(reqInfo.method, reqInfo.url, reqInfo.async, reqInfo.successCallback, reqInfo);
	}, 0);  
};

Spry.Data.XMLDataSet.LoadManager.CachedRequest.prototype.cancelLoadData = function()
{
	if (this.state == Spry.Data.XMLDataSet.LoadManager.CachedRequest.LOAD_REQUESTED)
	{
		if (this.timer)
		{
			this.timer.clearTimeout();
			this.timer = null;
		}

		this.doc = null;
		this.state = Spry.Data.XMLDataSet.LoadManager.CachedRequest.NOT_LOADED;
	}
};

Spry.Data.XMLDataSet.LoadManager.getCacheKey = function(reqInfo)
{
	return reqInfo.method + "::" + reqInfo.url + "::" + reqInfo.postData + "::" + reqInfo.username;
};

Spry.Data.XMLDataSet.LoadManager.loadData = function(reqInfo, ds, useCache)
{
	if (!reqInfo)
		return null;

	var cacheObj = null;
	var cacheKey = null;

	if (useCache)
	{
		cacheKey = Spry.Data.XMLDataSet.LoadManager.getCacheKey(reqInfo);
		cacheObj = Spry.Data.XMLDataSet.LoadManager.cache[cacheKey];
	}

	if (cacheObj)
	{
		if (cacheObj.state == Spry.Data.XMLDataSet.LoadManager.CachedRequest.LOAD_REQUESTED)
		{
			if (ds)
				cacheObj.addObserver(ds);
			return cacheObj;
		}
		else if (cacheObj.state == Spry.Data.XMLDataSet.LoadManager.CachedRequest.LOAD_SUCCESSFUL)
		{
			// Data is already cached so if we have a data set, trigger an async call
			// that tells it to load its data.
			if (ds)
				setTimeout(function() { ds.setDataFromDoc(cacheObj.doc); }, 0);
			return cacheObj;
		}
	}

	// We're either loading this url for the first time, or an error occurred when
	// we last tried to load it, or the caller requested a forced load.

	if (!cacheObj)
	{
		cacheObj = new Spry.Data.XMLDataSet.LoadManager.CachedRequest(reqInfo);
		if (useCache)
		{
			Spry.Data.XMLDataSet.LoadManager.cache[cacheKey] = cacheObj;

			// Add an observer that will remove the cacheObj from the cache
			// if there is a load request failure.
			cacheObj.addObserver({ onRequestError: function() { Spry.Data.XMLDataSet.LoadManager.cache[cacheKey] = undefined; }});
		}
	}

	if (ds)
		cacheObj.addObserver(ds);

	cacheObj.loadData();

	return cacheObj;
};

Spry.Data.XMLDataSet.LoadManager.cancelLoadData = function(cacheObj, ds)
{
	if (cacheObj)
	{
		if (ds)
			cacheObj.removeObserver(ds);
		else
			cacheObj.cancelLoadData();
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Data.Region
//
//////////////////////////////////////////////////////////////////////
 
Spry.Data.Region = function(regionNode, name, isDetailRegion, data, dataSets, regionStates, regionStateMap, hasBehaviorAttributes)
{
	this.regionNode = regionNode;
	this.name = name;
	this.isDetailRegion = isDetailRegion;
	this.data = data;
	this.dataSets = dataSets;
	this.hasBehaviorAttributes = hasBehaviorAttributes;
	this.tokens = null;
	this.currentState = null;
	this.states = { ready: true };
	this.stateMap = {};

	Spry.Utils.setOptions(this.states, regionStates);
	Spry.Utils.setOptions(this.stateMap, regionStateMap);

	// Add the region as an observer to the dataSet!
	for (var i = 0; i < this.dataSets.length; i++)
	{
		var ds = this.dataSets[i];

		try 
		{
			if (ds)
				ds.addObserver(this);
		}
		catch(e) { Spry.Debug.reportError("Failed to add '" + this.name + "' as a dataSet observer!\n"); }
	}
}; // End of Spry.Data.Region() constructor.

Spry.Data.Region.hiddenRegionClassName = "SpryHiddenRegion";
Spry.Data.Region.evenRowClassName = "even";
Spry.Data.Region.oddRowClassName = "odd";
Spry.Data.Region.notifiers = {};
Spry.Data.Region.evalScripts = true;

Spry.Data.Region.addObserver = function(regionID, observer)
{
	var n = Spry.Data.Region.notifiers[regionID];
	if (!n)
	{
		n = new Spry.Utils.Notifier();
		Spry.Data.Region.notifiers[regionID] = n;
	}
	n.addObserver(observer);
};

Spry.Data.Region.removeObserver = function(regionID, observer)
{
	var n = Spry.Data.Region.notifiers[regionID];
	if (n)
		n.removeObserver(observer);
};

Spry.Data.Region.notifyObservers = function(methodName, region, data)
{
	var n = Spry.Data.Region.notifiers[region.name];
	if (n)
	{
		var dataObj = {};
		if (data && typeof data == "object")
			dataObj = data;
		else
			dataObj.data = data;

		dataObj.region = region;
		dataObj.regionID = region.name;
		dataObj.regionNode = region.regionNode;

		n.notifyObservers(methodName, dataObj);
	}
};

Spry.Data.Region.RS_Error = 0x01;
Spry.Data.Region.RS_LoadingData = 0x02;
Spry.Data.Region.RS_PreUpdate = 0x04;
Spry.Data.Region.RS_PostUpdate = 0x08;

Spry.Data.Region.prototype.getState = function()
{
	return this.currentState;
};

Spry.Data.Region.prototype.mapState = function(stateName, newStateName)
{
	this.stateMap[stateName] = newStateName;
};

Spry.Data.Region.prototype.getMappedState = function(stateName)
{
	var mappedState = this.stateMap[stateName];
	return mappedState ? mappedState : stateName;
};

Spry.Data.Region.prototype.setState = function(stateName, suppressNotfications)
{
	var stateObj = { state: stateName, mappedState: this.getMappedState(stateName) };
	if (!suppressNotfications)
		Spry.Data.Region.notifyObservers("onPreStateChange", this, stateObj);

	this.currentState = stateObj.mappedState ? stateObj.mappedState : stateName;

	// If the region has content that is specific to this
	// state, regenerate the region so that its markup is updated.

	if (this.states[stateName])
	{
		if (!suppressNotfications)
			Spry.Data.Region.notifyObservers("onPreUpdate", this, { state: this.currentState });
	
		// Make the region transform the xml data. The result is
		// a string that we need to parse and insert into the document.
		var str = this.transform();
	
		// Clear out any previous transformed content.
		// this.clearContent();
	
		if (Spry.Data.Region.debug)
			Spry.Debug.trace("<hr />Generated region markup for '" + this.name + "':<br /><br />" + Spry.Utils.encodeEntities(str));

		// Now insert the new transformed content into the document.
		Spry.Utils.setInnerHTML(this.regionNode, str, !Spry.Data.Region.evalScripts);
	
		// Now run through the content looking for attributes
		// that tell us what behaviors to attach to each element.
		if (this.hasBehaviorAttributes)
			this.attachBehaviors();
	
		if (!suppressNotfications)
			Spry.Data.Region.notifyObservers("onPostUpdate", this, { state: this.currentState });
	}

	if (!suppressNotfications)
		Spry.Data.Region.notifyObservers("onPostStateChange", this, stateObj);
};

Spry.Data.Region.prototype.getDataSets = function()
{
	return this.dataSets;
};

Spry.Data.Region.prototype.addDataSet = function(aDataSet)
{
	if (!aDataSet)
		return;

	if (!this.dataSets)
		this.dataSets = new Array;

	// Check to see if the data set is already in our list.

	for (var i = 0; i < this.dataSets.length; i++)
	{
		if (this.dataSets[i] == aDataSet)
			return; // It's already in our list!
	}

	this.dataSets.push(aDataSet);
	aDataSet.addObserver(this);
};

Spry.Data.Region.prototype.removeDataSet = function(aDataSet)
{
	if (!aDataSet || this.dataSets)
		return;

	for (var i = 0; i < this.dataSets.length; i++)
	{
		if (this.dataSets[i] == aDataSet)
		{
			this.dataSets.splice(i, 1);
			aDataSet.removeObserver(this);
			return;
		}
	}
};

Spry.Data.Region.prototype.onPreLoad = function(dataSet)
{
	if (this.currentState != "loading")
		this.setState("loading");
};

Spry.Data.Region.prototype.onLoadError = function(dataSet)
{
	if (this.currentState != "error")
		this.setState("error");
	Spry.Data.Region.notifyObservers("onError", this);
};

Spry.Data.Region.prototype.onCurrentRowChanged = function(dataSet, data)
{
	if (this.isDetailRegion)
		this.updateContent();
};

Spry.Data.Region.prototype.onPostSort = function(dataSet, data)
{
	this.updateContent();
};

Spry.Data.Region.prototype.onDataChanged = function(dataSet, data)
{
	this.updateContent();
};

Spry.Data.Region.enableBehaviorAttributes = true;
Spry.Data.Region.behaviorAttrs = {};

Spry.Data.Region.behaviorAttrs["spry:select"] =
{
	attach: function(rgn, node, value)
	{
		var selectGroupName = null;
		try { selectGroupName = node.attributes.getNamedItem("spry:selectgroup").value; } catch (e) {}
		if (!selectGroupName)
			selectGroupName = "default";

		Spry.Utils.addEventListener(node, "click", function(event) { Spry.Utils.SelectionManager.select(selectGroupName, node, value); }, false);
		
		if (node.attributes.getNamedItem("spry:selected"))
			Spry.Utils.SelectionManager.select(selectGroupName, node, value);
	}
};

Spry.Data.Region.behaviorAttrs["spry:hover"] =
{
	attach: function(rgn, node, value)
	{
		Spry.Utils.addEventListener(node, "mouseover", function(event){ Spry.Utils.addClassName(node, value); }, false);
		Spry.Utils.addEventListener(node, "mouseout", function(event){ Spry.Utils.removeClassName(node, value); }, false);
	}
};

Spry.Data.Region.setUpRowNumberForEvenOddAttr = function(node, attr, value, rowNumAttrName)
{
	// The format for the spry:even and spry:odd attributes are as follows:
	//
	// <div spry:even="dataSetName cssEvenClassName" spry:odd="dataSetName cssOddClassName">
	//
	// The dataSetName is optional, and if not specified, the first data set
	// listed for the region is used.
	//
	// cssEvenClassName and cssOddClassName are required and *must* be specified. They can be
	// any user defined CSS class name.

	if (!value)
	{
		Spry.Debug.showError("The " + attr + " attribute requires a CSS class name as its value!");
		node.attributes.removeNamedItem(attr);
		return;
	}

	var dsName = "";
	var valArr = value.split(/\s/);
	if (valArr.length > 1)
	{
		// Extract out the data set name and reset the attribute so
		// that it only contains the CSS class name to use.

		dsName = valArr[0];
		node.setAttribute(attr, valArr[1]);
	}

	// Tag the node with an attribute that will allow us to fetch the row
	// number used when it is written out during the re-generation process.

	node.setAttribute(rowNumAttrName, "{" + (dsName ? (dsName + "::") : "") + "ds_RowNumber}");
};

Spry.Data.Region.behaviorAttrs["spry:even"] =
{
	setup: function(node, value)
	{
		Spry.Data.Region.setUpRowNumberForEvenOddAttr(node, "spry:even", value, "spryevenrownumber");
	},

	attach: function(rgn, node, value)
	{
		if (value)
		{
			rowNumAttr = node.attributes.getNamedItem("spryevenrownumber");
			if (rowNumAttr && rowNumAttr.value)
			{
				var rowNum = parseInt(rowNumAttr.value);
				if (rowNum % 2)
					Spry.Utils.addClassName(node, value);
			}
		}
		node.removeAttribute("spry:even");
		node.removeAttribute("spryevenrownumber");
	}
};

Spry.Data.Region.behaviorAttrs["spry:odd"] =
{
	setup: function(node, value)
	{
		Spry.Data.Region.setUpRowNumberForEvenOddAttr(node, "spry:odd", value, "spryoddrownumber");
	},

	attach: function(rgn, node, value)
	{
		if (value)
		{
			rowNumAttr = node.attributes.getNamedItem("spryoddrownumber");
			if (rowNumAttr && rowNumAttr.value)
			{
				var rowNum = parseInt(rowNumAttr.value);
				if (rowNum % 2 == 0)
					Spry.Utils.addClassName(node, value);
			}
		}
		node.removeAttribute("spry:odd");
		node.removeAttribute("spryoddrownumber");
	}
};

Spry.Data.Region.setRowAttrClickHandler = function(node, dsName, rowAttr, funcName)
{
		if (dsName)
		{
			var ds = null;
			try { ds = Spry.Utils.eval(dsName); } catch(e) { ds = null; };
			if (ds)
			{
				rowIDAttr = node.attributes.getNamedItem(rowAttr);
				if (rowIDAttr)
				{
					var rowAttrVal = rowIDAttr.value;
					if (rowAttrVal)
						Spry.Utils.addEventListener(node, "click", function(event){ ds[funcName](rowAttrVal); }, false);
				}
			}
		}
};

Spry.Data.Region.behaviorAttrs["spry:setrow"] =
{
	setup: function(node, value)
	{
		if (!value)
		{
			Spry.Debug.reportError("The spry:setrow attribute requires a data set name as its value!");
			node.removeAttribute("spry:setrow");
			return;
		}

		// Tag the node with an attribute that will allow us to fetch the id of the
		// row used when it is written out during the re-generation process.

		node.setAttribute("spryrowid", "{" + value + "::ds_RowID}");
	},

	attach: function(rgn, node, value)
	{
		Spry.Data.Region.setRowAttrClickHandler(node, value, "spryrowid", "setCurrentRow");
		node.removeAttribute("spry:setrow");
		node.removeAttribute("spryrowid");
	}
};

Spry.Data.Region.behaviorAttrs["spry:setrownumber"] =
{
	setup: function(node, value)
	{
		if (!value)
		{
			Spry.Debug.reportError("The spry:setrownumber attribute requires a data set name as its value!");
			node.removeAttribute("spry:setrownumber");
			return;
		}

		// Tag the node with an attribute that will allow us to fetch the row number
		// of the row used when it is written out during the re-generation process.

		node.setAttribute("spryrownumber", "{" + value + "::ds_RowID}");
	},

	attach: function(rgn, node, value)
	{
		Spry.Data.Region.setRowAttrClickHandler(node, value, "spryrownumber", "setCurrentRowNumber");
		node.removeAttribute("spry:setrownumber");
		node.removeAttribute("spryrownumber");
	}
};

Spry.Data.Region.behaviorAttrs["spry:sort"] =
{
	attach: function(rgn, node, value)
	{
		if (!value)
			return;

		// The format of a spry:sort attribute is as follows:
		//
		// <div spry:sort="dataSetName column1Name column2Name ... sortOrderName">
		//
		// The dataSetName and sortOrderName are optional, but when specified, they
		// must appear in the order mentioned above. If the dataSetName is not specified,
		// the first data set listed for the region is used. If the sortOrderName is not
		// specified, the sort defaults to "toggle".
		//
		// The user *must* specify at least one column name.

		var ds = rgn.getDataSets()[0];
		var sortOrder = "toggle";

		var colArray = value.split(/\s/);
		if (colArray.length > 1)
		{
			// Check the first string in the attribute to see if a data set was
			// specified. If so, make sure we use it for the sort.

			try
			{
				var specifiedDS = eval(colArray[0]);
				if (specifiedDS && (typeof specifiedDS) == "object")
				{
					ds = specifiedDS;
					colArray.shift();
				}

			} catch(e) {}

			// Check to see if the last string in the attribute is the name of
			// a sort order. If so, use that sort order during the sort.

			if (colArray.length > 1)
			{
				var str = colArray[colArray.length - 1];
				if (str == "ascending" || str == "descending" || str == "toggle")
				{
					sortOrder = str;
					colArray.pop();
				}
			}
		}

		// If we have a data set and some column names, add a non-destructive
		// onclick handler that will perform a toggle sort on the data set.

		if (ds && colArray.length > 0)
			Spry.Utils.addEventListener(node, "click", function(event){ ds.sort(colArray, sortOrder); }, false);

		node.removeAttribute("spry:sort");
	}
};

Spry.Data.Region.prototype.attachBehaviors = function()
{
	var rgn = this;
	Spry.Utils.getNodesByFunc(this.regionNode, function(node)
	{
		if (!node || node.nodeType != 1 /* Node.ELEMENT_NODE */)
			return false;
		try
		{
			var bAttrs = Spry.Data.Region.behaviorAttrs;
			for (var bAttrName in bAttrs)
			{
				var attr = node.attributes.getNamedItem(bAttrName);
				if (attr)
				{
					var behavior = bAttrs[bAttrName];
					if (behavior && behavior.attach)
						behavior.attach(rgn, node, attr.value);
				}
			}
		} catch(e) {}

		return false;
	});
};

Spry.Data.Region.prototype.updateContent = function()
{
	var allDataSetsReady = true;

	var dsArray = this.getDataSets();

	if (!dsArray || dsArray.length < 1)
	{
		Spry.Debug.reportError("updateContent(): Region '" + this.name + "' has no data set!\n");
		return;
	}

	for (var i = 0; i < dsArray.length; i++)
	{
		var ds = dsArray[i];

		if (ds)
		{
			if (ds.getLoadDataRequestIsPending())
				allDataSetsReady = false;
			else if (!ds.getDataWasLoaded())
			{
				// Kick off the loading of the data if it hasn't happened yet.
				ds.loadData();
				allDataSetsReady = false;
			}
		}
	}

	if (!allDataSetsReady)
	{
		Spry.Data.Region.notifyObservers("onLoadingData", this);

		// Just return, this method will get called again automatically
		// as each data set load completes!
		return;
	}

	this.setState("ready");
};

Spry.Data.Region.prototype.clearContent = function()
{
	this.regionNode.innerHTML = "";
};

Spry.Data.Region.processContentPI = function(inStr)
{
	var outStr = "";
	var regexp = /<!--\s*<\/?spry:content\s*[^>]*>\s*-->/mg;
	var searchStartIndex = 0;
	var processingContentTag = 0;

	while (inStr.length)
	{
		var results = regexp.exec(inStr);
		if (!results || !results[0])
		{
			outStr += inStr.substr(searchStartIndex, inStr.length - searchStartIndex);
			break;
		}

		if (!processingContentTag && results.index != searchStartIndex)
		{
			// We found a match but it's not at the start of the inStr.
			// Create a string token for everything that precedes the match.
			outStr += inStr.substr(searchStartIndex, results.index - searchStartIndex);
		}

		if (results[0].search(/<\//) != -1)
		{
			--processingContentTag;
			if (processingContentTag)
				Spry.Debug.reportError("Nested spry:content regions are not allowed!\n");
		}
		else
		{
			++processingContentTag;
			var dataRefStr = results[0].replace(/.*\bdataref="/, "");
			outStr += dataRefStr.replace(/".*$/, "");
		}
		
		searchStartIndex = regexp.lastIndex;
	}

	return outStr;
}

Spry.Data.Region.prototype.tokenizeData = function(dataStr)
{
	// If there is no data, there's nothing to do.
	if (!dataStr)
		return null;

	var rootToken = new Spry.Data.Region.Token(Spry.Data.Region.Token.LIST_TOKEN, null, null, null);
	var tokenStack = new Array;
	var parseStr = Spry.Data.Region.processContentPI(dataStr);

	tokenStack.push(rootToken);

	// Create a regular expression that will match one of the following:
	//
	//   <spry:repeat select="regionName" test="true">
	//   </spry:repeat>
	//   {valueReference}
	var regexp = /((<!--\s*){0,1}<\/{0,1}spry:[^>]+>(\s*-->){0,1})|((\{|%7[bB])[^\}\s%]+(\}|%7[dD]))/mg;
	var searchStartIndex = 0;

	while(parseStr.length)
	{
		var results = regexp.exec(parseStr);
		var token = null;
		
		if (!results || !results[0])
		{
			// If we get here, the rest of the parseStr should be
			// just a plain string. Create a token for it and then
			// break out of the list.
			var str = parseStr.substr(searchStartIndex, parseStr.length - searchStartIndex);
			token = new Spry.Data.Region.Token(Spry.Data.Region.Token.STRING_TOKEN, null, str, str);
			tokenStack[tokenStack.length - 1].addChild(token);
			break;
		}

		if (results.index != searchStartIndex)
		{
			// We found a match but it's not at the start of the parseStr.
			// Create a string token for everything that precedes the match.
			var str = parseStr.substr(searchStartIndex, results.index - searchStartIndex);
			token = new Spry.Data.Region.Token(Spry.Data.Region.Token.STRING_TOKEN, null, str, str);
			tokenStack[tokenStack.length - 1].addChild(token);
		}

		// We found a string that needs to be turned into a token. Create a token
		// for it and then update parseStr for the next iteration.
		if (results[0].search(/^({|%7[bB])/) != -1 /* results[0].charAt(0) == '{' */)
		{
			var valueName = results[0];
			var regionStr = results[0];
			
			// Strip off brace and url encode brace chars inside the valueName.

			valueName = valueName.replace(/^({|%7[bB])/, "");
			valueName = valueName.replace(/(}|%7[dD])$/, "");

			// Check to see if our value begins with the name of a data set.
			// For example: {dataSet:tokenValue}. If it is, we need to save
			// the data set name so we know which data set to use to get the
			// value for the token during the region transform.

			var dataSetName = null;
			var splitArray = valueName.split(/::/);

			if (splitArray.length > 1)
			{
				dataSetName = splitArray[0];
				valueName = splitArray[1];
			}

			// Convert any url encoded braces to regular brace chars.

			regionStr = regionStr.replace(/^%7[bB]/, "{");
			regionStr = regionStr.replace(/%7[dD]$/, "}");

			// Now create a token for the placeholder.

			token = new Spry.Data.Region.Token(Spry.Data.Region.Token.VALUE_TOKEN, dataSetName, valueName, new String(regionStr));
			tokenStack[tokenStack.length - 1].addChild(token);
		}
		else if (results[0].charAt(0) == '<')
		{
			// Extract out the name of the processing instruction.
			var piName = results[0].replace(/^(<!--\s*){0,1}<\/?/, "");
			piName = piName.replace(/>(\s*-->){0,1}|\s.*$/, "");
			
			if (results[0].search(/<\//) != -1 /* results[0].charAt(1) == '/' */)
			{
				// We found a processing instruction close tag. Pop the top of the
				// token stack!
				//
				// XXX: We need to make sure that the close tag name matches the one
				//      on the top of the token stack!
				if (tokenStack[tokenStack.length - 1].tokenType != Spry.Data.Region.Token.PROCESSING_INSTRUCTION_TOKEN)
				{
					Spry.Debug.reportError("Invalid processing instruction close tag: " + piName + " -- " + results[0] + "\n");
					return null;
				}

				tokenStack.pop();
			}
			else
			{
				// Create the processing instruction token, add it as a child of the token
				// at the top of the token stack, and then push it on the stack so that it
				// becomes the parent of any tokens between it and its close tag.

				var piDesc = Spry.Data.Region.PI.instructions[piName];

				if (piDesc)
				{
					var dataSet = null;

					var selectedDataSetName = "";
					if (results[0].search(/^.*\bselect=\"/) != -1)
					{
						selectedDataSetName = results[0].replace(/^.*\bselect=\"/, "");
						selectedDataSetName = selectedDataSetName.replace(/".*$/, "");
	
						if (selectedDataSetName)
						{
							try
							{
								dataSet = eval(selectedDataSetName);
							}
							catch (e)
							{
								Spry.Debug.reportError("Caught exception in tokenizeData() while trying to retrieve data set (" + selectedDataSetName + "): " + e + "\n");
								dataSet = null;
								selectedDataSetName = "";
							}
						}
					}

					// Check if the repeat has a test attribute.
					var jsExpr = null;
					if (results[0].search(/^.*\btest=\"/) != -1)
					{
						jsExpr = results[0].replace(/^.*\btest=\"/, "");
						jsExpr = jsExpr.replace(/".*$/, "");
						jsExpr = Spry.Utils.decodeEntities(jsExpr);
					}

					// Check if the instruction has a state name specified.
					var regionState = null;
					if (results[0].search(/^.*\bname=\"/) != -1)
					{
						regionState = results[0].replace(/^.*\bname=\"/, "");
						regionState = regionState.replace(/".*$/, "");
						regionState = Spry.Utils.decodeEntities(regionState);
					}

					var piData = new Spry.Data.Region.Token.PIData(piName, selectedDataSetName, jsExpr, regionState);

					token = new Spry.Data.Region.Token(Spry.Data.Region.Token.PROCESSING_INSTRUCTION_TOKEN, dataSet, piData, new String(results[0]));

					tokenStack[tokenStack.length - 1].addChild(token);
					tokenStack.push(token);
				}
				else
				{
					Spry.Debug.reportError("Unsupported region processing instruction: " + results[0] + "\n");
					return null;
				}
			}
		}
		else
		{
			Spry.Debug.reportError("Invalid region token: " + results[0] + "\n");
			return null;
		}

		searchStartIndex = regexp.lastIndex;
	}

	return rootToken;
};

Spry.Data.Region.prototype.processTokenChildren = function(token, processContext)
{
	// The use of an array to gather the strings returned from processing
	// the child tokens is actually a performance enhancement for IE.
	// The original code:
	//
	//     for (var i = 0; i < token.children.length; i++)
	//       outputStr += this.processTokens(token.children[i], processContext);
	//
	// seemed to cause an n-square problem in IE. Using an array with
	// a final join reduced one of our test cases (SelectExample.html) from over
	// a minute to about 15 seconds.
	
	var strArr = [ "" ];
	var len = token.children.length;
	var children = token.children;
	
	for (var i = 0; i < len; i++)
		strArr.push(this.processTokens(children[i], processContext));

	return strArr.join("");
};

Spry.Data.Region.prototype.processTokens = function(token, processContext)
{
	if (!processContext)
	{
		processContext = new Spry.Data.Region.ProcessingContext(this);
		if (!processContext)
			return "";
	}

	var outputStr = "";
	var i = 0;

	switch(token.tokenType)
	{
		case Spry.Data.Region.Token.LIST_TOKEN:
			outputStr += this.processTokenChildren(token, processContext);
			break;
		case Spry.Data.Region.Token.STRING_TOKEN:
			outputStr += token.data;
			break;
		case Spry.Data.Region.Token.PROCESSING_INSTRUCTION_TOKEN:
			if (token.data.name == "spry:repeat")
			{
				var dataSet = null;

				if (token.dataSet)
					dataSet = token.dataSet;
				else
					dataSet = this.dataSets[0];

				if (dataSet)
				{
					var dsContext = processContext.getDataSetContext(dataSet);
					if (!dsContext)
					{
						Spry.Debug.reportError("processTokens() failed to get a data set context!\n");
						break;
					}

					var numRows = dsContext.getNumRows();
					var dataSetRows = dataSet.getData();
					dsContext.pushState();

					for (i = 0; i < numRows; i++)
					{
						dsContext.setRowIndex(i);
						var testVal = true;
						if (token.data.jsExpr)
						{
							var jsExpr = Spry.Data.Region.processDataRefString(processContext, token.data.jsExpr, null, true);
							try { testVal = Spry.Utils.eval(jsExpr); }
							catch(e)
							{
								Spry.Debug.trace("Caught exception in Spry.Data.Region.prototype.processTokens while evaluating: " + jsExpr + "\n    Exception:" + e + "\n");
								testVal = true;
							}
						}

						if (testVal)
							outputStr += this.processTokenChildren(token, processContext);
					}

					dsContext.popState();
				}
			}
			else if (token.data.name == "spry:if")
			{
				var testVal = true;
				
				if (token.data.jsExpr)
				{
					var jsExpr = Spry.Data.Region.processDataRefString(processContext, token.data.jsExpr, null, true);

					try { testVal = Spry.Utils.eval(jsExpr); }
					catch(e)
					{
						Spry.Debug.trace("Caught exception in Spry.Data.Region.prototype.processTokens while evaluating: " + jsExpr + "\n    Exception:" + e + "\n");
						testVal = true;
					}
				}
	
				if (testVal)
					outputStr += this.processTokenChildren(token, processContext);
			}
			else if (token.data.name == "spry:choose")
			{
				var defaultChild = null;
				var childToProcess = null;
				var testVal = false;
				var j = 0;

				// All of the children of the spry:choose token should be of the type spry:when or spry:default.
				// Run through all of the spry:when children and see if any of their test expressions return true.
				// If one does, then process its children tokens. If none of the test expressions return true,
				// process the spry:default token's children, if it exists.

				for (j = 0; j < token.children.length; j++)
				{
					var child = token.children[j];
					if (child.tokenType == Spry.Data.Region.Token.PROCESSING_INSTRUCTION_TOKEN)
					{
						if (child.data.name == "spry:when")
						{
							if (child.data.jsExpr)
							{
								var jsExpr = Spry.Data.Region.processDataRefString(processContext, child.data.jsExpr, null, true);
								try { testVal = Spry.Utils.eval(jsExpr); }
								catch(e)
								{
									Spry.Debug.trace("Caught exception in Spry.Data.Region.prototype.processTokens while evaluating: " + jsExpr + "\n    Exception:" + e + "\n");
									testVal = false;
								}

								if (testVal)
								{
									childToProcess = child;
									break;
								}
							}
						}
						else if (child.data.name == "spry:default")
							defaultChild = child;
					}
				}

				// If we didn't find a match, use the token for the default case.

				if (!childToProcess && defaultChild)
					childToProcess = defaultChild;

				if (childToProcess)
					outputStr += this.processTokenChildren(childToProcess, processContext);
			}
			else if (token.data.name == "spry:state")
			{
				var testVal = true;
				
				if (!token.data.regionState || token.data.regionState == this.currentState)
					outputStr += this.processTokenChildren(token, processContext);
			}
			else
			{
				Spry.Debug.reportError("processTokens(): Unknown processing instruction: " + token.data.name + "\n");
				return "";
			}
			break;
		case Spry.Data.Region.Token.VALUE_TOKEN:

			var dataSet = token.dataSet;
			if (!dataSet && this.dataSets && this.dataSets.length > 0 && this.dataSets[0])
			{
				// No dataSet was specified by the token, so use whatever the first
				// data set specified in the region.

				dataSet = this.dataSets[0];
			}
			if (!dataSet)
			{
				Spry.Debug.reportError("processTokens(): Value reference has no data set specified: " + token.regionStr + "\n");
				return "";
			}

			var dsContext = processContext.getDataSetContext(dataSet);
			if (!dsContext)
			{
				Spry.Debug.reportError("processTokens: Failed to get a data set context!\n");
				return "";
			}

			var ds = dsContext.getDataSet();

			if (token.data == "ds_RowNumber")
				outputStr += dsContext.getRowIndex();
			else if (token.data == "ds_RowNumberPlus1")
				outputStr += (dsContext.getRowIndex() + 1);
			else if (token.data == "ds_RowCount")
				outputStr += dsContext.getNumRows();
			else if (token.data == "ds_UnfilteredRowCount")
				outputStr += dsContext.getNumRows(true);
			else if (token.data == "ds_CurrentRowNumber")
				outputStr += ds.getRowNumber(ds.getCurrentRow());
			else if (token.data == "ds_CurrentRowID")
				outputStr += ds.curRowID;
			else if (token.data == "ds_EvenOddRow")
				outputStr += (dsContext.getRowIndex() % 2) ? Spry.Data.Region.evenRowClassName : Spry.Data.Region.oddRowClassName;
			else if (token.data == "ds_SortOrder")
				outputStr += ds.getSortOrder();
			else if (token.data == "ds_SortColumn")
				outputStr += ds.getSortColumn();
			else
			{
				var curDataSetRow = dsContext.getCurrentRow();
				if (curDataSetRow)
					outputStr += curDataSetRow[token.data];
			}
			break;
		default:
			Spry.Debug.reportError("processTokens(): Invalid token type: " + token.regionStr + "\n");
			break;
	}

	return outputStr;
};

Spry.Data.Region.prototype.transform = function()
{
	if (this.data && !this.tokens)
		this.tokens = this.tokenizeData(this.data);

	if (!this.tokens)
		return "";

	return this.processTokens(this.tokens, null);
};

Spry.Data.Region.PI = {};
Spry.Data.Region.PI.instructions = {};

Spry.Data.Region.PI.buildOpenTagForValueAttr = function(ele, piName, attrName)
{
	if (!ele || !piName)
		return "";

	var jsExpr = "";

	try
	{
		var testAttr = ele.attributes.getNamedItem(piName);
		if (testAttr && testAttr.value)
			jsExpr = Spry.Utils.encodeEntities(testAttr.value);
	}
	catch (e) { jsExpr = ""; }

	if (!jsExpr)
	{
		Spry.Debug.reportError(piName + " attribute requires a JavaScript expression that returns true or false!\n");
		return "";
	}

	return "<" + Spry.Data.Region.PI.instructions[piName].tagName + " " + attrName +"=\"" + jsExpr + "\">";
};

Spry.Data.Region.PI.buildOpenTagForTest = function(ele, piName)
{
	return Spry.Data.Region.PI.buildOpenTagForValueAttr(ele, piName, "test");
};

Spry.Data.Region.PI.buildOpenTagForState = function(ele, piName)
{
	return Spry.Data.Region.PI.buildOpenTagForValueAttr(ele, piName, "name");
};

Spry.Data.Region.PI.buildOpenTagForRepeat = function(ele, piName)
{
	if (!ele || !piName)
		return "";

	var selectAttrStr = "";

	try
	{
		var selectAttr = ele.attributes.getNamedItem(piName);
		if (selectAttr && selectAttr.value)
		{
			selectAttrStr = selectAttr.value;
			selectAttrStr = selectAttrStr.replace(/\s/g, "");
		}
	}
	catch (e) { selectAttrStr = ""; }

	if (!selectAttrStr)
	{
		Spry.Debug.reportError(piName + " attribute requires a data set name!\n");
		return "";
	}

	var testAttrStr = "";

	try
	{
		var testAttr = ele.attributes.getNamedItem("spry:test");
		if (testAttr)
		{
			if (testAttr.value)
				testAttrStr = " test=\"" + Spry.Utils.encodeEntities(testAttr.value) + "\"";
			ele.attributes.removeNamedItem(testAttr.nodeName);
		}
	}
	catch (e) { testAttrStr = ""; }

	return "<" + Spry.Data.Region.PI.instructions[piName].tagName + " select=\"" + selectAttrStr + "\"" + testAttrStr + ">";
};

Spry.Data.Region.PI.buildOpenTagForContent = function(ele, piName)
{
	if (!ele || !piName)
		return "";

	var dataRefStr = "";

	try
	{
		var contentAttr = ele.attributes.getNamedItem(piName);
		if (contentAttr && contentAttr.value)
			dataRefStr = Spry.Utils.encodeEntities(contentAttr.value);
	}
	catch (e) { dataRefStr = ""; }

	if (!dataRefStr)
	{
		Spry.Debug.reportError(piName + " attribute requires a data reference!\n");
		return "";
	}

	return "<" + Spry.Data.Region.PI.instructions[piName].tagName + " dataref=\"" + dataRefStr + "\">";
};

Spry.Data.Region.PI.buildOpenTag = function(ele, piName)
{
	return "<" + Spry.Data.Region.PI.instructions[piName].tagName + ">";
};

Spry.Data.Region.PI.buildCloseTag = function(ele, piName)
{
	return "</" + Spry.Data.Region.PI.instructions[piName].tagName + ">";
};

Spry.Data.Region.PI.instructions["spry:state"] = { tagName: "spry:state", childrenOnly: false, getOpenTag: Spry.Data.Region.PI.buildOpenTagForState, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:if"] = { tagName: "spry:if", childrenOnly: false, getOpenTag: Spry.Data.Region.PI.buildOpenTagForTest, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:repeat"] = { tagName: "spry:repeat", childrenOnly: false, getOpenTag: Spry.Data.Region.PI.buildOpenTagForRepeat, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:repeatchildren"] = { tagName: "spry:repeat", childrenOnly: true, getOpenTag: Spry.Data.Region.PI.buildOpenTagForRepeat, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:choose"] = { tagName: "spry:choose", childrenOnly: true, getOpenTag: Spry.Data.Region.PI.buildOpenTag, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:when"] = { tagName: "spry:when", childrenOnly: false, getOpenTag: Spry.Data.Region.PI.buildOpenTagForTest, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:default"] = { tagName: "spry:default", childrenOnly: false, getOpenTag: Spry.Data.Region.PI.buildOpenTag, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:content"] = { tagName: "spry:content", childrenOnly: true, getOpenTag: Spry.Data.Region.PI.buildOpenTagForContent, getCloseTag: Spry.Data.Region.PI.buildCloseTag };

Spry.Data.Region.PI.orderedInstructions = [ "spry:state", "spry:if", "spry:repeat", "spry:repeatchildren", "spry:choose", "spry:when", "spry:default", "spry:content" ];

Spry.Data.Region.getTokensFromStr = function(str)
{
	// XXX: This will need to be modified if we support
	// tokens that use javascript between the braces!
	if (!str)
		return null;
	return str.match(/{[^}]+}/g);
};

Spry.Data.Region.processDataRefString = function(processingContext, regionStr, dataSetsToUse, isJSExpr)
{
	if (!regionStr)
		return "";

	if (!processingContext && !dataSetsToUse)
		return regionStr;

	var resultStr = "";
	var re = new RegExp("\\{([^\\}:]+::)?[^\\}]+\\}", "g");
	var startSearchIndex = 0;

	while (startSearchIndex < regionStr.length)
	{
		var reArray = re.exec(regionStr);
		if (!reArray || !reArray[0])
		{
			resultStr += regionStr.substr(startSearchIndex, regionStr.length - startSearchIndex);
			return resultStr;
		}

		if (reArray.index != startSearchIndex)
			resultStr += regionStr.substr(startSearchIndex, reArray.index - startSearchIndex);

		var dsName = "";
		if (reArray[0].search(/^\{[^}:]+::/) != -1)
			dsName = reArray[0].replace(/^\{|::.*/g, "");

		var fieldName = reArray[0].replace(/^\{|.*::|\}/g, "");
		var row = null;

		if (processingContext)
		{
			var dsContext = processingContext.getDataSetContext(dsName);

			if (fieldName == "ds_RowNumber")
			{
				resultStr += dsContext.getRowIndex();
				row = null;
			}
			else if (fieldName == "ds_RowNumberPlus1")
			{
				resultStr += (dsContext.getRowIndex() + 1);
				row = null;
			}
			else if (fieldName == "ds_RowCount")
			{
				resultStr += dsContext.getNumRows();
				row = null;
			}
			else if (fieldName == "ds_UnfilteredRowCount")
			{
				resultStr += dsContext.getNumRows(true);
				row = null;
			}
			else if (fieldName == "ds_CurrentRowNumber")
			{
				var ds = dsContext.getDataSet();
				resultStr += ds.getRowNumber(ds.getCurrentRow());
				row = null;
			}
			else if (fieldName == "ds_CurrentRowID")
			{
				var ds = dsContext.getDataSet();
				resultStr += "" + ds.curRowID;
				row = null;
			}
			else if (fieldName == "ds_EvenOddRow")
			{
				resultStr += (dsContext.getRowIndex() % 2) ? Spry.Data.Region.evenRowClassName : Spry.Data.Region.oddRowClassName;
				row = null;
			}
			else if (fieldName == "ds_SortOrder")
			{
				resultStr += dsContext.getDataSet().getSortOrder();;
				row = null;
			}
			else if (fieldName == "ds_SortColumn")
			{
				resultStr += dsContext.getDataSet().getSortColumn();
				row = null;
			}
			else
				row = processingContext.getCurrentRowForDataSet(dsName);
		}
		else
		{
			var ds = dsName ? dataSetsToUse[dsName] : dataSetsToUse[0];
			if (ds)
				row = ds.getCurrentRow();
		}

		if (row)
			resultStr += isJSExpr ? Spry.Utils.escapeQuotesAndLineBreaks("" + row[fieldName]) : row[fieldName];

		if (startSearchIndex == re.lastIndex)
		{
			// On IE if there was a match near the end of the string, it sometimes
			// leaves re.lastIndex pointing to the value it had before the last time
			// we called re.exec. We check for this case to prevent an infinite loop!
			// We need to write out any text in regionStr that comes after the last
			// match.

			var leftOverIndex = reArray.index + reArray[0].length;
			if (leftOverIndex < regionStr.length)
				resultStr += regionStr.substr(leftOverIndex);

			break;
		}

		startSearchIndex = re.lastIndex;
	}

	return resultStr;
};

Spry.Data.Region.strToDataSetsArray = function(str, returnRegionNames)
{
	var dataSetsArr = new Array;
	var foundHash = {};

	if (!str)
		return dataSetsArr;

	str = str.replace(/\s+/g, " ");
	str = str.replace(/^\s|\s$/g, "");
	var arr = str.split(/ /);


	for (var i = 0; i < arr.length; i++)
	{
		if (arr[i] && !Spry.Data.Region.PI.instructions[arr[i]])
		{
			try {
				var dataSet = eval(arr[i]);

				if (!foundHash[arr[i]])
				{
					if (returnRegionNames)
						dataSetsArr.push(arr[i]);
					else
						dataSetsArr.push(dataSet);
					foundHash[arr[i]] = true;
				}
			}
			catch (e) { /* Spry.Debug.trace("Caught exception: " + e + "\n"); */ }
		}
	}

	return dataSetsArr;
};

Spry.Data.Region.DSContext = function(dataSet)
{
	var m_self = this;
	var m_dataSet = dataSet;
	var m_curRowIndexArray = [ -1 ]; // -1 means return whatever the current row is inside the data set.

	// Private Methods:

	function getInternalRowIndex() { return m_curRowIndexArray[m_curRowIndexArray.length - 1]; }

	// Public Methods:
	this.resetAll = function() { m_curRowIndexArray = [ m_dataSet.getCurrentRow() ] };
	this.getDataSet = function() { return m_dataSet; };
	this.getNumRows = function(unfiltered)
	{
		return m_dataSet.getRowCount(unfiltered);
	};
	this.getCurrentRow = function()
	{
		if (m_curRowIndexArray.length < 2 || getInternalRowIndex() < 0)
			return m_dataSet.getCurrentRow();
	
		var data = m_dataSet.getData();
		var curRowIndex = getInternalRowIndex();
	
		if (curRowIndex < 0 || curRowIndex > data.length)
		{
			Spry.Debug.reportError("Invalid index used in Spry.Data.Region.DSContext.getCurrentRow()!\n");
			return null;
		}
	
		return data[curRowIndex];
	};
	this.getRowIndex = function()
	{
		var curRowIndex = getInternalRowIndex();
		if (curRowIndex >= 0)
			return curRowIndex;

		return m_dataSet.getRowNumber(m_dataSet.getCurrentRow());
	};
	this.setRowIndex = function(rowIndex) { m_curRowIndexArray[m_curRowIndexArray.length - 1] = rowIndex; };
	this.pushState = function() { m_curRowIndexArray.push( getInternalRowIndex()); };
	this.popState = function()
	{
		if (m_curRowIndexArray.length < 2)
		{
			// Our array should always have at least one element in it!
			Spry.Debug.reportError("Stack underflow in Spry.Data.Region.DSContext.popState()!\n");
			return;
		}
		m_curRowIndexArray.pop();
	};
};

Spry.Data.Region.ProcessingContext = function(region)
{
	var m_self = this;
	var m_region = region;
	var m_dataSetContexts = [];
	
	if (region && region.dataSets)
	{
		for (var i = 0; i < region.dataSets.length; i++)
			m_dataSetContexts.push(new Spry.Data.Region.DSContext(region.dataSets[i]));
	}

	this.getDataSetContext = function(dataSet)
	{
		if (!dataSet)
		{
			// We were called without a specified data set or
			// data set name. Assume the caller wants the first
			// data set in the processing context.

			if (m_dataSetContexts.length > 0)
				return m_dataSetContexts[0];
			return null;
		}

		if (typeof dataSet == 'string')
		{
			try { dataSet = eval(dataSet); } catch (e) { dataSet = null; }
			if (!dataSet)
				return null;
		}
	
		for (var i = 0; i < m_dataSetContexts.length; i++)
		{
			var dsc = m_dataSetContexts[i];
			if (dsc.getDataSet() == dataSet)
				return dsc;
		}
	
		return null;
	};

	this.getCurrentRowForDataSet = function(dataSet)
	{
		var dsc = m_self.getDataSetContext(dataSet);
		if (dsc)
			return dsc.getCurrentRow();
		return null;
	};
};

Spry.Data.Region.Token = function(tokenType, dataSet, data, regionStr)
{
	var self = this;
	this.tokenType = tokenType;
	this.dataSet = dataSet;
	this.data = data;
	this.regionStr = regionStr;
	this.parent = null;
	this.children = null;
};

Spry.Data.Region.Token.prototype.addChild = function(child)
{
	if (!child)
		return;
	
	if (!this.children)
		this.children = new Array;
	
	this.children.push(child);
	child.parent = this;
};

Spry.Data.Region.Token.LIST_TOKEN                   = 0;
Spry.Data.Region.Token.STRING_TOKEN                 = 1;
Spry.Data.Region.Token.PROCESSING_INSTRUCTION_TOKEN = 2;
Spry.Data.Region.Token.VALUE_TOKEN                  = 3;

Spry.Data.Region.Token.PIData = function(piName, data, jsExpr, regionState)
{
	var self = this;
	this.name = piName;
	this.data = data;
	this.jsExpr = jsExpr;
	this.regionState = regionState;
};

Spry.Utils.addLoadListener(function() { setTimeout(function() { Spry.Data.initRegions(); }, 0); });
/* SpryXML.js - Revision: Spry Preview Release 1.4 */

// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry; if (!Spry) Spry = {}; if (!Spry.XML) Spry.XML = {}; if (!Spry.XML.Schema) Spry.XML.Schema = {};

Spry.XML.Schema.Node = function(nodeName)
{
	this.nodeName = nodeName;
	this.isAttribute = false;
	this.appearsMoreThanOnce = false;
	this.children = new Array;
};

Spry.XML.Schema.Node.prototype.toString = function (indentStr)
{
	if (!indentStr)
		indentStr = "";

	var str = indentStr + this.nodeName;

	if (this.appearsMoreThanOnce)
		str += " (+)";

	str += "\n";

	var newIndentStr = indentStr + "    ";

	for (var $childName in this.children)
	{
		var child = this.children[$childName];
		if (child.isAttribute)
			str += newIndentStr + child.nodeName + "\n";
		else
			str += child.toString(newIndentStr);
	}

	return str;
};

Spry.XML.Schema.mapElementIntoSchemaNode = function(ele, schemaNode)
{
	if (!ele || !schemaNode)
		return;

	// Add all attributes as children to schemaNode!

	var i = 0;
	for (i = 0; i < ele.attributes.length; i++)
	{
		var attr = ele.attributes.item(i);
		if (attr && attr.nodeType == 2 /* Node.ATTRIBUTE_NODE */)
		{
			var attrName = "@" + attr.name;

			// We don't track the number of times an attribute appears
			// in a given element so we only handle the case where the
			// attribute doesn't already exist in the schemaNode.children array.

			if (!schemaNode.children[attrName])
			{
				var attrObj = new Spry.XML.Schema.Node(attrName);
				attrObj.isAttribute = true;
				schemaNode.children[attrName] = attrObj;
			}
		}
	}

	// Now add all of element's element children as children of schemaNode!

	var child = ele.firstChild;
	var namesSeenSoFar = new Array;
  
	while (child)
	{
		if (child.nodeType == 1 /* Node.ELEMENT_NODE */)
		{
			var childSchemaNode = schemaNode.children[child.nodeName];

			if (!childSchemaNode)
			{
				childSchemaNode = new Spry.XML.Schema.Node(child.nodeName);
				if (childSchemaNode)
					schemaNode.children[child.nodeName] = childSchemaNode;
			}

			if (childSchemaNode)
			{
				if (namesSeenSoFar[childSchemaNode.nodeName])
					childSchemaNode.appearsMoreThanOnce = true;
				else
					namesSeenSoFar[childSchemaNode.nodeName] = true;
			}

			Spry.XML.Schema.mapElementIntoSchemaNode(child, childSchemaNode);
		}

		child = child.nextSibling;
	} 
};

Spry.XML.getSchemaForElement = function(ele)
{
	if (!ele)
		return null;

	schemaNode = new Spry.XML.Schema.Node(ele.nodeName);
	Spry.XML.Schema.mapElementIntoSchemaNode(ele, schemaNode);

	return schemaNode;
};

Spry.XML.getSchema = function(xmlDoc)
{
	if (!xmlDoc)
		return null;

	// Find the first element in the document that doesn't start with "xml".
	// According to the XML spec tags with names that start with "xml" are reserved
	// for future use.

	var node = xmlDoc.firstChild;

	while (node)
	{
		if (node.nodeType == 1 /* Node.ELEMENT_NODE */)
			break;

		node = node.nextSibling;
	}

	return Spry.XML.getSchemaForElement(node);
};

Spry.XML.nodeHasValue = function(node)
{
	if (node)
	{
		var child = node.firstChild;
		if (child && child.nextSibling == null && (child.nodeType == 3 /* Node.TEXT_NODE */ || child.nodeType == 4 /* CDATA_SECTION_NODE */))
			return true;
	}
	return false;
};

Spry.XML.XObject = function()
{
};

Spry.XML.XObject.prototype._value = function()
{
	var val = this["#text"];
	if (val != undefined)
		return val;
	return this["#cdata-section"];
};

Spry.XML.XObject.prototype._hasValue = function()
{
	return this._value() != undefined;
};

Spry.XML.XObject.prototype._valueIsText = function()
{
	return this["#text"] != undefined;
};

Spry.XML.XObject.prototype._valueIsCData = function()
{
	return this["#cdata-section"] != undefined;
};

Spry.XML.XObject.prototype._propertyIsArray = function(prop)
{
	var val = this[prop];
	if (val == undefined)
		return false;
	return (typeof val == "object" && val.constructor == Array);
};

Spry.XML.XObject.prototype._getPropertyAsArray = function(prop)
{
	var arr = [];
	var val = this[prop];
	if (val != undefined)
	{
		if (typeof val == "object" && val.constructor == Array)
			return val;
		arr.push(val);
	}
	return arr;
};

Spry.XML.XObject.prototype._getProperties = function()
{
	var props = [];
	for (var p in this)
	{
		if (!/^_/.test(p))
			props.push(p);
	}
	return props;
};

Spry.XML.nodeToObject = function(node)
{
	if (!node)
		return null;

	var obj = new Spry.XML.XObject();

	// Add all attributes as properties of the object.

	for (var i = 0; i < node.attributes.length; i++)
	{
		var attr = node.attributes[i];
		var attrName = "@" + attr.name;
		obj[attrName] = attr.value;
	}

	var child;

	if (Spry.XML.nodeHasValue(node))
	{	
		try
		{
			child = node.firstChild;

			if (child.nodeType == 3 /* TEXT_NODE */)
				obj[child.nodeName] = Spry.Utils.encodeEntities(child.data);
			else if (child.nodeType == 4 /* CDATA_SECTION_NODE */)
				obj[child.nodeName] = child.data;
		} catch (e) { Spry.Debug.reportError("Spry.XML.nodeToObject() exception caught: " + e + "\n"); }
	}
	else
	{
		// The node has no value, so run through any element children
		// it may have and add them as properties.

		child = node.firstChild;
		while (child)
		{
			if (child.nodeType == 1 /* Node.ELEMENT_NODE */)
			{
				var isArray = false;
				var tagName = child.nodeName;
				if (obj[tagName])
				{
					if (obj[tagName].constructor != Array)
					{
						var curValue = obj[tagName];
						obj[tagName] = new Array;
						obj[tagName].push(curValue);
					}
					isArray = true;
				}

				var childObj = Spry.XML.nodeToObject(child);
				
				if (isArray)
					obj[tagName].push(childObj);
				else
					obj[tagName] = childObj;
			}
			child = child.nextSibling;
		}
	}
	return obj;
};

// Spry.XML.documentToObject - Utility method for creating a
// JavaScript object with properties and nested objects that
// mirror an XML document tree structure.
//
// Sample XML:
//
//		<employees>
//			<employee id="1000">
//				<name>John Doe</name>
//			</employee>
//			<employee id="2000">
//				<name><![CDATA[Jane Smith]]></name>
//			</employee>
//		</employees>
//
// Object returned by documentToObject():
//
//		{
//			employees:
//				{
//					employee:
//						[
//							{
//								@id: "1000",
//								name: { "#text": "John Doe" }
//							},
//							{
//								@id: "2000",
//								name: { "#cdata-section": "Jane Smith" }
//							}
//						]
//				}
//		}

Spry.XML.documentToObject = function(xmlDoc)
{
	var obj = null;
	if (xmlDoc && xmlDoc.firstChild)
	{
		var child = xmlDoc.firstChild;
		while (child)
		{
			if (child.nodeType == 1 /* Node.ELEMENT_NODE */)
			{
				obj = new Spry.XML.XObject();
				obj[child.nodeName] = Spry.XML.nodeToObject(child);
				break;
			}
			child = child.nextSibling;
		}
	}
	return obj;
};
/* Spry.Effect.js - Revision: Spry Preview Release 1.4 */

// (version 0.21)
//
// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.



var Spry;

if (!Spry) Spry = {};

Spry.forwards = 1; // const
Spry.backwards = 2; // const

Spry.linearTransition = 1; // const
Spry.sinusoidalTransition = 2; // const

if (!Spry.Effect) Spry.Effect = {};

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Registry
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Registry = function()
{
	this.elements = new Array();

	_AnimatedElement = function (element) 
	{
		this.element = element;
		this.currentEffect = -1;
		this.effectArray = new Array();
	};
	
	this.AnimatedElement = _AnimatedElement;

};
 
Spry.Effect.Registry.prototype.getRegisteredEffect = function(element, effect) 
{
	var eleIdx = this.getIndexOfElement(element);

	if (eleIdx == -1)
	{
		this.elements[this.elements.length] = new this.AnimatedElement(element);
		eleIdx = this.elements.length - 1;
	}

	var foundEffectArrayIdx = -1;
	for (var i = 0; i < this.elements[eleIdx].effectArray.length; i++) 
	{
		if (this.elements[eleIdx].effectArray[i])
		{
			if (this.effectsAreTheSame(this.elements[eleIdx].effectArray[i], effect))
			{
				foundEffectArrayIdx = i;
				//this.elements[eleIdx].effectArray[i].reset();
				if (this.elements[eleIdx].effectArray[i].isRunning == true) {
					//Spry.Debug.trace('isRunning == true');
					this.elements[eleIdx].effectArray[i].cancel();
				}
				this.elements[eleIdx].currentEffect = i;
				if (this.elements[eleIdx].effectArray[i].options && (this.elements[eleIdx].effectArray[i].options.toggle != null)) {
					if (this.elements[eleIdx].effectArray[i].options.toggle == true)
						this.elements[eleIdx].effectArray[i].doToggle();
				} else { // same effect name (but no options or options.toggle field)
					this.elements[eleIdx].effectArray[i] = effect;
				}

				break;
			}
		}
	}

	if (foundEffectArrayIdx == -1) 
	{
		var currEffectIdx = this.elements[eleIdx].effectArray.length;
		this.elements[eleIdx].effectArray[currEffectIdx] = effect;
		this.elements[eleIdx].currentEffect = currEffectIdx;
	}

	var idx = this.elements[eleIdx].currentEffect;
	return this.elements[eleIdx].effectArray[idx];
}

Spry.Effect.Registry.prototype.getIndexOfElement = function(element)
{
	var registryIndex = -1;
	for (var i = 0; i < this.elements.length; i++)
	{
		if (this.elements[i]) {
			if (this.elements[i].element == element)
				registryIndex = i;
		}
	}
	return registryIndex;
}

Spry.Effect.Registry.prototype.effectsAreTheSame = function(effectA, effectB)
{
	if (effectA.name != effectB.name) 
		return false;

	if(effectA.effectsArray != null) // cluster effect
	{
		for (var i = 0; i < effectA.effectsArray.length; i++)
		{
			if(!Spry.Effect.Utils.optionsAreIdentical(effectA.effectsArray[i].effect.options, effectB.effectsArray[i].effect.options))
				return false;
		}
	}
	else // single effect
	{
		if(!Spry.Effect.Utils.optionsAreIdentical(effectA.options, effectB.options))
			return false;
	}

	return true;
}

var SpryRegistry = new Spry.Effect.Registry;

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Utils
//
//////////////////////////////////////////////////////////////////////

if (!Spry.Effect.Utils) Spry.Effect.Utils = {};

Spry.Effect.Utils.showError = function(msg)
{
	alert('Spry.Effect ERR: ' + msg);
}

Spry.Effect.Utils.Position = function()
{
	this.x = 0; // left
	this.y = 0; // top
	this.units = "px";
}

Spry.Effect.Utils.Rectangle = function()
{
	this.width = 0;
	this.height = 0;
	this.units = "px";
}

Spry.Effect.Utils.PositionedRectangle = function()
{
	this.position = new Spry.Effect.Utils.Position;
	this.rectangle = new Spry.Effect.Utils.Rectangle;
}

Spry.Effect.Utils.intToHex = function(integerNum) 
{
	var result = integerNum.toString(16);
	if (result.length == 1) 
		result = "0" + result;
	return result;
}

Spry.Effect.Utils.hexToInt = function(hexStr) 
{
	return parseInt(hexStr, 16); 
}

Spry.Effect.Utils.rgb = function(redInt, greenInt, blueInt) 
{
	
	var redHex = Spry.Effect.Utils.intToHex(redInt);
	var greenHex = Spry.Effect.Utils.intToHex(greenInt);
	var blueHex = Spry.Effect.Utils.intToHex(blueInt);
	compositeColorHex = redHex.concat(greenHex, blueHex);
	compositeColorHex = '#' + compositeColorHex;
	return compositeColorHex;
}

Spry.Effect.Utils.camelize = function(stringToCamelize)
{
    var oStringList = stringToCamelize.split('-');
	var isFirstEntry = true;
	var camelizedString = '';

	for(var i=0; i < oStringList.length; i++)
	{
		if(oStringList[i].length>0)
		{
			if(isFirstEntry)
			{
				camelizedString = oStringList[i];
				isFirstEntry = false;
			}
			else
			{
				var s = oStringList[i];
      			camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
			}
		}
	}

	return camelizedString;
}

Spry.Effect.Utils.isPercentValue = function(value) 
{
	var result = false;
	try
	{
		if (value.lastIndexOf("%") > 0)
			result = true;
	}
	catch (e) {}
	return result;
}

Spry.Effect.Utils.getPercentValue = function(value) 
{
	var result = 0;
	try
	{
		result = Number(value.substring(0, value.lastIndexOf("%")));
	}
	catch (e) {Spry.Effect.Utils.showError('Spry.Effect.Utils.getPercentValue: ' + e);}
	return result;
}

Spry.Effect.Utils.getPixelValue = function(value) 
{
	var result = 0;
	try
	{
		result = Number(value.substring(0, value.lastIndexOf("px")));
	}
	catch (e) {}
	return result;
}

Spry.Effect.Utils.getFirstChildElement = function(node)
{
	if (node)
	{
		var childCurr = node.firstChild;

		while (childCurr)
		{
			if (childCurr.nodeType == 1) // Node.ELEMENT_NODE
				return childCurr;

			childCurr = childCurr.nextSibling;
		}
	}

	return null;
};

Spry.Effect.Utils.fetchChildImages = function(startEltIn, targetImagesOut)
{
	if(!startEltIn  || startEltIn.nodeType != 1 || !targetImagesOut)
		return;

	if(startEltIn.hasChildNodes())
	{
		var childImages = startEltIn.getElementsByTagName('img')
		var imageCnt = childImages.length;
		for(var i=0; i<imageCnt; i++)
		{
			var imgCurr = childImages[i];
			var dimensionsCurr = Spry.Effect.getDimensions(imgCurr);
			targetImagesOut.push([imgCurr,dimensionsCurr.width,dimensionsCurr.height]);
		}
	}
}

Spry.Effect.Utils.optionsAreIdentical = function(optionsA, optionsB)
{
	if(optionsA == null && optionsB == null)
		return true;

	if(optionsA != null && optionsB != null)
	{
		var objectCountA = 0;
		var objectCountB = 0;

		for (var propA in optionsA) objectCountA++;
		for (var propB in optionsB) objectCountB++;

		if(objectCountA != objectCountB)
			return false;

		for (var prop in optionsA)
		{
			if (optionsA[prop] === undefined)
			{
				if(optionsB[prop] !== undefined)
					return false;
			}
			else if((optionsB[prop] === undefined) || (optionsA[prop] != optionsB[prop]))
			{
				return false;
			}
		}

		return true;
	}

	return false;
}

//////////////////////////////////////////////////////////////////////
//
// DHTML manipulation
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.getElement = function(ele)
{
	var element = null;
	if (ele && typeof ele == "string")
		element = document.getElementById(ele);
	else
		element = ele;
	if (element == null) Spry.Effect.Utils.showError('Element "' + ele + '" not found.');
	return element;
	
}

Spry.Effect.getStyleProp = function(element, prop)
{
	var value;

	try
	{
		value = element.style[Spry.Effect.Utils.camelize(prop)];
		if (!value)
		{
		/*
		    // Removed because call of 'getComputedStyle' causes problems
		    // on safari and opera (mac only). The function returns the
		    // correct value but it seems that there occurs a timing issue.

			if (document.defaultView && document.defaultView.getComputedStyle) {
				var css = document.defaultView.getComputedStyle(element, null);
				value = css ? css.getPropertyValue(prop) : null;
			} else
		*/
			if (element.currentStyle) {
				value = element.currentStyle[Spry.Effect.Utils.camelize(prop)];
			}
		}
	}
	catch (e) {Spry.Effect.Utils.showError('Spry.Effect.getStyleProp: ' + e);}

	return value == 'auto' ? null : value;
};

Spry.Effect.getStylePropRegardlessOfDisplayState = function(element, prop, displayElement)
{
	var refElement = displayElement ? displayElement : element;
	var displayOrig = Spry.Effect.getStyleProp(refElement, 'display');
	var visibilityOrig = Spry.Effect.getStyleProp(refElement, 'visibility');

	if(displayOrig == 'none')
	{
		Spry.Effect.setStyleProp(refElement, 'visibility', 'hidden');
		Spry.Effect.setStyleProp(refElement, 'display', 'block');
	
		if(window.opera) // opera needs focus to calculate the size for hidden elements
			refElement.focus();
	}

	var styleProp = Spry.Effect.getStyleProp(element, prop);

	if(displayOrig == 'none') // reset the original values
	{
		Spry.Effect.setStyleProp(refElement, 'display', 'none');
		Spry.Effect.setStyleProp(refElement, 'visibility', visibilityOrig);
	}

	return styleProp;
};

Spry.Effect.setStyleProp = function(element, prop, value)
{
	try
	{
		element.style[Spry.Effect.Utils.camelize(prop)] = value;
	}
	catch (e) {Spry.Effect.Utils.showError('Spry.Effect.setStyleProp: ' + e);}

	return null;
};

Spry.Effect.makePositioned = function(element)
{
	var pos = Spry.Effect.getStyleProp(element, 'position');
	if (!pos || pos == 'static') {
		element.style.position = 'relative';

		// Opera returns the offset relative to the positioning context, when an
		// element is position relative but top and left have not been defined
		if (window.opera) {
			element.style.top = 0;
			element.style.left = 0;
		}
	}
}

Spry.Effect.isInvisible = function(element)
{
	var propDisplay = Spry.Effect.getStyleProp(element, 'display');
	if (propDisplay && propDisplay.toLowerCase() == 'none')
		return true;

	var propVisible = Spry.Effect.getStyleProp(element, 'visibility');
	if (propVisible && propVisible.toLowerCase() == 'hidden')
		return true;

	return false;
}

Spry.Effect.enforceVisible = function(element)
{
	var propDisplay = Spry.Effect.getStyleProp(element, 'display');
	if (propDisplay && propDisplay.toLowerCase() == 'none')
		Spry.Effect.setStyleProp(element, 'display', 'block');

	var propVisible = Spry.Effect.getStyleProp(element, 'visibility');
	if (propVisible && propVisible.toLowerCase() == 'hidden')
		Spry.Effect.setStyleProp(element, 'visibility', 'visible');
}

Spry.Effect.makeClipping = function(element) 
{
	var overflow = Spry.Effect.getStyleProp(element, 'overflow');
	if (overflow != 'hidden' && overflow != 'scroll')
	{
		// IE 7 bug: set overflow property to hidden changes the element height to 0
		// -> therefore we save the height before changing the overflow property and set the old size back
		var heightCache = 0;
		var needsCache = /MSIE 7.0/.test(navigator.userAgent) && /Windows NT/.test(navigator.userAgent);
		if(needsCache)
			heightCache = Spry.Effect.getDimensionsRegardlessOfDisplayState(element).height;

		Spry.Effect.setStyleProp(element, 'overflow', 'hidden');

		if(needsCache)
			Spry.Effect.setStyleProp(element, 'height', heightCache+'px');
	}
}

Spry.Effect.cleanWhitespace = function(element) 
{
	var childCountInit = element.childNodes.length;
    for (var i = childCountInit - 1; i >= 0; i--) {
      var node = element.childNodes[i];
      if (node.nodeType == 3 && !/\S/.test(node.nodeValue))
	  {
		  try
		  {
		 	element.removeChild(node);
		  }
		  catch (e) {Spry.Effect.Utils.showError('Spry.Effect.cleanWhitespace: ' + e);}
	  }
    }
}

Spry.Effect.getComputedStyle = function(element)
{
	var computedStyle = /MSIE/.test(navigator.userAgent) ? element.currentStyle : document.defaultView.getComputedStyle(element, null);
	return computedStyle;
}

Spry.Effect.getDimensions = function(element)
{
	var dimensions = new Spry.Effect.Utils.Rectangle;
	var computedStyle = null;

	if (element.style.width && /px/i.test(element.style.width))
	{
		dimensions.width = parseInt(element.style.width); // without padding
	}
	else
	{
		computedStyle = Spry.Effect.getComputedStyle(element);
		var tryComputedStyle = computedStyle && computedStyle.width && /px/i.test(computedStyle.width);

		if (tryComputedStyle)
			dimensions.width = parseInt(computedStyle.width); // without padding, includes css

		if (!tryComputedStyle || dimensions.width == 0) // otherwise we might run into problems on safari and opera (mac only)
			dimensions.width = element.offsetWidth;   // includes padding
	}

	if (element.style.height && /px/i.test(element.style.height))
	{
		dimensions.height = parseInt(element.style.height); // without padding
	}
	else
	{
		if (!computedStyle)
			computedStyle = Spry.Effect.getComputedStyle(element);

        var tryComputedStyle = computedStyle && computedStyle.height && /px/i.test(computedStyle.height);

		if (tryComputedStyle)
			dimensions.height = parseInt(computedStyle.height); // without padding, includes css

		if(!tryComputedStyle || dimensions.height == 0) // otherwise we might run into problems on safari and opera (mac only)
			dimensions.height = element.offsetHeight;   // includes padding
	}

	return dimensions;
}

Spry.Effect.getDimensionsRegardlessOfDisplayState = function(element, displayElement)
{
	// If the displayElement display property is set to 'none', we temporarily set its
	// visibility state to 'hidden' to be able to calculate the dimension.

	var refElement = displayElement ? displayElement : element;
	var displayOrig = Spry.Effect.getStyleProp(refElement, 'display');
	var visibilityOrig = Spry.Effect.getStyleProp(refElement, 'visibility');

	if(displayOrig == 'none')
	{
		Spry.Effect.setStyleProp(refElement, 'visibility', 'hidden');
		Spry.Effect.setStyleProp(refElement, 'display', 'block');

		if(window.opera) // opera needs focus to calculate the size for hidden elements
			refElement.focus();
	}

	var dimensions = Spry.Effect.getDimensions(element);

	if(displayOrig == 'none') // reset the original values
	{
		Spry.Effect.setStyleProp(refElement, 'display', 'none');
		Spry.Effect.setStyleProp(refElement, 'visibility', visibilityOrig);
	}

	return dimensions;
}

Spry.Effect.getOpacity = function(element)
{
  var o = Spry.Effect.getStyleProp(element, "opacity");
  if (o == undefined || o == null)
    o = 1.0;
  return o;
}

Spry.Effect.getColor = function(element)
{
  var c = Spry.Effect.getStyleProp(ele, "background-color");
  return c;
}

Spry.Effect.getPosition = function(element)
{
	var position = new Spry.Effect.Utils.Position;
	var computedStyle = null;

	if (element.style.left  && /px/i.test(element.style.left))
	{
		position.x = parseInt(element.style.left); // without padding
	}
	else
	{
		computedStyle = Spry.Effect.getComputedStyle(element);
		var tryComputedStyle = computedStyle && computedStyle.left && /px/i.test(computedStyle.left);

		if (tryComputedStyle)
			position.x = parseInt(computedStyle.left); // without padding, includes css

		if(!tryComputedStyle || position.x == 0) // otherwise we might run into problems on safari and opera (mac only)
			position.x = element.offsetLeft;   // includes padding
	}

	if (element.style.top && /px/i.test(element.style.top))
	{
		position.y = parseInt(element.style.top); // without padding
	}
	else
	{
		if (!computedStyle)
			computedStyle = Spry.Effect.getComputedStyle(element);

        var tryComputedStyle = computedStyle && computedStyle.top && /px/i.test(computedStyle.top);

		if (tryComputedStyle)
			position.y = parseInt(computedStyle.top); // without padding, includes css

		if(!tryComputedStyle || position.y == 0) // otherwise we might run into problems on safari and opera (mac only)
			position.y = element.offsetTop;   // includes padding
	}

	return position;
}

Spry.Effect.getOffsetPosition = Spry.Effect.getPosition; // deprecated

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Animator
// (base class)
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Animator = function(options)
{
	this.name = 'Animator';
	this.element = null;
	this.timer = null;
	this.direction = Spry.forwards;
	this.startMilliseconds = 0;
	this.repeat = 'none';
	this.isRunning = false;
	
	this.options = {
		duration: 500,
		toggle: false,
		transition: Spry.linearTransition,
		interval: 33 // ca. 30 fps
	};
	
	this.setOptions(options);

};

Spry.Effect.Animator.prototype.setOptions = function(options)
{
	if (!options)
		return;
	for (var prop in options)
		this.options[prop] = options[prop];
};

Spry.Effect.Animator.prototype.start = function(withoutTimer)
{
	if (arguments.length == 0)
		withoutTimer = false;
		
	var self = this;

	if (this.options.setup)
	{
		try
		{
			this.options.setup(this.element, this);
		}
		catch (e) {Spry.Effect.Utils.showError('Spry.Effect.Animator.prototype.start: setup callback: ' + e);}
	}
	
	this.prepareStart();

	var currDate = new Date();
	this.startMilliseconds = currDate.getTime();
	
	if (withoutTimer == false) {
		this.timer = setInterval(function() { self.drawEffect(); }, this.options.interval);
	}
	this.isRunning = true;

};

Spry.Effect.Animator.prototype.stop = function()
{
	if (this.timer) {
		clearInterval(this.timer);
		this.timer = null;
	}

	this.startMilliseconds = 0;

	if (this.options.finish)
	{
		try
		{
			this.options.finish(this.element, this);
		}
		catch (e) {Spry.Effect.Utils.showError('Spry.Effect.Animator.prototype.stop: finish callback: ' + e);}
	}
	this.isRunning = false;
	/*
	Spry.Debug.trace('after stop:' + this.name);
	Spry.Debug.trace('this.element.style.top: ' + this.element.style.top);
	Spry.Debug.trace('this.element.style.left: ' + this.element.style.left);
	Spry.Debug.trace('this.element.style.width: ' + this.element.style.width);
	Spry.Debug.trace('this.element.style.height: ' + this.element.style.height);
	*/
};

Spry.Effect.Animator.prototype.cancel = function()
{
	if (this.timer) {
		clearInterval(this.timer);
		this.timer = null;
	}
	this.isRunning = false;
}

Spry.Effect.Animator.prototype.drawEffect = function()
{
	var isRunning = true;

	var position = this.getElapsedMilliseconds() / this.options.duration;
	if (this.getElapsedMilliseconds() > this.options.duration) {
		position = 1.0;
	} else {
		if (this.options.transition == Spry.sinusoidalTransition)
		{
			position = (-Math.cos(position*Math.PI)/2) + 0.5;
		}
		else if (this.options.transition == Spry.linearTransition)
		{
			// default: linear
		}
		else
		{
			Spry.Effect.Utils.showError('unknown transition');
		}
		
	}
	//Spry.Debug.trace('position: ' + position + ' : ' + this.name + '(duration: ' + this.options.duration + 'elapsed: ' + this.getElapsedMilliseconds() + 'test: ' + this.startMilliseconds);
	this.animate(position);
	
	if (this.getElapsedMilliseconds() > this.options.duration) {
		this.stop();
		isRunning = false;
	}
	return isRunning;

};

Spry.Effect.Animator.prototype.getElapsedMilliseconds = function()
{
	if (this.startMilliseconds > 0) {
		var currDate = new Date();
		return (currDate.getTime() - this.startMilliseconds);
	} else {
		return 0;
	}
};

Spry.Effect.Animator.prototype.doToggle = function()
{
	if (this.options.toggle == true) {
		if (this.direction == Spry.forwards) {
			this.direction = Spry.backwards;
		} else if (this.direction == Spry.backwards) {
			this.direction = Spry.forwards;
		}
	}
}

Spry.Effect.Animator.prototype.prepareStart = function() {};

Spry.Effect.Animator.prototype.animate = function(position) {};

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Move
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Move = function(element, fromPos, toPos, options)
{
	this.dynamicFromPos = false;
	if (arguments.length == 3)
	{
		options = toPos;
		toPos = fromPos;
		fromPos = Spry.Effect.getPosition(element);
		this.dynamicFromPos = true;
	}

	Spry.Effect.Animator.call(this, options);
	
	this.name = 'Move';
	this.element = Spry.Effect.getElement(element);
	
	if (fromPos.units != toPos.units)
		Spry.Effect.Utils.showError('Spry.Effect.Move: Conflicting units (' + fromPos.units + ', ' + toPos.units + ')');

	this.units = fromPos.units;
	this.startX = fromPos.x;
	this.stopX = toPos.x;
	this.startY = fromPos.y;
	this.stopY = toPos.y;
	
	this.rangeMoveX = this.startX - this.stopX;
	this.rangeMoveY= this.startY - this.stopY;
	
};

Spry.Effect.Move.prototype = new Spry.Effect.Animator();
Spry.Effect.Move.prototype.constructor = Spry.Effect.Move;

Spry.Effect.Move.prototype.animate = function(position)
{
	var left = 0;
	var top = 0;
	
	if (this.direction == Spry.forwards) {
		left = this.startX - (this.rangeMoveX * position);
		top = this.startY - (this.rangeMoveY * position);
	} else if (this.direction == Spry.backwards) {
		left = this.rangeMoveX * position + this.stopX;
		top = this.rangeMoveY * position + this.stopY;
	}
	
	this.element.style.left = left + this.units;
	this.element.style.top = top + this.units;
};

Spry.Effect.Move.prototype.prepareStart = function() 
{
	if (this.dynamicFromPos == true)
	{
		var fromPos = Spry.Effect.getPosition(this.element);
		this.startX = fromPos.x;
		this.startY = fromPos.y;
		
		this.rangeMoveX = this.startX - this.stopX;
		this.rangeMoveY= this.startY - this.stopY;
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.MoveSlide
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.MoveSlide = function(element, fromPos, toPos, horizontal, options)
{
	this.dynamicFromPos = false;
	if (arguments.length == 4)
	{
		options = horizontal;
		horizontal = toPos;
		toPos = fromPos;
		fromPos = Spry.Effect.getPosition(element);
		this.dynamicFromPos = true;
	}
	
	Spry.Effect.Animator.call(this, options);
	
	this.name = 'MoveSlide';
	this.element = Spry.Effect.getElement(element);
	this.horizontal = horizontal;
	this.firstChildElement = Spry.Effect.Utils.getFirstChildElement(element);
	this.overflow = Spry.Effect.getStyleProp(this.element, 'overflow');
	this.originalChildRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(this.firstChildElement, this.element);

	if (fromPos.units != toPos.units)
		Spry.Effect.Utils.showError('Spry.Effect.MoveSlide: Conflicting units (' + fromPos.units + ', ' + toPos.units + ')');
		
	this.units = fromPos.units;

	var originalRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
	this.startHeight = originalRect.height;

	this.startX = Number(fromPos.x);
	this.stopX = Number(toPos.x);
	this.startY = Number(fromPos.y);
	this.stopY = Number(toPos.y);

	this.rangeMoveX = this.startX - this.stopX;
	this.rangeMoveY = this.startY - this.stopY;

	this.enforceVisible = Spry.Effect.isInvisible(this.element);
};

Spry.Effect.MoveSlide.prototype = new Spry.Effect.Animator();
Spry.Effect.MoveSlide.prototype.constructor = Spry.Effect.MoveSlide;

Spry.Effect.MoveSlide.prototype.animate = function(position)
{
    if(this.horizontal)
    {
	    var xStart      = (this.direction == Spry.forwards) ? this.startX : this.stopX;
	    var xStop       = (this.direction == Spry.forwards) ? this.stopX : this.startX;
	    var eltWidth    = xStart + position * (xStop - xStart);

	    if(eltWidth<0) eltWidth = 0;

	    if(this.overflow != 'scroll' || eltWidth > this.originalChildRect.width)
		    this.firstChildElement.style.left = eltWidth - this.originalChildRect.width + this.units;

	    this.element.style.width = eltWidth + this.units;
    }
    else
    {
		var yStart      = (this.direction == Spry.forwards) ? this.startY : this.stopY;
		var yStop       = (this.direction == Spry.forwards) ? this.stopY : this.startY;
		var eltHeight   = yStart + position * (yStop - yStart);
	
		if(eltHeight<0) eltHeight = 0;
	
		if(this.overflow != 'scroll' || eltHeight > this.originalChildRect.height)
			this.firstChildElement.style.top = eltHeight - this.originalChildRect.height + this.units;

		this.element.style.height = eltHeight + this.units;
	}
	
	if(this.enforceVisible)
	{
		Spry.Effect.enforceVisible(this.element);
		this.enforceVisible = false;
	}
};

Spry.Effect.MoveSlide.prototype.prepareStart = function() 
{
	if (this.dynamicFromPos == true)
	{
		var fromPos = Spry.Effect.getPosition(this.element);
		this.startX = fromPos.x;
		this.startY = fromPos.y;
		
		this.rangeMoveX = this.startX - this.stopX;
		this.rangeMoveY= this.startY - this.stopY;
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Size
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Size = function(element, fromRect, toRect, options)
{
	this.dynamicFromRect = false;
	if (arguments.length == 3)
	{
		options = toRect;
		toRect = fromRect;
		fromRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
		this.dynamicFromRect = true;
	}
	
	Spry.Effect.Animator.call(this, options);
	
	this.name = 'Size';
	this.element = Spry.Effect.getElement(element);

	if (fromRect.units != toRect.units)
		Spry.Effect.Utils.showError('Spry.Effect.Size: Conflicting units (' + fromRect.units + ', ' + toRect.units + ')');
		
	this.units = fromRect.units;

	var originalRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
	this.originalWidth = originalRect.width;

	this.startWidth = fromRect.width;
	this.startHeight = fromRect.height;
	this.stopWidth = toRect.width;
	this.stopHeight = toRect.height;
	this.childImages = new Array();

	if(this.options.scaleContent)
		Spry.Effect.Utils.fetchChildImages(element, this.childImages);

	this.fontFactor = 1.0;
	if(this.element.style && this.element.style.fontSize)
	{
		if(/em\s*$/.test(this.element.style.fontSize))
			this.fontFactor = parseFloat(this.element.style.fontSize);
	}

	if (Spry.Effect.Utils.isPercentValue(this.startWidth))
	{
		var startWidthPercent = Spry.Effect.Utils.getPercentValue(this.startWidth);
		//var originalRect = Spry.Effect.getDimensions(element);
		this.startWidth = originalRect.width * (startWidthPercent / 100);
	}

	if (Spry.Effect.Utils.isPercentValue(this.startHeight))
	{
		var startHeightPercent = Spry.Effect.Utils.getPercentValue(this.startHeight);
		//var originalRect = Spry.Effect.getDimensions(element);
		this.startHeight = originalRect.height * (startHeightPercent / 100);
	}

	if (Spry.Effect.Utils.isPercentValue(this.stopWidth))
	{
		var stopWidthPercent = Spry.Effect.Utils.getPercentValue(this.stopWidth);
		var originalRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
		this.stopWidth = originalRect.width * (stopWidthPercent / 100);
	}

	if (Spry.Effect.Utils.isPercentValue(this.stopHeight))
	{
		var stopHeightPercent = Spry.Effect.Utils.getPercentValue(this.stopHeight);
		var originalRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
		this.stopHeight = originalRect.height * (stopHeightPercent / 100);
	}

	this.widthRange = this.startWidth - this.stopWidth;
	this.heightRange = this.startHeight - this.stopHeight;

	this.enforceVisible = Spry.Effect.isInvisible(this.element);
};

Spry.Effect.Size.prototype = new Spry.Effect.Animator();
Spry.Effect.Size.prototype.constructor = Spry.Effect.Size;

Spry.Effect.Size.prototype.animate = function(position)
{
	var width = 0;
	var height = 0;
	var fontSize = 0;

	if (this.direction == Spry.forwards) {
		width = this.startWidth - (this.widthRange * position);
		height = this.startHeight - (this.heightRange * position);
		fontSize = this.fontFactor*(this.startWidth + position*(this.stopWidth - this.startWidth))/this.originalWidth;
	} else if (this.direction == Spry.backwards) {
		width = this.widthRange * position + this.stopWidth;
		height = this.heightRange * position + this.stopHeight;
		fontSize = this.fontFactor*(this.stopWidth + position*(this.startWidth - this.stopWidth))/this.originalWidth;
	}
	if (this.options.scaleContent == true)
		this.element.style.fontSize = fontSize + 'em';

	//Spry.Debug.trace(fontSize);

	this.element.style.width = width + this.units;
	this.element.style.height = height + this.units;

	if(this.options.scaleContent)
	{
		var propFactor = (this.direction == Spry.forwards) ? (this.startWidth + position*(this.stopWidth - this.startWidth))/this.originalWidth
														   : (this.stopWidth + position*(this.startWidth - this.stopWidth))/this.originalWidth;

		for(var i=0; i < this.childImages.length; i++)
		{
			this.childImages[i][0].style.width = propFactor * this.childImages[i][1] + this.units;
			this.childImages[i][0].style.height = propFactor * this.childImages[i][2] + this.units;
		}
	}

	if(this.enforceVisible)
	{
		Spry.Effect.enforceVisible(this.element);
		this.enforceVisible = false;
	}
};

Spry.Effect.Size.prototype.prepareStart = function() 
{
	if (this.dynamicFromRect == true)
	{
		var fromRect = Spry.Effect.getDimensions(element);
		this.startWidth = fromRect.width;
		this.startHeight = fromRect.height;
	
		this.widthRange = this.startWidth - this.stopWidth;
		this.heightRange = this.startHeight - this.stopHeight;
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Opacity
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Opacity = function(element, startOpacity, stopOpacity, options)
{
	this.dynamicStartOpacity = false;
	if (arguments.length == 3)
	{
		options = stopOpacity;
		stopOpacity = startOpacity;
		startOpacity = Spry.Effect.getOpacity(element);
		this.dynamicStartOpacity = true;
	}

	Spry.Effect.Animator.call(this, options);

	this.name = 'Opacity';
	this.element = Spry.Effect.getElement(element);

    // make this work on IE on elements without 'layout'
    if(/MSIE/.test(navigator.userAgent) && (!this.element.hasLayout))
	  Spry.Effect.setStyleProp(this.element, 'zoom', '1');

	this.startOpacity = startOpacity;
	this.stopOpacity = stopOpacity;
	this.opacityRange = this.startOpacity - this.stopOpacity;
	this.enforceVisible = Spry.Effect.isInvisible(this.element);
};

Spry.Effect.Opacity.prototype = new Spry.Effect.Animator();
Spry.Effect.Opacity.prototype.constructor = Spry.Effect.Opacity;

Spry.Effect.Opacity.prototype.animate = function(position)
{
	var opacity = 0;

	if (this.direction == Spry.forwards) {
		opacity = this.startOpacity - (this.opacityRange * position);
	} else if (this.direction == Spry.backwards) {
		opacity = this.opacityRange * position + this.stopOpacity;
	}
	
	this.element.style.opacity = opacity;
	this.element.style.filter = "alpha(opacity=" + Math.floor(opacity * 100) + ")";

	if(this.enforceVisible)
	{
		Spry.Effect.enforceVisible(this.element);
		this.enforceVisible = false;
	}
};

Spry.Effect.Size.prototype.prepareStart = function() 
{
	if (this.dynamicStartOpacity == true)
	{
		this.startOpacity = Spry.Effect.getOpacity(element);
		this.opacityRange = this.startOpacity - this.stopOpacity;
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Color
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Color = function(element, startColor, stopColor, options)
{
	this.dynamicStartColor = false;
	if (arguments.length == 3)
	{
		options = stopColor;
		stopColor = startColor;
		startColor = Spry.Effect.getColor(element);
		this.dynamicStartColor = true;
	}
	
	Spry.Effect.Animator.call(this, options);

	this.name = 'Color';
	this.element = Spry.Effect.getElement(element);

	this.startColor = startColor;
	this.stopColor = stopColor;
	this.startRedColor = Spry.Effect.Utils.hexToInt(startColor.substr(1,2));
	this.startGreenColor = Spry.Effect.Utils.hexToInt(startColor.substr(3,2));
	this.startBlueColor = Spry.Effect.Utils.hexToInt(startColor.substr(5,2));
	this.stopRedColor = Spry.Effect.Utils.hexToInt(stopColor.substr(1,2));
	this.stopGreenColor = Spry.Effect.Utils.hexToInt(stopColor.substr(3,2));
	this.stopBlueColor = Spry.Effect.Utils.hexToInt(stopColor.substr(5,2));
	this.redColorRange = this.startRedColor - this.stopRedColor;
	this.greenColorRange = this.startGreenColor - this.stopGreenColor;
	this.blueColorRange = this.startBlueColor - this.stopBlueColor;
};

Spry.Effect.Color.prototype = new Spry.Effect.Animator();
Spry.Effect.Color.prototype.constructor = Spry.Effect.Color;

Spry.Effect.Color.prototype.animate = function(position)
{
	var redColor = 0;
	var greenColor = 0;
	var blueColor = 0;
	
	if (this.direction == Spry.forwards) {
		redColor = parseInt(this.startRedColor - (this.redColorRange * position));
		greenColor = parseInt(this.startGreenColor - (this.greenColorRange * position));
		blueColor = parseInt(this.startBlueColor - (this.blueColorRange * position));
	} else if (this.direction == Spry.backwards) {
		redColor = parseInt(this.redColorRange * position) + this.stopRedColor;
		greenColor = parseInt(this.greenColorRange * position) + this.stopGreenColor;
		blueColor = parseInt(this.blueColorRange * position) + this.stopBlueColor;
	}

	this.element.style.backgroundColor = Spry.Effect.Utils.rgb(redColor, greenColor, blueColor);
};

Spry.Effect.Size.prototype.prepareStart = function() 
{
	if (this.dynamicStartColor == true)
	{
		this.startColor = Spry.Effect.getColor(element);
		this.startRedColor = Spry.Effect.Utils.hexToInt(startColor.substr(1,2));
		this.startGreenColor = Spry.Effect.Utils.hexToInt(startColor.substr(3,2));
		this.startBlueColor = Spry.Effect.Utils.hexToInt(startColor.substr(5,2));
		this.redColorRange = this.startRedColor - this.stopRedColor;
		this.greenColorRange = this.startGreenColor - this.stopGreenColor;
		this.blueColorRange = this.startBlueColor - this.stopBlueColor;
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Cluster
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Cluster = function(options)
{
	
	Spry.Effect.Animator.call(this, options);

	this.name = 'Cluster';

	this.effectsArray = new Array();
	this.currIdx = -1;

	_ClusteredEffect = function(effect, kind)
	{
		this.effect = effect;
		this.kind = kind; // "parallel" or "queue"
		this.isRunning = false;
	};
	
	this.ClusteredEffect = _ClusteredEffect;

};

Spry.Effect.Cluster.prototype = new Spry.Effect.Animator();
Spry.Effect.Cluster.prototype.constructor = Spry.Effect.Cluster;

Spry.Effect.Cluster.prototype.drawEffect = function()
{
	var isRunning = true;
	var allEffectsDidRun = false;
	
	if (this.currIdx == -1)
		this.initNextEffectsRunning();

	var baseEffectIsStillRunning = false;
	var evalNextEffectsRunning = false
	for (var i = 0; i < this.effectsArray.length; i++)
	{
		if (this.effectsArray[i].isRunning == true)
		{
			baseEffectIsStillRunning = this.effectsArray[i].effect.drawEffect();
			if (baseEffectIsStillRunning == false && i == this.currIdx)
			{
				evalNextEffectsRunning = true;
			}
		}
	}
	if (evalNextEffectsRunning == true)
	{
		allEffectsDidRun = this.initNextEffectsRunning();
	}
	
	if (allEffectsDidRun == true) {
		this.stop();
		isRunning = false;
		for (var i = 0; i < this.effectsArray.length; i++)
		{
			this.effectsArray[i].isRunning = false;
		}
		this.currIdx = -1;
	}

	return isRunning;
	
};

Spry.Effect.Cluster.prototype.initNextEffectsRunning = function()
{
	var allEffectsDidRun = false;
	this.currIdx++;
	if (this.currIdx > (this.effectsArray.length - 1))
	{
		allEffectsDidRun = true;
	}
	else 
	{
		for (var i = this.currIdx; i < this.effectsArray.length; i++)
		{
			if ((i > this.currIdx) && this.effectsArray[i].kind == "queue")
				break;
				
			this.effectsArray[i].effect.start(true);
			this.effectsArray[i].isRunning = true;
			this.currIdx = i;
		};
	}
	return allEffectsDidRun;
};

Spry.Effect.Cluster.prototype.doToggle = function()
{
	if (this.options.toggle == true) {
		if (this.direction == Spry.forwards) {
			this.direction = Spry.backwards;
		} else if (this.direction == Spry.backwards) {
			this.direction = Spry.forwards;
		}
	}
	// toggle all effects of the cluster, too
	for (var i = 0; i < this.effectsArray.length; i++) 
	{
		if (this.effectsArray[i].effect.options && (this.effectsArray[i].effect.options.toggle != null)) {
			if (this.effectsArray[i].effect.options.toggle == true)
			{
				this.effectsArray[i].effect.doToggle();
			}
		}
	}
};

Spry.Effect.Cluster.prototype.cancel = function()
{
	for (var i = 0; i < this.effectsArray.length; i++)
	{
		this.effectsArray[i].effect.cancel();
	}
	if (this.timer) {
		clearInterval(this.timer);
		this.timer = null;
	}
	this.isRunning = false;
};

Spry.Effect.Cluster.prototype.addNextEffect = function(effect)
{
	this.effectsArray[this.effectsArray.length] = new this.ClusteredEffect(effect, "queue");
	if (this.effectsArray.length == 1) {
		// with the first added effect we know the element
		// that the cluster is working on
		this.element = effect.element;
	}
};

Spry.Effect.Cluster.prototype.addParallelEffect = function(effect)
{
	this.effectsArray[this.effectsArray.length] = new this.ClusteredEffect(effect, "parallel");
	if (this.effectsArray.length == 1) {
		// with the first added effect we know the element
		// that the cluster is working on
		this.element = effect.element;
	}
};

//////////////////////////////////////////////////////////////////////
//
// Combination effects
// Custom effects can be build by combining basic effect bahaviour
// like Move, Size, Color, Opacity
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.AppearFade = function (element, options) 
{
	var element = Spry.Effect.getElement(element);

	var durationInMilliseconds = 1000;
	var fromOpacity = 0.0;
	var toOpacity = 100.0;
	var doToggle = false;
	var kindOfTransition = Spry.sinusoidalTransition;
	var setupCallback = null;
	var finishCallback = null;

	if (options)
	{
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.from != null) fromOpacity = options.from;
		if (options.to != null) toOpacity = options.to;
		if (options.toggle != null) doToggle = options.toggle;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.setup != null) setupCallback = options.setup;
		if (options.finish != null) finishCallback = options.finish;
	}
	options = {duration: durationInMilliseconds, toggle: doToggle, transition: kindOfTransition, setup: setupCallback, finish: finishCallback, from: fromOpacity, to: toOpacity};

	fromOpacity = fromOpacity/ 100.0;
	toOpacity = toOpacity / 100.0;

	var appearFadeEffect = new Spry.Effect.Opacity(element, fromOpacity, toOpacity, options);

	appearFadeEffect.name = 'AppearFade';
	var registeredEffect = SpryRegistry.getRegisteredEffect(element, appearFadeEffect);
	registeredEffect.start();
	return registeredEffect;
};


Spry.Effect.Blind = function (element, options) 
{
	var element = Spry.Effect.getElement(element);

	Spry.Effect.makeClipping(element);

	var durationInMilliseconds = 1000;
	var doToggle = false;
	var kindOfTransition = Spry.sinusoidalTransition;
	var doScaleContent = false;
	var setupCallback = null;
	var finishCallback = null;
	var originalRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
	var fromHeightPx  = originalRect.height;
	var toHeightPx    = 0;
	var optionFrom = options ? options.from : originalRect.height;
	var optionTo   = options ? options.to : 0;

	if (options)
	{
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.from != null)
		{
			if (Spry.Effect.Utils.isPercentValue(options.from))
				fromHeightPx = Spry.Effect.Utils.getPercentValue(options.from) * originalRect.height / 100;
			else
				fromHeightPx = Spry.Effect.Utils.getPixelValue(options.from);
		}
		if (options.to != null)
		{
			if (Spry.Effect.Utils.isPercentValue(options.to))
				toHeightPx = Spry.Effect.Utils.getPercentValue(options.to) * originalRect.height / 100;
			else
				toHeightPx = Spry.Effect.Utils.getPixelValue(options.to);
		}
		if (options.toggle != null) doToggle = options.toggle;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.setup != null) setupCallback = options.setup;
		if (options.finish != null) finishCallback = options.finish;
	}

	var fromRect = new Spry.Effect.Utils.Rectangle;
	fromRect.width = originalRect.width;
	fromRect.height = fromHeightPx;

	var toRect = new Spry.Effect.Utils.Rectangle;
	toRect.width = originalRect.width;
	toRect.height = toHeightPx;

	options = {duration:durationInMilliseconds, toggle:doToggle, transition:kindOfTransition, scaleContent:doScaleContent, setup: setupCallback, finish: finishCallback, from: optionFrom, to: optionTo};

	var blindEffect = new Spry.Effect.Size(element, fromRect, toRect, options);
	blindEffect.name = 'Blind';
	var registeredEffect = SpryRegistry.getRegisteredEffect(element, blindEffect);
	registeredEffect.start();
	return registeredEffect;
};


function setupHighlight(element, effect) 
{
	Spry.Effect.setStyleProp(element, 'background-image', 'none');
};

function finishHighlight(element, effect) 
{
	Spry.Effect.setStyleProp(element, 'background-image', effect.options.restoreBackgroundImage);

	if (effect.direction == Spry.forwards)
		Spry.Effect.setStyleProp(element, 'background-color', effect.options.restoreColor);
};

Spry.Effect.Highlight = function (element, options) 
{	
	var durationInMilliseconds = 1000;
	var toColor = "#ffffff";
	var doToggle = false;
	var kindOfTransition = Spry.sinusoidalTransition;
	var setupCallback = setupHighlight;
	var finishCallback = finishHighlight;
	var element = Spry.Effect.getElement(element);
	var fromColor = Spry.Effect.getStyleProp(element, "background-color");
	var restoreColor = fromColor;
	if (fromColor == "transparent") fromColor = "#ffff99";

	var optionFrom = options ? options.from : '#ffff00';
	var optionTo   = options ? options.to : '#0000ff';

	if (options)
	{
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.from != null) fromColor = options.from;
		if (options.to != null) toColor = options.to;
		if (options.restoreColor) restoreColor = options.restoreColor;
		if (options.toggle != null) doToggle = options.toggle;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.setup != null) setupCallback = options.setup;
		if (options.finish != null) finishCallback = options.finish;
	}

	var restoreBackgroundImage = Spry.Effect.getStyleProp(element, 'background-image');
	
	options = {duration: durationInMilliseconds, toggle: doToggle, transition: kindOfTransition, setup: setupCallback, finish: finishCallback, restoreColor: restoreColor, restoreBackgroundImage: restoreBackgroundImage, from: optionFrom, to: optionTo};

	var highlightEffect = new Spry.Effect.Color(element, fromColor, toColor, options);
	highlightEffect.name = 'Highlight';
	var registeredEffect = SpryRegistry.getRegisteredEffect(element, highlightEffect);
	registeredEffect.start();
	return registeredEffect;	
};

Spry.Effect.Slide = function (element, options) 
{
	var element = Spry.Effect.getElement(element);

	var durationInMilliseconds = 2000;
	var doToggle = false;
	var kindOfTransition = Spry.sinusoidalTransition;
	var slideHorizontally = false;
	var setupCallback = null;
	var finishCallback = null;
	var firstChildElt = Spry.Effect.Utils.getFirstChildElement(element);

	// IE 7 does not clip static positioned elements -> make element position relative
	if(/MSIE 7.0/.test(navigator.userAgent) && /Windows NT/.test(navigator.userAgent))
		Spry.Effect.makePositioned(element);

	Spry.Effect.makeClipping(element);

	// for IE 6 on win: check if position is static or fixed -> not supported and would cause trouble
	if(/MSIE 6.0/.test(navigator.userAgent) && /Windows NT/.test(navigator.userAgent))
	{
		var pos = Spry.Effect.getStyleProp(element, 'position');
		if(pos && (pos == 'static' || pos == 'fixed'))
		{
			Spry.Effect.setStyleProp(element, 'position', 'relative');
			Spry.Effect.setStyleProp(element, 'top', '');
			Spry.Effect.setStyleProp(element, 'left', '');
		}
	}

	if(firstChildElt)
	{
		Spry.Effect.makePositioned(firstChildElt);
		Spry.Effect.makeClipping(firstChildElt);

    	var childRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(firstChildElt, element);
		Spry.Effect.setStyleProp(firstChildElt, 'width', childRect.width + 'px');
	}

	var elementRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
	var startOffsetPosition = new Spry.Effect.Utils.Position();
	startOffsetPosition.x = parseInt(Spry.Effect.getStyleProp(firstChildElt, "left"));
	startOffsetPosition.y = parseInt(Spry.Effect.getStyleProp(firstChildElt, "top"));
	if (!startOffsetPosition.x) startOffsetPosition.x = 0;
	if (!startOffsetPosition.y) startOffsetPosition.y = 0;

	if (options && options.horizontal !== null && options.horizontal === true)
		slideHorizontally = true;

	var movePx = slideHorizontally ? elementRect.width : elementRect.height;
	var fromPos = new Spry.Effect.Utils.Position;
	fromPos.x = startOffsetPosition.x;
	fromPos.y = startOffsetPosition.y;

	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = slideHorizontally ? startOffsetPosition.x - movePx : startOffsetPosition.x;
	toPos.y = slideHorizontally ? startOffsetPosition.y : startOffsetPosition.y - movePx;

	var optionFrom = options ? options.from : elementRect.height;
	var optionTo   = options ? options.to : 0;

	if (options)
	{
		if (options.duration != null) durationInMilliseconds = options.duration;

		if (options.from != null)
		{
		    if(slideHorizontally)
		    {
			    if (Spry.Effect.Utils.isPercentValue(options.from))
				    fromPos.x = movePx * Spry.Effect.Utils.getPercentValue(options.from) / 100;
			    else
				    fromPos.x = Spry.Effect.Utils.getPixelValue(options.from);
			}
			else
			{
			    if (Spry.Effect.Utils.isPercentValue(options.from))
				    fromPos.y = movePx * Spry.Effect.Utils.getPercentValue(options.from) / 100;
			    else
				    fromPos.y = Spry.Effect.Utils.getPixelValue(options.from);
			}
		}

		if (options.to != null)
		{
		    if(slideHorizontally)
		    {
			    if (Spry.Effect.Utils.isPercentValue(options.to))
				    toPos.x = movePx * Spry.Effect.Utils.getPercentValue(options.to) / 100;
			    else
				    toPos.x = Spry.Effect.Utils.getPixelValue(options.to);
		    }
		    else
		    {
			    if (Spry.Effect.Utils.isPercentValue(options.to))
				    toPos.y = movePx * Spry.Effect.Utils.getPercentValue(options.to) / 100;
			    else
				    toPos.y = Spry.Effect.Utils.getPixelValue(options.to);
			}
		}

		if (options.toggle != null) doToggle = options.toggle;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.setup != null) setupCallback = options.setup;
		if (options.finish != null) finishCallback = options.finish;
	}

	options = {duration:durationInMilliseconds, toggle:doToggle, transition:kindOfTransition, setup: setupCallback, finish: finishCallback, from: optionFrom, to: optionTo};
	
	var slideEffect = new Spry.Effect.MoveSlide(element, fromPos, toPos, slideHorizontally, options);
	slideEffect.name = 'Slide';
	var registeredEffect = SpryRegistry.getRegisteredEffect(element, slideEffect);
	registeredEffect.start();
	return registeredEffect;
};


Spry.Effect.GrowShrink = function (element, options) 
{
	var element = Spry.Effect.getElement(element);

	Spry.Effect.makePositioned(element); // for move
	Spry.Effect.makeClipping(element);

	var startOffsetPosition = new Spry.Effect.Utils.Position();
	startOffsetPosition.x = parseInt(Spry.Effect.getStylePropRegardlessOfDisplayState(element, "left"));
	startOffsetPosition.y = parseInt(Spry.Effect.getStylePropRegardlessOfDisplayState(element, "top"));	
	if (!startOffsetPosition.x) startOffsetPosition.x = 0;
	if (!startOffsetPosition.y) startOffsetPosition.y = 0;

	var dimRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
	var originalWidth = dimRect.width;
	var originalHeight = dimRect.height;
	var propFactor = (originalWidth == 0) ? 1 :originalHeight/originalWidth;

	var durationInMilliseconds = 500;
	var doToggle = false;
	var kindOfTransition = Spry.sinusoidalTransition;

	var fromRect = new Spry.Effect.Utils.Rectangle;
	fromRect.width = 0;
	fromRect.height = 0;

	var toRect = new Spry.Effect.Utils.Rectangle;
	toRect.width = originalWidth;
	toRect.height = originalHeight;

	var setupCallback = null;
	var finishCallback = null;

	var doScaleContent = true;

	var optionFrom = options ? options.from : dimRect.width;
	var optionTo   = options ? options.to : 0;

	var calcHeight = false;
	var growFromCenter = true;

	if (options)
	{
		if (options.referHeight != null) calcHeight = options.referHeight;
		if (options.growCenter != null) growFromCenter = options.growCenter;
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.from != null) 
		{
			if (Spry.Effect.Utils.isPercentValue(options.from))
			{
				fromRect.width = originalWidth * (Spry.Effect.Utils.getPercentValue(options.from) / 100);
				fromRect.height = originalHeight * (Spry.Effect.Utils.getPercentValue(options.from) / 100);
			}
			else
			{
				if(calcHeight)
				{
					fromRect.height = Spry.Effect.Utils.getPixelValue(options.from);
					fromRect.width  = Spry.Effect.Utils.getPixelValue(options.from) / propFactor;
				}
				else
				{
					fromRect.width = Spry.Effect.Utils.getPixelValue(options.from);
					fromRect.height = propFactor * Spry.Effect.Utils.getPixelValue(options.from);
				}
			}
		}
		if (options.to != null) 
		{
			if (Spry.Effect.Utils.isPercentValue(options.to))
			{
				toRect.width = originalWidth * (Spry.Effect.Utils.getPercentValue(options.to) / 100);
				toRect.height = originalHeight * (Spry.Effect.Utils.getPercentValue(options.to) / 100);
			}
			else
			{
				if(calcHeight)
				{
					toRect.height = Spry.Effect.Utils.getPixelValue(options.to);
					toRect.width  = Spry.Effect.Utils.getPixelValue(options.to) / propFactor;
				}
				else
				{
					toRect.width = Spry.Effect.Utils.getPixelValue(options.to);
					toRect.height = propFactor * Spry.Effect.Utils.getPixelValue(options.to);
				}
			}
		}
		if (options.toggle != null) doToggle = options.toggle;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.setup != null) setupCallback = options.setup;
		if (options.finish != null) finishCallback = options.finish;		
	}

	options = {duration:durationInMilliseconds, toggle:doToggle, transition:kindOfTransition, scaleContent:doScaleContent, from: optionFrom, to: optionTo};
	
	var effectCluster = new Spry.Effect.Cluster({toggle: doToggle, setup: setupCallback, finish: finishCallback});
	effectCluster.name = 'GrowShrink';
	
	var sizeEffect = new Spry.Effect.Size(element, fromRect, toRect, options);
	effectCluster.addParallelEffect(sizeEffect);

	if(growFromCenter)
	{
		options = {duration:durationInMilliseconds, toggle:doToggle, transition:kindOfTransition, from: optionFrom, to: optionTo};
		var fromPos = new Spry.Effect.Utils.Position;
		fromPos.x = startOffsetPosition.x + (originalWidth - fromRect.width) / 2.0;
		fromPos.y = startOffsetPosition.y + (originalHeight -fromRect.height) / 2.0;

		var toPos = new Spry.Effect.Utils.Position;
		toPos.x = startOffsetPosition.x + (originalWidth - toRect.width) / 2.0;
		toPos.y = startOffsetPosition.y + (originalHeight -toRect.height) / 2.0;

		var initialProps2 = {top: fromPos.y, left: fromPos.x};

		var moveEffect = new Spry.Effect.Move(element, fromPos, toPos, options, initialProps2);
		effectCluster.addParallelEffect(moveEffect);
	}

	var registeredEffect = SpryRegistry.getRegisteredEffect(element, effectCluster);
	registeredEffect.start();
	return registeredEffect;
};


Spry.Effect.Shake = function (element, options) 
{
	var element = Spry.Effect.getElement(element);

	Spry.Effect.makePositioned(element);
	

	var setupCallback = null;
	var finishCallback = null;

	if (options)
	{
		if (options.setup != null) setupCallback = options.setup;
		if (options.finish != null) finishCallback = options.finish;
	}

	var startOffsetPosition = new Spry.Effect.Utils.Position();
	startOffsetPosition.x = parseInt(Spry.Effect.getStyleProp(element, "left"));
	startOffsetPosition.y = parseInt(Spry.Effect.getStyleProp(element, "top"));	
	if (!startOffsetPosition.x) startOffsetPosition.x = 0;
	if (!startOffsetPosition.y) startOffsetPosition.y = 0;	

	var shakeEffectCluster = new Spry.Effect.Cluster({setup: setupCallback, finish: finishCallback});
	shakeEffectCluster.name = 'Shake';

	var fromPos = new Spry.Effect.Utils.Position;
	fromPos.x = startOffsetPosition.x + 0;
	fromPos.y = startOffsetPosition.y + 0;

	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = startOffsetPosition.x + 20;
	toPos.y = startOffsetPosition.y + 0;

	options = {duration:50, toggle:false};
	var effect = new Spry.Effect.Move(element, fromPos, toPos, options);
	shakeEffectCluster.addNextEffect(effect);
	
	var fromPos = new Spry.Effect.Utils.Position;
	fromPos.x = startOffsetPosition.x + 20;
	fromPos.y = startOffsetPosition.y + 0;

	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = startOffsetPosition.x + -20;
	toPos.y = startOffsetPosition.y + 0;

	options = {duration:100, toggle:false};
	var effect = new Spry.Effect.Move(element, fromPos, toPos, options);
	shakeEffectCluster.addNextEffect(effect);

	var fromPos = new Spry.Effect.Utils.Position;
	fromPos.x = startOffsetPosition.x + -20;
	fromPos.y = startOffsetPosition.y + 0;

	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = startOffsetPosition.x + 20;
	toPos.y = startOffsetPosition.y + 0;

	options = {duration:100, toggle:false};
	var effect = new Spry.Effect.Move(element, fromPos, toPos, options);
	shakeEffectCluster.addNextEffect(effect);

	var fromPos = new Spry.Effect.Utils.Position;
	fromPos.x = startOffsetPosition.x + 20;
	fromPos.y = startOffsetPosition.y + 0;

	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = startOffsetPosition.x + -20;
	toPos.y = startOffsetPosition.y + 0;

	options = {duration:100, toggle:false};
	var effect = new Spry.Effect.Move(element, fromPos, toPos, options);
	shakeEffectCluster.addNextEffect(effect);

	var fromPos = new Spry.Effect.Utils.Position;
	fromPos.x = startOffsetPosition.x + -20;
	fromPos.y = startOffsetPosition.y + 0;

	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = startOffsetPosition.x + 20;
	toPos.y = startOffsetPosition.y + 0;

	options = {duration:100, toggle:false};
	var effect = new Spry.Effect.Move(element, fromPos, toPos, options);
	shakeEffectCluster.addNextEffect(effect);

	var fromPos = new Spry.Effect.Utils.Position;
	fromPos.x = startOffsetPosition.x + 20;
	fromPos.y = startOffsetPosition.y + 0;

	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = startOffsetPosition.x + 0;
	toPos.y = startOffsetPosition.y + 0;

	options = {duration:50, toggle:false};
	var effect = new Spry.Effect.Move(element, fromPos, toPos, options);
	shakeEffectCluster.addNextEffect(effect);
	
	var registeredEffect = SpryRegistry.getRegisteredEffect(element, shakeEffectCluster);
	registeredEffect.start();
	return registeredEffect;
}

Spry.Effect.Squish = function (element, options) 
{
	var element = Spry.Effect.getElement(element);
	
	var durationInMilliseconds = 500;
	var doToggle = true;

	var setupCallback = null;
	var finishCallback = null;

	if (options)
	{
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.toggle != null) doToggle = options.toggle;
		if (options.setup != null) setupCallback = options.setup;
		if (options.finish != null) finishCallback = options.finish;
	}

	Spry.Effect.makePositioned(element); // for move
	Spry.Effect.makeClipping(element);

	var originalRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);

	var startWidth = originalRect.width;
	var startHeight = originalRect.height;

	var stopWidth = 0;
	var stopHeight = 0;

	var fromRect = new Spry.Effect.Utils.Rectangle;
	fromRect.width = startWidth;
	fromRect.height = startHeight;
	
	var toRect = new Spry.Effect.Utils.Rectangle;
	toRect.width = stopWidth;
	toRect.height = stopHeight;
	
	var doScaleContent = true;

	options = {duration:durationInMilliseconds, toggle:doToggle, scaleContent:doScaleContent, setup: setupCallback, finish: finishCallback};

	var squishEffect = new Spry.Effect.Size(element, fromRect, toRect, options);
	squishEffect.name = 'Squish';

	var registeredEffect = SpryRegistry.getRegisteredEffect(element, squishEffect);
	registeredEffect.start();
	return registeredEffect;
};

Spry.Effect.Pulsate = function (element, options) 
{
	var element = Spry.Effect.getElement(element);
	
	var durationInMilliseconds = 400;
	var fromOpacity = 100.0;
	var toOpacity = 0.0;
	var doToggle = false;
	var kindOfTransition = Spry.linearTransition;
	var setupCallback = null;
	var finishCallback = null;

	if (options)
	{
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.from != null) fromOpacity = options.from;
		if (options.to != null) toOpacity = options.to;
		if (options.toggle != null) doToggle = options.toggle;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.setup != null) setupCallback = options.setup;
		if (options.finish != null) finishCallback = options.finish;
	}
	options = {duration:durationInMilliseconds, toggle:doToggle, transition:kindOfTransition, setup: setupCallback, finish: finishCallback};
	fromOpacity = fromOpacity / 100.0;
	toOpacity = toOpacity / 100.0;
	
	var pulsateEffectCluster = new Spry.Effect.Cluster();
	
	var fadeEffect = new Spry.Effect.Opacity(element, fromOpacity, toOpacity, options);
	var appearEffect = new Spry.Effect.Opacity(element, toOpacity, fromOpacity, options);
	
	pulsateEffectCluster.addNextEffect(fadeEffect);
	pulsateEffectCluster.addNextEffect(appearEffect);
	pulsateEffectCluster.addNextEffect(fadeEffect);
	pulsateEffectCluster.addNextEffect(appearEffect);
	pulsateEffectCluster.addNextEffect(fadeEffect);
	pulsateEffectCluster.addNextEffect(appearEffect);
	
	pulsateEffectCluster.name = 'Pulsate';

	var registeredEffect = SpryRegistry.getRegisteredEffect(element, pulsateEffectCluster);
	registeredEffect.start();
	return registeredEffect;
};

Spry.Effect.Puff = function (element, options) 
{
	var element = Spry.Effect.getElement(element);
	
	Spry.Effect.makePositioned(element); // for move

	var setupCallback = null;
	var finishCallback = null;

	if (options)
	{
		if (options.setup != null) setupCallback = options.setup;
		if (options.finish != null) finishCallback = options.finish;
	}

	var puffEffectCluster = new Spry.Effect.Cluster;
	var durationInMilliseconds = 500;

	var originalRect = Spry.Effect.getDimensions(element);
	
	var startWidth = originalRect.width;
	var startHeight = originalRect.height;
		
	var stopWidth = startWidth * 2;
	var stopHeight = startHeight * 2;
	
	var fromRect = new Spry.Effect.Utils.Rectangle;
	fromRect.width = startWidth;
	fromRect.height = startHeight;
	
	var toRect = new Spry.Effect.Utils.Rectangle;
	toRect.width = stopWidth;
	toRect.height = stopHeight;
	
	var doScaleContent = false;
	
	options = {duration:durationInMilliseconds, toggle:false, scaleContent:doScaleContent};
	var sizeEffect = new Spry.Effect.Size(element, fromRect, toRect, options);
	puffEffectCluster.addParallelEffect(sizeEffect);

	options = {duration:durationInMilliseconds, toggle:false};
	var fromOpacity = 1.0;
	var toOpacity = 0.0;
	var opacityEffect = new Spry.Effect.Opacity(element, fromOpacity, toOpacity, options);
	puffEffectCluster.addParallelEffect(opacityEffect);

	options = {duration:durationInMilliseconds, toggle:false};
	var fromPos = new Spry.Effect.Utils.Position;
	fromPos.x = 0;
	fromPos.y = 0;
	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = startWidth / 2.0 * -1.0;
	toPos.y = startHeight / 2.0 * -1.0;
	var moveEffect = new Spry.Effect.Move(element, fromPos, toPos, options);
	puffEffectCluster.addParallelEffect(moveEffect);

	puffEffectCluster.setup = setupCallback;
	puffEffectCluster.finish = finishCallback;
	puffEffectCluster.name = 'Puff';
	
	var registeredEffect = SpryRegistry.getRegisteredEffect(element, puffEffectCluster);
	registeredEffect.start();
	return registeredEffect;
};

Spry.Effect.DropOut = function (element, options) 
{
	var element = Spry.Effect.getElement(element);
	
	var dropoutEffectCluster = new Spry.Effect.Cluster;
	
	var durationInMilliseconds = 500;

	Spry.Effect.makePositioned(element);

	var setupCallback = null;
	var finishCallback = null;

	if (options)
	{
		if (options.setup != null) setupCallback = options.setup;
		if (options.finish != null) finishCallback = options.finish;
	}

	var startOffsetPosition = new Spry.Effect.Utils.Position();
	startOffsetPosition.x = parseInt(Spry.Effect.getStyleProp(element, "left"));
	startOffsetPosition.y = parseInt(Spry.Effect.getStyleProp(element, "top"));	
	if (!startOffsetPosition.x) startOffsetPosition.x = 0;
	if (!startOffsetPosition.y) startOffsetPosition.y = 0;	
	
	var fromPos = new Spry.Effect.Utils.Position;
	fromPos.x = startOffsetPosition.x + 0;
	fromPos.y = startOffsetPosition.y + 0;

	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = startOffsetPosition.x + 0;
	toPos.y = startOffsetPosition.y + 160;

	options = {from:fromPos, to:toPos, duration:durationInMilliseconds, toggle:true};
	var moveEffect = new Spry.Effect.Move(element, options.from, options.to, options);
	dropoutEffectCluster.addParallelEffect(moveEffect);

	options = {duration:durationInMilliseconds, toggle:true};
	var fromOpacity = 1.0;
	var toOpacity = 0.0;
	var opacityEffect = new Spry.Effect.Opacity(element, fromOpacity, toOpacity, options);
	dropoutEffectCluster.addParallelEffect(opacityEffect);

	dropoutEffectCluster.setup = setupCallback;
	dropoutEffectCluster.finish = finishCallback;
	dropoutEffectCluster.name = 'DropOut';
	
	var registeredEffect = SpryRegistry.getRegisteredEffect(element, dropoutEffectCluster);
	registeredEffect.start();
	return registeredEffect;
};

Spry.Effect.Fold = function (element, options) 
{
	var element = Spry.Effect.getElement(element);
	
	var durationInMilliseconds = 1000;
	var doToggle = false;
	var doScaleContent = true;
	
	var foldEffectCluster = new Spry.Effect.Cluster();

	var originalRect = Spry.Effect.getDimensions(element);

	var startWidth = originalRect.width;
	var startHeight = originalRect.height;
		
	var stopWidth = startWidth;
	var stopHeight = startHeight / 5;
	
	var fromRect = new Spry.Effect.Utils.Rectangle;
	fromRect.width = startWidth;
	fromRect.height = startHeight;
	
	var toRect = new Spry.Effect.Utils.Rectangle;
	toRect.width = stopWidth;
	toRect.height = stopHeight;
	
	options = {duration:durationInMilliseconds, toggle:doToggle, scaleContent:doScaleContent};
	var sizeEffect = new Spry.Effect.Size(element, fromRect, toRect, options);
	foldEffectCluster.addNextEffect(sizeEffect);
	
	durationInMilliseconds = 500;
	options = {duration:durationInMilliseconds, toggle:doToggle, scaleContent:doScaleContent};
	fromRect.width = "100%";
	fromRect.height = "20%";
	toRect.width = "10%";
	toRect.height = "20%";
	var sizeEffect = new Spry.Effect.Size(element, fromRect, toRect, options);
	foldEffectCluster.addNextEffect(sizeEffect);
	foldEffectCluster.name = 'Fold';
	
	var registeredEffect = SpryRegistry.getRegisteredEffect(element, foldEffectCluster);
	registeredEffect.start();
	return registeredEffect;
};
/* SpryValidationSelect.js - Revision: Spry Preview Release 1.4 */

// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry;
if (!Spry) Spry = {};
if (!Spry.Widget) Spry.Widget = {};

Spry.Widget.ValidationSelect = function(element, opts)
{
	this.init(element);

	Spry.Widget.Utils.setOptions(this, opts);

	// set validateOn flags
	var validateOn = ['submit'].concat(this.validateOn || []);
	validateOn = validateOn.join(",");
	this.validateOn = 0 | (validateOn.indexOf('submit') != -1 ? Spry.Widget.ValidationSelect.ONSUBMIT : 0);
	this.validateOn = this.validateOn | (validateOn.indexOf('blur') != -1 ? Spry.Widget.ValidationSelect.ONBLUR : 0);
	this.validateOn = this.validateOn | (validateOn.indexOf('change') != -1 ? Spry.Widget.ValidationSelect.ONCHANGE : 0);


	// Unfortunately in some browsers like Safari, the Stylesheets our
	// page depends on may not have been loaded at the time we are called.
	// This means we have to defer attaching our behaviors until after the
	// onload event fires, since some of our behaviors rely on dimensions
	// specified in the CSS.

	if (Spry.Widget.ValidationSelect.onloadDidFire)
		this.attachBehaviors();
	else 
		Spry.Widget.ValidationSelect.loadQueue.push(this);
};

Spry.Widget.ValidationSelect.ONCHANGE = 1;
Spry.Widget.ValidationSelect.ONBLUR = 2;
Spry.Widget.ValidationSelect.ONSUBMIT = 4;

Spry.Widget.ValidationSelect.prototype.init = function(element)
{
	this.element = this.getElement(element);
	this.selectElement = null;
	this.form = null;
	this.event_handlers = [];
	
	 // this.element can be either the container (<span>)
	 // or the <select> element, when no error messages are used.
	
	this.requiredClass = "selectRequiredState";
	this.invalidClass = "selectInvalidState";
	this.focusClass = "selectFocusState";
	this.validClass = "selectValidState";
	
	this.emptyValue = "";
	this.invalidValue = null;
	this.isRequired = true;
	
	this.validateOn = ["submit"];  // change, blur, submit
	// flag used to avoid cascade validation when both 
	// onChange and onBlur events are used to trigger validation
	this.validatedByOnChangeEvent = false;
};

Spry.Widget.ValidationSelect.prototype.destroy = function() {
	for (var i=0; i<this.event_handlers.length; i++) {
		Spry.Widget.Utils.removeEventListener(this.event_handlers[i][0], this.event_handlers[i][1], this.event_handlers[i][2], false);
	}
	try { delete this.element; } catch(err) {}
	try { delete this.selectElement; } catch(err) {}
	try { delete this.form; } catch(err) {}
	try { delete this.event_handlers; } catch(err) {}

	var q = Spry.Widget.Form.onSubmitWidgetQueue;
	var qlen = q.length;
	for (var i = 0; i < qlen; i++) {
		if (q[i] == this) {
			q.splice(i, 1);
			break;
		}
	}
};

Spry.Widget.ValidationSelect.onloadDidFire = false;
Spry.Widget.ValidationSelect.loadQueue = [];

Spry.Widget.ValidationSelect.prototype.getElement = function(ele)
{
	if (ele && typeof ele == "string")
		return document.getElementById(ele);
	return ele;
};

Spry.Widget.ValidationSelect.processLoadQueue = function(handler)
{
	Spry.Widget.ValidationSelect.onloadDidFire = true;
	var q = Spry.Widget.ValidationSelect.loadQueue;
	var qlen = q.length;
	for (var i = 0; i < qlen; i++)
		q[i].attachBehaviors();
};

Spry.Widget.ValidationSelect.addLoadListener = function(handler)
{
	if (typeof window.addEventListener != 'undefined')
		window.addEventListener('load', handler, false);
	else if (typeof document.addEventListener != 'undefined')
		document.addEventListener('load', handler, false);
	else if (typeof window.attachEvent != 'undefined')
		window.attachEvent('onload', handler);
};

Spry.Widget.ValidationSelect.addLoadListener(Spry.Widget.ValidationSelect.processLoadQueue);
Spry.Widget.ValidationSelect.addLoadListener(function(){
	Spry.Widget.Utils.addEventListener(window, "unload", Spry.Widget.Form.destroyAll, false);
});

Spry.Widget.ValidationSelect.prototype.attachBehaviors = function()
{
	// find the SELECT element inside current container
	if (this.element.nodeName == "SELECT") {
		this.selectElement = this.element;
	} else {
		this.selectElement = Spry.Widget.Utils.getFirstChildWithNodeNameAtAnyLevel(this.element, "SELECT");
	}

	if (this.selectElement) {
		var self = this;
		this.event_handlers = [];
		// focus
		// attach on beforeactivate instead of focus for IE 7 (to overcome this bug: setting a class name, closes the select)
		var focusEventName = "focus";
		if (navigator.userAgent.toLowerCase().indexOf("msie 7.") != -1) {
			focusEventName = "beforeactivate";
		}
		this.event_handlers.push([this.selectElement, focusEventName, function(e) { if (self.isDisabled()) return true; return self.onFocus(e); }]);
		// blur
		this.event_handlers.push([this.selectElement, "blur", function(e) { if (self.isDisabled()) return true; return self.onBlur(e); }]);
		// change
		if (this.validateOn & Spry.Widget.ValidationSelect.ONCHANGE) {
			this.event_handlers.push([this.selectElement, "change", function(e) { if (self.isDisabled()) return true; return self.onChange(e); }]);
			this.event_handlers.push([this.selectElement, "keypress", function(e) { if (self.isDisabled()) return true; return self.onChange(e); }]);
		}

		for (var i=0; i<this.event_handlers.length; i++) {
			Spry.Widget.Utils.addEventListener(this.event_handlers[i][0], this.event_handlers[i][1], this.event_handlers[i][2], false);
		}

		// submit
		this.form = Spry.Widget.Utils.getFirstParentWithNodeName(this.selectElement, "FORM");
		if (this.form) {
			// if no "onSubmit" handler has been attached to the current form, attach one
			if (!this.form.attachedSubmitHandler && !this.form.onsubmit) {
				this.form.onsubmit = function(e) { e = e || event; return Spry.Widget.Form.onSubmit(e, e.srcElement || e.currentTarget) };
				this.form.attachedSubmitHandler = true;                 
			}
			if (!this.form.attachedResetHandler) {
				Spry.Widget.Utils.addEventListener(this.form, "reset", function(e) { e = e || event; return Spry.Widget.Form.onReset(e, e.srcElement || e.currentTarget) }, false);
				this.form.attachedResetHandler = true;                 
			}
			// add the currrent widget to the "onSubmit" check queue;
			Spry.Widget.Form.onSubmitWidgetQueue.push(this);
		}
	}
};


Spry.Widget.ValidationSelect.prototype.addClassName = function(ele, className)
{
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) != -1))
		return;
	ele.className += (ele.className ? " " : "") + className;
};

Spry.Widget.ValidationSelect.prototype.removeClassName = function(ele, className)
{
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) == -1))
		return;
	ele.className = ele.className.replace(new RegExp("\\s*\\b" + className + "\\b", "g"), "");
};



Spry.Widget.ValidationSelect.prototype.onFocus = function(e)
{
	this.hasFocus = true;
	this.validatedByOnChangeEvent = false;
	this.addClassName(this.element, this.focusClass);
};

Spry.Widget.ValidationSelect.prototype.onBlur = function(e)
{
	this.hasFocus = false;
	var doValidation = false;
	if (this.validateOn & Spry.Widget.ValidationSelect.ONBLUR)
		doValidation = true;
	if (doValidation && !this.validatedByOnChangeEvent)
		this.validate();
	this.removeClassName(this.element, this.focusClass);
};

Spry.Widget.ValidationSelect.prototype.onChange = function(e)
{
	this.hasFocus = false;
	this.validate();
	this.validatedByOnChangeEvent = true;
};

Spry.Widget.ValidationSelect.prototype.reset = function() {
	this.removeClassName(this.element, this.requiredClass);
	this.removeClassName(this.element, this.invalidClass);
	this.removeClassName(this.element, this.validClass);
};

Spry.Widget.ValidationSelect.prototype.validate = function() {
	this.removeClassName(this.element, this.requiredClass);
	this.removeClassName(this.element, this.invalidClass);
	this.removeClassName(this.element, this.validClass);
	// check isRequired
	if (this.isRequired) {
		// there are no options, or no option has been selected
		if (this.selectElement.options.length == 0 || this.selectElement.selectedIndex == -1) {
			this.addClassName(this.element, this.requiredClass);
			return false;
		}
		// the current selected option has no "value" attribute
		// when no value is set, browsers implement different behaviour for the value property
		// IE: value = blank string ("")
		// FF, Opera: value = option text
		if (this.selectElement.options[this.selectElement.selectedIndex].getAttribute("value") == null) {
			this.addClassName(this.element, this.requiredClass);
			return false;
		}
		// the current selected option has blank string ("") value
		if (this.selectElement.options[this.selectElement.selectedIndex].value == this.emptyValue) {
			this.addClassName(this.element, this.requiredClass);
			return false;
		}
		// the current selected option has "disabled" attribute
		// IE 6 allows to select such options
		if (this.selectElement.options[this.selectElement.selectedIndex].disabled) {
			this.addClassName(this.element, this.requiredClass);
			return false;
		}
	}
	if (this.invalidValue) {
		if (this.selectElement.options.length > 0 && 
			this.selectElement.selectedIndex != -1 &&
			this.selectElement.options[this.selectElement.selectedIndex].value == this.invalidValue) {
			this.addClassName(this.element, this.invalidClass);
			return false;
		}
	}
	this.addClassName(this.element, this.validClass);
	return true;
}

Spry.Widget.ValidationSelect.prototype.isDisabled = function() {
	return this.selectElement.disabled;	
}

//////////////////////////////////////////////////////////////////////
//
// Spry.Widget.Form - common for all widgets
//
//////////////////////////////////////////////////////////////////////

if (!Spry.Widget.Form) Spry.Widget.Form = {};
if (!Spry.Widget.Form.onSubmitWidgetQueue) Spry.Widget.Form.onSubmitWidgetQueue = [];

if (!Spry.Widget.Form.validate) {
	Spry.Widget.Form.validate = function(vform) {
		var isValid = true;
		var isElementValid = true;
		var q = Spry.Widget.Form.onSubmitWidgetQueue;
		var qlen = q.length;
		for (var i = 0; i < qlen; i++) {
			if (!q[i].isDisabled() && q[i].form == vform) {
				isElementValid = q[i].validate();
				isValid = isElementValid && isValid;
			}
		}
		return isValid;
	}
};

if (!Spry.Widget.Form.onSubmit) {
	Spry.Widget.Form.onSubmit = function(e, form)
	{
		if (Spry.Widget.Form.validate(form) == false) {
			return false;
		}
		return true;
	};
};

if (!Spry.Widget.Form.onReset) {
	Spry.Widget.Form.onReset = function(e, vform)
	{
		var q = Spry.Widget.Form.onSubmitWidgetQueue;
		var qlen = q.length;
		for (var i = 0; i < qlen; i++) {
			if (!q[i].isDisabled() && q[i].form == vform && typeof(q[i].reset) == 'function') {
				q[i].reset();
			}
		}
		return true;
	};
};

if (!Spry.Widget.Form.destroy) {
	Spry.Widget.Form.destroy = function(form)
	{
		var q = Spry.Widget.Form.onSubmitWidgetQueue;
		for (var i = 0; i < Spry.Widget.Form.onSubmitWidgetQueue.length; i++) {
			if (q[i].form == form && typeof(q[i].destroy) == 'function') {
				q[i].destroy();
				i--;
			}
		}
	}
};

if (!Spry.Widget.Form.destroyAll) {
	Spry.Widget.Form.destroyAll = function()
	{
		var q = Spry.Widget.Form.onSubmitWidgetQueue;
		for (var i = 0; i < Spry.Widget.Form.onSubmitWidgetQueue.length; i++) {
			if (typeof(q[i].destroy) == 'function') {
				q[i].destroy();
				i--;
			}
		}
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Widget.Utils
//
//////////////////////////////////////////////////////////////////////

if (!Spry.Widget.Utils)	Spry.Widget.Utils = {};

Spry.Widget.Utils.setOptions = function(obj, optionsObj, ignoreUndefinedProps)
{
	if (!optionsObj)
		return;
	for (var optionName in optionsObj)
	{
		if (ignoreUndefinedProps && optionsObj[optionName] == undefined)
			continue;
		obj[optionName] = optionsObj[optionName];
	}
};


Spry.Widget.Utils.getFirstChildWithNodeNameAtAnyLevel = function(node, nodeName)
{
	var elements  = node.getElementsByTagName(nodeName);
	if (elements) {
		return elements[0];
	}
	return null;
};

Spry.Widget.Utils.getFirstParentWithNodeName = function(node, nodeName)
{
	while (node.parentNode
			&& node.parentNode.nodeName.toLowerCase() != nodeName.toLowerCase()
			&& node.parentNode.nodeName != 'BODY') {
		node = node.parentNode;
	}

	if (node.parentNode && node.parentNode.nodeName.toLowerCase() == nodeName.toLowerCase()) {
		return node.parentNode;
	} else {
		return null;
	}
};

Spry.Widget.Utils.destroyWidgets = function (container)
{
	if (typeof container == 'string') {
		container = document.getElementById(container);
	}

	var q = Spry.Widget.Form.onSubmitWidgetQueue;
	for (var i = 0; i < Spry.Widget.Form.onSubmitWidgetQueue.length; i++) {
		if (typeof(q[i].destroy) == 'function' && Spry.Widget.Utils.contains(container, q[i].element)) {
			q[i].destroy();
			i--;
		}
	}
};

Spry.Widget.Utils.contains = function (who, what)
{
	if (typeof who.contains == 'object') {
		return what && who && (who == what || who.contains(what));
	} else {
		var el = what;
		while(el) {
			if (el == who) {
				return true;
			}
			el = el.parentNode;
		}
		return false;
	}
};

Spry.Widget.Utils.addEventListener = function(element, eventType, handler, capture)
{
	try
	{
		if (element.addEventListener)
			element.addEventListener(eventType, handler, capture);
		else if (element.attachEvent)
			element.attachEvent("on" + eventType, handler, capture);
	}
	catch (e) {}
};

Spry.Widget.Utils.removeEventListener = function(element, eventType, handler, capture)
{
	try
	{
		if (element.removeEventListener)
			element.removeEventListener(eventType, handler, capture);
		else if (element.detachEvent)
			element.detachEvent("on" + eventType, handler, capture);
	}
	catch (e) {}
};


// SpryValidationTextarea.js - version 0.15 - Spry Pre-Release 1.5
//
// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry;
if (!Spry) Spry = {};
if (!Spry.Widget) Spry.Widget = {};

Spry.Widget.BrowserSniff = function() {
	var b = navigator.appName.toString();
	var up = navigator.platform.toString();
	var ua = navigator.userAgent.toString();

	this.mozilla = this.ie = this.opera = r = false;
	var re_opera = /Opera.([0-9\.]*)/i;
	var re_msie = /MSIE.([0-9\.]*)/i;
	var re_gecko = /gecko/i;
	var re_safari = /safari\/([\d\.]*)/i;
	
	if (ua.match(re_opera)) {
		r = ua.match(re_opera);
		this.opera = true;
		this.version = parseFloat(r[1]);
	} else if (ua.match(re_msie)) {
		r = ua.match(re_msie);
		this.ie = true;
		this.version = parseFloat(r[1]);
	} else if (ua.match(re_safari)) {
		this.safari = true;
		this.version = 1.4;
	} else if (ua.match(re_gecko)) {
		var re_gecko_version = /rv:\s*([0-9\.]+)/i;
		r = ua.match(re_gecko_version);
		this.mozilla = true;
		this.version = parseFloat(r[1]);
	}
	this.windows = this.mac = this.linux = false;

	this.Platform = ua.match(/windows/i) ? "windows" :
					(ua.match(/linux/i) ? "linux" :
					(ua.match(/mac/i) ? "mac" :
					ua.match(/unix/i)? "unix" : "unknown"));
	this[this.Platform] = true;
	this.v = this.version;

	if (this.safari && this.mac && this.mozilla) {
		this.mozilla = false;
	}
};

Spry.is = new Spry.Widget.BrowserSniff();


Spry.Widget.ValidationTextarea = function(element, options){
	
	options = options || {};
	this.flags = {locked: false};
	this.options = {};
	this.element = element;
	this.init(element);

	if (!this.isBrowserSupported()){
		return;	
	}

	options.useCharacterMasking = Spry.Widget.Utils.firstValid(options.useCharacterMasking, true);
	options.hint = Spry.Widget.Utils.firstValid(options.hint, '');
	options.isRequired = Spry.Widget.Utils.firstValid(options.isRequired, true);
	options.additionalError = Spry.Widget.Utils.firstValid(options.additionalError, false);

	Spry.Widget.Utils.setOptions(this, options);
	Spry.Widget.Utils.setOptions(this.options, options);

	if (options.additionalError)
		this.additionalError = this.getElement(options.additionalError);

	//make sure we validate at least on submit
	var validateOn = ['submit'].concat(Spry.Widget.Utils.firstValid(this.options.validateOn, []));
	validateOn = validateOn.join(",");
	this.validateOn = 0;
	this.validateOn = this.validateOn | (validateOn.indexOf('submit') != -1 ? Spry.Widget.ValidationTextarea.ONSUBMIT : 0);
	this.validateOn = this.validateOn | (validateOn.indexOf('blur') != -1 ? Spry.Widget.ValidationTextarea.ONBLUR : 0);
	this.validateOn = this.validateOn | (validateOn.indexOf('change') != -1 ? Spry.Widget.ValidationTextarea.ONCHANGE : 0);

	if (Spry.Widget.ValidationTextarea.onloadDidFire){
		this.attachBehaviors();
	}else{
		Spry.Widget.ValidationTextarea.loadQueue.push(this);
	}
};

Spry.Widget.ValidationTextarea.ONCHANGE = 1;
Spry.Widget.ValidationTextarea.ONBLUR = 2;
Spry.Widget.ValidationTextarea.ONSUBMIT = 4;

Spry.Widget.ValidationTextarea.INITIAL = 'Initial';
Spry.Widget.ValidationTextarea.REQUIRED = 'Required';
Spry.Widget.ValidationTextarea.INVALID = 'Invalid Format';
Spry.Widget.ValidationTextarea.MINIMUM = 'Minimum Number of Chars Not Met';
Spry.Widget.ValidationTextarea.MAXIMUM = 'Maximum Number of Chars Exceeded';
Spry.Widget.ValidationTextarea.VALID = 'Valid';

Spry.Widget.ValidationTextarea.prototype.init = function(element)
{
	this.element = this.getElement(element);
	this.event_handlers = [];

	this.requiredClass = "textareaRequiredState";
	this.invalidCharsMaxClass = "textareaMaxCharsState";
	this.invalidCharsMinClass = "textareaMinCharsState";
	this.validClass = "textareaValidState";
	this.focusClass = "textareaFocusState";
	this.hintClass = "textareaHintState";
	this.textareaFlashClass = "textareaFlashState";

	this.isMaxInvalid = false;
	this.isMinInvalid = false;
	this.isRequireInvalid = false;
	
	this.safariClicked = false;
	this.state = Spry.Widget.ValidationTextarea.INITIAL;
};

Spry.Widget.ValidationTextarea.prototype.destroy = function() {
	for (var i=0; i<this.event_handlers.length; i++) {
		Spry.Widget.Utils.removeEventListener(this.event_handlers[i][0], this.event_handlers[i][1], this.event_handlers[i][2], false);
	}
	try { delete this.element; } catch(err) {}
	try { delete this.input; } catch(err) {}
	try { delete this.counterEl; } catch(err) {}
	try { delete this.form; } catch(err) {}
	try { delete this.event_handlers; } catch(err) {}
	try { this.cursorPosition.destroy(); } catch(err) {}
	try { delete this.cursorPosition; } catch(err) {}
	try { this.initialCursor.destroy(); } catch(err) {}
	try { delete this.initialCursor; } catch(err) {}

	var q = Spry.Widget.Form.onSubmitWidgetQueue;
	var qlen = q.length;
	for (var i = 0; i < qlen; i++) {
		if (q[i] == this) {
			q.splice(i, 1);
			break;
		}
	}
};

Spry.Widget.ValidationTextarea.prototype.isDisabled = function() {
	return this.input && (this.input.disabled || this.input.readOnly) || !this.input;
};

Spry.Widget.ValidationTextarea.prototype.getElement = function(ele)
{
	if (ele && typeof ele == "string")
		return document.getElementById(ele);
	return ele;
};


Spry.Widget.ValidationTextarea.addLoadListener = function(handler){
	if (typeof window.addEventListener != 'undefined'){
		window.addEventListener('load', handler, false);
	}else if (typeof document.addEventListener != 'undefined'){
		document.addEventListener('load', handler, false);
	}else if (typeof window.attachEvent != 'undefined'){
		window.attachEvent('onload', handler);
	}
};

Spry.Widget.ValidationTextarea.processLoadQueue = function(handler){
	Spry.Widget.ValidationTextarea.onloadDidFire = true;
	var q = Spry.Widget.ValidationTextarea.loadQueue;
	var qlen = q.length;
	for (var i = 0; i < qlen; i++){
		q[i].attachBehaviors();
	}
};

Spry.Widget.ValidationTextarea.onloadDidFire = false;
Spry.Widget.ValidationTextarea.loadQueue = [];
Spry.Widget.ValidationTextarea.addLoadListener(Spry.Widget.ValidationTextarea.processLoadQueue);
Spry.Widget.ValidationTextarea.addLoadListener(function(){
	Spry.Widget.Utils.addEventListener(window, "unload", Spry.Widget.Form.destroyAll, false);
});

Spry.Widget.ValidationTextarea.prototype.isBrowserSupported = function()
{
	return Spry.is.ie && Spry.is.v >= 5 && Spry.is.windows
		||
	Spry.is.mozilla && Spry.is.v >= 1.4
		||
	Spry.is.safari
		||
	Spry.is.opera && Spry.is.v >= 9;
};

/* 
 * register our input to different event notifiers 
 *
 */
Spry.Widget.ValidationTextarea.prototype.attachBehaviors = function()
{
	if (this.element){
		if (this.element.nodeName == "TEXTAREA") {
			this.input = this.element;
		} else {
			this.input = Spry.Widget.Utils.getFirstChildWithNodeNameAtAnyLevel(this.element, "TEXTAREA");
		}
	}
	if (this.options && this.options.counterType && (this.options.counterType == 'chars_count' || this.options.counterType == 'chars_remaining')){
			this.counterEl = document.getElementById(this.options.counterId);
			this.counterChar();
	}

	if (this.input) {
		this.input.setAttribute("AutoComplete", "off");
		this.putHint();
		this.cursorPosition = new Spry.Widget.SelectionDescriptor(this.input);

		var self = this;
		this.event_handlers = [];

		//attach the pattern related event handlers (to stop invalid keys) 
		if (this.useCharacterMasking) {
			if (Spry.is.ie){
				this.event_handlers.push([this.input, "propertychange", function(e) { return self.onKeyEvent(e || event); }]);
				this.event_handlers.push([this.input, "drop", function(e) { return self.onDrop (e || event); }]);
				this.event_handlers.push([this.input, "keypress", function(e) { return self.onKeyPress(e || event); }]);
			} else{
				this.event_handlers.push([this.input, "keydown", function(e) { return self.onKeyDown(e); }]);
				this.event_handlers.push([this.input, "keypress", function(e) { return self.safariKeyPress(e); }]);
				this.event_handlers.push([this.input, "keyup", function(e) { return self.safariValidate(e); }]);
				if (Spry.is.safari){
					this.event_handlers.push([this.input, "mouseup", function(e) { return self.safariMouseUp(e); }]);
					this.event_handlers.push([this.input, "mousedown", function(e) { return self.safariMouseDown(e); }]);
				} else {
					//Firefox bug: 355219
					//this.event_handlers.push([this.input, "input", function(e) { self.onKeyEvent(e); return true;}]);
					this.event_handlers.push([this.input, "dragdrop", function(e) { return self.onKeyEvent(e); }]);
					this.event_handlers.push([this.input, "dragenter", function(e) { self.removeHint(); return self.onKeyDown(e); }]);
					this.event_handlers.push([this.input, "dragexit", function(e) { return self.putHint(); }]);
				}
			}
			// we need to save an initial state in case of invalid input
			this.event_handlers.push([this.input, "keydown", function(e) {return self.onKeyDown(e || event); }]);
		}

		this.event_handlers.push([this.input, "focus", function(e) { return self.onFocus(e || event); }]);
		this.event_handlers.push([this.input, "mousedown", function(e) { return self.onMouseDown(e || event); }]);
		this.event_handlers.push([this.input, "blur", function(e) { return self.onBlur(e || event); }]);

		if (this.validateOn & Spry.Widget.ValidationTextarea.ONCHANGE){
				if (Spry.is.ie){
						this.event_handlers.push([this.input, "propertychange", function(e) { return self.onChange(e || event); }]);
						this.event_handlers.push([this.input, "drop", function(e) { return self.onChange(e || event); }]);
				} else{
						this.event_handlers.push([this.input, "keydown", function(e) { return self.onKeyDown(e); }]);
						this.event_handlers.push([this.input, "keypress", function(e) { return self.safariChangeKeyPress(e); }]);
						this.event_handlers.push([this.input, "keyup", function(e) { return self.safariChangeValidate(e); }]);
						if (Spry.is.safari){
							this.event_handlers.push([this.input, "mouseup", function(e) { return self.safariChangeMouseUp(e); }]);
							this.event_handlers.push([this.input, "mousedown", function(e) { return self.safariMouseDown(e); }]);
						} else {
							// Firefox bug: 355219
							//this.event_handlers.push([this.input, "input", function(e) { return self.onChange(e); }]);
							this.event_handlers.push([this.input, "dragdrop", function(e) {return self.onChange(e); }]);
							this.event_handlers.push([this.input, "dragenter", function(e) { self.removeHint(); return self.onKeyDown(e); }]);
							this.event_handlers.push([this.input, "dragexit", function(e) { return self.putHint(); }]);
						}
				}
		}
		// The counter should be called directly when no enforcement or change restrictions exists
		if (! (this.validateOn & Spry.Widget.ValidationTextarea.ONCHANGE) && !this.useCharacterMasking){
				if (Spry.is.ie){
						this.event_handlers.push([this.input, "propertychange", function(e) { return self.counterChar(); }]);
						this.event_handlers.push([this.input, "drop", function(e) { return self.counterChar(); }]);
				} else{
						this.event_handlers.push([this.input, "keypress", function(e) { return self.counterChar(); }]);
						this.event_handlers.push([this.input, "keyup", function(e) { return self.counterChar(); }]);
						if (Spry.is.safari){
							this.event_handlers.push([this.input, "mouseup", function(e) { return self.counterChar(); }]);
						} else {
							// Firefox bug: 355219
							//this.event_handlers.push([this.input, "input", function(e) { return self.onChange(e); }]);
							this.event_handlers.push([this.input, "dragdrop", function(e) {return self.counterChar(); }]);
						}
				}
		}

		for (var i=0; i<this.event_handlers.length; i++) {
			Spry.Widget.Utils.addEventListener(this.event_handlers[i][0], this.event_handlers[i][1], this.event_handlers[i][2], false);
		}

		this.form = Spry.Widget.Utils.getFirstParentWithNodeName(this.input, "FORM");
		if (this.form) {
			if (!this.form.attachedSubmitHandler && !this.form.onsubmit) {
				this.form.onsubmit = function(e) { e = e || event; return Spry.Widget.Form.onSubmit(e, e.srcElement || e.currentTarget) };
				this.form.attachedSubmitHandler = true;                 
			}
			if (!this.form.attachedResetHandler) {
				Spry.Widget.Utils.addEventListener(this.form, "reset", function(e) { e = e || event; return Spry.Widget.Form.onReset(e, e.srcElement || e.currentTarget) }, false);
				this.form.attachedResetHandler = true;                 
			}
			// add the currrent widget to the "onSubmit" check queue;
			Spry.Widget.Form.onSubmitWidgetQueue.push(this);
		}
	}
	this.saveState();
};

Spry.Widget.ValidationTextarea.prototype.onTyping = function(e){
	if (this.input.disabled == true || this.input.readOnly == true){
			return;	
	}

	if (!this.initialCursor){
		this.initialCursor = this.cursorPosition;	
	}
	// on IE a stack overflow appears
	if (this.flags.locked){
			return true;
	}

	var val = this.input.value;

	var ret = true;
	
	if (this.flags.hintOn){
		return true;
	}
 	if (e && this.input && this.options && this.options.maxChars > 0 && ret){
		if ( val.length > this.options.maxChars  && 
							((!Spry.Widget.Utils.isSpecialKey(e) && this.cursorPosition.start == this.cursorPosition.end) ||
				 			 (Spry.Widget.Utils.isSpecialKey(e) && val != this.initialValue) ||
				 				this.cursorPosition.start != this.cursorPosition.end)
			 ){
					// cut the extra chars and display error
					this.flags.locked = true;
					var initial = this.initialValue;
					var start = this.initialCursor.start;
					var end = this.initialCursor.end;
					if (initial.length && this.initialCursor.end < initial.length) {
							// we try to behave more like maxlength textfield
							var tmp = end - start + this.options.maxChars - initial.length;
							var newValue = initial.substring(0, start) + val.substring(start, start+tmp) + initial.substring(end, initial.length < this.options.maxChars ? initial.length:this.options.maxChars);
							end = start + tmp;
					}else{
							var newValue = val.substring(0, this.options.maxChars);
							end = start = this.options.maxChars;
					}
					if (Spry.is.ie) {
						this.input.innerText = newValue;
					} else {
						this.input.value = newValue;
					}
					this.redTextFlash();
					this.cursorPosition.moveTo(end, end);
					this.flags.locked = false;
					ret = false;
			} else{
					this.setState(Spry.Widget.ValidationTextarea.VALID);
					this.isMaxInvalid = false;
			}
	}
	this.counterChar();
	return ret;
};

Spry.Widget.ValidationTextarea.prototype.validateMinRequired = function(val){
	var oldInvalid = false;
	if (typeof this.notFireMinYet == 'undefined'){
		this.notFireMinYet = false;
	}else{
		oldInvalid = true;
		this.notFireMinYet = true;
	}
	if (this.onBlurOn){
		this.notFireMinYet = true;
	}else if (!this.onKeyEventOn){
		this.notFireMinYet = true;
	}

	if (this.input && this.options && this.options.isRequired){
			if (val.length > 0 && this.isRequireInvalid && (!this.hint || (this.hint && !this.flags.hintOn) || (this.hint && val != this.hint))){
						this.switchClassName(this.validClass);
						this.setState(Spry.Widget.ValidationTextarea.VALID);
						this.isRequireInvalid = false;
			}else if ((val.length == 0 || !(!this.hint || (this.hint && !this.flags.hintOn) || (this.hint && val != this.hint))) && (!this.isRequireInvalid || oldInvalid)){
						if (this.notFireMinYet || Spry.is.ie){
							this.switchClassName(this.requiredClass);
							this.setState(Spry.Widget.ValidationTextarea.REQUIRED);
						}
						this.isRequireInvalid = true;
						this.isMinInvalid = false;
			}
	}
	if (this.input && this.options && this.options.minChars > 0 && !this.isRequireInvalid){
			if (val.length >= this.options.minChars && (!this.hint || (this.hint && !this.flags.hintOn) || (this.hint && val != this.hint)) && this.isMinInvalid){
						this.switchClassName(this.validClass);
						this.setState(Spry.Widget.ValidationTextarea.VALID);
						this.isMinInvalid = false;
			}else if ( (val.length < this.options.minChars || (this.hint && val == this.hint && this.flags.hintOn)) && !this.isMinInvalid){
						this.switchClassName(this.invalidCharsMinClass);
						this.setState(Spry.Widget.ValidationTextarea.MINIMUM);
						this.isMinInvalid = true;
			}
	}
};
Spry.Widget.ValidationTextarea.prototype.counterChar = function(){
	if (!this.counterEl || !this.options || !this.options.counterType || (this.options.counterType != 'chars_remaining' && this.options.counterType != 'chars_count')){
		return;	
	}

	if (this.options.counterType == 'chars_remaining') {
		if (this.options.maxChars > 0){
			if (this.flags.hintOn){
				this.setCounterElementValue(this.options.maxChars);
			} else {
				if (this.options.maxChars > this.input.value.length){
					this.setCounterElementValue(this.options.maxChars - this.input.value.length);
				}else{
					this.setCounterElementValue(0);
				}
			}
		}
	} else {
		if (this.flags.hintOn){
			this.setCounterElementValue(0);
		} else {
			if (this.useCharacterMasking && typeof this.options.maxChars != 'undefined' && this.options.maxChars < this.input.value.length){
				this.setCounterElementValue(this.options.maxChars);
			} else {
				this.setCounterElementValue(this.input.value.length);
			}
		}
	}
};

Spry.Widget.ValidationTextarea.prototype.setCounterElementValue = function(val){
		if ( this.counterEl.nodeName.toLowerCase() != 'input' && 
			this.counterEl.nodeName.toLowerCase() != 'textarea' &&
			this.counterEl.nodeName.toLowerCase() != 'select' &&
			this.counterEl.nodeName.toLowerCase() != 'img'){
			this.counterEl.innerHTML = val;
		}
};
Spry.Widget.ValidationTextarea.prototype.reset = function() {
	this.removeHint();
	this.removeClassName(this.requiredClass);
	this.removeClassName(this.invalidCharsMinClass);
	this.removeClassName(this.invalidCharsMaxClass);
	this.removeClassName(this.validClass);
	this.setState(Spry.Widget.ValidationTextarea.INITIAL);
	var self = this;
	setTimeout(function() {self.putHint();self.counterChar();}, 10);
};

Spry.Widget.ValidationTextarea.prototype.validate = function(){
	if (this.input.disabled == true || this.input.readOnly == true){
			return true;	
	}

	var val = this.input.value;
	this.validateMinRequired(val);

	var ret = !this.isMinInvalid && !this.isRequireInvalid;

	if (ret && this.options.maxChars > 0 && !this.useCharacterMasking){
			if (val.length <= this.options.maxChars || (this.hint && this.hint == val && this.flags.hintOn))	{
					this.switchClassName(this.validClass);
					this.setState(Spry.Widget.ValidationTextarea.VALID);
				  this.isMaxInvalid = false;
			}else{
					this.switchClassName(this.invalidCharsMaxClass);
					this.setState(Spry.Widget.ValidationTextarea.MAXIMUM);
					this.isMaxInvalid = true;	
			}
	}
	ret = ret && !this.isMaxInvalid;
	if (ret) {
		this.switchClassName(this.validClass);
	}
	this.counterChar();	
	return ret;
};

Spry.Widget.ValidationTextarea.prototype.setState = function(newstate){
	this.state = newstate;
};

Spry.Widget.ValidationTextarea.prototype.getState = function(){
	return this.state;
};

Spry.Widget.ValidationTextarea.prototype.removeHint = function()
{
	if (this.flags.hintOn) 
	{
		this.flags.locked = true;
		this.input.value = "";
		this.flags.locked = false;
		this.flags.hintOn = false;
		this.removeClassName(this.hintClass);
	}
};

Spry.Widget.ValidationTextarea.prototype.putHint = function()
{
	if(this.hint && this.input.value == "") {
		this.flags.hintOn = true;
		this.input.value = this.hint;
		this.addClassName(this.hintClass);
	}
};

Spry.Widget.ValidationTextarea.prototype.redTextFlash = function()
{
	var self = this;
	this.addClassName(this.textareaFlashClass);
	setTimeout(function() {
		self.removeClassName(self.textareaFlashClass)
	}, 200);
};


Spry.Widget.ValidationTextarea.prototype.onKeyPress = function(e)
{
	//ENTER has length 2 on IE Windows, so will exceed maxLength on proximity
	if (Spry.is.ie && Spry.is.windows && e.keyCode == 13) {
		if ( (this.initialCursor.length + this.options.maxChars - this.input.value.length) < 2) {
			Spry.Widget.Utils.stopEvent(e);
			return false;
		}
	}
};

Spry.Widget.ValidationTextarea.prototype.onKeyDown = function(e)
{ 
	this.saveState();
	this.keyCode = e.keyCode;
	return true;
};

/*
 * hadle for the max chars restrictions
 * if key pressed or the input text is invalid it returns false
 * 
 */
Spry.Widget.ValidationTextarea.prototype.onKeyEvent = function(e){
	// on IE we look only for this input value changes
	if (e.type == 'propertychange' && e.propertyName != 'value'){
			return true;
	}

	var allow = this.onTyping(e);

	if (!allow){
		Spry.Widget.Utils.stopEvent(e);
	}
	//return allow;
};

/*
 * handle for the min or required value
 * if the input text is invalid it returns false
 * 
 */
Spry.Widget.ValidationTextarea.prototype.onChange = function(e){
	if (Spry.is.ie && e && e.type == 'propertychange' && e.propertyName != 'value') {
		return true;
	}

	if (this.flags.drop) {
		//delay this if it's a drop operation
		var self = this;
		setTimeout(function() {
			self.flags.drop = false;
			self.onChange(null);
		}, 0);
		return true;
	}
	if (this.flags.hintOn) {
		return true;
	}
	this.onKeyEventOn = true;
	var answer = this.validate();
	this.onKeyEventOn = false;
	return answer;
};

Spry.Widget.ValidationTextarea.prototype.onMouseDown = function(e)
{
	if (this.flags.active) {
		//mousedown fires before focus
		//avoid double saveState on first focus by mousedown by checking if the control has focus
		//do nothing if it's not focused because saveState will be called onfocus
		this.saveState();
	}
};

Spry.Widget.ValidationTextarea.prototype.onDrop = function(e)
{
	//mark that a drop operation is in progress to avoid race conditions with event handlers for other events
	//especially onchange and onfocus
	this.flags.drop = true;
	this.removeHint();

	if (Spry.is.ie) {
		var rng = document.body.createTextRange();
		rng.moveToPoint(e.x, e.y);
		rng.select();
	}

	this.saveState();
	this.flags.active = true;
	this.addClassName(this.focusClass);
};

Spry.Widget.ValidationTextarea.prototype.onFocus = function(e)
{
	if (this.flags.drop) {
		return;
	}
	this.removeHint();
	this.saveState();
	this.flags.active = true;
	this.addClassName(this.focusClass);
};

Spry.Widget.ValidationTextarea.prototype.onBlur = function(e){
	this.removeClassName(this.focusClass);

	if (this.validateOn & Spry.Widget.ValidationTextarea.ONBLUR) {
		this.onBlurOn = true;
		this.validate();
		this.onBlurOn = false;
	}

	this.flags.active = false;
	var self = this;
	setTimeout(function() {self.putHint();}, 10);
};

Spry.Widget.ValidationTextarea.prototype.safariMouseDown = function(e){
	this.safariClicked = true;
};
Spry.Widget.ValidationTextarea.prototype.safariChangeMouseUp = function(e){
		if (!this.safariClicked){
			this.onKeyDown(e); 
			return this.safariChangeValidate(e, false);
		}else{
			this.safariClicked = false;
			return true;
		}
};

Spry.Widget.ValidationTextarea.prototype.safariMouseUp = function(e){
		if (!this.safariClicked){
			this.onKeyDown(e);
			return this.safariValidate(e, false);
		}else{
			this.safariClicked = false;
			return true;
		}
};

Spry.Widget.ValidationTextarea.prototype.safariKeyPress = function(e){
	this.safariFlag = new Date();
	return this.safariValidate(e, true);
};

Spry.Widget.ValidationTextarea.prototype.safariValidate = function(e, recall)
{
	if (e.keyCode && Spry.Widget.Utils.isSpecialKey(e) && e.keyCode != 8 && e.keyCode != 46){
		return true;
	}
	var answer = this.onTyping(e);

	// the answer to this is not yet final - we schedule another closing check
	if (new Date() - this.safariFlag < 1000 && recall){
		var self = this;
		setTimeout(function(){self.safariValidate(e, false);}, 1000);
	}
	return answer;
};

Spry.Widget.ValidationTextarea.prototype.safariChangeKeyPress = function(e){
	this.safariChangeFlag = new Date();
	return this.safariChangeValidate(e, true);
};

Spry.Widget.ValidationTextarea.prototype.safariChangeValidate = function(e, recall){
	
	if(e.keyCode && Spry.Widget.Utils.isSpecialKey(e) && e.keyCode != 8 && e.keyCode != 46){
		return true;	
	}
	var answer = this.onChange(e);

	// the answer to this is not yet final - we schedule another closing check
	if (new Date() - this.safariChangeFlag < 1000 && recall){
		var self = this;
		setTimeout(function(){ self.safariChangeValidate(e, false);}, 1000 - new Date() + this.safariChangeFlag);
	}
	return answer;
};

/*
 * save an initial state of the input to restore if the value is invalid
 * 
 */
Spry.Widget.ValidationTextarea.prototype.saveState = function(e){
	
	// we don't need this initial value that is already invalid
	if (this.options.maxChars > 0 && this.input.value.length > this.options.maxChars){
		return;
	}
	this.cursorPosition.update();
	if (!this.flags.hintOn){
		this.initialValue = this.input.value;
	}else{
		this.initialValue = '';
	}
	this.initialCursor = this.cursorPosition; 
	return true;
};

Spry.Widget.ValidationTextarea.prototype.checkClassName = function(ele, className){
	if (!ele || !className){
		return false;
	}
	if (typeof ele == 'string' ) {
		ele = document.getElementById(ele);
		if (!ele){
			return false;	
		}
	}
	if (!ele.className){
		ele.className = ' ';
	}
	return ele;
};

Spry.Widget.ValidationTextarea.prototype.switchClassName = function (className){
	var classes = [this.invalidCharsMaxClass, this.validClass, this.requiredClass, this.invalidCharsMinClass];

	for (var k = 0; k < classes.length; k++){
		if (classes[k] != className){
				this.removeClassName(classes[k]);			
		}
	}

	this.addClassName(className);
};

Spry.Widget.ValidationTextarea.prototype.addClassName = function(clssName){
	var ele = this.checkClassName(this.element, clssName);
	var add = this.checkClassName(this.additionalError, clssName);

	if (!ele || ele.className.search(new RegExp("\\b" + clssName + "\\b")) != -1){
	  return;
	}
	this.element.className += ' ' + clssName;
	if (add)
		add.className += ' ' + clssName;
};

Spry.Widget.ValidationTextarea.prototype.removeClassName = function(className){
	var ele = this.checkClassName(this.element, className);
	var add = this.checkClassName(this.additionalError, className);
	if (!ele){
	  return;	
	}
	ele.className = ele.className.replace(new RegExp("\\s*\\b" + className + "\\b", "g"), '');
	if (add){
		add.className = add.className.replace(new RegExp("\\s*\\b" + className + "\\b", "g"), '');
	}
}; 

/**
 * SelectionDescriptor is a wrapper for input type text selection methods and properties 
 * as implemented by various  browsers
 */
Spry.Widget.SelectionDescriptor = function (element)
{
	this.element = element;
	this.update();
};

Spry.Widget.SelectionDescriptor.prototype.update = function()
{
	if (Spry.is.ie && Spry.is.windows) {
		if (this.element.nodeName == "TEXTAREA") {
            var sel = this.element.ownerDocument.selection;
            if (sel.type != 'None') {
		var range = this.element.ownerDocument.selection.createRange();
		if (range.parentElement() == this.element){
			var range_all = this.element.ownerDocument.body.createTextRange();
			range_all.moveToElementText(this.element);
			for (var sel_start = 0; range_all.compareEndPoints('StartToStart', range) < 0; sel_start ++){
			 	range_all.moveStart('character', 1);
			}
			this.start = sel_start;
			// create a selection of the whole this.element
			range_all = this.element.ownerDocument.body.createTextRange();
			range_all.moveToElementText(this.element);
			for (var sel_end = 0; range_all.compareEndPoints('StartToEnd', range) < 0; sel_end++){
				range_all.moveStart('character', 1);
			}
			this.end = sel_end;
			this.length = this.end - this.start;
			// get selected and surrounding text
			this.text = range.text;
		 }
            }        
		} else if (this.element.nodeName == "INPUT"){
            var sel = this.element.ownerDocument.selection;
			this.range = this.element.ownerDocument.selection.createRange();
			this.length = this.range.text.length;
			var clone = this.range.duplicate();
			this.start = -clone.moveStart("character", -10000);
			clone = this.range.duplicate();
			clone.collapse(false);
			this.end = -clone.moveStart("character", -10000);
			this.text = this.range.text;
		}
	} else {
		var tmp = this.element;
		var selectionStart = 0;
		var selectionEnd = 0;

		try { selectionStart = tmp.selectionStart; } catch(err) {}
		try { selectionEnd = tmp.selectionEnd; } catch(err) {}

		if (Spry.is.safari) {
			if (selectionStart == 2147483647) {
				selectionStart = 0;
			}
			if (selectionEnd == 2147483647) {
				selectionEnd = 0;
			}
		}
		this.start = selectionStart;
		this.end = selectionEnd;
		this.length = selectionEnd - selectionStart;
		this.text = this.element.value.substring(selectionStart, selectionEnd);
	}
};

Spry.Widget.SelectionDescriptor.prototype.destroy = function() {
	try { delete this.range} catch(err) {}
	try { delete this.element} catch(err) {}
};

Spry.Widget.SelectionDescriptor.prototype.moveTo = function(start, end)
{
	if (Spry.is.ie && Spry.is.windows) {
		if (this.element.nodeName == "TEXTAREA") {
			var ta_range = this.element.createTextRange();
			this.range = this.element.createTextRange();
			this.range.move("character", start);
			this.range.moveEnd("character", end - start);
			
			var c1 = this.range.compareEndPoints("StartToStart", ta_range);
			if (c1 < 0) {
				this.range.setEndPoint("StartToStart", ta_range);
			}

			var c2 = this.range.compareEndPoints("EndToEnd", ta_range);
			if (c2 > 0) {
				this.range.setEndPoint("EndToEnd", ta_range);
			}
		} else if (this.element.nodeName == "INPUT"){
			this.range = this.element.ownerDocument.selection.createRange();
			this.range.move("character", -10000);
			this.start = this.range.moveStart("character", start);
			this.end = this.start + this.range.moveEnd("character", end - start);
		}
		this.range.select();
	} else {
		this.start = start;
		try { this.element.selectionStart = start; } catch(err) {}
		this.end = end;
		try { this.element.selectionEnd = end; } catch(err) {}
	}
	this.ignore = true;
	this.update();
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Widget.Form - common for all widgets
//
//////////////////////////////////////////////////////////////////////

if (!Spry.Widget.Form) Spry.Widget.Form = {};
if (!Spry.Widget.Form.onSubmitWidgetQueue) Spry.Widget.Form.onSubmitWidgetQueue = [];

if (!Spry.Widget.Form.validate) {
	Spry.Widget.Form.validate = function(vform) {
		var isValid = true;
		var isElementValid = true;
		var q = Spry.Widget.Form.onSubmitWidgetQueue;
		var qlen = q.length;
		for (var i = 0; i < qlen; i++) {
			if (!q[i].isDisabled() && q[i].form == vform) {
				isElementValid = q[i].validate();
				isValid = isElementValid && isValid;
			}
		}
		return isValid;
	}
};

if (!Spry.Widget.Form.onSubmit) {
	Spry.Widget.Form.onSubmit = function(e, form)
	{
		if (Spry.Widget.Form.validate(form) == false) {
			return false;
		}
		return true;
	};
};

if (!Spry.Widget.Form.onReset) {
	Spry.Widget.Form.onReset = function(e, vform)
	{
		var q = Spry.Widget.Form.onSubmitWidgetQueue;
		var qlen = q.length;
		for (var i = 0; i < qlen; i++) {
			if (!q[i].isDisabled() && q[i].form == vform && typeof(q[i].reset) == 'function') {
				q[i].reset();
			}
		}
		return true;
	};
};

if (!Spry.Widget.Form.destroy) {
	Spry.Widget.Form.destroy = function(form)
	{
		var q = Spry.Widget.Form.onSubmitWidgetQueue;
		for (var i = 0; i < Spry.Widget.Form.onSubmitWidgetQueue.length; i++) {
			if (q[i].form == form && typeof(q[i].destroy) == 'function') {
				q[i].destroy();
				i--;
			}
		}
	}
};

if (!Spry.Widget.Form.destroyAll) {
	Spry.Widget.Form.destroyAll = function()
	{
		var q = Spry.Widget.Form.onSubmitWidgetQueue;
		for (var i = 0; i < Spry.Widget.Form.onSubmitWidgetQueue.length; i++) {
			if (typeof(q[i].destroy) == 'function') {
				q[i].destroy();
				i--;
			}
		}
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Widget.Utils
//
//////////////////////////////////////////////////////////////////////

if (!Spry.Widget.Utils)	Spry.Widget.Utils = {};

Spry.Widget.Utils.setOptions = function(obj, optionsObj, ignoreUndefinedProps)
{
	if (!optionsObj)
		return;
	for (var optionName in optionsObj)
	{
		if (ignoreUndefinedProps && optionsObj[optionName] == undefined)
			continue;
		obj[optionName] = optionsObj[optionName];
	}
};

Spry.Widget.Utils.firstValid = function() {
	var ret = null;
	for(var i=0; i<Spry.Widget.Utils.firstValid.arguments.length; i++) {
		if (typeof(Spry.Widget.Utils.firstValid.arguments[i]) != 'undefined') {
			ret = Spry.Widget.Utils.firstValid.arguments[i];
			break;
		}
	}
	return ret;
};

Spry.Widget.Utils.specialSafariNavKeys = ",63232,63233,63234,63235,63272,63273,63275,63276,63277,63289,";

Spry.Widget.Utils.specialCharacters = ",8,9,16,17,18,20,27,33,34,35,36,37,38,39,40,45,46,91,92,93,144,192,63232,";
Spry.Widget.Utils.specialCharacters += Spry.Widget.Utils.specialSafariNavKeys;

Spry.Widget.Utils.isSpecialKey = function (ev) {
	return Spry.Widget.Utils.specialCharacters.indexOf("," + ev.keyCode + ",") != -1;
};

Spry.Widget.Utils.getFirstChildWithNodeNameAtAnyLevel = function(node, nodeName) {
	var elements  = node.getElementsByTagName(nodeName);
	if (elements) {
		return elements[0];
	}
	return null;
};

Spry.Widget.Utils.getFirstParentWithNodeName = function(node, nodeName)
{
	while (node.parentNode
			&& node.parentNode.nodeName.toLowerCase() != nodeName.toLowerCase()
			&& node.parentNode.nodeName != 'BODY') {
		node = node.parentNode;
	}

	if (node.parentNode && node.parentNode.nodeName.toLowerCase() == nodeName.toLowerCase()) {
		return node.parentNode;
	} else {
		return null;
	}
};

Spry.Widget.Utils.destroyWidgets = function (container)
{
	if (typeof container == 'string') {
		container = document.getElementById(container);
	}

	var q = Spry.Widget.Form.onSubmitWidgetQueue;
	for (var i = 0; i < Spry.Widget.Form.onSubmitWidgetQueue.length; i++) {
		if (typeof(q[i].destroy) == 'function' && Spry.Widget.Utils.contains(container, q[i].element)) {
			q[i].destroy();
			i--;
		}
	}
};

Spry.Widget.Utils.contains = function (who, what)
{
	if (typeof who.contains == 'object') {
		return what && who && (who == what || who.contains(what));
	} else {
		var el = what;
		while(el) {
			if (el == who) {
				return true;
			}
			el = el.parentNode;
		}
		return false;
	}
};

Spry.Widget.Utils.addEventListener = function(element, eventType, handler, capture)
{
	try
	{
		if (element.addEventListener)
			element.addEventListener(eventType, handler, capture);
		else if (element.attachEvent)
			element.attachEvent("on" + eventType, handler, capture);
	}
	catch (e) {}
};

Spry.Widget.Utils.removeEventListener = function(element, eventType, handler, capture)
{
	try
	{
		if (element.removeEventListener)
			element.removeEventListener(eventType, handler, capture);
		else if (element.detachEvent)
			element.detachEvent("on" + eventType, handler, capture);
	}
	catch (e) {}
};

Spry.Widget.Utils.stopEvent = function(ev)
{
	try
	{
		this.stopPropagation(ev);
		this.preventDefault(ev);
	}
	catch (e) {}
};

/**
 * Stops event propagation
 * @param {Event} ev the event
 */
Spry.Widget.Utils.stopPropagation = function(ev)
{
	if (ev.stopPropagation)
	{
		ev.stopPropagation();
	}
	else
	{
		ev.cancelBubble = true;
	}
};

/**
 * Prevents the default behavior of the event
 * @param {Event} ev the event
 */
Spry.Widget.Utils.preventDefault = function(ev)
{
	if (ev.preventDefault)
	{
		ev.preventDefault();
	}
	else
	{
		ev.returnValue = false;
	}
};
/* SpryValidationTextField.js - Revision: Spry Preview Release 1.4 */

// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry;
if (!Spry) Spry = {};
if (!Spry.Widget) Spry.Widget = {};

Spry.Widget.BrowserSniff = function() {
	var b = navigator.appName.toString();
	var up = navigator.platform.toString();
	var ua = navigator.userAgent.toString();

	this.mozilla = this.ie = this.opera = r = false;
	var re_opera = /Opera.([0-9\.]*)/i;
	var re_msie = /MSIE.([0-9\.]*)/i;
	var re_gecko = /gecko/i;
	var re_safari = /safari\/([\d\.]*)/i;
	
	if (ua.match(re_opera)) {
		r = ua.match(re_opera);
		this.opera = true;
		this.version = parseFloat(r[1]);
	} else if (ua.match(re_msie)) {
		r = ua.match(re_msie);
		this.ie = true;
		this.version = parseFloat(r[1]);
	} else if (ua.match(re_safari)) {
		this.safari = true;
		this.version = 1.4;
	} else if (ua.match(re_gecko)) {
		var re_gecko_version = /rv:\s*([0-9\.]+)/i;
		r = ua.match(re_gecko_version);
		this.mozilla = true;
		this.version = parseFloat(r[1]);
	}
	this.windows = this.mac = this.linux = false;

	this.Platform = ua.match(/windows/i) ? "windows" :
					(ua.match(/linux/i) ? "linux" :
					(ua.match(/mac/i) ? "mac" :
					ua.match(/unix/i)? "unix" : "unknown"));
	this[this.Platform] = true;
	this.v = this.version;

	if (this.safari && this.mac && this.mozilla) {
		this.mozilla = false;
	}
};

Spry.is = new Spry.Widget.BrowserSniff();

Spry.Widget.ValidationTextField = function(element, type, options)
{
	type = Spry.Widget.Utils.firstValid(type, "none");
	if (typeof type != 'string') {
		return;
	}
	if (typeof Spry.Widget.ValidationTextField.ValidationDescriptors[type] == 'undefined') {
		return;
	}
	options = Spry.Widget.Utils.firstValid(options, {});
	this.type = type;
	if (!this.isBrowserSupported()) {
		//disable character masking and pattern behaviors for low level browsers
		options.useCharacterMasking = false;
	}
	this.init(element, options);

	//make sure we validate at least on submit
	var validateOn = ['submit'].concat(Spry.Widget.Utils.firstValid(this.options.validateOn, []));
	validateOn = validateOn.join(",");

	this.validateOn = 0;
	this.validateOn = this.validateOn | (validateOn.indexOf('submit') != -1 ? Spry.Widget.ValidationTextField.ONSUBMIT : 0);
	this.validateOn = this.validateOn | (validateOn.indexOf('blur') != -1 ? Spry.Widget.ValidationTextField.ONBLUR : 0);
	this.validateOn = this.validateOn | (validateOn.indexOf('change') != -1 ? Spry.Widget.ValidationTextField.ONCHANGE : 0);

	if (Spry.Widget.ValidationTextField.onloadDidFire)
		this.attachBehaviors();
	else
		Spry.Widget.ValidationTextField.loadQueue.push(this);
};

Spry.Widget.ValidationTextField.ONCHANGE = 1;
Spry.Widget.ValidationTextField.ONBLUR = 2;
Spry.Widget.ValidationTextField.ONSUBMIT = 4;

Spry.Widget.ValidationTextField.ERROR_REQUIRED = 1;
Spry.Widget.ValidationTextField.ERROR_FORMAT = 2;
Spry.Widget.ValidationTextField.ERROR_RANGE_MIN = 4;
Spry.Widget.ValidationTextField.ERROR_RANGE_MAX = 8;
Spry.Widget.ValidationTextField.ERROR_CHARS_MIN = 16;
Spry.Widget.ValidationTextField.ERROR_CHARS_MAX = 32;

/* validation parameters:
 *  - characterMasking : prevent typing of characters not matching an regular expression
 *  - regExpFilter : additional regular expression to disalow typing of characters 
 *		(like the "-" sign in the middle of the value); use for partial matching of the currently typed value;
 * 		the typed value must match regExpFilter at any moment
 *  - pattern : enforce character on each position inside a pattern (AX0?)
 *  - validation : function performing logic validation; return false if failed and the typedValue value on success
 *  - minValue, maxValue : range validation; check if typedValue inside the specified range
 *  - minChars, maxChars : value length validation; at least/at most number of characters
 * */
Spry.Widget.ValidationTextField.ValidationDescriptors = {
	'none': {
	},
	'custom': {
	},
	'integer': {
		characterMasking: /[\-\+\d]/,
		regExpFilter: /^[\-\+]?\d*$/,
		validation: function(value, options) {
			if (value == '' || value == '-' || value == '+') {
				return false;
			}
			var regExp = /^[\-\+]?\d*$/;
			if (!regExp.test(value)) {
				return false;
			}
			options = options || {allowNegative:false};
			var ret = parseInt(value, 10);
			if (!isNaN(ret)) {
				var allowNegative = true;
				if (typeof options.allowNegative != 'undefined' && options.allowNegative == false) {
					allowNegative = false;
				}
				if (!allowNegative && value < 0) {
					ret = false;
				}
			} else {
				ret = false;
			}
			return ret;
		}
	},
	'real': {
		characterMasking: /[\d\.,\-\+e]/i,
		regExpFilter: /^[\-\+]?\d(?:|\.,\d{0,2})|(?:|e{0,1}[\-\+]?\d{0,})$/i,
		validation: function (value, options) {
			var regExp = /^[\+\-]?[0-9]+([\.,][0-9]+)?([eE]{0,1}[\-\+]?[0-9]+)?$/;
			if (!regExp.test(value)) {
				return false;
			}
			var ret = parseFloat(value);
			if (isNaN(ret)) {
				ret = false;
			}
			return ret;
		}
	},
	'currency': {
		formats: {
			'dot_comma': {
				characterMasking: /[\d\.\,\-\+\$]/,
				regExpFilter: /^[\-\+]?(?:[\d\.]*)+(|\,\d{0,2})$/,
				validation: function(value, options) {
					var ret = false;
					//2 or no digits after the comma
					if (/^(\-|\+)?\d{1,3}(?:\.\d{3})*(?:\,\d{2}|)$/.test(value) || /^(\-|\+)?\d+(?:\,\d{2}|)$/.test(value)) {
						value = value.toString().replace(/\./gi, '').replace(/\,/, '.');
						ret = parseFloat(value);
					}
					return ret;
				}
			},
			'comma_dot': {
				characterMasking: /[\d\.\,\-\+\$]/,
				regExpFilter: /^[\-\+]?(?:[\d\,]*)+(|\.\d{0,2})$/,
				validation: function(value, options) {
					var ret = false;
					//2 or no digits after the comma
					if (/^(\-|\+)?\d{1,3}(?:\,\d{3})*(?:\.\d{2}|)$/.test(value) || /^(\-|\+)?\d+(?:\.\d{2}|)$/.test(value)) {
						value = value.toString().replace(/\,/gi, '');
						ret = parseFloat(value);
					}
					return ret;
				}
			}
		}
	},
	'email': {
		characterMasking: /[^\s]/,
		validation: function(value, options) {
			var rx = /^[\w\.-]+@[\w\.-]+\.\w+$/i;
			return rx.test(value);
		}
	},
	'date': {
		validation: function(value, options) {
			var formatRegExp = /^([mdy]+)[\.\-\/\\\s]+([mdy]+)[\.\-\/\\\s]+([mdy]+)$/i;
			var valueRegExp = this.dateValidationPattern;
			var formatGroups = options.format.match(formatRegExp);
			var valueGroups = value.match(valueRegExp);
			if (formatGroups !== null && valueGroups !== null) {
				var dayIndex = -1;
				var monthIndex = -1;
				var yearIndex = -1;
				for (var i=1; i<formatGroups.length; i++) {
					switch (formatGroups[i].toLowerCase()) {
						case "dd":
							dayIndex = i;
							break;
						case "mm":
							monthIndex = i;
							break;
						case "yy":
						case "yyyy":
							yearIndex = i;
							break;
					}
				}
				if (dayIndex != -1 && monthIndex != -1 && yearIndex != -1) {
					var maxDay = -1;
					var theDay = parseInt(valueGroups[dayIndex], 10);
					var theMonth = parseInt(valueGroups[monthIndex], 10);
					var theYear = parseInt(valueGroups[yearIndex], 10);

					// Check month value to be between 1..12
					if (theMonth < 1 || theMonth > 12) {
						return false;
					}
					
					// Calculate the maxDay according to the current month
					switch (theMonth) {
						case 1:	// January
						case 3: // March
						case 5: // May
						case 7: // July
						case 8: // August
						case 10: // October
						case 12: // December
							maxDay = 31;
							break;
						case 4:	// April
						case 6: // Juna
						case 9: // September
						case 11: // November
							maxDay = 30;
							break;
						case 2: // February
							if ((parseInt(theYear/4, 10) * 4 == theYear) && (parseInt(theYear/100, 10) * 100 != theYear)) {
								maxDay = 29;
							} else {
								maxDay = 28;
							}
							break;
					}

					// Check day value to be between 1..maxDay
					if (theDay < 1 || theDay > maxDay) {
						return false;
					}
					
					// If successfull we'll return the date object
					return (new Date(theYear, theMonth, theDay));
				}
			} else {
				return false;
			}
		}
	},
	'time': {
		validation: function(value, options) {
			//	HH:MM:SS T
			var formatRegExp = /([hmst]+)/gi;
			var valueRegExp = /(\d+|AM?|PM?)/gi;
			var formatGroups = options.format.match(formatRegExp);
			var valueGroups = value.match(valueRegExp);
			//mast match and have same length
			if (formatGroups !== null && valueGroups !== null) {
				if (formatGroups.length != valueGroups.length) {
					return false;
				}

				var hourIndex = -1;
				var minuteIndex = -1;
				var secondIndex = -1;
				//T is AM or PM
				var tIndex = -1;
				var theHour = 0, theMinute = 0, theSecond = 0, theT = 'AM';
				for (var i=0; i<formatGroups.length; i++) {
					switch (formatGroups[i].toLowerCase()) {
						case "hh":
							hourIndex = i;
							break;
						case "mm":
							minuteIndex = i;
							break;
						case "ss":
							secondIndex = i;
							break;
						case "t":
						case "tt":
							tIndex = i;
							break;
					}
				}
				if (hourIndex != -1) {
					var theHour = parseInt(valueGroups[hourIndex], 10);
					if (isNaN(theHour) || theHour > (formatGroups[hourIndex] == 'HH' ? 23 : 12 )) {
						return false;
					}
				}
				if (minuteIndex != -1) {
					var theMinute = parseInt(valueGroups[minuteIndex], 10);
					if (isNaN(theMinute) || theMinute > 59) {
						return false;
					}
				}
				if (secondIndex != -1) {
					var theSecond = parseInt(valueGroups[secondIndex], 10);
					if (isNaN(theSecond) || theSecond > 59) {
						return false;
					}
				}
				if (tIndex != -1) {
					var theT = valueGroups[tIndex].toUpperCase();
					if (
						formatGroups[tIndex].toUpperCase() == 'TT' && !/^a|pm$/i.test(theT) || 
						formatGroups[tIndex].toUpperCase() == 'T' && !/^a|p$/i.test(theT)
					) {
						return false;
					}
				}
				var date = new Date(2000, 0, 1, theHour + (theT.charAt(0) == 'P'?12:0), theMinute, theSecond);
				return date;
			} else {
				return false;
			}
		}
	},
	'credit_card': {
		characterMasking: /\d/,
		validation: function(value, options) {
			var regExp = null;
			options.format = options.format || 'ALL';
			switch (options.format.toUpperCase()) {
				case 'ALL': regExp = /^[3-6]{1}[0-9]{12,15}$/; break;
				case 'VISA': regExp = /^4[0-9]{12,15}$/; break;
				case 'MASTERCARD': regExp = /^5[1-5]{1}[0-9]{14}$/; break;
				case 'AMEX': regExp = /^3(4|7){1}[0-9]{13}$/; break;
				case 'DISCOVER': regExp = /^6011[0-9]{12}$/; break;
				case 'DINERSCLUB': regExp = /^3((0[0-5]{1}[0-9]{11})|(6[0-9]{12})|(8[0-9]{12}))$/; break;
			}
			if (!regExp.test(value)) {
				return false;
			}
			var digits = [];
			var j = 1, digit = '';
			for (var i = value.length - 1; i >= 0; i--) {
				if ((j%2) == 0) {
					digit = parseInt(value.charAt(i), 10) * 2;
					digits[digits.length] = digit.toString().charAt(0);
					if (digit.toString().length == 2) {
						digits[digits.length] = digit.toString().charAt(1);
					}
				} else {
					digit = value.charAt(i);
					digits[digits.length] = digit;
				}
				j++;
			}
			var sum = 0;
			for(i=0; i < digits.length; i++ ) {
				sum += parseInt(digits[i], 10);
			}
			if ((sum%10) == 0) {
				return true;
			}
			return false;
		}
	},
	'zip_code': {
		formats: {
			'zip_us9': {
				pattern:'00000-0000'
			},
			'zip_us5': {
				pattern:'00000'
			},
			'zip_uk': {
				characterMasking: /[\dA-Z\s]/,
				validation: function(value, options) {
					//check one of the following masks
					// AN NAA, ANA NAA, ANN NAA, AAN NAA, AANA NAA, AANN NAA
					return /^[A-Z]{1,2}\d[\dA-Z]?\s?\d[A-Z]{2}$/.test(value);
				}
			},
			'zip_canada': {
				characterMasking: /[\dA-Z\s]/,
				pattern: 'A0A 0A0'
			},
			'zip_custom': {}
		}
	},
	'phone_number': {
		formats: {
			//US phone number; 10 digits
			'phone_us': {
				pattern:'(000) 000-0000'
			},
			'phone_custom': {}
		}
	},
	'social_security_number': {
		pattern:'000-00-0000'
	},
	'ip': {
		characterMaskingFormats: {
			'ipv4': /[\d\.]/i,
			'ipv6_ipv4': /[\d\.\:A-F\/]/i,
			'ipv6': /[\d\.\:A-F\/]/i
		},
		validation: function (value, options) {
			return Spry.Widget.ValidationTextField.validateIP(value, options.format);
		}
	},

	'url': {
		characterMasking: /[^\s]/,
		validation: function(value, options) {
			var regExp = /^(?:http(?:s)?|ftp):\/\/((?:(?:[0-9a-z-_]+\.)+[a-z]{2,4}|(?:[0-9a-z-_]+)|(?:[0-9\.]+))|(?:\[[^\]]*\]))(?::\d+)?(?:(?:\/|\\\\)[0-9a-z-_\/\.]*)?(?:\?[\w=\&\%~\!@#\$\^\(\)\[\]\_\-\|\*\.\,\<\>\:\;\'\"\+\{\}]*)?$/i;
			var valid = value.match(regExp);
			if (valid) {
				//extract the  address from URL
				var address = valid[1];

				if (address) {
					if (address == '[]') {
						return false;
					}
					if (address.charAt(0) == '[' ) {
						//IPv6 address or IPv4 enclosed in square brackets
						address = address.replace(/^\[|\]$/gi, '');
						return Spry.Widget.ValidationTextField.validateIP(address, 'ipv6_ipv4');
					} else {
						if (/[^0-9\.]/.test(address)) {
							return true;
						} else {
							//check if hostname is all digits and dots and then check for IPv4
							return Spry.Widget.ValidationTextField.validateIP(address, 'ipv4');
						}
					}
				} else {
					return true;
				}
			} else {
				return false;
			}
		}
	}
};

/*
2.2.1. Preferred
x:x:x:x:x:x:x:x, where the 'x's are the hexadecimal values of the eight 16-bit pieces of the address.
Examples:
	FEDC:BA98:7654:3210:FEDC:BA98:7654:3210
	1080:0:0:0:8:800:200C:417A
Note that it is not necessary to write the leading zeros in an
individual field, but there must be at least one numeral in every
field (except for the case described in 2.2.2.).

2.2.2. Compressed
The use of "::" indicates multiple groups of 16-bits of zeros.
The "::" can only appear once in an address.  The "::" can also be
used to compress the leading and/or trailing zeros in an address.
	1080:0:0:0:8:800:200C:417A --> 1080::8:800:200C:417A
	FF01:0:0:0:0:0:0:101 --> FF01::101
	0:0:0:0:0:0:0:1 --> ::1
	0:0:0:0:0:0:0:0 --> ::

2.5.4 IPv6 Addresses with Embedded IPv4 Addresses
	IPv4-compatible IPv6 address (tunnel IPv6 packets over IPv4 routing infrastructures)
	::0:129.144.52.38
	IPv4-mapped IPv6 address (represent the addresses of IPv4-only nodes as IPv6 addresses)
	::ffff:129.144.52.38

The text representation of IPv6 addresses and prefixes in Augmented BNF (Backus-Naur Form) [ABNF] for reference purposes.
[ABNF http://tools.ietf.org/html/rfc2234]
      IPv6address = hexpart [ ":" IPv4address ]
      IPv4address = 1*3DIGIT "." 1*3DIGIT "." 1*3DIGIT "." 1*3DIGIT

      IPv6prefix  = hexpart "/" 1*2DIGIT

      hexpart = hexseq | hexseq "::" [ hexseq ] | "::" [ hexseq ]
      hexseq  = hex4 *( ":" hex4)
      hex4    = 1*4HEXDIG
*/
Spry.Widget.ValidationTextField.validateIP = function (value, format)
{
	var validIPv6Addresses = [
		//preferred
		/^(?:[a-f0-9]{1,4}:){7}[a-f0-9]{1,4}(?:\/\d{1,3})?$/i,

		//various compressed
		/^[a-f0-9]{0,4}::(?:\/\d{1,3})?$/i,
		/^:(?::[a-f0-9]{1,4}){1,6}(?:\/\d{1,3})?$/i,
		/^(?:[a-f0-9]{1,4}:){1,6}:(?:\/\d{1,3})?$/i,
		/^(?:[a-f0-9]{1,4}:)(?::[a-f0-9]{1,4}){1,6}(?:\/\d{1,3})?$/i,
		/^(?:[a-f0-9]{1,4}:){2}(?::[a-f0-9]{1,4}){1,5}(?:\/\d{1,3})?$/i,
		/^(?:[a-f0-9]{1,4}:){3}(?::[a-f0-9]{1,4}){1,4}(?:\/\d{1,3})?$/i,
		/^(?:[a-f0-9]{1,4}:){4}(?::[a-f0-9]{1,4}){1,3}(?:\/\d{1,3})?$/i,
		/^(?:[a-f0-9]{1,4}:){5}(?::[a-f0-9]{1,4}){1,2}(?:\/\d{1,3})?$/i,
		/^(?:[a-f0-9]{1,4}:){6}(?::[a-f0-9]{1,4})(?:\/\d{1,3})?$/i,


		//IPv6 mixes with IPv4
		/^(?:[a-f0-9]{1,4}:){6}(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,3})?$/i,
		/^:(?::[a-f0-9]{1,4}){0,4}:(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,3})?$/i,
		/^(?:[a-f0-9]{1,4}:){1,5}:(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,3})?$/i,
		/^(?:[a-f0-9]{1,4}:)(?::[a-f0-9]{1,4}){1,4}:(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,3})?$/i,
		/^(?:[a-f0-9]{1,4}:){2}(?::[a-f0-9]{1,4}){1,3}:(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,3})?$/i,	
		/^(?:[a-f0-9]{1,4}:){3}(?::[a-f0-9]{1,4}){1,2}:(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,3})?$/i,
		/^(?:[a-f0-9]{1,4}:){4}(?::[a-f0-9]{1,4}):(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,3})?$/i
	];
	var validIPv4Addresses = [
		//IPv4
		/^(\d{1,3}\.){3}\d{1,3}$/i
	];
	var validAddresses = [];
	if (format == 'ipv6' || format == 'ipv6_ipv4') {
		validAddresses = validAddresses.concat(validIPv6Addresses);
	}
	if (format == 'ipv4' || format == 'ipv6_ipv4') {
		validAddresses = validAddresses.concat(validIPv4Addresses);
	}

	var ret = false;
	for (var i=0; i<validAddresses.length; i++) {
		if (validAddresses[i].test(value)) {
			ret = true;
			break;
		}
	}

	if (ret && value.indexOf(".") != -1) {
		//if address contains IPv4 fragment, it must be valid; all 4 groups must be less than 256
		var ipv4 = value.match(/:?(?:\d{1,3}\.){3}\d{1,3}/i);
		if(!ipv4) {
			return false;
		}
		ipv4 = ipv4[0].replace(/^:/, '');
		var pieces = ipv4.split('.');
		if (pieces.length != 4) {
			return false;
		}
		var regExp = /^[\-\+]?\d*$/;
		for (var i=0; i< pieces.length; i++) {
			if (pieces[i] == '') {
				return false;
			}
			var piece = parseInt(pieces[i], 10);
			if (isNaN(piece) || piece > 255 || !regExp.test(pieces[i]) || pieces[i].length>3 || /^0{2,3}$/.test(pieces[i])) {
				return false;
			}
		}
	}
	if (ret && value.indexOf("/") != -1) {
		// if prefix-length is specified must be in [1-128]
		var prefLen = value.match(/\/\d{1,3}$/);
		if (!prefLen) return false;
		var prefLenVal = parseInt(prefLen[0].replace(/^\//,''), 10);
		if (isNaN(prefLenVal) || prefLenVal > 128 || prefLenVal < 1) {
			return false;
		}
	}
	return ret;
};

Spry.Widget.ValidationTextField.onloadDidFire = false;
Spry.Widget.ValidationTextField.loadQueue = [];

Spry.Widget.ValidationTextField.prototype.isBrowserSupported = function()
{
	return Spry.is.ie && Spry.is.v >= 5 && Spry.is.windows
		||
	Spry.is.mozilla && Spry.is.v >= 1.4
		||
	Spry.is.safari
		||
	Spry.is.opera && Spry.is.v >= 9;
};

Spry.Widget.ValidationTextField.prototype.init = function(element, options)
{
	this.element = this.getElement(element);
	this.errors = 0;
	this.flags = {locked: false};
	this.options = {};
	this.event_handlers = [];

	this.validClass = "textfieldValidState";
	this.focusClass = "textfieldFocusState";
	this.requiredClass = "textfieldRequiredState";
	this.invalidFormatClass = "textfieldInvalidFormatState";
	this.invalidRangeMinClass = "textfieldMinValueState";
	this.invalidRangeMaxClass = "textfieldMaxValueState";
	this.invalidCharsMinClass = "textfieldMinCharsState";
	this.invalidCharsMaxClass = "textfieldMaxCharsState";
	this.textfieldFlashTextClass = "textfieldFlashText";
	if (Spry.is.safari) {
		this.flags.lastKeyPressedTimeStamp = 0;
	}

	switch (this.type) {
		case 'phone_number':options.format = Spry.Widget.Utils.firstValid(options.format, 'phone_us');break;
		case 'currency':options.format = Spry.Widget.Utils.firstValid(options.format, 'comma_dot');break;
		case 'zip_code':options.format = Spry.Widget.Utils.firstValid(options.format, 'zip_us5');break;
		case 'date':
			options.format = Spry.Widget.Utils.firstValid(options.format, 'mm/dd/yy');
			break;
		case 'time':
			options.format = Spry.Widget.Utils.firstValid(options.format, 'HH:mm');
			options.pattern = options.format.replace(/[hms]/gi, "0").replace(/TT/gi, 'AM').replace(/T/gi, 'A');
			break;
		case 'ip':
			options.format = Spry.Widget.Utils.firstValid(options.format, 'ipv4');
			options.characterMasking = Spry.Widget.ValidationTextField.ValidationDescriptors[this.type].characterMaskingFormats[options.format]; 
			break;
	}

	//retrieve the validation type descriptor to be used with this instance (base on type and format)
	//widgets may have different validations depending on format (like zip_code with formats)
	var validationDescriptor = {};
	if (options.format && Spry.Widget.ValidationTextField.ValidationDescriptors[this.type].formats) {
		if (Spry.Widget.ValidationTextField.ValidationDescriptors[this.type].formats[options.format]) {
			Spry.Widget.Utils.setOptions(validationDescriptor, Spry.Widget.ValidationTextField.ValidationDescriptors[this.type].formats[options.format]);
		}
	} else {
		Spry.Widget.Utils.setOptions(validationDescriptor, Spry.Widget.ValidationTextField.ValidationDescriptors[this.type]);
	}

	//set default values for some parameters which were not aspecified
	options.useCharacterMasking = Spry.Widget.Utils.firstValid(options.useCharacterMasking, false);
	options.hint = Spry.Widget.Utils.firstValid(options.hint, '');
	options.isRequired = Spry.Widget.Utils.firstValid(options.isRequired, true);

	//set widget validation parameters
	//get values from validation type descriptor
	//use the user specified values, if defined
	options.characterMasking = Spry.Widget.Utils.firstValid(options.characterMasking, validationDescriptor.characterMasking);
	options.regExpFilter = Spry.Widget.Utils.firstValid(options.regExpFilter, validationDescriptor.regExpFilter);
	options.pattern = Spry.Widget.Utils.firstValid(options.pattern, validationDescriptor.pattern);
	options.validation = Spry.Widget.Utils.firstValid(options.validation, validationDescriptor.validation);
	if (typeof options.validation == 'string') {
		options.validation = eval(options.validation);
	}

	options.minValue = Spry.Widget.Utils.firstValid(options.minValue, validationDescriptor.minValue);
	options.maxValue = Spry.Widget.Utils.firstValid(options.maxValue, validationDescriptor.maxValue);

	options.minChars = Spry.Widget.Utils.firstValid(options.minChars, validationDescriptor.minChars);
	options.maxChars = Spry.Widget.Utils.firstValid(options.maxChars, validationDescriptor.maxChars);

	Spry.Widget.Utils.setOptions(this, options);
	Spry.Widget.Utils.setOptions(this.options, options);
};

Spry.Widget.ValidationTextField.prototype.destroy = function() {
	for (var i=0; i<this.event_handlers.length; i++) {
		Spry.Widget.Utils.removeEventListener(this.event_handlers[i][0], this.event_handlers[i][1], this.event_handlers[i][2], false);
	}
	try { delete this.element; } catch(err) {}
	try { delete this.input; } catch(err) {}
	try { delete this.form; } catch(err) {}
	try { delete this.event_handlers; } catch(err) {}
	try { this.selection.destroy(); } catch(err) {}
	try { delete this.selection; } catch(err) {}

	var q = Spry.Widget.Form.onSubmitWidgetQueue;
	var qlen = q.length;
	for (var i = 0; i < qlen; i++) {
		if (q[i] == this) {
			q.splice(i, 1);
			break;
		}
	}
};

Spry.Widget.ValidationTextField.prototype.attachBehaviors = function()
{
	if (this.element) {
		if (this.element.nodeName == "INPUT") {
			this.input = this.element;
		} else {
			this.input = Spry.Widget.Utils.getFirstChildWithNodeNameAtAnyLevel(this.element, "INPUT");
		}
	}

	if (this.input) {
		if (this.maxChars) {
			this.input.removeAttribute("maxLength");
		}
		this.putHint();
		this.compilePattern();
		if (this.type == 'date') {
			this.compileDatePattern();
		}
		this.input.setAttribute("AutoComplete", "off");
		this.selection = new Spry.Widget.SelectionDescriptor(this.input);
		this.oldValue = this.input.value;

		var self = this;
		this.event_handlers = [];

		this.event_handlers.push([this.input, "keydown", function(e) { if (self.isDisabled()) return true; return self.onKeyDown(e || event); }]);
		this.event_handlers.push([this.input, "keypress", function(e) { if (self.isDisabled()) return true; return self.onKeyPress(e || event); }]);
		if (Spry.is.opera) {
			this.event_handlers.push([this.input, "keyup", function(e) { if (self.isDisabled()) return true; return self.onKeyUp(e || event); }]);
		}

		this.event_handlers.push([this.input, "focus", function(e) { if (self.isDisabled()) return true; return self.onFocus(e || event); }]);
		this.event_handlers.push([this.input, "blur", function(e) { if (self.isDisabled()) return true; return self.onBlur(e || event); }]);

		this.event_handlers.push([this.input, "mousedown", function(e) { if (self.isDisabled()) return true; return self.onMouseDown(e || event); }]);

		var changeEvent = 
			Spry.is.mozilla || Spry.is.opera || Spry.is.safari?"input":
			Spry.is.ie?"propertychange":
			"change";
		this.event_handlers.push([this.input, changeEvent, function(e) { if (self.isDisabled()) return true; return self.onChange(e || event); }]);

		if (Spry.is.mozilla || Spry.is.safari) {
			//oninput event on mozilla does not fire ondragdrop
			this.event_handlers.push([this.input, "dragdrop", function(e) { if (self.isDisabled()) return true; self.removeHint();return self.onChange(e || event); }]);
		} else if (Spry.is.ie){
			//ondrop&onpropertychange crash on IE 
			this.event_handlers.push([this.input, "drop", function(e) { if (self.isDisabled()) return true; return self.onDrop(e || event); }]);
		}

		for (var i=0; i<this.event_handlers.length; i++) {
			Spry.Widget.Utils.addEventListener(this.event_handlers[i][0], this.event_handlers[i][1], this.event_handlers[i][2], false);
		}

		// submit
		this.form = Spry.Widget.Utils.getFirstParentWithNodeName(this.input, "FORM");
		if (this.form) {
			// if no "onSubmit" handler has been attached to the current form, attach one
			if (!this.form.attachedSubmitHandler && !this.form.onsubmit) {
				this.form.onsubmit = function(e) { e = e || event; return Spry.Widget.Form.onSubmit(e, e.srcElement || e.currentTarget) };
				this.form.attachedSubmitHandler = true;                 
			}
			if (!this.form.attachedResetHandler) {
				Spry.Widget.Utils.addEventListener(this.form, "reset", function(e) { e = e || event; return Spry.Widget.Form.onReset(e, e.srcElement || e.currentTarget) }, false);
				this.form.attachedResetHandler = true;                 
			}
			// add the currrent widget to the "onSubmit" check queue;
			Spry.Widget.Form.onSubmitWidgetQueue.push(this);
		}
	}	
};

Spry.Widget.ValidationTextField.prototype.isDisabled = function() {
	return this.input && (this.input.disabled || this.input.readOnly) || !this.input;
};

Spry.Widget.ValidationTextField.prototype.getElement = function(ele)
{
	if (ele && typeof ele == "string")
		return document.getElementById(ele);
	return ele;
};

Spry.Widget.ValidationTextField.addLoadListener = function(handler)
{
	if (typeof window.addEventListener != 'undefined')
		window.addEventListener('load', handler, false);
	else if (typeof document.addEventListener != 'undefined')
		document.addEventListener('load', handler, false);
	else if (typeof window.attachEvent != 'undefined')
		window.attachEvent('onload', handler);
};

Spry.Widget.ValidationTextField.processLoadQueue = function(handler)
{
	Spry.Widget.ValidationTextField.onloadDidFire = true;
	var q = Spry.Widget.ValidationTextField.loadQueue;
	var qlen = q.length;
	for (var i = 0; i < qlen; i++)
		q[i].attachBehaviors();
};

Spry.Widget.ValidationTextField.addLoadListener(Spry.Widget.ValidationTextField.processLoadQueue);
Spry.Widget.ValidationTextField.addLoadListener(function(){
	Spry.Widget.Utils.addEventListener(window, "unload", Spry.Widget.Form.destroyAll, false);
});

Spry.Widget.ValidationTextField.prototype.setValue = function(newValue) {
	this.flags.locked = true;
	this.input.value = newValue;
	this.flags.locked = false;
	this.oldValue = newValue;
	if (!Spry.is.ie) {
		this.onChange();
	}
};

/**
 * save the state of the input (selection and value) so we can revert to it
 * should call this just before modifying the input value
 */
Spry.Widget.ValidationTextField.prototype.saveState = function()
{
	this.oldValue = this.input.value;
	this.selection.update();
};

Spry.Widget.ValidationTextField.prototype.revertState = function(revertValue)
{
	if (revertValue != this.input.value) {
		this.input.readOnly = true;
		this.input.value = revertValue;
		this.input.readOnly = false;
		if (Spry.is.safari && this.flags.active) {
			this.input.focus();
		}
	}
	this.selection.moveTo(this.selection.start, this.selection.end);

	this.redTextFlash();
};

Spry.Widget.ValidationTextField.prototype.removeHint = function()
{
	if (this.flags.hintOn) {
		this.input.value = "";
		this.flags.hintOn = false;
	}
};

Spry.Widget.ValidationTextField.prototype.putHint = function()
{
	if(this.hint && this.input && this.input.type == "text" && this.input.value == "") {
		this.flags.hintOn = true;
		this.input.value = this.hint;
	}
};

Spry.Widget.ValidationTextField.prototype.redTextFlash = function()
{
	var self = this;
	this.addClassName(this.element, this.textfieldFlashTextClass);
	setTimeout(function() {
		self.removeClassName(self.element, self.textfieldFlashTextClass)
	}, 100);
};

Spry.Widget.ValidationTextField.prototype.doValidations = function(testValue, revertValue)
{
	if (this.isDisabled()) return false;

	if (this.flags.locked) {
		return false;
	}

	if (testValue.length == 0 && !this.isRequired) {
		this.errors = 0;
		return false;
	}
	this.flags.locked = true;

	var mustRevert = false;
	var continueValidations = true;
	if (!this.options.isRequired && testValue.length == 0) {
		continueValidations = false;
	}

	var errors = 0;
	var fixedValue = testValue;

	//characterMasking - test if all characters are valid with the characterMasking (keyboard filter)
	if (this.useCharacterMasking && this.characterMasking) {
		for(var i=0; i<testValue.length; i++) {
			if (!this.characterMasking.test(testValue.charAt(i))) {
				errors = errors | Spry.Widget.ValidationTextField.ERROR_FORMAT;
				fixedValue = revertValue;
				mustRevert = true;
				break;
			}
		}
	}

	//regExpFilter - character mask positioning (additional mask to restrict some characters only in some position)
	if (!mustRevert && this.useCharacterMasking && this.regExpFilter) {
		if (!this.regExpFilter.test(fixedValue)) {
			errors = errors | Spry.Widget.ValidationTextField.ERROR_FORMAT;
			mustRevert = true;
		}
	}

	//pattern - testValue matches the pattern so far
	if (!mustRevert && this.pattern) {
		var currentRegExp = this.patternToRegExp(testValue.length);
		if (!currentRegExp.test(testValue)) {
			errors = errors | Spry.Widget.ValidationTextField.ERROR_FORMAT;
			mustRevert = true;
		} else if (this.patternLength != testValue.length) {
			//testValue matches pattern so far, but it's not ok if it does not have the proper length
			//do not revert, but should show the error
			errors = errors | Spry.Widget.ValidationTextField.ERROR_FORMAT;
		}
	}

	if (fixedValue == '') {
		errors = errors | Spry.Widget.ValidationTextField.ERROR_REQUIRED;
	}

	if (!mustRevert && this.pattern && this.useCharacterMasking) {
		var n = this.getAutoComplete(testValue.length);
		if (n) {
			fixedValue += n;
		}
	}

	if(!mustRevert && this.minChars !== null  && continueValidations) {
		if (testValue.length < this.minChars) {
			errors = errors | Spry.Widget.ValidationTextField.ERROR_CHARS_MIN;
			continueValidations = false;
		}
	}

	if(!mustRevert && this.maxChars !== null && continueValidations) {
		if (testValue.length > this.maxChars) {
			errors = errors | Spry.Widget.ValidationTextField.ERROR_CHARS_MAX;
			continueValidations = false;
		}
	}

	//validation - testValue passes widget validation function
	if (!mustRevert && this.validation && continueValidations) {
		var value = this.validation(fixedValue, this.options);
		if (false === value) {
			errors = errors | Spry.Widget.ValidationTextField.ERROR_FORMAT;
			continueValidations = false;
		} else {
			this.typedValue = value;
		}
	}

	if(!mustRevert && this.validation && this.minValue !== null && continueValidations) {
		var minValue = this.validation(this.minValue, this.options);
		if (minValue !== false) {
			if (this.typedValue < minValue) {
				errors = errors | Spry.Widget.ValidationTextField.ERROR_RANGE_MIN;
				continueValidations = false;
			}
		}
	}

	if(!mustRevert && this.validation && this.maxValue !== null && continueValidations) {
		var maxValue = this.validation(this.maxValue, this.options);
		if (maxValue !== false) {
			if( this.typedValue > maxValue) {
				errors = errors | Spry.Widget.ValidationTextField.ERROR_RANGE_MAX;
				continueValidations = false;
			}
		}
	}

	//an invalid value was tested; must make sure it does not get inside the input
	if (this.useCharacterMasking && mustRevert) {
		this.revertState(revertValue);
	}

	this.errors = errors;
	this.fixedValue = fixedValue;

	this.flags.locked = false;

	return mustRevert;
};

Spry.Widget.ValidationTextField.prototype.onChange = function(e)
{
	if (Spry.is.opera && this.flags.operaRevertOnKeyUp) {
		return true;
	}
	if (Spry.is.ie && e && e.propertyName != 'value') {
		return true;
	}

	if (this.flags.drop) {
		//delay this if it's a drop operation
		var self = this;
		setTimeout(function() {
			self.flags.drop = false;
			self.onChange(null);
		}, 0);
		return;
	}

	if (this.flags.hintOn) {
		return true;
	}

	if (this.keyCode == 8 || this.keyCode == 46 ) {
		var mustRevert = this.doValidations(this.input.value, this.input.value);
		this.oldValue = this.input.value;
		if ((mustRevert || this.errors) && this.validateOn & Spry.Widget.ValidationTextField.ONCHANGE) {
			var self = this;
			setTimeout(function() {self.validate();}, 0);
			return true;
		}
	}

	var mustRevert = this.doValidations(this.input.value, this.oldValue);
	if ((!mustRevert || this.errors) && this.validateOn & Spry.Widget.ValidationTextField.ONCHANGE) {
		var self = this;
		setTimeout(function() {self.validate();}, 0);
	}
	return true;
};

Spry.Widget.ValidationTextField.prototype.onKeyUp = function(e) {
	if (this.flags.operaRevertOnKeyUp) {
		this.setValue(this.oldValue);
		Spry.Widget.Utils.stopEvent(e);
		this.selection.moveTo(this.selection.start, this.selection.start);
		this.flags.operaRevertOnKeyUp = false;
		return false;
	}
	if (this.flags.operaPasteOperation) {
		window.clearInterval(this.flags.operaPasteOperation);
		this.flags.operaPasteOperation = null;
	}
};

Spry.Widget.ValidationTextField.prototype.operaPasteMonitor = function() {
	if (this.input.value != this.oldValue) {
		var mustRevert = this.doValidations(this.input.value, this.input.value);
		if (mustRevert) {
			this.setValue(this.oldValue);
			this.selection.moveTo(this.selection.start, this.selection.start);
		} else {
			this.onChange();
		}
	}
};


Spry.Widget.ValidationTextField.prototype.compileDatePattern = function () 
{
	var dateValidationPatternString = "";
	var groupPatterns = [];
	var fullGroupPatterns = [];
	var autocompleteCharacters = [];
	
	
	var formatRegExp = /^([mdy]+)([\.\-\/\\\s]+)([mdy]+)([\.\-\/\\\s]+)([mdy]+)$/i;
	var formatGroups = this.options.format.match(formatRegExp);
	if (formatGroups !== null) {
		for (var i=1; i<formatGroups.length; i++) {
			switch (formatGroups[i].toLowerCase()) {
				case "dd":
					groupPatterns[i-1] = "\\d{1,2}";
					fullGroupPatterns[i-1] = "\\d\\d";
					dateValidationPatternString += "(" + groupPatterns[i-1] + ")";
					autocompleteCharacters[i-1] = null;
					break;
				case "mm":
					groupPatterns[i-1] = "\\d{1,2}";
					fullGroupPatterns[i-1] = "\\d\\d";
					dateValidationPatternString += "(" + groupPatterns[i-1] + ")";
					autocompleteCharacters[i-1] = null;
					break;
				case "yy":
					groupPatterns[i-1] = "\\d{1,2}";
					fullGroupPatterns[i-1] = "\\d\\d";
					dateValidationPatternString += "(\\d\\d)";
					autocompleteCharacters[i-1] = null;
					break;
				case "yyyy":
					groupPatterns[i-1] = "\\d{1,4}";
					fullGroupPatterns[i-1] = "\\d\\d\\d\\d";
					dateValidationPatternString += "(\\d\\d\\d\\d)";
					autocompleteCharacters[i-1] = null;
					break;
				default:
					groupPatterns[i-1] = fullGroupPatterns[i-1] = Spry.Widget.ValidationTextField.regExpFromChars(formatGroups[i]);
					dateValidationPatternString += "["+ groupPatterns[i-1] + "]";
					autocompleteCharacters[i-1] = formatGroups[i];
			}
		}
	}
	this.dateValidationPattern = new RegExp("^" + dateValidationPatternString + "$" , "")
	this.dateAutocompleteCharacters = autocompleteCharacters;
	this.dateGroupPatterns = groupPatterns;
	this.dateFullGroupPatterns = fullGroupPatterns;
	this.lastDateGroup = formatGroups.length-2;
}

Spry.Widget.ValidationTextField.prototype.getRegExpForGroup = function (group) 
{
	var ret = '^';
	for (var j = 0; j <= group; j++) ret += this.dateGroupPatterns[j];
	ret += '$';
	return new RegExp(ret, "");	
}

Spry.Widget.ValidationTextField.prototype.getRegExpForFullGroup = function (group) 
{
	var ret = '^';
	for (var j = 0; j < group; j++) ret += this.dateGroupPatterns[j];
	ret += this.dateFullGroupPatterns[group];
	return new RegExp(ret, "");	
}

Spry.Widget.ValidationTextField.prototype.getDateGroup = function(value, pos) 
{
	if (pos == 0) return 0;
	var test_value = value.substring(0, pos);
	for (var i=0; i <= this.lastDateGroup; i++) 
		if (this.getRegExpForGroup(i).test(test_value)) return i;
	return -1;
};


Spry.Widget.ValidationTextField.prototype.isDateGroupFull = function(value, group) 
{
	return this.getRegExpForFullGroup(group).test(value);
}

Spry.Widget.ValidationTextField.prototype.isValueValid = function(value, pos, group) 
{
	var test_value = value.substring(0, pos);
	return this.getRegExpForGroup(group).test(test_value);
	}


Spry.Widget.ValidationTextField.prototype.isPositionAtEndOfGroup = function (value, pos, group)
{
	var test_value = value.substring(0, pos);
	return this.getRegExpForFullGroup(group).test(test_value);
}

Spry.Widget.ValidationTextField.prototype.nextDateDelimiterExists = function (value, pos, group)
{
	var autocomplete = this.dateAutocompleteCharacters[group+1];
	if (value.length < pos  + autocomplete.length) 
		return false;
	else 
	{
		var test_value = value.substring(pos, pos+autocomplete.length);
		if (test_value == autocomplete) 
			return true;
	}
	return false;
}



Spry.Widget.ValidationTextField.prototype.onKeyPress = function(e)
{
	if (this.flags.skp) {
		this.flags.skp = false;
		Spry.Widget.Utils.stopEvent(e);
		return false;
	}

	if (e.ctrlKey || e.metaKey || !this.useCharacterMasking) {
		return true;
	}
/*
	if (Spry.is.safari) {
		if ( (e.timeStamp - this.flags.lastKeyPressedTimeStamp)<10 ) {
			return true;
		}
		this.flags.lastKeyPressedTimeStamp = e.timeStamp;
	}
*/
	if (Spry.is.opera && this.flags.operaRevertOnKeyUp) {
		Spry.Widget.Utils.stopEvent(e);
		return false;
	}

	if (this.keyCode == 8 || this.keyCode == 46) {
		var mr = this.doValidations(this.input.value, this.input.value);
		if (mr) {
			return true;
		}
	}

	var pressed = Spry.Widget.Utils.getCharacterFromEvent(e);

	if (pressed && this.characterMasking) {
		if (!this.characterMasking.test(pressed)) {
			Spry.Widget.Utils.stopEvent(e);
			this.redTextFlash();
			return false;
		}
	}

	if(pressed && this.pattern) {
		var currentPatternChar = this.patternCharacters[this.selection.start];
		if (/[ax]/i.test(currentPatternChar)) {
			//convert the entered character to the pattern character case
			if (currentPatternChar.toLowerCase() == currentPatternChar) {
				pressed = pressed.toLowerCase();
			} else {
				pressed = pressed.toUpperCase();
			}
		}

		var autocomplete = this.getAutoComplete(this.selection.start);
		if (this.selection.start == this.oldValue.length) {
			if (this.oldValue.length < this.patternLength) {
				if (autocomplete) {
					Spry.Widget.Utils.stopEvent(e);
					var futureValue = this.oldValue.substring(0, this.selection.start) + autocomplete + pressed;
					var mustRevert = this.doValidations(futureValue, this.oldValue);
					if (!mustRevert) {
						this.setValue(this.fixedValue);
						this.selection.moveTo(this.fixedValue.length, this.fixedValue.length);
					} else {
						this.setValue(this.oldValue.substring(0, this.selection.start) + autocomplete);
						this.selection.moveTo(this.selection.start + autocomplete.length, this.selection.start + autocomplete.length);
					}
					return false;
				}
			} else {
				Spry.Widget.Utils.stopEvent(e);
				this.setValue(this.input.value);
				return false;
			}
		} else if (autocomplete) {
			Spry.Widget.Utils.stopEvent(e);
			this.selection.moveTo(this.selection.start + autocomplete.length, this.selection.start + autocomplete.length);
			return false;
		}

		Spry.Widget.Utils.stopEvent(e);

		var futureValue = this.oldValue.substring(0, this.selection.start) + pressed + this.oldValue.substring(this.selection.start + 1);
		var mustRevert = this.doValidations(futureValue, this.oldValue);

		if (!mustRevert) {
			autocomplete = this.getAutoComplete(this.selection.start + 1);
			this.setValue(this.fixedValue);
			this.selection.moveTo(this.selection.start + 1 + autocomplete.length, this.selection.start + 1 + autocomplete.length);
		} else {
			this.selection.moveTo(this.selection.start, this.selection.start);
		}

		return false;
	}
	
	
	if (pressed && this.type == 'date' && this.useCharacterMasking) 
	{
		var group = this.getDateGroup(this.oldValue, this.selection.start);
		if (group != -1) {
			Spry.Widget.Utils.stopEvent(e);
			if ( (group % 2) !=0 ) 
				group ++;
			
			if (this.isDateGroupFull(this.oldValue, group)) 
			{
				if(this.isPositionAtEndOfGroup(this.oldValue, this.selection.start, group))
				{
					if(group == this.lastDateGroup) 
					{
						this.redTextFlash(); return false;
					}
					else 
					{
						// add or jump over autocomplete delimiter
						var autocomplete = this.dateAutocompleteCharacters[group+1];
						
						if (this.nextDateDelimiterExists(this.oldValue, this.selection.start, group))
						{
							var autocomplete = this.dateAutocompleteCharacters[group+1];
							
							this.selection.moveTo(this.selection.start + autocomplete.length, this.selection.start + autocomplete.length);
							if (pressed == autocomplete) 
								return false;
							
							if (this.isDateGroupFull(this.oldValue, group+2)) 
								// need to overwrite first char in the next digit group
								futureValue = this.oldValue.substring(0, this.selection.start) + pressed + this.oldValue.substring(this.selection.start + 1);
							else
								futureValue = this.oldValue.substring(0, this.selection.start) + pressed + this.oldValue.substring(this.selection.start);
								
							if (!this.isValueValid(futureValue, this.selection.start + 1, group +2 )) 
							{
								this.redTextFlash(); return false;						
							}
							else
							{
								this.setValue (futureValue);
								this.selection.moveTo(this.selection.start + 1, this.selection.start + 1);									
							}
							return false;					
						}
						else 
						{
							var autocomplete = this.dateAutocompleteCharacters[group+1];
							
							var insertedValue = autocomplete + pressed;
							futureValue = this.oldValue.substring(0, this.selection.start) + insertedValue + this.oldValue.substring(this.selection.start);
							if (!this.isValueValid(futureValue, this.selection.start + insertedValue.length, group +2 )) 
							{
								// block this type
								insertedValue = autocomplete;
								futureValue = this.oldValue.substring(0, this.selection.start) + insertedValue + this.oldValue.substring(this.selection.start);
								this.setValue (futureValue);
								this.selection.moveTo(this.selection.start + insertedValue.length, this.selection.start + insertedValue.length);									
								this.redTextFlash(); return false;
							}
							else 
							{
								this.setValue (futureValue);
								this.selection.moveTo(this.selection.start + insertedValue.length, this.selection.start + insertedValue.length);									
								return false;
							}
						}
						
					}
				}
				else
				{
					// it's not the end of the full digits group
					
					// overwrite
					var movePosition = 1;
					futureValue = this.oldValue.substring(0, this.selection.start) + pressed + this.oldValue.substring(this.selection.start + 1);
					if (!this.isValueValid(futureValue, this.selection.start + 1, group)) 
					{
						this.redTextFlash(); return false;
					}
					else 
					{
						if(this.isPositionAtEndOfGroup(futureValue, this.selection.start+1, group)) 
						{
							if (group != this.lastDateGroup)
							{
								if (this.nextDateDelimiterExists(futureValue, this.selection.start + 1, group))
								{
									var autocomplete = this.dateAutocompleteCharacters[group+1];
									movePosition = 1 + autocomplete.length;
								}
								else
								{
									var autocomplete = this.dateAutocompleteCharacters[group+1];
									futureValue = this.oldValue.substring(0, this.selection.start) + pressed + autocomplete + this.oldValue.substring(this.selection.start + 1);
									movePosition = 1 + autocomplete.length;
								}
							}
						}
						this.setValue (futureValue);
						this.selection.moveTo(this.selection.start + movePosition, this.selection.start + movePosition);									
						return false;							
					}			
				}
			}
			else
			{
				// date group is not full
				// insert
				futureValue = this.oldValue.substring(0, this.selection.start) + pressed + this.oldValue.substring(this.selection.start);
				var movePosition = 1;
				if (!this.isValueValid(futureValue, this.selection.start + 1, group) && !this.isValueValid(futureValue, this.selection.start + 1, group+1)) 
				{
					this.redTextFlash(); return false;
				}
				else 
				{
					var autocomplete = this.dateAutocompleteCharacters[group+1];
					if (pressed == autocomplete) 
					{
						if (this.nextDateDelimiterExists(this.oldValue, this.selection.start, group))
						{
							futureValue = this.oldValue;
							movePosition = 1;
						}
					}
					else
					{
						if(this.isPositionAtEndOfGroup(futureValue, this.selection.start+1, group)) 
						{
							if (group != this.lastDateGroup)
							{
								if (this.nextDateDelimiterExists(futureValue, this.selection.start + 1, group))
								{
									var autocomplete = this.dateAutocompleteCharacters[group+1];
									movePosition = 1 + autocomplete.length;
								}
								else
								{
									var autocomplete = this.dateAutocompleteCharacters[group+1];
									futureValue = this.oldValue.substring(0, this.selection.start) + pressed + autocomplete + this.oldValue.substring(this.selection.start + 1);
									movePosition = 1 + autocomplete.length;
								}
							}
						}
					}
					this.setValue (futureValue);
					this.selection.moveTo(this.selection.start + movePosition, this.selection.start + movePosition);									
					return false;						
				}	
			}
		}
		return false;
	}
	
};

Spry.Widget.ValidationTextField.prototype.onKeyDown = function(e)
{
	this.saveState();
	this.keyCode = e.keyCode;

	if (Spry.is.opera) {
		if (this.flags.operaPasteOperation) {
			window.clearInterval(this.flags.operaPasteOperation);
			this.flags.operaPasteOperation = null;
		}
		if (e.ctrlKey) {
			var pressed = Spry.Widget.Utils.getCharacterFromEvent(e);
			if (pressed && 'vx'.indexOf(pressed.toLowerCase()) != -1) {
				var self = this;
				this.flags.operaPasteOperation = window.setInterval(function() { self.operaPasteMonitor();}, 1);
				return true;
			}
		}
	}

	if (this.keyCode != 8 && this.keyCode != 46 && Spry.Widget.Utils.isSpecialKey(e)) {
		return true;
	}
	if (this.keyCode == 8 || this.keyCode == 46 ) {
		var mr = this.doValidations(this.input.value, this.input.value);
		if (mr) {
			return true;
		}
	}

	//DELETE
	if (this.useCharacterMasking && this.pattern && this.keyCode == 46) {
		if (e.ctrlKey) {
			//delete from selection until end
			this.setValue(this.input.value.substring(0, this.selection.start));
		} else if (this.selection.end == this.input.value.length || this.selection.start == this.input.value.length-1){
			//allow key if selection is at end (will delete selection)
			return true;
		} else {
			this.flags.operaRevertOnKeyUp = true;
		}
		if (Spry.is.mozilla && Spry.is.mac) {
			this.flags.skp = true;
		}
		Spry.Widget.Utils.stopEvent(e);
		return false;
	}

	//BACKSPACE
	if (this.useCharacterMasking && this.pattern && !e.ctrlKey && this.keyCode == 8) {
		if (this.selection.start == this.input.value.length) {
			//delete with BACKSPACE from the end of the input value only
			var n = this.getAutoComplete(this.selection.start, -1);
			this.setValue(this.input.value.substring(0, this.input.value.length - (Spry.is.opera?0:1) - n.length));
			if (Spry.is.opera) {
				//cant stop the event on Opera, we'll just preserve the selection so delete will act on it
				this.selection.start = this.selection.start - 1 - n.length;
				this.selection.end = this.selection.end - 1 - n.length;
			}
		} else if (this.selection.end == this.input.value.length){
			//allow BACKSPACE if selection is at end (will delete selection)
			return true;
		} else {
			this.flags.operaRevertOnKeyUp = true;
		}
		if (Spry.is.mozilla && Spry.is.mac) {
			this.flags.skp = true;
		} 
		Spry.Widget.Utils.stopEvent(e);
		return false;
	}

	return true;
};

Spry.Widget.ValidationTextField.prototype.onMouseDown = function(e)
{
	if (this.flags.active) {
		//mousedown fires before focus
		//avoid double saveState on first focus by mousedown by checking if the control has focus
		//do nothing if it's not focused because saveState will be called onfocus
		this.saveState();
	}
};

Spry.Widget.ValidationTextField.prototype.onDrop = function(e)
{
	//mark that a drop operation is in progress to avoid race conditions with event handlers for other events
	//especially onchange and onfocus
	this.flags.drop = true;
	this.removeHint();
	this.saveState();
	this.flags.active = true;
	this.addClassName(this.element, this.focusClass);
};

Spry.Widget.ValidationTextField.prototype.onFocus = function(e)
{
	if (this.flags.drop) {
		return;
	}
	this.removeHint();

	if (this.pattern && this.useCharacterMasking) {
		var autocomplete = this.getAutoComplete(this.selection.start);
		this.setValue(this.input.value + autocomplete);
		this.selection.moveTo(this.input.value.length, this.input.value.length);
	}
	
	this.saveState();
	this.flags.active = true;
	this.addClassName(this.element, this.focusClass);
};
	
Spry.Widget.ValidationTextField.prototype.onBlur = function(e)
{
	this.flags.active = false;
	this.removeClassName(this.element, this.focusClass);
	var mustRevert = this.doValidations(this.input.value, this.input.value);

	if (this.validateOn & Spry.Widget.ValidationTextField.ONBLUR) {
		this.validate();
	}
	var self = this;
	setTimeout(function() {self.putHint();}, 10);
	return true;
};

Spry.Widget.ValidationTextField.prototype.compilePattern = function() {
	if (!this.pattern) {
		return;
	}
	var compiled = [];
	var regexps = [];
	var patternCharacters = [];
	var idx = 0;
	var c = '', p = '';
	for (var i=0; i<this.pattern.length; i++) {
		c = this.pattern.charAt(i);
		if (p == '\\') {
			if (/[0ABXY\?]/i.test(c)) {
				regexps[idx - 1] = c;
			} else {
				regexps[idx - 1] = Spry.Widget.ValidationTextField.regExpFromChars(c);
			}
			compiled[idx - 1] = c;
			patternCharacters[idx - 1] = null;
			p = '';
			continue;
		}
		regexps[idx] = Spry.Widget.ValidationTextField.regExpFromChars(c);
		if (/[0ABXY\?]/i.test(c)) {
			compiled[idx] = null;
			patternCharacters[idx] = c;
		} else if (c == '\\') {
			compiled[idx] = c;
			patternCharacters[idx] = '\\';
		} else {
			compiled[idx] = c;
			patternCharacters[idx] = null;
		}
		idx++;
		p = c;
	}

	this.autoCompleteCharacters = compiled;
	this.compiledPattern = regexps;
	this.patternCharacters = patternCharacters;
	this.patternLength = compiled.length;
};

Spry.Widget.ValidationTextField.prototype.getAutoComplete = function(from, direction) {
	if (direction == -1) {
		var n = '', m = '';
		while(from && (n = this.getAutoComplete(--from) )) {
			m = n;
		}
		return m;
	}
	var ret = '', c = '';
	for (var i=from; i<this.autoCompleteCharacters.length; i++) {
		c = this.autoCompleteCharacters[i];
		if (c) {
			ret += c;
		} else {
			break;
		}
	}
	return ret;
};

Spry.Widget.ValidationTextField.regExpFromChars = function (string) {
	//string contains pattern characters
	var ret = '', character = '';
	for (var i = 0; i<string.length; i++) {
		character = string.charAt(i);
		switch (character) {
			case '0': ret += '\\d';break;
			case 'A': ret += '[A-Z]';break;
//			case 'A': ret += '[\u0041-\u005A\u0061-\u007A\u0100-\u017E\u0180-\u0233\u0391-\u03CE\u0410-\u044F\u05D0-\u05EA\u0621-\u063A\u0641-\u064A\u0661-\u06D3\u06F1-\u06FE]';break;
			case 'a': ret += '[a-z]';break;
//			case 'a': ret += '[\u0080-\u00FF]';break;
			case 'B': case 'b': ret += '[a-zA-Z]';break;
			case 'x': ret += '[0-9a-z]';break;
			case 'X': ret += '[0-9A-Z]';break;
			case 'Y': case 'y': ret += '[0-9a-zA-Z]';break;
			case '?': ret += '.';break;
			case '1':case '2':case '3':case '4':case '5':case '6':case '7':case '8':case '9':
				ret += character;
				break;
			case 'c': case 'C': case 'e': case 'E': case 'f': case 'F':case 'r':case 'd': case 'D':case 'n':case 's':case 'S':case 'w':case 'W':case 't':case 'v':
				ret += character;
				break;
			default: ret += '\\' + character;
		}
	}
	return ret;
};

Spry.Widget.ValidationTextField.prototype.patternToRegExp = function(len) {
	var ret = '^';
	var end = Math.min(this.compiledPattern.length, len);
	for (var i=0; i < end; i++) {
		ret += this.compiledPattern[i];
	}
	ret += '$';
	ret = new RegExp(ret, "");
	return ret;
};

Spry.Widget.ValidationTextField.prototype.reset = function() {
	this.removeHint();
	this.oldValue = this.input.defaultValue;
	this.removeClassName(this.element, this.requiredClass);
	this.removeClassName(this.element, this.invalidFormatClass);
	this.removeClassName(this.element, this.invalidRangeMinClass);
	this.removeClassName(this.element, this.invalidRangeMaxClass);
	this.removeClassName(this.element, this.invalidCharsMinClass);
	this.removeClassName(this.element, this.invalidCharsMaxClass);
	this.removeClassName(this.element, this.validClass);
	var self = this;
	setTimeout(function() {self.putHint();}, 10);
};

Spry.Widget.ValidationTextField.prototype.validate = function() {
	this.removeClassName(this.element, this.requiredClass);
	this.removeClassName(this.element, this.invalidFormatClass);
	this.removeClassName(this.element, this.invalidRangeMinClass);
	this.removeClassName(this.element, this.invalidRangeMaxClass);
	this.removeClassName(this.element, this.invalidCharsMinClass);
	this.removeClassName(this.element, this.invalidCharsMaxClass);
	this.removeClassName(this.element, this.validClass);

	//possible states: required, format, rangeMin, rangeMax, charsMin, charsMax
	if (this.validateOn & Spry.Widget.ValidationTextField.ONSUBMIT) {

		this.removeHint();
		this.doValidations(this.input.value, this.input.value);

		if(!this.flags.active) {
			var self = this;
			setTimeout(function() {self.putHint();}, 10);
		}
	}

	if (this.isRequired && this.errors & Spry.Widget.ValidationTextField.ERROR_REQUIRED) {
		this.addClassName(this.element, this.requiredClass);
		return false;
	}

	if (this.errors & Spry.Widget.ValidationTextField.ERROR_FORMAT) {
		this.addClassName(this.element, this.invalidFormatClass);
		return false;
	}

	if (this.errors & Spry.Widget.ValidationTextField.ERROR_RANGE_MIN) {
		this.addClassName(this.element, this.invalidRangeMinClass);
		return false;
	}

	if (this.errors & Spry.Widget.ValidationTextField.ERROR_RANGE_MAX) {
		this.addClassName(this.element, this.invalidRangeMaxClass);
		return false;
	}

	if (this.errors & Spry.Widget.ValidationTextField.ERROR_CHARS_MIN) {
		this.addClassName(this.element, this.invalidCharsMinClass);
		return false;
	}

	if (this.errors & Spry.Widget.ValidationTextField.ERROR_CHARS_MAX) {
		this.addClassName(this.element, this.invalidCharsMaxClass);
		return false;
	}

	this.addClassName(this.element, this.validClass);
	return true;
}

Spry.Widget.ValidationTextField.prototype.addClassName = function(ele, className)
{
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) != -1))
		return;
	ele.className += (ele.className ? " " : "") + className;
};

Spry.Widget.ValidationTextField.prototype.removeClassName = function(ele, className)
{
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) == -1))
		return;
	ele.className = ele.className.replace(new RegExp("\\s*\\b" + className + "\\b", "g"), "");
};

/**
 * SelectionDescriptor is a wrapper for input type text selection methods and properties 
 * as implemented by various  browsers
 */
Spry.Widget.SelectionDescriptor = function (element)
{
	this.element = element;
	this.update();
};

Spry.Widget.SelectionDescriptor.prototype.update = function()
{
	if (Spry.is.ie && Spry.is.windows) {
		if (this.element.nodeName == "TEXTAREA") {
		var range = this.element.ownerDocument.selection.createRange();
		if (range.parentElement() == this.element){
			var range_all = this.element.ownerDocument.body.createTextRange();
			range_all.moveToElementText(this.element);
			for (var sel_start = 0; range_all.compareEndPoints('StartToStart', range) < 0; sel_start ++){
			 	range_all.moveStart('character', 1);
			}
			this.start = sel_start;
			// create a selection of the whole this.element
			range_all = this.element.ownerDocument.body.createTextRange();
			range_all.moveToElementText(this.element);
			for (var sel_end = 0; range_all.compareEndPoints('StartToEnd', range) < 0; sel_end++){
				range_all.moveStart('character', 1);
			}
			this.end = sel_end;
			this.length = this.end - this.start;
			// get selected and surrounding text
			this.text = range.text;
		 }
		} else if (this.element.nodeName == "INPUT"){
			this.range = this.element.ownerDocument.selection.createRange();
			this.length = this.range.text.length;
			var clone = this.range.duplicate();
			this.start = -clone.moveStart("character", -10000);
			clone = this.range.duplicate();
			clone.collapse(false);
			this.end = -clone.moveStart("character", -10000);
			this.text = this.range.text;
		}
	} else {
		var tmp = this.element;
		var selectionStart = 0;
		var selectionEnd = 0;
		try { selectionStart = tmp.selectionStart;} catch(err) {}
		try { selectionEnd = tmp.selectionEnd;} catch(err) {}

		if (Spry.is.safari) {
			if (selectionStart == 2147483647) {
				selectionStart = 0;
			}
			if (selectionEnd == 2147483647) {
				selectionEnd = 0;
			}
		}
		this.start = selectionStart;
		this.end = selectionEnd;
		this.length = selectionEnd - selectionStart;
		this.text = this.element.value.substring(selectionStart, selectionEnd);
	}
};

Spry.Widget.SelectionDescriptor.prototype.destroy = function() {
	try { delete this.range} catch(err) {}
	try { delete this.element} catch(err) {}
};

Spry.Widget.SelectionDescriptor.prototype.move = function(amount)
{
	if (Spry.is.ie && Spry.is.windows) {
		this.range.move("character", amount);
		this.range.select();
	} else {
		try { this.element.selectionStart++;}catch(err) {}
	}
	this.update();
};

Spry.Widget.SelectionDescriptor.prototype.moveTo = function(start, end)
{
	if (Spry.is.ie && Spry.is.windows) {
		if (this.element.nodeName == "TEXTAREA") {
			var ta_range = this.element.createTextRange();
			this.range = this.element.createTextRange();
			this.range.move("character", start);
			this.range.moveEnd("character", end - start);
			
			var c1 = this.range.compareEndPoints("StartToStart", ta_range);
			if (c1 < 0) {
				this.range.setEndPoint("StartToStart", ta_range);
			}

			var c2 = this.range.compareEndPoints("EndToEnd", ta_range);
			if (c2 > 0) {
				this.range.setEndPoint("EndToEnd", ta_range);
			}
		} else if (this.element.nodeName == "INPUT"){
			this.range = this.element.ownerDocument.selection.createRange();
			this.range.move("character", -10000);
			this.start = this.range.moveStart("character", start);
			this.end = this.start + this.range.moveEnd("character", end - start);
		}
		this.range.select();
	} else {
		this.start = start;
		try { this.element.selectionStart = start;} catch(err) {}
		this.end = end;
		try { this.element.selectionEnd = end;} catch(err) {}
	}
	this.ignore = true;
	this.update();
};

Spry.Widget.SelectionDescriptor.prototype.moveEnd = function(amount)
{
	if (Spry.is.ie && Spry.is.windows) {
		this.range.moveEnd("character", amount);
		this.range.select();
	} else {
		try { this.element.selectionEnd++;} catch(err) {}
	}
	this.update();
};

Spry.Widget.SelectionDescriptor.prototype.collapse = function(begin)
{
	if (Spry.is.ie && Spry.is.windows) {
		this.range = this.element.ownerDocument.selection.createRange();
		this.range.collapse(begin);
		this.range.select();
	} else {
		if (begin) {
			try { this.element.selectionEnd = this.element.selectionStart;} catch(err) {}
		} else {
			try { this.element.selectionStart = this.element.selectionEnd;} catch(err) {}
		}
	}

	this.update();
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Widget.Form - common for all widgets
//
//////////////////////////////////////////////////////////////////////

if (!Spry.Widget.Form) Spry.Widget.Form = {};
if (!Spry.Widget.Form.onSubmitWidgetQueue) Spry.Widget.Form.onSubmitWidgetQueue = [];

if (!Spry.Widget.Form.validate) {
	Spry.Widget.Form.validate = function(vform) {
		var isValid = true;
		var isElementValid = true;
		var q = Spry.Widget.Form.onSubmitWidgetQueue;
		var qlen = q.length;
		for (var i = 0; i < qlen; i++) {
			if (!q[i].isDisabled() && q[i].form == vform) {
				isElementValid = q[i].validate();
				isValid = isElementValid && isValid;
			}
		}
		return isValid;
	}
};

if (!Spry.Widget.Form.onSubmit) {
	Spry.Widget.Form.onSubmit = function(e, form)
	{
		if (Spry.Widget.Form.validate(form) == false) {
			return false;
		}
		return true;
	};
};

if (!Spry.Widget.Form.onReset) {
	Spry.Widget.Form.onReset = function(e, vform)
	{
		var q = Spry.Widget.Form.onSubmitWidgetQueue;
		var qlen = q.length;
		for (var i = 0; i < qlen; i++) {
			if (!q[i].isDisabled() && q[i].form == vform && typeof(q[i].reset) == 'function') {
				q[i].reset();
			}
		}
		return true;
	};
};

if (!Spry.Widget.Form.destroy) {
	Spry.Widget.Form.destroy = function(form)
	{
		var q = Spry.Widget.Form.onSubmitWidgetQueue;
		for (var i = 0; i < Spry.Widget.Form.onSubmitWidgetQueue.length; i++) {
			if (q[i].form == form && typeof(q[i].destroy) == 'function') {
				q[i].destroy();
				i--;
			}
		}
	}
};

if (!Spry.Widget.Form.destroyAll) {
	Spry.Widget.Form.destroyAll = function()
	{
		var q = Spry.Widget.Form.onSubmitWidgetQueue;
		for (var i = 0; i < Spry.Widget.Form.onSubmitWidgetQueue.length; i++) {
			if (typeof(q[i].destroy) == 'function') {
				q[i].destroy();
				i--;
			}
		}
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Widget.Utils
//
//////////////////////////////////////////////////////////////////////

if (!Spry.Widget.Utils)	Spry.Widget.Utils = {};

Spry.Widget.Utils.setOptions = function(obj, optionsObj, ignoreUndefinedProps)
{
	if (!optionsObj)
		return;
	for (var optionName in optionsObj)
	{
		if (ignoreUndefinedProps && optionsObj[optionName] == undefined)
			continue;
		obj[optionName] = optionsObj[optionName];
	}
};

Spry.Widget.Utils.firstValid = function() {
	var ret = null;
	for(var i=0; i<Spry.Widget.Utils.firstValid.arguments.length; i++) {
		if (typeof(Spry.Widget.Utils.firstValid.arguments[i]) != 'undefined') {
			ret = Spry.Widget.Utils.firstValid.arguments[i];
			break;
		}
	}
	return ret;
};


Spry.Widget.Utils.specialCharacters = ",8,9,16,17,18,20,27,33,34,35,36,37,38,40,45,144,192,63232,";
Spry.Widget.Utils.specialSafariNavKeys = "63232,63233,63234,63235,63272,63273,63275,63276,63277,63289,";
Spry.Widget.Utils.specialNotSafariCharacters = "39,46,91,92,93,";

Spry.Widget.Utils.specialCharacters += Spry.Widget.Utils.specialSafariNavKeys;

if (!Spry.is.safari) {
	Spry.Widget.Utils.specialCharacters += Spry.Widget.Utils.specialNotSafariCharacters;
}

Spry.Widget.Utils.isSpecialKey = function (ev) {
	return Spry.Widget.Utils.specialCharacters.indexOf("," + ev.keyCode + ",") != -1;
};

Spry.Widget.Utils.getCharacterFromEvent = function(e){
	var keyDown = e.type == "keydown";

	var code = null;
	var character = null;
	if(Spry.is.mozilla && !keyDown){
		if(e.charCode){
			character = String.fromCharCode(e.charCode);
		} else {
			code = e.keyCode;
		}
	} else {
		code = e.keyCode || e.which;
		if (code != 13) {
			character = String.fromCharCode(code);
		}
	}

	if (Spry.is.safari) {
		if (keyDown) {
			code = e.keyCode || e.which;
			character = String.fromCharCode(code);
		} else {
			code = e.keyCode || e.which;
			if (Spry.Widget.Utils.specialCharacters.indexOf("," + code + ",") != -1) {
				character = null;
			} else {
				character = String.fromCharCode(code);
			}
		}
	}

	if(Spry.is.opera) {
		if (Spry.Widget.Utils.specialCharacters.indexOf("," + code + ",") != -1) {
			character = null;
		} else {
			character = String.fromCharCode(code);
		}
	}

	return character;
};

Spry.Widget.Utils.getFirstChildWithNodeNameAtAnyLevel = function(node, nodeName)
{
	var elements  = node.getElementsByTagName(nodeName);
	if (elements) {
		return elements[0];
	}
	return null;
};

Spry.Widget.Utils.getFirstParentWithNodeName = function(node, nodeName)
{
	while (node.parentNode
			&& node.parentNode.nodeName.toLowerCase() != nodeName.toLowerCase()
			&& node.parentNode.nodeName != 'BODY') {
		node = node.parentNode;
	}

	if (node.parentNode && node.parentNode.nodeName.toLowerCase() == nodeName.toLowerCase()) {
		return node.parentNode;
	} else {
		return null;
	}
};

Spry.Widget.Utils.destroyWidgets = function (container)
{
	if (typeof container == 'string') {
		container = document.getElementById(container);
	}

	var q = Spry.Widget.Form.onSubmitWidgetQueue;
	for (var i = 0; i < Spry.Widget.Form.onSubmitWidgetQueue.length; i++) {
		if (typeof(q[i].destroy) == 'function' && Spry.Widget.Utils.contains(container, q[i].element)) {
			q[i].destroy();
			i--;
		}
	}
};

Spry.Widget.Utils.contains = function (who, what)
{
	if (typeof who.contains == 'object') {
		return what && who && (who == what || who.contains(what));
	} else {
		var el = what;
		while(el) {
			if (el == who) {
				return true;
			}
			el = el.parentNode;
		}
		return false;
	}
};

Spry.Widget.Utils.addEventListener = function(element, eventType, handler, capture)
{
	try
	{
		if (element.addEventListener)
			element.addEventListener(eventType, handler, capture);
		else if (element.attachEvent)
			element.attachEvent("on" + eventType, handler, capture);
	}
	catch (e) {}
};

Spry.Widget.Utils.removeEventListener = function(element, eventType, handler, capture)
{
	try
	{
		if (element.removeEventListener)
			element.removeEventListener(eventType, handler, capture);
		else if (element.detachEvent)
			element.detachEvent("on" + eventType, handler, capture);
	}
	catch (e) {}
};

Spry.Widget.Utils.stopEvent = function(ev)
{
	try
	{
		this.stopPropagation(ev);
		this.preventDefault(ev);
	}
	catch (e) {}
};

/**
 * Stops event propagation
 * @param {Event} ev the event
 */
Spry.Widget.Utils.stopPropagation = function(ev)
{
	if (ev.stopPropagation)
	{
		ev.stopPropagation();
	}
	else
	{
		ev.cancelBubble = true;
	}
};

/**
 * Prevents the default behavior of the event
 * @param {Event} ev the event
 */
Spry.Widget.Utils.preventDefault = function(ev)
{
	if (ev.preventDefault)
	{
		ev.preventDefault();
	}
	else
	{
		ev.returnValue = false;
	}
};
/* SpryTabbedPanels.js - Revision: Spry Preview Release 1.4 */

// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry;
if (!Spry) Spry = {};
if (!Spry.Widget) Spry.Widget = {};

Spry.Widget.TabbedPanels = function(element, opts)
{
	this.element = this.getElement(element);
	this.defaultTab = 0; // Show the first panel by default.
	this.bindings = [];
	this.tabSelectedClass = "TabbedPanelsTabSelected";
	this.tabHoverClass = "TabbedPanelsTabHover";
	this.tabFocusedClass = "TabbedPanelsTabFocused";
	this.panelVisibleClass = "TabbedPanelsContentVisible";
	this.focusElement = null;
	this.hasFocus = false;
	this.currentTabIndex = 0;
	this.enableKeyboardNavigation = true;

	Spry.Widget.TabbedPanels.setOptions(this, opts);

	// If the defaultTab is expressed as a number/index, convert
	// it to an element.

	if (typeof (this.defaultTab) == "number")
	{
		if (this.defaultTab < 0)
			this.defaultTab = 0;
		else
		{
			var count = this.getTabbedPanelCount();
			if (this.defaultTab >= count)
				this.defaultTab = (count > 1) ? (count - 1) : 0;
		}

		this.defaultTab = this.getTabs()[this.defaultTab];
	}

	// The defaultTab property is supposed to be the tab element for the tab content
	// to show by default. The caller is allowed to pass in the element itself or the
	// element's id, so we need to convert the current value to an element if necessary.

	if (this.defaultTab)
		this.defaultTab = this.getElement(this.defaultTab);

	this.attachBehaviors();
};

Spry.Widget.TabbedPanels.prototype.getElement = function(ele)
{
	if (ele && typeof ele == "string")
		return document.getElementById(ele);
	return ele;
}

Spry.Widget.TabbedPanels.prototype.getElementChildren = function(element)
{
	var children = [];
	var child = element.firstChild;
	while (child)
	{
		if (child.nodeType == 1 /* Node.ELEMENT_NODE */)
			children.push(child);
		child = child.nextSibling;
	}
	return children;
};

Spry.Widget.TabbedPanels.prototype.addClassName = function(ele, className)
{
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) != -1))
		return;
	ele.className += (ele.className ? " " : "") + className;
};

Spry.Widget.TabbedPanels.prototype.removeClassName = function(ele, className)
{
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) == -1))
		return;
	ele.className = ele.className.replace(new RegExp("\\s*\\b" + className + "\\b", "g"), "");
};

Spry.Widget.TabbedPanels.setOptions = function(obj, optionsObj, ignoreUndefinedProps)
{
	if (!optionsObj)
		return;
	for (var optionName in optionsObj)
	{
		if (ignoreUndefinedProps && optionsObj[optionName] == undefined)
			continue;
		obj[optionName] = optionsObj[optionName];
	}
};

Spry.Widget.TabbedPanels.prototype.getTabGroup = function()
{
	if (this.element)
	{
		var children = this.getElementChildren(this.element);
		if (children.length)
			return children[0];
	}
	return null;
};

Spry.Widget.TabbedPanels.prototype.getTabs = function()
{
	var tabs = [];
	var tg = this.getTabGroup();
	if (tg)
		tabs = this.getElementChildren(tg);
	return tabs;
};

Spry.Widget.TabbedPanels.prototype.getContentPanelGroup = function()
{
	if (this.element)
	{
		var children = this.getElementChildren(this.element);
		if (children.length > 1)
			return children[1];
	}
	return null;
};

Spry.Widget.TabbedPanels.prototype.getContentPanels = function()
{
	var panels = [];
	var pg = this.getContentPanelGroup();
	if (pg)
		panels = this.getElementChildren(pg);
	return panels;
};

Spry.Widget.TabbedPanels.prototype.getIndex = function(ele, arr)
{
	ele = this.getElement(ele);
	if (ele && arr && arr.length)
	{
		for (var i = 0; i < arr.length; i++)
		{
			if (ele == arr[i])
				return i;
		}
	}
	return -1;
};

Spry.Widget.TabbedPanels.prototype.getTabIndex = function(ele)
{
	var i = this.getIndex(ele, this.getTabs());
	if (i < 0)
		i = this.getIndex(ele, this.getContentPanels());
	return i;
};

Spry.Widget.TabbedPanels.prototype.getCurrentTabIndex = function()
{
	return this.currentTabIndex;
};

Spry.Widget.TabbedPanels.prototype.getTabbedPanelCount = function(ele)
{
	return Math.min(this.getTabs().length, this.getContentPanels().length);
};

Spry.Widget.TabbedPanels.addEventListener = function(element, eventType, handler, capture)
{
	try
	{
		if (element.addEventListener)
			element.addEventListener(eventType, handler, capture);
		else if (element.attachEvent)
			element.attachEvent("on" + eventType, handler);
	}
	catch (e) {}
};

Spry.Widget.TabbedPanels.prototype.onTabClick = function(e, tab)
{
	this.showPanel(tab);
};

Spry.Widget.TabbedPanels.prototype.onTabMouseOver = function(e, tab)
{
	this.addClassName(tab, this.tabHoverClass);
};

Spry.Widget.TabbedPanels.prototype.onTabMouseOut = function(e, tab)
{
	this.removeClassName(tab, this.tabHoverClass);
};

Spry.Widget.TabbedPanels.prototype.onTabFocus = function(e, tab)
{
	this.hasFocus = true;
	this.addClassName(this.element, this.tabFocusedClass);
};

Spry.Widget.TabbedPanels.prototype.onTabBlur = function(e, tab)
{
	this.hasFocus = false;
	this.removeClassName(this.element, this.tabFocusedClass);
};

Spry.Widget.TabbedPanels.ENTER_KEY = 13;
Spry.Widget.TabbedPanels.SPACE_KEY = 32;

Spry.Widget.TabbedPanels.prototype.onTabKeyDown = function(e, tab)
{
	var key = e.keyCode;
	if (!this.hasFocus || (key != Spry.Widget.TabbedPanels.ENTER_KEY && key != Spry.Widget.TabbedPanels.SPACE_KEY))
		return true;

	this.showPanel(tab);

	if (e.stopPropagation)
		e.stopPropagation();
	if (e.preventDefault)
		e.preventDefault();

	return false;
};

Spry.Widget.TabbedPanels.prototype.preorderTraversal = function(root, func)
{
	var stopTraversal = false;
	if (root)
	{
		stopTraversal = func(root);
		if (root.hasChildNodes())
		{
			var child = root.firstChild;
			while (!stopTraversal && child)
			{
				stopTraversal = this.preorderTraversal(child, func);
				try { child = child.nextSibling; } catch (e) { child = null; }
			}
		}
	}
	return stopTraversal;
};

Spry.Widget.TabbedPanels.prototype.addPanelEventListeners = function(tab, panel)
{
	var self = this;
	Spry.Widget.TabbedPanels.addEventListener(tab, "click", function(e) { return self.onTabClick(e, tab); }, false);
	Spry.Widget.TabbedPanels.addEventListener(tab, "mouseover", function(e) { return self.onTabMouseOver(e, tab); }, false);
	Spry.Widget.TabbedPanels.addEventListener(tab, "mouseout", function(e) { return self.onTabMouseOut(e, tab); }, false);

	if (this.enableKeyboardNavigation)
	{
		// XXX: IE doesn't allow the setting of tabindex dynamically. This means we can't
		// rely on adding the tabindex attribute if it is missing to enable keyboard navigation
		// by default.

		// Find the first element within the tab container that has a tabindex or the first
		// anchor tag.
		
		var tabIndexEle = null;
		var tabAnchorEle = null;

		this.preorderTraversal(tab, function(node) {
			if (node.nodeType == 1 /* NODE.ELEMENT_NODE */)
			{
				var tabIndexAttr = tab.attributes.getNamedItem("tabindex");
				if (tabIndexAttr)
				{
					tabIndexEle = node;
					return true;
				}
				if (!tabAnchorEle && node.nodeName.toLowerCase() == "a")
					tabAnchorEle = node;
			}
			return false;
		});

		if (tabIndexEle)
			this.focusElement = tabIndexEle;
		else if (tabAnchorEle)
			this.focusElement = tabAnchorEle;

		if (this.focusElement)
		{
			Spry.Widget.TabbedPanels.addEventListener(this.focusElement, "focus", function(e) { return self.onTabFocus(e, tab); }, false);
			Spry.Widget.TabbedPanels.addEventListener(this.focusElement, "blur", function(e) { return self.onTabBlur(e, tab); }, false);
			Spry.Widget.TabbedPanels.addEventListener(this.focusElement, "keydown", function(e) { return self.onTabKeyDown(e, tab); }, false);
		}
	}
};

Spry.Widget.TabbedPanels.prototype.showPanel = function(elementOrIndex)
{
	var tpIndex = -1;
	
	if (typeof elementOrIndex == "number")
		tpIndex = elementOrIndex;
	else // Must be the element for the tab or content panel.
		tpIndex = this.getTabIndex(elementOrIndex);
	
	if (!tpIndex < 0 || tpIndex >= this.getTabbedPanelCount())
		return;

	var tabs = this.getTabs();
	var panels = this.getContentPanels();

	var numTabbedPanels = Math.max(tabs.length, panels.length);

	for (var i = 0; i < numTabbedPanels; i++)
	{
		if (i != tpIndex)
		{
			if (tabs[i])
				this.removeClassName(tabs[i], this.tabSelectedClass);
			if (panels[i])
			{
				this.removeClassName(panels[i], this.panelVisibleClass);
				panels[i].style.display = "none";
			}
		}
	}

	this.addClassName(tabs[tpIndex], this.tabSelectedClass);
	this.addClassName(panels[tpIndex], this.panelVisibleClass);
	panels[tpIndex].style.display = "block";

	this.currentTabIndex = tpIndex;
};

Spry.Widget.TabbedPanels.prototype.attachBehaviors = function(element)
{
	var tabs = this.getTabs();
	var panels = this.getContentPanels();
	var panelCount = this.getTabbedPanelCount();

	for (var i = 0; i < panelCount; i++)
		this.addPanelEventListeners(tabs[i], panels[i]);

	this.showPanel(this.defaultTab);
};


var Window =
{
	
	'index' : 0,
	'instance' : [],
	MultiSelects : []
	
}



Window.addInstance = function($opts, $post)
{
	
	//
	// variables
	//
	var $i = Window.index++;
	Window.instance[$i] = {};
	Window.instance[$i].index = $i;
	Window.instance[$i].opts = $opts;
	Window.instance[$i].post = $post;
	
	var $bv = Node.createDiv({'node':document.body});
	$bv.className = 'BlackVeil BlackVeil'+$i;
	$bv.style.opacity = '.5';
	$bv.style.filter = 'alpha(opacity=50)';
	//$bv.style.display = 'none';
	this.placeBlackVeils();
	Spry.Widget.Utils.addEventListener(window, 'resize', this.placeBlackVeils, true);
	Window.addInstanceFinish($i);
	//Spry.Effect.AppearFade($bv, {duration:200, from:0, to:50, finish:function(){Window.addInstanceFinish($i)}});
	
	return Window.instance[$i];
	
}



Window.addInstanceFinish = function($i)
{
	
	//
	// variables
	//
	//var $i = Window.index-1;
	var $opts = Window.instance[$i].opts;
	var $post = Window.instance[$i].post;
	
	//
	// create node
	//
	var $db = document.body;
	var $a =
	{
		'id' : 'window'+$i,
		'class' : 'window '+$opts['class']
	}
	var $w = Node.createDiv({node:$db, attrs:$a});
	Window.instance[$i].node = $w;
	
	//
	// query
	//
	var $q =
	[
		'id='+$i,
		'name='+$opts['name'],
		'body='+$opts['body']
	]
	if($opts['include']) { $q.push('include=true'); }
	else if($opts['curl']) { $q.push('curl=true'); }
	for(var $k in $opts['bodyOpts'])
	{
		$q.push('o['+$k+']='+$opts['bodyOpts'][$k]);
	}
	
	//
	// options
	//
	var $o =
	{
		'xml' : false,
		'container' : $w,
		'post' : $post,
		'callback' : function($el)
		{
			
			//
			// place window in center
			//
			$_windowInstanceForPlace = $el;
			setTimeout(
					   function()
					   {
							var $de = document.documentElement;
							var $x = Window.instance[Window.index-1].node;
							var $core = Node.getElementByClassName('\\bcore\\b', $x);
							var $scroll = Node.getElementByClassName('\\bscroll\\b', $core);
							if($x.offsetHeight>($de.offsetHeight-20)) { $scroll.style.height = $de.offsetHeight-100+'px'; }
							if($x.offsetWidth>($de.offsetWidth-20)) { $scroll.style.width = $de.offsetWidth-20+'px'; }
							$x.style.left = Math.max(0,($de.offsetWidth/2-$x.offsetWidth/2))+'px';
							$x.style.top = Math.max(0,($de.offsetHeight/2-$x.offsetHeight/2))+'px';
					   }
					   , 1);
			
			//
			// AppearFades
			//
			var $AppearFades = Node.getElementsByClassName('\\bAppearFade\\b', $el);
			Window.instance[Window.index-1].AppearFades = [];
			for(var $i=0; $i<$AppearFades.length; $i++)
			{
				Window.instance[Window.index-1].AppearFades.push($AppearFades[$i]);
				setTimeout(
				function()
				{
					var $w = Window.instance[Window.index-1];
					if($w)
					{
						var $x = $w.AppearFades.shift();
						if($x) { Spry.Effect.AppearFade($x, {'duration':1000, 'from':0, 'to':100}); }
					}
				},
				100*$i);
			}
			
			if($opts.callback) { $opts.callback($el); }
			
			//
			// MultiSelects
			//
			if(typeof(MultiSelect)=='object')
			{
				Window.instance[Window.index-1].MultiSelects = MultiSelect.scan($el);
			}
			
		}
	}
	
	//
	// output
	//
	XMLHttp.load('php/script/window.php?'+$q.join('&'), $o);
	
}



Window.removeInstance = function(callback)
{
	
	//
	// moving index down
	//
	var $index = --this.index;
	
	//
	// onclose function
	//
	if(typeof(this.instance[$index].onclose)=='function')
	{
		this.instance[$index].onclose(this.instance[$index]);
	}
	
	//
	// MultiSelect
	//
	if(typeof(MultiSelect)=='object' && this.instance[$index].MultiSelects)
	{
		for(var $i=0; $i<this.instance[$index].MultiSelects.length; $i++)
		{
			var $ms = this.instance[$index].MultiSelects[$i];
			MultiSelect.destroy($ms);
		}
	}
	
	delete this.instance[$index];
	Node.remove(document.getElementById('window'+$index));
	var $bv = Node.getElementByClassName('\\bBlackVeil'+$index+'\\b');
	Node.remove($bv);
	//Spry.Effect.AppearFade($bv, {duration:200, from:50, to:0, finish:function($el){ Node.remove($el); }});
	if(callback) { callback(); }
	
}



Window.placeBlackVeils = function()
{
	
	var $bvs = Node.getElementsByClassName('\\bBlackVeil\\b');
	for(var $i=0; $i<$bvs.length; $i++)
	{
		var $bv = $bvs[$i];
		var $de = document.documentElement;
		var $deow = $de.offsetWidth;
		var $deoh = $de.offsetHeight;
		$bv.style.width = $deow+'px';
		$bv.style.height = $deoh+'px';
	}
	
}



var XMLHttp =
{
	
	url : '',
	'options' :
	{
		XPath : '/*',
		method : 'GET'
	},
	containers : [],
	instances : []
}

//
// XML
//
if(Spry && Spry.Data && Spry.Data.XMLDataSet) { XMLHttp.ds = new Spry.Data.XMLDataSet(null, '/*'); }

//
// preloadImg
//
XMLHttp.preloadImg = {}
XMLHttp.preloadImg.text = 'Loading';
XMLHttp.preloadImg.abortText = 'Abort';
XMLHttp.preloadImg.img = new Image();
XMLHttp.preloadImg.img.src = 'http://sichnevyj.com/img/preload.img.gif';

XMLHttp.load = function($url, $options)
{
	
	/*try
	{*/
		
		var $this = this;
		if(!$options) { $options = {}; }
		if(typeof($options.loadXMLDS)!='boolean') { $options.loadXMLDS = true; }
		if(typeof($options.xml)!='boolean') { $options.xml = $options.loadXMLDS; }
		if(typeof($options.container)=='string') { $options.container = document.getElementById($options.container); }
		if(!$options.container) { $options.container = this.container; }
		this.containers.push($options.container);
		
		if($options.xml)
		{
			
			var cb = function($el, $u)
			{
				//$el.style.display = 'block';
				if($options.callback) { $options.callback($el, $u); }
			}
			
			if($url) { this.url = $url; }
			for(var $option in $options)
			{
				if(!/\bloadXMLDS\b|\bpostData\b|\bcontainer\b/.exec($option))
				{ $this.options[$option] = $options[$option]; }
			}
			$this.ds.setURL(this.url, this.options);
			$this.ds.setXPath(this.options.XPath);
			this.options.callback = cb;
			$this.ds.loadData();
		}
		else
		{
			
			//
			// show/place preload img
			//
			var $instanceIndex = this.instances.length;
			if(!$options.withoutPreloadImg)
			{
				this.createPreloadImg($instanceIndex);
				Spry.Widget.Utils.addEventListener(window, 'resize', this.placePreloadImg, true);
			}
			
			if(typeof($options.async)!='boolean') { $options.async = true; }
			var $post = $options.postData || $options.post;
			var $postData = '';
			if(typeof($post)=='object')
			{
				var $str = [];
				for(var $key in $post)
				{
					$str.push($key+'='+$post[$key]);
				}
				var $postData = $str.join('&');
			}
			else if(typeof($post)=='string') { var $postData = $post; }
			var $opts =
			{
				postData : $postData,
				headers : {'Content-Type':'application/x-www-form-urlencoded'}
			}
			
			//
			// callback
			//
			var cb = function($req)
			{
				
				XMLHttp.instances.splice($instanceIndex, 1);
				if(!$options.withoutPreloadImg) { XMLHttp.hidePreloadImg(); }
				if($options.container) { Spry.Utils.setInnerHTML($options.container, $req.xhRequest.responseText); }
				if($options.callback) { $options.callback($options.container, $req.url); }
				
				//
				// set container disappear timeout
				//
				if($options.hideContainer)
				{
					setTimeout
					(
						function() { $options.container.style.display = 'none'; }
						, $options.hideContainerTimeout
					);
				}
				
			}
			
			//
			// request
			//
			var $req = Spry.Utils.loadURL('POST', $url, $options.async, cb, $opts);
			$req.xhRequest.onreadystatechange = function()
			{
				switch($req.xhRequest.readyState)
				{
					case 4:
						XMLHttp.instances.splice($instanceIndex, 1);
						if(!$options.withoutPreloadImg) { XMLHttp.hidePreloadImg(); }
						if(!$req.xhRequest.responseText) { return; }
						if($req.xhRequest.status==200 || $req.xhRequest.status==0) { cb($req); }
						break;
				}
			}
			this.instances.push($req);
			
			return $req;
			
		}
		return $url;
	/*}
	catch($e) { Debuger.output($e); }*/
	
}


XMLHttp.abort = function($index)
{
	
	this.instances[$index].xhRequest.abort();
	this.instances.splice($index, 1);
	this.hidePreloadImg();
	
}

XMLHttp.loadNonXML = function($url, $container, $post, $options)
{
	
	if(!$options) { var $options = {}; }
	$options.container = $container;
	$options.xml = false;
	$options.post = $post;
	return this.load($url, $options);
	
}


XMLHttp.toArray = function($node, $return)
{
	
	try
	{
		for($i=0; $i<($x=$node.childNodes).length; $i++)
		{ $return[$x[$i].nodeName]['%count']++; }
		return $return;
	} // try
	catch($e) { Debuger.output($e); }
	
}

XMLHttp.createPreloadImg = function($instanceIndex)
{
	
	//
	// destroy first, if required
	//
	if(document.getElementById('XMLHttpPreloadImg')) { this.hidePreloadImg(); }
	
	//
	// now create
	//
	var $de = document.documentElement;
	var $pimgbv = Node.createDiv({attrs:{id:'XMLHttpPreloadImgBlackVeil','class':'BlackVeil'}});
	var $pimgb = Node.createDiv({attrs:{id:'XMLHttpPreloadImgBorder','class':'XMLHttpPreloadImgBorder'}});
	var $pimg = Node.createDiv({attrs:{id:'XMLHttpPreloadImg','class':'XMLHttpPreloadImg'}});
	var $pimgbv = Node.insert($pimgbv, document.body);
	var $pimgb = Node.insert($pimgb, document.body);
	var $pimg = Node.insert($pimg, document.body);
	var $img = '<img src="'+this.preloadImg.img.src+'" border="0" alt="XMLHttp preload image" />';
	var $abortBtn = '<a href="javascript:void(null)"';
	$abortBtn += ' onclick="XMLHttp.abort('+$instanceIndex+')"';
	$abortBtn += '>'+this.preloadImg.abortText+'</a>';
	var $table = Node.createTable({trs:[[$img,this.preloadImg.text,$abortBtn]], node:$pimg, attrs:{cellpadding:2}});
	
	//
	// place engine
	//
	this.placePreloadImg();
	
}

XMLHttp.placePreloadImg = function()
{
	
	//
	// elements
	//
	var $de = document.documentElement;
	var $pimgbv = document.getElementById('XMLHttpPreloadImgBlackVeil');
	var $pimgb = document.getElementById('XMLHttpPreloadImgBorder');
	var $pimg = document.getElementById('XMLHttpPreloadImg');
	
	//
	// place engine
	//
	$pimgbv.style.width = $de.offsetWidth+'px';
	$pimgbv.style.height = $de.offsetHeight+'px';
	$pimg.style.left = (($de.offsetWidth-$pimg.offsetWidth)/2)+'px';
	$pimg.style.top = (($de.offsetHeight-$pimg.offsetHeight)/2)+'px';
	$pimgb.style.left = $pimg.offsetLeft-10+'px';
	$pimgb.style.top = $pimg.offsetTop-10+'px';
	$pimgb.style.width = $pimg.offsetWidth+20+'px';
	$pimgb.style.height = $pimg.offsetHeight+20+'px';
	
}

XMLHttp.hidePreloadImg = function()
{
	
	//
	// remove window.onresize event listener
	//
	Spry.Widget.Utils.removeEventListener(window, 'resize', this.placePreloadImg, true);
	
	//
	// variables
	//
	var $pimgbv = document.getElementById('XMLHttpPreloadImgBlackVeil');
	var $pimgb = document.getElementById('XMLHttpPreloadImgBorder');
	var $pimg = document.getElementById('XMLHttpPreloadImg');
	
	//
	// destroy
	//
	Node.remove($pimgbv);
	Node.remove($pimgb);
	Node.remove($pimg);
	
}/*
Copyright (c) 2006 Yahoo! Inc. All rights reserved.
version 0.9.0
*/

/**
 * @class The Yahoo global namespace
 */
var YAHOO = function() {

    return {

        /**
         * Yahoo presentation platform utils namespace
         */
        util: {},

        /**
         * Yahoo presentation platform widgets namespace
         */
        widget: {},

        /**
         * Yahoo presentation platform examples namespace
         */
        example: {},

        /**
         * Returns the namespace specified and creates it if it doesn't exist
         *
         * YAHOO.namespace("property.package");
         * YAHOO.namespace("YAHOO.property.package");
         *
         * Either of the above would create YAHOO.property, then
         * YAHOO.property.package
         *
         * @param  {String} sNameSpace String representation of the desired
         *                             namespace
         * @return {Object}            A reference to the namespace object
         */
        namespace: function( sNameSpace ) {

            if (!sNameSpace || !sNameSpace.length) {
                return null;
            }

            var levels = sNameSpace.split(".");

            var currentNS = YAHOO;

            // YAHOO is implied, so it is ignored if it is included
            for (var i=(levels[0] == "YAHOO") ? 1 : 0; i<levels.length; ++i) {
                currentNS[levels[i]] = currentNS[levels[i]] || {};
                currentNS = currentNS[levels[i]];
            }

            return currentNS;

        }
    };

} ();

/*
Copyright (c) 2006 Yahoo! Inc. All rights reserved.
version 0.9.0
*/

/**
 * @class Provides helper methods for DOM elements.
 */
YAHOO.util.Dom = new function() {

   /**
    * Returns an HTMLElement reference
    * @param {String | HTMLElement} Accepts either a string to use as an ID for getting a DOM reference, or an actual DOM reference.
    * @return {HTMLElement} A DOM reference to an HTML element.
    */
   this.get = function(el) {
      if (typeof el == 'string') { // accept object or id
         el = document.getElementById(el);
      }

      return el;
   };

   /**
    * Normalizes currentStyle and ComputedStyle.
    * @param {String | HTMLElement} Accepts either a string to use as an ID for getting a DOM reference, or an actual DOM reference.
    * @param {String} property The style property whose value is returned.
    * @return {String} The current value of the style property.
    */
   this.getStyle = function(el, property) {
      var value = null;
      var dv = document.defaultView;

      el = this.get(el);

      if (property == 'opacity' && el.filters) {// IE opacity
         value = 1;
         try {
            value = el.filters.item('DXImageTransform.Microsoft.Alpha').opacity / 100;
         } catch(e) {
            try {
               value = el.filters.item('alpha').opacity / 100;
            } catch(e) {}
         }
      }
      else if (el.style[property]) {
         value = el.style[property];
      }
      else if (el.currentStyle && el.currentStyle[property]) {
         value = el.currentStyle[property];
      }
      else if ( dv && dv.getComputedStyle )
      {  // convert camelCase to hyphen-case

         var converted = '';
         for(i = 0, len = property.length;i < len; ++i) {
            if (property.charAt(i) == property.charAt(i).toUpperCase()) {
               converted = converted + '-' + property.charAt(i).toLowerCase();
            } else {
               converted = converted + property.charAt(i);
            }
         }

         if (dv.getComputedStyle(el, '').getPropertyValue(converted)) {
            value = dv.getComputedStyle(el, '').getPropertyValue(converted);
         }
      }

      return value;
   };

   /**
    * Wrapper for setting style properties of HTMLElements.  Normalizes "opacity" across modern browsers.
    * @param {String | HTMLElement} Accepts either a string to use as an ID for getting a DOM reference, or an actual DOM reference.
    * @param {String} property The style property to be set.
    * @param {String} val The value to apply to the given property.
    */
   this.setStyle = function(el, property, val) {
      el = this.get(el);
      switch(property) {
         case 'opacity' :
            if (el.filters) {
               el.style.filter = 'alpha(opacity=' + val * 100 + ')';

               if (!el.currentStyle.hasLayout) {
                  el.style.zoom = 1;
               }
            } else {
               el.style.opacity = val;
               el.style['-moz-opacity'] = val;
               el.style['-khtml-opacity'] = val;
            }
            break;
         default :
            el.style[property] = val;
      }
   };

   /**
    * Gets the current position of an element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
    * @param {String | HTMLElement} Accepts either a string to use as an ID for getting a DOM reference, or an actual DOM reference.
    */
   this.getXY = function(el) {
      el = this.get(el);

      // has to be part of document to have pageXY
      if (el.parentNode === null || this.getStyle(el, 'display') == 'none') {
         return false;
      }

      /**
       * Position of the html element (x, y)
       * @private
       * @type Array
       */
      var parent = null;
      var pos = [];
      var box;

      if (el.getBoundingClientRect) { // IE
         box = el.getBoundingClientRect();
         var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
         var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;

         return [box.left + scrollLeft, box.top + scrollTop];
      }
      else if (document.getBoxObjectFor) { // gecko
         box = document.getBoxObjectFor(el);
         pos = [box.x, box.y];
      }
      else { // safari/opera
         pos = [el.offsetLeft, el.offsetTop];
         parent = el.offsetParent;
         if (parent != el) {
            while (parent) {
               pos[0] += parent.offsetLeft;
               pos[1] += parent.offsetTop;
               parent = parent.offsetParent;
            }
         }

         // opera & (safari absolute) incorrectly account for body offsetTop
         var ua = navigator.userAgent.toLowerCase();
         if (
            ua.indexOf('opera') != -1
            || ( ua.indexOf('safari') != -1 && this.getStyle(el, 'position') == 'absolute' )
         ) {
            pos[1] -= document.body.offsetTop;
         }
      }

      if (el.parentNode) { parent = el.parentNode; }
      else { parent = null; }

      while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') {
         pos[0] -= parent.scrollLeft;
         pos[1] -= parent.scrollTop;

         if (parent.parentNode) { parent = parent.parentNode; }
         else { parent = null; }
      }

      return pos;
   };

   /**
    * Gets the current X position of an element based on page coordinates.  The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
    * @param {String | HTMLElement} Accepts either a string to use as an ID for getting a DOM reference, or an actual DOM reference.
    */
   this.getX = function(el) {
      return this.getXY(el)[0];
   };

   /**
    * Gets the current Y position of an element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
    * @param {String | HTMLElement} Accepts either a string to use as an ID for getting a DOM reference, or an actual DOM reference.
    */
   this.getY = function(el) {
      return this.getXY(el)[1];
   };

   /**
    * Set the position of an html element in page coordinates, regardless of how the element is positioned.
    * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
    * @param {String | HTMLElement} Accepts either a string to use as an ID for getting a DOM reference, or an actual DOM reference.
    * @param {array} pos Contains X & Y values for new position (coordinates are page-based)
    */
   this.setXY = function(el, pos, noRetry) {
      el = this.get(el);
      var pageXY = YAHOO.util.Dom.getXY(el);
      if (pageXY === false) { return false; } // has to be part of doc to have pageXY

      if (this.getStyle(el, 'position') == 'static') { // default to relative
         this.setStyle(el, 'position', 'relative');
      }

      var delta = [
         parseInt( YAHOO.util.Dom.getStyle(el, 'left'), 10 ),
         parseInt( YAHOO.util.Dom.getStyle(el, 'top'), 10 )
      ];

      if ( isNaN(delta[0]) ) { delta[0] = 0; } // defalts to 'auto'
      if ( isNaN(delta[1]) ) { delta[1] = 0; }

      if (pos[0] !== null) { el.style.left = pos[0] - pageXY[0] + delta[0] + 'px'; }
      if (pos[1] !== null) { el.style.top = pos[1] - pageXY[1] + delta[1] + 'px'; }

      var newXY = this.getXY(el);

      // if retry is true, try one more time if we miss
      if (!noRetry && (newXY[0] != pos[0] || newXY[1] != pos[1]) ) {
         this.setXY(el, pos, true);
      }

      return true;
   };

   /**
    * Set the X position of an html element in page coordinates, regardless of how the element is positioned.
    * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
    * @param {String | HTMLElement} Accepts either a string to use as an ID for getting a DOM reference, or an actual DOM reference.
    * @param {Int} x to use as the X coordinate.
    */
   this.setX = function(el, x) {
      return this.setXY(el, [x, null]);
   };

   /**
    * Set the Y position of an html element in page coordinates, regardless of how the element is positioned.
    * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
    * @param {String | HTMLElement} Accepts either a string to use as an ID for getting a DOM reference, or an actual DOM reference.
    * @param {Int} Value to use as the Y coordinate.
    */
   this.setY = function(el, y) {
      return this.setXY(el, [null, y]);
   };

   /**
    * Returns the region position of the given element.
    * The element must be part of the DOM tree to have a region (display:none or elements not appended return false).
    * @param {String | HTMLElement} Accepts either a string to use as an ID for getting a DOM reference, or an actual DOM reference.
    * @return {Region} A Region instance containing "top, left, bottom, right" member data.
    */
   this.getRegion = function(el) {
      el = this.get(el);
      return new YAHOO.util.Region.getRegion(el);
   };

   /**
    * Returns the width of the client (viewport).
    * @return {Int} The width of the viewable area of the page.
    */
   this.getClientWidth = function() {
      return (
         document.documentElement.offsetWidth
         || document.body.offsetWidth
      );
   };

   /**
    * Returns the height of the client (viewport).
    * @return {Int} The height of the viewable area of the page.
    */
   this.getClientHeight = function() {
      return (
         self.innerHeight
         || document.documentElement.clientHeight
         || document.body.clientHeight
      );
   };
};

/**
 * @class A region is a representation of an object on a grid.  It is defined
 * by the top, right, bottom, left extents, so is rectangular by default.  If
 * other shapes are required, this class could be extended to support it.
 *
 * @param {int} t the top extent
 * @param {int} r the right extent
 * @param {int} b the bottom extent
 * @param {int} l the left extent
 * @constructor
 */
YAHOO.util.Region = function(t, r, b, l) {

    /**
     * The region's top extent
     * @type int
     */
    this.top = t;

    /**
     * The region's right extent
     * @type int
     */
    this.right = r;

    /**
     * The region's bottom extent
     * @type int
     */
    this.bottom = b;

    /**
     * The region's left extent
     * @type int
     */
    this.left = l;
};

/**
 * Returns true if this region contains the region passed in
 *
 * @param  {Region}  region The region to evaluate
 * @return {boolean}        True if the region is contained with this region,
 *                          else false
 */
YAHOO.util.Region.prototype.contains = function(region) {
    return ( region.left   >= this.left   &&
             region.right  <= this.right  &&
             region.top    >= this.top    &&
             region.bottom <= this.bottom    );
};

/**
 * Returns the area of the region
 *
 * @return {int} the region's area
 */
YAHOO.util.Region.prototype.getArea = function() {
    return ( (this.bottom - this.top) * (this.right - this.left) );
};

/**
 * Returns the region where the passed in region overlaps with this one
 *
 * @param  {Region} region The region that intersects
 * @return {Region}        The overlap region, or null if there is no overlap
 */
YAHOO.util.Region.prototype.intersect = function(region) {
    var t = Math.max( this.top,    region.top    );
    var r = Math.min( this.right,  region.right  );
    var b = Math.min( this.bottom, region.bottom );
    var l = Math.max( this.left,   region.left   );

    if (b >= t && r >= l) {
        return new YAHOO.util.Region(t, r, b, l);
    } else {
        return null;
    }
};

/**
 * Returns the region representing the smallest region that can contain both
 * the passed in region and this region.
 *
 * @param  {Region} region The region that to create the union with
 * @return {Region}        The union region
 */
YAHOO.util.Region.prototype.union = function(region) {
    var t = Math.min( this.top,    region.top    );
    var r = Math.max( this.right,  region.right  );
    var b = Math.max( this.bottom, region.bottom );
    var l = Math.min( this.left,   region.left   );

    return new YAHOO.util.Region(t, r, b, l);
};

/**
 * toString
 * @return string the region properties
 */
YAHOO.util.Region.prototype.toString = function() {
    return ( "Region {" +
             "  t: "    + this.top    +
             ", r: "    + this.right  +
             ", b: "    + this.bottom +
             ", l: "    + this.left   +
             "}" );
}

/**
 * Returns a region that is occupied by the DOM element
 *
 * @param  {HTMLElement} el The element
 * @return {Region}         The region that the element occupies
 * @static
 */
YAHOO.util.Region.getRegion = function(el) {
    var p = YAHOO.util.Dom.getXY(el);

    var t = p[1];
    var r = p[0] + el.offsetWidth;
    var b = p[1] + el.offsetHeight;
    var l = p[0];

    return new YAHOO.util.Region(t, r, b, l);
};

/////////////////////////////////////////////////////////////////////////////


/**
 * @class
 *
 * A point is a region that is special in that it represents a single point on
 * the grid.
 *
 * @param {int} x The X position of the point
 * @param {int} y The Y position of the point
 * @constructor
 * @extends Region
 */
YAHOO.util.Point = function(x, y) {
    /**
     * The X position of the point
     * @type int
     */
    this.x      = x;

    /**
     * The Y position of the point
     * @type int
     */
    this.y      = y;

    this.top    = y;
    this.right  = x;
    this.bottom = y;
    this.left   = x;
};

YAHOO.util.Point.prototype = new YAHOO.util.Region();
/*
Copyright (c) 2006 Yahoo! Inc. All rights reserved.
version 0.9.0
*/

/**
 * @class The CustomEvent class lets you define events for your application
 * that can be subscribed to by one or more independent component.
 * @param {String} type The type of event, which is passed to the callback
 *                 when the event fires
 * @param {Object} oScope The context the event will fire from.  "this" will
 *                 refer to this object in the callback.  Default value:
 *                 the window object.  The listener can override this.
 * @constructor
 */
YAHOO.util.CustomEvent = function(type, oScope) {
    /**
     * The type of event, returned to subscribers when the event fires
     * @type string
     */
    this.type = type;

    /**
     * The scope the the event will fire from.  Defaults to the window obj
     * @type object
     */
    this.scope = oScope || window;

    /**
     * The subscribers to this event
     * @type array
     */
    this.subscribers = [];

    // Register with the event utility for automatic cleanup.  Made optional
    // so that CustomEvent can be used independently of pe.event
    if (YAHOO.util["Event"]) {
        YAHOO.util.Event.regCE(this);
    }
};

YAHOO.util.CustomEvent.prototype = {
    /**
     * Subscribes the caller to this event
     * @param {Function} fn       The function to execute
     * @param {Object}   obj      An object to be passed along when the event fires
     * @param {boolean}  bOverride If true, the obj passed in becomes the execution
     *                            scope of the listener
     */
    subscribe: function(fn, obj, bOverride) {
        this.subscribers.push( new YAHOO.util.Subscriber(fn, obj, bOverride) );
    },

    /**
     * Unsubscribes the caller from this event
     * @param {Function} fn  The function to execute
     * @param {Object}   obj An object to be passed along when the event fires
     * @return {boolean} True if the subscriber was found and detached.
     */
    unsubscribe: function(fn, obj) {
        var found = false;
        for (var i=0; i<this.subscribers.length; ++i) {
            var s = this.subscribers[i];
            if (s && s.contains(fn, obj)) {
                this._delete(i);
                found = true;
            }
        }

        return found;
    },

    /**
     * Notifies the subscribers.  The callback functions will be executed
     * from the scope specified when the event was created, and with the following
     * parameters:
     *   <pre>
     *   - The type of event
     *   - All of the arguments fire() was executed with as an array
     *   - The custom object (if any) that was passed into the subscribe() method
     *   </pre>
     *
     * @param {Array} an arbitrary set of parameters to pass to the handler
     */
    fire: function() {
        for (var i=0; i<this.subscribers.length; ++i) {
            var s = this.subscribers[i];
            if (s) {
                var scope = (s.override) ? s.obj : this.scope;
                s.fn.call(scope, this.type, arguments, s.obj);
            }
        }
    },

    /**
     * Removes all listeners
     */
    unsubscribeAll: function() {
        for (var i=0; i<this.subscribers.length; ++i) {
            this._delete(i);
        }
    },

    /**
     * @private
     */
    _delete: function(index) {
        var s = this.subscribers[index];
        if (s) {
            delete s.fn;
            delete s.obj;
        }

        delete this.subscribers[index];
    }
};

/////////////////////////////////////////////////////////////////////

/**
 * @class
 * @param {Function} fn       The function to execute
 * @param {Object}   obj      An object to be passed along when the event fires
 * @param {boolean}  bOverride If true, the obj passed in becomes the execution
 *                            scope of the listener
 * @constructor
 */
YAHOO.util.Subscriber = function(fn, obj, bOverride) {
    /**
     * The callback that will be execute when the event fires
     * @type function
     */
    this.fn = fn;

    /**
     * An optional custom object that will passed to the callback when
     * the event fires
     * @type object
     */
    this.obj = obj || null;

    /**
     * The default execution scope for the event listener is defined when the
     * event is created (usually the object which contains the event).
     * By setting override to true, the execution scope becomes the custom
     * object passed in by the subscriber
     * @type boolean
     */
    this.override = (bOverride);
};

/**
 * Returns true if the fn and obj match this objects properties.
 * Used by the unsubscribe method to match the right subscriber.
 *
 * @param {Function} fn the function to execute
 * @param {Object} obj an object to be passed along when the event fires
 * @return {boolean} true if the supplied arguments match this
 *                   subscriber's signature.
 */
YAHOO.util.Subscriber.prototype.contains = function(fn, obj) {
    return (this.fn == fn && this.obj == obj);
};

/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

// Only load this library once.  If it is loaded a second time, existing
// events cannot be detached.
if (!YAHOO.util.Event) {

/**
 * The event utility provides functions to add and remove event listeners,
 * event cleansing.  It also tries to automatically remove listeners it
 * registers during the unload event.
 * @class
 * @constructor
 */
    YAHOO.util.Event = function() {

        /**
         * True after the onload event has fired
         * @type boolean
         * @private
         */
        var loadComplete =  false;

        /**
         * Cache of wrapped listeners
         * @type array
         * @private
         */
        var listeners = [];

        /**
         * Listeners that will be attached during the onload event
         * @type array
         * @private
         */
        var delayedListeners = [];

        /**
         * User-defined unload function that will be fired before all events
         * are detached
         * @type array
         * @private
         */
        var unloadListeners = [];

        /**
         * Cache of the custom events that have been defined.  Used for
         * automatic cleanup
         * @type array
         * @private
         */
        var customEvents = [];

        /**
         * Cache of DOM0 event handlers to work around issues with DOM2 events
         * in Safari
         * @private
         */
        var legacyEvents = [];

        /**
         * Listener stack for DOM0 events
         * @private
         */
        var legacyHandlers = [];

        return { // PREPROCESS

            /**
             * Element to bind, int constant
             * @type int
             */
            EL: 0,

            /**
             * Type of event, int constant
             * @type int
             */
            TYPE: 1,

            /**
             * Function to execute, int constant
             * @type int
             */
            FN: 2,

            /**
             * Function wrapped for scope correction and cleanup, int constant
             * @type int
             */
            WFN: 3,

            /**
             * Object passed in by the user that will be returned as a
             * parameter to the callback, int constant
             * @type int
             */
            SCOPE: 3,

            /**
             * Adjusted scope, either the element we are registering the event
             * on or the custom object passed in by the listener, int constant
             * @type int
             */
            ADJ_SCOPE: 4,

            /**
             * Safari detection is necessary to work around the preventDefault
             * bug that makes it so you can't cancel a href click from the
             * handler.  There is not a capabilities check we can use here.
             * @private
             */
            isSafari: (navigator.userAgent.match(/safari/gi)),

            /**
             * @private
             * IE detection needed to properly calculate pageX and pageY.
             * capabilities checking didn't seem to work because another
             * browser that does not provide the properties have the values
             * calculated in a different manner than IE.
             */
            isIE: (!this.isSafari && navigator.userAgent.match(/msie/gi)),

            /**
             * Appends an event handler
             *
             * @param {Object}   el        The html element to assign the
             *                             event to
             * @param {String}   sType     The type of event to append
             * @param {Function} fn        The method the event invokes
             * @param {Object}   oScope    An arbitrary object that will be
             *                             passed as a parameter to the handler
             * @param {boolean}  bOverride If true, the obj passed in becomes
             *                             the execution scope of the listener
             * @return {boolean} True if the action was successful or defered,
             *                        false if one or more of the elements
             *                        could not have the event bound to it.
             */
            addListener: function(el, sType, fn, oScope, bOverride) {

                // The el argument can be an array of elements or element ids.
                if ( this._isValidCollection(el)) {
                    var ok = true;
                    for (var i=0; i< el.length; ++i) {
                        ok = ( this.on(el[i],
                                       sType,
                                       fn,
                                       oScope,
                                       bOverride) && ok );
                    }
                    return ok;

                } else if (typeof el == "string") {
                    // If the el argument is a string, we assume it is
                    // actually the id of the element.  If the page is loaded
                    // we convert el to the actual element, otherwise we
                    // defer attaching the event until onload event fires

                    // check to see if we need to delay hooking up the event
                    // until after the page loads.
                    if (loadComplete) {
                        el = this.getEl(el);
                    } else {
                        // defer adding the event until onload fires
                        delayedListeners[delayedListeners.length] =
                            [el, sType, fn, oScope, bOverride];

                        return true;
                    }
                }

                // Element should be an html element or an array if we get
                // here.
                if (!el) {
                    return false;
                }

                // we need to make sure we fire registered unload events
                // prior to automatically unhooking them.  So we hang on to
                // these instead of attaching them to the window and fire the
                // handles explicitly during our one unload event.
                if ("unload" == sType && oScope !== this) {
                    unloadListeners[unloadListeners.length] =
                            [el, sType, fn, oScope, bOverride];
                    return true;
                }


                // if the user chooses to override the scope, we use the custom
                // object passed in, otherwise the executing scope will be the
                // HTML element that the event is registered on
                var scope = (bOverride) ? oScope : el;

                // wrap the function so we can return the oScope object when
                // the event fires;
                var wrappedFn = function(e) {
                        return fn.call(scope, YAHOO.util.Event.getEvent(e),
                                oScope);
                    };

                var li = [el, sType, fn, wrappedFn, scope];
                var index = listeners.length;
                // cache the listener so we can try to automatically unload
                listeners[index] = li;

                if (this.useLegacyEvent(el, sType)) {
                    var legacyIndex = this.getLegacyIndex(el, sType);
                    if (legacyIndex == -1) {

                        legacyIndex = legacyEvents.length;
                        // cache the signature for the DOM0 event, and
                        // include the existing handler for the event, if any
                        legacyEvents[legacyIndex] =
                            [el, sType, el["on" + sType]];
                        legacyHandlers[legacyIndex] = [];

                        el["on" + sType] =
                            function(e) {
                                YAHOO.util.Event.fireLegacyEvent(
                                    YAHOO.util.Event.getEvent(e), legacyIndex);
                            };
                    }

                    // add a reference to the wrapped listener to our custom
                    // stack of events
                    legacyHandlers[legacyIndex].push(index);

                // DOM2 Event model
                } else if (el.addEventListener) {
                    el.addEventListener(sType, wrappedFn, false);
                // Internet Explorer abstraction
                } else if (el.attachEvent) {
                    el.attachEvent("on" + sType, wrappedFn);
                }

                return true;

            },

            /**
             * Shorthand for YAHOO.util.Event.addListener
             * @type function
             */
            // on: this.addListener,

            /**
             * When using legacy events, the handler is routed to this object
             * so we can fire our custom listener stack.
             * @private
             */
            fireLegacyEvent: function(e, legacyIndex) {
                // alert("fireLegacyEvent " + legacyIndex);
                var ok = true;

                // var el = legacyEvents[YAHOO.util.Event.EL];

                /* this is not working because the property may get populated
                // fire the event we replaced, if it exists
                var origHandler = legacyEvents[2];
                alert(origHandler);
                if (origHandler && origHandler.call) {
                    var ret = origHandler.call(el, e);
                    ok = (ret);
                }
                */

                var le = legacyHandlers[legacyIndex];
                for (i=0; i < le.length; ++i) {
                    var index = le[i];
                    // alert(index);
                    if (index) {
                        var li = listeners[index];
                        var scope = li[this.ADJ_SCOPE];
                        var ret = li[this.WFN].call(scope, e);
                        ok = (ok && ret);
                        // alert(ok);
                    }
                }

                return ok;
            },

            /**
             * Returns the legacy event index that matches the supplied
             * signature
             * @private
             */
            getLegacyIndex: function(el, sType) {
                for (var i=0; i < legacyEvents.length; ++i) {
                    var le = legacyEvents[i];
                    if (le && le[0] == el && le[1] == sType) {
                        return i;
                    }
                }

                return -1;
            },

            /**
             * Logic that determines when we should automatically use legacy
             * events instead of DOM2 events.
             * @private
             */
            useLegacyEvent: function(el, sType) {

                return ( (!el.addEventListener && !el.attachEvent) ||
                                (sType == "click" && this.isSafari) );
            },

            /**
             * Removes an event handler
             *
             * @param {Object} el the html element or the id of the element to
             * assign the event to.
             * @param {String} sType the type of event to remove
             * @param {Function} fn the method the event invokes
             * @return {boolean} true if the unbind was successful, false
             * otherwise
             */
            removeListener: function(el, sType, fn) {

                // The el argument can be a string
                if (typeof el == "string") {
                    el = this.getEl(el);
                // The el argument can be an array of elements or element ids.
                } else if ( this._isValidCollection(el)) {
                    var ok = true;
                    for (var i=0; i< el.length; ++i) {
                        ok = ( this.removeListener(el[i], sType, fn) && ok );
                    }
                    return ok;
                }

                var cacheItem = null;
                var index = this._getCacheIndex(el, sType, fn);

                if (index >= 0) {
                    cacheItem = listeners[index];
                }

                if (!el || !cacheItem) {
                    return false;
                }


                if (el.removeEventListener) {
                    el.removeEventListener(sType, cacheItem[this.WFN], false);
                    // alert("adsf");
                } else if (el.detachEvent) {
                    el.detachEvent("on" + sType, cacheItem[this.WFN]);
                }

                // removed the wrapped handler
                delete listeners[index][this.WFN];
                delete listeners[index][this.FN];
                delete listeners[index];

                return true;

            },

            /**
             * Returns the event's target element
             * @param {Event} ev the event
             * @param {boolean} resolveTextNode when set to true the target's
             *                  parent will be returned if the target is a
             *                  text node
             * @return {HTMLElement} the event's target
             */
            getTarget: function(ev, resolveTextNode) {
                var t = ev.target || ev.srcElement;

                if (resolveTextNode && t && "#text" == t.nodeName) {
                    return t.parentNode;
                } else {
                    return t;
                }
            },

            /**
             * Returns the event's pageX
             * @param {Event} ev the event
             * @return {int} the event's pageX
             */
            getPageX: function(ev) {
                var x = ev.pageX;
                if (!x && 0 !== x) {
                    x = ev.clientX || 0;

                    if ( this.isIE ) {
                        x += this._getScrollLeft();
                    }
                }

                return x;
            },

            /**
             * Returns the event's pageY
             * @param {Event} ev the event
             * @return {int} the event's pageY
             */
            getPageY: function(ev) {
                var y = ev.pageY;
                if (!y && 0 !== y) {
                    y = ev.clientY || 0;

                    if ( this.isIE ) {
                        y += this._getScrollTop();
                    }
                }

                return y;
            },

            /**
             * Returns the event's related target
             * @param {Event} ev the event
             * @return {HTMLElement} the event's relatedTarget
             */
            getRelatedTarget: function(ev) {
                var t = ev.relatedTarget;
                if (!t) {
                    if (ev.type == "mouseout") {
                        t = ev.toElement;
                    } else if (ev.type == "mouseover") {
                        t = ev.fromElement;
                    }
                }

                return t;
            },

            /**
             * Returns the time of the event.  If the time is not included, the
             * event is modified using the current time.
             * @param {Event} ev the event
             * @return {Date} the time of the event
             */
            getTime: function(ev) {
                if (!ev.time) {
                    var t = new Date().getTime();
                    try {
                        ev.time = t;
                    } catch(e) {
                        // can't set the time property
                        return t;
                    }
                }

                return ev.time;
            },

            /**
             * Convenience method for stopPropagation + preventDefault
             * @param {Event} ev the event
             */
            stopEvent: function(ev) {
                this.stopPropagation(ev);
                this.preventDefault(ev);
            },

            /**
             * Stops event propagation
             * @param {Event} ev the event
             */
            stopPropagation: function(ev) {
                if (ev.stopPropagation) {
                    ev.stopPropagation();
                } else {
                    ev.cancelBubble = true;
                }
            },

            /**
             * Prevents the default behavior of the event
             * @param {Event} ev the event
             */
            preventDefault: function(ev) {
                if (ev.preventDefault) {
                    ev.preventDefault();
                } else {
                    ev.returnValue = false;
                }
            },

            /**
             * Returns the event, should not be necessary for user to call
             * @param {Event} the event parameter from the handler
             * @return {Event} the event
             */
            getEvent: function(e) {
                var ev = e || window.event;

                if (!ev) {
                    var c = this.getEvent.caller;
                    while (c) {
                        ev = c.arguments[0];
                        if (ev && Event == ev.constructor) {
                            break;
                        }
                        c = c.caller;
                    }
                }

                return ev;
            },

            /**
             * Returns the charcode for an event
             * @param {Event} ev the event
             * @return {int} the event's charCode
             */
            getCharCode: function(ev) {
                return ev.charCode || (ev.type == "keypress") ? ev.keyCode : 0;
            },

            /**
             * @private
             * Locating the saved event handler data by function ref
             */
            _getCacheIndex: function(el, sType, fn) {
                for (var i=0; i< listeners.length; ++i) {
                    var li = listeners[i];
                    if ( li                 &&
                         li[this.FN] == fn  &&
                         li[this.EL] == el  &&
                         li[this.TYPE] == sType ) {
                        return i;
                    }
                }

                return -1;
            },

            /**
             * We want to be able to use getElementsByTagName as a collection
             * to attach a group of events to.  Unfortunately, different
             * browsers return different types of collections.  This function
             * tests to determine if the object is array-like.  It will also
             * fail if the object is an array, but is empty.
             * @param o the object to test
             * @return {boolean} true if the object is array-like and populated
             */
            _isValidCollection: function(o) {
                // alert(o.constructor.toString())
                // alert(typeof o)

                return ( o                    && // o is something
                         o.length             && // o is indexed
                         typeof o != "string" && // o is not a string
                         !o.tagName           && // o is not an HTML element
                         !o.alert             && // o is not a window
                         typeof o[0] != "undefined" );

            },

            /**
             * @private
             * DOM element cache
             */
            elCache: {},

            /**
             * We cache elements bound by id because when the unload event
             * fires, we can no longer use document.getElementById
             * @private
             */
            getEl: function(id) {
                /*
                // this is a problem when replaced via document.getElementById
                if (! this.elCache[id]) {
                    try {
                        var el = document.getElementById(id);
                        if (el) {
                            this.elCache[id] = el;
                        }
                    } catch (er) {
                    }
                }
                return this.elCache[id];
                */

                return document.getElementById(id);
            },

            /**
             * Clears the element cache
             */
            clearCache: function() {
                for (i in this.elCache) {
                    delete this.elCache[i];
                }
            },

            /**
             * Called by CustomEvent instances to provide a handle to the
             * event * that can be removed later on.  Should be package
             * protected.
             * @private
             */
            regCE: function(ce) {
                customEvents.push(ce);
            },

            /**
             * @private
             * hook up any deferred listeners
             */
            _load: function(e) {
                loadComplete = true;
            },

            /**
             * Polling function that runs before the onload event fires,
             * attempting * to attach to DOM Nodes as soon as they are
             * available
             * @private
             */
            _tryPreloadAttach: function() {

                // keep trying until after the page is loaded.  We need to
                // check the page load state prior to trying to bind the
                // elements so that we can be certain all elements have been
                // tested appropriately
                var tryAgain = !loadComplete;

                for (var i=0; i < delayedListeners.length; ++i) {
                    var d = delayedListeners[i];
                    // There may be a race condition here, so we need to
                    // verify the array element is usable.
                    if (d) {

                        // el will be null if document.getElementById did not
                        // work
                        var el = this.getEl(d[this.EL]);

                        if (el) {
                            this.on(el, d[this.TYPE], d[this.FN],
                                    d[this.SCOPE], d[this.ADJ_SCOPE]);
                            delete delayedListeners[i];
                        }
                    }
                }

                if (tryAgain) {
                    setTimeout("YAHOO.util.Event._tryPreloadAttach()", 50);
                }
            },

            /**
             * Removes all listeners registered by pe.event.  Called
             * automatically during the unload event.
             */
            _unload: function(e, me) {
                for (var i=0; i < unloadListeners.length; ++i) {
                    var l = unloadListeners[i];
                    if (l) {
                        var scope = (l[this.ADJ_SCOPE]) ? l[this.SCOPE]: window;
                        l[this.FN].call(scope, this.getEvent(e), l[this.SCOPE] );
                    }
                }

                if (listeners && listeners.length > 0) {
                    for (i = 0; i < listeners.length; ++i) {
                        l = listeners[i];
                        if (l) {
                            this.removeListener(l[this.EL], l[this.TYPE],
                                    l[this.FN]);
                        }
                    }

                    this.clearCache();
                }

                for (i = 0; i < customEvents.length; ++i) {
                    customEvents[i].unsubscribeAll();
                    delete customEvents[i];
                }

                for (i = 0; i < legacyEvents.length; ++i) {
                    // dereference the element
                    delete legacyEvents[i][0];
                    // delete the array item
                    delete legacyEvents[i];
                }
            },

            /**
             * Returns scrollLeft
             * @private
             */
            _getScrollLeft: function() {
                return this._getScroll()[1];
            },

            /**
             * Returns scrollTop
             * @private
             */
            _getScrollTop: function() {
                return this._getScroll()[0];
            },

            /**
             * Returns the scrollTop and scrollLeft.  Used to calculate the
             * pageX and pageY in Internet Explorer
             * @private
             */
            _getScroll: function() {
                var dd = document.documentElement; db = document.body;
                if (dd && dd.scrollTop) {
                    return [dd.scrollTop, dd.scrollLeft];
                } else if (db) {
                    return [db.scrollTop, db.scrollLeft];
                } else {
                    return [0, 0];
                }
            }
        };
    } ();

    YAHOO.util.Event.on = YAHOO.util.Event.addListener;

    if (document && document.body) {
        YAHOO.util.Event._load();
    } else {
        YAHOO.util.Event.on(window, "load", YAHOO.util.Event._load,
                YAHOO.util.Event, true);
    }

    YAHOO.util.Event.on(window, "unload", YAHOO.util.Event._unload,
                YAHOO.util.Event, true);

    YAHOO.util.Event._tryPreloadAttach();

}

/*
Copyright (c) 2006 Yahoo! Inc. All rights reserved.
version 0.9.0
*/

/**
 * @class Defines the interface and base operation of items that that can be
 * dragged or can be drop targets.  It was designed to be extended, overriding
 * the event handlers for startDrag, onDrag, onDragOver, onDragOut.
 * Up to three html elements can be associated with a DragDrop instance:
 * <ul>
 * <li>linked element: the element that is passed into the constructor.
 * This is the element which defines the boundaries for interaction with
 * other DragDrop objects.</li>
 * <li>handle element(s): The drag operation only occurs if the element that
 * was clicked matches a handle element.  By default this is the linked
 * element, but there are times that you will want only a portion of the
 * linked element to initiate the drag operation, and the setHandleElId()
 * method provides a way to define this.</li>
 * <li>drag element: this represents an the element that would be moved along
 * with the cursor during a drag operation.  By default, this is the linked
 * element itself as in {@link YAHOO.util.DD}.  setDragElId() lets you define
 * a separate element that would be moved, as in {@link YAHOO.util.DDProxy}
 * </li>
 * </ul>
 * This class should not be instantiated until the onload event to ensure that
 * the associated elements are available.
 * The following would define a DragDrop obj that would interact with any
 * other * DragDrop obj in the "group1" group:
 * <pre>
 *  dd = new YAHOO.util.DragDrop("div1", "group1");
 * </pre>
 * Since none of the event handlers have been implemented, nothing would
 * actually happen if you were to run the code above.  Normally you would
 * override this class or one of the default implementations, but you can
 * also override the methods you want on an instance of the class...
 * <pre>
 *  dd.onDragDrop = function(e, id) {
 *   alert("dd was dropped on " + id);
 *  }
 * </pre>
 * @constructor
 * @param {String} id of the element that is linked to this instance
 * @param {String} sGroup the group of related DragDrop objects
 */
YAHOO.util.DragDrop = function(id, sGroup) {
    if (id) {
        this.init(id, sGroup);
    }
};

YAHOO.util.DragDrop.prototype = {

    /**
     * The id of the element associated with this object.  This is what we
     * refer to as the "linked element" because the size and position of
     * this element is used to determine when the drag and drop objects have
     * interacted.
     *
     * @type String
     */
    id: null,

    /**
     * The id of the element that will be dragged.  By default this is same
     * as the linked element , but could be changed to another element. Ex:
     * YAHOO.util.DDProxy
     *
     * @type String
     * @private
     */
    dragElId: null,

    /**
     * the id of the element that initiates the drag operation.  By default
     * this is the linked element, but could be changed to be a child of this
     * element.  This lets us do things like only starting the drag when the
     * header element within the linked html element is clicked.
     *
     * @type String
     * @private
     */
    handleElId: null,

    /**
     * An array of HTML tags that will be ignored if clicked.
     */
    invalidHandleTypes: null,

    /**
     * The linked element's absolute X position at the time the drag was
     * started
     *
     * @type int
     * @private
     */
    startPageX: 0,

    /**
     * The linked element's absolute X position at the time the drag was
     * started
     *
     * @type int
     * @private
     */
    startPageY: 0,

    /**
     * The group defines a logical collection of DragDrop objects that are
     * related.  Instances only get events when interacting with other
     * DragDrop object in the same group.  This lets us define multiple
     * groups using a single DragDrop subclass if we want.
     *
     */
    groups: null,

    /**
     * Individual drag/drop instances can be locked.  This will prevent
     * onmousedown start drag.
     *
     * @type boolean
     * @private
     */
    locked: false,

    /**
     * Lock this instance
     */
    lock: function() { this.locked = true; },

    /**
     * Unlock this instace
     */
    unlock: function() { this.locked = false; },

    /**
     * By default, all insances can be a drop target.  This can be disabled by
     * setting isTarget to false.
     *
     * @type boolean
     */
    isTarget: true,

    /**
     * The padding configured for this drag and drop object for calculating
     * the drop zone intersection with this object.
     */
    padding: null,

    /**
     * @private
     */
    _domRef: null,

    /**
     * Internal typeof flag
     * @private
     */
    __ygDragDrop: true,

    /**
     * Set to true when horizontal contraints are applied
     *
     * @type boolean
     * @private
     */
    constrainX: false,

    /**
     * Set to true when vertical contraints are applied
     *
     * @type boolean
     * @private
     */
    constrainY: false,

    /**
     * The left constraint
     *
     * @type int
     * @private
     */
    minX: 0,

    /**
     * The right constraint
     *
     * @type int
     * @private
     */
    maxX: 0,

    /**
     * The up constraint
     *
     * @type int
     * @private
     */
    minY: 0,

    /**
     * The down constraint
     *
     * @type int
     * @private
     */
    maxY: 0,

    /**
     * Maintain offsets when we resetconstraints.  Used to maintain the
     * slider thumb value, and this needs to be fixed.
     * @type boolean
     */
    maintainOffset: false,

    /**
     * Array of pixel locations the element will snap to if we specified a
     * horizontal graduation/interval.  This array is generated automatically
     * when you define a tick interval.
     * @type int[]
     */
    xTicks: null,

    /**
     * Array of pixel locations the element will snap to if we specified a
     * vertical graduation/interval.  This array is generated automatically
     * when you define a tick interval.
     * @type int[]
     */
    yTicks: null,

    /**
     * By default the drag and drop instance will only respond to the primary
     * button click (left button for a right-handed mouse).  Set to true to
     * allow drag and drop to start with any mouse click that is propogated
     * by the browser
     * @type boolean
     */
    primaryButtonOnly: true,

    /**
     * Code that executes immediately before the startDrag event
     * @private
     */
    b4StartDrag: function(x, y) { },

    /**
     * Abstract method called after a drag/drop object is clicked
     * and the drag or mousedown time thresholds have beeen met.
     *
     * @param {int} X click location
     * @param {int} Y click location
     */
    startDrag: function(x, y) { /* override this */ },

    /**
     * Code that executes immediately before the onDrag event
     * @private
     */
    b4Drag: function(e) { },

    /**
     * Abstract method called during the onMouseMove event while dragging an
     * object.
     *
     * @param {Event} e
     */
    onDrag: function(e) { /* override this */ },

    /**
     * Code that executes immediately before the onDragEnter event
     * @private
     */
    // b4DragEnter: function(e) { },

    /**
     * Abstract method called when this element fist begins hovering over
     * another DragDrop obj
     *
     * @param {Event} e
     * @param {String || YAHOO.util.DragDrop[]} id In POINT mode, the element
     * id this is hovering over.  In INTERSECT mode, an array of one or more
     * dragdrop items being hovered over.
     */
    onDragEnter: function(e, id) { /* override this */ },

    /**
     * Code that executes immediately before the onDragOver event
     * @private
     */
    b4DragOver: function(e) { },

    /**
     * Abstract method called when this element is hovering over another
     * DragDrop obj
     *
     * @param {Event} e
     * @param {String || YAHOO.util.DragDrop[]} id In POINT mode, the element
     * id this is hovering over.  In INTERSECT mode, an array of dd items
     * being hovered over.
     */
    onDragOver: function(e, id) { /* override this */ },

    /**
     * Code that executes immediately before the onDragOut event
     * @private
     */
    b4DragOut: function(e) { },

    /**
     * Abstract method called when we are no longer hovering over an element
     *
     * @param {Event} e
     * @param {String || YAHOO.util.DragDrop[]} id In POINT mode, the element
     * id this was hovering over.  In INTERSECT mode, an array of dd items
     * that the mouse is no longer over.
     */
    onDragOut: function(e, id) { /* override this */ },

    /**
     * Code that executes immediately before the onDragDrop event
     * @private
     */
    b4DragDrop: function(e) { },

    /**
     * Abstract method called when this item is dropped on another DragDrop
     * obj
     *
     * @param {Event} e
     * @param {String || YAHOO.util.DragDrop[]} id In POINT mode, the element
     * id this was dropped on.  In INTERSECT mode, an array of dd items this
     * was dropped on.
     */
    onDragDrop: function(e, id) { /* override this */ },

    /**
     * Code that executes immediately before the endDrag event
     * @private
     */
    b4EndDrag: function(e) { },

    /**
     * Fired when we are done dragging the object
     *
     * @param {Event} e
     */
    endDrag: function(e) { /* override this */ },

    /**
     * Code executed immediately before the onMouseDown event

     * @param {Event} e
     * @private
     */
    b4MouseDown: function(e) {  },

    /**
     * Event handler that fires when a drag/drop obj gets a mousedown
     * @param {Event} e
     */
    onMouseDown: function(e) { /* override this */ },

    /**
     * Event handler that fires when a drag/drop obj gets a mouseup
     * @param {Event} e
     */
    onMouseUp: function(e) { /* override this */ },

    /**
     * Returns a reference to the linked element
     *
     * @return {Object} the html element
     */
    getEl: function() {
        if (!this._domRef) {
            this._domRef = this.DDM.getElement(this.id);
        }

        return this._domRef;
    },

    /**
     * Returns a reference to the actual element to drag.  By default this is
     * the same as the html element, but it can be assigned to another
     * element. An example of this can be found in YAHOO.util.DDProxy
     *
     * @return {Object} the html element
     */
    getDragEl: function() {
        return this.DDM.getElement(this.dragElId);
    },

    /**
     * Sets up the DragDrop object.  Must be called in the constructor of any
     * YAHOO.util.DragDrop subclass
     *
     * @param id the id of the linked element
     * @param {String} sGroup the group of related items
     * element is supposed to be a target only, set to false.
     */
    init: function(id, sGroup) {
        this.initTarget(id, sGroup);
        YAHOO.util.Event.addListener(id, "mousedown",
                                          this.handleMouseDown, this, true);
    },

    /**
     * Initializes Targeting functionality only... the object does not
     * get a mousedown handler.
     *
     * @param id the id of the linked element
     * @param {String} sGroup the group of related items
     * element is supposed to be a target only, set to false.
     */
    initTarget: function(id, sGroup) {

        // create a local reference to the drag and drop manager
        this.DDM = YAHOO.util.DDM;


        // set the default padding
        this.padding = [0, 0, 0, 0];

        // initialize the groups array
        this.groups = {};

        // set the id
        this.id = id;

        // the element is a drag handle by default
        this.setDragElId(id);

        // by default, clicked anchors will not start drag operations
        this.invalidHandleTypes = {a : "a"};

        // We don't want to register this as the handle with the manager
        // so we just set the id rather than calling the setter
        this.handleElId = id;

        // cache the position of the element if we can
        if (document && document.body) {
            this.setInitPosition();
        }

        // add to an interaction group
        this.addToGroup((sGroup) ? sGroup : "default");

    },

    /**
     * Configures the padding for the target zone in px.  Effectively expands
     * (or reduces) the virtual object size for targeting calculations.
     * Supports css-style shorthand; if only one parameter is passed, all sides
     * will have that padding, and if only two are passed, the top and bottom
     * will have the first param, the left and right the second.
     * @param {int} iTop    Top pad
     * @param {int} iRight  Right pad
     * @param {int} iBot    Bot pad
     * @param {int} iLeft   Left pad
     */
    setPadding: function(iTop, iRight, iBot, iLeft) {
        // this.padding = [iLeft, iRight, iTop, iBot];
        if (!iRight && 0 !== iRight) {
            this.padding = [iTop, iTop, iTop, iTop];
        } else if (!iBot && 0 !== iBot) {
            this.padding = [iTop, iRight, iTop, iRight];
        } else {
            this.padding = [iTop, iRight, iBot, iLeft];
        }
    },

    /**
     * Stores the initial placement of the dd element
     */
    setInitPosition: function(diffX, diffY) {
        var el = this.getEl();

        if (!this.DDM.verifyEl(el)) {
            return;
        }

        var dx = diffX || 0;
        var dy = diffY || 0;

        var p = YAHOO.util.Dom.getXY( el );

        this.initPageX = p[0] - dx;
        this.initPageY = p[1] - dy;

        this.lastPageX = p[0];
        this.lastPageY = p[1];

        this.setStartPosition(p);
    },

    /**
     * Sets the start position of the element.  This is set when the obj
     * is initialized, the reset when a drag is started.
     * @param pos current position (from previous lookup)
     * @private
     */
    setStartPosition: function(pos) {

        var p = pos || YAHOO.util.Dom.getXY( this.getEl() );

        this.startPageX = p[0];
        this.startPageY = p[1];
    },

    /**
     * Add this instance to a group of related drag/drop objects.  All
     * instances belong to at least one group, and can belong to as many
     * groups as needed.
     *
     * @param sGroup {string} the name of the group
     */
    addToGroup: function(sGroup) {
        this.groups[sGroup] = true;
        this.DDM.regDragDrop(this, sGroup);
    },

    /**
     * Allows you to specify that an element other than the linked element
     * will be moved with the cursor during a drag
     *
     * @param id the id of the element that will be used to initiate the drag
     */
    setDragElId: function(id) {
        this.dragElId = id;
    },

    /**
     * Allows you to specify a child of the linked element that should be
     * used to initiate the drag operation.  An example of this would be if
     * you have a content div with text and links.  Clicking anywhere in the
     * content area would normally start the drag operation.  Use this method
     * to specify that an element inside of the content div is the element
     * that starts the drag operation.
     *
     * @param id the id of the element that will be used to initiate the drag
     */
    setHandleElId: function(id) {
        this.handleElId = id;
        this.DDM.regHandle(this.id, id);
    },

    /**
     * Allows you to set an element outside of the linked element as a drag
     * handle
     */
    setOuterHandleElId: function(id) {
        YAHOO.util.Event.addListener(id, "mousedown",
                this.handleMouseDown, this, true);
        this.setHandleElId(id);
    },

    /**
     * Remove all drag and drop hooks for this element
     */
    unreg: function() {
        YAHOO.util.Event.removeListener(this.id, "mousedown",
                this.handleMouseDown);
        this._domRef = null;
        this.DDM._remove(this);
    },

    /**
     * Returns true if this instance is locked, or the drag drop mgr is locked
     * (meaning that all drag/drop is disabled on the page.)
     *
     * @return {boolean} true if this obj or all drag/drop is locked, else
     * false
     */
    isLocked: function() {
        return (this.DDM.isLocked() || this.locked);
    },

    /**
     * Fired when this object is clicked
     *
     * @param {Event} e
     * @param {YAHOO.util.DragDrop} oDD the clicked dd object (this dd obj)
     * @private
     */
    handleMouseDown: function(e, oDD) {


        var EU = YAHOO.util.Event;


        var button = e.which || e.button;

        if (this.primaryButtonOnly && button > 1) {
            return;
        }

        if (this.isLocked()) {
            return;
        }


        this.DDM.refreshCache(this.groups);

        // Only process the event if we really clicked within the linked
        // element.  The reason we make this check is that in the case that
        // another element was moved between the clicked element and the
        // cursor in the time between the mousedown and mouseup events. When
        // this happens, the element gets the next mousedown event
        // regardless of where on the screen it happened.
        var pt = new YAHOO.util.Point(EU.getPageX(e), EU.getPageY(e));
        if ( this.DDM.isOverTarget(pt, this) )  {


            //  check to see if the handle was clicked
            var srcEl = EU.getTarget(e);

            if (this.isValidHandleChild(srcEl) &&
                    (this.id == this.handleElId ||
                     this.DDM.handleWasClicked(srcEl, this.id)) ) {

                // set the initial element position
                this.setStartPosition();


                this.b4MouseDown(e);
                this.onMouseDown(e);
                this.DDM.handleMouseDown(e, this);

                this.DDM.stopEvent(e);
            }
        }
    },

    /**
     * Allows you to specify a tag name that should not start a drag operation
     * when clicked.  This is designed to facilitate embedding links within a
     * drag handle that do something other than start the drag.
     *
     * @param {string} tagName the type of element to exclude
     */
    addInvalidHandleType: function(tagName) {
        var type = tagName.toUpperCase();
        this.invalidHandleTypes[type] = type;
    },

    /**
     * Unsets an excluded tag name set by addInvalidHandleType
     *
     * @param {string} tagName the type of element to unexclude
     */
    removeInvalidHandleType: function(tagName) {
        var type = tagName.toUpperCase();
        this.invalidHandleTypes[type] = null;
    },

    /**
     * Checks the tag exclusion list to see if this click should be ignored
     *
     * @param {ygNode} node
     * @return {boolean} true if this is a valid tag type, false if not
     */
    isValidHandleChild: function(node) {
        var type = node.nodeName;

        if (type == "#text") {
            type = node.parentNode.nodeName;
        }

        return (!this.invalidHandleTypes[type]);
    },

    /**
     * Create the array of horizontal tick marks if an interval was specified
     * in setXConstraint().
     *
     * @private
     */
    setXTicks: function(iStartX, iTickSize) {
        this.xTicks = [];
        this.xTickSize = iTickSize;

        var tickMap = {};

        for (var i = this.initPageX; i >= this.minX; i = i - iTickSize) {
            if (!tickMap[i]) {
                this.xTicks[this.xTicks.length] = i;
                tickMap[i] = true;
            }
        }

        for (i = this.initPageX; i <= this.maxX; i = i + iTickSize) {
            if (!tickMap[i]) {
                this.xTicks[this.xTicks.length] = i;
                tickMap[i] = true;
            }
        }

        this.xTicks.sort(this.DDM.numericSort) ;
    },

    /**
     * Create the array of vertical tick marks if an interval was specified in
     * setYConstraint().
     *
     * @private
     */
    setYTicks: function(iStartY, iTickSize) {
        this.yTicks = [];
        this.yTickSize = iTickSize;

        var tickMap = {};

        for (var i = this.initPageY; i >= this.minY; i = i - iTickSize) {
            if (!tickMap[i]) {
                this.yTicks[this.yTicks.length] = i;
                tickMap[i] = true;
            }
        }

        for (i = this.initPageY; i <= this.maxY; i = i + iTickSize) {
            if (!tickMap[i]) {
                this.yTicks[this.yTicks.length] = i;
                tickMap[i] = true;
            }
        }

        this.yTicks.sort(this.DDM.numericSort) ;
    },

    /**
     * By default, the element can be dragged any place on the screen.  Use
     * this method to limit the horizontal travel of the element.  Pass in
     * 0,0 for the parameters if you want to lock the drag to the y axis.
     *
     * @param {int} iLeft the number of pixels the element can move to the left
     * @param {int} iRight the number of pixels the element can move to the
     * right
     * @param {int} iTickSize optional parameter for specifying that the
     * element
     * should move iTickSize pixels at a time.
     */
    setXConstraint: function(iLeft, iRight, iTickSize) {
        this.leftConstraint = iLeft;
        this.rightConstraint = iRight;

        this.minX = this.initPageX - iLeft;
        this.maxX = this.initPageX + iRight;
        if (iTickSize) { this.setXTicks(this.initPageX, iTickSize); }

        this.constrainX = true;
    },

    /**
     * By default, the element can be dragged any place on the screen.  Set
     * this to limit the vertical travel of the element.  Pass in 0,0 for the
     * parameters if you want to lock the drag to the x axis.
     *
     * @param {int} iUp the number of pixels the element can move up
     * @param {int} iDown the number of pixels the element can move down
     * @param {int} iTickSize optional parameter for specifying that the
     * element should move iTickSize pixels at a time.
     */
    setYConstraint: function(iUp, iDown, iTickSize) {
        this.topConstraint = iUp;
        this.bottomConstraint = iDown;

        this.minY = this.initPageY - iUp;
        this.maxY = this.initPageY + iDown;
        if (iTickSize) { this.setYTicks(this.initPageY, iTickSize); }

        this.constrainY = true;

    },

    /**
     * resetConstraints must be called if you manually reposition a dd element.
     * @param {boolean} maintainOffset
     */
    resetConstraints: function() {


        // figure out how much this thing has moved
        var dx = (this.maintainOffset) ? this.lastPageX - this.initPageX : 0;
        var dy = (this.maintainOffset) ? this.lastPageY - this.initPageY : 0;


        // reset the initial location
        this.setInitPosition(dx, dy);

        if (this.constrainX) {
            this.setXConstraint( this.leftConstraint,
                                 this.rightConstraint,
                                 this.xTickSize        );
        }

        if (this.constrainY) {
            this.setYConstraint( this.topConstraint,
                                 this.bottomConstraint,
                                 this.yTickSize         );
        }
    },

    /**
     * Normally the drag element is moved pixel by pixel, but we can specify
     * that it move a number of pixels at a time.  This method resolves the
     * location when we have it set up like this.
     *
     * @param {int} val where we want to place the object
     * @param {int[]} tickArray sorted array of valid points
     * @return {int} the closest tick
     * @private
     */
    getTick: function(val, tickArray) {

        if (!tickArray) {
            // If tick interval is not defined, it is effectively 1 pixel,
            // so we return the value passed to us.
            return val;
        } else if (tickArray[0] >= val) {
            // The value is lower than the first tick, so we return the first
            // tick.
            return tickArray[0];
        } else {
            for (var i = 0; i < tickArray.length; ++i) {
                var next = i + 1;
                if (tickArray[next] && tickArray[next] >= val) {
                    var diff1 = val - tickArray[i];
                    var diff2 = tickArray[next] - val;
                    return (diff2 > diff1) ? tickArray[i] : tickArray[next];
                }
            }

            // The value is larger than the last tick, so we return the last
            // tick.
            return tickArray[tickArray.length - 1];
        }
    },

    /**
     * toString method
     * @return {string} string representation of the dd obj
     */
    toString: function(val, tickArray) {
        return ("YAHOO.util.DragDrop {" + this.id + "}");
    }

};

/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

// Only load the library once.  Rewriting the manager class would orphan
// existing drag and drop instances.
if (!YAHOO.util.DragDropMgr) {

    /**
     * @class Handles the element interaction for all DragDrop items in the
     * window.  Generally, you will not call this class directly, but it does
     * have helper methods that could be useful in your DragDrop
     * implementations.  This class should not be instantiated; all methods
     * are are static.
     *
     * @constructor
     */
    YAHOO.util.DragDropMgr = new function() {

        /**
         * utility package shorthand
         * @private
         */
        var UTIL = YAHOO.util;

        /**
         * Two dimensional Array of registered DragDrop objects.  The first
         * dimension is the DragDrop item group, the second the DragDrop
         * object.
         *
         * @private
         */
        this.ids = {};

        /**
         * Array of element ids defined as drag handles.  Used to determine
         * if the element that generated the mousedown event is actually the
         * handle and not the html element itself.
         *
         * @private
         */
        this.handleIds = {};

        /**
         * the DragDrop object that is currently being dragged
         *
         * @type DragDrop
         * @private
         **/
        this.dragCurrent = null;

        /**
         * the DragDrop object(s) that are being hovered over
         *
         * @type Array
         * @private
         */
        this.dragOvers = {};

        /**
         * @private
         */

        /**
         * the X distance between the cursor and the object being dragged
         *
         * @type int
         * @private
         */
        this.deltaX = 0;

        /**
         * the Y distance between the cursor and the object being dragged
         *
         * @type int
         * @private
         */
        this.deltaY = 0;

        /**
         * Flag to determine if we should prevent the default behavior of the
         * events we define. By default this is true, but this can be set to
         * false if you need the default behavior (not recommended)
         *
         * @type boolean
         */
        this.preventDefault = true;

        /**
         * Flag to determine if we should stop the propagation of the events
         * we generate. This is true by default but you may want to set it to
         * false if the html element contains other features that require the
         * mouse click.
         *
         * @type boolean
         */
        this.stopPropagation = true;

        /**
         * @private
         */
        this.initalized = false;

        /**
         * All drag and drop can be disabled.
         *
         * @private
         */
        this.locked = false;

        /**
         * Called the first time an element is registered.
         *
         * @private
         */
        this.init = function() {
        };

        /**
         * In point mode, drag and drop interaction is defined by the
         * location of the cursor during the drag/drop
         * @type int
         */
        this.POINT     = 0;

        /**
         * In intersect mode, drag and drop interactio nis defined by the
         * overlap of two or more drag and drop objects.
         * @type int
         */
        this.INTERSECT = 1;

        /**
         * The current drag and drop mode.  Default it point mode
         * @type int
         */
        this.mode = this.POINT;

        /**
         * Runs method on all drag and drop objects
         * @private
         */
        this._execOnAll = function(sMethod, args) {
            for (var i in this.ids) {
                for (var j in this.ids[i]) {
                    var oDD = this.ids[i][j];
                    if (! this.isTypeOfDD(oDD)) {
                        continue;
                    }
                    oDD[sMethod].apply(oDD, args);
                }
            }
        };

        /**
         * Drag and drop initialization.  Sets up the global event handlers
         * @private
         */
        this._onLoad = function() {

            this._execOnAll("setInitPosition", []);


            var EU = UTIL.Event;

            EU.addListener(document, "mouseup",   this.handleMouseUp, this, true);
            EU.addListener(document, "mousemove", this.handleMouseMove, this, true);
            EU.addListener(window,   "unload",    this._onUnload, this, true);
            EU.addListener(window,   "resize",    this._onResize, this, true);
            // EU.addListener(window,   "mouseout",    this._test);

            this.initalized = true;

        };

        /**
         * Reset constraints on all drag and drop objs
         * @private
         */
        this._onResize = function(e) {
            this._execOnAll("resetConstraints", []);
        };

        /**
         * Lock all drag and drop functionality
         */
        this.lock = function() { this.locked = true; };

        /**
         * Unlock all drag and drop functionality
         */
        this.unlock = function() { this.locked = false; };

        /**
         * Is drag and drop locked?
         *
         * @return {boolean} True if drag and drop is locked, false otherwise.
         */
        this.isLocked = function() { return this.locked; };

        /**
         * Location cache that is set for all drag drop objects when a drag is
         * initiated, cleared when the drag is finished.
         *
         * @private
         */
        this.locationCache = {};

        /**
         * Set useCache to false if you want to force object the lookup of each
         * drag and drop linked element constantly during a drag.
         * @type boolean
         */
        this.useCache = true;

        /**
         * The number of pixels that the mouse needs to move after the
         * mousedown before the drag is initiated.  Default=3;
         * @type int
         */
        this.clickPixelThresh = 3;

        /**
         * The number of milliseconds after the mousedown event to initiate the
         * drag if we don't get a mouseup event. Default=1000
         * @type int
         */
        this.clickTimeThresh = 1000;

        /**
         * Flag that indicates that either the drag pixel threshold or the
         * mousdown time threshold has been met
         * @type boolean
         * @private
         */
        this.dragThreshMet = false;

        /**
         * Timeout used for the click time threshold
         * @type Object
         * @private
         */
        this.clickTimeout = null;

        /**
         * The X position of the mousedown event stored for later use when a
         * drag threshold is met.
         * @type int
         * @private
         */
        this.startX = 0;

        /**
         * The Y position of the mousedown event stored for later use when a
         * drag threshold is met.
         * @type int
         * @private
         */
        this.startY = 0;

        /**
         * Each DragDrop instance must be registered with the DragDropMgr.
         * This is executed in ygDragDrop.init()
         *
         * @param {DragDrop} oDD the DragDrop object to register
         * @param {String} sGroup the name of the group this element belongs to
         */
        this.regDragDrop = function(oDD, sGroup) {
            if (!this.initialized) { this.init(); }

            if (!this.ids[sGroup]) {
                this.ids[sGroup] = {};
            }
            this.ids[sGroup][oDD.id] = oDD;
        };

        /**
         * Unregisters a drag and drop item.  This is executed in
         * ygDragDrop.unreg, use that method instead of calling this directly.
         * @private
         */
        this._remove = function(oDD) {
            for (var g in oDD.groups) {
                if (g && this.ids[g][oDD.id]) {
                    delete this.ids[g][oDD.id];
                }
            }
            delete this.handleIds[oDD.id];
        };

        /**
         * Each DragDrop handle element must be registered.  This is done
         * automatically when executing ygDragDrop.setHandleElId()
         *
         * @param {String} sDDId the DragDrop id this element is a handle for
         * @param {String} sHandleId the id of the element that is the drag
         * handle
         */
        this.regHandle = function(sDDId, sHandleId) {
            if (!this.handleIds[sDDId]) {
                this.handleIds[sDDId] = {};
            }
            this.handleIds[sDDId][sHandleId] = sHandleId;
        };

        /**
         * Utility function to determine if a given element has been
         * registered as a drag drop item.
         *
         * @param {String} id the element id to check
         * @return {boolean} true if this element is a DragDrop item,
         * false otherwise
         */
        this.isDragDrop = function(id) {
            return ( this.getDDById(id) ) ? true : false;
        };

        /**
         * Returns the drag and drop instances that are in all groups the
         * passed in instance belongs to.
         *
         * @param {ygDragDrop} p_oDD the obj to get related data for
         * @param {boolean} bTargetsOnly if true, only return targetable objs
         * @return {ygDragDrop[]} the related instances
         */
        this.getRelated = function(p_oDD, bTargetsOnly) {
            var oDDs = [];
            for (var i in p_oDD.groups) {
                for (j in this.ids[i]) {
                    var dd = this.ids[i][j];
                    if (! this.isTypeOfDD(dd)) {
                        continue;
                    }
                    if (!bTargetsOnly || dd.isTarget) {
                        oDDs[oDDs.length] = dd;
                    }
                }
            }

            return oDDs;
        };

        /**
         * Returns true if the specified dd target is a legal target for
         * the specifice drag obj
         *
         * @param {ygDragDrop} the drag obj
         * @param {ygDragDrop) the target
         * @return {boolean} true if the target is a legal target for the
         * dd obj
         */
        this.isLegalTarget = function (oDD, oTargetDD) {
            var targets = this.getRelated(oDD);
            for (var i =0;i<targets.length;++i) {
                if (targets[i].id == oTargetDD.id) {
                    return true;
                }
            }

            return false;
        };

        /**
         * My goal is to be able to transparently determine if an object is
         * typeof ygDragDrop, and the exact subclass of ygDragDrop.  typeof
         * returns "object", oDD.constructor.toString() always returns
         * "ygDragDrop" and not the name of the subclass.  So for now it just
         * evaluates a well-known variable in ygDragDrop.
         *
         * @param {Object} the object to evaluate
         * @return {boolean} true if typeof oDD = ygDragDrop
         */
        this.isTypeOfDD = function (oDD) {
            return (oDD && oDD.__ygDragDrop);
        };

        /**
         * Utility function to determine if a given element has been
         * registered as a drag drop handle for the given Drag Drop object.
         *
         * @param {String} id the element id to check
         * @return {boolean} true if this element is a DragDrop handle, false
         * otherwise
         */
        this.isHandle = function(sDDId, sHandleId) {
            return ( this.handleIds[sDDId] &&
                            this.handleIds[sDDId][sHandleId] );
        };

        /**
         * Returns the DragDrop instance for a given id
         *
         * @param {String} id the id of the DragDrop object
         * @return {DragDrop} the drag drop object, null if it is not found
         */
        this.getDDById = function(id) {
            for (var i in this.ids) {
                if (this.ids[i][id]) {
                    return this.ids[i][id];
                }
            }
            return null;
        };

        /**
         * Fired after a registered DragDrop object gets the mousedown event.
         * Sets up the events required to track the object being dragged
         *
         * @param {Event} e the event
         * @param oDD the DragDrop object being dragged
         * @private
         */
        this.handleMouseDown = function(e, oDD) {
            this.dragCurrent = oDD;

            var el = oDD.getEl();

            // track start position
            this.startX = UTIL.Event.getPageX(e);
            this.startY = UTIL.Event.getPageY(e);

            this.deltaX = this.startX - el.offsetLeft;
            this.deltaY = this.startY - el.offsetTop;

            this.dragThreshMet = false;

            this.clickTimeout = setTimeout(
               "var DDM=YAHOO.util.DDM;DDM.startDrag(DDM.startX, DDM.startY)",
               this.clickTimeThresh );
        };

        /**
         * Fired when either the drag pixel threshol or the mousedown hold
         * time threshold has been met.
         *
         * @param x {int} the X position of the original mousedown
         * @param y {int} the Y position of the original mousedown
         */
        this.startDrag = function(x, y) {
            clearTimeout(this.clickTimeout);
            if (this.dragCurrent) {
                this.dragCurrent.b4StartDrag(x, y);
                this.dragCurrent.startDrag(x, y);
            }
            this.dragThreshMet = true;
        };

        /**
         * Internal function to handle the mouseup event.  Will be invoked
         * from the context of the document.
         *
         * @param {Event} e the event
         * @private
         */
        this.handleMouseUp = function(e) {

            if (! this.dragCurrent) {
                return;
            }

            clearTimeout(this.clickTimeout);

            if (this.dragThreshMet) {
                this.fireEvents(e, true);
            } else {
            }

            this.stopDrag(e);

            this.stopEvent(e);
        };

        /**
         * Utility to stop event propagation and event default, if these
         * features are turned on.
         *
         * @param {Event} e the event as returned by this.getEvent()
         */
        this.stopEvent = function(e) {
            if (this.stopPropagation) {
                UTIL.Event.stopPropagation(e);
            }

            if (this.preventDefault) {
                UTIL.Event.preventDefault(e);
            }
        };

        /**
         * Internal function to clean up event handlers after the drag
         * operation is complete
         *
         * @param {Event} e the event
         * @private
         */
        this.stopDrag = function(e) {

            // Fire the drag end event for the item that was dragged
            if (this.dragCurrent) {
                if (this.dragThreshMet) {
                    this.dragCurrent.b4EndDrag(e);
                    this.dragCurrent.endDrag(e);
                }

                this.dragCurrent.onMouseUp(e);
            }

            this.dragCurrent = null;
            this.dragOvers = {};
        };

        /**
         * Internal function to handle the mousemove event.  Will be invoked
         * from the context of the html element.
         *
         * @TODO figure out what we can do about mouse events lost when the
         * user drags objects beyond the window boundary.  Currently we can
         * detect this in internet explorer by verifying that the mouse is
         * down during the mousemove event.  Firefox doesn't give us the
         * button state on the mousemove event.
         *
         * @param {Event} e the event
         * @private
         */
        this.handleMouseMove = function(e) {
            if (! this.dragCurrent) {
                return;
            }

            // var button = e.which || e.button;


            // check for IE mouseup outside of page boundary
            if (UTIL.Event.isIE && !e.button) {
                this.stopEvent(e);
                return this.handleMouseUp(e);
            }

            if (!this.dragThreshMet) {
                var diffX = Math.abs(this.startX - UTIL.Event.getPageX(e));
                var diffY = Math.abs(this.startY - UTIL.Event.getPageY(e));
                if (diffX > this.clickPixelThresh ||
                            diffY > this.clickPixelThresh) {
                    this.startDrag(this.startX, this.startY);
                }
            }

            if (this.dragThreshMet) {
                this.dragCurrent.b4Drag(e);
                this.dragCurrent.onDrag(e);
                this.fireEvents(e, false);
            }

            this.stopEvent(e);
        };

        /**
         * Iterates over all of the DragDrop elements to find ones we are
         * hovering over or dropping on
         *
         * @param {Event} e the event
         * @param {boolean} isDrop is this a drop op or a mouseover op?
         * @private
         */
        this.fireEvents = function(e, isDrop) {
            var dc = this.dragCurrent;

            // If the user did the mouse up outside of the window, we could
            // get here even though we have ended the drag.
            if (!dc || dc.isLocked()) {
                return;
            }

            var x = UTIL.Event.getPageX(e);
            var y = UTIL.Event.getPageY(e);
            var pt = new YAHOO.util.Point(x,y);

            // cache the previous dragOver array
            var oldOvers = [];

            var outEvts   = [];
            var overEvts  = [];
            var dropEvts  = [];
            var enterEvts = [];

            // Check to see if the object we were hovering over is no longer
            // being hovered over so we can fire the onDragOut event
            for (var i in this.dragOvers) {

                var ddo = this.dragOvers[i];

                if (! this.isTypeOfDD(ddo)) {
                    continue;
                }

                if (! this.isOverTarget(pt, ddo, this.mode)) {
                    outEvts.push( ddo );
                }

                oldOvers[i] = true;
                delete this.dragOvers[i];
            }

            for (var sGroup in dc.groups) {

                if ("string" != typeof sGroup) {
                    continue;
                }

                for (i in this.ids[sGroup]) {
                    var oDD = this.ids[sGroup][i];
                    if (! this.isTypeOfDD(oDD)) {
                        continue;
                    }

                    if (oDD.isTarget && !oDD.isLocked() && oDD != dc) {
                        if (this.isOverTarget(pt, oDD, this.mode)) {
                            // look for drop interactions
                            if (isDrop) {
                                dropEvts.push( oDD );
                            // look for drag enter and drag over interactions
                            } else {

                                // initial drag over: dragEnter fires
                                if (!oldOvers[oDD.id]) {
                                    enterEvts.push( oDD );
                                // subsequent drag overs: dragOver fires
                                } else {
                                    overEvts.push( oDD );
                                }

                                this.dragOvers[oDD.id] = oDD;
                            }
                        }
                    }
                }
            }

            if (this.mode) {
                if (outEvts.length > 0) {
                    dc.b4DragOut(e, outEvts);
                    dc.onDragOut(e, outEvts);
                }

                if (enterEvts.length > 0) {
                    dc.onDragEnter(e, enterEvts);
                }

                if (overEvts.length > 0) {
                    dc.b4DragOver(e, overEvts);
                    dc.onDragOver(e, overEvts);
                }

                if (dropEvts.length > 0) {
                    dc.b4DragDrop(e, dropEvts);
                    dc.onDragDrop(e, dropEvts);
                }

            } else {
                // fire dragout events
                for (i=0; i < outEvts.length; ++i) {
                    dc.b4DragOut(e, outEvts[i].id);
                    dc.onDragOut(e, outEvts[i].id);
                }

                // fire enter events
                for (i=0; i < enterEvts.length; ++i) {
                    // dc.b4DragEnter(e, oDD.id);
                    dc.onDragEnter(e, enterEvts[i].id);
                }

                // fire over events
                for (i=0; i < overEvts.length; ++i) {
                    dc.b4DragOver(e, overEvts[i].id);
                    dc.onDragOver(e, overEvts[i].id);
                }

                // fire drop events
                for (i=0; i < dropEvts.length; ++i) {
                    dc.b4DragDrop(e, dropEvts[i].id);
                    dc.onDragDrop(e, dropEvts[i].id);
                }

            }

        };

        /**
         * Helper function for getting the best match from the list of drag
         * and drop objects returned by the drag and drop events when we are
         * in INTERSECT mode.  It returns either the first object that the
         * cursor is over, or the object that has the greatest overlap with
         * the dragged element.
         *
         * @param  {ygDragDrop[]} dds The array of drag and drop objects
         * targeted
         * @return {ygDragDrop}       The best single match
         */
        this.getBestMatch = function(dds) {
            var winner = null;
            // Return null if the input is not what we expect
            //if (!dds || !dds.length || dds.length == 0) {
               // winner = null;
            // If there is only one item, it wins
            //} else if (dds.length == 1) {

            if (dds.length == 1) {
                winner = dds[0];
            } else {
                // Loop through the targeted items
                for (var i=0; i<dds.length; ++i) {
                    var dd = dds[i];
                    // If the cursor is over the object, it wins.  If the
                    // cursor is over multiple matches, the first one we come
                    // to wins.
                    if (dd.cursorIsOver) {
                        winner = dd;
                        break;
                    // Otherwise the object with the most overlap wins
                    } else {
                        if (!winner ||
                            winner.overlap.getArea() < dd.overlap.getArea()) {
                            winner = dd;
                        }
                    }
                }
            }

            return winner;
        };

        /**
         * Refreshes the cache of the top-left and bottom-right points of the
         * drag and drop objects in the specified groups
         *
         * @param {Array} aGroups an associative array of groups to refresh
         */
        this.refreshCache = function(aGroups) {
            for (sGroup in aGroups) {
                if ("string" != typeof sGroup) {
                    continue;
                }
                for (i in this.ids[sGroup]) {
                    var oDD = this.ids[sGroup][i];

                    if (this.isTypeOfDD(oDD)) {
                        var loc = this.getLocation(oDD);
                        if (loc) {
                            this.locationCache[oDD.id] = loc;
                        } else {
                            delete this.locationCache[oDD.id];
                            // this will unregister the drag and drop object if
                            // the element is not in a usable state
                            oDD.unreg();
                        }
                    }
                }
            }
        };

        /**
         * This checks to make sure an element exists and is in the DOM.  The
         * main purpose is to handle cases where innerHTML is used to remove
         * drag and drop objects from the DOM.  IE provides an 'unspecified
         * error' when trying to access the offsetParent of such an element
         * @param {HTMLElement} el the element to check
         * @return {boolean} true if the element looks usable
         */
        this.verifyEl = function(el) {
            try {
                if (el) {
                    var parent = el.offsetParent;
                    if (parent) {
                        return true;
                    }
                }
            } catch(e) {
            }

            return false;
        };

        /**
         * Returns the an array containing the drag and drop element's position
         * and size, including the ygDragDrop.padding configured for it
         *
         * @param {ygDragDrop} oDD the drag and drop object to get the
         * location for
         * @return array containing the top left and bottom right points of the
         * element
         */
        this.getLocation = function(oDD) {
            if (! this.isTypeOfDD(oDD)) {
                return null;
            }

            var el = oDD.getEl();

            if (!this.verifyEl(el)) {
                return null;
            }


            // var aPos = ygPos.getPos(el);
            var aPos = YAHOO.util.Dom.getXY(el);

            x1 = aPos[0];
            x2 = x1 + el.offsetWidth;

            y1 = aPos[1];
            y2 = y1 + el.offsetHeight;

            var t = y1 - oDD.padding[0];
            var r = x2 + oDD.padding[1];
            var b = y2 + oDD.padding[2];
            var l = x1 - oDD.padding[3];

            return new YAHOO.util.Region( t, r, b, l );

        };

        /**
         * Checks the cursor location to see if it over the target
         *
         * @param {YAHOO.util.Point} pt The point to evaluate
         * @param {ygDragDrop} oDDTarget the DragDrop object we are inspecting
         * @return {boolean} true if the mouse is over the target
         * @private
         */
        this.isOverTarget = function(pt, oDDTarget, intersect) {
            // use cache if available
            var loc = this.locationCache[oDDTarget.id];
            if (!loc || !this.useCache) {
                loc = this.getLocation(oDDTarget);
                this.locationCache[oDDTarget.id] = loc;

            }


            // var cursorIsOver =  (x >= loc[3] && x <= loc[1] && y >= loc[0] && y <= loc[2]);
            //oDDTarget.cursorIsOver = loc.contains( new YAHOO.util.Point(x, y) );
            oDDTarget.cursorIsOver = loc.contains( pt );
            oDDTarget.overlap = null;

            // if (this.INTERSECT == this.mode) {
            if (intersect) {

                var curRegion =
                    YAHOO.util.Region.getRegion(this.dragCurrent.getDragEl());
                var overlap = curRegion.intersect(loc);

                if (overlap) {
                    oDDTarget.overlap = overlap;
                    return true;
                } else {
                    return false;
                }

            } else {
                return oDDTarget.cursorIsOver;
            }
        };

        /**
         * @private
         */
        this._onUnload = function(e, me) {
            this.unregAll();
        };

        /**
         * Cleans up the drag and drop events and objects.
         *
         * @private
         */
        this.unregAll = function() {

            if (this.dragCurrent) {
                this.stopDrag();
                this.dragCurrent = null;
            }

            this._execOnAll("unreg", []);

            for (i in this.elementCache) {
                delete this.elementCache[i];
            }

            this.elementCache = {};
            this.ids = {};
        };

        /**
         * A cache of DOM elements
         *
         * @private
         */
        this.elementCache = {};

        /**
         * Get the wrapper for the DOM element specified
         *
         * @param {String} id the id of the elment to get
         * @return {YAHOO.util.DDM.ElementWrapper} the wrapped element
         * @private
         */
        this.getElWrapper = function(id) {
            var oWrapper = this.elementCache[id];
            if (!oWrapper || !oWrapper.el) {
                oWrapper = this.elementCache[id] =
                    new this.ElementWrapper(document.getElementById(id));
            }
            return oWrapper;
        };

        /**
         * Returns the actual DOM element
         *
         * @param {String} id the id of the elment to get
         * @return {Object} The element
         */
        this.getElement = function(id) {
            // return this.getElWrapper(id).el;
            return document.getElementById(id);
        };

        /**
         * Returns the style property for the DOM element (i.e.,
         * document.getElById(id).style)
         *
         * @param {String} id the id of the elment to get
         * @return {Object} The style property of the element
         */
        this.getCss = function(id) {
            // return this.getElWrapper(id).css;
            var css = null;
            var el = document.getElementById(id);
            if (el) {
                css = el.style;
            }

            return css;
        };

        /**
         * Inner class for cached elements
         */
        this.ElementWrapper = function(el) {
                /**
                 * @private
                 */
                this.el = el || null;
                /**
                 * @private
                 */
                this.id = this.el && el.id;
                /**
                 * @private
                 */
                this.css = this.el && el.style;
            };

        /**
         * Returns the X position of an html element
         * @param el the element for which to get the position
         * @return {int} the X coordinate
         */
        this.getPosX = function(el) {
            return YAHOO.util.Dom.getX(el);
        };

        /**
         * Returns the Y position of an html element
         * @param el the element for which to get the position
         * @return {int} the Y coordinate
         */
        this.getPosY = function(el) {
            return YAHOO.util.Dom.getY(el);
        };

        /**
         * Swap two nodes.  In IE, we use the native method, for others we
         * emulate the IE behavior
         *
         * @param n1 the first node to swap
         * @param n2 the other node to swap
         */
        this.swapNode = function(n1, n2) {
            if (n1.swapNode) {
                n1.swapNode(n2);
            } else {
                // the node reference order for the swap is a little tricky.
                var p = n2.parentNode;
                var s = n2.nextSibling;
                n1.parentNode.replaceChild(n2,n1);
                p.insertBefore(n1,s);
            }
        };

        /**
         * @private
         */
        this.getScroll = function () {
            var t, l;
            if (document.documentElement && document.documentElement.scrollTop) {
                t = document.documentElement.scrollTop;
                l = document.documentElement.scrollLeft;
            } else if (document.body) {
                t = document.body.scrollTop;
                l = document.body.scrollLeft;
            }
            return { top: t, left: l };
        };

        /**
         * Returns the specified element style property
         * @param {HTMLElement} el          the element
         * @param {string}      styleProp   the style property
         * @return {string}     The value of the style property
         */
        this.getStyle = function(el, styleProp) {
            if (el.style.styleProp) {
                return el.style.styleProp;
            } else if (el.currentStyle) {
                return el.currentStyle[styleProp];
            } else if (document.defaultView) {
                return document.defaultView.getComputedStyle(el, null).
                    getPropertyValue(styleProp);
            }
        };

        /**
         * Gets the scrollTop
         *
         * @return {int} the document's scrollTop
         */
        this.getScrollTop = function () { return this.getScroll().top; };

        /**
         * Gets the scrollLeft
         *
         * @return {int} the document's scrollTop
         */
        this.getScrollLeft = function () { return this.getScroll().left; };

        this.moveToEl = function (moveEl, targetEl) {
            var aCoord = YAHOO.util.Dom.getXY(targetEl);
            YAHOO.util.Dom.setXY(moveEl, aCoord);
        };

        /**
         * Gets the client height
         *
         * @return {int} client height in px
         */
        this.getClientHeight = function() {
            return (window.innerHeight) ? window.innerHeight :
                (document.documentElement && document.documentElement.clientHeight) ?
                document.documentElement.clientHeight : document.body.offsetHeight;
        };

        /**
         * Gets the client width
         *
         * @return {int} client width in px
         */
        this.getClientWidth = function() {
            return (window.innerWidth) ? window.innerWidth :
                (document.documentElement && document.documentElement.clientWidth) ?
                document.documentElement.clientWidth : document.body.offsetWidth;
        };

        /**
         * numeric array sort function
         */
        this.numericSort = function(a, b) { return (a - b); };

        /**
         * @private
         */
        this._timeoutCount = 0;

        /**
         * @private
         * Trying to make the load order less important.  Without this we get
         * an error if this file is loaded before the Event Utility.
         */
        this._addListeners = function() {
            if ( UTIL.Event &&
                 document          &&
                 document.body        ) {

                this._onLoad();
            } else {
                if (this._timeoutCount > 500) {
                } else {
                    setTimeout("YAHOO.util.DDM._addListeners()", 10);
                    this._timeoutCount += 1;
                }
            }

        };

        /**
         * Recursively searches the immediate parent and all child nodes for
         * the handle element in order to determine wheter or not it was
         * clicked.
         *
         * @param node the html element to inspect
         */
        this.handleWasClicked = function(node, id) {
            if (this.isHandle(id, node.id)) {
                return true;
            } else {
                // check to see if this is a text node child of the one we want
                var p = node.parentNode;

                while (p) {
                    if (this.isHandle(id, p.id)) {
                        return true;
                    } else {
                        p = p.parentNode;
                    }
                }
            }

            return false;
        };

    };

    // shorter alias, save a few bytes
    YAHOO.util.DDM = YAHOO.util.DragDropMgr;
    YAHOO.util.DDM._addListeners();

}

/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

/**
 * @class a DragDrop implementation where the linked element follows the
 * mouse cursor.
 *
 * @extends DragDrop
 * @constructor
 * @param {String} id the id of the linked element
 * @param {String} sGroup the group of related DragDrop items
 */
YAHOO.util.DD = function(id, sGroup) {
    if (id) {
        this.init(id, sGroup);
    }
};

YAHOO.util.DD.prototype = new YAHOO.util.DragDrop();

/**
 * Should we auto-scroll? Defaults to true
 *
 * @type boolean
 */
YAHOO.util.DD.prototype.scroll = true;

/**
 * Sets the pointer offset to the distance between the linked element's top
 * left corner and the location the element was clicked
 *
 * @param {int} iPageX the X coordinate of the click
 * @param {int} iPageY the Y coordinate of the click
 */
YAHOO.util.DD.prototype.autoOffset = function(iPageX, iPageY) {
    var el = this.getEl();
    var aCoord = YAHOO.util.Dom.getXY(el);
    var x = iPageX - aCoord[0];
    var y = iPageY - aCoord[1];
    this.setDelta(x, y);
};

/**
 * Sets the pointer offset.  You can call this directly to force the offset to
 * be in a particular location (e.g., pass in 0,0 to set it to the center of the
 * object, as done in ygDDSliderBG)
 *
 * @param {int} iDeltaX the distance from the left
 * @param {int} iDeltaY the distance from the top
 */
YAHOO.util.DD.prototype.setDelta = function(iDeltaX, iDeltaY) {
    this.deltaX = iDeltaX;
    this.deltaY = iDeltaY;
};

/**
 * Sets the drag element to the location of the mousedown or click event,
 * maintaining the cursor location relative to the location on the element
 * that was clicked.  Override this if you want to place the element in a
 * location other than where the cursor is.
 *
 * @param {int} iPageX the X coordinate of the mousedown or drag event
 * @param {int} iPageY the Y coordinate of the mousedown or drag event
 */

YAHOO.util.DD.prototype.setDragElPos = function(iPageX, iPageY) {
    this.alignElWithMouse(this.getDragEl(), iPageX, iPageY);
};

/**
 * Sets the element to the location of the mousedown or click event,
 * maintaining the cursor location relative to the location on the element
 * that was clicked.  Override this if you want to place the element in a
 * location other than where the cursor is.
 *
 * @param {HTMLElement} el the element to move
 * @param {int} iPageX the X coordinate of the mousedown or drag event
 * @param {int} iPageY the Y coordinate of the mousedown or drag event
 */
YAHOO.util.DD.prototype.alignElWithMouse = function(el, iPageX, iPageY) {
    var oCoord = this.getTargetCoord(iPageX, iPageY);
    var aCoord = [oCoord.x, oCoord.y];
    YAHOO.util.Dom.setXY(el, aCoord);

    this.cachePosition(oCoord.x, oCoord.y);

    this.autoScroll(oCoord.x, oCoord.y, el.offsetHeight, el.offsetWidth);
};

/**
 * Saves the most recent position so that we can reset the constraints and
 * tick marks on-demand.  We need to know this so that we can calculate the
 * number of pixels the element is offset from its original position.
 */
YAHOO.util.DD.prototype.cachePosition = function(iPageX, iPageY) {
    if (iPageX) {
        this.lastPageX = iPageX;
        this.lastPageY = iPageY;
    } else {
        var aCoord = YAHOO.util.Dom.getXY(this.getEl());
        this.lastPageX = aCoord[0];
        this.lastPageY = aCoord[1];
    }
};

/**
 * Auto-scroll the window if the dragged object has been moved beyond the
 * visible window boundary.
 *
 * @param {int} x the drag element's x position
 * @param {int} y the drag element's y position
 * @param {int} h the height of the drag element
 * @param {int} w the width of the drag element
 * @private
 */
YAHOO.util.DD.prototype.autoScroll = function(x, y, h, w) {

    if (this.scroll) {
        // The client height
        var clientH = this.DDM.getClientHeight();

        // The client width
        var clientW = this.DDM.getClientWidth();

        // The amt scrolled down
        var st = this.DDM.getScrollTop();

        // The amt scrolled right
        var sl = this.DDM.getScrollLeft();

        // Location of the bottom of the element
        var bot = h + y;

        // Location of the right of the element
        var right = w + x;

        // The distance from the cursor to the bottom of the visible area,
        // adjusted so that we don't scroll if the cursor is beyond the
        // element drag constraints
        var toBot = (clientH + st - y - this.deltaY);

        // The distance from the cursor to the right of the visible area
        var toRight = (clientW + sl - x - this.deltaX);


        // How close to the edge the cursor must be before we scroll
        // var thresh = (document.all) ? 100 : 40;
        var thresh = 40;

        // How many pixels to scroll per autoscroll op.  This helps to reduce
        // clunky scrolling. IE is more sensitive about this ... it needs this
        // value to be higher.
        var scrAmt = (document.all) ? 80 : 30;

        // Scroll down if we are near the bottom of the visible page and the
        // obj extends below the crease
        if ( bot > clientH && toBot < thresh ) {
            window.scrollTo(sl, st + scrAmt);
        }

        // Scroll up if the window is scrolled down and the top of the object
        // goes above the top border
        if ( y < st && st > 0 && y - st < thresh ) {
            window.scrollTo(sl, st - scrAmt);
        }

        // Scroll right if the obj is beyond the right border and the cursor is
        // near the border.
        if ( right > clientW && toRight < thresh ) {
            window.scrollTo(sl + scrAmt, st);
        }

        // Scroll left if the window has been scrolled to the right and the obj
        // extends past the left border
        if ( x < sl && sl > 0 && x - sl < thresh ) {
            window.scrollTo(sl - scrAmt, st);
        }
    }
};

/**
 * Finds the location the element should be placed if we want to move
 * it to where the mouse location less the click offset would place us.
 *
 * @param {int} iPageX the X coordinate of the click
 * @param {int} iPageY the Y coordinate of the click
 * @return an object that contains the coordinates (Object.x and Object.y)
 * @private
 */
YAHOO.util.DD.prototype.getTargetCoord = function(iPageX, iPageY) {


    var x = iPageX - this.deltaX;
    var y = iPageY - this.deltaY;

    if (this.constrainX) {
        if (x < this.minX) { x = this.minX; }
        if (x > this.maxX) { x = this.maxX; }
    }

    if (this.constrainY) {
        if (y < this.minY) { y = this.minY; }
        if (y > this.maxY) { y = this.maxY; }
    }

    x = this.getTick(x, this.xTicks);
    y = this.getTick(y, this.yTicks);


    return {x:x, y:y};
};

// overrides YAHOO.util.DragDrop
YAHOO.util.DD.prototype.b4MouseDown = function(e) {
    // this.resetConstraints();
    this.autoOffset(YAHOO.util.Event.getPageX(e),
                        YAHOO.util.Event.getPageY(e));
};

// overrides YAHOO.util.DragDrop
YAHOO.util.DD.prototype.b4Drag = function(e) {
    this.setDragElPos(YAHOO.util.Event.getPageX(e),
                        YAHOO.util.Event.getPageY(e));
};

///////////////////////////////////////////////////////////////////////////////
// Debugging ygDragDrop events that can be overridden
///////////////////////////////////////////////////////////////////////////////
/*
YAHOO.util.DD.prototype.startDrag = function(x, y) {
};

YAHOO.util.DD.prototype.onDrag = function(e) {
};

YAHOO.util.DD.prototype.onDragEnter = function(e, id) {
};

YAHOO.util.DD.prototype.onDragOver = function(e, id) {
};

YAHOO.util.DD.prototype.onDragOut = function(e, id) {
};

YAHOO.util.DD.prototype.onDragDrop = function(e, id) {
};

YAHOO.util.DD.prototype.endDrag = function(e) {
};
*/

/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

/**
 * @class a DragDrop implementation that inserts an empty, bordered div into
 * the document that follows the cursor during drag operations.  At the time of
 * the click, the frame div is resized to the dimensions of the linked html
 * element, and moved to the exact location of the linked element.
 *
 * @extends YAHOO.util.DD
 * @constructor
 * @param {String} id the id of the linked html element
 * @param {String} sGroup the group of related DragDrop objects
 */
YAHOO.util.DDProxy = function(id, sGroup) {
    if (id) {
        this.init(id, sGroup);
        this.initFrame();
    }
};

YAHOO.util.DDProxy.prototype = new YAHOO.util.DD();

/**
 * A reference to the one div element we create for all instances of this class
 *
 * @type Object
 */
YAHOO.util.DDProxy.frameDiv = null;

/**
 * the drag frame div id
 *
 * @type String
 */
YAHOO.util.DDProxy.dragElId = "ygddfdiv";

/**
 * The border width of the frame.  This is used when we resize the frame to
 * the size of the linked element.  We substract the border width to make
 * the div the correct size.
 *
 * @TODO find a better way to handle this
 *
 * @type int
 */
YAHOO.util.DDProxy.prototype.borderWidth = 2;

/**
 * By default we resize the drag frame to be the same size as the element
 * we want to drag (this is to get the frame effect).  We can turn it off
 * if we want a different behavior (ex: ygDDMy2)
 *
 * @type boolean
 */
YAHOO.util.DDProxy.prototype.resizeFrame = true;

/**
 * By default the frame is positioned exactly where the drag element is, so
 * we use the cursor offset provided by YAHOO.util.DD.  Another option that works only if
 * you do not have constraints on the obj is to have the drag frame centered
 * around the cursor.  Set centerFrame to true for this effect.  Ex:
 * ygDDMy2
 *
 * @type boolean
 */
YAHOO.util.DDProxy.prototype.centerFrame = false;

/**
 * Create the drag frame if needed
 */
YAHOO.util.DDProxy.createFrame = function() {
    var THIS = YAHOO.util.DDProxy;

    if (!document || !document.body) {
        setTimeout(THIS.createFrame, 50);
        return;
    }

    if (!THIS.frameDiv) {
        THIS.frameDiv = document.createElement("div");
        THIS.frameDiv.id = THIS.dragElId;
        var s = THIS.frameDiv.style;
        s.position = "absolute";
        s.visibility = "hidden";
        s.cursor = "move";
        s.border = "2px solid #aaa";
        s.zIndex = 999;

        document.body.appendChild(THIS.frameDiv);
    }
};

/**
 * Initialization for the drag frame element.  Must be called in the
 * constructor of all subclasses
 */
YAHOO.util.DDProxy.prototype.initFrame = function() {
    YAHOO.util.DDProxy.createFrame();
    this.setDragElId(YAHOO.util.DDProxy.dragElId);
    this.useAbsMath = true;
};

/**
 * Resizes the drag frame to the dimensions of the clicked object, positions
 * it over the object, and finally displays it
 *
 * @param {int} iPageX X click position
 * @param {int} iPageY Y click position
 * @private
 */
YAHOO.util.DDProxy.prototype.showFrame = function(iPageX, iPageY) {
    var el = this.getEl();

    var s = this.getDragEl().style;

    if (this.resizeFrame) {
        s.width = (parseInt(el.offsetWidth) - (2*this.borderWidth)) + "px";
        s.height = (parseInt(el.offsetHeight) - (2*this.borderWidth)) + "px";
    }

    if (this.centerFrame) {
        this.setDelta(Math.round(parseInt(s.width)/2),
                Math.round(parseInt(s.width)/2));
    }

    this.setDragElPos(iPageX, iPageY);

    s.visibility = "";
};

// overrides YAHOO.util.DragDrop
YAHOO.util.DDProxy.prototype.b4MouseDown = function(e) {
    var x = YAHOO.util.Event.getPageX(e);
    var y = YAHOO.util.Event.getPageY(e);
    this.autoOffset(x, y);
    this.setDragElPos(x, y);
};

// overrides YAHOO.util.DragDrop
YAHOO.util.DDProxy.prototype.b4StartDrag = function(x, y) {
    // show the drag frame
    this.showFrame(x, y);
};

// overrides YAHOO.util.DragDrop
YAHOO.util.DDProxy.prototype.b4EndDrag = function(e) {

    // hide the drag frame
    var s = this.getDragEl().style;
    s.visibility = "hidden";
};

// overrides YAHOO.util.DragDrop
// By default we try to move the element to the last location of the frame.
// This is so that the default behavior mirrors that of YAHOO.util.DD.
YAHOO.util.DDProxy.prototype.endDrag = function(e) {
    var lel = this.getEl();
    var del = this.getDragEl();

    // Show the drag frame briefly so we can get its position
    del.style.visibility = "";

    // Hide the linked element before the move to get around a Safari
    // rendering bug.
    lel.style.visibility = "hidden";
    YAHOO.util.DDM.moveToEl(lel, del);
    del.style.visibility = "hidden";
    lel.style.visibility = "";
};

/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

/**
 * @class a DragDrop implementation that does not move, but can be a drop
 * target.  You would get the same result by simply omitting implementation
 * for the event callbacks, but this way we reduce the processing cost of the
 * event listener and the callbacks.
 *
 * @extends YAHOO.util.DragDrop
 * @constructor
 * @param {String} id the id of the element that is a drop target
 * @param {String} sGroup the group of related DragDrop objects
 */

YAHOO.util.DDTarget = function(id, sGroup) {
    if (id) {
        this.initTarget(id, sGroup);
    }
};

YAHOO.util.DDTarget.prototype = new YAHOO.util.DragDrop();

/*
Copyright (c) 2006 Yahoo! Inc. All rights reserved.
version 0.9.0
*/

YAHOO.namespace("YAHOO.widget");

/**
* @class
* <p>YAHOO.widget.DateMath is used for simple date manipulation. The class is a static utility
* used for adding, subtracting, and comparing dates.</p>
*/
YAHOO.widget.DateMath = new function() {

	/**
	* Constant field representing Day
	* @type String
	*/
	this.DAY = "D";

	/**
	* Constant field representing Week
	* @type String
	*/
	this.WEEK = "W";

	/**
	* Constant field representing Year
	* @type String
	*/
	this.YEAR = "Y";

	/**
	* Constant field representing Month
	* @type String
	*/
	this.MONTH = "M";

	/**
	* Constant field representing one day, in milliseconds
	* @type Integer
	*/
	this.ONE_DAY_MS = 1000*60*60*24;

	/**
	* Adds the specified amount of time to the this instance.
	* @param {Date} date	The JavaScript Date object to perform addition on
	* @param {string} field	The this field constant to be used for performing addition.
	* @param {Integer} amount	The number of units (measured in the field constant) to add to the date.
	*/
	this.add = function(date, field, amount) {
		var d = new Date(date.getTime());
		switch (field)
		{
			case this.MONTH:
				var newMonth = date.getMonth() + amount;
				var years = 0;


				if (newMonth < 0) {
					while (newMonth < 0)
					{
						newMonth += 12;
						years -= 1;
					}
				} else if (newMonth > 11) {
					while (newMonth > 11)
					{
						newMonth -= 12;
						years += 1;
					}
				}

				d.setMonth(newMonth);
				d.setFullYear(date.getFullYear() + years);
				break;
			case this.DAY:
				d.setDate(date.getDate() + amount);
				break;
			case this.YEAR:
				d.setFullYear(date.getFullYear() + amount);
				break;
			case this.WEEK:
				d.setDate(date.getDate() + 7);
				break;
		}
		return d;
	};

	/**
	* Subtracts the specified amount of time from the this instance.
	* @param {Date} date	The JavaScript Date object to perform subtraction on
	* @param {Integer} field	The this field constant to be used for performing subtraction.
	* @param {Integer} amount	The number of units (measured in the field constant) to subtract from the date.
	*/
	this.subtract = function(date, field, amount) {
		return this.add(date, field, (amount*-1));
	};

	/**
	* Determines whether a given date is before another date on the calendar.
	* @param {Date} date		The Date object to compare with the compare argument
	* @param {Date} compareTo	The Date object to use for the comparison
	* @return {Boolean} true if the date occurs before the compared date; false if not.
	*/
	this.before = function(date, compareTo) {
		var ms = compareTo.getTime();
		if (date.getTime() < ms) {
			return true;
		} else {
			return false;
		}
	};

	/**
	* Determines whether a given date is after another date on the calendar.
	* @param {Date} date		The Date object to compare with the compare argument
	* @param {Date} compareTo	The Date object to use for the comparison
	* @return {Boolean} true if the date occurs after the compared date; false if not.
	*/
	this.after = function(date, compareTo) {
		var ms = compareTo.getTime();
		if (date.getTime() > ms) {
			return true;
		} else {
			return false;
		}
	};

	/**
	* Retrieves a JavaScript Date object representing January 1 of any given year.
	* @param {Integer} calendarYear		The calendar year for which to retrieve January 1
	* @return {Date}	January 1 of the calendar year specified.
	*/
	this.getJan1 = function(calendarYear) {
		return new Date(calendarYear,0,1);
	};

	/**
	* Calculates the number of days the specified date is from January 1 of the specified calendar year.
	* Passing January 1 to this function would return an offset value of zero.
	* @param {Date}	date	The JavaScript date for which to find the offset
	* @param {Integer} calendarYear	The calendar year to use for determining the offset
	* @return {Integer}	The number of days since January 1 of the given year
	*/
	this.getDayOffset = function(date, calendarYear) {
		var beginYear = this.getJan1(calendarYear); // Find the start of the year. This will be in week 1.

		// Find the number of days the passed in date is away from the calendar year start
		var dayOffset = Math.ceil((date.getTime()-beginYear.getTime()) / this.ONE_DAY_MS);
		return dayOffset;
	};

	/**
	* Calculates the week number for the given date. This function assumes that week 1 is the
	* week in which January 1 appears, regardless of whether the week consists of a full 7 days.
	* The calendar year can be specified to help find what a the week number would be for a given
	* date if the date overlaps years. For instance, a week may be considered week 1 of 2005, or
	* week 53 of 2004. Specifying the optional calendarYear allows one to make this distinction
	* easily.
	* @param {Date}	date	The JavaScript date for which to find the week number
	* @param {Integer} calendarYear	OPTIONAL - The calendar year to use for determining the week number. Default is
	*											the calendar year of parameter "date".
	* @param {Integer} weekStartsOn	OPTIONAL - The integer (0-6) representing which day a week begins on. Default is 0 (for Sunday).
	* @return {Integer}	The week number of the given date.
	*/
	this.getWeekNumber = function(date, calendarYear, weekStartsOn) {
		if (! weekStartsOn) {
			weekStartsOn = 0;
		}
		if (! calendarYear) {
			calendarYear = date.getFullYear();
		}
		var weekNum = -1;

		var jan1 = this.getJan1(calendarYear);
		var jan1DayOfWeek = jan1.getDay();

		var month = date.getMonth();
		var day = date.getDate();
		var year = date.getFullYear();

		var dayOffset = this.getDayOffset(date, calendarYear); // Days since Jan 1, Calendar Year

		if (dayOffset < 0 && dayOffset >= (-1 * jan1DayOfWeek)) {
			weekNum = 1;
		} else {
			weekNum = 1;
			var testDate = this.getJan1(calendarYear);

			while (testDate.getTime() < date.getTime() && testDate.getFullYear() == calendarYear) {
				weekNum += 1;
				testDate = this.add(testDate, this.WEEK, 1);
			}
		}

		return weekNum;
	};

	/**
	* Determines if a given week overlaps two different years.
	* @param {Date}	weekBeginDate	The JavaScript Date representing the first day of the week.
	* @return {Boolean}	true if the date overlaps two different years.
	*/
	this.isYearOverlapWeek = function(weekBeginDate) {
		var overlaps = false;
		var nextWeek = this.add(weekBeginDate, this.DAY, 6);
		if (nextWeek.getFullYear() != weekBeginDate.getFullYear()) {
			overlaps = true;
		}
		return overlaps;
	};

	/**
	* Determines if a given week overlaps two different months.
	* @param {Date}	weekBeginDate	The JavaScript Date representing the first day of the week.
	* @return {Boolean}	true if the date overlaps two different months.
	*/
	this.isMonthOverlapWeek = function(weekBeginDate) {
		var overlaps = false;
		var nextWeek = this.add(weekBeginDate, this.DAY, 6);
		if (nextWeek.getMonth() != weekBeginDate.getMonth()) {
			overlaps = true;
		}
		return overlaps;
	};

	/**
	* Gets the first day of a month containing a given date.
	* @param {Date}	date	The JavaScript Date used to calculate the month start
	* @return {Date}		The JavaScript Date representing the first day of the month
	*/
	this.findMonthStart = function(date) {
		var start = new Date(date.getFullYear(), date.getMonth(), 1);
		return start;
	};

	/**
	* Gets the last day of a month containing a given date.
	* @param {Date}	date	The JavaScript Date used to calculate the month end
	* @return {Date}		The JavaScript Date representing the last day of the month
	*/
	this.findMonthEnd = function(date) {
		var start = this.findMonthStart(date);
		var nextMonth = this.add(start, this.MONTH, 1);
		var end = this.subtract(nextMonth, this.DAY, 1);
		return end;
	};

	/**
	* Clears the time fields from a given date, effectively setting the time to midnight.
	* @param {Date}	date	The JavaScript Date for which the time fields will be cleared
	* @return {Date}		The JavaScript Date cleared of all time fields
	*/
	this.clearTime = function(date) {
		date.setHours(0,0,0,0);
		return date;
	};
}

YAHOO.namespace("YAHOO.widget");

/**
* @class
* <p>Calendar_Core is the base class for the Calendar widget. In its most basic
* implementation, it has the ability to render a calendar widget on the page
* that can be manipulated to select a single date, move back and forth between
* months and years.</p>
* <p>To construct the placeholder for the calendar widget, the code is as
* follows:
*	<xmp>
*		<div id="cal1Container"></div>
*	</xmp>
* Note that the table can be replaced with any kind of element.
* </p>
* @constructor
* @param {String}	id			The id of the table element that will represent the calendar widget
* @param {String}	containerId	The id of the container element that will contain the calendar table
* @param {String}	monthyear	The month/year string used to set the current calendar page
* @param {String}	selected	A string of date values formatted using the date parser. The built-in
								default date format is MM/DD/YYYY. Ranges are defined using
								MM/DD/YYYY-MM/DD/YYYY. Month/day combinations are defined using MM/DD.
								Any combination of these can be combined by delimiting the string with
								commas. Example: "12/24/2005,12/25,1/18/2006-1/21/2006"
*/
YAHOO.widget.Calendar_Core = function(id, containerId, monthyear, selected) {
	if (arguments.length > 0)
	{
		this.init(id, containerId, monthyear, selected);
	}
}

/**
* Type constant used for renderers to represent an individual date (M/D/Y)
* @final
* @type String
*/
YAHOO.widget.Calendar_Core.DATE = "D";

/**
* Type constant used for renderers to represent an individual date across any year (M/D)
* @final
* @type String
*/
YAHOO.widget.Calendar_Core.MONTH_DAY = "MD";

/**
* Type constant used for renderers to represent a weekday
* @final
* @type String
*/
YAHOO.widget.Calendar_Core.WEEKDAY = "WD";

/**
* Type constant used for renderers to represent a range of individual dates (M/D/Y-M/D/Y)
* @final
* @type String
*/
YAHOO.widget.Calendar_Core.RANGE = "R";

/**
* Type constant used for renderers to represent a month across any year
* @final
* @type String
*/
YAHOO.widget.Calendar_Core.MONTH = "M";

/**
* Constant that represents the total number of date cells that are displayed in a given month
* including
* @final
* @type Integer
*/
YAHOO.widget.Calendar_Core.DISPLAY_DAYS = 42;

/**
* Constant used for halting the execution of the remainder of the render stack
* @final
* @type String
*/
YAHOO.widget.Calendar_Core.STOP_RENDER = "S";

YAHOO.widget.Calendar_Core.prototype = {

	/**
	* The configuration object used to set up the calendars various locale and style options.
	* @type Object
	*/
	Config : null,

	/**
	* The parent CalendarGroup, only to be set explicitly by the parent group
	* @type CalendarGroup
	*/
	parent : null,

	/**
	* The index of this item in the parent group
	* @type Integer
	*/
	index : -1,

	/**
	* The collection of calendar table cells
	* @type HTMLTableCellElement[]
	*/
	cells : null,

	/**
	* The collection of calendar week header cells
	* @type HTMLTableCellElement[]
	*/
	weekHeaderCells : null,

	/**
	* The collection of calendar week footer cells
	* @type HTMLTableCellElement[]
	*/
	weekFooterCells : null,

	/**
	* The collection of calendar cell dates that is parallel to the cells collection. The array contains dates field arrays in the format of [YYYY, M, D].
	* @type Array[](Integer[])
	*/
	cellDates : null,

	/**
	* The id that uniquely identifies this calendar. This id should match the id of the placeholder element on the page.
	* @type String
	*/
	id : null,

	/**
	* The DOM element reference that points to this calendar's container element. The calendar will be inserted into this element when the shell is rendered.
	* @type HTMLElement
	*/
	oDomContainer : null,

	/**
	* A Date object representing today's date.
	* @type Date
	*/
	today : null,

	/**
	* The list of render functions, along with required parameters, used to render cells.
	* @type Array[]
	*/
	renderStack : null,

	/**
	* A copy of the initial render functions created before rendering.
	* @type Array
	* @private
	*/
	_renderStack : null,

	/**
	* A Date object representing the month/year that the calendar is currently set to
	* @type Date
	*/
	pageDate : null,

	/**
	* A Date object representing the month/year that the calendar is initially set to
	* @type Date
	* @private
	*/
	_pageDate : null,

	/**
	* A Date object representing the minimum selectable date
	* @type Date
	*/
	minDate : null,

	/**
	* A Date object representing the maximum selectable date
	* @type Date
	*/
	maxDate : null,

	/**
	* The list of currently selected dates. The data format for this local collection is
	* an array of date field arrays, e.g:
	* [
	*	[2004,5,25],
	*	[2004,5,26]
	* ]
	* @type Array[](Integer[])
	*/
	selectedDates : null,

	/**
	* The private list of initially selected dates.
	* @type Array
	* @private
	*/
	_selectedDates : null,

	/**
	* A boolean indicating whether the shell of the calendar has already been rendered to the page
	* @type Boolean
	*/
	shellRendered : false,

	/**
	* The HTML table element that represents this calendar
	* @type HTMLTableElement
	*/
	table : null,

	/**
	* The HTML cell element that represents the main header cell TH used in the calendar table
	* @type HTMLTableCellElement
	*/
	headerCell : null


};



/**
* Initializes the calendar widget. This method must be called by all subclass constructors.
* @param {String}	id			The id of the table element that will represent the calendar widget
* @param {String}	containerId	The id of the container element that will contain the calendar table
* @param {String}	monthyear	The month/year string used to set the current calendar page
* @param {String}	selected	A string of date values formatted using the date parser. The built-in
								default date format is MM/DD/YYYY. Ranges are defined using
								MM/DD/YYYY-MM/DD/YYYY. Month/day combinations are defined using MM/DD.
								Any combination of these can be combined by delimiting the string with
								commas. Example: "12/24/2005,12/25,1/18/2006-1/21/2006"
*/
YAHOO.widget.Calendar_Core.prototype.init = function(id, containerId, monthyear, selected) {
	this.setupConfig();

	this.id = id;

	this.cellDates = new Array();

	this.cells = new Array();

	this.renderStack = new Array();
	this._renderStack = new Array();

	this.oDomContainer = document.getElementById(containerId);

	this.today = new Date();
	YAHOO.widget.DateMath.clearTime(this.today);

	var month;
	var year;

	if (monthyear)
	{
		var aMonthYear = monthyear.split(this.Locale.DATE_FIELD_DELIMITER);
		month = parseInt(aMonthYear[this.Locale.MY_MONTH_POSITION-1]);
		year = parseInt(aMonthYear[this.Locale.MY_YEAR_POSITION-1]);
	} else {
		month = this.today.getMonth()+1;
		year = this.today.getFullYear();
	}

	this.pageDate = new Date(year, month-1, 1);
	this._pageDate = new Date(this.pageDate.getTime());

	if (selected)
	{
		this.selectedDates = this._parseDates(selected);
		this._selectedDates = this.selectedDates.concat();
	} else {
		this.selectedDates = new Array();
		this._selectedDates = new Array();
	}

	this.wireDefaultEvents();
	this.wireCustomEvents();
};


/**
* Wires the local DOM events for the Calendar, including cell selection, hover, and
* default navigation that is used for moving back and forth between calendar pages.
*/
YAHOO.widget.Calendar_Core.prototype.wireDefaultEvents = function() {

	/**
	* The default event function that is attached to a date link within a calendar cell
	* when the calendar is rendered.
	* @param	e		The event
	* @param	cal		A reference to the calendar passed by the Event utility
	*/
	this.doSelectCell = function(e, cal) {
		var cell = this;
		var index = cell.index;

		if (cal.Options.MULTI_SELECT) {
			var link = cell.getElementsByTagName("A")[0];
			link.blur();

			var cellDate = cal.cellDates[index];
			var cellDateIndex = cal._indexOfSelectedFieldArray(cellDate);

			if (cellDateIndex > -1)
			{
				cal.deselectCell(index);
			} else {
				cal.selectCell(index);
			}

		} else {
			var link = cell.getElementsByTagName("A")[0];
			link.blur()

			cal.selectCell(index);
		}
	}

	/**
	* The event that is executed when the user hovers over a cell
	* @param	e		The event
	* @param	cal		A reference to the calendar passed by the Event utility
	* @private
	*/
	this.doCellMouseOver = function(e, cal) {
		YAHOO.widget.Calendar_Core.prependCssClass(this, cal.Style.CSS_CELL_HOVER);
	}

	/**
	* The event that is executed when the user moves the mouse out of a cell
	* @param	e		The event
	* @param	cal		A reference to the calendar passed by the Event utility
	* @private
	*/
	this.doCellMouseOut = function(e, cal) {
		YAHOO.widget.Calendar_Core.removeCssClass(this, cal.Style.CSS_CELL_HOVER);
	}

	/**
	* A wrapper event that executes the nextMonth method through a DOM event
	* @param	e		The event
	* @param	cal		A reference to the calendar passed by the Event utility
	* @private
	*/
	this.doNextMonth = function(e, cal) {
		cal.nextMonth();
	}

	/**
	* A wrapper event that executes the previousMonth method through a DOM event
	* @param	e		The event
	* @param	cal		A reference to the calendar passed by the Event utility
	* @private
	*/
	this.doPreviousMonth = function(e, cal) {
		cal.previousMonth();
	}
}

/**
* This function can be extended by subclasses to attach additional DOM events to
* the calendar. By default, this method is unimplemented.
*/
YAHOO.widget.Calendar_Core.prototype.wireCustomEvents = function() { }

/**
This method is called to initialize the widget configuration variables, including
style, localization, and other display and behavioral options.
<p>Config: Container for the CSS style configuration variables.</p>
<p><strong>Config.Style</strong> - Defines the CSS classes used for different calendar elements</p>
<blockquote>
	<div><em>CSS_CALENDAR</em> : Container table</div>
	<div><em>CSS_HEADER</em> : </div>
	<div><em>CSS_HEADER_TEXT</em> : Calendar header</div>
	<div><em>CSS_FOOTER</em> : Calendar footer</div>
	<div><em>CSS_CELL</em> : Calendar day cell</div>
	<div><em>CSS_CELL_OOM</em> : Calendar OOM (out of month) cell</div>
	<div><em>CSS_CELL_SELECTED</em> : Calendar selected cell</div>
	<div><em>CSS_CELL_RESTRICTED</em> : Calendar restricted cell</div>
	<div><em>CSS_CELL_TODAY</em> : Calendar cell for today's date</div>
	<div><em>CSS_ROW_HEADER</em> : The cell preceding a row (used for week number by default)</div>
	<div><em>CSS_ROW_FOOTER</em> : The cell following a row (not implemented by default)</div>
	<div><em>CSS_WEEKDAY_CELL</em> : The cells used for labeling weekdays</div>
	<div><em>CSS_WEEKDAY_ROW</em> : The row containing the weekday label cells</div>
	<div><em>CSS_BORDER</em> : The border style used for the default UED rendering</div>
	<div><em>CSS_CONTAINER</em> : Special container class used to properly adjust the sizing and float</div>
	<div><em>CSS_NAV_LEFT</em> : Left navigation arrow</div>
	<div><em>CSS_NAV_RIGHT</em> : Right navigation arrow</div>
	<div><em>CSS_CELL_TOP</em> : Outlying cell along the top row</div>
	<div><em>CSS_CELL_LEFT</em> : Outlying cell along the left row</div>
	<div><em>CSS_CELL_RIGHT</em> : Outlying cell along the right row</div>
	<div><em>CSS_CELL_BOTTOM</em> : Outlying cell along the bottom row</div>
	<div><em>CSS_CELL_HOVER</em> : Cell hover style</div>
	<div><em>CSS_CELL_HIGHLIGHT1</em> : Highlight color 1 for styling cells</div>
	<div><em>CSS_CELL_HIGHLIGHT2</em> : Highlight color 2 for styling cells</div>
	<div><em>CSS_CELL_HIGHLIGHT3</em> : Highlight color 3 for styling cells</div>
	<div><em>CSS_CELL_HIGHLIGHT4</em> : Highlight color 4 for styling cells</div>

</blockquote>
<p><strong>Config.Locale</strong> - Defines the locale string arrays used for localization</p>
<blockquote>
	<div><em>MONTHS_SHORT</em> : Array of 12 months in short format ("Jan", "Feb", etc.)</div>
	<div><em>MONTHS_LONG</em> : Array of 12 months in short format ("Jan", "Feb", etc.)</div>
	<div><em>WEEKDAYS_1CHAR</em> : Array of 7 days in 1-character format ("S", "M", etc.)</div>
	<div><em>WEEKDAYS_SHORT</em> : Array of 7 days in short format ("Su", "Mo", etc.)</div>
	<div><em>WEEKDAYS_MEDIUM</em> : Array of 7 days in medium format ("Sun", "Mon", etc.)</div>
	<div><em>WEEKDAYS_LONG</em> : Array of 7 days in long format ("Sunday", "Monday", etc.)</div>
	<div><em>DATE_DELIMITER</em> : The value used to delimit series of multiple dates (Default: ",")</div>
	<div><em>DATE_FIELD_DELIMITER</em> : The value used to delimit date fields (Default: "/")</div>
	<div><em>DATE_RANGE_DELIMITER</em> : The value used to delimit date fields (Default: "-")</div>
	<div><em>MY_MONTH_POSITION</em> : The value used to determine the position of the month in a month/year combo (e.g. 12/2005) (Default: 1)</div>
	<div><em>MY_YEAR_POSITION</em> : The value used to determine the position of the year in a month/year combo (e.g. 12/2005) (Default: 2)</div>
	<div><em>MD_MONTH_POSITION</em> : The value used to determine the position of the month in a month/day combo (e.g. 12/25) (Default: 1)</div>
	<div><em>MD_DAY_POSITION</em> : The value used to determine the position of the day in a month/day combo (e.g. 12/25) (Default: 2)</div>
	<div><em>MDY_MONTH_POSITION</em> : The value used to determine the position of the month in a month/day/year combo (e.g. 12/25/2005) (Default: 1)</div>
	<div><em>MDY_DAY_POSITION</em> : The value used to determine the position of the day in a month/day/year combo (e.g. 12/25/2005) (Default: 2)</div>
	<div><em>MDY_YEAR_POSITION</em> : The value used to determine the position of the year in a month/day/year combo (e.g. 12/25/2005) (Default: 3)</div>
</blockquote>
<p><strong>Config.Options</strong> - Defines other configurable calendar widget options</p>
<blockquote>
	<div><em>SHOW_WEEKDAYS</em> : Boolean, determines whether to display the weekday headers (defaults to true)</div>
	<div><em>LOCALE_MONTHS</em> : Array, points to the desired Config.Locale array (defaults to Config.Locale.MONTHS_LONG)</div>
	<div><em>LOCALE_WEEKDAYS</em> : Array, points to the desired Config.Locale array (defaults to Config.Locale.WEEKDAYS_SHORT)</div>
	<div><em>START_WEEKDAY</em> : Integer, 0-6, representing the day that a week begins on</div>
	<div><em>SHOW_WEEK_HEADER</em> : Boolean, determines whether to display row headers</div>
	<div><em>SHOW_WEEK_FOOTER</em> : Boolean, determines whether to display row footers</div>
	<div><em>HIDE_BLANK_WEEKS</em> : Boolean, determines whether to hide extra weeks that are completely OOM</div>
	<div><em>NAV_ARROW_LEFT</em> : String, the image path used for the left navigation arrow</div>
	<div><em>NAV_ARROW_RIGHT</em> : String, the image path used for the right navigation arrow</div>
</blockquote>
*/
YAHOO.widget.Calendar_Core.prototype.setupConfig = function() {
	/**
	* Container for the CSS style configuration variables.
	*/
	this.Config = new Object();

	this.Config.Style = {
		// Style variables
		CSS_ROW_HEADER: "calrowhead",
		CSS_ROW_FOOTER: "calrowfoot",
		CSS_CELL : "calcell",
		CSS_CELL_SELECTED : "selected",
		CSS_CELL_RESTRICTED : "restricted",
		CSS_CELL_TODAY : "today",
		CSS_CELL_OOM : "oom",
		CSS_HEADER : "calheader",
		CSS_HEADER_TEXT : "calhead",
		CSS_WEEKDAY_CELL : "calweekdaycell",
		CSS_WEEKDAY_ROW : "calweekdayrow",
		CSS_FOOTER : "calfoot",
		CSS_CALENDAR : "calendar",
		CSS_BORDER : "calbordered",
		CSS_CONTAINER : "calcontainer",
		CSS_NAV_LEFT : "calnavleft",
		CSS_NAV_RIGHT : "calnavright",
		CSS_CELL_TOP : "calcelltop",
		CSS_CELL_LEFT : "calcellleft",
		CSS_CELL_RIGHT : "calcellright",
		CSS_CELL_BOTTOM : "calcellbottom",
		CSS_CELL_HOVER : "calcellhover",
		CSS_CELL_HIGHLIGHT1 : "highlight1",
		CSS_CELL_HIGHLIGHT2 : "highlight2",
		CSS_CELL_HIGHLIGHT3 : "highlight3",
		CSS_CELL_HIGHLIGHT4 : "highlight4"
	};

	this.Style = this.Config.Style;

	this.Config.Locale = {
		// Locale definition
		MONTHS_SHORT : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		MONTHS_LONG : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		WEEKDAYS_1CHAR : ["S", "M", "T", "W", "T", "F", "S"],
		WEEKDAYS_SHORT : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		WEEKDAYS_MEDIUM : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		WEEKDAYS_LONG : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		DATE_DELIMITER : ",",
		DATE_FIELD_DELIMITER : "/",
		DATE_RANGE_DELIMITER : "-",
		MY_MONTH_POSITION : 1,
		MY_YEAR_POSITION : 2,
		MD_MONTH_POSITION : 1,
		MD_DAY_POSITION : 2,
		MDY_MONTH_POSITION : 1,
		MDY_DAY_POSITION : 2,
		MDY_YEAR_POSITION : 3
	};

	this.Locale = this.Config.Locale;

	this.Config.Options = {
		// Configuration variables
		MULTI_SELECT : false,
		SHOW_WEEKDAYS : true,
		START_WEEKDAY : 0,
		SHOW_WEEK_HEADER : false,
		SHOW_WEEK_FOOTER : false,
		HIDE_BLANK_WEEKS : false,
		NAV_ARROW_LEFT : "img/callt.gif",
		NAV_ARROW_RIGHT : "img/calrt.gif"
	};

	this.Options = this.Config.Options;

	this.customConfig();

	if (! this.Options.LOCALE_MONTHS) {
		this.Options.LOCALE_MONTHS=this.Locale.MONTHS_LONG;
	}
	if (! this.Options.LOCALE_WEEKDAYS) {
		this.Options.LOCALE_WEEKDAYS=this.Locale.WEEKDAYS_SHORT;
	}

	// If true, reconfigure weekday arrays to place Mondays first
	if (this.Options.START_WEEKDAY > 0)
	{
		for (var w=0;w<this.Options.START_WEEKDAY;++w) {
			this.Locale.WEEKDAYS_SHORT.push(this.Locale.WEEKDAYS_SHORT.shift());
			this.Locale.WEEKDAYS_MEDIUM.push(this.Locale.WEEKDAYS_MEDIUM.shift());
			this.Locale.WEEKDAYS_LONG.push(this.Locale.WEEKDAYS_LONG.shift());
		}
	}
};

/**
* This method is called when subclasses need to override configuration variables
* or create new ones. Values can be explicitly set as follows:
* <blockquote><code>
*	this.Config.Style.CSS_CELL = "newcalcell";
*	this.Config.Locale.MONTHS_SHORT = ["Jan", "F�v", "Mars", "Avr", "Mai", "Juin", "Juil", "Ao�t", "Sept", "Oct", "Nov", "D�c"];
* </code></blockquote>
*/
YAHOO.widget.Calendar_Core.prototype.customConfig = function() { };

/**
* Builds the date label that will be displayed in the calendar header or
* footer, depending on configuration.
* @return	The formatted calendar month label
* @type String
*/
YAHOO.widget.Calendar_Core.prototype.buildMonthLabel = function() {
	var text = this.Options.LOCALE_MONTHS[this.pageDate.getMonth()] + " " + this.pageDate.getFullYear();
	return text;
};

/**
* Builds the date digit that will be displayed in calendar cells
* @return	The formatted day label
* @type	String
*/
YAHOO.widget.Calendar_Core.prototype.buildDayLabel = function(workingDate) {
	var day = workingDate.getDate();
	return day;
};



/**
* Builds the calendar table shell that will be filled in with dates and formatting.
* This method calls buildShellHeader, buildShellBody, and buildShellFooter (in that order)
* to construct the pieces of the calendar table. The construction of the shell should
* only happen one time when the calendar is initialized.
*/
YAHOO.widget.Calendar_Core.prototype.buildShell = function() {

	this.table = document.createElement("TABLE");
	this.table.cellSpacing = 0;
	YAHOO.widget.Calendar_Core.setCssClasses(this.table, [this.Style.CSS_CALENDAR]);

	this.table.id = this.id;

	this.buildShellHeader();
	this.buildShellBody();
	this.buildShellFooter();

	YAHOO.util.Event.addListener(window, "unload", this._unload, this);
};

/**
* Builds the calendar shell header by inserting a THEAD into the local calendar table.
*/
YAHOO.widget.Calendar_Core.prototype.buildShellHeader = function() {
	var head = document.createElement("THEAD");
	var headRow = document.createElement("TR");

	var headerCell = document.createElement("TH");

	var colSpan = 7;
	if (this.Config.Options.SHOW_WEEK_HEADER) {
		this.weekHeaderCells = new Array();
		colSpan += 1;
	}
	if (this.Config.Options.SHOW_WEEK_FOOTER) {
		this.weekFooterCells = new Array();
		colSpan += 1;
	}

	headerCell.colSpan = colSpan;

	YAHOO.widget.Calendar_Core.setCssClasses(headerCell,[this.Style.CSS_HEADER_TEXT]);

	this.headerCell = headerCell;

	headRow.appendChild(headerCell);
	head.appendChild(headRow);

	// Append day labels, if needed
	if (this.Options.SHOW_WEEKDAYS)
	{
		var row = document.createElement("TR");
		var fillerCell;

		YAHOO.widget.Calendar_Core.setCssClasses(row,[this.Style.CSS_WEEKDAY_ROW]);

		if (this.Config.Options.SHOW_WEEK_HEADER) {
			fillerCell = document.createElement("TH");
			YAHOO.widget.Calendar_Core.setCssClasses(fillerCell,[this.Style.CSS_WEEKDAY_CELL]);
			row.appendChild(fillerCell);
		}

		for(var i=0;i<this.Options.LOCALE_WEEKDAYS.length;++i)
		{
			var cell = document.createElement("TH");
			YAHOO.widget.Calendar_Core.setCssClasses(cell,[this.Style.CSS_WEEKDAY_CELL]);
			cell.innerHTML=this.Options.LOCALE_WEEKDAYS[i];
			row.appendChild(cell);
		}

		if (this.Config.Options.SHOW_WEEK_FOOTER) {
			fillerCell = document.createElement("TH");
			YAHOO.widget.Calendar_Core.setCssClasses(fillerCell,[this.Style.CSS_WEEKDAY_CELL]);
			row.appendChild(fillerCell);
		}

		head.appendChild(row);
	}

	this.table.appendChild(head);
};

/**
* Builds the calendar shell body (6 weeks by 7 days)
*/
YAHOO.widget.Calendar_Core.prototype.buildShellBody = function() {
	// This should only get executed once
	this.tbody = document.createElement("TBODY");

	for (var r=0;r<6;++r)
	{
		var row = document.createElement("TR");

		for (var c=0;c<this.headerCell.colSpan;++c)
		{
			var cell;
			if (this.Config.Options.SHOW_WEEK_HEADER && c===0) { // Row header
				cell = document.createElement("TH");
				this.weekHeaderCells[this.weekHeaderCells.length] = cell;
			} else if (this.Config.Options.SHOW_WEEK_FOOTER && c==(this.headerCell.colSpan-1)){ // Row footer
				cell = document.createElement("TH");
				this.weekFooterCells[this.weekFooterCells.length] = cell;
			} else {
				cell = document.createElement("TD");
				this.cells[this.cells.length] = cell;
				YAHOO.widget.Calendar_Core.setCssClasses(cell, [this.Style.CSS_CELL]);
			}

			row.appendChild(cell);
		}
		this.tbody.appendChild(row);
	}

	this.table.appendChild(this.tbody);
};

/**
* Builds the calendar shell footer. In the default implementation, there is
* no footer.
*/
YAHOO.widget.Calendar_Core.prototype.buildShellFooter = function() { };

/**
* Outputs the calendar shell to the DOM, inserting it into the placeholder element.
*/
YAHOO.widget.Calendar_Core.prototype.renderShell = function() {
	this.oDomContainer.appendChild(this.table);
	this.shellRendered = true;
};

/**
* Renders the calendar after it has been configured. The render() method has a specific call chain that will execute
* when the method is called: renderHeader, renderBody, renderFooter.
* Refer to the documentation for those methods for information on
* individual render tasks.
*/
YAHOO.widget.Calendar_Core.prototype.render = function() {
	if (! this.shellRendered)
	{
		this.buildShell();
		this.renderShell();
	}

	this.resetRenderers();

	this.cellDates.length = 0;

	// Find starting day of the current month
	var workingDate = YAHOO.widget.DateMath.findMonthStart(this.pageDate);

	this.renderHeader();
	this.renderBody(workingDate);
	this.renderFooter();

	this.onRender();
};



/**
* Appends the header contents into the widget header.
*/
YAHOO.widget.Calendar_Core.prototype.renderHeader = function() {
	this.headerCell.innerHTML = "";

	var headerContainer = document.createElement("DIV");
	headerContainer.className = this.Style.CSS_HEADER;

	headerContainer.appendChild(document.createTextNode(this.buildMonthLabel()));

	this.headerCell.appendChild(headerContainer);
};

/**
* Appends the calendar body. The default implementation calculates the number of
* OOM (out of month) cells that need to be rendered at the start of the month, renders those,
* and renders all the day cells using the built-in cell rendering methods.
*
* While iterating through all of the cells, the calendar checks for renderers in the
* local render stack that match the date of the current cell, and then applies styles
* as necessary.
*
* @param {Date}	workingDate	The current working Date object being used to generate the calendar
*/
YAHOO.widget.Calendar_Core.prototype.renderBody = function(workingDate) {

	this.preMonthDays = workingDate.getDay();
	if (this.Options.START_WEEKDAY > 0) {
		this.preMonthDays -= this.Options.START_WEEKDAY;
	}
	if (this.preMonthDays < 0) {
		this.preMonthDays += 7;
	}

	this.monthDays = YAHOO.widget.DateMath.findMonthEnd(workingDate).getDate();
	this.postMonthDays = YAHOO.widget.Calendar_Core.DISPLAY_DAYS-this.preMonthDays-this.monthDays;

	workingDate = YAHOO.widget.DateMath.subtract(workingDate, YAHOO.widget.DateMath.DAY, this.preMonthDays);

	this.table.style.visibility = "hidden"; // Hide while we render

	var weekRowIndex = 0;

	for (var c=0;c<this.cells.length;++c)
	{
		var cellRenderers = new Array();

		var cell = this.cells[c];

		this.clearElement(cell);

		YAHOO.util.Event.removeListener(cell, "click", this.doSelectCell);
		if (YAHOO.widget.Calendar_Core._getBrowser() == "ie") {
			YAHOO.util.Event.removeListener(cell, "mouseover", this.doCellMouseOver);
			YAHOO.util.Event.removeListener(cell, "mouseout", this.doCellMouseOut);
		}

		cell.index = c;
		cell.id = this.id + "_cell" + c;

		this.cellDates[this.cellDates.length]=[workingDate.getFullYear(),workingDate.getMonth()+1,workingDate.getDate()]; // Add this date to cellDates

		if (workingDate.getDay() == this.Options.START_WEEKDAY) {
			var rowHeaderCell = null;
			var rowFooterCell = null;

			if (this.Options.SHOW_WEEK_HEADER) {
				rowHeaderCell = this.weekHeaderCells[weekRowIndex];
				this.clearElement(rowHeaderCell);
			}

			if (this.Options.SHOW_WEEK_FOOTER) {
				rowFooterCell = this.weekFooterCells[weekRowIndex];
				this.clearElement(rowFooterCell);
			}

			if (this.Options.HIDE_BLANK_WEEKS && this.isDateOOM(workingDate) && ! YAHOO.widget.DateMath.isMonthOverlapWeek(workingDate)) {
				// The first day of the week is not in this month, and it's not an overlap week
				continue;
			} else {
				if (rowHeaderCell) {
					this.renderRowHeader(workingDate, rowHeaderCell);
				}
				if (rowFooterCell) {
					this.renderRowFooter(workingDate, rowFooterCell);
				}
			}
		}



		var renderer = null;

		if (workingDate.getFullYear()	== this.today.getFullYear() &&
			workingDate.getMonth()		== this.today.getMonth() &&
			workingDate.getDate()		== this.today.getDate())
		{
			cellRenderers[cellRenderers.length]=this.renderCellStyleToday;
		}

		if (this.isDateOOM(workingDate))
		{
			cellRenderers[cellRenderers.length]=this.renderCellNotThisMonth;
		} else {
			for (var r=0;r<this.renderStack.length;++r)
			{
				var rArray = this.renderStack[r];
				var type = rArray[0];

				var month;
				var day;
				var year;

				switch (type) {
					case YAHOO.widget.Calendar_Core.DATE:
						month = rArray[1][1];
						day = rArray[1][2];
						year = rArray[1][0];

						if (workingDate.getMonth()+1 == month && workingDate.getDate() == day && workingDate.getFullYear() == year)
						{
							renderer = rArray[2];
							this.renderStack.splice(r,1);
						}
						break;
					case YAHOO.widget.Calendar_Core.MONTH_DAY:
						month = rArray[1][0];
						day = rArray[1][1];

						if (workingDate.getMonth()+1 == month && workingDate.getDate() == day)
						{
							renderer = rArray[2];
							this.renderStack.splice(r,1);
						}
						break;
					case YAHOO.widget.Calendar_Core.RANGE:
						var date1 = rArray[1][0];
						var date2 = rArray[1][1];

						var d1month = date1[1];
						var d1day = date1[2];
						var d1year = date1[0];

						var d1 = new Date(d1year, d1month-1, d1day);

						var d2month = date2[1];
						var d2day = date2[2];
						var d2year = date2[0];

						var d2 = new Date(d2year, d2month-1, d2day);

						if (workingDate.getTime() >= d1.getTime() && workingDate.getTime() <= d2.getTime())
						{
							renderer = rArray[2];

							if (workingDate.getTime()==d2.getTime()) {
								this.renderStack.splice(r,1);
							}
						}
						break;
					case YAHOO.widget.Calendar_Core.WEEKDAY:

						var weekday = rArray[1][0];
						if (workingDate.getDay()+1 == weekday)
						{
							renderer = rArray[2];
						}
						break;
					case YAHOO.widget.Calendar_Core.MONTH:

						month = rArray[1][0];
						if (workingDate.getMonth()+1 == month)
						{
							renderer = rArray[2];
						}
						break;
				}

				if (renderer) {
					cellRenderers[cellRenderers.length]=renderer;
				}
			}

		}

		if (this._indexOfSelectedFieldArray([workingDate.getFullYear(),workingDate.getMonth()+1,workingDate.getDate()]) > -1)
		{
			cellRenderers[cellRenderers.length]=this.renderCellStyleSelected;
		}

		if (this.minDate)
		{
			this.minDate = YAHOO.widget.DateMath.clearTime(this.minDate);
		}
		if (this.maxDate)
		{
			this.maxDate = YAHOO.widget.DateMath.clearTime(this.maxDate);
		}

		if (
			(this.minDate && (workingDate.getTime() < this.minDate.getTime())) ||
			(this.maxDate && (workingDate.getTime() > this.maxDate.getTime()))
		) {
			cellRenderers[cellRenderers.length]=this.renderOutOfBoundsDate;
		} else {
			cellRenderers[cellRenderers.length]=this.renderCellDefault;
		}

		for (var x=0;x<cellRenderers.length;++x)
		{
			var ren = cellRenderers[x];
			if (ren.call(this,workingDate,cell) == YAHOO.widget.Calendar_Core.STOP_RENDER) {
				break;
			}
		}

		workingDate = YAHOO.widget.DateMath.add(workingDate, YAHOO.widget.DateMath.DAY, 1); // Go to the next day
		if (workingDate.getDay() == this.Options.START_WEEKDAY) {
			weekRowIndex += 1;
		}

		YAHOO.widget.Calendar_Core.addCssClass(cell, this.Style.CSS_CELL);
		if (c >= 0 && c <= 6) {
			YAHOO.widget.Calendar_Core.addCssClass(cell, this.Style.CSS_CELL_TOP);
		}
		if ((c % 7) == 0) {
			YAHOO.widget.Calendar_Core.addCssClass(cell, this.Style.CSS_CELL_LEFT);
		}
		if (((c+1) % 7) == 0) {
			YAHOO.widget.Calendar_Core.addCssClass(cell, this.Style.CSS_CELL_RIGHT);
		}

		var postDays = this.postMonthDays;
		if (postDays >= 7 && this.Options.HIDE_BLANK_WEEKS) {
			var blankWeeks = Math.floor(postDays/7);
			for (var p=0;p<blankWeeks;++p) {
				postDays -= 7;
			}
		}

		if (c >= ((this.preMonthDays+postDays+this.monthDays)-7)) {
			YAHOO.widget.Calendar_Core.addCssClass(cell, this.Style.CSS_CELL_BOTTOM);
		}
	}

	this.table.style.visibility = "visible"; // Show table, now that it's rendered

};

/**
* Appends the contents of the calendar widget footer into the shell. By default,
* the calendar does not contain a footer, and this method must be implemented by
* subclassing the widget.
*/
YAHOO.widget.Calendar_Core.prototype.renderFooter = function() { };

/**
* @private
*/
YAHOO.widget.Calendar_Core.prototype._unload = function(e, cal) {
	for (var c in cal.cells) {
		c = null;
	}

	cal.cells = null;

	cal.tbody = null;
	cal.oDomContainer = null;
	cal.table = null;
	cal.headerCell = null;

	cal = null;
};


/****************** BEGIN BUILT-IN TABLE CELL RENDERERS ************************************/

YAHOO.widget.Calendar_Core.prototype.renderOutOfBoundsDate = function(workingDate, cell) {
	YAHOO.widget.Calendar_Core.addCssClass(cell, "previous");
	cell.innerHTML = workingDate.getDate();
	return YAHOO.widget.Calendar_Core.STOP_RENDER;
}

/**
* Renders the row header for a week. The date passed in should be
* the first date of the given week.
* @param {Date}					workingDate		The current working Date object (beginning of the week) being used to generate the calendar
* @param {HTMLTableCellElement}	cell			The current working cell in the calendar
*/
YAHOO.widget.Calendar_Core.prototype.renderRowHeader = function(workingDate, cell) {
	YAHOO.widget.Calendar_Core.addCssClass(cell, this.Style.CSS_ROW_HEADER);

	var useYear = this.pageDate.getFullYear();

	if (! YAHOO.widget.DateMath.isYearOverlapWeek(workingDate)) {
		useYear = workingDate.getFullYear();
	}

	var weekNum = YAHOO.widget.DateMath.getWeekNumber(workingDate, useYear, this.Options.START_WEEKDAY);
	cell.innerHTML = weekNum;

	if (this.isDateOOM(workingDate) && ! YAHOO.widget.DateMath.isMonthOverlapWeek(workingDate)) {
		YAHOO.widget.Calendar_Core.addCssClass(cell, this.Style.CSS_CELL_OOM);
	}
};

/**
* Renders the row footer for a week. The date passed in should be
* the first date of the given week.
* @param {Date}					workingDate		The current working Date object (beginning of the week) being used to generate the calendar
* @param {HTMLTableCellElement}	cell			The current working cell in the calendar
*/
YAHOO.widget.Calendar_Core.prototype.renderRowFooter = function(workingDate, cell) {
	YAHOO.widget.Calendar_Core.addCssClass(cell, this.Style.CSS_ROW_FOOTER);

	if (this.isDateOOM(workingDate) && ! YAHOO.widget.DateMath.isMonthOverlapWeek(workingDate)) {
		YAHOO.widget.Calendar_Core.addCssClass(cell, this.Style.CSS_CELL_OOM);
	}
};

/**
* Renders a single standard calendar cell in the calendar widget table.
* All logic for determining how a standard default cell will be rendered is
* encapsulated in this method, and must be accounted for when extending the
* widget class.
* @param {Date}					workingDate		The current working Date object being used to generate the calendar
* @param {HTMLTableCellElement}	cell			The current working cell in the calendar
* @return YAHOO.widget.Calendar_Core.STOP_RENDER if rendering should stop with this style, null or nothing if rendering
*			should not be terminated
* @type String
*/
YAHOO.widget.Calendar_Core.prototype.renderCellDefault = function(workingDate, cell) {
	cell.innerHTML = "";
	var link = document.createElement("a");

	link.href="javascript:void(null);";
	link.name=this.id+"__"+workingDate.getFullYear()+"_"+(workingDate.getMonth()+1)+"_"+workingDate.getDate();

	//link.onclick = this._selectEventLink;
	//cell.onclick = this.doSelectCell;

	YAHOO.util.Event.addListener(cell, "click", this.doSelectCell, this);
	if (YAHOO.widget.Calendar_Core._getBrowser() == "ie") {
		YAHOO.util.Event.addListener(cell, "mouseover", this.doCellMouseOver, this);
		YAHOO.util.Event.addListener(cell, "mouseout", this.doCellMouseOut, this);
	}
	link.appendChild(document.createTextNode(this.buildDayLabel(workingDate)));
	cell.appendChild(link);

	//cell.onmouseover = this.doCellMouseOver;
	//cell.onmouseout = this.doCellMouseOut;
};

YAHOO.widget.Calendar_Core.prototype.renderCellStyleHighlight1 = function(workingDate, cell) {
	YAHOO.widget.Calendar_Core.addCssClass(cell, this.Style.CSS_CELL_HIGHLIGHT1);
};
YAHOO.widget.Calendar_Core.prototype.renderCellStyleHighlight2 = function(workingDate, cell) {
	YAHOO.widget.Calendar_Core.addCssClass(cell, this.Style.CSS_CELL_HIGHLIGHT2);
};
YAHOO.widget.Calendar_Core.prototype.renderCellStyleHighlight3 = function(workingDate, cell) {
	YAHOO.widget.Calendar_Core.addCssClass(cell, this.Style.CSS_CELL_HIGHLIGHT3);
};
YAHOO.widget.Calendar_Core.prototype.renderCellStyleHighlight4 = function(workingDate, cell) {
	YAHOO.widget.Calendar_Core.addCssClass(cell, this.Style.CSS_CELL_HIGHLIGHT4);
};

/**
* Applies the default style used for rendering today's date to the current calendar cell
* @param {Date}					workingDate		The current working Date object being used to generate the calendar
* @param {HTMLTableCellElement}	cell			The current working cell in the calendar
* @return	YAHOO.widget.Calendar_Core.STOP_RENDER if rendering should stop with this style, null or nothing if rendering
*			should not be terminated
* @type String
*/
YAHOO.widget.Calendar_Core.prototype.renderCellStyleToday = function(workingDate, cell) {
	YAHOO.widget.Calendar_Core.addCssClass(cell, this.Style.CSS_CELL_TODAY);
};

/**
* Applies the default style used for rendering selected dates to the current calendar cell
* @param {Date}					workingDate		The current working Date object being used to generate the calendar
* @param {HTMLTableCellElement}	cell			The current working cell in the calendar
* @return	YAHOO.widget.Calendar_Core.STOP_RENDER if rendering should stop with this style, null or nothing if rendering
*			should not be terminated
* @type String
*/
YAHOO.widget.Calendar_Core.prototype.renderCellStyleSelected = function(workingDate, cell) {
	YAHOO.widget.Calendar_Core.addCssClass(cell, this.Style.CSS_CELL_SELECTED);
};

/**
* Applies the default style used for rendering dates that are not a part of the current
* month (preceding or trailing the cells for the current month)
* @param {Date}					workingDate		The current working Date object being used to generate the calendar
* @param {HTMLTableCellElement}	cell			The current working cell in the calendar
* @return	YAHOO.widget.Calendar_Core.STOP_RENDER if rendering should stop with this style, null or nothing if rendering
*			should not be terminated
* @type String
*/
YAHOO.widget.Calendar_Core.prototype.renderCellNotThisMonth = function(workingDate, cell) {
	YAHOO.widget.Calendar_Core.addCssClass(cell, this.Style.CSS_CELL_OOM);
	cell.innerHTML=workingDate.getDate();
	return YAHOO.widget.Calendar_Core.STOP_RENDER;
};

/**
* Renders the current calendar cell as a non-selectable "black-out" date using the default
* restricted style.
* @param {Date}					workingDate		The current working Date object being used to generate the calendar
* @param {HTMLTableCellElement}	cell			The current working cell in the calendar
* @return	YAHOO.widget.Calendar_Core.STOP_RENDER if rendering should stop with this style, null or nothing if rendering
*			should not be terminated
* @type String
*/
YAHOO.widget.Calendar_Core.prototype.renderBodyCellRestricted = function(workingDate, cell) {
	YAHOO.widget.Calendar_Core.setCssClasses(cell, [this.Style.CSS_CELL,this.Style.CSS_CELL_RESTRICTED]);
	cell.innerHTML=workingDate.getDate();
	return YAHOO.widget.Calendar_Core.STOP_RENDER;
};
/******************** END BUILT-IN TABLE CELL RENDERERS ************************************/

/******************** BEGIN MONTH NAVIGATION METHODS ************************************/
/**
* Adds the designated number of months to the current calendar month, and sets the current
* calendar page date to the new month.
* @param {Integer}	count	The number of months to add to the current calendar
*/
YAHOO.widget.Calendar_Core.prototype.addMonths = function(count) {
	this.pageDate = YAHOO.widget.DateMath.add(this.pageDate, YAHOO.widget.DateMath.MONTH, count);
	this.resetRenderers();
	this.onChangePage();
};

/**
* Subtracts the designated number of months from the current calendar month, and sets the current
* calendar page date to the new month.
* @param {Integer}	count	The number of months to subtract from the current calendar
*/
YAHOO.widget.Calendar_Core.prototype.subtractMonths = function(count) {
	this.pageDate = YAHOO.widget.DateMath.subtract(this.pageDate, YAHOO.widget.DateMath.MONTH, count);
	this.resetRenderers();
	this.onChangePage();
};

/**
* Adds the designated number of years to the current calendar, and sets the current
* calendar page date to the new month.
* @param {Integer}	count	The number of years to add to the current calendar
*/
YAHOO.widget.Calendar_Core.prototype.addYears = function(count) {
	this.pageDate = YAHOO.widget.DateMath.add(this.pageDate, YAHOO.widget.DateMath.YEAR, count);
	this.resetRenderers();
	this.onChangePage();
};

/**
* Subtcats the designated number of years from the current calendar, and sets the current
* calendar page date to the new month.
* @param {Integer}	count	The number of years to subtract from the current calendar
*/
YAHOO.widget.Calendar_Core.prototype.subtractYears = function(count) {
	this.pageDate = YAHOO.widget.DateMath.subtract(this.pageDate, YAHOO.widget.DateMath.YEAR, count);
	this.resetRenderers();
	this.onChangePage();
};

/**
* Navigates to the next month page in the calendar widget.
*/
YAHOO.widget.Calendar_Core.prototype.nextMonth = function() {
	this.addMonths(1);
};

/**
* Navigates to the previous month page in the calendar widget.
*/
YAHOO.widget.Calendar_Core.prototype.previousMonth = function() {
	this.subtractMonths(1);
};

/**
* Navigates to the next year in the currently selected month in the calendar widget.
*/
YAHOO.widget.Calendar_Core.prototype.nextYear = function() {
	this.addYears(1);
};

/**
* Navigates to the previous year in the currently selected month in the calendar widget.
*/
YAHOO.widget.Calendar_Core.prototype.previousYear = function() {
	this.subtractYears(1);
};

/****************** END MONTH NAVIGATION METHODS ************************************/

/************* BEGIN SELECTION METHODS *************************************************************/

/**
* Resets the calendar widget to the originally selected month and year, and
* sets the calendar to the initial selection(s).
*/
YAHOO.widget.Calendar_Core.prototype.reset = function() {
	this.selectedDates.length = 0;
	this.selectedDates = this._selectedDates.concat();

	this.pageDate = new Date(this._pageDate.getTime());
	this.onReset();
};

/**
* Clears the selected dates in the current calendar widget and sets the calendar
* to the current month and year.
*/
YAHOO.widget.Calendar_Core.prototype.clear = function() {
	this.selectedDates.length = 0;
	this.pageDate = new Date(this.today.getTime());
	this.onClear();
};

/**
* Selects a date or a collection of dates on the current calendar. This method, by default,
* does not call the render method explicitly. Once selection has completed, render must be
* called for the changes to be reflected visually.
* @param	{String/Date/Date[]}	date	The date string of dates to select in the current calendar. Valid formats are
*								individual date(s) (12/24/2005,12/26/2005) or date range(s) (12/24/2005-1/1/2006).
*								Multiple comma-delimited dates can also be passed to this method (12/24/2005,12/11/2005-12/13/2005).
*								This method can also take a JavaScript Date object or an array of Date objects.
* @return						Array of JavaScript Date objects representing all individual dates that are currently selected.
* @type Date[]
*/
YAHOO.widget.Calendar_Core.prototype.select = function(date) {
	this.onBeforeSelect();

	var aToBeSelected = this._toFieldArray(date);

	for (var a=0;a<aToBeSelected.length;++a)
	{
		var toSelect = aToBeSelected[a]; // For each date item in the list of dates we're trying to select
		if (this._indexOfSelectedFieldArray(toSelect) == -1) // not already selected?
		{
			this.selectedDates[this.selectedDates.length]=toSelect;
		}
	}

	if (this.parent) {
		this.parent.sync(this);
	}

	this.onSelect();

	return this.getSelectedDates();
};

/**
* Selects a date on the current calendar by referencing the index of the cell that should be selected.
* This method is used to easily select a single cell (usually with a mouse click) without having to do
* a full render. The selected style is applied to the cell directly.
* @param	{Integer}	cellIndex	The index of the cell to select in the current calendar.
* @return							Array of JavaScript Date objects representing all individual dates that are currently selected.
* @type Date[]
*/
YAHOO.widget.Calendar_Core.prototype.selectCell = function(cellIndex) {
	this.onBeforeSelect();

	this.cells = this.tbody.getElementsByTagName("TD");

	var cell = this.cells[cellIndex];
	var cellDate = this.cellDates[cellIndex];

	var dCellDate = this._toDate(cellDate);

	var selectDate = cellDate.concat();

	this.selectedDates.push(selectDate);

	if (this.parent) {
		this.parent.sync(this);
	}

	this.renderCellStyleSelected(dCellDate,cell);

	this.onSelect();
	this.doCellMouseOut.call(cell, null, this);

	return this.getSelectedDates();
};

/**
* Deselects a date or a collection of dates on the current calendar. This method, by default,
* does not call the render method explicitly. Once deselection has completed, render must be
* called for the changes to be reflected visually.
* @param	{String/Date/Date[]}	date	The date string of dates to deselect in the current calendar. Valid formats are
*								individual date(s) (12/24/2005,12/26/2005) or date range(s) (12/24/2005-1/1/2006).
*								Multiple comma-delimited dates can also be passed to this method (12/24/2005,12/11/2005-12/13/2005).
*								This method can also take a JavaScript Date object or an array of Date objects.
* @return						Array of JavaScript Date objects representing all individual dates that are currently selected.
* @type Date[]
*/
YAHOO.widget.Calendar_Core.prototype.deselect = function(date) {
	this.onBeforeDeselect();

	var aToBeSelected = this._toFieldArray(date);

	for (var a=0;a<aToBeSelected.length;++a)
	{
		var toSelect = aToBeSelected[a]; // For each date item in the list of dates we're trying to select
		var index = this._indexOfSelectedFieldArray(toSelect);

		if (index != -1)
		{
			this.selectedDates.splice(index,1);
		}
	}

	if (this.parent) {
		this.parent.sync(this);
	}

	this.onDeselect();
	return this.getSelectedDates();
};

/**
* Deselects a date on the current calendar by referencing the index of the cell that should be deselected.
* This method is used to easily deselect a single cell (usually with a mouse click) without having to do
* a full render. The selected style is removed from the cell directly.
* @param	{Integer}	cellIndex	The index of the cell to deselect in the current calendar.
* @return							Array of JavaScript Date objects representing all individual dates that are currently selected.
* @type Date[]
*/
YAHOO.widget.Calendar_Core.prototype.deselectCell = function(i) {
	this.onBeforeDeselect();
	this.cells = this.tbody.getElementsByTagName("TD");

	var cell = this.cells[i];
	var cellDate = this.cellDates[i];
	var cellDateIndex = this._indexOfSelectedFieldArray(cellDate);

	var dCellDate = this._toDate(cellDate);

	var selectDate = cellDate.concat();

	if (cellDateIndex > -1)
	{
		if (this.pageDate.getMonth() == dCellDate.getMonth() &&
			this.pageDate.getFullYear() == dCellDate.getFullYear())
		{
			YAHOO.widget.Calendar_Core.removeCssClass(cell, this.Style.CSS_CELL_SELECTED);
		}

		this.selectedDates.splice(cellDateIndex, 1);
	}


	if (this.parent) {
		this.parent.sync(this);
	}

	this.onDeselect();
	return this.getSelectedDates();
};

/**
* Deselects all dates on the current calendar.
* @return				Array of JavaScript Date objects representing all individual dates that are currently selected.
*						Assuming that this function executes properly, the return value should be an empty array.
*						However, the empty array is returned for the sake of being able to check the selection status
*						of the calendar.
* @type Date[]
*/
YAHOO.widget.Calendar_Core.prototype.deselectAll = function() {
	this.onBeforeDeselect();
	var count = this.selectedDates.length;
	this.selectedDates.length = 0;

	if (this.parent) {
		this.parent.sync(this);
	}

	if (count > 0) {
		this.onDeselect();
	}

	return this.getSelectedDates();
};
/************* END SELECTION METHODS *************************************************************/


/************* BEGIN TYPE CONVERSION METHODS ****************************************************/

/**
* Converts a date (either a JavaScript Date object, or a date string) to the internal data structure
* used to represent dates: [[yyyy,mm,dd],[yyyy,mm,dd]].
* @private
* @param	{String/Date/Date[]}	date	The date string of dates to deselect in the current calendar. Valid formats are
*								individual date(s) (12/24/2005,12/26/2005) or date range(s) (12/24/2005-1/1/2006).
*								Multiple comma-delimited dates can also be passed to this method (12/24/2005,12/11/2005-12/13/2005).
*								This method can also take a JavaScript Date object or an array of Date objects.
* @return						Array of date field arrays
* @type Array[](Integer[])
*/
YAHOO.widget.Calendar_Core.prototype._toFieldArray = function(date) {
	var returnDate = new Array();

	if (date instanceof Date)
	{
		returnDate = [[date.getFullYear(), date.getMonth()+1, date.getDate()]];
	}
	else if (typeof date == 'string')
	{
		returnDate = this._parseDates(date);
	}
	else if (date instanceof Array)
	{
		for (var i=0;i<date.length;++i)
		{
			var d = date[i];
			returnDate[returnDate.length] = [d.getFullYear(),d.getMonth()+1,d.getDate()];
		}
	}

	return returnDate;
};

/**
* Converts a date field array [yyyy,mm,dd] to a JavaScript Date object.
* @private
* @param	{Integer[]}		dateFieldArray	The date field array to convert to a JavaScript Date.
* @return					JavaScript Date object representing the date field array
* @type Date
*/
YAHOO.widget.Calendar_Core.prototype._toDate = function(dateFieldArray) {
	if (dateFieldArray instanceof Date)
	{
		return dateFieldArray;
	} else
	{
		return new Date(dateFieldArray[0],dateFieldArray[1]-1,dateFieldArray[2]);
	}
};
/************* END TYPE CONVERSION METHODS ******************************************************/


/************* BEGIN UTILITY METHODS ****************************************************/
/**
* Converts a date field array [yyyy,mm,dd] to a JavaScript Date object.
* @private
* @param	{Integer[]}	array1	The first date field array to compare
* @param	{Integer[]}	array2	The first date field array to compare
* @return						The boolean that represents the equality of the two arrays
* @type Boolean
*/
YAHOO.widget.Calendar_Core.prototype._fieldArraysAreEqual = function(array1, array2) {
	var match = false;

	if (array1[0]==array2[0]&&array1[1]==array2[1]&&array1[2]==array2[2])
	{
		match=true;
	}

	return match;
};

/**
* Gets the index of a date field array [yyyy,mm,dd] in the current list of selected dates.
* @private
* @param	{Integer[]}		find	The date field array to search for
* @return					The index of the date field array within the collection of selected dates.
*								-1 will be returned if the date is not found.
* @type Integer
*/
YAHOO.widget.Calendar_Core.prototype._indexOfSelectedFieldArray = function(find) {
	var selected = -1;

	for (var s=0;s<this.selectedDates.length;++s)
	{
		var sArray = this.selectedDates[s];
		if (find[0]==sArray[0]&&find[1]==sArray[1]&&find[2]==sArray[2])
		{
			selected = s;
			break;
		}
	}

	return selected;
};

/**
* Determines whether a given date is OOM (out of month).
* @param	{Date}	date	The JavaScript Date object for which to check the OOM status
* @return	{Boolean}	true if the date is OOM
*/
YAHOO.widget.Calendar_Core.prototype.isDateOOM = function(date) {
	var isOOM = false;
	if (date.getMonth() != this.pageDate.getMonth()) {
		isOOM = true;
	}
	return isOOM;
};

/************* END UTILITY METHODS *******************************************************/

/************* BEGIN EVENT HANDLERS ******************************************************/

/**
* Event executed before a date is selected in the calendar widget.
*/
YAHOO.widget.Calendar_Core.prototype.onBeforeSelect = function() {
	if (! this.Options.MULTI_SELECT) {
		this.clearAllBodyCellStyles(this.Style.CSS_CELL_SELECTED);
		this.deselectAll();
	}
};

/**
* Event executed when a date is selected in the calendar widget.
*/
YAHOO.widget.Calendar_Core.prototype.onSelect = function() { };

/**
* Event executed before a date is deselected in the calendar widget.
*/
YAHOO.widget.Calendar_Core.prototype.onBeforeDeselect = function() { };

/**
* Event executed when a date is deselected in the calendar widget.
*/
YAHOO.widget.Calendar_Core.prototype.onDeselect = function() { };

/**
* Event executed when the user navigates to a different calendar page.
*/
YAHOO.widget.Calendar_Core.prototype.onChangePage = function() { this.render(); };

/**
* Event executed when the calendar widget is rendered.
*/
YAHOO.widget.Calendar_Core.prototype.onRender = function() { };

/**
* Event executed when the calendar widget is reset to its original state.
*/
YAHOO.widget.Calendar_Core.prototype.onReset = function() { this.render(); };

/**
* Event executed when the calendar widget is completely cleared to the current month with no selections.
*/
YAHOO.widget.Calendar_Core.prototype.onClear = function() { this.render(); };

/**
* Validates the calendar widget. This method has no default implementation
* and must be extended by subclassing the widget.
* @return	Should return true if the widget validates, and false if
* it doesn't.
* @type Boolean
*/
YAHOO.widget.Calendar_Core.prototype.validate = function() { return true; };

/************* END EVENT HANDLERS *********************************************************/


/************* BEGIN DATE PARSE METHODS ***************************************************/


/**
* Converts a date string to a date field array
* @private
* @param	{String}	sDate			Date string. Valid formats are mm/dd and mm/dd/yyyy.
* @return				A date field array representing the string passed to the method
* @type Array[](Integer[])
*/
YAHOO.widget.Calendar_Core.prototype._parseDate = function(sDate) {
	var aDate = sDate.split(this.Locale.DATE_FIELD_DELIMITER);
	var rArray;

	if (aDate.length == 2)
	{
		rArray = [aDate[this.Locale.MD_MONTH_POSITION-1],aDate[this.Locale.MD_DAY_POSITION-1]];
		rArray.type = YAHOO.widget.Calendar_Core.MONTH_DAY;
	} else {
		rArray = [aDate[this.Locale.MDY_YEAR_POSITION-1],aDate[this.Locale.MDY_MONTH_POSITION-1],aDate[this.Locale.MDY_DAY_POSITION-1]];
		rArray.type = YAHOO.widget.Calendar_Core.DATE;
	}
	return rArray;
};

/**
* Converts a multi or single-date string to an array of date field arrays
* @private
* @param	{String}	sDates		Date string with one or more comma-delimited dates. Valid formats are mm/dd, mm/dd/yyyy, mm/dd/yyyy-mm/dd/yyyy
* @return							An array of date field arrays
* @type Array[](Integer[])
*/
YAHOO.widget.Calendar_Core.prototype._parseDates = function(sDates) {
	var aReturn = new Array();

	var aDates = sDates.split(this.Locale.DATE_DELIMITER);

	for (var d=0;d<aDates.length;++d)
	{
		var sDate = aDates[d];

		if (sDate.indexOf(this.Locale.DATE_RANGE_DELIMITER) != -1) {
			// This is a range
			var aRange = sDate.split(this.Locale.DATE_RANGE_DELIMITER);

			var dateStart = this._parseDate(aRange[0]);
			var dateEnd = this._parseDate(aRange[1]);

			var fullRange = this._parseRange(dateStart, dateEnd);
			aReturn = aReturn.concat(fullRange);
		} else {
			// This is not a range
			var aDate = this._parseDate(sDate);
			aReturn.push(aDate);
		}
	}
	return aReturn;
};

/**
* Converts a date range to the full list of included dates
* @private
* @param	{Integer[]}	startDate	Date field array representing the first date in the range
* @param	{Integer[]}	endDate		Date field array representing the last date in the range
* @return							An array of date field arrays
* @type Array[](Integer[])
*/
YAHOO.widget.Calendar_Core.prototype._parseRange = function(startDate, endDate) {
	var dStart   = new Date(startDate[0],startDate[1]-1,startDate[2]);
	var dCurrent = YAHOO.widget.DateMath.add(new Date(startDate[0],startDate[1]-1,startDate[2]),YAHOO.widget.DateMath.DAY,1);
	var dEnd     = new Date(endDate[0],  endDate[1]-1,  endDate[2]);

	var results = new Array();
	results.push(startDate);
	while (dCurrent.getTime() <= dEnd.getTime())
	{
		results.push([dCurrent.getFullYear(),dCurrent.getMonth()+1,dCurrent.getDate()]);
		dCurrent = YAHOO.widget.DateMath.add(dCurrent,YAHOO.widget.DateMath.DAY,1);
	}
	return results;
};

/************* END DATE PARSE METHODS *****************************************************/

/************* BEGIN RENDERER METHODS *****************************************************/

/**
* Resets the render stack of the current calendar to its original pre-render value.
*/
YAHOO.widget.Calendar_Core.prototype.resetRenderers = function() {
	this.renderStack = this._renderStack.concat();
};

/**
* Clears the inner HTML, CSS class and style information from the specified cell.
* @param	{HTMLTableCellElement}	The cell to clear
*/
YAHOO.widget.Calendar_Core.prototype.clearElement = function(cell) {
	cell.innerHTML = "&nbsp;";
	cell.className="";
};

/**
* Adds a renderer to the render stack. The function reference passed to this method will be executed
* when a date cell matches the conditions specified in the date string for this renderer.
* @param	{String}	sDates		A date string to associate with the specified renderer. Valid formats
*									include date (12/24/2005), month/day (12/24), and range (12/1/2004-1/1/2005)
* @param	{Function}	fnRender	The function executed to render cells that match the render rules for this renderer.
*/
YAHOO.widget.Calendar_Core.prototype.addRenderer = function(sDates, fnRender) {
	var aDates = this._parseDates(sDates);
	for (var i=0;i<aDates.length;++i)
	{
		var aDate = aDates[i];

		if (aDate.length == 2) // this is either a range or a month/day combo
		{
			if (aDate[0] instanceof Array) // this is a range
			{
				this._addRenderer(YAHOO.widget.Calendar_Core.RANGE,aDate,fnRender);
			} else { // this is a month/day combo
				this._addRenderer(YAHOO.widget.Calendar_Core.MONTH_DAY,aDate,fnRender);
			}
		} else if (aDate.length == 3)
		{
			this._addRenderer(YAHOO.widget.Calendar_Core.DATE,aDate,fnRender);
		}
	}
};

/**
* The private method used for adding cell renderers to the local render stack.
* This method is called by other methods that set the renderer type prior to the method call.
* @private
* @param	{String}	type		The type string that indicates the type of date renderer being added.
*									Values are YAHOO.widget.Calendar_Core.DATE, YAHOO.widget.Calendar_Core.MONTH_DAY, YAHOO.widget.Calendar_Core.WEEKDAY,
*									YAHOO.widget.Calendar_Core.RANGE, YAHOO.widget.Calendar_Core.MONTH
* @param	{Array}		aDates		An array of dates used to construct the renderer. The format varies based
*									on the renderer type
* @param	{Function}	fnRender	The function executed to render cells that match the render rules for this renderer.
*/
YAHOO.widget.Calendar_Core.prototype._addRenderer = function(type, aDates, fnRender) {
	var add = [type,aDates,fnRender];
	this.renderStack.unshift(add);

	this._renderStack = this.renderStack.concat();
};

/**
* Adds a month to the render stack. The function reference passed to this method will be executed
* when a date cell matches the month passed to this method.
* @param	{Integer}	month		The month (1-12) to associate with this renderer
* @param	{Function}	fnRender	The function executed to render cells that match the render rules for this renderer.
*/
YAHOO.widget.Calendar_Core.prototype.addMonthRenderer = function(month, fnRender) {
	this._addRenderer(YAHOO.widget.Calendar_Core.MONTH,[month],fnRender);
};

/**
* Adds a weekday to the render stack. The function reference passed to this method will be executed
* when a date cell matches the weekday passed to this method.
* @param	{Integer}	weekay		The weekday (1-7) to associate with this renderer
* @param	{Function}	fnRender	The function executed to render cells that match the render rules for this renderer.
*/
YAHOO.widget.Calendar_Core.prototype.addWeekdayRenderer = function(weekday, fnRender) {
	this._addRenderer(YAHOO.widget.Calendar_Core.WEEKDAY,[weekday],fnRender);
};
/************* END RENDERER METHODS *******************************************************/

/***************** BEGIN CSS METHODS *******************************************/
/**
* Adds the specified CSS class to the element passed to this method.
* @param	{HTMLElement}	element		The element to which the CSS class should be applied
* @param	{String}	style		The CSS class name to add to the referenced element
*/
YAHOO.widget.Calendar_Core.addCssClass = function(element, style) {
	if (element.className.length === 0)
	{
		element.className += style;
	} else {
		element.className += " " + style;
	}
};

YAHOO.widget.Calendar_Core.prependCssClass = function(element, style) {
	element.className = style + " " + element.className;
}

/**
* Removed the specified CSS class from the element passed to this method.
* @param	{HTMLElement}	element		The element from which the CSS class should be removed
* @param	{String}	style		The CSS class name to remove from the referenced element
*/
YAHOO.widget.Calendar_Core.removeCssClass = function(element, style) {
	var aStyles = element.className.split(" ");
	for (var s=0;s<aStyles.length;++s)
	{
		if (aStyles[s] == style)
		{
			aStyles.splice(s,1);
			break;
		}
	}
	YAHOO.widget.Calendar_Core.setCssClasses(element, aStyles);
};

/**
* Sets the specified array of CSS classes into the referenced element
* @param	{HTMLElement}	element		The element to set the CSS classes into
* @param	{String[]}		aStyles		An array of CSS class names
*/
YAHOO.widget.Calendar_Core.setCssClasses = function(element, aStyles) {
	element.className = "";
	var className = aStyles.join(" ");
	element.className = className;
};

/**
* Removes all styles from all body cells in the current calendar table.
* @param	{style}		The CSS class name to remove from all calendar body cells
*/
YAHOO.widget.Calendar_Core.prototype.clearAllBodyCellStyles = function(style) {
	for (var c=0;c<this.cells.length;++c)
	{
		YAHOO.widget.Calendar_Core.removeCssClass(this.cells[c],style);
	}
};

/***************** END CSS METHODS *********************************************/

/***************** BEGIN GETTER/SETTER METHODS *********************************/
/**
* Sets the calendar's month explicitly.
* @param {Integer}	month		The numeric month, from 1 (January) to 12 (December)
*/
YAHOO.widget.Calendar_Core.prototype.setMonth = function(month) {
	this.pageDate.setMonth(month);
};

/**
* Sets the calendar's year explicitly.
* @param {Integer}	year		The numeric 4-digit year
*/
YAHOO.widget.Calendar_Core.prototype.setYear = function(year) {
	this.pageDate.setFullYear(year);
};

/**
* Gets the list of currently selected dates from the calendar.
* @return	An array of currently selected JavaScript Date objects.
* @type Date[]
*/
YAHOO.widget.Calendar_Core.prototype.getSelectedDates = function() {
	var returnDates = new Array();

	for (var d=0;d<this.selectedDates.length;++d)
	{
		var dateArray = this.selectedDates[d];

		var date = new Date(dateArray[0],dateArray[1]-1,dateArray[2]);
		returnDates.push(date);
	}

	returnDates.sort();
	return returnDates;
};

/***************** END GETTER/SETTER METHODS *********************************/

YAHOO.widget.Calendar_Core._getBrowser = function()
{
  /**
   * UserAgent
   * @private
   * @type String
   */
  var ua = navigator.userAgent.toLowerCase();

  if (ua.indexOf('opera')!=-1) // Opera (check first in case of spoof)
	 return 'opera';
  else if (ua.indexOf('msie')!=-1) // IE
	 return 'ie';
  else if (ua.indexOf('safari')!=-1) // Safari (check before Gecko because it includes "like Gecko")
	 return 'safari';
  else if (ua.indexOf('gecko') != -1) // Gecko
	 return 'gecko';
 else
  return false;
}


YAHOO.widget.Cal_Core = YAHOO.widget.Calendar_Core;

YAHOO.namespace("YAHOO.widget");

/**
* @class
* <p>YAHOO.widget.CalendarGroup is a special container class for YAHOO.widget.Calendar_Core. This class facilitates
* the ability to have multi-page calendar views that share a single dataset and are
* dependent on each other.</p>
*
* <p>The calendar group instance will refer to each of its elements using a 0-based index.
* For example, to construct the placeholder for a calendar group widget with id "cal1" and
* containerId of "cal1Container", the markup would be as follows:
*	<xmp>
*		<div id="cal1Container_0"></div>
*		<div id="cal1Container_1"></div>
*	</xmp>
* The tables for the calendars ("cal1_0" and "cal1_1") will be inserted into those containers.
* </p>
* @constructor
* @param {Integer}		pageCount	The number of pages that this calendar should display.
* @param {String}		id			The id of the element that will be inserted into the DOM.
* @param {String}	containerId	The id of the container element that the calendar will be inserted into.
* @param {String}		monthyear	The month/year string used to set the current calendar page
* @param {String}		selected	A string of date values formatted using the date parser. The built-in
									default date format is MM/DD/YYYY. Ranges are defined using
									MM/DD/YYYY-MM/DD/YYYY. Month/day combinations are defined using MM/DD.
									Any combination of these can be combined by delimiting the string with
									commas. Example: "12/24/2005,12/25,1/18/2006-1/21/2006"
*/
YAHOO.widget.CalendarGroup = function(pageCount, id, containerId, monthyear, selected) {
	if (arguments.length > 0)
	{
		this.init(pageCount, id, containerId, monthyear, selected);
	}
}

/**
* Initializes the calendar group. All subclasses must call this method in order for the
* group to be initialized properly.
* @param {Integer}		pageCount	The number of pages that this calendar should display.
* @param {String}		id			The id of the element that will be inserted into the DOM.
* @param {String}		containerId	The id of the container element that the calendar will be inserted into.
* @param {String}		monthyear	The month/year string used to set the current calendar page
* @param {String}		selected	A string of date values formatted using the date parser. The built-in
									default date format is MM/DD/YYYY. Ranges are defined using
									MM/DD/YYYY-MM/DD/YYYY. Month/day combinations are defined using MM/DD.
									Any combination of these can be combined by delimiting the string with
									commas. Example: "12/24/2005,12/25,1/18/2006-1/21/2006"
*/
YAHOO.widget.CalendarGroup.prototype.init = function(pageCount, id, containerId, monthyear, selected) {
	//var self=this;

	this.id = id;
	this.selectedDates = new Array();
	this.containerId = containerId;

	this.pageCount = pageCount;

	this.pages = new Array();

	for (var p=0;p<pageCount;++p)
	{
		var cal = this.constructChild(id + "_" + p, this.containerId + "_" + p , monthyear, selected);

		cal.parent = this;

		cal.index = p;

		cal.pageDate.setMonth(cal.pageDate.getMonth()+p);
		cal._pageDateOrig = new Date(cal.pageDate.getFullYear(),cal.pageDate.getMonth(),cal.pageDate.getDate());
		this.pages.push(cal);
	}

	this.doNextMonth = function(e, calGroup) {
		calGroup.nextMonth();
	}

	this.doPreviousMonth = function(e, calGroup) {
		calGroup.previousMonth();
	}
};

YAHOO.widget.CalendarGroup.prototype.setChildFunction = function(fnName, fn) {
	for (var p=0;p<this.pageCount;++p) {
		this.pages[p][fnName] = fn;
	}
}

YAHOO.widget.CalendarGroup.prototype.callChildFunction = function(fnName, args) {
	for (var p=0;p<this.pageCount;++p) {
		var page = this.pages[p];
		if (page[fnName]) {
			var fn = page[fnName];
			fn.call(page, args);
		}
	}
}

/**
* Constructs a child calendar. This method can be overridden if a subclassed version of the default
* calendar is to be used.
* @param {String}		id			The id of the element that will be inserted into the DOM.
* @param {String}		containerId	The id of the container element that the calendar will be inserted into.
* @param {String}		monthyear	The month/year string used to set the current calendar page
* @param {String}		selected	A string of date values formatted using the date parser. The built-in
									default date format is MM/DD/YYYY. Ranges are defined using
									MM/DD/YYYY-MM/DD/YYYY. Month/day combinations are defined using MM/DD.
									Any combination of these can be combined by delimiting the string with
									commas. Example: "12/24/2005,12/25,1/18/2006-1/21/2006"
* @return							The YAHOO.widget.Calendar_Core instance that is constructed
* @type YAHOO.widget.Calendar_Core
*/
YAHOO.widget.CalendarGroup.prototype.constructChild = function(id,containerId,monthyear,selected) {
	return new YAHOO.widget.Calendar_Core(id,containerId,monthyear,selected);
};


/**
* Sets the calendar group's month explicitly. This month will be set into the first
* page of the multi-page calendar, and all other months will be iterated appropriately.
* @param {Integer}	month		The numeric month, from 1 (January) to 12 (December)
*/
YAHOO.widget.CalendarGroup.prototype.setMonth = function(month) {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.setMonth(month+p);
	}
};

/**
* Sets the calendar group's year explicitly. This year will be set into the first
* page of the multi-page calendar, and all other months will be iterated appropriately.
* @param {Integer}	year		The numeric 4-digit year
*/
YAHOO.widget.CalendarGroup.prototype.setYear = function(year) {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		if ((cal.pageDate.getMonth()+1) == 1 && p>0)
		{
			year+=1;
		}
		cal.setYear(year);
	}
};

/**
* Calls the render function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.render = function() {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.render();
	}
};

/**
* Calls the select function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.select = function(date) {
	var ret;
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		ret = cal.select(date);
	}
	return ret;
};

/**
* Calls the selectCell function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.selectCell = function(cellIndex) {
	var ret;
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		ret = cal.selectCell(cellIndex);
	}
	return ret;
};

/**
* Calls the deselect function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.deselect = function(date) {
	var ret;
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		ret = cal.deselect(date);
	}
	return ret;
};

/**
* Calls the deselectAll function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.deselectAll = function() {
	var ret;
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		ret = cal.deselectAll();
	}
	return ret;
};

/**
* Calls the deselectAll function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.deselectCell = function(cellIndex) {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.deselectCell(cellIndex);
	}
	return this.getSelectedDates();
};

/**
* Calls the reset function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.reset = function() {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.reset();
	}
};

/**
* Calls the clear function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.clear = function() {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.clear();
	}
};

/**
* Calls the nextMonth function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.nextMonth = function() {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.nextMonth();
	}
};

/**
* Calls the previousMonth function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.previousMonth = function() {
	for (var p=this.pages.length-1;p>=0;--p)
	{
		var cal = this.pages[p];
		cal.previousMonth();
	}
};

/**
* Calls the nextYear function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.nextYear = function() {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.nextYear();
	}
};

/**
* Calls the previousYear function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.previousYear = function() {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.previousYear();
	}
};

/**
* Synchronizes the data values for all child calendars within the group. If the sync
* method is called passing in the caller object, the values of all children will be set
* to the values of the caller. If the argument is ommitted, the values from all children
* will be combined into one distinct list and set into each child.
* @param	{YAHOO.widget.Calendar_Core}	caller		The YAHOO.widget.Calendar_Core that is initiating the call to sync().
* @return								Array of selected dates, in JavaScript Date object form.
* @type Date[]
*/
YAHOO.widget.CalendarGroup.prototype.sync = function(caller) {
	var calendar;

	if (caller)
	{
		this.selectedDates = caller.selectedDates.concat();
	} else {
		var hash = new Object();
		var combinedDates = new Array();

		for (var p=0;p<this.pages.length;++p)
		{
			calendar = this.pages[p];

			var values = calendar.selectedDates;

			for (var v=0;v<values.length;++v)
			{
				var valueArray = values[v];
				hash[valueArray.toString()] = valueArray;
			}
		}

		for (var val in hash)
		{
			combinedDates[combinedDates.length]=hash[val];
		}

		this.selectedDates = combinedDates.concat();
	}

	// Set all the values into the children
	for (p=0;p<this.pages.length;++p)
	{
		calendar = this.pages[p];
		if (! calendar.Options.MULTI_SELECT) {
			calendar.clearAllBodyCellStyles(calendar.Config.Style.CSS_CELL_SELECTED);
		}
		calendar.selectedDates = this.selectedDates.concat();

	}

	return this.getSelectedDates();
};

/**
* Gets the list of currently selected dates from the calendar.
* @return			An array of currently selected JavaScript Date objects.
* @type Date[]
*/
YAHOO.widget.CalendarGroup.prototype.getSelectedDates = function() {
	var returnDates = new Array();

	for (var d=0;d<this.selectedDates.length;++d)
	{
		var dateArray = this.selectedDates[d];

		var date = new Date(dateArray[0],dateArray[1]-1,dateArray[2]);
		returnDates.push(date);
	}

	returnDates.sort();
	return returnDates;
};

/**
* Calls the addRenderer function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.addRenderer = function(sDates, fnRender) {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.addRenderer(sDates, fnRender);
	}
};

/**
* Calls the addMonthRenderer function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.addMonthRenderer = function(month, fnRender) {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.addMonthRenderer(month, fnRender);
	}
};

/**
* Calls the addWeekdayRenderer function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.addWeekdayRenderer = function(weekday, fnRender) {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.addWeekdayRenderer(weekday, fnRender);
	}
};

/**
* Sets an event handler universally across all child calendars within the group. For instance,
* to set the onSelect handler for all child calendars to a function called fnSelect, the call would be:
* <code>
* calGroup.wireEvent("onSelect", fnSelect);
* </code>
* @param	{String}	eventName	The name of the event to handler to set within all child calendars.
* @param	{Function}	fn			The function to set into the specified event handler.
*/
YAHOO.widget.CalendarGroup.prototype.wireEvent = function(eventName, fn) {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal[eventName] = fn;
	}
};

YAHOO.widget.CalGrp = YAHOO.widget.CalendarGroup;

YAHOO.namespace("YAHOO.widget");

/**
* @class
* Calendar is the default implementation of the YAHOO.widget.Calendar_Core base class.
* This class is the UED-approved version of the calendar selector widget. For all documentation
* on the implemented methods listed here, see the documentation for YAHOO.widget.Calendar_Core.
* @constructor
* @param {String}	id			The id of the table element that will represent the calendar widget
* @param {String}	containerId	The id of the container element that will contain the calendar table
* @param {String}	monthyear	The month/year string used to set the current calendar page
* @param {String}	selected	A string of date values formatted using the date parser. The built-in
								default date format is MM/DD/YYYY. Ranges are defined using
								MM/DD/YYYY-MM/DD/YYYY. Month/day combinations are defined using MM/DD.
								Any combination of these can be combined by delimiting the string with
								commas. Example: "12/24/2005,12/25,1/18/2006-1/21/2006"
*/
YAHOO.widget.Calendar = function(id, containerId, monthyear, selected) {
	if (arguments.length > 0)
	{
		this.init(id, containerId, monthyear, selected);
	}
}

YAHOO.widget.Calendar.prototype = new YAHOO.widget.Calendar_Core();

YAHOO.widget.Calendar.prototype.buildShell = function() {
	this.border = document.createElement("DIV");
	this.border.className =  this.Style.CSS_BORDER;

	this.table = document.createElement("TABLE");
	this.table.cellSpacing = 0;

	YAHOO.widget.Calendar_Core.setCssClasses(this.table, [this.Style.CSS_CALENDAR]);

	this.border.id = this.id;

	this.buildShellHeader();
	this.buildShellBody();
	this.buildShellFooter();
};

YAHOO.widget.Calendar.prototype.renderShell = function() {
	this.border.appendChild(this.table);
	this.oDomContainer.appendChild(this.border);
	this.shellRendered = true;
};

YAHOO.widget.Calendar.prototype.renderHeader = function() {
	this.headerCell.innerHTML = "";

	var headerContainer = document.createElement("DIV");
	headerContainer.className = this.Style.CSS_HEADER;
	
	//
	// my fix
	//
	var $table = document.createElement('table');
	$table.width = '100%';
	var $tbody = document.createElement('tbody');
	var $tr = document.createElement('tr');
	var $tdl = document.createElement('td');
	$tdl.align = 'left';
	var $tdc = document.createElement('td');
	$tdc.align = 'center';
	var $tdr = document.createElement('td');
	$tdr.align = 'right';
	// end my fix
	
	var linkLeft = document.createElement("A");
	linkLeft.href = "javascript:" + this.id + ".previousMonth()";
	var imgLeft = document.createElement("IMG");
	imgLeft.src = this.Options.NAV_ARROW_LEFT;
	imgLeft.className = this.Style.CSS_NAV_LEFT;
	linkLeft.appendChild(imgLeft);

	var linkRight = document.createElement("A");
	linkRight.href = "javascript:" + this.id + ".nextMonth()";
	var imgRight = document.createElement("IMG");
	imgRight.src = this.Options.NAV_ARROW_RIGHT;
	imgRight.className = this.Style.CSS_NAV_RIGHT;
	linkRight.appendChild(imgRight);

	//
	// my fix
	//
	$table.appendChild($tbody);
	$tbody.appendChild($tr);
	$tr.appendChild($tdl);
	$tr.appendChild($tdc);
	$tr.appendChild($tdr);
	$tdl.appendChild(linkLeft);
	$tdc.appendChild(document.createTextNode(this.buildMonthLabel()));
	$tdr.appendChild(linkRight);
	headerContainer.appendChild($table);
	/*headerContainer.appendChild(linkLeft);
	headerContainer.appendChild(document.createTextNode(this.buildMonthLabel()));
	headerContainer.appendChild(linkRight);*/
	// end my fix

	this.headerCell.appendChild(headerContainer);
};

YAHOO.widget.Cal = YAHOO.widget.Calendar;

YAHOO.namespace("YAHOO.widget");

/**
* @class
* Calendar2up_Cal is the default implementation of the Calendar_Core base class, when used
* in a 2-up view. This class is the UED-approved version of the calendar selector widget. For all documentation
* on the implemented methods listed here, see the documentation for Calendar_Core. This class
* has some special attributes that only apply to calendars rendered within the calendar group implementation.
* There should be no reason to instantiate this class directly.
* @constructor
* @param {String}	id			The id of the table element that will represent the calendar widget
* @param {String}	containerId	The id of the container element that will contain the calendar table
* @param {String}	monthyear	The month/year string used to set the current calendar page
* @param {String}	selected	A string of date values formatted using the date parser. The built-in
								default date format is MM/DD/YYYY. Ranges are defined using
								MM/DD/YYYY-MM/DD/YYYY. Month/day combinations are defined using MM/DD.
								Any combination of these can be combined by delimiting the string with
								commas. Example: "12/24/2005,12/25,1/18/2006-1/21/2006"
*/
YAHOO.widget.Calendar2up_Cal = function(id, containerId, monthyear, selected) {
	if (arguments.length > 0)
	{
		this.init(id, containerId, monthyear, selected);
	}
}

YAHOO.widget.Calendar2up_Cal.prototype = new YAHOO.widget.Calendar_Core();

/**
* Renders the header for each individual calendar in the 2-up view. More
* specifically, this method handles the placement of left and right arrows for
* navigating between calendar pages.
*/
YAHOO.widget.Calendar2up_Cal.prototype.renderHeader = function() {
	this.headerCell.innerHTML = "";

	var headerContainer = document.createElement("DIV");
	headerContainer.className = this.Style.CSS_HEADER;

	if (this.index == 0) {
		var linkLeft = document.createElement("A");
		linkLeft.href = "javascript:void(null)";
		YAHOO.util.Event.addListener(linkLeft, "click", this.parent.doPreviousMonth, this.parent);
		var imgLeft = document.createElement("IMG");
		imgLeft.src = this.Options.NAV_ARROW_LEFT;
		imgLeft.className = this.Style.CSS_NAV_LEFT;
		linkLeft.appendChild(imgLeft);
		headerContainer.appendChild(linkLeft);
	}

	headerContainer.appendChild(document.createTextNode(this.buildMonthLabel()));

	if (this.index == 1) {
		var linkRight = document.createElement("A");
		linkRight.href = "javascript:void(null)";
		YAHOO.util.Event.addListener(linkRight, "click", this.parent.doNextMonth, this.parent);
		var imgRight = document.createElement("IMG");
		imgRight.src = this.Options.NAV_ARROW_RIGHT;
		imgRight.className = this.Style.CSS_NAV_RIGHT;
		linkRight.appendChild(imgRight);
		headerContainer.appendChild(linkRight);
	}

	this.headerCell.appendChild(headerContainer);
};




/**
* @class
* Calendar2up is the default implementation of the Calendar2up_Core base class, when used
* in a 2-up view. This class is the UED-approved version of the 2-up calendar selector widget. For all documentation
* on the implemented methods listed here, see the documentation for Calendar2up_Core.
* @constructor
* @param {String}	id			The id of the table element that will represent the calendar widget
* @param {String}	containerId	The id of the container element that will contain the calendar table
* @param {String}	monthyear	The month/year string used to set the current calendar page
* @param {String}	selected	A string of date values formatted using the date parser. The built-in
								default date format is MM/DD/YYYY. Ranges are defined using
								MM/DD/YYYY-MM/DD/YYYY. Month/day combinations are defined using MM/DD.
								Any combination of these can be combined by delimiting the string with
								commas. Example: "12/24/2005,12/25,1/18/2006-1/21/2006"
*/
YAHOO.widget.Calendar2up = function(id, containerId, monthyear, selected) {
	if (arguments.length > 0)
	{
		this.buildWrapper(containerId);
		this.init(2, id, containerId, monthyear, selected);
	}
}

YAHOO.widget.Calendar2up.prototype = new YAHOO.widget.CalendarGroup();

/**
* Implementation of CalendarGroup.constructChild that ensures that child calendars of
* Calendar2up will be of type Calendar2up_Cal.
*/
YAHOO.widget.Calendar2up.prototype.constructChild = function(id,containerId,monthyear,selected) {
	var cal = new YAHOO.widget.Calendar2up_Cal(id,containerId,monthyear,selected);
	return cal;
};

/**
* Builds the wrapper container for the 2-up calendar.
* @param {String} containerId	The id of the outer container element.
*/
YAHOO.widget.Calendar2up.prototype.buildWrapper = function(containerId) {
	var outerContainer = document.getElementById(containerId);

	outerContainer.className = "calcontainer";

	var innerContainer = document.createElement("DIV");
	innerContainer.className = "calbordered";
	innerContainer.id = containerId + "_inner";

	var cal1Container = document.createElement("DIV");
	cal1Container.id = containerId + "_0";
	cal1Container.className = "cal2up";
	cal1Container.style.marginRight = "10px";

	var cal2Container = document.createElement("DIV");
	cal2Container.id = containerId + "_1";
	cal2Container.className = "cal2up";

	outerContainer.appendChild(innerContainer);
	innerContainer.appendChild(cal1Container);
	innerContainer.appendChild(cal2Container);

	this.innerContainer = innerContainer;
	this.outerContainer = outerContainer;
}

/**
* Renders the 2-up calendar.
*/
YAHOO.widget.Calendar2up.prototype.render = function() {
	this.renderHeader();
	YAHOO.widget.CalendarGroup.prototype.render.call(this);
	this.renderFooter();
};

/**
* Renders the header located at the top of the container for the 2-up calendar.
*/
YAHOO.widget.Calendar2up.prototype.renderHeader = function() {
	if (! this.title) {
		this.title = "";
	}
	if (! this.titleDiv)
	{
		this.titleDiv = document.createElement("DIV");
		if (this.title == "")
		{
			this.titleDiv.style.display="none";
		}
	}

	this.titleDiv.className = "title";
	this.titleDiv.innerHTML = this.title;

	if (this.outerContainer.style.position == "absolute")
	{
		var linkClose = document.createElement("A");
		linkClose.href = "javascript:void(null)";
		YAHOO.util.Event.addListener(linkClose, "click", this.hide, this);

		var imgClose = document.createElement("IMG");
		imgClose.src = "img/calx.gif";
		imgClose.className = "close-icon";

		linkClose.appendChild(imgClose);

		this.linkClose = linkClose;

		this.titleDiv.appendChild(linkClose);
	}

	this.innerContainer.insertBefore(this.titleDiv, this.innerContainer.firstChild);
}

/**
* Hides the 2-up calendar's outer container from view.
*/
YAHOO.widget.Calendar2up.prototype.hide = function(e, cal) {
	if (! cal)
	{
		cal = this;
	}
	cal.outerContainer.style.display = "none";
}

/**
* Renders a footer for the 2-up calendar container. By default, this method is
* unimplemented.
*/
YAHOO.widget.Calendar2up.prototype.renderFooter = function() {}

YAHOO.widget.Cal2up = YAHOO.widget.Calendar2up;


MultiSelect =
{
	className : 'MultiSelect',
	instances : [],
	index : 0,
	scrollElement : document
}
MultiSelect.msie = (navigator.appName=='Microsoft Internet Explorer') ? true : false;
MultiSelect.preloadImages = [];
var $img = new Image();
$img.src = 'http://sichnevyj.com/img/MultiSelect/arrow.over.gif';
MultiSelect.preloadImages.push($img);



MultiSelect.scan = function($root)
{
	
	if(!$root) { var $root = document; }
	
	var $return = [];
	var $selects = [];
	var $ss = $root.getElementsByTagName('select');
	var $len = $ss.length;
	for(var $i=0; $i<$len; $i++) { $selects.push($ss[$i]); }
	for(var $i=0; $i<$len; $i++)
	{
		var $select = $selects.shift();
		var $re = new RegExp('\\b'+this.className+'\\b');
		if($select.className.match($re)) { $return.push(this.generate($select)); }
	}
	
	return $return;
	
}

MultiSelect.generate = function($select)
{
	
	$select.style.display = 'inline';
	var $n = $select.cloneNode(true);
	var $cselect = document.body.appendChild($n);
	
	//
	// select already has MSID
	//
	var $re = new RegExp('\\b'+this.className+'ID\\d+\\b');
	var $m = $select.className.match($re);
	if($m!=null)
	{
		
		var $container = document.getElementById($m[0]);
		$container.innerHTML = '';
		var $re = new RegExp('\\b'+this.className+'Index(\\d+)\\b');
		var $index = $container.className.match($re)[1];
		
	}
	
	//
	// generate MS
	//
	else
	{
		
		var $index = this.index++;
		var $container = Node.createDiv({node:$select, insert:'after', attrs:{align:'left'}});
		var $mid = new String(Math.random());
		var $mid = this.className+'ID'+($mid.replace(/^0\./, ''));
		$container.id = $mid;
		$select.className += ' '+$mid;
		$container.className = this.className+' '+this.className+'Index'+$index;
		Spry.Widget.Utils.addEventListener($select, 'change', function(){$container.value=$select.value;}, true);
		
		//
		// object parameters
		//
		this.instances[$index] = [];
		this.instances[$index]['index'] = $index;
		this.instances[$index]['select'] = $select;
		this.instances[$index]['eventListeners'] = [];
		this.instances[$index]['intervals'] = [];
		this.instances[$index]['container'] = $container;
		
		//
		// event listeners, intervals etc.
		//
		// element scroll
		var $ev = [this.scrollElement, 'scroll', function(){MultiSelect.hideOptions($index);}, true];
		Spry.Widget.Utils.addEventListener($ev[0], $ev[1], $ev[2], $ev[3]);
		this.instances[$index]['eventListeners'].push($ev);
		// value update interval
		this.instances[$index]['intervals'].push
		(
			setInterval(
			function()
			{
				var $cv = MultiSelect.instances[$index]['container'].value;
				var $sv = MultiSelect.instances[$index]['select'].value;
				if($cv!=$sv)
				{
					MultiSelect.instances[$index]['container'].value = $sv;
					var $opts = MultiSelect.instances[$index]['options'].getElementsByTagName('button');
					for(var $i=0; $i<$opts.length; $i++)
					{
						var $opt = $opts[$i];
						if($opt.className.match(/\boption\b/))
						{
							if($opt.attributes.getNamedItem('value').value==$sv)
							{
								var $value = $opt.firstChild.firstChild.firstChild.firstChild.innerHTML;
								break;
							}
							else { var $value = $opts[0].firstChild.firstChild.firstChild.firstChild.innerHTML; }
						}
					}
					MultiSelect.instances[$index]['input'].value = $value;
				}
			}
			, 1)
		);
		
	}
	$container.value = '%%__GENERATING__%%';
	
	//
	// corners
	//
	var $table = Node.createTable
	(
		{
			trs:
			[
				[
					'<img src="http://sichnevyj.com/img/MultiSelect/lt.gif" alt="lt" border="0" />',
					{attrs:{'class':'bg'},xhtml:''},
					'<img src="http://sichnevyj.com/img/MultiSelect/rt.gif" alt="lt" border="0" />'
				],
				[
					{attrs:{'class':'bg'},xhtml:''},
					{attrs:{'class':'bg core'},xhtml:''},
					{attrs:{'class':'bg'},xhtml:''},
				],
				[
					'<img src="http://sichnevyj.com/img/MultiSelect/lb.gif" alt="lt" border="0" />',
					{attrs:{'class':'bg'},xhtml:''},
					'<img src="http://sichnevyj.com/img/MultiSelect/rb.gif" alt="lt" border="0" />'
				]
			],
			node:$container
		}
	);
	var $coretd = Node.getElementByClassName('\\bcore\\b', $table);
	
	//
	// table
	//
	var $table = Node.createTable({trs:[ [{attrs:{align:'left'},xhtml:''}] , [{attrs:{align:'left'},xhtml:''}] ], node:$coretd});
	$table.style.width = $cselect.offsetWidth+'px';
	var $tdtop = $table.getElementsByTagName('td')[0];
	var $tdbot = $table.getElementsByTagName('td')[1];
	var $table = Node.createTable({trs:[ ['','<img src="http://sichnevyj.com/img/MultiSelect/verline.gif" alt="verline" border="0" />',''] ], node:$tdtop});
	$table.style.width = '100%';
	var $tdleft = $table.getElementsByTagName('td')[0];
	$tdleft.style.width = '100%';
	var $tdright = $table.getElementsByTagName('td')[2];
	
	//
	// input
	//
	//var $input = Node.createInput('text', {node:$tdleft});
	var $input = Node.createInput('button', {node:$tdleft});
	$input.style.width = '100%';
	this.instances[$index]['input'] = $input;
	// mouseover
	$input.onmouseover = function()
	{
		if(Node.isDisabled($container)===false)
		{
			this.className += ' over';
		}
	}
	// mouseout
	$input.onmouseout = function()
	{
		if(Node.isDisabled($container)===false)
		{
			this.className = this.className.replace(/\bover\b/g, '');
		}
	}
	// click
	$input.onclick = function()
	{
		if(Node.isDisabled($container)===false)
		{
			MultiSelect.toggleOptions($index);
		}
	}
	/*// focus
	$input.onfocus = function()
	{
		if(Node.isDisabled($container)===false)
		{
			this.className += ' focus';
			MultiSelect.showOptions($index);
		}
	}
	// blur
	$input.onblur = function()
	{
		if(Node.isDisabled($container)===false)
		{
			this.className = this.className.replace(/\bfocus\b/g, '');
			MultiSelect.hideOptions($index);
		}
	}*/
	
	//
	// button
	//
	var $ext = 'gif';
	var $src = 'http://sichnevyj.com/img/MultiSelect/arrow';
	var $oversrc = $src+'.over.'+$ext;
	$src += '.'+$ext;
	var $button = Node.create('img', 1, {node:$tdright, attrs:{'class':'button',src:$src}})[0];
	$button.onmouseover = function()
	{
		if(Node.isDisabled($container)===false)
		{
			this.src = $oversrc;
		}
	}
	$button.onmouseout = function()
	{
		if(Node.isDisabled($container)===false)
		{
			this.src = $src;
		}
	}
	$button.onclick = function()
	{
		if(Node.isDisabled($container)===false)
		{
			MultiSelect.toggleOptions($index);
		}
	}
	
	//
	// options
	//
	var $options = Node.createDiv({node:$tdbot, attrs:{'class':'options'}});
	var $optns = $select.getElementsByTagName('option');
	var $xhtml = '';
	for(var $i=0; $i<$optns.length; $i++)
	{
		var $optn = $optns[$i];
		var $dc = ($optn.disabled) ? ' disabled' : '';
		var $da = ($optn.disabled) ? ' disabled="disabled"' : '';
		$xhtml += '<button class="option'+$dc+'" type="button" value="'+$optn.value+'"'+$da+' style="width:'+($cselect.offsetWidth)+'px;"';
		$xhtml += ' onmouseover="this.className+=\' over\'"';
		$xhtml += ' onmouseout="this.className=this.className.replace(/\\bover\\b/g, \'\')"';
		$xhtml += ' onclick="MultiSelect.optionOclick(this,'+$index+')"';
		$xhtml += '><table border="0" cellpadding="0" cellspacing="0"><tr><td>'+$optn.innerHTML+'</td></tr></table>';
		$xhtml += '</button>';
	}
	$options.innerHTML = $xhtml;
	$options.style.display = 'none';
	this.instances[$index]['options'] = $options;
	
	$cselect.parentNode.removeChild($cselect);
	$select.style.display = 'none';
	
	return this.instances[$index];
	
}



MultiSelect.destroy = function($param)
{
	
	try
	{
		
		//
		// check param: integer || object
		//
		switch(typeof($param))
		{
			case 'number': var $ins = this.instances[$param]; break;
			case 'object': var $ins = $param; break;
		}
		
		//
		// eventListeners
		//
		for(var $i=0; $i<$ins.eventListeners.length; $i++)
		{
			var $evl = $ins.eventListeners[$i];
			Spry.Widget.Utils.removeEventListener($evl[0], $evl[1], $evl[2], $evl[3]);
		}
		if(typeof(MultiSelect.instances[$ins.index]['documentOnfocus'])=='object')
		{
			var $evl = MultiSelect.instances[$ins.index]['documentOnfocus'];
			Spry.Widget.Utils.removeEventListener($evl[0], $evl[1], $evl[2], $evl[3]);
		}
		
		//
		// intervals
		//
		for(var $i=0; $i<$ins.intervals.length; $i++)
		{
			var $int = $ins.intervals[$i];
			clearInterval($int);
		}
		
		//
		// node
		//
		Node.remove($ins.container);
		
		//
		// object
		//
		delete this.instances[$ins.index];
		this.index--;
		
	} // try
	catch($e) { Debuger.output($e); }
	
}



MultiSelect.showOptions = function($index)
{
	
	MultiSelect.instances[$index]['input'].focus();
	var $container = this.instances[$index]['container'];
	var $options = this.instances[$index]['options'];
	$options.style.display = 'block';
	$options.style.height = 'auto';
	$options.style.marginTop = 0;
	if(($options.offsetTop+$options.offsetHeight)>document.documentElement.offsetHeight)
	{
		$options.style.marginTop = -$options.offsetHeight-$container.offsetHeight+'px';
	}
	if($options.offsetTop<0)
	{
		$options.style.height = $options.offsetHeight-Math.abs($options.offsetTop)+'px';
		$options.style.marginTop = -$options.offsetHeight-$container.offsetHeight+'px';
	}
	
	setTimeout
	(
		function()
		{
			var f = function($e)
			{
				//MultiSelect.documentOnfocus($e, $index);
				MultiSelect.hideOptions($index);
			}
			var $ev = [document, 'click', f, false];
			Spry.Widget.Utils.addEventListener($ev[0], $ev[1], $ev[2], $ev[3]);
			MultiSelect.instances[$index]['documentOnfocus'] = $ev;
		}
		, 1
	);
	
}



MultiSelect.hideOptions = function($index)
{
	
	try
	{
		
		MultiSelect.instances[$index]['options'].style.display = 'none';
		
		if(typeof(MultiSelect.instances[$index]['documentOnfocus'])=='object')
		{
			var $evl = MultiSelect.instances[$index]['documentOnfocus'];
			Spry.Widget.Utils.removeEventListener($evl[0], $evl[1], $evl[2], $evl[3]);
			delete MultiSelect.instances[$index]['documentOnfocus'];
		}
		
	} //try
	catch($e) { Debuger.output($e); }
	
}



MultiSelect.toggleOptions = function($index)
{
	
	var $opts = MultiSelect.instances[$index]['options'];
	if($opts.style.display=='none') { this.showOptions($index); }
	else { MultiSelect.hideOptions($index); }
	
}



MultiSelect.documentOnfocus = function($event, $index)
{
	
	/*try
	{*/
		
		if(typeof(MultiSelect)=='object')
		{
			var $target = Event.getTarget($event);
			
			var $blur = true;
			
			var $c = MultiSelect.instances[$index]['container'];
			if(Node.isParentOf($c, $target)) { var $blur = false; }
			if($blur) { MultiSelect.hideOptions($index); }
		}
		
	/*} // try
	catch($e) { Debuger.output($e); }*/
	
}



MultiSelect.optionOclick = function($this, $index)
{
	
	var $ins = this.instances[$index];
	$this.className += ' focus';
	var $value = $this.attributes.getNamedItem('value').value;
	if($ins.container.value!=$value)
	{
		$ins['select'].value = $value;
		if($ins['select'].onchange) { $ins['select'].onchange($ins['select']); }
	}
	MultiSelect.hideOptions($index);
	
}

