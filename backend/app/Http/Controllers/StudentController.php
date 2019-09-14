<?php

namespace App\Http\Controllers;

use App\Student;
use Illuminate\Http\Request;

class StudentController extends Controller {
	public function index(Request $request) {
		$filters = $request->validate([
			'season_id' => 'integer|required|exists:seasons,id',
		]);

		$students = Student::where('season_id', $filters['season_id']);

		return response()->json($students);
	}

	public function show($id) {
		$student = Student::find($id);
		if (is_null($student)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		return response()->json($student);
	}

	public function update(Request $request, $id) {
		$data = $request->validate([
			'name' => 'string',
			'class' => 'integer|gte:3|lte:4',
		]);

		$student = Student::find($id);
		if (is_null($student)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		//acl
		if (Auth::user()->role != 'admin' && Auth::user()->role != 'manager') {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		if (!empty($data['name'])) {
			$student->name = $data['name'];
		}
		if (!empty($data['class'])) {
			$student->class = $data['class'];
		}

		$student->save();

		return response()->json($student);
	}
}
