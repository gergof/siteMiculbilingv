<?php

namespace App\Extensions;

use App\AuthToken;
use App\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Support\Str;

class TokenToUserProvider implements UserProvider {
	private $token;
	private $user;

	public function __construct(User $user, AuthToken $token) {
		$this->user = $user;
		$this->token = $token;
	}

	public function retrieveById($id) {
		return $this->user->find($id);
	}

	public function retrieveByToken($id, $token) {
		$token = $this->token->with('user')->where($id, $token)->where('expires_at', '>', date('Y-m-d H:i:s'))->first();

		return $token && $token->user ? $token->user : null;
	}

	public function updateRememberToken(Authenticatable $user, $token) {
		// no need for this
	}

	public function retrieveByCredentials(array $cred) {
		$user = $this->user;

		foreach ($cred as $credKey => $credValue) {
			if (!Str::contains($credKey, 'password')) {
				$user->where($credKey, $credValue);
			}
		}

		return $user->first();
	}

	public function validateCredentials(Authenticatable $user, array $cred) {
		return app('hash')->check($cred['password'], $user->getAuthPassword());
	}
}
