#!/bin/sh
set -e

# Set correct permissions on storage and cache directories
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# If command arguments are provided (e.g. php artisan key:generate),
# run them directly instead of starting the server.
if [ "$#" -gt 0 ]; then
    exec "$@"
fi

# Default: start PHP-FPM in the background, then Nginx in the foreground.
php-fpm -D
exec nginx -g "daemon off;"
