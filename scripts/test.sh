#!/bin/bash
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
fi


function get_random_string {
    head /dev/urandom | tr -dc _A-Za-z0-9 | head -c$1
}
ROOTPASS=$(get_random_string 32)
echo "MySQL ROOT PASSWORD: $ROOTPASS"
