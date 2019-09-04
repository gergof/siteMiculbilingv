<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;

class Document extends Model {
	protected $fillable = ['name', 'file', 'mime'];

	public function saveFile(UploadedFile $file) {
		$this->file = $file->store('documents', 's3');
		$this->mime = $file->getClientMimeType();
	}

	public function getDownload() {
		$command = Storage::disk('s3')->getDriver()->getAdapter()->getClient()->getCommand('GetObject', [
			'Bucket' => config('filesystems.disks.s3.bucket'),
			'Key' => $this->file,
			'ResponseContentDisposition' => 'attachment; filename=' . $this->name,
		]);

		$request = Storage::disk('s3')->getDriver()->getAdapter()->getClient()->createPresignedRequest($command, config('filesystems.downloadLinkValid'));

		return (string) $request->getUri();
	}

	public function season() {
		return $this->belongsTo('App\Season');
	}
}
