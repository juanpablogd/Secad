
var Func={
	Decrypted : function (message) {
		try {
			var text=CryptoJS.AES.decrypt(message,Config.cl).toString(CryptoJS.enc.Utf8)
		}
		catch(err) {
		    this.CerrarAPP();
			return false;
		}
		if(text==''){
			this.CerrarAPP();
			return false;
		}else{
			var decrypted =JSON.parse(CryptoJS.AES.decrypt(message,Config.cl).toString(CryptoJS.enc.Utf8));
			return decrypted;	
		}
	},
	Ecrypted: function (json){
		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(json), Config.cl);
		return ciphertext.toString();
	},
	DataLogin: function (){
		var DatosUsuario=this.Decrypted(localStorage.dt);
		return	DatosUsuario;
	},
	GetNombre: function (){
		var data=this.DataLogin();
		return data[0].nombre;
	},
	GetIdPerfil: function (){
		var data=this.DataLogin();
		return data[0].id_perfil;
	},
	GetAdmin: function (){
		var data=this.DataLogin();
		if(data[0].id_perfil_admin==24){
	        return true;	
	    }else{
	    	return false;	
	    }
	},
	GetHoraLogin: function (){
		var data=this.DataLogin();
		return data[0].hora;
	},
	GetCl: function (){
		var data=this.DataLogin();
		return data[0].contrasegna;
	},
	GetUsuario: function (){
		var data=this.DataLogin();
		return data[0].usuario;
	},
	CerrarAPP: function(){
		localStorage.clear();
	   window.location.assign("../Login/index.html");
	},
	ValidaUsuario: function(){
		if(!localStorage.dt){
			this.CerrarAPP();
	    }else{
	    	var id_perfil=this.GetIdPerfil();
	        if(Config.id_perfil.indexOf(id_perfil)<0){
	        	this.CerrarAPP();	
	        }
	    }
	},
	IntevaloLogin:function(){
		var app=this
		app.ValidaUsuario();
		setInterval(function(){
			console.log('Valido');
			app.ValidaUsuario();
		}, 1000*5);	
	},
	degToRad:function(deg) {
       return deg * Math.PI * 2 / 360;
   }
	
}
