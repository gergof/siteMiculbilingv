FROM node:14-alpine AS frontend

COPY frontend/ /home/node/app/

WORKDIR /home/node/app

RUN npm ci && \
	npm run build



FROM php:7.3-apache

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY run.sh /run.sh
RUN chmod +x /run.sh

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf && \
	sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

RUN a2enmod rewrite

# RUN docker-php-ext-install pdo pdo_mysql openssl mbstring tokenizer xml ctype json fileinfo zip
RUN apt-get update && \
	apt-get install -y unzip && \
	apt-get clean

COPY backend/ /var/www/html/

WORKDIR /var/www/html

RUN composer install --optimize-autoloader --no-dev

COPY --from=frontend /home/node/app/build/index.blade.php resources/views/
COPY --from=frontend /home/node/app/build/index.js public/

RUN chown -R www-data:www-data /var/www/html

CMD ["/run.sh"]
