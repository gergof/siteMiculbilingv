#!/bin/sh
set -e

echo "Migrating..."
php artisan migrate --force

echo "Starting..."
apache2-foreground
