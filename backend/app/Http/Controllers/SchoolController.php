<?php

namespace App\Http\Controllers;

use App\School;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SchoolController extends Controller {
	public function index() {
		$schools = School::orderBy('name', 'asc')->get();

		return response()->json($schools);
	}

	public function store(Request $request) {
		$data = $request->validate([
			'name_ro' => 'string|required',
			'name_hu' => 'string|required',
			'county' => 'string|required|in:' . config('services.supportedCounties'),
			'city' => 'string|required',
		]);

		//acl
		if (Auth::user()->role != 'manager' && Auth::user()->role != 'admin') {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		$school = new School();
		$school->name_ro = $data['name_ro'];
		$school->name_hu = $data['name_hu'];
		$school->county = $data['county'];
		$school->city = $data['city'];

		$school->save();

		return response()->json($school, 201);
	}

	public function show($id) {
		$school = School::find($id);
		if (is_null($school)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		return response()->json($school);
	}

	public function update(Request $request, $id) {
		$data = $request->validate([
			'name_ro' => 'string',
			'name_hu' => 'string',
			'county' => 'string|in:' . config('services.supportedCounties'),
			'city' => 'string',
		]);

		//acl
		if (Auth::user()->role != 'manager' && Auth::user()->role != 'admin') {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		$school = School::find($id);
		if (is_null($school)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		if (!empty($data['name_ro'])) {
			$school->name_ro = $data['name_ro'];
		}
		if (!empty($data['name_hu'])) {
			$school->name_hu = $data['name_hu'];
		}
		if (!empty($data['county'])) {
			$school->county = $data['county'];
		}
		if (!empty($data['city'])) {
			$school->city = $data['city'];
		}

		$school->save();

		return response()->json($school);
	}

	public function destroy($id) {
		//acl
		if (Auth::user()->role != 'manager' && Auth::user()->role != 'admin') {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		$school = School::find($id);
		if (is_null($school)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		$school->delete();

		return response()->json(['message' => 'Deleted']);
	}
}
