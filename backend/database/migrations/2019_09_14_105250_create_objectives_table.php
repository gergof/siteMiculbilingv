<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateObjectivesTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create('objectives', function (Blueprint $table) {
			$table->bigIncrements('id');
			$table->tinyInteger('class');
			$table->string('name');
			$table->text('description');
			$table->tinyInteger('max_points');
			$table->bigInteger('phase_id');
			$table->timestamps();

			$table->foreign('phase_id')->references('id')->on('phases');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::dropIfExists('objectives');
	}
}
