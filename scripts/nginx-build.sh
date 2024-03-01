#!/bin/bash

function download_nginx_modules {
    echo -e "download nginx modules..."
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

    modname="lua-nginx-module-0.10.19.tar.gz"
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

    modname="ngx_cache_purge-2.3.tar.gz"
    wget -q -O $modname https://github.com/FRiCKLE/ngx_cache_purge/archive/refs/tags/2.3.tar.gz
    tar -xzf $modname
    rm $modname

    # modname="ModSecurity-nginx-1.0.2.tar.gz"
    # wget -q -O $modname https://github.com/SpiderLabs/ModSecurity-nginx/archive/refs/tags/v1.0.2.tar.gz
    # tar -xzf $modname
    # rm $modname

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

    modname="ngx_brotli-1.0.0rc.tar.gz"
    wget -q -O $modname https://github.com/google/ngx_brotli/archive/refs/tags/v1.0.0rc.tar.gz
    tar -xzf $modname
    rm $modname

    cd /litegix/nginx/modules
    git clone --depth 1 -b v3/master --single-branch https://github.com/SpiderLabs/ModSecurity
    cd ModSecurity/
    git submodule init
    git submodule update
    ./build.sh && ./configure && make -j 6 && make install

    cd /litegix/nginx/modules
    git clone --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx.git
}

#https://dev.to/armanism24/how-to-build-nginx-from-source-code-on-ubuntu-20-04-31e5
apt-get install build-essential libpcre3 libpcre3-dev zlib1g zlib1g-dev libssl-dev libgd-dev libxml2 libxml2-dev uuid-dev autoconf automake libtool libcurl4 libcurl4-openssl-dev liblua5.3-dev libfuzzy-dev ssdeep gettext pkg-config libgeoip-dev libyajl-dev doxygen -y

LITEGIX_PACKAGES="/litegix/packages"
rm -rf $LITEGIX_PACKAGES
mkdir -p $LITEGIX_PACKAGES
cd $LITEGIX_PACKAGES

modname="openssl-1.1.1g.tar.gz"
wget http://www.openssl.org/source/$modname
tar -xzf $modname
rm $modname

# modname="luajit2-2.1-20210510.tar.gz"
# wget -q -O $modname https://github.com/openresty/luajit2/archive/refs/tags/v2.1-20210510.tar.gz
# tar -xzf $modname
# rm $modname
# cd luajit2-2.1-20210510
# make install PREFIX=/usr/local/LuaJIT

# LUAJIT_INC=/usr/local/LuaJIT/include/luajit-2.1
# LUAJIT_LIB=/usr/local/LuaJIT/lib

NGINX_ROOT="/litegix/nginx"
NGINX_MODULES="$NGINX_ROOT/modules"

# Download 3rd Part Modules
rm -rf $NGINX_ROOT
mkdir -p $NGINX_MODULES
cd $NGINX_MODULES
download_nginx_modules

cd $NGINX_ROOT
wget http://nginx.org/download/nginx-1.20.0.tar.gz
tar -zxvf nginx-1.20.0.tar.gz
cd nginx-1.20.0
#./configure --prefix=/var/www/html --sbin-path=/usr/sbin/nginx --conf-path=/etc/nginx/nginx.conf --http-log-path=/var/log/nginx/access.log --error-log-path=/var/log/nginx/error.log --with-pcre  --lock-path=/var/lock/nginx.lock --pid-path=/var/run/nginx.pid --with-http_ssl_module --with-http_image_filter_module=dynamic --modules-path=/etc/nginx/modules --with-http_v2_module --with-stream=dynamic --with-http_addition_module --with-http_mp4_module
./configure --prefix=/etc/litegix/nginx \
  --with-cc-opt='-O2 -g -O3 -fPIE -fstack-protector-strong -flto -Wno-error=strict-aliasing -Wformat -Werror=format-security -fPIC -Wdate-time -D_FORTIFY_SOURCE=2' \
  --with-compat \
  --add-module=$NGINX_MODULES/ngx_devel_kit-0.3.1 \
  --add-module=$NGINX_MODULES/echo-nginx-module-0.62 \
  --add-module=$NGINX_MODULES/xss-nginx-module-0.06 \
  --add-module=$NGINX_MODULES/ngx_coolkit-0.2 \
  --add-module=$NGINX_MODULES/set-misc-nginx-module-0.32 \
  --add-module=$NGINX_MODULES/form-input-nginx-module-0.12 \
  --add-module=$NGINX_MODULES/encrypted-session-nginx-module-0.08 \
  --add-module=$NGINX_MODULES/srcache-nginx-module-0.32 \
  --add-module=$NGINX_MODULES/headers-more-nginx-module-0.33 \
  --add-module=$NGINX_MODULES/array-var-nginx-module-0.05 \
  --add-module=$NGINX_MODULES/memc-nginx-module-0.19 \
  --add-module=$NGINX_MODULES/redis2-nginx-module-0.15 \
  --add-module=$NGINX_MODULES/redis-nginx-module-0.3.7 \
  --add-module=$NGINX_MODULES/rds-json-nginx-module-0.15 \
  --add-module=$NGINX_MODULES/rds-csv-nginx-module-0.09 \
  --add-module=$NGINX_MODULES/ngx_cache_purge-2.3 \
  --add-module=$NGINX_MODULES/ngx_brotli-1.0.0rc \
  --add-module=$NGINX_MODULES/ModSecurity-nginx \
  --with-ld-opt='-Wl,-rpath,/usr/local/LuaJIT/lib -Wl,-Bsymbolic-functions -fPIE -pie -Wl,-z,relro -Wl,-z,now -fPIC' \
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
  
make 
make install

