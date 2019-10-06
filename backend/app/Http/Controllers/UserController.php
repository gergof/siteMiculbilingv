<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller {
	public function index() {
		$users;
		if (Auth::user()->role == 'admin' || Auth::user()->role == 'manager') {
			$users = User::with('school')->get();
		} else {
			$users = User::whereIn('role', ['admin', 'manager'])->with('school')->get();

			if (Auth::user()->role == 'lmanager') {
				$sameCounty = Auth::user()->school->users()->with('school')->get();

				$users = $users->merge($sameCounty);
			}
		}

		return response()->json($users->makeHidden(['email', 'email_verified_at', 'is_email_subscribed', 'school_id', 'class_size'])->makeVisible('school'));
	}
}
