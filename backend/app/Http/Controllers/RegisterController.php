<?php

namespace App\Http\Controllers;

use App\Contract;
use App\Document;
use App\Mail\RegistrationEmail;
use App\School;
use App\Season;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class RegisterController extends Controller {
	public function register(Request $request) {
		$data = $request->validate([
			'school_id' => 'integer|required_without:school_name_ro,school_name_hu,school_county,school_city,school_contract|exists:schools,id',
			'school_name_ro' => 'string|required_without:school_id',
			'school_name_hu' => 'string|required_without:school_id',
			'school_county' => 'string|required_without:school_id|in:' . config('services.supportedCounties'),
			'school_city' => 'string|required_without:school_id',
			'school_contract' => 'file|required_without:school_id|mimes:pdf',
			'name' => 'string|required|max:65',
			'email' => 'email|required|unique:users,email',
			'password' => 'string|required|min:8',
			'class' => 'integer|required|gte:0|lte:3',
			'class_size' => 'integer|required|gte:0',
		]);

		$school;
		if (!isset($data['school_id'])) {
			//needs to add school
			$school = School::create([
				'name_ro' => $data['school_name_ro'],
				'name_hu' => $data['school_name_hu'],
				'county' => $data['school_county'],
				'city' => $data['school_city'],
			]);

			$season = Season::latest()->first();

			$contractDoc = new Document();
			$contractDoc->name = "contract_" . $data['school_name_ro'] . "_" . $season->name . ".pdf";
			$contractDoc->season()->associate($season);
			$contractDoc->saveFile($request->file('school_contract'));
			$contractDoc->save();

			$contract = new Contract();
			$contract->season()->associate($season);
			$contract->school()->associate($school);
			$contract->document()->associate($contractDoc);
			$contract->save();
		} else {
			$school = School::find($data->school_id);
		}

		$emailToken = Str::random(32);

		$userData = $request->only('name', 'email', 'password', 'class_size', 'class');
		$userData['email_verification_token'] = $emailToken;
		$userData['password'] = Hash::make($userData['password']);

		$school->users()->create($userData);

		Mail::to($data['email'])->send(
			new RegistrationEmail([
				'name' => $userData['name'],
				'confirmationUrl' => config('app.url') . '/auth/verifyEmail?email=' . $userData['email'] . '&token=' . $emailToken,
			])
		);

		return response()->json(['message' => 'User created'], 201);
	}

	public function verifyEmail(Request $request) {
		$data = $request->validate([
			'email' => 'email|required',
			'token' => 'string|required',
		]);

		$user = User::where('email', $data['email'])->first();

		if (!is_null($user) && $user->email_verification_token == $data['token']) {
			if (is_null($user->email_verified_at)) {
				$user->email_verified_at = date('Y-m-d H:i:s');
				$user->save();

				return response()->json(['message' => 'Email verified'], 202);
			} else {
				return response()->json(['error' => 'Email already verified'], 400);
			}
		} else {
			return response()->json(['error' => 'Invalid email or token'], 400);
		}
	}
}
