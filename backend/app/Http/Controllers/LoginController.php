<?php

namespace App\Http\Controllers;

use App\AuthToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class LoginController extends Controller {
	public function login(Request $request) {
		$cred = $request->only('email', 'password');

		if (Auth::attempt($cred)) {
			$user = Auth::user();

			if (!is_null($user->email_verified_at)) {
				$token = Str::random(32);
				$expires = date('Y-m-d H:i:s', time() + config('auth.lifetime'));

				$user->authTokens()->create(['access_token' => $token, 'expires_at' => $expires]);

				return response()->json([
					'token' => 'Bearer ' . $token,
					'expires_at' => $expires,
				]);
			} else {
				return response()->json([
					'error' => 'Email not verified',
				], 401);
			}

		}

		return response()->json([
			'error' => 'Wrong username or password',
		], 401);
	}

	public function logout(Request $request) {
		$token = AuthToken::where('access_token', $this->getTokenForRequest($request))->first();
		$token->expires_at = null;
		$token->save();

		return response()->json([
			'message' => 'Logged out',
		]);
	}

	private function getTokenForRequest(Request $request) {
		$token = $request->query('access_token');

		if (empty($token)) {
			$token = $request->bearerToken();
		}

		return $token;
	}
}
