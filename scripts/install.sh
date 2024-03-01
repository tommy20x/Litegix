#!/bin/bash
# Litegix installer script

LITEGIX_TOKEN=""
LITEGIX_URL=""
INSTALL_STATE_URL="$LITEGIX_URL/api/installation/status/$LITEGIX_TOKEN"
SUPPORTED_VERSIONS="16.04 18.04 20.04"
PHP_CLI_VERSION=""

SERVERID=""
SERVERKEY=""
WEBSERVER=""
DATABASE=""
ENVIRONMENT="production"

echo "INSTALL_STATE_URL: $INSTALL_STATE_URL"
sleep 2

OS_NAME=$(lsb_release -si)
OS_VERSION=$(lsb_release -sr)
OS_CODE_NAME=$(lsb_release -sc)
INSTALL_PACKAGE="curl git wget expect redis-server fail2ban python-setuptools openssl perl zip unzip net-tools vim nano bc unattended-upgrades postfix nodejs libaugeas0 build-essential augeas-tools passwd acl memcached beanstalkd make jq augeas-lenses firewalld "

function send_state {
  status=$1
  echo -e "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~send_state: $status"
  curl --ipv4 --header "Content-Type: application/json" -X POST $INSTALL_STATE_URL -d '{"status": "'"$status"'"}'
  sleep 2
  echo -e ""
}

function send_data {
  payload=$1
  echo -e "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~send_data: $payload\n"
  curl --ipv4 --header "Content-Type: application/json" -X POST $INSTALL_STATE_URL -d $payload
  sleep 2
  echo -e ""
}

function replace_true_whole_line {
    sed -i "s/.*$1.*/$2/" $3
}

function get_random_string {
    head /dev/urandom | tr -dc _A-Za-z0-9 | head -c$1
}

function check_installed_services {
    detected_services=""
    services=$(systemctl -t service --state=active | grep -E '\.service' | sed 's/^\s*//g' | cut -f1 -d' ' | tr '\n' ',')
    service_names=(nginx apache2 lshttpd mysql mariadb webmin lscpd psa)
    for sname in ${service_names[@]}; do
    if [[ $services == *"$sname.service"* ]]; then
        echo "$service_name exists."
        detected_services+="$sname "
    fi
    done
    echo "Detected Services: $detected_services"

    if [[ ! -z "$detected_services" ]]; then
        message="It detected some existing services; $detected_services Installation will not proceed."
        echo $message
        send_data '{"status": "err", "message": "'"$message"'"}'
        exit 1
    fi
}

function fix_auto_update() {
    AUTO_UPDATE_FILE_50="/etc/apt/apt.conf.d/50unattended-upgrades"
    AUTO_UPDATE_FILE_20="/etc/apt/apt.conf.d/20auto-upgrades"

    sed -i 's/Unattended-Upgrade::Allowed-Origins {/Unattended-Upgrade::Allowed-Origins {\n        "Litegix:${distro_codename}";/g' $AUTO_UPDATE_FILE_50
    replace_true_whole_line "\"\${distro_id}:\${distro_codename}-security\";" "        \"\${distro_id}:\${distro_codename}-security\";" $AUTO_UPDATE_FILE_50
    replace_true_whole_line "\/\/Unattended-Upgrade::AutoFixInterruptedDpkg" "Unattended-Upgrade::AutoFixInterruptedDpkg \"true\";" $AUTO_UPDATE_FILE_50
    replace_true_whole_line "\/\/Unattended-Upgrade::Remove-Unused-Dependencies" "Unattended-Upgrade::Remove-Unused-Dependencies \"true\";" $AUTO_UPDATE_FILE_50

    echo -ne "\n\n
    Dpkg::Options {
       \"--force-confdef\";
       \"--force-confold\";
    }" >> $AUTO_UPDATE_FILE_50

    echo "APT::Periodic::Update-Package-Lists \"1\";" > $AUTO_UPDATE_FILE_20
    echo "APT::Periodic::Unattended-Upgrade \"1\";" >> $AUTO_UPDATE_FILE_20
}

function bootstrap {
    echo "bootstrap"
    apt-get -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" upgrade -y
    apt-get install software-properties-common apt-transport-https -y
    LC_ALL=en_US.UTF-8 add-apt-repository ppa:ondrej/php -y

    # install nodejs
    curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

    # Ubuntu 16.04
    if [[ "$OS_CODE_NAME" == 'xenial' ]]; then
        echo -e "bootstrap_installer_add_packages_1"
        PIPEXEC="pip"
        INSTALL_PACKAGE+="libmysqlclient20 python-pip "
        INSTALL_PACKAGE+="php5.5-bcmath php5.5-bz2 php5.5-intl php5.5-gd php5.5-xml php5.5-mbstring php5.5-mysql php5.5-zip php5.5-common php5.5-fpm "
        INSTALL_PACKAGE+="php5.6-bcmath php5.6-bz2 php5.6-intl php5.6-gd php5.6-xml php5.6-mbstring php5.6-mysql php5.6-zip php5.6-common php5.6-fpm "
        INSTALL_PACKAGE+="php7.0-bcmath php7.0-bz2 php7.0-intl php7.0-gd php7.0-xml php7.0-mbstring php7.0-mysql php7.0-zip php7.0-common php7.0-fpm "
        INSTALL_PACKAGE+="php7.1-bcmath php7.1-bz2 php7.1-intl php7.1-gd php7.1-xml php7.1-mbstring php7.1-mysql php7.1-zip php7.1-common php7.1-fpm "

    # Ubuntu 18.04
    elif [[ "$OS_CODE_NAME" == 'bionic' ]]; then
        echo -e "bootstrap_installer_add_packages_2"
        PIPEXEC="pip"
        INSTALL_PACKAGE+="libmysqlclient20 python-pip "
        INSTALL_PACKAGE+="php7.0-bcmath php7.0-bz2 php7.0-intl php7.0-gd php7.0-xml php7.0-mbstring php7.0-mysql php7.0-zip php7.0-common php7.0-fpm "
        INSTALL_PACKAGE+="php7.1-bcmath php7.1-bz2 php7.1-intl php7.1-gd php7.1-xml php7.1-mbstring php7.1-mysql php7.1-zip php7.1-common php7.1-fpm "

    # Ubuntu 20.04
    elif [[ "$OS_CODE_NAME" == 'focal' ]]; then
        echo -e "bootstrap_installer_add_packages_3"
        PIPEXEC="pip3"
        INSTALL_PACKAGE+="libmysqlclient21 python3-pip dirmngr gnupg libmagic-dev "
    fi

    INSTALL_PACKAGE+="php7.2-bcmath php7.2-bz2 php7.2-intl php7.2-gd php7.2-xml php7.2-mbstring php7.2-mysql php7.2-zip php7.2-common php7.2-fpm "
    INSTALL_PACKAGE+="php7.3-bcmath php7.3-bz2 php7.3-intl php7.3-gd php7.3-xml php7.3-mbstring php7.3-mysql php7.3-zip php7.3-common php7.3-fpm "
    INSTALL_PACKAGE+="php7.4-bcmath php7.4-bz2 php7.4-intl php7.4-gd php7.4-xml php7.4-mbstring php7.4-mysql php7.4-zip php7.4-common php7.4-fpm "
    INSTALL_PACKAGE+="php8.0-bcmath php8.0-bz2 php8.0-intl php8.0-gd php8.0-xml php8.0-mbstring php8.0-mysql php8.0-zip php8.0-common php8.0-fpm "
    echo -e $INSTALL_PACKAGE
}

function enable_swap {
    totalRAM=`grep MemTotal /proc/meminfo | awk '{print $2}'`
    if [[ $totalRAM -lt 4000000 ]]; then # kalau RAM less than 4GB, enable swap
        swapEnabled=`swapon --show | wc -l`
        if [[ $swapEnabled -eq 0 ]]; then # swap belum enable
            # create 2GB swap space
            fallocate -l 2G /swapfile
            chmod 600 /swapfile
            mkswap /swapfile
            swapon /swapfile

            # backup fstab
            cp /etc/fstab /etc/fstab.bak

            # register the swap to fstab
            echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
        fi
    fi
}

function install_packages {
    apt-get update
    apt-get remove mysql-common --purge -y

    echo "install_packages"
    apt-get install $INSTALL_PACKAGE -y
}

function check_port {
    echo -ne "\n\n\nChecking if port 21000 is accessible...\n"

    # send command to check wait 2 seconds inside jobs before trying
    # curl -4 -H "Content-Type: application/json" -X POST https://manage.runcloud.io/webhooks/serverinstallation/testport/KxT0TXo7ABGpH5zxHB3JcKknZe1623833285bNTdK7P7MYEy48xlIdJemQxlqLrtgD6O2SCUtMGy2TiDxyemfVIzZ7rF8xq0QrRb/wjJBIt5dhHfjLqfqeVPkNA0KVAw1EwZgjM5NlVmSJeh1olj2yWBQgEqDSdCbIbg4Ju8yviM4k4dJkgj8jgca5UoX5ag0Qbsjkzsno3BN7ughUIyV0UC1euuaZTzbvAqf 
    
    if [[ "$OS_CODE_NAME" == 'xenial' ]]; then
        timeout 15 bash -c "echo -e 'HTTP/1.1 200 OK\r\n' | nc -l 21000"
    else
        timeout 15 bash -c "echo -e 'HTTP/1.1 200 OK\r\n' | nc -N -l 21000"
    fi
    ncstatus=$?
    if [[ $ncstatus -ne 0 ]]; then
        clear
echo -ne "\n
##################################################
# Unable to connect through port 21000 inside    #
# this server. Please disable firewall for this  #
# port and rerun the installation script again!  #
##################################################
\n\n\n
"
        exit 1
    fi
}

function install_supervisor {
    export LC_ALL=C
    $PIPEXEC install supervisor
    echo_supervisord_conf > /etc/supervisord.conf
    echo -ne "\n\n\n[include]\nfiles=/etc/supervisor.d/*.conf\n\n" >> /etc/supervisord.conf
    mkdir -p /etc/supervisor.d

    echo "[Unit]
Description=supervisord - Supervisor process control system for UNIX
Documentation=http://supervisord.org
After=network.target

[Service]
Type=forking
ExecStart=/usr/local/bin/supervisord -c /etc/supervisord.conf
ExecReload=/usr/local/bin/supervisorctl reload
ExecStop=/usr/local/bin/supervisorctl shutdown
User=root

[Install]
WantedBy=multi-user.target" > /etc/systemd/system/supervisord.service

    systemctl daemon-reload
}

function install_fail2ban {
    echo "# Litegix Server API configuration file

[Definition]
failregex = Authentication error from <HOST>" > /etc/fail2ban/filter.d/litegix-agent.conf

    echo "[DEFAULT]
ignoreip = 127.0.0.1/8
bantime = 36000
findtime = 600
maxretry = 5


[sshd]
enabled = true
logpath = %(sshd_log)s
port = 22
banaction = iptables

[sshd-ddos]
enabled = true
logpath = %(sshd_log)s
banaction = iptables-multiport
filter = sshd

[litegix-agent]
enabled = true
logpath = /var/log/litegix.log
port = 21000
banaction = iptables
maxretry = 2" > /etc/fail2ban/jail.local
}

function download_nginx_modules {
    # Installing a Prebuilt Debian Package from the Official NGINX Repository
    # Download 3rd Party Modules
    modname="array-var-nginx-module-0.05.tar.gz"
    wget -q -O $modname https://github.com/openresty/array-var-nginx-module/archive/refs/tags/v0.05.tar.gz
    tar -xzf $modname
    rm $modname

    modname="echo-nginx-module-0.62.tar.gz"
    wget -q -O $modname https://github.com/openresty/echo-nginx-module/archive/refs/tags/v0.62.tar.gz
    tar -xzf $modname
    rm $modname

    modname="ngx_coolkit-0.2.tar.gz"
    wget -q -O $modname https://github.com/FRiCKLE/ngx_coolkit/archive/refs/tags/0.2.tar.gz
    tar -xzf $modname
    rm $modname

    modname="form-input-nginx-module-0.12.tar.gz"
    wget -q -O $modname https://github.com/calio/form-input-nginx-module/archive/refs/tags/v0.12.tar.gz
    tar -xzf $modname
    rm $modname

    modname="encrypted-session-nginx-module-0.08.tar.gz"
    wget -q -O $modname https://github.com/openresty/encrypted-session-nginx-module/archive/refs/tags/v0.08.tar.gz
    tar -xzf $modname
    rm $modname

    modname="ngx_lua-0.10.19.tar.gz"
    wget -q -O $modname https://github.com/openresty/lua-nginx-module/archive/refs/tags/v0.10.19.tar.gz
    tar -xzf $modname
    rm $modname

    modname="ngx_lua_upstream-0.07.tar.gz"
    wget -q -O $modname https://github.com/openresty/lua-upstream-nginx-module/archive/refs/tags/v0.07.tar.gz
    tar -xzf $modname
    rm $modname

    modname="headers-more-nginx-module-0.33.tar.gz"
    wget -q -O $modname https://github.com/openresty/headers-more-nginx-module/archive/refs/tags/v0.33.tar.gz
    tar -xzf $modname
    rm $modname

    modname="memc-nginx-module-0.19.tar.gz"
    wget -q -O $modname https://github.com/openresty/memc-nginx-module/archive/refs/tags/v0.19.tar.gz
    tar -xzf $modname
    rm $modname

    modname="ngx_brotli-1.0.0rc.tar.gz"
    wget -q -O $modname https://github.com/google/ngx_brotli/archive/refs/tags/v1.0.0rc.tar.gz
    tar -xzf $modname
    rm $modname

    modname="ngx_cache_purge-2.3.tar.gz"
    wget -q -O $modname https://github.com/FRiCKLE/ngx_cache_purge/archive/refs/tags/2.3.tar.gz
    tar -xzf $modname
    rm $modname

    modname="ModSecurity-nginx-1.0.2.tar.gz"
    wget -q -O $modname https://github.com/SpiderLabs/ModSecurity-nginx/archive/refs/tags/v1.0.2.tar.gz
    tar -xzf $modname
    rm $modname

    modname="redis2-nginx-module-0.15.tar.gz"
    wget -q -O $modname https://github.com/openresty/redis2-nginx-module/archive/refs/tags/v0.15.tar.gz
    tar -xzf $modname
    rm $modname

    modname="redis-nginx-module-0.3.7.tar.gz"
    wget -q -O $modname https://github.com/onnimonni/redis-nginx-module/archive/refs/tags/v0.3.7.tar.gz
    tar -xzf $modname
    rm $modname

    modname="rds-json-nginx-module-0.15.tar.gz"
    wget -q -O $modname https://github.com/openresty/rds-json-nginx-module/archive/refs/tags/v0.15.tar.gz
    tar -xzf $modname
    rm $modname

    modname="rds-csv-nginx-module-0.09.tar.gz"
    wget -q -O $modname https://github.com/openresty/rds-csv-nginx-module/archive/refs/tags/v0.09.tar.gz
    tar -xzf $modname
    rm $modname

    modname="set-misc-nginx-module-0.32.tar.gz"
    wget -q -O $modname https://github.com/openresty/set-misc-nginx-module/archive/refs/tags/v0.32.tar.gz
    tar -xzf $modname
    rm $modname

    modname="srcache-nginx-module-0.32.tar.gz"
    wget -q -O $modname https://github.com/openresty/srcache-nginx-module/archive/refs/tags/v0.32.tar.gz
    tar -xzf $modname
    rm $modname

    modname="ngx_stream_lua-0.0.9.tar.gz"
    wget -q -O $modname https://github.com/openresty/stream-lua-nginx-module/archive/refs/tags/v0.0.9.tar.gz
    tar -xzf $modname
    rm $modname

    modname="ngx_devel_kit-0.3.1.tar.gz"
    wget -q -O $modname https://codeload.github.com/vision5/ngx_devel_kit/tar.gz/refs/tags/v0.3.1
    tar -xzf $modname
    rm $modname

    modname="xss-nginx-module-0.06.tar.gz"
    wget -q -O $modname https://github.com/openresty/xss-nginx-module/archive/refs/tags/v0.06.tar.gz
    tar -xzf $modname
    rm $modname
}

function install_nginx {
    LITEGIX_PACKAGES="/litegix/packages"
    rm -rf $LITEGIX_PACKAGES
    mkdir -p $LITEGIX_PACKAGES
    cd $LITEGIX_PACKAGES

    modname="openssl-1.1.1g.tar.gz"
    wget http://www.openssl.org/source/$modname
    tar -xzf $modname
    rm $modname

    modname="luajit-2.0.5.tar.gz"
    wget -q -O $modname https://github.com/LuaJIT/LuaJIT/archive/refs/tags/v2.0.5.tar.gz
    tar -xzf $modname
    rm $modname

    NGINX_ROOT="/litegix/nginx"
    NGINX_MODULES="$NGINX_ROOT/modules"

    # Download 3rd Part Modules
    rm -rf $NGINX_ROOT
    mkdir -p $NGINX_MODULES
    cd $NGINX_MODULES
    download_nginx_modules

    # Download the key used to sign NGINX packages and the repository
    mkdir -p $NGINX_ROOT
    sudo chown -Rv _apt:root $NGINX_ROOT
    sudo chmod -Rv 700 $NGINX_ROOT
    cd $NGINX_ROOT

    wget https://nginx.org/keys/nginx_signing.key
    apt-key add nginx_signing.key

# Update sources.list
cat <<-EOF > /etc/apt/sources.list.d/nginx.list
deb [arch=amd64] http://nginx.org/packages/ubuntu/ focal nginx
deb-src http://nginx.org/packages/ubuntu/ focal nginx
EOF

    # Install the NGINX package
    apt-get remove nginx-common
    apt-get update

    # Get the build dependencies and the source code for nginx.
    apt-get build-dep nginx -y
    apt-get source nginx -y


    COMMON_CONFIGURE_ARGS := \
        --prefix=/etc/litegix/nginx \
        --with-cc-opt='-O2 -g -O3 -fPIE -fstack-protector-strong -flto -Wno-error=strict-aliasing -Wformat -Werror=format-security -fPIC -Wdate-time -D_FORTIFY_SOURCE=2' \
        --add-module=$NGINX_MODULES/ngx_devel_kit-0.3.1 \
        --add-module=$NGINX_MODULES/echo-nginx-module-0.62 \
        --add-module=$NGINX_MODULES/xss-nginx-module-0.06 \
        --add-module=$NGINX_MODULES/ngx_coolkit-0.2 \
        --add-module=$NGINX_MODULES/set-misc-nginx-module-0.32 \
        --add-module=$NGINX_MODULES/form-input-nginx-module-0.12 \
        --add-module=$NGINX_MODULES/encrypted-session-nginx-module-0.08 \
        --add-module=$NGINX_MODULES/srcache-nginx-module-0.32 \
        --add-module=$NGINX_MODULES/ngx_lua-0.10.19 \
        --add-module=$NGINX_MODULES/ngx_lua_upstream-0.07 \
        --add-module=$NGINX_MODULES/headers-more-nginx-module-0.33 \
        --add-module=$NGINX_MODULES/array-var-nginx-module-0.05 \
        --add-module=$NGINX_MODULES/memc-nginx-module-0.19 \
        --add-module=$NGINX_MODULES/redis2-nginx-module-0.15 \
        --add-module=$NGINX_MODULES/redis-nginx-module-0.3.7 \
        --add-module=$NGINX_MODULES/rds-json-nginx-module-0.15 \
        --add-module=$NGINX_MODULES/rds-csv-nginx-module-0.09 \
        --add-module=$NGINX_MODULES/ngx_stream_lua-0.0.9 \
        --add-module=$NGINX_MODULES/ngx_brotli-1.0.0rc \
        --add-module=$NGINX_MODULES/ngx_cache_purge-2.3 \
        --add-module=$NGINX_MODULES/ModSecurity-nginx-1.0.2 \
        --with-ld-opt='-Wl,-rpath,/litegix/packages/luajit/lib -Wl,-Bsymbolic-functions -fPIE -pie -Wl,-z,relro -Wl,-z,now -fPIC' \
        --sbin-path=/usr/local/sbin/litegix/nginx \
        --conf-path=/etc/litegix/nginx/nginx.conf \
        --error-log-path=/var/log/litegix/nginx/error.log \
        --http-log-path=/var/log/litegix/nginx/access.log \
        --lock-path=/var/lock/litegix/nginx.lock \
        --pid-path=/var/run/litegix/nginx.pid \
        --group=litegix-www \
        --user=litegix-www \
        --with-openssl=$LITEGIX_PACKAGES/openssl-1.1.1g \
        --with-openssl-opt='-g no-weak-ssl-ciphers no-ssl3 no-shared enable-ec_nistp_64_gcc_128 -DOPENSSL_NO_HEARTBEATS -fstack-protector-strong' --modules-path=$NGINX_MODULES --with-threads \
        --with-http_stub_status_module \
        --with-http_ssl_module \
        --with-http_v2_module \
        --with-stream \
        --with-stream_ssl_module \
        --with-pcre \
        --with-pcre-jit \
        --with-file-aio \
        --with-http_realip_module \
        --with-http_addition_module \
        --with-http_flv_module \
        --with-http_mp4_module \
        --with-http_gunzip_module \
        --with-http_gzip_static_module \
        --with-http_geoip_module \
        --with-http_image_filter_module \
        --with-http_sub_module \
        --with-stream \
        --with-stream_ssl_preread_module \

    cd $NGINX_ROOT/nginx-1.20.1
    dpkg-buildpackage -uc -b
    cd ..

    ###############TODO
    dpkg --install nginx_1.20.1-1~focal_amd64.deb
    apt-mark hold nginx
}

function install_nginx_default {
    apt-get update
    apt-get -qq install nginx > /dev/null
    echo -e "install_nginx_default_complete"
}

function install_openlitespeed {
    grep -Fq  "http://rpms.litespeedtech.com/debian/" /etc/apt/sources.list.d/lst_debian_repo.list
    if [ $? != 0 ] ; then
        echo "deb http://rpms.litespeedtech.com/debian/ $OS_CODE_NAME main"  > /etc/apt/sources.list.d/lst_debian_repo.list
    fi
    wget -O /etc/apt/trusted.gpg.d/lst_debian_repo.gpg http://rpms.litespeedtech.com/debian/lst_debian_repo.gpg
    wget -O /etc/apt/trusted.gpg.d/lst_repo.gpg http://rpms.litespeedtech.com/debian/lst_repo.gpg
    apt-get -y update
    
    OLS_VERSION=1.7.14
    TEMP_DIR="/litegix/tmp"
    mkdir -p $TEMP_DIR
    cd $TEMP_DIR
    wget -O openlitespeed-${OLS_VERSION}.tgz --no-check-certificate https://openlitespeed.org/packages/openlitespeed-${OLS_VERSION}.tgz
    tar -zxvf openlitespeed-${OLS_VERSION}.tgz
    chown -R root.root $TEMP_DIR/openlitespeed
    chmod -R 777 $TEMP_DIR/openlitespeed
    cd $TEMP_DIR/openlitespeed
    bash install.sh

    rm -rf $TEMP_DIR/openlitespeed
    rm -f $TEMP_DIR/openlitespeed-${OLS_VERSION}.tgz
    cp /usr/local/lsws/conf/httpd_config.conf /usr/local/lsws/conf/httpd_config_default.conf

    systemctl start lsws
}

function install_mysql {
    MYSQLDIR="/litegix/mysql"
    rm -rf $MYSQLDIR
    mkdir -p $MYSQLDIR

    ROOTPASS="$(get_random_string 54)"

    # Install MySQL
    echo debconf mysql-server/root_password password $ROOTPASS | debconf-set-selections
    echo debconf mysql-server/root_password_again password $ROOTPASS | debconf-set-selections
    apt-get -qq install mysql-server > /dev/null # Install MySQL quietly

    # Install Expect
    apt-get -qq install expect > /dev/null

    # Build Expect script
    tee $MYSQLDIR/secure_our_mysql.sh > /dev/null << EOF
spawn $(which mysql_secure_installation)

expect "Enter password for user root:"
send "$ROOTPASS\r"

expect "Press y|Y for Yes, any other key for No:"
send "y\r"

expect "Please enter 0 = LOW, 1 = MEDIUM and 2 = STRONG:"
send "0\r"

expect "Change the password for root ? ((Press y|Y for Yes, any other key for No) :"
send "n\r"

expect "Remove anonymous users? (Press y|Y for Yes, any other key for No) :"
send "y\r"

expect "Disallow root login remotely? (Press y|Y for Yes, any other key for No) :"
send "y\r"

expect "Remove test database and access to it? (Press y|Y for Yes, any other key for No) :"
send "y\r"

expect "Reload privilege tables now? (Press y|Y for Yes, any other key for No) :"
send "y\r"
EOF

    # Run Expect script.
    # This runs the "mysql_secure_installation" script which removes insecure defaults.
    expect $MYSQLDIR/secure_our_mysql.sh

    # Cleanup
    rm -v $MYSQLDIR/secure_our_mysql.sh # Remove the generated Expect script
    #apt-get -qq purge expect > /dev/null # Uninstall Expect, commented out in case you need Expect


echo "[client]
user=root
password=$ROOTPASS
" > /etc/mysql/conf.d/root.cnf

    chmod 755 /etc/mysql/conf.d/root.cnf

    echo "MySQL ROOT PASSWORD: $ROOTPASS"
    echo "MySQL setup completed."
}

function install_mariadb {
    ROOTPASS="!$(get_random_string 54)"

    #https://downloads.mariadb.org/mariadb/repositories/#distro=Ubuntu&distro_release=focal--ubuntu_focal&mirror=truenetwork&version=10.6
    apt-get install software-properties-common apt-transport-https -y
    apt-key adv --fetch-keys 'https://mariadb.org/mariadb_release_signing_key.asc'
    add-apt-repository "deb [arch=amd64] https://mirror.truenetwork.ru/mariadb/repo/10.6/ubuntu $OS_CODE_NAME main"
    add-apt-repository "deb [arch=amd64] http://sfo1.mirrors.digitalocean.com/mariadb/repo/10.6/ubuntu $OS_CODE_NAME main"

    sudo apt update
    sudo apt-get -qq install mariadb-server

    # Install Expect
    apt-get -qq install expect > /dev/null

    # Start mariadb
    systemctl start mysql

    CONFIG_MARIADB=$(expect -c "
set timeout 5
spawn mysql_secure_installation

expect \"Enter current password for root (enter for none):\"
send \"\r\"

expect \"Switch to unix_socket authentication\"
send \"y\r\"

expect \"Change the root password?\"
send \"y\r\"

expect \"New password:\"
send \"$ROOTPASS\r\"

expect \"Re-enter new password:\"
send \"$ROOTPASS\r\"

expect \"Remove anonymous users?\"
send \"y\r\"

expect \"Disallow root login remotely?\"
send \"y\r\"

expect \"Remove test database and access to it?\"
send \"y\r\"

expect \"Reload privilege tables now?\"
send \"y\r\"

expect eof
")
    echo "$CONFIG_MARIADB"

echo "[client]
user=root
password=$ROOTPASS
" > /etc/mysql/conf.d/root.cnf

    chmod 755 /etc/mysql/conf.d/root.cnf
}

function install_webapp {
    USER="litegix"
    LITEGIX_PASSWORD=$(get_random_string 64)
    USERGROUP="litegix"
    HOMEDIR="/home/$USER/"
    groupadd $USERGROUP
    adduser --disabled-password --gecos "" $USER
    usermod -a -G $USERGROUP $USER

    echo "$USER:$LITEGIX_PASSWORD" | chpasswd
    chmod 755 /home
    mkdir -p $HOMEDIR/logs/{nginx,apache2,fpm}

    # FACL
    setfacl -m g:$USERGROUP:x /home
    setfacl -Rm g:$USERGROUP:- /home/$USER
    setfacl -Rm g:$USERGROUP:- /etc/mysql
    setfacl -Rm g:$USERGROUP:- /var/log
    setfacl -Rm g:$USER:rx /home/$USER/logs
}

function install_agent {
    echo "install_agent"
    TEMPDIR="/litegix/tmp"
    mkdir -p $TEMPDIR
    cd $TEMPDIR
    wget -O litegix-agent_1.0-1_amd64.deb https://raw.githubusercontent.com/goldencat-tom/litegix-agent-release/main/litegix-agent_1.0-1_amd64.deb
    dpkg -i litegix-agent_1.0-1_amd64.deb

    AGENTDIR="/litegix/litegix-agent"
    cp $AGENTDIR/config.example.json $AGENTDIR/config.json
    sed -i "s/{SERVERID}/$SERVERID/g" $AGENTDIR/config.json
    sed -i "s/{SERVERKEY}/$SERVERKEY/g" $AGENTDIR/config.json
    sed -i "s/{ENVIRONMENT}/$ENVIRONMENT/g" $AGENTDIR/config.json
    sed -i "s/{WEBSERVER}/$WEBSERVER/g" $AGENTDIR/config.json

    chmod 700 $AGENTDIR/inswp.sh
    chmod 600 $AGENTDIR/config.json
    mkdir -p $AGENTDIR/ssl/
    cp /etc/nginx/sites-available/default /litegix/nginx.conf
}

function setup_firewall {
    # Stop iptables
    systemctl stop iptables
    systemctl stop ip6tables
    systemctl mask iptables
    systemctl mask ip6tables


    # remove ufw
    apt-get remove ufw -y
    # Start firewalld
    systemctl enable firewalld
    systemctl start firewalld

    # Add litegix service to firewalld
    echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>
<service>
  <short>Litegix Agent</short>
  <description>Allow your server and Litegix service to communicate to each other.</description>
  <port protocol=\"tcp\" port=\"21000\"/>
</service>" > /etc/firewalld/services/litegix.xml

    echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>
<zone>
  <short>Litegix</short>
  <description>litegix zone to use with Litegix Server</description>
  <service name=\"litegix\"/>
  <service name=\"dhcpv6-client\"/>
  <port protocol=\"tcp\" port=\"22\"/>
  <port protocol=\"tcp\" port=\"80\"/>
  <port protocol=\"tcp\" port=\"443\"/>
</zone>" > /etc/firewalld/zones/litegix.xml

    sleep 3

    firewall-cmd --reload # reload to get litegix
    firewall-cmd --set-default-zone=litegix
    firewall-cmd --reload # reload to enable new config
}

function install_composer {
    ln -sf /usr/bin/$PHP_CLI_VERSION /etc/alternatives/php

    source /etc/profile.d/litegixpath.sh
    wget -4 https://getcomposer.org/installer -O composer-setup.php
    php composer-setup.php
    php -r "unlink('composer-setup.php');"
    mv composer.phar /usr/sbin/composer
}

function register_path {
    echo "#!/bin/sh
export PATH=/litegix/packages/apache2-rc/bin:\$PATH" > /etc/profile.d/litegixpath.sh

    echo fs.inotify.max_user_watches=524288 | tee -a /etc/sysctl.conf && sysctl -p
    echo net.core.somaxconn = 65536 | tee -a /etc/sysctl.conf && sysctl -p
    echo net.ipv4.tcp_max_tw_buckets = 1440000 | tee -a /etc/sysctl.conf && sysctl -p
    echo vm.swappiness=10 | tee -a /etc/sysctl.conf && sysctl -p
    echo vm.vfs_cache_pressure=50 | tee -a /etc/sysctl.conf && sysctl -p
    echo vm.overcommit_memory=1 | tee -a /etc/sysctl.conf && sysctl -p


    /usr/bin/augtool <<EOF
set /files/etc/ssh/sshd_config/UseDNS no
set /files/etc/ssh/sshd_config/PasswordAuthentication yes
set /files/etc/ssh/sshd_config/PermitRootLogin yes
save
EOF
    systemctl restart sshd
}

function system_service {
    systemctl disable supervisord
    systemctl stop supervisord

    systemctl disable redis-server
    systemctl stop redis-server

    systemctl disable beanstalkd
    systemctl stop beanstalkd

    systemctl disable memcached
    systemctl stop memcached

    touch /var/log/litegix.log
    
    systemctl enable fail2ban
    systemctl start fail2ban
    systemctl restart fail2ban

    systemctl enable mysql
    systemctl restart mysql

    systemctl enable nginx
    systemctl start nginx

    systemctl enable litegix-agent
    systemctl start litegix-agent
}

locale-gen en_US en_US.UTF-8

export LANGUAGE=en_US.utf8
export LC_ALL=en_US.utf8
export DEBIAN_FRONTEND=noninteractive

# check already installed services
check_installed_services

# checking port for agent
send_state "start"
#check_port

# Bootstrap the server
# send_state "config"
send_state "update"
bootstrap

# Enabling Swap if Not Enabled
send_state "swap"
enable_swap

# Install The Packages
send_state "packages"
install_packages

# Supervisor
send_state "supervisor"
install_supervisor

# Fail2Ban
send_state "fail2ban"
install_fail2ban

if [[ "$WEBSERVER" == 'nginx' ]]; then
# Nginx
send_state "nginx"
install_nginx_default
#install_nginx
else
# Openlitespeed
send_state "openlitespeed"
install_openlitespeed
fi

if [[ "$DATABASE" == 'mysql' ]]; then
# MySQL
send_state "mysql"
install_mysql
else
# MariaDB
send_state "mariadb"
install_mariadb
fi

# Web Application
send_state "webapp"
install_webapp

# Auto Update
send_state "autoupdate"
fix_auto_update

# Agent
send_state "agent"
install_agent

# Firewall
send_state "firewall"
setup_firewall

# Composer
send_state "composer"
install_composer

# Tweak
send_state "tweak"
register_path

#################################################################
# Systemd Service
send_state "systemd"
system_service

send_state "finish"

## CLEANUP
# This will only run coming from direct installation
if [ -f /tmp/installer.sh ]; then
    rm /tmp/installer.sh
fi
if [ -f /tmp/installation.log ]; then
    rm /tmp/installation.log
fi

echo "
Litegix
- Do not use \"root\" user to create/modify any web app files
- Do not edit any config commented with \"Do not edit\"
" > /etc/motd


# Try register as installed
# Don't attempt to try spam this link. Rate limit in action. 1 query per minute and will be block for a minute
# curl -4 -H "Content-Type: application/json" -X POST https://manage.runcloud.io/webhooks/serverinstallation/firstregistration/KxT0TXo7ABGpH5zxHB3JcKknZe1623833285bNTdK7P7MYEy48xlIdJemQxlqLrtgD6O2SCUtMGy2TiDxyemfVIzZ7rF8xq0QrRb/wjJBIt5dhHfjLqfqeVPkNA0KVAw1EwZgjM5NlVmSJeh1olj2yWBQgEqDSdCbIbg4Ju8yviM4k4dJkgj8jgca5UoX5ag0Qbsjkzsno3BN7ughUIyV0UC1euuaZTzbvAqf 
# systemctl restart litegix-agent

fixHostName=`hostname`
echo 127.0.0.1 $fixHostName | tee -a /etc/hosts

#clear
echo -ne "\n
#################################################
# Finished installation. Do not lose any of the
# data below.
##################################################
\n
\n
\nMySQL ROOT PASSWORD: $ROOTPASS
User: $USER
Password: $LITEGIX_PASSWORD
\n
\n
You can now manage your server using https://litegix.netlify.app
"
