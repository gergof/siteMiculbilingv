<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class Document extends Model {
	protected $fillable = ['name', 'is_public'];
	protected $hidden = ['season', 'targets'];

	public function saveFile(UploadedFile $file) {
		$this->file = $file->store('documents', 's3');
		$this->mime = $file->getClientMimeType();
	}

	public function getDownloadLink() {
		$command = \Storage::disk('s3')->getDriver()->getAdapter()->getClient()->getCommand('GetObject', [
			'Bucket' => config('filesystems.disks.s3.bucket'),
			'Key' => $this->file,
			'ResponseContentDisposition' => 'attachment; filename=' . Str::ascii($this->name),
		]);

		$request = \Storage::disk('s3')->getDriver()->getAdapter()->getClient()->createPresignedRequest($command, config('filesystems.downloadLinkValid'));

		return (string) $request->getUri();
	}

	public function season() {
		return $this->belongsTo('App\Season');
	}

	public function targets() {
		return $this->hasMany('App\DocumentTarget');
	}

	public static function boot() {
		parent::boot();

		static::deleting(function ($document) {
			\Storage::disk('s3')->delete($document->file);
		});
	}
}
