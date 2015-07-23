
(function(LatchForNodeBB) {
	
	init = function()
	{
		$(window).on('action:ajaxify.contentLoaded', function () {
			// Comprobar si estamos en los ajustes del usuario, y si lo estamos
			// mostramos el input y demas para el pareo
			if( document.URL.indexOf("/user/")> -1 && document.URL.indexOf("/edit")> -1 && $(".col-md-5") )
			{
				require(['translator'], function(translator) {
					//var loQueHabia = $(".col-md-5").html();

					templates.parse('partials/latch', {}, function(html) {
						translator.translate(html, function(html) {
							$(".col-md-5").last().append(html);
						});
					});

					$("#latchPairBtn").on("click", function(){
						socket.emit('plugins.latchPairRequest',{ latchcode:$("#latchPairCode").val() }, function(err, data){
							if(err)
							{
								translator.translate('[[latch:pair.failure]]', function(translated) {
									alert(translated);
								});
							}
							else
							{
								translator.translate('[[latch:pair.success]]', function(translated) {
									alert(translated);
								});
							}
						});
					});

					$("#latchUnPairBtn").on("click", function(){
						socket.emit('plugins.latchUnPairRequest',{}, function(err, data){
							if(err)
							{
								translator.translate('[[latch:unpair.failure]]', function(translated) {
									alert(translated);
								});
							}
							else
							{
								translator.translate('[[latch:unpair.success]]', function(translated) {
									alert(translated);
								});
							}
						});
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

