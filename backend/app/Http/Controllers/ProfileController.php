<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller {
	public function index() {
		return response()->json(Auth::user());
	}

	public function update(Request $request) {
		$data = $request->validate([
			'name' => 'string',
			'is_email_subscribed' => 'boolean',
			'class' => 'integer|gte:0|lte:3',
			'class_size' => 'integer|gte:0',
		]);

		$user = Auth::user();

		if (!empty($data['name'])) {
			$user->name = $data['name'];
		}
		if (isset($data['is_email_subscribed'])) {
			$user->is_email_subscribed = $data['is_email_subscribed'];
		}
		if (isset($data['class'])) {
			$user->class = $data['class'];
		}
		if (isset($data['class_size'])) {
			$user->class_size = $data['class_size'];
		}

		$user->save();

		return response()->json($user);
	}
}
