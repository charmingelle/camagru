<!DOCTYPE html>
<html>
	<head>
		<title>Account Settings</title>
	</head>
	<body>
		<div id='change-status'>
			<?php
				if (isset($_SESSION['auth-data']['change-status'])) {
					echo $_SESSION['auth-data']['change-status'];
					unset($_SESSION['auth-data']['change-status']);
				}
			?>
		</div>
		<?php
			require_once(getRoot() . 'views/changeEmail.php');
			require_once(getRoot() . 'views/changeLogin.php');
			require_once(getRoot() . 'views/changePassword.php');	
		?>
	</body>
</html>
