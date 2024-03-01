#!/bin/bash
systemctl stop nginx
sudo apt-get remove nginx nginx-common
sudo apt-get purge nginx nginx-common

systemctl stop mysql
sudo apt-get remove mysql*
sudo apt-get autoremove

NGINX_ROOT="/usr/lib/litegix/nginx"
NGINX_MODULES="$NGINX_ROOT/modules"
rm -rf $NGINX_PATH
rm -rf $NGINX_MODULES

rm /etc/firewalld/services/litegix.xml
rm /etc/firewalld/zones/litegix.xml
sleep 1
firewall-cmd --reload # reload to get litegix