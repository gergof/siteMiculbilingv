<?php

namespace App\Http\Controllers;

use App\AnnouncementTarget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnnouncementTargetController extends Controller {
	public function index() {
		return response()->json(Auth::user()->announcementTargets);
	}

	public function update(Request $request, $id) {
		$data = $request->validate([
			'is_read' => 'boolean',
		]);

		$announcementTarget = AnnouncementTarget::find($id);
		if (is_null($announcementTarget)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		//acl
		if (!$announcementTarget->user->is(Auth::user())) {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		if (isset($data['is_read'])) {
			$announcementTarget->is_read = $data['is_read'];
		}

		$announcementTarget->save();

		return response()->json($announcementTarget);
	}
}
