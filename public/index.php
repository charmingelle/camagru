<?php
	session_start();

	function getRoot() {
		$sys_path = '/../';
		return (__DIR__ . $sys_path);
	}

	require('../views/jopa/lusogo/bobra/main.php'); // -> echo eval(file_get_contents(../main.php));
	// require_once(getRoot() . 'app/routes/web.php');
?>
 