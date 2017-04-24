var socket = io.connect(Config.UrlSocketLogin+'/web');
$(document).ready(function () {
    $("#ingresar").click(function () {
        if (!$("#usuario").val()) {
            bootbox.alert("por favor ingrese el nombre de usuario", function () {});
            $("#usuario").focus()
        } else if (!$("#contrasena").val()) {
            bootbox.alert("por favor ingrese la contraseña", function () {});
            $("#contrasena").focus();
        } else {
            var usuario = $("#usuario").val();
            var login = $("#contrasena").val();
            var modulo = $("#modulo").val();
            var data= {'usr': usuario,'mod': modulo,'pas': login};
            var DataAES =Func.Ecrypted(data);
            socket.emit('LoginUsuario',DataAES,function(data){
            	var dat=Func.Decrypted(data);
            	if (dat.length>0){
            		localStorage.dt=data;
            		bootbox.alert("Bienvenido, " + dat[0].nombre, function () {});
                    window.location.assign(Config.NextLogin);
                }else{
                    localStorage.clear();
                    bootbox.alert("Usuario no encontrado!", function () {})
                }
            });
        }
    });
});