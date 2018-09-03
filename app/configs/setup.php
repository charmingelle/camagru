<?php
	require_once('./database.php');

	exec(MYSQL_PATH . " -u " . DB_USER . " -p < ./camagru.sql");
