<!DOCTYPE html>
<html>
	<head>
		<title>Camagru</title>
		<link rel='stylesheet' href='css/styles.css'>
		<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'>
	</head>
	<body>
		<header>
			<div>Camagru Gallery</div>
			<div>
				<?php
				?>
				<?php
					if (isset($_SESSION['auth-data']['login'])) {
					echo
						"<a id='my-account-button' href='/account'>My account</a>" .
						"<a id='signout-button' href='/signout'>Sign out</a>";
					} else {
						echo 
							"<button id='signin-button'>Sign in</button>" .
							"<button id='signup-button'>Sign up</button>" .
							"<button id='reset-password-button'>Forgot password?</button>";
					}
				?>
			</div>
		</header>
		<div id='form-container'></div>
		<main>
			<div id='gallery'></div>
		</main>
		<footer>@ grevenko 2018</footer>
	</body>
	<script src='js/home.js'></script>
</html>
