<?php

namespace App\Http\Controllers;

use App\Phase;
use App\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller {
	public function index(Request $request) {
		$filters = $request->validate([
			'season_id' => 'integer|required|exists:seasons,id',
			'own' => 'boolean',
		]);

		$students = Student::where('season_id', $filters['season_id'])->orderBy('name', 'asc');

		if (Auth::user() && isset($filters['own']) && $filters['own']) {
			$students = $students->where('user_id', Auth::user()->id);
		}

		$students = $students->get();

		return response()->json($students);
	}

	public function store(Request $request) {
		$data = $request->validate([
			'name' => 'string|required',
			'class' => 'integer|required|gte:3|lte:4',
			'phase_id' => 'integer|required|exists:phases,id',
		]);

		$phase = Phase::find($data['phase_id']);

		//acl
		if (!$phase->is_registration) {
			return response()->json(['error' => 'Not registration phase'], 400);
		}
		if ($phase->deadline->lessThan(Carbon::now())) {
			return response()->json(['error' => 'Deadline has already passed'], 400);
		}
		if (Student::where('user_id', Auth::user()->id)->where('season_id', $phase->season->id)->count() >= config('services.maxEntries')) {
			return response()->json(['error' => 'Already having max entries'], 400);
		}
		if (Auth::user()->class == 0) {
			return response()->json(['error' => 'You are not teaching in any classes based on your profile'], 400);
		}
		if (Auth::user()->class == 1 && $data['class'] != 3) {
			return response()->json(['error' => 'You are not teaching in that class'], 400);
		}
		if (Auth::user()->class == 2 && $data['class'] != 4) {
			return response()->json(['error' => 'You are not teaching in that class'], 400);
		}

		$student = new Student();
		$student->name = $data['name'];
		$student->class = $data['class'];
		$student->season()->associate($phase->season);
		$student->school()->associate(Auth::user()->school);
		$student->user()->associate(Auth::user());
		$student->save();

		return response()->json($student, 201);
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
