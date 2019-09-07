<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePasswordResetTokensTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create('password_reset_tokens', function (Blueprint $table) {
			$table->bigIncrements('id');
			$table->bigInteger('user_id');
			$table->string('token', 70);
			$table->dateTime('expires_at')->nullable();
			$table->timestamps();

			$table->foreign('user_id')->references('id')->on('users');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::dropIfExists('password_reset_tokens');
	}
}
