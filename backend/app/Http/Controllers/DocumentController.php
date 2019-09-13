<?php

namespace App\Http\Controllers;

use App\Document;
use App\School;
use App\Season;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DocumentController extends Controller {
	public function index() {
		//public documents
		$public = Document::where('is_public', true)->get();

		$documents;
		if (!is_null(Auth::user())) {
			if (Auth::user()->role != 'admin' && Auth::user()->role != 'manager') {
				$targeted = Auth::user()->documentTargets()->with('document')->get()->pluck('document');
				$documents = $public->merge($targeted);
			} else {
				$documents = Document::all();
			}
		} else {
			$documents = $public;
		}

		return response()->json($documents);
	}

	public function store(Request $request) {
		$data = $request->validate([
			'name' => 'string|required',
			'file' => 'file|required|max:10000',
			'is_public' => 'boolean|required',
			'target_counties' => 'array',
			'target_schools' => 'array',
			'target_users' => 'array',
		]);

		//acl
		if (Auth::user()->role == 'teacher') {
			return response()->json(['error' => 'Forbidden'], 403);
		}
		if (Auth::user()->role == 'lmanager') {
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
			return response()->json(['error' => 'Document must be public or have targets']);
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

		$document = new Document();
		$document->name = $data['name'];
		$document->is_public = $data['is_public'];
		$document->season()->associate(Season::latest()->first());
		$document->saveFile($request->file('file'));
		$document->save();

		//add targets
		$targets = $targetedUsers->map(function ($user) {
			return [
				'user_id' => $user->id,
			];
		});
		$document->targets()->createMany($targets->toArray());

		return response()->json($document, 201);
	}

	public function show($id) {
		$document = Document::find($id);
		if (is_null($document)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		//acl
		if (
			!$document->is_public &&
			!Auth::user()->documentTargets()->with('document')->get()->pluck('document')->contains('id', $document->id) &&
			Auth::user()->role != 'admin' &&
			Auth::user()->role != 'manager'
		) {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		//attach download link
		$document->downloadLink = $document->getDownloadLink();

		return response()->json($document);
	}

	public function update(Request $request, $id) {
		$data = $request->validate([
			'name' => 'string',
			'is_public' => 'boolean',
		]);

		$document = Document::find($id);
		if (is_null($document)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		//acl
		if (Auth::user()->role != 'admin' && Auth::user()->role != 'manager') {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		if (!empty($data['name'])) {
			$document->name = $data['name'];
		}
		if (isset($data['is_public'])) {
			$document->is_public = $data['is_public'];
		}

		$document->save();

		return response()->json($document);
	}

	public function destroy($id) {
		$document = Document::find($id);
		if (is_null($document)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		//acl
		if (Auth::user()->role != 'admin' && Auth::user()->role != 'manager') {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		$document->delete();

		return response()->json(['message' => 'Deleted']);
	}
}
