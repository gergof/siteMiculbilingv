<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentsTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create('students', function (Blueprint $table) {
			$table->bigIncrements('id');
			$table->string('name');
			$table->tinyInteger('class');
			$table->bigInteger('season_id');
			$table->bigInteger('school_id');
			$table->bigInteger('user_id');
			$table->timestamps();

			$table->foreign('season_id')->references('id')->on('seasons');
			$table->foreign('school_id')->references('id')->on('schools');
			$table->foreign('user_id')->references('id')->on('users');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::dropIfExists('students');
	}
}
