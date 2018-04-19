<?php
	require_once(getRoot() . 'core/db_connect.php');

	class Register {
		static function create_account($login, $password) {
			DBConnect::send_query('INSERT INTO account(login, password) VALUES (:login, :password)',
									array('login' => $login, 'password' => $password));
		}
	}

	if (isset($_POST['login']) && isset($_POST['password']) && $_POST['submit'] === 'Register') {
		Register::create_account($_POST['login'], $_POST['password']);
	}
?>
