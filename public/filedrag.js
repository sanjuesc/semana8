// getElementById
	function $id(id) {
		return document.getElementById(id);
	}


	// output information
	function output(msg) {
		var m = $id("messages");
		m.innerHTML = m.innerHTML +msg;
	}


	// file drag hover
	function fileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type === "dragover" ? "hover" : "");
	}


	// file selection
	function fileSelectHandler(e) {
		console.log("a")
		// cancel event and hover styling
		fileDragHover(e);

		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

        if ( e.constructor.name !==  "DragEvent"){
            // process all File objects
            for (var i = 0, f; f = files[i]; i++) {
                parseFile(f);
				console.log("a")
            }
        }

        // files can be added by drag&drop or clicking on form's button
        // if the later, append files to form files field 
        /*

        var formFiles = $id("upload").fileselect;
                if (formFiles.files.length == 0){
            formFiles.files = files;
        }
         */




	}


	// output file information
	function parseFile(file) {

		output(
			"<p>Datos del fichero: <strong>" + file.name +
			"</strong> Tipo: <strong>" + file.type +
			"</strong> Tamaño: <strong>" + file.size +
			"</strong> bytes</p>"
		);

	}


    function enviar(submitform){
    // debes devolver una función que recoja los datos de submitform usando FormData y haga una
    // petición post (usando el Fetch API) con dichos datos a /pedido/add 
    //  El resultado debes tratarlo como un objeto JSON y mostrarlo pantalla. En concreto la respuesta
    // JSON debe contener las rutas a los ficheros subidos al servidor (al hacer click sobre ellas deben
    // abrirse los ficheros) y los valores del resto de campos
		var formData = new FormData(submitform);
		fetch("pedido/add/",
			{
				body: formData,
				method: "post"
			})
			.then(function(res){ return res.json(); })
			.then(function(data){
				if(data.error){
					alert(data.error);
				}else{
					output("<br>Resultado del formulario:<br>");
					output("<ul>")
					const keys = Object.keys(data)
					for (var i = 0; i < keys.length - 1; i++) {
						output("<li>"+data[keys[i]]+"</li>")
					}
					output("<li>Imagenes:</li>")
					output("</ul>")
					for(var a in data['archivos']){
						output("<a href=\""+data['archivos'][a]+"\" target=\"_blank\"><img src=\""+data['archivos'][a]+"\" alt=\"Imagen de turno\" style=\"width:100px;height:100px;\"></a>\n")
					}
				}
			});



    }

	// initialize
	function init() {




		var dropbox = $id("file");
		var form = document.getElementById("upload");
		form.onsubmit = function(event) {
			event.preventDefault();
			enviar(form);
			return false;
		}

		dropbox.addEventListener("dragenter", fileDragHover, false);
		dropbox.addEventListener("dragover", fileDragHover, false);
		dropbox.addEventListener("dragleave", fileDragHover, false);
		dropbox.addEventListener("ondrop", fileSelectHandler, false);

		dropbox.style.display = "block";
	}

	// call initialization file
	if (window.File && window.FileList) {
		init();
	}

