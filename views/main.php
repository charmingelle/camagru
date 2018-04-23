<!DOCTYPE html>
<html>
	<head>
		<title>Camagru Gallery</title>
	</head>
	<body>
		<div id='gallery'></div>
		<script>
			fetch('http://localhost:7777/photos', {method: 'POST'})
			.then(function(response) {
				console.log(response);
				return response;
			})
			.catch(function(error) {
				console.log(error.message);
			});
		</script>
	</body>
</html>
