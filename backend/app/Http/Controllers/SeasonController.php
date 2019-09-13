<?php

namespace App\Http\Controllers;

use App\Season;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SeasonController extends Controller {
	public function index() {
		return response()->json(Season::all());
	}

	public function store(Request $request) {
		$data = $request->validate([
			'name' => 'string|required',
		]);

		//acl
		if (Auth::user()->role != 'admin') {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		$season = new Season();
		$season->name = $data['name'];

		$season->save();

		return response()->json($season);
	}

	public function show($id) {
		$season = Season::find($id);
		if (is_null($season)) {
			return response()->josn(['error' => 'Not found'], 404);
		}

		return response()->json($season);
	}

	public function update(Request $request, $id) {
		$data = $request->validate([
			'name' => 'string',
		]);

		//acl
		if (Auth::user()->role != 'admin') {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		$season = Season::find($id);
		if (is_null($season)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		if (!empty($data['name'])) {
			$season->name = $data['name'];
		}

		$season->save();

		return response()->json($season);
	}
}
