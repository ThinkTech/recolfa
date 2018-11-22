var qrcodeMgr = {
	
	fSize : 800,
	
	show : function(pUrl, pTitle){
		this.init();
		this.fQrcode.makeCode(pUrl == decodeURI(pUrl) ? encodeURI(pUrl) : pUrl);
		this.fTitle.innerHTML = pTitle;
		this.fFrame.style.display = ""
	},

	hide : function(){
		this.fFrame.style.display = "none";
		this.fQrcode.clear();
	},

	init : function(){
		if (!this.fFrame){
			this.fFrame = this.addElement("div", document.body, "qrcodeFrame", null, {display:"none"});
			this.addElement("div", this.fFrame, "qrcodeOver").onclick = function(){qrcodeMgr.hide()};
			var vFig = this.addElement("figure", this.fFrame, "qrcodeFigure");
			this.fQrcode = new QRCode(this.addElement("div", vFig, "qrcodeHolder"), {width : this.fSize, height : this.fSize});
			this.fTitle = this.addElement("figcaption", vFig, "qrcodeTitle");
			var vBtnClose =  this.addElement("button", vFig, "btnClose");
			vBtnClose.innerHTML = "<span>✖</span>";
			vBtnClose.title = "Fermer";
			vBtnClose.onclick = function(){qrcodeMgr.hide()};
		}
	},

	addElement : function(pName, pParent, pClassName, pNxtSib, pStyle){
		var vElt;
		vElt = document.createElement(pName);
		if (pNxtSib) pParent.insertBefore(vElt,pNxtSib)
		else pParent.appendChild(vElt);
		if (pClassName) vElt.className = pClassName;
		if (pStyle) {
			for (var vSelect in pStyle) vElt.style[vSelect] = pStyle[vSelect]
		}
		return vElt;
	}

}