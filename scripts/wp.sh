#!/bin/bash
## Install Latest WordPress 

DATABASE_NAME="wp_test_1"
DATABASE_USER="wp_user_1"
DATABASE_PASS="!WP_user_1_pass"
APPDIR="/home/litegix/webapps/appname/"

rm -rf $APPDIR
mkdir -p $APPDIR
cd $APPDIR

wget -c http://wordpress.org/latest.tar.gz
tar -xzf latest.tar.gz  
rsync -av wordpress/* $APPDIR
   
## Set Permissions  
chown -R www-data:www-data $APPDIR
chmod -R 755 $APPDIR
   
## Configure WordPress Database  
mysql -uroot << QUERY_INPUT  
CREATE DATABASE $DATABASE_NAME;
FLUSH PRIVILEGES;
EXIT
QUERY_INPUT
   
## Add Database Credentias in wordpress  
cd $APPDIR
sudo mv wp-config-sample.php wp-config.php
perl -pi -e "s/database_name_here/$DATABASE_NAME/g" wp-config.php
perl -pi -e "s/username_here/root/g" wp-config.php
perl -pi -e "s/password_here/$DATABASE_PASS/g" wp-config.php
  
## Enabling Mod Rewrite
# a2enmod rewrite
# php5enmod mcrypt
