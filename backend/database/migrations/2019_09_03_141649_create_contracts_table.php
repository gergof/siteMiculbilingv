<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContractsTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create('contracts', function (Blueprint $table) {
			$table->bigIncrements('id');
			$table->unsignedBigInteger('season_id');
			$table->unsignedBigInteger('school_id');
			$table->unsignedBigInteger('document_id');
			$table->timestamps();

			$table->foreign('season_id')->references('id')->on('seasons');
			$table->foreign('school_id')->references('id')->on('schools');
			$table->foreign('document_id')->references('id')->on('documents');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::dropIfExists('contracts');
	}
}
