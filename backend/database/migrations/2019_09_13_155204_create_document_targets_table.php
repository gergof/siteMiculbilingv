<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocumentTargetsTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create('document_targets', function (Blueprint $table) {
			$table->bigIncrements('id');
			$table->bigInteger('document_id');
			$table->bigInteger('user_id');
			$table->timestamps();

			$table->foreign('document_id')->references('id')->on('documents')->onDelete('cascade');
			$table->foreign('user_id')->references('id')->on('users');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::dropIfExists('document_targets');
	}
}
