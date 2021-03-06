<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create('users', function (Blueprint $table) {
			$table->bigIncrements('id');
			$table->string('name');
			$table->string('email')->unique();
			$table->string('email_verification_token', 35);
			$table->timestamp('email_verified_at')->nullable();
			$table->boolean('is_email_subscribed')->default(true);
			$table->string('password');
			$table->unsignedBigInteger('school_id')->nullable();
			$table->tinyInteger('class'); // 0-no class, 1-3rd grade, 2-4th grade, 3-both
			$table->tinyInteger('class_size');
			$table->enum('role', ['teacher', 'lmanager', 'manager', 'admin'])->default('teacher');
			$table->timestamps();

			$table->foreign('school_id')->references('id')->on('schools');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::dropIfExists('users');
	}
}
