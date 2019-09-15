<?php

namespace App\Jobs;

use App\PartialResult;
use App\Phase;
use App\Result;
use App\Student;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CalculateResults implements ShouldQueue {
	use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

	private $config;

	/**
	 * Create a new job instance.
	 *
	 * @return void
	 */
	public function __construct($config) {
		$this->config = $config;
	}

	/**
	 * Execute the job.
	 *
	 * @return void
	 */
	public function handle() {
		$phase = Phase::find($this->config['phase_id']);

		$students;
		if (!is_null($this->config['county_filter'])) {
			$county_filter = $this->config['county_filter'];
			$students = Student::with('school')
				->whereHas('school', function ($query) use ($county_filter) {
					$query->whereIn('county', $county_filter);
				})
				->where('season_id', $phase->season->id)
				->get();
		} else {
			$students = Student::where('season_id', $phase->season->id)->get();
		}

		foreach ($students as $student) {
			$points = PartialResult::with('objective')
				->where('student_id', $student->id)
				->whereHas('objective', function ($query) use ($phase) {
					$query->where('phase_id', $phase->id);
				})
				->get()
				->pluck('result')
				->sum();

			$result = Result::where('student_id', $student->id)->where('phase_id', $phase->id)->first();

			if (is_null($result)) {
				$result = new Result();
				$result->student()->associate($student);
				$result->phase()->associate($phase);
			}

			$result->result = $points;

			$result->save();
		}
	}
}
