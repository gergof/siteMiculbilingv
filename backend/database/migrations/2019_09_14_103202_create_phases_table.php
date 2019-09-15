<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePhasesTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create('phases', function (Blueprint $table) {
			$table->bigIncrements('id');
			$table->string('name');
			$table->boolean('is_registration')->default(false);
			$table->boolean('is_advance')->default(false);
			$table->boolean('is_local_managed')->default(false);
			$table->boolean('is_rated')->default(false);
			$table->dateTime('deadline');
			$table->bigInteger('season_id');
			$table->timestamps();

			$table->foreign('season_id')->references('id')->on('seasons');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::dropIfExists('phases');
	}
}
