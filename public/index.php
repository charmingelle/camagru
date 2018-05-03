<?php
	session_start();

	function getRoot() {
		$sys_path = '/../';
		return (__DIR__ . $sys_path);
	}

	require_once(getRoot() . 'app/routes/web.php');
?>
