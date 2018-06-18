<!DOCTYOE html>
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
					if (isset($_SESSION['auth-data']['login'])) {
						echo
							"<a id='signout-button' href='/signout'>Sign out</a>" .
							"<a id='my-account-button' href='/account'>My account</a>";
						} else {
							echo 
								"<a id='signin-button' href='/signin'>Sign in</a>" .
								"<a id='signup-button' href='/signup'>Sign up</a>" .
								"<a id='reset-password-button' href='/forgotPassword'>Forgot password?</a>";
						}
				?>
			</div>
		</header>
		<div id='main'>
			<div id='gallery'></div>
		</div>
		<footer>@ grevenko 2018</footer>
	</body>
	<script src='js/script.js'></script>
</html>
