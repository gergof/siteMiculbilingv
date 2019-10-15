<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnnouncementTargetsTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create('announcement_targets', function (Blueprint $table) {
			$table->bigIncrements('id');
			$table->unsignedInteger('announcement_id');
			$table->unsignedInteger('user_id');
			$table->boolean('is_read')->default(false);
			$table->timestamps();

			$table->foreign('announcement_id')->references('id')->on('announcements')->onDelete('cascade');
			$table->foreign('user_id')->references('id')->on('users');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::dropIfExists('announcement_targets');
	}
}
