<?php

namespace App\Http\Controllers;

use App\Mail\PasswordResetEmail;
use App\PasswordResetToken;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PasswordResetController extends Controller {
	public function passwordReset(Request $request) {
		$data = $request->validate([
			'email' => 'email|required',
		]);

		$user = User::where('email', $data['email'])->first();

		if (!is_null($user)) {
			$resetToken = new PasswordResetToken();
			$resetToken->token = Str::random(64);
			$resetToken->expires_at = date('Y-m-d H:i:s', time() + 3600);
			$resetToken->user()->associate($user);
			$resetToken->save();

			Mail::to($user->email)->send(
				new PasswordResetEmail([
					'name' => $user->name,
					'resetUrl' => $resetToken->getResetUrl(),
					'invalidateUrl' => $resetToken->getInvalidateUrl(),
				])
			);
		}

		return response()->json(['message' => 'If the user exists, the reset email is sent out']);
	}

	public function reset(Request $request) {
		$data = $request->validate([
			'token' => 'string|required',
			'password' => 'string|required|min:8',
		]);

		$token = PasswordResetToken::with('user')->where('token', $data['token'])->where('expires_at', '>', date('Y-m-d H:i:s'))->first();

		if (!is_null($token)) {
			$user = $token->user;
			$user->password = Hash::make($data['password']);
			$user->save();

			$token->expires_at = null;
			$token->save();

			return response()->json(['message' => 'Password successfully changed']);
		} else {
			return response()->json(['error' => 'Invalid token'], 400);
		}
	}

	public function invalidate(Request $request) {
		$data = $request->validate([
			'token' => 'string|required',
		]);

		$token = PasswordResetToken::where('token', $data['token'])->where('expires_at', '>', date('Y-m-d H:i:s'))->first();

		if (!is_null($token)) {
			$token->expires_at = null;
			$token->save();

			return response()->json(['message' => 'Token invalidated']);
		} else {
			return response()->json(['error' => 'Invalid token'], 400);
		}
	}
}
