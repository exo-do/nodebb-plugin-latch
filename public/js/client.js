
(function(LatchForNodeBB) {
	
	init = function()
	{
		$(window).on('action:ajaxify.contentLoaded', function () {
			// Comprobar si estamos en los ajustes del usuario, y si lo estamos
			// mostramos el input y demas para el pareo
			if( document.URL.indexOf("/user/")> -1 && document.URL.indexOf("/edit")> -1 && $(".col-md-5") )
			{
				//var loQueHabia = $(".col-md-5").html();
				var inputsLatch = '<br><img src="http://www.channelbiz.es/wp-content/uploads/2013/12/latch.jpg" width="100" height="44"><br> <div class="control-group"><label class="control-label" for="inputLatchPairCode">Código de Pareo Latch</label><div class="input-group"><input class="form-control" type="text" id="latchPairCode" placeholder="Codigo de pareo" value="" style="width:300px"><span class="input-group-addon"><span id="password-notify"></span></span></div></div>';
				inputsLatch += '<a id="latchPairBtn" href="#" class="btn btn-primary"><i class="hide fa fa-spinner fa-spin"></i>Parear</a>';
				inputsLatch += '<a id="latchUnPairBtn" href="#" class="btn btn-danger"><i class="hide fa fa-spinner fa-spin"></i>Desparear</a>';
				$($(".col-md-5")[1]).append(inputsLatch);

				$("#latchPairBtn").on("click", function(){
					socket.emit('plugins.latchPairRequest',{ latchcode:$("#latchPairCode").val() }, function(err, data){
						if(err)
						{
							alert("No se pudo parear..");
						}
						else
							alert("Pareado Correctamente!");
					});
				});

				$("#latchUnPairBtn").on("click", function(){
					socket.emit('plugins.latchUnPairRequest',{}, function(err, data){
						if(err)
						{
							alert("No se pudo desparear..");
						}
						else
							alert("Despareado Correctamente!");
					});
				});
			}
			if( app.user.uid > 0 )
			{
				// LogOut por latch
				socket.emit('plugins.latchStatus',{}, function(err, data){
					if(err)
						console.log(err);
					else if(data === "off")
					{
						app.logout();
					}
				});
			}
		});
	}

	init();

})(window.LatchForNodeBB);

