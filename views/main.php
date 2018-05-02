<!DOCTYPE html>
<html>
	<head>
		<title>Camagru Gallery</title>
		<script src='script.js'></script>
	</head>
	<body>
		<div id='gallery'></div>
		<!-- <script>
			let gallery = document.getElementById('gallery');
			
			const appendImg = (sources) => {
				const images = sources.map(source => {
					let img = document.createElement('img');
					
					img.src = source;
					return img;
				});
				gallery.append(...images);
			}
		
			fetch('http://localhost:7777/photos', {method: 'POST'})
			.then(response => response.json())
			.then(appendImg)
			.catch(error => console.log(error.message));
		</script> -->
	</body>
</html>
