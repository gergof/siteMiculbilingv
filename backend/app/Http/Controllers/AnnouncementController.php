<?php

namespace App\Http\Controllers;

use App\Announcement;
use App\School;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnnouncementController extends Controller {
	public function index(Request $request) {
		//get public announcements
		$public = Announcement::where('is_public', true)->get();

		//get targeted announcements
		$targeted = Auth::user()->announcements()->with('announcement')->get()->pluck('announcement');

		$announcements = $public->merge($targeted);

		$announcements->sortByDesc('updated_at');

		return response()->json($announcements);
	}

	public function store(Request $request) {
		if (!in_array(Auth::user()->role, ['lmanager', 'manager', 'admin'])) {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		$data = $request->validate([
			'message' => 'string|required',
			'is_public' => 'boolean|required',
			'target_counties' => 'array',
			'target_schools' => 'array',
			'target_users' => 'array',
		]);

		if (Auth::user()->role == 'lmanager') {

			//we only need ACL in this case
			if ($data['is_public'] == true) {
				return response()->json(['error' => 'Forbidden'], 403);
			}

			if (!empty($data['target_counties'])) {
				if (count($data['target_counties']) > 1) {
					return response()->json(['error' => 'Forbidden'], 403);
				}
				if ($data['target_counties'][0] != Auth::user()->school->county) {
					return response()->json(['error' => 'Forbidden'], 403);
				}
			}

			if (!empty($data['target_schools'])) {
				foreach ($data['target_schools'] as $s) {
					$school = School::find($s);
					if (is_null($school)) {
						return response()->json(['error' => 'Target school not found'], 404);
					}
					if ($school->county != Auth::user()->school->county) {
						return response()->json(['error' => 'Forbidden'], 403);
					}
				}
			}

			if (!empty($data['target_users'])) {
				foreach ($data['target_users'] as $u) {
					$user = User::find($u);
					if (is_null($user)) {
						return response()->json(['error' => 'Target user not found'], 404);
					}
					if ($user->school->county != Auth::user()->school->county) {
						return response()->json(['error' => 'Forbidden'], 403);
					}
				}
			}
		}

		if (
			$data['is_public'] == false &&
			empty($data['target_counties']) &&
			empty($data['target_schools']) &&
			empty($data['target_users'])
		) {
			return response()->json(['error' => 'Announcement must be public or must have targets'], 400);
		}

		$targetedUsers = collect();

		if ($data['is_public'] == false) {
			if (!empty($data['target_counties'])) {
				$countySchools = School::whereIn('county', $data['target_counties'])->get();
				foreach ($countySchools as $school) {
					$targetedUsers = $targetedUsers->merge($school->users);
				}
			}
			if (!empty($data['target_schools'])) {
				$schools = School::whereIn('id', $data['target_schools'])->get();
				foreach ($schools as $school) {
					$targetedUsers = $targetedUsers->merge($school->users);
				}
			}
			if (!empty($data['target_users'])) {
				$users = User::whereIn('id', $data['target_users'])->get();
				$targetedUsers = $targetedUsers->merge($users);
			}

			$targetedUsers = $targetedUsers->unique();
		}

		$announcement = new Announcement();
		$announcement->user()->associate(Auth::user());
		$announcement->message = $data['message'];
		$announcement->is_public = $data['is_public'];
		$announcement->save();

		//add announcement targets
		$targets = $targetedUsers->map(function ($user) {
			return [
				'user_id' => $user['id'],
			];
		});
		$announcement->targets()->createMany($targets->toArray());

		return response()->json(['message' => 'Announcement created'], 201);
	}
}
