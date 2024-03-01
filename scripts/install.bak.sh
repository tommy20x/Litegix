#!/bin/bash


# Constants
LITEGIX_TOKEN=""
LITEGIX_URL="http://localhost:3600"
INSTALL_STATE_URL="$LITEGIX_URL/api/installation/status$LITEGIX_TOKEN"
INSTALL_PACKAGE="curl git wget expect nano build-essential openssl zip unzip make net-tools bc mariadb-server redis-server python-setuptools perl fail2ban augeas-tools libaugeas0 augeas-lenses firewalld acl memcached beanstalkd passwd unattended-upgrades postfix nodejs jq"

# Initialize
OS_NAME=$(lsb_release -si)
OS_VERSION=$(lsb_release -sr)
OS_CODE_NAME=$(lsb_release -sc)

locale-gen en_US en_US.UTF-8

export LANGUAGE=en_US.utf8
export LC_ALL=en_US.utf8
export DEBIAN_FRONTEND=noninteractive

############################################################
# Helpers
############################################################
function get_rand_string {
  tr -dc A-Za-z0-9 </dev/urandom | head -c 16
}

function send_state {
  state=$1
  curl --ipv4 --header "Content-Type: application/json" -X POST $INSTALL_STATE_URL -d '{"state": "'"$state"'"}'
  sleep 2
}

function throw_error {
  message=$1
  echo $message 1>&2
  curl --ipv4 --header "Content-Type: application/json" -X POST $INSTALL_STATE_URL -d '{"state": "err", "message": "'"$message"'"}' 
  exit 1
}


############################################################
# Checking
############################################################

# Check root user
if [[ $EUID -ne 0 ]]; then
  throw_error "This script must be run as root" 
fi

# Check OS Version
if [[ "$OS_NAME" != "Ubuntu" ]]; then
  throw_error "This script only support Ubuntu"
fi

# Check system architecture
if [[ $(uname -m) != "x86_64" ]]; then
  throw_error "This script only support x86_64 architecture"
fi

# Check OS Version
grep -q $OS_VERSION <<< "16.04 18.04 20.04"
if [[ $? -ne 0 ]]; then
  throw_error "This script does not support $OS_NAME $OS_VERSION"
fi

############################################################################
# Install packages
#############################################################################
send_state "packages"
function install_packages {
  apt-get update
  apt-get remove mysql-common --purge -y
  apt-get install $INSTALLPACKAGE -y
}
install_packages


#############################################################################
# Check port
#############################################################################
send_state "checkport"
function check_port {
    echo -ne "\n\n\nChecking if port 12200 is accessible...\n"

    if [[ "$OS_CODE_NAME" == 'xenial' ]]; then
        timeout 15 bash -c "echo -e 'HTTP/1.1 200 OK\r\n' | nc -l 12200"
    else
        timeout 15 bash -c "echo -e 'HTTP/1.1 200 OK\r\n' | nc -N -l 12200"
    fi
    ncstatus=$?
    if [[ $ncstatus -ne 0 ]]; then
        clear
echo -ne "\n
##################################################
# Unable to connect through port 12200 inside    #
# this server. Please disable firewall for this  #
# port and rerun the installation script again!  #
##################################################
\n\n\n
"
        exit 1
    fi
}
check_port


#############################################################################
# Bootstrap Server
#############################################################################
function bootstrap_server {
    apt-get -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" upgrade -y
}
bootstrap_server


#############################################################################
# Install Supervisor
#############################################################################
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
install_supervisor

#############################################################################
# Fail2Ban
#############################################################################
send_state "fail2ban"
function install_fail2Ban {
    echo "# Litegix API configuration file

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
port = 34210
banaction = iptables
maxretry = 2" > /etc/fail2ban/jail.local
}
install_fail2Ban




################################################################################
# MariaDB
################################################################################
send_state "mariadb"
function install_mariadb {
  mkdir -p /tmp/lens
  curl --ipv4 $LITEGIX_URL/files/lenses/augeas-mysql.aug --create-dirs -o /tmp/lens/mysql.aug 

  ROOTPASS=$(get_rand_string)

  # Start mariadb untuk initialize
  systemctl start mysql

  SECURE_MYSQL=$(expect -c "
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
    echo "$SECURE_MYSQL"


#     /usr/bin/augtool -I /tmp/lens/ <<EOF
# set /files/etc/mysql/my.cnf/target[ . = "client" ]/user root
# set /files/etc/mysql/my.cnf/target[ . = "client" ]/password $ROOTPASS
# save
# EOF

/usr/bin/augtool -I /tmp/lens/ <<EOF
set /files/etc/mysql/my.cnf/target[ . = "client" ]/user root
set /files/etc/mysql/my.cnf/target[ . = "client" ]/password $ROOTPASS
set /files/etc/mysql/my.cnf/target[ . = "mysqld" ]/bind-address 0.0.0.0
set /files/etc/mysql/conf.d/mariadb.cnf/target[ . = "mysqld" ]/innodb_file_per_table 1
set /files/etc/mysql/conf.d/mariadb.cnf/target[ . = "mysqld" ]/max_connections 15554
set /files/etc/mysql/conf.d/mariadb.cnf/target[ . = "mysqld" ]/query_cache_size 80M
set /files/etc/mysql/conf.d/mariadb.cnf/target[ . = "mysqld" ]/query_cache_type 1
set /files/etc/mysql/conf.d/mariadb.cnf/target[ . = "mysqld" ]/query_cache_limit 2M
set /files/etc/mysql/conf.d/mariadb.cnf/target[ . = "mysqld" ]/query_cache_min_res_unit 2k
set /files/etc/mysql/conf.d/mariadb.cnf/target[ . = "mysqld" ]/thread_cache_size 60
save
EOF

echo "[client]
user=root
password=$ROOTPASS
" > /etc/mysql/conf.d/root.cnf

    chmod 600 /etc/mysql/conf.d/root.cnf
}
install_mariadb


################################################################################
# Web Application
################################################################################
function install_web_app {
    USER="litegix"
    USER_PASSWORD=$(get_rand_string)
    HOMEDIR="/home/$USER/"
    groupadd litegix
    adduser --disabled-password --gecos "" $USER
    usermod -a -G litegix $USER

    echo "$USER:$USER_PASSWORD" | chpasswd
    chmod 755 /home
    mkdir -p $HOMEDIR/logs/{nginx,apache2,fpm}

    # FACL
    setfacl -m g:litegix:x /home
    setfacl -Rm g:litegix:- /home/$USER
    setfacl -Rm g:litegix:- /etc/mysql
    setfacl -Rm g:litegix:- /var/log
    setfacl -Rm g:$USER:rx /home/$USER/logs


    mkdir -p /opt/litegix/{.ssh,letsencrypt}

#     echo "-----BEGIN DH PARAMETERS-----
# MIICCAKCAgEAzZmGWVJjBWNtfh1Q4MrxFJ5uwTM6xkllSewPOdMq5BYmXOFAhYMr
# vhbig5AJHDexbl/VFp64S6JaokQRbTtiibBfHV92LCK9hVRJ2eB7Wlg6t5+YYjKc
# QiNxQ/uvSG3eqmAAr39V3oUWxeyCj/b1WdUVkDuKdJyHevDgfaoyFl7JHymxwvrn
# HR9/x7lH5o2Uhl60uYaZxlhzbbrqMU/ygx9JCj6trL5C5pv9hpH+2uJdvkp/2NJj
# BJCwiHmLMlfqXA3H8/T7L0vn/QLk1JUmqQeGdvZFqEmCe//LAT8llGofawtOUUwT
# v65K1Ovagt7R9iu+nOFIh6XPsLVLemq2HFy+amk+Ti4UZ+EJxvO+s84LxSvAqjsk
# clEE2v+AlIbe8Hjo6YzubXtqSrFLD049kxocPdQXqbDbvlI6br1UjYgWl08upKSZ
# fIwCFFsqwE4y7zRg1VY7MKc0z6MCBU7om/gI4xlPSSBxAP1fN9hv6MbSV/LEvWxs
# pFyShqTqefToDKiegPpqBs8LAsOtuH78eSm18SgKYpVPL1ph0VhhbphbsmKxmqaU
# +EP6bSOc2tTwCMPWySQslHN4TdbsiQJE/gJuVeaCLM1+u4sd0rU9NQblThPuOILp
# v03VfaTd1dUF1HmcqJSl/DYeeBVYjT8GtAKWI5JrvCKDIPvOB98xMysCAQI=
# -----END DH PARAMETERS-----" > /etc/nginx/dhparam.pem
}
install_web_app



################################################################################
# Web Application
################################################################################
function auto_update() {
    AUTOUPDATEFILE50="/etc/apt/apt.conf.d/50unattended-upgrades"
    AUTOUPDATEFILE20="/etc/apt/apt.conf.d/20auto-upgrades"

    sed -i 's/Unattended-Upgrade::Allowed-Origins {/Unattended-Upgrade::Allowed-Origins {\n        "Litegix:${distro_codename}";/g' $AUTOUPDATEFILE50
    ReplaceTrueWholeLine "\"\${distro_id}:\${distro_codename}-security\";" "        \"\${distro_id}:\${distro_codename}-security\";" $AUTOUPDATEFILE50
    ReplaceTrueWholeLine "\/\/Unattended-Upgrade::AutoFixInterruptedDpkg" "Unattended-Upgrade::AutoFixInterruptedDpkg \"true\";" $AUTOUPDATEFILE50
    ReplaceTrueWholeLine "\/\/Unattended-Upgrade::Remove-Unused-Dependencies" "Unattended-Upgrade::Remove-Unused-Dependencies \"true\";" $AUTOUPDATEFILE50

    echo -ne "\n\n
    Dpkg::Options {
       \"--force-confdef\";
       \"--force-confold\";
    }" >> $AUTOUPDATEFILE50

    echo "APT::Periodic::Update-Package-Lists \"1\";" > $AUTOUPDATEFILE20
    echo "APT::Periodic::Unattended-Upgrade \"1\";" >> $AUTOUPDATEFILE20
}
auto_update


function install_firewall {
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
  <port protocol=\"tcp\" port=\"34210\"/>
</service>" > /etc/firewalld/services/lgsa.xml

    echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>
<zone>
  <short>Litegix</short>
  <description>Default zone to use with Litegix Server</description>
  <service name=\"lgsa\"/>
  <service name=\"dhcpv6-client\"/>
  <port protocol=\"tcp\" port=\"22\"/>
  <port protocol=\"tcp\" port=\"80\"/>
  <port protocol=\"tcp\" port=\"443\"/>
</zone>" > /etc/firewalld/zones/litegix.xml

    sleep 3

    firewall-cmd --reload # reload to get rcsa
    firewall-cmd --set-default-zone=litegix
    firewall-cmd --reload # reload to enable new config
}


function install_composer {
    ln -s /litegix/packages/$PHPCLIVERSION/bin/php /usr/bin/php

    source /etc/profile.d/litegixpath.sh
    # php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    wget -4 https://getcomposer.org/installer -O composer-setup.php
    php composer-setup.php
    php -r "unlink('composer-setup.php');"
    mv composer.phar /usr/sbin/composer
}



function register_Path {
    echo "#!/bin/sh
export PATH=/litegix/packages/apache2/bin:\$PATH" > /etc/profile.d/litegixpath.sh

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


function start_system_services {
    systemctl disable supervisord
    systemctl stop supervisord

    systemctl disable redis-server
    systemctl stop redis-server

    systemctl disable memcached
    systemctl stop memcached

    systemctl disable beanstalkd
    systemctl stop beanstalkd

    systemctl enable fail2ban
    systemctl start fail2ban
    systemctl restart fail2ban

    #systemctl enable mysql
    #systemctl restart mysql
}



## CLEANUP
# This will only run coming from direct installation
if [ -f /tmp/installer.sh ]; then
    rm /tmp/installer.sh
fi
if [ -f /tmp/installation.log ]; then
    rm /tmp/installation.log
fi

############################# MOTD ##################################

echo "
Litegix
- Do not use \"root\" user to create/modify any web app files
- Do not edit any config commented with \"Do not edit\"
" > /etc/motd


############################# Register ##################################
# Try register as installed
# Don't attempt to try spam this link. Rate limit in action. 1 query per minute and will be block for a minute
send_state "completed"
systemctl restart litegix-agent

############################# FIX HOSTNAME ##################################

fixHostName=`hostname`
echo 127.0.0.1 $fixHostName | tee -a /etc/hosts

###################################### INSTALL SUMMARY #####################################
clear
echo -ne "\n
#################################################
# Finished installation. Do not lose any of the
# data below.
##################################################
\n
\n
\nMySQL ROOT PASSWORD: $ROOTPASS
User: $USER
Password: $USER_PASSWORD
\n
\n
"
