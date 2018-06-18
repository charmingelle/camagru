<!DOCTYPE html>
<html>
	<head>
		<title>My account</title>
		<link rel='stylesheet' href='css/styles.css'>
		<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'>
	</head>
	<body>
		<header>
			<div>My account</div>
			<div>
				<a id='signout-button' href='/signout'>Sign out</a>
			</div>
		</header>
		<div id='account-content'>
			<main id='account-main'>
				<div id='account-video-container'>
					<video autoplay='true' id='account-video'>
						Your browser does not support the video tag.
					</video>
				</div>
				<div id='account-stickers'></div>
				<button id='capture'>Take a picture</button>
				<div id='preview'></div>
			</main>
			<aside id='account-aside'>
				<?php
					require_once(getRoot() . 'views/changeEmail.php');
					require_once(getRoot() . 'views/changeLogin.php');
					require_once(getRoot() . 'views/changePassword.php');	
				?>
			</aside>
		</div>
		<footer>@ grevenko 2018</footer>
	</body>
	<script src='js/account.js'></script>
</html>
