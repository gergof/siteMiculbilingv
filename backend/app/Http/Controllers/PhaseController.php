<?php

namespace App\Http\Controllers;

use App\Phase;
use App\Season;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PhaseController extends Controller {
	public function index() {
		return response()->json(Phase::all());
	}

	public function store(Request $request) {
		$data = $request->validate([
			'name' => 'string|required',
			'is_registration' => 'boolean|required',
			'is_advance' => 'boolean|required',
			'is_local_managed' => 'boolean|required',
			'is_rated' => 'boolean|required',
			'deadline' => 'date|required|after:now',
		]);

		if ($data['is_registration'] == true && ($data['is_advance'] == true || $data['is_local_managed'] == true)) {
			return response()->json(['error' => 'is_advance and is_local_managed is not supported when is_registration is set'], 400);
		}

		//acl
		if (Auth::user()->role != 'manager' && Auth::user()->role != 'admin') {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		$phase = new Phase();
		$phase->name = $data['name'];
		$phase->is_registration = $data['is_registration'];
		$phase->is_advance = $data['is_advance'];
		$phase->is_local_managed = $data['is_local_managed'];
		$phase->is_rated = $data['is_rated'];
		$phase->deadline = $data['deadline'];
		$phase->season()->associate(Season::latest()->first());
		$phase->save();

		return response()->json($phase, 201);
	}

	public function show($id) {
		$phase = Phase::find($id);
		if (is_null($phase)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		return response()->json($phase);
	}

	public function update(Request $request, $id) {
		$data = $request->validate([
			'name' => 'string',
			'deadline' => 'date',
		]);

		$phase = Phase::find($id);
		if (is_null($phase)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		//acl
		if (Auth::user()->role != 'manager' && Auth::user()->role != 'admin') {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		if (!empty($data['name'])) {
			$phase->name = $data['name'];
		}
		if (!empty($data['deadline'])) {
			$phase->deadline = $data['deadline'];
		}

		$phase->save();

		return response()->json($phase);
	}

	public function destroy($id) {
		$phase = Phase::find($id);
		if (is_null($phase)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		//acl
		if (Auth::user()->role != 'manager' && Auth::user()->role != 'admin') {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		$phase->delete();

		return response()->json(['message' => 'Deleted']);
	}
}
