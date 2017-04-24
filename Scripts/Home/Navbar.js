 Func.IntevaloLogin(); 
 var socket = io.connect(Config.UrlSocketLogin+'/web');
 $("#Perfil").click(function() {
 	var TextAdmin;
 	if(Func.GetAdmin()){TextAdmin='Administrador'; }
 	else{TextAdmin='Consulta';} 	
 	BootstrapDialog.show({
        title: 'Perfil',
        message: '<ul class="chat">'+
                        '<ul class="chat">'+
                        '<li class="left clearfix"><span class="chat-img pull-left">'+
                            '<i class="fa fa-user-secret img-circle  fa-3x" aria-hidden="true"></i>'+
                        '</span>'+
                            '<div class="chat-body clearfix">'+
                                '<div class="header">'+
                                    '<strong class="primary-font">'+Func.GetNombre()+
                                    ' </strong> <small class="pull-right text-muted">'+
                                        '<span class="glyphicon glyphicon-time"></span>'+
                                        Func.GetHoraLogin()+
                                        '</small>'+
                                '</div>'+
                                '<p>'+
                                    TextAdmin+
                                '</p>'+
                            '</div>'+
                        '</li>'+
                        '</ul>'+
                     '</ul>',
        buttons: [{
            id: 'btn-ok',   
            icon: 'glyphicon glyphicon-check',       
            label: 'OK',
            cssClass: 'btn-primary', 
            autospin: false,
            action: function(dialogRef){    
                dialogRef.close();
            }
        }]
    });
 });

var changePassClick=0;
$("#CambiarClave").click(function() {
  BootstrapDialog.show({
        title: 'Cambio de Contraseña',
        message: $('<form role="form">'+
        '<div class="form-group">'+
          '<label for="id_text">Contraseña Anterior:</label>'+
          '<input type="password" class="form-control" id="old_pass" placeholder="Ingrese contraseña anterior...">'+
        '</div>'+
        '<div class="form-group">'+
          '<label for="newpass1">Nueva contraseña:</label>'+
          '<input type="password" class="form-control" id="newpass1" placeholder="Ingrese contraseña">'+
        '</div>'+
        '<div class="form-group">'+
          '<label for="newpass2">Repetir contraseña:</label>'+
          '<input type="password" class="form-control" id="newpass2" placeholder="Repetir contraseña">'+
        '</div>'+
      '</form>'),
        onhide: function(dialogRef){
            if(changePassClick==0){
                var old_pass = dialogRef.getModalBody().find('#old_pass').val();
                var newpass1 = dialogRef.getModalBody().find('#newpass1').val();
                var newpass2 = dialogRef.getModalBody().find('#newpass2').val();
                       
                 if(newpass1== ""||newpass2== "") {
                    msj_peligro("Ingrese la nueva contraseña!");
                    $("#newpass1").focus();
                    return false;
                }else if(newpass1!= newpass2) {
                    msj_peligro("Las contraseñas no son iguales!");
                    $("#newpass1").focus();
                    return false;
                }else{
                    var data= {usr:Func.GetUsuario(),pass:old_pass,pasnew:newpass2};
            		var DataAES =Func.Ecrypted(data);
                  	socket.emit('CambioPass',DataAES,function(data){
                  		msj_exito("Se cambio la contraseña exitosamente!");  
                        return true;
                    });
                }
            }else{
                return true;
            }
        },
        buttons: [{
            label: 'Ejecutar',
            cssClass: 'btn-primary',
            icon: 'glyphicon glyphicon-check',  
            hotkey: 13,
            action: function(dialogRef) {
                var old_pass = dialogRef.getModalBody().find('#old_pass').val();
                changePassClick=0;
                if(old_pass==""){
                    msj_peligro("Ingrese la contraseña anterior!");
                    $("#old_pass").focus();
                    return false;                
                }else{
            	    if(Func.GetCl()!=old_pass){  
                        msj_peligro("Las contraseña anterior no es valida!");
                        $("#old_pass").focus();
                        return false;                            
                    } else {
                        dialogRef.close();
                    }
                }
            }
        },{
            label: 'Cerrar',
            icon: 'glyphicon glyphicon-remove',
            cssClass: 'btn-default',
            action: function(dialogRef) {
                changePassClick=1;
                dialogRef.close();
            }
        }]
    });
 });

$("#CerrarSession").click(function() {
	Func.CerrarAPP();
});