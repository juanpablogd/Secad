$(document).ready(function () {
    if (localStorage.getItem("id_usr") > 0) {
        window.location.assign("http://saga.cundinamarca.gov.co/geoportal/gis/")
    };
    $("#acceder").click(function () {
        if (!$("#usuario").val()) {
            bootbox.alert("por favor ingrese el nombre de usuario", function () {});
            $("#usuario").focus()
        } else if (!$("#contrasena").val()) {
            bootbox.alert("por favor ingrese la contraseña", function () {});
            $("#contrasena").focus()
        } else {
            var usuario = ($("#usuario").val());
            var login = ($("#contrasena").val());
            var modulo = ($("#modulo").val());
            if (modulo == 'SAGA'){
            	var url_ing ="http://saga.cundinamarca.gov.co/geoportal/gis/";
            }
            else if (modulo == '123'){
            	var url_ing ="http://saga.cundinamarca.gov.co/vs/app/";
            }
            $.ajax({
                url: 'http://190.27.239.158/SIG/servicios/logueo.php',
                type: "POST",
                data: {
                    'usr': usuario,
                    'mod': modulo,
                    'pas': login
                },
                dataType: 'json',
                success: function (data) {
                    if (data[0].encontrado == "true") {
                    	if(modulo=='SAGA'){
                        var id = data[1].id;
                        var nombre = data[1].nombre;
                        localStorage.id_usr = id;
                        localStorage.nombre = nombre;
                        localStorage.id_perfil = data[1].id_perfil;
                        localStorage.admin = data[1].admin;
                        localStorage.permisos = data[2].permisos;
                        localStorage.verticales = data[3].verticales;
                        localStorage.id_perfil_admin = data[1].id_perfil_admin;
                        bootbox.alert("Bienvenido, " + nombre, function () {});
                       }
                        window.location.assign(url_ing);
                    } else {
                        bootbox.alert("Usuario no encontrado!", function () {})
                    }
                },
                error: function (error) {
                    bootbox.alert("El servicio no esta disponible, compruebe su conexion a internet", function () {})
                }
            });
            return false
        }
    })
});