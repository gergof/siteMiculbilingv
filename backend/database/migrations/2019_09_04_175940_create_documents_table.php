<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocumentsTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create('documents', function (Blueprint $table) {
			$table->bigIncrements('id');
			$table->string('file', 120);
			$table->string('name', 65);
			$table->string('mime', 255);
			$table->boolean('is_public')->default(false);
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
		Schema::dropIfExists('documents');
	}
}
