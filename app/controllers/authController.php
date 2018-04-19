<?php

class authController {
	public function signup() {
		if (Auth::register($_POST['login'], $_POST['passwd']) === true) {
			Page::redirect('/');
		} else {
			Page::back();
		}
	}
}
