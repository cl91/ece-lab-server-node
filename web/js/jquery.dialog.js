﻿(function($){$.dialog={url:'http://www.jqueryscript.net',height:'auto',width:'auto',top:'200px',left:'200px',iconCls:'add',mainFrame:'',subForm:'',alert:function(b,c,d){if(b==''||b==null){b="Title"}$.dialog._show(b,c,null,'alert',function(a){if(d)d(a)})},confirm:function(b,c,d){if(b==''||b==null){b="Title"}$.dialog._show(b,c,null,'confirm',function(a){if(d)d(a)})},window:function(b,c,d,e){if(b==''||b==null){b="Popup window"}$.dialog._show(b,c,d,'window',function(a){if(e)e(a)})},_show:function(d,e,f,g,h){var i=null;var j=0;switch(g){case'alert':i="popup_close_alert";$.dialog._overlay('show',"overflow_alert");j=$.dialog._getCurrentZIndex();$("body").append('<div id="popup_container_alert" class="modal-content" style="width: '+$.dialog.width+';height:'+$.dialog.height+';top:'+$.dialog.top+';left:'+$.dialog.left+'; margin: auto; overflow: hidden; position: absolute;_position:absolute; left: 300px; z-index: '+j+'; border: 1px solid rgb(234, 234, 234); background: none repeat scroll 0% 0% rgb(255, 255, 255);">'+'<h1  class="popup_title modal-header" style="padding: 0 0 10px; font-size:21px;"><div style="float:left;color:#eaeaea;width:16px;height:16px; margin: 10px 5px;" class="'+$.dialog.iconCls+'"></div><div class="popup_title_c" style="margin: auto; width: 90%;cursor:move;">'+d+'<span onclick="$.dialog._hide(\'popup_container_alert\', \'overflow_alert\')" style="float:right">X</span></div></h1>'+'<div id="popup_content_alert" class="modal-body" style="height:75%;" style="padding: 5px 0 15px 5px;">'+e+'</div>'+'<div id="popup_message_alert"></div>'+'</div>');$("#popup_message_alert").after('<div id="popup_panel_alert" class="modal-footer"><input type="button" value="Close" id="popup_close_alert" class="btn btn-danger"/></div>');break;case'confirm':i="popup_ok_confirm";$.dialog._overlay('show',"overflow_confirm");j=$.dialog._getCurrentZIndex();$("body").append('<div id="popup_container_confirm" class="modal-content" style="width: '+$.dialog.width+';height:'+$.dialog.height+';top:'+$.dialog.top+';left:'+$.dialog.left+'; margin: auto; overflow: hidden; position: absolute; _position:absolute;left: 300px; z-index: '+j+'; border: 1px solid rgb(234, 234, 234); background: none repeat scroll 0% 0% rgb(255, 255, 255);">'+'<h1 class="popup_title modal-header" style="padding: 0 0 10px; font-size:21px;"><div style="float:left;color:#eaeaea;width:16px;height:16px; margin: 10px 5px;" class="'+$.dialog.iconCls+'"></div><div class="popup_title_c" style="margin: auto; width: 90%;cursor:move;">'+d+'<span onclick="$.dialog._hide(\'popup_container_confirm\', \'overflow_confirm\')" style="float:right">X</span></div></h1>'+'<div id="popup_content_confirm" class="modal-body" style="height:75%;">'+e+'</div>'+'<div id="popup_message_confirm"></div>'+'</div>');$("#popup_message_confirm").after('<div id="popup_panel_confirm" class="modal-footer"><input type="button" value="Okay" class="btn btn-default" id="popup_ok_confirm" /><input type="button" value="Cancel" class="btn btn-danger" id="popup_cancel_confirm" /></div>');break;case'window':i="popup_ok_window";$.dialog._overlay('show',"overflow_window");j=$.dialog._getCurrentZIndex();$("body").append('<div id="popup_container_window" class="modal-content" style="width: '+$.dialog.width+';height:'+$.dialog.height+';top:'+$.dialog.top+';left:'+$.dialog.left+'; margin: auto;min-width:300px; overflow: hidden; position: absolute;_position:absolute; left: 300px; z-index: '+j+'; border: 1px solid rgb(234, 234, 234); background: none repeat scroll 0% 0% rgb(255, 255, 255);">'+'<h1  class="popup_title modal-header" style="padding: 0 0 10px; font-size:21px;"><div style="float:left;color:#eaeaea;width:16px;height:16px; margin: 10px 5px;" class="'+$.dialog.iconCls+'"></div><div class="popup_title_c" style="margin: auto; width: 90%;cursor:move;">'+d+'<span onclick="$.dialog._hide(\'popup_container_window\', \'overflow_window\')" style="float:right">X</span></div></h1>'+'<div id="popup_content_window" class="modal-body" style="height:75%;">'+e+'</div>'+'<div id="popup_message_window"></div>'+'</div>');$('#popup_content_window').html('');var k='<div class="a_msg" id="msg_20134010" style="margin: auto;font-size:16px; top:300;left:350;right:300;z-index:1001; color:#000; overflow: hidden;  left: 300px;">Loading...</div>';var l=document.getElementById("msg_20134010");if(l==null){$('#popup_content_window').append(k)}switch(f){case'0':$('#popup_content_window').load(e,null,function(a,b,c){if(c.readyState==4){$('#msg_20134010').html('Loaded...');setTimeout(function(){$('#msg_20134010').html('');$('body').find('div').remove("#msg_20134010")},1000)}});break;case'1':$('body').find('div').remove("#msg_20134010");$('#popup_content_window').append('<div style="width:auto"><iframe scrolling="no" style="border:0px;width:100%;height:100%;overflow:hidden" id="main_frame_01" src="'+e+'"></iframe></div>');$("#main_frame_01").load(function(){$(this).height(0);var a=$(this).contents().height()+10;var b=$(this).contents().width()+50;$(this).height(a<100?100:a);$(this).width(b<300?300:b)});break;default:$('body').find('div').remove("#msg_20134010");$('#popup_content_window').append(e);break}$("#popup_message_window").after('<div id="popup_panel_window" class="modal-footer"><input type="button" value="Save" id="popup_ok_window" class="btn btn-primary"/><input type="button" value="Close" id="popup_cancel_window" class="btn btn-danger"/></div>');break}$("#popup_close_alert").click(function(){$.dialog._hide("popup_container_alert","overflow_alert")});$("#popup_cancel_confirm").click(function(){$.dialog._hide("popup_container_confirm","overflow_confirm")});$("#popup_cancel_window").click(function(){$.dialog._hide("popup_container_window","overflow_window")});$("#"+i).click(function(){h(true)})},_hide:function(a,b){$("#"+a).remove();$.dialog._overlay('hide',b)},_overlay:function(a,b){var c=90000;var d=0;var e=0;var f=0;var g=document.getElementById("popup_container_alert");if(g!=null){d=$("#popup_container_alert").css("z-index")}var h=document.getElementById("popup_container_confirm");if(h!=null){e=$("#popup_container_confirm").css("z-index")}var i=document.getElementById("popup_container_window");if(i!=null){f=$("#popup_container_window").css("z-index")}var j=$.dialog._compareTo(d+","+e+","+f);if(j!=0){c=j+1}var k=document.getElementById(b);if(g!=null){c+=10000}switch(a){case'show':$.dialog._overlay('hide');if(k==null){$("BODY").append('<div id="'+b+'" ></div>')}$("#"+b).css({position:'fixed',_position:'fixed',zIndex:c,top:'0px',left:'0px',bottom:'0px',right:'0px',background:'none repeat scroll 0% 0% rgba(0, 0, 0,0.6)',opacity:'0.5'});break;case'hide':$("#"+b).remove();break}},_compareTo:function(a){var b=new Array();b=a.split(',');var c=0;return Math.max.apply(null,b)},_getCurrentZIndex:function(){var a=0;var b=0;var c=0;var d=document.getElementById("overflow_alert");if(d!=null){a=$("#overflow_alert").css("z-index")}var e=document.getElementById("overflow_confirm");if(e!=null){b=$("#overflow_confirm").css("z-index")}var f=document.getElementById("overflow_window");if(f!=null){c=$("#overflow_window").css("z-index")}return $.dialog._compareTo(a+","+b+","+c)}};var m=function(a){var c=null;var d=0;var f=0;var g=document.body.clientWidth;var b=document.body.clientHeight;var i,leftV,oDiv;var h=0;var w=0;function setHtmlStyle(){}function mouseHandler(e){switch(e.type){case'mousedown':c=a(e);if(c!=null){i=c.style.top.replace('px','');leftV=c.style.left.replace('px','');w=c.style.width.replace('px','');h=c.style.height.replace('px','');setHtmlStyle();d=e.clientX-leftV;f=e.clientY-i}break;case'mousemove':if(c){var l=e.clientX-d;var t=e.clientY-f;if(l<0){l=0}if(t<0){t=0}if(g-w-c.style.left.replace('px','')<0){l=g-w}if(b+h-c.style.top.replace('px','')<-1){t=b+h}c.style.left=l+'px';c.style.top=t+'px'}break;case'mouseup':c=null;break}};return{enable:function(){document.addEventListener('mousedown',mouseHandler);document.addEventListener('mousemove',mouseHandler);document.addEventListener('mouseup',mouseHandler)},disable:function(){document.removeEventListener('mousedown',mouseHandler);document.removeEventListener('mousemove',mouseHandler);document.removeEventListener('mouseup',mouseHandler)}}};function getDraggingDialog(e){var a=e.target;while(a&&a.className.indexOf('popup_title_c')==-1){a=a.offsetParent}if(a!=null){return a.offsetParent}else{return null}}m(getDraggingDialog).enable()})(jQuery)
