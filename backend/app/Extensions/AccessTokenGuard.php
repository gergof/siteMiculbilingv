<?php

namespace App\Extensions;

use Illuminate\Auth\GuardHelpers;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Http\Request;

class AccessTokenGuard implements Guard {
	use GuardHelpers;
	private $inputKey = '';
	private $storageKey = '';
	private $request;

	public function __construct(UserProvider $provider, Request $request, $config) {
		$this->provider = $provider;
		$this->request = $request;
		$this->inputKey = isset($config['input_key']) ? $config['input_key'] : 'access_token';
		$this->storageKey = isset($config['storage_key']) ? $config['storage_key'] : 'access_token';
	}

	public function user() {
		if (!is_null($this->user)) {
			return $this->user;
		}

		$user = null;

		$token = $this->getTokenForRequest();

		if (!empty($token)) {
			$user = $this->provider->retrieveByToken($this->storageKey, $token);
		}

		return $this->user = $user;
	}

	public function getTokenForRequest() {
		$token = $this->request->query($this->inputKey);

		if (empty($token)) {
			$token = $this->request->bearerToken();
		}

		return $token;
	}

	public function validate(array $cred = []) {
		if (empty($cred[$this->inputKey])) {
			return false;
		}

		$cred = [$this->storageKey => $cred[$this->inputKey]];

		if ($this->provider->retrieveByCredintials($cred)) {
			return true;
		}

		return false;
	}
}
