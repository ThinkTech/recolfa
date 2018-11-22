var tplMgr = {
	fIsLocal : window.location.protocol == "file:",

	init : function(){
		var vLinks = document.querySelectorAll(".lnkResource");
		var vLists = scPaLib.findNodes("des:li.folder/chi:div/nsi:ul");
		for (var i = 0; i < vLinks.length; i++) {
			var vLink = vLinks[i];
			// accordeon
			if (vLink.parentNode.nextSibling) vLink.parentNode.nextSibling.style.height = 0;
			vLink.onclick = function(){
				var vMinItemHeight = document.querySelector("li:not([class='child folder'])").offsetHeight + 9;
				if (scPaLib.findNode("anc:li",this).classList.contains('folder')) {
					var vParentLists = scPaLib.findNodes("anc:li.folder/par:ul", this);
					// Passe les tag a enfants et cousins en fermé s'ils étaient ouverts quand on click
					var vChidFolderLnks = scPaLib.findNode("anc:ul", this).querySelectorAll("li.folder > div > a");
					for (var j = 0; j < vChidFolderLnks.length; j++) {
						var vChidFolderLnk = vChidFolderLnks[j];
						if (vChidFolderLnk.fOpen && vChidFolderLnk != this) vChidFolderLnk.fOpen = !vChidFolderLnk.fOpen;
					}
					// Gère la taille des listes à tous les niveaux et toggle la liste courante
					for (var j = 0; j < vLists.length; j++) {
						var vList = vLists[j];
						if(vList == this.parentNode.nextSibling) {
							this.fHeight = !this.fOpen ? vMinItemHeight * vList.childNodes.length : 0;
							vList.style.height = this.fHeight + "px";
							for (var k = 0; k < vParentLists.length; k++) {
								this.fHeight = this.fHeight + vMinItemHeight * vParentLists[k].childNodes.length;
								vParentLists[k].style.height = this.fHeight + "px";
							}
						}
						else if (vParentLists.indexOf(vList) == -1) vList.style.height = 0;
					}
					this.fOpen = !this.fOpen;
					return false;
				} else {
					sessionStorage.setItem("SCportal-parent-title", document.title);
					sessionStorage.setItem("SCportal-parent-url", tplMgr.hrefBase());
				}
			}
			var vParentLi = scPaLib.findNode("anc:li",vLink);
			var vCutPosition = this.hrefBase().lastIndexOf("/co/")+1 || this.hrefBase().lastIndexOf("/index.")+1 || this.hrefBase().length;
			var vBaseUrl = this.hrefBase().substring(0, vCutPosition)+'/';
			if (vLink.href && !vParentLi.classList.contains("folder")) {
				var vScDownloadAttribute = vLink.getAttribute("sc-download");
				if (vScDownloadAttribute && vScDownloadAttribute.indexOf("http") == -1) vLink.setAttribute("sc-download", vBaseUrl + '/' + vScDownloadAttribute);
				this.xSetMimeType(vLink).then(function (link){
					if (link.mimeType) {
						var type = link.mimeType.indexOf("video") != -1 ? 'video' : link.mimeType.indexOf("audio") != -1 ? 'audio': link.mimeType.indexOf("image") != -1 ? 'image' : link.mimeType.indexOf("pdf") != -1 ? 'pdf' : link.mimeType.indexOf("text") != -1 ? 'file' : 'archive';
						scPaLib.findNode("anc:li",link).classList.add(type);
					}					
				});
			}
		}
	},

	xSetMimeType : function(pLnk){
		return new Promise(function (resolve) {
			var vReq = tplMgr.xGetHttpRequest();
			vReq.open("HEAD",  pLnk.href);
			vReq.onreadystatechange=function() {
				if (vReq.readyState == 4) {
					if(vReq.status == 200) {
						pLnk.mimeType = vReq.getResponseHeader("Content-Type");
						resolve(pLnk);
					}
				}
			}
			vReq.send(null);
		});
		
	},

	xGetHttpRequest: function(){
		if (window.XMLHttpRequest && (!this.fIsLocal || !window.ActiveXObject)) return new XMLHttpRequest();
		else if (window.ActiveXObject) return new ActiveXObject("Microsoft.XMLHTTP");
	},

	hrefBase : function(pHref){
		var vHref = pHref || window.location.href;
		if (vHref.indexOf("?")>-1) vHref = vHref.substring(0,vHref.indexOf("?"));
		if (vHref.indexOf("#")>-1) vHref = vHref.substring(0,vHref.indexOf("#"));
		return vHref.replace(/\/+$/, "");
	}
}