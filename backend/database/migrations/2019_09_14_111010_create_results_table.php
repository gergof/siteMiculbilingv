<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateResultsTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create('results', function (Blueprint $table) {
			$table->bigIncrements('id');
			$table->bigInteger('student_id');
			$table->bigInteger('phase_id');
			$table->boolean('is_absent');
			$table->integer('result');
			$table->timestamps();

			$table->foreign('student_id')->references('id')->on('students');
			$table->foreign('phase_id')->references('id')->on('phases');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::dropIfExists('results');
	}
}
