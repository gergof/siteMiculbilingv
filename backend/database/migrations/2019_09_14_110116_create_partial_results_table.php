<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePartialResultsTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create('partial_results', function (Blueprint $table) {
			$table->bigIncrements('id');
			$table->bigInteger('student_id');
			$table->bigInteger('objective_id');
			$table->tinyInteger('result');
			$table->timestamps();

			$table->foreign('student_id')->references('id')->on('students');
			$table->foreign('objective_id')->references('id')->on('objectives')->onDelete('cascade');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::dropIfExists('partial_results');
	}
}
